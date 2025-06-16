import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export interface AuthSession {
  userId: string;
  role: string;
  email?: string;
  sessionClaims?: any;
}

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<string, number> = {
  admin: 5,
  org_admin: 4,
  manager: 3,
  consultant: 2,
  viewer: 1,
};

// Check if a user role has permission based on hierarchy
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 999;
  return userLevel >= requiredLevel;
}

// Main authentication middleware
export async function requireAuth(
  request: NextRequest,
  options?: {
    requiredRole?: string;
    allowedRoles?: string[];
  }
): Promise<AuthSession> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      throw new Error("Unauthorized: No active session");
    }

    // Extract role from JWT (handle both V1 and V2 formats)
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"];
    const userRole = (
      // JWT V2 format
      sessionClaims?.metadata?.default_role ||
      sessionClaims?.metadata?.role ||
      // JWT V1 format
      hasuraClaims?.["x-hasura-default-role"] ||
      hasuraClaims?.["x-hasura-role"] ||
      // Fallback
      sessionClaims?.role
    ) as string;
    
    // Debug logging for role extraction
    console.log("🔍 Auth Debug (V1/V2 compatible):", {
      userId: userId?.substring(0, 8) + "...",
      jwtVersion: hasuraClaims ? "v1" : (sessionClaims?.metadata ? "v2" : "unknown"),
      hasMetadata: !!sessionClaims?.metadata,
      hasHasuraClaims: !!hasuraClaims,
      v2DefaultRole: sessionClaims?.metadata?.default_role,
      v1DefaultRole: hasuraClaims?.["x-hasura-default-role"],
      v1Role: hasuraClaims?.["x-hasura-role"],
      finalUserRole: userRole,
      sessionId: sessionClaims?.sid,
    });
    const userEmail = sessionClaims?.email as string;

    if (!userRole) {
      throw new Error("Unauthorized: No role assigned");
    }

    // Check role requirements
    if (options?.requiredRole) {
      if (!hasPermission(userRole, options.requiredRole)) {
        throw new Error(
          `Forbidden: Role '${userRole}' does not have permission. Required: '${options.requiredRole}'`
        );
      }
    }

    if (options?.allowedRoles && !options.allowedRoles.includes(userRole)) {
      throw new Error(
        `Forbidden: Role '${userRole}' is not allowed. Allowed roles: ${options.allowedRoles.join(
          ", "
        )}`
      );
    }

    return {
      userId,
      role: userRole,
      email: userEmail,
      sessionClaims,
    };
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    throw error;
  }
}

// Helper to create unauthorized response
export function unauthorizedResponse(
  message: string = "Unauthorized"
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      code: "UNAUTHORIZED",
    },
    { status: 401 }
  );
}

// Helper to create forbidden response
export function forbiddenResponse(message: string = "Forbidden"): NextResponse {
  return NextResponse.json(
    {
      error: message,
      code: "FORBIDDEN",
    },
    { status: 403 }
  );
}

// Wrapper for API routes that require authentication
export function withAuth(
  handler: (
    request: NextRequest,
    session: AuthSession
  ) => Promise<NextResponse>,
  options?: {
    requiredRole?: string;
    allowedRoles?: string[];
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    console.log("🔐 withAuth called for:", request.method, request.url);
    try {
      const session = await requireAuth(request, options);
      console.log("✅ Auth successful, calling handler");
      return await handler(request, session);
    } catch (error: any) {
      console.log("❌ Auth failed:", error.message);
      if (error.message.includes("Unauthorized")) {
        return unauthorizedResponse(error.message);
      }
      if (error.message.includes("Forbidden")) {
        return forbiddenResponse(error.message);
      }
      // Generic error
      return NextResponse.json(
        {
          error: "Internal server error",
          message: error.message,
        },
        { status: 500 }
      );
    }
  };
}

// Validate webhook signatures for secure webhook endpoints
export async function validateWebhookSignature(
  request: NextRequest,
  secret: string
): Promise<boolean> {
  try {
    const signature = request.headers.get("x-webhook-signature");
    if (!signature) {
      return false;
    }

    const payload = await request.text();
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return signature === expectedSignature;
  } catch (error) {
    console.error("Webhook signature validation error:", error);
    return false;
  }
}

// Validate cron job requests
export function validateCronRequest(request: NextRequest): boolean {
  const cronSecret = request.headers.get("x-cron-secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    console.error("CRON_SECRET not configured");
    return false;
  }

  return cronSecret === expectedSecret;
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || userLimit.resetTime < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute

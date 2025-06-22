import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { rateLimiter } from "../middleware/rate-limiter";
import {
  logUnauthorizedAccess,
  extractClientInfo,
} from "../security/auth-audit";
import { monitorRequest } from "../security/enhanced-route-monitor";
// Import comprehensive permission system
import { Role, ROLE_HIERARCHY } from "./permissions";

/**
 * Represents an authenticated user session with role and permission information
 */
export interface AuthSession {
  /** Unique identifier for the authenticated user */
  userId: string;
  /** User's role in the system (e.g., 'admin', 'manager', 'consultant') */
  role: string;
  /** User's email address (optional) */
  email?: string;
  /** Raw session claims from the JWT token */
  sessionClaims?: any;
}

/**
 * Checks if a user role has permission to access a required role level
 * Uses the role hierarchy system where higher numbers indicate more permissions
 *
 * @param userRole - The user's current role
 * @param requiredRole - The minimum role required for access
 * @returns True if the user has sufficient permissions
 *
 * @example
 * ```typescript
 * hasPermission('admin', 'manager') // true (admin > manager)
 * hasPermission('viewer', 'admin') // false (viewer < admin)
 * ```
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as Role] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole as Role] || 999;
  return userLevel >= requiredLevel;
}

/**
 * Main authentication middleware that validates user sessions and role permissions
 * Supports both JWT v1 and v2 token formats from Clerk
 *
 * @param request - The incoming NextRequest object
 * @param options - Authentication options
 * @param options.requiredRole - Minimum role required (uses hierarchy)
 * @param options.allowedRoles - Specific roles that are allowed (exact match)
 * @returns Promise resolving to authenticated user session
 * @throws Error if authentication fails or insufficient permissions
 *
 * @example
 * ```typescript
 * // Require minimum manager role
 * const session = await requireAuth(request, { requiredRole: 'manager' });
 *
 * // Allow only specific roles
 * const session = await requireAuth(request, { allowedRoles: ['admin', 'developer'] });
 * ```
 */
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
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = // JWT V1 format - ACTUAL ROLE FIRST
      (hasuraClaims?.["x-hasura-role"] ||
        // JWT V2 format - ACTUAL ROLE FIRST
        (sessionClaims?.metadata as any)?.role ||
        // Fallback to default role only if no actual role found
        hasuraClaims?.["x-hasura-default-role"] ||
        (sessionClaims?.metadata as any)?.defaultrole ||
        (sessionClaims as any)?.role) as string;

    // Debug logging for role extraction
    console.log("🔍 Auth Debug (V1/V2 compatible):", {
      userId: `${userId?.substring(0, 8)}...`,
      jwtVersion: hasuraClaims
        ? "v1"
        : sessionClaims?.metadata
          ? "v2"
          : "unknown",
      hasMetadata: !!sessionClaims?.metadata,
      hasHasuraClaims: !!hasuraClaims,
      v2DefaultRole: (sessionClaims?.metadata as any)?.defaultrole,
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

/**
 * Creates a standardized 401 Unauthorized response
 *
 * @param message - Custom error message (defaults to "Unauthorized")
 * @returns NextResponse with 401 status and error details
 */
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

/**
 * Creates a standardized 403 Forbidden response
 *
 * @param message - Custom error message (defaults to "Forbidden")
 * @returns NextResponse with 403 status and error details
 */
export function forbiddenResponse(message: string = "Forbidden"): NextResponse {
  return NextResponse.json(
    {
      error: message,
      code: "FORBIDDEN",
    },
    { status: 403 }
  );
}

/**
 * Higher-order function that wraps API route handlers with authentication, authorization,
 * rate limiting, and audit logging capabilities
 *
 * @param handler - The API route handler function to wrap
 * @param options - Authentication and security options
 * @param options.requiredRole - Minimum role required (uses hierarchy)
 * @param options.allowedRoles - Specific roles allowed (exact match)
 * @param options.skipRateLimit - Whether to skip rate limiting for this route
 * @returns Wrapped API route handler with security features
 *
 * @example
 * ```typescript
 * // Protect route requiring manager role or higher
 * export const POST = withAuth(async (request, session) => {
 *   // Handler logic here
 *   return NextResponse.json({ success: true });
 * }, {
 *   requiredRole: 'manager'
 * });
 *
 * // Protect route for specific roles only
 * export const GET = withAuth(async (request, session) => {
 *   // Handler logic here
 *   return NextResponse.json({ data: [] });
 * }, {
 *   allowedRoles: ['admin', 'developer']
 * });
 * ```
 */
export function withAuth(
  handler: (
    request: NextRequest,
    session: AuthSession
  ) => Promise<NextResponse>,
  options?: {
    requiredRole?: string;
    allowedRoles?: string[];
    skipRateLimit?: boolean;
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    console.log("🔐 withAuth called for:", request.method, request.url);

    try {
      // Apply rate limiting first (before auth to prevent auth bypass attempts)
      if (!options?.skipRateLimit) {
        const rateLimitResponse = await rateLimiter.applyRateLimit(request);
        if (rateLimitResponse) {
          console.log("⚡ Rate limit exceeded for:", request.url);
          await monitorRequest(request, undefined, startTime, false);
          return rateLimitResponse;
        }
      }

      const session = await requireAuth(request, options);
      console.log("✅ Auth successful, calling handler");

      // Apply user-specific rate limiting after auth
      if (!options?.skipRateLimit) {
        const userRateLimitResponse = await rateLimiter.applyRateLimit(
          request,
          session.userId
        );
        if (userRateLimitResponse) {
          console.log(
            "⚡ User rate limit exceeded for:",
            session.userId,
            request.url
          );
          await monitorRequest(request, session.userId, startTime, false);
          return userRateLimitResponse;
        }
      }

      const response = await handler(request, session);

      // Add rate limit headers to successful responses
      if (!options?.skipRateLimit) {
        const rateLimitResult = await rateLimiter.checkRateLimit(
          request,
          session.userId
        );
        rateLimiter.addRateLimitHeaders(response, rateLimitResult);
      }

      // Monitor successful request
      await monitorRequest(request, session.userId, startTime, true);

      return response;
    } catch (error: any) {
      console.log("❌ Auth failed:", error.message);

      // Extract client info for audit logging
      const { ipAddress, userAgent } = extractClientInfo(request);

      // Monitor failed request
      await monitorRequest(request, undefined, startTime, false);

      if (error.message.includes("Unauthorized")) {
        // Log unauthorized access attempt
        await logUnauthorizedAccess(
          request.nextUrl.pathname,
          undefined,
          undefined,
          ipAddress,
          userAgent,
          request,
          {
            requiredRole: options?.requiredRole,
            allowedRoles: options?.allowedRoles,
            errorMessage: error.message,
            endpoint: request.nextUrl.pathname,
            method: request.method,
          }
        );
        return unauthorizedResponse(error.message);
      }
      if (error.message.includes("Forbidden")) {
        // Log forbidden access attempt
        await logUnauthorizedAccess(
          request.nextUrl.pathname,
          undefined,
          undefined,
          ipAddress,
          userAgent,
          request,
          {
            requiredRole: options?.requiredRole,
            allowedRoles: options?.allowedRoles,
            errorMessage: error.message,
            endpoint: request.nextUrl.pathname,
            method: request.method,
            accessType: "insufficient_permissions",
          }
        );
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

// Wrapper for dynamic API routes with params that require authentication
export function withAuthParams<T = any>(
  handler: (
    request: NextRequest,
    context: { params: Promise<T> },
    session: AuthSession
  ) => Promise<NextResponse>,
  options?: {
    requiredRole?: string;
    allowedRoles?: string[];
    skipRateLimit?: boolean;
  }
) {
  return async (
    request: NextRequest,
    context: { params: Promise<T> }
  ): Promise<NextResponse> => {
    const startTime = Date.now();
    console.log("🔐 withAuthParams called for:", request.method, request.url);

    try {
      // Apply rate limiting first (before auth to prevent auth bypass attempts)
      if (!options?.skipRateLimit) {
        const rateLimitResponse = await rateLimiter.applyRateLimit(request);
        if (rateLimitResponse) {
          console.log("⚡ Rate limit exceeded for:", request.url);
          await monitorRequest(request, undefined, startTime, false);
          return rateLimitResponse;
        }
      }

      const session = await requireAuth(request, options);
      console.log("✅ Auth successful, calling handler");

      // Apply user-specific rate limiting after auth
      if (!options?.skipRateLimit) {
        const userRateLimitResponse = await rateLimiter.applyRateLimit(
          request,
          session.userId
        );
        if (userRateLimitResponse) {
          console.log(
            "⚡ User rate limit exceeded for:",
            session.userId,
            request.url
          );
          await monitorRequest(request, session.userId, startTime, false);
          return userRateLimitResponse;
        }
      }

      const response = await handler(request, context, session);

      // Add rate limit headers to successful responses
      if (!options?.skipRateLimit) {
        const rateLimitResult = await rateLimiter.checkRateLimit(
          request,
          session.userId
        );
        rateLimiter.addRateLimitHeaders(response, rateLimitResult);
      }

      // Monitor successful request
      await monitorRequest(request, session.userId, startTime, true);

      return response;
    } catch (error: any) {
      console.log("❌ Auth failed:", error.message);

      // Extract client info for audit logging
      const { ipAddress, userAgent } = extractClientInfo(request);

      // Monitor failed request
      await monitorRequest(request, undefined, startTime, false);

      if (error.message.includes("Unauthorized")) {
        // Log unauthorized access attempt
        await logUnauthorizedAccess(
          request.nextUrl.pathname,
          undefined,
          undefined,
          ipAddress,
          userAgent,
          request,
          {
            requiredRole: options?.requiredRole,
            allowedRoles: options?.allowedRoles,
            errorMessage: error.message,
            endpoint: request.nextUrl.pathname,
            method: request.method,
          }
        );
        return unauthorizedResponse(error.message);
      }
      if (error.message.includes("Forbidden")) {
        // Log forbidden access attempt
        await logUnauthorizedAccess(
          request.nextUrl.pathname,
          undefined,
          undefined,
          ipAddress,
          userAgent,
          request,
          {
            requiredRole: options?.requiredRole,
            allowedRoles: options?.allowedRoles,
            errorMessage: error.message,
            endpoint: request.nextUrl.pathname,
            method: request.method,
            accessType: "insufficient_permissions",
          }
        );
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
  const keysToDelete: string[] = [];

  rateLimitMap.forEach((value, key) => {
    if (value.resetTime < now) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => rateLimitMap.delete(key));
}, 60000); // Clean up every minute

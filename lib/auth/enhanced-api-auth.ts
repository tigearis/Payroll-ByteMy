// lib/auth/enhanced-api-auth.ts
import { auth as clerkAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { NativePermissionChecker } from "./native-permission-checker";
import { MetadataManager } from "./metadata-manager.server";
import { RateLimiter } from "@/lib/middleware/rate-limiter";
import { logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging";
import { CustomPermission, Role } from "@/types/permissions";

export interface EnhancedApiAuthOptions {
  permission?: CustomPermission;
  anyPermissions?: CustomPermission[];
  allPermissions?: CustomPermission[];
  minimumRole?: Role;
  allowSelf?: boolean; // Allow access to own resources
  skipAuth?: boolean; // For public endpoints
  rateLimiting?: {
    requests: number;
    windowMs: number;
  };
}

export interface AuthContext {
  userId: string;
  sessionClaims: any; // Kept as 'any' for flexibility with Clerk's dynamic claims
  userRole: Role;
  hasPermission: (permission: CustomPermission) => Promise<boolean>;
  hasMinimumRole: (role: Role) => Promise<boolean>;
  canAccessResource: (
    resourceType: "payroll" | "client",
    resourceId: string
  ) => Promise<boolean>;
}

export function withEnhancedAuth<T extends any[]>(
  handler: (
    request: NextRequest,
    context: AuthContext,
    ...args: T
  ) => Promise<NextResponse>,
  options: EnhancedApiAuthOptions = {}
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now();

    try {
      // Skip authentication for public endpoints
      if (options.skipAuth) {
        const publicContext: AuthContext = {
          userId: "public_user",
          sessionClaims: null,
          userRole: "viewer" as Role, // Assign a default safe role
          hasPermission: async () => false,
          hasMinimumRole: async () => false,
          canAccessResource: async () => false,
        };
        return handler(request, publicContext, ...args);
      }

      // Get auth context from Clerk
      const auth = await clerkAuth();

      if (!auth.userId) {
        return NextResponse.json(
          { error: "Authentication required", code: "AUTH_REQUIRED" },
          { status: 401 }
        );
      }

      // Extract user role from session claims
      const userRole = MetadataManager.extractUserRole(
        auth.sessionClaims
      ) as Role;

      // Rate limiting check (if configured)
      if (options.rateLimiting) {
        const rateLimiter = RateLimiter.getInstance();
        const rateLimitResult = await rateLimiter.checkRateLimit(
          request,
          auth.userId,
          {
            requests: options.rateLimiting.requests,
            window: options.rateLimiting.windowMs,
          }
        );
        if (!rateLimitResult.success) {
          return NextResponse.json(
            {
              error: "Rate limit exceeded",
              code: "RATE_LIMIT_EXCEEDED",
              retryAfter: rateLimitResult.retryAfter,
            },
            { status: 429 }
          );
        }
      }

      // Self-access check for user-specific endpoints
      if (options.allowSelf) {
        const targetUserId = extractTargetUserId(request, args);
        if (targetUserId === auth.userId) {
          // Create context for self-access
          const selfContext: AuthContext = {
            userId: auth.userId,
            sessionClaims: auth.sessionClaims,
            userRole,
            hasPermission: (permission: CustomPermission) =>
              NativePermissionChecker.hasPermission(permission),
            hasMinimumRole: (role: Role) =>
              NativePermissionChecker.hasMinimumRole(role),
            canAccessResource: (
              resourceType: "payroll" | "client",
              resourceId: string
            ) =>
              NativePermissionChecker.canAccessResource(
                resourceType,
                resourceId
              ),
          };

          // Log self-access for audit
          await logApiAccess(auth.userId, request.url, userRole, "self_access");

          return handler(request, selfContext, ...args);
        }
      }

      // Permission checks using Clerk's native API
      if (
        options.permission &&
        !(await NativePermissionChecker.hasPermission(options.permission))
      ) {
        await logAuthorizationFailure(auth.userId, request.url, userRole, [
          options.permission,
        ]);
        return NextResponse.json(
          {
            error: `Missing required permission: ${options.permission}`,
            code: "INSUFFICIENT_PERMISSIONS",
            required: options.permission,
          },
          { status: 403 }
        );
      }

      // Check if user has ALL of multiple permissions
      if (
        options.allPermissions &&
        !(await NativePermissionChecker.hasAllPermissions(
          options.allPermissions
        ))
      ) {
        const missingPermissions = [];
        for (const permission of options.allPermissions) {
          if (!(await NativePermissionChecker.hasPermission(permission))) {
            missingPermissions.push(permission);
          }
        }

        await logAuthorizationFailure(
          auth.userId,
          request.url,
          userRole,
          missingPermissions as CustomPermission[]
        );
        return NextResponse.json(
          {
            error: `Missing required permissions: ${missingPermissions.join(
              ", "
            )}`,
            code: "INSUFFICIENT_PERMISSIONS",
            required: options.allPermissions,
            missing: missingPermissions,
          },
          { status: 403 }
        );
      }

      // Check if user has ANY of multiple permissions
      if (
        options.anyPermissions &&
        !(await NativePermissionChecker.hasAnyPermissions(
          options.anyPermissions
        ))
      ) {
        await logAuthorizationFailure(
          auth.userId,
          request.url,
          userRole,
          options.anyPermissions
        );
        return NextResponse.json(
          {
            error: `Missing any of required permissions: ${options.anyPermissions.join(
              ", "
            )}`,
            code: "INSUFFICIENT_PERMISSIONS",
            required: options.anyPermissions,
          },
          { status: 403 }
        );
      }

      // Check minimum role level
      if (
        options.minimumRole &&
        !(await NativePermissionChecker.hasMinimumRole(options.minimumRole))
      ) {
        await logAuthorizationFailure(
          auth.userId,
          request.url,
          userRole,
          [],
          options.minimumRole
        );
        return NextResponse.json(
          {
            error: `Requires ${options.minimumRole} role or higher`,
            code: "INSUFFICIENT_ROLE",
            currentRole: userRole,
            minimumRole: options.minimumRole,
          },
          { status: 403 }
        );
      }

      // Create enhanced context for handler
      const context: AuthContext = {
        userId: auth.userId,
        sessionClaims: auth.sessionClaims,
        userRole,
        hasPermission: (permission: CustomPermission) =>
          NativePermissionChecker.hasPermission(permission),
        hasMinimumRole: (role: Role) =>
          NativePermissionChecker.hasMinimumRole(role),
        canAccessResource: (
          resourceType: "payroll" | "client",
          resourceId: string
        ) =>
          NativePermissionChecker.canAccessResource(resourceType, resourceId),
      };

      // Log successful API access for audit
      await logApiAccess(auth.userId, request.url, userRole, "authorized");

      // Execute handler with enhanced context
      const result = await handler(request, context, ...args);

      // Log performance for slow requests
      const duration = Date.now() - startTime;
      if (duration > 1000) {
        console.warn(`🐌 Slow API request: ${request.url} took ${duration}ms`);
      }

      return result;
    } catch (error) {
      // Log error and return appropriate response
      await logAuthError(request.url, error);
      return NextResponse.json(
        {
          error: "Internal server error",
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  };
}

// Helper function to extract target user ID from request
function extractTargetUserId(request: NextRequest, args: any[]): string | null {
  // Try to get from URL params
  const url = new URL(request.url);
  const userId =
    url.searchParams.get("userId") || url.searchParams.get("user_id");
  if (userId) return userId;

  // Try to get from request body
  if (request.body) {
    try {
      const body = JSON.parse(request.body as any);
      if (body.userId || body.user_id) {
        return body.userId || body.user_id;
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  // Try to get from route params
  if (args.length > 0 && args[0].params) {
    const params = args[0].params;
    return params.userId || params.user_id || null;
  }

  return null;
}

// Helper function to log API access
async function logApiAccess(
  userId: string,
  endpoint: string,
  userRole: Role,
  accessType: string
): Promise<void> {
  logger.logSOC2Event(SOC2EventType.DATA_ACCESSED, {
    level: LogLevel.INFO,
    category: LogCategory.SYSTEM_ACCESS,
    message: "User accessed endpoint",
    metadata: {
      userId,
      endpoint,
      userRole,
      accessType,
    },
  });
}

// Helper function to log authorization failures
async function logAuthorizationFailure(
  userId: string,
  endpoint: string,
  userRole: Role,
  missingPermissions: CustomPermission[],
  requiredRole?: Role
): Promise<void> {
  logger.logSOC2Event(SOC2EventType.DATA_ACCESSED, {
    level: LogLevel.WARNING,
    category: LogCategory.SYSTEM_ACCESS,
    message: "Authorization failure",
    metadata: {
      userId,
      endpoint,
      userRole,
      missingPermissions,
      requiredRole,
    },
  });
}

// Helper function to log auth errors
async function logAuthError(endpoint: string, error: any): Promise<void> {
  logger.error(LogCategory.AUTHENTICATION, "Authentication error", {
    endpoint,
    error: error instanceof Error ? error.message : "Unknown error",
  });
}

// Utility function to combine self-access with permission check
export const allowSelfOrPermission = (permission: CustomPermission) =>
  withEnhancedAuth(
    async (req: NextRequest, context: AuthContext) => {
      // Implementation will be handled by withEnhancedAuth options
      return NextResponse.json({ success: true });
    },
    { permission, allowSelf: true }
  );

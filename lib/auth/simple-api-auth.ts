/**
 * Simplified API Authentication
 * 
 * Replaces the complex api-auth.ts with basic role-based authentication
 * for API routes. Removes complex permission checking while maintaining
 * security and audit logging.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { 
  SimpleRole, 
  hasRoleLevel, 
  sanitizeRole,
  createAuditLog,
  SimpleAuditEvent 
} from "./simple-permissions";

// Simplified session interface
export interface SimpleSession {
  userId: string;
  userRole: SimpleRole;
  databaseId?: string;
  email?: string;
}

// API authentication options
export interface SimpleAuthOptions {
  requiredRole?: SimpleRole;
  allowedRoles?: SimpleRole[];
  requireDatabase?: boolean;
  auditResource?: string;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

// Rate limiting storage (in-memory for simplicity)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimit() {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  rateLimitMap.forEach((value, key) => {
    if (value.resetTime < now) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => rateLimitMap.delete(key));
}

/**
 * Check rate limit for user
 */
function checkRateLimit(
  userId: string, 
  rateLimit: { requests: number; windowMs: number }
): boolean {
  cleanupRateLimit();
  
  const key = `rate_limit_${userId}`;
  const now = Date.now();
  const existing = rateLimitMap.get(key);
  
  if (!existing || existing.resetTime < now) {
    // Create new rate limit window
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + rateLimit.windowMs,
    });
    return true;
  }
  
  if (existing.count >= rateLimit.requests) {
    return false; // Rate limit exceeded
  }
  
  // Increment count
  existing.count++;
  return true;
}

/**
 * Extract user session from Clerk authentication
 */
async function getSession(): Promise<SimpleSession | null> {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return null;
    }
    
    // Extract role from JWT claims
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const jwtRole = claims?.["x-hasura-default-role"];
    const databaseId = claims?.["x-hasura-user-id"];
    
    // Get role from metadata as fallback
    const metadataRole = sessionClaims?.publicMetadata?.role as string;
    
    const userRole = sanitizeRole(jwtRole || metadataRole);
    
    return {
      userId,
      userRole,
      databaseId,
      email: sessionClaims?.email as string,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Log audit event (simplified)
 */
function logAuditEvent(
  event: SimpleAuditEvent, 
  session: SimpleSession | null,
  request: NextRequest,
  details?: Record<string, any>
) {
  const auditLog = createAuditLog(event, {
    ...details,
    userId: session?.userId,
    userRole: session?.userRole,
    ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    userAgent: request.headers.get("user-agent"),
    url: request.url,
    method: request.method,
  });
  
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 API Audit:", auditLog);
  }
  
  // TODO: In production, send to audit logging service
  // await sendToAuditService(auditLog);
}

/**
 * Check if user can access database
 */
async function checkDatabaseAccess(session: SimpleSession): Promise<boolean> {
  // In a real implementation, you would query the database
  // For now, we'll assume if they have a databaseId, they have access
  return !!session.databaseId;
}

/**
 * Simplified API authentication wrapper
 */
export function withAuth<T = any>(
  handler: (request: NextRequest, session: SimpleSession) => Promise<NextResponse<T>>,
  options: SimpleAuthOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    try {
      // Get session
      const session = await getSession();
      
      if (!session) {
        logAuditEvent("access_denied", null, request, { 
          reason: "no_session",
          resource: options.auditResource 
        });
        
        return NextResponse.json(
          { error: "Unauthorized", code: "NO_SESSION" },
          { status: 401 }
        ) as NextResponse<T>;
      }
      
      // Check role requirements
      if (options.requiredRole && !hasRoleLevel(session.userRole, options.requiredRole)) {
        logAuditEvent("access_denied", session, request, {
          reason: "insufficient_role",
          requiredRole: options.requiredRole,
          userRole: session.userRole,
          resource: options.auditResource,
        });
        
        return NextResponse.json(
          { 
            error: "Forbidden", 
            code: "INSUFFICIENT_ROLE",
            required: options.requiredRole,
            current: session.userRole,
          },
          { status: 403 }
        ) as NextResponse<T>;
      }
      
      // Check allowed roles
      if (options.allowedRoles && !options.allowedRoles.includes(session.userRole)) {
        logAuditEvent("access_denied", session, request, {
          reason: "role_not_allowed",
          allowedRoles: options.allowedRoles,
          userRole: session.userRole,
          resource: options.auditResource,
        });
        
        return NextResponse.json(
          { 
            error: "Forbidden", 
            code: "ROLE_NOT_ALLOWED",
            allowed: options.allowedRoles,
            current: session.userRole,
          },
          { status: 403 }
        ) as NextResponse<T>;
      }
      
      // Check database access if required
      if (options.requireDatabase) {
        const hasDbAccess = await checkDatabaseAccess(session);
        if (!hasDbAccess) {
          logAuditEvent("access_denied", session, request, {
            reason: "no_database_access",
            resource: options.auditResource,
          });
          
          return NextResponse.json(
            { error: "Database access required", code: "NO_DATABASE_ACCESS" },
            { status: 403 }
          ) as NextResponse<T>;
        }
      }
      
      // Check rate limiting
      if (options.rateLimit) {
        const rateLimitOk = checkRateLimit(session.userId, options.rateLimit);
        if (!rateLimitOk) {
          logAuditEvent("access_denied", session, request, {
            reason: "rate_limit_exceeded",
            rateLimit: options.rateLimit,
            resource: options.auditResource,
          });
          
          return NextResponse.json(
            { error: "Too many requests", code: "RATE_LIMIT_EXCEEDED" },
            { status: 429 }
          ) as NextResponse<T>;
        }
      }
      
      // Log successful access
      if (options.auditResource) {
        logAuditEvent("auth_login", session, request, {
          resource: options.auditResource,
          granted: true,
        });
      }
      
      // Call the actual handler
      return await handler(request, session);
      
    } catch (error) {
      console.error("Auth wrapper error:", error);
      
      const session = await getSession();
      logAuditEvent("auth_failed", session, request, {
        error: error instanceof Error ? error.message : "Unknown error",
        resource: options.auditResource,
      });
      
      return NextResponse.json(
        { error: "Internal server error", code: "AUTH_ERROR" },
        { status: 500 }
      ) as NextResponse<T>;
    }
  };
}

/**
 * Admin-only API wrapper
 */
export function withAdminAuth<T = any>(
  handler: (request: NextRequest, session: SimpleSession) => Promise<NextResponse<T>>
) {
  return withAuth(handler, { requiredRole: "org_admin" });
}

/**
 * Manager-only API wrapper
 */
export function withManagerAuth<T = any>(
  handler: (request: NextRequest, session: SimpleSession) => Promise<NextResponse<T>>
) {
  return withAuth(handler, { requiredRole: "manager" });
}

/**
 * Developer-only API wrapper
 */
export function withDeveloperAuth<T = any>(
  handler: (request: NextRequest, session: SimpleSession) => Promise<NextResponse<T>>
) {
  return withAuth(handler, { allowedRoles: ["developer"] });
}

/**
 * Basic authenticated API wrapper (any authenticated user)
 */
export function withBasicAuth<T = any>(
  handler: (request: NextRequest, session: SimpleSession) => Promise<NextResponse<T>>
) {
  return withAuth(handler, { requiredRole: "viewer" });
}

/**
 * Simplified version of route protection
 */
export function requireRole(role: SimpleRole) {
  return { requiredRole: role };
}

export function requireAdmin() {
  return { requiredRole: "org_admin" as SimpleRole };
}

export function requireManager() {
  return { requiredRole: "manager" as SimpleRole };
}

// Backward compatibility
export { withAuth as authenticateApiRoute };
export type { SimpleSession as AuthenticatedUser };

// Export rate limiting utilities
export const rateLimit = {
  standard: { requests: 100, windowMs: 60000 }, // 100 requests per minute
  strict: { requests: 10, windowMs: 60000 },    // 10 requests per minute
  lenient: { requests: 1000, windowMs: 60000 }, // 1000 requests per minute
};
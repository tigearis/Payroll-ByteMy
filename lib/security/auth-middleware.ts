// lib/security/auth-middleware.ts
// Standardized authentication and authorization middleware

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { SecureErrorHandler, PermissionValidator } from "./error-responses";

export interface AuthMiddlewareOptions {
  requiredRole?: string[];
  requiredPermission?: string;
  allowAnonymous?: boolean;
  skipDatabaseCheck?: boolean;
}

export interface AuthContext {
  userId: string;
  userRole?: string;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
}

// Standardized authentication middleware for API routes
export async function withAuth(
  req: NextRequest,
  options: AuthMiddlewareOptions = {}
): Promise<{ success: true; context: AuthContext } | { success: false; response: NextResponse }> {
  try {
    // Check authentication
    const { userId, sessionClaims } = await auth();
    
    // Handle anonymous access
    if (!userId) {
      if (options.allowAnonymous) {
        return {
          success: true,
          context: {
            userId: "",
            hasPermission: () => false,
            hasRole: () => false
          }
        };
      }
      
      const error = SecureErrorHandler.authenticationError();
      return {
        success: false,
        response: NextResponse.json(error, { status: 401 })
      };
    }

    // Extract user role from session claims
    const userRole = sessionClaims?.metadata?.role as string || 
                    sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"] as string;

    // Check required role
    if (options.requiredRole && options.requiredRole.length > 0) {
      const roleValidation = PermissionValidator.validateRole(userRole, options.requiredRole);
      if (!roleValidation.isValid) {
        return {
          success: false,
          response: NextResponse.json(roleValidation.error!, { status: 403 })
        };
      }
    }

    // Create auth context
    const authContext: AuthContext = {
      userId,
      userRole,
      hasPermission: (permission: string) => {
        // This would need to be enhanced with actual permission checking
        // For now, basic role-based permissions
        if (userRole === "developer") return true;
        if (userRole === "org_admin" && !permission.includes("system_admin")) return true;
        if (userRole === "manager" && ["view_dashboard", "manage_staff", "view_clients", "process_payrolls"].includes(permission)) return true;
        if (userRole === "consultant" && ["view_dashboard", "view_clients", "process_payrolls"].includes(permission)) return true;
        if (userRole === "viewer" && permission === "view_dashboard") return true;
        return false;
      },
      hasRole: (roles: string[]) => {
        return userRole ? roles.includes(userRole) : false;
      }
    };

    // Check required permission
    if (options.requiredPermission) {
      const hasPermission = authContext.hasPermission(options.requiredPermission);
      const permissionValidation = PermissionValidator.validatePermission(hasPermission, options.requiredPermission);
      if (!permissionValidation.isValid) {
        return {
          success: false,
          response: NextResponse.json(permissionValidation.error!, { status: 403 })
        };
      }
    }

    return { success: true, context: authContext };
  } catch (error) {
    console.error("Authentication middleware error:", error);
    const sanitizedError = SecureErrorHandler.sanitizeError(error, "auth_middleware");
    return {
      success: false,
      response: NextResponse.json(sanitizedError, { status: 500 })
    };
  }
}

// Higher-order function for API route protection
export function protectRoute(
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authResult = await withAuth(req, options);
    
    if (!authResult.success) {
      return authResult.response;
    }
    
    return handler(req, authResult.context);
  };
}

// Admin-only route protection
export function protectAdminRoute(
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return protectRoute(handler, {
    requiredRole: ["developer", "org_admin"]
  });
}

// Manager+ route protection
export function protectManagerRoute(
  handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return protectRoute(handler, {
    requiredRole: ["developer", "org_admin", "manager"]
  });
}
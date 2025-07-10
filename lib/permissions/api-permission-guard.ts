/**
 * API Permission Guard
 *
 * Server-side permission checking utilities for API routes and server components.
 * Integrates with the new permission calculation service.
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { type UserRole } from "./database-permissions";
import { permissionCalculationService } from "./permission-calculation-service";

// Response types for permission failures
export interface PermissionError {
  error: string;
  required?: string[];
  userRole?: string;
  userId?: string;
}

// Permission check options
export interface PermissionCheckOptions {
  resource?: string;
  action?: string;
  permissions?: string[];
  requireAll?: boolean;
  minRole?: UserRole;
  allowSelf?: boolean;
  resourceId?: string;
}

/**
 * API Permission Guard Class
 */
export class ApiPermissionGuard {
  private static instance: ApiPermissionGuard;

  private constructor() {}

  static getInstance(): ApiPermissionGuard {
    if (!ApiPermissionGuard.instance) {
      ApiPermissionGuard.instance = new ApiPermissionGuard();
    }
    return ApiPermissionGuard.instance;
  }

  /**
   * Check permissions for API route with detailed results
   */
  async checkPermissions(options: PermissionCheckOptions): Promise<{
    allowed: boolean;
    user?: any;
    userId?: string;
    role?: UserRole;
    permissions?: string[];
    error?: PermissionError;
  }> {
    try {
      // Get authenticated user
      const { userId } = await auth();
      const user = await currentUser();

      if (!userId || !user) {
        return {
          allowed: false,
          error: {
            error: "Authentication required",
          },
        };
      }

      const userRole = (user.publicMetadata?.role as UserRole) || "viewer";

      // Get user permissions using the new calculation service
      const permissionResult =
        await permissionCalculationService.calculateUserPermissions(
          userId,
          userRole
        );

      const userPermissions = permissionResult.permissions;

      // Check specific resource.action permission
      if (options.resource && options.action) {
        const hasPermission = await permissionCalculationService.hasPermission(
          userId,
          userRole,
          options.resource,
          options.action
        );

        if (!hasPermission) {
          return {
            allowed: false,
            user,
            userId,
            role: userRole,
            permissions: userPermissions,
            error: {
              error: "Insufficient permissions",
              required: [`${options.resource}:${options.action}`],
              userRole,
              userId,
            },
          };
        }
      }

      // Check multiple permissions
      if (options.permissions && options.permissions.length > 0) {
        const hasRequiredPermissions = options.requireAll
          ? await permissionCalculationService.hasAllPermissions(
              userId,
              userRole,
              options.permissions
            )
          : await permissionCalculationService.hasAnyPermission(
              userId,
              userRole,
              options.permissions
            );

        if (!hasRequiredPermissions) {
          return {
            allowed: false,
            user,
            userId,
            role: userRole,
            permissions: userPermissions,
            error: {
              error: `Missing required permissions (${options.requireAll ? "all" : "any"})`,
              required: options.permissions,
              userRole,
              userId,
            },
          };
        }
      }

      // Check minimum role level
      if (options.minRole) {
        const roleHierarchy: Record<UserRole, number> = {
          viewer: 1,
          consultant: 2,
          manager: 3,
          org_admin: 4,
          developer: 5,
        };

        const userLevel = roleHierarchy[userRole] || 0;
        const requiredLevel = roleHierarchy[options.minRole] || 0;

        if (userLevel < requiredLevel) {
          return {
            allowed: false,
            user,
            userId,
            role: userRole,
            permissions: userPermissions,
            error: {
              error: "Insufficient role level",
              required: [options.minRole],
              userRole,
              userId,
            },
          };
        }
      }

      // Check self-access (for operations on own data)
      if (options.allowSelf && options.resourceId) {
        if (options.resourceId === userId) {
          return {
            allowed: true,
            user,
            userId,
            role: userRole,
            permissions: userPermissions,
          };
        }
      }

      // All checks passed
      return {
        allowed: true,
        user,
        userId,
        role: userRole,
        permissions: userPermissions,
      };
    } catch (error) {
      console.error("Error checking API permissions:", error);
      return {
        allowed: false,
        error: {
          error: "Permission check failed",
        },
      };
    }
  }

  /**
   * Middleware function for API route protection
   */
  async requirePermissions(options: PermissionCheckOptions) {
    const result = await this.checkPermissions(options);

    if (!result.allowed) {
      const status =
        result.error?.error === "Authentication required" ? 401 : 403;
      return NextResponse.json(result.error, { status });
    }

    return {
      user: result.user!,
      userId: result.userId!,
      role: result.role!,
      permissions: result.permissions!,
    };
  }

  /**
   * Check if user can access specific resource
   */
  async canAccessResource(
    userId: string,
    userRole: UserRole,
    resource: string
  ): Promise<boolean> {
    return permissionCalculationService.canAccessResource(
      userId,
      userRole,
      resource
    );
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(
    userId: string,
    userRole: UserRole,
    resource: string,
    action: string
  ): Promise<boolean> {
    return permissionCalculationService.hasPermission(
      userId,
      userRole,
      resource,
      action
    );
  }

  /**
   * Get user's permissions for a resource
   */
  async getResourcePermissions(
    userId: string,
    userRole: UserRole,
    resource: string
  ): Promise<string[]> {
    return permissionCalculationService.getResourcePermissions(
      userId,
      userRole,
      resource
    );
  }
}

// Export singleton instance
export const apiPermissionGuard = ApiPermissionGuard.getInstance();

// Convenience functions
export async function requirePermissions(options: PermissionCheckOptions) {
  return apiPermissionGuard.requirePermissions(options);
}

export async function checkPermissions(options: PermissionCheckOptions) {
  return apiPermissionGuard.checkPermissions(options);
}

export async function requireAuth() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const role = (user.publicMetadata?.role as UserRole) || "viewer";

  return {
    user,
    userId,
    role,
    permissions: (user.publicMetadata?.permissions as string[]) || [],
  };
}

// Resource-specific permission checkers
export async function requireClientAccess(action: string = "read") {
  return requirePermissions({ resource: "clients", action });
}

export async function requirePayrollAccess(action: string = "read") {
  return requirePermissions({ resource: "payrolls", action });
}

export async function requireStaffAccess(action: string = "read") {
  return requirePermissions({ resource: "staff", action });
}

export async function requireBillingAccess(action: string = "read") {
  return requirePermissions({ resource: "billing", action });
}

export async function requireReportsAccess(action: string = "read") {
  return requirePermissions({ resource: "reports", action });
}

export async function requireSecurityAccess(action: string = "read") {
  return requirePermissions({ resource: "security", action });
}

export async function requireAdminAccess() {
  return requirePermissions({ minRole: "org_admin" });
}

export async function requireManagerAccess() {
  return requirePermissions({ minRole: "manager" });
}

export async function requireDeveloperAccess() {
  return requirePermissions({ minRole: "developer" });
}

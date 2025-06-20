// lib/auth/native-permission-checker.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { MetadataManager } from "./metadata-manager.server";
import { hasMinimumRoleLevel, CustomPermission, Role } from "@/types/permissions";

export class NativePermissionChecker {
  /**
   * Check permission using Clerk's native system with custom permissions
   * This leverages Clerk's has() function which automatically checks publicMetadata.permissions
   */
  static async hasPermission(permission: CustomPermission): Promise<boolean> {
    try {
      const { userId, has } = await auth();

      if (!userId) {
        console.warn("No authenticated user for permission check");
        return false;
      }

      // Clerk automatically checks publicMetadata.permissions array
      const hasPermissionResult = has({ permission });

      // If permission check fails, validate and potentially sync permissions
      if (!hasPermissionResult) {
        console.log(`Permission ${permission} denied for user ${userId}`);

        // Optional: Validate permissions are in sync (can be disabled in production for performance)
        if (process.env.NODE_ENV === "development") {
          await this.validateUserPermissions(userId);
        }
      }

      return hasPermissionResult;
    } catch (error) {
      console.error("Permission check failed:", error);
      return false;
    }
  }

  /**
   * Check multiple permissions at once - user needs ALL permissions
   */
  static async hasAllPermissions(
    permissions: CustomPermission[]
  ): Promise<boolean> {
    try {
      for (const permission of permissions) {
        if (!(await this.hasPermission(permission))) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Multiple permission check failed:", error);
      return false;
    }
  }

  /**
   * Check multiple permissions - user needs ANY permission
   */
  static async hasAnyPermissions(
    permissions: CustomPermission[]
  ): Promise<boolean> {
    try {
      for (const permission of permissions) {
        if (await this.hasPermission(permission)) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Any permission check failed:", error);
      return false;
    }
  }

  /**
   * Check if user has minimum role level using hierarchy
   */
  static async hasMinimumRole(minimumRole: Role): Promise<boolean> {
    try {
      const { userId } = await auth();
      if (!userId) return false;

      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const currentRole = MetadataManager.extractUserRole(user) as Role;

      return hasMinimumRoleLevel(currentRole, minimumRole);
    } catch (error) {
      console.error("Role level check failed:", error);
      return false;
    }
  }

  /**
   * Get current user's role and permissions
   */
  static async getCurrentUserInfo(): Promise<{
    userId: string | null;
    role: Role | null;
    permissions: CustomPermission[];
  }> {
    try {
      const { userId } = await auth();

      if (!userId) {
        return { userId: null, role: null, permissions: [] };
      }

      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const role = MetadataManager.extractUserRole(user) as Role;
      const permissions = await MetadataManager.getUserPermissions(userId);

      return { userId, role, permissions };
    } catch (error) {
      console.error("Failed to get current user info:", error);
      return { userId: null, role: null, permissions: [] };
    }
  }

  /**
   * Check if user can access specific resource with custom restrictions
   */
  static async canAccessResource(
    resourceType: "payroll" | "client",
    resourceId: string
  ): Promise<boolean> {
    try {
      const { userId } = await auth();
      if (!userId) return false;

      // First check basic permissions
      const readPermission = `custom:${resourceType}:read` as CustomPermission;
      if (!(await this.hasPermission(readPermission))) {
        return false;
      }

      // Check custom access restrictions
      const metadata = await MetadataManager.getUserMetadata(userId);
      const customAccess = metadata?.customAccess;

      if (!customAccess) {
        return true; // No restrictions
      }

      // Check resource-specific restrictions
      if (resourceType === "payroll" && customAccess.restrictedPayrolls) {
        return !customAccess.restrictedPayrolls.includes(resourceId);
      }

      if (resourceType === "client" && customAccess.allowedClients) {
        return customAccess.allowedClients.includes(resourceId);
      }

      return true;
    } catch (error) {
      console.error(
        `Resource access check failed for ${resourceType}:${resourceId}:`,
        error
      );
      return false;
    }
  }

  /**
   * Validate user permissions are in sync with their role
   * Useful for development and debugging
   */
  private static async validateUserPermissions(userId: string): Promise<void> {
    try {
      const synced = await MetadataManager.validateAndSyncPermissions(userId);
      if (synced) {
        console.warn(`🔄 Synced permissions for user ${userId}`);
      }
    } catch (error) {
      console.error(
        `Failed to validate permissions for user ${userId}:`,
        error
      );
    }
  }

  /**
   * Compatibility layer for existing permission patterns
   * Allows gradual migration from old system
   */
  static async checkLegacyPermission(action: string): Promise<boolean> {
    const actionPermissionMap: Record<string, CustomPermission> = {
      manage_staff: "custom:staff:write",
      manage_payrolls: "custom:payroll:write",
      manage_users: "custom:staff:write",
      system_admin: "custom:admin:manage",
      view_reports: "custom:reports:read",
      manage_clients: "custom:client:write",
      create_staff: "custom:staff:write",
      delete_staff: "custom:staff:delete",
      invite_staff: "custom:staff:invite",
    };

    const permission = actionPermissionMap[action];
    if (!permission) {
      console.warn(`Unknown legacy permission action: ${action}`);
      return false;
    }

    return await this.hasPermission(permission);
  }

  /**
   * Batch permission check for performance
   * Returns a map of permission -> boolean
   */
  static async checkMultiplePermissions(
    permissions: CustomPermission[]
  ): Promise<Record<CustomPermission, boolean>> {
    const results: Record<CustomPermission, boolean> = {} as Record<
      CustomPermission,
      boolean
    >;

    try {
      const { userId, has } = await auth();

      if (!userId) {
        // Return all false if not authenticated
        permissions.forEach((permission) => {
          results[permission] = false;
        });
        return results;
      }

      // Batch check using Clerk's native API
      permissions.forEach((permission) => {
        results[permission] = has({ permission });
      });

      return results;
    } catch (error) {
      console.error("Batch permission check failed:", error);
      // Return all false on error
      permissions.forEach((permission) => {
        results[permission] = false;
      });
      return results;
    }
  }
}

// Utility functions for common patterns
export async function requirePermission(
  permission: CustomPermission
): Promise<void> {
  const hasPermission = await NativePermissionChecker.hasPermission(permission);
  if (!hasPermission) {
    throw new Error(`Missing required permission: ${permission}`);
  }
}

export async function requireAnyPermission(
  permissions: CustomPermission[]
): Promise<void> {
  const hasAny = await NativePermissionChecker.hasAnyPermissions(permissions);
  if (!hasAny) {
    throw new Error(
      `Missing any of required permissions: ${permissions.join(", ")}`
    );
  }
}

export async function requireMinimumRole(role: Role): Promise<void> {
  const hasRole = await NativePermissionChecker.hasMinimumRole(role);
  if (!hasRole) {
    throw new Error(`Requires ${role} role or higher`);
  }
}

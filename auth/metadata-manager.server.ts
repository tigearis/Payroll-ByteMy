// lib/auth/metadata-manager.server.ts
import { clerkClient } from "@clerk/nextjs/server";
import {
  ROLE_PERMISSIONS,
  getPermissionsForRole,
  CustomPermission,
  Role,
  UserMetadata,
} from "@/types/permissions";

export class MetadataManager {
  /**
   * Update user role and automatically sync permissions to publicMetadata
   */
  static async updateUserRole(
    userId: string,
    newRole: Role,
    assignedBy: string,
    customAccess?: UserMetadata["customAccess"],
    databaseId?: string
  ): Promise<void> {
    try {
      const client = await clerkClient();
      const roleConfig = ROLE_PERMISSIONS[newRole];
      const timestamp = new Date().toISOString();

      // Get current metadata to preserve non-auth fields
      const currentUser = await client.users.getUser(userId);
      const currentMetadata = (currentUser.publicMetadata || {}) as any;

      // Build new metadata preserving non-auth fields
      const {
        role: oldRole,
        permissions: oldPermissions,
        assignedBy: oldAssignedBy,
        assignedAt: oldAssignedAt,
        lastUpdated: oldLastUpdated,
        customAccess: oldCustomAccess,
        databaseId: oldDatabaseId,
        ...preservedMetadata
      } = currentMetadata;

      const newMetadata: UserMetadata = {
        role: newRole,
        permissions: [...roleConfig.permissions], // Create new array to avoid reference issues
        databaseId: databaseId || oldDatabaseId,
        assignedBy,
        assignedAt: timestamp,
        lastUpdated: timestamp,
        customAccess,
        ...preservedMetadata, // Preserve non-auth metadata
      };

      // Update user metadata in Clerk
      await client.users.updateUser(userId, {
        publicMetadata: newMetadata as unknown as Record<string, unknown>,
      });

      // Log the role change for audit
      await this.logRoleChange(userId, oldRole, newRole, assignedBy);

      console.log(
        `✅ Updated user ${userId} role from ${oldRole || "none"} to ${newRole}`
      );
      console.log(`📋 Assigned ${roleConfig.permissions.length} permissions`);
    } catch (error) {
      console.error(`❌ Failed to update user ${userId} role:`, error);
      throw new Error(
        `Failed to update user role: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Add or remove individual permissions for fine-grained control
   */
  static async updateUserPermissions(
    userId: string,
    addPermissions: CustomPermission[] = [],
    removePermissions: CustomPermission[] = [],
    updatedBy: string
  ): Promise<void> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const currentMetadata = user.publicMetadata as UserMetadata;

      if (!currentMetadata?.permissions) {
        throw new Error("User has no existing permissions to modify");
      }

      // Calculate new permissions
      const currentPermissions = currentMetadata.permissions || [];
      const filteredPermissions = currentPermissions.filter(
        (p) => !removePermissions.includes(p)
      );
      const newPermissions = [
        ...filteredPermissions,
        ...addPermissions.filter((p) => !filteredPermissions.includes(p)),
      ];

      // Update metadata
      const updatedMetadata: UserMetadata = {
        ...currentMetadata,
        permissions: newPermissions,
        lastUpdated: new Date().toISOString(),
      };

      await client.users.updateUser(userId, {
        publicMetadata: updatedMetadata as unknown as Record<string, unknown>,
      });

      console.log(`✅ Updated permissions for user ${userId}`);
      console.log(`➕ Added: ${addPermissions.join(", ") || "none"}`);
      console.log(`➖ Removed: ${removePermissions.join(", ") || "none"}`);
    } catch (error) {
      console.error(
        `❌ Failed to update permissions for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get user permissions for validation or display
   */
  static async getUserPermissions(userId: string): Promise<CustomPermission[]> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const metadata = user.publicMetadata as UserMetadata;
      return metadata?.permissions || [];
    } catch (error) {
      console.error(`❌ Failed to get permissions for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Get user metadata safely
   */
  static async getUserMetadata(userId: string): Promise<UserMetadata | null> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      return (user.publicMetadata as UserMetadata) || null;
    } catch (error) {
      console.error(`❌ Failed to get metadata for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * Extract user role from user object safely with validation
   */
  static extractUserRole(user: any): Role {
    const metadata = user?.publicMetadata as UserMetadata;
    const role = metadata?.role;

    // Validate role exists in our system
    if (role && role in ROLE_PERMISSIONS) {
      return role;
    }

    // Fallback for users without proper metadata
    console.warn(
      `User ${user?.id} has invalid or missing role: ${role}, defaulting to 'viewer'`
    );
    return "viewer";
  }

  /**
   * Validate and sync user permissions if they're out of sync with their role
   */
  static async validateAndSyncPermissions(userId: string): Promise<boolean> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const metadata = user.publicMetadata as UserMetadata;

      if (!metadata?.role) {
        console.warn(
          `User ${userId} has no role, assigning default 'viewer' role`
        );
        await this.updateUserRole(userId, "viewer", "system-validation");
        return true;
      }

      const expectedPermissions = getPermissionsForRole(metadata.role);
      const currentPermissions = metadata.permissions || [];

      // Check if permissions match what the role should have
      const permissionsMatch =
        expectedPermissions.length === currentPermissions.length &&
        expectedPermissions.every((p) => currentPermissions.includes(p));

      if (!permissionsMatch) {
        console.warn(
          `User ${userId} permissions out of sync with role ${metadata.role}, syncing...`
        );
        await this.updateUserRole(userId, metadata.role, "system-sync");
        return true;
      }

      return false; // No sync needed
    } catch (error) {
      console.error(
        `❌ Failed to validate permissions for user ${userId}:`,
        error
      );
      return false;
    }
  }

  /**
   * Set custom access restrictions for a user
   */
  static async setCustomAccess(
    userId: string,
    customAccess: UserMetadata["customAccess"],
    updatedBy: string
  ): Promise<void> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const currentMetadata = user.publicMetadata as UserMetadata;

      const updatedMetadata: UserMetadata = {
        ...currentMetadata,
        customAccess,
        lastUpdated: new Date().toISOString(),
      };

      await client.users.updateUser(userId, {
        publicMetadata: updatedMetadata as unknown as Record<string, unknown>,
      });

      console.log(`✅ Updated custom access for user ${userId}`);
    } catch (error) {
      console.error(
        `❌ Failed to set custom access for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get all users with their roles and permissions for admin views
   */
  static async getAllUsersWithRoles(): Promise<
    Array<{
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      metadata: UserMetadata;
    }>
  > {
    try {
      const client = await clerkClient();
      const users = await client.users.getUserList({ limit: 100 });

      return users.data.map((user) => ({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        metadata: (user.publicMetadata as unknown as UserMetadata) || {
          role: "viewer",
          permissions: [],
        },
      }));
    } catch (error) {
      console.error("❌ Failed to get all users with roles:", error);
      return [];
    }
  }

  /**
   * Private helper to log role changes for audit
   */
  private static async logRoleChange(
    userId: string,
    oldRole: Role | undefined,
    newRole: Role,
    assignedBy: string
  ): Promise<void> {
    // Integration point for audit logging
    const logEntry = {
      timestamp: new Date().toISOString(),
      userId,
      oldRole,
      newRole,
      assignedBy,
      action: "role_change",
    };

    console.log("📝 Role change audit log:", logEntry);

    // TODO: Integrate with SOC2Logger when implementing audit logging
    // await soc2Logger.log({
    //   level: LogLevel.INFO,
    //   category: LogCategory.ACCESS_CONTROL,
    //   eventType: SOC2EventType.ROLE_ASSIGNMENT,
    //   message: `User role changed from ${oldRole} to ${newRole}`,
    //   userId: assignedBy,
    //   metadata: logEntry
    // });
  }
}

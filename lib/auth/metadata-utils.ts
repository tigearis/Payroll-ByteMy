// lib/auth/metadata-utils.ts - Client-safe metadata utilities
import {
  type Role,
  type UserMetadata,
  sanitizeUserRole,
  getPermissionsForRole,
} from "@/types/permissions";

/**
 * Client-safe utilities for working with user metadata
 * These functions don't make server calls and are safe to use in client components
 */
export class MetadataUtils {
  /**
   * Extract user role from Clerk user object
   * Safe for client-side use
   */
  static extractUserRole(user: any): Role {
    const rawRole = user?.publicMetadata?.role;
    return sanitizeUserRole(rawRole);
  }

  /**
   * Get user metadata from Clerk user object
   * Safe for client-side use
   */
  static getUserMetadata(user: any): UserMetadata | null {
    if (!user?.publicMetadata) return null;

    const metadata = user.publicMetadata as any;

    // Validate and sanitize the metadata
    return {
      role: this.extractUserRole(user),
      permissions:
        metadata.permissions ||
        getPermissionsForRole(this.extractUserRole(user)),
      assignedBy: metadata.assignedBy,
      assignedAt: metadata.assignedAt,
      lastUpdated: metadata.lastUpdated,
      customAccess: metadata.customAccess,
      onboardingComplete: metadata.onboardingComplete,
      department: metadata.department,
      employeeId: metadata.employeeId,
      startDate: metadata.startDate,
      databaseId: metadata.databaseId,
    };
  }

  /**
   * Get role display name
   * Safe for client-side use
   */
  static getRoleDisplayName(role: Role): string {
    const displayNames: Record<Role, string> = {
      developer: "Developer",
      org_admin: "Organization Admin",
      manager: "Manager",
      consultant: "Consultant",
      viewer: "Viewer",
    };
    return displayNames[role] || "Unknown";
  }

  /**
   * Get role description
   * Safe for client-side use
   */
  static getRoleDescription(role: Role): string {
    const descriptions: Record<Role, string> = {
      developer: "Full system access and development tools",
      org_admin: "Organization-wide administration and management",
      manager: "Team and payroll management capabilities",
      consultant: "Limited operational access for assigned work",
      viewer: "Read-only access to basic information",
    };
    return descriptions[role] || "Unknown role";
  }
}

// Re-export centralized functions and types for convenience
export {
  sanitizeUserRole,
  isValidUserRole,
  getPermissionsForRole,
  roleHasPermission,
  canAssignRole,
  hasRoleLevel as hasMinimumRole,
  getRoleLevel,
  type UserMetadata,
  type CustomPermission,
  type Role as UserRole,
} from "@/types/permissions";

// Export class functions for convenience
export const {
  extractUserRole,
  getUserMetadata,
  getRoleDisplayName,
  getRoleDescription,
} = MetadataUtils;

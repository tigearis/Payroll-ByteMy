// lib/permissions/hierarchical-permissions.ts
import crypto from "crypto";
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/apollo/unified-client";

// Type definitions
export type UserRole =
  | "developer"
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer";

export interface HierarchicalPermissionData {
  role: UserRole;
  allowedRoles: UserRole[];
  excludedPermissions: string[];
  permissionHash: string;
  permissionVersion: string;
}

// Role hierarchy with inheritance (highest to lowest)
const ROLE_HIERARCHY: UserRole[] = [
  "developer",
  "org_admin",
  "manager",
  "consultant",
  "viewer",
];

// Base permissions that each role inherits from the role above it
const ROLE_BASE_PERMISSIONS = {
  developer: ["*"], // All permissions
  org_admin: [
    "dashboard.*",
    "clients.*",
    "payrolls.*",
    "schedule.*",
    "workschedule.*",
    "staff.*",
    "leave.*",
    "ai.*",
    "bulkupload.*",
    "reports.*",
    "billing.*",
    "email.*",
    "invitations.*",
    "settings.*",
    "security.*",
  ],
  manager: [
    "dashboard.read",
    "dashboard.list",
    "clients.read",
    "clients.create",
    "clients.update",
    "clients.list",
    "clients.manage",
    "payrolls.*",
    "schedule.*",
    "workschedule.*",
    "staff.read",
    "staff.create",
    "staff.update",
    "staff.list",
    "staff.manage",
    "leave.*",
    "ai.read",
    "ai.manage",
    "ai.create",
    "ai.update",
    "bulkupload.*",
    "reports.read",
    "reports.create",
    "reports.list",
    "reports.update",
    "reports.manage",
    "billing.read",
    "billing.create",
    "billing.update",
    "billing.list",
    "billing.approve",
    "billing.manage",
    "email.read",
    "email.create",
    "email.update",
    "email.manage",
    "invitations.*",
    "settings.read",
    "settings.update",
    "security.read",
  ],
  consultant: [
    "dashboard.read",
    "clients.read",
    "payrolls.read",
    "payrolls.update",
    "payrolls.create",
    "schedule.read",
    "schedule.create",
    "schedule.update",
    "workschedule.read",
    "workschedule.update",
    "workschedule.create",
    "staff.read",
    "leave.read",
    "leave.create",
    "leave.update",
    "ai.read",
    "ai.create",
    "reports.read",
    "billing.read",
    "billing.create",
    "billing.update",
    "bulkupload.read",
    "bulkupload.create",
    "bulkupload.update",
    "email.read",
    "email.create",
    "email.update",
    "invitations.read",
    "settings.read",
  ],
  viewer: [
    "dashboard.read",
    "clients.read",
    "payrolls.read",
    "schedule.read",
    "workschedule.read",
    "staff.read",
    "leave.read",
    "reports.read",
    "ai.read",
    "bulkupload.read",
    "billing.read",
    "email.read",
    "invitations.read",
    "settings.read",
  ],
};

/**
 * Get hierarchical permission data for a user based on database role assignments
 */
export async function getHierarchicalPermissionsFromDatabase(
  userId: string
): Promise<HierarchicalPermissionData> {
  try {
    console.log(`🔍 Getting hierarchical permissions for user: ${userId}`);

    // Get user's role assignments from database
    const { data: userData } = await adminApolloClient.query({
      query: gql`
        query GetUserRoleAssignments($userId: uuid!) {
          userRoles(where: { userId: { _eq: $userId } }) {
            id
            roleId
            assignedRole {
              id
              name
              displayName
              priority
            }
          }
        }
      `,
      variables: { userId },
      fetchPolicy: "network-only",
    });

    const userRoles = userData?.userRoles || [];

    if (userRoles.length === 0) {
      console.warn(
        `⚠️ No role assignments found for user ${userId}, defaulting to viewer`
      );
      return {
        role: "viewer",
        allowedRoles: ["viewer"],
        excludedPermissions: [],
        permissionHash: generatePermissionHash("viewer", []),
        permissionVersion: generatePermissionVersion(),
      };
    }

    // Get the highest priority role (developer = highest)
    const highestRole = getHighestRoleFromAssignments(userRoles);

    // Generate allowed roles based on hierarchy
    const allowedRoles = generateAllowedRolesHierarchy(highestRole);

    // Calculate excluded permissions by comparing database actual vs inherited
    const excludedPermissions = await calculateExcludedPermissions(
      userId,
      highestRole
    );

    const permissionHash = generatePermissionHash(
      highestRole,
      excludedPermissions
    );
    const permissionVersion = generatePermissionVersion();

    console.log(`✅ Hierarchical permissions for ${highestRole}:`);
    console.log(`🎭 Allowed roles: ${allowedRoles.join(", ")}`);
    console.log(`❌ Excluded permissions: ${excludedPermissions.length}`);

    return {
      role: highestRole,
      allowedRoles,
      excludedPermissions,
      permissionHash,
      permissionVersion,
    };
  } catch (error) {
    console.error(
      `❌ Error getting hierarchical permissions from database:`,
      error
    );
    throw error;
  }
}

/**
 * Calculate which permissions to exclude based on database vs inherited permissions
 */
async function calculateExcludedPermissions(
  userId: string,
  userRole: UserRole
): Promise<string[]> {
  try {
    // Get actual permissions from database
    const { data: permissionsData } = await adminApolloClient.query({
      query: gql`
        query GetUserActualPermissions($userId: uuid!) {
          userRoles(where: { userId: { _eq: $userId } }) {
            roleId
          }
        }
      `,
      variables: { userId },
      fetchPolicy: "network-only",
    });

    const roleIds =
      permissionsData?.userRoles?.map((ur: any) => ur.roleId) || [];

    if (roleIds.length === 0) {
      return [];
    }

    // Get actual permissions from role_permissions table
    const { data: actualPermissionsData } = await adminApolloClient.query({
      query: gql`
        query GetActualRolePermissions($roleIds: [uuid!]!) {
          rolePermissions(where: { roleId: { _in: $roleIds } }) {
            grantedPermission {
              action
              relatedResource {
                name
              }
            }
          }
        }
      `,
      variables: { roleIds },
      fetchPolicy: "network-only",
    });

    const actualPermissions = new Set(
      actualPermissionsData?.rolePermissions?.map(
        (rp: any) =>
          `${rp.grantedPermission.relatedResource.name}.${rp.grantedPermission.action}`
      ) || []
    );

    // Get inherited permissions for this role
    const inheritedPermissions = getInheritedPermissions(userRole);

    // Find permissions that are inherited but not in database (should be excluded)
    const excludedPermissions: string[] = [];

    for (const inherited of inheritedPermissions) {
      if (inherited === "*") {
        // For wildcard, check if any permissions are missing from database
        // This is complex, so for now we'll handle it differently
        continue;
      }

      if (inherited.endsWith(".*")) {
        // Check resource-level permissions
        const resource = inherited.replace(".*", "");
        const hasAnyResourcePermission = Array.from(actualPermissions).some(
          (p: any) => p.startsWith(resource + ".")
        );
        if (!hasAnyResourcePermission) {
          excludedPermissions.push(inherited);
        }
      } else {
        // Check specific permission
        if (!actualPermissions.has(inherited)) {
          excludedPermissions.push(inherited);
        }
      }
    }

    return excludedPermissions;
  } catch (error) {
    console.error("Error calculating excluded permissions:", error);
    return []; // Fail safe - no exclusions
  }
}

/**
 * Get inherited permissions for a role based on hierarchy
 */
function getInheritedPermissions(role: UserRole): string[] {
  const roleIndex = ROLE_HIERARCHY.indexOf(role);
  if (roleIndex === -1) return ROLE_BASE_PERMISSIONS.viewer;

  // For hierarchical inheritance, get permissions from this role and all lower roles
  const inheritedPermissions = new Set<string>();

  // Add permissions from this role and all roles it can inherit from
  for (let i = roleIndex; i < ROLE_HIERARCHY.length; i++) {
    const currentRole = ROLE_HIERARCHY[i];
    const rolePermissions = ROLE_BASE_PERMISSIONS[currentRole];
    rolePermissions.forEach((perm: any) => inheritedPermissions.add(perm));
  }

  return Array.from(inheritedPermissions);
}

/**
 * Generate allowed roles based on hierarchy
 */
function generateAllowedRolesHierarchy(userRole: UserRole): UserRole[] {
  const roleIndex = ROLE_HIERARCHY.indexOf(userRole);
  if (roleIndex === -1) return ["viewer"];

  // User can access their role and all roles below it in hierarchy
  return ROLE_HIERARCHY.slice(roleIndex);
}

/**
 * Get highest priority role from database assignments
 */
function getHighestRoleFromAssignments(userRoles: any[]): UserRole {
  // Find the role with highest priority (lowest index in hierarchy)
  for (const hierarchyRole of ROLE_HIERARCHY) {
    const hasRole = userRoles.some(
      (ur: any) => ur.assignedRole.name === hierarchyRole
    );
    if (hasRole) {
      return hierarchyRole as UserRole;
    }
  }
  return "viewer"; // Fallback
}

/**
 * Check if user has permission using hierarchical system
 */
export function hasHierarchicalPermission(
  userRole: UserRole,
  permission: string,
  excludedPermissions: string[]
): boolean {
  // Check if permission is explicitly excluded
  if (isPermissionExcluded(permission, excludedPermissions)) {
    return false;
  }

  // Check if user's role hierarchy includes the required permission
  const inheritedPermissions = getInheritedPermissions(userRole);
  return matchesPermissionPattern(permission, inheritedPermissions);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyHierarchicalPermission(
  userRole: UserRole,
  permissions: string[],
  excludedPermissions: string[]
): boolean {
  return permissions.some((permission: any) =>
    hasHierarchicalPermission(userRole, permission, excludedPermissions)
  );
}

/**
 * Check if permission is excluded
 */
function isPermissionExcluded(
  permission: string,
  excludedPermissions: string[]
): boolean {
  return excludedPermissions.some((excluded: any) => {
    if (excluded === "*") {
      return true; // All permissions excluded
    }

    if (excluded.endsWith(".*")) {
      const resource = excluded.replace(".*", "");
      return permission.startsWith(resource + ".");
    }

    return excluded === permission;
  });
}

/**
 * Check if permission matches any pattern in inherited permissions
 */
function matchesPermissionPattern(
  permission: string,
  inheritedPermissions: string[]
): boolean {
  return inheritedPermissions.some((inherited: any) => {
    if (inherited === "*") {
      return true; // Wildcard matches everything
    }

    if (inherited.endsWith(".*")) {
      const resource = inherited.replace(".*", "");
      return permission.startsWith(resource + ".");
    }

    return inherited === permission;
  });
}

/**
 * Generate permission hash for integrity checking
 */
function generatePermissionHash(
  role: UserRole,
  excludedPermissions: string[]
): string {
  const hashData = {
    role,
    excluded: excludedPermissions.sort(),
  };
  const hashString = JSON.stringify(hashData);
  return crypto
    .createHash("sha256")
    .update(hashString)
    .digest("hex")
    .substring(0, 32);
}

/**
 * Generate permission version timestamp
 */
function generatePermissionVersion(): string {
  return Date.now().toString();
}

/**
 * Get effective permissions for a role (for display/debugging)
 */
export function getEffectivePermissions(
  role: UserRole,
  excludedPermissions: string[] = []
): string[] {
  const inheritedPermissions = getInheritedPermissions(role);

  // Filter out excluded permissions
  return inheritedPermissions.filter(
    (permission: any) => !isPermissionExcluded(permission, excludedPermissions)
  );
}

/**
 * Sync user role assignments (simplified for hierarchical system)
 */
export async function syncUserRoleAssignmentsHierarchical(
  userId: string,
  directRole: UserRole
): Promise<void> {
  try {
    console.log(
      `🔄 Syncing hierarchical role assignments for user ${userId}: ${directRole}`
    );

    // Get the role ID for the direct role
    const { data: roleData } = await adminApolloClient.query({
      query: gql`
        query GetRoleByName($roleName: String!) {
          roles(where: { name: { _eq: $roleName } }) {
            id
            name
          }
        }
      `,
      variables: { roleName: directRole },
      fetchPolicy: "network-only",
    });

    const role = roleData?.roles?.[0];
    if (!role) {
      console.error(`❌ Role ${directRole} not found in database`);
      return;
    }

    // Remove existing role assignments
    await adminApolloClient.mutate({
      mutation: gql`
        mutation RemoveExistingRoleAssignments($userId: uuid!) {
          bulkDeleteUserRoles(where: { userId: { _eq: $userId } }) {
            affectedRows
          }
        }
      `,
      variables: { userId },
    });

    // Add the primary role assignment
    await adminApolloClient.mutate({
      mutation: gql`
        mutation InsertUserRoleAssignment($userId: uuid!, $roleId: uuid!) {
          insertUserRole(object: { userId: $userId, roleId: $roleId }) {
            id
            userId
            roleId
          }
        }
      `,
      variables: { userId, roleId: role.id },
    });

    console.log(
      `✅ Synced hierarchical role assignment: User ${userId} → Role ${directRole}`
    );
  } catch (error) {
    console.error(`❌ Error syncing hierarchical role assignments:`, error);
    throw error;
  }
}

/**
 * Sync user permission overrides with Clerk metadata
 * This ensures the frontend permission system stays in sync with database changes
 */
export async function syncPermissionOverridesToClerk(
  userId: string,
  clerkUserId: string,
  userRole: UserRole
): Promise<void> {
  try {
    console.log(`🔄 Syncing permission overrides to Clerk for user ${userId}`);

    // Get fresh hierarchical permission data from database
    const hierarchicalData = await getHierarchicalPermissionsFromDatabase(userId);

    // Update Clerk user metadata
    const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          role: hierarchicalData.role,
          allowedRoles: hierarchicalData.allowedRoles,
          excludedPermissions: hierarchicalData.excludedPermissions,
          permissionHash: hierarchicalData.permissionHash,
          permissionVersion: hierarchicalData.permissionVersion,
        }
      }),
    });

    if (!clerkResponse.ok) {
      const errorData = await clerkResponse.text();
      throw new Error(`Clerk API error: ${clerkResponse.status} - ${errorData}`);
    }

    console.log(`✅ Successfully synced permission overrides to Clerk for user ${userId}`);
    
    // Create audit log for sync
    await adminApolloClient.mutate({
      mutation: gql`
        mutation LogPermissionClerkSync($input: permissionAuditLogsInsertInput!) {
          insertPermissionAuditLog(object: $input) {
            id
          }
        }
      `,
      variables: {
        input: {
          action: 'CLERK_METADATA_SYNC',
          resource: 'clerk_metadata',
          targetUserId: userId,
        }
      }
    });

  } catch (error) {
    console.error(`❌ Error syncing permission overrides to Clerk:`, error);
    throw error;
  }
}

/**
 * Handle permission override creation with Clerk sync
 */
export async function createPermissionOverrideWithSync(
  userId: string,
  clerkUserId: string,
  userRole: UserRole,
  resource: string,
  operation: string,
  granted: boolean,
  reason: string,
  expiresAt?: string
): Promise<string> {
  try {
    console.log(`🔄 Creating permission override: ${resource}.${operation} = ${granted}`);

    // Create the override in database
    const { data: overrideData } = await adminApolloClient.mutate({
      mutation: gql`
        mutation CreatePermissionOverride($input: permissionOverridesInsertInput!) {
          insertPermissionOverride(object: $input) {
            id
            resource
            operation
            granted
          }
        }
      `,
      variables: {
        input: {
          userId,
          resource,
          operation,
          granted,
          reason,
          expiresAt: expiresAt || null,
        }
      }
    });

    const overrideId = overrideData?.insertPermissionOverride?.id;
    
    if (!overrideId) {
      throw new Error("Failed to create permission override");
    }

    // Sync with Clerk metadata
    await syncPermissionOverridesToClerk(userId, clerkUserId, userRole);

    console.log(`✅ Created permission override ${overrideId} and synced to Clerk`);
    return overrideId;

  } catch (error) {
    console.error("Error creating permission override with sync:", error);
    throw error;
  }
}

/**
 * Handle permission override deletion with Clerk sync
 */
export async function deletePermissionOverrideWithSync(
  overrideId: string,
  userId: string,
  clerkUserId: string,
  userRole: UserRole
): Promise<void> {
  try {
    console.log(`🔄 Deleting permission override: ${overrideId}`);

    // Delete the override from database
    await adminApolloClient.mutate({
      mutation: gql`
        mutation DeletePermissionOverride($id: uuid!) {
          deletePermissionOverrideById(id: $id) {
            id
          }
        }
      `,
      variables: { id: overrideId }
    });

    // Sync with Clerk metadata
    await syncPermissionOverridesToClerk(userId, clerkUserId, userRole);

    console.log(`✅ Deleted permission override ${overrideId} and synced to Clerk`);

  } catch (error) {
    console.error("Error deleting permission override with sync:", error);
    throw error;
  }
}

// lib/permissions/database-permissions.ts
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

export interface DatabasePermission {
  id: string;
  action: string;
  description?: string;
  relatedResource: {
    name: string;
    displayName?: string;
  };
}

export interface UserPermissionData {
  permissions: string[];
  allowedRoles: UserRole[];
  permissionHash: string;
  permissionVersion: string;
}

// Role hierarchy for inheritance
const ROLE_HIERARCHY: UserRole[] = [
  "developer",
  "org_admin",
  "manager",
  "consultant",
  "viewer",
];

// Query to get user's role assignments and permissions
const GET_USER_PERMISSIONS = gql`
  query GetUserPermissions($userId: uuid!) {
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

    # Get role permissions via relationships
    rolePermissions(
      where: {
        grantedToRole: {
          _or: [
            { id: { _in: [] } } # Will be filled dynamically
          ]
        }
      }
    ) {
      id
      grantedPermission {
        id
        action
        description
        relatedResource {
          name
          displayName
        }
      }
      grantedToRole {
        id
        name
        priority
      }
    }
  }
`;

// Query to get permissions for a specific role (fallback method)
const GET_ROLE_PERMISSIONS = gql`
  query GetRolePermissions($roleName: String!) {
    rolePermissions(where: { grantedToRole: { name: { _eq: $roleName } } }) {
      id
      grantedPermission {
        id
        action
        description
        relatedResource {
          name
          displayName
        }
      }
      grantedToRole {
        id
        name
        priority
      }
    }
  }
`;

// Query to get all roles for hierarchy building
const GET_ALL_ROLES = gql`
  query GetAllRoles {
    roles(orderBy: { priority: DESC }) {
      id
      name
      displayName
      priority
      isSystemRole
    }
  }
`;

/**
 * Get all permissions for a user based on their role assignments in the database
 */
export async function getUserPermissionsFromDatabase(
  userId: string
): Promise<UserPermissionData> {
  try {
    console.log(`🔍 Getting permissions for user: ${userId}`);

    // First, get user's role assignments
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
      console.warn(`⚠️ No role assignments found for user ${userId}`);
      return {
        permissions: [],
        allowedRoles: ["viewer"], // Default fallback
        permissionHash: hashPermissions([]),
        permissionVersion: generatePermissionVersion(),
      };
    }

    // Get all role IDs for this user
    const roleIds = userRoles.map((ur: any) => ur.roleId);

    // Get permissions for all assigned roles
    const { data: permissionsData } = await adminApolloClient.query({
      query: gql`
        query GetRolePermissions($roleIds: [uuid!]!) {
          rolePermissions(where: { roleId: { _in: $roleIds } }) {
            id
            grantedPermission {
              id
              action
              description
              relatedResource {
                name
                displayName
              }
            }
            grantedToRole {
              id
              name
              priority
            }
          }
        }
      `,
      variables: { roleIds },
      fetchPolicy: "network-only",
    });

    const rolePermissions = permissionsData?.rolePermissions || [];

    // Extract unique permissions
    const uniquePermissions = new Set<string>();
    rolePermissions.forEach((rp: any) => {
      const perm = rp.grantedPermission;
      const resource = perm.relatedResource.name;
      const permission = `${resource}.${perm.action}`;
      uniquePermissions.add(permission);
    });

    const permissions = Array.from(uniquePermissions).sort();

    // Get allowed roles based on hierarchy
    const userRoleNames = userRoles.map(
      (ur: any) => ur.assignedRole.name as UserRole
    );
    const allowedRoles = await getAllowedRolesFromDatabase(userRoleNames);

    const permissionHash = hashPermissions(permissions);
    const permissionVersion = generatePermissionVersion();

    console.log(
      `✅ Found ${permissions.length} permissions for user ${userId}`
    );
    console.log(`🎭 Allowed roles: ${allowedRoles.join(", ")}`);

    return {
      permissions,
      allowedRoles,
      permissionHash,
      permissionVersion,
    };
  } catch (error) {
    console.error(`❌ Error getting user permissions from database:`, error);
    throw error;
  }
}

/**
 * Get permissions for a specific role by name (fallback method)
 */
export async function getRolePermissionsFromDatabase(
  roleName: UserRole
): Promise<string[]> {
  try {
    console.log(`🔍 Getting permissions for role: ${roleName}`);

    const { data } = await adminApolloClient.query({
      query: GET_ROLE_PERMISSIONS,
      variables: { roleName },
      fetchPolicy: "network-only",
    });

    const rolePermissions = data?.rolePermissions || [];

    const permissions = rolePermissions.map((rp: any) => {
      const perm = rp.grantedPermission;
      const resource = perm.relatedResource.name;
      return `${resource}.${perm.action}`;
    });

    console.log(
      `✅ Found ${permissions.length} permissions for role ${roleName}`
    );
    return permissions.sort();
  } catch (error) {
    console.error(`❌ Error getting role permissions from database:`, error);
    throw error;
  }
}

/**
 * Get allowed roles based on role hierarchy from database
 */
export async function getAllowedRolesFromDatabase(
  userRoleNames: UserRole[]
): Promise<UserRole[]> {
  try {
    // Get all roles with their priorities
    const { data } = await adminApolloClient.query({
      query: GET_ALL_ROLES,
      fetchPolicy: "network-only",
    });

    const allRoles = data?.roles || [];

    // Find the highest priority role for this user
    const userRoles = allRoles.filter((role: any) =>
      userRoleNames.includes(role.name as UserRole)
    );

    if (userRoles.length === 0) {
      return ["viewer"]; // Default fallback
    }

    // Get the highest priority (largest number = highest priority)
    const highestPriority = Math.max(
      ...userRoles.map((role: any) => role.priority || 0)
    );

    // Return all roles with priority <= user's highest priority
    const allowedRoles = allRoles
      .filter((role: any) => (role.priority || 0) <= highestPriority)
      .map((role: any) => role.name as UserRole)
      .filter((roleName: any) => ROLE_HIERARCHY.includes(roleName))
      .sort((a: any, b: any) => {
        const aPriority =
          allRoles.find((r: any) => r.name === a)?.priority || 0;
        const bPriority =
          allRoles.find((r: any) => r.name === b)?.priority || 0;
        return bPriority - aPriority; // Highest priority first
      });

    return allowedRoles;
  } catch (error) {
    console.error(`❌ Error getting allowed roles from database:`, error);
    // Fallback to static hierarchy based on highest role
    const highestRole = getHighestRole(userRoleNames);
    return getStaticAllowedRoles(highestRole);
  }
}

/**
 * Fallback method to get allowed roles using static hierarchy
 */
function getStaticAllowedRoles(userRole: UserRole): UserRole[] {
  const roleIndex = ROLE_HIERARCHY.indexOf(userRole);
  if (roleIndex === -1) return ["viewer"];

  return ROLE_HIERARCHY.slice(roleIndex);
}

/**
 * Get the highest priority role from a list of roles
 */
function getHighestRole(roleNames: UserRole[]): UserRole {
  for (const role of ROLE_HIERARCHY) {
    if (roleNames.includes(role)) {
      return role;
    }
  }
  return "viewer";
}

/**
 * Generate a hash of permissions for integrity checking
 */
export function hashPermissions(permissions: string[]): string {
  const sortedPermissions = [...permissions].sort();
  const permissionString = JSON.stringify(sortedPermissions);
  return crypto
    .createHash("sha256")
    .update(permissionString)
    .digest("hex")
    .substring(0, 32);
}

/**
 * Generate a permission version timestamp
 */
export function generatePermissionVersion(): string {
  return Date.now().toString();
}

/**
 * Validate that a user has a specific permission
 */
export async function userHasPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  try {
    const userPermissions = await getUserPermissionsFromDatabase(userId);
    return userPermissions.permissions.includes(permission);
  } catch (error) {
    console.error(`❌ Error checking user permission:`, error);
    return false;
  }
}

/**
 * Get user's role assignments from database
 */
export async function getUserRoleAssignments(
  userId: string
): Promise<Array<{ roleName: UserRole; roleId: string }>> {
  try {
    const { data } = await adminApolloClient.query({
      query: gql`
        query GetUserRoleAssignments($userId: uuid!) {
          userRoles(where: { userId: { _eq: $userId } }) {
            id
            roleId
            assignedRole {
              id
              name
            }
          }
        }
      `,
      variables: { userId },
      fetchPolicy: "network-only",
    });

    const userRoles = data?.userRoles || [];
    return userRoles.map((ur: any) => ({
      roleName: ur.assignedRole.name as UserRole,
      roleId: ur.roleId,
    }));
  } catch (error) {
    console.error(`❌ Error getting user role assignments:`, error);
    return [];
  }
}

/**
 * Sync user role assignments from direct role field to userroles table
 */
export async function syncUserRoleAssignments(
  userId: string,
  directRole: UserRole
): Promise<void> {
  try {
    console.log(
      `🔄 Syncing role assignments for user ${userId}: ${directRole}`
    );

    // First, get the role ID for the direct role
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

    // Check if user already has this role assignment
    const { data: existingData } = await adminApolloClient.query({
      query: gql`
        query CheckExistingRoleAssignment($userId: uuid!, $roleId: uuid!) {
          userRoles(
            where: { userId: { _eq: $userId }, roleId: { _eq: $roleId } }
          ) {
            id
          }
        }
      `,
      variables: { userId, roleId: role.id },
      fetchPolicy: "network-only",
    });

    if (existingData?.userRoles?.length > 0) {
      console.log(
        `✅ User ${userId} already has role assignment for ${directRole}`
      );
      return;
    }

    // Remove any existing role assignments for this user
    await adminApolloClient.mutate({
      mutation: gql`
        mutation RemoveExistingRoleAssignments($userId: uuid!) {
          deleteUserRoles(where: { userId: { _eq: $userId } }) {
            affectedRows
          }
        }
      `,
      variables: { userId },
    });

    // Add the new role assignment
    await adminApolloClient.mutate({
      mutation: gql`
        mutation InsertUserRoleAssignment($userId: uuid!, $roleId: uuid!) {
          insertUserRolesOne(object: { userId: $userId, roleId: $roleId }) {
            id
            userId
            roleId
          }
        }
      `,
      variables: { userId, roleId: role.id },
    });

    console.log(
      `✅ Synced role assignment: User ${userId} → Role ${directRole}`
    );
  } catch (error) {
    console.error(`❌ Error syncing user role assignments:`, error);
    throw error;
  }
}

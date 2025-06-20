/**
 * @deprecated This file is deprecated in favor of custom-permissions.ts
 * Please use the following import instead:
 * - import { hasMinimumRoleLevel } from '@/lib/auth/custom-permissions';
 *
 * See lib/auth/README.md for migration guide
 */

import { gql } from "@apollo/client";
import { clientApolloClient } from "@/lib/apollo/unified-client";
import { USER_ROLES } from "@/lib/auth/roles";
import { Role } from "@/types/permissions";

// GraphQL query to check resource-level permissions
const CHECK_USER_PERMISSION = gql`
  query CheckUserPermission(
    $userId: String!
    $resource: String!
    $action: String!
  ) {
    check_user_permission(
      userId: $userId
      resource: $resource
      action: $action
    ) {
      granted
      reason
    }
  }
`;

// GraphQL query to get all permissions for a user
const GET_USER_PERMISSIONS = gql`
  query GetUserPermissions($userId: String!) {
    user_permissions(where: { user_id: { _eq: $userId } }) {
      id
      resource
      action
      conditions
      created_at
    }
  }
`;

/**
 * Check if a user has permission to access a specific resource and perform an action
 *
 * @param userId The ID of the user to check
 * @param resource The resource identifier (e.g., "payroll", "client", "user")
 * @param action The action being performed (e.g., "view", "edit", "delete")
 * @returns A promise that resolves to a boolean indicating if the user has permission
 */
export async function canUserAccessResource(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  try {
    const result = await clientApolloClient.query({
      query: CHECK_USER_PERMISSION,
      variables: { userId, resource, action },
      fetchPolicy: "network-only",
    });

    return result.data?.check_user_permission?.granted || false;
  } catch (error) {
    console.error(
      `Error checking permission for ${userId} on ${resource}:${action}`,
      error
    );
    return false;
  }
}

/**
 * Check if a user has permission to access a specific entity by ID
 * This is more specific than canUserAccessResource as it checks access to a specific instance
 *
 * @param userId The ID of the user to check
 * @param resourceType The type of resource (e.g., "payroll", "client", "user")
 * @param resourceId The specific ID of the resource instance
 * @param action The action being performed (e.g., "view", "edit", "delete")
 * @returns A promise that resolves to a boolean indicating if the user has permission
 */
export async function canUserAccessEntity(
  userId: string,
  resourceType: string,
  resourceId: string,
  action: string
): Promise<boolean> {
  const resource = `${resourceType}:${resourceId}`;
  return canUserAccessResource(userId, resource, action);
}

/**
 * Determine if a role can assign another role
 * Based on hierarchical permissions - a role can only assign roles below it
 *
 * @param assignerRole The role of the user assigning a role
 * @param targetRole The role being assigned
 * @returns Boolean indicating if assignment is allowed
 */
export function canAssignRole(assignerRole: Role, targetRole: Role): boolean {
  const assignerLevel = USER_ROLES[assignerRole] || 0;
  const targetLevel = USER_ROLES[targetRole] || 0;

  // A role can only assign roles with a lower level (higher number = higher permission)
  return assignerLevel > targetLevel;
}

/**
 * Check if a user can perform an operation based on their role
 *
 * @param userRole The role of the user
 * @param requiredLevel The minimum role level required
 * @returns Boolean indicating if the user has sufficient permissions
 */
export function hasRoleLevel(userRole: Role, requiredLevel: Role): boolean {
  const userLevel = USER_ROLES[userRole] || 0;
  const required = USER_ROLES[requiredLevel] || 0;

  return userLevel >= required;
}

/**
 * Get all permissions for a user from the database
 *
 * @param userId The ID of the user
 * @returns A promise that resolves to an array of permission objects
 */
export async function getUserPermissions(userId: string) {
  try {
    const result = await clientApolloClient.query({
      query: GET_USER_PERMISSIONS,
      variables: { userId },
      fetchPolicy: "network-only",
    });

    return result.data?.user_permissions || [];
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return [];
  }
}

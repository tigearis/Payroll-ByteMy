// lib/permissions/hierarchical-permissions.ts
import crypto from "crypto";
import {
  GetUserRoleAssignmentsDocument,
  GetRoleByNameDocument,
  RemoveExistingRoleAssignmentsDocument,
  InsertUserRoleAssignmentDocument,
  type GetUserRoleAssignmentsQuery,
  type GetUserRoleAssignmentsQueryVariables,
  type GetRoleByNameQuery,
  type GetRoleByNameQueryVariables,
  type RemoveExistingRoleAssignmentsMutation,
  type RemoveExistingRoleAssignmentsMutationVariables,
  type InsertUserRoleAssignmentMutation,
  type InsertUserRoleAssignmentMutationVariables,
} from "@/domains/users/graphql/generated/graphql";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

// Import generated GraphQL operations

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
    logger.debug('Getting hierarchical permissions for user', {
      namespace: 'hierarchical_permissions',
      operation: 'get_permissions_start',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        timestamp: new Date().toISOString()
      }
    });

    // Get user's role assignments from database
    const { data: userData } = await adminApolloClient.query<
      GetUserRoleAssignmentsQuery,
      GetUserRoleAssignmentsQueryVariables
    >({
      query: GetUserRoleAssignmentsDocument,
      variables: { userId },
      fetchPolicy: "network-only",
    });

    const user = userData?.users?.[0];
    const roleAssignments = user?.roleAssignments || [];
    
    logger.debug('User and role assignments retrieved', {
      namespace: 'hierarchical_permissions',
      operation: 'query_result',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        userFound: !!user,
        roleAssignmentsCount: roleAssignments.length,
        roleAssignments: roleAssignments.map((ra: any) => ({ roleId: ra.roleId, roleName: ra.role.name })),
        timestamp: new Date().toISOString()
      }
    });

    if (roleAssignments.length === 0) {
      logger.warn('No role assignments found for user, defaulting to viewer', {
        namespace: 'hierarchical_permissions',
        operation: 'default_to_viewer',
        classification: DataClassification.INTERNAL,
        metadata: {
          userId,
          timestamp: new Date().toISOString()
        }
      });
      return {
        role: "viewer",
        allowedRoles: ["viewer"],
        excludedPermissions: [],
        permissionHash: generatePermissionHash("viewer", []),
        permissionVersion: generatePermissionVersion(),
      };
    }

    // Get the highest priority role (developer = highest)
    const highestRole = getHighestRoleFromAssignments(roleAssignments);

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

    logger.info('Hierarchical permissions retrieved successfully', {
      namespace: 'hierarchical_permissions',
      operation: 'get_permissions_success',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        role: highestRole,
        allowedRolesCount: allowedRoles.length,
        excludedPermissionsCount: excludedPermissions.length,
        allowedRoles: allowedRoles.join(', '),
        timestamp: new Date().toISOString()
      }
    });

    return {
      role: highestRole,
      allowedRoles,
      excludedPermissions,
      permissionHash,
      permissionVersion,
    };
  } catch (error) {
    logger.error('Error getting hierarchical permissions from database', {
      namespace: 'hierarchical_permissions',
      operation: 'get_permissions_error',
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        userId,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        timestamp: new Date().toISOString()
      }
    });
    throw error;
  }
}

/**
 * Calculate which permissions to exclude based on database vs inherited permissions
 * Simplified version due to permissions system schema limitations
 */
async function calculateExcludedPermissions(
  userId: string,
  userRole: UserRole
): Promise<string[]> {
  try {
    logger.debug('Calculating excluded permissions (simplified)', {
      namespace: 'hierarchical_permissions',
      operation: 'calculate_excluded_permissions_simplified',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        userRole,
        timestamp: new Date().toISOString()
      }
    });

    // For now, return empty array as the full permissions system is not available
    // This means users will have all inherited permissions for their role
    // TODO: Implement full permissions checking when schema is available
    return [];
  } catch (error) {
    logger.error('Error calculating excluded permissions', {
      namespace: 'hierarchical_permissions',
      operation: 'calculate_excluded_permissions_error',
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        userId,
        userRole,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        timestamp: new Date().toISOString()
      }
    });
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
function getHighestRoleFromAssignments(roleAssignments: any[]): UserRole {
  // Find the role with highest priority (lowest index in hierarchy)
  for (const hierarchyRole of ROLE_HIERARCHY) {
    const hasRole = roleAssignments.some(
      (ur: any) => ur.role.name === hierarchyRole
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
  // Safety check: ensure excludedPermissions is an array
  const safeExcludedPermissions = Array.isArray(excludedPermissions) ? excludedPermissions : [];
  
  if (!Array.isArray(excludedPermissions)) {
    console.warn('hasHierarchicalPermission: excludedPermissions is not an array, using empty array');
  }

  // Check if permission is explicitly excluded
  if (isPermissionExcluded(permission, safeExcludedPermissions)) {
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
  // Safety check: ensure excludedPermissions is an array
  const safeExcludedPermissions = Array.isArray(excludedPermissions) ? excludedPermissions : [];
  
  if (!Array.isArray(excludedPermissions)) {
    console.warn('hasAnyHierarchicalPermission: excludedPermissions is not an array, using empty array');
  }

  return permissions.some((permission: any) =>
    hasHierarchicalPermission(userRole, permission, safeExcludedPermissions)
  );
}

/**
 * Check if permission is excluded
 */
function isPermissionExcluded(
  permission: string,
  excludedPermissions: string[]
): boolean {
  // Safety check: ensure excludedPermissions is an array
  if (!Array.isArray(excludedPermissions)) {
    console.warn('isPermissionExcluded: excludedPermissions is not an array, defaulting to empty array');
    return false;
  }

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
  // Safety check: ensure excludedPermissions is an array
  const safeExcludedPermissions = Array.isArray(excludedPermissions) ? excludedPermissions : [];
  
  if (!Array.isArray(excludedPermissions)) {
    console.warn('getEffectivePermissions: excludedPermissions is not an array, using empty array');
  }

  const inheritedPermissions = getInheritedPermissions(role);

  // Filter out excluded permissions
  return inheritedPermissions.filter(
    (permission: any) => !isPermissionExcluded(permission, safeExcludedPermissions)
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
    logger.info('Syncing hierarchical role assignments for user', {
      namespace: 'hierarchical_permissions',
      operation: 'sync_role_assignments_start',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        directRole,
        timestamp: new Date().toISOString()
      }
    });

    // Get the role ID for the direct role
    const { data: roleData } = await adminApolloClient.query<
      GetRoleByNameQuery,
      GetRoleByNameQueryVariables
    >({
      query: GetRoleByNameDocument,
      variables: { roleName: directRole },
      fetchPolicy: "network-only",
    });

    const role = roleData?.roles?.[0];
    if (!role) {
      logger.error('Role not found in database', {
        namespace: 'hierarchical_permissions',
        operation: 'role_not_found_error',
        classification: DataClassification.INTERNAL,
        metadata: {
          directRole,
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    // Remove existing role assignments
    await adminApolloClient.mutate<
      RemoveExistingRoleAssignmentsMutation,
      RemoveExistingRoleAssignmentsMutationVariables
    >({
      mutation: RemoveExistingRoleAssignmentsDocument,
      variables: { userId },
    });

    // Add the primary role assignment
    await adminApolloClient.mutate<
      InsertUserRoleAssignmentMutation,
      InsertUserRoleAssignmentMutationVariables
    >({
      mutation: InsertUserRoleAssignmentDocument,
      variables: { userId, roleId: role.id },
    });

    logger.info('Synced hierarchical role assignment successfully', {
      namespace: 'hierarchical_permissions',
      operation: 'sync_role_assignments_success',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        directRole,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error syncing hierarchical role assignments', {
      namespace: 'hierarchical_permissions',
      operation: 'sync_role_assignments_error',
      classification: DataClassification.INTERNAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        userId,
        directRole,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        timestamp: new Date().toISOString()
      }
    });
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
  userRole: UserRole,
  maxRetries: number = 3
): Promise<void> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug('Syncing permission overrides to Clerk', {
        namespace: 'hierarchical_permissions',
        operation: 'sync_clerk_overrides',
        classification: DataClassification.INTERNAL,
        metadata: {
          userId,
          attempt,
          maxRetries,
          timestamp: new Date().toISOString()
        }
      });

      // Get fresh hierarchical permission data from database
      let hierarchicalData;
      try {
        hierarchicalData = await getHierarchicalPermissionsFromDatabase(userId);
        logger.debug('Retrieved hierarchical data for Clerk sync', {
          namespace: 'hierarchical_permissions',
          operation: 'get_hierarchical_data',
          classification: DataClassification.INTERNAL,
          metadata: {
            userId,
            excludedPermissionsCount: hierarchicalData.excludedPermissions.length,
            allowedRolesCount: hierarchicalData.allowedRoles.length,
            timestamp: new Date().toISOString()
          }
        });
      } catch (dataError: any) {
        throw new Error(`Failed to get hierarchical permissions: ${dataError.message}`);
      }

      // Validate Clerk secret key
      if (!process.env.CLERK_SECRET_KEY) {
        throw new Error('CLERK_SECRET_KEY environment variable is not set');
      }

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
            lastSyncAt: new Date().toISOString(),
          }
        }),
      });

      if (!clerkResponse.ok) {
        const errorData = await clerkResponse.text();
        const error = new Error(`Clerk API error (${clerkResponse.status}): ${errorData}`);
        
        // Determine if this is a retryable error
        const isRetryable = clerkResponse.status >= 500 || clerkResponse.status === 429;
        
        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }
        
        lastError = error;
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
        logger.warn('Retryable error during Clerk sync, waiting before retry', {
          namespace: 'hierarchical_permissions',
          operation: 'clerk_sync_retry_wait',
          classification: DataClassification.INTERNAL,
          error: error.message,
          metadata: {
            userId,
            attempt,
            maxRetries,
            delayMs,
            timestamp: new Date().toISOString()
          }
        });
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }

      logger.info('Successfully synced permission overrides to Clerk', {
        namespace: 'hierarchical_permissions',
        operation: 'clerk_sync_success',
        classification: DataClassification.INTERNAL,
        metadata: {
          userId,
          attempt,
          timestamp: new Date().toISOString()
        }
      });
      
      // Note: Audit logging temporarily disabled due to schema limitations
      logger.info('Clerk sync successful - audit logging temporarily disabled', {
        namespace: 'hierarchical_permissions',
        operation: 'clerk_sync_audit_disabled',
        classification: DataClassification.INTERNAL,
        metadata: {
          userId,
          action: 'CLERK_METADATA_SYNC',
          resource: 'clerk_metadata',
          timestamp: new Date().toISOString()
        }
      });

      return; // Success - exit retry loop

    } catch (error: any) {
      lastError = error;
      logger.error('Clerk sync attempt failed', {
        namespace: 'hierarchical_permissions',
        operation: 'clerk_sync_attempt_failed',
        classification: DataClassification.INTERNAL,
        error: error.message,
        metadata: {
          userId,
          attempt,
          maxRetries,
          timestamp: new Date().toISOString()
        }
      });
      
      if (attempt === maxRetries) {
        logger.error('All Clerk sync attempts failed', {
          namespace: 'hierarchical_permissions',
          operation: 'clerk_sync_all_failed',
          classification: DataClassification.INTERNAL,
          metadata: {
            userId,
            maxRetries,
            timestamp: new Date().toISOString()
          }
        });
        break;
      }
      
      // Wait before retry (if it's not the last attempt)
      if (attempt < maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        logger.debug('Waiting before retry attempt', {
          namespace: 'hierarchical_permissions',
          operation: 'retry_delay',
          classification: DataClassification.INTERNAL,
          metadata: {
            userId,
            attempt,
            delayMs,
            timestamp: new Date().toISOString()
          }
        });
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  // If we get here, all retries failed
  const contextualError = new Error(
    `Failed to sync permissions to Clerk after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
  );
  contextualError.cause = lastError;
  throw contextualError;
}

/**
 * Handle permission override creation with Clerk sync
 * Note: Temporarily simplified due to permissions system schema limitations
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
  logger.warn('Permission override creation temporarily disabled', {
    namespace: 'hierarchical_permissions',
    operation: 'create_permission_override_disabled',
    classification: DataClassification.CONFIDENTIAL,
    metadata: {
      userId,
      resource,
      operation: operation,
      granted,
      reason: 'Schema limitations - permission_overrides table not available',
      timestamp: new Date().toISOString()
    }
  });
  
  // Return a placeholder ID for now
  // TODO: Implement when permission overrides schema is available
  return crypto.randomUUID();
}

/**
 * Handle permission override deletion with Clerk sync
 * Note: Temporarily simplified due to permissions system schema limitations
 */
export async function deletePermissionOverrideWithSync(
  overrideId: string,
  userId: string,
  clerkUserId: string,
  userRole: UserRole
): Promise<void> {
  logger.warn('Permission override deletion temporarily disabled', {
    namespace: 'hierarchical_permissions',
    operation: 'delete_permission_override_disabled',
    classification: DataClassification.CONFIDENTIAL,
    metadata: {
      overrideId,
      userId,
      reason: 'Schema limitations - permission_overrides table not available',
      timestamp: new Date().toISOString()
    }
  });
  
  // TODO: Implement when permission overrides schema is available
}

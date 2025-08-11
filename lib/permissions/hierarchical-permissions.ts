// lib/permissions/hierarchical-permissions.ts
import crypto from "crypto";
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

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
    const { data: userData } = await adminApolloClient.query({
      query: gql`
        query GetUserRoleAssignments($userId: uuid!) {
          roleAssignments(where: { userId: { _eq: $userId } }) {
            id
            roleId
            role {
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

    const roleAssignments = userData?.roleAssignments || [];

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
          roleAssignments(where: { userId: { _eq: $userId } }) {
            roleId
          }
        }
      `,
      variables: { userId },
      fetchPolicy: "network-only",
    });

    const roleIds =
      permissionsData?.roleAssignments?.map((ur: any) => ur.roleId) || [];

    if (roleIds.length === 0) {
      return [];
    }

    // Get actual permissions from role_permissions table
    const { data: actualPermissionsData } = await adminApolloClient.query({
      query: gql`
        query GetActualRolePermissions($roleIds: [uuid!]!) {
          rolePermissions(where: { roleId: { _in: $roleIds } }) {
            permission {
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
          `${rp.permission.relatedResource.name}.${rp.permission.action}`
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
      
      // Create audit log for successful sync
      try {
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
      } catch (auditError) {
        logger.warn('Failed to create audit log for Clerk sync', {
          namespace: 'hierarchical_permissions',
          operation: 'audit_log_warning',
          classification: DataClassification.INTERNAL,
          error: auditError instanceof Error ? auditError.message : 'Unknown error',
          metadata: {
            userId,
            timestamp: new Date().toISOString()
          }
        });
        // Don't fail the entire operation for audit log failures
      }

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
  let overrideId: string | null = null;
  
  try {
    logger.info('Creating permission override', {
      namespace: 'hierarchical_permissions',
      operation: 'create_permission_override',
      classification: DataClassification.CONFIDENTIAL,
      metadata: {
        userId,
        resource,
        operation: operation,
        granted,
        timestamp: new Date().toISOString()
      }
    });

    // Step 1: Create the override in database
    try {
      const { data: overrideData, errors } = await adminApolloClient.mutate({
        mutation: gql`
          mutation CreatePermissionOverride($input: PermissionOverridesInsertInput!) {
            insertPermissionOverrides(objects: [$input]) {
              returning {
                id
                resource
                operation
                granted
              }
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

      if (errors && errors.length > 0) {
        throw new Error(`Database error: ${errors.map(e => e.message).join(', ')}`);
      }

      overrideId = overrideData?.insertPermissionOverrides?.returning?.[0]?.id;
      
      if (!overrideId) {
        throw new Error("Failed to create permission override - no ID returned from database");
      }

      logger.info('Created permission override in database', {
        namespace: 'hierarchical_permissions',
        operation: 'override_created_database',
        classification: DataClassification.CONFIDENTIAL,
        metadata: {
          overrideId,
          userId,
          resource,
          granted,
          timestamp: new Date().toISOString()
        }
      });
    } catch (dbError: any) {
      logger.error('Database operation failed for permission override', {
        namespace: 'hierarchical_permissions',
        operation: 'override_database_error',
        classification: DataClassification.CONFIDENTIAL,
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        metadata: {
          userId,
          resource,
          operation: operation,
          errorName: dbError instanceof Error ? dbError.name : 'UnknownError',
          timestamp: new Date().toISOString()
        }
      });
      throw new Error(`Database operation failed: ${dbError.message}`);
    }

    // Step 2: Sync with Clerk metadata (with retry)
    try {
      await syncPermissionOverridesToClerk(userId, clerkUserId, userRole);
      logger.info('Successfully synced permission override to Clerk', {
        namespace: 'hierarchical_permissions',
        operation: 'override_clerk_sync_success',
        classification: DataClassification.CONFIDENTIAL,
        metadata: {
          overrideId,
          userId,
          timestamp: new Date().toISOString()
        }
      });
    } catch (clerkError: any) {
      logger.error('Clerk sync failed for permission override', {
        namespace: 'hierarchical_permissions',
        operation: 'override_clerk_sync_failed',
        classification: DataClassification.CONFIDENTIAL,
        error: clerkError instanceof Error ? clerkError.message : 'Unknown error',
        metadata: {
          overrideId,
          userId,
          errorName: clerkError instanceof Error ? clerkError.name : 'UnknownError',
          timestamp: new Date().toISOString()
        }
      });
      
      // Rollback: Delete the database record if Clerk sync fails
      try {
        logger.warn('Rolling back database override due to Clerk sync failure', {
          namespace: 'hierarchical_permissions',
          operation: 'override_rollback_start',
          classification: DataClassification.CONFIDENTIAL,
          metadata: {
            overrideId,
            userId,
            timestamp: new Date().toISOString()
          }
        });
        await adminApolloClient.mutate({
          mutation: gql`
            mutation RollbackPermissionOverride($id: uuid!) {
              deletePermissionOverridesByPk(id: $id) {
                id
              }
            }
          `,
          variables: { id: overrideId }
        });
        logger.info('Successfully rolled back permission override', {
          namespace: 'hierarchical_permissions',
          operation: 'override_rollback_success',
          classification: DataClassification.CONFIDENTIAL,
          metadata: {
            overrideId,
            userId,
            timestamp: new Date().toISOString()
          }
        });
      } catch (rollbackError) {
        logger.error('Failed to rollback permission override', {
          namespace: 'hierarchical_permissions',
          operation: 'override_rollback_failed',
          classification: DataClassification.CONFIDENTIAL,
          error: rollbackError instanceof Error ? rollbackError.message : 'Unknown error',
          metadata: {
            overrideId,
            userId,
            errorName: rollbackError instanceof Error ? rollbackError.name : 'UnknownError',
            timestamp: new Date().toISOString()
          }
        });
        // Don't throw rollback error - the original Clerk error is more important
      }
      
      throw new Error(`Clerk synchronization failed: ${clerkError.message}. Database changes have been rolled back.`);
    }

    return overrideId;

  } catch (error: any) {
    logger.error('Error creating permission override', {
      namespace: 'hierarchical_permissions',
      operation: 'create_override_error',
      classification: DataClassification.CONFIDENTIAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        userId,
        resource,
        operation: operation,
        granted,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        timestamp: new Date().toISOString()
      }
    });
    
    // Enhance error message with context
    const contextualError = new Error(
      `Failed to create permission override for ${resource}.${operation} (${granted ? 'granted' : 'denied'}): ${error.message}`
    );
    contextualError.cause = error;
    throw contextualError;
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
  let overrideBackup: any = null;
  
  try {
    logger.info('Deleting permission override', {
      namespace: 'hierarchical_permissions',
      operation: 'delete_permission_override',
      classification: DataClassification.CONFIDENTIAL,
      metadata: {
        overrideId,
        userId,
        timestamp: new Date().toISOString()
      }
    });

    // Step 1: Get override details for potential rollback
    try {
      const { data: backupData } = await adminApolloClient.query({
        query: gql`
          query GetOverrideForBackup($id: uuid!) {
            permissionOverridesByPk(id: $id) {
              id
              userId
              resource
              operation
              granted
              reason
              expiresAt
            }
          }
        `,
        variables: { id: overrideId },
        fetchPolicy: 'network-only'
      });

      overrideBackup = backupData?.permissionOverridesByPk;
      
      if (!overrideBackup) {
        throw new Error(`Permission override ${overrideId} not found - may have been already deleted`);
      }

      logger.debug('Backed up override data for deletion', {
        namespace: 'hierarchical_permissions',
        operation: 'override_backup_success',
        classification: DataClassification.CONFIDENTIAL,
        metadata: {
          overrideId,
          resource: overrideBackup.resource,
          operation: overrideBackup.operation,
          timestamp: new Date().toISOString()
        }
      });
    } catch (backupError: any) {
      logger.error('Failed to backup override for deletion', {
        namespace: 'hierarchical_permissions',
        operation: 'override_backup_failed',
        classification: DataClassification.CONFIDENTIAL,
        error: backupError instanceof Error ? backupError.message : 'Unknown error',
        metadata: {
          overrideId,
          errorName: backupError instanceof Error ? backupError.name : 'UnknownError',
          timestamp: new Date().toISOString()
        }
      });
      throw new Error(`Failed to backup override data: ${backupError.message}`);
    }

    // Step 2: Delete the override from database
    try {
      const { data: deleteData, errors } = await adminApolloClient.mutate({
        mutation: gql`
          mutation DeletePermissionOverride($id: uuid!) {
            deletePermissionOverridesByPk(id: $id) {
              id
            }
          }
        `,
        variables: { id: overrideId }
      });

      if (errors && errors.length > 0) {
        throw new Error(`Database error: ${errors.map(e => e.message).join(', ')}`);
      }

      if (!deleteData?.deletePermissionOverridesByPk?.id) {
        throw new Error("Failed to delete permission override - no confirmation from database");
      }

      logger.info('Deleted permission override from database', {
        namespace: 'hierarchical_permissions',
        operation: 'override_deleted_database',
        classification: DataClassification.CONFIDENTIAL,
        metadata: {
          overrideId,
          userId,
          timestamp: new Date().toISOString()
        }
      });
    } catch (dbError: any) {
      logger.error('Database deletion failed for permission override', {
        namespace: 'hierarchical_permissions',
        operation: 'override_deletion_failed',
        classification: DataClassification.CONFIDENTIAL,
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        metadata: {
          overrideId,
          userId,
          errorName: dbError instanceof Error ? dbError.name : 'UnknownError',
          timestamp: new Date().toISOString()
        }
      });
      throw new Error(`Database deletion failed: ${dbError.message}`);
    }

    // Step 3: Sync with Clerk metadata
    try {
      await syncPermissionOverridesToClerk(userId, clerkUserId, userRole);
      logger.info('Successfully synced override deletion to Clerk', {
        namespace: 'hierarchical_permissions',
        operation: 'override_deletion_clerk_sync_success',
        classification: DataClassification.CONFIDENTIAL,
        metadata: {
          overrideId,
          userId,
          timestamp: new Date().toISOString()
        }
      });
    } catch (clerkError: any) {
      logger.error('Clerk sync failed after deleting permission override', {
        namespace: 'hierarchical_permissions',
        operation: 'override_deletion_clerk_sync_failed',
        classification: DataClassification.CONFIDENTIAL,
        error: clerkError instanceof Error ? clerkError.message : 'Unknown error',
        metadata: {
          overrideId,
          userId,
          errorName: clerkError instanceof Error ? clerkError.name : 'UnknownError',
          timestamp: new Date().toISOString()
        }
      });
      
      // Rollback: Recreate the database record if Clerk sync fails
      if (overrideBackup) {
        try {
          logger.warn('Rolling back deletion - recreating override', {
            namespace: 'hierarchical_permissions',
            operation: 'override_deletion_rollback_start',
            classification: DataClassification.CONFIDENTIAL,
            metadata: {
              overrideId,
              userId,
              timestamp: new Date().toISOString()
            }
          });
          await adminApolloClient.mutate({
            mutation: gql`
              mutation RestorePermissionOverride($input: PermissionOverridesInsertInput!) {
                insertPermissionOverrides(objects: [$input]) {
                  returning {
                    id
                  }
                }
              }
            `,
            variables: {
              input: {
                id: overrideBackup.id,
                userId: overrideBackup.userId,
                resource: overrideBackup.resource,
                operation: overrideBackup.operation,
                granted: overrideBackup.granted,
                reason: overrideBackup.reason,
                expiresAt: overrideBackup.expiresAt,
              }
            }
          });
          logger.info('Successfully restored permission override', {
            namespace: 'hierarchical_permissions',
            operation: 'override_deletion_rollback_success',
            classification: DataClassification.CONFIDENTIAL,
            metadata: {
              overrideId,
              userId,
              timestamp: new Date().toISOString()
            }
          });
        } catch (rollbackError) {
          logger.error('Failed to restore permission override during rollback', {
            namespace: 'hierarchical_permissions',
            operation: 'override_deletion_rollback_failed',
            classification: DataClassification.CONFIDENTIAL,
            error: rollbackError instanceof Error ? rollbackError.message : 'Unknown error',
            metadata: {
              overrideId,
              userId,
              errorName: rollbackError instanceof Error ? rollbackError.name : 'UnknownError',
              timestamp: new Date().toISOString()
            }
          });
          // Don't throw rollback error - the original Clerk error is more important
        }
      }
      
      throw new Error(`Clerk synchronization failed: ${clerkError.message}. Database changes have been rolled back.`);
    }

  } catch (error: any) {
    logger.error('Error deleting permission override', {
      namespace: 'hierarchical_permissions',
      operation: 'delete_override_error',
      classification: DataClassification.CONFIDENTIAL,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        overrideId,
        userId,
        errorName: error instanceof Error ? error.name : 'UnknownError',
        timestamp: new Date().toISOString()
      }
    });
    
    // Enhance error message with context
    const contextualError = new Error(
      `Failed to delete permission override ${overrideId}: ${error.message}`
    );
    contextualError.cause = error;
    throw contextualError;
  }
}

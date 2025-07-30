import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { auditLogger } from '@/lib/audit/audit-logger';
import { getJWTClaims } from '@/lib/auth';
import { hasRolePermission } from '@/lib/permissions/hierarchical-permissions';
import { 
  DeleteUserDocument,
  DeactivateUserWithReasonDocument,
  type User 
} from '../graphql/generated/graphql';

/**
 * Delete user function (soft delete - deactivates user)
 */
export async function deleteUser(userId: string, reason?: string): Promise<boolean> {
  try {
    const claims = await getJWTClaims();
    if (!claims?.databaseId) {
      throw new Error('User not authenticated');
    }

    // Check permission to delete users
    if (!hasRolePermission(claims.defaultRole || 'viewer', 'users', 'delete')) {
      throw new Error('Insufficient permissions to delete user');
    }

    // Perform soft delete (deactivation)
    const result = await executeTypedQuery(DeactivateUserWithReasonDocument, {
      userId,
      reason: reason || 'User deactivated by admin',
      deactivatedBy: claims.databaseId,
      deactivatedByString: claims.databaseId
    }) as { updateUserById: User | null };

    if (!result?.updateUserById) {
      throw new Error('Failed to deactivate user');
    }

    // Log user deactivation for audit
    await auditLogger.dataModification(
      claims.databaseId,
      'DELETE',
      'user',
      userId,
      undefined,
      { reason, action: 'soft_delete' }
    );

    console.log(`✅ User deactivated successfully: ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    
    // Log failed deletion attempt
    try {
      const claims = await getJWTClaims();
      if (claims?.databaseId) {
        await auditLogger.log({
          userId: claims.databaseId,
          action: 'USER_DELETE_FAILED',
          entityType: 'user',
          entityId: userId,
          success: false,
          metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
    } catch (auditError) {
      console.error('Failed to log deletion failure:', auditError);
    }
    
    return false;
  }
}

/**
 * Check if current user can edit the specified user
 */
export async function canEditUser(user: User): Promise<boolean> {
  try {
    const claims = await getJWTClaims();
    if (!claims?.defaultRole) {
      return false;
    }

    // Check permission to update users
    if (!hasRolePermission(claims.defaultRole, 'users', 'update')) {
      return false;
    }

    // Additional checks:
    // - Managers can only edit users assigned to them
    // - Users cannot edit users with higher roles
    // - System admin users require developer role to edit
    if (claims.defaultRole === 'manager' && user.managerId !== claims.databaseId) {
      return false;
    }

    // Role hierarchy check - prevent editing users with equal or higher roles
    const roleHierarchy = ['viewer', 'consultant', 'manager', 'org_admin', 'developer'];
    const currentRoleIndex = roleHierarchy.indexOf(claims.defaultRole);
    const targetRoleIndex = roleHierarchy.indexOf(user.role);
    
    if (targetRoleIndex >= currentRoleIndex && claims.defaultRole !== 'developer') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking edit permissions:', error);
    return false;
  }
}

/**
 * Check if current user can delete the specified user
 */
export async function canDeleteUser(user: User): Promise<boolean> {
  try {
    const claims = await getJWTClaims();
    if (!claims?.defaultRole) {
      return false;
    }

    // Only developers and org_admin can delete users
    if (!['developer', 'org_admin'].includes(claims.defaultRole)) {
      return false;
    }

    // Check permission to delete users
    if (!hasRolePermission(claims.defaultRole, 'users', 'delete')) {
      return false;
    }

    // Additional safety checks:
    // - Cannot delete yourself
    // - Cannot delete users with higher or equal roles (except developers)
    if (user.id === claims.databaseId) {
      return false;
    }

    const roleHierarchy = ['viewer', 'consultant', 'manager', 'org_admin', 'developer'];
    const currentRoleIndex = roleHierarchy.indexOf(claims.defaultRole);
    const targetRoleIndex = roleHierarchy.indexOf(user.role);
    
    if (targetRoleIndex >= currentRoleIndex && claims.defaultRole !== 'developer') {
      return false;
    }

    // Cannot delete other developer accounts unless you're a developer
    if (user.role === 'developer' && claims.defaultRole !== 'developer') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking delete permissions:', error);
    return false;
  }
}

/**
 * Synchronous version of canEditUser using cached permissions
 * For UI components that need immediate permission checks
 */
export function canEditUserSync(user: User, currentRole?: string, currentUserId?: string): boolean {
  if (!currentRole) return false;
  
  // Check permission to update users
  if (!hasRolePermission(currentRole, 'users', 'update')) {
    return false;
  }

  // Additional checks:
  // - Managers can only edit users assigned to them
  // - Users cannot edit users with higher roles
  if (currentRole === 'manager' && user.managerId !== currentUserId) {
    return false;
  }

  // Role hierarchy check
  const roleHierarchy = ['viewer', 'consultant', 'manager', 'org_admin', 'developer'];
  const currentRoleIndex = roleHierarchy.indexOf(currentRole);
  const targetRoleIndex = roleHierarchy.indexOf(user.role);
  
  if (targetRoleIndex >= currentRoleIndex && currentRole !== 'developer') {
    return false;
  }

  return true;
}

/**
 * Synchronous version of canDeleteUser using cached permissions
 * For UI components that need immediate permission checks
 */
export function canDeleteUserSync(user: User, currentRole?: string, currentUserId?: string): boolean {
  if (!currentRole || !currentUserId) return false;
  
  // Only developers and org_admin can delete users
  if (!['developer', 'org_admin'].includes(currentRole)) {
    return false;
  }

  // Check permission to delete users
  if (!hasRolePermission(currentRole, 'users', 'delete')) {
    return false;
  }

  // Cannot delete yourself
  if (user.id === currentUserId) {
    return false;
  }

  // Role hierarchy check
  const roleHierarchy = ['viewer', 'consultant', 'manager', 'org_admin', 'developer'];
  const currentRoleIndex = roleHierarchy.indexOf(currentRole);
  const targetRoleIndex = roleHierarchy.indexOf(user.role);
  
  if (targetRoleIndex >= currentRoleIndex && currentRole !== 'developer') {
    return false;
  }

  // Cannot delete other developer accounts unless you're a developer
  if (user.role === 'developer' && currentRole !== 'developer') {
    return false;
  }

  return true;
}
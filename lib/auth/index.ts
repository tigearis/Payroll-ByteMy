/**
 * Simplified Authentication Module Exports
 * 
 * Clean barrel export for the simplified authentication system.
 * Replaces the complex lib/auth/index.ts with basic auth functionality.
 */

// Core authentication context and hooks
export {
  SimpleAuthProvider as AuthProvider,
  useSimpleAuth as useAuthContext,
  useSimpleAuth as useEnhancedAuth,
  type SimpleAuthContextType as AuthContextType,
} from './simple-auth-context';

// Simplified permissions and roles
export {
  type SimpleRole as Role,
  SIMPLE_ROLE_HIERARCHY as ROLE_HIERARCHY,
  hasRoleLevel,
  isAdmin,
  isManager,
  isDeveloper,
  canManageUsers,
  canManageSystem,
  getAccessLevels,
  sanitizeRole,
  getRoleDisplayName,
  getAssignableRoles,
  getRequiredRole,
  isPublicRoute,
  SIMPLE_ROUTE_REQUIREMENTS as ROUTE_REQUIREMENTS,
} from './simple-permissions';

// Client token utilities (preserved)
export {
  getClientToken,
  refreshClientToken,
  clearClientTokens,
} from './client-token-utils';

// Note: Server-only token utilities (getHasuraToken, etc.) should be imported directly from './token-utils' in server contexts

// Clerk re-exports for convenience
export { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

// Type utilities
export type {
  SimpleRole,
  SimpleAccessLevels,
  SimpleAuditEvent,
  SimpleAuditLog,
} from './simple-permissions';

// Backward compatibility type aliases
export type Permission = string; // Generic permission string
export type EnhancedAuthContextType = SimpleAuthContextType;

// Additional backward compatibility exports - reusing the same function
export { useSimpleAuth as useEnhancedPermissions } from './simple-auth-context';

/**
 * Migration helpers for transitioning from complex to simple auth
 */

// Import hasRoleLevel directly to ensure it's available
import { hasRoleLevel as checkRoleLevel } from './simple-permissions';

// Permission to role mapping
const permissionToRoleMap: Record<string, SimpleRole> = {
  'staff:read': 'manager',
  'staff:write': 'manager', 
  'staff:delete': 'org_admin',
  'client:read': 'consultant',
  'client:write': 'manager',
  'client:delete': 'org_admin',
  'admin:manage': 'org_admin',
  'settings:write': 'org_admin',
  'developer:access': 'developer',
  'payroll:read': 'consultant',
  'payroll:write': 'manager',
  'audit:read': 'org_admin',
  'security:manage': 'org_admin',
};

// Legacy permission checker function
function hasPermission(permission: string, userRole: SimpleRole): boolean {
  const requiredRole = permissionToRoleMap[permission];
  if (!requiredRole) {
    console.warn(`Unknown permission: ${permission}, defaulting to admin`);
    return checkRoleLevel(userRole, 'org_admin');
  }
  return checkRoleLevel(userRole, requiredRole);
}

export const migration = {
  permissionToRole: permissionToRoleMap,
  hasPermission,
};
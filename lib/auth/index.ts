// Authentication module barrel export
// This provides a clean import interface for all authentication functionality

export { 
  useAuthContext,
  useEnhancedAuth,
  EnhancedAuthProvider as AuthProvider,
  type EnhancedAuthContextType as AuthContextType,
  type EffectivePermission,
  type UserPermissionOverride
} from './enhanced-auth-context';

export {
  type Role,
  type Permission,
  ROLES,
  PERMISSIONS,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  getPermissionsForRole,
  hasRoleLevel,
  sanitizeUserRole
} from './permissions';

// Re-export commonly used Clerk hooks for convenience
export { useAuth, useUser } from '@clerk/nextjs';
export { auth } from '@clerk/nextjs/server';
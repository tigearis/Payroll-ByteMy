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

// Authentication guards and components
export {
  SimpleAuthGuard as AuthGuard,
  AdminOnly,
  ManagerOnly,
  DeveloperOnly,
  AuthenticatedOnly,
} from '../components/auth/simple-auth-guard';

// Hooks for authentication
export {
  useAuth,
  useRoleChecks,
  useAuthStatus,
  useUserInfo,
  useAdminUtils,
  useSignOut,
  useRouteAccess,
  usePermissions,
  useSimpleAuth as useEnhancedPermissions, // Backward compatibility
} from '../hooks/use-simple-auth';

// API authentication
export {
  withAuth,
  withAdminAuth,
  withManagerAuth,
  withDeveloperAuth,
  withBasicAuth,
  requireRole,
  requireAdmin,
  requireManager,
  rateLimit,
  type SimpleSession as AuthenticatedUser,
  type SimpleAuthOptions as AuthOptions,
} from './simple-api-auth';

// Basic audit logging
export {
  logAuditEvent,
  getAuditLogs,
  getAuditStats,
  cleanupAuditLogs,
  detectSuspiciousActivity,
  exportAuditLogs,
  configureAudit,
  type AuditConfig,
} from './basic-audit';

// Audit event types
export {
  type SimpleAuditEvent as AuditEvent,
  type SimpleAuditLog as AuditLog,
  createAuditLog,
} from './simple-permissions';

// Token utilities (preserved from original system)
export {
  getHasuraToken,
  getClerkUserId,
  validateTokenClaims,
  extractUserIdFromToken,
  type TokenValidationResult,
} from './token-utils';

// Client token utilities (preserved)
export {
  getClientToken,
  refreshClientToken,
  clearClientTokens,
} from './client-token-utils';

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
export type Role = SimpleRole;

/**
 * Migration helpers for transitioning from complex to simple auth
 */
export const migration = {
  // Map complex permissions to simple role checks
  permissionToRole: {
    'staff:read': 'manager',
    'staff:write': 'manager', 
    'staff:delete': 'org_admin',
    'client:read': 'consultant',
    'client:write': 'manager',
    'client:delete': 'org_admin',
    'admin:manage': 'org_admin',
    'settings:write': 'org_admin',
    'developer:access': 'developer',
  } as Record<string, SimpleRole>,
  
  // Legacy permission checker (for gradual migration)
  hasPermission: (permission: string, userRole: SimpleRole): boolean => {
    const requiredRole = migration.permissionToRole[permission];
    if (!requiredRole) {
      console.warn(`Unknown permission: ${permission}, defaulting to admin`);
      return hasRoleLevel(userRole, 'org_admin');
    }
    return hasRoleLevel(userRole, requiredRole);
  },
};

/**
 * Configuration constants
 */
export const AUTH_CONFIG = {
  // Default role for new users
  DEFAULT_ROLE: 'viewer' as SimpleRole,
  
  // Session timeout (in milliseconds)
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  
  // Rate limiting defaults
  DEFAULT_RATE_LIMIT: {
    requests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Audit retention
  AUDIT_RETENTION_DAYS: 30,
  
  // Security settings
  REQUIRE_DATABASE_USER: true,
  ENABLE_AUDIT_LOGGING: true,
  ENABLE_SECURITY_MONITORING: true,
} as const;

/**
 * Utility functions for common auth patterns
 */
export const authUtils = {
  /**
   * Check if user can perform action on resource
   */
  canPerformAction: (
    userRole: SimpleRole, 
    action: 'read' | 'write' | 'delete', 
    resource: 'staff' | 'client' | 'admin'
  ): boolean => {
    const permission = `${resource}:${action}`;
    return migration.hasPermission(permission, userRole);
  },
  
  /**
   * Get user capabilities summary
   */
  getUserCapabilities: (userRole: SimpleRole) => {
    const accessLevels = getAccessLevels(userRole);
    return {
      ...accessLevels,
      roleLevel: SIMPLE_ROLE_HIERARCHY[userRole],
      roleName: getRoleDisplayName(userRole),
      assignableRoles: getAssignableRoles(userRole),
    };
  },
  
  /**
   * Format role for display
   */
  formatRole: (role: SimpleRole): string => {
    return getRoleDisplayName(role);
  },
  
  /**
   * Check if role change is allowed
   */
  canChangeRole: (
    currentUserRole: SimpleRole, 
    targetRole: SimpleRole, 
    subjectRole: SimpleRole
  ): boolean => {
    // User must have higher role than target role
    const canAssignRole = hasRoleLevel(currentUserRole, targetRole);
    // User must have higher role than subject's current role
    const canModifyUser = hasRoleLevel(currentUserRole, subjectRole);
    
    return canAssignRole && canModifyUser;
  },
};
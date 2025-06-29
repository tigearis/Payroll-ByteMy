/**
 * Simplified Authentication Hook
 * 
 * Provides easy access to authentication state and basic role checking.
 * Replaces complex permission hooks with simple role-based access.
 */

import { useSimpleAuth } from "@/lib/auth/simple-auth-context";
import { SimpleRole, hasRoleLevel } from "@/lib/auth/simple-permissions";

/**
 * Primary authentication hook
 * 
 * Provides all authentication state and utility functions
 */
export function useAuth() {
  return useSimpleAuth();
}

/**
 * Role checking utilities hook
 * 
 * Provides convenient functions for checking user roles and access levels
 */
export function useRoleChecks() {
  const { userRole, isAdmin, isManager, isDeveloper, canManageUsers, canManageSystem } = useSimpleAuth();

  return {
    userRole,
    isAdmin,
    isManager,
    isDeveloper,
    canManageUsers,
    canManageSystem,
    
    // Utility functions
    hasRole: (role: SimpleRole) => userRole === role,
    hasRoleLevel: (requiredRole: SimpleRole) => hasRoleLevel(userRole, requiredRole),
    canAccessRoute: (requiredRole: SimpleRole) => hasRoleLevel(userRole, requiredRole),
  };
}

/**
 * Authentication status hook
 * 
 * Simple hook that just returns authentication status
 */
export function useAuthStatus() {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  
  return {
    isAuthenticated,
    isLoading,
    isReady: !isLoading,
  };
}

/**
 * User information hook
 * 
 * Returns basic user information
 */
export function useUserInfo() {
  const { 
    user, 
    userId, 
    userEmail, 
    userName, 
    userRole, 
    databaseId 
  } = useSimpleAuth();

  return {
    user,
    userId,
    userEmail,
    userName,
    userRole,
    databaseId,
  };
}

/**
 * Admin utilities hook
 * 
 * Convenience hook for admin-related functionality
 */
export function useAdminUtils() {
  const { 
    isAdmin, 
    isDeveloper, 
    canManageSystem, 
    canManageUsers,
    logAuditEvent 
  } = useSimpleAuth();

  return {
    isAdmin,
    isDeveloper,
    canManageSystem,
    canManageUsers,
    logAuditEvent,
    
    // Admin action wrappers
    logAdminAction: (action: string, details?: Record<string, any>) => {
      logAuditEvent("role_changed", { action, ...details });
    },
  };
}

/**
 * Sign out hook
 * 
 * Provides sign out functionality with audit logging
 */
export function useSignOut() {
  const { signOut, logAuditEvent } = useSimpleAuth();

  const handleSignOut = async () => {
    try {
      logAuditEvent("auth_logout");
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      logAuditEvent("auth_failed", { error: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  return handleSignOut;
}

/**
 * Route guard hook
 * 
 * Checks if user can access a specific route
 */
export function useRouteAccess(requiredRole?: SimpleRole) {
  const { userRole, isAuthenticated } = useSimpleAuth();

  if (!isAuthenticated) {
    return { canAccess: false, reason: "not_authenticated" };
  }

  if (!requiredRole) {
    return { canAccess: true, reason: "no_requirement" };
  }

  const canAccess = hasRoleLevel(userRole, requiredRole);
  
  return {
    canAccess,
    reason: canAccess ? "authorized" : "insufficient_role",
    userRole,
    requiredRole,
  };
}

/**
 * Permission checking hook (simplified)
 * 
 * Provides basic permission checking based on roles
 */
export function usePermissions() {
  const { 
    userRole, 
    isAdmin, 
    isManager, 
    canManageUsers, 
    canManageSystem 
  } = useSimpleAuth();

  // Simple permission mappings (replaces complex 23-permission system)
  const permissions = {
    // Staff management
    "staff:read": isManager,
    "staff:write": canManageUsers,
    "staff:delete": isAdmin,
    
    // Client management
    "client:read": true, // All authenticated users
    "client:write": isManager,
    "client:delete": isAdmin,
    
    // System management
    "admin:manage": canManageSystem,
    "settings:write": isAdmin,
    
    // Basic access
    "dashboard:access": true,
    "profile:edit": true,
  };

  const hasPermission = (permission: string): boolean => {
    return permissions[permission as keyof typeof permissions] || false;
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole,
    permissions, // For debugging
  };
}

// Backward compatibility exports
export { useSimpleAuth as useAuthContext };
export { useSimpleAuth as useEnhancedAuth };
export { usePermissions as useEnhancedPermissions };

// Default export
export default useSimpleAuth;
/**
 * Clean Authentication System
 * 
 * Minimal authentication - only checks if user is logged in.
 * No permissions, roles, or complex logic.
 */

// Re-export Clerk hooks for convenience
export { useAuth, useUser } from '@clerk/nextjs';

// Simple auth context for backward compatibility
export function useAuthContext() {
  const { isSignedIn, isLoaded } = useAuth();
  
  return {
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    isLoaded,
    // Legacy properties (always return safe defaults)
    userRole: "viewer",
    hasPermission: () => true,
    hasAdminAccess: true,
    isAdmin: true,
    isManager: true,
    canManageUsers: true,
    canManageSystem: true,
  };
}

// Legacy aliases
export { useAuthContext as useEnhancedAuth };
export { useAuthContext as useEnhancedPermissions };

// Migration object for backward compatibility
export const migration = {
  hasPermission: () => true,
  permissionToRole: {},
};

// Simple auth guard type
export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
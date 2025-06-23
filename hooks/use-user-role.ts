// hooks/useUserRole.ts
import { useAuthContext } from "@/lib/auth/auth-context";

export function useUserRole() {
  const {
    userRole,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasRole,
  } = useAuthContext();

  // Role checking functions
  const checkRole = (roles: string[]) => {
    return hasRole(roles as any);
  };

  // Check if user has any of the specified permissions
  const checkPermissions = (permissionList: string[]) => {
    return hasAnyPermission(permissionList);
  };

  return {
    // Core functionality
    userRole,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasRole: checkRole,
    checkPermissions,
  };
}

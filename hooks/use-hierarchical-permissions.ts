// hooks/use-hierarchical-permissions.ts
"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useMemo } from "react";
import { 
  hasHierarchicalPermission, 
  hasAnyHierarchicalPermission,
  getEffectivePermissions,
  type UserRole 
} from "@/lib/permissions/hierarchical-permissions";

export interface HierarchicalPermissionHook {
  // Core permission checking
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  
  // Role checking
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccessRole: (targetRole: UserRole) => boolean;
  
  // Permission data
  userRole: UserRole | null;
  allowedRoles: UserRole[];
  excludedPermissions: string[];
  effectivePermissions: string[];
  
  // Permission debugging
  getPermissionSource: (permission: string) => "inherited" | "excluded" | "denied";
  isLoading: boolean;
}

/**
 * Hook for hierarchical permission checking
 * Uses role inheritance + exclusions instead of full permission arrays
 */
export function useHierarchicalPermissions(): HierarchicalPermissionHook {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  const permissionData = useMemo(() => {
    if (!isLoaded || !user?.publicMetadata) {
      return {
        userRole: null,
        allowedRoles: [],
        excludedPermissions: [],
        effectivePermissions: []
      };
    }

    const metadata = user.publicMetadata;
    const userRole = metadata.role as UserRole | null;
    const allowedRoles = (metadata.allowedRoles as UserRole[]) || [];
    const excludedPermissions = (metadata.excludedPermissions as string[]) || [];
    
    const effectivePermissions = userRole 
      ? getEffectivePermissions(userRole, excludedPermissions)
      : [];

    return {
      userRole,
      allowedRoles,
      excludedPermissions,
      effectivePermissions
    };
  }, [isLoaded, user?.publicMetadata]);

  const hasPermission = useMemo(() => {
    return (permission: string): boolean => {
      if (!permissionData.userRole) return false;
      
      return hasHierarchicalPermission(
        permissionData.userRole,
        permission,
        permissionData.excludedPermissions
      );
    };
  }, [permissionData.userRole, permissionData.excludedPermissions]);

  const hasAnyPermission = useMemo(() => {
    return (permissions: string[]): boolean => {
      if (!permissionData.userRole) return false;
      
      return hasAnyHierarchicalPermission(
        permissionData.userRole,
        permissions,
        permissionData.excludedPermissions
      );
    };
  }, [permissionData.userRole, permissionData.excludedPermissions]);

  const hasAllPermissions = useMemo(() => {
    return (permissions: string[]): boolean => {
      if (!permissionData.userRole) return false;
      
      return permissions.every(permission => 
        hasHierarchicalPermission(
          permissionData.userRole!,
          permission,
          permissionData.excludedPermissions
        )
      );
    };
  }, [permissionData.userRole, permissionData.excludedPermissions]);

  const hasRole = useMemo(() => {
    return (role: UserRole): boolean => {
      return permissionData.userRole === role;
    };
  }, [permissionData.userRole]);

  const hasAnyRole = useMemo(() => {
    return (roles: UserRole[]): boolean => {
      return roles.includes(permissionData.userRole!);
    };
  }, [permissionData.userRole]);

  const canAccessRole = useMemo(() => {
    return (targetRole: UserRole): boolean => {
      return permissionData.allowedRoles.includes(targetRole);
    };
  }, [permissionData.allowedRoles]);

  const getPermissionSource = useMemo(() => {
    return (permission: string): "inherited" | "excluded" | "denied" => {
      if (!permissionData.userRole) return "denied";
      
      // Check if excluded
      const isExcluded = permissionData.excludedPermissions.some(excluded => {
        if (excluded === "*") return true;
        if (excluded.endsWith(".*")) {
          const resource = excluded.replace(".*", "");
          return permission.startsWith(resource + ".");
        }
        return excluded === permission;
      });
      
      if (isExcluded) return "excluded";
      
      // Check if would be inherited (without exclusions)
      const wouldBeInherited = hasHierarchicalPermission(
        permissionData.userRole,
        permission,
        [] // No exclusions
      );
      
      return wouldBeInherited ? "inherited" : "denied";
    };
  }, [permissionData.userRole, permissionData.excludedPermissions]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccessRole,
    userRole: permissionData.userRole,
    allowedRoles: permissionData.allowedRoles,
    excludedPermissions: permissionData.excludedPermissions,
    effectivePermissions: permissionData.effectivePermissions,
    getPermissionSource,
    isLoading: !isLoaded
  };
}

/**
 * Simplified permission hook for common use cases
 */
export function usePermissions() {
  const { hasPermission, hasAnyPermission, userRole, isLoading } = useHierarchicalPermissions();
  
  return {
    can: hasPermission,
    canAny: hasAnyPermission,
    role: userRole,
    isLoading
  };
}

/**
 * Hook for role-based access control
 */
export function useRoleAccess() {
  const { hasRole, hasAnyRole, canAccessRole, userRole, allowedRoles, isLoading } = useHierarchicalPermissions();
  
  return {
    hasRole,
    hasAnyRole,
    canAccessRole,
    userRole,
    allowedRoles,
    isLoading,
    // Common role checks
    isDeveloper: hasRole("developer"),
    isOrgAdmin: hasRole("org_admin"),
    isManager: hasRole("manager"),
    isConsultant: hasRole("consultant"),
    isViewer: hasRole("viewer"),
    // Permission level checks
    canManageUsers: hasAnyRole(["developer", "org_admin"]),
    canManageSystem: hasRole("developer"),
    canManageOrganization: hasAnyRole(["developer", "org_admin"]),
    canManageTeam: hasAnyRole(["developer", "org_admin", "manager"]),
    isStaff: hasAnyRole(["developer", "org_admin", "manager", "consultant"])
  };
}
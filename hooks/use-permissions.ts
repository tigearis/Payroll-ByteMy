/**
 * Unified Permissions Hook
 * 
 * Simple wrapper around hierarchical permissions for backward compatibility.
 * This is now the single source of truth for permission checking in components.
 */

"use client";

import { useCallback } from 'react';
import { useHierarchicalPermissions, type UserRole } from '@/hooks/use-hierarchical-permissions';

// Legacy Role type for backward compatibility
export type Role = UserRole;

export interface UsePermissionsReturn {
  // Permission data
  permissions: string[];
  role: UserRole;
  isLoaded: boolean;
  isRefreshing: boolean;
  
  // Permission check functions
  can: (resource: string, action: string) => boolean;
  canAny: (requiredPermissions: string[]) => boolean;
  canAll: (requiredPermissions: string[]) => boolean;
  canAccess: (resource: string) => boolean;
  getActions: (resource: string) => string[];
  
  // Utility functions
  refreshPermissions: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  isAtLeast: (role: UserRole) => boolean;
}

/**
 * Main permissions hook - now simplified wrapper around hierarchical system
 */
export function usePermissions(): UsePermissionsReturn {
  const hierarchical = useHierarchicalPermissions();

  const refreshPermissions = useCallback(async () => {
    try {
      const response = await fetch('/api/sync-current-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        window.location.reload();
        console.log('✅ Permissions refreshed');
      } else {
        console.error('❌ Failed to refresh permissions');
      }
    } catch (error) {
      console.error('❌ Error refreshing permissions:', error);
    }
  }, []);

  const can = useCallback((resource: string, action: string): boolean => {
    return hierarchical.hasPermission(`${resource}.${action}`);
  }, [hierarchical.hasPermission]);

  const canAccess = useCallback((resource: string): boolean => {
    const prefix = `${resource}.`;
    return hierarchical.effectivePermissions.some(p => p.startsWith(prefix) || p === "*");
  }, [hierarchical.effectivePermissions]);

  const getActions = useCallback((resource: string): string[] => {
    const prefix = `${resource}.`;
    const perms = hierarchical.effectivePermissions;
    
    if (perms.includes("*") || perms.includes(`${resource}.*`)) {
      return ["read", "create", "update", "delete", "manage", "approve", "export"];
    }
    
    return perms
      .filter(p => p.startsWith(prefix))
      .map(p => p.substring(prefix.length));
  }, [hierarchical.effectivePermissions]);

  const isAtLeast = useCallback((targetRole: UserRole): boolean => {
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1, consultant: 2, manager: 3, org_admin: 4, developer: 5
    };
    
    const userLevel = roleHierarchy[hierarchical.userRole || 'viewer'] || 0;
    const targetLevel = roleHierarchy[targetRole] || 0;
    
    return userLevel >= targetLevel;
  }, [hierarchical.userRole]);

  return {
    permissions: hierarchical.effectivePermissions,
    role: hierarchical.userRole || 'viewer',
    isLoaded: !hierarchical.isLoading,
    isRefreshing: false,
    
    can,
    canAny: hierarchical.hasAnyPermission,
    canAll: hierarchical.hasAllPermissions,
    canAccess,
    getActions,
    
    refreshPermissions,
    hasRole: hierarchical.hasRole,
    isAtLeast
  };
}

/**
 * Hook for specific resource permissions
 */
export function useResourcePermissions(resource: string) {
  const { can, getActions } = usePermissions();
  const { hasPermission } = useHierarchicalPermissions();
  
  return {
    canRead: can(resource, 'read'),
    canCreate: can(resource, 'create'),
    canUpdate: can(resource, 'update'),
    canDelete: can(resource, 'delete'),
    canArchive: can(resource, 'archive'),
    canApprove: can(resource, 'approve'),
    canExport: can(resource, 'export'),
    canManage: can(resource, 'manage'),
    availableActions: getActions(resource),
    hasAnyAccess: hasPermission(`${resource}.read`) || hasPermission(`${resource}.create`) || hasPermission(`${resource}.update`) || hasPermission(`${resource}.delete`) || hasPermission(`${resource}.manage`)
  };
}

/**
 * Hook for role-based checks
 */
export function useRole() {
  const { role, hasRole, isAtLeast } = usePermissions();
  
  return {
    role,
    hasRole,
    isAtLeast,
    isDeveloper: hasRole('developer'),
    isOrgAdmin: hasRole('org_admin'),
    isManager: hasRole('manager'),
    isConsultant: hasRole('consultant'),
    isViewer: hasRole('viewer'),
    isAdminOrAbove: isAtLeast('org_admin'),
    isManagerOrAbove: isAtLeast('manager'),
    isConsultantOrAbove: isAtLeast('consultant')
  };
}
"use client";

/**
 * Simple Auth Hook (Client Component)
 *
 * Authentication hook that integrates with hierarchical permission system.
 * Provides simple role-based access control with real data.
 */

import { useAuth } from "@clerk/nextjs";
import { useHierarchicalPermissions } from "@/hooks/use-hierarchical-permissions";
import type { UserRole } from "@/lib/permissions/hierarchical-permissions";
import { isAdmin, isManager, isDeveloper, isStaff } from "./simple-permissions";

// Simple auth context for backward compatibility
export function useAuthContext() {
  const { isSignedIn, isLoaded } = useAuth();
  const { 
    userRole, 
    hasPermission, 
    hasAnyPermission,
    isLoading: permissionsLoading 
  } = useHierarchicalPermissions();

  const isLoading = !isLoaded || permissionsLoading;

  return {
    isAuthenticated: isSignedIn,
    isLoading,
    isLoaded: isLoaded && !permissionsLoading,
    
    // Role information
    userRole: userRole || 'viewer' as UserRole,
    
    // Permission checking
    hasPermission: (permission: string) => hasPermission(permission),
    hasAnyPermission: (permissions: string[]) => hasAnyPermission(permissions),
    
    // Role-based access checks
    hasAdminAccess: isAdmin(userRole),
    isAdmin: isAdmin(userRole),
    isManager: isManager(userRole),
    isDeveloper: isDeveloper(userRole),
    isStaff: isStaff(userRole),
    
    // Capability checks
    canManageUsers: isManager(userRole), // Manager or above can manage users
    canManageSystem: isDeveloper(userRole), // Only developers can manage system
    canManageOrganization: isAdmin(userRole), // Admin or above can manage organization
    
    // Audit logging (placeholder - integrate with real audit system if needed)
    logAuditEvent: (event: string, data?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Audit event:', event, data);
      }
      // TODO: Integrate with real audit logging system
    },
  };
}

// Alias for backward compatibility
export const useSimpleAuth = useAuthContext;

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { Permission, Role, sanitizeUserRole, getPermissionsForRole, hasRoleLevel } from './permissions';
import { 
  useGetUserEffectivePermissionsQuery,
  useGetUserPermissionOverridesQuery 
} from '@/domains/permissions/graphql/generated/graphql';
import { useCurrentUser } from '@/hooks/use-current-user';

// Enhanced permission types
export interface EffectivePermission {
  resource: string;
  operation: string;
  granted: boolean;
  source: 'role' | 'override';
  conditions?: any;
  expiresAt?: string;
}

export interface UserPermissionOverride {
  id: string;
  resource: string;
  operation: string;
  granted: boolean;
  reason: string;
  expiresAt?: string;
  createdAt: string;
  createdBy?: string;
}

export interface EnhancedAuthContextType {
  // Authentication state (from original)
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  user: any;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: Role;
  databaseId: string | null;
  
  // Role and permissions (from original)
  userPermissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (roles: Role[]) => boolean;
  
  // Admin access checks (from original)
  hasAdminAccess: boolean;
  canManageUsers: boolean;
  canManageClients: boolean;
  canProcessPayrolls: boolean;
  canViewFinancials: boolean;
  
  // Enhanced permissions
  effectivePermissions: EffectivePermission[];
  permissionOverrides: UserPermissionOverride[];
  isPermissionsLoading: boolean;
  
  // Enhanced permission checking functions
  hasResourcePermission: (resource: string, action: string) => boolean;
  canAccessResource: (resource: string) => boolean;
  
  // Permission details for admin interfaces
  getPermissionDetails: (permission: Permission) => EffectivePermission | null;
  getRolePermissions: () => EffectivePermission[];
  getOverridePermissions: () => EffectivePermission[];
  
  // Utility functions
  refreshPermissions: () => Promise<void>;
  hasRoleLevel: (requiredRole: Role) => boolean;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | null>(null);

interface EnhancedAuthProviderProps {
  children: ReactNode;
}

export function EnhancedAuthProvider({ children }: EnhancedAuthProviderProps) {
  const { 
    isLoaded: isClerkLoaded, 
    isSignedIn, 
    userId,
    signOut: clerkSignOut,
    sessionClaims 
  } = useAuth();
  const { user } = useUser();
  const {
    currentUser: databaseUser,
    loading: dbUserLoading,
    error: dbUserError,
  } = useCurrentUser();
  
  // State for enhanced permissions
  const [effectivePermissions, setEffectivePermissions] = useState<EffectivePermission[]>([]);
  const [permissionOverrides, setPermissionOverrides] = useState<UserPermissionOverride[]>([]);

  // Extract user details
  const databaseId = user?.publicMetadata?.databaseId as string || null;
  const userRole = useMemo(() => {
    // Prefer database user role for security
    if (databaseUser?.role) {
      return databaseUser.role as Role;
    }
    // Fallback to session claims
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const claimsRole = claims?.["x-hasura-role"] as Role;
    return claimsRole || "viewer";
  }, [databaseUser?.role, sessionClaims]);
  
  // Has valid database user for security checks
  const hasValidDatabaseUser = !dbUserLoading && !!databaseUser && !dbUserError;

  // GraphQL queries for permission data
  const { 
    data: permissionsData, 
    loading: permissionsLoading, 
    refetch: refetchPermissions 
  } = useGetUserEffectivePermissionsQuery({
    variables: { userId: databaseId || '' },
    skip: !databaseId,
    errorPolicy: 'all'
  });

  const { 
    data: overridesData, 
    loading: overridesLoading,
    refetch: refetchOverrides 
  } = useGetUserPermissionOverridesQuery({
    variables: { userId: databaseId || '' },
    skip: !databaseId,
    errorPolicy: 'all'
  });

  // Process effective permissions from database
  useEffect(() => {
    if (permissionsData) {
      const permissions: EffectivePermission[] = [];
      
      // Add role-based permissions (simplified - would need proper role permission lookup)
      // For now, using the existing static permission system as fallback
      
      // Add permission overrides
      if (permissionsData.permissionOverrides) {
        permissionsData.permissionOverrides.forEach(override => {
          permissions.push({
            resource: override.resource,
            operation: override.operation,
            granted: override.granted,
            source: 'override',
            conditions: override.conditions
          });
        });
      }
      
      setEffectivePermissions(permissions);
    }
  }, [permissionsData]);

  // Process permission overrides
  useEffect(() => {
    if (overridesData?.permissionOverrides) {
      const overrides = overridesData.permissionOverrides.map((override: any) => ({
        id: override.id,
        resource: override.resource,
        operation: override.operation,
        granted: override.granted,
        reason: override.reason || '',
        ...(override.expiresAt && { expiresAt: override.expiresAt }),
        createdAt: override.createdAt,
        ...(override.createdBy && { createdBy: override.createdBy })
      }));
      
      setPermissionOverrides(overrides);
    }
  }, [overridesData]);

  // Convert legacy permission format to resource:action
  const parsePermission = useCallback((permission: Permission): { resource: string; action: string } => {
    const [resource, action] = permission.split(':');
    return { resource, action };
  }, []);

  // Check if user has specific permission (unified approach)
  const hasPermission = useCallback((permission: string): boolean => {
    // SECURITY: ALWAYS deny if not authenticated
    if (!isSignedIn || !isClerkLoaded) return false;
    
    // SECURITY: ALWAYS deny if user doesn't exist in database
    if (!hasValidDatabaseUser) return false;

    // First check database overrides if available
    if (effectivePermissions.length > 0) {
      const { resource, action } = parsePermission(permission as Permission);
      return hasResourcePermission(resource, action);
    }
    
    // Fallback to static permission system
    const userPermissions = getPermissionsForRole(userRole);
    return userPermissions.includes(permission as Permission);
  }, [effectivePermissions, userRole, parsePermission, isSignedIn, isClerkLoaded, hasValidDatabaseUser, hasResourcePermission]);

  // Check resource-level permission
  const hasResourcePermission = useCallback((resource: string, action: string): boolean => {
    // Check if any effective permission grants this resource:action
    const matchingPermissions = effectivePermissions.filter(
      perm => perm.resource === resource && perm.operation === action
    );

    if (matchingPermissions.length === 0) {
      // No specific permission found, check role fallback
      const { ROLE_PERMISSIONS } = require('./permissions');
      const legacyPermission = `${resource}:${action}` as Permission;
      return ROLE_PERMISSIONS[userRole]?.permissions.includes(legacyPermission) || false;
    }

    // If we have explicit permissions, use them
    // Grants override denies, denies override role permissions
    const hasGrant = matchingPermissions.some(perm => perm.granted === true);
    const hasDeny = matchingPermissions.some(perm => perm.granted === false);
    
    if (hasDeny && !hasGrant) {
      return false; // Explicitly denied
    }
    
    return hasGrant || matchingPermissions.some(perm => perm.granted);
  }, [effectivePermissions, userRole]);

  // Check if user can access any operation on a resource
  const canAccessResource = useCallback((resource: string): boolean => {
    return effectivePermissions.some(perm => 
      perm.resource === resource && perm.granted
    );
  }, [effectivePermissions]);

  // Get detailed permission information
  const getPermissionDetails = useCallback((permission: Permission): EffectivePermission | null => {
    const { resource, action } = parsePermission(permission);
    return effectivePermissions.find(
      perm => perm.resource === resource && perm.operation === action
    ) || null;
  }, [effectivePermissions, parsePermission]);

  // Get permissions by source
  const getRolePermissions = useCallback((): EffectivePermission[] => {
    return effectivePermissions.filter(perm => perm.source === 'role');
  }, [effectivePermissions]);

  const getOverridePermissions = useCallback((): EffectivePermission[] => {
    return effectivePermissions.filter(perm => perm.source === 'override');
  }, [effectivePermissions]);

  // Permission check functions from original auth context
  const hasAnyPermission = useCallback((requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasRole = useCallback((roles: Role[]): boolean => {
    // SECURITY: ALWAYS deny if not authenticated
    if (!isSignedIn || !isClerkLoaded) return false;
    // SECURITY: ALWAYS deny if user doesn't exist in database
    if (!hasValidDatabaseUser) return false;
    return roles.includes(userRole);
  }, [isSignedIn, isClerkLoaded, hasValidDatabaseUser, userRole]);

  // Role level checking
  const hasRoleLevelCheck = useCallback((requiredRole: Role): boolean => {
    return hasRoleLevel(userRole, requiredRole);
  }, [userRole]);

  // Memoize permissions to prevent unnecessary recalculations
  const userPermissions = useMemo(() => {
    return getPermissionsForRole(userRole);
  }, [userRole]);

  // Computed permissions from original auth context
  const computedPermissions = useMemo(() => {
    if (!userRole) return {};

    const rolePermissions = getPermissionsForRole(userRole);

    return {
      // Staff management
      canManageStaff: rolePermissions.includes("staff:write"),
      canViewStaff: rolePermissions.includes("staff:read"),
      canInviteStaff: rolePermissions.includes("staff:invite"),

      // Client management
      canManageClients: rolePermissions.includes("client:write"),
      canViewClients: rolePermissions.includes("client:read"),

      // Payroll operations
      canProcessPayrolls: rolePermissions.includes("payroll:write"),
      canViewPayrolls: rolePermissions.includes("payroll:read"),

      // System administration
      canManageSettings: rolePermissions.includes("settings:write"),
      canAccessAdmin: rolePermissions.includes("admin:manage"),

      // Reporting
      canViewReports: rolePermissions.includes("reports:read"),
      canExportReports: rolePermissions.includes("reports:export"),

      // Audit
      canViewAudit: rolePermissions.includes("audit:read"),
      canManageAudit: rolePermissions.includes("audit:write"),

      // Role-based checks
      isDeveloper: userRole === "developer",
      isAdministrator: userRole === "org_admin",
      isManager: userRole === "manager",
      isConsultant: userRole === "consultant",
      isViewer: userRole === "viewer",

      // Role hierarchy checks
      hasAdminAccess: hasRoleLevel(userRole, "org_admin"),
      hasManagerAccess: hasRoleLevel(userRole, "manager"),

      // User management (staff management)
      canManageUsers: rolePermissions.includes("staff:write"),

      // Financial access
      canViewFinancials: rolePermissions.includes("reports:read"),
    };
  }, [userRole]);

  // Enhanced sign out
  const signOut = useCallback(async () => {
    try {
      await clerkSignOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [clerkSignOut]);

  // Refresh user data
  const refreshUserData = useCallback(async () => {
    try {
      // Force a refetch of the current user data
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing user data:", error);
      throw error;
    }
  }, []);

  // Refresh permissions from database
  const refreshPermissions = useCallback(async (): Promise<void> => {
    if (databaseId) {
      await Promise.all([
        refetchPermissions(),
        refetchOverrides()
      ]);
    }
  }, [databaseId, refetchPermissions, refetchOverrides]);

  const contextValue: EnhancedAuthContextType = {
    // Authentication state (from original)
    isAuthenticated: !!isSignedIn,
    isLoading: !isClerkLoaded || dbUserLoading,
    isLoaded: isClerkLoaded,
    isSignedIn: isSignedIn || false,
    user,
    userId: userId || null,
    userEmail: user?.emailAddresses[0]?.emailAddress || null,
    userName: user?.fullName || user?.firstName || null,
    userRole,
    databaseId,
    
    // Role and permissions (from original)
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasRole,
    
    // Admin access checks (from original)
    hasAdminAccess: computedPermissions.hasAdminAccess || false,
    canManageUsers: computedPermissions.canManageUsers || false,
    canManageClients: computedPermissions.canManageClients || false,
    canProcessPayrolls: computedPermissions.canProcessPayrolls || false,
    canViewFinancials: computedPermissions.canViewFinancials || false,
    
    // Enhanced permissions
    effectivePermissions,
    permissionOverrides,
    isPermissionsLoading: permissionsLoading || overridesLoading,
    
    // Enhanced permission checking functions
    hasResourcePermission,
    canAccessResource,
    
    // Permission details
    getPermissionDetails,
    getRolePermissions,
    getOverridePermissions,
    
    // Utility functions
    refreshPermissions,
    hasRoleLevel: hasRoleLevelCheck,
    signOut,
    refreshUserData,
  };

  return (
    <EnhancedAuthContext.Provider value={contextValue}>
      {children}
    </EnhancedAuthContext.Provider>
  );
}

// Hook to use the enhanced auth context
export function useEnhancedAuth(): EnhancedAuthContextType {
  const context = useContext(EnhancedAuthContext);
  if (!context) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
}

// Main auth context hook (replaces original useAuthContext)
export function useAuthContext(): EnhancedAuthContextType {
  const context = useContext(EnhancedAuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an EnhancedAuthProvider');
  }
  return context;
}

// Alias for backward compatibility
export const AuthProvider = EnhancedAuthProvider;
export type AuthContextType = EnhancedAuthContextType;

// Export types for use in other components
export type { EffectivePermission, UserPermissionOverride };
/**
 * JWT Claims Hook
 * 
 * React hook for accessing JWT claims from the current user session.
 * Provides easy access to all JWT template fields.
 */

"use client";

import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';
import type { UserRole } from '@/lib/permissions/hierarchical-permissions';

export interface JWTClaims {
  // Core identification
  userId?: string;
  databaseId?: string;
  clerkId?: string;
  email?: string;
  
  // Hierarchy and organization
  managerId?: string;
  isStaff?: boolean;
  organizationId?: string;
  
  // Permissions and roles
  permissions?: string[];
  defaultRole?: UserRole;
  allowedRoles?: UserRole[];
  
  // Security and versioning
  permissionHash?: string;
  permissionVersion?: string;
  
  // Loading state
  isLoaded: boolean;
}

/**
 * Hook for accessing JWT claims from current user session
 * Maps Clerk metadata to JWT template structure
 */
export function useJWTClaims(): JWTClaims {
  const { user, isLoaded } = useUser();

  const claims = useMemo((): JWTClaims => {
    if (!isLoaded || !user) {
      return { isLoaded };
    }

    // Extract claims from Clerk metadata following JWT template structure
    const publicMetadata = user.publicMetadata;
    
    return {
      // Core identification (from JWT template)
      userId: user.id, // x-hasura-clerk-id
      databaseId: publicMetadata?.databaseId as string, // x-hasura-user-id
      clerkId: user.id, // x-hasura-clerk-id
      email: user.primaryEmailAddress?.emailAddress, // x-hasura-user-email
      
      // Hierarchy and organization
      managerId: publicMetadata?.managerId as string, // x-hasura-manager-id
      isStaff: publicMetadata?.isStaff as boolean, // x-hasura-is-staff
      organizationId: publicMetadata?.organizationId as string, // x-hasura-org-id
      
      // Permissions and roles
      permissions: publicMetadata?.permissions as string[], // x-hasura-permissions
      defaultRole: publicMetadata?.role as UserRole, // x-hasura-default-role
      allowedRoles: publicMetadata?.allowedRoles as UserRole[], // x-hasura-allowed-roles
      
      // Security and versioning
      permissionHash: publicMetadata?.permissionHash as string, // x-hasura-permission-hash
      permissionVersion: publicMetadata?.permissionVersion as string, // x-hasura-permission-version
      
      // Loading state
      isLoaded: true,
    };
  }, [user, isLoaded]);

  return claims;
}

/**
 * Hook for accessing user hierarchy information
 */
export function useUserHierarchy() {
  const claims = useJWTClaims();
  
  return {
    managerId: claims.managerId,
    isStaff: claims.isStaff || false,
    organizationId: claims.organizationId,
    hasManager: !!claims.managerId,
    isInOrganization: !!claims.organizationId,
    isLoaded: claims.isLoaded,
  };
}

/**
 * Hook for accessing role information with hierarchy checking
 */
export function useRoleHierarchy() {
  const claims = useJWTClaims();
  
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    consultant: 2,
    manager: 3,
    org_admin: 4,
    developer: 5
  };
  
  const currentLevel = claims.defaultRole ? roleHierarchy[claims.defaultRole] : 0;
  
  return {
    role: claims.defaultRole,
    allowedRoles: claims.allowedRoles || [],
    roleLevel: currentLevel,
    canSwitchToRole: (targetRole: UserRole) => 
      claims.allowedRoles?.includes(targetRole) || false,
    isAtLeast: (minRole: UserRole) => 
      currentLevel >= roleHierarchy[minRole],
    canManageRole: (targetRole: UserRole) => 
      currentLevel > roleHierarchy[targetRole],
    isLoaded: claims.isLoaded,
  };
}

/**
 * Hook for accessing permission security information
 */
export function usePermissionSecurity() {
  const claims = useJWTClaims();
  
  return {
    permissionHash: claims.permissionHash,
    permissionVersion: claims.permissionVersion,
    hasSecurityInfo: !!(claims.permissionHash && claims.permissionVersion),
    isLoaded: claims.isLoaded,
  };
}
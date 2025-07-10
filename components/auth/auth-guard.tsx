"use client";

/**
 * Enhanced Authentication Guard
 * 
 * Integrates with hierarchical permission system while maintaining
 * backward compatibility for simple authentication checks.
 */

import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";
import { useHierarchicalPermissions } from "@/hooks/use-hierarchical-permissions";
import { hasRoleLevel } from "@/lib/auth/simple-permissions";
import type { UserRole } from "@/lib/permissions/hierarchical-permissions";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  
  // Permission-based access control
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  
  // Role-based access control
  role?: UserRole;
  minRole?: UserRole;
  
  // Simple authentication only (default behavior)
  authOnly?: boolean;
}

export function AuthGuard({
  children,
  fallback = null,
  permission,
  permissions,
  requireAll = false,
  role,
  minRole,
  authOnly = false,
}: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    userRole,
    isLoading: permissionsLoading 
  } = useHierarchicalPermissions();

  // Show loading state
  if (!isLoaded || permissionsLoading) {
    return null;
  }

  // Check basic authentication
  if (!isSignedIn) {
    return <>{fallback}</>;
  }

  // If only authentication is required, return children
  if (authOnly || (!permission && !permissions && !role && !minRole)) {
    return <>{children}</>;
  }

  // Check specific permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  // Check specific role
  if (role && userRole !== role) {
    return <>{fallback}</>;
  }

  // Check minimum role level
  if (minRole && !hasRoleLevel(userRole, minRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Legacy component aliases for backward compatibility - authentication only
export const LegacyPermissionGuard = (props: any) => <AuthGuard {...props} authOnly />;
export const LegacyAdminOnly = (props: any) => <AuthGuard {...props} authOnly />;
export const LegacyManagerOnly = (props: any) => <AuthGuard {...props} authOnly />;
export const LegacyDeveloperOnly = (props: any) => <AuthGuard {...props} authOnly />;
export const LegacyConsultantOnly = (props: any) => <AuthGuard {...props} authOnly />;

// Role-based component aliases using hierarchical permissions
export const AdminOnly = (props: any) => <AuthGuard {...props} minRole="org_admin" />;
export const ManagerOnly = (props: any) => <AuthGuard {...props} minRole="manager" />;
export const DeveloperOnly = (props: any) => <AuthGuard {...props} role="developer" />;
export const ConsultantOnly = (props: any) => <AuthGuard {...props} minRole="consultant" />;

export default AuthGuard;
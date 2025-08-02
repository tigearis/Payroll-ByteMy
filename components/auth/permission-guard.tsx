"use client";

/**
 * Unified Hierarchical Permission Guard
 * 
 * Provides granular permission checking using hierarchical system with
 * role inheritance + exclusions for optimal JWT size and performance.
 * 
 * This is the single source of truth for all permission checking components.
 */

import { ReactNode, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHierarchicalPermissions, useRoleAccess } from "@/hooks/use-hierarchical-permissions";
import type { UserRole } from "@/lib/permissions/hierarchical-permissions";
import { useResourceContext, type ResourceName, type PermissionAction } from "./resource-context";

interface PermissionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  
  // Single permission checking (backwards compatible)
  permission?: string;
  
  // Resource-based permission checking (new pattern)
  resource?: ResourceName;
  action?: PermissionAction;
  
  // Multiple permissions checking
  permissions?: string[];
  requireAll?: boolean;
  
  // Role-based checking
  minRole?: UserRole;
  role?: UserRole;
  roles?: UserRole[];
  allowedRoles?: UserRole[];
  
  // UI options
  showLoading?: boolean;
  loadingComponent?: ReactNode;
}

export function PermissionGuard({
  children,
  fallback = null,
  permission,
  resource,
  action,
  permissions: requiredPermissions,
  requireAll = false,
  minRole,
  role,
  roles,
  allowedRoles,
  showLoading = true,
  loadingComponent
}: PermissionGuardProps) {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    userRole,
    isLoading 
  } = useHierarchicalPermissions();
  
  const {
    hasRole,
    hasAnyRole,
    canAccessRole
  } = useRoleAccess();

  // Get resource context for action-based permissions
  const contextResource = useResourceContext();

  // Compute the final permission string with priority logic
  const finalPermission = useMemo(() => {
    // Priority 1: Direct permission string (backwards compatible)
    if (permission) {
      return permission;
    }
    
    // Priority 2: Resource override + action
    if (resource && action) {
      return `${resource}.${action}`;
    }
    
    // Priority 3: Context resource + action
    if (contextResource && action) {
      return `${contextResource}.${action}`;
    }
    
    // If no permission can be determined, return null
    return null;
  }, [permission, resource, action, contextResource]);

  // Show loading state
  if (isLoading && showLoading) {
    return loadingComponent || <Skeleton className="w-full h-8" />;
  }

  // If still loading and not showing loading component, deny access
  if (isLoading) {
    return <>{fallback}</>;
  }

  let hasAccess = true;

  // Check computed permission (direct, resource.action, or context.action)
  if (finalPermission) {
    hasAccess = hasAccess && hasPermission(finalPermission);
  }

  // Check multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const permissionCheck = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    hasAccess = hasAccess && permissionCheck;
  }

  // Check minimum role level using hierarchical role system
  if (minRole) {
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      consultant: 2,
      manager: 3,
      org_admin: 4,
      developer: 5
    };
    
    const userLevel = roleHierarchy[userRole || 'viewer'] || 0;
    const minLevel = roleHierarchy[minRole] || 0;
    
    hasAccess = hasAccess && (userLevel >= minLevel);
  }

  // Check single role
  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  // Check multiple roles (any match)
  if (roles && roles.length > 0) {
    hasAccess = hasAccess && hasAnyRole(roles);
  }

  // Check allowed roles (can access role)
  if (allowedRoles && allowedRoles.length > 0) {
    hasAccess = hasAccess && allowedRoles.some(targetRole => canAccessRole(targetRole));
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Convenience components for specific permissions
export function CanRead({ 
  resource, 
  children, 
  fallback 
}: { 
  resource: ResourceName; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="read" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanCreate({ 
  resource, 
  children, 
  fallback 
}: { 
  resource: ResourceName; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="create" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanUpdate({ 
  resource, 
  children, 
  fallback 
}: { 
  resource: ResourceName; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="update" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanDelete({ 
  resource, 
  children, 
  fallback 
}: { 
  resource: ResourceName; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="delete" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanApprove({ 
  resource, 
  children, 
  fallback 
}: { 
  resource: ResourceName; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="approve" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanExport({ 
  resource, 
  children, 
  fallback 
}: { 
  resource: ResourceName; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="export" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

// Role-based component aliases - using hierarchical roles
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard minRole="org_admin" fallback={fallback}>{children}</PermissionGuard>;
}

export function ManagerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard minRole="manager" fallback={fallback}>{children}</PermissionGuard>;
}

export function DeveloperOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard minRole="developer" fallback={fallback}>{children}</PermissionGuard>;
}

export function ConsultantOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard minRole="consultant" fallback={fallback}>{children}</PermissionGuard>;
}

// Additional role-based guards from hierarchical system
export function AdminGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard roles={["developer", "org_admin"]} fallback={fallback}>{children}</PermissionGuard>;
}

export function StaffGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard roles={["developer", "org_admin", "manager", "consultant"]} fallback={fallback}>{children}</PermissionGuard>;
}

export function ManagerPlusGuard({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard roles={["developer", "org_admin", "manager"]} fallback={fallback}>{children}</PermissionGuard>;
}

// Role Guard - Shows content if user has the specified role(s)
export function RoleGuard({ 
  children, 
  fallback = null, 
  role,
  roles,
  showLoading = false 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
  role?: UserRole;
  roles?: UserRole[];
  showLoading?: boolean;
}) {
  const props: any = { children };
  
  if (role !== undefined) props.role = role;
  if (roles !== undefined) props.roles = roles;
  if (fallback !== undefined) props.fallback = fallback;
  if (showLoading !== undefined) props.showLoading = showLoading;
  
  return <PermissionGuard {...props} />;
}

// Additional hierarchical-specific components for hasAny functionality
export function AnyPermissionGuard({ 
  permissions, 
  children, 
  fallback 
}: { 
  permissions: string[]; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard permissions={permissions} requireAll={false} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function AllPermissionGuard({ 
  permissions, 
  children, 
  fallback 
}: { 
  permissions: string[]; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard permissions={permissions} requireAll={true} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

// Single permission guard for backward compatibility
export function SimplePermissionGuard({ 
  permission, 
  children, 
  fallback,
  showLoading = false 
}: { 
  permission: string; 
  children: ReactNode; 
  fallback?: ReactNode;
  showLoading?: boolean;
}) {
  return (
    <PermissionGuard permission={permission} fallback={fallback} showLoading={showLoading}>
      {children}
    </PermissionGuard>
  );
}

// Alias for main component (backward compatibility)
export const HierarchicalPermissionGuard = PermissionGuard;
export const PermissionGuardHierarchical = PermissionGuard;
export const HasAnyPermissionGuard = AnyPermissionGuard;

// Export resource context components and types
export { ResourceProvider, useResourceContext, RESOURCES, ACTIONS } from "./resource-context";
export type { ResourceName, PermissionAction } from "./resource-context";

export default PermissionGuard;
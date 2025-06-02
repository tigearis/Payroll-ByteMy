"use client";

import React from "react";
import { useAuthContext, UserRole } from "@/lib/auth-context";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  role?: UserRole;
  roles?: UserRole[];
  requireAll?: boolean; // If true, user must have ALL permissions/roles
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  fallback = null,
  loadingFallback = null,
}: PermissionGuardProps) {
  const { isLoading, hasPermission, hasAnyPermission, hasRole, userRole } =
    useAuthContext();

  // Show loading state if auth is still loading
  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  // Build permissions array
  const allPermissions = [...permissions];
  if (permission) {
    allPermissions.push(permission);
  }

  // Build roles array
  const allRoles = [...roles];
  if (role) {
    allRoles.push(role);
  }

  // Check permissions
  let hasRequiredPermissions = true;
  if (allPermissions.length > 0) {
    if (requireAll) {
      hasRequiredPermissions = allPermissions.every((p) => hasPermission(p));
    } else {
      hasRequiredPermissions = hasAnyPermission(allPermissions);
    }
  }

  // Check roles
  let hasRequiredRoles = true;
  if (allRoles.length > 0) {
    if (requireAll) {
      hasRequiredRoles = allRoles.includes(userRole);
    } else {
      hasRequiredRoles = hasRole(allRoles);
    }
  }

  // Grant access if both permission and role checks pass
  const hasAccess = hasRequiredPermissions && hasRequiredRoles;

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Specific permission guards for common use cases
export function AdminGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard roles={["org_admin"]} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ManagerGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard roles={["org_admin", "manager"]} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function StaffManagerGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_staff" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function ClientManagerGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="manage_clients" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function PayrollProcessorGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="process_payrolls" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function DeveloperGuard({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGuard permission="developer_tools" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

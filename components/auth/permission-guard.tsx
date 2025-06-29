"use client";

/**
 * Simple Permission Guard Component
 * 
 * Replaces the complex PermissionGuard with role-based access control.
 * Uses the simplified authentication context and role hierarchy.
 */

import { ReactNode } from "react";
import { useAuthContext, migration, type SimpleRole } from "@/lib/auth";

interface PermissionGuardProps {
  permission?: string;
  role?: SimpleRole;
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean;
}

export function PermissionGuard({
  permission,
  role,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { userRole, isAuthenticated, isLoading } = useAuthContext();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Must be authenticated
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check permission (legacy support)
  if (permission) {
    const hasPermission = migration.hasPermission(permission, userRole);
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  // Check direct role requirement
  if (role) {
    const { hasRoleLevel } = require("@/lib/auth/simple-permissions");
    if (!hasRoleLevel(userRole, role)) {
      return <>{fallback}</>;
    }
  }

  // Show children if all checks pass
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard role="org_admin" fallback={fallback}>{children}</PermissionGuard>;
}

export function ManagerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard role="manager" fallback={fallback}>{children}</PermissionGuard>;
}

export function DeveloperOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard role="developer" fallback={fallback}>{children}</PermissionGuard>;
}

export function ConsultantOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard role="consultant" fallback={fallback}>{children}</PermissionGuard>;
}

// Legacy permission checker component
export function LegacyPermissionGuard({
  permission,
  children,
  fallback = null,
}: {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGuard permission={permission} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

// Backward compatibility
export { PermissionGuard as default };
"use client";

import React from "react";
import { useRoleHierarchy, type UserRole } from "../../lib/auth/soc2-auth";

interface PermissionGuardProps {
  children: React.ReactNode;
  minimumRole?: UserRole;
  action?: string;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  minimumRole,
  action,
  fallback = null,
}: PermissionGuardProps) {
  const { userRole, hasMinimumRole, canPerformAction } = useRoleHierarchy();

  // Check access using native hierarchy
  let hasAccess = true;
  
  if (minimumRole) {
    hasAccess = hasMinimumRole(minimumRole);
  } else if (action) {
    hasAccess = canPerformAction(action);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Simplified guard components using hierarchy
export const AdminGuard = ({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <PermissionGuard minimumRole="org_admin" fallback={fallback}>{children}</PermissionGuard>
);

export const ManagerGuard = ({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <PermissionGuard minimumRole="manager" fallback={fallback}>{children}</PermissionGuard>
);

export const DeveloperGuard = ({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) => (
  <PermissionGuard minimumRole="developer" fallback={fallback}>{children}</PermissionGuard>
);

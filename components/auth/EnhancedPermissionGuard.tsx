// components/auth/EnhancedPermissionGuard.tsx
import React from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { MetadataUtils } from "@/lib/auth/metadata-utils";
import {
  ROLE_PERMISSIONS,
  CUSTOM_PERMISSIONS,
  CustomPermission,
  Role as UserRole,
} from "@/types/permissions";

interface EnhancedPermissionGuardProps {
  children: React.ReactNode;
  permission?: CustomPermission;
  minimumRole?: UserRole;
  anyPermissions?: CustomPermission[];
  allPermissions?: CustomPermission[];
  allowSelfAccess?: boolean;
  resourceUserId?: string;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  showFallbackMessage?: boolean;
}

type PresetGuardProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function EnhancedPermissionGuard({
  children,
  permission,
  minimumRole,
  anyPermissions,
  allPermissions,
  allowSelfAccess = false,
  resourceUserId,
  fallback = null,
  loading = null, // Default to null to avoid layout shifts
  showFallbackMessage = false,
}: EnhancedPermissionGuardProps) {
  const { has, isLoaded, userId } = useAuth();
  const { user } = useUser();

  if (!isLoaded || !user) {
    return <>{loading}</>;
  }

  if (allowSelfAccess && resourceUserId && userId === resourceUserId) {
    return <>{children}</>;
  }

  if (permission && !has({ permission })) {
    return showFallbackMessage ? <div>Access Denied</div> : <>{fallback}</>;
  }

  if (allPermissions && !allPermissions.every((p) => has({ permission: p }))) {
    return showFallbackMessage ? <div>Access Denied</div> : <>{fallback}</>;
  }

  if (anyPermissions && !anyPermissions.some((p) => has({ permission: p }))) {
    return showFallbackMessage ? <div>Access Denied</div> : <>{fallback}</>;
  }

  if (minimumRole) {
    const currentRole = MetadataUtils.extractUserRole(user);
    const currentLevel = ROLE_PERMISSIONS[currentRole]?.level || 0;
    const requiredLevel = ROLE_PERMISSIONS[minimumRole]?.level || 0;
    if (currentLevel < requiredLevel) {
      return showFallbackMessage ? <div>Access Denied</div> : <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// --- PRESET GUARDS ---
EnhancedPermissionGuard.CanReadStaff = ({
  children,
  fallback,
}: PresetGuardProps) => (
  <EnhancedPermissionGuard permission="custom:staff:read" fallback={fallback}>
    {children}
  </EnhancedPermissionGuard>
);
EnhancedPermissionGuard.CanManageStaff = ({
  children,
  fallback,
}: PresetGuardProps) => (
  <EnhancedPermissionGuard permission="custom:staff:write" fallback={fallback}>
    {children}
  </EnhancedPermissionGuard>
);
EnhancedPermissionGuard.CanCreateStaff = ({
  children,
  fallback,
}: PresetGuardProps) => (
  <EnhancedPermissionGuard permission="custom:staff:invite" fallback={fallback}>
    {children}
  </EnhancedPermissionGuard>
);
EnhancedPermissionGuard.CanDeleteStaff = ({
  children,
  fallback,
}: PresetGuardProps) => (
  <EnhancedPermissionGuard permission="custom:staff:delete" fallback={fallback}>
    {children}
  </EnhancedPermissionGuard>
);
EnhancedPermissionGuard.DeveloperGuard = ({
  children,
  fallback,
}: PresetGuardProps) => (
  <EnhancedPermissionGuard minimumRole="developer" fallback={fallback}>
    {children}
  </EnhancedPermissionGuard>
);
EnhancedPermissionGuard.AdminGuard = ({
  children,
  fallback,
}: PresetGuardProps) => (
  <EnhancedPermissionGuard minimumRole="org_admin" fallback={fallback}>
    {children}
  </EnhancedPermissionGuard>
);
EnhancedPermissionGuard.ManagerGuard = ({
  children,
  fallback,
}: PresetGuardProps) => (
  <EnhancedPermissionGuard minimumRole="manager" fallback={fallback}>
    {children}
  </EnhancedPermissionGuard>
);
EnhancedPermissionGuard.CanEditPayrolls = ({
  children,
  fallback,
}: PresetGuardProps) => (
  <EnhancedPermissionGuard
    permission="custom:payroll:write"
    fallback={fallback}
  >
    {children}
  </EnhancedPermissionGuard>
);

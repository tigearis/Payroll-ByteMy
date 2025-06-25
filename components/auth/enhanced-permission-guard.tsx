"use client";

import React from "react";
import {
  useEnhancedPermissions,
  type PermissionResult,
} from "@/hooks/use-enhanced-permissions";
import { PermissionDenied } from "./permission-denied";

interface PermissionGuardProps {
  resource?: string;
  action?: string;
  children: React.ReactNode;
  fallback?: React.ComponentType<{ result: PermissionResult }>;
  showError?: boolean;
  requireAll?: boolean; // For multiple permissions
  permissions?: Array<[string, string]>; // Alternative to resource/action
}

/**
 * Declarative permission guard component
 * Standardizes permission checking across the app
 */
export function PermissionGuard({
  resource,
  action,
  children,
  fallback: FallbackComponent = PermissionDenied,
  showError = true,
  requireAll = true,
  permissions,
}: PermissionGuardProps) {
  const { checkPermission, hasAllPermissions, hasAnyPermission, isLoading } =
    useEnhancedPermissions();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">
          Checking permissions...
        </span>
      </div>
    );
  }

  let result: PermissionResult;

  // Handle multiple permissions
  if (permissions) {
    const hasPermissions = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    result = hasPermissions
      ? { granted: true, context: { permissions, requireAll } }
      : {
          granted: false,
          reason: "Insufficient permissions for this action",
          context: { permissions, requireAll },
        };
  } else if (resource && action) {
    result = checkPermission(resource, action);
  } else {
    result = {
      granted: false,
      reason:
        "Invalid permission configuration - missing resource/action or permissions array",
    };
  }

  // Grant access
  if (result.granted) {
    return <>{children}</>;
  }

  // Deny access
  if (!showError) {
    return null;
  }

  return <FallbackComponent result={result} />;
}

// Convenience components for common patterns
export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard resource="system" action="admin">
      {children}
    </PermissionGuard>
  );
}

export function ManagerOrAbove({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard
      permissions={[
        ["users", "manage"],
        ["payrolls", "write"],
        ["system", "admin"],
      ]}
      requireAll={false}
    >
      {children}
    </PermissionGuard>
  );
}

export function DeveloperOnly({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard resource="system" action="admin">
      {children}
    </PermissionGuard>
  );
}

export function SecurityAccess({ children }: { children: React.ReactNode }) {
  return (
    <PermissionGuard resource="security" action="read">
      {children}
    </PermissionGuard>
  );
}

export function PayrollAccess({
  children,
  action = "read",
}: {
  children: React.ReactNode;
  action?: "read" | "write" | "manage";
}) {
  return (
    <PermissionGuard resource="payrolls" action={action}>
      {children}
    </PermissionGuard>
  );
}

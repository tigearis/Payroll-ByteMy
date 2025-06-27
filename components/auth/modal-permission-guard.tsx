"use client";

import React from "react";
import { PermissionDenied } from "./permission-denied";
import { UnauthorizedModal } from "./unauthorized-modal";
import { useUnauthorizedModal } from "@/hooks/use-unauthorized-modal";
import {
  useEnhancedPermissions,
  type PermissionResult,
} from "@/hooks/use-enhanced-permissions";
import type { UnauthorizedReason } from "@/lib/auth/unauthorized-handler";

interface ModalPermissionGuardProps {
  resource?: string;
  action?: string;
  children: React.ReactNode;
  fallback?: React.ComponentType<{ result: PermissionResult }>;
  showError?: boolean;
  requireAll?: boolean;
  permissions?: Array<[string, string]>;
  // Modal-specific props
  useModal?: boolean;
  modalReason?: UnauthorizedReason;
  onUnauthorized?: (result: PermissionResult) => void;
}

/**
 * Permission guard that can show unauthorized access as a modal
 * Provides better UX by keeping the user in context while showing access denied
 */
export function ModalPermissionGuard({
  resource,
  action,
  children,
  fallback: FallbackComponent = PermissionDenied,
  showError = true,
  requireAll = true,
  permissions,
  useModal = false,
  modalReason = "insufficient_permissions",
  onUnauthorized,
}: ModalPermissionGuardProps) {
  const { checkPermission, hasAllPermissions, hasAnyPermission, isLoading } =
    useEnhancedPermissions();
  const unauthorizedModal = useUnauthorizedModal();

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

  // Handle unauthorized access
  React.useEffect(() => {
    if (!result.granted && useModal) {
      unauthorizedModal.show(modalReason);
      onUnauthorized?.(result);
    }
  }, [
    result.granted,
    useModal,
    modalReason,
    unauthorizedModal,
    result,
    onUnauthorized,
  ]);

  // If using modal, render children with modal overlay
  if (useModal) {
    return (
      <>
        {children}
        <UnauthorizedModal
          open={unauthorizedModal.isOpen}
          onOpenChange={open => !open && unauthorizedModal.hide()}
          reason={unauthorizedModal.reason}
          onNavigateHome={unauthorizedModal.handleNavigateHome}
          onGoBack={unauthorizedModal.handleGoBack}
        />
      </>
    );
  }

  // Deny access with fallback component
  if (!showError) {
    return null;
  }

  return <FallbackComponent result={result} />;
}

/**
 * Hook for components that need to trigger unauthorized modal programmatically
 */
export function useModalUnauthorized() {
  const unauthorizedModal = useUnauthorizedModal();

  const showUnauthorized = React.useCallback(
    (reason?: UnauthorizedReason) => {
      unauthorizedModal.show(reason || "insufficient_permissions");
    },
    [unauthorizedModal]
  );

  return {
    showUnauthorized,
    isShowing: unauthorizedModal.isOpen,
    hide: unauthorizedModal.hide,
    Modal: () => (
      <UnauthorizedModal
        open={unauthorizedModal.isOpen}
        onOpenChange={open => !open && unauthorizedModal.hide()}
        reason={unauthorizedModal.reason}
        onNavigateHome={unauthorizedModal.handleNavigateHome}
        onGoBack={unauthorizedModal.handleGoBack}
      />
    ),
  };
}

// Convenience components with modal support
export function ModalAdminOnly({
  children,
  useModal = false,
}: {
  children: React.ReactNode;
  useModal?: boolean;
}) {
  return (
    <ModalPermissionGuard
      resource="system"
      action="admin"
      useModal={useModal}
      modalReason="insufficient_permissions"
    >
      {children}
    </ModalPermissionGuard>
  );
}

export function ModalPayrollAccess({
  children,
  action = "read",
  useModal = false,
}: {
  children: React.ReactNode;
  action?: "read" | "write" | "manage";
  useModal?: boolean;
}) {
  return (
    <ModalPermissionGuard
      resource="payrolls"
      action={action}
      useModal={useModal}
      modalReason="insufficient_permissions"
    >
      {children}
    </ModalPermissionGuard>
  );
}

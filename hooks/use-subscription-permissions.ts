import { useEffect, useRef } from "react";
import { useAuthContext } from "@/lib/auth";

interface SubscriptionPermissionOptions {
  resource: string;
  action: string;
  onPermissionDenied?: () => void;
}

/**
 * Hook to validate permissions for GraphQL subscriptions
 * Provides runtime permission checking for real-time data access
 */
export function useSubscriptionPermissions({
  resource,
  action,
  onPermissionDenied,
}: SubscriptionPermissionOptions) {
  const { hasPermission, userRole } = useAuthContext();
  const permissionChecked = useRef(false);

  // Create permission object for backward compatibility
  const permission = {
    granted: hasPermission(`${resource}:${action}`),
    requiredRole: "org_admin", // Default required role for security features
    reason: hasPermission(`${resource}:${action}`) ? undefined : `Insufficient permissions for ${resource}:${action}`
  };

  useEffect(() => {
    if (!permissionChecked.current && !permission.granted) {
      permissionChecked.current = true;
      
      console.warn("Subscription permission denied", {
        resource,
        action,
        userRole,
        requiredRole: permission.requiredRole,
        reason: permission.reason,
        timestamp: new Date().toISOString(),
      });

      // Log security event for audit purposes
      if (typeof window !== "undefined" && (window as any).clientAuthLogger) {
        (window as any).clientAuthLogger.logSecurityEvent("subscription_denied", {
          resource,
          action,
          userRole,
          requiredRole: permission.requiredRole,
        });
      }

      onPermissionDenied?.();
    }
  }, [permission.granted, resource, action, userRole, permission.requiredRole, permission.reason, onPermissionDenied]);

  return {
    hasPermission: permission.granted,
    permission,
    userRole,
  };
}

/**
 * Higher-order hook for securing subscription components
 */
export function useSecureSubscription<T>(
  subscriptionHook: () => T,
  permissionOptions: SubscriptionPermissionOptions
): T & { permissionError?: string } {
  const { hasPermission, permission } = useSubscriptionPermissions(permissionOptions);
  const subscriptionResult = subscriptionHook();

  if (!hasPermission) {
    return {
      ...subscriptionResult,
      permissionError: `Insufficient permissions for ${permissionOptions.resource}:${permissionOptions.action}. Required role: ${permission.requiredRole}`,
    } as T & { permissionError: string };
  }

  return subscriptionResult as T & { permissionError?: string };
}
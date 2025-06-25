import { useUserRole } from "@/hooks/use-user-role";

export interface PermissionResult {
  granted: boolean;
  reason?: string | undefined;
  requiredRole?: string;
  currentRole?: string;
  suggestions?: string[];
  context?: Record<string, any>;
}

export interface PermissionOptions {
  strict?: boolean; // Throw error if denied
  fallback?: React.ComponentType; // Fallback component
  loadingComponent?: React.ComponentType;
}

/**
 * Enhanced permission hook with detailed feedback
 * Replaces all direct role checking patterns
 */
export function useEnhancedPermissions() {
  const { userRole, hasPermission, isLoading } = useUserRole();

  const checkPermission = (
    resource: string,
    action: string,
    options: PermissionOptions = {}
  ): PermissionResult => {
    // Loading state handling
    if (isLoading) {
      return {
        granted: false,
        reason: "Permission check in progress",
        context: { loading: true },
      };
    }

    // Check permission using existing system (remove custom prefix for cleaner format)
    const permissionString = `${resource}:${action}`;
    const granted = hasPermission(permissionString);

    if (!granted) {
      const permissionKey = `${resource}:${action}`;
      const requiredRole = getMinimumRoleForPermission(permissionKey);

      return {
        granted: false,
        reason: `Insufficient permissions for ${resource}:${action}`,
        requiredRole,
        currentRole: userRole,
        suggestions: generatePermissionSuggestions(userRole, permissionKey),
        context: {
          resource,
          action,
          permissionKey,
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      granted: true,
      context: { resource, action, userRole },
    };
  };

  // Convenience methods for common patterns
  const requirePermission = (resource: string, action: string) => {
    const result = checkPermission(resource, action, { strict: true });
    if (!result.granted) {
      throw new PermissionError(result);
    }
    return result;
  };

  const hasAnyPermission = (permissions: Array<[string, string]>) => {
    return permissions.some(
      ([resource, action]) => checkPermission(resource, action).granted
    );
  };

  const hasAllPermissions = (permissions: Array<[string, string]>) => {
    return permissions.every(
      ([resource, action]) => checkPermission(resource, action).granted
    );
  };

  return {
    checkPermission,
    requirePermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole,
    isLoading,
    // Legacy compatibility
    hasPermission: (resource: string, action: string) =>
      checkPermission(resource, action).granted,
  };
}

// Helper functions
function getMinimumRoleForPermission(permission: string): string {
  const permissionRoles: Record<string, string> = {
    "audit:read": "manager",
    "audit:write": "org_admin",
    "payrolls:read": "consultant",
    "payrolls:write": "manager",
    "payrolls:manage": "manager",
    "users:read": "consultant",
    "users:write": "manager",
    "users:manage": "org_admin",
    "clients:read": "consultant",
    "clients:write": "manager",
    "clients:manage": "manager",
    "security:read": "manager",
    "security:write": "org_admin",
    "security:admin": "developer",
    "system:admin": "developer",
    "invitations:manage": "org_admin",
    "staff:manage": "manager",
    "dashboard:read": "viewer",
    "reports:read": "consultant",
    "reports:write": "manager",
    "settings:read": "manager",
    "settings:write": "org_admin",
  };

  return permissionRoles[permission] || "org_admin";
}

function generatePermissionSuggestions(
  currentRole: string,
  permission: string
): string[] {
  const suggestions = [];
  const requiredRole = getMinimumRoleForPermission(permission);

  suggestions.push(
    `Contact your administrator to request ${requiredRole} role`
  );

  if (permission.includes("read")) {
    suggestions.push("You may have read-only access to some related data");
  }

  if (permission.includes("write") || permission.includes("manage")) {
    suggestions.push(
      "Consider requesting temporary elevated permissions for this task"
    );
  }

  return suggestions;
}

export class PermissionError extends Error {
  constructor(public result: PermissionResult) {
    super(result.reason);
    this.name = "PermissionError";
  }
}

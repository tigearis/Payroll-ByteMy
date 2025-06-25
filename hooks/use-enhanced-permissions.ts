import { useUserRole } from "@/hooks/use-user-role";
import {
  ROLE_HIERARCHY,
  Role,
  Permission,
  roleHasPermission,
} from "@/lib/auth/permissions";

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
 * Uses the proper role hierarchy system from lib/auth/permissions.ts
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

    // Check permission using existing system (clean format)
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
    // Direct permission check with full string
    hasDirectPermission: hasPermission,
  };
}

// Helper functions using the proper role hierarchy system
function getMinimumRoleForPermission(permission: string): string {
  // Convert permission string to Permission type
  const permissionKey = permission as Permission;

  // Check each role level from lowest to highest to find minimum required role
  const rolesByLevel = Object.entries(ROLE_HIERARCHY)
    .sort(([, a], [, b]) => a - b) // Sort by level (lowest first)
    .map(([role]) => role as Role);

  for (const role of rolesByLevel) {
    if (roleHasPermission(role, permissionKey)) {
      return role;
    }
  }

  // If permission not found in any role, require highest role
  return "developer";
}

function generatePermissionSuggestions(
  currentRole: string,
  permission: string
): string[] {
  const suggestions = [];
  const requiredRole = getMinimumRoleForPermission(permission);

  suggestions.push(
    `Contact your administrator to request ${requiredRole} role (current: ${currentRole})`
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

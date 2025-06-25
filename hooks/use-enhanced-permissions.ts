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

// Helper functions
function getMinimumRoleForPermission(permission: string): string {
  const permissionRoles: Record<string, string> = {
    // Payroll permissions
    "payroll:read": "consultant",
    "payroll:write": "manager",
    "payroll:delete": "org_admin",
    "payroll:assign": "consultant",
    
    // Staff permissions  
    "staff:read": "consultant",
    "staff:write": "manager",
    "staff:delete": "org_admin",
    "staff:invite": "manager",
    
    // Client permissions
    "client:read": "consultant", 
    "client:write": "manager",
    "client:delete": "org_admin",
    
    // Admin permissions
    "admin:manage": "developer",
    "settings:write": "org_admin",
    "billing:manage": "org_admin",
    
    // Reporting permissions
    "reports:read": "consultant",
    "reports:export": "manager", 
    "audit:read": "manager",
    "audit:write": "org_admin",
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

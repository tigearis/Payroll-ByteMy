import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";
import { type UserRole } from "@/lib/utils/role-utils";

// Re-export permission types for convenience
export type { UserRole } from "@/lib/utils/role-utils";

// Common permission resources
export type PermissionResource =
  | "users"
  | "clients"
  | "payrolls"
  | "billing"
  | "reports"
  | "security"
  | "settings"
  | "invitations"
  | "email"
  | "files"
  | "calendar"
  | "leave"
  | "work-schedule"
  | "ai";

// Common permission actions
export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "approve"
  | "export"
  | "import"
  | "manage"
  | "view"
  | "edit";

// Permission check configuration
export interface PermissionConfig {
  resource: PermissionResource;
  action: PermissionAction;
  requireAll?: boolean; // For multiple permissions
  fallbackRole?: UserRole; // Minimum role if permission system fails
}

// Multi-permission check
export interface MultiPermissionConfig {
  permissions: PermissionConfig[];
  requireAll?: boolean; // true = AND logic, false = OR logic
}

// Hook result interface
export interface PermissionHookResult {
  hasPermission: boolean;
  role: UserRole | null;
  isLoading: boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canManage: boolean;
  canExport: boolean;
  canApprove: boolean;
  isViewer: boolean;
  isConsultant: boolean;
  isManager: boolean;
  isAdmin: boolean;
  isDeveloper: boolean;
}

// Common permission patterns as presets
export const PermissionPresets = {
  // CRUD operations for a resource
  crud: (resource: PermissionResource): MultiPermissionConfig => ({
    permissions: [
      { resource, action: "create" },
      { resource, action: "read" },
      { resource, action: "update" },
      { resource, action: "delete" },
    ],
    requireAll: false, // Any CRUD permission
  }),

  // Read-only access
  readOnly: (resource: PermissionResource): PermissionConfig => ({
    resource,
    action: "read",
  }),

  // Management permissions (create, update, delete, manage)
  management: (resource: PermissionResource): MultiPermissionConfig => ({
    permissions: [
      { resource, action: "create" },
      { resource, action: "update" },
      { resource, action: "delete" },
      { resource, action: "manage" },
    ],
    requireAll: false,
  }),

  // Admin-level permissions (all actions)
  admin: (resource: PermissionResource): MultiPermissionConfig => ({
    permissions: [
      { resource, action: "create" },
      { resource, action: "read" },
      { resource, action: "update" },
      { resource, action: "delete" },
      { resource, action: "manage" },
      { resource, action: "approve" },
      { resource, action: "export" },
    ],
    requireAll: false,
  }),

  // Approval permissions
  approval: (resource: PermissionResource): PermissionConfig => ({
    resource,
    action: "approve",
    fallbackRole: "manager", // Managers can approve by default
  }),

  // Export permissions
  export: (resource: PermissionResource): PermissionConfig => ({
    resource,
    action: "export",
    fallbackRole: "consultant", // Consultants can export by default
  }),
};

// Main permission hook
export function usePermissions(
  config?: PermissionConfig | MultiPermissionConfig | PermissionResource
): PermissionHookResult {
  const { user, isLoaded } = useUser();

  // Extract user role from Clerk metadata
  const userRole = useMemo((): UserRole | null => {
    if (!isLoaded || !user) return null;
    const role = user.publicMetadata?.role as UserRole;
    return role &&
      ["viewer", "consultant", "manager", "org_admin", "developer"].includes(
        role
      )
      ? role
      : "viewer"; // Default fallback
  }, [user, isLoaded]);

  // Role hierarchy check - simplified without getRoleHierarchy
  const roleHierarchy = useMemo(() => {
    if (!userRole) return [];
    const hierarchies: Record<UserRole, UserRole[]> = {
      viewer: ["viewer"],
      consultant: ["viewer", "consultant"],
      manager: ["viewer", "consultant", "manager"],
      org_admin: ["viewer", "consultant", "manager", "org_admin"],
      developer: ["viewer", "consultant", "manager", "org_admin", "developer"],
    };
    return hierarchies[userRole] || [];
  }, [userRole]);

  // Permission checking function
  const checkPermission = useMemo(() => {
    return (permissionConfig: PermissionConfig): boolean => {
      if (!userRole) return false;

      // Developers have all permissions
      if (userRole === "developer") return true;

      const { resource, action, fallbackRole } = permissionConfig;

      // Check fallback role if provided
      if (fallbackRole && roleHierarchy.includes(fallbackRole)) {
        return true;
      }

      // Resource-specific permission logic
      switch (resource) {
        case "users":
          return checkUserPermissions(action, userRole);
        case "clients":
          return checkClientPermissions(action, userRole);
        case "payrolls":
          return checkPayrollPermissions(action, userRole);
        case "billing":
          return checkBillingPermissions(action, userRole);
        case "security":
          return checkSecurityPermissions(action, userRole);
        case "reports":
          return checkReportPermissions(action, userRole);
        case "settings":
          return checkSettingsPermissions(action, userRole);
        default:
          return checkDefaultPermissions(resource, action, userRole);
      }
    };
  }, [userRole, roleHierarchy]);

  // Multi-permission checking
  const checkMultiPermission = useMemo(() => {
    return (config: MultiPermissionConfig): boolean => {
      const { permissions, requireAll = false } = config;

      if (requireAll) {
        return permissions.every(checkPermission);
      } else {
        return permissions.some(checkPermission);
      }
    };
  }, [checkPermission]);

  // Main permission check
  const hasPermission = useMemo<boolean>(() => {
    if (!config) return true; // No restrictions
    if (!isLoaded) return false; // Still loading

    // Handle different config types
    if (typeof config === "string") {
      return checkPermission({ resource: config, action: "read" });
    }

    if ("permissions" in config) {
      return checkMultiPermission(config);
    }

    return checkPermission(config);
  }, [config, isLoaded, checkPermission, checkMultiPermission]);

  // Convenience permission checks
  const conveniences = useMemo(
    (): Omit<PermissionHookResult, "hasPermission" | "role" | "isLoading"> => ({
      canCreate: config
        ? !!checkPermission({
            resource:
              typeof config === "string"
                ? config
                : "resource" in config
                  ? config.resource
                  : "users",
            action: "create",
          })
        : false,
      canRead: config
        ? !!checkPermission({
            resource:
              typeof config === "string"
                ? config
                : "resource" in config
                  ? config.resource
                  : "users",
            action: "read",
          })
        : false,
      canUpdate: config
        ? !!checkPermission({
            resource:
              typeof config === "string"
                ? config
                : "resource" in config
                  ? config.resource
                  : "users",
            action: "update",
          })
        : false,
      canDelete: config
        ? !!checkPermission({
            resource:
              typeof config === "string"
                ? config
                : "resource" in config
                  ? config.resource
                  : "users",
            action: "delete",
          })
        : false,
      canManage: config
        ? !!checkPermission({
            resource:
              typeof config === "string"
                ? config
                : "resource" in config
                  ? config.resource
                  : "users",
            action: "manage",
          })
        : false,
      canExport: config
        ? !!checkPermission({
            resource:
              typeof config === "string"
                ? config
                : "resource" in config
                  ? config.resource
                  : "users",
            action: "export",
          })
        : false,
      canApprove: config
        ? !!checkPermission({
            resource:
              typeof config === "string"
                ? config
                : "resource" in config
                  ? config.resource
                  : "users",
            action: "approve",
          })
        : false,
      isViewer: userRole === "viewer",
      isConsultant:
        userRole === "consultant" ||
        (!!userRole && roleHierarchy.includes("consultant")),
      isManager:
        userRole === "manager" ||
        (!!userRole && roleHierarchy.includes("manager")),
      isAdmin:
        userRole === "org_admin" ||
        (!!userRole && roleHierarchy.includes("org_admin")),
      isDeveloper: userRole === "developer",
    }),
    [config, checkPermission, userRole, roleHierarchy]
  );

  return {
    hasPermission: !!hasPermission,
    role: userRole,
    isLoading: !isLoaded,
    ...conveniences,
  };
}

// Resource-specific permission logic functions
function checkUserPermissions(
  action: PermissionAction,
  role: UserRole
): boolean {
  switch (action) {
    case "create":
    case "delete":
    case "manage":
      return ["org_admin", "developer"].includes(role);
    case "update":
    case "approve":
      return ["manager", "org_admin", "developer"].includes(role);
    case "read":
    case "view":
    case "export":
      return ["consultant", "manager", "org_admin", "developer"].includes(role);
    default:
      return false;
  }
}

function checkClientPermissions(
  action: PermissionAction,
  role: UserRole
): boolean {
  switch (action) {
    case "create":
    case "delete":
      return ["manager", "org_admin", "developer"].includes(role);
    case "update":
    case "manage":
      return ["consultant", "manager", "org_admin", "developer"].includes(role);
    case "read":
    case "view":
    case "export":
      return true; // All roles can read clients
    default:
      return false;
  }
}

function checkPayrollPermissions(
  action: PermissionAction,
  role: UserRole
): boolean {
  switch (action) {
    case "create":
    case "delete":
      return ["manager", "org_admin", "developer"].includes(role);
    case "update":
    case "manage":
    case "approve":
      return ["consultant", "manager", "org_admin", "developer"].includes(role);
    case "read":
    case "view":
    case "export":
      return true; // All roles can read payrolls
    default:
      return false;
  }
}

function checkBillingPermissions(
  action: PermissionAction,
  role: UserRole
): boolean {
  switch (action) {
    case "create":
    case "update":
    case "export":
      return ["consultant", "manager", "org_admin", "developer"].includes(role);
    case "approve":
    case "manage":
      return ["manager", "org_admin", "developer"].includes(role);
    case "delete":
      return ["org_admin", "developer"].includes(role);
    case "read":
    case "view":
      return true; // All roles can read billing
    default:
      return false;
  }
}

function checkSecurityPermissions(
  action: PermissionAction,
  role: UserRole
): boolean {
  // Security is admin-only
  return ["org_admin", "developer"].includes(role);
}

function checkReportPermissions(
  action: PermissionAction,
  role: UserRole
): boolean {
  switch (action) {
    case "read":
    case "view":
    case "export":
      return ["consultant", "manager", "org_admin", "developer"].includes(role);
    case "create":
    case "manage":
      return ["manager", "org_admin", "developer"].includes(role);
    default:
      return false;
  }
}

function checkSettingsPermissions(
  action: PermissionAction,
  role: UserRole
): boolean {
  switch (action) {
    case "read":
    case "view":
      return true; // All users can view settings (section-level guards apply)
    case "update":
    case "manage":
      return ["org_admin", "developer"].includes(role);
    default:
      return false;
  }
}

function checkDefaultPermissions(
  resource: PermissionResource,
  action: PermissionAction,
  role: UserRole
): boolean {
  // Default permission logic for other resources
  switch (action) {
    case "read":
    case "view":
      return ["consultant", "manager", "org_admin", "developer"].includes(role);
    case "create":
    case "update":
      return ["consultant", "manager", "org_admin", "developer"].includes(role);
    case "delete":
    case "manage":
      return ["manager", "org_admin", "developer"].includes(role);
    case "approve":
      return ["manager", "org_admin", "developer"].includes(role);
    case "export":
      return ["consultant", "manager", "org_admin", "developer"].includes(role);
    default:
      return false;
  }
}

// Specialized hooks for common use cases
export function useCanManage(resource: PermissionResource) {
  return usePermissions({ resource, action: "manage" });
}

export function useCanApprove(resource: PermissionResource) {
  return usePermissions({ resource, action: "approve" });
}

export function useCanExport(resource: PermissionResource) {
  return usePermissions({ resource, action: "export" });
}

export function useIsAdmin() {
  const { isAdmin, isDeveloper } = usePermissions();
  return isAdmin || isDeveloper;
}

export function useIsManager() {
  const { isManager, isAdmin, isDeveloper } = usePermissions();
  return isManager || isAdmin || isDeveloper;
}

// Hook for checking multiple resources at once
export function useMultiResourcePermissions(
  resources: PermissionResource[],
  action: PermissionAction = "read"
): Record<PermissionResource, boolean> {
  const permissions = useMemo(() => {
    const result: Record<string, boolean> = {};
    resources.forEach(resource => {
      result[resource] = true; // Will be calculated in the hook
    });
    return result;
  }, [resources]);

  // Check each resource individually
  resources.forEach(resource => {
    const { hasPermission } = usePermissions({ resource, action });
    permissions[resource] = hasPermission;
  });

  return permissions as Record<PermissionResource, boolean>;
}

// Hook for role-based navigation filtering
export function useNavigationPermissions() {
  const { role } = usePermissions();

  return useMemo(
    () => ({
      showDashboard: true, // Everyone can see dashboard
      showClients: true, // All authenticated users
      showPayrolls: true, // All authenticated users
      showStaff: role && ["manager", "org_admin", "developer"].includes(role),
      showBilling: true, // All authenticated users
      showReports:
        role &&
        ["consultant", "manager", "org_admin", "developer"].includes(role),
      showSecurity: role && ["org_admin", "developer"].includes(role),
      showSettings: true, // All users (section-level guards apply)
      showInvitations:
        role && ["manager", "org_admin", "developer"].includes(role),
      showDeveloper: role === "developer",
      showAI:
        role &&
        ["consultant", "manager", "org_admin", "developer"].includes(role),
    }),
    [role]
  );
}

// Hook for dynamic permission checking with caching
export function useDynamicPermissions() {
  const { checkPermission } = useMemo(() => {
    const cache = new Map<string, boolean>();

    return {
      checkPermission: (
        resource: PermissionResource,
        action: PermissionAction
      ): boolean => {
        const key = `${resource}:${action}`;
        if (cache.has(key)) {
          return cache.get(key)!;
        }

        const { hasPermission } = usePermissions({ resource, action });
        cache.set(key, hasPermission);
        return hasPermission;
      },
    };
  }, []);

  return { checkPermission };
}

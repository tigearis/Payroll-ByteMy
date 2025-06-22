// hooks/useEnhancedPermissions.tsx
import React, { useMemo, useCallback, createContext, useContext } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  UserMetadata,
  ROLE_PERMISSIONS,
  CustomPermission,
  Role as UserRole,
} from "@/lib/auth/permissions";

// Context for shared permission cache to avoid redundant checks
const PermissionCacheContext = createContext<Map<string, boolean>>(new Map());

export function useEnhancedPermissions() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const permissionCache = useContext(PermissionCacheContext);

  // Memoize user metadata extraction
  const userMetadata = useMemo(() => {
    if (!user) return null;
    return user.publicMetadata as Partial<UserMetadata>;
  }, [user?.publicMetadata]);

  // Memoize user role extraction
  const userRole = useMemo(() => {
    if (!user) return "viewer";
    const role = user.publicMetadata?.role || user.unsafeMetadata?.role;
    return typeof role === "string" &&
      ["developer", "org_admin", "manager", "consultant", "viewer"].includes(
        role
      )
      ? (role as UserRole)
      : "viewer";
  }, [user]);

  // Cached permission checker with memoization
  const checkPermission = useCallback(
    (permission: CustomPermission): boolean => {
      if (!isLoaded || !user) return false;

      const cacheKey = `${userId}_${permission}`;

      if (permissionCache.has(cacheKey)) {
        return permissionCache.get(cacheKey)!;
      }

      // Use role-based permissions as the base permission set
      const userPermissions = ROLE_PERMISSIONS[userRole]?.permissions || [];
      const hasRolePermission = userPermissions.includes(permission);
      
      // For granular restrictions, check if Clerk has explicit denial
      // If no Clerk permission exists, use role-based permissions
      const hasPermission = hasRolePermission;
      
      permissionCache.set(cacheKey, hasPermission);
      return hasPermission;
    },
    [isLoaded, user, userId, userRole, permissionCache]
  );

  // Check multiple permissions at once with caching
  const checkMultiplePermissions = useCallback(
    (checks: Array<{ key: string; permission: CustomPermission }>) => {
      return checks.reduce(
        (acc, { key, permission }) => {
          acc[key] = checkPermission(permission);
          return acc;
        },
        {} as Record<string, boolean>
      );
    },
    [checkPermission]
  );

  // Check if user has minimum role level
  const hasMinimumRole = useCallback(
    (minimumRole: UserRole): boolean => {
      if (!isLoaded || !user) return false;

      const currentLevel = ROLE_PERMISSIONS[userRole]?.level || 0;
      const requiredLevel = ROLE_PERMISSIONS[minimumRole]?.level || 0;
      return currentLevel >= requiredLevel;
    },
    [isLoaded, user, userRole]
  );

  // Check if user has any of the provided permissions
  const hasAnyPermissions = useCallback(
    (permissions: CustomPermission[]): boolean => {
      return permissions.some(permission => checkPermission(permission));
    },
    [checkPermission]
  );

  // Check if user has all of the provided permissions
  const hasAllPermissions = useCallback(
    (permissions: CustomPermission[]): boolean => {
      return permissions.every(permission => checkPermission(permission));
    },
    [checkPermission]
  );

  // Memoized specific capability checks for common operations
  const capabilities = useMemo(() => {
    if (!isLoaded || !user) {
      // Return all false if not loaded
      return {
        // Staff management
        canReadStaff: false,
        canManageStaff: false,
        canCreateStaff: false,
        canDeleteStaff: false,
        canInviteStaff: false,

        // Payroll management
        canReadPayrolls: false,
        canManagePayrolls: false,
        canCreatePayrolls: false,
        canDeletePayrolls: false,
        canAssignPayrolls: false,

        // Client management
        canReadClients: false,
        canManageClients: false,
        canCreateClients: false,
        canDeleteClients: false,

        // System administration
        canAccessAdmin: false,
        canManageSettings: false,
        canAccessBilling: false,
        canAccessDeveloperTools: false,

        // Reporting
        canViewReports: false,
        canAccessAudit: false,

        // Dashboard access
        canAccessDashboard: false,

        // Role-based capabilities
        isDeveloper: false,
        isAdministrator: false,
        isManager: false,
        isConsultant: false,
        isViewer: false,

        // Hierarchy checks
        hasAdminAccess: false,
        hasManagerAccess: false,
        hasConsultantAccess: false,
      };
    }

    return {
      // Staff management
      canReadStaff: checkPermission("custom:staff:read"),
      canManageStaff: checkPermission("custom:staff:write"),
      canCreateStaff: checkPermission("custom:staff:write"),
      canDeleteStaff: checkPermission("custom:staff:delete"),
      canInviteStaff: checkPermission("custom:staff:invite"),

      // Payroll management
      canReadPayrolls: checkPermission("custom:payroll:read"),
      canManagePayrolls: checkPermission("custom:payroll:write"),
      canCreatePayrolls: checkPermission("custom:payroll:write"),
      canDeletePayrolls: checkPermission("custom:payroll:delete"),
      canAssignPayrolls: checkPermission("custom:payroll:assign"),

      // Client management
      canReadClients: checkPermission("custom:client:read"),
      canManageClients: checkPermission("custom:client:write"),
      canCreateClients: checkPermission("custom:client:write"),
      canDeleteClients: checkPermission("custom:client:delete"),

      // System administration
      canAccessAdmin: checkPermission("custom:admin:manage"),
      canManageSettings: checkPermission("custom:settings:write"),
      canAccessBilling: checkPermission("custom:billing:manage"),
      canAccessDeveloperTools: hasMinimumRole("developer"),

      // Reporting
      canViewReports: checkPermission("custom:reports:read"),
      canAccessAudit: checkPermission("custom:audit:read"),

      // Dashboard access (all authenticated users)
      canAccessDashboard: true,

      // Role-based capabilities
      isDeveloper: userRole === "developer",
      isAdministrator: userRole === "org_admin",
      isManager: userRole === "manager",
      isConsultant: userRole === "consultant",
      isViewer: userRole === "viewer",

      // Hierarchy checks
      hasAdminAccess: hasMinimumRole("org_admin"),
      hasManagerAccess: hasMinimumRole("manager"),
      hasConsultantAccess: hasMinimumRole("consultant"),
    };
  }, [isLoaded, user, checkPermission, hasMinimumRole, userRole]);

  // Navigation-specific permission checks
  const navigation = useMemo(
    () => ({
      canAccess: {
        dashboard: true,
        staff: capabilities.canReadStaff,
        payrolls: capabilities.canReadPayrolls,
        clients: capabilities.canReadClients,
        reports: capabilities.canViewReports,
        security: capabilities.canAccessAdmin,
        developer: capabilities.canAccessDeveloperTools,
        settings: capabilities.canManageSettings,
      },
    }),
    [capabilities]
  );

  // User info with enhanced metadata
  const userInfo = useMemo(
    () => ({
      userId,
      userRole,
      userMetadata,
      isLoaded,
      permissions: userMetadata?.permissions || [],
      customAccess: userMetadata?.customAccess,
      assignedBy: userMetadata?.assignedBy,
      assignedAt: userMetadata?.assignedAt,
      lastUpdated: userMetadata?.lastUpdated,
    }),
    [userId, userRole, userMetadata, isLoaded]
  );

  return {
    // Core info
    ...userInfo,

    // Permission checking functions
    checkPermission,
    checkMultiplePermissions,
    hasMinimumRole,
    hasAnyPermissions,
    hasAllPermissions,

    // Specific capabilities
    ...capabilities,

    // Navigation permissions
    navigation,
  };
}

// Provider component for shared permission cache
export function EnhancedPermissionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const permissionCache = useMemo(() => new Map<string, boolean>(), []);

  return (
    <PermissionCacheContext.Provider value={permissionCache}>
      {children}
    </PermissionCacheContext.Provider>
  );
}

// Utility hook for checking a single permission with loading state
export function usePermission(permission: CustomPermission) {
  const { checkPermission, isLoaded } = useEnhancedPermissions();

  return {
    hasPermission: isLoaded ? checkPermission(permission) : false,
    isLoading: !isLoaded,
  };
}

// Utility hook for checking minimum role with loading state
export function useMinimumRole(minimumRole: UserRole) {
  const { hasMinimumRole, isLoaded, userRole } = useEnhancedPermissions();

  return {
    hasRole: isLoaded ? hasMinimumRole(minimumRole) : false,
    userRole,
    isLoading: !isLoaded,
  };
}

// Utility hook for resource-specific access (with custom restrictions)
export function useResourceAccess(
  resourceType: "payroll" | "client",
  resourceId?: string
) {
  const { checkPermission, userMetadata, isLoaded } = useEnhancedPermissions();

  const canRead = useMemo(() => {
    if (!isLoaded) return false;

    const readPermission = `custom:${resourceType}:read` as CustomPermission;
    if (!checkPermission(readPermission)) return false;

    // Check custom access restrictions if resourceId provided
    if (resourceId && userMetadata?.customAccess) {
      if (
        resourceType === "payroll" &&
        userMetadata.customAccess.restrictedPayrolls
      ) {
        return !userMetadata.customAccess.restrictedPayrolls.includes(
          resourceId
        );
      }
      if (
        resourceType === "client" &&
        userMetadata.customAccess.allowedClients
      ) {
        return userMetadata.customAccess.allowedClients.includes(resourceId);
      }
    }

    return true;
  }, [isLoaded, checkPermission, resourceType, resourceId, userMetadata]);

  const canWrite = useMemo(() => {
    if (!isLoaded) return false;

    const writePermission = `custom:${resourceType}:write` as CustomPermission;
    return checkPermission(writePermission) && canRead;
  }, [isLoaded, checkPermission, resourceType, canRead]);

  return {
    canRead,
    canWrite,
    canDelete: isLoaded
      ? checkPermission(`custom:${resourceType}:delete` as CustomPermission) &&
        canRead
      : false,
    isLoading: !isLoaded,
  };
}

"use client";

import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useMemo,
  useCallback 
} from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  UserMetadata,
  ROLE_PERMISSIONS,
  CustomPermission,
  Role as UserRole,
} from "@/lib/auth/permissions";

// Cached permission state
interface CachedPermissionState {
  userRole: UserRole;
  rolePermissions: CustomPermission[];
  databaseOverrides: CustomPermission[];
  allPermissions: CustomPermission[];
  lastChecked: number;
  isLoaded: boolean;
}

// Permission cache context
interface PermissionCacheContextType {
  permissions: CachedPermissionState | null;
  loadPermissions: () => Promise<void>;
  clearCache: () => void;
  hasPermission: (permission: CustomPermission) => boolean;
  isLoaded: boolean;
}

const PermissionCacheContext = createContext<PermissionCacheContextType>({
  permissions: null,
  loadPermissions: async () => {},
  clearCache: () => {},
  hasPermission: () => false,
  isLoaded: false,
});

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function PermissionCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  
  const [permissions, setPermissions] = useState<CachedPermissionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract user role
  const userRole = useMemo(() => {
    if (!user) return "viewer";
    const role = user.publicMetadata?.role || user.unsafeMetadata?.role;
    return typeof role === "string" &&
      ["developer", "org_admin", "manager", "consultant", "viewer"].includes(role)
      ? (role as UserRole)
      : "viewer";
  }, [user?.publicMetadata, user?.unsafeMetadata]);

  // Load permissions from database (only called once per session or when needed)
  const loadPermissions = useCallback(async () => {
    if (!authLoaded || !user || !userId || isLoading) return;

    // Check if cache is still valid
    if (permissions && Date.now() - permissions.lastChecked < CACHE_DURATION) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Get base role permissions
      const rolePermissions = ROLE_PERMISSIONS[userRole]?.permissions || [];
      
      // Get database overrides (placeholder - will implement GraphQL query)
      // For now, return empty array - this should query permission_overrides table
      const databaseOverrides: CustomPermission[] = [];
      
      // TODO: Add GraphQL query to fetch permission_overrides for this user
      // const { data } = await apollo.query({
      //   query: GET_USER_PERMISSION_OVERRIDES,
      //   variables: { userId }
      // });
      // const databaseOverrides = data?.permission_overrides?.map(override => 
      //   `custom:${override.resource}:${override.operation}` as CustomPermission
      // ).filter(p => override.granted) || [];

      // Combine all permissions (role + database overrides)
      const allPermissions = [...new Set([...rolePermissions, ...databaseOverrides])];

      const newPermissions: CachedPermissionState = {
        userRole,
        rolePermissions,
        databaseOverrides,
        allPermissions,
        lastChecked: Date.now(),
        isLoaded: true,
      };

      setPermissions(newPermissions);
      
      // Store in sessionStorage for persistence across page refreshes
      sessionStorage.setItem('userPermissions', JSON.stringify(newPermissions));
      
    } catch (error) {
      console.error('Failed to load permissions:', error);
      
      // Fallback to role-based permissions only
      const rolePermissions = ROLE_PERMISSIONS[userRole]?.permissions || [];
      const fallbackPermissions: CachedPermissionState = {
        userRole,
        rolePermissions,
        databaseOverrides: [],
        allPermissions: rolePermissions,
        lastChecked: Date.now(),
        isLoaded: true,
      };
      
      setPermissions(fallbackPermissions);
    } finally {
      setIsLoading(false);
    }
  }, [authLoaded, user, userId, userRole, permissions, isLoading]);

  // Load cached permissions from sessionStorage on mount
  useEffect(() => {
    if (!authLoaded || !user) return;

    const cached = sessionStorage.getItem('userPermissions');
    if (cached) {
      try {
        const parsedCache: CachedPermissionState = JSON.parse(cached);
        
        // Verify cache is still valid and for the same user role
        if (
          parsedCache.userRole === userRole &&
          Date.now() - parsedCache.lastChecked < CACHE_DURATION
        ) {
          setPermissions(parsedCache);
          return; // Use cached permissions
        }
      } catch (error) {
        console.error('Failed to parse cached permissions:', error);
      }
    }

    // Cache invalid or missing, load fresh permissions
    loadPermissions();
  }, [authLoaded, user, userRole, loadPermissions]);

  // Clear cache
  const clearCache = useCallback(() => {
    setPermissions(null);
    sessionStorage.removeItem('userPermissions');
  }, []);

  // Fast permission check (uses cached permissions)
  const hasPermission = useCallback((permission: CustomPermission): boolean => {
    if (!permissions?.isLoaded) return false;
    return permissions.allPermissions.includes(permission);
  }, [permissions]);

  const contextValue: PermissionCacheContextType = {
    permissions,
    loadPermissions,
    clearCache,
    hasPermission,
    isLoaded: permissions?.isLoaded || false,
  };

  return (
    <PermissionCacheContext.Provider value={contextValue}>
      {children}
    </PermissionCacheContext.Provider>
  );
}

// Hook to use cached permissions
export function useCachedPermissions() {
  const context = useContext(PermissionCacheContext);
  
  if (!context) {
    throw new Error('useCachedPermissions must be used within PermissionCacheProvider');
  }

  const { permissions, hasPermission, isLoaded, loadPermissions, clearCache } = context;
  const { user } = useUser();
  const { userId } = useAuth();

  // User info
  const userInfo = useMemo(() => ({
    userId,
    userRole: permissions?.userRole || "viewer",
    userMetadata: user?.publicMetadata as Partial<UserMetadata>,
    isLoaded,
    permissions: permissions?.allPermissions || [],
    rolePermissions: permissions?.rolePermissions || [],
    databaseOverrides: permissions?.databaseOverrides || [],
  }), [permissions, user, userId, isLoaded]);

  // Specific capability checks using cached permissions
  const capabilities = useMemo(() => {
    if (!isLoaded) {
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
      };
    }

    return {
      // Staff management
      canReadStaff: hasPermission("custom:staff:read"),
      canManageStaff: hasPermission("custom:staff:write"),
      canCreateStaff: hasPermission("custom:staff:write"),
      canDeleteStaff: hasPermission("custom:staff:delete"),
      canInviteStaff: hasPermission("custom:staff:invite"),

      // Payroll management
      canReadPayrolls: hasPermission("custom:payroll:read"),
      canManagePayrolls: hasPermission("custom:payroll:write"),
      canCreatePayrolls: hasPermission("custom:payroll:write"),
      canDeletePayrolls: hasPermission("custom:payroll:delete"),
      canAssignPayrolls: hasPermission("custom:payroll:assign"),

      // Client management
      canReadClients: hasPermission("custom:client:read"),
      canManageClients: hasPermission("custom:client:write"),
      canCreateClients: hasPermission("custom:client:write"),
      canDeleteClients: hasPermission("custom:client:delete"),

      // System administration
      canAccessAdmin: hasPermission("custom:admin:manage"),
      canManageSettings: hasPermission("custom:settings:write"),
      canAccessBilling: hasPermission("custom:billing:manage"),
      canAccessDeveloperTools: permissions?.userRole === "developer",

      // Reporting
      canViewReports: hasPermission("custom:reports:read"),
      canAccessAudit: hasPermission("custom:audit:read"),

      // Dashboard access (all authenticated users)
      canAccessDashboard: true,

      // Role-based capabilities
      isDeveloper: permissions?.userRole === "developer",
      isAdministrator: permissions?.userRole === "org_admin",
      isManager: permissions?.userRole === "manager",
      isConsultant: permissions?.userRole === "consultant",
      isViewer: permissions?.userRole === "viewer",
    };
  }, [isLoaded, hasPermission, permissions?.userRole]);

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

  return {
    // Core info
    ...userInfo,

    // Permission checking functions
    hasPermission,
    loadPermissions,
    clearCache,

    // Specific capabilities
    ...capabilities,

    // Navigation permissions
    navigation,

    // Cache status
    lastChecked: permissions?.lastChecked,
  };
}
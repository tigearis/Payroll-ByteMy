"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import React, {
  createContext,
  useContext,
  useMemo,
} from "react";

import { useCurrentUser } from "@/hooks/use-current-user";
// Using pure Clerk native functions - no custom token management needed

export type UserRole =
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer"
  | "developer";

export interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;

  // Role and permissions
  userRole: UserRole;
  userPermissions: string[];
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (roles: UserRole[]) => boolean;

  // Admin access checks
  hasAdminAccess: boolean;
  canManageUsers: boolean;
  canManageClients: boolean;
  canProcessPayrolls: boolean;
  canViewFinancials: boolean;

  // Actions
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Permission definitions
const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "view_dashboard",

  // Staff management
  MANAGE_STAFF: "manage_staff",
  VIEW_STAFF: "view_staff",

  // Client management
  MANAGE_CLIENTS: "manage_clients",
  VIEW_CLIENTS: "view_clients",

  // Payroll operations
  PROCESS_PAYROLLS: "process_payrolls",
  APPROVE_PAYROLLS: "approve_payrolls",
  VIEW_PAYROLLS: "view_payrolls",

  // Financial access
  VIEW_FINANCIALS: "view_financials",
  MANAGE_BILLING: "manage_billing",

  // Reports
  VIEW_REPORTS: "view_reports",
  GENERATE_REPORTS: "generate_reports",

  // System administration
  SYSTEM_ADMIN: "system_admin",
  MANAGE_SETTINGS: "manage_settings",
  MANAGE_ROLES: "manage_roles",

  // User management
  MANAGE_USERS: "manage_users",
  INVITE_USERS: "invite_users",

  // Developer tools
  DEVELOPER_TOOLS: "developer_tools",
} as const;

// Role-permission mapping
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  developer: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_STAFF,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.PROCESS_PAYROLLS,
    PERMISSIONS.APPROVE_PAYROLLS,
    PERMISSIONS.VIEW_PAYROLLS,
    PERMISSIONS.VIEW_FINANCIALS,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.INVITE_USERS,
    PERMISSIONS.DEVELOPER_TOOLS,
  ],
  org_admin: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_STAFF,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.PROCESS_PAYROLLS,
    PERMISSIONS.APPROVE_PAYROLLS,
    PERMISSIONS.VIEW_PAYROLLS,
    PERMISSIONS.VIEW_FINANCIALS,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.INVITE_USERS,
  ],
  manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_STAFF,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.MANAGE_CLIENTS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.PROCESS_PAYROLLS,
    PERMISSIONS.APPROVE_PAYROLLS,
    PERMISSIONS.VIEW_PAYROLLS,
    PERMISSIONS.VIEW_FINANCIALS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.INVITE_USERS,
  ],
  consultant: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.PROCESS_PAYROLLS,
    PERMISSIONS.VIEW_PAYROLLS,
    PERMISSIONS.VIEW_REPORTS,
  ],
  viewer: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_PAYROLLS,
    PERMISSIONS.VIEW_REPORTS,
  ],
};

// Route permissions mapping
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard": [PERMISSIONS.VIEW_DASHBOARD],
  "/staff": [PERMISSIONS.VIEW_STAFF],
  "/staff/new": [PERMISSIONS.MANAGE_STAFF],
  "/clients": [PERMISSIONS.VIEW_CLIENTS],
  "/clients/new": [PERMISSIONS.MANAGE_CLIENTS],
  "/payrolls": [PERMISSIONS.VIEW_PAYROLLS],
  "/payroll-schedule": [PERMISSIONS.PROCESS_PAYROLLS],
  "/settings": [PERMISSIONS.MANAGE_SETTINGS],
  "/developer": [PERMISSIONS.DEVELOPER_TOOLS],
  "/ai-assistant": [PERMISSIONS.VIEW_DASHBOARD],
  "/calendar": [PERMISSIONS.VIEW_DASHBOARD],
  "/tax-calculator": [PERMISSIONS.VIEW_DASHBOARD],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    isLoaded: isClerkLoaded,
    userId,
    isSignedIn,
    signOut: clerkSignOut,
    sessionClaims,
  } = useAuth();
  const { user } = useUser();
  const {
    currentUser: databaseUser,
    loading: dbUserLoading,
    error: dbUserError,
  } = useCurrentUser();

  // Extract user role from database user or session claims
  const userRole: UserRole = useMemo(() => {
    // Prefer database user role for security
    if (databaseUser?.role) {
      return databaseUser.role as UserRole;
    }
    
    // Fallback to session claims
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const claimsRole = claims?.["x-hasura-role"] as UserRole;
    
    return claimsRole || "viewer";
  }, [databaseUser?.role, sessionClaims]);

  // Memoize permissions to prevent unnecessary recalculations
  const userPermissions = useMemo(() => {
    return ROLE_PERMISSIONS[userRole] || [];
  }, [userRole]);

  // Has valid database user for security checks
  const hasValidDatabaseUser = !dbUserLoading && !!databaseUser && !dbUserError;

  // Permission check functions - STRICT security-aware
  const hasPermission = (permission: string): boolean => {
    // SECURITY: ALWAYS deny if not authenticated
    if (!isSignedIn || !isClerkLoaded) {
      return false;
    }

    // SECURITY: ALWAYS deny if user doesn't exist in database
    if (!hasValidDatabaseUser) {
      return false;
    }

    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((permission) => hasPermission(permission));
  };

  const hasRole = (roles: UserRole[]): boolean => {
    // SECURITY: ALWAYS deny if not authenticated
    if (!isSignedIn || !isClerkLoaded) {
      return false;
    }

    // SECURITY: ALWAYS deny if user doesn't exist in database
    if (!hasValidDatabaseUser) {
      return false;
    }

    return roles.includes(userRole);
  };

  // Computed properties for common checks - STRICT security
  const hasAdminAccess: boolean = !!(
    isSignedIn &&
    isClerkLoaded &&
    hasValidDatabaseUser &&
    userRole &&
    (userRole === "developer" || userRole === "org_admin")
  );

  const canManageUsers = hasPermission(PERMISSIONS.MANAGE_USERS);
  const canManageClients = hasPermission(PERMISSIONS.MANAGE_CLIENTS);
  const canProcessPayrolls = hasPermission(PERMISSIONS.PROCESS_PAYROLLS);
  const canViewFinancials = hasPermission(PERMISSIONS.VIEW_FINANCIALS);

  // Enhanced sign out
  const signOut = async () => {
    try {
      await clerkSignOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Refresh user data (simplified without mutex)
  const refreshUserData = async () => {
    try {
      // Force a refetch of the current user data
      // Apollo will handle deduplication automatically
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing user data:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    // Authentication state
    isAuthenticated: !!isSignedIn,
    isLoading: !isClerkLoaded || dbUserLoading,
    userId: userId || null,
    userEmail: user?.emailAddresses[0]?.emailAddress || null,
    userName: user?.fullName || user?.firstName || null,

    // Role and permissions
    userRole,
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasRole,

    // Admin access checks
    hasAdminAccess,
    canManageUsers,
    canManageClients,
    canProcessPayrolls,
    canViewFinancials,

    // Actions
    signOut,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// Export permissions for use in other components
export { PERMISSIONS };
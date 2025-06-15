"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export type UserRole =
  | "admin"
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer";

export interface Permission {
  id: string;
  name: string;
  description: string;
}

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
  admin: [
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
    getToken,
  } = useAuth();
  const { user } = useUser();
  const {
    currentUser: databaseUser,
    loading: dbUserLoading,
    extractionAttempts,
  } = useCurrentUser();
  const [userRole, setUserRole] = useState<UserRole>("viewer");
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [hasValidDatabaseUser, setHasValidDatabaseUser] = useState(false);
  const [lastValidationTime, setLastValidationTime] = useState<number>(0);

  // Monitor database user status with debouncing
  useEffect(() => {
    // Debounce validation to prevent excessive logging
    const now = Date.now();
    if (now - lastValidationTime < 2000) {
      // 2 second debounce
      return;
    }

    if (isSignedIn && !dbUserLoading && isClerkLoaded) {
      setLastValidationTime(now);
      const newValidStatus = !!databaseUser;

      // Only update state if it actually changed
      if (hasValidDatabaseUser !== newValidStatus) {
        setHasValidDatabaseUser(newValidStatus);
      }

      if (newValidStatus && databaseUser) {
        // If we have a database user, use their role directly
        const newRole = databaseUser.role as UserRole;
        if (userRole !== newRole) {
          setUserRole(newRole);
        }
        setIsRoleLoading(false);
      } else {
        // Only log warning if we've tried multiple times and still no user
        if (extractionAttempts >= 2) {
          console.warn(
            "🚨 AuthContext - SECURITY: Authenticated user not found in database after multiple attempts",
            {
              clerkUserId: userId,
              userEmail: user?.emailAddresses?.[0]?.emailAddress,
              extractionAttempts,
            }
          );
        }

        // If no database user, fall back to JWT role (but only if not already loading)
        if (!isRoleLoading) {
          fetchUserRole();
        }
      }
    } else if (!isSignedIn && isClerkLoaded) {
      // User signed out - reset state
      if (hasValidDatabaseUser || userRole !== "viewer") {
        setHasValidDatabaseUser(false);
        setUserRole("viewer");
        setIsRoleLoading(false);
      }
    }
  }, [
    isSignedIn,
    databaseUser,
    dbUserLoading,
    userId,
    user,
    isClerkLoaded,
    extractionAttempts,
    hasValidDatabaseUser,
    userRole,
    isRoleLoading,
    lastValidationTime,
  ]);

  // Fetch user role from JWT token (only used as fallback)
  async function fetchUserRole() {
    if (!isClerkLoaded || !userId) {
      setIsRoleLoading(false);
      return;
    }

    try {
      setIsRoleLoading(true);
      const token = await getToken({ template: "hasura" });
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const claims = payload["https://hasura.io/jwt/claims"];
        const role = claims?.["x-hasura-default-role"] as UserRole;

        if (role && ROLE_PERMISSIONS[role]) {
          setUserRole(role);
        } else {
          setUserRole("viewer");
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("viewer");
    } finally {
      setIsRoleLoading(false);
    }
  }

  // Update permissions when role changes
  useEffect(() => {
    if (userRole) {
      const newPermissions = ROLE_PERMISSIONS[userRole] || [];
      // Only update if permissions actually changed
      if (JSON.stringify(permissions) !== JSON.stringify(newPermissions)) {
        setPermissions(newPermissions);
      }
    }
  }, [userRole, permissions]);

  // Permission check functions - now security-aware
  const hasPermission = (permission: string): boolean => {
    // Don't grant any permissions if user doesn't exist in database
    if (!hasValidDatabaseUser && isSignedIn) {
      // Only log warning occasionally to prevent spam
      if (Math.random() < 0.1) {
        // 10% chance to log
        console.warn("🚨 Permission denied: User not found in database");
      }
      return false;
    }
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    // Don't grant any permissions if user doesn't exist in database
    if (!hasValidDatabaseUser && isSignedIn) {
      // Only log warning occasionally to prevent spam
      if (Math.random() < 0.1) {
        // 10% chance to log
        console.warn("🚨 Permission denied: User not found in database");
      }
      return false;
    }
    return requiredPermissions.some((permission) =>
      permissions.includes(permission)
    );
  };

  const hasRole = (roles: UserRole[]): boolean => {
    // Don't grant any roles if user doesn't exist in database
    if (!hasValidDatabaseUser && isSignedIn) {
      // Only log warning occasionally to prevent spam
      if (Math.random() < 0.1) {
        // 10% chance to log
        console.warn("🚨 Role check denied: User not found in database");
      }
      return false;
    }
    return roles.includes(userRole);
  };

  // Computed properties for common checks
  const hasAdminAccess =
    hasValidDatabaseUser && (userRole === "admin" || userRole === "org_admin");
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

  // Refresh user data
  const refreshUserData = async () => {
    if (!userId) return;

    setIsRoleLoading(true);
    try {
      const token = await getToken({ template: "hasura" });
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const claims = payload["https://hasura.io/jwt/claims"];
        const role = claims?.["x-hasura-default-role"] as UserRole;

        if (role && ROLE_PERMISSIONS[role]) {
          setUserRole(role);
        }
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setIsRoleLoading(false);
    }
  };

  const value: AuthContextType = {
    // Authentication state
    isAuthenticated: !!isSignedIn,
    isLoading: !isClerkLoaded || isRoleLoading,
    userId: userId || null,
    userEmail: user?.emailAddresses[0]?.emailAddress || null,
    userName: user?.fullName || user?.firstName || null,

    // Role and permissions
    userRole,
    userPermissions: permissions,
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

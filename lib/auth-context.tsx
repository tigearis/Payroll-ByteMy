"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authMutex } from "@/lib/auth/auth-mutex";
import { centralizedTokenManager } from "@/lib/auth/centralized-token-manager";

// Add type declaration for global Clerk object
declare global {
  interface Window {
    Clerk?: {
      session: {
        reload: () => Promise<void>;
        getToken: (options: { template: string }) => Promise<string | null>;
      };
    };
  }
}

export type UserRole =
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer"
  | "developer";

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
  const [validationState, setValidationState] = useState({
    lastValidationTime: 0,
    validationInProgress: false,
    consecutiveFailures: 0,
  });

  // Database user validation with mutex protection
  const validateDatabaseUser = useCallback(async () => {
    if (!isSignedIn || !isClerkLoaded || dbUserLoading) {
      return;
    }

    const now = Date.now();

    // Skip if validation is in progress or too recent (increased to 30 seconds)
    if (
      validationState.validationInProgress ||
      now - validationState.lastValidationTime < 30000
    ) {
      return;
    }

    // Skip if too many consecutive failures (increased threshold)
    if (validationState.consecutiveFailures >= 5) {
      console.warn("🚫 Skipping validation due to consecutive failures");
      return;
    }

    try {
      await authMutex.acquire(
        `user-validation-${userId}-${now}`,
        "session_validation",
        async () => {
          setValidationState((prev) => ({
            ...prev,
            validationInProgress: true,
            lastValidationTime: now,
          }));

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

            // Reset failure count on success
            setValidationState((prev) => ({
              ...prev,
              consecutiveFailures: 0,
            }));
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

            // If no database user, fall back to JWT role
            if (
              !isRoleLoading &&
              !authMutex.hasOperationType("token_refresh")
            ) {
              await fetchUserRole();
            }

            // Increment failure count
            setValidationState((prev) => ({
              ...prev,
              consecutiveFailures: prev.consecutiveFailures + 1,
            }));
          }

          return true;
        }
      );
    } catch (error) {
      console.error("❌ User validation failed:", error);
      setValidationState((prev) => ({
        ...prev,
        consecutiveFailures: prev.consecutiveFailures + 1,
      }));
    } finally {
      setValidationState((prev) => ({
        ...prev,
        validationInProgress: false,
      }));
    }
  }, [
    isSignedIn,
    isClerkLoaded,
    dbUserLoading,
    databaseUser,
    userId,
    user,
    extractionAttempts,
    hasValidDatabaseUser,
    userRole,
    isRoleLoading,
    validationState.validationInProgress,
    validationState.lastValidationTime,
    validationState.consecutiveFailures,
  ]);

  // Handle user sign out state
  const handleSignOutState = useCallback(() => {
    if (!isSignedIn && isClerkLoaded) {
      // User signed out - reset state
      if (hasValidDatabaseUser || userRole !== "viewer") {
        setHasValidDatabaseUser(false);
        setUserRole("viewer");
        setIsRoleLoading(false);
        setValidationState({
          lastValidationTime: 0,
          validationInProgress: false,
          consecutiveFailures: 0,
        });
      }
    }
  }, [isSignedIn, isClerkLoaded, hasValidDatabaseUser, userRole]);

  // Monitor database user status
  useEffect(() => {
    if (isSignedIn) {
      validateDatabaseUser();
    } else {
      handleSignOutState();
    }
  }, [isSignedIn, databaseUser, validateDatabaseUser, handleSignOutState]);

  // Fetch user role from JWT token (only used as fallback) with mutex protection
  const fetchUserRole = useCallback(async () => {
    if (!isClerkLoaded || !userId) {
      setIsRoleLoading(false);
      return;
    }

    try {
      await authMutex.acquire(
        `role-fetch-${userId}-${Date.now()}`,
        "token_refresh",
        async () => {
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
          } else {
            setUserRole("viewer");
          }
          return true;
        }
      );
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("viewer");
    } finally {
      setIsRoleLoading(false);
    }
  }, [isClerkLoaded, userId, getToken]);

  // Memoize permissions to prevent unnecessary recalculations
  const memoizedPermissions = useMemo(() => {
    return ROLE_PERMISSIONS[userRole] || [];
  }, [userRole]);

  // Update permissions when memoized permissions change
  useEffect(() => {
    if (JSON.stringify(permissions) !== JSON.stringify(memoizedPermissions)) {
      setPermissions(memoizedPermissions);
    }
  }, [memoizedPermissions, permissions]);

  // Permission check functions - STRICT security-aware
  const hasPermission = (permission: string): boolean => {
    // SECURITY: ALWAYS deny if not authenticated
    if (!isSignedIn || !isClerkLoaded) {
      return false;
    }

    // SECURITY: ALWAYS deny if user doesn't exist in database
    if (!hasValidDatabaseUser) {
      // Log warning for debugging but don't spam
      if (Math.random() < 0.1) {
        console.warn(
          "🚨 SECURITY: Permission denied - User not found in database",
          {
            isSignedIn,
            hasValidDatabaseUser,
            userId: userId?.substring(0, 8) + "..." || "none",
          }
        );
      }
      return false;
    }

    // SECURITY: Only grant permissions if we have a valid role and permissions
    if (!userRole || userRole === "viewer") {
      return permission === "view_dashboard"; // Only allow basic dashboard view
    }

    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    // SECURITY: Use the strict hasPermission check for each permission
    return requiredPermissions.some((permission) => hasPermission(permission));
  };

  const hasRole = (roles: UserRole[]): boolean => {
    // SECURITY: ALWAYS deny if not authenticated
    if (!isSignedIn || !isClerkLoaded) {
      return false;
    }

    // SECURITY: ALWAYS deny if user doesn't exist in database
    if (!hasValidDatabaseUser) {
      if (Math.random() < 0.1) {
        console.warn(
          "🚨 SECURITY: Role check denied - User not found in database",
          {
            requestedRoles: roles,
            currentRole: userRole,
            hasValidDatabaseUser,
          }
        );
      }
      return false;
    }

    // SECURITY: Only grant roles if we have a valid user role
    if (!userRole) {
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

  // Refresh user data with mutex protection
  const refreshUserData = useCallback(async () => {
    if (!userId) return;

    try {
      await authMutex.acquire(
        `user-refresh-${userId}-${Date.now()}`,
        "session_validation",
        async () => {
          setIsRoleLoading(true);

          // Force token refresh using the centralized token manager
          const token = await centralizedTokenManager.forceRefresh(
            () => getToken({ template: "hasura" }),
            userId
          );

          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const claims = payload["https://hasura.io/jwt/claims"];
            const role = claims?.["x-hasura-default-role"] as UserRole;

            if (role && ROLE_PERMISSIONS[role]) {
              setUserRole(role);
            }
          }

          // Reset validation state on successful refresh
          setValidationState((prev) => ({
            ...prev,
            consecutiveFailures: 0,
            lastValidationTime: Date.now(),
          }));

          return true;
        }
      );
    } catch (error) {
      console.error("Error refreshing user data:", error);
      throw error; // Re-throw for the session handler to catch
    } finally {
      setIsRoleLoading(false);
    }
  }, [userId]);

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

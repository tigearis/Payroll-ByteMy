"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import React, { createContext, useContext, useMemo, useCallback } from "react";
import {
  Role,
  Permission,
  getPermissionsForRole,
  hasRoleLevel,
  ROUTE_PERMISSIONS,
} from "./permissions";
import { useCurrentUser } from "@/hooks/use-current-user";

// Using pure Clerk native functions - no custom token management needed

export type UserRole = Role;

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

  // Has valid database user for security checks
  const hasValidDatabaseUser = !dbUserLoading && !!databaseUser && !dbUserError;

  // Helper function to check permissions using new system
  const hasPermission = useCallback(
    (permission: string): boolean => {
      // SECURITY: ALWAYS deny if not authenticated
      if (!isSignedIn || !isClerkLoaded) return false;

      // SECURITY: ALWAYS deny if user doesn't exist in database
      if (!hasValidDatabaseUser) return false;

      // Get user's permissions from role
      const userPermissions = getPermissionsForRole(userRole);
      return userPermissions.includes(permission as Permission);
    },
    [isSignedIn, isClerkLoaded, hasValidDatabaseUser, userRole]
  );

  // Memoize permissions to prevent unnecessary recalculations
  const userPermissions = useMemo(() => {
    return getPermissionsForRole(userRole);
  }, [userRole]);

  // Permission check functions - STRICT security-aware
  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some(permission => hasPermission(permission));
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

  // Update computed permissions using new system
  const computedPermissions = useMemo(() => {
    if (!userRole) return {};

    const userPermissions = getPermissionsForRole(userRole);

    return {
      // Staff management
      canManageStaff: userPermissions.includes("staff:write"),
      canViewStaff: userPermissions.includes("staff:read"),
      canInviteStaff: userPermissions.includes("staff:invite"),

      // Client management
      canManageClients: userPermissions.includes("client:write"),
      canViewClients: userPermissions.includes("client:read"),

      // Payroll operations
      canProcessPayrolls: userPermissions.includes("payroll:write"),
      canViewPayrolls: userPermissions.includes("payroll:read"),

      // System administration
      canManageSettings: userPermissions.includes("settings:write"),
      canAccessAdmin: userPermissions.includes("admin:manage"),

      // Reporting
      canViewReports: userPermissions.includes("reports:read"),
      canExportReports: userPermissions.includes("reports:export"),

      // Audit
      canViewAudit: userPermissions.includes("audit:read"),
      canManageAudit: userPermissions.includes("audit:write"),

      // Role-based checks
      isDeveloper: userRole === "developer",
      isAdministrator: userRole === "org_admin",
      isManager: userRole === "manager",
      isConsultant: userRole === "consultant",
      isViewer: userRole === "viewer",

      // Role hierarchy checks
      hasAdminAccess: hasRoleLevel(userRole, "org_admin"),
      hasManagerAccess: hasRoleLevel(userRole, "manager"),

      // User management (staff management)
      canManageUsers: userPermissions.includes("staff:write"),

      // Financial access
      canViewFinancials: userPermissions.includes("reports:read"),
    };
  }, [userRole]);

  // Enhanced sign out
  const signOut = async () => {
    try {
      await clerkSignOut({ redirectUrl: "/" });
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
    hasAdminAccess: computedPermissions.hasAdminAccess || false,
    canManageUsers: computedPermissions.canManageUsers || false,
    canManageClients: computedPermissions.canManageClients || false,
    canProcessPayrolls: computedPermissions.canProcessPayrolls || false,
    canViewFinancials: computedPermissions.canViewFinancials || false,

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

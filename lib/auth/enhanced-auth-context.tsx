"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import {
  createContext,
  useContext,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Permission,
  Role,
  getPermissionsForRole,
  hasRoleLevel,
} from "./permissions";

// Simplified auth context interface
export interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  user: any;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: Role;
  databaseId: string | null;

  // Core permissions
  userPermissions: Permission[];
  permissionOverrides: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: Role) => boolean;
  hasRoleLevel: (requiredRole: Role) => boolean;

  // Common access checks
  hasAdminAccess: boolean;
  canManageUsers: boolean;
  canManageClients: boolean;
  canProcessPayrolls: boolean;
  canViewFinancials: boolean;

  // Utility functions
  signOut: () => Promise<void>;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    isLoaded: isClerkLoaded,
    isSignedIn,
    userId,
    signOut: clerkSignOut,
    sessionClaims,
  } = useAuth();
  const { user } = useUser();
  const {
    currentUser: databaseUser,
    loading: dbUserLoading,
    error: dbUserError,
  } = useCurrentUser();

  // Extract database ID from JWT claims or user metadata
  const databaseId = useMemo(() => {
    const claims = sessionClaims?.[
      "https://hasura.io/jwt/claims"
    ] as HasuraJWTClaims;
    return (
      claims?.["x-hasura-user-id"] ||
      (user?.publicMetadata?.databaseId as string) ||
      null
    );
  }, [sessionClaims, user?.publicMetadata?.databaseId]);

  // Determine user role with security priority
  const userRole = useMemo((): Role => {
    // Prefer database user role for security
    const dbRole = databaseUser?.role;
    if (dbRole) {
      return dbRole as Role;
    }

    // Fallback to JWT claims
    const claims = sessionClaims?.[
      "https://hasura.io/jwt/claims"
    ] as HasuraJWTClaims;
    const jwtRole = claims?.["x-hasura-default-role"];

    return (jwtRole as Role) || "viewer";
  }, [databaseUser?.role, sessionClaims]);

  // Check if we have a valid authenticated user
  const isValidUser = !dbUserLoading && !!databaseUser && !dbUserError;

  // Get user permissions based on role
  const userPermissions = useMemo(() => {
    return getPermissionsForRole(userRole);
  }, [userRole]);

  // Get permission overrides from user metadata
  const permissionOverrides = useMemo(() => {
    const metadata = user?.publicMetadata as UserPublicMetadata | undefined;
    return metadata?.permissionOverrides || [];
  }, [user?.publicMetadata]);

  // Core permission checking function with overrides support
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      // SECURITY: Always deny if not authenticated or no valid database user
      if (!isSignedIn || !isClerkLoaded || !isValidUser) return false;

      // Check permission overrides first (they take precedence)
      if (permissionOverrides.includes(permission)) {
        return true;
      }

      // Fall back to role-based permissions
      return userPermissions.includes(permission);
    },
    [
      isSignedIn,
      isClerkLoaded,
      isValidUser,
      userPermissions,
      permissionOverrides,
    ]
  );

  // Check multiple permissions (OR logic)
  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.some(permission => hasPermission(permission));
    },
    [hasPermission]
  );

  // Check if user has specific role
  const hasRole = useCallback(
    (role: Role): boolean => {
      if (!isValidUser) return false;
      return userRole === role;
    },
    [isValidUser, userRole]
  );

  // Check if user has role level or higher
  const hasRoleLevelCheck = useCallback(
    (requiredRole: Role): boolean => {
      if (!isValidUser) return false;
      return hasRoleLevel(userRole, requiredRole);
    },
    [userRole, isValidUser]
  );

  // Computed access permissions
  const accessPermissions = useMemo(() => {
    if (!isValidUser) {
      return {
        hasAdminAccess: false,
        canManageUsers: false,
        canManageClients: false,
        canProcessPayrolls: false,
        canViewFinancials: false,
      };
    }

    return {
      hasAdminAccess: hasRoleLevel(userRole, "org_admin"),
      canManageUsers: userPermissions.includes("staff:write"),
      canManageClients: userPermissions.includes("client:write"),
      canProcessPayrolls: userPermissions.includes("payroll:write"),
      canViewFinancials: userPermissions.includes("reports:read"),
    };
  }, [userRole, userPermissions, isValidUser]);

  // Utility functions
  const signOut = useCallback(async () => {
    try {
      await clerkSignOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [clerkSignOut]);

  const refreshUserData = useCallback(() => {
    window.location.reload();
  }, []);

  const contextValue: AuthContextType = {
    // Authentication state
    isAuthenticated: !!isSignedIn,
    isLoading: !isClerkLoaded || dbUserLoading,
    isLoaded: isClerkLoaded,
    isSignedIn: isSignedIn || false,
    user,
    userId: userId || null,
    userEmail: user?.emailAddresses[0]?.emailAddress || null,
    userName: user?.fullName || user?.firstName || null,
    userRole,
    databaseId,

    // Core permissions
    userPermissions,
    permissionOverrides,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasRoleLevel: hasRoleLevelCheck,

    // Access permissions
    ...accessPermissions,

    // Utility functions
    signOut,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Single hook to use auth context
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// Backward compatibility aliases (all point to the same hook)
export const useEnhancedAuth = useAuthContext;
export const useEnhancedPermissions = useAuthContext;

// Type exports
export type EnhancedAuthContextType = AuthContextType;
export const EnhancedAuthProvider = AuthProvider;

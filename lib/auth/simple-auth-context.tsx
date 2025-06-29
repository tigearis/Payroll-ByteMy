"use client";

/**
 * Simplified Authentication Context
 * 
 * Replaces the complex enhanced-auth-context.tsx with basic authentication
 * and simple role-based access control.
 */

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
  SimpleRole,
  SimpleAccessLevels,
  getAccessLevels,
  sanitizeRole,
  createAuditLog,
  SimpleAuditEvent,
} from "./simple-permissions";

// Simplified auth context interface
export interface SimpleAuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  user: any;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: SimpleRole;
  databaseId: string | null;

  // Simplified access levels
  isAdmin: boolean;
  isManager: boolean;
  isDeveloper: boolean;
  canManageUsers: boolean;
  canManageSystem: boolean;

  // Utility functions
  signOut: () => Promise<void>;
  refreshUserData: () => void;
  logAuditEvent: (event: SimpleAuditEvent, details?: Record<string, any>) => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

interface SimpleAuthProviderProps {
  children: ReactNode;
}

export function SimpleAuthProvider({ children }: SimpleAuthProviderProps) {
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
    ] as any;
    return (
      claims?.["x-hasura-user-id"] ||
      (user?.publicMetadata?.databaseId as string) ||
      null
    );
  }, [sessionClaims, user?.publicMetadata?.databaseId]);

  // Determine user role with security priority (database first, then JWT, then metadata)
  const userRole = useMemo((): SimpleRole => {
    // Priority 1: Database user role (most secure)
    if (databaseUser?.role) {
      console.log("🔍 Using database role:", databaseUser.role);
      return sanitizeRole(databaseUser.role);
    }

    // Priority 2: JWT claims
    const claims = sessionClaims?.[
      "https://hasura.io/jwt/claims"
    ] as any;
    const jwtRole = claims?.["x-hasura-default-role"];
    if (jwtRole) {
      console.log("🔍 Using JWT role:", jwtRole);
      return sanitizeRole(jwtRole);
    }
    
    // Priority 3: User metadata
    const metadataRole = user?.publicMetadata?.role;
    if (metadataRole) {
      console.log("🔍 Using metadata role:", metadataRole);
      return sanitizeRole(metadataRole);
    }

    console.log("🔍 No role found, defaulting to viewer");
    return "viewer";
  }, [databaseUser?.role, sessionClaims, user?.publicMetadata]);

  // Check if we have a valid authenticated user
  const isValidUser = !dbUserLoading && !!databaseUser && !dbUserError;
  const isAuthenticated = !!isSignedIn && isClerkLoaded;

  // Get access levels based on role
  const accessLevels = useMemo((): SimpleAccessLevels => {
    if (!isAuthenticated || !isValidUser) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        isManager: false,
        isDeveloper: false,
        canManageUsers: false,
        canManageSystem: false,
      };
    }

    return getAccessLevels(userRole);
  }, [isAuthenticated, isValidUser, userRole]);

  // Simple audit logging
  const logAuditEvent = useCallback(
    (event: SimpleAuditEvent, details?: Record<string, any>) => {
      const auditLog = createAuditLog(event, {
        ...details,
        userId,
        userRole,
        timestamp: new Date().toISOString(),
      });
      
      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("📋 Audit Event:", auditLog);
      }
      
      // In production, this would send to your audit logging service
      // For now, we'll just log to console
      console.log("Audit:", JSON.stringify(auditLog));
    },
    [userId, userRole]
  );

  // Utility functions
  const signOut = useCallback(async () => {
    try {
      logAuditEvent("auth_logout");
      await clerkSignOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [clerkSignOut, logAuditEvent]);

  const refreshUserData = useCallback(() => {
    // Simple refresh - reload the page
    // In a more sophisticated implementation, you might refresh just the user data
    window.location.reload();
  }, []);

  // Log login events
  const prevIsAuthenticated = useMemo(() => isAuthenticated, []);
  if (isAuthenticated && !prevIsAuthenticated) {
    logAuditEvent("auth_login", { method: "clerk" });
  }

  const contextValue: SimpleAuthContextType = {
    // Authentication state
    isAuthenticated,
    isLoading: !isClerkLoaded || dbUserLoading,
    isLoaded: isClerkLoaded,
    user,
    userId: userId || null,
    userEmail: user?.emailAddresses[0]?.emailAddress || null,
    userName: user?.fullName || user?.firstName || null,
    userRole,
    databaseId,

    // Access levels
    isAdmin: accessLevels.isAdmin,
    isManager: accessLevels.isManager,
    isDeveloper: accessLevels.isDeveloper,
    canManageUsers: accessLevels.canManageUsers,
    canManageSystem: accessLevels.canManageSystem,

    // Utility functions
    signOut,
    refreshUserData,
    logAuditEvent,
  };

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

// Hook to use simple auth context
export function useSimpleAuth(): SimpleAuthContextType {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider");
  }
  return context;
}

// Backward compatibility aliases
export const useAuthContext = useSimpleAuth;
export const useEnhancedAuth = useSimpleAuth;
export const AuthProvider = SimpleAuthProvider;

// Type exports
export type AuthContextType = SimpleAuthContextType;
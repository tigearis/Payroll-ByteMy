/**
 * Clean Authentication System
 *
 * Minimal authentication - only checks if user is logged in.
 * No permissions, roles, or complex logic.
 */

import { auth } from "@clerk/nextjs/server";

// Re-export Clerk hooks for convenience
export { useAuth, useUser } from "@clerk/nextjs";

// Export simple auth hooks
export { useAuthContext, useSimpleAuth } from "./simple-auth-hook";

// Export API auth utilities
export { withAuth, withAuthParams, authenticateApiRequest, type AuthSession } from "./api-auth";

// Migration object for backward compatibility
export const migration = {
  hasPermission: () => true,
  permissionToRole: {},
};

// Simple auth guard type
export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * JWT Claims Helper Functions
 * Helper functions to access JWT claims consistently across the application
 */

export interface JWTClaims {
  userId?: string;
  databaseId?: string;
  clerkId?: string;
  managerId?: string;
  isStaff?: boolean;
  organizationId?: string;
  permissions?: string[];
  defaultRole?: string;
  allowedRoles?: string[];
  permissionHash?: string;
  permissionVersion?: string;
}

/**
 * Extract all JWT claims from current session
 */
export async function getJWTClaims(): Promise<JWTClaims | null> {
  try {
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return null;
    }

    const token = await getToken({ template: "hasura" });
    if (!token) {
      return { userId };
    }

    const base64Payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(base64Payload));
    const hasuraClaims = decodedPayload["https://hasura.io/jwt/claims"];

    return {
      userId,
      databaseId: hasuraClaims?.["x-hasura-user-id"],
      clerkId: hasuraClaims?.["x-hasura-clerk-id"],
      managerId: hasuraClaims?.["x-hasura-manager-id"],
      isStaff: hasuraClaims?.["x-hasura-is-staff"] === "true" || hasuraClaims?.["x-hasura-is-staff"] === true,
      organizationId: hasuraClaims?.["x-hasura-org-id"],
      permissions: hasuraClaims?.["x-hasura-permissions"],
      defaultRole: hasuraClaims?.["x-hasura-default-role"],
      allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
      permissionHash: hasuraClaims?.["x-hasura-permission-hash"],
      permissionVersion: hasuraClaims?.["x-hasura-permission-version"],
    };
  } catch (error) {
    console.warn("Could not extract JWT claims:", error);
    return null;
  }
}

/**
 * Get user's current role from JWT
 */
export async function getCurrentRole(): Promise<string | null> {
  const claims = await getJWTClaims();
  return claims?.defaultRole || null;
}

/**
 * Get user's allowed roles from JWT
 */
export async function getAllowedRoles(): Promise<string[]> {
  const claims = await getJWTClaims();
  return claims?.allowedRoles || [];
}

/**
 * Get user's permissions from JWT
 */
export async function getUserPermissions(): Promise<string[]> {
  const claims = await getJWTClaims();
  return claims?.permissions || [];
}

/**
 * Check if user has staff status
 */
export async function isUserStaff(): Promise<boolean> {
  const claims = await getJWTClaims();
  return claims?.isStaff || false;
}

/**
 * Get user's manager ID
 */
export async function getManagerId(): Promise<string | null> {
  const claims = await getJWTClaims();
  return claims?.managerId || null;
}

/**
 * Get user's organization ID
 */
export async function getOrganizationId(): Promise<string | null> {
  const claims = await getJWTClaims();
  return claims?.organizationId || null;
}

/**
 * Validate permission hash for tamper detection
 */
export async function validatePermissionHash(expectedHash?: string): Promise<boolean> {
  if (!expectedHash) return true; // Skip validation if no hash provided
  
  const claims = await getJWTClaims();
  return claims?.permissionHash === expectedHash;
}

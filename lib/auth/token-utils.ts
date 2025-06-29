import "server-only";
import { auth } from "@clerk/nextjs/server";
import type { Permission, Role } from "./permissions";
// Import shared JWT utilities
import { decodeJWTToken, extractUserIdFromTokenPayload } from "./jwt-shared-utils";

/**
 * Universal token utilities for JWT tokens and claims
 * Provides consistent token retrieval across client, server, API routes, and middleware
 * Compatible with Node.js runtime, Edge runtime, and browser environments
 */

/**
 * Get authentication token - server-side only
 * For client-side token retrieval, use client-token-utils.ts
 */
export async function getAuthToken(template?: string): Promise<string | null> {
  const isServer = typeof window === "undefined";

  if (!isServer) {
    throw new Error(
      "getAuthToken can only be used server-side. Use client-token-utils for client-side token retrieval."
    );
  }

  try {
    const { getToken } = await auth();
    return template ? await getToken({ template }) : await getToken();
  } catch (error) {
    console.error("Failed to get server-side token:", error);
    return null;
  }
}

/**
 * Universal authenticated fetch - adds Bearer token automatically
 */
export async function authFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const token = await getAuthToken("hasura");

  if (token) {
    options = {
      ...(options || {}),
      headers: {
        ...(options?.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return await fetch(url, options);
}

// Constants
const DEFAULT_ROLE = "viewer";
const DEFAULT_ALLOWED_ROLES = ["viewer"];
const HASURA_CLAIMS_NAMESPACE = "https://hasura.io/jwt/claims";
const TEMPLATE = "hasura";

/**
 * Parse allowed roles from various formats
 */
function parseAllowedRoles(
  allowedRoles: string | string[] | undefined
): string[] {
  if (!allowedRoles) return DEFAULT_ALLOWED_ROLES;

  if (Array.isArray(allowedRoles)) {
    return allowedRoles.length > 0 ? allowedRoles : DEFAULT_ALLOWED_ROLES;
  }

  if (typeof allowedRoles === "string") {
    const roles = allowedRoles
      .split(",")
      .map(role => role.trim())
      .filter(Boolean);
    return roles.length > 0 ? roles : DEFAULT_ALLOWED_ROLES;
  }

  return DEFAULT_ALLOWED_ROLES;
}

/**
 * Parse permission overrides from JWT or metadata
 */
function parsePermissionOverrides(
  permissionOverrides: string | Permission[] | undefined
): Permission[] | null {
  if (!permissionOverrides) return null;

  if (Array.isArray(permissionOverrides)) {
    return permissionOverrides.length > 0 ? permissionOverrides : null;
  }

  if (typeof permissionOverrides === "string") {
    try {
      const parsed = JSON.parse(permissionOverrides);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      console.warn(
        "Failed to parse permission overrides:",
        permissionOverrides
      );
    }
  }

  return null;
}

/**
 * Get Hasura token with user metadata
 * This returns the custom JWT token generated from the Hasura template
 */
export async function getHasuraToken(): Promise<TokenResult> {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: TEMPLATE });

    if (!token) {
      return {
        token: null,
        userId: null,
        clerkUserId: null,
        error: "No Hasura token available",
      };
    }

    // Decode the JWT token to extract user IDs
    const decodedPayload = decodeJWTToken(token);
    if (!decodedPayload) {
      return {
        token: null,
        userId: null,
        clerkUserId: null,
        error: "Failed to decode JWT token",
      };
    }

    const { userId, clerkUserId } =
      extractUserIdFromTokenPayload(decodedPayload);

    return {
      token,
      userId,
      clerkUserId,
    };
  } catch (error) {
    console.error("Failed to get Hasura token:", error);
    return {
      token: null,
      userId: null,
      clerkUserId: null,
      error: error instanceof Error ? error.message : "Token retrieval error",
    };
  }
}

/**
 * Get session claims with enhanced permission overrides
 * Uses both sessionClaims (for session data) and custom JWT template (for Hasura claims)
 * This approach correctly handles the difference between session tokens and custom JWT templates
 */
export async function getSessionClaims(): Promise<ClaimsResult> {
  try {
    const authResult = await auth();

    if (!authResult.userId) {
      return {
        userId: null,
        clerkUserId: null,
        claims: null,
        role: DEFAULT_ROLE,
        allowedRoles: DEFAULT_ALLOWED_ROLES,
        permissionOverrides: null,
        error: "No authenticated user found",
      };
    }

    const { userId: clerkUserId, sessionClaims, getToken } = authResult;

    // Extract public metadata from session claims
    const publicMetadata = sessionClaims?.publicMetadata as
      | UserPublicMetadata
      | undefined;

    // Get custom JWT token for Hasura claims (contains our custom template data)
    // This is the preferred source as it contains the most up-to-date role/permission data
    let hasuraClaims: HasuraJWTClaims | undefined;

    try {
      const hasuraToken = await getToken({ template: TEMPLATE });
      if (hasuraToken) {
        // Safely decode JWT payload - this contains our custom Hasura template claims
        const payload = decodeJWTToken(hasuraToken);
        hasuraClaims = payload?.[HASURA_CLAIMS_NAMESPACE] as HasuraJWTClaims;
      }
    } catch (error) {
      console.warn("Failed to get or decode custom JWT token:", error);
      // Will fall back to sessionClaims below
    }

    // Fallback to sessionClaims if custom JWT token is unavailable
    // This can happen during token refresh or in edge cases
    if (!hasuraClaims && sessionClaims?.[HASURA_CLAIMS_NAMESPACE]) {
      hasuraClaims = sessionClaims[HASURA_CLAIMS_NAMESPACE] as HasuraJWTClaims;
    }

    // Data source priority: Custom JWT claims > sessionClaims > publicMetadata > defaults
    // This ensures we use the most current and reliable data source available
    const role =
      hasuraClaims?.["x-hasura-default-role"] ||
      publicMetadata?.role ||
      DEFAULT_ROLE;

    const allowedRoles = parseAllowedRoles(
      hasuraClaims?.["x-hasura-allowed-roles"] || publicMetadata?.allowedRoles
    );

    const permissionOverrides = parsePermissionOverrides(
      hasuraClaims?.["x-hasura-permission-overrides"] ||
        publicMetadata?.permissionOverrides
    );

    // Database user ID - prioritize custom JWT claims as they're generated server-side
    const userId =
      hasuraClaims?.["x-hasura-user-id"] || publicMetadata?.databaseId || null;

    return {
      userId,
      clerkUserId,
      claims: sessionClaims,
      role,
      allowedRoles,
      permissionOverrides,
      ...(hasuraClaims && { hasuraClaims }),
      hasCompleteData: !!(userId && role && hasuraClaims),
    };
  } catch (error) {
    console.error("Failed to get session claims:", error);
    return {
      userId: null,
      clerkUserId: null,
      claims: null,
      role: DEFAULT_ROLE,
      allowedRoles: DEFAULT_ALLOWED_ROLES,
      permissionOverrides: null,
      error: error instanceof Error ? error.message : "Authentication error",
    };
  }
}

/**
 * Create authorization headers for API requests
 */
export async function createAuthHeaders(): Promise<AuthHeaders> {
  const { token, error } = await getHasuraToken();

  if (error || !token) {
    console.warn("No auth token available for request:", error);
    return {};
  }

  return {
    authorization: `Bearer ${token}`,
  };
}

/**
 * Check if user has specific role
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const { role } = await getSessionClaims();
  return role === requiredRole;
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(requiredRoles: string[]): Promise<boolean> {
  const { allowedRoles } = await getSessionClaims();
  return requiredRoles.some(role => allowedRoles.includes(role));
}

/**
 * Get user role and allowed roles
 */
export async function getUserRoles(): Promise<{
  role: string;
  allowedRoles: string[];
}> {
  const { role, allowedRoles } = await getSessionClaims();
  return { role, allowedRoles };
}

/**
 * Get user IDs (both database and Clerk)
 */
export async function getUserIds(): Promise<{
  userId: string | null;
  clerkUserId: string | null;
}> {
  const { userId, clerkUserId } = await getSessionClaims();
  return { userId, clerkUserId };
}

/**
 * Get database user ID specifically
 */
export async function getDatabaseUserId(): Promise<string | null> {
  const { userId } = await getSessionClaims();
  return userId;
}

/**
 * Get Clerk user ID specifically
 */
export async function getClerkUserId(): Promise<string | null> {
  const { clerkUserId } = await getSessionClaims();
  return clerkUserId;
}

/**
 * Get permission overrides for user
 */
export async function getPermissionOverrides(): Promise<Permission[] | null> {
  const { permissionOverrides } = await getSessionClaims();
  return permissionOverrides || null;
}

/**
 * Get user's complete authorization context
 */
export async function getAuthorizationContext(): Promise<AuthorizationContext> {
  const { userId, clerkUserId, role, allowedRoles, permissionOverrides } =
    await getSessionClaims();
  return {
    userId,
    clerkUserId,
    role,
    allowedRoles,
    permissionOverrides: permissionOverrides || null,
  };
}

/**
 * Advanced permission checking with context
 */
export async function checkPermissionWithContext(
  requiredPermission: string,
  _context?: Record<string, any>
): Promise<PermissionValidationResult> {
  const { role, permissionOverrides } = await getSessionClaims();

  // Check if permission is in overrides
  if (permissionOverrides?.includes(requiredPermission as Permission)) {
    return { hasPermission: true };
  }

  // For now, basic permission checking - can be enhanced later
  return {
    hasPermission: false,
    reason: `Permission '${requiredPermission}' not granted for role '${role}'`,
    suggestedAction: "Request additional permissions or role upgrade",
    currentRole: role as Role,
  };
}

/**
 * Get JWT claims with fallback for middleware
 * Enhanced version that returns complete claims result
 */
export async function getJWTClaimsWithFallback() {
  return await getSessionClaims();
}

// Types are available globally from types/global.d.ts

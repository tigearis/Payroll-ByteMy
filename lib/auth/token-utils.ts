import "server-only";
import { auth } from "@clerk/nextjs/server";

/**
 * Centralized token utility for Hasura JWT tokens
 * Provides consistent token retrieval across API routes and server components
 * 
 * SERVER-ONLY: This module can only be used in server contexts
 */

export interface TokenResult {
  token: string | null;
  userId: string | null;
  error?: string;
}

/**
 * Get Hasura JWT token for server-side operations
 * Uses the custom Hasura template to get tokens with proper claims
 */
export async function getHasuraToken(): Promise<TokenResult> {
  try {
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return {
        token: null,
        userId: null,
        error: "No authenticated user found"
      };
    }

    // Get token using Hasura template - this includes the JWT claims namespace
    const token = await getToken({ template: "hasura" });
    
    if (!token) {
      console.error("Failed to get Hasura template token for user:", userId);
      return {
        token: null,
        userId,
        error: "Failed to get Hasura template token"
      };
    }

    return {
      token,
      userId
    };
  } catch (error) {
    console.error("Failed to get Hasura token:", error);
    return {
      token: null,
      userId: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Get session claims for role extraction (uses sessionClaims, not custom JWT)
 */
export async function getSessionClaims() {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return {
        userId: null,
        claims: null,
        role: null,
        error: "No authenticated user found"
      };
    }

    // Extract role from session claims (not custom JWT)
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = 
      hasuraClaims?.["x-hasura-default-role"] ||
      (sessionClaims?.metadata as any)?.role ||
      (sessionClaims?.metadata as any)?.defaultrole ||
      (sessionClaims as any)?.role ||
      "viewer";

    return {
      userId,
      claims: sessionClaims,
      role: userRole,
      hasuraClaims
    };
  } catch (error) {
    console.error("Failed to get session claims:", error);
    return {
      userId: null,
      claims: null,
      role: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Create authorization headers for Apollo Client requests
 */
export async function createAuthHeaders(): Promise<Record<string, string>> {
  const { token, error } = await getHasuraToken();
  
  if (error || !token) {
    console.warn("No auth token available for request:", error);
    return {};
  }

  return {
    authorization: `Bearer ${token}`
  };
}
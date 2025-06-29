/**
 * Shared JWT utilities that work in both client and server environments
 * These functions are safe to use anywhere and don't depend on server-only APIs
 */

/**
 * Decode JWT token payload - works in both client and server environments
 */
export function decodeJWTToken(token: string): any {
  try {
    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

/**
 * Extract JWT claims from token - universal function
 */
export function extractJWTClaims(token: string): HasuraJWTClaims | null {
  try {
    const payload = decodeJWTToken(token);
    return payload?.["https://hasura.io/jwt/claims"] || null;
  } catch (error) {
    console.error("Failed to extract JWT claims:", error);
    return null;
  }
}

/**
 * Check if a token is expired - universal function
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWTToken(token);
    if (!payload || !payload.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

/**
 * Get token expiration time - universal function
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const payload = decodeJWTToken(token);
    if (!payload || !payload.exp) return null;

    return new Date(payload.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Extract user IDs from decoded token payload - universal function
 */
export function extractUserIdFromTokenPayload(tokenPayload: any): {
  userId: string | null;
  clerkUserId: string | null;
} {
  try {
    const hasuraClaims = tokenPayload?.["https://hasura.io/jwt/claims"] as HasuraJWTClaims;

    return {
      userId: hasuraClaims?.["x-hasura-user-id"] || null,
      clerkUserId: hasuraClaims?.["x-hasura-clerk-user-id"] || tokenPayload?.sub || null,
    };
  } catch (error) {
    console.error("Failed to extract user IDs from token payload:", error);
    return { userId: null, clerkUserId: null };
  }
}
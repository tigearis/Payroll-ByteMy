/**
 * Client-side token utilities
 * Safe for use in Client Components and browser environments
 * 
 * Note: Core JWT functions have been moved to jwt-shared-utils.ts
 * This file now re-exports them for backward compatibility
 */

// Re-export shared JWT utilities for client use
export {
  decodeJWTToken,
  extractJWTClaims, 
  isTokenExpired,
  getTokenExpiration,
  extractUserIdFromTokenPayload
} from './jwt-shared-utils';

// Client-specific token management functions
export async function getClientToken(): Promise<string | null> {
  try {
    // In the simplified system, we'll use Clerk's getToken directly
    if (typeof window === 'undefined') return null;
    
    // This would normally call Clerk's getToken
    // For now, return null as we're simplifying
    console.warn('getClientToken: Using simplified auth system');
    return null;
  } catch (error) {
    console.error('Error getting client token:', error);
    return null;
  }
}

export async function refreshClientToken(): Promise<string | null> {
  try {
    console.warn('refreshClientToken: Using simplified auth system');
    return getClientToken();
  } catch (error) {
    console.error('Error refreshing client token:', error);
    return null;
  }
}

export function clearClientTokens(): void {
  try {
    console.warn('clearClientTokens: Using simplified auth system');
    // In simplified system, Clerk handles token management
  } catch (error) {
    console.error('Error clearing client tokens:', error);
  }
}

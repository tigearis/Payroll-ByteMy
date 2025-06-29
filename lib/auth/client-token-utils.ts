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

/**
 * Client-side JWT token refresh utilities
 * Prevents cached/stale token issues by proactively refreshing tokens
 */

import { useAuth } from '@clerk/nextjs';

// Token refresh interval (30 seconds in development, 5 minutes in production)
const REFRESH_INTERVAL = process.env.NODE_ENV === 'development' ? 30 * 1000 : 5 * 60 * 1000;

/**
 * Hook to automatically refresh JWT tokens to prevent cache issues
 */
export function useTokenRefresh() {
  const { getToken } = useAuth();

  const refreshToken = async () => {
    try {
      // Force refresh by requesting new token
      const freshToken = await getToken({ template: 'hasura' });
      if (freshToken) {
        console.log('🔄 JWT token refreshed successfully');
        return freshToken;
      }
    } catch (error) {
      console.warn('⚠️ Token refresh failed:', error);
    }
    return null;
  };

  // Set up automatic refresh interval
  if (typeof window !== 'undefined') {
    setInterval(refreshToken, REFRESH_INTERVAL);
  }

  return { refreshToken };
}

/**
 * Proactively refresh token before navigation
 */
export async function refreshTokenBeforeNavigation() {
  if (typeof window === 'undefined') return;

  try {
    // This function should be called from React context with useAuth hook
    console.log('🔄 Token refresh requested - should be handled by useAuth hook in component');
    // Store timestamp to indicate refresh attempt
    sessionStorage.setItem('token-refresh-time', Date.now().toString());
  } catch (error) {
    console.warn('⚠️ Pre-navigation token refresh failed:', error);
  }
}

/**
 * Check if current token is stale
 */
export function isTokenStale(tokenAgeSeconds: number): boolean {
  const maxAge = process.env.NODE_ENV === 'development' ? 30 : 300; // 30s dev, 5min prod
  return tokenAgeSeconds > maxAge;
}

/**
 * Force token refresh on role changes
 */
export async function forceTokenRefreshOnRoleChange() {
  try {
    // Clear any cached tokens
    if (typeof window !== 'undefined') {
      // Clear Clerk's internal token cache
      sessionStorage.removeItem('clerk-token-cache');
      localStorage.removeItem('clerk-token-cache');
    }

    // This function should be called from React context with useAuth hook
    console.log('🔄 Force token refresh requested - should use useAuth hook');
    
    // Return null since we can't get token in this context
    return null;
  } catch (error) {
    console.error('❌ Force token refresh failed:', error);
  }
  return null;
}
// lib/auth/server-token-manager.ts - Server-side token management
import { auth } from "@clerk/nextjs/server";

interface TokenData {
  encryptedToken: string | null; // Simple base64 encoding for server-side
  plaintextToken?: string; // Fallback
  expiresAt: number;
  userId: string;
  encrypted: boolean;
}

interface RefreshMetrics {
  totalRefreshes: number;
  successfulRefreshes: number;
  failedRefreshes: number;
  lastRefreshTime: number;
  averageRefreshDuration: number;
}

class ServerTokenManager {
  private static instance: ServerTokenManager;
  private tokenCache = new Map<string, TokenData>();
  private refreshPromises = new Map<string, Promise<string | null>>();
  private refreshMutex = new Map<string, boolean>();
  private metrics: RefreshMetrics = {
    totalRefreshes: 0,
    successfulRefreshes: 0,
    failedRefreshes: 0,
    lastRefreshTime: 0,
    averageRefreshDuration: 0
  };

  private readonly TOKEN_BUFFER_MS = 2 * 60 * 1000; // 2 minutes
  private readonly CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CONCURRENT_REFRESHES = 3;

  private constructor() {
    this.startCacheCleanup();
  }

  static getInstance(): ServerTokenManager {
    if (!ServerTokenManager.instance) {
      ServerTokenManager.instance = new ServerTokenManager();
    }
    return ServerTokenManager.instance;
  }

  /**
   * Get a valid token for the current user (server-side)
   */
  async getToken(): Promise<string | null> {
    try {
      const { userId, getToken } = await auth();
      if (!userId || !getToken) {
        console.warn('🚨 No authenticated user found');
        return null;
      }

      // Check cache first
      const cachedToken = this.getCachedToken(userId);
      if (cachedToken && this.isTokenValid(cachedToken)) {
        return this.getDecodedToken(cachedToken);
      }

      // Check if refresh is already in progress for this user
      if (this.refreshPromises.has(userId)) {
        console.log(`⏳ Token refresh in progress for user ${userId.substring(0, 8)}...`);
        return this.refreshPromises.get(userId)!;
      }

      // Start new refresh
      return this.refreshToken(userId, getToken);
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return null;
    }
  }

  /**
   * Force a token refresh (bypasses cache)
   */
  async forceRefresh(): Promise<string | null> {
    try {
      const { userId, getToken } = await auth();
      if (!userId || !getToken) {
        return null;
      }

      // Clear any cached token
      this.clearTokenForUser(userId);
      
      // Force refresh
      return this.refreshToken(userId, getToken, true);
    } catch (error) {
      console.error('❌ Error forcing token refresh:', error);
      return null;
    }
  }

  /**
   * Clear token cache for current user
   */
  async clearCurrentUserToken(): Promise<void> {
    try {
      const { userId } = await auth();
      if (userId) {
        this.clearTokenForUser(userId);
      }
    } catch (error) {
      console.error('❌ Error clearing user token:', error);
    }
  }

  /**
   * Clear all cached tokens (nuclear option)
   */
  clearAllTokens(): void {
    console.log('🧹 Clearing all cached tokens');
    this.tokenCache.clear();
    this.refreshPromises.clear();
    this.refreshMutex.clear();
  }

  /**
   * Get token management metrics
   */
  getMetrics(): RefreshMetrics & { cachedTokens: number; activeRefreshes: number } {
    return {
      ...this.metrics,
      cachedTokens: this.tokenCache.size,
      activeRefreshes: this.refreshPromises.size
    };
  }

  // Private methods

  private getCachedToken(userId: string): TokenData | null {
    return this.tokenCache.get(userId) || null;
  }

  private isTokenValid(tokenData: TokenData): boolean {
    return tokenData.expiresAt > Date.now() + this.TOKEN_BUFFER_MS;
  }

  private clearTokenForUser(userId: string): void {
    this.tokenCache.delete(userId);
    this.refreshPromises.delete(userId);
    this.refreshMutex.delete(userId);
  }

  /**
   * Generate safe log ID for user without exposing sensitive data
   */
  private generateLogId(userId: string): string {
    // Create a consistent but non-reversible identifier for logging
    return `USER_${userId.substring(0, 4)}****${userId.substring(userId.length - 4)}`;
  }

  /**
   * Cache a token with simple base64 encoding (server-side)
   */
  private cacheEncodedToken(userId: string, token: string, expiresAt: number): void {
    try {
      // Simple base64 encoding for server-side storage
      const encodedToken = Buffer.from(token).toString('base64');
      
      this.tokenCache.set(userId, {
        encryptedToken: encodedToken,
        plaintextToken: undefined,
        expiresAt,
        userId,
        encrypted: true
      });
      console.log(`🔐 Token cached with encoding for user [${this.generateLogId(userId)}]`);
    } catch (error) {
      console.error('❌ Token encoding failed:', error);
      // Fallback: store without encoding
      this.tokenCache.set(userId, {
        encryptedToken: null,
        plaintextToken: token,
        expiresAt,
        userId,
        encrypted: false
      });
    }
  }

  /**
   * Get decoded token from cache (server-side)
   */
  private getDecodedToken(tokenData: TokenData): string | null {
    try {
      if (tokenData.encrypted && tokenData.encryptedToken) {
        // Decode the token
        return Buffer.from(tokenData.encryptedToken, 'base64').toString('utf8');
      } else if (!tokenData.encrypted && tokenData.plaintextToken) {
        // Return plaintext token (fallback case)
        console.warn('⚠️ SECURITY WARNING: Using unencrypted server token');
        return tokenData.plaintextToken;
      } else {
        console.error('❌ Invalid server token data structure');
        return null;
      }
    } catch (error) {
      console.error('❌ Token decoding error:', error);
      return null;
    }
  }

  private async refreshToken(
    userId: string, 
    getTokenFn: (options: { template: string }) => Promise<string | null>,
    force = false
  ): Promise<string | null> {
    const logId = this.generateLogId(userId);
    
    // Prevent too many concurrent refreshes
    if (this.refreshPromises.size >= this.MAX_CONCURRENT_REFRESHES && !force) {
      console.warn(`⚠️ Too many concurrent refreshes, queuing for user [${logId}]`);
      // Wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getToken();
    }

    // Set mutex to prevent multiple refreshes for same user
    if (this.refreshMutex.get(userId)) {
      console.log(`🔒 Refresh already in progress for user [${logId}]`);
      return this.refreshPromises.get(userId) || null;
    }

    this.refreshMutex.set(userId, true);
    const startTime = Date.now();

    const refreshPromise = this.performTokenRefresh(userId, getTokenFn);
    this.refreshPromises.set(userId, refreshPromise);

    try {
      const token = await refreshPromise;
      const duration = Date.now() - startTime;
      
      this.updateMetrics(true, duration);
      console.log(`✅ Token refreshed for user [${logId}] in ${duration}ms`);
      
      return token;
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime);
      console.error(`❌ Token refresh failed for user [${logId}]:`, error);
      return null;
    } finally {
      this.refreshMutex.delete(userId);
      this.refreshPromises.delete(userId);
    }
  }

  private async performTokenRefresh(
    userId: string,
    getTokenFn: (options: { template: string }) => Promise<string | null>
  ): Promise<string | null> {
    try {
      const token = await getTokenFn({ template: 'hasura' });
      if (!token) {
        throw new Error('No token received from Clerk');
      }

      // Parse token to get expiry
      let expiresAt = Date.now() + 55 * 60 * 1000; // Default 55 minutes
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp) {
          expiresAt = payload.exp * 1000 - this.TOKEN_BUFFER_MS;
        }
      } catch (parseError) {
        console.warn('⚠️ Could not parse token expiry, using default');
      }

      // Cache the token with encoding
      this.cacheEncodedToken(userId, token, expiresAt);

      return token;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw error;
    }
  }

  private updateMetrics(success: boolean, duration: number): void {
    this.metrics.totalRefreshes++;
    this.metrics.lastRefreshTime = Date.now();
    
    if (success) {
      this.metrics.successfulRefreshes++;
    } else {
      this.metrics.failedRefreshes++;
    }

    // Update average duration
    const totalDuration = this.metrics.averageRefreshDuration * (this.metrics.totalRefreshes - 1) + duration;
    this.metrics.averageRefreshDuration = Math.round(totalDuration / this.metrics.totalRefreshes);
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      let cleanedCount = 0;

      const userIdsToDelete: string[] = [];
      
      this.tokenCache.forEach((tokenData, userId) => {
        if (tokenData.expiresAt <= now) {
          userIdsToDelete.push(userId);
        }
      });
      
      userIdsToDelete.forEach(userId => {
        this.tokenCache.delete(userId);
        cleanedCount++;
      });

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} expired tokens`);
      }
    }, this.CACHE_CLEANUP_INTERVAL);
  }
}

// Export singleton instance for server-side use
export const serverTokenManager = ServerTokenManager.getInstance();

// Backward compatibility helpers for server-side
export const getToken = () => serverTokenManager.getToken();
export const forceTokenRefresh = () => serverTokenManager.forceRefresh();
export const clearTokenCache = () => serverTokenManager.clearCurrentUserToken();
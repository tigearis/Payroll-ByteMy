// lib/auth/centralized-token-manager.ts - Single source of truth for token management
"use client";

import { tokenEncryption, type EncryptedToken } from "./token-encryption";

// Client-side token manager that works with useAuth hook

interface TokenData {
  encryptedToken: EncryptedToken | null; // Encrypted token storage
  plaintextToken?: string; // Fallback for when encryption fails
  expiresAt: number;
  userId: string;
  encrypted: boolean; // Track encryption status
}

interface RefreshMetrics {
  totalRefreshes: number;
  successfulRefreshes: number;
  failedRefreshes: number;
  lastRefreshTime: number;
  averageRefreshDuration: number;
}

class CentralizedTokenManager {
  private static instance: CentralizedTokenManager;
  private tokenCache = new Map<string, TokenData>();
  private refreshPromises = new Map<string, Promise<string | null>>();
  private refreshMutex = new Map<string, boolean>();
  private refreshAttempts = new Map<string, { count: number; lastAttempt: number }>();
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
  private readonly MAX_REFRESH_ATTEMPTS = 3; // Maximum refresh attempts per user
  private readonly REFRESH_ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.startCacheCleanup();
  }

  static getInstance(): CentralizedTokenManager {
    if (!CentralizedTokenManager.instance) {
      CentralizedTokenManager.instance = new CentralizedTokenManager();
    }
    return CentralizedTokenManager.instance;
  }

  /**
   * Get a valid token for the current user
   * This is the main method all other systems should use
   */
  async getToken(getTokenFn?: () => Promise<string | null>, userId?: string): Promise<string | null> {
    try {
      if (!userId || !getTokenFn) {
        console.warn('🚨 No authenticated user or getToken function provided');
        return null;
      }

      // Check cache first
      const cachedToken = this.getCachedToken(userId);
      if (cachedToken && this.isTokenValid(cachedToken)) {
        const decryptedToken = await this.getDecryptedToken(cachedToken);
        if (decryptedToken) {
          return decryptedToken;
        } else {
          // If decryption fails, clear the cache and refresh
          this.clearTokenForUser(userId);
        }
      }

      // Check if refresh is already in progress for this user
      if (this.refreshPromises.has(userId)) {
        console.log(`⏳ Token refresh in progress for user ${userId.substring(0, 8)}...`);
        return this.refreshPromises.get(userId)!;
      }

      // Start new refresh
      return this.refreshToken(userId, false, getTokenFn);
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return null;
    }
  }

  /**
   * Force a token refresh (bypasses cache)
   */
  async forceRefresh(getTokenFn?: () => Promise<string | null>, userId?: string): Promise<string | null> {
    try {
      if (!userId || !getTokenFn) {
        return null;
      }

      // Clear any cached token
      this.clearTokenForUser(userId);
      
      // Force refresh
      return this.refreshToken(userId, true, getTokenFn);
    } catch (error) {
      console.error('❌ Error forcing token refresh:', error);
      return null;
    }
  }

  /**
   * Clear token cache for specific user
   */
  clearUserToken(userId: string): void {
    try {
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
   * Check if refresh limit is exceeded for a user
   */
  private isRefreshLimitExceeded(userId: string): boolean {
    const now = Date.now();
    const attempts = this.refreshAttempts.get(userId);
    
    if (!attempts) {
      return false;
    }
    
    // Reset attempts if outside the window
    if (now - attempts.lastAttempt > this.REFRESH_ATTEMPT_WINDOW) {
      this.refreshAttempts.delete(userId);
      return false;
    }
    
    return attempts.count >= this.MAX_REFRESH_ATTEMPTS;
  }

  /**
   * Track a refresh attempt
   */
  private trackRefreshAttempt(userId: string): void {
    const now = Date.now();
    const attempts = this.refreshAttempts.get(userId);
    
    if (!attempts || now - attempts.lastAttempt > this.REFRESH_ATTEMPT_WINDOW) {
      // Reset or create new tracking
      this.refreshAttempts.set(userId, { count: 1, lastAttempt: now });
    } else {
      // Increment existing tracking
      attempts.count++;
      attempts.lastAttempt = now;
    }
  }

  /**
   * Reset refresh attempts on successful refresh
   */
  private resetRefreshAttempts(userId: string): void {
    this.refreshAttempts.delete(userId);
  }

  /**
   * Cache a token with encryption
   */
  private async cacheEncryptedToken(userId: string, token: string, expiresAt: number): Promise<void> {
    try {
      // Attempt to encrypt the token
      const encryptedToken = await tokenEncryption.encryptToken(token);
      
      if (encryptedToken) {
        // Store encrypted token
        this.tokenCache.set(userId, {
          encryptedToken,
          plaintextToken: undefined, // Don't store plaintext if encryption succeeded
          expiresAt,
          userId,
          encrypted: true
        });
        console.log(`🔐 Token cached with encryption for user [${this.generateLogId(userId)}]`);
      } else {
        // Fallback: store without encryption but log security warning
        console.warn(`⚠️ SECURITY WARNING: Storing unencrypted token for user [${this.generateLogId(userId)}]`);
        this.tokenCache.set(userId, {
          encryptedToken: null,
          plaintextToken: token,
          expiresAt,
          userId,
          encrypted: false
        });
      }
    } catch (error) {
      console.error('❌ Token caching failed:', error);
      // Emergency fallback: store unencrypted
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
   * Get decrypted token from cache
   */
  private async getDecryptedToken(tokenData: TokenData): Promise<string | null> {
    try {
      if (tokenData.encrypted && tokenData.encryptedToken) {
        // Decrypt the token
        const decryptedToken = await tokenEncryption.decryptToken(tokenData.encryptedToken);
        if (decryptedToken) {
          return decryptedToken;
        } else {
          console.warn('⚠️ Token decryption failed');
          return null;
        }
      } else if (!tokenData.encrypted && tokenData.plaintextToken) {
        // Return plaintext token (fallback case)
        console.warn('⚠️ SECURITY WARNING: Using unencrypted token');
        return tokenData.plaintextToken;
      } else {
        console.error('❌ Invalid token data structure');
        return null;
      }
    } catch (error) {
      console.error('❌ Token decryption error:', error);
      return null;
    }
  }

  private async refreshToken(userId: string, force = false, getTokenFn?: () => Promise<string | null>): Promise<string | null> {
    const logId = this.generateLogId(userId);
    
    if (!getTokenFn) {
      console.error('❌ No getToken function provided for refresh');
      return null;
    }

    // Check refresh attempt limits to prevent infinite loops
    if (!force && this.isRefreshLimitExceeded(userId)) {
      console.error(`🚫 Refresh limit exceeded for user [${logId}] - preventing infinite loop`);
      return null;
    }
    
    // Prevent too many concurrent refreshes
    if (this.refreshPromises.size >= this.MAX_CONCURRENT_REFRESHES && !force) {
      console.warn(`⚠️ Too many concurrent refreshes, queuing for user [${logId}]`);
      // Wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getToken(getTokenFn, userId);
    }

    // Set mutex to prevent multiple refreshes for same user
    if (this.refreshMutex.get(userId)) {
      console.log(`🔒 Refresh already in progress for user [${logId}]`);
      return this.refreshPromises.get(userId) || null;
    }

    // Track the refresh attempt
    this.trackRefreshAttempt(userId);

    this.refreshMutex.set(userId, true);
    const startTime = Date.now();

    const refreshPromise = this.performTokenRefresh(userId, getTokenFn);
    this.refreshPromises.set(userId, refreshPromise);

    try {
      const token = await refreshPromise;
      const duration = Date.now() - startTime;
      
      // Reset attempts on successful refresh
      this.resetRefreshAttempts(userId);
      
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

  private async performTokenRefresh(userId: string, getTokenFn: () => Promise<string | null>): Promise<string | null> {
    try {
      const token = await getTokenFn();
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

      // Cache the token with encryption
      await this.cacheEncryptedToken(userId, token, expiresAt);

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

// Export singleton instance
export const centralizedTokenManager = CentralizedTokenManager.getInstance();

// Helper functions that require auth context
export const createTokenHelpers = (getTokenFn: () => Promise<string | null>, userId: string) => ({
  getToken: () => centralizedTokenManager.getToken(getTokenFn, userId),
  forceRefresh: () => centralizedTokenManager.forceRefresh(getTokenFn, userId),
  clearToken: () => centralizedTokenManager.clearUserToken(userId),
  getDebugInfo: () => centralizedTokenManager.getMetrics()
});
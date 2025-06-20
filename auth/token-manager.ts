// lib/auth/token-manager.ts - Centralized token management system
interface TokenData {
  token: string;
  expiresAt: number;
  isRefreshing: boolean;
}

interface RefreshRequest {
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

class TokenManager {
  private tokenData: TokenData = {
    token: '',
    expiresAt: 0,
    isRefreshing: false,
  };
  
  private refreshQueue: RefreshRequest[] = [];
  private refreshPromise: Promise<string | null> | null = null;
  private lastRefreshAttempt = 0;
  private readonly REFRESH_COOLDOWN = 1000; // 1 second between refresh attempts
  private readonly TOKEN_BUFFER = 2 * 60 * 1000; // 2 minutes buffer before expiry

  /**
   * Gets a valid token, refreshing if necessary
   */
  async getToken(): Promise<string | null> {
    // Check if we have a valid cached token
    if (this.isTokenValid()) {
      return this.tokenData.token;
    }

    // If already refreshing, wait for the current refresh
    if (this.tokenData.isRefreshing && this.refreshPromise) {
      console.log('⏳ Token refresh in progress, waiting for completion');
      return this.refreshPromise;
    }

    // Check refresh cooldown to prevent rapid successive refresh attempts
    const now = Date.now();
    if (now - this.lastRefreshAttempt < this.REFRESH_COOLDOWN) {
      console.warn('⏰ Token refresh on cooldown, using existing token or waiting');
      // If we have any token (even if close to expiry), use it during cooldown
      if (this.hasAnyToken()) {
        return this.tokenData.token;
      }
      // If no token at all, wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, this.REFRESH_COOLDOWN - (now - this.lastRefreshAttempt)));
      return this.getToken();
    }

    // Start refresh process
    return this.refreshToken();
  }

  /**
   * Forces a token refresh and clears cache
   */
  async forceRefresh(): Promise<string | null> {
    console.log('🔄 Forcing token refresh');
    this.clearToken();
    return this.refreshToken();
  }

  /**
   * Clears the token cache
   */
  clearToken(): void {
    console.log('🧹 Clearing token cache');
    this.tokenData = {
      token: '',
      expiresAt: 0,
      isRefreshing: false,
    };
    
    // Reject any queued requests
    this.rejectQueuedRequests(new Error('Token cache cleared'));
  }

  /**
   * Checks if the current token is valid
   */
  private isTokenValid(): boolean {
    return (
      !!this.tokenData.token &&
      this.tokenData.expiresAt > Date.now() + this.TOKEN_BUFFER
    );
  }

  /**
   * Checks if we have any token at all (regardless of expiry)
   */
  private hasAnyToken(): boolean {
    return !!this.tokenData.token;
  }

  /**
   * Queues a token request while refresh is in progress
   */
  private queueRequest(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      // Clean up old requests (older than 30 seconds)
      const now = Date.now();
      this.refreshQueue = this.refreshQueue.filter(req => {
        if (now - req.timestamp > 30000) {
          req.reject(new Error('Request timeout'));
          return false;
        }
        return true;
      });

      // Add to queue
      this.refreshQueue.push({
        resolve,
        reject,
        timestamp: now,
      });
    });
  }

  /**
   * Performs the actual token refresh
   */
  private async refreshToken(): Promise<string | null> {
    if (this.tokenData.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.tokenData.isRefreshing = true;
    this.lastRefreshAttempt = Date.now();

    this.refreshPromise = this.performRefresh();
    
    try {
      const token = await this.refreshPromise;
      this.resolveQueuedRequests(token);
      return token;
    } catch (error) {
      this.rejectQueuedRequests(error as Error);
      throw error;
    } finally {
      this.tokenData.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Performs the actual token refresh logic
   */
  private async performRefresh(): Promise<string | null> {
    console.log('🔄 Starting token refresh');

    // Try Clerk client-side first (fastest)
    if (typeof window !== 'undefined') {
      try {
        // @ts-ignore - Clerk global is available on client
        const clerk = window.Clerk;
        if (clerk?.session) {
          const token = await clerk.session.getToken({ template: 'hasura' });
          if (token) {
            this.cacheToken(token);
            console.log('✅ Token refreshed via Clerk client');
            return token;
          }
        }
      } catch (error) {
        console.warn('⚠️ Clerk client refresh failed:', error);
      }
    }

    // Fallback to API endpoint
    try {
      const response = await fetch('/api/auth/token', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Token API returned ${response.status}`);
      }

      const data = await response.json();
      const { token, expiresIn = 3600 } = data;

      if (!token) {
        throw new Error('No token received from API');
      }

      this.cacheToken(token, expiresIn);
      console.log('✅ Token refreshed via API');
      return token;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return null;
    }
  }

  /**
   * Caches the token with expiry information
   */
  private cacheToken(token: string, expiresInSeconds?: number): void {
    let expiresAt = Date.now() + 55 * 60 * 1000; // Default 55 minutes

    if (expiresInSeconds) {
      // Use provided expiry minus buffer
      expiresAt = Date.now() + (expiresInSeconds - 120) * 1000; // 2 min buffer
    } else {
      // Try to extract from JWT
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp) {
          expiresAt = payload.exp * 1000 - this.TOKEN_BUFFER;
        }
      } catch (error) {
        console.warn('⚠️ Could not parse token expiry, using default');
      }
    }

    this.tokenData = {
      token,
      expiresAt,
      isRefreshing: false,
    };

    console.log('💾 Token cached, expires in', Math.floor((expiresAt - Date.now()) / 1000), 'seconds');
  }

  /**
   * Resolves all queued requests with the token
   */
  private resolveQueuedRequests(token: string | null): void {
    while (this.refreshQueue.length > 0) {
      const request = this.refreshQueue.shift()!;
      request.resolve(token);
    }
  }

  /**
   * Rejects all queued requests with an error
   */
  private rejectQueuedRequests(error: Error): void {
    while (this.refreshQueue.length > 0) {
      const request = this.refreshQueue.shift()!;
      request.reject(error);
    }
  }

  /**
   * Gets debug information about the current token state
   */
  getDebugInfo() {
    return {
      hasToken: !!this.tokenData.token,
      tokenStart: this.tokenData.token ? this.tokenData.token.substring(0, 15) + '...' : 'none',
      expiresIn: this.tokenData.expiresAt ? Math.floor((this.tokenData.expiresAt - Date.now()) / 1000) : 0,
      isRefreshing: this.tokenData.isRefreshing,
      queueLength: this.refreshQueue.length,
      lastRefreshAttempt: this.lastRefreshAttempt,
    };
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();

// Export types for other modules
export type { TokenData, RefreshRequest };
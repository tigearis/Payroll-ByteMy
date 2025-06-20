// lib/middleware/rate-limiter.ts - Comprehensive rate limiting middleware
import { NextRequest, NextResponse } from 'next/server';

import { EnhancedRouteMonitor } from '../security/enhanced-route-monitor';

export interface RateLimitConfig {
  requests: number;
  window: number; // in milliseconds
  message?: string;
  skipIf?: (request: NextRequest) => boolean;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  private monitor = EnhancedRouteMonitor.getInstance();

  // Comprehensive rate limits by route pattern
  private readonly ROUTE_LIMITS: { [pattern: string]: RateLimitConfig } = {
    // Authentication routes - strictest limits
    '/api/auth/token': { requests: 10, window: 60000, message: 'Too many token requests' },
    '/api/auth/hasura-claims': { requests: 5, window: 60000 },
    '/api/auth/debug-token': { requests: 3, window: 60000 },

    // User management - strict limits
    '/api/users': { requests: 50, window: 60000 },
    '/api/users/[id]': { requests: 30, window: 60000 },
    '/api/users/update-profile': { requests: 10, window: 60000 },
    '/api/update-user-role': { requests: 3, window: 60000, message: 'Role changes are strictly limited' },
    
    // Staff management - very strict
    '/api/staff/create': { requests: 5, window: 300000 },
    '/api/staff/delete': { requests: 3, window: 300000, message: 'Staff deletion is strictly limited' },
    '/api/staff/update-role': { requests: 5, window: 60000 },
    '/api/staff/invitation-status': { requests: 20, window: 60000 },

    // Admin operations - extremely strict
    '/api/admin/api-keys': { requests: 5, window: 300000, message: 'API key operations are strictly limited' },
    '/api/audit/compliance-report': { requests: 3, window: 300000 },
    '/api/audit/log': { requests: 10, window: 60000 },

    // Payroll operations - moderate limits
    '/api/payrolls': { requests: 100, window: 60000 },
    '/api/payrolls/[id]': { requests: 50, window: 60000 },
    '/api/payroll-dates/[payrollId]': { requests: 30, window: 60000 },
    '/api/payroll-dates/generated': { requests: 20, window: 60000 },
    '/api/commit-payroll-assignments': { requests: 10, window: 60000 },

    // Sync operations - moderate limits
    '/api/sync-current-user': { requests: 20, window: 60000 },
    '/api/fix-oauth-user': { requests: 5, window: 60000 },

    // AI/Chat operations - user-specific limits
    '/api/chat': { requests: 20, window: 60000 },

    // Developer tools - strict limits
    '/api/developer/clean-single-payroll': { requests: 5, window: 300000 },
    '/api/developer/regenerate-all-dates': { requests: 2, window: 300000 },
    '/api/developer/reset-to-original': { requests: 3, window: 600000, message: 'Reset operations are extremely limited' },

    // Cron operations - very strict
    '/api/cron/generate-bulk-dates': { requests: 1, window: 300000 },
    '/api/holidays/sync': { requests: 1, window: 3600000 }, // 1 per hour

    // Read-only operations - lenient limits
    '/api/check-role': { requests: 200, window: 60000 },
    '/api/payrolls/schedule': { requests: 100, window: 60000 },

    // Default fallback
    'default': { requests: 50, window: 60000 }
  };

  private constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  /**
   * Check if request should be rate limited
   */
  async checkRateLimit(
    request: NextRequest,
    identifier?: string,
    customConfig?: RateLimitConfig
  ): Promise<RateLimitResult> {
    const route = this.normalizeRoute(request.nextUrl.pathname);
    const config = customConfig || this.getRouteConfig(route);
    
    // Skip rate limiting if specified
    if (config.skipIf && config.skipIf(request)) {
      return {
        success: true,
        limit: config.requests,
        remaining: config.requests,
        resetTime: Date.now() + config.window
      };
    }

    const key = this.generateKey(request, route, identifier);
    const now = Date.now();
    
    let entry = this.requestCounts.get(key);
    
    if (!entry || now >= entry.resetTime) {
      // Create new or reset expired entry
      entry = {
        count: 1,
        resetTime: now + config.window
      };
      this.requestCounts.set(key, entry);
      
      return {
        success: true,
        limit: config.requests,
        remaining: config.requests - 1,
        resetTime: entry.resetTime
      };
    }

    // Increment existing entry
    entry.count++;
    
    if (entry.count > config.requests) {
      // Rate limit exceeded
      await this.handleRateLimitExceeded(request, route, identifier, config);
      
      return {
        success: false,
        limit: config.requests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Apply rate limiting to API route
   */
  async applyRateLimit(
    request: NextRequest,
    identifier?: string,
    customConfig?: RateLimitConfig
  ): Promise<NextResponse | null> {
    const result = await this.checkRateLimit(request, identifier, customConfig);
    
    if (!result.success) {
      const config = customConfig || this.getRouteConfig(this.normalizeRoute(request.nextUrl.pathname));
      
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: config.message || 'Too many requests. Please try again later.',
          retryAfter: result.retryAfter
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': result.retryAfter?.toString() || '60'
          }
        }
      );
    }

    return null; // No rate limit response needed
  }

  /**
   * Add rate limit headers to response
   */
  addRateLimitHeaders(response: NextResponse, result: RateLimitResult): NextResponse {
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
    
    if (!result.success && result.retryAfter) {
      response.headers.set('Retry-After', result.retryAfter.toString());
    }
    
    return response;
  }

  private normalizeRoute(pathname: string): string {
    return pathname
      .replace(/\/api\/users\/[^\/]+$/, '/api/users/[id]')
      .replace(/\/api\/payrolls\/[^\/]+$/, '/api/payrolls/[id]')
      .replace(/\/api\/payroll-dates\/[^\/]+$/, '/api/payroll-dates/[payrollId]')
      .replace(/\/api\/staff\/[^\/]+$/, '/api/staff/[id]')
      .replace(/\/api\/developer\/[^\/]+/, '/api/developer/[action]');
  }

  private getRouteConfig(route: string): RateLimitConfig {
    return this.ROUTE_LIMITS[route] || this.ROUTE_LIMITS.default;
  }

  private generateKey(request: NextRequest, route: string, identifier?: string): string {
    const ip = this.getClientIP(request);
    const userKey = identifier || ip;
    return `${route}:${userKey}`;
  }

  private getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ||
           request.headers.get('x-real-ip') ||
           request.headers.get('cf-connecting-ip') ||
           'unknown';
  }

  private async handleRateLimitExceeded(
    request: NextRequest,
    route: string,
    identifier?: string,
    config: RateLimitConfig
  ): Promise<void> {
    const ip = this.getClientIP(request);
    
    // Log rate limit violation
    console.warn(`Rate limit exceeded: ${route} for ${identifier || ip}`);
    
    // Notify enhanced route monitor
    await this.monitor.monitorRequest(request, identifier, Date.now(), false, {
      rateLimitExceeded: true,
      limit: config.requests,
      window: config.window
    });
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.requestCounts.entries()) {
      if (now >= entry.resetTime) {
        this.requestCounts.delete(key);
      }
    }
  }

  // Utility methods for testing and monitoring
  getCurrentCounts(): Map<string, { count: number; resetTime: number }> {
    return new Map(this.requestCounts);
  }

  clearUserLimits(identifier: string): void {
    for (const key of this.requestCounts.keys()) {
      if (key.endsWith(`:${identifier}`)) {
        this.requestCounts.delete(key);
      }
    }
  }

  getStats(): { totalKeys: number; activeKeys: number } {
    const now = Date.now();
    let activeKeys = 0;
    
    for (const entry of this.requestCounts.values()) {
      if (now < entry.resetTime) {
        activeKeys++;
      }
    }
    
    return {
      totalKeys: this.requestCounts.size,
      activeKeys
    };
  }
}

// Export singleton instance
export const rateLimiter = RateLimiter.getInstance();

// Export middleware function for easy use
export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  customConfig?: RateLimitConfig,
  identifier?: string
): Promise<NextResponse> {
  const rateLimitResponse = await rateLimiter.applyRateLimit(request, identifier, customConfig);
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  const response = await handler();
  const result = await rateLimiter.checkRateLimit(request, identifier, customConfig);
  
  return rateLimiter.addRateLimitHeaders(response, result);
}
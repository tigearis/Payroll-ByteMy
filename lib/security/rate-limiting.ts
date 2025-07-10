/**
 * Rate Limiting Middleware
 * 
 * Protects API endpoints from abuse by limiting the number of requests
 * per client within a specified time window.
 * 
 * Security: Prevents DoS attacks, brute force attempts, and API abuse
 * SOC2 Compliance: Rate limiting is required for availability protection
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// Rate Limiting Configuration
// ============================================================================

interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  maxRequests: number;  // Maximum requests per window
  message?: string;     // Custom error message
  skipSuccessfulRequests?: boolean; // Only count failed requests
  skipFailedRequests?: boolean;     // Only count successful requests
  keyGenerator?: (request: NextRequest) => string; // Custom key function
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    firstRequest: number;
  };
}

// ============================================================================
// In-Memory Rate Limit Store (Production should use Redis/Database)
// ============================================================================

class MemoryRateLimitStore {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  get(key: string): { count: number; resetTime: number } | null {
    const entry = this.store[key];
    if (!entry) return null;

    // Check if window has expired
    if (entry.resetTime < Date.now()) {
      delete this.store[key];
      return null;
    }

    return {
      count: entry.count,
      resetTime: entry.resetTime
    };
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.store[key];

    if (!existing || existing.resetTime < now) {
      // Create new window
      this.store[key] = {
        count: 1,
        resetTime: now + windowMs,
        firstRequest: now
      };
      return {
        count: 1,
        resetTime: now + windowMs
      };
    }

    // Increment existing window
    existing.count++;
    return {
      count: existing.count,
      resetTime: existing.resetTime
    };
  }

  reset(key: string): void {
    delete this.store[key];
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store = {};
  }
}

// Global store instance
const rateLimitStore = new MemoryRateLimitStore();

// ============================================================================
// Rate Limiting Presets
// ============================================================================

export const RATE_LIMIT_PRESETS = {
  // Very strict - for sensitive operations
  STRICT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,            // 5 requests per 15 minutes
    message: 'Too many requests. Please try again in 15 minutes.'
  },

  // Authentication endpoints - prevent brute force
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,           // 10 attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again later.'
  },

  // Standard API endpoints
  STANDARD: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 100,         // 100 requests per minute
    message: 'Rate limit exceeded. Please slow down your requests.'
  },

  // High frequency endpoints (search, autocomplete)
  HIGH_FREQUENCY: {
    windowMs: 60 * 1000,      // 1 minute  
    maxRequests: 300,         // 300 requests per minute
    message: 'Rate limit exceeded. Please reduce request frequency.'
  },

  // File upload endpoints
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,          // 20 uploads per hour
    message: 'Upload limit exceeded. Please try again later.'
  },

  // Database modification endpoints
  MUTATION: {
    windowMs: 60 * 1000,      // 1 minute
    maxRequests: 50,          // 50 mutations per minute
    message: 'Too many changes. Please slow down.'
  }
};

// ============================================================================
// Core Rate Limiting Functions
// ============================================================================

/**
 * Default key generator - uses IP address and user ID if available
 */
function defaultKeyGenerator(request: NextRequest): string {
  // Try to get user ID from JWT token
  let userId = 'anonymous';
  
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      // In a real implementation, you'd decode the JWT properly
      // For now, we'll use a simple approach
      const token = authHeader.slice(7);
      // You could decode JWT here to get user ID
    }
  } catch (error) {
    // Fallback to IP-based limiting
  }

  // Get client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
    request.headers.get('x-real-ip') || 
    'unknown';

  // Combine user ID and IP for better accuracy
  return `${userId}:${ip}`;
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): {
  allowed: boolean;
  count: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} {
  const keyGenerator = config.keyGenerator || defaultKeyGenerator;
  const key = keyGenerator(request);
  
  const result = rateLimitStore.increment(key, config.windowMs);
  const remaining = Math.max(0, config.maxRequests - result.count);
  const allowed = result.count <= config.maxRequests;

  const response = {
    allowed,
    count: result.count,
    remaining,
    resetTime: result.resetTime
  };

  if (!allowed) {
    return {
      ...response,
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
    };
  }

  return response;
}

/**
 * Rate limiting middleware factory
 */
export function withRateLimit(config: RateLimitConfig) {
  return function <T extends any[]>(
    handler: (request: NextRequest, context: any) => Promise<NextResponse> | NextResponse
  ) {
    return async function (
      request: NextRequest,
      context: any
    ): Promise<NextResponse> {
      try {
        const rateLimitResult = checkRateLimit(request, config);

        // Add rate limit headers to response
        const headers = new Headers();
        headers.set('X-RateLimit-Limit', config.maxRequests.toString());
        headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        headers.set('X-RateLimit-Reset', Math.ceil(rateLimitResult.resetTime / 1000).toString());

        if (!rateLimitResult.allowed) {
          if (rateLimitResult.retryAfter) {
            headers.set('Retry-After', rateLimitResult.retryAfter.toString());
          }

          return NextResponse.json(
            {
              error: 'Rate Limit Exceeded',
              message: config.message || 'Too many requests',
              code: 'RATE_LIMIT_EXCEEDED',
              details: {
                limit: config.maxRequests,
                remaining: rateLimitResult.remaining,
                resetTime: rateLimitResult.resetTime,
                retryAfter: rateLimitResult.retryAfter
              },
              timestamp: new Date().toISOString()
            },
            { 
              status: 429,
              headers
            }
          );
        }

        // Call the handler
        const response = await handler(request, context);

        // Add rate limit headers to successful response
        headers.forEach((value, key) => {
          response.headers.set(key, value);
        });

        return response;

      } catch (error) {
        console.error('❌ Rate limiting error:', error);
        
        // Don't block requests on rate limiting errors
        return await handler(request, context);
      }
    };
  };
}

// ============================================================================
// Specialized Rate Limiting Middleware
// ============================================================================

/**
 * Strict rate limiting for sensitive operations
 */
export function withStrictRateLimit() {
  return withRateLimit(RATELIMITPRESETS.STRICT);
}

/**
 * Authentication rate limiting
 */
export function withAuthRateLimit() {
  return withRateLimit(RATELIMITPRESETS.AUTH);
}

/**
 * Standard API rate limiting
 */
export function withStandardRateLimit() {
  return withRateLimit(RATELIMITPRESETS.STANDARD);
}

/**
 * High frequency endpoint rate limiting
 */
export function withHighFrequencyRateLimit() {
  return withRateLimit(RATELIMITPRESETS.HIGH_FREQUENCY);
}

/**
 * File upload rate limiting
 */
export function withUploadRateLimit() {
  return withRateLimit(RATELIMITPRESETS.UPLOAD);
}

/**
 * Database mutation rate limiting
 */
export function withMutationRateLimit() {
  return withRateLimit(RATELIMITPRESETS.MUTATION);
}

// ============================================================================
// IP-based Blocking (for severe abuse)
// ============================================================================

interface BlockedIP {
  ip: string;
  blockedUntil: number;
  reason: string;
  attempts: number;
}

class IPBlockingStore {
  private blockedIPs: Map<string, BlockedIP> = new Map();

  block(ip: string, durationMs: number, reason: string): void {
    const existing = this.blockedIPs.get(ip);
    const attempts = existing ? existing.attempts + 1 : 1;

    this.blockedIPs.set(ip, {
      ip,
      blockedUntil: Date.now() + durationMs,
      reason,
      attempts
    });

    console.warn(`🚫 IP blocked: ${ip} (${reason}) - Attempt #${attempts}`);
  }

  isBlocked(ip: string): BlockedIP | null {
    const blocked = this.blockedIPs.get(ip);
    if (!blocked) return null;

    // Check if block has expired
    if (blocked.blockedUntil < Date.now()) {
      this.blockedIPs.delete(ip);
      return null;
    }

    return blocked;
  }

  unblock(ip: string): boolean {
    return this.blockedIPs.delete(ip);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [ip, blocked] of this.blockedIPs.entries()) {
      if (blocked.blockedUntil < now) {
        this.blockedIPs.delete(ip);
      }
    }
  }
}

const ipBlockingStore = new IPBlockingStore();

/**
 * Check if IP is blocked
 */
export function checkIPBlock(request: NextRequest): BlockedIP | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
    request.headers.get('x-real-ip') || 
    'unknown';

  return ipBlockingStore.isBlocked(ip);
}

/**
 * Block IP address
 */
export function blockIP(
  request: NextRequest, 
  durationMs: number = 24 * 60 * 60 * 1000, // 24 hours default
  reason: string = 'Excessive rate limit violations'
): void {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
    request.headers.get('x-real-ip') || 
    'unknown';

  ipBlockingStore.block(ip, durationMs, reason);
}

/**
 * IP blocking middleware
 */
export function withIPBlocking() {
  return function <T extends any[]>(
    handler: (request: NextRequest, context: any) => Promise<NextResponse> | NextResponse
  ) {
    return async function (
      request: NextRequest,
      context: any
    ): Promise<NextResponse> {
      const blocked = checkIPBlock(request);
      
      if (blocked) {
        const retryAfter = Math.ceil((blocked.blockedUntil - Date.now()) / 1000);
        
        return NextResponse.json(
          {
            error: 'IP Blocked',
            message: 'Your IP address has been temporarily blocked',
            code: 'IP_BLOCKED',
            details: {
              reason: blocked.reason,
              blockedUntil: blocked.blockedUntil,
              retryAfter,
              attempts: blocked.attempts
            },
            timestamp: new Date().toISOString()
          },
          { 
            status: 403,
            headers: {
              'Retry-After': retryAfter.toString()
            }
          }
        );
      }

      return await handler(request, context);
    };
  };
}

// ============================================================================
// Progressive Rate Limiting (escalating restrictions)
// ============================================================================

export function withProgressiveRateLimit(configs: RateLimitConfig[]) {
  return function <T extends any[]>(
    handler: (request: NextRequest, context: any) => Promise<NextResponse> | NextResponse
  ) {
    return async function (
      request: NextRequest,
      context: any
    ): Promise<NextResponse> {
      // Check each rate limit tier
      for (const config of configs) {
        const result = checkRateLimit(request, config);
        
        if (!result.allowed) {
          // If this is a severe violation, consider blocking
          if (result.count > config.maxRequests * 2) {
            blockIP(request, 60 * 60 * 1000, 'Severe rate limit violation'); // 1 hour block
          }

          return NextResponse.json(
            {
              error: 'Rate Limit Exceeded',
              message: config.message || 'Too many requests',
              code: 'PROGRESSIVE_RATE_LIMIT_EXCEEDED',
              details: {
                limit: config.maxRequests,
                remaining: result.remaining,
                resetTime: result.resetTime,
                retryAfter: result.retryAfter
              },
              timestamp: new Date().toISOString()
            },
            { 
              status: 429,
              headers: {
                'X-RateLimit-Limit': config.maxRequests.toString(),
                'X-RateLimit-Remaining': result.remaining.toString(),
                'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
                'Retry-After': (result.retryAfter || 60).toString()
              }
            }
          );
        }
      }

      return await handler(request, context);
    };
  };
}

// ============================================================================
// Cleanup and Utilities
// ============================================================================

/**
 * Reset rate limit for a specific key (for testing/admin purposes)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.reset(key);
}

/**
 * Cleanup expired entries (call periodically)
 */
export function cleanupRateLimits(): void {
  ipBlockingStore.cleanup();
}

// ============================================================================
// All exports are already declared above as individual exports
// ============================================================================
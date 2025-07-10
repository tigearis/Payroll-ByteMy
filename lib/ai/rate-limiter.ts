import { Redis } from '@upstash/redis';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalHits: number;
}

export class AIRateLimiter {
  private redis: Redis | null;
  private inMemoryStore = new Map<string, { count: number; resetTime: number }>();
  
  constructor() {
    // Only initialize Redis if environment variables are present
    if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
      this.redis = new Redis({
        url: process.env.UPSTASH_REDIS_URL,
        token: process.env.UPSTASH_REDIS_TOKEN,
      });
    } else {
      console.warn('UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN not set. Rate limiting will use in-memory fallback.');
      // @ts-ignore - We'll handle this gracefully
      this.redis = null;
    }
  }

  private static readonly CONFIGS = {
    chat: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20, // 20 requests per minute
      keyPrefix: 'ai_chat_limit'
    },
    query: {
      windowMs: 60 * 1000, // 1 minute  
      maxRequests: 10, // 10 queries per minute
      keyPrefix: 'ai_query_limit'
    },
    context: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30, // 30 context requests per minute
      keyPrefix: 'ai_context_limit'
    }
  };

  async checkRateLimit(
    userId: string, 
    endpoint: 'chat' | 'query' | 'context',
    userRole: string = 'viewer'
  ): Promise<RateLimitResult> {
    const config = AIRateLimiter.CONFIGS[endpoint];
    
    // Role-based limits (higher limits for elevated roles)
    const roleMultiplier = this.getRoleMultiplier(userRole);
    const effectiveMaxRequests = Math.floor(config.maxRequests * roleMultiplier);
    
    const key = `${config.keyPrefix}:${userId}`;
    const window = Math.floor(Date.now() / config.windowMs);
    const windowKey = `${key}:${window}`;
    
    try {
      if (this.redis) {
        // Use Redis for rate limiting
        const pipeline = this.redis.pipeline();
        pipeline.incr(windowKey);
        pipeline.expire(windowKey, Math.ceil(config.windowMs / 1000));
        
        const results = await pipeline.exec();
        const totalHits = results[0] as number;
        
        const allowed = totalHits <= effectiveMaxRequests;
        const remaining = Math.max(0, effectiveMaxRequests - totalHits);
        const resetTime = (window + 1) * config.windowMs;
        
        // Log rate limit violations
        if (!allowed) {
          await this.logRateLimitViolation({
            userId,
            userRole,
            endpoint,
            totalHits,
            maxRequests: effectiveMaxRequests,
            windowMs: config.windowMs
          });
        }
        
        return {
          allowed,
          remaining,
          resetTime,
          totalHits
        };
      } else {
        // Use in-memory fallback
        const now = Date.now();
        const resetTime = (window + 1) * config.windowMs;
        const stored = this.inMemoryStore.get(windowKey);
        
        let totalHits = 1;
        if (stored && stored.resetTime > now) {
          totalHits = stored.count + 1;
        }
        
        this.inMemoryStore.set(windowKey, { count: totalHits, resetTime });
        
        // Clean up old entries
        const entries = Array.from(this.inMemoryStore.entries());
        for (const [key, value] of entries) {
          if (value.resetTime <= now) {
            this.inMemoryStore.delete(key);
          }
        }
        
        const allowed = totalHits <= effectiveMaxRequests;
        const remaining = Math.max(0, effectiveMaxRequests - totalHits);
        
        if (!allowed) {
          await this.logRateLimitViolation({
            userId,
            userRole,
            endpoint,
            totalHits,
            maxRequests: effectiveMaxRequests,
            windowMs: config.windowMs
          });
        }
        
        return {
          allowed,
          remaining,
          resetTime,
          totalHits
        };
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open in case of errors
      return {
        allowed: true,
        remaining: effectiveMaxRequests,
        resetTime: Date.now() + config.windowMs,
        totalHits: 0
      };
    }
  }

  private getRoleMultiplier(userRole: string): number {
    const multipliers: { [key: string]: number } = {
      'developer': 3.0,
      'org_admin': 2.5,
      'manager': 2.0,
      'consultant': 1.5,
      'viewer': 1.0
    };
    
    return multipliers[userRole] || 1.0;
  }

  private async logRateLimitViolation(data: {
    userId: string;
    userRole: string;
    endpoint: string;
    totalHits: number;
    maxRequests: number;
    windowMs: number;
  }) {
    try {
      console.warn('AI Rate Limit Violation:', {
        timestamp: new Date().toISOString(),
        type: 'RATE_LIMIT_EXCEEDED',
        ...data
      });
      
      // TODO: Send to security monitoring
      // await securityMonitor.alert({
      //   type: 'RATE_LIMIT_VIOLATION',
      //   severity: 'medium',
      //   ...data
      // });
    } catch (error) {
      console.error('Failed to log rate limit violation:', error);
    }
  }

  async getRemainingQuota(userId: string, endpoint: 'chat' | 'query' | 'context'): Promise<{
    remaining: number;
    resetTime: number;
    maxRequests: number;
  }> {
    const config = AIRateLimiter.CONFIGS[endpoint];
    const key = `${config.keyPrefix}:${userId}`;
    const window = Math.floor(Date.now() / config.windowMs);
    const windowKey = `${key}:${window}`;
    
    try {
      if (this.redis) {
        const totalHits = await this.redis.get(windowKey) || 0;
        const remaining = Math.max(0, config.maxRequests - (totalHits as number));
        const resetTime = (window + 1) * config.windowMs;
        
        return {
          remaining,
          resetTime,
          maxRequests: config.maxRequests
        };
      } else {
        // Use in-memory fallback
        const stored = this.inMemoryStore.get(windowKey);
        const totalHits = stored?.count || 0;
        const remaining = Math.max(0, config.maxRequests - totalHits);
        const resetTime = (window + 1) * config.windowMs;
        
        return {
          remaining,
          resetTime,
          maxRequests: config.maxRequests
        };
      }
    } catch (error) {
      console.error('Error getting remaining quota:', error);
      return {
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs,
        maxRequests: config.maxRequests
      };
    }
  }
}
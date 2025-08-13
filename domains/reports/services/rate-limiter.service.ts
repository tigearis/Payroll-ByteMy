import { Redis } from "@upstash/redis";

export class RateLimiterService {
  private redis: Redis;

  // Rate limit configurations
  private readonly RATE_LIMITS = {
    developer: {
      queries_per_minute: 60,
      queries_per_hour: 1000,
      queries_per_day: 10000,
    },
    org_admin: {
      queries_per_minute: 30,
      queries_per_hour: 500,
      queries_per_day: 5000,
    },
    manager: {
      queries_per_minute: 20,
      queries_per_hour: 300,
      queries_per_day: 2000,
    },
    consultant: {
      queries_per_minute: 10,
      queries_per_hour: 200,
      queries_per_day: 1000,
    },
    viewer: {
      queries_per_minute: 5,
      queries_per_hour: 100,
      queries_per_day: 500,
    },
  };

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });
  }

  async checkRateLimit(userId: string, role: string): Promise<boolean> {
    try {
      // Get the appropriate rate limits for the user's role
      const limits =
        this.RATE_LIMITS[role as keyof typeof this.RATE_LIMITS] ||
        this.RATE_LIMITS.viewer;

      const now = Date.now();
      const minute = Math.floor(now / 60000);
      const hour = Math.floor(now / 3600000);
      const day = Math.floor(now / 86400000);

      const minuteKey = `rate_limit:${userId}:minute:${minute}`;
      const hourKey = `rate_limit:${userId}:hour:${hour}`;
      const dayKey = `rate_limit:${userId}:day:${day}`;

      // Get current counts
      const [minuteCount, hourCount, dayCount] = await Promise.all([
        this.redis.get<number>(minuteKey) || 0,
        this.redis.get<number>(hourKey) || 0,
        this.redis.get<number>(dayKey) || 0,
      ]);

      // Check if any limit is exceeded
      if (
        (minuteCount ?? 0) >= limits.queries_per_minute ||
        (hourCount ?? 0) >= limits.queries_per_hour ||
        (dayCount ?? 0) >= limits.queries_per_day
      ) {
        return false;
      }

      // Increment counters and set expiration
      await Promise.all([
        this.redis.incr(minuteKey),
        this.redis.expire(minuteKey, 60), // Expire after 1 minute
        this.redis.incr(hourKey),
        this.redis.expire(hourKey, 3600), // Expire after 1 hour
        this.redis.incr(dayKey),
        this.redis.expire(dayKey, 86400), // Expire after 1 day
      ]);

      return true;
    } catch (error) {
      console.error("Error checking rate limit:", error);
      // In case of error, allow the request to proceed
      return true;
    }
  }

  async getRateLimitStatus(
    userId: string,
    role: string
  ): Promise<{
    minuteUsage: number;
    hourUsage: number;
    dayUsage: number;
    minuteLimit: number;
    hourLimit: number;
    dayLimit: number;
  }> {
    try {
      // Get the appropriate rate limits for the user's role
      const limits =
        this.RATE_LIMITS[role as keyof typeof this.RATE_LIMITS] ||
        this.RATE_LIMITS.viewer;

      const now = Date.now();
      const minute = Math.floor(now / 60000);
      const hour = Math.floor(now / 3600000);
      const day = Math.floor(now / 86400000);

      const minuteKey = `rate_limit:${userId}:minute:${minute}`;
      const hourKey = `rate_limit:${userId}:hour:${hour}`;
      const dayKey = `rate_limit:${userId}:day:${day}`;

      // Get current counts
      const [minuteCount, hourCount, dayCount] = await Promise.all([
        this.redis.get<number>(minuteKey) || 0,
        this.redis.get<number>(hourKey) || 0,
        this.redis.get<number>(dayKey) || 0,
      ]);

      return {
        minuteUsage: minuteCount ?? 0,
        hourUsage: hourCount ?? 0,
        dayUsage: dayCount ?? 0,
        minuteLimit: limits.queries_per_minute,
        hourLimit: limits.queries_per_hour,
        dayLimit: limits.queries_per_day,
      };
    } catch (error) {
      console.error("Error getting rate limit status:", error);
      // Return default values in case of error
      const limits =
        this.RATE_LIMITS[role as keyof typeof this.RATE_LIMITS] ||
        this.RATE_LIMITS.viewer;
      return {
        minuteUsage: 0,
        hourUsage: 0,
        dayUsage: 0,
        minuteLimit: limits.queries_per_minute,
        hourLimit: limits.queries_per_hour,
        dayLimit: limits.queries_per_day,
      };
    }
  }
}

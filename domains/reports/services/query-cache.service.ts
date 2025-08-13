import { Redis } from "@upstash/redis";

interface CachedQueryResult {
  data: any;
  metadata: {
    columns: Array<{
      name: string;
      type: string;
    }>;
    totalRows: number;
    hasMoreRows: boolean;
  };
}

export class QueryCacheService {
  private redis: Redis;
  private readonly CACHE_PREFIX = "query_cache:";
  private readonly DEFAULT_TTL = 3600; // 1 hour default TTL

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });
  }

  private getCacheKey(queryHash: string): string {
    return `${this.CACHE_PREFIX}${queryHash}`;
  }

  async get(queryHash: string): Promise<CachedQueryResult | null> {
    try {
      const cacheKey = this.getCacheKey(queryHash);
      const cachedData = await this.redis.get(cacheKey);

      if (cachedData) {
        return cachedData as CachedQueryResult;
      }

      return null;
    } catch (error) {
      console.error("Error retrieving from cache:", error);
      return null;
    }
  }

  async set(
    queryHash: string,
    result: CachedQueryResult,
    ttl: number = this.DEFAULT_TTL
  ): Promise<boolean> {
    try {
      const cacheKey = this.getCacheKey(queryHash);
      await this.redis.set(cacheKey, result, { ex: ttl });
      return true;
    } catch (error) {
      console.error("Error setting cache:", error);
      return false;
    }
  }

  async invalidate(queryHash: string): Promise<boolean> {
    try {
      const cacheKey = this.getCacheKey(queryHash);
      await this.redis.del(cacheKey);
      return true;
    } catch (error) {
      console.error("Error invalidating cache:", error);
      return false;
    }
  }

  async invalidateByPattern(pattern: string): Promise<number> {
    try {
      const cachePattern = `${this.CACHE_PREFIX}${pattern}*`;
      const keys = await this.redis.keys(cachePattern);

      if (keys.length === 0) {
        return 0;
      }

      // Delete all matching keys
      await Promise.all(keys.map(key => this.redis.del(key)));

      return keys.length;
    } catch (error) {
      console.error("Error invalidating cache by pattern:", error);
      return 0;
    }
  }
}

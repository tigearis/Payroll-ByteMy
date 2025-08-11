import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import { ReportConfig } from "../types/report.types";

export class EnhancedReportCacheService {
  private redis: Redis;
  private readonly CACHE_KEY_PREFIX = "report_cache:";
  private readonly CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  private getCacheKey(config: ReportConfig): string {
    // Create a deterministic hash of the config
    const configHash = createHash("sha256")
      .update(JSON.stringify(this.normalizeConfig(config)))
      .digest("hex");

    return `${this.CACHE_KEY_PREFIX}${configHash}`;
  }

  private normalizeConfig(config: ReportConfig): any {
    // Create a normalized version of the config for consistent hashing
    return {
      domains: [...config.domains].sort(),
      fields: Object.fromEntries(
        Object.entries(config.fields).map(([domain, fields]) => [
          domain,
          [...fields].sort(),
        ])
      ),
      filters: config.filters
        ? [...config.filters].sort((a, b) =>
            JSON.stringify(a).localeCompare(JSON.stringify(b))
          )
        : undefined,
      sorts: config.sorts
        ? [...config.sorts].sort((a, b) =>
            JSON.stringify(a).localeCompare(JSON.stringify(b))
          )
        : undefined,
      limit: config.limit,
      includeRelationships: config.includeRelationships,
    };
  }

  async getCachedReport(config: ReportConfig): Promise<any | null> {
    const cacheKey = this.getCacheKey(config);
    const cachedData = await this.redis.get<string>(cacheKey);

    if (!cachedData) return null;

    try {
      const { data, metadata } = JSON.parse(cachedData);

      // Validate cache freshness based on metadata
      if (this.isCacheStale(metadata)) {
        await this.invalidateCache(config);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error parsing cached report:", error);
      return null;
    }
  }

  async cacheReport(
    config: ReportConfig,
    data: any,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const cacheKey = this.getCacheKey(config);
    const cacheData = {
      data,
      metadata: {
        ...metadata,
        cachedAt: new Date().toISOString(),
        configHash: this.getCacheKey(config),
      },
    };

    await this.redis.set(cacheKey, JSON.stringify(cacheData), {
      ex: this.CACHE_TTL,
    });
  }

  private isCacheStale(metadata: any): boolean {
    // Implement cache staleness checks based on:
    // 1. Time-based expiration
    const cachedAt = new Date(metadata.cachedAt).getTime();
    if (Date.now() - cachedAt > this.CACHE_TTL * 1000) {
      return true;
    }

    // 2. Data dependency changes (if tracked)
    if (metadata.dataDependencies) {
      // Check if any dependencies have been updated
      // This would require integration with your data change tracking system
    }

    return false;
  }

  async invalidateCache(config: ReportConfig): Promise<void> {
    const cacheKey = this.getCacheKey(config);
    await this.redis.del(cacheKey);
  }

  async invalidateDomainCache(domain: string): Promise<void> {
    // Implement domain-specific cache invalidation
    // This could be called when domain data is updated
    const pattern = `${this.CACHE_KEY_PREFIX}*`;
    const keys = await this.redis.keys(pattern);

    for (const key of keys) {
      const cachedData = await this.redis.get<string>(key);
      if (!cachedData) continue;

      try {
        const { metadata } = JSON.parse(cachedData);
        if (metadata.domains?.includes(domain)) {
          await this.redis.del(key);
        }
      } catch (error) {
        console.error("Error processing cache key:", key, error);
      }
    }
  }

  async getCacheStats(): Promise<{
    totalCached: number;
    sizeInBytes: number;
    hitRate: number;
  }> {
    const pattern = `${this.CACHE_KEY_PREFIX}*`;
    const keys = await this.redis.keys(pattern);
    let totalSize = 0;

    for (const key of keys) {
      const cachedData = await this.redis.get<string>(key);
      if (cachedData) {
        totalSize += Buffer.from(cachedData).length;
      }
    }

    // Note: Hit rate would need to be tracked separately
    return {
      totalCached: keys.length,
      sizeInBytes: totalSize,
      hitRate: 0, // Implement hit rate tracking
    };
  }
}

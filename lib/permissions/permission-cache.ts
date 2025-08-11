// lib/permissions/permission-cache.ts
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

export interface CachedPermissionData {
  role: string;
  allowedRoles: string[];
  excludedPermissions: string[];
  permissionHash: string;
  permissionVersion: string;
  cachedAt: number;
  expiresAt: number;
}

/**
 * High-Performance Permission Caching System
 * 
 * Eliminates the 200ms+ authentication overhead by caching permission lookups
 * Uses in-memory LRU cache with automatic expiration and invalidation
 */
class PermissionCache {
  private cache = new Map<string, CachedPermissionData>();
  private readonly maxCacheSize = 1000; // Maximum cached users
  private readonly cacheTimeoutMs = 5 * 60 * 1000; // 5 minutes cache TTL
  private readonly cleanupIntervalMs = 60 * 1000; // Cleanup every minute
  
  constructor() {
    // Start periodic cleanup to prevent memory leaks
    setInterval(() => this.cleanup(), this.cleanupIntervalMs);
    
    logger.info('Permission cache initialized', {
      namespace: 'permission_cache',
      operation: 'initialize',
      classification: DataClassification.INTERNAL,
      metadata: {
        maxCacheSize: this.maxCacheSize,
        cacheTimeoutMinutes: this.cacheTimeoutMs / 60000,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Get cached permission data for user
   */
  get(userId: string): CachedPermissionData | null {
    const cached = this.cache.get(userId);
    
    if (!cached) {
      return null;
    }
    
    // Check if cache entry has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(userId);
      logger.debug('Permission cache entry expired', {
        namespace: 'permission_cache',
        operation: 'cache_miss',
        classification: DataClassification.INTERNAL,
        metadata: {
          userId,
          reason: 'expired',
          timestamp: new Date().toISOString()
        }
      });
      return null;
    }
    
    logger.debug('Permission cache hit', {
      namespace: 'permission_cache',
      operation: 'cache_hit',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        role: cached.role,
        timestamp: new Date().toISOString()
      }
    });
    
    return cached;
  }

  /**
   * Store permission data in cache
   */
  set(userId: string, permissionData: Omit<CachedPermissionData, 'cachedAt' | 'expiresAt'>): void {
    const now = Date.now();
    const cachedData: CachedPermissionData = {
      ...permissionData,
      cachedAt: now,
      expiresAt: now + this.cacheTimeoutMs
    };
    
    // Enforce cache size limit with LRU eviction
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(userId)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        logger.debug('Permission cache LRU eviction', {
          namespace: 'permission_cache',
          operation: 'lru_eviction',
          classification: DataClassification.INTERNAL,
          metadata: {
            evictedUserId: firstKey,
            cacheSize: this.cache.size,
            timestamp: new Date().toISOString()
          }
        });
      }
    }
    
    this.cache.set(userId, cachedData);
    
    logger.debug('Permission data cached', {
      namespace: 'permission_cache',
      operation: 'cache_set',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        role: permissionData.role,
        excludedCount: permissionData.excludedPermissions.length,
        cacheSize: this.cache.size,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Invalidate cache entry for specific user
   */
  invalidate(userId: string): void {
    const existed = this.cache.has(userId);
    this.cache.delete(userId);
    
    if (existed) {
      logger.info('Permission cache invalidated for user', {
        namespace: 'permission_cache',
        operation: 'invalidate_user',
        classification: DataClassification.INTERNAL,
        metadata: {
          userId,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * Invalidate cache entries for users with specific role
   */
  invalidateByRole(role: string): void {
    let invalidatedCount = 0;
    
    for (const [userId, cachedData] of this.cache.entries()) {
      if (cachedData.role === role) {
        this.cache.delete(userId);
        invalidatedCount++;
      }
    }
    
    logger.info('Permission cache invalidated by role', {
      namespace: 'permission_cache',
      operation: 'invalidate_by_role',
      classification: DataClassification.INTERNAL,
      metadata: {
        role,
        invalidatedCount,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const cacheSize = this.cache.size;
    this.cache.clear();
    
    logger.info('Permission cache cleared', {
      namespace: 'permission_cache',
      operation: 'clear_all',
      classification: DataClassification.INTERNAL,
      metadata: {
        clearedCount: cacheSize,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate?: number;
    oldestEntryAge?: number;
  } {
    let oldestTimestamp = Date.now();
    
    for (const cachedData of this.cache.values()) {
      if (cachedData.cachedAt < oldestTimestamp) {
        oldestTimestamp = cachedData.cachedAt;
      }
    }
    
    const oldestEntryAge = this.cache.size > 0 ? Date.now() - oldestTimestamp : undefined;
    
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      ...(oldestEntryAge !== undefined && { oldestEntryAge })
    };
  }

  /**
   * Remove expired entries from cache
   */
  private cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [userId, cachedData] of this.cache.entries()) {
      if (now > cachedData.expiresAt) {
        this.cache.delete(userId);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      logger.debug('Permission cache cleanup completed', {
        namespace: 'permission_cache',
        operation: 'cleanup',
        classification: DataClassification.INTERNAL,
        metadata: {
          expiredCount,
          remainingSize: this.cache.size,
          timestamp: new Date().toISOString()
        }
      });
    }
  }
}

// Singleton instance for application-wide use
export const permissionCache = new PermissionCache();

/**
 * Cache invalidation helper for role/permission changes
 */
export class PermissionCacheInvalidator {
  /**
   * Invalidate cache when user roles change
   */
  static onUserRoleChanged(userId: string): void {
    permissionCache.invalidate(userId);
    
    logger.info('Permission cache invalidated due to role change', {
      namespace: 'permission_cache',
      operation: 'role_change_invalidation',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Invalidate cache when permission overrides change
   */
  static onPermissionOverrideChanged(userId: string): void {
    permissionCache.invalidate(userId);
    
    logger.info('Permission cache invalidated due to override change', {
      namespace: 'permission_cache',
      operation: 'override_change_invalidation',
      classification: DataClassification.INTERNAL,
      metadata: {
        userId,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Invalidate cache when system-wide role definitions change
   */
  static onRoleDefinitionChanged(role: string): void {
    permissionCache.invalidateByRole(role);
    
    logger.info('Permission cache invalidated due to role definition change', {
      namespace: 'permission_cache',
      operation: 'role_definition_invalidation',
      classification: DataClassification.INTERNAL,
      metadata: {
        role,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Full cache invalidation for major permission system changes
   */
  static onPermissionSystemChanged(): void {
    permissionCache.clear();
    
    logger.warn('Full permission cache cleared due to system changes', {
      namespace: 'permission_cache',
      operation: 'system_change_invalidation',
      classification: DataClassification.INTERNAL,
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  }
}

/**
 * Performance monitoring for cache effectiveness
 */
export class PermissionCacheMonitor {
  private static hitCount = 0;
  private static missCount = 0;
  private static startTime = Date.now();

  static recordHit(): void {
    this.hitCount++;
  }

  static recordMiss(): void {
    this.missCount++;
  }

  static getPerformanceMetrics() {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;
    const uptimeMinutes = (Date.now() - this.startTime) / 60000;
    
    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      totalRequests,
      hitRate: Math.round(hitRate * 100) / 100,
      cacheStats: permissionCache.getStats(),
      uptimeMinutes: Math.round(uptimeMinutes * 100) / 100
    };
  }

  static logPerformanceReport(): void {
    const metrics = this.getPerformanceMetrics();
    
    logger.info('Permission cache performance report', {
      namespace: 'permission_cache',
      operation: 'performance_report',
      classification: DataClassification.INTERNAL,
      metadata: {
        ...metrics,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Log performance report every 15 minutes
setInterval(() => {
  PermissionCacheMonitor.logPerformanceReport();
}, 15 * 60 * 1000);
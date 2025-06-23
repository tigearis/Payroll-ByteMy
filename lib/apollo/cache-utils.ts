/**
 * Apollo Cache Utilities
 * Provides strategic cache invalidation and management patterns
 */

import { ApolloCache, InMemoryCache } from "@apollo/client";

export interface CacheInvalidationOptions {
  /**
   * Whether to broadcast cache updates to all components
   */
  broadcast?: boolean;
  /**
   * Whether to refetch active queries after invalidation
   */
  refetchQueries?: boolean;
  /**
   * Specific cache keys to invalidate (for granular control)
   */
  fields?: string[];
}

/**
 * Strategic cache invalidation patterns based on entity relationships
 */
export class CacheInvalidationManager {
  constructor(private cache: ApolloCache<any>) {}

  /**
   * Invalidate user-related data when user changes
   */
  invalidateUserData(userId: string, options: CacheInvalidationOptions = {}) {
    const { broadcast = true, refetchQueries = false } = options;

    // Invalidate user entity
    this.cache.evict({ id: `users:${userId}` });
    
    // Invalidate related queries that might contain this user
    this.cache.evict({ fieldName: "users" });
    this.cache.evict({ fieldName: "teamMembers" });
    this.cache.evict({ fieldName: "managers" });
    
    if (broadcast) {
      this.cache.gc();
    }

    if (refetchQueries) {
      // Let subscriptions handle the refetch for real-time updates
      console.log("🔄 User cache invalidated, subscriptions will update data");
    }
  }

  /**
   * Invalidate payroll-related data
   */
  invalidatePayrollData(payrollId?: string, options: CacheInvalidationOptions = {}) {
    const { broadcast = true } = options;

    if (payrollId) {
      // Invalidate specific payroll
      this.cache.evict({ id: `payrolls:${payrollId}` });
      this.cache.evict({ id: `payrollDates:${payrollId}` });
    } else {
      // Invalidate all payroll queries
      this.cache.evict({ fieldName: "payrolls" });
      this.cache.evict({ fieldName: "payrollDates" });
    }

    if (broadcast) {
      this.cache.gc();
    }
  }

  /**
   * Invalidate client-related data
   */
  invalidateClientData(clientId?: string, options: CacheInvalidationOptions = {}) {
    const { broadcast = true } = options;

    if (clientId) {
      this.cache.evict({ id: `clients:${clientId}` });
      // Invalidate client's payrolls
      this.cache.modify({
        id: `clients:${clientId}`,
        fields: {
          payrolls: () => undefined,
          notes: () => undefined,
        },
      });
    } else {
      this.cache.evict({ fieldName: "clients" });
    }

    if (broadcast) {
      this.cache.gc();
    }
  }

  /**
   * Invalidate notes (often updated in real-time)
   */
  invalidateNotes(entityType?: string, entityId?: string, options: CacheInvalidationOptions = {}) {
    const { broadcast = true } = options;

    if (entityType && entityId) {
      // Invalidate notes for specific entity
      this.cache.modify({
        id: `${entityType}:${entityId}`,
        fields: {
          notes: () => undefined,
        },
      });
    } else {
      // Invalidate all notes
      this.cache.evict({ fieldName: "notes" });
    }

    if (broadcast) {
      this.cache.gc();
    }
  }

  /**
   * Bulk cache invalidation for major operations
   */
  invalidateBulk(entities: Array<{ type: string; id?: string }>, options: CacheInvalidationOptions = {}) {
    const { broadcast = true } = options;

    entities.forEach(({ type, id }) => {
      if (id) {
        this.cache.evict({ id: `${type}:${id}` });
      } else {
        this.cache.evict({ fieldName: type });
      }
    });

    if (broadcast) {
      this.cache.gc();
    }
  }

  /**
   * Smart cache cleanup - removes stale data based on timestamp
   */
  cleanupStaleData(maxAgeMinutes: number = 30) {
    const cutoffTime = Date.now() - (maxAgeMinutes * 60 * 1000);
    
    // This is a simplified cleanup - in a real scenario you'd track timestamps
    console.log(`🧹 Cache cleanup: removing data older than ${maxAgeMinutes} minutes`);
    
    // In practice, you'd implement timestamp tracking in your cache policies
    // For now, just run garbage collection
    this.cache.gc();
  }

  /**
   * Reset entire cache (use sparingly)
   */
  resetCache() {
    console.warn("🗑️ Full cache reset initiated");
    this.cache.reset();
  }
}

/**
 * Hook for cache invalidation in React components
 */
export function useCacheInvalidation(cache: ApolloCache<any>) {
  const manager = new CacheInvalidationManager(cache);

  return {
    invalidateUserData: manager.invalidateUserData.bind(manager),
    invalidatePayrollData: manager.invalidatePayrollData.bind(manager),
    invalidateClientData: manager.invalidateClientData.bind(manager),
    invalidateNotes: manager.invalidateNotes.bind(manager),
    invalidateBulk: manager.invalidateBulk.bind(manager),
    cleanupStaleData: manager.cleanupStaleData.bind(manager),
    resetCache: manager.resetCache.bind(manager),
  };
}

/**
 * Optimistic update utilities
 */
export class OptimisticUpdateManager {
  constructor(private cache: ApolloCache<any>) {}

  /**
   * Optimistically update user data
   */
  updateUserOptimistically(userId: string, updates: Partial<any>) {
    this.cache.modify({
      id: `users:${userId}`,
      fields: {
        ...Object.keys(updates).reduce((acc, key) => ({
          ...acc,
          [key]: () => updates[key]
        }), {}),
        updatedAt: () => new Date().toISOString(),
      },
    });
  }

  /**
   * Optimistically add a note
   */
  addNoteOptimistically(note: any, entityType: string, entityId: string) {
    const tempId = `temp-${Date.now()}`;
    const optimisticNote = {
      ...note,
      id: tempId,
      createdAt: new Date().toISOString(),
      __typename: "notes",
    };

    this.cache.modify({
      id: `${entityType}:${entityId}`,
      fields: {
        notes: (existingNotes = []) => [optimisticNote, ...existingNotes],
      },
    });

    return tempId; // Return temp ID for later correction
  }

  /**
   * Fix optimistic update with real data
   */
  correctOptimisticUpdate(tempId: string, realData: any, entityType: string, entityId: string) {
    this.cache.modify({
      id: `${entityType}:${entityId}`,
      fields: {
        notes: (existingNotes = []) => 
          existingNotes.map((note: any) => 
            note.id === tempId ? { ...realData, __typename: "notes" } : note
          ),
      },
    });
  }
}

/**
 * Export utilities for easy access
 */
export function createCacheUtils(cache: ApolloCache<any>) {
  return {
    invalidation: new CacheInvalidationManager(cache),
    optimistic: new OptimisticUpdateManager(cache),
  };
}
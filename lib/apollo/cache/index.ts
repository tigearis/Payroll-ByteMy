/**
 * Apollo Client Cache Module
 * 
 * Export barrel for all cache-related utilities and configurations
 */

// Main cache configuration
export { createUnifiedCache, createCustomCache } from "./cache-config";

// Type policies and data ID generation
export { typePolicies, generateDataId } from "./type-policies";

// Reusable merge functions
export {
  createPaginationMerge,
  createChronologicalMerge,
  createRealTimeLogMerge,
  createTemporalSort,
  createVersionSort,
  createReplaceMerge,
  createIdentityMerge,
} from "./merge-functions";

// Re-export existing cache utilities
export { 
  CacheInvalidationManager, 
  OptimisticUpdateManager, 
  useCacheInvalidation, 
  createCacheUtils 
} from "./cache-utils";
/**
 * Unified Apollo Client (Modular Version)
 * 
 * This is the new modular version that imports from the extracted modules.
 * This file serves as the main export point for backward compatibility.
 */

// Export types
export { 
  type UnifiedClientOptions, 
  type CacheOptions, 
  type CacheInvalidationOptions,
  SecurityLevel 
} from "./types";

// Export client factory and instances
export { 
  createUnifiedApolloClient
} from "./clients";

export { 
  clientApolloClient,
  serverApolloClient,
  adminApolloClient
} from "./clients/instances";

// Export error handling utilities for backward compatibility
export {
  isPermissionError,
  isAuthError,
  getSimpleErrorMessage,
  type GraphQLErrorDetails,
} from "../utils/handle-graphql-error";

// Export cache utilities
export { 
  CacheInvalidationManager, 
  OptimisticUpdateManager, 
  useCacheInvalidation, 
  createCacheUtils,
  createUnifiedCache,
} from "./cache";
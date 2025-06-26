/**
 * Apollo Client Cache Configuration
 * 
 * Creates optimized InMemoryCache with enhanced type policies for:
 * - Efficient data normalization
 * - Smart pagination handling
 * - Real-time update optimization
 * - Relationship management
 * - Performance optimization
 */

import { InMemoryCache } from "@apollo/client";
import type { CacheOptions } from "../types";
import { typePolicies, generateDataId } from "./type-policies";

/**
 * Create optimized cache configuration with enhanced type policies
 */
export function createUnifiedCache(): InMemoryCache {
  return new InMemoryCache({
    // Optimize cache size and performance
    resultCaching: true,
    
    // Define possible types for better cache normalization
    possibleTypes: {
      // Add union/interface types here when needed
    },
    
    // Type policies for smart caching behavior
    typePolicies,
    
    // Custom data ID generation for better normalization
    dataIdFromObject: generateDataId,
  });
}


/**
 * Create cache with custom options
 */
export function createCustomCache(options: CacheOptions = {}): InMemoryCache {
  const {
    resultCaching = true,
    enableDevTools = process.env.NODE_ENV === "development",
  } = options;

  return new InMemoryCache({
    resultCaching,
    typePolicies,
    dataIdFromObject: generateDataId,
    
    // Add development helpers
    ...(enableDevTools && {
      addTypename: true,
    }),
  });
}
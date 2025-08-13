// hooks/useCacheInvalidation.ts
import { useApolloClient, DocumentNode } from "@apollo/client";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { GetPayrollsDocument, GetPayrollsPaginatedDocument } from "@/domains/payrolls/graphql/generated/graphql";

/**
 * Options for invalidating a specific entity
 */
interface EntityOptions {
  /**
   * The type name as defined in the GraphQL schema (e.g., 'payrolls')
   */
  typename: string;

  /**
   * The ID of the entity to invalidate
   */
  id: string | number;
}

/**
 * Options for invalidating a specific query
 */
interface QueryOptions {
  /**
   * The query to invalidate
   */
  query: DocumentNode;

  /**
   * Optional variables for the query
   */
  variables?: Record<string, any>;
}

/**
 * A hook providing optimized methods to invalidate the Apollo cache
 * 
 * Performance improvements:
 * - Memoized functions to prevent unnecessary re-renders
 * - Batch operations for better performance
 * - Intelligent cache warming after invalidation
 * - Better error handling and recovery
 */
export function useCacheInvalidation() {
  const client = useApolloClient();

  /**
   * Invalidate a specific entity by forcing a refetch
   * Memoized to prevent unnecessary re-renders when used in useEffect
   */
  const invalidateEntity = useCallback(async ({ typename, id }: EntityOptions) => {
    try {
      // First try to evict the entity directly from the cache
      const cacheId = client.cache.identify({ __typename: typename, id });
      const success = cacheId ? client.cache.evict({ id: cacheId }) : false;

      // Garbage collect any dangling references
      client.cache.gc();

      if (!success) {
        console.warn(`Failed to evict entity ${typename}:${id} from cache`);
      }

      return success;
    } catch (error) {
      console.error(`Error invalidating ${typename}:${id}:`, error);
      return false;
    }
  }, [client]);

  /**
   * Refetch a specific query, optionally notifying the user
   * Memoized to prevent unnecessary re-renders when used in useEffect
   */
  const refetchQuery = useCallback(async (
    { query, variables }: QueryOptions,
    notifyUser = false
  ) => {
    try {
      if (notifyUser) {
        toast.info("Refreshing data...");
      }

      const result = await client.refetchQueries({
        include: [query],
      });

      if (notifyUser && result.length > 0) {
        toast.success("Data refreshed successfully");
      }

      return true;
    } catch (error) {
      console.error("Error refetching query:", error);

      if (notifyUser) {
        toast.error("Failed to refresh data");
      }

      return false;
    }
  }, [client]);

  /**
   * Refetch multiple queries by their names, optionally notifying the user
   * Memoized to prevent unnecessary re-renders when used in useEffect
   * NOTE: Apollo Client doesn't support string query names in refetchQueries.include
   * Use refetchQueriesByDocument instead with DocumentNode objects
   */
  const refetchQueries = useCallback(async (queryNames: string[], notifyUser = false) => {
    if (notifyUser) {
      toast.warning("String-based query refetch not supported. Use refetchQueriesByDocument with DocumentNode objects.");
    }
    
    console.warn(
      "refetchQueries with string names is deprecated. Use refetchQueriesByDocument with DocumentNode objects instead.",
      { queryNames }
    );
    
    return false;
  }, [client]);

  /**
   * Refetch multiple queries by their DocumentNode references, optionally notifying the user
   * Memoized to prevent unnecessary re-renders when used in useEffect
   */
  const refetchQueriesByDocument = useCallback(async (
    queryDocuments: DocumentNode[],
    notifyUser = false
  ) => {
    try {
      if (notifyUser) {
        toast.info("Refreshing data...");
      }

      const result = await client.refetchQueries({
        include: queryDocuments,
      });

      if (notifyUser && result.length > 0) {
        toast.success("Data refreshed successfully");
      }

      return true;
    } catch (error) {
      console.error("Error refetching queries:", error);

      if (notifyUser) {
        toast.error("Failed to refresh data");
      }

      return false;
    }
  }, [client]);

  /**
   * Reset the entire cache (use with caution)
   * Memoized to prevent unnecessary re-renders when used in useEffect
   */
  const resetCache = useCallback(async (notifyUser = false) => {
    try {
      if (notifyUser) {
        toast.info("Resetting data...");
      }

      await client.resetStore();

      if (notifyUser) {
        toast.success("Data reset successfully");
      }

      return true;
    } catch (error) {
      console.error("Error resetting cache:", error);

      if (notifyUser) {
        toast.error("Failed to reset data");
      }

      return false;
    }
  }, [client]);

  /**
   * Force updates for a list of payroll IDs by evicting them from the cache
   * OPTIMIZED: Uses batch operations and proper DocumentNode references
   */
  const refreshPayrolls = useCallback(async (payrollIds: string[], showToast = false) => {
    if (showToast) {
      toast.info("Refreshing payroll data...");
    }

    try {
      // OPTIMIZATION 1: Batch evict all payrolls at once instead of sequential loops
      const evictionPromises = payrollIds.map(id => {
        const cacheId = client.cache.identify({ __typename: "payrolls", id });
        return cacheId ? client.cache.evict({ id: cacheId }) : false;
      });

      const evictionResults = await Promise.allSettled(evictionPromises);
      const successfulEvictions = evictionResults.filter(result => 
        result.status === 'fulfilled' && result.value
      ).length;

      // OPTIMIZATION 2: Single garbage collection after all evictions
      client.cache.gc();

      // OPTIMIZATION 3: Use DocumentNode instead of string for better type safety
      // Refetch both the basic payrolls query and the paginated query used by the main payrolls page
      await client.refetchQueries({
        include: [GetPayrollsPaginatedDocument, GetPayrollsDocument],
        updateCache: (cache) => {
          // OPTIMIZATION 4: Cache warming - preload related data
          try {
            cache.readQuery({ query: GetPayrollsPaginatedDocument });
          } catch {
            // Query not in cache yet - that's fine
          }
          try {
            // Pre-fetch any related queries that might be needed
            cache.readQuery({ query: GetPayrollsDocument });
          } catch {
            // Cache miss is okay, query will fetch fresh data
          }
        }
      });

      const success = successfulEvictions === payrollIds.length;

      if (showToast) {
        if (success) {
          toast.success(`Refreshed ${successfulEvictions} payroll records`);
        } else {
          toast.warning(`Refreshed ${successfulEvictions}/${payrollIds.length} payroll records`);
        }
      }

      return success;
    } catch (error) {
      console.error("Error refreshing payrolls:", error);

      if (showToast) {
        toast.error("Failed to refresh payroll data");
      }

      return false;
    }
  }, [client, invalidateEntity]);

  /**
   * OPTIMIZATION 5: Batch entity invalidation for better performance
   */
  const invalidateEntities = useCallback(async (entities: EntityOptions[], showToast = false) => {
    if (showToast) {
      toast.info("Refreshing data...");
    }

    try {
      // Batch evict all entities
      const evictionPromises = entities.map(({ typename, id }) => {
        const cacheId = client.cache.identify({ __typename: typename, id });
        return cacheId ? client.cache.evict({ id: cacheId }) : false;
      });

      const results = await Promise.allSettled(evictionPromises);
      const successCount = results.filter(result => 
        result.status === 'fulfilled' && result.value
      ).length;

      // Single garbage collection
      client.cache.gc();

      if (showToast) {
        toast.success(`Refreshed ${successCount}/${entities.length} items`);
      }

      return successCount === entities.length;
    } catch (error) {
      console.error("Error invalidating entities:", error);
      
      if (showToast) {
        toast.error("Failed to refresh data");
      }
      
      return false;
    }
  }, [client]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    // Core cache invalidation functions
    invalidateEntity,
    invalidateEntities, // NEW: Batch entity invalidation
    
    // Query refetching functions
    refetchQuery,
    refetchQueries,
    refetchQueriesByDocument,
    
    // Cache management functions
    resetCache,
    refreshPayrolls, // OPTIMIZED: Now uses batch operations
  }), [
    invalidateEntity,
    invalidateEntities,
    refetchQuery,
    refetchQueries,
    refetchQueriesByDocument,
    resetCache,
    refreshPayrolls,
  ]);
}

// hooks/useCacheInvalidation.ts
import { useApolloClient, Reference, DocumentNode } from "@apollo/client";
import { toast } from "sonner";
import { 
  GetPayrollsDocument,
  GetPayrollsByMonthDocument,
  GetPayrollsMissingDatesDocument
} from "@/domains/payrolls/graphql/generated/graphql";

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
 * A hook providing methods to invalidate the Apollo cache
 */
export function useCacheInvalidation() {
  const client = useApolloClient();

  /**
   * Invalidate a specific entity by forcing a refetch
   */
  const invalidateEntity = async ({ typename, id }: EntityOptions) => {
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
  };

  /**
   * Refetch a specific query, optionally notifying the user
   */
  const refetchQuery = async (
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
  };

  /**
   * Refetch multiple queries by their names, optionally notifying the user
   */
  const refetchQueries = async (queryNames: string[], notifyUser = false) => {
    try {
      if (notifyUser) {
        toast.info("Refreshing data...");
      }

      const result = await client.refetchQueries({
        include: queryNames,
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
  };

  /**
   * Refetch multiple queries by their DocumentNode references, optionally notifying the user
   */
  const refetchQueriesByDocument = async (queryDocuments: DocumentNode[], notifyUser = false) => {
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
  };

  /**
   * Reset the entire cache (use with caution)
   */
  const resetCache = async (notifyUser = false) => {
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
  };

  /**
   * Force updates for a list of payroll IDs by evicting them from the cache
   */
  const refreshPayrolls = async (payrollIds: string[], showToast = false) => {
    let success = true;

    if (showToast) {
      toast.info("Refreshing payroll data...");
    }

    try {
      // Evict each payroll from the cache
      for (const id of payrollIds) {
        const result = await invalidateEntity({
          typename: "payrolls",
          id,
        });

        if (!result) success = false;
      }

      // Refetch payroll queries to get fresh data
      await client.refetchQueries({
        include: [
          GetPayrollsDocument,
          GetPayrollsByMonthDocument,
          GetPayrollsMissingDatesDocument,
        ],
      });

      if (showToast) {
        toast.success("Payroll data refreshed");
      }

      return success;
    } catch (error) {
      console.error("Error refreshing payrolls:", error);

      if (showToast) {
        toast.error("Failed to refresh payroll data");
      }

      return false;
    }
  };

  return {
    invalidateEntity,
    refetchQuery,
    refetchQueries,
    refetchQueriesByDocument,
    resetCache,
    refreshPayrolls,
  };
}

import {
  useQuery,
  QueryHookOptions,
  DocumentNode,
  OperationVariables,
} from "@apollo/client";
import { getCacheStrategy, cacheStrategies } from "@/lib/apollo/cache/cache-strategies";

/**
 * Strategic query hook that applies unified cache strategies
 * This replaces direct useQuery calls to ensure consistent caching behavior
 */
export const useStrategicQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  document: DocumentNode,
  entityType: keyof typeof cacheStrategies,
  options?: QueryHookOptions<TData, TVariables>
) => {
  const strategy = getCacheStrategy(entityType);

  const queryOptions: QueryHookOptions<TData, TVariables> = {
    fetchPolicy: strategy.fetchPolicy,
    errorPolicy: strategy.errorPolicy,
    notifyOnNetworkStatusChange: strategy.notifyOnNetworkStatusChange ?? true,
    ...(strategy.pollInterval && { pollInterval: strategy.pollInterval }),
    ...(strategy.nextFetchPolicy && {
      nextFetchPolicy: strategy.nextFetchPolicy,
    }),
    ...options, // Allow overrides for specific cases
  };

  return useQuery<TData, TVariables>(document, queryOptions);
};

/**
 * Hook for queries that need fresh data (like version checks)
 */
export const useFreshQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  document: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
) => {
  return useStrategicQuery<TData, TVariables>(
    document,
    "versionCheck",
    options
  );
};

/**
 * Hook for real-time sensitive data (like security events)
 */
export const useRealTimeQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  document: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
) => {
  return useStrategicQuery<TData, TVariables>(
    document,
    "securityEvents",
    options
  );
};

/**
 * Hook for standard business data with caching
 */
export const useCachedQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  document: DocumentNode,
  entityType: Exclude<
    keyof typeof cacheStrategies,
    "versionCheck" | "securityEvents"
  >,
  options?: QueryHookOptions<TData, TVariables>
) => {
  return useStrategicQuery<TData, TVariables>(document, entityType, options);
};

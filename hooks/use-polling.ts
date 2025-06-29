// hooks/usePolling.ts
import {
  ApolloQueryResult,
  OperationVariables,
  QueryResult,
} from "@apollo/client";
import { useEffect, useRef } from "react";

/**
 * Options for the useSmartPolling hook
 */
interface UseSmartPollingOptions {
  /**
   * Default polling interval in milliseconds
   */
  defaultInterval?: number;

  /**
   * Whether to pause polling when the window is not visible
   */
  pauseOnHidden?: boolean;

  /**
   * Whether to refetch immediately when the window becomes visible again
   */
  refetchOnVisible?: boolean;

  /**
   * Whether to pause polling when the network is offline
   */
  pauseOnOffline?: boolean;

  /**
   * Whether to refetch immediately when the network comes back online
   */
  refetchOnOnline?: boolean;
}

/**
 * A hook for smart data polling that adapts to window visibility and network status
 *
 * @param queryResult The result from a useQuery hook
 * @param options Configuration options
 */
export function useSmartPolling<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  queryResult: Pick<
    QueryResult<TData, TVariables>,
    "startPolling" | "stopPolling" | "refetch"
  >,
  options: UseSmartPollingOptions = {}
) {
  const {
    defaultInterval = 30000,
    pauseOnHidden = true,
    refetchOnVisible = true,
    pauseOnOffline = true,
    refetchOnOnline = true,
  } = options;

  // Store current polling state to avoid unnecessary start/stop cycles
  const pollingStateRef = useRef({
    isPolling: true,
    currentInterval: defaultInterval,
  });

  // Start polling initially
  useEffect(() => {
    queryResult.startPolling(defaultInterval);

    return () => {
      queryResult.stopPolling();
    };
  }, [queryResult, defaultInterval]);

  // Handle window visibility changes
  useEffect(() => {
    if (!pauseOnHidden) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Window is hidden, pause polling
        if (pollingStateRef.current.isPolling) {
          queryResult.stopPolling();
          pollingStateRef.current.isPolling = false;
        }
      } else {
        // Window is visible again
        if (!pollingStateRef.current.isPolling) {
          // Optionally do an immediate refetch
          if (refetchOnVisible) {
            queryResult.refetch();
          }

          // Restart polling
          queryResult.startPolling(pollingStateRef.current.currentInterval);
          pollingStateRef.current.isPolling = true;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [queryResult, pauseOnHidden, refetchOnVisible]);

  // Handle network status changes
  useEffect(() => {
    if (!pauseOnOffline) return;

    const handleOnline = () => {
      if (!pollingStateRef.current.isPolling) {
        // Optionally do an immediate refetch
        if (refetchOnOnline) {
          queryResult.refetch();
        }

        // Restart polling
        queryResult.startPolling(pollingStateRef.current.currentInterval);
        pollingStateRef.current.isPolling = true;
      }
    };

    const handleOffline = () => {
      if (pollingStateRef.current.isPolling) {
        queryResult.stopPolling();
        pollingStateRef.current.isPolling = false;
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queryResult, pauseOnOffline, refetchOnOnline]);

  // Return methods to control polling
  return {
    /**
     * Change the polling interval
     */
    setPollingInterval: (interval: number) => {
      pollingStateRef.current.currentInterval = interval;
      if (pollingStateRef.current.isPolling) {
        queryResult.stopPolling();
        queryResult.startPolling(interval);
      }
    },

    /**
     * Pause polling manually
     */
    pausePolling: () => {
      if (pollingStateRef.current.isPolling) {
        queryResult.stopPolling();
        pollingStateRef.current.isPolling = false;
      }
    },

    /**
     * Resume polling manually
     */
    resumePolling: () => {
      if (!pollingStateRef.current.isPolling) {
        queryResult.startPolling(pollingStateRef.current.currentInterval);
        pollingStateRef.current.isPolling = true;
      }
    },

    /**
     * Check if polling is currently active
     */
    isPolling: () => pollingStateRef.current.isPolling,

    /**
     * Get the current polling interval
     */
    getCurrentInterval: () => pollingStateRef.current.currentInterval,
  };
}

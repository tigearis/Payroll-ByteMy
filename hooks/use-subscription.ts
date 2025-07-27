// hooks/useSubscription.ts
import {
  useSubscription as useApolloSubscription,
  useApolloClient,
  SubscriptionHookOptions,
  DocumentNode,
} from "@apollo/client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

interface UseRealTimeSubscriptionOptions {
  document: DocumentNode;
  variables?: Record<string, unknown>;
  refetchQueries?: DocumentNode[];
  shouldToast?: boolean;
  onData?: (data: unknown) => void;
}

/**
 * Custom hook for handling GraphQL subscriptions with proper error handling and reconnection
 */
export function useRealTimeSubscription({
  document,
  variables,
  refetchQueries = [],
  shouldToast = false,
  onData,
}: UseRealTimeSubscriptionOptions) {
  const client = useApolloClient();
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Memoize refetchQueries array to prevent infinite loops
  const stableRefetchQueries = useMemo(() => refetchQueries, [refetchQueries]);

  // Subscription options
  const options: SubscriptionHookOptions = {
    variables: variables || {},
    onData: async ({ data }) => {
      if (!isConnected) {
        setIsConnected(true);
        if (shouldToast) {
          toast.success("Real-time updates connected");
        }
      }

      // Handle the data
      if (data.data && onData) {
        onData(data.data);
      }

      // Refresh relevant queries
      if (stableRefetchQueries && stableRefetchQueries.length > 0) {
        try {
          await client.refetchQueries({
            include: stableRefetchQueries,
          });
        } catch (refetchError) {
          console.warn("Failed to refetch queries:", refetchError);
        }
      }
    },
    onError: error => {
      console.warn("Subscription error (WebSocket may not be configured):", error);
      setIsConnected(false);
      setRetryCount(prev => prev + 1);

      // Only show toast for actual connection errors, not configuration issues
      if (shouldToast && retryCount === 0 && !error.message?.includes('not supported')) {
        toast.error("Real-time connection lost. Attempting to reconnect...");
      }
    },
  };

  // Set up the subscription
  const result = useApolloSubscription(document, options);

  // Handle reconnection attempts
  useEffect(() => {
    if (!isConnected && retryCount > 0 && retryCount < 5) {
      const timeout = setTimeout(
        () => {
          // Force refetch on reconnection attempt
          if (stableRefetchQueries && stableRefetchQueries.length > 0) {
            client.refetchQueries({
              include: stableRefetchQueries,
            }).catch(refetchError => {
              console.warn("Failed to refetch queries on reconnection:", refetchError);
            });
          }
        },
        Math.min(retryCount * 1000, 5000)
      ); // Exponential backoff

      return () => clearTimeout(timeout);
    }

    // Show final error after too many attempts
    if (retryCount >= 5 && shouldToast) {
      toast.error("Could not establish real-time connection");
    }

    return undefined;
  }, [retryCount, isConnected, client, stableRefetchQueries, shouldToast]);

  // Reset retry count when connection is successful
  useEffect(() => {
    if (isConnected) {
      setRetryCount(0);
    }
  }, [isConnected]);

  return {
    ...result,
    isConnected,
  };
}

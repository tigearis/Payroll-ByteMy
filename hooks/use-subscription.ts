// hooks/useSubscription.ts
import { useEffect, useState } from "react";
import {
  useSubscription as useApolloSubscription,
  useApolloClient,
  SubscriptionHookOptions,
  DocumentNode,
} from "@apollo/client";
import { toast } from "sonner";

interface UseRealTimeSubscriptionOptions {
  document: DocumentNode;
  variables?: Record<string, any>;
  refetchQueries?: string[];
  shouldToast?: boolean;
  onData?: (data: any) => void;
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
      if (refetchQueries.length > 0) {
        await client.refetchQueries({
          include: refetchQueries,
        });
      }
    },
    onError: error => {
      console.error("Subscription error:", error);
      setIsConnected(false);
      setRetryCount(prev => prev + 1);

      if (shouldToast && retryCount === 0) {
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
          client.refetchQueries({
            include: refetchQueries,
          });
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
  }, [retryCount, isConnected, client, refetchQueries, shouldToast]);

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

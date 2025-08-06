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
  // Use JSON.stringify to compare array contents, not reference
  const stableRefetchQueries = useMemo(() => refetchQueries, [
    JSON.stringify(refetchQueries?.map(query => {
      const definition = query?.definitions?.[0];
      return definition && 'name' in definition ? definition.name?.value : 'unnamed';
    }) || [])
  ]);

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
          // Filter out any invalid queries
          const validQueries = stableRefetchQueries.filter(query => 
            query && query.definitions && query.definitions.length > 0
          );
          
          if (validQueries.length > 0) {
            await client.refetchQueries({
              include: validQueries,
            });
          }
        } catch (refetchError) {
          console.warn("Failed to refetch queries:", refetchError);
          // Log more details about the error
          if (refetchError instanceof Error && refetchError.message?.includes('unknown query')) {
            console.warn("Query validation failed. Available queries:", 
              stableRefetchQueries.map(q => {
                const definition = q?.definitions?.[0];
                return definition && 'name' in definition ? definition.name?.value : 'unnamed';
              }));
          }
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
            // Filter out any invalid queries
            const validQueries = stableRefetchQueries.filter(query => 
              query && query.definitions && query.definitions.length > 0
            );
            
            if (validQueries.length > 0) {
              client.refetchQueries({
                include: validQueries,
              }).catch(refetchError => {
                console.warn("Failed to refetch queries on reconnection:", refetchError);
              });
            }
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

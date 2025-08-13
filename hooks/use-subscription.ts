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
          // Filter out any invalid queries with more thorough validation
          const validQueries = stableRefetchQueries.filter(query => {
            if (!query || typeof query !== 'object') return false;
            if (!query.definitions || !Array.isArray(query.definitions)) return false;
            if (query.definitions.length === 0) return false;
            
            // Check if it has a proper operation definition
            const firstDef = query.definitions[0];
            return firstDef && 
                   firstDef.kind === 'OperationDefinition' && 
                   firstDef.operation === 'query' && 
                   firstDef.name && 
                   firstDef.name.value;
          });
          
          if (validQueries.length === 0) {
            console.debug("🔄 No valid queries to refetch in subscription");
            return;
          }
          
          const queryNames = validQueries.map(q => {
            const def = q.definitions[0];
            return 'name' in def && def.name ? def.name.value : 'unnamed';
          });
          
          console.debug("🔄 Refetching queries in subscription:", queryNames);
          
          // Try to refetch queries with more specific error handling
          for (const query of validQueries) {
            const queryName = query.definitions[0] && 'name' in query.definitions[0] && query.definitions[0].name 
              ? query.definitions[0].name.value 
              : 'unnamed';
              
            try {
              await client.refetchQueries({
                include: [query],
              });
              console.debug(`✅ Successfully refetched ${queryName}`);
            } catch (singleQueryError) {
              console.warn(`❌ Failed to refetch ${queryName}:`, singleQueryError);
              
              // Try alternative approach - invalidate cache instead of refetch
              if (singleQueryError instanceof Error && singleQueryError.message?.includes('Unknown query')) {
                console.debug(`🔄 Attempting cache invalidation for ${queryName} instead`);
                try {
                  // Remove all cached results for this query type
                  client.cache.evict({ fieldName: 'payrolls' });
                  client.cache.gc();
                  console.debug(`✅ Successfully invalidated cache for ${queryName}`);
                } catch (evictError) {
                  console.warn(`❌ Cache eviction also failed for ${queryName}:`, evictError);
                }
              }
            }
          }
        } catch (refetchError) {
          console.warn("🔄 Failed to refetch queries in subscription:", refetchError);
          
          // Provide more detailed error information
          if (refetchError instanceof Error) {
            console.warn("📋 Error details:", {
              message: refetchError.message,
              name: refetchError.name,
              stack: refetchError.stack?.split('\n').slice(0, 3).join('\n'), // First 3 lines
            });
            
            if (refetchError.message?.includes('unknown query') || refetchError.message?.includes('Unknown query')) {
              console.warn("📝 Query validation failed. Attempted queries:", 
                stableRefetchQueries.map(q => {
                  const definition = q?.definitions?.[0];
                  const queryName = definition && 'name' in definition ? definition.name?.value : 'unnamed';
                  return {
                    name: queryName,
                    isValid: q && q.definitions && q.definitions.length > 0,
                    definitionType: definition?.kind || 'unknown',
                  };
                }));
            } else if (refetchError.message?.includes('Network error') || refetchError.name === 'NetworkError') {
              console.debug("🌐 Network error during query refetch - this is expected during offline periods");
            } else if (refetchError.message?.includes('Failed to fetch') || refetchError.message?.includes('fetch')) {
              console.debug("📡 Connection error during query refetch - will retry on reconnection");
            }
          } else {
            console.warn("📋 Non-Error exception:", refetchError);
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
            // Filter out any invalid queries with more thorough validation
            const validQueries = stableRefetchQueries.filter(query => {
              if (!query || typeof query !== 'object') return false;
              if (!query.definitions || !Array.isArray(query.definitions)) return false;
              if (query.definitions.length === 0) return false;
              
              // Check if it has a proper operation definition
              const firstDef = query.definitions[0];
              return firstDef && 
                     firstDef.kind === 'OperationDefinition' && 
                     firstDef.operation === 'query' && 
                     firstDef.name && 
                     firstDef.name.value;
            });
            
            if (validQueries.length > 0) {
              console.debug("🔄 Attempting reconnection refetch for queries:", 
                validQueries.map(q => {
                  const def = q.definitions[0];
                  return 'name' in def && def.name ? def.name.value : 'unnamed';
                })
              );
              
              client.refetchQueries({
                include: validQueries,
              }).catch(refetchError => {
                console.warn("🔄 Failed to refetch queries on reconnection:", refetchError);
                
                // Log additional details for debugging
                if (refetchError instanceof Error && refetchError.message?.includes('Unknown query')) {
                  console.warn("🔍 Reconnection query validation issue detected");
                }
              });
            } else {
              console.debug("🔄 No valid queries available for reconnection refetch");
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

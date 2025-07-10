/**
 * Apollo Client Factory
 * 
 * Creates Apollo Client instances with unified configuration
 */

import { ApolloClient, from, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUnifiedCache } from "../cache";
import {
  createAuthLink,
  createErrorLink,
  createRetryLink,
  createWebSocketLink,
  createUnifiedHttpLink,
  createDataLoaderLink,
  createComplexityLink,
} from "../links";
import type { UnifiedClientOptions } from "../types";

/**
 * Simplified Apollo client factory using native Clerk features
 */
export function createUnifiedApolloClient(
  options: UnifiedClientOptions = { context: "client" }
): ApolloClient<any> {
  const config = {
    enableWebSocket: false,
    enableRetry: true,
    ...options,
  };

  const cache = createUnifiedCache();
  const httpLink = createUnifiedHttpLink();
  const errorLink = createErrorLink(config);
  const authLink = createAuthLink(config);
  const retryLink = createRetryLink(config);
  const dataLoaderLink = createDataLoaderLink();
  const complexityLink = createComplexityLink();
  const wsLink = createWebSocketLink(config);

  // ================================
  // CRITICAL: APOLLO LINK CHAIN ORDER
  // ================================
  // 
  // The order of links in the chain is CRITICAL for proper operation.
  // Each link processes requests in sequence and responses in reverse:
  //
  // REQUEST FLOW (Component → Hasura):
  // Component → errorLink → complexityLink → retryLink → dataLoaderLink → authLink → httpLink → Hasura
  //
  // RESPONSE FLOW (Hasura → Component):  
  // Hasura → httpLink → authLink → dataLoaderLink → retryLink → complexityLink → errorLink → Component
  //
  // WHY THIS ORDER MATTERS:
  //
  // 1. ERROR LINK (first) - Must catch ALL errors from subsequent links
  //    - Catches network errors from httpLink
  //    - Catches auth errors from authLink  
  //    - Provides centralized error logging and user messaging
  //    - Can trigger token refresh and retry operations
  //
  // 2. COMPLEXITY LINK (second) - Query analysis and protection
  //    - Analyzes query complexity before processing
  //    - Blocks or warns about expensive queries early
  //    - Must be after error link to properly handle complexity errors
  //    - Must be before retry to avoid analyzing retried queries multiple times
  //
  // 3. RETRY LINK (third) - Must be after complexity analysis
  //    - Retries failed operations with exponential backoff
  //    - Does NOT retry authentication errors (prevents infinite loops)
  //    - Retries network errors and transient failures
  //    - Must come after complexity to avoid re-analyzing retries
  //
  // 4. DATALOADER LINK (fourth) - Batching and deduplication optimization
  //    - Batches identical queries within a 10ms window
  //    - Prevents N+1 query problems common in GraphQL
  //    - Deduplicates identical requests for better performance
  //    - Must be after retry and before auth to batch with fresh tokens
  //
  // 5. AUTH LINK (fifth) - Must be just before transport
  //    - Injects authentication tokens into every request
  //    - Retrieves fresh Clerk JWT tokens when needed
  //    - Must be after retry/batching to get fresh tokens for all requests
  //    - Must be before httpLink to include auth in transport
  //
  // 6. HTTP LINK (last) - Actual transport to GraphQL endpoint
  //    - Sends requests to Hasura with all headers/auth
  //    - Returns raw GraphQL responses
  //    - Network errors bubble up through the chain
  //
  // ⚠️  CHANGING THIS ORDER CAN BREAK:
  //    - Authentication (tokens missing or stale)
  //    - Error handling (errors not caught properly)  
  //    - Retry logic (infinite loops or missing auth)
  //    - Audit logging (errors not logged)

  let link;

  if (wsLink && config.enableWebSocket) {
    // Split transport: WebSocket for subscriptions, HTTP for queries/mutations
    link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink, // Real-time subscriptions go to WebSocket
      // All other operations go through the standard link chain  
      // Temporarily disable dataLoaderLink to debug error
      from([errorLink, complexityLink, retryLink, authLink, httpLink])
    );
  } else {
    // Standard HTTP-only link chain (server/admin contexts)
    // Temporarily disable dataLoaderLink to debug error
    link = from([errorLink, complexityLink, retryLink, authLink, httpLink]);
  }

  return new ApolloClient({
    link,
    cache,
    ssrMode: typeof window === "undefined",
    connectToDevTools: process.env.NODE_ENV === "development",
    defaultOptions: {
      query: { errorPolicy: "all" },
      watchQuery: { errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  });
}
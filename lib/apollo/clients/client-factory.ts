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
  const wsLink = createWebSocketLink(config);

  // Combine links
  let link;

  if (wsLink && config.enableWebSocket) {
    link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      from([errorLink, retryLink, authLink, httpLink])
    );
  } else {
    link = from([errorLink, retryLink, authLink, httpLink]);
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
/**
 * HTTP Link for Apollo Client
 * 
 * POSITION IN CHAIN: LAST (final transport to GraphQL endpoint)
 * 
 * RESPONSIBILITIES:
 * - Sends HTTP requests to Hasura GraphQL endpoint
 * - Handles CORS credentials and headers
 * - Returns raw GraphQL responses
 * - Provides the actual network transport layer
 * - Validates GraphQL endpoint URI configuration
 * 
 * WHY LAST IN CHAIN:
 * - Final step: Actual network request to server
 * - Receives fully processed request with auth/retries/error handling
 * - All upstream links have added their context/headers
 * - Network errors bubble back up through the chain
 * - Simplest link - just HTTP transport
 * 
 * CRITICAL: Must be the final link in the chain (terminal)
 */

import { ApolloLink, createHttpLink } from "@apollo/client";

/**
 * Create HTTP link with proper headers
 */
export function createUnifiedHttpLink(): ApolloLink {
  const uri = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  if (!uri) {
    throw new Error("NEXT_PUBLIC_HASURA_GRAPHQL_URL is not defined");
  }

  return createHttpLink({
    uri,
    credentials: "include",
  });
}
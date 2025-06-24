/**
 * HTTP Link for Apollo Client
 * 
 * Creates HTTP link with proper headers and configuration
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
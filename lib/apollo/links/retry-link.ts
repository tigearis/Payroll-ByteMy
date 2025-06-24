/**
 * Retry Link for Apollo Client
 * 
 * Provides resilient operations with smart retry logic
 */

import { ApolloLink } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

import type { UnifiedClientOptions } from "../types";

/**
 * Create retry link for resilient operations
 */
export function createRetryLink(options: UnifiedClientOptions): ApolloLink {
  if (!options.enableRetry) {
    return new ApolloLink((operation, forward) => forward(operation));
  }

  return new RetryLink({
    delay: {
      initial: 300,
      max: 10000,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: error => {
        // Don't retry auth errors - they need token refresh instead
        if (
          error.graphQLErrors?.some(
            (err: any) =>
              err.extensions?.code === "invalid-jwt" ||
              err.extensions?.code === "access-denied"
          )
        ) {
          return false;
        }

        // Don't retry client-side errors
        if (
          error.graphQLErrors?.some(
            (err: any) => err.extensions?.code === "BAD_USER_INPUT"
          )
        ) {
          return false;
        }

        // Retry network errors and server errors
        return !!error.networkError || !!error.graphQLErrors;
      },
    },
  });
}
/**
 * Retry Link for Apollo Client
 * 
 * POSITION IN CHAIN: SECOND (after error link, before auth link)
 * 
 * RESPONSIBILITIES:
 * - Retries failed operations with exponential backoff
 * - Handles transient network failures and timeouts
 * - Prevents retry loops on authentication errors
 * - Implements jitter to avoid thundering herd
 * - Provides resilient operations for production stability
 * 
 * WHY SECOND IN CHAIN:
 * - After errorLink: Error handling can trigger retries
 * - Before authLink: Ensures fresh tokens for retry attempts  
 * - Before httpLink: Retries include authentication
 * - Avoids retrying authentication failures (infinite loops)
 * 
 * CRITICAL: Must be after error handling, before authentication
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
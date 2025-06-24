/**
 * Error Handling Link for Apollo Client
 * 
 * Provides comprehensive error handling using the consolidated error handler
 */

import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import {
  handleGraphQLError,
  isPermissionError,
  isAuthError,
  getSimpleErrorMessage,
  type GraphQLErrorDetails,
} from "@/lib/utils/handle-graphql-error";
import type { UnifiedClientOptions } from "../types";

/**
 * Enhanced error handling using comprehensive error handler
 */
export function createErrorLink(options: UnifiedClientOptions): ApolloLink {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    // Create an Apollo error for comprehensive handling
    const apolloError = {
      graphQLErrors: graphQLErrors || [],
      networkError,
      message:
        graphQLErrors?.[0]?.message || networkError?.message || "Unknown error",
    } as any;

    // Use comprehensive error handler for logging and user messaging
    const errorDetails = handleGraphQLError(apolloError);

    // Log with operation context
    console.error(
      `[Apollo Error in ${operation.operationName || "operation"}]:`,
      {
        type: errorDetails.type,
        message: errorDetails.message,
        userMessage: errorDetails.userMessage,
        suggestions: errorDetails.suggestions,
      }
    );

    // Handle JWT errors with automatic token refresh for client context
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        const isJWTError =
          error.extensions?.code === "invalid-jwt" ||
          error.message.includes("JWTExpired") ||
          error.message.includes("JWT token is expired");

        if (
          isJWTError &&
          options.context === "client" &&
          typeof window !== "undefined"
        ) {
          // Clerk handles token refresh automatically, just retry the operation
          return forward(operation);
        }
      }
    }

    // Return void to satisfy TypeScript
    return;
  });
}

// Re-export error utilities for convenience
export {
  isPermissionError,
  isAuthError,
  getSimpleErrorMessage,
  type GraphQLErrorDetails,
};
/**
 * Error Handling Link for Apollo Client
 * 
 * POSITION IN CHAIN: FIRST (catches all errors from subsequent links)
 * 
 * RESPONSIBILITIES:
 * - Catches and processes all GraphQL and network errors
 * - Provides user-friendly error messages and logging
 * - Handles JWT token expiration with automatic refresh
 * - Prevents error propagation that would crash components
 * - Integrates with audit logging for security compliance
 * 
 * WHY FIRST IN CHAIN:
 * - Must catch errors from authLink (auth failures)  
 * - Must catch errors from httpLink (network failures)
 * - Must catch errors from retryLink (retry exhaustion)
 * - Provides centralized error logging and user messaging
 * - Can trigger token refresh and operation retry for auth errors
 * 
 * CRITICAL: This link MUST be first to catch all downstream errors
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

// Error utilities are available through main apollo exports
// Import directly from @/lib/utils/handle-graphql-error if needed elsewhere
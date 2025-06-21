/**
 * Apollo GraphQL Client Index
 *
 * Central export point for all Apollo client functionality
 */

// Export all clients from unified-client.ts
export {
  createUnifiedApolloClient,
  clientApolloClient,
  serverApolloClient,
  adminApolloClient,
  SecurityLevel,
  type UnifiedClientOptions,
  // Error handling utilities
  isPermissionError,
  isAuthError,
  getSimpleErrorMessage,
  type GraphQLErrorDetails,
} from "./unified-client";

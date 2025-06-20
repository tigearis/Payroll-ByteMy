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
  parsePermissionError,
  getPermissionErrorMessage,
  handlePermissionError,
  type GraphQLPermissionError,
} from "./unified-client";

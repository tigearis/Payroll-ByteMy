/**
 * Apollo GraphQL Client Index
 *
 * Central export point for all Apollo client functionality
 */

// Export from unified-client.ts
export {
  createUnifiedApolloClient,
  clientApolloClient,
  serverApolloClient,
} from "./unified-client";

// Export from server-client.ts with renamed export to avoid conflict
export {
  adminApolloClient as serverAdminClient,
  createServerApolloClient,
} from "./server-client";

// Export error handler
export * from "./error-handler";

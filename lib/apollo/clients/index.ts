/**
 * Apollo Client Export Barrel
 * 
 * Centralized export for all Apollo Client configurations
 */

// Client factory
export { createUnifiedApolloClient } from "./client-factory";

// Pre-configured instances
export { 
  clientApolloClient, 
  serverApolloClient, 
  adminApolloClient 
} from "./instances";
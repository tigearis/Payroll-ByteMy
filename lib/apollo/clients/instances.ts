/**
 * Pre-configured Apollo Client Instances
 * 
 * Ready-to-use Apollo Client instances for different contexts
 */

import { createUnifiedApolloClient } from "./client-factory";

/**
 * Client-side Apollo client with full capabilities
 * Used for client components, React hooks, and client-side operations
 */
export const clientApolloClient = createUnifiedApolloClient({
  context: "client",
  enableWebSocket: true,
  enableRetry: true,
  enableAuditLogging: true,
});

/**
 * Server-side Apollo client for standard operations
 * Used for server components and API routes with user context
 */
export const serverApolloClient = createUnifiedApolloClient({
  context: "server",
  enableRetry: true,
});

/**
 * Admin Apollo client with admin secret access
 * Used for service operations requiring unrestricted Hasura access:
 * - Webhook handlers
 * - Cron jobs
 * - Admin functions
 * - User sync operations
 */
export const adminApolloClient = createUnifiedApolloClient({
  context: "admin",
  enableRetry: true,
});
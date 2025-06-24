/**
 * Authentication Link for Apollo Client
 * 
 * POSITION IN CHAIN: THIRD (just before HTTP transport)
 * 
 * RESPONSIBILITIES:
 * - Injects authentication tokens into every request
 * - Handles different auth contexts (client/server/admin)
 * - Retrieves fresh Clerk JWT tokens using native methods
 * - Provides admin access with Hasura admin secret
 * - Ensures proper authentication for all GraphQL operations
 * 
 * AUTHENTICATION CONTEXTS:
 * - Client context: Clerk JWT tokens with user permissions
 * - Server context: Clerk JWT tokens when user context available  
 * - Admin context: Hasura admin secret for service operations
 * 
 * WHY THIRD IN CHAIN:
 * - After retry: Fresh tokens for retried operations
 * - Before HTTP: Authentication included in transport
 * - Just before transport: Latest possible token retrieval
 * - Minimizes risk of token expiration during request
 * 
 * CRITICAL: Must be immediately before HTTP transport
 */

import { ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import type { UnifiedClientOptions } from "../types";

/**
 * Authentication link with hybrid strategy
 */
export function createAuthLink(options: UnifiedClientOptions): ApolloLink {
  return setContext(async (_, { headers }) => {
    try {
      // Admin context uses admin secret for service operations
      if (options.context === "admin" && typeof window === "undefined") {
        const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
        if (adminSecret) {
          return {
            headers: {
              ...headers,
              "x-hasura-admin-secret": adminSecret,
            },
          };
        } else {
          throw new Error("HASURA_GRAPHQL_ADMIN_SECRET not configured for admin operations");
        }
      }

      // Client context uses native Clerk Hasura template
      if (typeof window !== "undefined" && (window as any).Clerk?.session) {
        const token = await (window as any).Clerk.session.getToken({
          template: "hasura",
        });
        if (token) {
          return {
            headers: {
              ...headers,
              authorization: `Bearer ${token}`,
            },
          };
        }
      }

      return { headers };
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return { headers };
    }
  });
}
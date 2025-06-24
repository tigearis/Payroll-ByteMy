/**
 * Authentication Link for Apollo Client
 * 
 * Handles authentication across different contexts:
 * - Client context: Clerk JWT tokens
 * - Server context: Clerk JWT tokens when available
 * - Admin context: Hasura admin secret for service operations
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
/**
 * Authentication Link for Apollo Client
 * 
 * POSITION IN CHAIN: THIRD (just before HTTP transport)
 * 
 * RESPONSIBILITIES:
 * - Injects authentication tokens into every request
 * - Handles different auth contexts (client/server/admin)
 * - Retrieves fresh Clerk JWT tokens using reliable methods
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
 * Enhanced authentication link with improved Clerk integration
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

      // Client context uses enhanced Clerk JWT token retrieval
      if (typeof window !== "undefined") {
        let token = null;

        // Method 1: Try direct Clerk session access (most common)
        if ((window as any).Clerk?.session) {
          try {
            token = await (window as any).Clerk.session.getToken({
              template: "hasura",
            });
            if (token) {
              console.log("✅ JWT token retrieved via Clerk.session.getToken");
            }
          } catch (error) {
            console.warn("⚠️ Failed to get token via Clerk.session:", error);
          }
        }

        // Method 2: Fallback to window.Clerk.user approach
        if (!token && (window as any).Clerk?.user) {
          try {
            // Get the active session from the user object
            const sessions = (window as any).Clerk.user.sessions;
            const activeSession = sessions?.find((s: any) => s.status === "active");
            
            if (activeSession) {
              token = await activeSession.getToken({
                template: "hasura",
              });
              if (token) {
                console.log("✅ JWT token retrieved via active session fallback");
              }
            }
          } catch (error) {
            console.warn("⚠️ Failed to get token via active session:", error);
          }
        }

        // Method 3: Try global Clerk.__unstable__environment approach (last resort)
        if (!token && (window as any).Clerk?.__unstable__environment) {
          try {
            const clerkInstance = (window as any).Clerk;
            await clerkInstance.load();
            
            if (clerkInstance.session) {
              token = await clerkInstance.session.getToken({
                template: "hasura",
              });
              if (token) {
                console.log("✅ JWT token retrieved via Clerk load fallback");
              }
            }
          } catch (error) {
            console.warn("⚠️ Failed to get token via Clerk load:", error);
          }
        }

        // If we have a token, attach it
        if (token) {
          return {
            headers: {
              ...headers,
              authorization: `Bearer ${token}`,
            },
          };
        } else {
          // Enhanced debugging when no token is available
          console.warn("⚠️ No JWT token available for GraphQL request", {
            hasClerk: !!(window as any).Clerk,
            hasSession: !!(window as any).Clerk?.session,
            hasUser: !!(window as any).Clerk?.user,
            clerkLoaded: (window as any).Clerk?.loaded,
            sessionStatus: (window as any).Clerk?.session?.status,
          });
        }
      }

      return { headers };
    } catch (error) {
      console.error("❌ Failed to get auth token:", error);
      return { headers };
    }
  });
}
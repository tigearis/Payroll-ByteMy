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

      // Server context: Pass through headers provided by API routes
      // API routes will provide the authorization header via context
      if (options.context === "server" && typeof window === "undefined") {
        // Server context relies on headers being passed from API routes
        // Don't try to call auth() here as it may not work in all contexts
        return {
          headers: {
            ...headers,
            // Headers will be provided by the API route via context
          },
        };
      }

      // Client context uses enhanced Clerk JWT token retrieval
      if (typeof window !== "undefined") {
        let token = null;

        // Method 1: Try direct Clerk session access (most common)
        if ((window as any).Clerk?.session) {
          try {
            token = await (window as any).Clerk.session.getToken({
              template: "hasura",
              leewayInSeconds: 60, // Request token refresh 60 seconds before expiry
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
                leewayInSeconds: 60, // Request token refresh 60 seconds before expiry
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
                leewayInSeconds: 60, // Request token refresh 60 seconds before expiry
              });
              if (token) {
                console.log("✅ JWT token retrieved via Clerk load fallback");
              }
            }
          } catch (error) {
            console.warn("⚠️ Failed to get token via Clerk load:", error);
          }
        }

        // If we have a token, attach it directly (Hasura handles JWT arrays natively)
        if (token) {
          console.log("✅ JWT token retrieved, using native arrays for Hasura");
          
          // Parse the token to get the highest available role
          let hasuraRole = undefined;
          try {
            const base64Payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(base64Payload));
            const hasuraClaims = decodedPayload['https://hasura.io/jwt/claims'];
            
            if (hasuraClaims?.['x-hasura-allowed-roles']) {
              const allowedRoles = hasuraClaims['x-hasura-allowed-roles'];
              // Role hierarchy: developer > org_admin > manager > consultant > viewer
              const roleHierarchy = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
              
              // Find the highest role the user has
              for (const role of roleHierarchy) {
                if (allowedRoles.includes(role)) {
                  hasuraRole = role;
                  break;
                }
              }
              
              if (hasuraRole) {
                console.log(`🔑 Using highest available role: ${hasuraRole}`);
              }
            }
          } catch (error) {
            console.warn('⚠️ Failed to parse JWT for role selection:', error);
          }
          
          const authHeaders: Record<string, string> = {
            ...headers,
            authorization: `Bearer ${token}`,
          };
          
          // Add x-hasura-role header if we found a higher role than default
          if (hasuraRole) {
            authHeaders['x-hasura-role'] = hasuraRole;
          }
          
          return { headers: authHeaders };
        } else {
          // Only warn about missing tokens if Clerk is loaded and we should have a user
          const clerk = (window as any).Clerk;
          if (clerk?.loaded && clerk?.user) {
            console.warn("⚠️ No JWT token available for authenticated user", {
              hasClerk: !!clerk,
              hasSession: !!clerk?.session,
              hasUser: !!clerk?.user,
              clerkLoaded: clerk?.loaded,
              sessionStatus: clerk?.session?.status,
            });
          }
          // Skip logging for unauthenticated users to reduce noise
        }
      }

      return { headers };
    } catch (error) {
      console.error("❌ Failed to get auth token:", error);
      return { headers };
    }
  });
}
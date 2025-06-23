/**
 * Unified Apollo Client Factory
 * 
 * Hybrid Authentication Strategy:
 * - Client Context: Clerk JWT tokens with "hasura" template for user operations
 * - Server Context: Clerk JWT tokens when available for server-side rendering
 * - Admin Context: Hasura admin secret for service operations (webhooks, cron, admin functions)
 * 
 * This approach leverages Clerk's strengths for user authentication while using
 * Hasura's admin secret for reliable service operations that need unrestricted access.
 * 
 * @future-enhancement Potential improvements:
 * - Add connection pooling for high-traffic scenarios
 * - Implement request batching for multiple GraphQL operations
 * - Add metrics collection for monitoring Apollo performance
 * - Consider Redis caching for frequently accessed data
 * - Add automatic retry with exponential backoff for failed requests
 * - Implement subscription reconnection strategies for real-time features
 */

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
  split,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

// Import comprehensive error handling from consolidated utility
import {
  handleGraphQLError,
  isPermissionError,
  isAuthError,
  getSimpleErrorMessage,
  type GraphQLErrorDetails,
} from "@/lib/utils/handle-graphql-error";

// Re-export for backward compatibility
export {
  isPermissionError,
  isAuthError,
  getSimpleErrorMessage,
  type GraphQLErrorDetails,
};

// Export cache utilities
export { 
  CacheInvalidationManager, 
  OptimisticUpdateManager, 
  useCacheInvalidation, 
  createCacheUtils 
} from "./cache-utils";

// Client configuration options
export interface UnifiedClientOptions {
  context: "client" | "server" | "admin";
  enableWebSocket?: boolean;
  enableRetry?: boolean;
  enableAuditLogging?: boolean;
  enableSecurity?: boolean;
  securityLevel?: "standard" | "enterprise";
  fetchPolicy?: WatchQueryFetchPolicy;
}

// Security classifications for enterprise mode
export enum SecurityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

// Operation security metadata for enterprise clients
interface OperationSecurityMetadata {
  securityLevel: SecurityLevel;
  requiredRole?: string;
  audit: boolean;
  mfa?: boolean;
  rateLimit?: string;
}

// Default security map for operations (enterprise mode)
const DEFAULT_SECURITY_MAP: Record<string, OperationSecurityMetadata> = {
  GetPublicUsers: {
    securityLevel: SecurityLevel.LOW,
    requiredRole: "viewer",
    audit: false,
  },
  GetUserById: {
    securityLevel: SecurityLevel.HIGH,
    requiredRole: "consultant",
    audit: true,
  },
  GetAllUsersAdmin: {
    securityLevel: SecurityLevel.CRITICAL,
    requiredRole: "developer",
    audit: true,
    mfa: true,
  },
  DeleteUserComplete: {
    securityLevel: SecurityLevel.CRITICAL,
    requiredRole: "developer",
    audit: true,
    mfa: true,
  },
};

/**
 * Create optimized cache configuration with enhanced type policies
 */
function createUnifiedCache(): InMemoryCache {
  return new InMemoryCache({
    // Optimize cache size and performance
    resultCaching: true,
    possibleTypes: {
      // Define possible types for better cache normalization
    },
    typePolicies: {
      Query: {
        fields: {
          // Users pagination and caching
          users: {
            keyArgs: ["where", "order_by"],
            merge(existing = [], incoming, { args }) {
              const offset = args?.offset || 0;
              const merged = existing ? existing.slice() : [];
              
              // Handle pagination
              if (offset === 0) {
                return incoming;
              }
              
              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
          
          // Clients with optimized caching
          clients: {
            keyArgs: ["where", "order_by"],
            merge(existing = [], incoming, { args }) {
              const offset = args?.offset || 0;
              
              if (offset === 0) {
                return incoming;
              }
              
              const merged = existing ? existing.slice() : [];
              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
          
          // Payrolls with relationship handling
          payrolls: {
            keyArgs: ["where", "order_by"],
            merge(existing = [], incoming, { args }) {
              // Handle real-time updates and pagination
              const offset = args?.offset || 0;
              
              if (offset === 0) {
                return incoming;
              }
              
              const merged = existing ? existing.slice() : [];
              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
          
          // Payroll dates for calendar views
          payrollDates: {
            keyArgs: ["where", "order_by"],
            merge: (existing, incoming) => {
              // Always return fresh data for calendar accuracy
              return incoming;
            },
          },
          
          // Notes with chronological ordering
          notes: {
            keyArgs: ["where", "order_by"],
            merge(existing = [], incoming) {
              // Merge notes chronologically
              const existingIds = new Set(existing.map((note: any) => note.id));
              const newNotes = incoming.filter((note: any) => !existingIds.has(note.id));
              
              return [...existing, ...newNotes].sort((a: any, b: any) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            },
          },
          
          // Audit logs (append-only)
          auditLogs: {
            keyArgs: ["where", "order_by"],
            merge(existing = [], incoming, { args }) {
              const offset = args?.offset || 0;
              
              if (offset === 0) {
                return incoming;
              }
              
              return [...existing, ...incoming];
            },
          },
        },
      },
      
      // Enhanced entity type policies
      users: { 
        keyFields: ["id"],
        fields: {
          // Cache user roles and permissions
          userRoles: {
            merge: (existing, incoming) => incoming,
          },
          // Manager relationships
          teamMembers: {
            merge: (existing, incoming) => incoming,
          },
          // Work schedules
          workSchedules: {
            merge: (existing, incoming) => incoming,
          },
        },
      },
      
      clients: {
        keyFields: ["id"],
        fields: {
          // Client payrolls relationship
          payrolls: {
            keyArgs: ["where", "order_by"],
            merge: (existing, incoming) => incoming,
          },
          // Client notes
          notes: {
            merge(existing = [], incoming) {
              return incoming.sort((a: any, b: any) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            },
          },
        },
      },
      
      payrolls: {
        keyFields: ["id"],
        fields: {
          // Payroll dates with temporal ordering
          payrollDates: {
            merge(existing, incoming) {
              return incoming?.sort((a: any, b: any) => 
                new Date(a.adjustedEftDate).getTime() - new Date(b.adjustedEftDate).getTime()
              ) || existing;
            },
          },
          // Version history
          childPayrolls: {
            merge(existing, incoming) {
              return incoming?.sort((a: any, b: any) => b.versionNumber - a.versionNumber) || existing;
            },
          },
          // Notes chronological
          notes: {
            merge(existing = [], incoming) {
              return incoming.sort((a: any, b: any) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            },
          },
        },
      },
      
      // Audit and compliance entities
      auditAuditLog: {
        keyFields: ["id"],
      },
      
      permissionAuditLog: {
        keyFields: ["id"],
      },
      
      // Reference data (cached longer)
      payrollCycles: {
        keyFields: ["id"],
      },
      
      payrollDateTypes: {
        keyFields: ["id"],
      },
      
      holidays: {
        keyFields: ["date", "countryCode"],
      },
      
      // Role and permission entities
      roles: {
        keyFields: ["id"],
        fields: {
          rolePermissions: {
            merge: (existing, incoming) => incoming,
          },
        },
      },
      
      permissions: {
        keyFields: ["id"],
      },
      
      resources: {
        keyFields: ["id"],
      },
    },
    
    // Custom data ID generation for better normalization
    dataIdFromObject: (object: any) => {
      // Handle different entity types
      switch (object.__typename) {
        case "users":
          return `users:${object.id}`;
        case "clients":
          return object.id ? `clients:${object.id}` : undefined;
        case "payrolls":
          return `payrolls:${object.id}`;
        case "payrollDates":
          return `payrollDates:${object.id}`;
        case "notes":
          return `notes:${object.id}`;
        case "auditAuditLog":
          return `auditAuditLog:${object.id}`;
        case "holidays":
          return `holidays:${object.date}:${object.countryCode}`;
        default:
          return object.id ? `${object.__typename}:${object.id}` : undefined;
      }
    },
  });
}

/**
 * Create HTTP link with proper headers
 */
function createUnifiedHttpLink(): ApolloLink {
  const uri = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  if (!uri) {
    throw new Error("NEXT_PUBLIC_HASURA_GRAPHQL_URL is not defined");
  }

  return createHttpLink({
    uri,
    credentials: "include",
  });
}

/**
 * Authentication link with hybrid strategy:
 * - Client context: Clerk JWT tokens
 * - Server context: Clerk JWT tokens when available
 * - Admin context: Hasura admin secret for service operations
 */
function createAuthLink(options: UnifiedClientOptions): ApolloLink {
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

/**
 * Enhanced error handling using comprehensive error handler
 */
function createErrorLink(options: UnifiedClientOptions): ApolloLink {
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

// Removed complex audit logging - using simplified approach

/**
 * Enhanced WebSocket link with intelligent connection management
 */
function createWebSocketLink(
  options: UnifiedClientOptions
): GraphQLWsLink | null {
  if (!options.enableWebSocket || typeof window === "undefined") {
    return null;
  }

  const wsUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.replace(
    "http",
    "ws"
  );
  if (!wsUrl) {
    console.warn("WebSocket URL not available");
    return null;
  }

  // Enhanced connection management
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;
  let isIntentionalClose = false;

  return new GraphQLWsLink(
    createClient({
      url: wsUrl,
      connectionParams: async () => {
        try {
          if ((window as any).Clerk?.session) {
            const token = await (window as any).Clerk.session.getToken({
              template: "hasura",
            });
            return {
              headers: {
                ...(token && { authorization: `Bearer ${token}` }),
              },
            };
          }
          return {};
        } catch (error) {
          console.error("WebSocket auth error:", error);
          return {};
        }
      },
      
      // Optimized retry strategy
      retryAttempts: maxReconnectAttempts,
      shouldRetry: (error) => {
        if (isIntentionalClose) return false;
        
        reconnectAttempts++;
        const shouldRetry = reconnectAttempts <= maxReconnectAttempts;
        
        if (shouldRetry) {
          console.warn(
            `WebSocket reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}:`,
            error
          );
        } else {
          console.error("WebSocket max reconnection attempts reached");
        }
        
        return shouldRetry;
      },
      
      // Connection timeouts
      connectionAckWaitTimeout: 15000, // Increased for reliability
      keepAlive: 30000, // Keep connection alive
      
      // Enhanced event handling
      on: {
        connected: () => {
          console.log("🔗 WebSocket connected to Hasura");
          reconnectAttempts = 0; // Reset counter on successful connection
        },
        
        error: (error) => {
          console.error("❌ WebSocket error:", error);
        },
        
        closed: (event) => {
          if (!isIntentionalClose) {
            console.warn("🔌 WebSocket connection closed unexpectedly:", event);
          } else {
            console.log("🔌 WebSocket connection closed intentionally");
          }
        },
        
        connecting: () => {
          console.log("🔄 WebSocket connecting...");
        },
        
        opened: () => {
          console.log("✅ WebSocket opened");
        },
        
        ping: (received, payload) => {
          // Log ping/pong for debugging if needed
          if (process.env.NODE_ENV === "development") {
            console.debug("📡 WebSocket ping received:", { received, payload });
          }
        },
        
        pong: (received, payload) => {
          if (process.env.NODE_ENV === "development") {
            console.debug("📡 WebSocket pong received:", { received, payload });
          }
        },
      },
      
      // Lazy connection - only connect when subscriptions are active
      lazy: true,
    })
  );
}

/**
 * Create retry link for resilient operations
 */
function createRetryLink(options: UnifiedClientOptions): ApolloLink {
  if (!options.enableRetry) {
    return new ApolloLink((operation, forward) => forward(operation));
  }

  return new RetryLink({
    delay: {
      initial: 300,
      max: 10000,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: error => {
        // Don't retry auth errors - they need token refresh instead
        if (
          error.graphQLErrors?.some(
            (err: any) =>
              err.extensions?.code === "invalid-jwt" ||
              err.extensions?.code === "access-denied"
          )
        ) {
          return false;
        }

        // Don't retry client-side errors
        if (
          error.graphQLErrors?.some(
            (err: any) => err.extensions?.code === "BAD_USER_INPUT"
          )
        ) {
          return false;
        }

        // Retry network errors and server errors
        return !!error.networkError || !!error.graphQLErrors;
      },
    },
  });
}

/**
 * Simplified Apollo client factory using native Clerk features
 */
export function createUnifiedApolloClient(
  options: UnifiedClientOptions = { context: "client" }
): ApolloClient<any> {
  const config = {
    enableWebSocket: false,
    enableRetry: true,
    ...options,
  };

  const cache = createUnifiedCache();
  const httpLink = createUnifiedHttpLink();
  const errorLink = createErrorLink(config);
  const authLink = createAuthLink(config);
  const retryLink = createRetryLink(config);
  const wsLink = createWebSocketLink(config);

  // Combine links
  let link: ApolloLink;

  if (wsLink && config.enableWebSocket) {
    link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      from([errorLink, retryLink, authLink, httpLink])
    );
  } else {
    link = from([errorLink, retryLink, authLink, httpLink]);
  }

  return new ApolloClient({
    link,
    cache,
    ssrMode: typeof window === "undefined",
    connectToDevTools: process.env.NODE_ENV === "development",
    defaultOptions: {
      query: { errorPolicy: "all" },
      watchQuery: { errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  });
}

// ================================
// PRE-CONFIGURED INSTANCES
// ================================

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

/**
 * Unified Apollo Client Factory
 * Consolidates all Apollo client functionality with proper Hasura JWT integration
 * Replaces: apollo-client.ts, client.ts, server-apollo-client.ts, secure-client.ts
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

// ================================
// ERROR HANDLING UTILITIES
// ================================

export interface GraphQLPermissionError {
  message: string;
  field?: string;
  table?: string;
  role?: string | undefined;
}

export function isPermissionError(error: any): boolean {
  if (!error?.message) {return false;}

  const message = error.message.toLowerCase();
  return (
    (message.includes("field") && message.includes("not found in type")) ||
    message.includes("insufficient permissions") ||
    message.includes("access denied") ||
    message.includes("forbidden")
  );
}

export function parsePermissionError(error: any): GraphQLPermissionError {
  const message = error.message || "";

  // Extract field name from "field 'field_name' not found in type: 'table_name'"
  const fieldMatch = message.match(
    /field '([^']+)' not found in type: '([^']+)'/
  );

  return {
    message,
    field: fieldMatch?.[1],
    table: fieldMatch?.[2],
    role: undefined,
  };
}

export function getPermissionErrorMessage(
  error: GraphQLPermissionError
): string {
  if (error.field && error.table) {
    return `You don't have permission to access the '${error.field}' field on ${error.table}. Contact your administrator to request access.`;
  }

  if (error.message.includes("insufficient permissions")) {
    return "You don't have sufficient permissions to perform this action. Contact your administrator for access.";
  }

  return "Access denied. You may not have the required permissions for this resource.";
}

export function handlePermissionError(
  error: GraphQLPermissionError,
  context?: string
): void {
  console.warn(`🔒 Permission Error${context ? ` in ${context}` : ""}:`, {
    field: error.field,
    table: error.table,
    originalMessage: error.message,
  });

  // Note: Toast functionality would need to be imported from a toast library
  // This is a simplified version - in a real app you'd want to show user notifications
}

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
 * Create cache configuration with proper type policies
 */
function createUnifiedCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            merge: (_, incoming) => incoming,
            keyArgs: ["where", "order_by"],
          },
          clients: {
            merge: (_, incoming) => incoming,
            keyArgs: ["where", "order_by"],
          },
          payrolls: {
            merge: (_, incoming) => incoming,
            keyArgs: ["where", "order_by"],
          },
        },
      },
      User: { keyFields: ["id"] },
      Client: {
        keyFields: (object: any) => {
          if (object.id) {return ["id"];}
          if (object.name) {return ["name"];}
          return false;
        },
      },
      Payroll: {
        keyFields: ["id"],
        fields: {
          payroll_dates: { merge: (_, incoming) => incoming },
        },
      },
      staff: { keyFields: ["id"] },
      holidays: { keyFields: ["date", "country_code"] },
    },
    dataIdFromObject: (object: any) => {
      if (object.__typename === "clients") {
        if (object.id) {return `clients:${object.id}`;}
        if (object.name) {return `clients:name:${object.name}`;}
        return undefined;
      }
      return object.id ? `${object.__typename}:${object.id}` : undefined;
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
 * Simplified authentication link using native Clerk features
 */
function createAuthLink(options: UnifiedClientOptions): ApolloLink {
  return setContext(async (_, { headers }) => {
    try {
      // Admin context uses service account token
      if (options.context === "admin" && typeof window === "undefined") {
        const serviceToken = process.env.HASURA_SERVICE_ACCOUNT_TOKEN;
        if (serviceToken) {
          return {
            headers: {
              ...headers,
              authorization: `Bearer ${serviceToken}`,
            },
          };
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
 * Simplified error handling with native Clerk token refresh
 */
function createErrorLink(options: UnifiedClientOptions): ApolloLink {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, extensions }) => {
        console.error("[GraphQL error]:", message);

        // Handle JWT errors with automatic token refresh
        const isJWTError =
          extensions?.code === "invalid-jwt" ||
          message.includes("JWTExpired") ||
          message.includes("JWT token is expired");

        if (
          isJWTError &&
          options.context === "client" &&
          typeof window !== "undefined"
        ) {
          // Clerk handles token refresh automatically, just retry the operation
          return forward(operation);
        }
      });
    }

    if (networkError) {
      console.error("[Network error]:", networkError);
    }
  });
}

// Removed complex audit logging - using simplified approach

/**
 * Create WebSocket link for subscriptions (client-side only)
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
      retryAttempts: 5,
      shouldRetry: (error) => {
        console.warn(
          "WebSocket connection error, attempting to reconnect:",
          error
        );
        return true;
      },
      connectionAckWaitTimeout: 10000,
      on: {
        connected: () => console.log("WebSocket connected"),
        error: (error) => console.error("WebSocket error:", error),
        closed: () => console.log("WebSocket connection closed"),
      },
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
      retryIf: (error) => {
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
 * Admin Apollo client with service account access
 * Used for system operations requiring elevated privileges
 */
export const adminApolloClient = createUnifiedApolloClient({
  context: "admin",
  enableRetry: true,
});

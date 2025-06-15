// lib/apollo-client.ts - Enhanced GraphQL client with Clerk JWT
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
  Observable,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createApolloErrorHandler } from "./apollo-error-handler";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// ================================
// TOKEN CACHE
// ================================

interface TokenCache {
  token: string | null;
  expiresAt: number;
}

let tokenCache: TokenCache = {
  token: null,
  expiresAt: 0,
};

// Helper to get JWT token with caching
async function getAuthToken(): Promise<string | null> {
  // Check if we have a valid cached token
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  // Try client-side Clerk token first (fallback approach)
  if (typeof window !== "undefined") {
    try {
      // @ts-ignore - Clerk global is available on the client
      const clerk = window.Clerk;
      if (clerk?.session) {
        console.log("🔍 Trying direct Clerk token");
        const token = await clerk.session.getToken({ template: "hasura" });
        if (token) {
          console.log("🔍 Got token directly from Clerk");
          // Cache for 30 minutes (tokens typically last 1 hour)
          tokenCache = {
            token,
            expiresAt: Date.now() + 30 * 60 * 1000,
          };
          return token;
        }
      }
    } catch (clerkError) {
      console.warn("Failed to get token from Clerk directly:", clerkError);
    }
  }

  try {
    console.log("🔍 Apollo client requesting auth token from /api/auth/token");
    const response = await fetch("/api/auth/token", {
      credentials: "include",
    });
    console.log("🔍 Token response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("🔍 Token response data:", {
        hasToken: !!data.token,
        expiresIn: data.expiresIn,
      });

      const { token, expiresIn = 3600 } = data;

      // Cache the token (expires 5 minutes before actual expiry for safety)
      tokenCache = {
        token,
        expiresAt: Date.now() + (expiresIn - 300) * 1000,
      };

      return token;
    } else {
      const errorText = await response.text();
      console.warn(
        "Failed to get auth token, status:",
        response.status,
        "response:",
        errorText
      );
      tokenCache = { token: null, expiresAt: 0 };
      return null;
    }
  } catch (error) {
    console.warn("Failed to get auth token:", error);
    tokenCache = { token: null, expiresAt: 0 };
    return null;
  }
}

// Helper to get database user ID from Hasura claims
async function getDatabaseUserId(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null; // Server-side, skip this
  }

  try {
    console.log("🔍 Getting database user ID from hasura claims");
    const response = await fetch("/api/auth/hasura-claims", {
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      const databaseUserId = data.claims?.["x-hasura-user-id"];
      console.log(
        "🔍 Database user ID:",
        databaseUserId ? databaseUserId.substring(0, 8) + "..." : "none"
      );
      return databaseUserId || null;
    } else {
      console.warn("Failed to get database user ID:", response.status);
      return null;
    }
  } catch (error) {
    console.warn("Error getting database user ID:", error);
    return null;
  }
}

// ================================
// CACHE CONFIG
// ================================

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        users: {
          merge(_, incoming) {
            return incoming;
          },
          // Add pagination support if needed
          keyArgs: ["where", "order_by"],
        },
        clients: {
          merge(_, incoming) {
            return incoming;
          },
          keyArgs: ["where", "order_by"],
        },
        payrolls: {
          merge(_, incoming) {
            return incoming;
          },
          keyArgs: ["where", "order_by"],
        },
        // Add more type policies as needed
      },
    },
    User: {
      keyFields: ["id"],
    },
    Client: {
      keyFields: ["id"],
    },
    Payroll: {
      keyFields: ["id"],
    },
  },
});

// ================================
// HTTP LINK
// ================================

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
  // Add credentials if needed for CORS
  credentials: "same-origin",
});

// ================================
// AUTH LINK - Clerk JWT with caching
// ================================

const authLink = setContext(async (_, { headers }) => {
  // Only add auth header on client-side
  if (typeof window !== "undefined") {
    const token = await getAuthToken();

    // Only log if token status changes or in development
    if (process.env.NODE_ENV === "development" && !token) {
      console.warn("🚨 Apollo authLink - No token available, request may fail");
    }

    return {
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    };
  }

  return { headers };
});

// TypeScript helper to convert from Observable
function fromPromise<T>(promise: Promise<Observable<T>>): Observable<T> {
  return new Observable<T>((observer) => {
    promise
      .then((observable) => {
        observable.subscribe(observer);
      })
      .catch((err) => observer.error(err));
  });
}

// ================================
// ERROR LINK - Enhanced error handling
// ================================

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    // Use our enhanced error handler
    const handler = createApolloErrorHandler();
    handler({ graphQLErrors, networkError, operation, forward });

    // Handle specific auth errors for token refresh
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // Check for auth errors that need token refresh
        if (
          err.extensions?.code === "invalid-jwt" ||
          err.extensions?.code === "access-denied" ||
          err.message.includes("JWTExpired") ||
          err.message.includes("Could not verify JWT")
        ) {
          console.log("🔄 Detected JWT expiry, clearing cache and retrying");
          // Clear token cache
          tokenCache = { token: null, expiresAt: 0 };

          // Create a new observable for the retry
          return new Observable((observer) => {
            // Get a fresh token
            getAuthToken()
              .then((token) => {
                if (!token) {
                  console.error("Failed to refresh token - no token returned");
                  observer.error(new Error("Failed to refresh token"));
                  return;
                }

                // Update the operation context with the new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${token}`,
                  },
                });

                // Forward the operation with the new token
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: (error) => {
                    console.error("Error after token refresh:", error);
                    observer.error(error);
                  },
                  complete: observer.complete.bind(observer),
                });
              })
              .catch((error) => {
                console.error("Failed to refresh token:", error);
                observer.error(error);
              });
          });
        }
      }
    }

    if (networkError) {
      // Handle network errors
      if ("statusCode" in networkError) {
        if (networkError.statusCode === 401) {
          // Clear token cache on 401
          tokenCache = { token: null, expiresAt: 0 };
          console.log("🔄 Cleared token cache due to 401 error");
        }
        console.error(
          `Network error (${networkError.statusCode}):`,
          networkError
        );
      } else {
        console.error("Network error:", networkError);
      }
    }
  }
);

// ================================
// RETRY LINK - Retry failed requests
// ================================

// Create a simple retry link since RetryLink might not be available
const createRetryLink = () => {
  return new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      let attempt = 0;
      const maxAttempts = 3;

      const tryRequest = () => {
        forward(operation).subscribe({
          next: (result) => {
            observer.next(result);
          },
          error: (err) => {
            attempt++;
            if (attempt < maxAttempts && shouldRetry(err)) {
              setTimeout(() => tryRequest(), Math.pow(2, attempt) * 1000);
            } else {
              observer.error(err);
            }
          },
          complete: () => {
            observer.complete();
          },
        });
      };

      tryRequest();
    });
  });
};

const shouldRetry = (error: any): boolean => {
  return !!(
    (
      error &&
      (!error.statusCode || error.statusCode >= 500 || error.statusCode === 429)
    ) // Rate limited
  );
};

// ================================
// WEBSOCKET LINK - For subscriptions
// ================================

// Only create WebSocket link on the client side
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url:
            process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.replace("http", "ws") ||
            "",
          connectionParams: async () => {
            const token = await getAuthToken();
            return {
              headers: {
                ...(token && { authorization: `Bearer ${token}` }),
              },
            };
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
      )
    : null;

// Split link based on operation type
const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        from([errorLink, createRetryLink(), authLink, httpLink])
      )
    : from([errorLink, createRetryLink(), authLink, httpLink]);

// ================================
// APOLLO CLIENT
// ================================

const client = new ApolloClient({
  link: splitLink,
  cache,
  connectToDevTools: process.env.NODE_ENV === "development",
  defaultOptions: {
    query: {
      fetchPolicy: "network-only", // Always fetch fresh data for security
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true, // Important for polling
    },
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true, // Important for polling
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

// Helper function for SSR/SSG
export async function getServerSideApolloClient(token?: string) {
  return new ApolloClient({
    ssrMode: true,
    link: from([
      setContext((_, { headers }) => ({
        headers: {
          ...headers,
          ...(token && { authorization: `Bearer ${token}` }),
        },
      })),
      httpLink,
    ]),
    cache: new InMemoryCache(),
  });
}

// Utility to clear auth state
export function clearAuthCache() {
  tokenCache = { token: null, expiresAt: 0 };
  // Optionally clear Apollo cache
  client.clearStore();
}

// Helper to handle GraphQL errors
export function isAuthError(error: any): boolean {
  if (error?.graphQLErrors) {
    return error.graphQLErrors.some(
      (err: any) =>
        err.extensions?.code === "invalid-jwt" ||
        err.extensions?.code === "access-denied" ||
        err.message.includes("JWTExpired")
    );
  }
  return false;
}

export { client };
export default client;

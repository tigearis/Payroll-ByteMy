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
import { centralizedTokenManager } from "./auth/centralized-token-manager";
// Custom event for session expiry
export const SESSION_EXPIRED_EVENT = "jwt_session_expired";

// Token cache and management state
let tokenCache: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

// Helper to get JWT token 
async function getAuthToken(): Promise<string | null> {
  // For client-side, we'll use a simpler token management approach
  // since the centralized token manager now requires auth context
  if (typeof window === "undefined") {
    return null; // Server-side, tokens should be handled via API routes
  }

  // Check if we already have a token fetch in progress
  if (tokenPromise) {
    return tokenPromise;
  }

  // Start token fetch
  tokenPromise = fetchToken();
  
  try {
    const token = await tokenPromise;
    tokenCache = token;
    return token;
  } finally {
    tokenPromise = null;
  }
}

// Actual token fetching logic
async function fetchToken(): Promise<string | null> {
  try {
    // Use the global Clerk instance if available
    if (typeof window !== "undefined" && window.Clerk?.session) {
      return await window.Clerk.session.getToken({ template: "hasura" });
    }
    
    // Fallback: fetch from API endpoint
    const response = await fetch("/api/auth/token", {
      credentials: "include",
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.token || null;
    }
    
    return null;
  } catch (error) {
    console.error("❌ Failed to fetch auth token:", error);
    return null;
  }
}

// Helper to get database user ID from Hasura claims
async function getDatabaseUserId(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null; // Server-side, skip this
  }

  try {
    const response = await fetch("/api/auth/hasura-claims", {
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      const databaseUserId = data.claims?.["x-hasura-user-id"];
      return databaseUserId || null;
    } else {
      return null;
    }
  } catch (error) {
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

    // Handle specific auth errors for token refresh (be more selective)
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        // Only handle specific JWT expiry errors, not all access-denied errors
        const isJWTExpired = 
          err.extensions?.code === "invalid-jwt" ||
          err.message.includes("JWTExpired") ||
          err.message.includes("Could not verify JWT") ||
          err.message.includes("JWT token is expired") ||
          (err.extensions?.code === "access-denied" && 
           err.message.includes("JWT"));
        
        if (isJWTExpired) {
          console.log("🔄 Detected JWT expiry, clearing cache and retrying", {
            operation: operation.operationName,
            error: err.message,
            code: err.extensions?.code,
          });

          // Dispatch custom event for session expiry handler
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent(SESSION_EXPIRED_EVENT, {
                detail: { error: err, operation: operation.operationName },
              })
            );
          }

          // Clear token cache
          console.log("🧹 Clearing token cache in error handler");
          const currentUserId = (window as any).Clerk?.user?.id;
          if (currentUserId) {
            centralizedTokenManager.clearUserToken(currentUserId);
          }

          // Force token refresh using centralized token manager
          return new Observable((observer) => {
            const getTokenFn = () => window.Clerk?.session?.getToken({ template: "hasura" }) || Promise.resolve(null);
            const userId = (window as any).Clerk?.user?.id;
            if (!userId) {
              observer.error(new Error("No user ID available for token refresh"));
              return;
            }
            centralizedTokenManager.forceRefresh(getTokenFn, userId).then(async (token: string | null) => {
              if (!token) {
                observer.error(new Error("Failed to refresh token"));
                return;
              }
              
              try {
                // Update the operation context with the new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${token}`,
                  },
                });

                console.log(
                  "🔄 Retrying operation with fresh token:",
                  operation.operationName
                );

                // Forward the operation with the new token
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: (error) => {
                    console.error("❌ Error after token refresh:", error);
                    observer.error(error);
                  },
                  complete: () => {
                    console.log(
                      "✅ Operation completed successfully after refresh:",
                      operation.operationName
                    );
                    observer.complete();
                  },
                });
              } catch (error: any) {
                console.error("❌ Failed to retry operation:", error);
                observer.error(error);
              }
            }).catch((error: any) => {
              console.error("❌ Token refresh failed:", error);
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
          const currentUserId = (window as any).Clerk?.user?.id;
          if (currentUserId) {
            centralizedTokenManager.clearUserToken(currentUserId);
          }
          console.log("🔄 Cleared token cache due to 401 error");

          // Dispatch custom event for session expiry handler
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent(SESSION_EXPIRED_EVENT, {
                detail: {
                  error: networkError,
                  statusCode: networkError.statusCode,
                },
              })
            );
          }
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
  // Don't retry auth errors - they need token refresh instead
  if (isAuthError(error)) {
    return false;
  }

  // Retry on network errors
  if (error.networkError) {
    return true;
  }

  // Don't retry on client-side errors
  if (
    error.graphQLErrors?.some(
      (err: any) => err.extensions?.code === "BAD_USER_INPUT"
    )
  ) {
    return false;
  }

  // Retry on server errors
  return true;
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

// Exported function to clear the Apollo token cache
export function clearAuthCache() {
  console.log("🧹 Clearing Apollo token cache");
  tokenCache = null;
  tokenPromise = null;
}

// Helper to handle GraphQL errors
export function isAuthError(error: any): boolean {
  if (error?.graphQLErrors) {
    return error.graphQLErrors.some(
      (err: any) =>
        err.extensions?.code === "invalid-jwt" ||
        err.extensions?.code === "access-denied" ||
        err.message.includes("JWTExpired") ||
        err.message.includes("Could not verify JWT")
    );
  }
  return false;
}

export { client };
export default client;

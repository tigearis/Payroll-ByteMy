// lib/apollo-client.ts - Enhanced GraphQL client with Clerk JWT
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createApolloErrorHandler } from "./apollo-error-handler";

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

  try {
    const response = await fetch("/api/auth/token");
    if (response.ok) {
      const { token, expiresIn = 3600 } = await response.json();

      // Cache the token (expires 1 minute before actual expiry for safety)
      tokenCache = {
        token,
        expiresAt: Date.now() + (expiresIn - 60) * 1000,
      };

      return token;
    } else {
      console.warn("Failed to get auth token, status:", response.status);
      tokenCache = { token: null, expiresAt: 0 };
      return null;
    }
  } catch (error) {
    console.warn("Failed to get auth token:", error);
    tokenCache = { token: null, expiresAt: 0 };
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
          merge(existing = [], incoming) {
            return incoming;
          },
          // Add pagination support if needed
          keyArgs: ["where", "order_by"],
        },
        clients: {
          merge(existing = [], incoming) {
            return incoming;
          },
          keyArgs: ["where", "order_by"],
        },
        payrolls: {
          merge(existing = [], incoming) {
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
// ENHANCED ERROR LINK - Use our graceful error handler
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
          err.message.includes("JWTExpired")
        ) {
          // Clear token cache
          tokenCache = { token: null, expiresAt: 0 };

          // Retry the request with a fresh token
          return fromPromise(
            getAuthToken().then((token) => {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: token ? `Bearer ${token}` : "",
                },
              });
              return forward(operation);
            })
          );
        }
      }
    }

    if (networkError && "statusCode" in networkError) {
      if (networkError.statusCode === 401) {
        // Clear token cache on 401
        tokenCache = { token: null, expiresAt: 0 };
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
// APOLLO CLIENT
// ================================

const client = new ApolloClient({
  link: from([errorLink, createRetryLink(), authLink, httpLink]),
  cache,
  connectToDevTools: process.env.NODE_ENV === "development",
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
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

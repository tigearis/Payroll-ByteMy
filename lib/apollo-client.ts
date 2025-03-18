// lib/apollo-client.ts
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { auth } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";

// Cache configuration remains the same as before
const createCache = () => {
  return new InMemoryCache({
    typePolicies: {
      // Your existing cache configuration...
      payrolls: {
        keyFields: ["id"],
        fields: {
          payroll_dates: {
            merge(existing = [], incoming) {
              return incoming; 
            },
          },
        },
      },
      clients: {
        keyFields: ["id"],
      },
      staff: {
        keyFields: ["id"],
      },
      holidays: {
        keyFields: ["date", "country_code"],
      },
      users: {
        keyFields: ["id"],
      },
    },
  });
};

// Server-side Apollo Client
export const getServerApolloClient = async () => {
  const authInstance = await auth();
  const token = await authInstance.getToken({ template: "hasura" });

  const authMiddleware = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    credentials: "include",
  });

  const serverRetryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 10000,
      jitter: true,
    },
    attempts: {
      max: 3,
      retryIf: (error) => !!error
    }
  });

  const serverErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  // Create the link chain
  const link = ApolloLink.from([
    serverErrorLink,
    serverRetryLink,
    authMiddleware,
    httpLink
  ]);

  return new ApolloClient({
    link,
    cache: createCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  });
};

// Client-side Apollo Client with improved token management
let clientSideApolloClient: ApolloClient<any> | null = null;

export function useApolloClient() {
  const { getToken } = useAuth();

  // If we already have a client instance, return it
  if (clientSideApolloClient && typeof window !== 'undefined') {
    return clientSideApolloClient;
  }

  // Create a token refresh middleware that gets a fresh token for each request
  const authMiddleware = setContext(async (_, { headers }) => {
    try {
      // Always get a fresh token for each request
      const token = await getToken({ template: "hasura" });
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    } catch (error) {
      console.error("Failed to get authentication token:", error);
      return { headers };
    }
  });

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    credentials: "include",
  });

  const clientRetryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 10000,
      jitter: true,
    },
    attempts: {
      max: 5, // Increased number of retries for client side
      retryIf: (error) => {
        // Retry on any error, but log authentication issues
        if (error.message && (
            error.message.includes('JWT') || 
            error.message.includes('token') || 
            error.message.includes('authentication')
        )) {
          console.warn("Authentication error detected, retrying with fresh token");
        }
        return !!error;
      }
    }
  });

  const clientErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  // Create the link chain
  const link = ApolloLink.from([
    clientErrorLink,
    clientRetryLink,
    authMiddleware,
    httpLink
  ]);

  clientSideApolloClient = new ApolloClient({
    link,
    cache: createCache(),
    connectToDevTools: process.env.NODE_ENV !== 'production',
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      mutate: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  });

  return clientSideApolloClient;
}

// Admin Client (Bypasses Authentication)
export const adminApolloClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    }),
    new RetryLink({
      delay: {
        initial: 300,
        max: 10000,
        jitter: true,
      },
      attempts: {
        max: 3,
        retryIf: (error) => !!error
      }
    }),
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
      headers: {
        "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
      },
    })
  ]),
  cache: createCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});
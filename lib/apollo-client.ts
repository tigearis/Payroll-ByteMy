// lib/apollo-client.ts
import { ApolloClient, HttpLink, InMemoryCache, split, NormalizedCacheObject, ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { auth } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";

// Cache configuration with type policies for proper normalization
const createCache = () => {
  return new InMemoryCache({
    typePolicies: {
      // Define how to identify and merge entities in the cache
      payrolls: {
        keyFields: ["id"],
        fields: {
          // Custom merge function for payroll_dates array to ensure they're properly updated
          payroll_dates: {
            merge(existing = [], incoming) {
              return incoming; // For arrays, typically we want to replace with new data
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
        // For holidays, we'll use a compound key of date and country_code
        keyFields: ["date", "country_code"],
      },
      users: {
        keyFields: ["id"],
      },
    },
  });
};

// Error handling link to handle GraphQL errors and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Operation: ${operation.operationName}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
  
  // Continue the operation with the error included
  return forward(operation);
});

// Retry link to automatically retry failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300, // Initial delay in ms
    max: 10000,    // Maximum delay
    jitter: true,  // Add randomness to the delay
  },
  attempts: {
    max: 3,        // Max number of retries
    retryIf: (error, _operation) => !!error // Retry on any error
  }
});

// **Server-side Apollo Client**
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
    // Default fetch policy for server-side operations
    fetchOptions: {
      method: "POST",
    }
  });

  // Combine links for server-side (no WebSocket on server)
  const link = ApolloLink.from([
    errorLink,
    retryLink,
    authMiddleware,
    httpLink
  ]);

  return new ApolloClient({
    link,
    cache: createCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only', // Always fetch from network on server
        errorPolicy: 'all',
      },
    },
  });
};

// Create a singleton Apollo client for the client-side
let clientSideApolloClient: ApolloClient<NormalizedCacheObject> | null = null;

// **Client-side Apollo Client**
export function useApolloClient() {
  const { getToken } = useAuth();

  // If we already have a client instance, return it
  if (clientSideApolloClient && typeof window !== 'undefined') {
    return clientSideApolloClient;
  }

  const authMiddleware = setContext(async (_, { headers }) => {
    const token = await getToken({ template: "hasura" });
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    credentials: "include",
  });

  // Improved WebSocket link configuration for subscriptions
  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL || 
                 process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.replace('https://', 'wss://') || 
                 "wss://your-hasura-instance/v1/graphql",
            connectionParams: async () => {
              const token = await getToken({ template: "hasura" });
              return {
                headers: {
                  authorization: token ? `Bearer ${token}` : "",
                },
              };
            },
            lazy: true,           // Only connect when needed
            retryAttempts: 5,     // Number of reconnection attempts
            connectionAckWaitTimeout: 10000, // Wait 10s for connection acknowledgement
            retryWait: async (retries) => {
              // Exponential backoff for reconnection
              await new Promise(resolve => setTimeout(resolve, retries * 1000));
            },
            onNonLazyError: (error) => {
              console.error('WebSocket connection error:', error);
            },
          })
        )
      : null;

  // **Split Links Based on Operation Type**
  const splitLink =
    wsLink !== null
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          wsLink,
          ApolloLink.from([errorLink, retryLink, authMiddleware, httpLink])
        )
      : ApolloLink.from([errorLink, retryLink, authMiddleware, httpLink]);

  clientSideApolloClient = new ApolloClient({
    link: splitLink,
    cache: createCache(),
    connectToDevTools: process.env.NODE_ENV !== 'production',
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network', // Serves cached results first, then fetches from network
        nextFetchPolicy: 'cache-first',    // Use cache for subsequent renders
        errorPolicy: 'all',                // Continue with partial results on error
      },
      query: {
        fetchPolicy: 'cache-first',        // Cache first for queries
        errorPolicy: 'all',
      },
      mutate: {
        fetchPolicy: 'network-only',       // Always send mutations to the server
        errorPolicy: 'all',
      },
    },
  });

  return clientSideApolloClient;
}

// **Admin Client (Bypasses Authentication)**
export const adminApolloClient = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    retryLink,
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
      fetchPolicy: 'network-only', // Always get fresh data for admin operations
      errorPolicy: 'all',
    },
  },
});
/**
 * @deprecated This file is deprecated in favor of unified-client.ts
 * Please use the following imports instead:
 * - import { serverApolloClient } from '@/lib/apollo/unified-client';
 * - import { adminApolloClient } from '@/lib/apollo/unified-client';
 * - import { getServerToken } from '@/lib/apollo/unified-client';
 */

// lib/apollo/server-client.ts - Server-side Apollo Client (Handles Server Components)
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  FetchPolicy,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { auth } from "@clerk/nextjs/server";

// ================================
// CONFIGURATION
// ================================

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!;

if (!HASURA_GRAPHQL_URL) {
  throw new Error("NEXT_PUBLIC_HASURA_GRAPHQL_URL is not defined");
}

// ================================
// SHARED ERROR HANDLER
// ================================

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `🔴 [Server] GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`🔴 [Server] Network error: ${networkError}`);
  }
});

// ================================
// RETRY CONFIGURATION
// ================================

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors but not on GraphQL errors
      return !!error && !error.message.includes("GraphQL");
    },
  },
});

// ================================
// HTTP LINK FACTORY
// ================================

function createServerHttpLink() {
  return createHttpLink({
    uri: HASURA_GRAPHQL_URL,
    credentials: "include",
  });
}

// ================================
// AUTHENTICATION LINK FOR SERVER
// ================================

function createServerAuthLink() {
  return setContext(async (_, { headers }) => {
    try {
      const { getToken } = await auth();
      const token = await getToken({ template: "hasura" });

      return {
        headers: {
          ...headers,
          ...(token && { authorization: `Bearer ${token}` }),
        },
      };
    } catch (error) {
      console.error("Failed to get server auth token:", error);
      return { headers };
    }
  });
}

// ================================
// ADMIN AUTHENTICATION LINK
// ================================

function createAdminAuthLink() {
  return setContext(async (_, { headers }) => {
    const adminSecret = process.env.HASURA_SERVICE_ACCOUNT_TOKEN;

    return {
      headers: {
        ...headers,
        ...(adminSecret && { "x-hasura-admin-secret": adminSecret }),
      },
    };
  });
}

// ================================
// CACHE CONFIGURATION
// ================================

function createServerCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      users: {
        fields: {
          manager: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
      payrolls: {
        fields: {
          staff: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  });
}

// ================================
// SERVER APOLLO CLIENT FACTORY
// ================================

interface ServerClientConfig {
  useAdminSecret?: boolean;
  fetchPolicy?: FetchPolicy;
}

export function createServerApolloClient(config: ServerClientConfig = {}) {
  const { useAdminSecret = false, fetchPolicy = "no-cache" } = config;

  // Create HTTP link
  const httpLink = createServerHttpLink();

  // Create auth link based on configuration
  const authLink = useAdminSecret
    ? createAdminAuthLink()
    : createServerAuthLink();

  // Combine links
  const link = from([errorLink, retryLink, authLink, httpLink]);

  return new ApolloClient({
    link,
    cache: createServerCache(),
    ssrMode: true,
    defaultOptions: {
      query: {
        fetchPolicy,
        errorPolicy: "all",
      },
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
}

// ================================
// PRE-CONFIGURED INSTANCES
// ================================

// Admin client instance (uses service account token)
export const adminApolloClient = createServerApolloClient({
  useAdminSecret: true,
  fetchPolicy: "no-cache",
});

// Legacy compatibility export
export const getServerApolloClient = createServerApolloClient;

// ================================
// UTILITY FUNCTIONS
// ================================

export async function getServerToken(): Promise<string | null> {
  try {
    const { getToken } = await auth();
    return await getToken({ template: "hasura" });
  } catch (error) {
    console.error("Failed to get server token:", error);
    return null;
  }
}

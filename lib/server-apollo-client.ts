import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { auth } from "@clerk/nextjs/server";

// Cache configuration
const createCache = () => {
  return new InMemoryCache({
    typePolicies: {
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
        keyFields: (object: any) => {
          if (object.id) {return ["id"];}
          if (object.name) {return ["name"];}
          return false;
        },
        fields: {
          id: {
            merge: false,
          },
        },
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
    dataIdFromObject: (object: any) => {
      if (object.__typename === "clients") {
        if (object.id) {return `clients:${object.id}`;}
        if (object.name) {return `clients:name:${object.name}`;}
        return undefined;
      }
      return object.id ? `${object.__typename}:${object.id}` : undefined;
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
      retryIf: (error) => !!error,
    },
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

  const link = from([
    serverErrorLink,
    serverRetryLink,
    authMiddleware,
    httpLink,
  ]);

  return new ApolloClient({
    link,
    cache: createCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
    },
  });
};

// Admin Client (Bypasses Authentication)
export const adminApolloClient = new ApolloClient({
  link: from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.error(
            `[Admin GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        });
      }
      if (networkError) {
        console.error(`[Admin Network error]: ${networkError}`);
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
        retryIf: (error) => !!error,
      },
    }),
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
      headers: {
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET!,
      },
    }),
  ]),
  cache: createCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
});

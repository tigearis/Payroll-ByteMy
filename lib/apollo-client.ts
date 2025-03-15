// lib/apollo-client.ts
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { auth } from "@clerk/nextjs/server";
import { useAuth } from "@clerk/nextjs";

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
  });

  return new ApolloClient({
    link: authMiddleware.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

// **Client-side Apollo Client**
export function useApolloClient() {
  const { getToken } = useAuth();

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

  // **WebSocket Link for Subscriptions**
  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url:
              process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_URL ||
              "wss://your-hasura-instance/v1/graphql", // Fallback URL
            connectionParams: async () => {
              const token = await getToken({ template: "hasura" });
              return {
                headers: {
                  authorization: token ? `Bearer ${token}` : "",
                },
              };
            },
            lazy: true, // Enables reconnect behavior
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
          authMiddleware.concat(httpLink)
        )
      : authMiddleware.concat(httpLink);

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
}

// **Admin Client (Bypasses Authentication)**
export const adminApolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
    },
  }),
  cache: new InMemoryCache(),
});
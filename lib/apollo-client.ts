// lib/apollo-client.ts
import { ApolloClient, HttpLink, from, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { auth } from "@clerk/nextjs/server"
import { useAuth } from "@clerk/nextjs"

// Server-side Apollo client creation
export const getServerApolloClient = async () => {
  const authInstance = await auth()
  const token = await authInstance.getToken({ template: "hasura" })

  const authMiddleware = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }))

  return new ApolloClient({
    link: from([
      authMiddleware,
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
        credentials: "include",
      }),
    ]),
    cache: new InMemoryCache(),
  })
}

// Client-side Apollo client creation hook
export function useApolloClient() {
  const { getToken } = useAuth()
  
  const authMiddleware = setContext(async (_, { headers }) => {
    const token = await getToken({ template: "hasura" })
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }
  })

  return new ApolloClient({
    link: from([
      authMiddleware,
      new HttpLink({
        uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
        credentials: "include",
      }),
    ]),
    cache: new InMemoryCache(),
  })
}

// Admin client for bypassing authentication (use sparingly and securely)
export const adminApolloClient = new ApolloClient({
  link: from([
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
      headers: {
        "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET!,
      },
    }),
  ]),
  cache: new InMemoryCache(),
})
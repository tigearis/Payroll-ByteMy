// lib/apollo-server.ts
import { ApolloClient, HttpLink, from, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { auth } from "@clerk/nextjs/server"

export const getServerApolloClient = async () => {
  const authInstance = await auth() // ✅ FIX: Await `auth()` before accessing `getToken`
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
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
        credentials: "include",
      }),
    ]),
    cache: new InMemoryCache(),
  })
}
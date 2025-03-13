// app/lib/apollo-client.ts
import { ApolloClient, HttpLink, from, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { useAuth } from "@clerk/nextjs"

export const useApolloClient = () => {
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
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URI,
        credentials: "include",
      }),
    ]),
    cache: new InMemoryCache(),
  })
}

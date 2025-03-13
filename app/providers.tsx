import React, { useMemo } from "react"
import { ApolloProvider, ApolloClient, HttpLink, from, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { useAuth } from "@clerk/nextjs"

export const ApolloProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth()


  const apolloClient = useMemo(() => {
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
  }, [getToken]) 

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}

// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { auth } from '@clerk/nextjs/server'

// Create the HTTP link to Hasura
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
})

// Server-side Apollo client (for server components and API routes)
export async function getServerApolloClient() {
  const { getToken } = await auth()
  const token = await getToken({ template: "hasura" })
  
  const authLink = setContext((_, { headers }) => {
    // Add the JWT token to the Authorization header
    if (token) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }
    }
    return { headers }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: true,
  })
}

// Admin Apollo client (bypasses permissions)
export function getAdminApolloClient() {
  const adminLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
    },
  }))
  
  return new ApolloClient({
    link: adminLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: true,
  })
}
// lib/apollo-admin.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

// Create the HTTP link to Hasura
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
})

// Create an admin link with the admin secret
const adminLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  },
}))

// Create an admin Apollo client
export function getAdminClient() {
  return new ApolloClient({
    link: adminLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: true,
  })
}

// Pre-instantiated admin client (use with caution, server-side only)
export const adminClient = new ApolloClient({
  link: adminLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: true,
})
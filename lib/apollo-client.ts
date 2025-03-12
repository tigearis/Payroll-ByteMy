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

// Client-side Apollo client for browser components
export function createApolloClient() {
  const authLink = setContext(async (_, { headers }) => {
    // For client-side, we'll need to fetch the token from an API endpoint
    try {
      const response = await fetch('/api/auth/token');
      const data = await response.json();
      
      if (data.token) {
        return {
          headers: {
            ...headers,
            Authorization: `Bearer ${data.token}`,
          }
        };
      }
    } catch (error) {
      console.error('Error fetching auth token:', error);
    }
    
    return { headers };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
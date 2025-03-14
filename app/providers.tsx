'use client'

import { useEffect, useState } from 'react'
import { ApolloProvider, ApolloClient, HttpLink, from, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useAuth } from '@clerk/nextjs'

export const ApolloProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [apolloClient, setApolloClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);

  useEffect(() => {
    const initializeApolloClient = async () => {
      const token = await getToken({ template: 'hasura' });

      const authMiddleware = setContext((_, { headers }) => ({
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      }));

      const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
      });

      const client = new ApolloClient({
        link: from([authMiddleware, httpLink]),
        cache: new InMemoryCache(),
      });

      setApolloClient(client);
    };

    initializeApolloClient();
  }, [getToken]);

  if (!apolloClient) return null; // Prevent rendering until ApolloClient is initialized

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

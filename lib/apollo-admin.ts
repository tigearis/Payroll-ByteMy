// app/lib/apollo-admin.ts
import { ApolloClient, HttpLink, from, InMemoryCache } from "@apollo/client"

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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

SQL Dump

PGPASSWORD="npg_WavFRZ1lEx4U" pg_dump -s -U neondb_owner -h ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech neondb > schema.sql
PGPASSWORD="npg_WavFRZ1lEx4U" pg_dump -U neondb_owner -d neondb -h ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech -t table1,table2 -f dump.sql


Use gql directly in the route.ts

example for payrolls/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// ✅ Define Apollo Client (Replace with your actual GraphQL API URL)
const client = new ApolloClient({
  uri: "https://your-graphql-api.com/graphql", // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

// ✅ Define GraphQL Query
const GET_PAYROLLS = gql`
  query MyQuery {
    payrolls {
      name
      payroll_system
      processing_days_before_eft
      status
      date_value
      client {
        name
      }
      payroll_cycle {
        name
      }
      payroll_date_type {
        name
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  try {
    // ✅ Execute GraphQL Query via Apollo Client
    const { data } = await client.query({ query: GET_PAYROLLS });

    // ✅ Return Data in JSON Response
    return NextResponse.json({ payrolls: data.payrolls });
  } catch (error) {
    console.error("Payroll fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerApolloClient } from "@/lib/apollo-client";
import { GET_PAYROLLS } from "@/graphql/queries/payrolls/getPayrolls";
import { auth } from "@clerk/nextjs/server";

export async function GET(_req: NextRequest) {
  try {
    // Get Clerk authentication
    const { userId, getToken } = await auth();
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Hasura token
    const token = await getToken({ template: "hasura" });

    // Ensure we have a token
    if (!token) {
      return NextResponse.json({ error: "Failed to obtain authentication token" }, { status: 401 });
    }

    // Create server-side Apollo client
    const client = await getServerApolloClient();

    // Execute GraphQL query
    const { data } = await client.query({
      query: GET_PAYROLLS,
      context: { 
        headers: { 
          authorization: `Bearer ${token}` 
        } 
      },
    });

    return NextResponse.json({ payrolls: data.payrolls });
  } catch (error) {
    console.error("Payroll Fetch Error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch payrolls", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
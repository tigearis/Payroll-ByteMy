// app/api/payrolls/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServerApolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

// GraphQL query to list all payrolls
const GET_PAYROLLS = gql`
  query GetPayrolls {
    payrolls {
      id
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

// GraphQL mutation to create a new payroll
const CREATE_PAYROLL = gql`
  mutation CreatePayroll($input: PayrollInput!) {
    createPayroll(input: $input) {
      id
      name
      status
    }
  }
`;

export async function GET(_req: NextRequest) {
  try {
    const client = await getServerApolloClient();
    
    const { data } = await client.query({
      query: GET_PAYROLLS
    });

    return NextResponse.json({ payrolls: data.payrolls });
  } catch (error) {
    console.error("Payroll fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId, getToken } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role for permission check
    const token = await getToken({ template: "hasura" });
    let userRole = "viewer"; // Default role
    
    if (token) {
      // Decode token to get role
      const tokenParts = token.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      const hasuraClaims = payload['https://hasura.io/jwt/claims'];
      userRole = hasuraClaims?.['x-hasura-default-role'] || "viewer";
    }

    // Check role-based access
    if (!["manager", "org_admin", "dev"].includes(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Manager, admin, or dev access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const input = await req.json();

    // Validate required fields
    if (!input.client_id || !input.name || !input.cycle_id || !input.date_type_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get authenticated Apollo client
    const client = await getServerApolloClient();
    
    // Create payroll using GraphQL mutation
    const { data } = await client.mutate({
      mutation: CREATE_PAYROLL,
      variables: { input }
    });

    return NextResponse.json({
      success: true,
      message: "Payroll created successfully",
      payroll: data.createPayroll
    });
  } catch (error) {
    console.error("Payroll creation error:", error);
    return NextResponse.json({ 
      error: "Something went wrong", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
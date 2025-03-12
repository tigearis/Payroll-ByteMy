// app/api/payrolls/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServerApolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";

// GraphQL query to get a single payroll by ID
const GET_PAYROLL_BY_ID = gql`
  query GetPayroll($id: ID!) {
    payroll(id: $id) {
      id
      name
      processing_days_before_eft
      active
      created_at
      updated_at
      client {
        name
      }
      primaryConsultant {
        name
      }
      backupConsultant {
        name
      }
      manager {
        name
      }
      payroll_system
      status
    }
  }
`;

// GraphQL mutation to update a payroll
const UPDATE_PAYROLL = gql`
  mutation UpdatePayroll($id: ID!, $input: PayrollInput!) {
    updatePayroll(id: $id, input: $input) {
      id
      name
      status
      updated_at
    }
  }
`;

// GraphQL mutation to delete a payroll
const DELETE_PAYROLL = gql`
  mutation DeletePayroll($id: ID!) {
    deletePayroll(id: $id)
  }
`;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get authenticated Apollo client
    const client = await getServerApolloClient();
    
    // Query the payroll by ID
    const { data } = await client.query({
      query: GET_PAYROLL_BY_ID,
      variables: { id: params.id }
    });

    if (!data.payroll) {
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 });
    }

    return NextResponse.json(data.payroll);
  } catch (error) {
    console.error("Payroll fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Ensure only allowed roles can update
    if (!["org_admin", "manager", "dev"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const input = await req.json();
    
    // Get authenticated Apollo client
    const client = await getServerApolloClient();
    
    // Update the payroll using GraphQL mutation
    const { data } = await client.mutate({
      mutation: UPDATE_PAYROLL,
      variables: { 
        id: params.id,
        input
      }
    });

    if (!data.updatePayroll) {
      return NextResponse.json({ error: "Payroll not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Payroll updated successfully",
      payroll: data.updatePayroll
    });
  } catch (error) {
    console.error("Payroll update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Ensure only allowed roles can delete
    if (!["org_admin", "dev"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get authenticated Apollo client
    const client = await getServerApolloClient();
    
    // Delete the payroll using GraphQL mutation
    const { data } = await client.mutate({
      mutation: DELETE_PAYROLL,
      variables: { id: params.id }
    });

    if (!data.deletePayroll) {
      return NextResponse.json({ error: "Payroll not found or delete failed" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Payroll deleted successfully" 
    });
  } catch (error) {
    console.error("Payroll delete error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
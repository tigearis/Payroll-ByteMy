import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";

// Simple test to create a user directly in the database
export const POST = withAuth(async (request: NextRequest, session) => {
  console.log("🧪 Simple User Creation Test Starting");
  
  try {
    // Import Apollo client
    const { adminApolloClient } = await import('@/lib/server-apollo-client');
    const { gql } = await import('@apollo/client');
    
    console.log("🧪 Environment check:", {
      hasuraUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL?.substring(0, 50) + "...",
      hasAdminSecret: !!process.env.HASURA_ADMIN_SECRET,
      adminSecretLength: process.env.HASURA_ADMIN_SECRET?.length
    });
    
    // Get request body
    const body = await request.json();
    const testEmail = body.email || `test${Date.now()}@example.com`;
    
    console.log("🧪 Testing with email:", testEmail);
    
    // Simple GraphQL mutation
    const CREATE_TEST_USER = gql`
      mutation CreateTestUser($name: String!, $email: String!) {
        insert_users_one(
          object: {
            name: $name
            email: $email
            role: viewer
            is_staff: false
          }
        ) {
          id
          name
          email
          role
          created_at
        }
      }
    `;
    
    console.log("🧪 Executing GraphQL mutation...");
    
    const result = await adminApolloClient.mutate({
      mutation: CREATE_TEST_USER,
      variables: {
        name: "Test User " + Date.now(),
        email: testEmail
      }
    });
    
    console.log("🧪 GraphQL result:", {
      hasData: !!result.data,
      hasErrors: !!result.errors,
      errors: result.errors,
      data: result.data
    });
    
    if (result.errors) {
      return NextResponse.json({
        success: false,
        error: "GraphQL errors",
        details: result.errors,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: result.data.insert_users_one,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error("🧪 Test user creation failed:", {
      error: error,
      message: error.message,
      stack: error.stack,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError
    });
    
    return NextResponse.json({
      success: false,
      error: "User creation failed",
      details: error.message,
      errorType: error.constructor.name,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError ? {
        message: error.networkError.message,
        statusCode: error.networkError.statusCode
      } : null,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}, {
  allowedRoles: ["admin", "org_admin"]
});

export async function GET() {
  return NextResponse.json({
    message: "Test user creation route - use POST with { email?: string }"
  });
}
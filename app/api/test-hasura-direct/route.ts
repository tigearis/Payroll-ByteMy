import { NextRequest, NextResponse } from "next/server";

// Test Hasura connection directly without authentication
export async function POST(request: NextRequest) {
  console.log("🔧 Direct Hasura Test Starting");
  
  try {
    // Import Apollo client
    const { adminApolloClient } = await import('@/lib/server-apollo-client');
    const { gql } = await import('@apollo/client');
    
    console.log("🔧 Environment check:", {
      hasuraUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
      hasAdminSecret: !!process.env.HASURA_ADMIN_SECRET,
      adminSecretLength: process.env.HASURA_ADMIN_SECRET?.length,
      nodeEnv: process.env.NODE_ENV
    });
    
    // Test simple query first
    console.log("🔧 Testing simple query...");
    const TEST_QUERY = gql`
      query TestConnection {
        users(limit: 1) {
          id
          name
          email
        }
      }
    `;
    
    const queryResult = await adminApolloClient.query({
      query: TEST_QUERY,
      fetchPolicy: "network-only"
    });
    
    console.log("🔧 Query result:", {
      hasData: !!queryResult.data,
      hasErrors: !!queryResult.errors,
      userCount: queryResult.data?.users?.length || 0
    });
    
    // Test mutation
    console.log("🔧 Testing mutation...");
    const body = await request.json().catch(() => ({}));
    const testEmail = body.email || `direct-test-${Date.now()}@example.com`;
    
    const TEST_MUTATION = gql`
      mutation TestMutation($name: String!, $email: String!) {
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
    
    const mutationResult = await adminApolloClient.mutate({
      mutation: TEST_MUTATION,
      variables: {
        name: "Direct Test User",
        email: testEmail
      }
    });
    
    console.log("🔧 Mutation result:", {
      hasData: !!mutationResult.data,
      hasErrors: !!mutationResult.errors,
      errors: mutationResult.errors,
      userId: mutationResult.data?.insert_users_one?.id
    });
    
    return NextResponse.json({
      success: true,
      message: "Direct Hasura test successful",
      results: {
        queryWorked: !!queryResult.data,
        mutationWorked: !!mutationResult.data && !mutationResult.errors,
        userCount: queryResult.data?.users?.length || 0,
        createdUserId: mutationResult.data?.insert_users_one?.id,
        errors: mutationResult.errors
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error("🔧 Direct Hasura test failed:", {
      error: error,
      message: error.message,
      stack: error.stack,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError
    });
    
    return NextResponse.json({
      success: false,
      error: "Direct Hasura test failed",
      details: error.message,
      errorType: error.constructor.name,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError ? {
        message: error.networkError.message,
        statusCode: error.networkError.statusCode,
        result: error.networkError.result
      } : null,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Direct Hasura test route - use POST with optional { email: string }"
  });
}
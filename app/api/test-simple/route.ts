import { NextRequest, NextResponse } from "next/server";

// Simple test route with no auth to test basic functionality
export async function POST(request: NextRequest) {
  console.log("🧪 ================================");
  console.log("🧪 SIMPLE TEST ROUTE CALLED");
  console.log("🧪 ================================");
  console.log("🧪 Method:", request.method);
  console.log("🧪 URL:", request.url);
  console.log("🧪 Environment:", {
    nodeEnv: process.env.NODE_ENV,
    hasuraUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    hasAdminSecret: !!process.env.HASURA_ADMIN_SECRET,
    hasClerkSecret: !!process.env.CLERK_SECRET_KEY
  });
  
  try {
    const body = await request.json();
    console.log("🧪 Request body:", body);
    
    // Test basic imports
    console.log("🧪 Testing imports...");
    const { gql } = await import('@apollo/client');
    console.log("🧪 GraphQL import successful");
    
    const { adminApolloClient } = await import('@/lib/server-apollo-client');
    console.log("🧪 Apollo client import successful");
    
    // Test simple GraphQL query
    console.log("🧪 Testing simple GraphQL query...");
    const TEST_QUERY = gql`
      query TestQuery {
        users(limit: 1) {
          id
          name
          email
        }
      }
    `;
    
    const result = await adminApolloClient.query({
      query: TEST_QUERY,
      fetchPolicy: "network-only"
    });
    
    console.log("🧪 GraphQL query result:", {
      hasData: !!result.data,
      hasErrors: !!result.errors,
      userCount: result.data?.users?.length || 0
    });
    
    return NextResponse.json({
      success: true,
      message: "Simple test successful",
      data: {
        graphqlWorks: true,
        userCount: result.data?.users?.length || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error("🧪 Simple test error - DETAILED:", {
      error: error,
      message: error.message,
      stack: error.stack,
      name: error.name,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError
    });
    
    return NextResponse.json({
      error: "Simple test failed",
      details: error.message,
      errorName: error.name,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Simple test route - use POST with any JSON body"
  });
}
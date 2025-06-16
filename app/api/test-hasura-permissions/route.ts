import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServerApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing Hasura permissions...');
    
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        error: 'No authenticated user'
      }, { status: 401 });
    }
    
    const token = await getToken({ template: "hasura" });
    
    if (!token) {
      return NextResponse.json({
        error: 'No JWT token available'
      }, { status: 401 });
    }
    
    // Parse token to get claims
    const payload = JSON.parse(atob(token.split('.')[1]));
    const hasuraClaims = payload["https://hasura.io/jwt/claims"];
    const databaseUserId = hasuraClaims?.["x-hasura-user-id"];
    
    // Test different query levels
    const queries = [
      {
        name: 'basic',
        query: gql`
          query TestBasic($id: uuid!) {
            users_by_pk(id: $id) {
              id
              name
            }
          }
        `
      },
      {
        name: 'with_role',
        query: gql`
          query TestWithRole($id: uuid!) {
            users_by_pk(id: $id) {
              id
              name
              role
            }
          }
        `
      },
      {
        name: 'with_email',
        query: gql`
          query TestWithEmail($id: uuid!) {
            users_by_pk(id: $id) {
              id
              name
              email
            }
          }
        `
      }
    ];
    
    const apolloClient = await getServerApolloClient();
    const results = {};
    
    for (const test of queries) {
      try {
        const { data, errors } = await apolloClient.query({
          query: test.query,
          variables: { id: databaseUserId },
          context: { headers: { authorization: `Bearer ${token}` } }
        });
        
        results[test.name] = {
          success: true,
          data: data,
          errors: errors
        };
      } catch (error: any) {
        results[test.name] = {
          success: false,
          error: error.message,
          graphQLErrors: error.graphQLErrors?.map(e => e.message)
        };
      }
    }
    
    return NextResponse.json({
      authenticated: true,
      userId,
      databaseUserId,
      jwtClaims: hasuraClaims,
      queryResults: results
    });
    
  } catch (error: any) {
    console.error('❌ Hasura permissions test error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error.message
    }, { status: 500 });
  }
}
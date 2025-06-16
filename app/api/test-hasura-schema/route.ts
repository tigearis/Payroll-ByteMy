import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServerApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing Hasura schema introspection...');
    
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
    
    const apolloClient = await getServerApolloClient();
    
    // Introspect the users type to see what fields are actually available
    const schemaQuery = gql`
      query IntrospectUsersType {
        __type(name: "users") {
          name
          fields {
            name
            type {
              name
              kind
            }
          }
        }
      }
    `;
    
    const { data, errors } = await apolloClient.query({
      query: schemaQuery,
      context: { headers: { authorization: `Bearer ${token}` } }
    });
    
    if (errors) {
      return NextResponse.json({
        error: 'Schema introspection failed',
        graphQLErrors: errors.map(e => e.message)
      }, { status: 500 });
    }
    
    const usersType = data.__type;
    const availableFields = usersType?.fields?.map(f => f.name) || [];
    
    // Also check if we can query any users at all
    let usersQueryResult = null;
    try {
      const usersQuery = gql`
        query TestUsersQuery {
          users(limit: 1) {
            id
            name
          }
        }
      `;
      
      const usersData = await apolloClient.query({
        query: usersQuery,
        context: { headers: { authorization: `Bearer ${token}` } }
      });
      
      usersQueryResult = {
        success: true,
        count: usersData.data?.users?.length || 0
      };
    } catch (usersError: any) {
      usersQueryResult = {
        success: false,
        error: usersError.message
      };
    }
    
    return NextResponse.json({
      authenticated: true,
      usersTypeExists: !!usersType,
      availableFields,
      hasRoleField: availableFields.includes('role'),
      hasEmailField: availableFields.includes('email'),
      usersQueryTest: usersQueryResult,
      fullUsersType: usersType
    });
    
  } catch (error: any) {
    console.error('❌ Schema introspection error:', error);
    return NextResponse.json({
      error: 'Schema introspection failed',
      details: error.message
    }, { status: 500 });
  }
}
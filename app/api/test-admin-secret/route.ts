import { NextRequest, NextResponse } from "next/server";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing with admin secret...');
    
    if (!process.env.HASURA_ADMIN_SECRET) {
      return NextResponse.json({
        error: 'No admin secret configured'
      }, { status: 500 });
    }
    
    // Test schema introspection with admin secret
    const schemaQuery = gql`
      query IntrospectUsersTypeAdmin {
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
    
    const { data: schemaData, errors: schemaErrors } = await adminApolloClient.query({
      query: schemaQuery
    });
    
    if (schemaErrors) {
      return NextResponse.json({
        error: 'Admin schema introspection failed',
        graphQLErrors: schemaErrors.map(e => e.message)
      }, { status: 500 });
    }
    
    const usersType = schemaData.__type;
    const availableFields = usersType?.fields?.map(f => f.name) || [];
    
    // Test actual user query with admin
    let userQueryResult = null;
    try {
      const userQuery = gql`
        query TestUserQueryAdmin {
          users(limit: 1) {
            id
            name
            ${availableFields.includes('email') ? 'email' : ''}
            ${availableFields.includes('role') ? 'role' : ''}
            ${availableFields.includes('is_staff') ? 'is_staff' : ''}
          }
        }
      `;
      
      const userData = await adminApolloClient.query({
        query: userQuery
      });
      
      userQueryResult = {
        success: true,
        data: userData.data?.users?.[0] || null,
        count: userData.data?.users?.length || 0
      };
    } catch (userError: any) {
      userQueryResult = {
        success: false,
        error: userError.message,
        graphQLErrors: userError.graphQLErrors?.map(e => e.message)
      };
    }
    
    return NextResponse.json({
      adminSecretWorking: true,
      usersTypeExists: !!usersType,
      availableFields,
      hasRoleField: availableFields.includes('role'),
      hasEmailField: availableFields.includes('email'),
      userQueryResult,
      fullUsersType: usersType
    });
    
  } catch (error: any) {
    console.error('❌ Admin secret test error:', error);
    return NextResponse.json({
      error: 'Admin secret test failed',
      details: error.message
    }, { status: 500 });
  }
}
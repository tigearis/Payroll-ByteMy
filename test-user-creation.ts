/**
 * Simple User Creation Test
 * Run this in your Next.js API route or console
 */

import { getServerApolloClient } from '@/lib/server-apollo-client';
import { gql } from '@apollo/client';

const CREATE_USER_TEST = gql`
  mutation CreateUserTest(
    $name: String!
    $email: String!
    $role: user_role!
    $isStaff: Boolean!
  ) {
    insert_users_one(
      object: {
        name: $name
        email: $email
        role: $role
        is_staff: $isStaff
      }
      on_conflict: {
        constraint: users_email_key
        update_columns: [name, role, is_staff, updated_at]
      }
    ) {
      id
      name
      email
      role
      is_staff
      created_at
      updated_at
    }
  }
`;

export async function testUserCreation() {
  console.log('🧪 Testing User Creation...');
  
  try {
    const client = await getServerApolloClient();
    
    const testUser = {
      name: `Test User ${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      role: 'viewer' as const,
      isStaff: true
    };
    
    console.log('📝 Creating user with data:', testUser);
    
    const { data, errors } = await client.mutate({
      mutation: CREATE_USER_TEST,
      variables: testUser
    });
    
    if (errors) {
      console.error('❌ GraphQL Errors:');
      errors.forEach((error, index) => {
        console.error(`  ${index + 1}. ${error.message}`);
        console.error(`     Path: ${error.path?.join('.')}`);
        console.error(`     Extensions:`, error.extensions);
      });
      return { success: false, errors };
    }
    
    if (data?.insert_users_one) {
      console.log('✅ User created successfully:', data.insert_users_one);
      return { success: true, user: data.insert_users_one };
    }
    
    console.log('⚠️ No data returned');
    return { success: false, message: 'No data returned' };
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
}

// For API route testing
export async function GET() {
  const result = await testUserCreation();
  return Response.json(result);
}
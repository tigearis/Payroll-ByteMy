/**
 * Check Existing Users Script
 * Shows what users currently exist in the database
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
config({ path: '.env.local' });

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'https://hasura.bytemy.com.au/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

async function checkExistingUsers() {
  console.log('🔍 Checking existing users in database...');
  console.log(`Hasura URL: ${HASURA_URL}`);
  console.log(`Admin Secret: ${HASURA_ADMIN_SECRET ? 'Present' : 'Missing'}`);

  if (!HASURA_ADMIN_SECRET) {
    console.log('❌ HASURA_GRAPHQL_ADMIN_SECRET is required');
    return;
  }

  try {
    // First, let's check what tables exist
    const introspectionQuery = `
      query IntrospectSchema {
        __schema {
          types {
            name
            kind
            fields {
              name
              type {
                name
              }
            }
          }
        }
      }
    `;

    console.log('\n🔍 Checking database schema...');
    const schemaResponse = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: introspectionQuery
      })
    });

    const schemaData = await schemaResponse.json();
    
    if (schemaData.errors) {
      console.log('❌ Schema introspection failed:', schemaData.errors);
      return;
    }

    // Find user-related tables
    const types = schemaData.data._schema.types;
    const userTables = types.filter(type => 
      type.name && 
      type.name.toLowerCase().includes('user') && 
      type.kind === 'OBJECT' &&
      !type.name.startsWith('__')
    );

    console.log('\n📋 User-related tables found:');
    userTables.forEach(table => {
      console.log(`   - ${table.name}`);
      if (table.fields) {
        const fieldNames = table.fields.map(f => f.name).join(', ');
        console.log(`     Fields: ${fieldNames}`);
      }
    });

    // Try to query users table
    const usersQuery = `
      query GetAllUsers {
        users {
          id
          email
          created_at
          updated_at
        }
      }
    `;

    console.log('\n🔍 Querying users table...');
    const usersResponse = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: usersQuery
      })
    });

    const usersData = await usersResponse.json();
    
    if (usersData.errors) {
      console.log('❌ Users query failed:', usersData.errors);
      
      // Try alternative table names
      const alternativeQueries = [
        'SELECT * FROM "users" LIMIT 10;',
        'SELECT * FROM "user" LIMIT 10;',
        'SELECT * FROM "staff" LIMIT 10;'
      ];

      console.log('\n🔍 Trying alternative queries...');
      // Note: Raw SQL queries would need a different approach
      
    } else {
      const users = usersData.data?.users || [];
      console.log(`\n✅ Found ${users.length} users:`);
      
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (ID: ${user.id})`);
      });

      if (users.length === 0) {
        console.log('   No users found in database');
      }
    }

    // Check roles table
    const rolesQuery = `
      query GetAllRoles {
        roles {
          id
          name
          created_at
        }
      }
    `;

    console.log('\n🔍 Checking roles table...');
    const rolesResponse = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: rolesQuery
      })
    });

    const rolesData = await rolesResponse.json();
    
    if (rolesData.errors) {
      console.log('❌ Roles query failed:', rolesData.errors);
    } else {
      const roles = rolesData.data?.roles || [];
      console.log(`\n✅ Found ${roles.length} roles:`);
      
      roles.forEach((role, index) => {
        console.log(`   ${index + 1}. ${role.name} (ID: ${role.id})`);
      });
    }

    // Check userroles junction table
    const userRolesQuery = `
      query GetUserRoles {
        userroles {
          user_id
          role_id
          user {
            email
          }
          role {
            name
          }
        }
      }
    `;

    console.log('\n🔍 Checking userroles table...');
    const userRolesResponse = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: userRolesQuery
      })
    });

    const userRolesData = await userRolesResponse.json();
    
    if (userRolesData.errors) {
      console.log('❌ User roles query failed:', userRolesData.errors);
    } else {
      const userRoles = userRolesData.data?.userroles || [];
      console.log(`\n✅ Found ${userRoles.length} user-role assignments:`);
      
      userRoles.forEach((assignment, index) => {
        console.log(`   ${index + 1}. ${assignment.user?.email} → ${assignment.role?.name}`);
      });
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

checkExistingUsers();
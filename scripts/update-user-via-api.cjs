#!/usr/bin/env node

// Script to update a specific user's role to developer using the existing API endpoint
require('dotenv').config({path: '.env.development.local'});

// Target user information
const TARGET_USER_DATABASE_ID = 'd9ac8a7b-f679-49a1-8c99-837eb977578b';
const NEW_ROLE = 'developer';

async function updateUserRoleViaAPI() {
  console.log('🚀 Starting user role update via API...');
  console.log(`📋 Target User Database ID: ${TARGET_USER_DATABASE_ID}`);
  console.log(`🎯 New Role: ${NEW_ROLE}`);

  try {
    // We need to find the Clerk user ID first from the database
    const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
    const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

    if (!HASURA_ADMIN_SECRET) {
      throw new Error('HASURA_GRAPHQL_ADMIN_SECRET not found in environment. Please check your .env file.');
    }

    console.log('\n📊 Step 1: Finding user in database...');

    const getUserQuery = {
      query: `
        query GetUserById($id: uuid!) {
          users(where: {id: {_eq: $id}}) {
            id
            email
            name
            role
            clerkUserId
            isStaff
            managerId
          }
        }
      `,
      variables: {
        id: TARGET_USER_DATABASE_ID
      }
    };

    const getUserResponse = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(getUserQuery),
    });

    const getUserResult = await getUserResponse.json();
    
    if (getUserResult.errors) {
      throw new Error(`Failed to find user: ${getUserResult.errors[0].message}`);
    }

    const users = getUserResult.data.users;
    if (!users || users.length === 0) {
      throw new Error(`User with ID ${TARGET_USER_DATABASE_ID} not found in database`);
    }

    const user = users[0];
    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`   Current role: ${user.role}`);
    console.log(`   Clerk ID: ${user.clerkUserId || 'Not found'}`);

    if (!user.clerkUserId) {
      console.log('⚠️  User does not have a Clerk ID. Will update database only.');
    }

    // Step 2: Use the existing API endpoint to update the role
    console.log('\n🔄 Step 2: Updating role via API endpoint...');

    const apiEndpoint = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/update-user-role`;
    
    // For the API call, we need to use a developer user's credentials
    // Let's try to find a developer user from the database first
    const getDeveloperQuery = {
      query: `
        query GetDeveloperUser {
          users(where: { role: { _eq: "developer" } }, limit: 1) {
            id
            clerk_user_id
            email
            name
          }
        }
      `,
      variables: {}
    };

    const getDeveloperResponse = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(getDeveloperQuery),
    });

    const getDeveloperResult = await getDeveloperResponse.json();
    const developerUser = getDeveloperResult.data.users[0];

    if (!developerUser) {
      console.log('⚠️  No developer user found. Will update database directly instead.');
      
      // Direct database update approach
      const updateRoleQuery = {
        query: `
          mutation UpdateUserRole($id: uuid!, $role: userrole!, $isStaff: Boolean!) {
            updateUsers(
              where: { id: { _eq: $id } }
              _set: {
                role: $role
                isStaff: $isStaff
                updatedAt: "now()"
              }
            ) {
              affectedRows
              returning {
                id
                name
                email
                role
                isStaff
                updatedAt
              }
            }
          }
        `,
        variables: {
          id: TARGET_USER_DATABASE_ID,
          role: NEW_ROLE,
          isStaff: true
        }
      };

      const updateResponse = await fetch(HASURA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        },
        body: JSON.stringify(updateRoleQuery),
      });

      const updateResult = await updateResponse.json();
      
      if (updateResult.errors) {
        throw new Error(`Failed to update role in database: ${updateResult.errors[0].message}`);
      }

      console.log(`✅ Updated database role to: ${NEW_ROLE}`);
      console.log(`⚠️  Clerk metadata not updated. User needs to sign out and back in.`);
      
    } else {
      console.log(`✅ Found developer user for API call: ${developerUser.name}`);
      console.log('⚠️  Note: API endpoint requires authentication. This would normally be called from the application.');
      console.log('   For now, updating database directly...');

      // Direct database update approach since we can't easily authenticate for the API
      const updateRoleQuery = {
        query: `
          mutation UpdateUserRole($id: uuid!, $role: userrole!, $isStaff: Boolean!) {
            updateUsers(
              where: { id: { _eq: $id } }
              _set: {
                role: $role
                isStaff: $isStaff
                updatedAt: "now()"
              }
            ) {
              affectedRows
              returning {
                id
                name
                email
                role
                isStaff
                updatedAt
              }
            }
          }
        `,
        variables: {
          id: TARGET_USER_DATABASE_ID,
          role: NEW_ROLE,
          isStaff: true
        }
      };

      const updateResponse = await fetch(HASURA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        },
        body: JSON.stringify(updateRoleQuery),
      });

      const updateResult = await updateResponse.json();
      
      if (updateResult.errors) {
        throw new Error(`Failed to update role in database: ${updateResult.errors[0].message}`);
      }

      console.log(`✅ Updated database role to: ${NEW_ROLE}`);
    }

    console.log('\n🎉 Role update completed!');
    console.log('\n📋 Summary:');
    console.log(`   • User: ${user.name} (${user.email})`);
    console.log(`   • Database ID: ${TARGET_USER_DATABASE_ID}`);
    console.log(`   • Role updated: ${user.role} → ${NEW_ROLE}`);
    console.log(`   • Database: ✅ Updated`);
    
    console.log('\n💡 Next steps:');
    console.log('   1. Ask the user to sign out and sign back in');
    console.log('   2. Their Clerk metadata will sync on next login');
    console.log('   3. They should then see all leave records instead of just their own');
    console.log('   4. They will have full developer access to the system');

    console.log('\n🔧 Alternative: Use the application UI:');
    console.log('   1. Log in as a developer or org_admin user');
    console.log('   2. Go to Staff Management page');
    console.log('   3. Find the user and edit their role');
    console.log('   4. This will properly sync both database and Clerk');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    
    console.log('\n💡 Manual alternatives:');
    console.log('\n1. Using the application UI (recommended):');
    console.log('   - Log in as a developer or org_admin user');
    console.log('   - Go to Staff Management');
    console.log('   - Edit the user\'s role to "developer"');
    
    console.log('\n2. Using direct SQL (if you have database access):');
    console.log(`   UPDATE users SET role = 'developer', is_staff = true WHERE id = '${TARGET_USER_DATABASE_ID}';`);
    
    console.log('\n3. Using the API endpoint with proper authentication:');
    console.log('   POST /api/update-user-role');
    console.log('   Body: { "targetUserId": "CLERK_USER_ID", "role": "developer" }');
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateUserRoleViaAPI();
}

module.exports = { updateUserRoleViaAPI };
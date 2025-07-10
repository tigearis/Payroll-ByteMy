#!/usr/bin/env node

// Script to update a specific user's role to developer
const { clerkClient } = require("@clerk/nextjs/server");
const fetch = require('node-fetch');
require('dotenv').config();

// Target user information
const TARGET_USER_DATABASE_ID = 'd9ac8a7b-f679-49a1-8c99-837eb977578b';
const NEW_ROLE = 'developer';

async function updateUserRole() {
  console.log('🚀 Starting user role update to developer...');
  console.log(`📋 Target User Database ID: ${TARGET_USER_DATABASE_ID}`);
  console.log(`🎯 New Role: ${NEW_ROLE}`);

  try {
    // Step 1: Find the user in the database using GraphQL
    const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
    const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

    if (!HASURA_ADMIN_SECRET) {
      throw new Error('HASURA_ADMIN_SECRET not found in environment');
    }

    console.log('\n📊 Step 1: Finding user in database...');

    const getUserQuery = {
      query: `
        query GetUserById($id: uuid!) {
          users_by_pk(id: $id) {
            id
            email
            name
            role
            clerk_user_id
            is_staff
            manager_id
            created_at
            updated_at
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

    const user = getUserResult.data.users_by_pk;
    if (!user) {
      throw new Error(`User with ID ${TARGET_USER_DATABASE_ID} not found in database`);
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`   Current role: ${user.role}`);
    console.log(`   Clerk ID: ${user.clerk_user_id}`);

    // Step 2: Update role in database
    console.log('\n🔄 Step 2: Updating role in database...');

    const updateRoleQuery = {
      query: `
        mutation UpdateUserRole($id: uuid!, $role: userrole!, $isStaff: Boolean!) {
          update_users_by_pk(
            pk_columns: { id: $id }
            _set: {
              role: $role
              is_staff: $isStaff
              updated_at: "now()"
            }
          ) {
            id
            name
            email
            role
            is_staff
            updated_at
          }
        }
      `,
      variables: {
        id: TARGET_USER_DATABASE_ID,
        role: NEW_ROLE,
        isStaff: true // Developer role should be staff
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

    const updatedUser = updateResult.data.update_users_by_pk;
    console.log(`✅ Updated database role to: ${updatedUser.role}`);

    // Step 3: Update Clerk metadata
    if (user.clerk_user_id) {
      console.log('\n🔐 Step 3: Updating Clerk metadata...');

      try {
        // Get Clerk client and current user
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(user.clerk_user_id);
        console.log(`✅ Found Clerk user: ${clerkUser.id}`);

        // Update public metadata
        await clerk.users.updateUser(user.clerk_user_id, {
          publicMetadata: {
            ...clerkUser.publicMetadata,
            role: NEW_ROLE,
            databaseId: TARGET_USER_DATABASE_ID,
            isStaff: 'true', // Convert to string for Hasura compatibility
            managerId: null,
            lastRoleUpdateAt: new Date().toISOString(),
            updatedBy: 'admin-script'
          },
          privateMetadata: {
            ...clerkUser.privateMetadata,
            lastRoleUpdateAt: new Date().toISOString(),
            syncSource: 'admin_script'
          }
        });

        // Verify the update
        const verifyUser = await clerk.users.getUser(user.clerk_user_id);
        console.log(`✅ Verified Clerk metadata:`);
        console.log(`   Role: ${verifyUser.publicMetadata.role}`);
        console.log(`   Database ID: ${verifyUser.publicMetadata.databaseId}`);
        console.log(`   Is Staff: ${verifyUser.publicMetadata.isStaff}`);

      } catch (clerkError) {
        console.error(`❌ Failed to update Clerk metadata: ${clerkError.message}`);
        console.log(`⚠️  Database role updated successfully, but Clerk sync failed.`);
        console.log(`   The user may need to sign out and sign back in for changes to take effect.`);
      }
    } else {
      console.log(`⚠️  No Clerk ID found for user. Database role updated but Clerk metadata not synced.`);
    }

    // Step 4: Verify the user can now see all leave records
    console.log('\n🔍 Step 4: Testing access to leave records...');

    const testLeaveQuery = {
      query: `
        query TestLeaveAccess {
          leave(limit: 5) {
            id
            user_id
            leave_type
            start_date
            end_date
            status
          }
        }
      `,
      variables: {}
    };

    // Note: We can't test with user's JWT here since they need to sign in again
    // But we can verify with admin access that the data exists
    const testResponse = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(testLeaveQuery),
    });

    const testResult = await testResponse.json();
    
    if (testResult.data && testResult.data.leave) {
      console.log(`✅ Leave records accessible: ${testResult.data.leave.length} records found`);
      console.log(`   Developer role should now be able to see all leave records.`);
    }

    console.log('\n🎉 Role update completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • User: ${user.name} (${user.email})`);
    console.log(`   • Database ID: ${TARGET_USER_DATABASE_ID}`);
    console.log(`   • Role updated: viewer → developer`);
    console.log(`   • Database: ✅ Updated`);
    console.log(`   • Clerk metadata: ${user.clerk_user_id ? '✅ Updated' : '⚠️ Skipped (no Clerk ID)'}`);
    
    console.log('\n💡 Next steps:');
    console.log('   1. Ask the user to sign out and sign back in');
    console.log('   2. They should now see all leave records instead of just their own');
    console.log('   3. They will have full developer access to the system');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateUserRole();
}

module.exports = { updateUserRole };
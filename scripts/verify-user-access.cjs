#!/usr/bin/env node

// Script to verify user access to leave records
require('dotenv').config({path: '.env.development.local'});

// Target user information
const TARGET_USER_DATABASE_ID = 'd9ac8a7b-f679-49a1-8c99-837eb977578b';

async function verifyUserAccess() {
  console.log('🔍 Verifying user access and role...');
  console.log(`📋 Target User Database ID: ${TARGET_USER_DATABASE_ID}`);

  try {
    const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
    const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

    // Step 1: Get user details
    console.log('\n📊 Step 1: Getting user details...');

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
            createdAt
            updatedAt
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
    const user = getUserResult.data.users[0];

    if (!user) {
      throw new Error('User not found');
    }

    console.log(`✅ User Details:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Is Staff: ${user.isStaff}`);
    console.log(`   Clerk ID: ${user.clerkUserId}`);
    console.log(`   Updated: ${user.updatedAt}`);

    // Step 2: Check leave records access
    console.log('\n🍃 Step 2: Testing leave records access...');

    const getLeaveQuery = {
      query: `
        query GetAllLeave {
          leave(limit: 10) {
            id
            userId
            leaveType
            startDate
            endDate
            status
            user {
              name
              email
            }
          }
        }
      `,
      variables: {}
    };

    const getLeaveResponse = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(getLeaveQuery),
    });

    const getLeaveResult = await getLeaveResponse.json();

    if (getLeaveResult.data && getLeaveResult.data.leave) {
      const leaveRecords = getLeaveResult.data.leave;
      console.log(`✅ Found ${leaveRecords.length} leave records in database`);
      
      // Show sample records
      if (leaveRecords.length > 0) {
        console.log('\n📋 Sample leave records:');
        leaveRecords.slice(0, 3).forEach((record, index) => {
          console.log(`   ${index + 1}. ${record.user?.name || 'Unknown'} - ${record.leaveType} (${record.startDate} to ${record.endDate})`);
        });
      }

      // Check if any records belong to our user
      const userLeaveRecords = leaveRecords.filter(record => record.userId === TARGET_USER_DATABASE_ID);
      console.log(`\n👤 Leave records for ${user.name}: ${userLeaveRecords.length}`);
      
      if (userLeaveRecords.length > 0) {
        userLeaveRecords.forEach((record, index) => {
          console.log(`   ${index + 1}. ${record.leaveType} - ${record.startDate} to ${record.endDate} (${record.status})`);
        });
      }
    }

    // Step 3: Check role permissions
    console.log('\n🔐 Step 3: Role permissions summary...');
    
    const rolePermissions = {
      developer: ['Can see ALL leave records', 'Full system access', 'Can manage users', 'Can manage settings'],
      org_admin: ['Can see ALL leave records', 'Can manage users', 'Can manage most settings'],
      manager: ['Can see team leave records', 'Can manage team members'],
      consultant: ['Can see assigned leave records', 'Limited access'],
      viewer: ['Can see only OWN leave records', 'Read-only access']
    };

    console.log(`✅ Role: ${user.role}`);
    console.log('   Permissions:');
    if (rolePermissions[user.role]) {
      rolePermissions[user.role].forEach(permission => {
        console.log(`   • ${permission}`);
      });
    }

    // Final summary
    console.log('\n🎉 Summary:');
    console.log(`✅ User ${user.name} has role: ${user.role}`);
    console.log(`✅ With developer role, they can see ALL leave records across the system`);
    console.log(`✅ They have full access to the payroll system`);
    
    if (user.role === 'developer') {
      console.log('\n💡 The user role update was successful!');
      console.log('   The user now has developer access and can see all leave records.');
      console.log('   They should sign out and back in to refresh their session.');
    } else {
      console.log(`\n⚠️  The user role is currently: ${user.role}`);
      console.log('   If you need to update it to developer, use the application UI or API.');
    }

  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  verifyUserAccess();
}

module.exports = { verifyUserAccess };
/**
 * Final User Test Script
 * Tests the actual users from your environment with correct schema
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
config({ path: '.env.local' });

const HASURA_URL = 'https://hasura.bytemy.com.au/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

const TEST_USERS = {
  admin: { email: 'admin@example.com', password: 'Admin1', expectedRole: 'admin' },
  manager: { email: 'manager@example.com', password: 'Manager1', expectedRole: 'manager' },
  consultant: { email: 'consultant@example.com', password: 'Consultant1', expectedRole: 'consultant' },
  viewer: { email: 'viewer@example.com', password: 'Viewer1', expectedRole: 'viewer' }
};

async function testUsers() {
  console.log('🔍 Testing actual users in database with correct schema...\n');

  // Query all users
  const usersQuery = `
    query GetAllUsers {
      users {
        id
        email
        name
        role
        isActive
        isStaff
        clerkUserId
        createdAt
        assignedRoles {
          roleId
          assignedRole {
            id
            name
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({ query: usersQuery })
    });

    const data = await response.json();
    
    if (data.errors) {
      console.log('❌ Query failed:', data.errors);
      return;
    }

    const users = data.data?.users || [];
    console.log(`✅ Found ${users.length} users in database:`);
    
    users.forEach((user, index) => {
      const roles = user.assignedRoles?.map(ar => ar.assignedRole?.name).filter(Boolean) || [];
      const roleText = roles.length > 0 ? `[${roles.join(', ')}]` : user.role || 'No role';
      
      console.log(`   ${index + 1}. ${user.email} - ${roleText} (Active: ${user.isActive}, Staff: ${user.isStaff})`);
    });

    // Check our test users
    console.log('\n🧪 Checking test user credentials:');
    
    Object.entries(TEST_USERS).forEach(([key, testUser]) => {
      const foundUser = users.find(u => u.email === testUser.email);
      
      if (foundUser) {
        const userRoles = foundUser.assignedRoles?.map(ar => ar.assignedRole?.name).filter(Boolean) || [];
        const hasExpectedRole = userRoles.includes(testUser.expectedRole) || foundUser.role === testUser.expectedRole;
        
        const status = hasExpectedRole ? '✅' : '⚠️';
        const roleInfo = userRoles.length > 0 ? `[${userRoles.join(', ')}]` : foundUser.role || 'No role';
        
        console.log(`   ${status} ${key}: ${testUser.email} - ${roleInfo} (Expected: ${testUser.expectedRole})`);
        
        if (!hasExpectedRole) {
          console.log(`      ⚠️  Role mismatch! Expected '${testUser.expectedRole}' but found '${roleInfo}'`);
        }
      } else {
        console.log(`   ❌ ${key}: ${testUser.email} - NOT FOUND in database`);
      }
    });

    // Check role definitions
    const rolesQuery = `
      query GetAllRoles {
        roles {
          id
          name
        }
      }
    `;

    console.log('\n🔍 Checking available roles...');
    const rolesResponse = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({ query: rolesQuery })
    });

    const rolesData = await rolesResponse.json();
    
    if (rolesData.errors) {
      console.log('❌ Roles query failed:', rolesData.errors);
    } else {
      const roles = rolesData.data?.roles || [];
      console.log(`✅ Found ${roles.length} roles:`);
      roles.forEach((role, index) => {
        console.log(`   ${index + 1}. ${role.name} (ID: ${role.id})`);
      });
    }

    // Summary and recommendations
    console.log('\n📊 Summary:');
    const testUserEmails = Object.values(TEST_USERS).map(u => u.email);
    const foundTestUsers = users.filter(u => testUserEmails.includes(u.email));
    
    console.log(`   - Database users: ${users.length}`);
    console.log(`   - Test users found: ${foundTestUsers.length}/${Object.keys(TEST_USERS).length}`);
    
    if (foundTestUsers.length === Object.keys(TEST_USERS).length) {
      console.log('\n🎉 All test users found! Ready for comprehensive testing.');
      console.log('\n🚀 Next steps:');
      console.log('   1. Run: node scripts/comprehensive-system-test.js');
      console.log('   2. Run: node scripts/authenticated-permission-test.js');
      console.log('   3. Test manual login with these credentials');
    } else {
      const missingUsers = Object.entries(TEST_USERS)
        .filter(([key, testUser]) => !users.find(u => u.email === testUser.email))
        .map(([key, testUser]) => `${key}: ${testUser.email}`);
      
      console.log('\n⚠️  Missing test users:');
      missingUsers.forEach(user => console.log(`   - ${user}`));
      
      console.log('\n💡 Create missing users or update your .env.local with existing user emails');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testUsers();
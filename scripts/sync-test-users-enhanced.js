#!/usr/bin/env node

// Enhanced test user sync script that ensures proper database sync and JWT template configuration
import { createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

// Test users with proper database UUIDs
const testUserData = {
  'developer@test.payroll.com': {
    role: 'developer',
    databaseId: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Test Developer'
  },
  'orgadmin@test.payroll.com': {
    role: 'org_admin',
    databaseId: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Test Org Admin'
  },
  'manager@test.payroll.com': {
    role: 'manager',
    databaseId: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Test Manager'
  },
  'consultant@test.payroll.com': {
    role: 'consultant',
    databaseId: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Test Consultant',
    managerId: '550e8400-e29b-41d4-a716-446655440003'
  },
  'viewer@test.payroll.com': {
    role: 'viewer',
    databaseId: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Test Viewer',
    managerId: '550e8400-e29b-41d4-a716-446655440003'
  }
};

// Get permissions for role
function getPermissionsForRole(role) {
  const permissionMap = {
    developer: [
      'custom:payroll:read', 'custom:payroll:write', 'custom:payroll:delete', 'custom:payroll:assign',
      'custom:staff:read', 'custom:staff:write', 'custom:staff:delete', 'custom:staff:invite',
      'custom:client:read', 'custom:client:write', 'custom:client:delete',
      'custom:admin:manage', 'custom:settings:write', 'custom:billing:manage',
      'custom:reports:read', 'custom:reports:export', 'custom:audit:read', 'custom:audit:write'
    ],
    org_admin: [
      'custom:payroll:read', 'custom:payroll:write',
      'custom:staff:read', 'custom:staff:write',
      'custom:client:read', 'custom:client:write',
      'custom:admin:manage', 'custom:settings:write',
      'custom:reports:read'
    ],
    manager: [
      'custom:payroll:read',
      'custom:staff:read',
      'custom:client:read',
      'custom:reports:read'
    ],
    consultant: [
      'custom:payroll:read',
      'custom:client:read'
    ],
    viewer: [
      'custom:payroll:read'
    ]
  };
  
  return permissionMap[role] || [];
}

async function syncUserToDatabase(clerkUser, userData) {
  const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL || process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

  if (!HASURA_ADMIN_SECRET) {
    throw new Error('HASURA_ADMIN_SECRET not found in environment');
  }

  console.log(`\n📊 Syncing ${userData.name} to database...`);

  // Insert or update user in database
  const mutation = {
    query: `
      mutation UpsertUser($user: users_insert_input!) {
        insert_users_one(
          object: $user
          on_conflict: {
            constraint: users_email_key
            update_columns: [name, clerk_user_id, role, is_staff, manager_id, updated_at]
          }
        ) {
          id
          email
          name
          role
          clerk_user_id
        }
      }
    `,
    variables: {
      user: {
        id: userData.databaseId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: userData.name,
        clerk_user_id: clerkUser.id,
        role: userData.role,
        is_staff: userData.role === 'org_admin' || userData.role === 'manager',
        manager_id: userData.managerId || null
      }
    }
  };

  try {
    const response = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(mutation),
    });

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`Database sync failed: ${result.errors[0].message}`);
    }

    console.log(`✅ Database sync successful for ${userData.name}`);
    return result.data.insert_users_one;
  } catch (error) {
    console.error(`❌ Database sync failed for ${userData.name}:`, error.message);
    throw error;
  }
}

async function updateClerkMetadata(clerkUser, userData) {
  console.log(`\n🔐 Updating Clerk metadata for ${userData.name}...`);
  
  const permissions = getPermissionsForRole(userData.role);
  
  try {
    // Update user metadata with all required fields for JWT
    await clerk.users.updateUser(clerkUser.id, {
      publicMetadata: {
        role: userData.role,
        databaseId: userData.databaseId,
        permissions: permissions,
        isStaff: userData.role === 'org_admin' || userData.role === 'manager',
        managerId: userData.managerId || null,
        assignedBy: 'e2e-test-setup',
        assignedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      privateMetadata: {
        hasuraRole: userData.role,
        testUser: true,
        syncVersion: Date.now()
      }
    });

    // Verify the update
    const updatedUser = await clerk.users.getUser(clerkUser.id);
    const savedDatabaseId = updatedUser.publicMetadata?.databaseId;
    
    if (savedDatabaseId !== userData.databaseId) {
      throw new Error(`Metadata verification failed: expected ${userData.databaseId}, got ${savedDatabaseId}`);
    }

    console.log(`✅ Clerk metadata updated successfully`);
    console.log(`   - Role: ${userData.role}`);
    console.log(`   - Database ID: ${savedDatabaseId}`);
    console.log(`   - Permissions: ${permissions.length} assigned`);
    
    return updatedUser;
  } catch (error) {
    console.error(`❌ Failed to update Clerk metadata:`, error.message);
    throw error;
  }
}

async function syncTestUser(email) {
  const userData = testUserData[email];
  if (!userData) {
    console.warn(`⚠️  No test data found for ${email}`);
    return null;
  }

  console.log(`\n👤 Processing ${email}...`);

  try {
    // Find Clerk user by email
    const users = await clerk.users.getUserList({
      emailAddress: [email]
    });

    if (users.length === 0) {
      console.error(`❌ User not found in Clerk: ${email}`);
      console.log(`   💡 Run 'node scripts/create-test-users.js' first`);
      return null;
    }

    const clerkUser = users[0];
    console.log(`✅ Found Clerk user: ${clerkUser.id}`);

    // Sync to database
    const dbUser = await syncUserToDatabase(clerkUser, userData);

    // Update Clerk metadata
    const updatedUser = await updateClerkMetadata(clerkUser, userData);

    return {
      email,
      clerkId: clerkUser.id,
      databaseId: userData.databaseId,
      role: userData.role,
      success: true
    };

  } catch (error) {
    console.error(`❌ Failed to sync ${email}:`, error.message);
    return {
      email,
      error: error.message,
      success: false
    };
  }
}

async function verifyJWTTemplate() {
  console.log('\n🔍 Verifying JWT template configuration...');
  console.log('\n⚠️  IMPORTANT: Ensure your Clerk JWT template is configured as follows:');
  console.log('\n{');
  console.log('  "https://hasura.io/jwt/claims": {');
  console.log('    "metadata": "{{user.public_metadata}}",');
  console.log('    "x-hasura-role": "{{user.public_metadata.role}}",');
  console.log('    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",');
  console.log('    "x-hasura-default-role": "viewer",');
  console.log('    "x-hasura-allowed-roles": ["developer", "org_admin", "manager", "consultant", "viewer"],');
  console.log('    "x-hasura-clerk-user-id": "{{user.id}}"');
  console.log('  }');
  console.log('}');
  console.log('\n📌 Configure at: https://dashboard.clerk.com → JWT Templates → "hasura"');
}

async function main() {
  console.log('🚀 Enhanced Test User Sync Script');
  console.log('=================================');

  // Verify environment
  if (!process.env.CLERK_SECRET_KEY) {
    console.error('❌ CLERK_SECRET_KEY not found in .env.test');
    process.exit(1);
  }

  if (!process.env.CLERK_SECRET_KEY.startsWith('sk_test_')) {
    console.error('❌ CLERK_SECRET_KEY must be for test environment (sk_test_...)');
    process.exit(1);
  }

  const results = {
    success: [],
    failed: []
  };

  // Sync all test users
  for (const email of Object.keys(testUserData)) {
    const result = await syncTestUser(email);
    if (result) {
      if (result.success) {
        results.success.push(result);
      } else {
        results.failed.push(result);
      }
    }
  }

  // Summary
  console.log('\n📊 Sync Summary');
  console.log('===============');
  console.log(`✅ Successfully synced: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.success.length > 0) {
    console.log('\n✅ Successfully synced users:');
    results.success.forEach(user => {
      console.log(`   • ${user.email}`);
      console.log(`     - Clerk ID: ${user.clerkId}`);
      console.log(`     - Database ID: ${user.databaseId}`);
      console.log(`     - Role: ${user.role}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed users:');
    results.failed.forEach(user => {
      console.log(`   • ${user.email}: ${user.error}`);
    });
  }

  // Verify JWT template
  await verifyJWTTemplate();

  console.log('\n✅ Test user sync complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Verify JWT template is configured in Clerk dashboard');
  console.log('   2. Run: pnpm test:e2e');
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
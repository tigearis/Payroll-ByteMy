// scripts/create-test-users.js
// Script to automatically create test users in Clerk test environment

import { createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

const testUsers = [
  {
    emailAddress: 'developer@test.payroll.com',
    password: 'DevSecure2024!@#$',
    firstName: 'Test',
    lastName: 'Developer',
    publicMetadata: {
      role: 'developer',
      permissions: [
        'custom:payroll:read', 'custom:payroll:write', 'custom:payroll:delete', 'custom:payroll:assign',
        'custom:staff:read', 'custom:staff:write', 'custom:staff:delete', 'custom:staff:invite',
        'custom:client:read', 'custom:client:write', 'custom:client:delete',
        'custom:admin:manage', 'custom:settings:write', 'custom:billing:manage',
        'custom:reports:read', 'custom:reports:export', 'custom:audit:read', 'custom:audit:write'
      ],
      databaseId: '550e8400-e29b-41d4-a716-446655440001',
      assignedBy: 'system',
      assignedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  },
  {
    emailAddress: 'orgadmin@test.payroll.com',
    password: 'OrgAdmin2024!@#$',
    firstName: 'Test',
    lastName: 'OrgAdmin',
    publicMetadata: {
      role: 'org_admin',
      permissions: [
        'custom:payroll:read', 'custom:payroll:write',
        'custom:staff:read', 'custom:staff:write',
        'custom:client:read', 'custom:client:write',
        'custom:admin:manage', 'custom:settings:write',
        'custom:reports:read'
      ],
      databaseId: '550e8400-e29b-41d4-a716-446655440002',
      assignedBy: 'system',
      assignedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  },
  {
    emailAddress: 'manager@test.payroll.com',
    password: 'Manager2024!@#$',
    firstName: 'Test',
    lastName: 'Manager',
    publicMetadata: {
      role: 'manager',
      permissions: [
        'custom:payroll:read',
        'custom:staff:read',
        'custom:client:read',
        'custom:reports:read'
      ],
      databaseId: '550e8400-e29b-41d4-a716-446655440003',
      assignedBy: 'system',
      assignedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  },
  {
    emailAddress: 'consultant@test.payroll.com',
    password: 'Consultant2024!@#$',
    firstName: 'Test',
    lastName: 'Consultant',
    publicMetadata: {
      role: 'consultant',
      permissions: [
        'custom:payroll:read',
        'custom:client:read'
      ],
      databaseId: '550e8400-e29b-41d4-a716-446655440004',
      assignedBy: 'system',
      assignedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      customAccess: {
        restrictedPayrolls: ['test-payroll-1', 'test-payroll-2'],
        allowedClients: ['test-client-1', 'test-client-2']
      }
    }
  },
  {
    emailAddress: 'viewer@test.payroll.com',
    password: 'Viewer2024!@#$',
    firstName: 'Test',
    lastName: 'Viewer',
    publicMetadata: {
      role: 'viewer',
      permissions: [
        'custom:payroll:read'
      ],
      databaseId: '550e8400-e29b-41d4-a716-446655440005',
      assignedBy: 'system',
      assignedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  },
  {
    emailAddress: 'test@payroll.com',
    password: 'General2024!@#$',
    firstName: 'General',
    lastName: 'Test',
    publicMetadata: {
      role: 'viewer',
      permissions: [
        'custom:payroll:read'
      ],
      databaseId: '550e8400-e29b-41d4-a716-446655440006',
      assignedBy: 'system',
      assignedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  }
];

async function createTestUsers() {
  console.log('🚀 Starting test user creation...');
  console.log(`Using Clerk Secret Key: ${process.env.CLERK_SECRET_KEY?.substring(0, 20)}...`);
  
  if (!process.env.CLERK_SECRET_KEY || !process.env.CLERKSECRETKEY.startsWith('sk_test_')) {
    console.error('❌ Error: CLERK_SECRET_KEY must be a test environment key (starts with sk_test_)');
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  for (const userData of testUsers) {
    try {
      console.log(`\n📧 Creating user: ${userData.emailAddress}`);
      
      // Check if user already exists
      const { data: existingUsers, totalCount } = await clerk.users.getUserList({
        emailAddress: [userData.emailAddress]
      });

      if (existingUsers.length > 0) {
        console.log(`⚠️  User ${userData.emailAddress} already exists, skipping...`);
        continue;
      }

      // Create the user
      const user = await clerk.users.createUser({
        emailAddress: [userData.emailAddress],
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        publicMetadata: userData.publicMetadata,
        skipPasswordChecks: true, // For test environment
        skipPasswordRequirement: false
      });

      console.log(`✅ Successfully created user: ${user.emailAddresses[0].emailAddress}`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Role: ${userData.publicMetadata.role}`);
      console.log(`   Permissions: ${userData.publicMetadata.permissions.length} permissions assigned`);
      
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating user ${userData.emailAddress}:`);
      console.error(`   Error: ${error.message}`);
      if (error.errors) {
        error.errors.forEach(err => {
          console.error(`   - ${err.message} (${err.code})`);
        });
      }
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`❌ Errors: ${errorCount} users`);
  
  if (successCount > 0) {
    console.log('\n🎉 Test users created successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify users in Clerk Dashboard');
    console.log('2. Run test suite: pnpm test:e2e');
    console.log('3. Check user roles and permissions are correctly assigned');
  }

  if (errorCount > 0) {
    console.log('\n⚠️  Some users failed to create. Please check the errors above.');
    console.log('Common issues:');
    console.log('- Invalid Clerk secret key');
    console.log('- Network connectivity issues');
    console.log('- Users already exist');
    console.log('- Invalid email format or password requirements');
  }
}

async function listExistingUsers() {
  try {
    console.log('\n👥 Existing test users:');
    const { data: users, totalCount } = await clerk.users.getUserList({
      limit: 50
    });
    const testUsers = users.filter(user => 
      user.emailAddresses.some(email => 
        email.emailAddress.includes('@test.payroll.com') || 
        email.emailAddress.includes('@payroll.com')
      )
    );

    if (testUsers.length === 0) {
      console.log('No test users found.');
    } else {
      testUsers.forEach(user => {
        const email = user.emailAddresses[0]?.emailAddress;
        const role = user.publicMetadata?.role || 'No role';
        const databaseId = user.publicMetadata?.databaseId || 'No DB ID';
        console.log(`   📧 ${email} | Role: ${role} | DB ID: ${databaseId}`);
      });
    }
  } catch (error) {
    console.error('Error listing users:', error.message);
  }
}

async function deleteTestUsers() {
  console.log('🗑️  Deleting existing test users...');
  
  try {
    const { data: users, totalCount } = await clerk.users.getUserList({
      limit: 50
    });
    const testUsers = users.filter(user => 
      user.emailAddresses.some(email => 
        email.emailAddress.includes('@test.payroll.com') || 
        email.emailAddress === 'test@payroll.com'
      )
    );

    for (const user of testUsers) {
      const email = user.emailAddresses[0]?.emailAddress;
      try {
        await clerk.users.deleteUser(user.id);
        console.log(`✅ Deleted user: ${email}`);
      } catch (error) {
        console.error(`❌ Error deleting user ${email}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error deleting users:', error.message);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'create':
    createTestUsers();
    break;
  case 'list':
    listExistingUsers();
    break;
  case 'delete':
    deleteTestUsers();
    break;
  case 'recreate':
    deleteTestUsers().then(() => {
      setTimeout(createTestUsers, 2000); // Wait 2 seconds before recreating
    });
    break;
  default:
    console.log('Usage: node scripts/create-test-users.js [create|list|delete|recreate]');
    console.log('');
    console.log('Commands:');
    console.log('  create    - Create all test users');
    console.log('  list      - List existing test users');
    console.log('  delete    - Delete all test users');
    console.log('  recreate  - Delete and recreate all test users');
    break;
}
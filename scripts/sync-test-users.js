// scripts/sync-test-users.js
// Sync test users from Clerk to database

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const testUserEmails = [
  'developer@test.payroll.com',
  'orgadmin@test.payroll.com', 
  'manager@test.payroll.com',
  'consultant@test.payroll.com',
  'viewer@test.payroll.com'
];

async function syncTestUsers() {
  console.log('🔄 Syncing test users from Clerk to database...');
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  console.log(`Using base URL: ${baseUrl}`);

  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  for (const email of testUserEmails) {
    console.log(`\n👤 Processing ${email}...`);
    
    try {
      // Call the sync endpoint for each user
      const response = await fetch(`${baseUrl}/api/fix-user-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          force: true // Force sync even if user exists
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${email}: ${result.message || 'Synced successfully'}`);
        results.success.push({
          email,
          databaseId: result.user?.databaseId,
          role: result.user?.role
        });
      } else {
        console.log(`⚠️  ${email}: ${result.error || 'Sync failed'}`);
        results.failed.push({
          email,
          error: result.error || 'Unknown error'
        });
      }
    } catch (error) {
      console.error(`❌ ${email}: ${error.message}`);
      results.failed.push({
        email,
        error: error.message
      });
    }
  }

  // Summary
  console.log('\n🎉 Sync completed!');
  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully synced: ${results.success.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);
  console.log(`   ⏭️  Skipped: ${results.skipped.length}`);

  if (results.success.length > 0) {
    console.log('\n✅ Successfully synced users:');
    results.success.forEach(user => {
      console.log(`   • ${user.email} → Database ID: ${user.databaseId?.slice(0, 8)}... (${user.role})`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed users:');
    results.failed.forEach(user => {
      console.log(`   • ${user.email}: ${user.error}`);
    });
  }

  console.log('\n💡 Next steps:');
  console.log('   1. Run: pnpm test:data:seed (to create test data)');
  console.log('   2. Run: pnpm test:e2e (to run E2E tests)');
}

// Alternative: Direct database sync using admin secret
async function syncUsersDirect() {
  console.log('🔄 Attempting direct database sync with admin secret...');
  
  const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL;
  const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

  if (!HASURA_ADMIN_SECRET) {
    console.error('❌ HASURA_ADMIN_SECRET not found in .env.test');
    return;
  }

  // Test users data for direct insertion with proper UUIDs
  const testUsers = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Test Developer',
      email: 'developer@test.payroll.com',
      clerkUserId: 'user_test_developer_001',
      role: 'developer'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002', 
      name: 'Test Org Admin',
      email: 'orgadmin@test.payroll.com',
      clerkUserId: 'user_test_orgadmin_002',
      role: 'org_admin'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Test Manager', 
      email: 'manager@test.payroll.com',
      clerkUserId: 'user_test_manager_003',
      role: 'manager'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Test Consultant',
      email: 'consultant@test.payroll.com',
      clerkUserId: 'user_test_consultant_004',
      role: 'consultant',
      managerId: '550e8400-e29b-41d4-a716-446655440003'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Test Viewer',
      email: 'viewer@test.payroll.com', 
      clerkUserId: 'user_test_viewer_005',
      role: 'viewer',
      managerId: '550e8400-e29b-41d4-a716-446655440003'
    }
  ];

  for (const user of testUsers) {
    console.log(`\n👤 Inserting ${user.email}...`);
    
    // Use the custom root field name from metadata
    const mutation = {
      query: `
        mutation CreateUserInDatabase($user: users_insert_input!) {
          insertUser(
            object: $user
            on_conflict: {
              constraint: users_email_key
              update_columns: [name, clerkUserId, managerId, role]
            }
          ) {
            id
            email
            name
            role
          }
        }
      `,
      variables: { user }
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
        console.warn(`⚠️  ${user.email}: ${result.errors[0].message}`);
      } else {
        console.log(`✅ ${user.email}: Created in database with role ${result.data.insertUser.role}`);
      }
    } catch (error) {
      console.error(`❌ ${user.email}: ${error.message}`);
    }
  }
}

// Check if server is running
async function checkServerStatus() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  const command = process.argv[2] || 'sync';
  
  switch (command) {
    case 'direct':
      await syncUsersDirect();
      break;
    case 'check':
      const isRunning = await checkServerStatus();
      console.log(`Server status: ${isRunning ? '✅ Running' : '❌ Not running'}`);
      if (!isRunning) {
        console.log('💡 Start the server with: pnpm dev');
      }
      break;
    case 'sync':
    default:
      const serverRunning = await checkServerStatus();
      if (serverRunning) {
        await syncTestUsers();
      } else {
        console.log('⚠️  Server not running. Attempting direct database sync...');
        await syncUsersDirect();
      }
      break;
  }
}

main().catch(console.error);
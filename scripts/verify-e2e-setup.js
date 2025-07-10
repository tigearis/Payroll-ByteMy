#!/usr/bin/env node

// Verification script to ensure e2e test setup is working correctly
import { createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
});

const testUsers = [
  'developer@test.payroll.com',
  'orgadmin@test.payroll.com',
  'manager@test.payroll.com',
  'consultant@test.payroll.com',
  'viewer@test.payroll.com'
];

async function verifyClerkUsers() {
  console.log('🔍 Verifying Clerk users...');
  
  const results = [];
  
  for (const email of testUsers) {
    try {
      const users = await clerk.users.getUserList({
        emailAddress: [email]
      });
      
      if (users.data.length === 0) {
        results.push({
          email,
          status: 'missing',
          error: 'User not found in Clerk'
        });
        continue;
      }
      
      const user = users.data[0];
      const metadata = user.publicMetadata;
      
      // Check required metadata
      const hasRole = metadata?.role;
      const hasDatabaseId = metadata?.databaseId;
      const hasPermissions = metadata?.permissions && Array.isArray(metadata.permissions);
      
      results.push({
        email,
        status: hasRole && hasDatabaseId && hasPermissions ? 'complete' : 'incomplete',
        clerkId: user.id,
        role: metadata?.role,
        databaseId: metadata?.databaseId,
        permissions: metadata?.permissions?.length || 0,
        missing: [
          !hasRole && 'role',
          !hasDatabaseId && 'databaseId', 
          !hasPermissions && 'permissions'
        ].filter(Boolean)
      });
      
    } catch (error) {
      results.push({
        email,
        status: 'error',
        error: error.message
      });
    }
  }
  
  return results;
}

async function verifyDatabaseUsers() {
  console.log('🔍 Verifying database users...');
  
  const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL || process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

  if (!HASURA_ADMIN_SECRET) {
    return { error: 'HASURA_ADMIN_SECRET not found in environment' };
  }

  const query = {
    query: `
      query GetTestUsers {
        users(where: {email: {_in: [${testUsers.map(email => `"${email}"`).join(', ')}]}}) {
          id
          email
          name
          role
          clerk_user_id
          is_staff
          manager_id
        }
      }
    `
  };

  try {
    const response = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(query),
    });

    const result = await response.json();
    
    if (result.errors) {
      return { error: result.errors[0].message };
    }

    const dbUsers = result.data.users;
    const results = [];
    
    for (const email of testUsers) {
      const dbUser = dbUsers.find(u => u.email === email);
      results.push({
        email,
        exists: !!dbUser,
        id: dbUser?.id,
        role: dbUser?.role,
        clerkId: dbUser?.clerk_user_id,
        isStaff: dbUser?.is_staff
      });
    }
    
    return { users: results };
    
  } catch (error) {
    return { error: error.message };
  }
}

async function verifyJWTTemplate() {
  console.log('🔍 Checking JWT template configuration...');
  
  // We can't directly verify the JWT template via API, so we'll provide instructions
  return {
    configured: false, // Would need to be manually verified
    instructions: 'Verify JWT template is configured in Clerk Dashboard → JWT Templates → "hasura"'
  };
}

async function main() {
  console.log('🚀 E2E Setup Verification');
  console.log('=========================');
  
  // Check environment
  console.log('\n🔧 Checking environment variables...');
  const requiredVars = [
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_HASURA_GRAPHQL_URL',
    'HASURA_ADMIN_SECRET'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:');
    missingVars.forEach(varName => console.error(`   • ${varName}`));
    process.exit(1);
  }
  
  console.log('✅ All required environment variables present');
  
  // Verify Clerk users
  const clerkResults = await verifyClerkUsers();
  console.log('\n👥 Clerk Users Status:');
  clerkResults.forEach(result => {
    const statusIcon = result.status === 'complete' ? '✅' : 
                      result.status === 'incomplete' ? '⚠️' : '❌';
    console.log(`   ${statusIcon} ${result.email}: ${result.status}`);
    
    if (result.status === 'incomplete' && result.missing) {
      console.log(`     Missing: ${result.missing.join(', ')}`);
    }
    
    if (result.error) {
      console.log(`     Error: ${result.error}`);
    }
    
    if (result.status === 'complete') {
      console.log(`     Role: ${result.role}, Permissions: ${result.permissions}`);
    }
  });
  
  // Verify database users
  const dbResults = await verifyDatabaseUsers();
  console.log('\n🗃️  Database Users Status:');
  
  if (dbResults.error) {
    console.error(`❌ Database verification failed: ${dbResults.error}`);
  } else {
    dbResults.users.forEach(result => {
      const statusIcon = result.exists ? '✅' : '❌';
      console.log(`   ${statusIcon} ${result.email}: ${result.exists ? 'exists' : 'missing'}`);
      
      if (result.exists) {
        console.log(`     ID: ${result.id}, Role: ${result.role}`);
      }
    });
  }
  
  // JWT template check
  const jwtResults = await verifyJWTTemplate();
  console.log('\n🔐 JWT Template Status:');
  console.log(`   ⚠️  Manual verification required`);
  console.log(`   📌 ${jwtResults.instructions}`);
  
  // Summary
  const clerkComplete = clerkResults.filter(r => r.status === 'complete').length;
  const dbComplete = dbResults.users ? dbResults.users.filter(r => r.exists).length : 0;
  
  console.log('\n📊 Summary:');
  console.log(`   👥 Clerk users: ${clerkComplete}/${testUsers.length} complete`);
  console.log(`   🗃️  Database users: ${dbComplete}/${testUsers.length} synced`);
  
  if (clerkComplete === testUsers.length && dbComplete === testUsers.length) {
    console.log('\n🎉 E2E setup verification successful!');
    console.log('\n✅ Ready to run e2e tests:');
    console.log('   pnpm test:e2e');
  } else {
    console.log('\n⚠️  E2E setup needs attention:');
    
    if (clerkComplete < testUsers.length) {
      console.log('   1. Run: pnpm test:users:create');
    }
    
    if (dbComplete < testUsers.length) {
      console.log('   2. Run: pnpm test:users:sync:enhanced');
    }
    
    console.log('   3. Verify JWT template configuration in Clerk Dashboard');
    console.log('   4. Run this verification again: node scripts/verify-e2e-setup.js');
  }
}

main().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
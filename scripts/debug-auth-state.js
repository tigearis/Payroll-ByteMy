#!/usr/bin/env node

/**
 * Debug Authentication State
 * Diagnoses JWT template and user sync issues
 */

require('dotenv').config({ path: '.env.development.local' });
const { createClerkClient } = require('@clerk/backend');

async function debugAuthState() {
  try {
    console.log('🔍 Debugging Authentication State...\n');

    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // Get first few users to check their metadata
    const users = await clerkClient.users.getUserList({ limit: 5 });
    
    console.log(`📊 Found ${users.totalCount} users in Clerk`);
    console.log('👥 Checking user metadata structure:\n');

    for (const user of users.data) {
      console.log(`User: ${user.emailAddresses[0]?.emailAddress || 'No email'}`);
      console.log(`- ID: ${user.id}`);
      console.log(`- Public Metadata:`, user.publicMetadata);
      console.log(`- Private Metadata:`, user.privateMetadata);
      console.log(`- Role:`, user.publicMetadata?.role || 'No role');
      console.log(`- Database ID:`, user.publicMetadata?.databaseId || 'No database ID');
      console.log('---');
    }

    // Check JWT template configuration
    console.log('\n🔧 JWT Template Analysis:');
    console.log('Expected claims:');
    console.log('- x-hasura-user-id (from database ID)');
    console.log('- x-hasura-default-role (from role)');
    console.log('- x-hasura-allowed-roles (array with role)');
    
    const issuesFound = [];
    
    for (const user of users.data) {
      if (!user.publicMetadata?.databaseId) {
        issuesFound.push(`User ${user.emailAddresses[0]?.emailAddress}: Missing databaseId`);
      }
      if (!user.publicMetadata?.role) {
        issuesFound.push(`User ${user.emailAddresses[0]?.emailAddress}: Missing role`);
      }
    }

    if (issuesFound.length > 0) {
      console.log('\n⚠️ Issues found:');
      issuesFound.forEach(issue => console.log(`- ${issue}`));
    } else {
      console.log('\n✅ User metadata looks good');
    }

    console.log('\n📋 Next steps:');
    console.log('1. Configure Clerk JWT template with provided template');
    console.log('2. Ensure all users have databaseId in publicMetadata');
    console.log('3. Update useCurrentUser hook to use correct JWT claim names');

  } catch (error) {
    console.error('❌ Error debugging auth state:', error);
  }
}

debugAuthState();
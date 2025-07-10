#!/usr/bin/env node

/**
 * Test Nathan Harris Sync
 * 
 * Manually test the hierarchical sync for Nathan to see what happens
 */

import { config } from 'dotenv';
import { createClerkClient } from '@clerk/backend';

// Load environment variables
config({ path: '.env.development.local' });

async function testNathanSync() {
  console.log('🧪 Testing Nathan Harris Hierarchical Sync');
  console.log('==========================================\n');

  try {
    // Initialize Clerk client
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY
    });

    console.log('🔍 Step 1: Finding Nathan Harris in Clerk...');
    
    // Get all users and find Nathan
    const usersResponse = await clerk.users.getUserList({
      limit: 100,
      orderBy: 'created_at'
    });
    
    const nathan = usersResponse.data.find(user => 
      user.emailAddresses.some(email => 
        email.emailAddress === 'nathan.harris02@gmail.com'
      )
    );

    if (!nathan) {
      console.log('❌ Nathan Harris not found in Clerk');
      return;
    }

    console.log('✅ Found Nathan Harris:');
    console.log(`   Clerk ID: ${nathan.id}`);
    console.log(`   Email: ${nathan.emailAddresses[0]?.emailAddress}`);
    console.log(`   Name: ${nathan.firstName} ${nathan.lastName}`);
    console.log('');

    console.log('📊 Step 2: Current Nathan Metadata...');
    const currentMetadata = nathan.publicMetadata || {};
    
    console.log('Current Public Metadata:');
    Object.entries(currentMetadata).forEach(([key, value]) => {
      if (key === 'allowedRoles' || key === 'excludedPermissions') {
        console.log(`   ${key}: ${JSON.stringify(value)} ${value ? '✅' : '❌'}`);
      } else {
        console.log(`   ${key}: ${value}`);
      }
    });

    console.log('');
    console.log('🎯 Step 3: Hierarchical System Check...');
    
    const hasRole = !!currentMetadata.role;
    const hasAllowedRoles = Array.isArray(currentMetadata.allowedRoles);
    const hasExcludedPermissions = Array.isArray(currentMetadata.excludedPermissions);
    
    console.log(`   Has role: ${hasRole ? '✅' : '❌'} (${currentMetadata.role || 'NOT SET'})`);
    console.log(`   Has allowedRoles: ${hasAllowedRoles ? '✅' : '❌'}`);
    console.log(`   Has excludedPermissions: ${hasExcludedPermissions ? '✅' : '❌'}`);
    
    if (hasRole && hasAllowedRoles && hasExcludedPermissions) {
      console.log('\n🎉 Nathan is ready for hierarchical system!');
      
      // Calculate estimated JWT size
      const estimatedPayload = {
        role: currentMetadata.role,
        allowedRoles: currentMetadata.allowedRoles,
        excludedPermissions: currentMetadata.excludedPermissions
      };
      const estimatedSize = Math.ceil(JSON.stringify(estimatedPayload).length * 1.33) + 800;
      console.log(`📏 Estimated JWT size: ~${estimatedSize} bytes`);
      
    } else {
      console.log('\n⚠️ Nathan needs hierarchical sync!');
      console.log('🔧 To trigger sync:');
      console.log('1. Visit the app as Nathan');
      console.log('2. Call /api/sync-current-user');
      console.log('3. Or trigger a user.updated webhook');
    }

    console.log('\n🚀 Step 4: Testing Manual Sync...');
    console.log('Attempting to call sync endpoint...');
    
    // Try to call the sync endpoint (though it will likely fail due to auth)
    try {
      const response = await fetch('http://localhost:3000/api/sync-current-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log('Sync endpoint response:', result);
      
    } catch (fetchError) {
      console.log('❌ Could not call sync endpoint (expected - needs auth)');
      console.log('💡 Nathan needs to visit the app and trigger sync himself');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run test
testNathanSync()
  .then(() => {
    console.log('\n✅ Nathan sync test complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
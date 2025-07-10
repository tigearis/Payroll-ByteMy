#!/usr/bin/env node

/**
 * Simple JWT Template Check
 * 
 * Checks if users have required JWT template fields in Clerk
 */

import { clerkClient } from '@clerk/nextjs/server';

// Required JWT template fields
const REQUIRED_FIELDS = [
  'databaseId',
  'role', 
  'allowedRoles',
  'permissions',
  'permissionHash',
  'permissionVersion'
];

async function checkJWTImplementation() {
  console.log('🔍 JWT Template Implementation Check');
  console.log('===================================\n');

  try {
    // Get all users from Clerk
    console.log('👥 Fetching users from Clerk...');
    const client = await clerkClient();
    const response = await client.users.getUserList({
      limit: 100,
      orderBy: 'created_at'
    });

    const users = response.data;
    console.log(`✅ Found ${users.length} users in Clerk\n`);

    // Check each user's JWT template fields
    let completeUsers = 0;
    let incompleteUsers = 0;
    const issues = [];

    for (const user of users) {
      const email = user.emailAddresses[0]?.emailAddress || 'No email';
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No name';
      
      console.log(`\n👤 ${name} (${email})`);
      console.log(`   Clerk ID: ${user.id}`);

      const metadata = user.publicMetadata || {};
      
      // Check required fields
      const missingFields = [];
      const presentFields = [];

      for (const field of REQUIRED_FIELDS) {
        if (metadata[field] !== undefined && metadata[field] !== null) {
          presentFields.push(field);
          
          // Show field value (truncated for arrays)
          let value = metadata[field];
          if (Array.isArray(value)) {
            value = `Array(${value.length})`;
          } else if (typeof value === 'string' && value.length > 50) {
            value = value.substring(0, 50) + '...';
          }
          
          console.log(`   ✅ ${field}: ${value}`);
        } else {
          missingFields.push(field);
          console.log(`   ❌ ${field}: Missing`);
        }
      }

      // Additional checks
      if (metadata.isStaff !== undefined) {
        console.log(`   ✅ isStaff: ${metadata.isStaff}`);
      } else {
        console.log(`   ⚠️  isStaff: Not set (optional)`);
      }

      if (metadata.managerId) {
        console.log(`   ✅ managerId: ${metadata.managerId}`);
      } else {
        console.log(`   ⚠️  managerId: Not set (optional)`);
      }

      if (metadata.organizationId) {
        console.log(`   ✅ organizationId: ${metadata.organizationId}`);
      } else {
        console.log(`   ⚠️  organizationId: Not set (optional)`);
      }

      // Determine if user has complete JWT data
      if (missingFields.length === 0) {
        console.log(`   🎉 JWT Template: COMPLETE`);
        completeUsers++;
      } else {
        console.log(`   ❌ JWT Template: INCOMPLETE`);
        incompleteUsers++;
        issues.push({
          name,
          email,
          userId: user.id,
          missingFields
        });
      }
    }

    // Summary
    console.log('\n\n📊 JWT Template Implementation Summary');
    console.log('=====================================');
    console.log(`Total Users: ${users.length}`);
    console.log(`✅ Complete JWT Template: ${completeUsers}`);
    console.log(`❌ Incomplete JWT Template: ${incompleteUsers}`);
    
    const completionRate = Math.round((completeUsers / users.length) * 100);
    console.log(`📈 Completion Rate: ${completionRate}%`);

    if (issues.length > 0) {
      console.log('\n⚠️  Users Needing JWT Template Updates:');
      console.log('--------------------------------------');
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.name} (${issue.email})`);
        console.log(`   Missing: ${issue.missingFields.join(', ')}`);
      });

      console.log('\n🔧 Recommended Actions:');
      console.log('----------------------');
      console.log('1. Users will auto-sync on next login');
      console.log('2. Or manually trigger sync via /api/sync-current-user');
      console.log('3. Or run user sync script for all users');
    } else {
      console.log('\n🎉 All users have complete JWT template data!');
      console.log('The JWT template implementation is working perfectly.');
    }

    // Test sample JWT structure
    if (completeUsers > 0) {
      console.log('\n🧪 Sample JWT Claims Structure:');
      console.log('-------------------------------');
      
      const sampleUser = users.find(u => {
        const meta = u.publicMetadata || {};
        return REQUIREDFIELDS.every(field => meta[field] !== undefined);
      });

      if (sampleUser) {
        const meta = sampleUser.publicMetadata;
        const jwtClaims = {
          "x-hasura-user-id": meta.databaseId,
          "x-hasura-default-role": meta.role,
          "x-hasura-allowed-roles": meta.allowedRoles,
          "x-hasura-clerk-id": sampleUser.id,
          "x-hasura-manager-id": meta.managerId || null,
          "x-hasura-is-staff": meta.isStaff || false,
          "x-hasura-permissions": `Array(${meta.permissions?.length || 0})`,
          "x-hasura-permission-hash": meta.permissionHash?.substring(0, 16) + '...',
          "x-hasura-permission-version": meta.permissionVersion,
          "x-hasura-org-id": meta.organizationId || null
        };

        console.log(JSON.stringify(jwtClaims, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
    throw error;
  }
}

// Run the check
checkJWTImplementation()
  .then(() => {
    console.log('\n✅ JWT Template check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 JWT Template check failed:', error);
    process.exit(1);
  });
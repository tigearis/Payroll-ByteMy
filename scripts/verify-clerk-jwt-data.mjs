#!/usr/bin/env node

/**
 * Direct Clerk Backend Verification
 * 
 * Calls Clerk backend directly to check JWT template data for all users
 */

import { createClerkClient } from '@clerk/backend';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.development.local' });

// Required JWT template fields
const REQUIRED_FIELDS = [
  'databaseId',
  'role', 
  'allowedRoles',
  'permissions',
  'permissionHash',
  'permissionVersion'
];

async function verifyClerkJWTData() {
  console.log('🔍 Direct Clerk Backend JWT Verification');
  console.log('========================================\n');

  try {
    // Initialize Clerk client
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY
    });

    console.log('🔌 Connected to Clerk backend');
    console.log('👥 Fetching all users...\n');

    // Get all users from Clerk
    const response = await clerk.users.getUserList({
      limit: 100,
      orderBy: 'created_at'
    });

    const users = response.data;
    console.log(`✅ Found ${users.length} users in Clerk\n`);

    // Analysis variables
    let completeUsers = 0;
    let incompleteUsers = 0;
    const fieldStats = {};
    const issues = [];
    let sampleJWT = null;

    // Initialize field statistics
    REQUIRED_FIELDS.forEach(field => {
      fieldStats[field] = { present: 0, missing: 0 };
    });

    // Check each user
    for (const user of users) {
      const email = user.emailAddresses[0]?.emailAddress || 'No email';
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No name';
      
      console.log(`\n👤 ${name} (${email})`);
      console.log(`   Clerk ID: ${user.id}`);

      const publicMeta = user.publicMetadata || {};
      const privateMeta = user.privateMetadata || {};
      
      // Check where JWT fields are stored
      const jwtData = { ...publicMeta, ...privateMeta };
      
      // Analyze required fields
      const missingFields = [];
      const presentFields = [];

      for (const field of REQUIRED_FIELDS) {
        if (jwtData[field] !== undefined && jwtData[field] !== null) {
          presentFields.push(field);
          fieldStats[field].present++;
          
          // Display field value (truncated for readability)
          let value = jwtData[field];
          if (Array.isArray(value)) {
            value = `Array(${value.length})`;
          } else if (typeof value === 'string' && value.length > 50) {
            value = value.substring(0, 50) + '...';
          }
          
          console.log(`   ✅ ${field}: ${value}`);
        } else {
          missingFields.push(field);
          fieldStats[field].missing++;
          console.log(`   ❌ ${field}: Missing`);
        }
      }

      // Check optional fields
      const optionalFields = ['isStaff', 'managerId', 'organizationId'];
      optionalFields.forEach(field => {
        if (jwtData[field] !== undefined) {
          console.log(`   ✅ ${field}: ${jwtData[field]} (optional)`);
        } else {
          console.log(`   ⚠️  ${field}: Not set (optional)`);
        }
      });

      // Determine completeness
      if (missingFields.length === 0) {
        console.log(`   🎉 JWT Template: COMPLETE`);
        completeUsers++;
        
        // Capture sample JWT structure
        if (!sampleJWT && jwtData.permissions?.length > 0) {
          sampleJWT = {
            user: { name, email },
            jwtClaims: {
              "x-hasura-user-id": jwtData.databaseId,
              "x-hasura-default-role": jwtData.role,
              "x-hasura-allowed-roles": jwtData.allowedRoles,
              "x-hasura-clerk-id": user.id,
              "x-hasura-manager-id": jwtData.managerId || null,
              "x-hasura-is-staff": jwtData.isStaff || false,
              "x-hasura-permissions": `Array(${jwtData.permissions?.length || 0})`,
              "x-hasura-permission-hash": jwtData.permissionHash?.substring(0, 16) + '...',
              "x-hasura-permission-version": jwtData.permissionVersion,
              "x-hasura-org-id": jwtData.organizationId || null
            }
          };
        }
      } else {
        console.log(`   ❌ JWT Template: INCOMPLETE`);
        incompleteUsers++;
        issues.push({
          name,
          email,
          clerkId: user.id,
          missingFields,
          hasPublicMeta: Object.keys(publicMeta).length > 0,
          hasPrivateMeta: Object.keys(privateMeta).length > 0
        });
      }
    }

    // Generate comprehensive summary
    console.log('\n\n📊 Clerk Backend JWT Verification Summary');
    console.log('==========================================');
    console.log(`Total Users: ${users.length}`);
    console.log(`✅ Complete JWT Template: ${completeUsers}`);
    console.log(`❌ Incomplete JWT Template: ${incompleteUsers}`);
    
    const completionRate = users.length > 0 ? Math.round((completeUsers / users.length) * 100) : 0;
    console.log(`📈 Overall Completion Rate: ${completionRate}%\n`);

    // Field-by-field analysis
    console.log('📋 Field-by-Field Analysis:');
    console.log('---------------------------');
    REQUIRED_FIELDS.forEach(field => {
      const stats = fieldStats[field];
      const rate = users.length > 0 ? Math.round((stats.present / users.length) * 100) : 0;
      console.log(`${field}: ${stats.present}/${users.length} users (${rate}%)`);
    });

    // Issues breakdown
    if (issues.length > 0) {
      console.log('\n⚠️  Users Requiring JWT Template Updates:');
      console.log('----------------------------------------');
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.name} (${issue.email})`);
        console.log(`   Clerk ID: ${issue.clerkId}`);
        console.log(`   Missing Fields: ${issue.missingFields.join(', ')}`);
        console.log(`   Has Public Metadata: ${issue.hasPublicMeta}`);
        console.log(`   Has Private Metadata: ${issue.hasPrivateMeta}`);
      });

      console.log('\n🔧 Recommended Actions:');
      console.log('----------------------');
      console.log('1. Run user sync to populate missing JWT fields');
      console.log('2. Users will auto-sync on next login');
      console.log('3. Check /api/sync-current-user for manual sync');
    } else {
      console.log('\n🎉 All users have complete JWT template data!');
      console.log('The JWT template implementation is fully operational.');
    }

    // Sample JWT structure
    if (sampleJWT) {
      console.log('\n🧪 Sample Complete JWT Claims Structure:');
      console.log('---------------------------------------');
      console.log(`User: ${sampleJWT.user.name} (${sampleJWT.user.email})`);
      console.log('JWT Claims:');
      console.log(JSON.stringify(sampleJWT.jwtClaims, null, 2));
    }

    return {
      totalUsers: users.length,
      completeUsers,
      incompleteUsers,
      completionRate,
      fieldStats,
      issues,
      sampleJWT
    };

  } catch (error) {
    console.error('❌ Clerk verification failed:', error);
    throw error;
  }
}

// Run verification
verifyClerkJWTData()
  .then((results) => {
    console.log('\n✅ Clerk JWT verification completed successfully');
    
    // Summary status
    if (results.completionRate === 100) {
      console.log('🎯 STATUS: All users have complete JWT template data');
    } else {
      console.log(`⚠️  STATUS: ${results.incompleteUsers} users need JWT template updates`);
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Clerk verification failed:', error);
    process.exit(1);
  });
#!/usr/bin/env node

/**
 * JWT Template Implementation Verification Script
 * 
 * This script verifies that all users have the required JWT template fields
 * by checking both Clerk and Hasura backends directly.
 */

import { clerkClient } from '@clerk/nextjs/server';
import { adminApolloClient } from '../lib/apollo/unified-client.js';
import { gql } from '@apollo/client';
import { 
  getPermissionsForRole, 
  getAllowedRoles, 
  hashPermissions 
} from '../lib/permissions/enhanced-permissions.js';

// Required JWT template fields
const REQUIRED_JWT_FIELDS = [
  'databaseId',
  'role', 
  'allowedRoles',
  'permissions',
  'permissionHash',
  'permissionVersion',
  'isStaff',
  'managerId',
  'organizationId'
];

// GraphQL query to get all users from database
const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      clerkUserId
      name
      email
      role
      isStaff
      managerId
      createdAt
      updatedAt
    }
  }
`;

async function verifyJWTTemplateImplementation() {
  console.log('🔍 JWT Template Implementation Verification');
  console.log('==========================================\n');

  try {
    // Step 1: Get all users from database
    console.log('📊 Fetching users from Hasura...');
    const { data: hasuraData, errors } = await adminApolloClient.query({
      query: GET_ALL_USERS,
      fetchPolicy: 'network-only'
    });

    if (errors) {
      console.error('❌ Hasura query errors:', errors);
      return;
    }

    const databaseUsers = hasuraData?.users || [];
    console.log(`✅ Found ${databaseUsers.length} users in database\n`);

    // Step 2: Get all users from Clerk
    console.log('👥 Fetching users from Clerk...');
    const client = await clerkClient();
    const clerkUsers = await client.users.getUserList({
      limit: 100, // Adjust if you have more users
      orderBy: 'created_at'
    });

    console.log(`✅ Found ${clerkUsers.data.length} users in Clerk\n`);

    // Step 3: Verify JWT template fields for each user
    console.log('🔍 Verifying JWT template fields...\n');

    const results = {
      totalUsers: clerkUsers.data.length,
      usersWithCompleteJWT: 0,
      usersWithIncompleteJWT: 0,
      usersNotInDatabase: 0,
      fieldAnalysis: {},
      issues: []
    };

    // Initialize field analysis
    REQUIREDJWTFIELDS.forEach(field => {
      results.fieldAnalysis[field] = { present: 0, missing: 0 };
    });

    for (const clerkUser of clerkUsers.data) {
      console.log(`\n👤 Checking user: ${clerkUser.firstName} ${clerkUser.lastName} (${clerkUser.emailAddresses[0]?.emailAddress})`);
      console.log(`   Clerk ID: ${clerkUser.id}`);

      // Find corresponding database user
      const dbUser = databaseUsers.find(u => u.clerkUserId === clerkUser.id);
      
      if (!dbUser) {
        console.log('   ❌ User not found in database');
        results.usersNotInDatabase++;
        results.issues.push({
          userId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          issue: 'User exists in Clerk but not in database'
        });
        continue;
      }

      console.log(`   📊 Database ID: ${dbUser.id}`);
      console.log(`   🎭 Database Role: ${dbUser.role}`);

      // Check JWT template fields in Clerk metadata
      const publicMetadata = clerkUser.publicMetadata || {};
      const privateMetadata = clerkUser.privateMetadata || {};

      console.log('   🔍 JWT Template Fields:');
      
      let completeJWT = true;
      const userIssues = [];

      // Check each required field
      const fieldStatus = {
        databaseId: publicMetadata.databaseId,
        role: publicMetadata.role,
        allowedRoles: publicMetadata.allowedRoles,
        permissions: publicMetadata.permissions,
        permissionHash: publicMetadata.permissionHash,
        permissionVersion: publicMetadata.permissionVersion,
        isStaff: publicMetadata.isStaff,
        managerId: publicMetadata.managerId,
        organizationId: publicMetadata.organizationId
      };

      for (const [field, value] of Object.entries(fieldStatus)) {
        const hasValue = value !== undefined && value !== null;
        
        if (hasValue) {
          results.fieldAnalysis[field].present++;
          console.log(`     ✅ ${field}: ${field === 'permissions' ? `Array(${value?.length || 0})` : value}`);
        } else {
          results.fieldAnalysis[field].missing++;
          console.log(`     ❌ ${field}: Missing`);
          completeJWT = false;
          userIssues.push(`Missing ${field}`);
        }
      }

      // Validate permission consistency
      if (publicMetadata.role && publicMetadata.permissions) {
        const expectedPermissions = getPermissionsForRole(publicMetadata.role);
        const actualPermissions = publicMetadata.permissions;
        
        if (JSON.stringify(expectedPermissions.sort()) !== JSON.stringify(actualPermissions.sort())) {
          console.log('     ⚠️  Permission mismatch detected');
          userIssues.push('Permission array doesn\'t match role');
          completeJWT = false;
        }

        // Validate permission hash
        if (publicMetadata.permissionHash) {
          const expectedHash = hashPermissions(expectedPermissions);
          if (publicMetadata.permissionHash !== expectedHash) {
            console.log('     ⚠️  Permission hash mismatch');
            userIssues.push('Permission hash doesn\'t match calculated hash');
          }
        }
      }

      // Validate database consistency
      if (publicMetadata.databaseId !== dbUser.id) {
        console.log('     ❌ Database ID mismatch');
        userIssues.push('Clerk databaseId doesn\'t match database ID');
        completeJWT = false;
      }

      if (publicMetadata.role !== dbUser.role) {
        console.log('     ❌ Role mismatch');
        userIssues.push('Clerk role doesn\'t match database role');
        completeJWT = false;
      }

      if (completeJWT && userIssues.length === 0) {
        console.log('   ✅ JWT Template: Complete and valid');
        results.usersWithCompleteJWT++;
      } else {
        console.log('   ❌ JWT Template: Incomplete or invalid');
        results.usersWithIncompleteJWT++;
        results.issues.push({
          userId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          issues: userIssues
        });
      }
    }

    // Step 4: Generate summary report
    console.log('\n\n📊 JWT Template Implementation Summary');
    console.log('=====================================');
    console.log(`Total Users: ${results.totalUsers}`);
    console.log(`✅ Complete JWT Template: ${results.usersWithCompleteJWT}`);
    console.log(`❌ Incomplete JWT Template: ${results.usersWithIncompleteJWT}`);
    console.log(`🔍 Not in Database: ${results.usersNotInDatabase}`);

    console.log('\n📋 Field Coverage Analysis:');
    console.log('---------------------------');
    for (const [field, stats] of Object.entries(results.fieldAnalysis)) {
      const percentage = Math.round((stats.present / results.totalUsers) * 100);
      console.log(`${field.padEnd(20)}: ${stats.present}/${results.totalUsers} (${percentage}%)`);
    }

    if (results.issues.length > 0) {
      console.log('\n⚠️  Issues Found:');
      console.log('----------------');
      results.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.name || issue.email}`);
        if (issue.issues) {
          issue.issues.forEach(i => console.log(`   - ${i}`));
        } else {
          console.log(`   - ${issue.issue}`);
        }
      });

      console.log('\n🔧 Recommended Actions:');
      console.log('----------------------');
      console.log('1. Run user sync for users with incomplete JWT data');
      console.log('2. Check database synchronization for users not in database');
      console.log('3. Verify role assignments match between Clerk and database');
      console.log('4. Update permission hashes for users with mismatches');
    } else {
      console.log('\n🎉 All users have complete and valid JWT template data!');
    }

    // Step 5: Test a sample JWT token
    if (results.usersWithCompleteJWT > 0) {
      console.log('\n🧪 Testing JWT Token Generation...');
      
      // Find a user with complete JWT data
      const testUser = clerkUsers.data.find(user => {
        const meta = user.publicMetadata || {};
        return meta.databaseId && meta.role && meta.permissions;
      });

      if (testUser) {
        console.log(`Testing with user: ${testUser.emailAddresses[0]?.emailAddress}`);
        
        // Simulate JWT claims that would be generated
        const jwtClaims = {
          "x-hasura-user-id": testUser.publicMetadata.databaseId,
          "x-hasura-default-role": testUser.publicMetadata.role,
          "x-hasura-allowed-roles": testUser.publicMetadata.allowedRoles,
          "x-hasura-clerk-id": testUser.id,
          "x-hasura-manager-id": testUser.publicMetadata.managerId || null,
          "x-hasura-is-staff": testUser.publicMetadata.isStaff || false,
          "x-hasura-permissions": testUser.publicMetadata.permissions,
          "x-hasura-permission-hash": testUser.publicMetadata.permissionHash,
          "x-hasura-permission-version": testUser.publicMetadata.permissionVersion,
          "x-hasura-org-id": testUser.publicMetadata.organizationId || null
        };

        console.log('✅ Sample JWT Claims Structure:');
        console.log(JSON.stringify(jwtClaims, null, 2));
      }
    }

    console.log('\n✅ Verification Complete!');

  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

// Run the verification
verifyJWTTemplateImplementation()
  .then(() => {
    console.log('\n🎯 JWT Template verification completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 JWT Template verification failed:', error);
    process.exit(1);
  });
#!/usr/bin/env node

/**
 * JWT Template Integration Test
 * 
 * Tests that all JWT template fields are properly implemented:
 * - x-hasura-user-id
 * - x-hasura-clerk-id  
 * - x-hasura-user-email
 * - x-hasura-permissions
 * - x-hasura-default-role
 * - x-hasura-allowed-roles
 * - x-hasura-permission-hash
 * - x-hasura-permission-version
 */

import dotenv from 'dotenv';
import { createClient } from '@clerk/clerk-sdk-node';
import { getAllowedRoles, getPermissionsForRole, hashPermissions } from '../lib/permissions/enhanced-permissions.js';

// Load environment variables
dotenv.config();

// Initialize Clerk client
const clerk = createClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// JWT Template structure from the user's specification
const JWT_TEMPLATE = {
  "https://hasura.io/jwt/claims": {
    "x-hasura-user-id": "{{user.publicMetadata.databaseId}}",
    "x-hasura-clerk-id": "{{user.publicMetadata.user.id}}",
    "x-hasura-user-email": "{{user.primaryEmailAddress.emailAddress}}",
    "x-hasura-permissions": "{{user.privateMetadata.permissions}}",
    "x-hasura-default-role": "{{user.publicMetadata.role || 'viewer'}}",
    "x-hasura-allowed-roles": [
      "{{user.publicMetadata.role || 'viewer'}}"
    ],
    "x-hasura-permission-hash": "{{user.privateMetadata.permissionHash}}",
    "x-hasura-permission-version": "{{user.privateMetadata.permissionVersion}}"
  }
};

async function testJWTTemplateIntegration() {
  console.log('🔍 Testing JWT Template Integration...\n');
  
  let allTestsPassed = true;
  const issues = [];
  const recommendations = [];

  try {
    // Get all users to test metadata structure
    const users = await clerk.users.getUserList({ limit: 10 });
    
    console.log(`📊 Found ${users.data.length} users to test`);
    
    if (users.data.length === 0) {
      console.log('⚠️ No users found to test');
      return;
    }

    for (const user of users.data) {
      console.log(`\n🔍 Testing user: ${user.emailAddresses[0]?.emailAddress || 'Unknown'}`);
      
      const testResults = {
        hasPublicMetadata: !!user.publicMetadata,
        hasPrivateMetadata: !!user.privateMetadata,
        hasDatabaseId: !!(user.publicMetadata?.databaseId),
        hasRole: !!(user.publicMetadata?.role),
        hasUserObject: !!(user.publicMetadata?.user?.id),
        hasPermissions: !!(user.privateMetadata?.permissions),
        hasPermissionHash: !!(user.privateMetadata?.permissionHash),
        hasPermissionVersion: !!(user.privateMetadata?.permissionVersion),
        hasAllowedRoles: !!(user.privateMetadata?.allowedRoles),
      };

      // Test 1: Required public metadata fields
      console.log('  📋 Public Metadata:');
      console.log(`    ✓ databaseId: ${testResults.hasDatabaseId ? '✅' : '❌'} ${user.publicMetadata?.databaseId || 'missing'}`);
      console.log(`    ✓ role: ${testResults.hasRole ? '✅' : '❌'} ${user.publicMetadata?.role || 'missing'}`);
      console.log(`    ✓ user.id: ${testResults.hasUserObject ? '✅' : '❌'} ${user.publicMetadata?.user?.id || 'missing'}`);

      // Test 2: Required private metadata fields  
      console.log('  🔒 Private Metadata:');
      const permissions = user.privateMetadata?.permissions;
      console.log(`    ✓ permissions: ${testResults.hasPermissions ? '✅' : '❌'} ${Array.isArray(permissions) ? `${permissions.length} items` : 'missing'}`);
      console.log(`    ✓ permissionHash: ${testResults.hasPermissionHash ? '✅' : '❌'} ${user.privateMetadata?.permissionHash || 'missing'}`);
      console.log(`    ✓ permissionVersion: ${testResults.hasPermissionVersion ? '✅' : '❌'} ${user.privateMetadata?.permissionVersion || 'missing'}`);
      console.log(`    ✓ allowedRoles: ${testResults.hasAllowedRoles ? '✅' : '❌'} ${user.privateMetadata?.allowedRoles ? `${user.privateMetadata.allowedRoles.length} roles` : 'missing'}`);

      // Test 3: Validate permission consistency
      if (testResults.hasRole && testResults.hasPermissions) {
        const role = user.publicMetadata.role;
        const expectedPermissions = getPermissionsForRole(role);
        const expectedAllowedRoles = getAllowedRoles(role);
        const expectedHash = hashPermissions(expectedPermissions);
        
        const actualPermissions = user.privateMetadata.permissions;
        const actualHash = user.privateMetadata.permissionHash;
        const actualAllowedRoles = user.privateMetadata.allowedRoles;

        console.log('  🔄 Consistency Checks:');
        
        const permissionsMatch = JSON.stringify(expectedPermissions.sort()) === JSON.stringify(actualPermissions?.sort());
        console.log(`    ✓ permissions match role: ${permissionsMatch ? '✅' : '❌'}`);
        
        const hashMatches = expectedHash === actualHash;
        console.log(`    ✓ permission hash valid: ${hashMatches ? '✅' : '❌'}`);
        
        const rolesMatch = JSON.stringify(expectedAllowedRoles.sort()) === JSON.stringify(actualAllowedRoles?.sort());
        console.log(`    ✓ allowed roles match: ${rolesMatch ? '✅' : '❌'}`);

        if (!permissionsMatch || !hashMatches || !rolesMatch) {
          allTestsPassed = false;
          issues.push(`User ${user.emailAddresses[0]?.emailAddress} has inconsistent permissions`);
        }
      }

      // Test 4: JWT template field mapping
      console.log('  🎫 JWT Template Mapping:');
      const jwtFieldChecks = {
        'x-hasura-user-id': testResults.hasDatabaseId,
        'x-hasura-clerk-id': testResults.hasUserObject,
        'x-hasura-user-email': true, // This comes from Clerk directly
        'x-hasura-permissions': testResults.hasPermissions,
        'x-hasura-default-role': testResults.hasRole,
        'x-hasura-allowed-roles': testResults.hasRole, // Will be derived from role
        'x-hasura-permission-hash': testResults.hasPermissionHash,
        'x-hasura-permission-version': testResults.hasPermissionVersion,
      };

      for (const [field, isValid] of Object.entries(jwtFieldChecks)) {
        console.log(`    ✓ ${field}: ${isValid ? '✅' : '❌'}`);
        if (!isValid) {
          allTestsPassed = false;
          issues.push(`User ${user.emailAddresses[0]?.emailAddress} missing ${field} data`);
        }
      }

      console.log(`  📊 Overall: ${Object.values(jwtFieldChecks).every(v => v) ? '✅ PASS' : '❌ FAIL'}`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 JWT TEMPLATE INTEGRATION TEST SUMMARY');
    console.log('='.repeat(60));
    
    if (allTestsPassed) {
      console.log('✅ ALL TESTS PASSED - JWT template implementation is complete!');
      console.log('\n🎯 All required fields are properly structured:');
      console.log('   • x-hasura-user-id → user.publicMetadata.databaseId');
      console.log('   • x-hasura-clerk-id → user.publicMetadata.user.id');  
      console.log('   • x-hasura-user-email → user.primaryEmailAddress.emailAddress');
      console.log('   • x-hasura-permissions → user.privateMetadata.permissions');
      console.log('   • x-hasura-default-role → user.publicMetadata.role');
      console.log('   • x-hasura-allowed-roles → derived from role');
      console.log('   • x-hasura-permission-hash → user.privateMetadata.permissionHash');
      console.log('   • x-hasura-permission-version → user.privateMetadata.permissionVersion');
    } else {
      console.log(`❌ TESTS FAILED - ${issues.length} issue(s) found`);
      console.log('\n🔧 Issues to fix:');
      issues.forEach((issue, i) => console.log(`   ${i + 1}. ${issue}`));
      
      console.log('\n💡 Recommendations:');
      console.log('   1. Run user sync to populate missing metadata fields');
      console.log('   2. Update JWT template in Clerk to match the expected structure');
      console.log('   3. Verify permission hash calculations are consistent');
    }

    console.log('\n🔗 Next steps:');
    console.log('   1. Test JWT generation with a sample user');
    console.log('   2. Verify Hasura can decode all required claims');
    console.log('   3. Test permission enforcement with the new structure');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    allTestsPassed = false;
  }

  return allTestsPassed;
}

// Run the test
testJWTTemplateIntegration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
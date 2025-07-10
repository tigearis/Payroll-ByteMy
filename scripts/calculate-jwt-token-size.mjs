#!/usr/bin/env node

/**
 * Calculate JWT Token Size Impact
 * 
 * Analyzes the size impact of adding database permissions to JWT tokens
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

async function calculateJWTTokenSize() {
  console.log('📏 JWT Token Size Analysis');
  console.log('=========================\n');

  try {
    // Get actual permissions from database
    const response = await fetch(HASURA_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: `
          query GetPermissionSizes {
            permissions(limit: 200) {
              id
              action
              relatedResource {
                name
              }
            }
            
            rolePermissions(limit: 500) {
              id
              grantedPermission {
                action
                relatedResource {
                  name
                }
              }
              grantedToRole {
                name
              }
            }
          }
        `
      })
    });

    const result = await response.json();
    const { permissions, rolePermissions } = result.data;

    // Calculate permission strings
    const allPermissionStrings = permissions.map(p => 
      `${p.relatedResource.name}.${p.action}`
    );

    // Group by role
    const rolePermissions_grouped = {};
    rolePermissions.forEach(rp => {
      const roleName = rp.grantedToRole.name;
      const permissionString = `${rp.grantedPermission.relatedResource.name}.${rp.grantedPermission.action}`;
      
      if (!rolePermissions_grouped[roleName]) {
        rolePermissions_grouped[roleName] = [];
      }
      rolePermissions_grouped[roleName].push(permissionString);
    });

    console.log('📊 Permission Strings Analysis:');
    console.log('-------------------------------');
    
    // Calculate sizes for each role
    const roleSizes = {};
    Object.entries(rolePermissions_grouped).forEach(([role, perms]) => {
      const uniquePerms = [...new Set(perms)];
      const permissionsJSON = JSON.stringify(uniquePerms);
      const permissionsSize = Buffer.byteLength(permissionsJSON, 'utf8');
      
      roleSizes[role] = {
        count: uniquePerms.length,
        jsonSize: permissionsSize,
        samplePermissions: uniquePerms.slice(0, 5)
      };
      
      console.log(`${role}: ${uniquePerms.length} permissions, ${permissionsSize} bytes`);
      console.log(`  Sample: ${uniquePerms.slice(0, 3).join(', ')}...`);
    });

    console.log('\n🎭 Role Hierarchy Sizes:');
    console.log('------------------------');
    
    const allowedRolesExamples = {
      developer: ['developer', 'org_admin', 'manager', 'consultant', 'viewer'],
      org_admin: ['org_admin', 'manager', 'consultant', 'viewer'],
      manager: ['manager', 'consultant', 'viewer'],
      consultant: ['consultant', 'viewer'],
      viewer: ['viewer']
    };

    Object.entries(allowedRolesExamples).forEach(([role, allowedRoles]) => {
      const allowedRolesJSON = JSON.stringify(allowedRoles);
      const size = Buffer.byteLength(allowedRolesJSON, 'utf8');
      console.log(`${role} allowedRoles: ${size} bytes (${allowedRoles.join(', ')})`);
    });

    console.log('\n📦 Complete JWT Payload Size Estimation:');
    console.log('----------------------------------------');

    // Sample JWT payload for each role
    Object.entries(roleSizes).forEach(([role, data]) => {
      const samplePayload = {
        "iss": "https://harmless-primate-53.clerk.accounts.dev",
        "sub": "user_2yrXp6vS1bRpNSgaljiEGHHB2KN",
        "aud": "hasura",
        "exp": 1703123456,
        "iat": 1703123400,
        "x-hasura-user-id": "d9ac8a7b-f679-49a1-8c99-837eb977578b",
        "x-hasura-default-role": role,
        "x-hasura-allowed-roles": allowedRolesExamples[role] || ['viewer'],
        "x-hasura-clerk-id": "user_2yrXp6vS1bRpNSgaljiEGHHB2KN",
        "x-hasura-is-staff": "true",
        "x-hasura-manager-id": null,
        "x-hasura-permissions": rolePermissions_grouped[role] || [],
        "x-hasura-permission-hash": "abc123def456...",
        "x-hasura-permission-version": "1703123456789",
        "x-hasura-org-id": null
      };

      const payloadJSON = JSON.stringify(samplePayload);
      const payloadSize = Buffer.byteLength(payloadJSON, 'utf8');
      
      // JWT has 3 parts: header.payload.signature
      // Header ~= 150 bytes, Signature ~= 512 bytes (RS256)
      const estimatedJWTSize = Math.ceil(payloadSize * 1.33) + 150 + 512; // Base64 encoding adds ~33%
      
      console.log(`\n${role.toUpperCase()} JWT:`);
      console.log(`  Payload: ${payloadSize} bytes`);
      console.log(`  Estimated total JWT: ${estimatedJWTSize} bytes`);
      console.log(`  Permissions portion: ${data.jsonSize} bytes (${Math.round(data.jsonSize/payloadSize*100)}% of payload)`);
    });

    console.log('\n⚠️  JWT Size Considerations:');
    console.log('---------------------------');
    console.log('• HTTP Header limit: ~8KB (8192 bytes)');
    console.log('• Recommended JWT size: <4KB for headers');
    console.log('• Cookie size limit: ~4KB');
    console.log('• URL size limit: ~2KB');

    const developerSize = Math.ceil(roleSizes.developer?.jsonSize * 1.33) + 800; // rough estimate
    
    if (developerSize > 4096) {
      console.log(`\n🚨 WARNING: Developer JWT (~${developerSize} bytes) may exceed recommended limits!`);
      console.log('\n💡 Optimization Strategies:');
      console.log('1. 🎯 Permission Hashing: Replace permissions array with hash + server-side lookup');
      console.log('2. 🔗 Permission URL: Store permissions endpoint in JWT, fetch on demand');
      console.log('3. 📦 Compressed Permissions: Use abbreviated permission codes');
      console.log('4. 🎭 Role-Only JWT: Include only role hierarchy, lookup permissions server-side');
      console.log('5. 🔄 Refresh Strategy: Short-lived JWTs with refresh tokens');
    } else {
      console.log(`\n✅ JWT sizes appear manageable (largest: ~${developerSize} bytes)`);
    }

    console.log('\n🎯 Recommended Approach:');
    console.log('------------------------');
    
    if (developerSize > 3000) {
      console.log('📝 OPTION 1: Permission Hash + Server Lookup');
      console.log('   - JWT contains: role, allowedRoles, permissionHash');
      console.log('   - Server validates hash and looks up actual permissions');
      console.log('   - Pros: Small JWT size, secure, fast validation');
      console.log('   - Cons: Extra server lookup on permission checks');
      
      console.log('\n📝 OPTION 2: Role-Based JWT');
      console.log('   - JWT contains: role, allowedRoles only');
      console.log('   - Hasura uses roles for basic access control');
      console.log('   - Detailed permissions checked server-side');
      console.log('   - Pros: Smallest JWT, standard approach');
      console.log('   - Cons: Less granular Hasura-level control');
    } else {
      console.log('📝 CURRENT APPROACH: Full Permissions in JWT');
      console.log('   - Include all database permissions in JWT');
      console.log('   - Hasura has complete permission context');
      console.log('   - Pros: No server lookups, fastest runtime');
      console.log('   - Cons: Larger JWT size');
    }

    return {
      roleSizes,
      estimatedMaxSize: developerSize,
      exceedsRecommendedSize: developerSize > 4096
    };

  } catch (error) {
    console.error('❌ Size calculation failed:', error);
    throw error;
  }
}

// Run analysis
calculateJWTTokenSize()
  .then((results) => {
    console.log('\n✅ JWT size analysis completed');
    
    if (results.exceedsRecommendedSize) {
      console.log('⚠️  RECOMMENDATION: Consider permission optimization strategies');
    } else {
      console.log('✅ JWT sizes are within acceptable limits');
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Size analysis failed:', error);
    process.exit(1);
  });
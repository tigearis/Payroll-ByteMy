#!/usr/bin/env node

/**
 * Complete JWT Template System Verification
 * 
 * Comprehensive verification of JWT template implementation across:
 * - Clerk authentication backend (JWT metadata)
 * - Hasura GraphQL backend (database records)
 * - Cross-system consistency checks
 */

import { createClerkClient } from '@clerk/backend';
import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.development.local' });

// Configuration
const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// Required JWT template fields
const REQUIRED_JWT_FIELDS = [
  'databaseId',
  'role', 
  'allowedRoles',
  'permissions',
  'permissionHash',
  'permissionVersion'
];

async function getClerkUsers() {
  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
  });

  const response = await clerk.users.getUserList({
    limit: 100,
    orderBy: 'created_at'
  });

  return response.data;
}

async function getHasuraUsers() {
  const query = `
    query GetAllUsers {
      users(limit: 100) {
        id
        clerkUserId
        name
        email
        role
        isStaff
        managerId
        createdAt
      }
    }
  `;

  const response = await fetch(HASURA_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': HASURA_ADMIN_SECRET
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data.users;
}

function analyzeJWTFields(user) {
  const metadata = { ...user.publicMetadata, ...user.privateMetadata };
  
  const analysis = {
    present: [],
    missing: [],
    isComplete: false
  };

  REQUIRED_JWT_FIELDS.forEach(field => {
    if (metadata[field] !== undefined && metadata[field] !== null) {
      analysis.present.push(field);
    } else {
      analysis.missing.push(field);
    }
  });

  analysis.isComplete = analysis.missing.length === 0;
  return analysis;
}

function generateAllowedRoles(role) {
  const hierarchy = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
  const roleIndex = hierarchy.indexOf(role);
  return roleIndex !== -1 ? hierarchy.slice(roleIndex) : [role];
}

async function completeSystemVerification() {
  console.log('🏗️  Complete JWT Template System Verification');
  console.log('============================================\n');

  try {
    // Step 1: Fetch data from both systems
    console.log('📡 Step 1: Fetching data from both systems...');
    const [clerkUsers, hasuraUsers] = await Promise.all([
      getClerkUsers(),
      getHasuraUsers()
    ]);

    console.log(`✅ Clerk: ${clerkUsers.length} users`);
    console.log(`✅ Hasura: ${hasuraUsers.length} users\n`);

    // Step 2: Create user mapping
    console.log('🔗 Step 2: Cross-referencing user data...');
    const userMap = new Map();
    
    // Map Hasura users by Clerk ID
    hasuraUsers.forEach(dbUser => {
      if (dbUser.clerkUserId) {
        userMap.set(dbUser.clerkUserId, { hasura: dbUser });
      }
    });

    // Add Clerk data
    clerkUsers.forEach(clerkUser => {
      const existing = userMap.get(clerkUser.id) || {};
      userMap.set(clerkUser.id, { ...existing, clerk: clerkUser });
    });

    console.log(`🔗 Successfully mapped ${userMap.size} users\n`);

    // Step 3: Analyze each user
    console.log('🔍 Step 3: Analyzing JWT template implementation...\n');
    
    const analysis = {
      total: userMap.size,
      completeJWT: 0,
      incompleteJWT: 0,
      onlyInClerk: 0,
      onlyInHasura: 0,
      inconsistent: 0,
      issues: []
    };

    for (const [clerkId, userData] of userMap) {
      const { clerk: clerkUser, hasura: hasuraUser } = userData;
      
      if (!clerkUser) {
        analysis.onlyInHasura++;
        analysis.issues.push({
          type: 'only_in_hasura',
          hasuraUser,
          message: 'User exists in database but not in Clerk'
        });
        continue;
      }

      if (!hasuraUser) {
        analysis.onlyInClerk++;
        analysis.issues.push({
          type: 'only_in_clerk',
          clerkUser,
          message: 'User exists in Clerk but not in database'
        });
        continue;
      }

      // Analyze JWT fields
      const jwtAnalysis = analyzeJWTFields(clerkUser);
      const email = clerkUser.emailAddresses[0]?.emailAddress || 'No email';
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'No name';

      console.log(`👤 ${name} (${email})`);
      console.log(`   Clerk ID: ${clerkId}`);
      console.log(`   Database ID: ${hasuraUser.id}`);
      console.log(`   JWT Complete: ${jwtAnalysis.isComplete ? '✅' : '❌'}`);

      if (jwtAnalysis.isComplete) {
        analysis.completeJWT++;
        
        // Check consistency
        const metadata = { ...clerkUser.publicMetadata, ...clerkUser.privateMetadata };
        const inconsistencies = [];
        
        if (metadata.databaseId !== hasuraUser.id) {
          inconsistencies.push('Database ID mismatch');
        }
        
        if (metadata.role !== hasuraUser.role) {
          inconsistencies.push('Role mismatch');
        }

        if (inconsistencies.length > 0) {
          analysis.inconsistent++;
          console.log(`   ⚠️  Issues: ${inconsistencies.join(', ')}`);
          analysis.issues.push({
            type: 'inconsistent',
            name,
            email,
            inconsistencies
          });
        } else {
          console.log(`   ✅ All data consistent`);
        }

        // Show JWT structure sample (first complete user)
        if (analysis.completeJWT === 1) {
          console.log(`   🧪 Sample JWT Claims:`);
          console.log(`       x-hasura-user-id: ${metadata.databaseId}`);
          console.log(`       x-hasura-default-role: ${metadata.role}`);
          console.log(`       x-hasura-allowed-roles: [${metadata.allowedRoles?.join(', ')}]`);
          console.log(`       x-hasura-permissions: Array(${metadata.permissions?.length || 0})`);
        }

      } else {
        analysis.incompleteJWT++;
        console.log(`   ❌ Missing: ${jwtAnalysis.missing.join(', ')}`);
        
        analysis.issues.push({
          type: 'incomplete_jwt',
          name,
          email,
          clerkId,
          missingFields: jwtAnalysis.missing
        });
      }
      console.log('');
    }

    // Step 4: Generate recommendations
    console.log('📋 Step 4: System Analysis & Recommendations');
    console.log('==========================================\n');

    console.log('📊 Summary Statistics:');
    console.log(`   Total Users: ${analysis.total}`);
    console.log(`   ✅ Complete JWT Template: ${analysis.completeJWT}`);
    console.log(`   ❌ Incomplete JWT Template: ${analysis.incompleteJWT}`);
    console.log(`   🔴 Only in Clerk: ${analysis.onlyInClerk}`);
    console.log(`   🔵 Only in Hasura: ${analysis.onlyInHasura}`);
    console.log(`   ⚠️  Data Inconsistencies: ${analysis.inconsistent}`);

    const completionRate = analysis.total > 0 ? Math.round((analysis.completeJWT / analysis.total) * 100) : 0;
    console.log(`   📈 JWT Completion Rate: ${completionRate}%\n`);

    // Field-specific analysis
    console.log('🔍 Field Analysis:');
    const fieldStats = {};
    REQUIRED_JWT_FIELDS.forEach(field => fieldStats[field] = { present: 0, missing: 0 });

    clerkUsers.forEach(user => {
      const metadata = { ...user.publicMetadata, ...user.privateMetadata };
      REQUIRED_JWT_FIELDS.forEach(field => {
        if (metadata[field] !== undefined && metadata[field] !== null) {
          fieldStats[field].present++;
        } else {
          fieldStats[field].missing++;
        }
      });
    });

    REQUIRED_JWT_FIELDS.forEach(field => {
      const stats = fieldStats[field];
      const rate = clerkUsers.length > 0 ? Math.round((stats.present / clerkUsers.length) * 100) : 0;
      console.log(`   ${field}: ${stats.present}/${clerkUsers.length} users (${rate}%)`);
    });

    // Critical Issues
    const criticalIssues = analysis.issues.filter(issue => 
      issue.type === 'only_in_clerk' || issue.type === 'only_in_hasura' || issue.type === 'inconsistent'
    );

    if (criticalIssues.length > 0) {
      console.log('\n🚨 Critical Issues Requiring Immediate Attention:');
      criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.message || issue.type}`);
        if (issue.name) console.log(`   User: ${issue.name} (${issue.email})`);
        if (issue.inconsistencies) console.log(`   Issues: ${issue.inconsistencies.join(', ')}`);
      });
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    console.log('==================');

    if (completionRate === 100 && criticalIssues.length === 0) {
      console.log('🎉 Perfect! Your JWT template system is fully implemented and consistent.');
      console.log('✅ All users have complete JWT template data');
      console.log('✅ All data is consistent between Clerk and Hasura');
      console.log('✅ Permission system is ready for production');
    } else {
      if (analysis.incompleteJWT > 0) {
        console.log(`1. 🔧 Fix ${analysis.incompleteJWT} users with incomplete JWT template data:`);
        console.log('   - Run user sync via /api/sync-current-user endpoint');
        console.log('   - Users will auto-sync on next login');
        console.log('   - Consider bulk user sync script for all users');
      }

      if (criticalIssues.length > 0) {
        console.log(`2. 🚨 Resolve ${criticalIssues.length} critical data consistency issues`);
        console.log('   - Check Clerk-Hasura sync mechanisms');
        console.log('   - Verify webhook configurations');
        console.log('   - Manual data correction may be required');
      }

      if (fieldStats.allowedRoles.missing === clerkUsers.length) {
        console.log('3. 🎯 PRIORITY: allowedRoles field is missing for ALL users');
        console.log('   - This is the most critical missing field');
        console.log('   - Update user sync service to populate allowedRoles');
        console.log('   - Based on role hierarchy: developer → org_admin → manager → consultant → viewer');
      }
    }

    console.log('\n🔧 Quick Fix Commands:');
    console.log('   • Individual sync: Visit /api/sync-current-user while logged in');
    console.log('   • Check JWT status: Visit /api/debug/jwt-status while logged in');
    console.log('   • Admin verification: POST to /api/admin/verify-jwt-template with admin secret + role');

    return {
      completionRate,
      analysis,
      criticalIssues: criticalIssues.length,
      status: completionRate === 100 && criticalIssues.length === 0 ? 'perfect' : 'needs_work'
    };

  } catch (error) {
    console.error('❌ System verification failed:', error);
    throw error;
  }
}

// Run complete verification
completeSystemVerification()
  .then((results) => {
    console.log('\n🏁 Verification Complete');
    console.log('========================');
    
    if (results.status === 'perfect') {
      console.log('🎯 STATUS: JWT Template System is PERFECT ✅');
    } else {
      console.log(`⚠️  STATUS: System needs work (${results.completionRate}% complete, ${results.criticalIssues} critical issues)`);
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Complete system verification failed:', error);
    process.exit(1);
  });
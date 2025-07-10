#!/usr/bin/env node

/**
 * Direct Hasura Backend Verification
 * 
 * Calls Hasura backend directly to check user data and permissions
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// GraphQL query to get all users with role information
const GET_ALL_USERS_QUERY = `
  query GetAllUsersWithPermissions {
    users(limit: 100) {
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
    roles {
      name
      description
    }
  }
`;

async function verifyHasuraData() {
  console.log('🔍 Direct Hasura Backend Verification');
  console.log('====================================\n');

  try {
    console.log('🔌 Connecting to Hasura...');
    console.log(`📍 URL: ${HASURA_GRAPHQL_URL}`);

    // Make GraphQL request to Hasura
    const response = await fetch(HASURA_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: GET_ALL_USERS_QUERY
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    const { users, roles } = result.data;

    console.log(`✅ Connected to Hasura successfully`);
    console.log(`👥 Found ${users.length} users in database`);
    console.log(`🔐 Found ${roles.length} roles`);
    console.log('');

    // Analyze roles
    console.log('📋 Available Roles:');
    console.log('------------------');
    roles.forEach(role => {
      console.log(`${role.name}: ${role.description || 'No description'}`);
    });
    console.log('');

    // Role hierarchy
    const roleHierarchy = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];

    // Analyze each user
    console.log('👥 User Analysis:');
    console.log('================');

    const userStats = {
      total: users.length,
      byRole: {},
      withManager: 0,
      isStaff: 0,
      missingClerkId: 0
    };

    // Initialize role stats
    roleHierarchy.forEach(role => {
      userStats.byRole[role] = 0;
    });

    users.forEach(user => {
      console.log(`\n👤 ${user.name || 'No name'} (${user.email || 'No email'})`);
      console.log(`   Database ID: ${user.id}`);
      console.log(`   Clerk ID: ${user.clerkUserId || 'Missing'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Is Staff: ${user.isStaff}`);
      console.log(`   Manager ID: ${user.managerId || 'None'}`);
      console.log(`   Created: ${new Date(user.createdAt).toLocaleDateString()}`);

      // Update stats
      if (userStats.byRole[user.role] !== undefined) {
        userStats.byRole[user.role]++;
      }
      if (user.managerId) userStats.withManager++;
      if (user.isStaff) userStats.isStaff++;
      if (!user.clerkUserId) userStats.missingClerkId++;

      // Role validation
      if (roleHierarchy.includes(user.role)) {
        console.log(`   ✅ Valid role in hierarchy`);
      } else {
        console.log(`   ❌ Invalid role: ${user.role}`);
      }

      // Check for potential issues
      const issues = [];
      if (!user.clerkUserId) issues.push('Missing Clerk ID');
      if (!user.email) issues.push('Missing email');
      if (!user.role || !roleHierarchy.includes(user.role)) issues.push('Invalid role');
      
      if (issues.length > 0) {
        console.log(`   ⚠️  Issues: ${issues.join(', ')}`);
      } else {
        console.log(`   ✅ Database record looks good`);
      }
    });

    // Summary statistics
    console.log('\n\n📊 Hasura Database Summary');
    console.log('==========================');
    console.log(`Total Users: ${userStats.total}`);
    console.log(`Users with Manager: ${userStats.withManager}`);
    console.log(`Staff Users: ${userStats.isStaff}`);
    console.log(`Missing Clerk ID: ${userStats.missingClerkId}`);
    console.log('');

    console.log('👥 Users by Role:');
    console.log('----------------');
    roleHierarchy.forEach(role => {
      console.log(`${role}: ${userStats.byRole[role]} users`);
    });

    // Role hierarchy analysis
    console.log('\n🔑 Role Hierarchy Analysis:');
    console.log('--------------------------');
    roleHierarchy.forEach((role, index) => {
      const userCount = userStats.byRole[role];
      const allowedRoles = roleHierarchy.slice(index);
      console.log(`${role}: ${userCount} users → inherits: ${allowedRoles.join(', ')}`);
    });

    // Data consistency checks
    console.log('\n🔍 Data Consistency Checks:');
    console.log('---------------------------');
    
    const consistencyIssues = [];
    
    // Check for orphaned managers
    users.forEach(user => {
      if (user.managerId && !users.find(u => u.id === user.managerId)) {
        consistencyIssues.push(`${user.name}: References missing manager ${user.managerId}`);
      }
    });
    
    // Check for users without Clerk IDs
    const usersWithoutClerk = users.filter(u => !u.clerkUserId);
    if (usersWithoutClerk.length > 0) {
      consistencyIssues.push(`${usersWithoutClerk.length} users missing Clerk IDs`);
    }
    
    // Check role validity
    const invalidRoles = users.filter(u => !roleHierarchy.includes(u.role));
    if (invalidRoles.length > 0) {
      consistencyIssues.push(`${invalidRoles.length} users with invalid roles`);
    }

    if (consistencyIssues.length === 0) {
      console.log('✅ All data consistency checks passed');
    } else {
      console.log('⚠️  Data consistency issues found:');
      consistencyIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    return {
      users,
      roles,
      userStats,
      consistencyIssues
    };

  } catch (error) {
    console.error('❌ Hasura verification failed:', error);
    throw error;
  }
}

// Run verification
verifyHasuraData()
  .then((results) => {
    console.log('\n✅ Hasura verification completed successfully');
    
    if (results.consistencyIssues.length === 0) {
      console.log('🎯 STATUS: Database is consistent and ready');
    } else {
      console.log(`⚠️  STATUS: ${results.consistencyIssues.length} data consistency issues found`);
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Hasura verification failed:', error);
    process.exit(1);
  });
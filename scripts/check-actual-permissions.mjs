#!/usr/bin/env node

/**
 * Check Actual Permissions Data
 * 
 * Uses the correct GraphQL field names to access permission data
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// Correct permission queries based on Hasura metadata
const PERMISSION_DATA_QUERY = `
  query GetPermissionSystemData {
    permissions(limit: 200) {
      id
      resourceId
      action
      description
      legacyPermissionName
      createdAt
      updatedAt
      relatedResource {
        id
        name
        displayName
        description
      }
    }
    
    resources(limit: 100) {
      id
      name
      displayName
      description
      createdAt
      updatedAt
    }
    
    rolePermissions(limit: 500) {
      id
      roleId
      permissionId
      conditions
      createdAt
      updatedAt
      grantedPermission {
        id
        action
        description
        relatedResource {
          name
        }
      }
      grantedToRole {
        id
        name
        displayName
      }
    }
    
    userRoles(limit: 100) {
      id
      userId
      roleId
      createdAt
      updatedAt
      assignedRole {
        id
        name
        displayName
        description
      }
      roleUser {
        id
        name
        email
        role
      }
    }
    
    roles {
      id
      name
      displayName
      description
      priority
      isSystemRole
      createdAt
      updatedAt
    }
    
    users {
      id
      name
      email
      role
      isStaff
      managerId
      clerkUserId
      createdAt
    }
    
    permissionOverrides(limit: 100) {
      id
      userId
      role
      resource
      operation
      granted
      reason
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

async function checkActualPermissions() {
  console.log('🔍 Actual Permission System Data Check');
  console.log('=====================================\n');

  try {
    console.log('🔌 Connecting to Hasura with admin secret...');
    console.log(`📍 URL: ${HASURA_GRAPHQL_URL}\n`);

    const response = await fetch(HASURA_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: PERMISSION_DATA_QUERY
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

    const {
      permissions,
      resources,
      rolePermissions,
      userRoles,
      roles,
      users,
      permissionOverrides
    } = result.data;

    console.log('✅ Successfully retrieved permission system data!\n');

    // Overview
    console.log('📊 Permission System Overview:');
    console.log('==============================');
    console.log(`🔑 Permissions: ${permissions.length}`);
    console.log(`📦 Resources: ${resources.length}`);
    console.log(`🔗 Role-Permission Mappings: ${rolePermissions.length}`);
    console.log(`👤 User-Role Assignments: ${userRoles.length}`);
    console.log(`🎭 Roles: ${roles.length}`);
    console.log(`👥 Users: ${users.length}`);
    console.log(`⚠️  Permission Overrides: ${permissionOverrides.length}\n`);

    // Detailed analysis
    if (resources.length > 0) {
      console.log('📦 Available Resources:');
      console.log('----------------------');
      resources.forEach(resource => {
        console.log(`   • ${resource.name}: ${resource.description || 'No description'}`);
      });
      console.log('');
    }

    if (permissions.length > 0) {
      console.log('🔑 Available Permissions (first 20):');
      console.log('-----------------------------------');
      permissions.slice(0, 20).forEach(permission => {
        const resourceName = permission.relatedResource?.name || 'unknown';
        console.log(`   • ${permission.legacyPermissionName || `${resourceName}.${permission.action}`}: ${resourceName}.${permission.action}`);
        if (permission.description) {
          console.log(`     Description: ${permission.description}`);
        }
      });
      if (permissions.length > 20) {
        console.log(`   ... and ${permissions.length - 20} more permissions`);
      }
      console.log('');
    }

    if (roles.length > 0) {
      console.log('🎭 System Roles:');
      console.log('---------------');
      roles
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .forEach(role => {
          const assignedPermissions = rolePermissions.filter(rp => rp.roleId === role.id);
          console.log(`   • ${role.name} (Priority: ${role.priority || 0})`);
          console.log(`     Display: ${role.displayName || role.name}`);
          console.log(`     Description: ${role.description || 'No description'}`);
          console.log(`     Permissions: ${assignedPermissions.length}`);
          console.log(`     System Role: ${role.isSystemRole ? 'Yes' : 'No'}`);
        });
      console.log('');
    }

    if (userRoles.length > 0) {
      console.log('👤 User Role Assignments:');
      console.log('------------------------');
      
      // Group by user
      const userRoleMap = {};
      userRoles.forEach(ur => {
        if (!userRoleMap[ur.userId]) {
          userRoleMap[ur.userId] = [];
        }
        userRoleMap[ur.userId].push(ur.roleId);
      });

      Object.entries(userRoleMap).forEach(([userId, roleIds]) => {
        const user = users.find(u => u.id === userId);
        const userRoleNames = roleIds.map(roleId => {
          const role = roles.find(r => r.id === roleId);
          return role ? role.name : `Unknown(${roleId})`;
        });
        
        if (user) {
          console.log(`   • ${user.name} (${user.email})`);
          console.log(`     Database Role: ${user.role}`);
          console.log(`     Assigned Roles: ${userRoleNames.join(', ')}`);
        }
      });
      console.log('');
    } else {
      console.log('👤 User Role Analysis:');
      console.log('---------------------');
      console.log('❌ No user-role assignments found in user_roles table');
      console.log('ℹ️  Users have roles stored directly on user records:');
      
      const roleCount = {};
      users.forEach(user => {
        roleCount[user.role] = (roleCount[user.role] || 0) + 1;
      });
      
      Object.entries(roleCount).forEach(([role, count]) => {
        console.log(`   • ${role}: ${count} users`);
      });
      console.log('');
    }

    if (permissionOverrides.length > 0) {
      console.log('⚠️  Permission Overrides:');
      console.log('------------------------');
      permissionOverrides.forEach(override => {
        console.log(`   • ${override.resource}.${override.operation}: ${override.granted ? 'GRANTED' : 'DENIED'}`);
        if (override.userId) {
          const user = users.find(u => u.id === override.userId);
          console.log(`     User: ${user ? user.name : 'Unknown'}`);
        }
        if (override.role) {
          console.log(`     Role: ${override.role}`);
        }
        console.log(`     Reason: ${override.reason || 'No reason given'}`);
        if (override.expiresAt) {
          console.log(`     Expires: ${new Date(override.expiresAt).toLocaleDateString()}`);
        }
      });
      console.log('');
    }

    // Permission analysis by role
    if (rolePermissions.length > 0) {
      console.log('🔗 Permission Analysis by Role:');
      console.log('------------------------------');
      
      const rolePermissionMap = {};
      rolePermissions.forEach(rp => {
        const roleName = rp.grantedToRole?.name || 'Unknown';
        if (!rolePermissionMap[roleName]) {
          rolePermissionMap[roleName] = [];
        }
        rolePermissionMap[roleName].push(rp);
      });

      Object.entries(rolePermissionMap).forEach(([roleName, rps]) => {
        console.log(`\n   ${roleName} (${rps.length} permissions):`);
        
        // Group by resource
        const resourceMap = {};
        rps.forEach(rp => {
          const perm = rp.grantedPermission;
          const resourceName = perm?.relatedResource?.name || 'unknown';
          if (!resourceMap[resourceName]) {
            resourceMap[resourceName] = [];
          }
          resourceMap[resourceName].push(perm?.action || 'unknown');
        });

        Object.entries(resourceMap).forEach(([resource, actions]) => {
          console.log(`     • ${resource}: ${actions.join(', ')}`);
        });
      });
    }

    return {
      permissions,
      resources,
      rolePermissions,
      userRoles,
      roles,
      users,
      permissionOverrides,
      summary: {
        hasPermissionSystem: permissions.length > 0,
        hasRolePermissions: rolePermissions.length > 0,
        hasUserRoles: userRoles.length > 0,
        usesDirectRoles: userRoles.length === 0 && users.every(u => u.role)
      }
    };

  } catch (error) {
    console.error('❌ Permission data check failed:', error);
    throw error;
  }
}

// Run the check
checkActualPermissions()
  .then((results) => {
    console.log('\n🏁 Permission System Analysis Complete');
    console.log('=====================================');
    
    if (results.summary.hasPermissionSystem && results.summary.hasRolePermissions) {
      console.log('🎯 STATUS: Full permission system is active and populated');
    } else if (results.summary.hasPermissionSystem) {
      console.log('🎯 STATUS: Permission system exists but may need role assignments');
    } else {
      console.log('🎯 STATUS: No permission system - using simplified roles');
    }

    if (results.summary.usesDirectRoles) {
      console.log('ℹ️  NOTE: Users have roles stored directly rather than via user_roles table');
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Permission data check failed:', error);
    process.exit(1);
  });
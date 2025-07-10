#!/usr/bin/env node

/**
 * Check Database Permissions
 * 
 * Examines all permission-related tables in the database
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// Comprehensive query to check all permission-related data
const CHECK_PERMISSIONS_QUERY = `
  query CheckAllPermissions {
    # Check if these tables exist and have data
    permissions {
      id
      name
      resource
      action
      description
    }
    
    roles {
      id
      name
      description
    }
    
    role_permissions {
      id
      roleId
      permissionId
      role {
        name
      }
      permission {
        name
        resource
        action
      }
    }
    
    user_roles {
      id
      userId
      roleId
      user {
        name
        email
        role
      }
      role {
        name
      }
    }
    
    users {
      id
      name
      email
      role
      clerkUserId
    }
  }
`;

async function checkDatabasePermissions() {
  console.log('🔍 Database Permissions Check');
  console.log('============================\n');

  try {
    console.log('🔌 Connecting to Hasura database...');
    console.log(`📍 URL: ${HASURA_GRAPHQL_URL}\n`);

    const response = await fetch(HASURA_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        'x-hasura-role': 'developer'
      },
      body: JSON.stringify({
        query: CHECK_PERMISSIONS_QUERY
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.log('⚠️  Some tables may not exist. Checking individual tables...\n');
      
      // Try individual queries for tables that might exist
      const individualQueries = [
        { name: 'users', query: 'query { users { id name email role } }' },
        { name: 'roles', query: 'query { roles { id name description } }' },
        { name: 'permissions', query: 'query { permissions { id name resource action } }' },
        { name: 'role_permissions', query: 'query { role_permissions { id roleId permissionId } }' },
        { name: 'user_roles', query: 'query { user_roles { id userId roleId } }' }
      ];

      const existingTables = {};

      for (const { name, query } of individualQueries) {
        try {
          const testResponse = await fetch(HASURA_GRAPHQL_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
              'x-hasura-role': 'developer'
            },
            body: JSON.stringify({ query })
          });

          const testResult = await testResponse.json();
          
          if (!testResult.errors) {
            existingTables[name] = testResult.data[name];
            console.log(`✅ Table '${name}': ${testResult.data[name].length} records`);
          } else {
            console.log(`❌ Table '${name}': Does not exist or no access`);
          }
        } catch (error) {
          console.log(`❌ Table '${name}': Error checking - ${error.message}`);
        }
      }

      // Analyze what we found
      console.log('\n📊 Database Permission System Analysis:');
      console.log('======================================');

      if (existingTables.users) {
        console.log(`\n👥 Users (${existingTables.users.length}):`);
        existingTables.users.forEach(user => {
          console.log(`   • ${user.name || 'No name'} (${user.email || 'No email'}) - Role: ${user.role}`);
        });
      }

      if (existingTables.roles) {
        console.log(`\n🔐 Roles (${existingTables.roles.length}):`);
        existingTables.roles.forEach(role => {
          console.log(`   • ${role.name}: ${role.description || 'No description'}`);
        });
      }

      if (existingTables.permissions) {
        console.log(`\n🔑 Permissions (${existingTables.permissions.length}):`);
        existingTables.permissions.forEach(permission => {
          console.log(`   • ${permission.name}: ${permission.resource}.${permission.action}`);
        });
      } else {
        console.log('\n❌ No permissions table found');
      }

      if (existingTables.role_permissions) {
        console.log(`\n🔗 Role-Permission Mappings (${existingTables.role_permissions.length}):`);
        existingTables.role_permissions.forEach(mapping => {
          console.log(`   • Role ${mapping.roleId} → Permission ${mapping.permissionId}`);
        });
      } else {
        console.log('\n❌ No role_permissions table found');
      }

      if (existingTables.user_roles) {
        console.log(`\n👤 User-Role Mappings (${existingTables.user_roles.length}):`);
        existingTables.user_roles.forEach(mapping => {
          console.log(`   • User ${mapping.userId} → Role ${mapping.roleId}`);
        });
      } else {
        console.log('\n❌ No user_roles table found');
      }

      // Summary
      console.log('\n🎯 Permission System Status:');
      console.log('---------------------------');
      
      const hasPermissionTables = existingTables.permissions && existingTables.role_permissions;
      const hasUserRoles = existingTables.user_roles;
      const usersHaveRoleField = existingTables.users && existingTables.users.some(u => u.role);

      if (hasPermissionTables) {
        console.log('✅ Permission system tables exist');
        console.log(`   • ${existingTables.permissions.length} permissions defined`);
        console.log(`   • ${existingTables.role_permissions.length} role-permission mappings`);
      } else {
        console.log('❌ Permission system tables missing or empty');
      }

      if (hasUserRoles) {
        console.log(`✅ User-role mappings exist (${existingTables.user_roles.length} mappings)`);
      } else if (usersHaveRoleField) {
        console.log('⚠️  No user_roles table, but users have role field directly');
        console.log('   This suggests a simplified role system without separate role assignments');
      } else {
        console.log('❌ No user role assignments found');
      }

      return {
        existingTables,
        hasPermissionSystem: hasPermissionTables,
        hasUserRoles,
        usersHaveDirectRoles: usersHaveRoleField
      };

    } else {
      // Success - all tables accessible
      const data = result.data;
      
      console.log('✅ Successfully accessed all permission tables!\n');
      
      console.log('📊 Complete Permission System Overview:');
      console.log('=====================================');
      console.log(`👥 Users: ${data.users.length}`);
      console.log(`🔐 Roles: ${data.roles.length}`);
      console.log(`🔑 Permissions: ${data.permissions.length}`);
      console.log(`🔗 Role-Permission Mappings: ${data.role_permissions.length}`);
      console.log(`👤 User-Role Assignments: ${data.user_roles.length}\n`);

      // Detailed analysis
      if (data.permissions.length > 0) {
        console.log('🔑 Available Permissions:');
        console.log('------------------------');
        data.permissions.forEach(permission => {
          console.log(`   • ${permission.name}: ${permission.resource}.${permission.action}`);
          if (permission.description) {
            console.log(`     Description: ${permission.description}`);
          }
        });
        console.log('');
      }

      if (data.role_permissions.length > 0) {
        console.log('🔗 Role-Permission Assignments:');
        console.log('------------------------------');
        
        // Group by role
        const rolePermissionMap = {};
        data.role_permissions.forEach(rp => {
          const roleName = rp.role.name;
          if (!rolePermissionMap[roleName]) {
            rolePermissionMap[roleName] = [];
          }
          rolePermissionMap[roleName].push(`${rp.permission.resource}.${rp.permission.action}`);
        });

        Object.entries(rolePermissionMap).forEach(([role, permissions]) => {
          console.log(`   ${role}: ${permissions.length} permissions`);
          permissions.forEach(permission => {
            console.log(`     • ${permission}`);
          });
        });
        console.log('');
      }

      if (data.user_roles.length > 0) {
        console.log('👤 User Role Assignments:');
        console.log('------------------------');
        data.user_roles.forEach(ur => {
          console.log(`   • ${ur.user.name} (${ur.user.email}) → ${ur.role.name}`);
        });
        console.log('');
      }

      return {
        data,
        hasPermissionSystem: data.permissions.length > 0,
        hasRolePermissions: data.role_permissions.length > 0,
        hasUserRoles: data.user_roles.length > 0
      };
    }

  } catch (error) {
    console.error('❌ Database permissions check failed:', error);
    throw error;
  }
}

// Run the check
checkDatabasePermissions()
  .then((results) => {
    console.log('\n🏁 Database Permissions Check Complete');
    console.log('=====================================');
    
    if (results.hasPermissionSystem) {
      console.log('🎯 STATUS: Full permission system detected in database');
    } else if (results.usersHaveDirectRoles) {
      console.log('🎯 STATUS: Simplified role system (roles stored directly on users)');
    } else {
      console.log('🎯 STATUS: No permission system detected');
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database permissions check failed:', error);
    process.exit(1);
  });
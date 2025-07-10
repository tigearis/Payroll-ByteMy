#!/usr/bin/env node

/**
 * Test Permission System
 * 
 * This script tests the current state of the permission system
 * by querying the database and checking if permissions are properly set up
 */

import { execSync } from 'child_process';

const HASURA_ENDPOINT = 'https://hasura.bytemy.com.au/v1/graphql';
const ADMIN_SECRET = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';

async function testPermissionSetup() {
  console.log('🔍 Testing Permission System Setup...\n');

  try {
    // Test 1: Check if resources exist
    const resourcesQuery = `
      query GetResources {
        resources {
          id
          name
          display_name
          description
        }
      }
    `;

    const resourcesResult = await queryHasura(resourcesQuery);
    console.log(`✅ Resources found: ${resourcesResult.data.resources.length}`);
    
    if (resourcesResult.data.resources.length > 0) {
      console.log('   Sample resources:', resourcesResult.data.resources.slice(0, 3).map(r => r.name).join(', '));
    }

    // Test 2: Check if permissions exist
    const permissionsQuery = `
      query GetPermissions {
        permissions {
          id
          action
          resource {
            name
          }
        }
      }
    `;

    const permissionsResult = await queryHasura(permissionsQuery);
    console.log(`✅ Permissions found: ${permissionsResult.data.permissions.length}`);

    // Test 3: Check role permissions
    const rolePermissionsQuery = `
      query GetRolePermissions {
        roles {
          name
          role_permissions {
            permission {
              action
              resource {
                name
              }
            }
          }
        }
      }
    `;

    const rolePermissionsResult = await queryHasura(rolePermissionsQuery);
    console.log('✅ Role Permission Counts:');
    rolePermissionsResult.data.roles.forEach(role => {
      console.log(`   ${role.name}: ${role.rolepermissions.length} permissions`);
    });

    // Test 4: Sample permission check
    console.log('\n📋 Sample Permissions by Role:');
    rolePermissionsResult.data.roles.forEach(role => {
      if (role.rolepermissions.length > 0) {
        const samplePerms = role.rolepermissions.slice(0, 3).map(rp => 
          `${rp.permission.resource.name}.${rp.permission.action}`
        );
        console.log(`   ${role.name}: ${samplePerms.join(', ')}...`);
      }
    });

    console.log('\n🎉 Permission system appears to be properly set up!');
    
  } catch (error) {
    console.error('❌ Error testing permissions:', error.message);
    return false;
  }
  
  return true;
}

async function queryHasura(query, variables = {}) {
  const fetch = (await import('node-fetch')).default;
  
  const response = await fetch(HASURA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hasura-Admin-Secret': ADMIN_SECRET,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }
  
  return result;
}

// Run the test
testPermissionSetup().catch(console.error);
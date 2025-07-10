#!/usr/bin/env node

/**
 * Clerk User Role Assignment Script
 * 
 * This script assigns roles to existing Clerk users and syncs their permissions.
 * Run this after setting up the JWT template in Clerk.
 */

import dotenv from 'dotenv';
import { createClerkClient } from '@clerk/backend';
// Import permission functions (we'll implement inline to avoid module issues)
// import { getPermissionsForRole, hashPermissions } from '../lib/permissions/enhanced-permissions.js';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.development.local' });
dotenv.config({ path: '.env' });

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!CLERK_SECRET_KEY) {
  console.error('❌ CLERK_SECRET_KEY not found in environment variables');
  process.exit(1);
}

// Create Clerk client with secret key
const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

/**
 * Inline permission functions to avoid module issues
 */
function getPermissionsForRole(role) {
  const permissions = {
    developer: [
      'dashboard.read', 'dashboard.export',
      'clients.read', 'clients.create', 'clients.update', 'clients.delete', 'clients.manage',
      'payrolls.read', 'payrolls.create', 'payrolls.update', 'payrolls.delete', 'payrolls.manage',
      'staff.read', 'staff.create', 'staff.update', 'staff.delete', 'staff.manage',
      'settings.read', 'settings.update', 'settings.manage',
      'security.read', 'security.manage', 'security.audit',
      'developer.read', 'developer.create', 'developer.update', 'developer.manage'
    ],
    org_admin: [
      'dashboard.read', 'dashboard.export',
      'clients.read', 'clients.create', 'clients.update', 'clients.manage',
      'payrolls.read', 'payrolls.create', 'payrolls.update', 'payrolls.manage',
      'staff.read', 'staff.create', 'staff.update', 'staff.manage',
      'settings.read', 'settings.update', 'settings.manage',
      'security.read', 'security.manage'
    ],
    manager: [
      'dashboard.read', 'dashboard.export',
      'clients.read', 'clients.create', 'clients.update',
      'payrolls.read', 'payrolls.create', 'payrolls.update', 'payrolls.manage',
      'staff.read', 'staff.update',
      'settings.read'
    ],
    consultant: [
      'dashboard.read',
      'clients.read',
      'payrolls.read', 'payrolls.update',
      'staff.read',
      'settings.read'
    ],
    viewer: [
      'dashboard.read',
      'clients.read',
      'payrolls.read',
      'staff.read'
    ]
  };
  
  return permissions[role] || permissions.viewer;
}

function hashPermissions(permissions) {
  // Simple hash for demo - in production use crypto
  return Buffer.from(JSON.stringify(permissions.sort())).toString('base64').slice(0, 32);
}

/**
 * Role assignment logic based on email patterns
 */
function determineUserRole(email) {
  if (email.includes('developer') || email.includes('nathan.harris02@gmail.com')) {
    return 'developer';
  } else if (email.includes('admin')) {
    return 'org_admin';
  } else if (email.includes('manager')) {
    return 'manager';
  } else if (email.includes('consultant')) {
    return 'consultant';
  } else {
    return 'viewer'; // Default role
  }
}

/**
 * Main role assignment function
 */
async function assignUserRoles() {
  try {
    console.log('🔑 Starting Clerk user role assignment...');
    
    // Get all users from Clerk
    const users = await clerkClient.users.getUserList();
    console.log(`📊 Found ${users.data.length} users to process`);
    
    for (const user of users.data) {
      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) {
        console.log(`⚠️ Skipping user ${user.id} - no email address`);
        continue;
      }
      
      // Determine role based on email
      const role = determineUserRole(email);
      
      // Get permissions for this role
      const permissions = getPermissionsForRole(role);
      const permissionHash = hashPermissions(permissions);
      const permissionVersion = Date.now().toString();
      
      try {
        // Update user metadata in Clerk
        await clerkClient.users.updateUserMetadata(user.id, {
          publicMetadata: { 
            role,
            lastUpdated: new Date().toISOString()
          },
          privateMetadata: {
            permissions,
            permissionHash,
            permissionVersion,
            lastPermissionUpdate: new Date().toISOString()
          }
        });
        
        console.log(`✅ Updated ${email} -> Role: ${role} (${permissions.length} permissions)`);
        
      } catch (error) {
        console.error(`❌ Failed to update user ${email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Role assignment completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Verify JWT template is configured in Clerk Dashboard');
    console.log('2. Test login with different user roles');
    console.log('3. Verify permissions are working in the application');
    
  } catch (error) {
    console.error('❌ Error during role assignment:', error);
    process.exit(1);
  }
}

/**
 * Display current user roles
 */
async function displayCurrentRoles() {
  try {
    console.log('📊 Current User Roles in Clerk:');
    console.log('=====================================');
    
    const users = await clerkClient.users.getUserList();
    
    for (const user of users.data) {
      const email = user.emailAddresses[0]?.emailAddress;
      const role = user.publicMetadata?.role || 'No role assigned';
      const permissionCount = user.privateMetadata?.permissions?.length || 0;
      
      console.log(`👤 ${email}`);
      console.log(`   Role: ${role}`);
      console.log(`   Permissions: ${permissionCount}`);
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error fetching user roles:', error);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'assign') {
  assignUserRoles();
} else if (command === 'list') {
  displayCurrentRoles();
} else {
  console.log('🔑 Clerk User Role Management');
  console.log('===============================');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/assign-clerk-roles.js assign  # Assign roles to all users');
  console.log('  node scripts/assign-clerk-roles.js list    # List current user roles');
  console.log('');
  console.log('Make sure CLERK_SECRET_KEY is set in your environment variables.');
}
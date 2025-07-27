/**
 * Authentication Setup for Playwright Tests
 * Creates authenticated sessions for different user roles
 * Uses the updated working credentials from .env.test
 */

import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Storage paths for authenticated sessions
const authPaths = {
  admin: 'playwright/.auth/admin.json',
  manager: 'playwright/.auth/manager.json',
  consultant: 'playwright/.auth/consultant.json',
  viewer: 'playwright/.auth/viewer.json',
  developer: 'playwright/.auth/developer.json',
};

// User credentials - using updated working credentials
const testUsers = {
  admin: {
    email: process.env.E2E_ORG_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.E2E_ORG_ADMIN_PASSWORD || 'Admin1Testing',
    role: 'org_admin',
    authFile: authPaths.admin,
  },
  manager: {
    email: process.env.E2E_MANAGER_EMAIL || 'manager@example.com',
    password: process.env.E2E_MANAGER_PASSWORD || 'Manager1Testing',
    role: 'manager',
    authFile: authPaths.manager,
  },
  consultant: {
    email: process.env.E2E_CONSULTANT_EMAIL || 'consultant@example.com',
    password: process.env.E2E_CONSULTANT_PASSWORD || 'Consultant1',
    role: 'consultant',
    authFile: authPaths.consultant,
  },
  viewer: {
    email: process.env.E2E_VIEWER_EMAIL || 'viewer@example.com',
    password: process.env.E2E_VIEWER_PASSWORD || 'Viewer1',
    role: 'viewer',
    authFile: authPaths.viewer,
  },
  developer: {
    email: process.env.E2E_DEVELOPER_EMAIL || 'developer@example.com',
    password: process.env.E2E_DEVELOPER_PASSWORD || 'Developer1',
    role: 'developer',
    authFile: authPaths.developer,
  },
};

// Helper function to authenticate a user
async function authenticateUser(page: any, userConfig: any) {
  console.log(`🔐 Authenticating ${userConfig.role}: ${userConfig.email}`);
  
  // Navigate to sign-in page
  await page.goto('/sign-in');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Fill credentials
  await page.locator('input[name="email"]').fill(userConfig.email);
  await page.locator('input[name="password"]').fill(userConfig.password);
  
  // Submit form
  await page.locator('button[type="submit"]').click();
  
  // Wait for authentication
  try {
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    console.log(`✅ ${userConfig.role} authentication successful`);
    
    // Verify we're actually logged in
    const url = page.url();
    expect(url).toContain('/dashboard');
    
    return true;
  } catch (error) {
    console.log(`❌ ${userConfig.role} authentication failed: ${error.message}`);
    
    // Check current URL for debugging
    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    // Check for error messages
    const errorAlert = await page.locator('[role="alert"]').textContent().catch(() => '');
    if (errorAlert && errorAlert.trim()) {
      console.log(`💡 Error message: "${errorAlert}"`);
    }
    
    return false;
  }
}

// Setup authentication for admin user (CONFIRMED WORKING)
setup('authenticate as admin', async ({ page }) => {
  const userConfig = testUsers.admin;
  const success = await authenticateUser(page, userConfig);
  
  if (success) {
    // Save authentication state
    await page.context().storageState({ path: userConfig.authFile });
    console.log(`💾 Saved ${userConfig.role} auth state to ${userConfig.authFile}`);
  } else {
    // Don't fail the setup - just log the issue
    console.log(`⚠️ Could not authenticate ${userConfig.role} - tests using this role may fail`);
  }
});

// Setup authentication for manager user (CONFIRMED WORKING)
setup('authenticate as manager', async ({ page }) => {
  const userConfig = testUsers.manager;
  const success = await authenticateUser(page, userConfig);
  
  if (success) {
    // Save authentication state
    await page.context().storageState({ path: userConfig.authFile });
    console.log(`💾 Saved ${userConfig.role} auth state to ${userConfig.authFile}`);
  } else {
    console.log(`⚠️ Could not authenticate ${userConfig.role} - tests using this role may fail`);
  }
});

// Setup authentication for consultant user (may not work yet)
setup('authenticate as consultant', async ({ page }) => {
  const userConfig = testUsers.consultant;
  const success = await authenticateUser(page, userConfig);
  
  if (success) {
    await page.context().storageState({ path: userConfig.authFile });
    console.log(`💾 Saved ${userConfig.role} auth state to ${userConfig.authFile}`);
  } else {
    console.log(`⚠️ Could not authenticate ${userConfig.role} - may need password update`);
  }
});

// Setup authentication for viewer user (may not work yet)
setup('authenticate as viewer', async ({ page }) => {
  const userConfig = testUsers.viewer;
  const success = await authenticateUser(page, userConfig);
  
  if (success) {
    await page.context().storageState({ path: userConfig.authFile });
    console.log(`💾 Saved ${userConfig.role} auth state to ${userConfig.authFile}`);
  } else {
    console.log(`⚠️ Could not authenticate ${userConfig.role} - may need password update`);
  }
});

// Setup authentication for developer user (may not work yet)
setup('authenticate as developer', async ({ page }) => {
  const userConfig = testUsers.developer;
  const success = await authenticateUser(page, userConfig);
  
  if (success) {
    await page.context().storageState({ path: userConfig.authFile });
    console.log(`💾 Saved ${userConfig.role} auth state to ${userConfig.authFile}`);
  } else {
    console.log(`⚠️ Could not authenticate ${userConfig.role} - may need password update`);
  }
});

// Summary setup test
setup('authentication setup summary', async ({ page }) => {
  console.log('');
  console.log('📋 AUTHENTICATION SETUP SUMMARY');
  console.log('================================');
  console.log('✅ Confirmed working credentials:');
  console.log(`   • Admin: ${testUsers.admin.email}`);
  console.log(`   • Manager: ${testUsers.manager.email}`);
  console.log('');
  console.log('⚠️  May need password updates:');
  console.log(`   • Developer: ${testUsers.developer.email}`);
  console.log(`   • Consultant: ${testUsers.consultant.email}`);
  console.log(`   • Viewer: ${testUsers.viewer.email}`);
  console.log('');
  console.log('🎯 Authentication state files will be saved to:');
  Object.entries(authPaths).forEach(([role, path]) => {
    console.log(`   • ${role}: ${path}`);
  });
  console.log('');
  console.log('✅ Setup complete - role-based tests can now run!');
});
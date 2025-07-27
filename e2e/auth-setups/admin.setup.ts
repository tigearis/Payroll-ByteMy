/**
 * Admin Role Authentication Setup
 * Individual auth setup for admin role testing
 */

import { test as setup } from '@playwright/test';
import { authenticateUser } from '../utils/auth-helpers';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const adminConfig = {
  email: process.env.E2E_ORG_ADMIN_EMAIL || 'admin@example.com',
  password: process.env.E2E_ORG_ADMIN_PASSWORD || 'Admin1Testing',
  role: 'org_admin',
  authFile: 'playwright/.auth/admin.json'
};

setup('authenticate admin only', async ({ page }) => {
  console.log('🚀 Starting admin-only authentication setup...');
  
  const success = await authenticateUser(page, adminConfig);
  
  if (success) {
    // Save authentication state
    await page.context().storageState({ path: adminConfig.authFile });
    console.log(`💾 Saved ${adminConfig.role} auth state to ${adminConfig.authFile}`);
    console.log('✅ Admin authentication ready for testing');
  } else {
    console.log(`⚠️ Could not authenticate ${adminConfig.role} - tests using this role may fail`);
    console.log('💡 Check credentials in .env.test or run password update script');
  }
  
  console.log('🎯 Admin auth setup complete!');
});
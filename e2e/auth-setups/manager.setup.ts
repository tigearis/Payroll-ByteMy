/**
 * Manager Role Authentication Setup
 * Individual auth setup for manager role testing
 */

import { test as setup } from '@playwright/test';
import { authenticateUser } from '../utils/auth-helpers';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const managerConfig = {
  email: process.env.E2E_MANAGER_EMAIL || 'manager@example.com',
  password: process.env.E2E_MANAGER_PASSWORD || 'Manager1Testing',
  role: 'manager',
  authFile: 'playwright/.auth/manager.json'
};

setup('authenticate manager only', async ({ page }) => {
  console.log('🚀 Starting manager-only authentication setup...');
  
  const success = await authenticateUser(page, managerConfig);
  
  if (success) {
    // Save authentication state
    await page.context().storageState({ path: managerConfig.authFile });
    console.log(`💾 Saved ${managerConfig.role} auth state to ${managerConfig.authFile}`);
    console.log('✅ Manager authentication ready for testing');
  } else {
    console.log(`⚠️ Could not authenticate ${managerConfig.role} - tests using this role may fail`);
    console.log('💡 Check credentials in .env.test or run password update script');
  }
  
  console.log('🎯 Manager auth setup complete!');
});
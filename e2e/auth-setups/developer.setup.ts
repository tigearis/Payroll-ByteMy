/**
 * Developer Role Authentication Setup
 * Individual auth setup for developer role testing
 */

import { test as setup } from '@playwright/test';
import { authenticateUser } from '../utils/auth-helpers';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const developerConfig = {
  email: process.env.E2E_DEVELOPER_EMAIL || 'developer@example.com',
  password: process.env.E2E_DEVELOPER_PASSWORD || 'Developer1',
  role: 'developer',
  authFile: 'playwright/.auth/developer.json'
};

setup('authenticate developer only', async ({ page }) => {
  console.log('🚀 Starting developer-only authentication setup...');
  
  const success = await authenticateUser(page, developerConfig);
  
  if (success) {
    // Save authentication state
    await page.context().storageState({ path: developerConfig.authFile });
    console.log(`💾 Saved ${developerConfig.role} auth state to ${developerConfig.authFile}`);
    console.log('✅ Developer authentication ready for testing');
  } else {
    console.log(`⚠️ Could not authenticate ${developerConfig.role} - tests using this role may fail`);
    console.log('💡 Check credentials in .env.test or run password update script');
  }
  
  console.log('🎯 Developer auth setup complete!');
});
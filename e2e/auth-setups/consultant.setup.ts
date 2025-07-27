/**
 * Consultant Role Authentication Setup
 * Individual auth setup for consultant role testing
 */

import { test as setup } from '@playwright/test';
import { authenticateUser } from '../utils/auth-helpers';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const consultantConfig = {
  email: process.env.E2E_CONSULTANT_EMAIL || 'consultant@example.com',
  password: process.env.E2E_CONSULTANT_PASSWORD || 'Consultant1',
  role: 'consultant',
  authFile: 'playwright/.auth/consultant.json'
};

setup('authenticate consultant only', async ({ page }) => {
  console.log('🚀 Starting consultant-only authentication setup...');
  
  const success = await authenticateUser(page, consultantConfig);
  
  if (success) {
    // Save authentication state
    await page.context().storageState({ path: consultantConfig.authFile });
    console.log(`💾 Saved ${consultantConfig.role} auth state to ${consultantConfig.authFile}`);
    console.log('✅ Consultant authentication ready for testing');
  } else {
    console.log(`⚠️ Could not authenticate ${consultantConfig.role} - tests using this role may fail`);
    console.log('💡 Check credentials in .env.test or run password update script');
  }
  
  console.log('🎯 Consultant auth setup complete!');
});
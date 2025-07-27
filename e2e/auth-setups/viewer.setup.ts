/**
 * Viewer Role Authentication Setup
 * Individual auth setup for viewer role testing
 */

import { test as setup } from '@playwright/test';
import { authenticateUser } from '../utils/auth-helpers';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const viewerConfig = {
  email: process.env.E2E_VIEWER_EMAIL || 'viewer@example.com',
  password: process.env.E2E_VIEWER_PASSWORD || 'Viewer1',
  role: 'viewer',
  authFile: 'playwright/.auth/viewer.json'
};

setup('authenticate viewer only', async ({ page }) => {
  console.log('🚀 Starting viewer-only authentication setup...');
  
  const success = await authenticateUser(page, viewerConfig);
  
  if (success) {
    // Save authentication state
    await page.context().storageState({ path: viewerConfig.authFile });
    console.log(`💾 Saved ${viewerConfig.role} auth state to ${viewerConfig.authFile}`);
    console.log('✅ Viewer authentication ready for testing');
  } else {
    console.log(`⚠️ Could not authenticate ${viewerConfig.role} - tests using this role may fail`);
    console.log('💡 Check credentials in .env.test or run password update script');
  }
  
  console.log('🎯 Viewer auth setup complete!');
});
import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/consultant.json' });

test('Debug middleware enforcement', async ({ page }) => {
  console.log('🔍 Starting middleware debug test');
  
  // Try to navigate to staff page (should be blocked for consultant)
  console.log('🔍 Attempting to navigate to /staff');
  const response = await page.goto('/staff');
  console.log(`🔍 Response status: ${response?.status()}`);
  
  await page.waitForTimeout(3000); // Wait for any redirects
  
  const currentUrl = page.url();
  console.log(`🔍 Current URL after /staff navigation: ${currentUrl}`);
  
  // Check if we were redirected or if we're on the staff page
  if (currentUrl.includes('/staff')) {
    console.log('❌ MIDDLEWARE FAILURE: Consultant was NOT blocked from /staff');
    try {
      const pageContent = await page.locator('h1').first().textContent({ timeout: 5000 });
      console.log(`🔍 Page content h1: ${pageContent}`);
    } catch (e) {
      console.log('🔍 Could not get h1 content');
    }
  } else {
    console.log('✅ MIDDLEWARE SUCCESS: Consultant was redirected from /staff');
  }
});
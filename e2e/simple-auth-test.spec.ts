import { test, expect } from '@playwright/test';

const TEST_CREDENTIALS = {
  email: process.env.E2E_TEST_EMAIL || 'test@example.com',
  password: process.env.E2E_TEST_PASSWORD || 'TestPassword123!',
};

test.describe('Simple Authentication Test', () => {
  test('should display sign-in form and handle basic navigation', async ({ page }) => {
    // Navigate to sign-in page
    await page.goto('/sign-in');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check that we're on the sign-in page
    expect(page.url()).toContain('/sign-in');
    
    // Check for basic form elements
    const hasForm = await page.locator('form').count() > 0;
    const hasEmailInput = await page.locator('input[type="email"], input[name="email"], input[name="identifier"]').count() > 0;
    const hasPasswordInput = await page.locator('input[type="password"], input[name="password"]').count() > 0;
    
    console.log('Form elements found:', { hasForm, hasEmailInput, hasPasswordInput });
    
    expect(hasForm || hasEmailInput).toBeTruthy();
  });

  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');
    
    // Should redirect to sign-in
    await page.waitForURL(/sign-in/, { timeout: 10000 });
    expect(page.url()).toContain('/sign-in');
  });

  test('should redirect unauthenticated users from other protected routes', async ({ page }) => {
    const protectedRoutes = ['/clients', '/payrolls', '/staff', '/settings'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForTimeout(2000); // Wait for redirect
      const currentUrl = page.url();
      
      console.log(`Testing route ${route}, redirected to: ${currentUrl}`);
      
      // Should be redirected to sign-in or show unauthorized
      expect(currentUrl).toMatch(/\/(sign-in|unauthorized)/);
    }
  });
});
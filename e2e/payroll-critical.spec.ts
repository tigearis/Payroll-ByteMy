import { test, expect } from '@playwright/test';
import { AuthHelpers } from './utils/auth-helpers';

const TEST_CREDENTIALS = {
  email: process.env.E2E_TEST_EMAIL || 'test@example.com',
  password: process.env.E2E_TEST_PASSWORD || 'TestPassword123!',
};

test.describe('Critical Payroll Flows', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    // Authenticate before each test
    await authHelpers.signIn(TESTCREDENTIALS.email, TESTCREDENTIALS.password);
  });

  test('should navigate to payrolls page and display payroll list', async ({ page }) => {
    // Navigate to payrolls page
    await page.goto('/payrolls');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('Payrolls');
    
    // Check for payroll table or empty state
    const payrollTable = page.locator('[data-testid="payrolls-table"]');
    const emptyState = page.locator('text=No payrolls found');
    
    await expect(payrollTable.or(emptyState)).toBeVisible();
  });

  test('should access payroll detail page', async ({ page }) => {
    // Navigate to payrolls page
    await page.goto('/payrolls');
    
    // Look for first payroll link
    const firstPayrollLink = page.locator('a[href*="/payrolls/"]').first();
    
    // If payrolls exist, test detail page
    if (await firstPayrollLink.isVisible()) {
      await firstPayrollLink.click();
      
      // Should be on payroll detail page
      await expect(page.url()).toMatch(/\/payrolls\/[^\/]+$/);
      
      // Should see payroll details
      await expect(page.locator('h1, h2')).toBeVisible();
      
      // Should see back navigation
      const backButton = page.locator('button:has-text("Back"), a:has-text("Back")');
      await expect(backButton).toBeVisible();
    }
  });

  test('should display error handling for invalid payroll ID', async ({ page }) => {
    // Navigate to non-existent payroll
    await page.goto('/payrolls/00000000-0000-0000-0000-000000000000');
    
    // Should handle error gracefully
    const errorMessage = page.locator('text=not found, text=error, text=404');
    const backButton = page.locator('button:has-text("Back"), a:has-text("Back")');
    
    // Should show error or redirect
    await expect(errorMessage.or(backButton)).toBeVisible({ timeout: 10000 });
  });

  test('should protect payroll routes when not authenticated', async ({ page }) => {
    // Sign out first
    await authHelpers.signOut();
    
    // Try to access protected payroll route
    await page.goto('/payrolls');
    
    // Should redirect to sign-in or show unauthorized
    await expect(page.url()).toMatch(/\/(sign-in|unauthorized)/);
  });

  test.afterEach(async ({ page }) => {
    // Clean up: sign out after each test
    await authHelpers.signOut();
  });
});
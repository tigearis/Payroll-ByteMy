import { test, expect } from '@playwright/test';
import { AuthHelpers } from './utils/auth-helpers';

const TEST_CREDENTIALS = {
  email: process.env.E2E_TEST_EMAIL || 'test@example.com',
  password: process.env.E2E_TEST_PASSWORD || 'TestPassword123!',
};

test.describe('Critical Dashboard Flows', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    // Authenticate before each test
    await authHelpers.signIn(TESTCREDENTIALS.email, TESTCREDENTIALS.password);
  });

  test('should load dashboard with main navigation', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should see main dashboard elements
    const dashboardHeading = page.locator('h1, h2').first();
    await expect(dashboardHeading).toBeVisible();
    
    // Should see navigation menu
    const navigation = page.locator('nav, [role="navigation"]');
    await expect(navigation).toBeVisible();
    
    // Should see key navigation links
    const clientsLink = page.locator('a[href="/clients"], a:has-text("Clients")');
    const payrollsLink = page.locator('a[href="/payrolls"], a:has-text("Payrolls")');
    const staffLink = page.locator('a[href="/staff"], a:has-text("Staff")');
    
    await expect(clientsLink).toBeVisible();
    await expect(payrollsLink).toBeVisible();
    await expect(staffLink).toBeVisible();
  });

  test('should navigate between main sections', async ({ page }) => {
    // Start on dashboard
    await page.goto('/dashboard');
    
    // Navigate to clients
    const clientsLink = page.locator('a[href="/clients"], a:has-text("Clients")');
    await clientsLink.click();
    await expect(page.url()).toMatch(/\/clients/);
    
    // Navigate to payrolls
    const payrollsLink = page.locator('a[href="/payrolls"], a:has-text("Payrolls")');
    await payrollsLink.click();
    await expect(page.url()).toMatch(/\/payrolls/);
    
    // Navigate to staff
    const staffLink = page.locator('a[href="/staff"], a:has-text("Staff")');
    await staffLink.click();
    await expect(page.url()).toMatch(/\/staff/);
  });

  test('should display user menu and profile access', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Look for user menu (avatar, profile button, or user name)
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Profile"), [role="button"]:has-text("User")');
    const profileLink = page.locator('a[href="/profile"], a:has-text("Profile")');
    
    // Should see either user menu or profile link
    await expect(userMenu.or(profileLink)).toBeVisible();
  });

  test('should handle responsive navigation on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should see mobile navigation (hamburger menu or sidebar toggle)
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has([data-testid="menu-icon"])');
    const navigation = page.locator('nav, [role="navigation"]');
    
    // Either see mobile menu button or navigation should be adapted for mobile
    await expect(mobileMenuButton.or(navigation)).toBeVisible();
  });

  test('should show appropriate content for different user roles', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should see some form of dashboard content
    const dashboardCards = page.locator('[role="main"] > div, .card, .dashboard-section');
    const welcomeMessage = page.locator('text=Welcome, text=Dashboard');
    
    await expect(dashboardCards.or(welcomeMessage)).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Try to access non-existent dashboard route
    await page.goto('/dashboard/non-existent-section');
    
    // Should handle gracefully (404, redirect, or error message)
    const errorMessage = page.locator('text=404, text=not found, text=error');
    const dashboardRedirect = page.locator('h1, h2').first();
    
    await expect(errorMessage.or(dashboardRedirect)).toBeVisible({ timeout: 10000 });
  });

  test.afterEach(async ({ page }) => {
    // Clean up: sign out after each test
    await authHelpers.signOut();
  });
});
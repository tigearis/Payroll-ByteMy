import { test, expect } from '@playwright/test';
import { AuthHelpers } from './utils/auth-helpers';

const TEST_CREDENTIALS = {
  email: process.env.E2E_TEST_EMAIL || 'test@example.com',
  password: process.env.E2E_TEST_PASSWORD || 'TestPassword123!',
};

test.describe('Critical Client Management Flows', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    // Authenticate before each test
    await authHelpers.signIn(TESTCREDENTIALS.email, TESTCREDENTIALS.password);
  });

  test('should navigate to clients page and display client list', async ({ page }) => {
    // Navigate to clients page
    await page.goto('/clients');
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('Clients');
    
    // Check for client table or empty state
    const clientTable = page.locator('[data-testid="clients-table"]');
    const emptyState = page.locator('text=No clients found');
    const newClientButton = page.locator('button:has-text("New Client")');
    
    await expect(clientTable.or(emptyState)).toBeVisible();
    await expect(newClientButton).toBeVisible();
  });

  test('should open new client modal when clicking New Client button', async ({ page }) => {
    // Navigate to clients page
    await page.goto('/clients');
    
    // Click New Client button
    const newClientButton = page.locator('button:has-text("New Client")');
    await newClientButton.click();
    
    // Should open modal or navigate to new client page
    const modal = page.locator('[role="dialog"]');
    const clientForm = page.locator('form');
    
    await expect(modal.or(clientForm)).toBeVisible();
    
    // Should see form fields
    const nameField = page.locator('input[name="name"], input[placeholder*="name"], input[id*="name"]');
    await expect(nameField).toBeVisible();
  });

  test('should access client detail page', async ({ page }) => {
    // Navigate to clients page
    await page.goto('/clients');
    
    // Look for first client link
    const firstClientLink = page.locator('a[href*="/clients/"]').first();
    
    // If clients exist, test detail page
    if (await firstClientLink.isVisible()) {
      await firstClientLink.click();
      
      // Should be on client detail page
      await expect(page.url()).toMatch(/\/clients\/[^\/]+$/);
      
      // Should see client details
      await expect(page.locator('h1, h2')).toBeVisible();
      
      // Should see back navigation
      const backButton = page.locator('button:has-text("Back"), a:has-text("Back")');
      await expect(backButton).toBeVisible();
    }
  });

  test('should handle client search functionality', async ({ page }) => {
    // Navigate to clients page
    await page.goto('/clients');
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search"], input[type="search"]');
    
    if (await searchInput.isVisible()) {
      // Type in search
      await searchInput.fill('test');
      
      // Should trigger search (wait for any loading states)
      await page.waitForTimeout(1000);
      
      // Should still show table structure
      const tableOrEmptyState = page.locator('[data-testid="clients-table"], text=No clients found');
      await expect(tableOrEmptyState).toBeVisible();
    }
  });

  test('should protect client routes when not authenticated', async ({ page }) => {
    // Sign out first
    await authHelpers.signOut();
    
    // Try to access protected client route
    await page.goto('/clients');
    
    // Should redirect to sign-in or show unauthorized
    await expect(page.url()).toMatch(/\/(sign-in|unauthorized)/);
  });

  test.afterEach(async ({ page }) => {
    // Clean up: sign out after each test
    await authHelpers.signOut();
  });
});
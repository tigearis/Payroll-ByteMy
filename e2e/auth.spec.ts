import { test, expect } from '@playwright/test';
import { AuthHelpers } from './utils/auth-helpers';
import { TEST_SELECTORS } from './utils/test-config';

// Test credentials - these should be configured in your environment
const TEST_CREDENTIALS = {
  valid: {
    email: process.env.E2E_TEST_EMAIL || 'test@example.com',
    password: process.env.E2E_TEST_PASSWORD || 'TestPassword123!',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

test.describe('Authentication Flow', () => {
  let authHelpers: AuthHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
  });

  test('should display sign-in form on initial visit', async ({ page }) => {
    await page.goto('/sign-in');
    
    await expect(page.locator(TEST_SELECTORS.signInForm)).toBeVisible();
    await expect(page.locator(TEST_SELECTORS.emailInput)).toBeVisible();
    await expect(page.locator(TEST_SELECTORS.passwordInput)).toBeVisible();
    await expect(page.locator(TEST_SELECTORS.signInButton)).toBeVisible();
  });

  test('should successfully sign in with valid credentials', async ({ page }) => {
    await authHelpers.signIn(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
    
    // Should be redirected to dashboard
    expect(page.url()).toContain('/dashboard');
    
    // User menu should be visible
    await authHelpers.expectSignedIn();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');
    
    await page.fill(TEST_SELECTORS.emailInput, TEST_CREDENTIALS.invalid.email);
    await page.fill(TEST_SELECTORS.passwordInput, TEST_CREDENTIALS.invalid.password);
    await page.click(TEST_SELECTORS.signInButton);
    
    // Should show error message
    await expect(page.locator(TEST_SELECTORS.errorMessage)).toBeVisible();
    
    // Should remain on sign-in page
    expect(page.url()).toContain('/sign-in');
  });

  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should be redirected to sign-in
    await page.waitForURL(/\/sign-in/);
    await authHelpers.expectSignedOut();
  });

  test('should successfully sign out', async ({ page }) => {
    // First sign in
    await authHelpers.signIn(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
    await authHelpers.expectSignedIn();
    
    // Then sign out
    await authHelpers.signOut();
    await authHelpers.expectSignedOut();
  });

  test('should persist authentication across page reloads', async ({ page }) => {
    // Sign in
    await authHelpers.signIn(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
    await authHelpers.expectSignedIn();
    
    // Reload page
    await page.reload();
    
    // Should still be signed in
    await authHelpers.expectSignedIn();
    expect(page.url()).toContain('/dashboard');
  });

  test('should handle session expiration gracefully', async ({ page }) => {
    // Sign in
    await authHelpers.signIn(TEST_CREDENTIALS.valid.email, TEST_CREDENTIALS.valid.password);
    await authHelpers.expectSignedIn();
    
    // Clear storage to simulate expired session
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.evaluate(() => sessionStorage.clear());
    
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should be redirected to sign-in
    await page.waitForURL(/\/sign-in/);
    await authHelpers.expectSignedOut();
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Try to submit empty form
    await page.click(TEST_SELECTORS.signInButton);
    
    // Should show validation errors
    const emailInput = page.locator(TEST_SELECTORS.emailInput);
    const passwordInput = page.locator(TEST_SELECTORS.passwordInput);
    
    await expect(emailInput).toHaveAttribute('required');
    await expect(passwordInput).toHaveAttribute('required');
  });

  test('should handle network errors during sign-in', async ({ page }) => {
    // Intercept network requests and make them fail
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/sign-in');
    await page.fill(TEST_SELECTORS.emailInput, TEST_CREDENTIALS.valid.email);
    await page.fill(TEST_SELECTORS.passwordInput, TEST_CREDENTIALS.valid.password);
    await page.click(TEST_SELECTORS.signInButton);
    
    // Should show error message
    await expect(page.locator(TEST_SELECTORS.errorMessage)).toBeVisible();
  });
});
import { Page, expect } from '@playwright/test';
import { TEST_SELECTORS } from './test-config';

export class AuthHelpers {
  constructor(private page: Page) {}

  async signIn(email: string, password: string) {
    await this.page.goto('/sign-in');
    await this.page.waitForLoadState('networkidle');

    // Wait for form to be ready
    await this.page.waitForSelector(TEST_SELECTORS.emailInput, { timeout: 15000 });

    // Fill credentials
    await this.page.fill(TEST_SELECTORS.emailInput, email);
    await this.page.fill(TEST_SELECTORS.passwordInput, password);
    
    // Submit form
    await this.page.click(TEST_SELECTORS.signInButton);
    
    // Wait for redirect
    await this.page.waitForURL(/\/dashboard/, { timeout: 30000 });
    
    // For now, just verify we're not on sign-in page
    await this.page.waitForSelector('body', { timeout: 10000 });
  }

  async signOut() {
    // Open user menu
    await this.page.click(TEST_SELECTORS.userMenu);
    
    // Click sign out
    await this.page.click(TEST_SELECTORS.signOutButton);
    
    // Wait for redirect to sign-in page
    await this.page.waitForURL(/\/sign-in/, { timeout: 10000 });
  }

  async expectSignedIn() {
    // Check that we're on dashboard or not on sign-in page
    const currentUrl = this.page.url();
    expect(currentUrl).not.toContain('/sign-in');
  }

  async expectSignedOut() {
    await expect(this.page.locator(TEST_SELECTORS.signInForm)).toBeVisible();
  }

  async expectAccessDenied() {
    await expect(this.page.locator(TEST_SELECTORS.accessDenied)).toBeVisible();
  }

  async expectNotFound() {
    await expect(this.page.locator(TEST_SELECTORS.notFound)).toBeVisible();
  }

  async getCurrentUserRole(): Promise<string | null> {
    // Check for role-specific elements or data attributes
    const userMenu = this.page.locator(TEST_SELECTORS.userMenu);
    return await userMenu.getAttribute('data-role');
  }

  async waitForAuthState() {
    // Wait for either signed in or signed out state
    await Promise.race([
      this.page.locator(TEST_SELECTORS.userMenu).waitFor(),
      this.page.locator(TEST_SELECTORS.signInForm).waitFor(),
    ]);
  }
}
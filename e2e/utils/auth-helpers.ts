import { Page, expect } from '@playwright/test';
import { TEST_SELECTORS } from './test-config';

export class AuthHelpers {
  constructor(private page: Page) {}

  async signIn(email: string, password: string) {
    await this.page.goto('/sign-in');
    await this.page.waitForLoadState('networkidle');

    // Wait for form to be ready
    await this.page.waitForSelector(TESTSELECTORS.emailInput, { timeout: 15000 });

    // Fill credentials
    await this.page.fill(TESTSELECTORS.emailInput, email);
    await this.page.fill(TESTSELECTORS.passwordInput, password);
    
    // Submit form
    await this.page.click(TESTSELECTORS.signInButton);
    
    // Wait for redirect
    await this.page.waitForURL(/\/dashboard/, { timeout: 30000 });
    
    // For now, just verify we're not on sign-in page
    await this.page.waitForSelector('body', { timeout: 10000 });
  }

  async signOut() {
    // Open user menu
    await this.page.click(TESTSELECTORS.userMenu);
    
    // Click sign out
    await this.page.click(TESTSELECTORS.signOutButton);
    
    // Wait for redirect to sign-in page
    await this.page.waitForURL(/\/sign-in/, { timeout: 10000 });
  }

  async expectSignedIn() {
    // Check that we're on dashboard or not on sign-in page
    const currentUrl = this.page.url();
    expect(currentUrl).not.toContain('/sign-in');
  }

  async expectSignedOut() {
    await expect(this.page.locator(TESTSELECTORS.signInForm)).toBeVisible();
  }

  async expectAccessDenied() {
    await expect(this.page.locator(TESTSELECTORS.accessDenied)).toBeVisible();
  }

  async expectNotFound() {
    await expect(this.page.locator(TESTSELECTORS.notFound)).toBeVisible();
  }

  async getCurrentUserRole(): Promise<string | null> {
    // Check for role-specific elements or data attributes
    const userMenu = this.page.locator(TESTSELECTORS.userMenu);
    return await userMenu.getAttribute('data-role');
  }

  async waitForAuthState() {
    // Wait for either signed in or signed out state
    await Promise.race([
      this.page.locator(TESTSELECTORS.userMenu).waitFor(),
      this.page.locator(TESTSELECTORS.signInForm).waitFor(),
    ]);
  }
}
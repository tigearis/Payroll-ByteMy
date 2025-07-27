import { Page, expect } from '@playwright/test';
import { TEST_SELECTORS } from './test-config';

// Enhanced authentication with retry logic and better error handling
export async function authenticateUser(page: Page, userConfig: any, maxRetries: number = 3): Promise<boolean> {
  console.log(`🔐 Authenticating ${userConfig.role}: ${userConfig.email} (max retries: ${maxRetries})`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Authentication attempt ${attempt}/${maxRetries} for ${userConfig.role}`);
      
      // Enhanced session cleanup
      await cleanupSession(page, userConfig.role);
      
      // Navigate to sign-in page with retry logic
      await navigateToSignInWithRetry(page, attempt);
      
      // Wait for form with dynamic timeout
      const formTimeout = 5000 + (attempt * 2000); // Increase timeout on retries
      await page.waitForSelector('input[name="email"]', { timeout: formTimeout });
      console.log(`✅ Sign-in form ready on attempt ${attempt}`);
      
      // Fill credentials with verification
      await fillCredentialsWithVerification(page, userConfig);
      
      // Submit and wait for authentication
      await page.locator('button[type="submit"]').click();
      console.log(`🔄 Form submitted for ${userConfig.role}, waiting for redirect...`);
      
      // Wait for authentication success with retry-specific timeout
      const authTimeout = 10000 + (attempt * 5000);
      await page.waitForURL(/\/dashboard/, { timeout: authTimeout });
      
      // Wait a moment for token to be properly established
      await page.waitForTimeout(2000);
      
      // Force token refresh to ensure we have fresh tokens
      await page.evaluate(() => {
        // Clear any potentially stale tokens
        sessionStorage.removeItem('clerk-token-cache');
        localStorage.removeItem('clerk-token-cache');
        
        // Set timestamp for fresh session
        sessionStorage.setItem('auth-timestamp', Date.now().toString());
      });
      
      console.log(`✅ ${userConfig.role} authentication successful on attempt ${attempt}`);
      
      // Verify we're actually logged in
      const url = page.url();
      if (url.includes('/dashboard')) {
        return true;
      } else {
        throw new Error(`Unexpected URL after authentication: ${url}`);
      }
      
    } catch (error) {
      console.log(`❌ Authentication attempt ${attempt} failed for ${userConfig.role}: ${error.message}`);
      
      if (attempt === maxRetries) {
        console.log(`💀 All ${maxRetries} authentication attempts failed for ${userConfig.role}`);
        await logAuthenticationFailureDetails(page, userConfig, error as Error);
        return false;
      } else {
        // Exponential backoff before retry
        const backoffMs = 1000 * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${backoffMs}ms before retry attempt ${attempt + 1}`);
        await page.waitForTimeout(backoffMs);
      }
    }
  }
  
  return false;
}

// Helper function for enhanced session cleanup
async function cleanupSession(page: Page, role: string): Promise<void> {
  try {
    console.log(`🚪 Enhanced session cleanup for ${role}`);
    
    // Clear browser state
    await page.context().clearCookies();
    await page.context().clearPermissions();
    
    // Try multiple logout approaches
    const logoutUrls = ['/api/auth/signout', '/sign-out', '/logout'];
    for (const logoutUrl of logoutUrls) {
      try {
        await page.goto(logoutUrl, { timeout: 3000 });
        await page.waitForTimeout(1000);
      } catch (logoutError) {
        // Continue with next logout method
        console.log(`⚠️ Logout attempt ${logoutUrl} failed: ${logoutError.message}`);
      }
    }
    
    // Final cleanup
    await page.context().clearCookies();
    
  } catch (cleanupError) {
    console.log(`⚠️ Session cleanup warning: ${cleanupError.message}`);
  }
}

// Helper function for resilient navigation to sign-in
async function navigateToSignInWithRetry(page: Page, attempt: number): Promise<void> {
  const navigationTimeout = 8000 + (attempt * 2000);
  
  await page.goto('/sign-in', { timeout: navigationTimeout });
  await page.waitForLoadState('networkidle', { timeout: navigationTimeout });
  
  // Wait for page to stabilize
  await page.waitForTimeout(2000 + (attempt * 1000));
  
  // Verify we're on the sign-in page
  const currentUrl = page.url();
  if (!currentUrl.includes('/sign-in')) {
    throw new Error(`Failed to navigate to sign-in page, current URL: ${currentUrl}`);
  }
  
  console.log(`✅ Successfully navigated to sign-in page on attempt ${attempt}`);
}

// Helper function for credential filling with verification
async function fillCredentialsWithVerification(page: Page, userConfig: any): Promise<void> {
  console.log(`📝 Filling credentials for ${userConfig.role}`);
  
  // Fill email with verification
  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill(userConfig.email);
  const emailValue = await emailInput.inputValue();
  if (emailValue !== userConfig.email) {
    throw new Error(`Email input verification failed: expected ${userConfig.email}, got ${emailValue}`);
  }
  
  // Fill password with verification
  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.fill(userConfig.password);
  const passwordValue = await passwordInput.inputValue();
  if (passwordValue !== userConfig.password) {
    throw new Error(`Password input verification failed`);
  }
  
  console.log(`✅ Credentials filled and verified for ${userConfig.role}`);
}

// Helper function for detailed failure logging
async function logAuthenticationFailureDetails(page: Page, userConfig: any, error: Error): Promise<void> {
  try {
    const currentUrl = page.url();
    console.log(`💀 AUTHENTICATION FAILURE DETAILS:`);
    console.log(`   - Role: ${userConfig.role}`);
    console.log(`   - Email: ${userConfig.email}`);
    console.log(`   - Current URL: ${currentUrl}`);
    console.log(`   - Error: ${error.message}`);
    
    // Check for error messages on page
    const errorSelectors = [
      '[role="alert"]',
      '.error',
      '.alert-error',
      'text=error',
      'text=failed',
      'text=invalid'
    ];
    
    for (const selector of errorSelectors) {
      try {
        const errorElement = await page.locator(selector).first().textContent({ timeout: 1000 });
        if (errorElement && errorElement.trim()) {
          console.log(`   - Page Error: "${errorElement.trim()}"`);
        }
      } catch (e) {
        // Continue checking other selectors
      }
    }
    
  } catch (logError) {
    console.log(`⚠️ Failed to log authentication failure details: ${logError.message}`);
  }
}


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
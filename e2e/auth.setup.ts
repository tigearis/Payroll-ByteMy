import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE_DEVELOPER, STORAGE_STATE_ORG_ADMIN, STORAGE_STATE_MANAGER, STORAGE_STATE_CONSULTANT, STORAGE_STATE_VIEWER } from './utils/test-config';

// Test users for different roles - these should match your Clerk test environment
const TEST_USERS = {
  developer: {
    email: process.env.E2E_DEVELOPER_EMAIL || 'developer@test.payroll.com',
    password: process.env.E2E_DEVELOPER_PASSWORD || 'DevSecure2024!@#$',
  },
  org_admin: {
    email: process.env.E2E_ORG_ADMIN_EMAIL || 'orgadmin@test.payroll.com',
    password: process.env.E2E_ORG_ADMIN_PASSWORD || 'OrgAdmin2024!@#$',
  },
  manager: {
    email: process.env.E2E_MANAGER_EMAIL || 'manager@test.payroll.com',
    password: process.env.E2E_MANAGER_PASSWORD || 'Manager2024!@#$',
  },
  consultant: {
    email: process.env.E2E_CONSULTANT_EMAIL || 'consultant@test.payroll.com',
    password: process.env.E2E_CONSULTANT_PASSWORD || 'Consultant2024!@#$',
  },
  viewer: {
    email: process.env.E2E_VIEWER_EMAIL || 'viewer@test.payroll.com',
    password: process.env.E2E_VIEWER_PASSWORD || 'Viewer2024!@#$',
  },
};

async function authenticateUser(email: string, password: string, page: any) {
  console.log(`🔐 Authenticating user: ${email}`);
  
  // Navigate to sign-in page
  await page.goto('/sign-in');
  
  // Wait for Clerk to initialize and form to appear
  await page.waitForFunction(() => {
    const emailInput = document.querySelector('input[name="email"]') || 
                      document.querySelector('input[type="email"]') ||
                      document.querySelector('input[name="identifier"]');
    const loadingText = document.body.textContent?.includes('Loading authentication...');
    return emailInput && !loadingText;
  }, { timeout: 60000 });
  
  // Wait a bit more for any dynamic loading
  await page.waitForTimeout(1000);
  
  // Fill email field (try different selectors)
  const emailSelectors = [
    'input[name="email"]',
    'input[type="email"]', 
    'input[name="identifier"]',
    'input[data-testid="email"]'
  ];
  
  let emailFilled = false;
  for (const selector of emailSelectors) {
    try {
      await page.fill(selector, email);
      emailFilled = true;
      console.log(`✅ Email filled using selector: ${selector}`);
      break;
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!emailFilled) {
    throw new Error('Could not find email input field');
  }
  
  // Fill password field
  const passwordSelectors = [
    'input[name="password"]',
    'input[type="password"]',
    'input[data-testid="password"]'
  ];
  
  let passwordFilled = false;
  for (const selector of passwordSelectors) {
    try {
      await page.fill(selector, password);
      passwordFilled = true;
      console.log(`✅ Password filled using selector: ${selector}`);
      break;
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!passwordFilled) {
    throw new Error('Could not find password input field');
  }
  
  // Submit the form
  const submitSelectors = [
    'button[type="submit"]',
    'button[data-testid="sign-in-button"]',
    'input[type="submit"]',
    '.cl-formButtonPrimary',
    'button:has-text("Sign in")',
    'button:has-text("Continue")'
  ];
  
  let submitted = false;
  for (const selector of submitSelectors) {
    try {
      await page.click(selector);
      submitted = true;
      console.log(`✅ Form submitted using selector: ${selector}`);
      break;
    } catch (error) {
      // Try next selector
    }
  }
  
  if (!submitted) {
    throw new Error('Could not find submit button');
  }
  
  // Wait for successful authentication and redirect
  try {
    await page.waitForURL(/\/dashboard/, { timeout: 30000 });
    console.log(`✅ Successfully authenticated and redirected to dashboard`);
  } catch (error) {
    console.error(`❌ Authentication failed for ${email}:`, error.message);
    // Take a screenshot for debugging
    await page.screenshot({ path: `e2e/debug-auth-${email.split('@')[0]}.png` });
    throw error;
  }
}

setup('authenticate as developer', async ({ page }) => {
  await authenticateUser(TEST_USERS.developer.email, TEST_USERS.developer.password, page);
  await page.context().storageState({ path: STORAGE_STATE_DEVELOPER });
});

setup('authenticate as org_admin', async ({ page }) => {
  await authenticateUser(TEST_USERS.org_admin.email, TEST_USERS.org_admin.password, page);
  await page.context().storageState({ path: STORAGE_STATE_ORG_ADMIN });
});

setup('authenticate as manager', async ({ page }) => {
  await authenticateUser(TEST_USERS.manager.email, TEST_USERS.manager.password, page);
  await page.context().storageState({ path: STORAGE_STATE_MANAGER });
});

setup('authenticate as consultant', async ({ page }) => {
  await authenticateUser(TEST_USERS.consultant.email, TEST_USERS.consultant.password, page);
  await page.context().storageState({ path: STORAGE_STATE_CONSULTANT });
});

setup('authenticate as viewer', async ({ page }) => {
  await authenticateUser(TEST_USERS.viewer.email, TEST_USERS.viewer.password, page);
  await page.context().storageState({ path: STORAGE_STATE_VIEWER });
});
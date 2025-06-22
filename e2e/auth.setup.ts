import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE_DEVELOPER, STORAGE_STATE_ORG_ADMIN, STORAGE_STATE_MANAGER, STORAGE_STATE_CONSULTANT, STORAGE_STATE_VIEWER } from './utils/test-config';

// Test users for different roles - these should match your Clerk test environment
const TEST_USERS = {
  developer: {
    email: process.env.E2E_DEVELOPER_EMAIL || 'developer@test.payroll.com',
    password: process.env.E2E_DEVELOPER_PASSWORD || 'DevSecure789!xyz',
  },
  org_admin: {
    email: process.env.E2E_ORG_ADMIN_EMAIL || 'orgadmin@test.payroll.com',
    password: process.env.E2E_ORG_ADMIN_PASSWORD || 'OrgAdmin789!xyz',
  },
  manager: {
    email: process.env.E2E_MANAGER_EMAIL || 'manager@test.payroll.com',
    password: process.env.E2E_MANAGER_PASSWORD || 'Manager789!xyz',
  },
  consultant: {
    email: process.env.E2E_CONSULTANT_EMAIL || 'consultant@test.payroll.com',
    password: process.env.E2E_CONSULTANT_PASSWORD || 'Consultant789!xyz',
  },
  viewer: {
    email: process.env.E2E_VIEWER_EMAIL || 'viewer@test.payroll.com',
    password: process.env.E2E_VIEWER_PASSWORD || 'Viewer789!xyz',
  },
};

async function authenticateUser(email: string, password: string, page: any) {
  // Navigate to sign-in page
  await page.goto('/sign-in');
  
  // Wait for Clerk to initialize and form to appear
  await page.waitForFunction(() => {
    const emailInput = document.querySelector('input[name="email"]');
    const loadingText = document.body.textContent?.includes('Loading authentication...');
    return emailInput && !loadingText;
  }, { timeout: 60000 });
  
  // Fill and submit the form
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  // Wait for successful authentication and redirect
  await page.waitForURL(/\/dashboard/, { timeout: 30000 });
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
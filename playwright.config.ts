import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

/**
 * Playwright configuration for E2E testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true, // Enable parallel execution for better performance
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4, // More workers for better performance
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['junit', { outputFile: 'test-results/playwright-junit.xml' }]
  ],
  timeout: 45 * 1000, // Increased timeout for complex workflows
  expect: {
    timeout: 10000, // Increased expect timeout
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Add more debugging options
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  
  // globalSetup: './e2e/global-setup.ts',

  projects: [
    // Setup projects for each role
    {
      name: 'auth-setup',
      testMatch: '**/auth.setup.ts',
    },
    
    // Individual auth setup projects for efficient role testing
    {
      name: 'auth-setup-consultant',
      testMatch: '**/auth-setups/consultant.setup.ts',
    },
    {
      name: 'auth-setup-developer',
      testMatch: '**/auth-setups/developer.setup.ts',
    },
    {
      name: 'auth-setup-admin',
      testMatch: '**/auth-setups/admin.setup.ts',
    },
    {
      name: 'auth-setup-manager',
      testMatch: '**/auth-setups/manager.setup.ts',
    },
    {
      name: 'auth-setup-viewer',
      testMatch: '**/auth-setups/viewer.setup.ts',
    },
    
    // Role-based comprehensive testing projects
    {
      name: 'developer-complete',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/developer.json',
      },
      dependencies: ['auth-setup-developer'],
      testMatch: [
        '**/roles/developer-complete.spec.ts'
      ],
    },
    
    {
      name: 'org-admin-comprehensive',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['auth-setup-admin'],
      testMatch: [
        '**/roles/org-admin-comprehensive.spec.ts'
      ],
    },
    
    {
      name: 'manager-team-operations',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/manager.json',
      },
      dependencies: ['auth-setup-manager'],
      testMatch: [
        '**/roles/manager-team-operations.spec.ts'
      ],
    },
    
    {
      name: 'consultant-workflows',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/consultant.json',
      },
      dependencies: ['auth-setup-consultant'],
      testMatch: [
        '**/roles/consultant-workflows.spec.ts'
      ],
    },
    
    {
      name: 'viewer-readonly',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/viewer.json',
      },
      dependencies: ['auth-setup-viewer'],
      testMatch: [
        '**/roles/viewer-readonly.spec.ts'
      ],
    },
    
    // Legacy admin/management tests (keep for compatibility)
    {
      name: 'admin-tests',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['auth-setup'],
      testMatch: [
        '**/admin-*.spec.ts',
        '**/critical-*.spec.ts',
        '**/dashboard-*.spec.ts',
        '**/data-integrity.spec.ts'
      ],
    },
    
    {
      name: 'manager-tests',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/manager.json',
      },
      dependencies: ['auth-setup'],
      testMatch: [
        '**/manager-*.spec.ts',
        '**/team-*.spec.ts'
      ],
    },
    
    {
      name: 'consultant-tests',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/consultant.json',
      },
      dependencies: ['auth-setup'],
      testMatch: [
        '**/consultant-*.spec.ts',
        '**/operational-*.spec.ts'
      ],
    },
    
    {
      name: 'viewer-tests',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/viewer.json',
      },
      dependencies: ['auth-setup'],
      testMatch: [
        '**/viewer-*.spec.ts',
        '**/readonly-*.spec.ts'
      ],
    },
    
    // Cross-role boundary testing
    {
      name: 'permission-boundaries',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        '**/permission-boundaries.spec.ts'
      ],
    },
    
    // Comprehensive role-based testing suite
    {
      name: 'role-based-comprehensive',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['auth-setup'],
      testMatch: [
        '**/roles/*.spec.ts'
      ],
    },
    
    // All tests project for running everything
    {
      name: 'all-tests',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['auth-setup'],
      testMatch: [
        '**/roles/*.spec.ts',
        '**/permission-boundaries.spec.ts', 
        '**/data-integrity.spec.ts'
      ],
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    env: {
      // Pass test environment variables to the dev server
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    },
  },
});
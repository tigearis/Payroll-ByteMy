import { test, expect } from '@playwright/test';

// Test data constants
const TEST_DATA = {
  client: {
    name: 'Test Client Ltd',
    email: 'test@testclient.com'
  },
  payroll: {
    name: 'Test Payroll - E2E'
  },
  service: {
    name: 'Basic Payroll Processing',
    rate: 150.00
  }
};

test.describe('3-Tier Billing System End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Assume authentication is already handled or we're in a test environment
    // In a real scenario, you would handle login here
  });

  test('Complete billing workflow from client setup to invoice generation', async ({ page }) => {
    // Step 1: Create a new client
    await test.step('Create new client', async () => {
      await page.goto('/clients/new');
      
      await page.fill('input[name="name"]', TEST_DATA.client.name);
      await page.fill('input[name="contactEmail"]', TEST_DATA.client.email);
      await page.check('input[name="active"]');
      
      await page.click('button[type="submit"]');
      
      // Wait for success message or redirect
      await expect(page.locator('text=Client created successfully')).toBeVisible();
    });

    // Step 2: Set up service agreements using the onboarding wizard
    await test.step('Complete client onboarding with service selection', async () => {
      // Navigate to onboarding wizard
      await page.goto('/onboarding');
      
      // Select the test client
      await page.click('select[name="clientId"]');
      await page.click(`text=${TEST_DATA.client.name}`);
      
      // Set client size and industry
      await page.selectOption('select[name="clientSize"]', 'medium');
      await page.fill('input[name="industry"]', 'General');
      
      await page.click('button:has-text("Next")');
      
      // Choose bundle or custom configuration
      await page.click('text=Custom Configuration');
      await page.click('button:has-text("Next")');
      
      // Select services
      await page.check(`input[type="checkbox"][data-service="${TEST_DATA.service.name}"]`);
      
      // Set custom rate
      await page.fill(`input[name="customRate-${TEST_DATA.service.name}"]`, TEST_DATA.service.rate.toString());
      
      await page.click('button:has-text("Next")');
      
      // Review and confirm
      await expect(page.locator('text=Review & Confirm')).toBeVisible();
      await expect(page.locator(`text=${TEST_DATA.service.name}`)).toBeVisible();
      await expect(page.locator(`text=$${TEST_DATA.service.rate}`)).toBeVisible();
      
      await page.click('button:has-text("Complete Onboarding")');
      
      // Wait for completion
      await expect(page.locator('text=Client onboarding completed successfully')).toBeVisible();
    });

    // Step 3: Create a payroll
    await test.step('Create payroll for the client', async () => {
      await page.goto('/payrolls/new');
      
      await page.fill('input[name="name"]', TEST_DATA.payroll.name);
      await page.selectOption('select[name="clientId"]', { label: TEST_DATA.client.name });
      
      // Set payroll dates (e.g., weekly for next 4 weeks)
      await page.fill('input[name="startDate"]', '2025-01-06');
      await page.fill('input[name="endDate"]', '2025-01-31');
      await page.selectOption('select[name="frequency"]', 'weekly');
      
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Payroll created successfully')).toBeVisible();
    });

    // Step 4: Complete payroll dates to trigger Tier 1 billing
    await test.step('Complete payroll dates and verify Tier 1 billing', async () => {
      // Navigate to the created payroll
      await page.goto('/payrolls');
      await page.click(`text=${TEST_DATA.payroll.name}`);
      
      // Complete the first payroll date
      const firstPayrollDate = page.locator('.payroll-date-card').first();
      await firstPayrollDate.click('button:has-text("Complete")');
      
      // Confirm completion
      await page.click('button:has-text("Confirm")');
      
      // Wait for completion and billing generation
      await expect(page.locator('text=Payroll date completed')).toBeVisible();
      
      // Verify Tier 1 billing was generated
      await page.goto('/billing/items');
      await expect(page.locator(`text=${TEST_DATA.service.name}`)).toBeVisible();
      await expect(page.locator('text=Tier 1')).toBeVisible();
    });

    // Step 5: Complete all payroll dates to trigger Tier 2 billing
    await test.step('Complete all payroll dates and verify Tier 2 billing', async () => {
      await page.goto(`/payrolls/${TEST_DATA.payroll.name}`);
      
      // Complete remaining payroll dates
      const payrollDates = page.locator('.payroll-date-card:not(.completed)');
      const count = await payrollDates.count();
      
      for (let i = 0; i < count; i++) {
        const payrollDate = payrollDates.nth(i);
        await payrollDate.click('button:has-text("Complete")');
        await page.click('button:has-text("Confirm")');
        await page.waitForTimeout(1000); // Wait for completion processing
      }
      
      // Verify all dates are completed
      await expect(page.locator('.payroll-date-card.completed')).toHaveCount(4);
      
      // Check if Tier 2 billing was triggered
      await page.goto('/billing/items');
      await page.selectOption('select[name="tierFilter"]', 'payroll');
      await expect(page.locator('text=Tier 2')).toBeVisible();
    });

    // Step 6: Verify monthly billing completion and Tier 3 billing
    await test.step('Verify monthly billing completion and Tier 3 billing', async () => {
      // Navigate to monthly billing dashboard
      await page.goto('/billing/monthly-dashboard');
      
      // Find the client's monthly record
      const monthlyRecord = page.locator(`tr:has-text("${TEST_DATA.client.name}")`);
      await expect(monthlyRecord).toBeVisible();
      
      // Check if status is "ready_to_bill"
      await expect(monthlyRecord.locator('text=ready_to_bill')).toBeVisible();
      
      // Trigger Tier 3 billing if auto-billing is disabled
      const generateButton = monthlyRecord.locator('button:has-text("Generate Billing")');
      if (await generateButton.isVisible()) {
        await generateButton.click();
        await page.click('button:has-text("Confirm")');
      }
      
      // Verify Tier 3 billing items
      await page.goto('/billing/items');
      await page.selectOption('select[name="tierFilter"]', 'client_monthly');
      await expect(page.locator('text=Tier 3')).toBeVisible();
    });

    // Step 7: Generate and verify invoice
    await test.step('Generate invoice from billing items', async () => {
      await page.goto('/billing/invoices/new');
      
      // Select the test client
      await page.selectOption('select[name="clientId"]', { label: TEST_DATA.client.name });
      
      // Select billing period
      await page.fill('input[name="billingPeriodStart"]', '2025-01-01');
      await page.fill('input[name="billingPeriodEnd"]', '2025-01-31');
      
      // Load billing items
      await page.click('button:has-text("Load Items")');
      
      // Verify billing items are loaded
      await expect(page.locator('.billing-item-row')).toHaveCount.toBeGreaterThan(0);
      
      // Select all items
      await page.check('input[name="selectAll"]');
      
      // Generate invoice
      await page.fill('input[name="invoiceNumber"]', 'INV-2025-001');
      await page.fill('textarea[name="notes"]', 'Test invoice generated via E2E testing');
      
      await page.click('button:has-text("Generate Invoice")');
      
      // Verify invoice creation
      await expect(page.locator('text=Invoice generated successfully')).toBeVisible();
      
      // Verify invoice details
      await expect(page.locator('text=INV-2025-001')).toBeVisible();
      await expect(page.locator(`text=${TEST_DATA.client.name}`)).toBeVisible();
    });

    // Step 8: Verify analytics and reporting
    await test.step('Verify cost vs revenue analytics', async () => {
      await page.goto('/billing/analytics');
      
      // Check that analytics load
      await expect(page.locator('text=Cost vs Revenue Analytics')).toBeVisible();
      
      // Verify summary metrics are displayed
      await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-cost"]')).toBeVisible();
      await expect(page.locator('[data-testid="profit"]')).toBeVisible();
      
      // Check that our test client appears in client analysis
      await page.click('tab:has-text("Client Analysis")');
      await expect(page.locator(`text=${TEST_DATA.client.name}`)).toBeVisible();
    });
  });

  test('Service template management workflow', async ({ page }) => {
    await test.step('Create and manage service templates', async () => {
      await page.goto('/billing/templates');
      
      // Create new service template
      await page.click('button:has-text("Create Template")');
      
      await page.fill('input[name="templateName"]', 'E2E Test Service');
      await page.fill('textarea[name="description"]', 'Service template created during E2E testing');
      await page.selectOption('select[name="categoryId"]', { index: 0 });
      await page.selectOption('select[name="serviceType"]', 'time_based');
      await page.selectOption('select[name="billingTier"]', 'payroll_date');
      await page.fill('input[name="defaultRate"]', '200');
      
      await page.click('button:has-text("Create Template")');
      
      await expect(page.locator('text=Service template created successfully')).toBeVisible();
      await expect(page.locator('text=E2E Test Service')).toBeVisible();
    });

    await test.step('Create template bundle', async () => {
      await page.goto('/billing/templates/bundles');
      
      await page.click('button:has-text("Create Bundle")');
      
      await page.fill('input[name="bundleName"]', 'E2E Test Bundle');
      await page.fill('textarea[name="description"]', 'Bundle created during E2E testing');
      await page.selectOption('select[name="targetClientSize"]', 'small');
      await page.fill('input[name="targetIndustry"]', 'Testing');
      
      await page.click('button:has-text("Next")');
      
      // Select the template we just created
      await page.check('input[data-template="E2E Test Service"]');
      
      await page.click('button:has-text("Next")');
      
      await page.fill('input[name="estimatedMonthlyCost"]', '800');
      await page.fill('input[name="bundleDiscountPercentage"]', '10');
      
      await page.click('button:has-text("Create Bundle")');
      
      await expect(page.locator('text=Template bundle created successfully')).toBeVisible();
    });
  });

  test('Payroll service overrides workflow', async ({ page }) => {
    // Assumes a payroll already exists from previous test or setup
    await test.step('Create payroll service override', async () => {
      await page.goto('/payrolls');
      await page.click('text=Test Payroll'); // Click on an existing payroll
      
      await page.click('tab:has-text("Service Overrides")');
      await page.click('button:has-text("Add Override")');
      
      // Override existing client service
      await page.check('input[value="existing"]');
      await page.selectOption('select[name="serviceId"]', { index: 0 });
      
      await page.fill('input[name="customRate"]', '175');
      await page.fill('textarea[name="customDescription"]', 'Special rate for this payroll');
      await page.check('input[name="isOneTime"]');
      
      await page.click('button:has-text("Create Override")');
      
      await expect(page.locator('text=Payroll service override created successfully')).toBeVisible();
    });
  });

  test('Automatic billing processing', async ({ page }) => {
    await test.step('Test automatic billing API endpoint', async () => {
      // This would typically be triggered by a cron job, but we can test the API directly
      const response = await page.request.get('/api/billing/process-automatic');
      const result = await response.json();
      
      expect(response.ok()).toBeTruthy();
      expect(result.success).toBeTruthy();
      expect(result.summary).toBeDefined();
      expect(result.tier1Results).toBeDefined();
      expect(result.tier2Results).toBeDefined();
      expect(result.tier3Results).toBeDefined();
    });
    
    await test.step('Verify automatic billing results', async () => {
      await page.goto('/billing/items');
      
      // Filter by date range to see recent items
      await page.fill('input[name="dateFrom"]', '2025-01-01');
      await page.fill('input[name="dateTo"]', '2025-01-31');
      await page.click('button:has-text("Apply Filters")');
      
      // Verify that billing items exist
      await expect(page.locator('.billing-item-row')).toHaveCount.toBeGreaterThan(0);
      
      // Check for items from each tier
      await expect(page.locator('text=Tier 1')).toBeVisible();
      await expect(page.locator('text=Tier 2')).toBeVisible();
      await expect(page.locator('text=Tier 3')).toBeVisible();
    });
  });

  test('Error handling and edge cases', async ({ page }) => {
    await test.step('Test billing without completed payroll dates', async () => {
      // Try to generate Tier 2 billing for incomplete payroll
      const response = await page.request.post('/api/billing/tier2/generate', {
        data: {
          payrollId: 'incomplete-payroll-id',
          completedBy: 'test-user-id'
        }
      });
      
      const result = await response.json();
      expect(result.success).toBeFalsy();
      expect(result.error).toContain('must be completed');
    });

    await test.step('Test duplicate service agreement creation', async () => {
      await page.goto('/clients/test-client-id/services');
      
      // Try to add the same service twice
      await page.click('button:has-text("Add Service")');
      await page.selectOption('select[name="serviceId"]', { index: 0 });
      await page.click('button:has-text("Create Agreement")');
      
      // Second attempt should show validation error
      await page.click('button:has-text("Add Service")');
      await page.selectOption('select[name="serviceId"]', { index: 0 });
      await page.click('button:has-text("Create Agreement")');
      
      await expect(page.locator('text=Service already exists')).toBeVisible();
    });

    await test.step('Test invalid billing data', async () => {
      await page.goto('/billing/items/new');
      
      // Submit form with missing required fields
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Client is required')).toBeVisible();
      await expect(page.locator('text=Service is required')).toBeVisible();
    });
  });

  test('Performance and load testing', async ({ page }) => {
    await test.step('Test analytics page performance', async () => {
      const startTime = Date.now();
      
      await page.goto('/billing/analytics');
      
      // Wait for charts to load
      await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="client-chart"]')).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      
      // Assert that analytics page loads within reasonable time (5 seconds)
      expect(loadTime).toBeLessThan(5000);
    });

    await test.step('Test large dataset handling', async () => {
      // Navigate to billing items with large date range
      await page.goto('/billing/items');
      
      await page.fill('input[name="dateFrom"]', '2024-01-01');
      await page.fill('input[name="dateTo"]', '2025-12-31');
      await page.click('button:has-text("Apply Filters")');
      
      // Verify pagination works
      await expect(page.locator('.pagination')).toBeVisible();
      
      // Test pagination navigation
      if (await page.locator('button:has-text("Next")').isEnabled()) {
        await page.click('button:has-text("Next")');
        await expect(page.locator('.billing-item-row')).toHaveCount.toBeGreaterThan(0);
      }
    });
  });

  // Cleanup after tests
  test.afterEach(async ({ page }) => {
    // Clean up test data if needed
    // This would typically involve API calls to delete test records
    console.log('Test completed, cleanup would happen here');
  });
});

// Helper functions for test data management
async function createTestClient(page: any) {
  // Helper to create a test client
  await page.goto('/clients/new');
  await page.fill('input[name="name"]', TEST_DATA.client.name);
  await page.fill('input[name="contactEmail"]', TEST_DATA.client.email);
  await page.check('input[name="active"]');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Client created successfully')).toBeVisible();
}

async function cleanupTestData(page: any) {
  // Helper to cleanup test data
  try {
    // Delete test billing items
    await page.request.delete('/api/test/cleanup/billing-items');
    
    // Delete test payrolls
    await page.request.delete('/api/test/cleanup/payrolls');
    
    // Delete test clients
    await page.request.delete('/api/test/cleanup/clients');
    
    // Delete test service templates
    await page.request.delete('/api/test/cleanup/templates');
  } catch (error) {
    console.warn('Cleanup failed:', error);
  }
}

export { createTestClient, cleanupTestData };
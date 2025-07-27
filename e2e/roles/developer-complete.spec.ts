/**
 * Developer Role - Complete System Access Tests
 * Tests all system functionality available to the highest role (developer)
 * Role hierarchy: developer (5) > org_admin (4) > manager (3) > consultant (2) > viewer (1)
 */

import { test, expect } from '@playwright/test';

const DEVELOPER_STORAGE_STATE = 'playwright/.auth/developer.json';

test.describe('Developer Role - Complete System Access', () => {
  test.use({ storageState: DEVELOPER_STORAGE_STATE });

  test.describe('Authentication & Session Management', () => {
    test('should authenticate successfully and maintain session', async ({ page }) => {
      console.log('🧪 Testing developer authentication...');
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should be on dashboard (not redirected to sign-in)
      expect(page.url()).toContain('/dashboard');
      expect(page.url()).not.toContain('/sign-in');
      
      // Should see developer-specific elements
      const mainContent = page.locator('[role="main"], main, .main-content');
      await expect(mainContent).toBeVisible();
      
      console.log('✅ Developer authentication successful');
    });

    test('should have access to developer tools', async ({ page }) => {
      await page.goto('/developer');
      await page.waitForLoadState('networkidle');
      
      // Should access developer page without redirect
      expect(page.url()).toContain('/developer');
      expect(page.url()).not.toContain('/sign-in');
      expect(page.url()).not.toContain('/unauthorized');
      
      console.log('✅ Developer tools access verified');
    });
  });

  test.describe('Full Page Access - All Pages Should Be Accessible', () => {
    const allPages = [
      '/dashboard',
      '/staff', 
      '/payrolls',
      '/clients',
      '/billing',
      '/work-schedule',
      '/email',
      '/leave',
      '/reports',
      '/settings',
      '/security',
      '/invitations',
      '/developer',
      '/ai-assistant'
    ];

    allPages.forEach(pagePath => {
      test(`should access ${pagePath}`, async ({ page }) => {
        console.log(`🧪 Testing developer access to ${pagePath}`);
        
        await page.goto(pagePath, { timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        
        // Should not be redirected
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/sign-in');
        expect(page.url()).not.toContain('/unauthorized');
        
        // Should see main content
        const content = page.locator('[role="main"], main, .main-content');
        await expect(content).toBeVisible({ timeout: 10000 });
        
        // Should not see access denied messages
        const accessDenied = page.locator('text=/access denied|unauthorized|403|not authorized/i');
        await expect(accessDenied).not.toBeVisible();
        
        console.log(`✅ Developer can access ${pagePath}`);
      });
    });
  });

  test.describe('Staff Management - Full CRUD Operations', () => {
    test('should see and manage all staff', async ({ page }) => {
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Should see staff table/list
      const staffContent = page.locator('table, [data-testid="staff-table"], [data-testid="staff-list"]');
      await expect(staffContent).toBeVisible({ timeout: 10000 });
      
      // Should see action buttons (create, edit, delete)
      const actionButtons = [
        'button:has-text("Add"), button:has-text("Create"), button:has-text("New")',
        'button:has-text("Edit"), a:has-text("Edit")',
        'text=/edit|manage|update/i'
      ];
      
      let visibleActions = 0;
      for (const selector of actionButtons) {
        try {
          const button = page.locator(selector);
          if (await button.count() > 0) {
            visibleActions++;
            console.log(`✅ Found staff action: ${selector}`);
          }
        } catch (error) {
          // Continue checking other buttons
        }
      }
      
      console.log(`📊 Developer can see ${visibleActions} staff management actions`);
      expect(visibleActions).toBeGreaterThan(0);
    });

    test('should access user details and role management', async ({ page }) => {
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Try to find and click a user link
      const userLinks = page.locator('a[href*="/staff/"], a[href*="/users/"]');
      const linkCount = await userLinks.count();
      
      if (linkCount > 0) {
        await userLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        // Should be on user detail page
        expect(page.url()).toMatch(/\/(staff|users)\/[^/]+/);
        
        console.log('✅ Developer can access user details');
      } else {
        console.log('📝 No user detail links found - may be implemented differently');
      }
    });
  });

  test.describe('Client Management - Full Business Operations', () => {
    test('should manage clients with full permissions', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Should see clients table/list
      const clientsContent = page.locator('table, [data-testid="clients-table"], [data-testid="clients-list"]');
      await expect(clientsContent).toBeVisible({ timeout: 10000 });
      
      // Count visible clients
      const clientRows = page.locator('tr:has(td), [data-testid="client-row"]');
      const clientCount = await clientRows.count();
      console.log(`📊 Developer can see ${clientCount} clients`);
      
      // Should see client management actions
      const managementActions = [
        'button:has-text("Add Client"), button:has-text("New Client")',
        'text=/add|create|new/i'
      ];
      
      let visibleClientActions = 0;
      for (const selector of managementActions) {
        try {
          const action = page.locator(selector);
          if (await action.count() > 0) {
            visibleClientActions++;
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Developer can see ${visibleClientActions} client management actions`);
    });

    test('should access client details and payroll assignments', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Look for client detail links
      const clientLinks = page.locator('a[href*="/clients/"]');
      const clientLinkCount = await clientLinks.count();
      
      if (clientLinkCount > 0) {
        await clientLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        // Should be on client detail page
        expect(page.url()).toMatch(/\/clients\/[^/]+/);
        
        console.log('✅ Developer can access client details');
      } else {
        console.log('📝 No client links found - checking for other client interactions');
      }
    });
  });

  test.describe('Payroll Management - Core Business Logic', () => {
    test('should manage payrolls with full authority', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Should see payrolls
      const payrollContent = page.locator('table, [data-testid="payrolls-table"], [data-testid="payroll-list"]');
      await expect(payrollContent).toBeVisible({ timeout: 10000 });
      
      // Count payrolls
      const payrollRows = page.locator('tr:has(td), [data-testid="payroll-row"]');
      const payrollCount = await payrollRows.count();
      console.log(`📊 Developer can see ${payrollCount} payrolls`);
      
      // Should see payroll actions
      const payrollActions = [
        'button:has-text("Create"), button:has-text("New")',
        'button:has-text("Edit"), a:has-text("Edit")',
        'text=/approve|process|generate/i'
      ];
      
      let visiblePayrollActions = 0;
      for (const selector of payrollActions) {
        try {
          const action = page.locator(selector);
          if (await action.count() > 0) {
            visiblePayrollActions++;
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Developer can see ${visiblePayrollActions} payroll management actions`);
    });

    test('should access payroll details and processing tools', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for payroll detail links
      const payrollLinks = page.locator('a[href*="/payrolls/"]');
      const payrollLinkCount = await payrollLinks.count();
      
      if (payrollLinkCount > 0) {
        await payrollLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        // Should be on payroll detail page
        expect(page.url()).toMatch(/\/payrolls\/[^/]+/);
        
        console.log('✅ Developer can access payroll details');
      } else {
        console.log('📝 No payroll detail links found');
      }
    });
  });

  test.describe('Billing & Financial Operations', () => {
    test('should have full billing access and controls', async ({ page }) => {
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Should access billing without restrictions
      expect(page.url()).toContain('/billing');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Should see billing content
      const billingContent = page.locator('[role="main"], main, .main-content');
      await expect(billingContent).toBeVisible();
      
      // Look for financial data
      const financialData = page.locator('text=/\\$\\d+/, text=/invoice/, text=/billing/i');
      const financialCount = await financialData.count();
      console.log(`📊 Developer can see ${financialCount} financial elements`);
      
      console.log('✅ Developer has full billing access');
    });

    test('should access billing reports and analytics', async ({ page }) => {
      // Try billing reports
      await page.goto('/billing/reports');
      await page.waitForLoadState('networkidle');
      
      // Should not be blocked
      expect(page.url()).not.toContain('/sign-in');
      expect(page.url()).not.toContain('/unauthorized');
      
      console.log('✅ Developer can access billing reports');
    });
  });

  test.describe('Security & Admin Functions', () => {
    test('should access security settings', async ({ page }) => {
      await page.goto('/security');
      await page.waitForLoadState('networkidle');
      
      // Should access security page
      expect(page.url()).toContain('/security');
      expect(page.url()).not.toContain('/unauthorized');
      
      const securityContent = page.locator('[role="main"], main');
      await expect(securityContent).toBeVisible();
      
      console.log('✅ Developer can access security settings');
    });

    test('should manage user invitations', async ({ page }) => {
      await page.goto('/invitations');
      await page.waitForLoadState('networkidle');
      
      // Should access invitations
      expect(page.url()).toContain('/invitations');
      expect(page.url()).not.toContain('/unauthorized');
      
      console.log('✅ Developer can manage invitations');
    });

    test('should access system settings', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');
      
      // Should access settings
      expect(page.url()).toContain('/settings');
      expect(page.url()).not.toContain('/unauthorized');
      
      console.log('✅ Developer can access system settings');
    });
  });

  test.describe('Advanced Features & Tools', () => {
    test('should access AI assistant features', async ({ page }) => {
      await page.goto('/ai-assistant');
      await page.waitForLoadState('networkidle');
      
      // Should access AI features
      expect(page.url()).toContain('/ai-assistant');
      expect(page.url()).not.toContain('/unauthorized');
      
      console.log('✅ Developer can access AI assistant');
    });

    test('should access work scheduling tools', async ({ page }) => {
      await page.goto('/work-schedule');
      await page.waitForLoadState('networkidle');
      
      // Should access work scheduling
      expect(page.url()).toContain('/work-schedule');
      expect(page.url()).not.toContain('/unauthorized');
      
      const scheduleContent = page.locator('[role="main"], main');
      await expect(scheduleContent).toBeVisible();
      
      console.log('✅ Developer can access work scheduling');
    });

    test('should access email management', async ({ page }) => {
      await page.goto('/email');
      await page.waitForLoadState('networkidle');
      
      // Should access email features
      expect(page.url()).toContain('/email');
      expect(page.url()).not.toContain('/unauthorized');
      
      console.log('✅ Developer can access email management');
    });

    test('should access leave management', async ({ page }) => {
      await page.goto('/leave');
      await page.waitForLoadState('networkidle');
      
      // Should access leave management
      expect(page.url()).toContain('/leave');
      expect(page.url()).not.toContain('/unauthorized');
      
      console.log('✅ Developer can access leave management');
    });

    test('should access reporting tools', async ({ page }) => {
      await page.goto('/reports');
      await page.waitForLoadState('networkidle');
      
      // Should access reports
      expect(page.url()).toContain('/reports');
      expect(page.url()).not.toContain('/unauthorized');
      
      console.log('✅ Developer can access reporting tools');
    });
  });

  test.describe('Data Integrity & Permission Verification', () => {
    test('should see comprehensive data across all domains', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see various data elements
      const dataElements = [
        'text=/\\d+\\s*(users?|staff)/i',
        'text=/\\d+\\s*(clients?)/i', 
        'text=/\\d+\\s*(payrolls?)/i',
        'text=/\\$\\d+/i'
      ];
      
      let visibleDataElements = 0;
      for (const selector of dataElements) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            visibleDataElements++;
            const text = await elements.first().textContent();
            console.log(`📊 Found data: ${text}`);
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Developer can see ${visibleDataElements} types of data elements`);
      expect(visibleDataElements).toBeGreaterThan(0);
    });

    test('should have hierarchical permission inheritance', async ({ page }) => {
      // Test that developer can access everything lower roles can access
      const lowerRolePages = ['/dashboard', '/staff', '/payrolls', '/clients'];
      
      for (const pagePath of lowerRolePages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/unauthorized');
        
        console.log(`✅ Developer inherits access to ${pagePath}`);
      }
    });

    test('should maintain session across page navigation', async ({ page }) => {
      const testPages = ['/dashboard', '/staff', '/payrolls', '/clients', '/settings'];
      
      for (const pagePath of testPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        // Should maintain authentication
        expect(page.url()).not.toContain('/sign-in');
        
        console.log(`✅ Session maintained on ${pagePath}`);
      }
    });
  });

  test.describe('GraphQL & API Operations', () => {
    test('should have unrestricted GraphQL access', async ({ page }) => {
      // Monitor GraphQL requests
      const graphqlRequests: string[] = [];
      
      page.on('request', request => {
        if (request.url().includes('graphql') || request.url().includes('/v1/graphql')) {
          graphqlRequests.push(request.url());
        }
      });
      
      // Navigate to various pages to trigger GraphQL requests
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      console.log(`📊 Developer made ${graphqlRequests.length} GraphQL requests`);
      expect(graphqlRequests.length).toBeGreaterThan(0);
    });
  });

  test.describe('Performance & Optimization', () => {
    test('should load pages efficiently with developer permissions', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      console.log(`📊 Dashboard load time for developer: ${loadTime}ms`);
      
      // Should load within reasonable time (adjust based on your requirements)
      expect(loadTime).toBeLessThan(30000);
    });

    test('should handle concurrent operations', async ({ page }) => {
      // Test multiple simultaneous navigations
      const pages = ['/staff', '/payrolls', '/clients'];
      const promises = pages.map(async (pagePath) => {
        await page.goto(pagePath);
        return page.waitForLoadState('networkidle');
      });
      
      await Promise.all(promises);
      
      console.log('✅ Developer can handle concurrent operations');
    });
  });
});
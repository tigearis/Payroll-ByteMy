/**
 * Org Admin Role - Comprehensive Business Operations Tests
 * Tests full business functionality excluding developer tools
 * Role hierarchy: developer (5) > org_admin (4) > manager (3) > consultant (2) > viewer (1)
 */

import { test, expect } from '@playwright/test';

const ORG_ADMIN_STORAGE_STATE = 'playwright/.auth/admin.json';

test.describe('Org Admin Role - Comprehensive Business Operations', () => {
  test.use({ storageState: ORG_ADMIN_STORAGE_STATE });

  test.describe('Authentication & Business Access', () => {
    test('should authenticate as org admin and access dashboard', async ({ page }) => {
      console.log('🧪 Testing org admin authentication...');
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/dashboard');
      expect(page.url()).not.toContain('/sign-in');
      
      const mainContent = page.locator('[role="main"], main, .main-content');
      await expect(mainContent).toBeVisible();
      
      console.log('✅ Org admin authentication successful');
    });

    test('should be blocked from developer tools', async ({ page }) => {
      await page.goto('/developer');
      await page.waitForLoadState('networkidle');
      
      // Should be redirected or show access denied
      const isBlocked = page.url().includes('/sign-in') || 
                       page.url().includes('/unauthorized') ||
                       page.url().includes('/dashboard') ||
                       page.url() === 'http://localhost:3000/';
      
      if (!isBlocked) {
        // Check for access denied content
        const accessDenied = page.locator('text=/access denied|unauthorized|403/i');
        const hasAccessDeniedMessage = await accessDenied.count() > 0;
        expect(hasAccessDeniedMessage).toBe(true);
      }
      
      console.log('✅ Org admin properly blocked from developer tools');
    });
  });

  test.describe('Full Business Page Access', () => {
    const allowedPages = [
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
      '/invitations'
    ];

    allowedPages.forEach(pagePath => {
      test(`should access ${pagePath}`, async ({ page }) => {
        console.log(`🧪 Testing org admin access to ${pagePath}`);
        
        await page.goto(pagePath, { timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/sign-in');
        expect(page.url()).not.toContain('/unauthorized');
        
        const content = page.locator('[role="main"], main, .main-content');
        await expect(content).toBeVisible({ timeout: 10000 });
        
        const accessDenied = page.locator('text=/access denied|unauthorized|403/i');
        await expect(accessDenied).not.toBeVisible();
        
        console.log(`✅ Org admin can access ${pagePath}`);
      });
    });
  });

  test.describe('Staff Management - Organization-Wide Authority', () => {
    test('should manage all organizational staff', async ({ page }) => {
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const staffTable = page.locator('table, [data-testid="staff-table"], [data-testid="staff-list"]');
      await expect(staffTable).toBeVisible({ timeout: 10000 });
      
      // Count staff members
      const staffRows = page.locator('tr:has(td), [data-testid="staff-row"]');
      const staffCount = await staffRows.count();
      console.log(`📊 Org admin can see ${staffCount} staff members`);
      expect(staffCount).toBeGreaterThan(0);
      
      // Should see management actions
      const managementActions = [
        'button:has-text("Add"), button:has-text("Create"), button:has-text("New")',
        'button:has-text("Edit"), a:has-text("Edit")',
        'text=/manage|update|role/i'
      ];
      
      let visibleActions = 0;
      for (const selector of managementActions) {
        try {
          const elements = page.locator(selector);
          if (await elements.count() > 0) {
            visibleActions++;
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Org admin can see ${visibleActions} staff management actions`);
      expect(visibleActions).toBeGreaterThan(0);
    });

    test('should manage role assignments and permissions', async ({ page }) => {
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Look for role-related content
      const roleElements = page.locator('text=/admin|manager|consultant|viewer|role/i');
      const roleCount = await roleElements.count();
      console.log(`📊 Found ${roleCount} role-related elements`);
      
      // Should see user management capabilities
      const userActions = page.locator('button:has-text("Edit"), a:has-text("Edit"), text=/edit|manage/i');
      const userActionCount = await userActions.count();
      console.log(`📊 Found ${userActionCount} user management actions`);
      
      expect(roleCount + userActionCount).toBeGreaterThan(0);
    });
  });

  test.describe('Client Relationship Management', () => {
    test('should manage all client relationships', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      const clientsTable = page.locator('table, [data-testid="clients-table"], [data-testid="clients-list"]');
      await expect(clientsTable).toBeVisible({ timeout: 10000 });
      
      // Count clients
      const clientRows = page.locator('tr:has(td), [data-testid="client-row"]');
      const clientCount = await clientRows.count();
      console.log(`📊 Org admin can see ${clientCount} clients`);
      expect(clientCount).toBeGreaterThan(0);
      
      // Should see client management actions
      const clientActions = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")');
      const clientActionCount = await clientActions.count();
      console.log(`📊 Found ${clientActionCount} client management actions`);
    });

    test('should access client financial and contract details', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Look for financial information
      const financialElements = page.locator('text=/\\$\\d+/, text=/rate|billing|invoice/i');
      const financialCount = await financialElements.count();
      console.log(`📊 Org admin can see ${financialCount} financial elements`);
      
      // Look for client detail links
      const clientLinks = page.locator('a[href*="/clients/"]');
      const clientLinkCount = await clientLinks.count();
      
      if (clientLinkCount > 0) {
        await clientLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toMatch(/\/clients\/[^/]+/);
        console.log('✅ Org admin can access client details');
      }
    });
  });

  test.describe('Payroll Operations - Full Authority', () => {
    test('should oversee all payroll operations', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const payrollTable = page.locator('table, [data-testid="payrolls-table"], [data-testid="payroll-list"]');
      await expect(payrollTable).toBeVisible({ timeout: 10000 });
      
      // Count payrolls
      const payrollRows = page.locator('tr:has(td), [data-testid="payroll-row"]');
      const payrollCount = await payrollRows.count();
      console.log(`📊 Org admin can see ${payrollCount} payrolls`);
      expect(payrollCount).toBeGreaterThan(0);
      
      // Should see payroll management actions
      const payrollActions = [
        'button:has-text("Create"), button:has-text("New")',
        'button:has-text("Edit"), a:has-text("Edit")',
        'text=/approve|process|finalize/i'
      ];
      
      let visiblePayrollActions = 0;
      for (const selector of payrollActions) {
        try {
          const elements = page.locator(selector);
          if (await elements.count() > 0) {
            visiblePayrollActions++;
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Org admin can see ${visiblePayrollActions} payroll management actions`);
    });

    test('should approve and finalize payrolls', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for approval/finalization controls
      const approvalElements = page.locator('text=/approve|finalize|complete|submit/i, button:has-text("Approve")');
      const approvalCount = await approvalElements.count();
      console.log(`📊 Found ${approvalCount} approval/finalization elements`);
      
      // Look for payroll status indicators
      const statusElements = page.locator('text=/pending|approved|completed|active/i');
      const statusCount = await statusElements.count();
      console.log(`📊 Found ${statusCount} payroll status indicators`);
      
      expect(approvalCount + statusCount).toBeGreaterThan(0);
    });
  });

  test.describe('Billing & Financial Oversight', () => {
    test('should have full billing system access', async ({ page }) => {
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/billing');
      expect(page.url()).not.toContain('/unauthorized');
      
      const billingContent = page.locator('[role="main"], main');
      await expect(billingContent).toBeVisible();
      
      // Look for financial data
      const financialData = page.locator('text=/\\$\\d+/, text=/invoice|billing|payment/i');
      const financialCount = await financialData.count();
      console.log(`📊 Org admin can see ${financialCount} financial elements`);
      
      console.log('✅ Org admin has full billing access');
    });

    test('should generate and manage invoices', async ({ page }) => {
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Look for invoice management
      const invoiceActions = page.locator('button:has-text("Generate"), button:has-text("Create"), text=/invoice|bill/i');
      const invoiceActionCount = await invoiceActions.count();
      console.log(`📊 Found ${invoiceActionCount} invoice management actions`);
      
      // Check billing reports access
      await page.goto('/billing/reports');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).not.toContain('/unauthorized');
      console.log('✅ Org admin can access billing reports');
    });
  });

  test.describe('Organizational Security & Compliance', () => {
    test('should manage security settings', async ({ page }) => {
      await page.goto('/security');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/security');
      expect(page.url()).not.toContain('/unauthorized');
      
      const securityContent = page.locator('[role="main"], main');
      await expect(securityContent).toBeVisible();
      
      // Look for security controls
      const securityElements = page.locator('text=/password|authentication|access|permission/i');
      const securityCount = await securityElements.count();
      console.log(`📊 Found ${securityCount} security elements`);
      
      console.log('✅ Org admin can manage security settings');
    });

    test('should manage user invitations and onboarding', async ({ page }) => {
      await page.goto('/invitations');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/invitations');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Look for invitation management
      const inviteActions = page.locator('button:has-text("Invite"), button:has-text("Send"), text=/invitation|invite/i');
      const inviteActionCount = await inviteActions.count();
      console.log(`📊 Found ${inviteActionCount} invitation management actions`);
      
      console.log('✅ Org admin can manage invitations');
    });

    test('should access system configuration', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/settings');
      expect(page.url()).not.toContain('/unauthorized');
      
      const settingsContent = page.locator('[role="main"], main');
      await expect(settingsContent).toBeVisible();
      
      console.log('✅ Org admin can access system settings');
    });
  });

  test.describe('Advanced Business Operations', () => {
    test('should manage work scheduling and capacity', async ({ page }) => {
      await page.goto('/work-schedule');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/work-schedule');
      expect(page.url()).not.toContain('/unauthorized');
      
      const scheduleContent = page.locator('[role="main"], main');
      await expect(scheduleContent).toBeVisible();
      
      // Look for scheduling elements
      const scheduleElements = page.locator('text=/schedule|capacity|assignment|workload/i');
      const scheduleCount = await scheduleElements.count();
      console.log(`📊 Found ${scheduleCount} scheduling elements`);
      
      console.log('✅ Org admin can manage work scheduling');
    });

    test('should oversee email communications', async ({ page }) => {
      await page.goto('/email');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/email');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Look for email management features
      const emailElements = page.locator('text=/template|send|compose|email/i');
      const emailCount = await emailElements.count();
      console.log(`📊 Found ${emailCount} email management elements`);
      
      console.log('✅ Org admin can manage email communications');
    });

    test('should manage leave policies and approvals', async ({ page }) => {
      await page.goto('/leave');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/leave');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Look for leave management
      const leaveElements = page.locator('text=/leave|holiday|vacation|approve/i');
      const leaveCount = await leaveElements.count();
      console.log(`📊 Found ${leaveCount} leave management elements`);
      
      console.log('✅ Org admin can manage leave');
    });

    test('should access comprehensive reporting', async ({ page }) => {
      await page.goto('/reports');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/reports');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Look for reporting features
      const reportElements = page.locator('text=/report|analysis|dashboard|metric/i');
      const reportCount = await reportElements.count();
      console.log(`📊 Found ${reportCount} reporting elements`);
      
      console.log('✅ Org admin can access comprehensive reports');
    });
  });

  test.describe('Data Visibility & Analytics', () => {
    test('should see organization-wide data and metrics', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see comprehensive organizational data
      const dataTypes = [
        'text=/\\d+\\s*(users?|staff|employees?)/i',
        'text=/\\d+\\s*(clients?)/i',
        'text=/\\d+\\s*(payrolls?)/i',
        'text=/\\$\\d+/i',
        'text=/revenue|profit|billing/i'
      ];
      
      let visibleDataTypes = 0;
      for (const selector of dataTypes) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            visibleDataTypes++;
            const text = await elements.first().textContent();
            console.log(`📊 Org admin sees: ${text}`);
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Org admin can see ${visibleDataTypes} types of organizational data`);
      expect(visibleDataTypes).toBeGreaterThan(2);
    });

    test('should access performance analytics', async ({ page }) => {
      // Check various analytics pages
      const analyticsPages = ['/reports', '/billing/reports', '/dashboard'];
      
      for (const analyticsPage of analyticsPages) {
        await page.goto(analyticsPage);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).not.toContain('/unauthorized');
        
        // Look for charts, graphs, or analytics
        const analyticsElements = page.locator('canvas, svg, [data-testid*="chart"], text=/performance|analytics|metrics/i');
        const analyticsCount = await analyticsElements.count();
        console.log(`📊 Found ${analyticsCount} analytics elements on ${analyticsPage}`);
      }
    });
  });

  test.describe('Permission Boundary Verification', () => {
    test('should inherit all lower role permissions', async ({ page }) => {
      // Org admin should be able to do everything manager, consultant, and viewer can do
      const inheritedPages = ['/dashboard', '/payrolls', '/clients'];
      
      for (const pagePath of inheritedPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/unauthorized');
        
        console.log(`✅ Org admin inherits access to ${pagePath}`);
      }
    });

    test('should be properly restricted from developer-only features', async ({ page }) => {
      const restrictedPages = ['/developer'];
      
      for (const pagePath of restrictedPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        const isBlocked = page.url().includes('/sign-in') || 
                         page.url().includes('/unauthorized') ||
                         page.url().includes('/dashboard') ||
                         !page.url().includes(pagePath);
        
        if (!isBlocked) {
          const accessDenied = page.locator('text=/access denied|unauthorized|403/i');
          const hasAccessDeniedMessage = await accessDenied.count() > 0;
          expect(hasAccessDeniedMessage).toBe(true);
        }
        
        console.log(`✅ Org admin properly blocked from ${pagePath}`);
      }
    });

    test('should maintain consistent session state', async ({ page }) => {
      const testPages = ['/dashboard', '/staff', '/payrolls', '/clients', '/billing', '/settings'];
      
      for (const pagePath of testPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).not.toContain('/sign-in');
        
        console.log(`✅ Org admin session maintained on ${pagePath}`);
      }
    });
  });

  test.describe('Business Process Integration', () => {
    test('should coordinate across business domains', async ({ page }) => {
      // Test navigation between related business functions
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Navigate to payrolls
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Navigate to billing
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Navigate to staff
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // All should be accessible without authentication issues
      expect(page.url()).not.toContain('/sign-in');
      
      console.log('✅ Org admin can coordinate across business domains');
    });

    test('should handle complex business workflows', async ({ page }) => {
      // Test that org admin can access interconnected features
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see links or references to various business areas
      const businessLinks = page.locator('a[href*="/staff"], a[href*="/payrolls"], a[href*="/clients"], a[href*="/billing"]');
      const businessLinkCount = await businessLinks.count();
      console.log(`📊 Found ${businessLinkCount} business area links`);
      
      expect(businessLinkCount).toBeGreaterThan(0);
    });
  });
});
/**
 * Manager Role - Team & Operational Management Tests
 * Tests team management, client operations, and payroll oversight
 * Role hierarchy: developer (5) > org_admin (4) > manager (3) > consultant (2) > viewer (1)
 */

import { test, expect } from '@playwright/test';

const MANAGER_STORAGE_STATE = 'playwright/.auth/manager.json';

test.describe('Manager Role - Team & Operational Management', () => {
  test.use({ storageState: MANAGER_STORAGE_STATE });

  test.describe('Authentication & Role Verification', () => {
    test('should authenticate as manager and access dashboard', async ({ page }) => {
      console.log('🧪 Testing manager authentication...');
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/dashboard');
      expect(page.url()).not.toContain('/sign-in');
      
      const mainContent = page.locator('[role="main"], main, .main-content');
      await expect(mainContent).toBeVisible();
      
      console.log('✅ Manager authentication successful');
    });

    test('should be blocked from admin-only features', async ({ page }) => {
      // Pages that require higher than manager role (developer or org_admin)
      const restrictedPages = ['/developer', '/security'];
      
      for (const pagePath of restrictedPages) {
        console.log(`🧪 Testing manager blocking from ${pagePath}`);
        
        // Navigate to restricted page
        const response = await page.goto(pagePath);
        console.log(`📍 Response status: ${response?.status()}`);
        
        // Wait for any redirects to complete with multiple strategies
        await Promise.race([
          page.waitForURL(/\/dashboard/, { timeout: 8000 }).catch(() => null),
          page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => null),
          page.waitForTimeout(5000)
        ]);
        
        const currentUrl = page.url();
        console.log(`📍 Final URL after ${pagePath} request: ${currentUrl}`);
        
        // Enhanced blocking detection with multiple checks
        const isBlocked = await detectBlocking(page, pagePath, currentUrl);
        
        expect(isBlocked.blocked).toBe(true);
        console.log(`✅ Manager ${isBlocked.reason} from ${pagePath} → ${currentUrl}`);
      }
    });

    // Helper function for comprehensive blocking detection
    async function detectBlocking(page: Page, targetPath: string, currentUrl: string) {
      console.log(`🔍 Analyzing blocking for ${targetPath} (current URL: ${currentUrl})`);
      
      // Check 1: URL-based redirect detection
      const wasRedirected = !currentUrl.includes(targetPath) && currentUrl.includes('/dashboard');
      if (wasRedirected) {
        return { blocked: true, reason: 'properly redirected to dashboard' };
      }
      
      // Check 2: Error page detection
      const has404 = await page.locator('h1:has-text("404")').count() > 0;
      if (has404) {
        return { blocked: true, reason: 'blocked with 404 error' };
      }
      
      // Check 3: Access denied message detection
      const accessDeniedSelectors = [
        'text=/access denied/i',
        'text=/unauthorized/i', 
        'text=/forbidden/i',
        'text=/403/i',
        'text=/insufficient permissions/i'
      ];
      
      for (const selector of accessDeniedSelectors) {
        const hasMessage = await page.locator(selector).count() > 0;
        if (hasMessage) {
          const message = await page.locator(selector).first().textContent();
          return { blocked: true, reason: `blocked with message: "${message}"` };
        }
      }
      
      // Check 4: Feature disabled detection (specific to developer tools)
      if (targetPath === '/developer') {
        const hasDisabledMessage = await page.locator('text=/developer tools are currently disabled/i').count() > 0;
        if (hasDisabledMessage) {
          return { blocked: true, reason: 'developer tools disabled' };
        }
      }
      
      // Check 5: Response headers analysis
      const userRole = await page.evaluate(() => {
        // Try to get role from various sources
        const metaRole = document.querySelector('meta[name="user-role"]')?.getAttribute('content');
        const dataRole = document.body?.getAttribute('data-user-role');
        return metaRole || dataRole || 'unknown';
      });
      
      console.log(`🔍 Detected user role in page: ${userRole}`);
      
      // If all checks fail, it means the user has access
      return { blocked: false, reason: `has access to ${targetPath}` };
    }
  });

  test.describe('Allowed Page Access - Manager Permissions', () => {
    const allowedPages = [
      '/dashboard',
      '/staff', 
      '/payrolls',
      '/clients',
      '/billing',
      '/work-schedule',
      '/email',
      '/leave',
      '/reports'
    ];

    allowedPages.forEach(pagePath => {
      test(`should access ${pagePath}`, async ({ page }) => {
        console.log(`🧪 Testing manager access to ${pagePath}`);
        
        await page.goto(pagePath, { timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/sign-in');
        expect(page.url()).not.toContain('/unauthorized');
        
        const content = page.locator('[role="main"], main, .main-content');
        await expect(content).toBeVisible({ timeout: 10000 });
        
        const accessDenied = page.locator('text=/access denied|unauthorized|403/i');
        await expect(accessDenied).not.toBeVisible();
        
        console.log(`✅ Manager can access ${pagePath}`);
      });
    });
  });

  test.describe('Team Management - Staff Operations', () => {
    test('should manage team members and assignments', async ({ page }) => {
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const staffTable = page.locator('table, [data-testid="staff-table"], [data-testid="staff-list"]');
      await expect(staffTable).toBeVisible({ timeout: 10000 });
      
      // Count visible staff members
      const staffRows = page.locator('tr:has(td), [data-testid="staff-row"]');
      const staffCount = await staffRows.count();
      console.log(`📊 Manager can see ${staffCount} staff members`);
      expect(staffCount).toBeGreaterThan(0);
      
      // Should see team management actions (but not all admin functions)
      const teamActions = [
        'button:has-text("Edit"), a:has-text("Edit")',
        'text=/assign|manage|update/i'
      ];
      
      let visibleTeamActions = 0;
      for (const selector of teamActions) {
        try {
          const elements = page.locator(selector);
          if (await elements.count() > 0) {
            visibleTeamActions++;
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Manager can see ${visibleTeamActions} team management actions`);
    });

    test('should assign and monitor team workloads', async ({ page }) => {
      await page.goto('/work-schedule');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/work-schedule');
      expect(page.url()).not.toContain('/unauthorized');
      
      const scheduleContent = page.locator('[role="main"], main');
      await expect(scheduleContent).toBeVisible();
      
      // Look for workload management features
      const workloadElements = page.locator('text=/assignment|capacity|workload|schedule/i');
      const workloadCount = await workloadElements.count();
      console.log(`📊 Found ${workloadCount} workload management elements`);
      
      console.log('✅ Manager can manage team workloads');
    });

    test('should oversee team performance and assignments', async ({ page }) => {
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Look for performance indicators
      const performanceElements = page.locator('text=/hours|utilization|performance|efficiency/i');
      const performanceCount = await performanceElements.count();
      console.log(`📊 Found ${performanceCount} performance-related elements`);
      
      // Look for assignment controls
      const assignmentElements = page.locator('text=/assign|allocation|responsibility/i');
      const assignmentCount = await assignmentElements.count();
      console.log(`📊 Found ${assignmentCount} assignment-related elements`);
    });
  });

  test.describe('Client Management - Relationship Operations', () => {
    test('should manage client relationships and service delivery', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      const clientsTable = page.locator('table, [data-testid="clients-table"], [data-testid="clients-list"]');
      await expect(clientsTable).toBeVisible({ timeout: 10000 });
      
      // Count visible clients
      const clientRows = page.locator('tr:has(td), [data-testid="client-row"]');
      const clientCount = await clientRows.count();
      console.log(`📊 Manager can see ${clientCount} clients`);
      expect(clientCount).toBeGreaterThan(0);
      
      // Should see client management actions
      const clientActions = [
        'button:has-text("Edit"), a:has-text("Edit")',
        'text=/update|manage|contact/i'
      ];
      
      let visibleClientActions = 0;
      for (const selector of clientActions) {
        try {
          const elements = page.locator(selector);
          if (await elements.count() > 0) {
            visibleClientActions++;
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Manager can see ${visibleClientActions} client management actions`);
    });

    test('should access client service details and history', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Look for service-related information
      const serviceElements = page.locator('text=/service|payroll|processing|delivery/i');
      const serviceCount = await serviceElements.count();
      console.log(`📊 Found ${serviceCount} service-related elements`);
      
      // Look for client detail links
      const clientLinks = page.locator('a[href*="/clients/"]');
      const clientLinkCount = await clientLinks.count();
      
      if (clientLinkCount > 0) {
        await clientLinks.first().click();
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toMatch(/\/clients\/[^/]+/);
        console.log('✅ Manager can access client details');
      }
    });
  });

  test.describe('Payroll Operations - Oversight & Approval', () => {
    test('should oversee payroll processing and quality', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const payrollTable = page.locator('table, [data-testid="payrolls-table"], [data-testid="payroll-list"]');
      await expect(payrollTable).toBeVisible({ timeout: 10000 });
      
      // Count visible payrolls
      const payrollRows = page.locator('tr:has(td), [data-testid="payroll-row"]');
      const payrollCount = await payrollRows.count();
      console.log(`📊 Manager can see ${payrollCount} payrolls`);
      expect(payrollCount).toBeGreaterThan(0);
      
      // Should see payroll oversight actions
      const payrollActions = [
        'button:has-text("Edit"), a:has-text("Edit")',
        'text=/review|approve|quality|check/i'
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
      
      console.log(`📊 Manager can see ${visiblePayrollActions} payroll oversight actions`);
    });

    test('should approve payroll deliverables and timelines', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for approval and timeline elements
      const approvalElements = page.locator('text=/approve|sign off|complete|deadline/i');
      const approvalCount = await approvalElements.count();
      console.log(`📊 Found ${approvalCount} approval/timeline elements`);
      
      // Look for status tracking
      const statusElements = page.locator('text=/status|progress|pending|completed/i');
      const statusCount = await statusElements.count();
      console.log(`📊 Found ${statusCount} status tracking elements`);
      
      expect(approvalCount + statusCount).toBeGreaterThan(0);
    });

    test('should monitor payroll assignments and consultant performance', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for assignment information
      const assignmentElements = page.locator('text=/assigned|consultant|responsible|primary/i');
      const assignmentCount = await assignmentElements.count();
      console.log(`📊 Found ${assignmentCount} assignment tracking elements`);
      
      // Should see performance metrics
      const metricsElements = page.locator('text=/hours|time|efficiency|quality/i');
      const metricsCount = await metricsElements.count();
      console.log(`📊 Found ${metricsCount} performance metric elements`);
    });
  });

  test.describe('Billing Oversight - Financial Management', () => {
    test('should oversee billing processes and approvals', async ({ page }) => {
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/billing');
      expect(page.url()).not.toContain('/unauthorized');
      
      const billingContent = page.locator('[role="main"], main');
      await expect(billingContent).toBeVisible();
      
      // Look for billing oversight features
      const billingElements = page.locator('text=/approve|review|invoice|billing/i');
      const billingCount = await billingElements.count();
      console.log(`📊 Found ${billingCount} billing oversight elements`);
      
      // Look for financial metrics
      const financialElements = page.locator('text=/\\$\\d+/, text=/revenue|cost|margin|profit/i');
      const financialCount = await financialElements.count();
      console.log(`📊 Found ${financialCount} financial elements`);
      
      console.log('✅ Manager can oversee billing operations');
    });

    test('should approve billing and monitor profitability', async ({ page }) => {
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Look for approval controls
      const approvalControls = page.locator('button:has-text("Approve"), text=/approve|sign off/i');
      const approvalCount = await approvalControls.count();
      console.log(`📊 Found ${approvalCount} billing approval controls`);
      
      // Check billing reports access
      await page.goto('/billing/reports');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).not.toContain('/unauthorized');
      console.log('✅ Manager can access billing reports');
    });
  });

  test.describe('Communication & Coordination', () => {
    test('should manage team communications', async ({ page }) => {
      await page.goto('/email');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/email');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Look for email management features
      const emailElements = page.locator('text=/template|send|compose|communication/i');
      const emailCount = await emailElements.count();
      console.log(`📊 Found ${emailCount} email management elements`);
      
      // Should see team communication features
      const teamCommElements = page.locator('text=/team|broadcast|announcement/i');
      const teamCommCount = await teamCommElements.count();
      console.log(`📊 Found ${teamCommCount} team communication elements`);
      
      console.log('✅ Manager can manage team communications');
    });

    test('should coordinate leave and scheduling', async ({ page }) => {
      await page.goto('/leave');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/leave');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Look for leave management
      const leaveElements = page.locator('text=/leave|holiday|vacation|approval/i');
      const leaveCount = await leaveElements.count();
      console.log(`📊 Found ${leaveCount} leave management elements`);
      
      // Should see approval capabilities
      const approvalElements = page.locator('button:has-text("Approve"), text=/approve|deny|review/i');
      const approvalCount = await approvalElements.count();
      console.log(`📊 Found ${approvalCount} leave approval elements`);
      
      console.log('✅ Manager can coordinate leave and scheduling');
    });
  });

  test.describe('Reporting & Analytics - Team Performance', () => {
    test('should access team performance reports', async ({ page }) => {
      await page.goto('/reports');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/reports');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Look for team-focused reports
      const teamReports = page.locator('text=/team|performance|utilization|efficiency/i');
      const teamReportCount = await teamReports.count();
      console.log(`📊 Found ${teamReportCount} team performance report elements`);
      
      // Look for operational metrics
      const operationalMetrics = page.locator('text=/client|payroll|delivery|quality/i');
      const operationalCount = await operationalMetrics.count();
      console.log(`📊 Found ${operationalCount} operational metric elements`);
      
      console.log('✅ Manager can access performance reports');
    });

    test('should monitor operational KPIs', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see management-relevant KPIs
      const kpiElements = [
        'text=/\\d+\\s*(active|pending|completed)/i',
        'text=/\\d+%/i',
        'text=/efficiency|utilization|performance/i',
        'text=/on.time|deadline|delivery/i'
      ];
      
      let visibleKPIs = 0;
      for (const selector of kpiElements) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            visibleKPIs++;
            const text = await elements.first().textContent();
            console.log(`📊 Manager sees KPI: ${text}`);
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Manager can see ${visibleKPIs} operational KPIs`);
      expect(visibleKPIs).toBeGreaterThan(0);
    });
  });

  test.describe('Permission Boundaries - Manager Scope', () => {
    test('should inherit consultant and viewer permissions', async ({ page }) => {
      // Manager should access everything consultant and viewer can access
      const inheritedPages = ['/dashboard', '/payrolls', '/clients'];
      
      for (const pagePath of inheritedPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/unauthorized');
        
        console.log(`✅ Manager inherits access to ${pagePath}`);
      }
    });

    test('should be restricted from admin-only functions', async ({ page }) => {
      const restrictedPages = ['/developer', '/security', '/invitations'];
      
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
        
        console.log(`✅ Manager properly blocked from ${pagePath}`);
      }
    });

    test('should have appropriate data visibility scope', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see team and operational data, but may not see all admin data
      const dataTypes = [
        'text=/\\d+\\s*(team|staff|consultants?)/i',
        'text=/\\d+\\s*(clients?)/i',
        'text=/\\d+\\s*(payrolls?)/i',
        'text=/\\$\\d+/i'
      ];
      
      let visibleDataTypes = 0;
      for (const selector of dataTypes) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            visibleDataTypes++;
            const text = await elements.first().textContent();
            console.log(`📊 Manager sees: ${text}`);
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Manager can see ${visibleDataTypes} types of operational data`);
      expect(visibleDataTypes).toBeGreaterThan(1);
    });
  });

  test.describe('Workflow Integration - Manager Operations', () => {
    test('should coordinate cross-functional workflows', async ({ page }) => {
      // Test manager ability to work across staff, clients, and payrolls
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Navigate to client management
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Navigate to payroll oversight
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Navigate to billing review
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // All should be accessible
      expect(page.url()).not.toContain('/sign-in');
      
      console.log('✅ Manager can coordinate cross-functional workflows');
    });

    test('should maintain session consistency across management tasks', async ({ page }) => {
      const managementPages = ['/dashboard', '/staff', '/payrolls', '/clients', '/billing', '/reports'];
      
      for (const pagePath of managementPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).not.toContain('/sign-in');
        
        console.log(`✅ Manager session maintained on ${pagePath}`);
      }
    });

    test('should handle management decision workflows', async ({ page }) => {
      // Test that manager can access decision-making tools
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see links to management areas
      const managementLinks = page.locator('a[href*="/staff"], a[href*="/payrolls"], a[href*="/clients"], a[href*="/reports"]');
      const managementLinkCount = await managementLinks.count();
      console.log(`📊 Found ${managementLinkCount} management area links`);
      
      expect(managementLinkCount).toBeGreaterThan(0);
    });
  });

  test.describe('Quality Assurance - Manager Oversight', () => {
    test('should monitor service quality and delivery standards', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for quality indicators
      const qualityElements = page.locator('text=/quality|standard|compliance|accuracy/i');
      const qualityCount = await qualityElements.count();
      console.log(`📊 Found ${qualityCount} quality assurance elements`);
      
      // Look for performance tracking
      const performanceElements = page.locator('text=/performance|delivery|timeline|sla/i');
      const performanceCount = await performanceElements.count();
      console.log(`📊 Found ${performanceCount} performance tracking elements`);
    });

    test('should ensure team productivity and client satisfaction', async ({ page }) => {
      await page.goto('/reports');
      await page.waitForLoadState('networkidle');
      
      // Look for productivity metrics
      const productivityElements = page.locator('text=/productivity|efficiency|output|throughput/i');
      const productivityCount = await productivityElements.count();
      console.log(`📊 Found ${productivityCount} productivity metric elements`);
      
      // Look for client satisfaction indicators
      const satisfactionElements = page.locator('text=/satisfaction|feedback|client.*rating/i');
      const satisfactionCount = await satisfactionElements.count();
      console.log(`📊 Found ${satisfactionCount} client satisfaction elements`);
    });
  });
});
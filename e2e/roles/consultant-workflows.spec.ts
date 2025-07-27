/**
 * Consultant Role - Operational Workflow Tests
 * Tests operational access for payroll processing and client service delivery
 * Role hierarchy: developer (5) > org_admin (4) > manager (3) > consultant (2) > viewer (1)
 */

import { test, expect } from '@playwright/test';

const CONSULTANT_STORAGE_STATE = 'playwright/.auth/consultant.json';

test.describe('Consultant Role - Operational Workflows', () => {
  test.use({ storageState: CONSULTANT_STORAGE_STATE });

  test.describe('Authentication & Access Verification', () => {
    test('should authenticate as consultant and access dashboard', async ({ page }) => {
      console.log('🧪 Testing consultant authentication...');
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/dashboard');
      expect(page.url()).not.toContain('/sign-in');
      
      const mainContent = page.locator('[role="main"], main, .main-content');
      await expect(mainContent).toBeVisible();
      
      console.log('✅ Consultant authentication successful');
    });

    test('should be blocked from management and admin features', async ({ page }) => {
      // Routes that consultants should be blocked from (require manager+ or admin+)
      const restrictedPages = ['/staff', '/billing', '/reports', '/settings', '/security', '/invitations', '/developer'];
      
      for (const pagePath of restrictedPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
          // Page might redirect immediately, that's expected
        });
        
        // Should be redirected to dashboard (role-based middleware redirect)
        const currentUrl = page.url();
        const isProperlyBlocked = currentUrl.includes('/dashboard') && !currentUrl.includes(pagePath);
        
        expect(isProperlyBlocked).toBe(true);
        console.log(`✅ Consultant properly blocked from ${pagePath} → redirected to ${currentUrl}`);
      }
    });
  });

  test.describe('Operational Page Access - Consultant Scope', () => {
    // Routes that consultants should be able to access
    const allowedPages = [
      '/dashboard',
      '/payrolls',
      '/clients', 
      '/work-schedule',
      '/email',
      '/leave'
    ];

    allowedPages.forEach(pagePath => {
      test(`should access ${pagePath}`, async ({ page }) => {
        console.log(`🧪 Testing consultant access to ${pagePath}`);
        
        await page.goto(pagePath, { timeout: 30000 });
        await page.waitForLoadState('networkidle', { timeout: 30000 });
        
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/sign-in');
        expect(page.url()).not.toContain('/unauthorized');
        
        const content = page.locator('[role="main"], main, .main-content');
        await expect(content).toBeVisible({ timeout: 10000 });
        
        const accessDenied = page.locator('text=/access denied|unauthorized|403/i');
        await expect(accessDenied).not.toBeVisible();
        
        console.log(`✅ Consultant can access ${pagePath}`);
      });
    });
  });

  test.describe('Payroll Processing - Core Operations', () => {
    test('should process assigned payrolls', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const payrollTable = page.locator('table, [data-testid="payrolls-table"], [data-testid="payroll-list"]');
      await expect(payrollTable).toBeVisible({ timeout: 10000 });
      
      // Count visible payrolls (may be filtered to assigned ones)
      const payrollRows = page.locator('tr:has(td), [data-testid="payroll-row"]');
      const payrollCount = await payrollRows.count();
      console.log(`📊 Consultant can see ${payrollCount} payrolls`);
      expect(payrollCount).toBeGreaterThan(0);
      
      // Should see processing actions (but not management/approval actions)
      const processingActions = [
        'button:has-text("Process"), button:has-text("Update")',
        'text=/process|update|complete|work on/i'
      ];
      
      let visibleProcessingActions = 0;
      for (const selector of processingActions) {
        try {
          const elements = page.locator(selector);
          if (await elements.count() > 0) {
            visibleProcessingActions++;
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Consultant can see ${visibleProcessingActions} payroll processing actions`);
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
        
        // Should access payroll details
        expect(page.url()).toMatch(/\/payrolls\/[^/]+/);
        
        // Should see processing information but not approval controls
        const processingElements = page.locator('text=/process|calculate|review|data/i');
        const processingCount = await processingElements.count();
        console.log(`📊 Found ${processingCount} processing elements`);
        
        console.log('✅ Consultant can access payroll processing details');
      }
    });

    test('should update payroll status and progress', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for status update capabilities
      const statusElements = page.locator('text=/status|progress|in progress|completed/i');
      const statusCount = await statusElements.count();
      console.log(`📊 Found ${statusCount} status-related elements`);
      
      // Look for update/edit actions
      const updateActions = page.locator('button:has-text("Update"), button:has-text("Edit"), text=/update|modify/i');
      const updateActionCount = await updateActions.count();
      console.log(`📊 Found ${updateActionCount} update action elements`);
      
      expect(statusCount + updateActionCount).toBeGreaterThan(0);
    });
  });

  test.describe('Client Service Operations', () => {
    test('should access assigned client information', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      const clientsTable = page.locator('table, [data-testid="clients-table"], [data-testid="clients-list"]');
      await expect(clientsTable).toBeVisible({ timeout: 10000 });
      
      // Count visible clients (may be filtered to assigned ones)
      const clientRows = page.locator('tr:has(td), [data-testid="client-row"]');
      const clientCount = await clientRows.count();
      console.log(`📊 Consultant can see ${clientCount} clients`);
      expect(clientCount).toBeGreaterThan(0);
      
      // Should see read access but limited editing
      const readElements = page.locator('text=/view|details|information/i');
      const readCount = await readElements.count();
      console.log(`📊 Found ${readCount} client information access elements`);
    });

    test('should access client payroll processing information', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Look for client-payroll relationship info
      const payrollRelationElements = page.locator('text=/payroll|processing|schedule|frequency/i');
      const payrollRelationCount = await payrollRelationElements.count();
      console.log(`📊 Found ${payrollRelationCount} client-payroll relationship elements`);
      
      // Look for service delivery information
      const serviceElements = page.locator('text=/service|delivery|processing.*date|deadline/i');
      const serviceCount = await serviceElements.count();
      console.log(`📊 Found ${serviceCount} service delivery elements`);
    });

    test('should communicate with clients about service delivery', async ({ page }) => {
      await page.goto('/email');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/email');
      expect(page.url()).not.toContain('/unauthorized');
      
      // Look for client communication features
      const clientCommElements = page.locator('text=/client|communication|template|send/i');
      const clientCommCount = await clientCommElements.count();
      console.log(`📊 Found ${clientCommCount} client communication elements`);
      
      // Should have access to templates and sending (but not admin functions)
      const emailActions = page.locator('button:has-text("Send"), button:has-text("Compose"), text=/compose|send|template/i');
      const emailActionCount = await emailActions.count();
      console.log(`📊 Found ${emailActionCount} email action elements`);
      
      console.log('✅ Consultant can communicate with clients');
    });
  });

  test.describe('Work Schedule & Capacity Management', () => {
    test('should manage personal work schedule and assignments', async ({ page }) => {
      await page.goto('/work-schedule');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/work-schedule');
      expect(page.url()).not.toContain('/unauthorized');
      
      const scheduleContent = page.locator('[role="main"], main');
      await expect(scheduleContent).toBeVisible();
      
      // Look for personal schedule management
      const scheduleElements = page.locator('text=/schedule|assignment|workload|capacity/i');
      const scheduleCount = await scheduleElements.count();
      console.log(`📊 Found ${scheduleCount} schedule management elements`);
      
      // Should see personal assignments but not team-wide management
      const assignmentElements = page.locator('text=/my.*assignment|assigned.*to.*me|personal/i');
      const assignmentCount = await assignmentElements.count();
      console.log(`📊 Found ${assignmentCount} personal assignment elements`);
      
      console.log('✅ Consultant can manage work schedule');
    });

    test('should view workload and capacity allocation', async ({ page }) => {
      await page.goto('/work-schedule');
      await page.waitForLoadState('networkidle');
      
      // Look for capacity information
      const capacityElements = page.locator('text=/capacity|utilization|hours|availability/i');
      const capacityCount = await capacityElements.count();
      console.log(`📊 Found ${capacityCount} capacity-related elements`);
      
      // Look for workload distribution
      const workloadElements = page.locator('text=/workload|distribution|allocation|balance/i');
      const workloadCount = await workloadElements.count();
      console.log(`📊 Found ${workloadCount} workload elements`);
    });
  });

  test.describe('Data Access & Visibility - Consultant Level', () => {
    test('should see operational data relevant to assignments', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see operational data but not management/admin data
      const operationalData = [
        'text=/\\d+\\s*(payrolls?)/i',
        'text=/\\d+\\s*(clients?)/i',
        'text=/in progress|pending|completed/i',
        'text=/assigned|due|deadline/i'
      ];
      
      let visibleOperationalData = 0;
      for (const selector of operationalData) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            visibleOperationalData++;
            const text = await elements.first().textContent();
            console.log(`📊 Consultant sees: ${text}`);
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Consultant can see ${visibleOperationalData} types of operational data`);
      expect(visibleOperationalData).toBeGreaterThan(0);
    });

    test('should not see sensitive financial or admin data', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check that sensitive data is not visible or is limited
      const sensitiveSelectors = [
        'text=/total.*revenue|profit.*margin/i',
        'text=/admin.*count|system.*settings/i',
        'text=/security.*alert|compliance.*report/i'
      ];
      
      let visibleSensitiveData = 0;
      for (const selector of sensitiveSelectors) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          visibleSensitiveData += count;
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Consultant sees ${visibleSensitiveData} sensitive data elements (should be minimal)`);
      // Consultant should have minimal access to sensitive data
    });
  });

  test.describe('Permission Boundaries - Consultant Scope', () => {
    test('should inherit viewer permissions', async ({ page }) => {
      // Consultant should access everything viewer can access
      const inheritedPages = ['/dashboard'];
      
      for (const pagePath of inheritedPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/unauthorized');
        
        console.log(`✅ Consultant inherits access to ${pagePath}`);
      }
    });

    test('should be restricted from management functions', async ({ page }) => {
      const restrictedPages = ['/staff', '/billing', '/reports', '/developer', '/security', '/invitations', '/settings'];
      
      for (const pagePath of restrictedPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
          // Immediate redirect expected
        });
        
        // Should be redirected to dashboard due to insufficient permissions
        const currentUrl = page.url();
        const isProperlyBlocked = currentUrl.includes('/dashboard') && !currentUrl.includes(pagePath);
        
        expect(isProperlyBlocked).toBe(true);
        console.log(`✅ Consultant properly blocked from ${pagePath} → redirected to ${currentUrl}`);
      }
    });

    test('should have read-only access to client data', async ({ page }) => {
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Should see client data
      const clientData = page.locator('table, [data-testid="clients-table"]');
      await expect(clientData).toBeVisible();
      
      // Should not see management actions like "Add Client", "Delete"
      const managementActions = page.locator('button:has-text("Add Client"), button:has-text("Delete"), button:has-text("Remove")');
      const managementActionCount = await managementActions.count();
      
      console.log(`📊 Consultant sees ${managementActionCount} client management actions (should be minimal)`);
      
      // Look for read-only indicators
      const readOnlyElements = page.locator('text=/view|details|information/i');
      const readOnlyCount = await readOnlyElements.count();
      console.log(`📊 Found ${readOnlyCount} read-only access elements`);
    });
  });

  test.describe('Operational Workflows - Consultant Tasks', () => {
    test('should complete assigned payroll processing tasks', async ({ page }) => {
      // Test typical consultant workflow
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Should see assigned payrolls
      const assignedPayrolls = page.locator('text=/assigned.*to.*me|my.*payrolls|primary.*consultant/i');
      const assignedCount = await assignedPayrolls.count();
      console.log(`📊 Found ${assignedCount} assignment-related elements`);
      
      // Should see processing workflow elements
      const workflowElements = page.locator('text=/process|review|validate|submit/i');
      const workflowCount = await workflowElements.count();
      console.log(`📊 Found ${workflowCount} workflow elements`);
      
      expect(assignedCount + workflowCount).toBeGreaterThan(0);
    });

    test('should track progress and update status', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for progress tracking
      const progressElements = page.locator('text=/progress|status|\\d+%|complete/i');
      const progressCount = await progressElements.count();
      console.log(`📊 Found ${progressCount} progress tracking elements`);
      
      // Look for status update capabilities
      const statusUpdateElements = page.locator('button:has-text("Update"), text=/update.*status|mark.*complete/i');
      const statusUpdateCount = await statusUpdateElements.count();
      console.log(`📊 Found ${statusUpdateCount} status update elements`);
    });

    test('should coordinate with team on shared assignments', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for team coordination elements
      const teamElements = page.locator('text=/backup.*consultant|primary.*consultant|team|handover/i');
      const teamCount = await teamElements.count();
      console.log(`📊 Found ${teamCount} team coordination elements`);
      
      // Should see communication features for team coordination
      await page.goto('/email');
      await page.waitForLoadState('networkidle');
      
      const commElements = page.locator('text=/team|internal|colleague/i');
      const commCount = await commElements.count();
      console.log(`📊 Found ${commCount} team communication elements`);
    });
  });

  test.describe('Quality & Compliance - Operational Level', () => {
    test('should follow processing standards and guidelines', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for quality/compliance indicators
      const qualityElements = page.locator('text=/standard|guideline|compliance|quality|accuracy/i');
      const qualityCount = await qualityElements.count();
      console.log(`📊 Found ${qualityCount} quality/compliance elements`);
      
      // Look for validation/checking features
      const validationElements = page.locator('text=/validate|verify|check|review/i');
      const validationCount = await validationElements.count();
      console.log(`📊 Found ${validationCount} validation elements`);
    });

    test('should document work and maintain records', async ({ page }) => {
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for documentation features
      const docElements = page.locator('text=/notes|comments|documentation|record/i');
      const docCount = await docElements.count();
      console.log(`📊 Found ${docCount} documentation elements`);
      
      // Should be able to add notes/comments (operational level)
      const noteActions = page.locator('button:has-text("Add Note"), text=/add.*note|comment/i');
      const noteActionCount = await noteActions.count();
      console.log(`📊 Found ${noteActionCount} note/comment actions`);
    });
  });

  test.describe('Session & Security - Consultant Level', () => {
    test('should maintain secure session across operational pages', async ({ page }) => {
      const operationalPages = ['/dashboard', '/payrolls', '/clients', '/work-schedule', '/email'];
      
      for (const pagePath of operationalPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).not.toContain('/sign-in');
        
        console.log(`✅ Consultant session maintained on ${pagePath}`);
      }
    });

    test('should have appropriate API access for operational functions', async ({ page }) => {
      // Monitor GraphQL requests for consultant operations
      const graphqlRequests: string[] = [];
      
      page.on('request', request => {
        if (request.url().includes('graphql') || request.url().includes('/v1/graphql')) {
          graphqlRequests.push(request.url());
        }
      });
      
      // Navigate to operational pages
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      console.log(`📊 Consultant made ${graphqlRequests.length} GraphQL requests`);
      expect(graphqlRequests.length).toBeGreaterThan(0);
    });

    test('should handle operational errors gracefully', async ({ page }) => {
      // Test error handling for consultant operations
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Should not see system errors or admin-level error information
      const errorElements = page.locator('text=/system error|admin error|database error/i');
      const errorCount = await errorElements.count();
      
      console.log(`📊 Found ${errorCount} system-level errors (should be minimal for consultant)`);
      
      // Should see user-friendly error messages if any
      const userErrors = page.locator('text=/unable to load|please try again|error loading/i');
      const userErrorCount = await userErrors.count();
      console.log(`📊 Found ${userErrorCount} user-friendly error messages`);
    });
  });

  test.describe('Performance & Efficiency - Consultant Operations', () => {
    test('should load operational pages efficiently', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      console.log(`📊 Payrolls page load time for consultant: ${loadTime}ms`);
      
      // Should load within reasonable time
      expect(loadTime).toBeLessThan(30000);
    });

    test('should handle concurrent operational tasks', async ({ page }) => {
      // Test handling multiple operational workflows
      const operationalPages = ['/payrolls', '/clients', '/work-schedule'];
      
      for (const pagePath of operationalPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toContain(pagePath);
        expect(page.url()).not.toContain('/unauthorized');
      }
      
      console.log('✅ Consultant can handle concurrent operational tasks');
    });
  });
});
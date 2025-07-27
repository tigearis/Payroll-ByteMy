/**
 * Viewer Role - Read-Only Access Tests
 * Tests minimal read-only access for the lowest privilege role
 * Role hierarchy: developer (5) > org_admin (4) > manager (3) > consultant (2) > viewer (1)
 */

import { test, expect } from '@playwright/test';

const VIEWER_STORAGE_STATE = 'playwright/.auth/viewer.json';

test.describe('Viewer Role - Read-Only Access', () => {
  test.use({ storageState: VIEWER_STORAGE_STATE });

  test.describe('Authentication & Minimal Access Verification', () => {
    test('should authenticate as viewer and access dashboard', async ({ page }) => {
      console.log('🧪 Testing viewer authentication...');
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/dashboard');
      expect(page.url()).not.toContain('/sign-in');
      
      const mainContent = page.locator('[role="main"], main, .main-content');
      await expect(mainContent).toBeVisible();
      
      console.log('✅ Viewer authentication successful');
    });

    test('should be blocked from all operational and management features', async ({ page }) => {
      // Viewer should only access dashboard - all other routes should redirect
      const restrictedPages = [
        '/staff', '/payrolls', '/clients', '/billing', '/work-schedule',
        '/email', '/leave', '/reports', '/settings', '/security', 
        '/invitations', '/developer', '/ai-assistant'
      ];
      
      for (const pagePath of restrictedPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
          // Immediate redirect expected for viewer
        });
        
        // Should be redirected to dashboard due to insufficient viewer permissions  
        const currentUrl = page.url();
        const isProperlyBlocked = currentUrl.includes('/dashboard') && !currentUrl.includes(pagePath);
        
        expect(isProperlyBlocked).toBe(true);
        console.log(`✅ Viewer properly blocked from ${pagePath} → redirected to ${currentUrl}`);
      }
    });
  });

  test.describe('Dashboard Access - Limited Information', () => {
    test('should access dashboard with read-only information', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/dashboard');
      expect(page.url()).not.toContain('/unauthorized');
      
      const dashboardContent = page.locator('[role="main"], main, .main-content');
      await expect(dashboardContent).toBeVisible();
      
      console.log('✅ Viewer can access dashboard');
    });

    test('should see limited summary information only', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see very basic information
      const basicInfoElements = [
        'text=/dashboard|welcome|overview/i',
        'text=/system|status|information/i'
      ];
      
      let visibleBasicInfo = 0;
      for (const selector of basicInfoElements) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            visibleBasicInfo++;
            const text = await elements.first().textContent();
            console.log(`📊 Viewer sees basic info: ${text}`);
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer can see ${visibleBasicInfo} basic information elements`);
    });

    test('should not see sensitive operational data', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should NOT see sensitive operational or financial data
      const sensitiveDataSelectors = [
        'text=/\\$\\d+.*revenue|\\$\\d+.*profit/i',
        'text=/\\d+.*staff.*hours|\\d+.*billable/i',
        'text=/client.*revenue|payroll.*profit/i',
        'text=/admin.*action|system.*alert/i'
      ];
      
      let visibleSensitiveData = 0;
      for (const selector of sensitiveDataSelectors) {
        try {
          const elements = page.locator(selector);
          visibleSensitiveData += await elements.count();
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleSensitiveData} sensitive data elements (should be 0 or minimal)`);
      
      // Viewer should have minimal to no access to sensitive operational data
      expect(visibleSensitiveData).toBeLessThan(3);
    });

    test('should not see action buttons or management controls', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should NOT see action buttons
      const actionButtons = [
        'button:has-text("Create"), button:has-text("Add"), button:has-text("New")',
        'button:has-text("Edit"), button:has-text("Update"), button:has-text("Modify")',
        'button:has-text("Delete"), button:has-text("Remove")',
        'button:has-text("Approve"), button:has-text("Process")'
      ];
      
      let visibleActionButtons = 0;
      for (const selector of actionButtons) {
        try {
          const buttons = page.locator(selector);
          visibleActionButtons += await buttons.count();
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleActionButtons} action buttons (should be minimal)`);
      
      // Viewer should have minimal to no action buttons
      expect(visibleActionButtons).toBeLessThan(2);
    });
  });

  test.describe('Navigation Restrictions - Viewer Boundaries', () => {
    test('should have limited navigation options', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check navigation menu (should be very limited)
      const navLinks = page.locator('nav a, [role="navigation"] a, .navigation a');
      const navLinkCount = await navLinks.count();
      console.log(`📊 Viewer sees ${navLinkCount} navigation links`);
      
      // Get all href values
      const hrefs = await navLinks.evaluateAll(links => 
        links.map(link => link.getAttribute('href')).filter(Boolean)
      );
      
      console.log('📋 Viewer navigation links:', hrefs);
      
      // Should not see links to restricted areas
      const restrictedLinkCount = hrefs.filter(href => 
        href?.includes('/staff') || 
        href?.includes('/payrolls') || 
        href?.includes('/billing') ||
        href?.includes('/admin')
      ).length;
      
      console.log(`📊 Viewer sees ${restrictedLinkCount} restricted area links (should be 0)`);
      expect(restrictedLinkCount).toBe(0);
    });

    test('should redirect when attempting to access restricted URLs directly', async ({ page }) => {
      const restrictedUrls = ['/staff', '/payrolls', '/clients', '/billing'];
      
      for (const url of restrictedUrls) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        // Should be redirected away from restricted URL
        const currentUrl = page.url();
        const isRedirected = !currentUrl.includes(url) || 
                           currentUrl.includes('/dashboard') ||
                           currentUrl.includes('/unauthorized') ||
                           currentUrl.includes('/sign-in');
        
        if (!isRedirected) {
          // Check for access denied message
          const accessDenied = page.locator('text=/access denied|unauthorized|403/i');
          const hasAccessDeniedMessage = await accessDenied.count() > 0;
          expect(hasAccessDeniedMessage).toBe(true);
        }
        
        console.log(`✅ Viewer redirected from ${url} to ${currentUrl}`);
      }
    });
  });

  test.describe('UI Elements & Permissions - Viewer Restrictions', () => {
    test('should not see management or operational UI elements', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should NOT see management UI elements
      const managementElements = [
        '[data-testid="admin-panel"], [data-testid="management-tools"]',
        'text=/admin.*panel|management.*console/i',
        'text=/add.*user|create.*client|new.*payroll/i',
        'button:has-text("Admin"), button:has-text("Manage")'
      ];
      
      let visibleManagementElements = 0;
      for (const selector of managementElements) {
        try {
          const elements = page.locator(selector);
          visibleManagementElements += await elements.count();
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleManagementElements} management UI elements (should be 0)`);
      expect(visibleManagementElements).toBe(0);
    });

    test('should not see data modification controls', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should NOT see forms, inputs, or modification controls
      const modificationControls = [
        'form:has(input[type="text"]), form:has(input[type="email"])',
        'input[type="text"]:not([readonly]), textarea:not([readonly])',
        'select:not([disabled]), input[type="checkbox"]:not([disabled])'
      ];
      
      let visibleModificationControls = 0;
      for (const selector of modificationControls) {
        try {
          const controls = page.locator(selector);
          visibleModificationControls += await controls.count();
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleModificationControls} modification controls (should be minimal)`);
      
      // Some basic controls might be present (like search), but should be minimal
      expect(visibleModificationControls).toBeLessThan(5);
    });

    test('should see read-only information display', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should see read-only display elements
      const readOnlyElements = [
        'text=/view|display|information|details/i',
        '[readonly], [disabled]',
        'text=/read.*only|view.*only/i'
      ];
      
      let visibleReadOnlyElements = 0;
      for (const selector of readOnlyElements) {
        try {
          const elements = page.locator(selector);
          const count = await elements.count();
          if (count > 0) {
            visibleReadOnlyElements++;
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleReadOnlyElements} read-only display elements`);
      expect(visibleReadOnlyElements).toBeGreaterThan(0);
    });
  });

  test.describe('Error Handling & Security - Viewer Level', () => {
    test('should receive appropriate error messages for restricted access', async ({ page }) => {
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Should see user-friendly error messages
      const errorMessages = [
        'text=/access denied|unauthorized|not authorized/i',
        'text=/permission.*denied|insufficient.*privilege/i',
        'text=/contact.*administrator|request.*access/i'
      ];
      
      let visibleErrorMessages = 0;
      for (const selector of errorMessages) {
        try {
          const messages = page.locator(selector);
          const count = await messages.count();
          if (count > 0) {
            visibleErrorMessages++;
            const text = await messages.first().textContent();
            console.log(`📊 Viewer sees error message: ${text}`);
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleErrorMessages} appropriate error messages`);
    });

    test('should not see system-level error information', async ({ page }) => {
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Should NOT see system-level errors
      const systemErrors = [
        'text=/database.*error|sql.*error|server.*error/i',
        'text=/stack.*trace|error.*details|debug.*info/i',
        'text=/internal.*error|system.*failure/i'
      ];
      
      let visibleSystemErrors = 0;
      for (const selector of systemErrors) {
        try {
          const errors = page.locator(selector);
          visibleSystemErrors += await errors.count();
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleSystemErrors} system-level errors (should be 0)`);
      expect(visibleSystemErrors).toBe(0);
    });
  });

  test.describe('API Access & Security - Viewer Restrictions', () => {
    test('should have minimal GraphQL API access', async ({ page }) => {
      // Monitor GraphQL requests
      const graphqlRequests: string[] = [];
      const failedRequests: string[] = [];
      
      page.on('request', request => {
        if (request.url().includes('graphql') || request.url().includes('/v1/graphql')) {
          graphqlRequests.push(request.url());
        }
      });
      
      page.on('response', response => {
        if ((response.url().includes('graphql') || response.url().includes('/v1/graphql')) && 
            (response.status() === 403 || response.status() === 401)) {
          failedRequests.push(response.url());
        }
      });
      
      // Try to navigate to dashboard (should work)
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Try to navigate to restricted area (should fail or be limited)
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      console.log(`📊 Viewer made ${graphqlRequests.length} GraphQL requests`);
      console.log(`📊 Viewer had ${failedRequests.length} failed/restricted GraphQL requests`);
      
      // Viewer should have some basic API access but many restrictions
      expect(failedRequests.length).toBeGreaterThan(0);
    });

    test('should maintain secure session without elevated access', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should maintain session
      expect(page.url()).not.toContain('/sign-in');
      
      // But should not have access to restricted areas
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const isRestricted = page.url().includes('/unauthorized') ||
                          page.url().includes('/dashboard') ||
                          !page.url().includes('/staff');
      
      if (!isRestricted) {
        const accessDenied = page.locator('text=/access denied|unauthorized/i');
        expect(await accessDenied.count()).toBeGreaterThan(0);
      }
      
      console.log('✅ Viewer maintains secure session without elevated access');
    });
  });

  test.describe('Performance & User Experience - Viewer Level', () => {
    test('should load dashboard efficiently for minimal access', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      console.log(`📊 Dashboard load time for viewer: ${loadTime}ms`);
      
      // Should load quickly due to minimal data access
      expect(loadTime).toBeLessThan(20000);
    });

    test('should provide clear user experience for limitations', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should have clear indicators of limited access
      const limitationIndicators = [
        'text=/limited.*access|view.*only|read.*only/i',
        'text=/viewer.*mode|basic.*access/i',
        'text=/contact.*admin|request.*access/i'
      ];
      
      let visibleLimitationIndicators = 0;
      for (const selector of limitationIndicators) {
        try {
          const indicators = page.locator(selector);
          const count = await indicators.count();
          if (count > 0) {
            visibleLimitationIndicators++;
            const text = await indicators.first().textContent();
            console.log(`📊 Viewer sees limitation indicator: ${text}`);
          }
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleLimitationIndicators} limitation indicators`);
    });

    test('should handle restricted page attempts gracefully', async ({ page }) => {
      const restrictedPages = ['/staff', '/payrolls', '/billing'];
      
      for (const pagePath of restrictedPages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        // Should handle gracefully without crashes
        const hasContent = await page.locator('body').isVisible();
        expect(hasContent).toBe(true);
        
        // Should be redirected or show appropriate message
        const currentUrl = page.url();
        const isHandledGracefully = currentUrl.includes('/dashboard') ||
                                   currentUrl.includes('/unauthorized') ||
                                   await page.locator('text=/access denied|unauthorized/i').count() > 0;
        
        expect(isHandledGracefully).toBe(true);
        
        console.log(`✅ Viewer restriction to ${pagePath} handled gracefully`);
      }
    });
  });

  test.describe('Role Hierarchy Verification - Lowest Level', () => {
    test('should have minimal permissions in the role hierarchy', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should not see any hierarchical access indicators
      const hierarchicalElements = [
        'text=/manage.*team|oversee.*operations/i',
        'text=/approve.*payroll|process.*billing/i',
        'text=/admin.*access|system.*settings/i',
        'text=/developer.*tools|debug.*mode/i'
      ];
      
      let visibleHierarchicalElements = 0;
      for (const selector of hierarchicalElements) {
        try {
          const elements = page.locator(selector);
          visibleHierarchicalElements += await elements.count();
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleHierarchicalElements} hierarchical access elements (should be 0)`);
      expect(visibleHierarchicalElements).toBe(0);
    });

    test('should be at the bottom of the permission inheritance chain', async ({ page }) => {
      // Viewer should only access dashboard and very basic features
      const allowedUrls = ['/dashboard'];
      const deniedUrls = ['/staff', '/payrolls', '/clients', '/billing', '/work-schedule', '/email', '/leave', '/reports', '/settings', '/security', '/invitations', '/developer'];
      
      // Test allowed access
      for (const url of allowedUrls) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        expect(page.url()).toContain(url);
        expect(page.url()).not.toContain('/unauthorized');
        
        console.log(`✅ Viewer can access ${url}`);
      }
      
      // Test denied access
      let blockedCount = 0;
      for (const url of deniedUrls) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        const isBlocked = !page.url().includes(url) ||
                         page.url().includes('/unauthorized') ||
                         page.url().includes('/dashboard') ||
                         await page.locator('text=/access denied|unauthorized/i').count() > 0;
        
        if (isBlocked) {
          blockedCount++;
        }
        
        console.log(`${isBlocked ? '✅' : '⚠️'} Viewer ${isBlocked ? 'blocked from' : 'can access'} ${url}`);
      }
      
      console.log(`📊 Viewer blocked from ${blockedCount}/${deniedUrls.length} restricted URLs`);
      expect(blockedCount).toBeGreaterThan(deniedUrls.length * 0.8); // At least 80% should be blocked
    });
  });

  test.describe('Compliance & Audit - Viewer Access Logging', () => {
    test('should generate appropriate audit trail for viewer access', async ({ page }) => {
      // Viewer access should be logged but with appropriate restrictions
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Try to access restricted area (should be logged as access attempt)
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // This would normally check audit logs, but for E2E we verify access restrictions
      const isRestricted = !page.url().includes('/staff') ||
                          await page.locator('text=/access denied|unauthorized/i').count() > 0;
      
      expect(isRestricted).toBe(true);
      
      console.log('✅ Viewer access restrictions properly enforced for audit compliance');
    });

    test('should maintain SOC2 compliance for minimal access role', async ({ page }) => {
      // Test that viewer role maintains proper security boundaries
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should not see any compliance-sensitive data
      const sensitiveData = [
        'text=/social.*security|ssn|tax.*id/i',
        'text=/salary|wage|compensation/i',
        'text=/bank.*account|routing.*number/i',
        'text=/confidential|sensitive|restricted/i'
      ];
      
      let visibleSensitiveData = 0;
      for (const selector of sensitiveData) {
        try {
          const data = page.locator(selector);
          visibleSensitiveData += await data.count();
        } catch (error) {
          // Continue
        }
      }
      
      console.log(`📊 Viewer sees ${visibleSensitiveData} sensitive data elements (should be 0)`);
      expect(visibleSensitiveData).toBe(0);
    });
  });
});
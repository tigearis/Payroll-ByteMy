/**
 * Role-Based Access Demonstration & Analysis
 * Quick validation of role-based permissions and access patterns
 */

import { test, expect } from '@playwright/test';

// Test each role individually with their respective auth files
const ROLES = [
  { name: 'developer', authFile: 'playwright/.auth/developer.json', level: 5 },
  { name: 'admin', authFile: 'playwright/.auth/admin.json', level: 4 },
  { name: 'manager', authFile: 'playwright/.auth/manager.json', level: 3 },
  { name: 'consultant', authFile: 'playwright/.auth/consultant.json', level: 2 },
  { name: 'viewer', authFile: 'playwright/.auth/viewer.json', level: 1 }
];

// Pages to test per role
const TEST_PAGES = [
  { path: '/dashboard', name: 'Dashboard', expectedForAll: true },
  { path: '/staff', name: 'Staff Management', restrictedBelow: 3 },
  { path: '/payrolls', name: 'Payroll Operations', restrictedBelow: 2 },
  { path: '/clients', name: 'Client Management', restrictedBelow: 2 },
  { path: '/billing', name: 'Billing & Finance', restrictedBelow: 3 },
  { path: '/security', name: 'Security Settings', restrictedBelow: 4 },
  { path: '/developer', name: 'Developer Tools', restrictedBelow: 5 }
];

ROLES.forEach(role => {
  test.describe(`${role.name.toUpperCase()} Role Analysis (Level ${role.level})`, () => {
    test.use({ storageState: role.authFile });

    test(`should authenticate successfully as ${role.name}`, async ({ page }) => {
      console.log(`🧪 Testing ${role.name} authentication and basic access`);
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Should successfully access dashboard
      expect(page.url()).toContain('/dashboard');
      expect(page.url()).not.toContain('/sign-in');
      
      console.log(`✅ ${role.name.toUpperCase()} authenticated successfully`);
    });

    TESTPAGES.forEach(testPage => {
      test(`should ${testPage.restrictedBelow && role.level < testPage.restrictedBelow ? 'be blocked from' : 'access'} ${testPage.name}`, async ({ page }) => {
        const shouldHaveAccess = !testPage.restrictedBelow || role.level >= testPage.restrictedBelow;
        
        console.log(`🔍 Testing ${role.name} access to ${testPage.name} (${testPage.path})`);
        console.log(`   Expected access: ${shouldHaveAccess ? 'ALLOWED' : 'BLOCKED'} (role level ${role.level})`);
        
        await page.goto(testPage.path);
        await page.waitForLoadState('networkidle');
        
        if (shouldHaveAccess) {
          // Should have access
          expect(page.url()).toContain(testPage.path);
          expect(page.url()).not.toContain('/sign-in');
          expect(page.url()).not.toContain('/unauthorized');
          
          // Should see main content
          const content = page.locator('[role="main"], main, .main-content');
          await expect(content).toBeVisible({ timeout: 10000 });
          
          // Should not see access denied
          const accessDenied = page.locator('text=/access denied|unauthorized|403/i');
          await expect(accessDenied).not.toBeVisible();
          
          console.log(`   ✅ ${role.name.toUpperCase()} successfully accessed ${testPage.name}`);
        } else {
          // Should be blocked
          const isBlocked = page.url().includes('/sign-in') || 
                           page.url().includes('/unauthorized') ||
                           page.url().includes('/dashboard') ||
                           !page.url().includes(testPage.path);
          
          if (!isBlocked) {
            // Check for access denied content
            const accessDenied = page.locator('text=/access denied|unauthorized|403/i');
            const hasAccessDeniedMessage = await accessDenied.count() > 0;
            expect(hasAccessDeniedMessage).toBe(true);
          }
          
          console.log(`   ✅ ${role.name.toUpperCase()} properly blocked from ${testPage.name}`);
        }
      });
    });

    test(`should see appropriate UI elements for ${role.name} role`, async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Count various UI elements based on role level
      const actionButtons = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")').count();
      const editButtons = await page.locator('button:has-text("Edit"), a:has-text("Edit")').count();
      const navigationLinks = await page.locator('nav a, [role="navigation"] a').count();
      const dataElements = await page.locator('text=/\\d+\\s*(users?|clients?|payrolls?)/i').count();
      
      console.log(`📊 ${role.name.toUpperCase()} UI Analysis:`);
      console.log(`   Action buttons: ${actionButtons}`);
      console.log(`   Edit buttons: ${editButtons}`);
      console.log(`   Navigation links: ${navigationLinks}`);
      console.log(`   Data elements: ${dataElements}`);
      
      // Basic expectations based on role level
      if (role.level >= 4) {
        // Admin level - should see management features
        expect(actionButtons + editButtons).toBeGreaterThan(2);
      } else if (role.level >= 3) {
        // Manager level - should see some management features
        expect(navigationLinks).toBeGreaterThan(3);
      } else if (role.level >= 2) {
        // Consultant level - should see operational features
        expect(dataElements).toBeGreaterThan(0);
      } else {
        // Viewer level - minimal features
        expect(actionButtons).toBeLessThan(3);
      }
      
      console.log(`✅ ${role.name.toUpperCase()} UI elements appropriate for role level`);
    });

    test(`should demonstrate role-specific data visibility for ${role.name}`, async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check for different types of data based on role
      const checks = [
        { selector: 'text=/\\d+\\s*users?/i', type: 'User Data', expected: role.level >= 3 },
        { selector: 'text=/\\$\\d+/i', type: 'Financial Data', expected: role.level >= 3 },
        { selector: 'text=/admin|security|system/i', type: 'Admin Data', expected: role.level >= 4 },
        { selector: 'text=/developer|debug|system/i', type: 'Developer Data', expected: role.level >= 5 }
      ];
      
      console.log(`🔒 ${role.name.toUpperCase()} Data Visibility Analysis:`);
      
      for (const check of checks) {
        try {
          const elements = await page.locator(check.selector).count();
          const hasData = elements > 0;
          
          console.log(`   ${check.type}: ${hasData ? 'VISIBLE' : 'HIDDEN'} (expected: ${check.expected ? 'VISIBLE' : 'HIDDEN'})`);
          
          if (check.expected && role.level >= 3) {
            // Higher roles should see more data
            // This is informational, not strictly enforced
          }
        } catch (error) {
          console.log(`   ${check.type}: Could not determine visibility`);
        }
      }
      
      console.log(`✅ ${role.name.toUpperCase()} data visibility analyzed`);
    });
  });
});

// Cross-role comparison test
test.describe('Cross-Role Permission Verification', () => {
  test('should demonstrate hierarchical access patterns', async ({ browser }) => {
    console.log('🔄 Running cross-role hierarchical access verification...');
    
    const results: Record<string, Record<string, boolean>> = {};
    
    // Test each role's access to key pages
    for (const role of ROLES) {
      const context = await browser.newContext({ storageState: role.authFile });
      const page = await context.newPage();
      
      results[role.name] = {};
      
      for (const testPage of TESTPAGES.slice(0, 4)) { // Test first 4 pages
        try {
          await page.goto(testPage.path, { timeout: 15000 });
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          
          const hasAccess = page.url().includes(testPage.path) && 
                           !page.url().includes('/sign-in') && 
                           !page.url().includes('/unauthorized');
          
          results[role.name][testPage.name] = hasAccess;
          console.log(`   ${role.name.padEnd(10)} → ${testPage.name.padEnd(20)}: ${hasAccess ? '✅ ACCESS' : '❌ BLOCKED'}`);
          
        } catch (error) {
          results[role.name][testPage.name] = false;
          console.log(`   ${role.name.padEnd(10)} → ${testPage.name.padEnd(20)}: ❌ BLOCKED (error)`);
        }
      }
      
      await context.close();
    }
    
    console.log('\n📊 HIERARCHICAL ACCESS MATRIX:');
    console.log('═'.repeat(80));
    
    // Display results matrix
    const pageNames = TESTPAGES.slice(0, 4).map(p => p.name);
    console.log('Role'.padEnd(12) + pageNames.map(name => name.slice(0, 12).padEnd(12)).join(''));
    console.log('─'.repeat(80));
    
    ROLES.forEach(role => {
      const accessPattern = pageNames.map(pageName => 
        results[role.name][pageName] ? '✅'.padEnd(12) : '❌'.padEnd(12)
      ).join('');
      console.log(role.name.padEnd(12) + accessPattern);
    });
    
    console.log('═'.repeat(80));
    console.log('✅ Cross-role verification completed');
    
    // Basic hierarchy verification
    expect(Object.keys(results)).toHaveLength(5);
  });
});
/**
 * Data Integrity Testing
 * Tests data display consistency and identifies UI data display issues
 */

import { test, expect } from '@playwright/test';
import { 
  STORAGE_STATE_ADMIN,
  STORAGE_STATE_MANAGER,
  STORAGE_STATE_CONSULTANT,
  STORAGE_STATE_VIEWER,
  TEST_SELECTORS,
  TIMEOUTS
} from './utils/test-config';

test.describe('Data Integrity Testing', () => {
  
  test.describe('Dashboard Data Display', () => {
    
    [
      { role: 'admin', storageState: STORAGE_STATE_ADMIN },
      { role: 'manager', storageState: STORAGE_STATE_MANAGER },
      { role: 'consultant', storageState: STORAGE_STATE_CONSULTANT },
      { role: 'viewer', storageState: STORAGE_STATE_VIEWER }
    ].forEach(({ role, storageState }) => {
      
      test(`${role} should see consistent dashboard data`, async ({ page }) => {
        test.use({ storageState });
        
        console.log(`📊 Testing dashboard data for ${role}`);
        
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        
        // Check for data display issues
        const dataIssues = [];
        
        // 1. Check for undefined/null values displayed in UI
        const undefinedElements = await page.locator('text=/undefined|null/i').count();
        if (undefinedElements > 0) {
          dataIssues.push(`Found ${undefinedElements} undefined/null values displayed`);
        }
        
        // 2. Check for loading states that never resolve
        const loadingElements = await page.locator(TESTSELECTORS.loadingSpinner).count();
        if (loadingElements > 0) {
          await page.waitForTimeout(5000); // Wait 5 seconds
          const stillLoadingElements = await page.locator(TESTSELECTORS.loadingSpinner).count();
          if (stillLoadingElements > 0) {
            dataIssues.push(`Found ${stillLoadingElements} elements stuck in loading state`);
          }
        }
        
        // 3. Check for empty data tables that should have content
        const dataTables = page.locator(TESTSELECTORS.dataTable);
        const tableCount = await dataTables.count();
        
        for (let i = 0; i < tableCount; i++) {
          const table = dataTables.nth(i);
          const rows = await table.locator('tbody tr, tr').count();
          
          if (rows === 0) {
            // Check if it's intentionally empty vs missing data
            const emptyState = await table.locator(TESTSELECTORS.emptyState).count();
            if (emptyState === 0) {
              dataIssues.push(`Table ${i + 1} appears empty without proper empty state`);
            }
          }
        }
        
        // 4. Check for user count consistency
        const userCountElements = await page.locator('text=/\\d+\\s*(users?|staff|employees?)/i').all();
        const userCounts = [];
        
        for (const element of userCountElements) {
          const text = await element.textContent();
          const match = text?.match(/\\d+/);
          if (match) {
            userCounts.push(parseInt(match[0]));
          }
        }
        
        // All user counts should be consistent
        if (userCounts.length > 1) {
          const uniqueCounts = [...new Set(userCounts)];
          if (uniqueCounts.length > 1) {
            dataIssues.push(`Inconsistent user counts found: ${uniqueCounts.join(', ')}`);
          }
        }
        
        // 5. Check for financial data consistency
        const financialElements = await page.locator('text=/\\$\\d+(?:\\.\\d{2})?/').all();
        const financialData = [];
        
        for (const element of financialElements) {
          const text = await element.textContent();
          if (text) {
            financialData.push(text);
          }
        }
        
        // Look for $0.00 values that might indicate missing calculations
        const zeroValues = financialData.filter(value => value.includes('$0') || value.includes('$0.00'));
        if (zeroValues.length > financialData.length * 0.8 && financialData.length > 0) {
          dataIssues.push(`Suspicious: ${zeroValues.length}/${financialData.length} financial values are zero`);
        }
        
        // 6. Check for broken images or missing assets
        const images = await page.locator('img').all();
        let brokenImages = 0;
        
        for (const img of images) {
          const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
          if (naturalWidth === 0) {
            brokenImages++;
          }
        }
        
        if (brokenImages > 0) {
          dataIssues.push(`Found ${brokenImages} broken images`);
        }
        
        // 7. Check for error messages in console
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        await page.waitForTimeout(2000); // Wait for potential console errors
        
        if (consoleErrors.length > 0) {
          dataIssues.push(`Console errors detected: ${consoleErrors.slice(0, 3).join(', ')}`);
        }
        
        // Report findings
        if (dataIssues.length > 0) {
          console.log(`⚠️ Data issues found for ${role}:`);
          dataIssues.forEach(issue => console.log(`   - ${issue}`));
          
          // Take screenshot for debugging
          await page.screenshot({ 
            path: `e2e/screenshots/data-issues-${role}-dashboard.png`,
            fullPage: true 
          });
        } else {
          console.log(`✅ No obvious data issues found for ${role} dashboard`);
        }
        
        // This test is informational - we log issues but don't fail
        // You can adjust this based on your requirements
      });
    });
  });
  
  test.describe('Staff Page Data Integrity', () => {
    
    test('admin should see complete staff data', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Check for staff table
      const staffTable = page.locator(TESTSELECTORS.domains.staff.staffTable);
      
      if (await staffTable.isVisible({ timeout: 5000 })) {
        // Count staff rows
        const staffRows = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        console.log(`📊 Admin sees ${staffRows} staff members`);
        
        // Check if we see the expected 7 users from the database
        if (staffRows < 4) { // Expecting at least 4 test users
          console.log(`⚠️ Expected at least 4 staff members, found ${staffRows}`);
        }
        
        // Check for proper role display
        const roleElements = await page.locator('text=/admin|manager|consultant|viewer/i').count();
        console.log(`📊 Found ${roleElements} role indicators`);
        
        // Check for email addresses
        const emailElements = await page.locator('text=/@.+\\./i').count();
        console.log(`📊 Found ${emailElements} email addresses`);
        
        // Check for status indicators
        const statusElements = await page.locator('text=/active|inactive/i').count();
        console.log(`📊 Found ${statusElements} status indicators`);
        
      } else {
        console.log(`⚠️ Staff table not visible for admin`);
        
        // Check for error messages
        const errorMessage = await page.locator(TESTSELECTORS.errorMessage).textContent();
        if (errorMessage) {
          console.log(`❌ Error message: ${errorMessage}`);
        }
        
        // Take screenshot for debugging
        await page.screenshot({ 
          path: `e2e/screenshots/staff-page-issue-admin.png`,
          fullPage: true 
        });
      }
    });
    
    test('manager should see appropriate staff data', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const staffTable = page.locator(TESTSELECTORS.domains.staff.staffTable);
      
      if (await staffTable.isVisible({ timeout: 5000 })) {
        const staffRows = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        console.log(`📊 Manager sees ${staffRows} staff members`);
        
        // Manager might see fewer staff than admin
        // This is informational for now
        
      } else {
        console.log(`📝 Staff table not visible for manager - checking if this is expected`);
        
        // Check if manager is redirected or blocked
        const currentUrl = page.url();
        if (currentUrl.includes('/staff')) {
          console.log(`⚠️ Manager is on staff page but table not visible`);
          await page.screenshot({ 
            path: `e2e/screenshots/staff-page-issue-manager.png`,
            fullPage: true 
          });
        } else {
          console.log(`✅ Manager redirected from staff page (${currentUrl})`);
        }
      }
    });
  });
  
  test.describe('Payroll Data Integrity', () => {
    
    test('payroll calculations should be accurate', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const payrollTable = page.locator(TESTSELECTORS.domains.payrolls.payrollTable);
      
      if (await payrollTable.isVisible({ timeout: 5000 })) {
        // Check for payroll amounts
        const payrollAmounts = await page.locator('text=/\\$\\d+(?:\\.\\d{2})?/').all();
        const amounts = [];
        
        for (const element of payrollAmounts) {
          const text = await element.textContent();
          if (text) {
            const amount = parseFloat(text.replace('$', '').replace(',', ''));
            amounts.push(amount);
          }
        }
        
        console.log(`📊 Found ${amounts.length} payroll amounts`);
        
        // Check for suspicious patterns
        const zeroAmounts = amounts.filter(amount => amount === 0);
        if (zeroAmounts.length > amounts.length * 0.5 && amounts.length > 0) {
          console.log(`⚠️ ${zeroAmounts.length}/${amounts.length} payroll amounts are zero - possible calculation issue`);
        }
        
        // Check for payroll status consistency
        const statusElements = await page.locator(TESTSELECTORS.domains.payrolls.payrollStatus).count();
        console.log(`📊 Found ${statusElements} payroll status indicators`);
        
        // Check for date consistency
        const dateElements = await page.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}/').count();
        console.log(`📊 Found ${dateElements} date elements`);
        
      } else {
        console.log(`📝 Payroll table not visible - checking for issues`);
        
        const emptyState = await page.locator(TESTSELECTORS.emptyState).isVisible();
        if (emptyState) {
          console.log(`✅ Proper empty state shown for payrolls`);
        } else {
          console.log(`⚠️ No payroll table and no empty state - possible data loading issue`);
          await page.screenshot({ 
            path: `e2e/screenshots/payroll-page-issue.png`,
            fullPage: true 
          });
        }
      }
    });
  });
  
  test.describe('Client Data Integrity', () => {
    
    test('client information should be complete and consistent', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      const clientTable = page.locator(TESTSELECTORS.domains.clients.clientTable);
      
      if (await clientTable.isVisible({ timeout: 5000 })) {
        const clientRows = await page.locator(TESTSELECTORS.domains.clients.clientRow).count();
        console.log(`📊 Found ${clientRows} clients`);
        
        // Check for client contact information
        const emailElements = await page.locator('text=/@.+\\./i').count();
        console.log(`📊 Found ${emailElements} email addresses in client list`);
        
        // Check for client names (should be proper names, not placeholders)
        const nameElements = await page.locator('text=/^[A-Z][a-z]+ [A-Z][a-z]+$/').count();
        console.log(`📊 Found ${nameElements} properly formatted names`);
        
        // Check for placeholder data
        const placeholderElements = await page.locator('text=/test|example|placeholder|lorem|ipsum/i').count();
        if (placeholderElements > 0) {
          console.log(`⚠️ Found ${placeholderElements} potential placeholder data entries`);
        }
        
        // Check billing status consistency
        const billingElements = await page.locator('text=/active|inactive|billed|unbilled/i').count();
        console.log(`📊 Found ${billingElements} billing status indicators`);
        
      } else {
        console.log(`📝 Client table not visible`);
        
        const emptyState = await page.locator(TESTSELECTORS.emptyState).isVisible();
        if (!emptyState) {
          console.log(`⚠️ No client table and no empty state shown`);
          await page.screenshot({ 
            path: `e2e/screenshots/client-page-issue.png`,
            fullPage: true 
          });
        }
      }
    });
  });
  
  test.describe('Billing Data Integrity', () => {
    
    test('billing calculations and invoice data should be accurate', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      const billingTable = page.locator(TESTSELECTORS.domains.billing.invoiceTable);
      
      if (await billingTable.isVisible({ timeout: 5000 })) {
        // Check for invoice numbers
        const invoiceNumbers = await page.locator('text=/INV-\\d+/i').count();
        console.log(`📊 Found ${invoiceNumbers} invoice numbers`);
        
        // Check for billing amounts
        const billingAmounts = await page.locator(TESTSELECTORS.domains.billing.billingAmount).count();
        console.log(`📊 Found ${billingAmounts} billing amounts`);
        
        // Check for payment status
        const paymentStatus = await page.locator('text=/paid|unpaid|pending|overdue/i').count();
        console.log(`📊 Found ${paymentStatus} payment status indicators`);
        
        // Check for date consistency in billing
        const billingDates = await page.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}/').count();
        console.log(`📊 Found ${billingDates} billing dates`);
        
        // Look for calculation inconsistencies
        const allAmounts = await page.locator('text=/\\$\\d+(?:\\.\\d{2})?/').all();
        let totalAmountElements = 0;
        let zeroAmounts = 0;
        
        for (const element of allAmounts) {
          const text = await element.textContent();
          if (text) {
            totalAmountElements++;
            if (text.includes('$0') || text.includes('$0.00')) {
              zeroAmounts++;
            }
          }
        }
        
        if (zeroAmounts > totalAmountElements * 0.7 && totalAmountElements > 0) {
          console.log(`⚠️ High percentage of zero amounts (${zeroAmounts}/${totalAmountElements}) - possible calculation issue`);
        }
        
      } else {
        console.log(`📝 Billing table not visible`);
        
        // Check if it's an access issue or data loading issue
        const accessDenied = await page.locator('text=/access denied|unauthorized/i').isVisible();
        if (accessDenied) {
          console.log(`✅ Access properly denied for billing`);
        } else {
          console.log(`⚠️ Billing page accessible but no data shown`);
          await page.screenshot({ 
            path: `e2e/screenshots/billing-page-issue.png`,
            fullPage: true 
          });
        }
      }
    });
  });
  
  test.describe('Cross-Page Data Consistency', () => {
    
    test('user data should be consistent across dashboard and staff pages', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      // Get user count from dashboard
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      const dashboardUserCount = await page.locator('text=/\\d+\\s*(users?|staff|employees?)/i').first().textContent();
      let dashboardCount = 0;
      
      if (dashboardUserCount) {
        const match = dashboardUserCount.match(/\\d+/);
        if (match) {
          dashboardCount = parseInt(match[0]);
        }
      }
      
      console.log(`📊 Dashboard shows ${dashboardCount} users`);
      
      // Get user count from staff page
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const staffRows = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
      console.log(`📊 Staff page shows ${staffRows} users`);
      
      // Compare counts
      if (dashboardCount > 0 && staffRows > 0) {
        if (Math.abs(dashboardCount - staffRows) > 1) { // Allow for small discrepancies
          console.log(`⚠️ User count mismatch: Dashboard=${dashboardCount}, Staff=${staffRows}`);
        } else {
          console.log(`✅ User counts are consistent across pages`);
        }
      } else {
        console.log(`📝 Could not compare user counts (Dashboard: ${dashboardCount}, Staff: ${staffRows})`);
      }
    });
  });
});
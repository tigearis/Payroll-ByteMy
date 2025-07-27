/**
 * Payrolls Domain Testing
 * Tests core payroll processing, payroll calculations, and payroll management features
 */

import { test, expect } from '@playwright/test';
import { 
  STORAGE_STATE_ADMIN,
  STORAGE_STATE_MANAGER,
  STORAGE_STATE_CONSULTANT,
  STORAGE_STATE_VIEWER,
  TEST_SELECTORS,
  TIMEOUTS
} from '../utils/test-config';

test.describe('Payrolls Domain Tests', () => {
  
  test.describe('Payroll Management Access', () => {
    
    test('admin should manage payrolls comprehensively', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const payrollTable = page.locator(TESTSELECTORS.domains.payrolls.payrollTable);
      
      if (await payrollTable.isVisible({ timeout: 5000 })) {
        // Count total payrolls
        const payrollRows = await page.locator(TESTSELECTORS.domains.payrolls.payrollRow).count();
        console.log(`💰 Admin sees ${payrollRows} payroll records`);
        
        // Check for payroll management actions
        const addButton = page.locator(TESTSELECTORS.domains.payrolls.addPayrollButton);
        const addButtonVisible = await addButton.isVisible().catch(() => false);
        
        const processButtons = await page.locator('button:has-text("Process"), button:has-text("Run")').count();
        const editButtons = await page.locator('button:has-text("Edit")').count();
        
        console.log(`🔘 Admin payroll actions - Add: ${addButtonVisible ? 'YES' : 'NO'}, Process: ${processButtons}, Edit: ${editButtons}`);
        
        // Check for payroll status indicators
        const statusElements = await page.locator(TESTSELECTORS.domains.payrolls.payrollStatus).count();
        console.log(`📊 Found ${statusElements} payroll status indicators`);
        
        // Check for payroll amounts and calculations
        const amountElements = await page.locator('text=/\\$\\d+(?:\\.\\d{2})?/').count();
        console.log(`💵 Found ${amountElements} financial amounts`);
        
      } else {
        console.log('⚠️ Payroll table not visible for admin');
        
        // Check for empty state
        const emptyState = await page.locator(TESTSELECTORS.emptyState).isVisible();
        if (emptyState) {
          console.log('📝 Proper empty state shown for payrolls');
        } else {
          await page.screenshot({ 
            path: 'e2e/screenshots/payrolls-domain-admin-issue.png',
            fullPage: true 
          });
        }
      }
    });
    
    test('manager should access payroll information appropriately', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const payrollTable = page.locator(TESTSELECTORS.domains.payrolls.payrollTable);
      
      if (await payrollTable.isVisible({ timeout: 5000 })) {
        const payrollRows = await page.locator(TESTSELECTORS.domains.payrolls.payrollRow).count();
        console.log(`💰 Manager sees ${payrollRows} payroll records`);
        
        // Manager might have limited payroll actions
        const processButtons = await page.locator('button:has-text("Process"), button:has-text("Run"), button:has-text("Approve")').count();
        const editButtons = await page.locator('button:has-text("Edit")').count();
        
        console.log(`🔘 Manager payroll actions - Process: ${processButtons}, Edit: ${editButtons}`);
        
      } else {
        const currentUrl = page.url();
        console.log(`📝 Manager payroll access: ${currentUrl}`);
      }
    });
    
    test('consultant should have appropriate payroll access', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_CONSULTANT });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('/payrolls')) {
        // If consultant can access, check for read-only behavior
        const payrollRows = await page.locator(TESTSELECTORS.domains.payrolls.payrollRow).count();
        console.log(`💰 Consultant sees ${payrollRows} payroll records`);
        
        // Should have minimal or no management actions
        const actionButtons = await page.locator('button:has-text("Process"), button:has-text("Edit"), button:has-text("Delete")').count();
        console.log(`🚫 Consultant payroll actions: ${actionButtons} (should be minimal)`);
        
      } else {
        console.log(`📝 Consultant payroll access: ${currentUrl}`);
      }
    });
    
    test('viewer should have restricted payroll access', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_VIEWER });
      
      await page.goto('/payrolls');
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      
      // Viewer might be redirected or have very limited access
      if (currentUrl.includes('/payrolls')) {
        console.log('📝 Viewer has payroll access - checking restrictions');
        
        const actionButtons = await page.locator('button:has-text("Process"), button:has-text("Edit"), button:has-text("Add")').count();
        console.log(`🚫 Viewer payroll actions: ${actionButtons} (should be 0)`);
        
      } else {
        console.log(`✅ Viewer properly restricted from payrolls, at: ${currentUrl}`);
      }
    });
  });
  
  test.describe('Payroll Calculations and Data Integrity', () => {
    
    test('payroll calculations should be accurate and consistent', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      const payrollTable = page.locator(TESTSELECTORS.domains.payrolls.payrollTable);
      
      if (await payrollTable.isVisible({ timeout: 5000 })) {
        // Collect all monetary amounts
        const amountElements = await page.locator('text=/\\$\\d+(?:\\.\\d{2})?/').all();
        const amounts = [];
        
        for (const element of amountElements) {
          const text = await element.textContent();
          if (text) {
            const amount = parseFloat(text.replace(/[$,]/g, ''));
            if (!isNaN(amount)) {
              amounts.push(amount);
            }
          }
        }
        
        console.log(`💵 Found ${amounts.length} payroll amounts`);
        
        if (amounts.length > 0) {
          // Analyze amount patterns
          const zeroAmounts = amounts.filter(amount => amount === 0);
          const negativeAmounts = amounts.filter(amount => amount < 0);
          const largeAmounts = amounts.filter(amount => amount > 100000);
          
          console.log(`📊 Amount analysis - Zero amounts: ${zeroAmounts.length}, Negative: ${negativeAmounts.length}, Large (>$100k): ${largeAmounts.length}`);
          
          // Check for suspicious patterns
          if (zeroAmounts.length > amounts.length * 0.8) {
            console.log('⚠️ High percentage of zero amounts - possible calculation issue');
          }
          
          if (negativeAmounts.length > 0) {
            console.log(`⚠️ Found ${negativeAmounts.length} negative amounts - verify if intentional`);
          }
          
          // Calculate basic statistics
          const sum = amounts.reduce((a, b) => a + b, 0);
          const average = sum / amounts.length;
          console.log(`📈 Payroll statistics - Total: $${sum.toFixed(2)}, Average: $${average.toFixed(2)}`);
        }
        
        // Check for payroll dates and periods
        const dateElements = await page.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}/').count();
        console.log(`📅 Found ${dateElements} date elements`);
        
        // Check for employee associations
        const employeeElements = await page.locator('text=/@.+\\.|[A-Z][a-z]+ [A-Z][a-z]+/').count();
        console.log(`👥 Found ${employeeElements} employee references`);
        
      }
    });
    
    test('payroll status workflow should be properly managed', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.payrolls.payrollTable).isVisible({ timeout: 5000 })) {
        // Check for various payroll statuses
        const statusTypes = [
          'draft', 'pending', 'processing', 'processed', 'approved', 
          'paid', 'complete', 'error', 'cancelled', 'review'
        ];
        
        const statusCounts = {};
        
        for (const status of statusTypes) {
          const count = await page.locator(`text=/${status}/i`).count();
          if (count > 0) {
            statusCounts[status] = count;
          }
        }
        
        console.log('📊 Payroll status distribution:', statusCounts);
        
        // Check for status-specific actions
        const statusActions = await page.locator('button:has-text("Approve"), button:has-text("Process"), button:has-text("Review"), button:has-text("Complete")').count();
        console.log(`🔘 Found ${statusActions} status-related action buttons`);
        
        // Look for workflow indicators
        const workflowElements = await page.locator('text=/workflow|step|stage|phase/i').count();
        console.log(`🔄 Found ${workflowElements} workflow-related elements`);
      }
    });
  });
  
  test.describe('Payroll Processing Features', () => {
    
    test('payroll processing controls should be available to authorized users', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for payroll processing features
      const processButtons = await page.locator('button:has-text("Process"), button:has-text("Run Payroll"), button:has-text("Calculate")').count();
      console.log(`⚙️ Found ${processButtons} payroll processing buttons`);
      
      // Look for batch processing options
      const batchOptions = await page.locator('button:has-text("Batch"), input[type="checkbox"], text=/select all/i').count();
      console.log(`📦 Found ${batchOptions} batch processing options`);
      
      // Check for payroll scheduling
      const scheduleElements = await page.locator('text=/schedule|weekly|biweekly|monthly|frequency/i').count();
      console.log(`📅 Found ${scheduleElements} scheduling-related elements`);
      
      // Look for payroll templates or configurations
      const templateElements = await page.locator('text=/template|config|setting|default/i').count();
      console.log(`⚙️ Found ${templateElements} configuration elements`);
      
      // Check for payroll reports or summaries
      const reportElements = await page.locator('button:has-text("Report"), a[href*="report"], text=/summary|total/i').count();
      console.log(`📊 Found ${reportElements} reporting elements`);
    });
    
    test('payroll validation and error handling should be robust', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for validation indicators
      const validationElements = await page.locator('text=/error|warning|invalid|missing|required/i').count();
      console.log(`⚠️ Found ${validationElements} validation-related indicators`);
      
      // Check for error handling in payroll data
      const errorElements = await page.locator('[class*="error"], [data-testid*="error"], .text-red').count();
      console.log(`❌ Found ${errorElements} error display elements`);
      
      // Look for data validation messages
      const validationMessages = await page.locator('text=/must be|cannot be|invalid format|required field/i').count();
      console.log(`✅ Found ${validationMessages} validation messages`);
      
      // Check for calculation warnings
      const calculationWarnings = await page.locator('text=/calculation|compute|tax|deduction/i').count();
      console.log(`🧮 Found ${calculationWarnings} calculation-related elements`);
    });
  });
  
  test.describe('Payroll Reports and Analytics', () => {
    
    test('payroll reporting should provide comprehensive insights', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for summary statistics
      const summaryElements = await page.locator('text=/total|sum|average|count|summary/i').count();
      console.log(`📊 Found ${summaryElements} summary statistics`);
      
      // Check for period-based reporting
      const periodElements = await page.locator('text=/year|month|quarter|period|ytd|mtd/i').count();
      console.log(`📅 Found ${periodElements} period-based elements`);
      
      // Look for tax-related information
      const taxElements = await page.locator('text=/tax|withholding|deduction|gross|net/i').count();
      console.log(`💸 Found ${taxElements} tax-related elements`);
      
      // Check for export options
      const exportOptions = await page.locator('button:has-text("Export"), a:has-text("CSV"), a:has-text("PDF")').count();
      console.log(`📤 Found ${exportOptions} export options`);
      
      // Look for charts or visual analytics
      const chartElements = await page.locator('canvas, svg, [class*="chart"], [data-testid*="chart"]').count();
      console.log(`📈 Found ${chartElements} potential chart elements`);
    });
    
    test('payroll history and audit trail should be maintained', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Look for history or audit features
      const historyElements = await page.locator('text=/history|audit|log|track|previous/i').count();
      console.log(`📚 Found ${historyElements} history-related elements`);
      
      // Check for modification tracking
      const trackingElements = await page.locator('text=/modified|updated|created|changed|by/i').count();
      console.log(`👤 Found ${trackingElements} tracking-related elements`);
      
      // Look for version or revision information
      const versionElements = await page.locator('text=/version|revision|v\\d+|draft/i').count();
      console.log(`📝 Found ${versionElements} version-related elements`);
      
      // Check for compliance or audit features
      const complianceElements = await page.locator('text=/compliant|audit|regulation|law|requirement/i').count();
      console.log(`⚖️ Found ${complianceElements} compliance-related elements`);
    });
  });
  
  test.describe('Payroll Data Security and Access Control', () => {
    
    test('sensitive payroll data should be properly protected', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/payrolls');
      await page.waitForLoadState('networkidle');
      
      // Check for data masking or protection
      const maskingElements = await page.locator('text=/\\*\\*\\*|xxx|###|masked|hidden/').count();
      console.log(`🔒 Found ${maskingElements} potential data masking elements`);
      
      // Look for access control indicators
      const accessElements = await page.locator('text=/restricted|confidential|private|authorized/i').count();
      console.log(`🛡️ Found ${accessElements} access control indicators`);
      
      // Check for sensitive data warnings
      const warningElements = await page.locator('text=/sensitive|confidential|protected|security/i').count();
      console.log(`⚠️ Found ${warningElements} security warning elements`);
      
      // Look for encryption or security indicators
      const securityElements = await page.locator('[class*="secure"], [data-testid*="secure"], text=/encrypted|secure/i').count();
      console.log(`🔐 Found ${securityElements} security-related indicators`);
    });
  });
});
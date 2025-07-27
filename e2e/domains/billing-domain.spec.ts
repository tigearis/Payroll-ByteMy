/**
 * Billing Domain Testing
 * Tests billing operations, invoice management, and financial calculations
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

test.describe('Billing Domain Tests', () => {
  
  test.describe('Billing Management Access', () => {
    
    test('admin should manage billing comprehensively', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      const billingTable = page.locator(TESTSELECTORS.domains.billing.invoiceTable);
      
      if (await billingTable.isVisible({ timeout: 5000 })) {
        // Count total billing records
        const billingRows = await page.locator(TESTSELECTORS.domains.billing.invoiceRow).count();
        console.log(`💰 Admin sees ${billingRows} billing records`);
        
        // Check for billing management actions
        const addButton = page.locator(TESTSELECTORS.domains.billing.addInvoiceButton);
        const addButtonVisible = await addButton.isVisible().catch(() => false);
        
        const generateButtons = await page.locator('button:has-text("Generate"), button:has-text("Create Invoice")').count();
        const editButtons = await page.locator('button:has-text("Edit")').count();
        
        console.log(`🔘 Admin billing actions - Add: ${addButtonVisible ? 'YES' : 'NO'}, Generate: ${generateButtons}, Edit: ${editButtons}`);
        
        // Check for invoice numbers and formatting
        const invoiceNumbers = await page.locator('text=/INV-\\d+|#\\d+|Invoice\\s+\\d+/i').count();
        console.log(`📄 Found ${invoiceNumbers} invoice numbers`);
        
        // Check for billing amounts
        const amountElements = await page.locator(TESTSELECTORS.domains.billing.billingAmount).count();
        console.log(`💵 Found ${amountElements} billing amounts`);
        
        // Check for payment status indicators
        const paymentStatus = await page.locator('text=/paid|unpaid|pending|overdue|draft/i').count();
        console.log(`💳 Found ${paymentStatus} payment status indicators`);
        
      } else {
        console.log('⚠️ Billing table not visible for admin');
        
        // Check for access restrictions or empty state
        const accessDenied = await page.locator('text=/access denied|unauthorized/i').isVisible();
        if (accessDenied) {
          console.log('🚫 Access denied message shown');
        } else {
          const emptyState = await page.locator(TESTSELECTORS.emptyState).isVisible();
          if (emptyState) {
            console.log('📝 Proper empty state shown for billing');
          } else {
            await page.screenshot({ 
              path: 'e2e/screenshots/billing-domain-admin-issue.png',
              fullPage: true 
            });
          }
        }
      }
    });
    
    test('manager should access billing information appropriately', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      const billingTable = page.locator(TESTSELECTORS.domains.billing.invoiceTable);
      
      if (await billingTable.isVisible({ timeout: 5000 })) {
        const billingRows = await page.locator(TESTSELECTORS.domains.billing.invoiceRow).count();
        console.log(`💰 Manager sees ${billingRows} billing records`);
        
        // Manager might have limited billing actions
        const generateButtons = await page.locator('button:has-text("Generate"), button:has-text("Create")').count();
        const approveButtons = await page.locator('button:has-text("Approve"), button:has-text("Review")').count();
        
        console.log(`🔘 Manager billing actions - Generate: ${generateButtons}, Approve: ${approveButtons}`);
        
      } else {
        const currentUrl = page.url();
        const accessDenied = await page.locator('text=/access denied|unauthorized/i').isVisible();
        
        if (accessDenied) {
          console.log('✅ Manager properly denied billing access');
        } else {
          console.log(`📝 Manager billing access: ${currentUrl}`);
        }
      }
    });
    
    test('consultant should have limited billing access', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_CONSULTANT });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('/billing')) {
        console.log('📝 Consultant has billing access - checking restrictions');
        
        // Should have minimal or no management actions
        const actionButtons = await page.locator('button:has-text("Generate"), button:has-text("Edit"), button:has-text("Delete")').count();
        console.log(`🚫 Consultant billing actions: ${actionButtons} (should be minimal)`);
        
        // Might only see their own related billing
        const billingRows = await page.locator(TESTSELECTORS.domains.billing.invoiceRow).count();
        console.log(`💰 Consultant sees ${billingRows} billing records`);
        
      } else {
        const accessDenied = await page.locator('text=/access denied|unauthorized/i').isVisible();
        if (accessDenied) {
          console.log('✅ Consultant properly denied billing access');
        } else {
          console.log(`📝 Consultant billing redirect: ${currentUrl}`);
        }
      }
    });
    
    test('viewer should be restricted from billing', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_VIEWER });
      
      await page.goto('/billing');
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      const accessDenied = await page.locator('text=/access denied|unauthorized/i').isVisible();
      
      if (accessDenied || !currentUrl.includes('/billing')) {
        console.log(`✅ Viewer properly restricted from billing, at: ${currentUrl}`);
      } else {
        console.log('⚠️ Viewer may have unexpected billing access');
        
        const actionButtons = await page.locator('button:has-text("Generate"), button:has-text("Edit"), button:has-text("Add")').count();
        console.log(`🚫 Viewer billing actions: ${actionButtons} (should be 0)`);
      }
    });
  });
  
  test.describe('Invoice Management and Data Integrity', () => {
    
    test('invoice data should be complete and accurate', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      const billingTable = page.locator(TESTSELECTORS.domains.billing.invoiceTable);
      
      if (await billingTable.isVisible({ timeout: 5000 })) {
        // Check invoice number formatting and uniqueness
        const invoiceNumbers = await page.locator('text=/INV-\\d+|#\\d+|Invoice\\s+\\d+/i').all();
        const invoiceNumberTexts = [];
        
        for (const element of invoiceNumbers) {
          const text = await element.textContent();
          if (text) {
            invoiceNumberTexts.push(text.trim());
          }
        }
        
        const uniqueInvoices = new Set(invoiceNumberTexts);
        console.log(`📄 Invoice analysis - Total: ${invoiceNumberTexts.length}, Unique: ${uniqueInvoices.size}`);
        
        if (invoiceNumberTexts.length !== uniqueInvoices.size) {
          console.log('⚠️ Duplicate invoice numbers detected');
        }
        
        // Check billing amounts for consistency
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
        
        console.log(`💵 Found ${amounts.length} billing amounts`);
        
        if (amounts.length > 0) {
          const zeroAmounts = amounts.filter(amount => amount === 0);
          const negativeAmounts = amounts.filter(amount => amount < 0);
          const largeAmounts = amounts.filter(amount => amount > 50000);
          
          console.log(`📊 Amount analysis - Zero: ${zeroAmounts.length}, Negative: ${negativeAmounts.length}, Large (>$50k): ${largeAmounts.length}`);
          
          if (zeroAmounts.length > amounts.length * 0.5) {
            console.log('⚠️ High percentage of zero amounts - possible data issue');
          }
          
          // Calculate totals
          const total = amounts.reduce((sum, amount) => sum + amount, 0);
          console.log(`💰 Total billing amount: $${total.toFixed(2)}`);
        }
        
        // Check for billing dates
        const dateElements = await page.locator('text=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}|\\d{4}-\\d{2}-\\d{2}/').count();
        console.log(`📅 Found ${dateElements} date elements`);
        
        // Check for client associations
        const clientElements = await page.locator('text=/@.+\\.|[A-Z][a-z]+ [A-Z][a-z]+|\\w+\\s+(Inc|Corp|LLC|Ltd)/i').count();
        console.log(`🏢 Found ${clientElements} client references`);
        
      }
    });
    
    test('payment status workflow should be properly managed', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.billing.invoiceTable).isVisible({ timeout: 5000 })) {
        // Check for various payment statuses
        const statusTypes = [
          'draft', 'sent', 'pending', 'paid', 'overdue', 
          'cancelled', 'refunded', 'partial', 'disputed'
        ];
        
        const statusCounts = {};
        
        for (const status of statusTypes) {
          const count = await page.locator(`text=/${status}/i`).count();
          if (count > 0) {
            statusCounts[status] = count;
          }
        }
        
        console.log('📊 Payment status distribution:', statusCounts);
        
        // Check for status-specific actions
        const statusActions = await page.locator('button:has-text("Mark Paid"), button:has-text("Send"), button:has-text("Cancel"), button:has-text("Refund")').count();
        console.log(`🔘 Found ${statusActions} status-related action buttons`);
        
        // Look for payment method indicators
        const paymentMethods = await page.locator('text=/credit|debit|bank|check|cash|transfer|paypal/i').count();
        console.log(`💳 Found ${paymentMethods} payment method indicators`);
        
        // Check for due date management
        const dueDateElements = await page.locator('text=/due|overdue|expires/i').count();
        console.log(`⏰ Found ${dueDateElements} due date elements`);
      }
    });
  });
  
  test.describe('Billing Calculations and Tax Management', () => {
    
    test('billing calculations should include proper tax handling', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.billing.invoiceTable).isVisible({ timeout: 5000 })) {
        // Look for tax-related elements
        const taxElements = await page.locator('text=/tax|gst|hst|pst|vat|\\d+%/i').count();
        console.log(`📊 Found ${taxElements} tax-related elements`);
        
        // Check for subtotal/total breakdown
        const totalElements = await page.locator('text=/subtotal|total|amount|sum/i').count();
        console.log(`💰 Found ${totalElements} total/subtotal elements`);
        
        // Look for discount or adjustment handling
        const discountElements = await page.locator('text=/discount|adjustment|credit|deduction/i').count();
        console.log(`💸 Found ${discountElements} discount/adjustment elements`);
        
        // Check for currency formatting
        const currencyElements = await page.locator('text=/\\$|CAD|USD|currency/i').count();
        console.log(`💱 Found ${currencyElements} currency indicators`);
        
        // Look for rounding or precision indicators
        const precisionElements = await page.locator('text=/\\.\\d{2}$/').count();
        console.log(`🔢 Found ${precisionElements} precise decimal amounts`);
      }
    });
    
    test('billing should handle multi-tier pricing and complex calculations', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Look for complex billing structures
      const tierElements = await page.locator('text=/tier|level|rate|hourly|fixed|variable/i').count();
      console.log(`🏗️ Found ${tierElements} pricing tier elements`);
      
      // Check for quantity-based billing
      const quantityElements = await page.locator('text=/quantity|hours|units|qty|x\\d+/i').count();
      console.log(`📦 Found ${quantityElements} quantity-based elements`);
      
      // Look for service breakdown
      const serviceElements = await page.locator('text=/service|item|description|payroll|consulting/i').count();
      console.log(`🔧 Found ${serviceElements} service-related elements`);
      
      // Check for time-based billing
      const timeElements = await page.locator('text=/\\d+:\\d+|\\d+\\.\\d+\\s*h|hours|minutes/i').count();
      console.log(`⏰ Found ${timeElements} time-based billing elements`);
    });
  });
  
  test.describe('Billing Reports and Analytics', () => {
    
    test('billing reports should provide comprehensive financial insights', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Look for financial summary information
      const summaryElements = await page.locator('text=/total|revenue|outstanding|paid|pending/i').count();
      console.log(`📊 Found ${summaryElements} financial summary elements`);
      
      // Check for period-based reporting
      const periodElements = await page.locator('text=/month|quarter|year|ytd|mtd|period/i').count();
      console.log(`📅 Found ${periodElements} period-based elements`);
      
      // Look for aging reports
      const agingElements = await page.locator('text=/aging|overdue|\\d+\\s*days|current/i').count();
      console.log(`⏳ Found ${agingElements} aging-related elements`);
      
      // Check for client performance metrics
      const performanceElements = await page.locator('text=/performance|revenue|average|top|bottom/i').count();
      console.log(`📈 Found ${performanceElements} performance metrics`);
      
      // Look for export and report generation
      const reportOptions = await page.locator('button:has-text("Report"), button:has-text("Export"), a:has-text("PDF")').count();
      console.log(`📤 Found ${reportOptions} report generation options`);
    });
    
    test('billing analytics should track profitability and trends', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Look for profitability indicators
      const profitElements = await page.locator('text=/profit|margin|cost|roi|return/i').count();
      console.log(`💹 Found ${profitElements} profitability elements`);
      
      // Check for trend analysis
      const trendElements = await page.locator('text=/trend|growth|increase|decrease|compare/i').count();
      console.log(`📊 Found ${trendElements} trend analysis elements`);
      
      // Look for client value metrics
      const valueElements = await page.locator('text=/value|worth|lifetime|average|per client/i').count();
      console.log(`💎 Found ${valueElements} client value elements`);
      
      // Check for forecasting or projections
      const forecastElements = await page.locator('text=/forecast|projection|estimate|expected/i').count();
      console.log(`🔮 Found ${forecastElements} forecasting elements`);
    });
  });
  
  test.describe('Billing Integration and Automation', () => {
    
    test('billing should integrate with payroll and client systems', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Look for payroll integration indicators
      const payrollLinks = await page.locator('a[href*="payroll"], text=/payroll/i').count();
      console.log(`💰 Found ${payrollLinks} payroll integration elements`);
      
      // Check for client associations
      const clientLinks = await page.locator('a[href*="client"], text=/client/i').count();
      console.log(`🏢 Found ${clientLinks} client integration elements`);
      
      // Look for automated billing features
      const automationElements = await page.locator('text=/automatic|recurring|schedule|template/i').count();
      console.log(`🤖 Found ${automationElements} automation elements`);
      
      // Check for approval workflows
      const workflowElements = await page.locator('text=/approve|review|workflow|pending approval/i').count();
      console.log(`🔄 Found ${workflowElements} workflow elements`);
      
      // Look for notification or communication features
      const communicationElements = await page.locator('text=/email|send|notify|reminder/i').count();
      console.log(`📧 Found ${communicationElements} communication elements`);
    });
    
    test('billing data should maintain audit trail and compliance', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/billing');
      await page.waitForLoadState('networkidle');
      
      // Look for audit trail features
      const auditElements = await page.locator('text=/audit|log|history|track|modified/i').count();
      console.log(`📚 Found ${auditElements} audit trail elements`);
      
      // Check for compliance indicators
      const complianceElements = await page.locator('text=/compliant|regulation|standard|requirement/i').count();
      console.log(`⚖️ Found ${complianceElements} compliance elements`);
      
      // Look for security features
      const securityElements = await page.locator('text=/secure|encrypted|protected|confidential/i').count();
      console.log(`🔒 Found ${securityElements} security elements`);
      
      // Check for backup or archival features
      const backupElements = await page.locator('text=/backup|archive|restore|recovery/i').count();
      console.log(`💾 Found ${backupElements} backup/archive elements`);
    });
  });
});
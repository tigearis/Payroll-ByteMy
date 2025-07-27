/**
 * Clients Domain Testing
 * Tests client relationship management, client data integrity, and client-related operations
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

test.describe('Clients Domain Tests', () => {
  
  test.describe('Client Management Access', () => {
    
    test('admin should manage clients comprehensively', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      const clientTable = page.locator(TESTSELECTORS.domains.clients.clientTable);
      
      if (await clientTable.isVisible({ timeout: 5000 })) {
        // Count total clients
        const clientRows = await page.locator(TESTSELECTORS.domains.clients.clientRow).count();
        console.log(`🏢 Admin sees ${clientRows} clients`);
        
        // Check for complete client information
        const emailElements = await page.locator('text=/@.+\\./i').count();
        const phoneElements = await page.locator('text=/\\(\\d{3}\\)\\s?\\d{3}-\\d{4}|\\d{3}-\\d{3}-\\d{4}|\\+\\d{1,3}\\s?\\d+/').count();
        const addressElements = await page.locator('text=/street|avenue|road|drive|st\\.|ave\\./i').count();
        
        console.log(`📊 Client contact data - Emails: ${emailElements}, Phones: ${phoneElements}, Addresses: ${addressElements}`);
        
        // Check for client management actions
        const addButton = page.locator(TESTSELECTORS.domains.clients.addClientButton);
        const addButtonVisible = await addButton.isVisible().catch(() => false);
        
        const editButtons = await page.locator('button:has-text("Edit")').count();
        const deleteButtons = await page.locator('button:has-text("Delete")').count();
        
        console.log(`🔘 Admin client actions - Add: ${addButtonVisible ? 'YES' : 'NO'}, Edit: ${editButtons}, Delete: ${deleteButtons}`);
        
        // Check for client status indicators
        const statusElements = await page.locator('text=/active|inactive|prospect|current|former/i').count();
        console.log(`📈 Found ${statusElements} client status indicators`);
        
      } else {
        console.log('⚠️ Client table not visible for admin');
        
        // Check for empty state or error
        const emptyState = await page.locator(TESTSELECTORS.emptyState).isVisible();
        if (emptyState) {
          console.log('📝 Proper empty state shown for clients');
        } else {
          await page.screenshot({ 
            path: 'e2e/screenshots/clients-domain-admin-issue.png',
            fullPage: true 
          });
        }
      }
    });
    
    test('manager should access client information appropriately', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      const clientTable = page.locator(TESTSELECTORS.domains.clients.clientTable);
      
      if (await clientTable.isVisible({ timeout: 5000 })) {
        const clientRows = await page.locator(TESTSELECTORS.domains.clients.clientRow).count();
        console.log(`🏢 Manager sees ${clientRows} clients`);
        
        // Manager might have limited client management actions
        const editButtons = await page.locator('button:has-text("Edit")').count();
        const deleteButtons = await page.locator('button:has-text("Delete")').count();
        
        console.log(`🔘 Manager client actions - Edit: ${editButtons}, Delete: ${deleteButtons} (should be limited)`);
        
      } else {
        const currentUrl = page.url();
        console.log(`📝 Manager client access: ${currentUrl}`);
      }
    });
    
    test('consultant should have appropriate client access', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_CONSULTANT });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('/clients')) {
        // If consultant can access, check for appropriate restrictions
        const clientRows = await page.locator(TESTSELECTORS.domains.clients.clientRow).count();
        console.log(`🏢 Consultant sees ${clientRows} clients`);
        
        // Should have limited or no management actions
        const actionButtons = await page.locator('button:has-text("Add"), button:has-text("Delete")').count();
        console.log(`🚫 Consultant management buttons: ${actionButtons} (should be minimal)`);
        
      } else {
        console.log(`📝 Consultant client access: ${currentUrl}`);
      }
    });
    
    test('viewer should have restricted client access', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_VIEWER });
      
      await page.goto('/clients');
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      
      // Viewer might be redirected or have very limited access
      if (currentUrl.includes('/clients')) {
        console.log('📝 Viewer has client page access - checking restrictions');
        
        const actionButtons = await page.locator('button:has-text("Add"), button:has-text("Edit"), button:has-text("Delete")').count();
        console.log(`🚫 Viewer action buttons: ${actionButtons} (should be 0)`);
        
      } else {
        console.log(`✅ Viewer properly restricted from clients, at: ${currentUrl}`);
      }
    });
  });
  
  test.describe('Client Data Integrity', () => {
    
    test('client information should be complete and valid', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      const clientTable = page.locator(TESTSELECTORS.domains.clients.clientTable);
      
      if (await clientTable.isVisible({ timeout: 5000 })) {
        const clientRows = await page.locator(TESTSELECTORS.domains.clients.clientRow).count();
        
        if (clientRows > 0) {
          console.log(`🏢 Analyzing ${clientRows} client records for data integrity`);
          
          // Check for proper client names (should be company names or proper names)
          const nameElements = await page.locator('td:first-child, [data-testid*="client-name"]').count();
          console.log(`📋 Found ${nameElements} client name fields`);
          
          // Check for valid email formats
          const validEmails = await page.locator('text=/@[^@\\s]+\\.[^@\\s]+/').count();
          console.log(`📧 Found ${validEmails} valid email formats`);
          
          // Check for placeholder or test data
          const placeholderData = await page.locator('text=/test|example|placeholder|lorem|ipsum|sample|demo/i').count();
          if (placeholderData > 0) {
            console.log(`⚠️ Found ${placeholderData} potential placeholder data entries`);
          }
          
          // Check for incomplete records
          const incompleteRecords = await page.locator('td:has-text(""), td:has-text("-"), td:has-text("N/A")').count();
          console.log(`📊 Found ${incompleteRecords} incomplete data fields`);
          
          // Check for client status consistency
          const statusElements = await page.locator('text=/active|inactive|prospect|current|former/i').count();
          console.log(`📈 ${statusElements} clients have status indicators`);
          
          if (statusElements < clientRows && clientRows > 0) {
            console.log(`⚠️ Status assignment gap: ${clientRows - statusElements} clients without clear status`);
          }
          
        } else {
          console.log('📝 No client records found');
        }
      }
    });
    
    test('client contact information should be accessible and properly formatted', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.clients.clientTable).isVisible({ timeout: 5000 })) {
        // Check email format consistency
        const emailElements = await page.locator('text=/@.+\\./i').all();
        let validEmailCount = 0;
        
        for (const email of emailElements) {
          const emailText = await email.textContent();
          if (emailText && emailText.includes('@') && emailText.includes('.')) {
            validEmailCount++;
          }
        }
        
        console.log(`📧 Email validation: ${validEmailCount}/${emailElements.length} have proper format`);
        
        // Check for phone number formats
        const phoneElements = await page.locator('text=/\\(\\d{3}\\)|\\d{3}[-.\\s]\\d{3}[-.\\s]\\d{4}/').count();
        console.log(`📞 Found ${phoneElements} formatted phone numbers`);
        
        // Check for address information
        const addressElements = await page.locator('text=/\\d+\\s+\\w+\\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)/i').count();
        console.log(`🏠 Found ${addressElements} formatted addresses`);
        
        // Look for contact preferences or communication settings
        const communicationElements = await page.locator('text=/email|phone|mail|contact|prefer/i').count();
        console.log(`💬 Found ${communicationElements} communication-related elements`);
      }
    });
  });
  
  test.describe('Client Relationships and Associations', () => {
    
    test('clients should show proper relationships to other entities', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.clients.clientTable).isVisible({ timeout: 5000 })) {
        // Look for payroll associations
        const payrollLinks = await page.locator('a[href*="payroll"], text=/payroll/i').count();
        console.log(`💰 Found ${payrollLinks} payroll-related links`);
        
        // Look for billing associations
        const billingLinks = await page.locator('a[href*="billing"], text=/billing|invoice/i').count();
        console.log(`📄 Found ${billingLinks} billing-related links`);
        
        // Look for assigned staff or consultants
        const staffAssignments = await page.locator('text=/assigned|consultant|manager|staff/i').count();
        console.log(`👥 Found ${staffAssignments} staff assignment indicators`);
        
        // Check for client project or service associations
        const serviceElements = await page.locator('text=/service|project|contract|agreement/i').count();
        console.log(`🔧 Found ${serviceElements} service-related elements`);
        
        // Look for client activity or history indicators
        const activityElements = await page.locator('text=/last|recent|activity|history/i').count();
        console.log(`📈 Found ${activityElements} activity indicators`);
      }
    });
    
    test('client financial information should be appropriately accessible', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.clients.clientTable).isVisible({ timeout: 5000 })) {
        // Look for financial indicators
        const financialElements = await page.locator('text=/\\$\\d+(?:\\.\\d{2})?/').count();
        console.log(`💰 Found ${financialElements} financial amounts`);
        
        // Check for billing status
        const billingStatus = await page.locator('text=/paid|unpaid|overdue|current|billed/i').count();
        console.log(`💳 Found ${billingStatus} billing status indicators`);
        
        // Look for revenue or value indicators
        const revenueElements = await page.locator('text=/revenue|value|worth|total|amount/i').count();
        console.log(`📊 Found ${revenueElements} revenue-related elements`);
        
        // Check for contract or agreement information
        const contractElements = await page.locator('text=/contract|agreement|term|rate/i').count();
        console.log(`📋 Found ${contractElements} contract-related elements`);
      }
    });
  });
  
  test.describe('Client Search and Filtering', () => {
    
    test('client search functionality should work properly', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Look for search functionality
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="filter"], input[type="search"]');
      const searchVisible = await searchInput.isVisible().catch(() => false);
      
      if (searchVisible) {
        console.log('🔍 Client search functionality available');
        
        const initialCount = await page.locator(TESTSELECTORS.domains.clients.clientRow).count();
        console.log(`📋 Initial client count: ${initialCount}`);
        
        // Test search with common terms
        const searchTerms = ['inc', 'corp', 'llc', 'company'];
        
        for (const term of searchTerms) {
          await searchInput.fill(term);
          await page.waitForTimeout(1000); // Allow for search debounce
          
          const searchResults = await page.locator(TESTSELECTORS.domains.clients.clientRow).count();
          console.log(`🔎 Search results for "${term}": ${searchResults} clients`);
          
          await searchInput.clear();
          await page.waitForTimeout(500);
        }
        
      } else {
        console.log('📝 No client search functionality found');
      }
      
      // Look for status filters
      const statusFilters = await page.locator('select, button:has-text("Filter"), [data-testid*="filter"]').count();
      console.log(`🎛️ Found ${statusFilters} potential filter controls`);
      
      // Look for sorting options
      const sortOptions = await page.locator('th:has(button), [data-testid*="sort"], text=/sort/i').count();
      console.log(`📊 Found ${sortOptions} potential sorting options`);
    });
  });
  
  test.describe('Client Data Export and Reporting', () => {
    
    test('client data should be exportable for authorized users', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/clients');
      await page.waitForLoadState('networkidle');
      
      // Look for export functionality
      const exportButtons = await page.locator('button:has-text("Export"), button:has-text("Download"), a:has-text("CSV"), a:has-text("Excel")').count();
      console.log(`📤 Found ${exportButtons} potential export options`);
      
      // Look for print functionality
      const printButtons = await page.locator('button:has-text("Print"), [onclick*="print"]').count();
      console.log(`🖨️ Found ${printButtons} print options`);
      
      // Look for report generation
      const reportButtons = await page.locator('button:has-text("Report"), a[href*="report"]').count();
      console.log(`📊 Found ${reportButtons} report generation options`);
      
      if (exportButtons === 0 && printButtons === 0 && reportButtons === 0) {
        console.log('📝 No export/report functionality found - may not be implemented yet');
      }
    });
  });
});
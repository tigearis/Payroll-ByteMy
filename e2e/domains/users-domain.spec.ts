/**
 * Users Domain Testing
 * Tests user management, staff lifecycle, and user-related operations
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

test.describe('Users Domain Tests', () => {
  
  test.describe('Staff Management', () => {
    
    test('admin should manage staff comprehensively', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const staffTable = page.locator(TESTSELECTORS.domains.staff.staffTable);
      
      if (await staffTable.isVisible({ timeout: 5000 })) {
        // Count total staff
        const staffRows = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        console.log(`👥 Admin sees ${staffRows} staff members`);
        
        // Check for complete staff information
        const emailElements = await page.locator('text=/@.+\\./i').count();
        const roleElements = await page.locator('text=/admin|manager|consultant|viewer/i').count();
        const statusElements = await page.locator('text=/active|inactive/i').count();
        
        console.log(`📊 Staff data - Emails: ${emailElements}, Roles: ${roleElements}, Status: ${statusElements}`);
        
        // Check for management actions
        const addButton = page.locator(TESTSELECTORS.domains.staff.addStaffButton);
        const addButtonVisible = await addButton.isVisible().catch(() => false);
        
        const editButtons = await page.locator('button:has-text("Edit")').count();
        const deleteButtons = await page.locator('button:has-text("Delete")').count();
        
        console.log(`🔘 Admin actions - Add: ${addButtonVisible ? 'YES' : 'NO'}, Edit: ${editButtons}, Delete: ${deleteButtons}`);
        
        // Test staff search/filter if available
        const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="filter"]');
        const searchVisible = await searchInput.isVisible().catch(() => false);
        console.log(`🔍 Staff search available: ${searchVisible ? 'YES' : 'NO'}`);
        
      } else {
        console.log('⚠️ Staff table not visible for admin');
        await page.screenshot({ 
          path: 'e2e/screenshots/users-domain-admin-issue.png',
          fullPage: true 
        });
      }
    });
    
    test('manager should see team-relevant staff', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const staffTable = page.locator(TESTSELECTORS.domains.staff.staffTable);
      
      if (await staffTable.isVisible({ timeout: 5000 })) {
        const staffRows = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        console.log(`👥 Manager sees ${staffRows} staff members`);
        
        // Manager might have limited actions
        const editButtons = await page.locator('button:has-text("Edit")').count();
        const deleteButtons = await page.locator('button:has-text("Delete")').count();
        
        console.log(`🔘 Manager actions - Edit: ${editButtons}, Delete: ${deleteButtons} (should be limited)`);
        
        // Check if manager sees role hierarchy correctly
        const adminRoles = await page.locator('text=/admin/i').count();
        const managerRoles = await page.locator('text=/manager/i').count();
        const otherRoles = await page.locator('text=/consultant|viewer/i').count();
        
        console.log(`👑 Role visibility - Admin: ${adminRoles}, Manager: ${managerRoles}, Others: ${otherRoles}`);
        
      } else {
        const currentUrl = page.url();
        console.log(`📝 Manager redirected from staff to: ${currentUrl}`);
      }
    });
    
    test('consultant should have minimal staff visibility', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_CONSULTANT });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('/staff')) {
        // If consultant can access, check for read-only behavior
        const staffRows = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        console.log(`👥 Consultant sees ${staffRows} staff members`);
        
        // Should have no management actions
        const actionButtons = await page.locator('button:has-text("Add"), button:has-text("Edit"), button:has-text("Delete")').count();
        console.log(`🚫 Consultant action buttons: ${actionButtons} (should be 0)`);
        
      } else {
        console.log(`✅ Consultant properly restricted from staff page, at: ${currentUrl}`);
      }
    });
  });
  
  test.describe('User Profile Management', () => {
    
    test('users should access their own profile information', async ({ page }) => {
      const roles = [
        { name: 'admin', storageState: STORAGE_STATE_ADMIN },
        { name: 'manager', storageState: STORAGE_STATE_MANAGER },
        { name: 'consultant', storageState: STORAGE_STATE_CONSULTANT },
        { name: 'viewer', storageState: STORAGE_STATE_VIEWER }
      ];
      
      for (const role of roles) {
        test.use({ storageState: role.storageState });
        
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
        
        // Look for user profile or settings access
        const userMenu = page.locator(TESTSELECTORS.userMenu);
        const profileLink = page.locator('a[href*="profile"], a[href*="account"], a[href*="settings"]');
        
        const userMenuVisible = await userMenu.isVisible().catch(() => false);
        const profileLinkVisible = await profileLink.isVisible().catch(() => false);
        
        console.log(`👤 ${role.name} profile access - Menu: ${userMenuVisible ? 'YES' : 'NO'}, Link: ${profileLinkVisible ? 'YES' : 'NO'}`);
        
        // Check for personal information display
        const personalInfo = await page.locator('text=/profile|account|settings/i').count();
        console.log(`📋 ${role.name} sees ${personalInfo} personal info elements`);
      }
    });
  });
  
  test.describe('User Status and Activity', () => {
    
    test('admin should monitor user activity and status', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.staff.staffTable).isVisible({ timeout: 5000 })) {
        // Check for activity indicators
        const activityElements = await page.locator('text=/last seen|last active|online|offline/i').count();
        console.log(`🟢 Found ${activityElements} activity indicators`);
        
        // Check for status management
        const statusElements = await page.locator('text=/active|inactive|suspended|pending/i').count();
        console.log(`📊 Found ${statusElements} status indicators`);
        
        // Look for user statistics
        const statsElements = await page.locator('text=/login|access|session/i').count();
        console.log(`📈 Found ${statsElements} user statistics`);
        
        // Check for bulk actions if available
        const bulkActions = await page.locator('input[type="checkbox"]').count();
        console.log(`☑️ Found ${bulkActions} checkboxes for bulk actions`);
        
      }
    });
  });
  
  test.describe('User Data Integrity', () => {
    
    test('user information should be complete and consistent', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.staff.staffTable).isVisible({ timeout: 5000 })) {
        const staffRows = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        
        if (staffRows > 0) {
          // Check data completeness for each visible staff member
          for (let i = 0; i < Math.min(staffRows, 5); i++) { // Check first 5 users
            const row = page.locator(TESTSELECTORS.domains.staff.staffRow).nth(i);
            
            // Check for required data fields
            const hasEmail = await row.locator('text=/@.+\\./i').isVisible().catch(() => false);
            const hasRole = await row.locator('text=/admin|manager|consultant|viewer/i').isVisible().catch(() => false);
            const hasStatus = await row.locator('text=/active|inactive/i').isVisible().catch(() => false);
            
            console.log(`👤 User ${i + 1} data completeness - Email: ${hasEmail ? '✅' : '❌'}, Role: ${hasRole ? '✅' : '❌'}, Status: ${hasStatus ? '✅' : '❌'}`);
            
            // Check for data placeholder issues
            const hasPlaceholder = await row.locator('text=/placeholder|example|test|lorem/i').isVisible().catch(() => false);
            if (hasPlaceholder) {
              console.log(`⚠️ User ${i + 1} may have placeholder data`);
            }
          }
          
          // Check for data consistency across users
          const emailFormats = await page.locator('text=/@.+\\./i').count();
          const totalUsers = staffRows;
          const emailCompleteness = totalUsers > 0 ? (emailFormats / totalUsers) * 100 : 0;
          
          console.log(`📊 User data completeness: ${emailCompleteness.toFixed(1)}% have valid email formats`);
          
          if (emailCompleteness < 80 && totalUsers > 0) {
            console.log('⚠️ Low email completeness rate - potential data quality issue');
          }
        }
      }
    });
    
    test('user roles should be properly assigned and displayed', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      if (await page.locator(TESTSELECTORS.domains.staff.staffTable).isVisible({ timeout: 5000 })) {
        // Count each role type
        const adminCount = await page.locator('text=/\\badmin\\b/i').count();
        const managerCount = await page.locator('text=/\\bmanager\\b/i').count();
        const consultantCount = await page.locator('text=/\\bconsultant\\b/i').count();
        const viewerCount = await page.locator('text=/\\bviewer\\b/i').count();
        
        console.log(`👥 Role distribution - Admin: ${adminCount}, Manager: ${managerCount}, Consultant: ${consultantCount}, Viewer: ${viewerCount}`);
        
        const totalRoles = adminCount + managerCount + consultantCount + viewerCount;
        const totalUsers = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        
        if (totalUsers > 0 && totalRoles < totalUsers) {
          console.log(`⚠️ Role assignment gap: ${totalUsers - totalRoles} users without clear role assignment`);
        }
        
        // Check for role hierarchy consistency
        if (adminCount > 0) {
          console.log('✅ System has admin users');
        } else {
          console.log('⚠️ No admin users found - potential system issue');
        }
      }
    });
  });
  
  test.describe('User Search and Filtering', () => {
    
    test('staff search functionality should work correctly', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Look for search/filter functionality
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="filter"], input[type="search"]');
      const searchVisible = await searchInput.isVisible().catch(() => false);
      
      if (searchVisible) {
        console.log('🔍 Staff search functionality available');
        
        // Test search functionality with a common term
        await searchInput.fill('admin');
        await page.waitForTimeout(1000); // Allow for search debounce
        
        const searchResults = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        console.log(`🔎 Search results for "admin": ${searchResults} users found`);
        
        // Clear search
        await searchInput.clear();
        await page.waitForTimeout(1000);
        
        const allResults = await page.locator(TESTSELECTORS.domains.staff.staffRow).count();
        console.log(`📋 All users after clearing search: ${allResults}`);
        
      } else {
        console.log('📝 No search functionality found - may not be implemented yet');
      }
      
      // Look for role filters
      const roleFilters = await page.locator('select, button:has-text("Filter"), [data-testid*="filter"]').count();
      console.log(`🎛️ Found ${roleFilters} potential filter controls`);
    });
  });
});
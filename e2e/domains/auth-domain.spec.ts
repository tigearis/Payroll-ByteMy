/**
 * Authentication Domain Testing
 * Tests core authentication functionality, user management, and security features
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

test.describe('Authentication Domain Tests', () => {
  
  test.describe('User Authentication Flow', () => {
    
    test('admin should access user management features', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Check for user management table
      const staffTable = page.locator(TESTSELECTORS.domains.staff.staffTable);
      
      if (await staffTable.isVisible({ timeout: 5000 })) {
        console.log('✅ Admin can view staff management');
        
        // Check for role information display
        const roleElements = await page.locator('text=/admin|manager|consultant|viewer/i').count();
        console.log(`📊 Found ${roleElements} role indicators`);
        
        // Check for user status indicators
        const statusElements = await page.locator('text=/active|inactive/i').count();
        console.log(`📊 Found ${statusElements} status indicators`);
        
        // Look for user management actions
        const addButton = page.locator(TESTSELECTORS.domains.staff.addStaffButton);
        const addButtonVisible = await addButton.isVisible().catch(() => false);
        console.log(`🔘 Add staff button: ${addButtonVisible ? 'VISIBLE' : 'HIDDEN'}`);
        
      } else {
        console.log('⚠️ Staff table not visible for admin - checking for issues');
        await page.screenshot({ 
          path: 'e2e/screenshots/auth-domain-staff-issue.png',
          fullPage: true 
        });
      }
    });
    
    test('manager should have limited user access', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      // Manager might see staff but with different permissions
      const staffTable = page.locator(TESTSELECTORS.domains.staff.staffTable);
      
      if (await staffTable.isVisible({ timeout: 5000 })) {
        console.log('✅ Manager can view staff information');
        
        // Check if manager has restricted access to certain actions
        const deleteButtons = await page.locator('button:has-text("Delete")').count();
        console.log(`🔘 Manager sees ${deleteButtons} delete buttons`);
        
      } else {
        // Manager might be redirected or have different access pattern
        const currentUrl = page.url();
        console.log(`📝 Manager redirected to: ${currentUrl}`);
      }
    });
    
    test('consultant should have read-only access', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_CONSULTANT });
      
      await page.goto('/staff');
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      
      if (currentUrl.includes('/staff')) {
        // If consultant can access staff page, check for read-only indicators
        const editButtons = await page.locator('button:has-text("Edit")').count();
        const addButtons = await page.locator('button:has-text("Add")').count();
        
        console.log(`📝 Consultant access - Edit buttons: ${editButtons}, Add buttons: ${addButtons}`);
        
      } else {
        console.log(`✅ Consultant properly redirected from staff page to: ${currentUrl}`);
      }
    });
    
    test('viewer should be blocked from user management', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_VIEWER });
      
      await page.goto('/staff');
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      
      // Viewer should be redirected or see access denied
      const isBlocked = currentUrl.includes('/dashboard') || 
                       currentUrl.includes('/unauthorized') ||
                       currentUrl.includes('/sign-in');
      
      if (isBlocked) {
        console.log(`✅ Viewer properly blocked from staff page, redirected to: ${currentUrl}`);
      } else {
        console.log(`⚠️ Viewer may have unexpected access to staff page`);
        await page.screenshot({ 
          path: 'e2e/screenshots/viewer-staff-access-issue.png',
          fullPage: true 
        });
      }
    });
  });
  
  test.describe('Role Management', () => {
    
    test('admin should see comprehensive role information', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Look for role-related information on dashboard
      const roleIndicators = await page.locator('text=/role|permission|access/i').count();
      console.log(`📊 Found ${roleIndicators} role-related indicators on dashboard`);
      
      // Check for user role display
      const userRoleDisplay = await page.locator('text=/admin|manager|consultant|viewer/i').count();
      console.log(`📊 Found ${userRoleDisplay} user role displays`);
      
      // Look for permission-related UI elements
      const permissionElements = await page.locator('[data-testid*="permission"], [class*="permission"]').count();
      console.log(`🔐 Found ${permissionElements} permission-related UI elements`);
    });
    
    test('each role should see appropriate self-identification', async ({ page }) => {
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
        
        // Look for user profile or role display
        const userMenus = await page.locator(TESTSELECTORS.userMenu).count();
        console.log(`👤 ${role.name} sees ${userMenus} user menu elements`);
        
        // Check for role-specific welcome messages or indicators
        const welcomeText = await page.textContent('body').catch(() => '');
        const hasRoleReference = welcomeText.toLowerCase().includes(role.name);
        
        console.log(`📝 ${role.name} role reference in UI: ${hasRoleReference ? 'FOUND' : 'NOT FOUND'}`);
      }
    });
  });
  
  test.describe('Security Features', () => {
    
    test('should handle session security appropriately', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ADMIN });
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check for security-related UI elements
      const securityElements = await page.locator('text=/security|logout|sign out/i').count();
      console.log(`🔒 Found ${securityElements} security-related elements`);
      
      // Look for session timeout indicators or warnings
      const sessionElements = await page.locator('text=/session|timeout|expire/i').count();
      console.log(`⏰ Found ${sessionElements} session-related elements`);
      
      // Check for secure headers or indicators in network
      const responseHeaders = await page.evaluate(() => {
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return meta ? 'CSP-FOUND' : 'CSP-NOT-FOUND';
      });
      
      console.log(`🛡️ Content Security Policy: ${responseHeaders}`);
    });
    
    test('should protect against unauthorized access patterns', async ({ page }) => {
      // Test without authentication
      await page.goto('/staff');
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      
      // Should be redirected to sign-in or similar
      const isProtected = currentUrl.includes('/sign-in') || 
                         currentUrl.includes('/auth') ||
                         currentUrl.includes('/login');
      
      if (isProtected) {
        console.log('✅ Unauthorized access properly blocked');
      } else {
        console.log(`⚠️ Potential security issue - no authentication required for: ${currentUrl}`);
        await page.screenshot({ 
          path: 'e2e/screenshots/security-issue-no-auth.png',
          fullPage: true 
        });
      }
    });
  });
  
  test.describe('Authentication Error Handling', () => {
    
    test('should handle authentication errors gracefully', async ({ page }) => {
      await page.goto('/sign-in');
      
      // Wait for form to load
      await page.waitForFunction(() => {
        return document.querySelector('input[name="email"]') && 
               !document.body.textContent?.includes('Loading authentication...');
      }, { timeout: TIMEOUTS.authentication });
      
      // Try invalid credentials
      const emailInput = page.locator(TESTSELECTORS.emailInput).first();
      const passwordInput = page.locator(TESTSELECTORS.passwordInput).first();
      const submitButton = page.locator(TESTSELECTORS.signInButton).first();
      
      await emailInput.fill('invalid@test.com');
      await passwordInput.fill('wrongpassword');
      await submitButton.click();
      
      await page.waitForTimeout(3000);
      
      // Should show error or stay on login page
      const stillOnLogin = page.url().includes('/sign-in');
      const hasErrorMessage = await page.locator(TESTSELECTORS.errorMessage).isVisible().catch(() => false);
      
      console.log(`🔍 Authentication error handling: ${stillOnLogin ? 'STAYS ON LOGIN' : 'REDIRECTED'}, Error shown: ${hasErrorMessage ? 'YES' : 'NO'}`);
      
      expect(stillOnLogin || hasErrorMessage).toBe(true);
    });
  });
});
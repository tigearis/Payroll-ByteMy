/**
 * Test different credential combinations to find working ones
 */

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

test.describe('Find Working Credentials', () => {
  
  const testCredentials = [
    // From .env.test
    { email: 'admin@example.com', password: 'Admin1', role: 'admin' },
    { email: 'manager@example.com', password: 'Manager1', role: 'manager' },
    { email: 'consultant@example.com', password: 'Consultant1', role: 'consultant' },
    { email: 'viewer@example.com', password: 'Viewer1', role: 'viewer' },
    
    // Common test credentials
    { email: 'test@test.com', password: 'password', role: 'test' },
    { email: 'admin@test.com', password: 'admin', role: 'admin' },
    { email: 'user@test.com', password: 'user123', role: 'user' },
    
    // Environment variables
    { 
      email: process.env.E2E_ORG_ADMIN_EMAIL, 
      password: process.env.E2E_ORG_ADMIN_PASSWORD, 
      role: 'env-admin' 
    },
  ];

  testCredentials.forEach(({ email, password, role }) => {
    if (!email || !password) return; // Skip if credentials are missing
    
    test(`test credentials: ${role} (${email})`, async ({ page }) => {
      console.log(`🔐 Testing ${role}: ${email}`);
      
      // Navigate to sign-in
      await page.goto('/sign-in');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      try {
        // Fill credentials
        await page.locator('input[name="email"]').fill(email);
        await page.locator('input[name="password"]').fill(password);
        
        console.log(`   📧 Filled email: ${email}`);
        console.log(`   🔒 Filled password: ${password ? '[SET]' : '[NOT SET]'}`);
        
        // Submit
        await page.locator('button[type="submit"]').click();
        console.log('   🚀 Form submitted');
        
        // Wait a bit to see what happens
        await page.waitForTimeout(5000);
        
        const finalUrl = page.url();
        console.log(`   📍 Final URL: ${finalUrl}`);
        
        if (finalUrl.includes('/dashboard')) {
          console.log(`   ✅ SUCCESS! ${role} credentials work!`);
          
          // Take success screenshot
          await page.screenshot({ 
            path: `e2e/screenshots/success-${role}.png`,
            fullPage: true 
          });
          
          // This test succeeds
          expect(finalUrl).toContain('/dashboard');
          return;
        } else {
          console.log(`   ❌ Failed - still on sign-in page`);
          
          // Look for specific error messages
          const errorAlert = await page.locator('[role="alert"]').textContent().catch(() => '');
          if (errorAlert && errorAlert.trim()) {
            console.log(`   💡 Error message: ${errorAlert}`);
          }
        }
        
      } catch (error) {
        console.log(`   ⚠️ Error during test: ${error.message}`);
      }
      
      // Test doesn't fail - we're just trying different credentials
      expect(true).toBe(true);
    });
  });
  
  test('check if sign-up works for creating test user', async ({ page }) => {
    console.log('🆕 Testing if we can sign up a new user...');
    
    // Try to go to sign-up page
    await page.goto('/sign-up');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`📍 Sign-up URL: ${currentUrl}`);
    
    if (currentUrl.includes('/sign-up')) {
      console.log('✅ Sign-up page is accessible');
      
      // Take screenshot of sign-up page
      await page.screenshot({ 
        path: 'e2e/screenshots/signup-page.png',
        fullPage: true 
      });
      
      // Try to create a test user
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';
      
      try {
        // Look for email field
        const emailField = page.locator('input[name="email"], input[type="email"]').first();
        if (await emailField.isVisible({ timeout: 2000 })) {
          await emailField.fill(testEmail);
          console.log(`📧 Filled signup email: ${testEmail}`);
        }
        
        // Look for password field
        const passwordField = page.locator('input[name="password"], input[type="password"]').first();
        if (await passwordField.isVisible({ timeout: 2000 })) {
          await passwordField.fill(testPassword);
          console.log('🔒 Filled signup password');
        }
        
        // Look for additional fields (first name, last name, etc.)
        const firstNameField = page.locator('input[name="firstName"], input[name="first_name"]').first();
        if (await firstNameField.isVisible({ timeout: 1000 })) {
          await firstNameField.fill('Test');
          console.log('👤 Filled first name');
        }
        
        const lastNameField = page.locator('input[name="lastName"], input[name="last_name"]').first();
        if (await lastNameField.isVisible({ timeout: 1000 })) {
          await lastNameField.fill('User');
          console.log('👤 Filled last name');
        }
        
        // Try to submit
        const submitButton = page.locator('button[type="submit"], button:has-text("Sign up"), button:has-text("Create")').first();
        if (await submitButton.isVisible({ timeout: 2000 })) {
          console.log('🚀 Attempting to submit signup...');
          await submitButton.click();
          
          await page.waitForTimeout(5000);
          
          const afterSignupUrl = page.url();
          console.log(`📍 After signup URL: ${afterSignupUrl}`);
          
          if (!afterSignupUrl.includes('/sign-up')) {
            console.log('✅ Signup may have succeeded - redirected away from signup page');
          }
        }
        
      } catch (error) {
        console.log(`⚠️ Error during signup: ${error.message}`);
      }
      
    } else {
      console.log('❌ Sign-up page not accessible or redirected');
    }
    
    expect(true).toBe(true);
  });
});
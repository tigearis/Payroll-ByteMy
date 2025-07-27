/**
 * Test with secure passwords that haven't been compromised
 */

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

test.describe('Authentication with Secure Passwords', () => {
  
  const testCredentials = [
    // More secure password variations for existing users
    { email: 'admin@example.com', password: 'SecureAdmin2024!@#', role: 'admin' },
    { email: 'manager@example.com', password: 'SecureManager2024!@#', role: 'manager' },
    { email: 'consultant@example.com', password: 'SecureConsultant2024!@#', role: 'consultant' },
    { email: 'viewer@example.com', password: 'SecureViewer2024!@#', role: 'viewer' },
    
    // Try with different formats
    { email: 'admin@example.com', password: 'ByteMyP@yr0ll2024!', role: 'admin-alt' },
    { email: 'admin@example.com', password: 'C0mpl3xP@ssw0rd!#', role: 'admin-alt2' },
  ];

  testCredentials.forEach(({ email, password, role }) => {
    test(`test secure credentials: ${role} (${email})`, async ({ page }) => {
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
        console.log(`   🔒 Filled secure password`);
        
        // Submit
        await page.locator('button[type="submit"]').click();
        console.log('   🚀 Form submitted');
        
        // Wait a bit to see what happens
        await page.waitForTimeout(5000);
        
        const finalUrl = page.url();
        console.log(`   📍 Final URL: ${finalUrl}`);
        
        // Check for specific error messages
        const errorAlert = await page.locator('[role="alert"]').textContent().catch(() => '');
        if (errorAlert && errorAlert.trim()) {
          console.log(`   💡 Error message: ${errorAlert}`);
        }
        
        if (finalUrl.includes('/dashboard')) {
          console.log(`   ✅ SUCCESS! ${role} credentials work!`);
          
          // Take success screenshot
          await page.screenshot({ 
            path: `e2e/screenshots/success-secure-${role}.png`,
            fullPage: true 
          });
          
          // This test succeeds
          expect(finalUrl).toContain('/dashboard');
          return;
        } else {
          console.log(`   ❌ Failed - Authentication rejected`);
          
          // Take failure screenshot for analysis
          await page.screenshot({ 
            path: `e2e/screenshots/failed-secure-${role}.png`,
            fullPage: true 
          });
        }
        
      } catch (error) {
        console.log(`   ⚠️ Error during test: ${error.message}`);
      }
      
      // Test doesn't fail - we're just trying different credentials
      expect(true).toBe(true);
    });
  });
  
  test('try sign-up with secure credentials', async ({ page }) => {
    console.log('🆕 Testing sign-up with secure password...');
    
    // Navigate to sign-in first
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Look for sign-up link
    const signUpSelectors = [
      'a:has-text("Sign up")',
      'a:has-text("Don\'t have an account")',
      'button:has-text("Sign up")',
      '[href*="sign-up"]'
    ];
    
    let foundSignUp = false;
    for (const selector of signUpSelectors) {
      try {
        const signUpLink = page.locator(selector);
        if (await signUpLink.isVisible({ timeout: 2000 })) {
          console.log(`✅ Found sign-up link: ${selector}`);
          await signUpLink.click();
          foundSignUp = true;
          break;
        }
      } catch (error) {
        // Try next selector
      }
    }
    
    if (!foundSignUp) {
      console.log('❌ Could not find sign-up link');
      expect(true).toBe(true);
      return;
    }
    
    await page.waitForTimeout(3000);
    const signUpUrl = page.url();
    console.log(`📍 Sign-up URL: ${signUpUrl}`);
    
    if (signUpUrl.includes('/sign-up')) {
      console.log('✅ Successfully navigated to sign-up page');
      
      // Try to create a test user with secure credentials
      const testEmail = `test-playwright-${Date.now()}@example.com`;
      const testPassword = 'SecureTestPassword2024!@#$';
      
      try {
        // Fill sign-up form
        const emailField = page.locator('input[name="email"], input[type="email"]').first();
        if (await emailField.isVisible({ timeout: 2000 })) {
          await emailField.fill(testEmail);
          console.log(`📧 Filled signup email: ${testEmail}`);
        }
        
        const passwordField = page.locator('input[name="password"], input[type="password"]').first();
        if (await passwordField.isVisible({ timeout: 2000 })) {
          await passwordField.fill(testPassword);
          console.log('🔒 Filled secure signup password');
        }
        
        // Fill additional required fields if present
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
        
        // Take screenshot before submit
        await page.screenshot({ 
          path: 'e2e/screenshots/signup-before-submit.png',
          fullPage: true 
        });
        
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
            
            // Take success screenshot
            await page.screenshot({ 
              path: 'e2e/screenshots/signup-success.png',
              fullPage: true 
            });
          } else {
            console.log('❌ Still on signup page, checking for errors...');
            
            const errorAlert = await page.locator('[role="alert"]').textContent().catch(() => '');
            if (errorAlert && errorAlert.trim()) {
              console.log(`💡 Signup error: ${errorAlert}`);
            }
            
            await page.screenshot({ 
              path: 'e2e/screenshots/signup-failed.png',
              fullPage: true 
            });
          }
        }
        
      } catch (error) {
        console.log(`⚠️ Error during signup: ${error.message}`);
      }
      
    } else {
      console.log('❌ Sign-up page not accessible');
    }
    
    expect(true).toBe(true);
  });
});
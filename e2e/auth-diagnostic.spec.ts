/**
 * Diagnostic Authentication Test
 * Detailed testing to understand what's happening during login
 */

import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

test.describe('Authentication Diagnostics', () => {
  
  test('diagnose authentication flow step by step', async ({ page }) => {
    console.log('🔍 AUTHENTICATION DIAGNOSTIC TEST');
    console.log('==================================');
    
    const adminEmail = process.env.E2E_ORG_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.E2E_ORG_ADMIN_PASSWORD || 'Admin1';
    
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔒 Password: ${adminPassword ? '[SET]' : '[NOT SET]'}`);
    
    // Step 1: Navigate to sign-in page
    console.log('\n📍 Step 1: Navigating to sign-in page...');
    await page.goto('/sign-in');
    await page.waitForLoadState('networkidle');
    
    const initialUrl = page.url();
    console.log(`   Current URL: ${initialUrl}`);
    
    // Step 2: Wait for page to fully load and take screenshot
    console.log('\n⏳ Step 2: Waiting for page to load...');
    await page.waitForTimeout(5000);
    
    await page.screenshot({ 
      path: 'e2e/screenshots/step1-signin-page.png',
      fullPage: true 
    });
    console.log('   Screenshot saved: step1-signin-page.png');
    
    // Step 3: Analyze page content
    console.log('\n🔍 Step 3: Analyzing page content...');
    const pageTitle = await page.title();
    const bodyText = await page.textContent('body');
    
    console.log(`   Page title: ${pageTitle}`);
    console.log(`   Body text preview: ${bodyText?.substring(0, 200)}...`);
    
    // Check for Clerk elements
    const clerkElements = await page.locator('[data-clerk]').count();
    console.log(`   Clerk elements found: ${clerkElements}`);
    
    // Step 4: Find input fields
    console.log('\n📝 Step 4: Finding input fields...');
    
    const allInputs = await page.locator('input').count();
    console.log(`   Total inputs found: ${allInputs}`);
    
    // List all input types and names
    const inputs = await page.locator('input').all();
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const visible = await input.isVisible();
      
      console.log(`   Input ${i}: type="${type}", name="${name}", placeholder="${placeholder}", visible=${visible}`);
    }
    
    // Step 5: Try to fill email
    console.log('\n📧 Step 5: Attempting to fill email...');
    
    const emailSelectors = [
      'input[name="email"]',
      'input[type="email"]', 
      'input[name="identifier"]',
      'input[placeholder*="email" i]'
    ];
    
    let emailFilled = false;
    for (const selector of emailSelectors) {
      try {
        const emailInput = page.locator(selector).first();
        if (await emailInput.isVisible({ timeout: 1000 })) {
          await emailInput.fill(adminEmail);
          emailFilled = true;
          console.log(`   ✅ Email filled using: ${selector}`);
          
          // Verify it was filled
          const filledValue = await emailInput.inputValue();
          console.log(`   📧 Filled value: ${filledValue}`);
          break;
        }
      } catch (error) {
        console.log(`   ❌ Failed with ${selector}: ${error.message}`);
      }
    }
    
    if (!emailFilled) {
      console.log('   ⚠️ Could not fill email field');
      await page.screenshot({ 
        path: 'e2e/screenshots/step5-email-fill-failed.png',
        fullPage: true 
      });
    }
    
    // Step 6: Try to fill password
    console.log('\n🔒 Step 6: Attempting to fill password...');
    
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      'input[placeholder*="password" i]'
    ];
    
    let passwordFilled = false;
    for (const selector of passwordSelectors) {
      try {
        const passwordInput = page.locator(selector).first();
        if (await passwordInput.isVisible({ timeout: 1000 })) {
          await passwordInput.fill(adminPassword);
          passwordFilled = true;
          console.log(`   ✅ Password filled using: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`   ❌ Failed with ${selector}: ${error.message}`);
      }
    }
    
    if (!passwordFilled) {
      console.log('   ⚠️ Could not fill password field');
      await page.screenshot({ 
        path: 'e2e/screenshots/step6-password-fill-failed.png',
        fullPage: true 
      });
    }
    
    // Step 7: Take screenshot before submit
    console.log('\n📸 Step 7: Taking screenshot before submit...');
    await page.screenshot({ 
      path: 'e2e/screenshots/step7-before-submit.png',
      fullPage: true 
    });
    
    // Step 8: Try to submit
    console.log('\n🚀 Step 8: Attempting to submit form...');
    
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Sign in")',
      'button:has-text("Continue")',
      'input[type="submit"]'
    ];
    
    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const submitButton = page.locator(selector).first();
        if (await submitButton.isVisible({ timeout: 1000 })) {
          console.log(`   🎯 Found submit button: ${selector}`);
          await submitButton.click();
          submitted = true;
          console.log(`   ✅ Form submitted using: ${selector}`);
          break;
        }
      } catch (error) {
        console.log(`   ❌ Failed with ${selector}: ${error.message}`);
      }
    }
    
    if (!submitted) {
      console.log('   ⚠️ Could not find or click submit button');
      
      // List all buttons
      const buttons = await page.locator('button').all();
      console.log(`   Found ${buttons.length} buttons:`);
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const text = await button.textContent();
        const type = await button.getAttribute('type');
        const visible = await button.isVisible();
        console.log(`     Button ${i}: text="${text}", type="${type}", visible=${visible}`);
      }
    }
    
    // Step 9: Wait and observe what happens
    console.log('\n⏳ Step 9: Waiting to see what happens after submit...');
    await page.waitForTimeout(5000);
    
    const afterSubmitUrl = page.url();
    console.log(`   URL after submit: ${afterSubmitUrl}`);
    
    // Step 10: Take final screenshot
    console.log('\n📸 Step 10: Taking final screenshot...');
    await page.screenshot({ 
      path: 'e2e/screenshots/step10-after-submit.png',
      fullPage: true 
    });
    
    // Step 11: Look for error messages
    console.log('\n🔍 Step 11: Looking for error messages...');
    
    const errorSelectors = [
      '.error',
      '[role="alert"]',
      '.alert-error',
      'text=error',
      'text=invalid',
      'text=incorrect'
    ];
    
    for (const selector of errorSelectors) {
      try {
        const errorElement = page.locator(selector);
        if (await errorElement.isVisible({ timeout: 1000 })) {
          const errorText = await errorElement.textContent();
          console.log(`   ⚠️ Error found with ${selector}: ${errorText}`);
        }
      } catch (error) {
        // No error with this selector
      }
    }
    
    // Final summary
    console.log('\n📋 DIAGNOSTIC SUMMARY:');
    console.log(`   Email filled: ${emailFilled}`);
    console.log(`   Password filled: ${passwordFilled}`);
    console.log(`   Form submitted: ${submitted}`);
    console.log(`   Final URL: ${afterSubmitUrl}`);
    console.log(`   Authentication ${afterSubmitUrl.includes('/dashboard') ? 'SUCCEEDED' : 'FAILED'}`);
    
    // This test is diagnostic, so we won't fail it
    expect(true).toBe(true);
  });
});
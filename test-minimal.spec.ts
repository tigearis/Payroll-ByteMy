// Minimal test with no dependencies
import { test, expect } from '@playwright/test';

test('basic functionality check', async ({ page }) => {
  console.log('🧪 Running minimal test...');
  
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(2000);
  
  const title = await page.title();
  console.log(`✅ Page title: ${title}`);
  
  expect(title).toBeTruthy();
});

test('sign-in page accessibility', async ({ page }) => {
  console.log('🔐 Testing sign-in page...');
  
  await page.goto('http://localhost:3000/sign-in');
  await page.waitForTimeout(3000);
  
  const url = page.url();
  console.log(`✅ Sign-in URL: ${url}`);
  
  expect(url).toContain('/sign-in');
});
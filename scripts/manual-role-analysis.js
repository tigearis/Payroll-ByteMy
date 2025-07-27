#!/usr/bin/env node

/**
 * Manual Role Analysis Script
 * Tests each role's access patterns individually using Playwright
 */

import { chromium } from '@playwright/test';

const ROLES = [
  { name: 'developer', authFile: 'playwright/.auth/developer.json', level: 5, expected: 'Full System Access' },
  { name: 'admin', authFile: 'playwright/.auth/admin.json', level: 4, expected: 'Business Operations' },
  { name: 'manager', authFile: 'playwright/.auth/manager.json', level: 3, expected: 'Team Management' },
  { name: 'consultant', authFile: 'playwright/.auth/consultant.json', level: 2, expected: 'Operational Tasks' },
  { name: 'viewer', authFile: 'playwright/.auth/viewer.json', level: 1, expected: 'Read-Only Access' }
];

const TEST_PAGES = [
  { path: '/dashboard', name: 'Dashboard', minLevel: 1 },
  { path: '/staff', name: 'Staff Management', minLevel: 3 },
  { path: '/payrolls', name: 'Payroll Operations', minLevel: 2 },
  { path: '/clients', name: 'Client Management', minLevel: 2 },
  { path: '/billing', name: 'Billing & Finance', minLevel: 3 },
  { path: '/security', name: 'Security Settings', minLevel: 4 },
  { path: '/developer', name: 'Developer Tools', minLevel: 5 }
];

async function analyzeRole(roleConfig) {
  console.log(`\n🔍 ANALYZING ${roleConfig.name.toUpperCase()} ROLE (Level ${roleConfig.level})`);
  console.log('═'.repeat(60));
  console.log(`Expected Access: ${roleConfig.expected}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    storageState: roleConfig.authFile,
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  const results = {
    role: roleConfig.name,
    level: roleConfig.level,
    accessible: [],
    blocked: [],
    errors: []
  };
  
  try {
    // Test each page
    for (const testPage of TEST_PAGES) {
      try {
        console.log(`   Testing ${testPage.name}...`);
        
        await page.goto(`http://localhost:3000${testPage.path}`, { 
          timeout: 15000,
          waitUntil: 'networkidle'
        });
        
        await page.waitForTimeout(2000); // Allow page to settle
        
        const currentUrl = page.url();
        const hasAccess = currentUrl.includes(testPage.path) && 
                         !currentUrl.includes('/sign-in') && 
                         !currentUrl.includes('/unauthorized');
        
        const shouldHaveAccess = roleConfig.level >= testPage.minLevel;
        
        if (hasAccess) {
          results.accessible.push(testPage.name);
          console.log(`      ✅ ${hasAccess ? 'ACCESSIBLE' : 'BLOCKED'} (expected: ${shouldHaveAccess ? 'accessible' : 'blocked'})`);
        } else {
          results.blocked.push(testPage.name);
          console.log(`      ❌ ${hasAccess ? 'ACCESSIBLE' : 'BLOCKED'} (expected: ${shouldHaveAccess ? 'accessible' : 'blocked'})`);
        }
        
        // Check for permission verification on accessible pages
        if (hasAccess) {
          const actionButtons = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")').count();
          const editButtons = await page.locator('button:has-text("Edit"), a:has-text("Edit")').count();
          const deleteButtons = await page.locator('button:has-text("Delete"), button:has-text("Remove")').count();
          
          console.log(`         UI Elements: ${actionButtons} create, ${editButtons} edit, ${deleteButtons} delete buttons`);
        }
        
      } catch (error) {
        results.errors.push(`${testPage.name}: ${error.message}`);
        console.log(`      ⚠️  ERROR: ${error.message.slice(0, 50)}...`);
      }
    }
    
    // Test dashboard data visibility
    try {
      await page.goto('http://localhost:3000/dashboard', { 
        timeout: 15000,
        waitUntil: 'networkidle'
      });
      
      const dataTypes = [
        { selector: 'text=/\\d+\\s*users?/i', name: 'User Count' },
        { selector: 'text=/\\d+\\s*clients?/i', name: 'Client Count' },
        { selector: 'text=/\\d+\\s*payrolls?/i', name: 'Payroll Count' },
        { selector: 'text=/\\$\\d+/i', name: 'Financial Data' }
      ];
      
      console.log('\n   📊 Dashboard Data Visibility:');
      for (const dataType of dataTypes) {
        try {
          const count = await page.locator(dataType.selector).count();
          console.log(`      ${dataType.name}: ${count > 0 ? '✅ Visible' : '❌ Hidden'}`);
        } catch (error) {
          console.log(`      ${dataType.name}: ⚠️ Could not determine`);
        }
      }
      
    } catch (error) {
      console.log(`   ⚠️ Could not analyze dashboard: ${error.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Role analysis failed: ${error.message}`);
    results.errors.push(`General error: ${error.message}`);
  } finally {
    await context.close();
    await browser.close();
  }
  
  // Summary
  console.log('\n📋 ROLE ANALYSIS SUMMARY:');
  console.log(`   Accessible pages: ${results.accessible.length} (${results.accessible.join(', ')})`);
  console.log(`   Blocked pages: ${results.blocked.length} (${results.blocked.join(', ')})`);
  if (results.errors.length > 0) {
    console.log(`   Errors encountered: ${results.errors.length}`);
  }
  
  return results;
}

async function runComprehensiveAnalysis() {
  console.log('🚀 Starting Comprehensive Role-Based Access Analysis');
  console.log('═'.repeat(80));
  
  const allResults = [];
  
  for (const role of ROLES) {
    try {
      const result = await analyzeRole(role);
      allResults.push(result);
      
      // Add delay between tests to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.log(`❌ Failed to analyze ${role.name}: ${error.message}`);
    }
  }
  
  // Generate comparison matrix
  console.log('\n📊 CROSS-ROLE ACCESS COMPARISON MATRIX');
  console.log('═'.repeat(80));
  
  const headers = ['ROLE', ...TESTPAGES.map(p => p.name.slice(0, 10))];
  console.log(headers.map(h => h.padEnd(12)).join(''));
  console.log('─'.repeat(80));
  
  allResults.forEach(result => {
    const accessPattern = TESTPAGES.map(page => {
      const hasAccess = result.accessible.includes(page.name);
      return (hasAccess ? '✅' : '❌').padEnd(12);
    });
    
    console.log([result.role.padEnd(12), ...accessPattern].join(''));
  });
  
  console.log('═'.repeat(80));
  console.log('✅ Comprehensive role analysis completed!');
  
  return allResults;
}

// Run the analysis
runComprehensiveAnalysis().catch(console.error);
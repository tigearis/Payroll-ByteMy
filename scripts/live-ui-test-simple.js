/**
 * Simple Live UI Test Script
 * Tests the running development server to identify actual data display issues
 */

import fetch from 'node-fetch';
import { config } from 'dotenv';
config({ path: '.env.test' });

const BASE_URL = 'http://localhost:3000';

// Test users with validated credentials
const TEST_USERS = {
  admin: { email: 'admin@example.com', password: 'Admin1', role: 'org_admin' },
  manager: { email: 'manager@example.com', password: 'Manager1', role: 'manager' },
  consultant: { email: 'consultant@example.com', password: 'Consultant1', role: 'consultant' },
  viewer: { email: 'viewer@example.com', password: 'Viewer1', role: 'viewer' }
};

// Key pages to test
const PAGES_TO_TEST = [
  { path: '/', name: 'Home Page', requiresAuth: false },
  { path: '/sign-in', name: 'Sign In', requiresAuth: false },
  { path: '/dashboard', name: 'Dashboard', requiresAuth: true },
  { path: '/staff', name: 'Staff Management', requiresAuth: true },
  { path: '/payrolls', name: 'Payroll Management', requiresAuth: true },
  { path: '/clients', name: 'Client Management', requiresAuth: true },
  { path: '/billing', name: 'Billing System', requiresAuth: true },
  { path: '/work-schedule', name: 'Work Schedule', requiresAuth: true }
];

function log(message, type = 'info') {
  const prefix = {
    'info': '🔍',
    'success': '✅', 
    'error': '❌',
    'warning': '⚠️',
    'critical': '🚨',
    'server': '🖥️',
    'auth': '🔐'
  }[type] || 'ℹ️';
  
  console.log(`${prefix} ${message}`);
}

async function testServerStatus() {
  try {
    log('Testing development server status...', 'server');
    
    const response = await fetch(BASE_URL, {
      method: 'GET',
      timeout: 5000
    });

    if (response.ok) {
      log('✅ Development server is running and responsive', 'success');
      return true;
    } else {
      log(`❌ Server responding with status: ${response.status}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ Cannot reach development server: ${error.message}`, 'critical');
    return false;
  }
}

async function testPageAccess(page) {
  try {
    const response = await fetch(`${BASE_URL}${page.path}`, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UITest/1.0)'
      }
    });

    const content = await response.text();
    
    const result = {
      path: page.path,
      name: page.name,
      status: response.status,
      accessible: response.ok,
      isRedirect: response.status >= 300 && response.status < 400,
      redirectLocation: response.headers.get('location'),
      contentLength: content.length,
      issues: []
    };

    // Check for errors in content
    const errorPatterns = [
      'Error:', 'TypeError', 'ReferenceError', 'Cannot read property',
      'undefined', 'null', '404', '500'
    ];

    errorPatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        result.issues.push(`Contains: ${pattern}`);
      }
    });

    return result;

  } catch (error) {
    return {
      path: page.path,
      name: page.name,
      accessible: false,
      error: error.message
    };
  }
}

async function testAuthenticationFlow() {
  log('\n🔐 Testing authentication flow...', 'auth');
  
  try {
    const signInResponse = await fetch(`${BASE_URL}/sign-in`);
    const signInContent = await signInResponse.text();
    
    const hasEmailField = signInContent.includes('email') || signInContent.includes('Email');
    const hasPasswordField = signInContent.includes('password') || signInContent.includes('Password');
    const hasSignInButton = signInContent.includes('sign in') || signInContent.includes('Sign In');
    const clerkIntegration = signInContent.includes('clerk') || signInContent.includes('Clerk');

    log(`   Sign-in page accessible: ${signInResponse.ok ? '✅' : '❌'}`);
    log(`   Email field present: ${hasEmailField ? '✅' : '❌'}`);
    log(`   Password field present: ${hasPasswordField ? '✅' : '❌'}`);
    log(`   Sign-in button present: ${hasSignInButton ? '✅' : '❌'}`);
    log(`   Clerk integration detected: ${clerkIntegration ? '✅' : '⚠️'}`);

    return {
      signInPageAccessible: signInResponse.ok,
      hasEmailField,
      hasPasswordField,
      hasSignInButton,
      clerkIntegration
    };

  } catch (error) {
    log(`❌ Error testing authentication: ${error.message}`, 'error');
    return { error: error.message };
  }
}

async function runLiveUITest() {
  log('🚀 Starting Live UI Test (Development Server)', 'info');
  log(`Target: ${BASE_URL}`, 'info');
  
  // Test server status
  const serverRunning = await testServerStatus();
  if (!serverRunning) {
    log('🚨 Cannot continue - development server not responding', 'critical');
    return;
  }

  // Test public pages
  log('\n🌐 Testing public pages...', 'info');
  const publicPages = PAGESTO_TEST.filter(page => !page.requiresAuth);
  
  for (const page of publicPages) {
    const result = await testPageAccess(page);
    
    if (result.accessible) {
      log(`✅ ${page.name}: Accessible (${result.contentLength} chars)`, 'success');
    } else if (result.error) {
      log(`❌ ${page.name}: Error - ${result.error}`, 'error');
    } else {
      log(`❌ ${page.name}: Status ${result.status}`, 'error');
    }

    if (result.issues && result.issues.length > 0) {
      log(`   ⚠️ Issues found: ${result.issues.join(', ')}`, 'warning');
    }
  }

  // Test protected pages (should redirect or require auth)
  log('\n🔐 Testing protected pages (without authentication)...', 'auth');
  const protectedPages = PAGESTO_TEST.filter(page => page.requiresAuth);
  
  for (const page of protectedPages) {
    const result = await testPageAccess(page);
    
    if (result.isRedirect) {
      const redirectTo = result.redirectLocation || 'unknown';
      if (redirectTo.includes('/sign-in') || redirectTo.includes('/auth')) {
        log(`✅ ${page.name}: Properly redirects to authentication`, 'success');
      } else {
        log(`⚠️ ${page.name}: Redirects to ${redirectTo} (expected auth)`, 'warning');
      }
    } else if (result.status === 401) {
      log(`✅ ${page.name}: Returns 401 Unauthorized`, 'success');
    } else if (result.accessible) {
      log(`🚨 ${page.name}: Accessible without authentication!`, 'critical');
    } else {
      log(`❓ ${page.name}: Status ${result.status}`, 'warning');
    }

    if (result.issues && result.issues.length > 0) {
      log(`   ⚠️ Issues found: ${result.issues.join(', ')}`, 'warning');
    }
  }

  // Test authentication flow
  await testAuthenticationFlow();

  // Manual testing instructions
  log('\n📋 MANUAL TESTING INSTRUCTIONS', 'info');
  log('================================================================================');
  
  log('\n🎯 Next Steps - Manual UI Data Testing:');
  log('   1. Open browser: http://localhost:3000');
  log('   2. Sign in with test credentials:');
  
  Object.entries(TEST_USERS).forEach(([key, user]) => {
    log(`      • ${key}: ${user.email} / ${user.password} (${user.role})`);
  });
  
  log('\n   3. For each user role, navigate to these pages and check:');
  log('      • Dashboard (/dashboard) - Look for user counts, summaries, recent activity');
  log('      • Staff (/staff) - Check employee list, role assignments, status');
  log('      • Payrolls (/payrolls) - Verify payroll runs, calculations, schedules');
  log('      • Clients (/clients) - Confirm client list, contact info, billing status');
  log('      • Billing (/billing) - Review invoice data, payment status, rates');
  log('      • Work Schedule (/work-schedule) - Examine schedules, capacity, skills');

  log('\n   4. Look for these specific data display issues:');
  log('      • Empty tables or lists that should have data');
  log('      • Loading spinners that never resolve');
  log('      • "No data" messages when data should exist');
  log('      • Undefined/null values displayed in UI');
  log('      • Missing counts or summary statistics');
  log('      • Broken charts or data visualizations');

  log('\n   5. Check browser developer tools:');
  log('      • Network tab: Look for failed GraphQL requests (status 400/500)');
  log('      • Console tab: Check for JavaScript errors or warnings');
  log('      • React DevTools: Inspect component state and props');

  log('\n📊 Expected Data (from database):');
  log('   • 7 total users (including your test users)');
  log('   • Users have proper role assignments');
  log('   • Database has users, clients, payrolls tables populated');

  log('\n🔍 Common Issues to Look For:');
  log('   • GraphQL queries returning empty results');
  log('   • Permission-based filtering showing no data');
  log('   • Component state not updating after API calls');
  log('   • Pagination or filtering breaking data display');
  log('   • Date/time formatting issues');
  log('   • Missing error handling for failed queries');

  log('\n✅ Test completed! Ready for manual investigation of data display issues.');
}

// Run the test
runLiveUITest().catch(console.error);
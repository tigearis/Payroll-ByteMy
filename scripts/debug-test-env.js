// scripts/debug-test-env.js
// Debug script to check test environment variables

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

console.log('🔍 Debug: Test Environment Variables');
console.log('=====================================');

const testVars = [
  'E2E_DEVELOPER_EMAIL',
  'E2E_DEVELOPER_PASSWORD',
  'E2E_ORG_ADMIN_EMAIL', 
  'E2E_ORG_ADMIN_PASSWORD',
  'E2E_MANAGER_EMAIL',
  'E2E_MANAGER_PASSWORD',
  'E2E_CONSULTANT_EMAIL',
  'E2E_CONSULTANT_PASSWORD',
  'E2E_VIEWER_EMAIL',
  'E2E_VIEWER_PASSWORD',
  'E2E_TEST_EMAIL',
  'E2E_TEST_PASSWORD',
];

for (const varName of testVars) {
  const value = process.env[varName];
  if (varName.includes('PASSWORD')) {
    console.log(`${varName}: ${value ? '***' + value.slice(-4) : 'NOT SET'}`);
  } else {
    console.log(`${varName}: ${value || 'NOT SET'}`);
  }
}

console.log('\n🔍 Testing password values that would be used:');
const TEST_USERS = {
  developer: {
    email: process.env.E2E_DEVELOPER_EMAIL || 'developer@test.payroll.com',
    password: process.env.E2E_DEVELOPER_PASSWORD || 'DevSecure2024!@#$',
  },
  org_admin: {
    email: process.env.E2E_ORG_ADMIN_EMAIL || 'orgadmin@test.payroll.com', 
    password: process.env.E2E_ORG_ADMIN_PASSWORD || 'OrgAdmin2024!@#$',
  },
};

console.log('Developer:', TEST_USERS.developer.email, '-> Password ending:', TEST_USERS.developer.password.slice(-4));
console.log('Org Admin:', TEST_USERS.org_admin.email, '-> Password ending:', TEST_USERS.org_admin.password.slice(-4));
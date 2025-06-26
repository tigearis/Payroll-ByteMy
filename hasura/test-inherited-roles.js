#!/usr/bin/env node

/**
 * Inherited Roles Testing Script
 * 
 * This script tests the inherited roles hierarchy across all tables to ensure:
 * 1. Role inheritance is working correctly
 * 2. Higher roles have access to everything lower roles can access
 * 3. Permission consistency across the hierarchy
 */

import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuration
const HASURA_ENDPOINT = process.env.HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql';
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// Test roles in hierarchy order (lowest to highest)
const ROLES = ['viewer', 'consultant', 'manager', 'org_admin', 'developer'];

// Test queries for different table types
const TEST_QUERIES = {
  // Basic user data
  users: `
    query TestUsers {
      users(limit: 1) {
        id
        name
        email
        role
        isStaff
        managerId
        createdAt
        updatedAt
      }
    }
  `,
  
  // Client data
  clients: `
    query TestClients {
      clients(limit: 1) {
        id
        name
        status
        createdAt
        managerUserId
      }
    }
  `,
  
  // Payroll data
  payrolls: `
    query TestPayrolls {
      payrolls(limit: 1) {
        id
        status
        clientId
        managerUserId
        primaryConsultantUserId
        createdAt
      }
    }
  `,
  
  // Audit data (sensitive)
  authEvents: `
    query TestAuthEvents {
      authEvents(limit: 1) {
        id
        eventType
        userId
        success
        eventTime
      }
    }
  `,
  
  // Permission data (admin-level)
  permissionOverrides: `
    query TestPermissionOverrides {
      permissionOverrides(limit: 1) {
        id
        userId
        role
        resource
        operation
        granted
        reason
        createdAt
      }
    }
  `,
  
  // Billing data
  billingItems: `
    query TestBillingItems {
      billingItems(limit: 1) {
        id
        amount
        description
        clientId
        createdAt
      }
    }
  `
};

// Make GraphQL request
function makeGraphQLRequest(query, role) {
  const url = new URL(HASURA_ENDPOINT);
  const isHttps = url.protocol === 'https:';
  const client = isHttps ? https : http;
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Hasura-Role': role
  };
  
  if (ADMIN_SECRET) {
    headers['X-Hasura-Admin-Secret'] = ADMIN_SECRET;
  }
  
  const data = JSON.stringify({ query });
  
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      ...headers,
      'Content-Length': Buffer.byteLength(data)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Test a single query with a role
async function testQueryWithRole(queryName, query, role) {
  try {
    const result = await makeGraphQLRequest(query, role);
    
    if (result.errors) {
      return {
        role,
        queryName,
        success: false,
        error: result.errors[0].message,
        hasData: false,
        fieldCount: 0
      };
    }
    
    const data = result.data;
    const tableName = Object.keys(data)[0];
    const records = data[tableName];
    const hasData = Array.isArray(records) && records.length > 0;
    const fieldCount = hasData ? Object.keys(records[0]).length : 0;
    
    return {
      role,
      queryName,
      success: true,
      hasData,
      fieldCount,
      sampleData: hasData ? records[0] : null
    };
  } catch (error) {
    return {
      role,
      queryName,
      success: false,
      error: error.message,
      hasData: false,
      fieldCount: 0
    };
  }
}

// Test all queries for all roles
async function runInheritanceTests() {
  console.log('🧪 Testing Inherited Roles Hierarchy...\n');
  
  const results = {};
  
  // Test each query with each role
  for (const [queryName, query] of Object.entries(TEST_QUERIES)) {
    console.log(`📊 Testing ${queryName} table...`);
    results[queryName] = {};
    
    for (const role of ROLES) {
      const result = await testQueryWithRole(queryName, query, role);
      results[queryName][role] = result;
      
      if (result.success) {
        console.log(`  ✅ ${role}: ${result.fieldCount} fields, hasData: ${result.hasData}`);
      } else {
        console.log(`  ❌ ${role}: ${result.error}`);
      }
    }
    console.log('');
  }
  
  return results;
}

// Analyze inheritance patterns
function analyzeInheritance(results) {
  console.log('🔍 Analyzing Inheritance Patterns...\n');
  
  const analysis = {};
  
  for (const [queryName, roleResults] of Object.entries(results)) {
    console.log(`📋 ${queryName} Analysis:`);
    analysis[queryName] = {};
    
    // Check field count progression (should increase or stay same up the hierarchy)
    const fieldCounts = ROLES.map(role => ({
      role,
      count: roleResults[role].fieldCount,
      success: roleResults[role].success
    }));
    
    console.log('  Field Access Progression:');
    for (let i = 0; i < fieldCounts.length; i++) {
      const current = fieldCounts[i];
      const symbol = current.success ? '✅' : '❌';
      console.log(`    ${symbol} ${current.role}: ${current.count} fields`);
      
      // Check inheritance rule: higher roles should have >= fields than lower roles
      if (i > 0) {
        const previous = fieldCounts[i - 1];
        if (current.success && previous.success && current.count < previous.count) {
          console.log(`    ⚠️  INHERITANCE ISSUE: ${current.role} has fewer fields than ${previous.role}`);
          analysis[queryName].hasIssue = true;
        }
      }
    }
    
    // Check expected inheritance patterns
    const expectedPatterns = {
      'org_admin should access everything manager can': 
        roleResults.org_admin.fieldCount >= roleResults.manager.fieldCount,
      'manager should access everything consultant can': 
        roleResults.manager.fieldCount >= roleResults.consultant.fieldCount,
      'consultant should access everything viewer can': 
        roleResults.consultant.fieldCount >= roleResults.viewer.fieldCount
    };
    
    console.log('  Inheritance Validation:');
    for (const [check, passes] of Object.entries(expectedPatterns)) {
      console.log(`    ${passes ? '✅' : '❌'} ${check}`);
    }
    
    console.log('');
  }
  
  return analysis;
}

// Generate summary report
function generateSummary(results, analysis) {
  console.log('📊 INHERITED ROLES TEST SUMMARY\n');
  console.log('=' .repeat(50));
  
  let totalTests = 0;
  let passedTests = 0;
  let inheritanceIssues = 0;
  
  for (const [queryName, roleResults] of Object.entries(results)) {
    for (const role of ROLES) {
      totalTests++;
      if (roleResults[role].success) {
        passedTests++;
      }
    }
    
    if (analysis[queryName]?.hasIssue) {
      inheritanceIssues++;
    }
  }
  
  console.log(`📈 Overall Results:`);
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`);
  console.log(`   Failed: ${totalTests - passedTests}`);
  console.log(`   Inheritance Issues: ${inheritanceIssues}\n`);
  
  // Role-specific summary
  console.log(`🎯 Role Performance:`);
  for (const role of ROLES) {
    const roleTests = Object.values(results).map(r => r[role].success);
    const rolePassed = roleTests.filter(Boolean).length;
    const roleTotal = roleTests.length;
    console.log(`   ${role}: ${rolePassed}/${roleTotal} (${Math.round(rolePassed/roleTotal*100)}%)`);
  }
  
  console.log('\n🎉 Test Complete!');
  
  if (inheritanceIssues === 0 && passedTests === totalTests) {
    console.log('✅ All inherited roles are working correctly!');
  } else if (inheritanceIssues === 0) {
    console.log('⚠️  Some permissions are restricted, but inheritance is working correctly.');
  } else {
    console.log('❌ Found inheritance issues that need attention.');
  }
}

// Main execution
async function main() {
  try {
    if (!ADMIN_SECRET) {
      console.log('⚠️  HASURA_GRAPHQL_ADMIN_SECRET not set. Some tests may fail.');
      console.log('   Set the environment variable or use the script with admin access.\n');
    }
    
    const results = await runInheritanceTests();
    const analysis = analyzeInheritance(results);
    generateSummary(results, analysis);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
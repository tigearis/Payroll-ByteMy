#!/usr/bin/env node

/**
 * Simple GraphQL Connectivity Test
 * 
 * Tests basic connectivity to Hasura and validates a few key operations
 */

import fetch from 'cross-fetch';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || "https://hasura.bytemy.com.au/v1/graphql";
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || "3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=";

console.log('🔍 Testing GraphQL Connectivity...\n');

// Test basic connectivity
async function testConnectivity() {
  console.log('📡 Testing Hasura connectivity...');
  console.log(`Endpoint: ${HASURA_URL}`);
  
  try {
    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': ADMIN_SECRET
      },
      body: JSON.stringify({
        query: `
          query TestConnection {
            __schema {
              types {
                name
              }
            }
          }
        `
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL Errors: ${result.errors.map(e => e.message).join(', ')}`);
    }

    const typeCount = result.data?.__schema?.types?.length || 0;
    console.log(`✅ Connection successful! Found ${typeCount} schema types.`);
    return true;
    
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    return false;
  }
}

// Test a simple query
async function testSimpleQuery() {
  console.log('\n📊 Testing simple query...');
  
  try {
    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': ADMIN_SECRET
      },
      body: JSON.stringify({
        query: `
          query TestSimpleQuery {
            users(limit: 1) {
              id
              name
              email
              role
            }
          }
        `
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log(`⚠️  Query had errors: ${result.errors.map(e => e.message).join(', ')}`);
      return false;
    }

    const userCount = result.data?.users?.length || 0;
    console.log(`✅ Simple query successful! Found ${userCount} users.`);
    
    if (userCount > 0) {
      const user = result.data.users[0];
      console.log(`   Sample user: ${user.name} (${user.role})`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`❌ Simple query failed: ${error.message}`);
    return false;
  }
}

// Test domain tables
async function testDomainTables() {
  console.log('\n📋 Testing domain tables...');
  
  const domainTables = [
    { table: 'users', description: 'User management' },
    { table: 'clients', description: 'Client management' },
    { table: 'payrolls', description: 'Payroll operations' },
    { table: 'audit_log', description: 'Audit logging' }
  ];
  
  let successCount = 0;
  
  for (const { table, description } of domainTables) {
    try {
      const response = await fetch(HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({
          query: `
            query TestTable {
              ${table}_aggregate {
                aggregate {
                  count
                }
              }
            }
          `
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        console.log(`❌ ${table}: ${result.errors.map(e => e.message).join(', ')}`);
      } else {
        const count = result.data?.[`${table}_aggregate`]?.aggregate?.count || 0;
        console.log(`✅ ${table}: ${count} records (${description})`);
        successCount++;
      }
      
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
  
  console.log(`✅ ${successCount}/${domainTables.length} domain tables accessible`);
  return successCount > 0;
}

// Test GraphQL operation parsing
async function testOperationParsing() {
  console.log('\n🔍 Testing GraphQL operation parsing...');
  
  try {
    // Test parsing a sample operation file
    const userQueriesPath = join(__dirname, 'domains/users/graphql/queries.graphql');
    const content = readFileSync(userQueriesPath, 'utf8');
    
    // Count operations
    const queryCount = (content.match(/query\s+\w+/g) || []).length;
    const fragmentCount = (content.match(/fragment\s+\w+/g) || []).length;
    
    console.log(`✅ Parsed users/queries.graphql:`);
    console.log(`   ${queryCount} queries, ${fragmentCount} fragments`);
    
    // Check for specific operations
    const hasGetUsers = content.includes('GetUsers');
    const hasGetStaff = content.includes('GetStaff');
    
    console.log(`   Key operations: GetUsers=${hasGetUsers}, GetStaff=${hasGetStaff}`);
    
    return true;
    
  } catch (error) {
    console.log(`❌ Operation parsing failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  const tests = [
    { name: 'Connectivity', test: testConnectivity },
    { name: 'Simple Query', test: testSimpleQuery },
    { name: 'Domain Tables', test: testDomainTables },
    { name: 'Operation Parsing', test: testOperationParsing }
  ];
  
  let passedTests = 0;
  
  for (const { name, test } of tests) {
    try {
      const result = await test();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      console.log(`❌ ${name} test crashed: ${error.message}`);
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Passed: ${passedTests}/${tests.length} tests`);
  console.log(`📈 Success Rate: ${((passedTests / tests.length) * 100).toFixed(1)}%`);
  
  if (passedTests === tests.length) {
    console.log('\n🎉 All tests passed! Your GraphQL setup is ready for comprehensive testing.');
    console.log('\n🚀 Ready to run:');
    console.log('   • pnpm test:graphql:operations    - Test operation discovery');
    console.log('   • pnpm test:graphql:permissions   - Test role-based access');
    console.log('   • pnpm test:graphql:comprehensive - Full test suite');
  } else {
    console.log('\n⚠️  Some tests failed. Check configuration and connectivity.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});
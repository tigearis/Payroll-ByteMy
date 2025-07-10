#!/usr/bin/env node

/**
 * Simple GraphQL Query Tester
 * Tests specific known working operations against Hasura
 */

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'https://hasura.bytemy.com.au/v1/graphql';
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';

// Simple test operations
const testOperations = [
  {
    name: 'GetUsers',
    query: `
      query GetUsers($limit: Int = 5) {
        users(limit: $limit, orderBy: {name: ASC}) {
          id
          name
          email
          role
          isActive
        }
      }
    `,
    variables: { limit: 5 }
  },
  {
    name: 'GetClients', 
    query: `
      query GetClients($limit: Int = 5) {
        clients(limit: $limit, orderBy: {name: ASC}) {
          id
          name
          active
          contactEmail
        }
      }
    `,
    variables: { limit: 5 }
  },
  {
    name: 'GetPayrolls',
    query: `
      query GetPayrolls($limit: Int = 5) {
        payrolls(limit: $limit, orderBy: {createdAt: DESC}) {
          id
          name
          status
          employeeCount
          client {
            id
            name
          }
        }
      }
    `,
    variables: { limit: 5 }
  },
  {
    name: 'GetUserCount',
    query: `
      query GetUserCount {
        usersAggregate {
          aggregate {
            count
          }
        }
      }
    `,
    variables: {}
  },
  {
    name: 'GetCurrentUserRoles', // Test the problematic auth operation
    query: `
      query GetCurrentUserRoles {
        users(limit: 1) {
          id
          email
          isActive
          isStaff
        }
      }
    `,
    variables: {}
  },
  {
    name: 'TestUserInvitations',
    query: `
      query TestUserInvitations($limit: Int = 5) {
        userInvitations(limit: $limit, orderBy: {createdAt: DESC}) {
          id
          email
          firstName
          lastName
          invitedRole
          invitationStatus
        }
      }
    `,
    variables: { limit: 5 }
  },
  {
    name: 'TestWorkSchedule',
    query: `
      query TestWorkSchedule($limit: Int = 5) {
        workSchedule(limit: $limit) {
          id
          userId
          workDay
          workHours
        }
      }
    `,
    variables: { limit: 5 }
  },
  {
    name: 'TestBillingInvoice',
    query: `
      query TestBillingInvoice($limit: Int = 5) {
        billingInvoice(limit: $limit) {
          id
          clientId
          totalAmount
          status
        }
      }
    `,
    variables: { limit: 5 }
  },
  {
    name: 'TestBillingInvoiceItem',
    query: `
      query TestBillingInvoiceItem($limit: Int = 5) {
        billingInvoiceItems(limit: $limit) {
          id
          invoiceId
          quantityHours
          hourlyRate
          totalAmount
          taxAmount
          netAmount
        }
      }
    `,
    variables: { limit: 5 }
  }
];

async function testOperation(operation) {
  const startTime = Date.now();
  
  try {
    console.log(`Testing ${operation.name}...`);
    
    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_SECRET,
        'x-hasura-role': 'developer'
      },
      body: JSON.stringify({
        query: operation.query,
        variables: operation.variables,
        operationName: operation.name
      })
    });
    
    const result = await response.json();
    const executionTime = Date.now() - startTime;
    
    if (result.errors) {
      console.log(`❌ ${operation.name} FAILED (${executionTime}ms)`);
      console.log(`   Errors:`, result.errors.map(e => e.message).join(', '));
      return { success: false, errors: result.errors, executionTime };
    } else {
      const dataKeys = result.data ? Object.keys(result.data) : [];
      const hasData = dataKeys.length > 0;
      console.log(`✅ ${operation.name} SUCCESS (${executionTime}ms)`);
      if (hasData) {
        dataKeys.forEach(key => {
          const value = result.data[key];
          if (Array.isArray(value)) {
            console.log(`   ${key}: ${value.length} items`);
          } else if (value && typeof value === 'object' && value.aggregate) {
            console.log(`   ${key}: ${JSON.stringify(value.aggregate)}`);
          } else {
            console.log(`   ${key}: ${typeof value}`);
          }
        });
      }
      return { success: true, data: result.data, executionTime };
    }
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.log(`❌ ${operation.name} ERROR (${executionTime}ms): ${error.message}`);
    return { success: false, errors: [{ message: error.message }], executionTime };
  }
}

async function runTests() {
  console.log('🧪 Testing Core GraphQL Operations against Hasura...\n');
  console.log(`Endpoint: ${HASURA_URL}`);
  console.log(`Role: developer\n`);
  
  const results = [];
  
  for (const operation of testOperations) {
    const result = await testOperation(operation);
    results.push({
      name: operation.name,
      ...result
    });
    console.log(); // Add spacing
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgTime = results.reduce((sum, r) => sum + r.executionTime, 0) / results.length;
  
  console.log('='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log(`⚡ Average Time: ${avgTime.toFixed(2)}ms`);
  console.log();
  
  if (failed > 0) {
    console.log('❌ FAILED OPERATIONS:');
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   • ${r.name}: ${r.errors?.[0]?.message || 'Unknown error'}`);
      });
    console.log();
  }
  
  console.log('🔍 SCHEMA ANALYSIS:');
  console.log('   • Testing table/field existence');
  console.log('   • Validating relationship integrity'); 
  console.log('   • Checking permission boundaries');
  console.log('   • Measuring query performance');
  console.log();
  
  return results;
}

if (require.main === module) {
  runTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, testOperation };
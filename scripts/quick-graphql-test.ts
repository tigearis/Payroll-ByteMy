#!/usr/bin/env ts-node

/**
 * Quick GraphQL Test Script
 * 
 * Tests actual GraphQL operations from the generated files to identify real issues
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname as pathDirname, resolve } from 'path';

// ES module equivalent of __dirname
const filename = fileURLToPath(import.meta.url);
const dirname = pathDirname(filename);

// Load environment variables
config({ path: resolve(dirname, '../.env') });

// Environment validation
const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

if (!HASURA_ENDPOINT || !ADMIN_SECRET) {
  console.error('❌ Missing required environment variables');
  console.error('HASURA_ENDPOINT:', HASURA_ENDPOINT);
  console.error('ADMIN_SECRET:', !!ADMIN_SECRET);
  process.exit(1);
}

console.log('🔧 Testing actual GraphQL operations from codebase...\n');

// Test basic operations that should work
const basicTests = [
  {
    name: 'Simple Users Query',
    query: `
      query {
        users(limit: 2) {
          id
          name
          email
          role
        }
      }
    `,
    role: 'developer'
  },
  {
    name: 'Simple Clients Query', 
    query: `
      query {
        clients(limit: 2) {
          id
          name
          contactEmail
          contactPhone
        }
      }
    `,
    role: 'developer'
  },
  {
    name: 'Simple Payrolls Query',
    query: `
      query {
        payrolls(limit: 2) {
          id
          clientId
          frequency
          status
        }
      }
    `,
    role: 'developer'
  },
  {
    name: 'Users Aggregate',
    query: `
      query {
        usersAggregate {
          aggregate {
            count
          }
        }
      }
    `,
    role: 'developer'
  },
  {
    name: 'Users with Manager Relation',
    query: `
      query {
        users(limit: 2, where: {managerId: {_is_null: false}}) {
          id
          name
          email
          managerId
        }
      }
    `,
    role: 'developer'
  }
];

async function testQuery(test: { name: string; query: string; role: string }) {
  try {
    console.log(`Testing: ${test.name}`);
    
    const response = await fetch(HASURA_ENDPOINT!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': ADMIN_SECRET!,
        'x-hasura-role': test.role,
      },
      body: JSON.stringify({ query: test.query }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.log(`  ❌ FAILED: ${result.errors[0]?.message}`);
      return false;
    } else {
      console.log(`  ✅ SUCCESS`);
      console.log(`     Data keys: ${Object.keys(result.data || {}).join(', ')}`);
      return true;
    }
  } catch (error) {
    console.log(`  💥 ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

async function runQuickTests() {
  console.log('Running quick GraphQL tests...\n');
  
  let passed = 0;
  let total = basicTests.length;
  
  for (const test of basicTests) {
    const success = await testQuery(test);
    if (success) passed++;
    console.log('');
  }
  
  console.log('='.repeat(50));
  console.log(`Results: ${passed}/${total} tests passed`);
  console.log('='.repeat(50));
  
  if (passed === total) {
    console.log('🎉 All basic GraphQL operations are working!');
    console.log('The schema is accessible and permissions are configured correctly.');
  } else {
    console.log('❌ Some GraphQL operations are failing.');
    console.log('This indicates schema mismatches or permission issues.');
  }
}

runQuickTests().catch(console.error);
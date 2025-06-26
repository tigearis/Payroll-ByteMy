#!/usr/bin/env ts-node

/**
 * Authentication Debugging Script
 * 
 * This script helps debug authentication issues by checking:
 * 1. JWT token content and claims
 * 2. Hasura role assignment
 * 3. Actual permissions in Hasura
 * 4. GraphQL query permissions
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ES module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

if (!HASURA_ENDPOINT || !ADMIN_SECRET) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const hasuraEndpoint: string = HASURA_ENDPOINT;
const adminSecret: string = ADMIN_SECRET;

console.log('🔍 Authentication Debugging Tool\n');

// Test different authentication scenarios
async function testAuthScenarios() {
  console.log('🧪 Testing various authentication scenarios...\n');

  // Test 1: Admin access (should always work)
  console.log('1️⃣ Testing admin access to usersAggregate:');
  try {
    const response = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': adminSecret,
      },
      body: JSON.stringify({
        query: 'query { usersAggregate { aggregate { count } } }'
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.log('  ❌ Admin access failed:', result.errors[0]?.message);
    } else {
      console.log('  ✅ Admin access works:', result.data.usersAggregate.aggregate.count, 'users');
    }
  } catch (error) {
    console.log('  💥 Admin test failed:', error);
  }

  // Test 2: Developer role access
  console.log('\n2️⃣ Testing developer role access to usersAggregate:');
  try {
    const response = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': adminSecret,
        'x-hasura-role': 'developer',
        // Add a test user ID - this would normally come from JWT
        'x-hasura-user-id': '7898704c-ee5c-4ade-81f3-80a4388413fb'
      },
      body: JSON.stringify({
        query: 'query { usersAggregate { aggregate { count } } }'
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.log('  ❌ Developer role failed:', result.errors[0]?.message);
    } else {
      console.log('  ✅ Developer role works:', result.data.usersAggregate.aggregate.count, 'users');
    }
  } catch (error) {
    console.log('  💥 Developer test failed:', error);
  }

  // Test 3: Check what roles can access usersAggregate
  console.log('\n3️⃣ Testing which roles can access usersAggregate:');
  const roles = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
  
  for (const role of roles) {
    try {
      const response = await fetch(hasuraEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': adminSecret,
          'x-hasura-role': role,
          'x-hasura-user-id': '7898704c-ee5c-4ade-81f3-80a4388413fb'
        },
        body: JSON.stringify({
          query: 'query { usersAggregate { aggregate { count } } }'
        }),
      });

      const result = await response.json();
      if (result.errors) {
        console.log(`  ❌ ${role.padEnd(12)}: ${result.errors[0]?.message}`);
      } else {
        console.log(`  ✅ ${role.padEnd(12)}: SUCCESS`);
      }
    } catch (error) {
      console.log(`  💥 ${role.padEnd(12)}: ${error}`);
    }
  }

  // Test 4: Introspection check for usersAggregate field
  console.log('\n4️⃣ Checking usersAggregate field definition:');
  try {
    const response = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': adminSecret,
      },
      body: JSON.stringify({
        query: `
          query {
            __type(name: "query_root") {
              fields {
                name
                type {
                  name
                }
              }
            }
          }
        `
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.log('  ❌ Introspection failed:', result.errors[0]?.message);
    } else {
      const usersAggregateField = result.data.__type.fields.find((field: any) => field.name === 'usersAggregate');
      if (usersAggregateField) {
        console.log('  ✅ usersAggregate field exists in schema');
      } else {
        console.log('  ❌ usersAggregate field NOT found in schema');
        console.log('  Available user-related fields:');
        const userFields = result.data.__type.fields.filter((field: any) => field.name.includes('user'));
        userFields.forEach((field: any) => console.log(`    - ${field.name}`));
      }
    }
  } catch (error) {
    console.log('  💥 Introspection failed:', error);
  }

  // Test 5: Check the actual GetUsersWithFilteringDocument query
  console.log('\n5️⃣ Testing GetUsersWithFiltering query specifically:');
  const testQuery = `
    query GetUsersWithFiltering($limit: Int = 50, $offset: Int = 0, $where: usersBoolExp) {
      users(limit: $limit, offset: $offset, where: $where, orderBy: { createdAt: DESC }) {
        id
        name
        email
        role
      }
      usersAggregate(where: $where) {
        aggregate {
          count
        }
      }
    }
  `;

  try {
    const response = await fetch(hasuraEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': adminSecret,
        'x-hasura-role': 'developer',
        'x-hasura-user-id': '7898704c-ee5c-4ade-81f3-80a4388413fb'
      },
      body: JSON.stringify({
        query: testQuery,
        variables: { limit: 5, offset: 0 }
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.log('  ❌ GetUsersWithFiltering failed for developer:', result.errors[0]?.message);
    } else {
      console.log('  ✅ GetUsersWithFiltering works for developer role');
      console.log(`    Users returned: ${result.data.users.length}`);
      console.log(`    Total count: ${result.data.usersAggregate.aggregate.count}`);
    }
  } catch (error) {
    console.log('  💥 GetUsersWithFiltering test failed:', error);
  }
}

// JWT Token Analysis (for when we get a real token)
function analyzeJWTToken(token: string) {
  try {
    // Decode JWT without verification (for debugging only)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('❌ Invalid JWT format');
      return;
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    console.log('\n🔍 JWT Token Analysis:');
    console.log('  Issuer:', payload.iss);
    console.log('  Subject:', payload.sub);
    console.log('  Expires:', new Date(payload.exp * 1000).toISOString());
    
    const hasuraClaims = payload['https://hasura.io/jwt/claims'];
    if (hasuraClaims) {
      console.log('  Hasura Claims:');
      console.log('    User ID:', hasuraClaims['x-hasura-user-id']);
      console.log('    Role:', hasuraClaims['x-hasura-role']);
      console.log('    Default Role:', hasuraClaims['x-hasura-default-role']);
      console.log('    Allowed Roles:', hasuraClaims['x-hasura-allowed-roles']);
    } else {
      console.log('  ❌ No Hasura claims found in JWT token');
    }
  } catch (error) {
    console.log('❌ Failed to decode JWT token:', error);
  }
}

console.log('🔍 Starting authentication debugging...\n');
testAuthScenarios().catch(console.error);

// Instructions for manual JWT testing
console.log('\n📋 Manual JWT Testing Instructions:');
console.log('1. Open browser dev tools');
console.log('2. Go to Application/Storage tab');
console.log('3. Look for Clerk session data');
console.log('4. Copy JWT token and run: node debug-auth.js "YOUR_JWT_TOKEN"');
console.log('5. Check for proper Hasura claims in the token');

// If a JWT token is provided as argument, analyze it
if (process.argv[2]) {
  console.log('\n🔍 Analyzing provided JWT token...');
  analyzeJWTToken(process.argv[2]);
}
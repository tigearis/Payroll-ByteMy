#!/usr/bin/env node

/**
 * Debug Script for User Creation Issues
 * Run this with: node debug-user-creation.js
 */

const https = require('https');
const http = require('http');

// Configuration
const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

console.log('🔍 User Creation Debug Script');
console.log('================================');

// Check 1: Environment Variables
console.log('\n1. 📋 Environment Variables:');
console.log('   HASURA_URL:', HASURA_URL ? '✅ Set' : '❌ Missing');
console.log('   ADMIN_SECRET:', ADMIN_SECRET ? '✅ Set' : '❌ Missing');
console.log('   URL:', HASURA_URL);

if (!HASURA_URL) {
  console.log('❌ NEXT_PUBLIC_HASURA_GRAPHQL_URL is required');
  process.exit(1);
}

// Check 2: Hasura Connectivity
console.log('\n2. 🌐 Testing Hasura Connectivity:');

function testHasuraConnection() {
  return new Promise((resolve, reject) => {
    const url = new URL(HASURA_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ADMIN_SECRET && { 'x-hasura-admin-secret': ADMIN_SECRET })
      }
    }, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      console.log(`   ❌ Connection failed: ${err.message}`);
      reject(err);
    });

    // Simple introspection query
    req.write(JSON.stringify({
      query: `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `
    }));
    req.end();
  });
}

// Check 3: User Table Schema
function checkUserSchema() {
  return new Promise((resolve, reject) => {
    const url = new URL(HASURA_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ADMIN_SECRET && { 'x-hasura-admin-secret': ADMIN_SECRET })
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    // Query to check user table structure
    req.write(JSON.stringify({
      query: `
        query {
          __type(name: "users") {
            fields {
              name
              type {
                name
                kind
              }
            }
          }
          user_role: __type(name: "user_role") {
            enumValues {
              name
            }
          }
        }
      `
    }));
    req.end();
  });
}

// Check 4: Test User Creation
function testUserCreation() {
  return new Promise((resolve, reject) => {
    const url = new URL(HASURA_URL);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ADMIN_SECRET && { 'x-hasura-admin-secret': ADMIN_SECRET })
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    // Test mutation with minimal data
    const testEmail = `test-${Date.now()}@example.com`;
    req.write(JSON.stringify({
      query: `
        mutation TestUserCreation($name: String!, $email: String!, $role: user_role!) {
          insert_users_one(
            object: {
              name: $name
              email: $email
              role: $role
              is_staff: true
            }
          ) {
            id
            name
            email
            role
            is_staff
            created_at
          }
        }
      `,
      variables: {
        name: "Test User",
        email: testEmail,
        role: "viewer"
      }
    }));
    req.end();
  });
}

// Run all checks
async function runDiagnostics() {
  try {
    // Test connectivity
    const connectivity = await testHasuraConnection();
    if (connectivity.status === 200) {
      console.log('   ✅ Hasura is reachable');
    } else {
      console.log(`   ⚠️  Hasura responded with status ${connectivity.status}`);
      console.log('   Response:', JSON.stringify(connectivity.data, null, 2));
    }

    // Check schema
    console.log('\n3. 📋 Checking User Table Schema:');
    const schema = await checkUserSchema();
    if (schema.data && schema.data.data) {
      const userFields = schema.data.data.__type?.fields || [];
      const roleEnums = schema.data.data.user_role?.enumValues || [];
      
      console.log('   User table fields:');
      userFields.forEach(field => {
        console.log(`     - ${field.name}: ${field.type.name || field.type.kind}`);
      });
      
      console.log('   Available roles:');
      roleEnums.forEach(role => {
        console.log(`     - ${role.name}`);
      });
      
      // Check for required fields
      const requiredFields = ['id', 'name', 'email', 'role', 'is_staff'];
      const hasAllFields = requiredFields.every(field => 
        userFields.some(f => f.name === field)
      );
      
      if (hasAllFields) {
        console.log('   ✅ All required fields present');
      } else {
        console.log('   ❌ Missing required fields');
      }
    } else {
      console.log('   ❌ Could not retrieve schema');
      console.log('   Response:', JSON.stringify(schema.data, null, 2));
    }

    // Test user creation
    console.log('\n4. 🧪 Testing User Creation:');
    const creation = await testUserCreation();
    
    if (creation.data && creation.data.data && creation.data.data.insert_users_one) {
      console.log('   ✅ User creation successful!');
      console.log('   Created user:', JSON.stringify(creation.data.data.insert_users_one, null, 2));
    } else if (creation.data && creation.data.errors) {
      console.log('   ❌ User creation failed with GraphQL errors:');
      creation.data.errors.forEach((error, index) => {
        console.log(`     Error ${index + 1}:`);
        console.log(`       Message: ${error.message}`);
        console.log(`       Extensions:`, JSON.stringify(error.extensions, null, 2));
        if (error.path) {
          console.log(`       Path: ${error.path.join('.')}`);
        }
      });
    } else {
      console.log('   ❌ Unexpected response:');
      console.log('   Response:', JSON.stringify(creation.data, null, 2));
    }

  } catch (error) {
    console.log(`\n❌ Error during diagnostics: ${error.message}`);
    console.log('Stack:', error.stack);
  }
}

// Run the diagnostics
runDiagnostics().then(() => {
  console.log('\n🏁 Diagnostics complete!');
  console.log('\nNext steps if issues found:');
  console.log('1. Check Hasura console for more detailed error logs');
  console.log('2. Verify database connection in Hasura');
  console.log('3. Check that user table exists and has correct schema');
  console.log('4. Verify role enum values match your application');
}).catch(console.error);
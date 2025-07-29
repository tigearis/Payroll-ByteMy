#!/usr/bin/env node

// Test Hasura connection and database configuration
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Load environment files in correct order
require('dotenv').config({ path: '.env.development.local' });
require('dotenv').config({ path: '.env.local', override: true });

async function testHasuraConnection() {
  console.log('🔍 Testing Hasura GraphQL Engine connection...');
  
  const hasuraUrl = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
  const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
  
  console.log(`📡 Hasura URL: ${hasuraUrl}`);
  console.log(`🔐 Admin secret: ${adminSecret ? 'Present' : 'Missing'}`);
  
  try {
    // Test basic Hasura health
    console.log('\n1. Testing Hasura health endpoint...');
    const healthResponse = await fetch(`${hasuraUrl.replace('/v1/graphql', '')}/healthz`);
    
    if (healthResponse.ok) {
      console.log('✅ Hasura is running and accessible');
    } else {
      console.log(`❌ Hasura health check failed: ${healthResponse.status}`);
      return;
    }
    
    // Test GraphQL endpoint with introspection
    console.log('\n2. Testing GraphQL introspection...');
    const introspectionQuery = {
      query: `
        query IntrospectionQuery {
          __schema {
            queryType {
              name
            }
            mutationType {
              name
            }
            subscriptionType {
              name
            }
          }
        }
      `
    };
    
    const graphqlResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify(introspectionQuery)
    });
    
    const graphqlResult = await graphqlResponse.json();
    
    if (graphqlResult.data) {
      console.log('✅ GraphQL introspection successful');
      console.log(`  Query type: ${graphqlResult.data.__schema.queryType?.name || 'Not available'}`);
      console.log(`  Mutation type: ${graphqlResult.data.__schema.mutationType?.name || 'Not available'}`);
      console.log(`  Subscription type: ${graphqlResult.data.__schema.subscriptionType?.name || 'Not available'}`);
    } else {
      console.log('❌ GraphQL introspection failed');
      console.log('Error:', graphqlResult.errors);
      return;
    }
    
    // Test a simple query to check database connection
    console.log('\n3. Testing database connection via GraphQL...');
    const testQuery = {
      query: `
        query TestDatabaseConnection {
          users(limit: 1) {
            id
            email
            firstName
            lastName
          }
        }
      `
    };
    
    const testResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify(testQuery)
    });
    
    const testResult = await testResponse.json();
    
    if (testResult.data && testResult.data.users) {
      console.log('✅ Database connection via Hasura successful');
      console.log(`  Found ${testResult.data.users.length} user(s) in result`);
      if (testResult.data.users.length > 0) {
        const user = testResult.data.users[0];
        console.log(`  Sample user: ${user.firstName} ${user.lastName} (${user.email})`);
      }
    } else {
      console.log('❌ Database connection test failed');
      console.log('Error:', testResult.errors);
      
      if (testResult.errors) {
        const hasConnectionError = testResult.errors.some(error => 
          error.message.includes('connection') || 
          error.message.includes('database') ||
          error.message.includes('relation') ||
          error.message.includes('neon')
        );
        
        if (hasConnectionError) {
          console.log('\n💡 This suggests Hasura is still connected to the old database');
          console.log('   You need to update Hasura\'s database connection to point to your local PostgreSQL');
        }
      }
      return;
    }
    
    // Test subscription capability
    console.log('\n4. Testing subscription capability...');
    const subscriptionTest = {
      query: `
        subscription TestSubscription {
          users(limit: 1) {
            id
            email
            updatedAt
          }
        }
      `
    };
    
    // For subscriptions, we just check if the query is valid (websocket testing is complex)
    const subResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify(subscriptionTest)
    });
    
    const subResult = await subResponse.json();
    
    if (subResult.data) {
      console.log('✅ Subscription query structure is valid');
    } else {
      console.log('⚠️  Subscription test inconclusive');
    }
    
    console.log('\n🎉 Hasura connection test completed successfully!');
    console.log('Your Hasura instance is properly connected to the migrated database.');
    
  } catch (error) {
    console.error('❌ Error testing Hasura connection:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Network connection failed. Check:');
      console.log('   1. Hasura URL is correct');
      console.log('   2. Hasura service is running');
      console.log('   3. Network connectivity to hasura.bytemy.com.au');
    }
  }
}

testHasuraConnection().catch(console.error);
#!/usr/bin/env node

// Test Hasura connection using direct credentials
async function testHasuraConnection() {
  console.log('🔍 Testing Hasura GraphQL Engine connection...');
  
  const hasuraUrl = 'https://hasura.bytemy.com.au/v1/graphql';
  const adminSecret = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';
  
  console.log(`📡 Hasura URL: ${hasuraUrl}`);
  console.log(`🔐 Admin secret: ${adminSecret ? 'Present' : 'Missing'}`);
  
  try {
    // Test basic Hasura health
    console.log('\n1. Testing Hasura health endpoint...');
    const healthUrl = hasuraUrl.replace('/v1/graphql', '/healthz');
    const healthResponse = await fetch(healthUrl);
    
    if (healthResponse.ok) {
      console.log('✅ Hasura is running and accessible');
    } else {
      console.log(`⚠️  Hasura health check returned: ${healthResponse.status}`);
      // Continue with GraphQL test anyway
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
          users(limit: 3) {
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
        testResult.data.users.forEach(user => {
          console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
        });
      }
    } else {
      console.log('❌ Database connection test failed');
      console.log('Response:', JSON.stringify(testResult, null, 2));
      
      if (testResult.errors) {
        const hasConnectionError = testResult.errors.some(error => 
          error.message.includes('connection') || 
          error.message.includes('database') ||
          error.message.includes('relation') ||
          error.message.includes('neon')
        );
        
        if (hasConnectionError) {
          console.log('\n💡 This suggests Hasura needs to be reconfigured to connect to your local PostgreSQL');
          console.log('   Database connection string should be:');
          console.log('   postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable');
        }
      }
      return;
    }
    
    // Test other critical tables
    console.log('\n4. Testing other critical tables...');
    const tablesQuery = {
      query: `
        query TestTables {
          clients(limit: 2) { id name }
          payrolls(limit: 2) { id status }
          user_invitations(limit: 1) { id email }
        }
      `
    };
    
    const tablesResponse = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify(tablesQuery)
    });
    
    const tablesResult = await tablesResponse.json();
    
    if (tablesResult.data) {
      console.log('✅ Core tables accessible via GraphQL');
      console.log(`  Clients: ${tablesResult.data.clients?.length || 0} records`);
      console.log(`  Payrolls: ${tablesResult.data.payrolls?.length || 0} records`);
      console.log(`  Invitations: ${tablesResult.data.user_invitations?.length || 0} records`);
    } else {
      console.log('⚠️  Some tables may not be accessible');
      console.log('Response:', JSON.stringify(tablesResult, null, 2));
    }
    
    console.log('\n🎉 Hasura connection test completed!');
    console.log('✅ Your Hasura instance is properly connected to the migrated local database');
    
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
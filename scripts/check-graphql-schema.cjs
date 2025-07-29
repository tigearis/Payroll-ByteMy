#!/usr/bin/env node

// Check what tables are available in the GraphQL schema
async function checkGraphQLSchema() {
  console.log('🔍 Checking GraphQL schema tables...');
  
  const hasuraUrl = 'https://hasura.bytemy.com.au/v1/graphql';
  const adminSecret = '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';
  
  try {
    // Get all available tables from the GraphQL schema
    const schemaQuery = {
      query: `
        query GetSchema {
          __schema {
            types {
              name
              kind
              fields {
                name
                type {
                  name
                }
              }
            }
          }
        }
      `
    };
    
    const response = await fetch(hasuraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hasura-Admin-Secret': adminSecret
      },
      body: JSON.stringify(schemaQuery)
    });
    
    const result = await response.json();
    
    if (result.data) {
      // Find the query_root type to see available tables
      const queryRoot = result.data.__schema.types.find(type => type.name === 'query_root');
      
      if (queryRoot && queryRoot.fields) {
        console.log('📋 Available tables in GraphQL schema:');
        
        const tableFields = queryRoot.fields
          .filter(field => !field.name.startsWith('__'))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        tableFields.forEach(field => {
          console.log(`  - ${field.name}`);
        });
        
        console.log(`\n📊 Total tables available: ${tableFields.length}`);
        
        // Check for specific critical tables
        const criticalTables = ['users', 'clients', 'payrolls', 'userInvitations', 'user_invitations'];
        console.log('\n🏢 Critical table availability:');
        
        criticalTables.forEach(table => {
          const found = tableFields.some(field => field.name === table);
          console.log(`  ${found ? '✅' : '❌'} ${table}`);
        });
        
      } else {
        console.log('❌ Could not find query_root type');
      }
    } else {
      console.log('❌ Schema introspection failed');
      console.log('Errors:', result.errors);
    }
    
  } catch (error) {
    console.error('❌ Error checking GraphQL schema:', error.message);
  }
}

checkGraphQLSchema().catch(console.error);
// scripts/inspect-schema.js
// Inspect Hasura schema to find available tables

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

async function inspectSchema() {
  console.log('🔍 Inspecting Hasura schema...');
  console.log(`Endpoint: ${HASURA_ENDPOINT}`);

  const introspectionQuery = {
    query: `
      query IntrospectionQuery {
        __schema {
          mutationType {
            fields {
              name
              description
            }
          }
          queryType {
            fields {
              name
              description
            }
          }
        }
      }
    `,
  };

  try {
    const response = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(introspectionQuery),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return;
    }

    console.log('\n📋 Available Mutations:');
    const mutations = data.data.__schema.mutationType.fields;
    
    // Filter for insert operations
    const insertMutations = mutations
      .filter(field => field.name.startsWith('insert_'))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    insertMutations.forEach(field => {
      console.log(`  • ${field.name}`);
    });

    console.log('\n📋 Available Queries:');
    const queries = data.data.__schema.queryType.fields;
    
    // Filter for table queries (usually plural nouns)
    const tableQueries = queries
      .filter(field => !field.name.startsWith('__') && !field.name.includes('aggregate') && !field.name.includes('by_pk'))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 20); // Show first 20
    
    tableQueries.forEach(field => {
      console.log(`  • ${field.name}`);
    });

    // Look for specific table patterns
    console.log('\n🎯 Detected Tables:');
    const tableNames = new Set();
    
    insertMutations.forEach(field => {
      const match = field.name.match(/^insert_(.+)_one$/);
      if (match) {
        tableNames.add(match[1]);
      }
    });
    
    [...tableNames].sort().forEach(table => {
      console.log(`  📊 ${table}`);
    });

    if (tableNames.size === 0) {
      console.log('⚠️  No tables found. This might mean:');
      console.log('   • Database tables haven\'t been created yet');
      console.log('   • Hasura metadata needs to be applied');
      console.log('   • Wrong admin secret or endpoint');
    }

  } catch (error) {
    console.error('❌ Failed to inspect schema:', error.message);
  }
}

inspectSchema();
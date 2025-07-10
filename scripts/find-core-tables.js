// scripts/find-core-tables.js
// Find the core business tables in your schema

import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

async function findCoreTables() {
  console.log('🔍 Looking for core business tables...');

  // Query to find all tables and their fields
  const query = {
    query: `
      query GetTables {
        __schema {
          types {
            name
            fields {
              name
              type {
                name
                ofType {
                  name
                }
              }
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
      body: JSON.stringify(query),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return;
    }

    // Find types that look like database tables
    const tableTypes = data.data.schema.types.filter(type => 
      type.fields && 
      type.fields.length > 0 && 
      !type.name.startsWith('__') &&
      !type.name.endsWith('_aggregate') &&
      !type.name.endsWith('_mutation_response') &&
      !type.name.endsWith('_constraint') &&
      !type.name.endsWith('_select_column') &&
      !type.name.endsWith('_update_column') &&
      !type.name.includes('_insert_') &&
      !type.name.includes('_set_') &&
      !type.name.includes('_inc_') &&
      type.fields.some(field => field.name === 'id' || field.name.includes('id'))
    );

    console.log('\n📊 Core Business Tables Found:');
    
    // Look for likely business tables
    const businessTables = tableTypes.filter(type => 
      ['user', 'client', 'payroll', 'employee', 'company', 'customer', 'invoice', 'billing'].some(keyword =>
        type.name.toLowerCase().includes(keyword)
      )
    );

    businessTables.forEach(table => {
      console.log(`\n🏢 ${table.name}`);
      const keyFields = table.fields
        .filter(field => 
          ['id', 'name', 'email', 'status', 'amount', 'date', 'created_at'].some(key =>
            field.name.toLowerCase().includes(key)
          )
        )
        .slice(0, 5);
      
      keyFields.forEach(field => {
        console.log(`   • ${field.name}: ${field.type.name || field.type.ofType?.name || 'unknown'}`);
      });
    });

    // Check if we have user management tables
    const userTables = tableTypes.filter(type => 
      type.name.toLowerCase().includes('user') || type.name.toLowerCase().includes('auth')
    );

    if (userTables.length > 0) {
      console.log('\n👥 User Management Tables:');
      userTables.forEach(table => {
        console.log(`   • ${table.name}`);
      });
    }

    // Check for audit/logging tables
    const auditTables = tableTypes.filter(type => 
      type.name.toLowerCase().includes('audit') || type.name.toLowerCase().includes('log')
    );

    if (auditTables.length > 0) {
      console.log('\n📝 Audit/Logging Tables:');
      auditTables.forEach(table => {
        console.log(`   • ${table.name}`);
      });
    }

  } catch (error) {
    console.error('❌ Failed to find tables:', error.message);
  }
}

findCoreTables();
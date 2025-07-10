#!/usr/bin/env node

/**
 * Check Hasura Metadata and Introspection
 * 
 * Uses introspection to see what tables are actually available
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.development.local' });

const HASURA_GRAPHQL_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

// GraphQL introspection query to see available tables
const INTROSPECTION_QUERY = `
  query IntrospectionQuery {
    __schema {
      queryType {
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  }
`;

// Direct permissions query with different approaches
const PERMISSION_QUERIES = [
  {
    name: 'Full Permissions Query',
    query: `
      query FullPermissions {
        permissions {
          id
          resource_id
          action
          description
        }
        resources {
          id
          name
          description
        }
        role_permissions {
          id
          role_id
          permission_id
        }
        user_roles {
          id
          user_id
          role_id
        }
      }
    `
  },
  {
    name: 'Simple Permissions Query',
    query: `
      query SimplePermissions {
        permissions {
          id
          action
        }
      }
    `
  },
  {
    name: 'Resources Only',
    query: `
      query ResourcesOnly {
        resources {
          id
          name
        }
      }
    `
  }
];

async function checkHasuraMetadata() {
  console.log('🔍 Hasura Metadata & Introspection Check');
  console.log('========================================\n');

  try {
    console.log('🔌 Connecting to Hasura...');
    console.log(`📍 URL: ${HASURA_GRAPHQL_URL}\n`);

    // Step 1: Try introspection with admin secret only
    console.log('📊 Step 1: GraphQL Schema Introspection');
    console.log('--------------------------------------');
    
    const introspectionResponse = await fetch(HASURA_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
      },
      body: JSON.stringify({
        query: INTROSPECTION_QUERY
      })
    });

    const introspectionResult = await introspectionResponse.json();
    
    if (introspectionResult.errors) {
      console.log('❌ Introspection failed:', introspectionResult.errors);
    } else {
      const fields = introspectionResult.data.__schema.queryType.fields;
      const tableFields = fields.filter(field => 
        !field.name.startsWith('__') && 
        field.type.kind === 'LIST' ||
        (field.type.ofType && field.type.ofType.kind === 'LIST')
      );
      
      console.log(`✅ Found ${tableFields.length} available tables/queries:`);
      tableFields.forEach(field => {
        console.log(`   • ${field.name}`);
      });

      // Look for permission-related tables
      const permissionTables = tableFields.filter(field => 
        field.name.includes('permission') || 
        field.name.includes('role') ||
        field.name === 'resources'
      );
      
      console.log(`\n🔑 Permission-related tables found: ${permissionTables.length}`);
      permissionTables.forEach(field => {
        console.log(`   ✅ ${field.name}`);
      });
    }

    // Step 2: Try permission queries with different role configurations
    console.log('\n📊 Step 2: Testing Permission Table Access');
    console.log('------------------------------------------');

    const roleConfigurations = [
      { name: 'Admin Secret Only', headers: { 'x-hasura-admin-secret': HASURA_ADMIN_SECRET } },
      { name: 'Admin Secret + Developer Role', headers: { 'x-hasura-admin-secret': HASURA_ADMIN_SECRET, 'x-hasura-role': 'developer' } },
      { name: 'Admin Secret + Admin Role', headers: { 'x-hasura-admin-secret': HASURA_ADMIN_SECRET, 'x-hasura-role': 'admin' } },
      { name: 'Admin Secret + Org Admin Role', headers: { 'x-hasura-admin-secret': HASURA_ADMIN_SECRET, 'x-hasura-role': 'org_admin' } }
    ];

    for (const config of roleConfigurations) {
      console.log(`\n🧪 Testing with: ${config.name}`);
      
      for (const permQuery of PERMISSION_QUERIES) {
        try {
          const response = await fetch(HASURA_GRAPHQL_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...config.headers
            },
            body: JSON.stringify({
              query: permQuery.query
            })
          });

          const result = await response.json();
          
          if (result.errors) {
            console.log(`   ❌ ${permQuery.name}: ${result.errors[0].message.substring(0, 80)}...`);
          } else {
            console.log(`   ✅ ${permQuery.name}: SUCCESS`);
            
            // Show data summary
            const data = result.data;
            Object.entries(data).forEach(([table, records]) => {
              if (Array.isArray(records)) {
                console.log(`      • ${table}: ${records.length} records`);
                
                // Show sample data for the first successful query
                if (records.length > 0 && records.length <= 10) {
                  console.log(`      Sample: ${JSON.stringify(records[0], null, 8)}`);
                }
              }
            });
            
            // If we found data, we can stop testing this query
            break;
          }
        } catch (error) {
          console.log(`   💥 ${permQuery.name}: Network error - ${error.message}`);
        }
      }
    }

    // Step 3: Manual table checks
    console.log('\n📊 Step 3: Manual Table Existence Check');
    console.log('---------------------------------------');
    
    const tablesToCheck = [
      'permissions', 'resources', 'role_permissions', 'user_roles',
      'permission_overrides', 'permission_audit_log', 
      'roles', 'users'
    ];

    for (const tableName of tablesToCheck) {
      try {
        const response = await fetch(HASURA_GRAPHQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': HASURA_ADMIN_SECRET
          },
          body: JSON.stringify({
            query: `query { ${tableName}(limit: 1) { __typename } }`
          })
        });

        const result = await response.json();
        
        if (result.errors) {
          console.log(`❌ ${tableName}: ${result.errors[0].message}`);
        } else {
          console.log(`✅ ${tableName}: Exists and accessible`);
        }
      } catch (error) {
        console.log(`💥 ${tableName}: Error - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Hasura metadata check failed:', error);
    throw error;
  }
}

// Run the check
checkHasuraMetadata()
  .then(() => {
    console.log('\n✅ Hasura metadata check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Hasura metadata check failed:', error);
    process.exit(1);
  });
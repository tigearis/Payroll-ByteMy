#!/usr/bin/env node

/**
 * Hasura Schema Introspection for Audit
 * Discovers what tables and fields are actually available
 */

const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'https://hasura.bytemy.com.au/v1/graphql';
const HASURA_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET || '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=';

async function introspectSchema() {
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        queryType {
          name
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
            args {
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
        mutationType {
          name
          fields {
            name
            type {
              name
              kind
            }
          }
        }
        subscriptionType {
          name
          fields {
            name
            type {
              name
              kind
            }
          }
        }
        types {
          name
          kind
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
  
  try {
    const response = await fetch(HASURA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_SECRET,
        'x-hasura-role': 'developer'
      },
      body: JSON.stringify({
        query: introspectionQuery
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('Introspection failed:', result.errors);
      return null;
    }
    
    return result.data.__schema;
  } catch (error) {
    console.error('Network error during introspection:', error);
    return null;
  }
}

async function analyzeAvailableTables() {
  console.log('🔍 Introspecting Hasura Schema...\n');
  
  const schema = await introspectSchema();
  if (!schema) {
    console.error('Failed to introspect schema');
    return;
  }
  
  const queryFields = schema.queryType.fields || [];
  const mutationFields = schema.mutationType?.fields || [];
  const subscriptionFields = schema.subscriptionType?.fields || [];
  
  // Analyze table-like queries
  const tableQueries = queryFields.filter(field => 
    !field.name.startsWith('__') && 
    (field.name.endsWith('Aggregate') || 
     field.name.endsWith('ById') || 
     field.name.match(/^[a-z]/))
  );
  
  // Group by domain/category
  const domains = {
    auth: [],
    audit: [],
    users: [],
    clients: [],
    billing: [],
    payrolls: [],
    notes: [],
    leave: [],
    workSchedule: [],
    external: [],
    system: []
  };
  
  tableQueries.forEach(field => {
    const name = field.name;
    
    if (name.includes('user') || name.includes('role') || name.includes('permission') || name.includes('invitation')) {
      if (name.includes('audit') || name.includes('log')) {
        domains.audit.push(field);
      } else {
        domains.auth.push(field);
      }
    } else if (name.includes('audit') || name.includes('log')) {
      domains.audit.push(field);
    } else if (name.includes('client')) {
      domains.clients.push(field);
    } else if (name.includes('billing') || name.includes('invoice')) {
      domains.billing.push(field);
    } else if (name.includes('payroll')) {
      domains.payrolls.push(field);
    } else if (name.includes('note')) {
      domains.notes.push(field);
    } else if (name.includes('leave')) {
      domains.leave.push(field);
    } else if (name.includes('work') || name.includes('schedule') || name.includes('skill')) {
      domains.workSchedule.push(field);
    } else if (name.includes('external') || name.includes('integration')) {
      domains.external.push(field);
    } else {
      domains.system.push(field);
    }
  });
  
  console.log('📊 AVAILABLE TABLES BY DOMAIN');
  console.log('='.repeat(60));
  
  Object.entries(domains).forEach(([domain, fields]) => {
    if (fields.length > 0) {
      console.log(`\n${domain.toUpperCase()} (${fields.length} tables):`);
      fields.forEach(field => {
        const typeName = field.type.name || field.type.ofType?.name || 'unknown';
        console.log(`  • ${field.name} -> ${typeName}`);
      });
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`📈 SUMMARY: ${tableQueries.length} total tables available`);
  console.log(`🔧 Mutations: ${mutationFields.length} available`);
  console.log(`📡 Subscriptions: ${subscriptionFields.length} available`);
  
  // Check for specific audit tables
  console.log('\n🔍 AUDIT TABLE ANALYSIS:');
  const auditTables = queryFields.filter(f => 
    f.name.includes('audit') || 
    f.name.includes('log') ||
    f.name.includes('Auth') ||
    f.name.includes('Event')
  );
  
  if (auditTables.length > 0) {
    console.log('   Available audit/logging tables:');
    auditTables.forEach(table => {
      console.log(`   • ${table.name}`);
    });
  } else {
    console.log('   ⚠️  No audit tables found in main query_root');
    console.log('   💡 Audit tables might be in separate schema or restricted');
  }
  
  // Test a few critical operations
  console.log('\n🧪 TESTING CRITICAL OPERATIONS:');
  
  const criticalTests = [
    {
      name: 'Test Users Table',
      query: 'query { users(limit: 1) { id name email role } }'
    },
    {
      name: 'Test Clients Table', 
      query: 'query { clients(limit: 1) { id name active } }'
    },
    {
      name: 'Test Billing Invoice',
      query: 'query { billingInvoice(limit: 1) { id clientId totalAmount } }'
    },
    {
      name: 'Test Work Schedule',
      query: 'query { workSchedule(limit: 1) { id userId workHours } }'
    }
  ];
  
  for (const test of criticalTests) {
    try {
      const response = await fetch(HASURA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_SECRET,
          'x-hasura-role': 'developer'
        },
        body: JSON.stringify({ query: test.query })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        console.log(`   ❌ ${test.name}: ${result.errors[0].message}`);
      } else {
        console.log(`   ✅ ${test.name}: Working`);
      }
    } catch (error) {
      console.log(`   ❌ ${test.name}: Network error`);
    }
  }
  
  return {
    totalTables: tableQueries.length,
    totalMutations: mutationFields.length,
    totalSubscriptions: subscriptionFields.length,
    domainBreakdown: Object.fromEntries(
      Object.entries(domains).map(([k, v]) => [k, v.length])
    ),
    auditTablesAvailable: auditTables.length,
    schema
  };
}

if (require.main === module) {
  analyzeAvailableTables().catch(error => {
    console.error('Schema analysis failed:', error);
    process.exit(1);
  });
}

module.exports = { analyzeAvailableTables, introspectSchema };
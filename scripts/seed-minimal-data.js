// scripts/seed-minimal-data.js
// Seed minimal test data using only tables with insert permissions

import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

// Generate UUIDs for consistency
function generateUUID() {
  return uuidv4();
}

// Minimal test data using only tables with insert permissions
const testData = {
  payrollCycles: [
    {
      id: generateUUID(),
      name: 'weekly',
      description: 'Weekly payroll cycle',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      name: 'fortnightly',
      description: 'Fortnightly payroll cycle',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      name: 'monthly',
      description: 'Monthly payroll cycle',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  
  payrollDateTypes: [
    {
      id: generateUUID(),
      name: 'fixed_date',
      description: 'Fixed date processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      name: 'eom',
      description: 'End of month processing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  billingPlans: [
    {
      id: generateUUID(),
      name: 'Basic Plan',
      rate_per_payroll: 25.00,
      currency: 'CAD',
      description: 'Basic payroll processing plan',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      name: 'Premium Plan',
      rate_per_payroll: 45.00,
      currency: 'CAD',
      description: 'Premium payroll processing plan',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  externalSystems: [
    {
      id: generateUUID(),
      name: 'Test External System',
      url: 'https://test-external-system.example.com',
      description: 'Test external payroll system',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  featureFlags: [
    {
      id: generateUUID(),
      feature_name: 'test_feature_enabled',
      is_enabled: true,
      allowed_roles: JSON.stringify(['developer', 'org_admin']),
      updated_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      feature_name: 'e2e_testing_mode',
      is_enabled: true,
      allowed_roles: JSON.stringify(['developer']),
      updated_at: new Date().toISOString()
    }
  ],

  notes: [
    {
      id: generateUUID(),
      content: 'This is a test note for E2E testing - Client related',
      entity_id: generateUUID(),
      entity_type: 'client',
      is_important: false,
      created_at: new Date().toISOString()
    },
    {
      id: generateUUID(),
      content: 'Important payroll processing note for E2E tests',
      entity_id: generateUUID(),
      entity_type: 'payroll',
      is_important: true,
      created_at: new Date().toISOString()
    }
  ]
};

async function seedMinimalData() {
  console.log('🌱 Seeding minimal test data...');
  console.log(`Using endpoint: ${HASURA_ENDPOINT}`);

  if (!HASURA_ADMIN_SECRET) {
    console.error('❌ Please set HASURA_ADMIN_SECRET in .env.test');
    process.exit(1);
  }

  try {
    // Test connection
    const testQuery = {
      query: `query TestConnection { __schema { types { name } } }`,
    };

    const testResponse = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify(testQuery),
    });

    if (!testResponse.ok) {
      throw new Error(`Connection failed: ${testResponse.status} ${testResponse.statusText}`);
    }

    console.log('✅ Hasura connection successful');

    // Helper function to insert data
    async function insertData(tableName, data, displayName) {
      console.log(`\n📊 Creating ${displayName}...`);
      
      for (const item of data) {
        const mutation = {
          query: `
            mutation Insert${tableName}($object: ${tableName}_insert_input!) {
              insert_${tableName}_one(
                object: $object
                on_conflict: {
                  constraint: ${tableName}_pkey
                  update_columns: []
                }
              ) {
                id
              }
            }
          `,
          variables: { object: item },
        };

        const response = await fetch(HASURA_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
          },
          body: JSON.stringify(mutation),
        });

        const result = await response.json();
        if (result.errors) {
          console.warn(`⚠️  ${displayName}:`, result.errors[0].message);
        } else {
          console.log(`✅ Created: ${item.name || item.title || item.id}`);
        }
      }
    }

    // Insert data
    await insertData('payroll_cycles', testData.payrollCycles, 'payroll cycles');
    await insertData('payroll_date_types', testData.payrollDateTypes, 'payroll date types');
    await insertData('billing_plan', testData.billingPlans, 'billing plans');
    await insertData('external_systems', testData.externalSystems, 'external systems');
    await insertData('feature_flags', testData.featureFlags, 'feature flags');
    await insertData('notes', testData.notes, 'notes');

    console.log('\n🎉 Minimal test data seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`   • ${testData.payrollCycles.length} payroll cycles`);
    console.log(`   • ${testData.payrollDateTypes.length} payroll date types`);
    console.log(`   • ${testData.billingPlans.length} billing plans`);
    console.log(`   • ${testData.externalSystems.length} external systems`);
    console.log(`   • ${testData.featureFlags.length} feature flags`);
    console.log(`   • ${testData.notes.length} notes`);
    console.log('\n💡 Basic test data is now available for E2E tests!');
    console.log('ℹ️  Note: Some core tables (users, clients, payrolls) may not have insert permissions');
    console.log('   configured in Hasura. This is minimal data for basic testing.');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   • Check HASURA_ADMIN_SECRET in .env.test');
    console.error('   • Ensure Hasura is accessible at', HASURA_ENDPOINT);
    console.error('   • Verify table permissions are configured in Hasura');
    process.exit(1);
  }
}

// Clean test data
async function cleanTestData() {
  console.log('🧹 Cleaning existing test data...');

  const tables = [
    'notes',
    'feature_flags',
    'external_systems',
    'billing_plan',
    'payroll_date_types',
    'payroll_cycles'
  ];

  try {
    for (const table of tables) {
      // Use description field to identify test data or feature_name for feature flags
      let whereClause;
      if (table === 'feature_flags') {
        whereClause = `{feature_name: {_like: "%test%"}}`;
      } else if (table === 'notes') {
        whereClause = `{content: {_like: "%E2E testing%"}}`;
      } else {
        whereClause = `{description: {_like: "%test%"}}`;
      }
      
      const deleteQuery = {
        query: `
          mutation DeleteTest${table} {
            delete_${table}(where: ${whereClause}) {
              affected_rows
            }
          }
        `,
      };

      const response = await fetch(HASURA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        },
        body: JSON.stringify(deleteQuery),
      });

      const result = await response.json();
      if (result.errors) {
        console.warn(`⚠️  Warning cleaning ${table}:`, result.errors[0].message);
      } else {
        const affected = result.data[`delete_${table}`]?.affected_rows || 0;
        if (affected > 0) {
          console.log(`✅ Cleaned ${affected} rows from ${table}`);
        }
      }
    }
    console.log('✅ Test data cleanup completed');
  } catch (error) {
    console.warn('⚠️  Cleanup failed:', error.message);
  }
}

// Main execution
const command = process.argv[2] || 'seed';

switch (command) {
  case 'clean':
    await cleanTestData();
    break;
  case 'reseed':
    await cleanTestData();
    await seedMinimalData();
    break;
  case 'seed':
  default:
    await seedMinimalData();
    break;
}
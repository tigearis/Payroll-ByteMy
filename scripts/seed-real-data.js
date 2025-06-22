// scripts/seed-real-data.js
// Seed test data based on actual schema structure

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

// Test users data matching the schema
const testUsers = [
  {
    id: 'test-developer-uuid-001',
    name: 'Test Developer',
    email: 'developer@test.payroll.com',
    clerkUserId: 'user_test_developer_001'
  },
  {
    id: 'test-orgadmin-uuid-002',
    name: 'Test Org Admin',
    email: 'orgadmin@test.payroll.com',
    clerkUserId: 'user_test_orgadmin_002'
  },
  {
    id: 'test-manager-uuid-003',
    name: 'Test Manager',
    email: 'manager@test.payroll.com',
    clerkUserId: 'user_test_manager_003'
  },
  {
    id: 'test-consultant-uuid-004',
    name: 'Test Consultant',
    email: 'consultant@test.payroll.com',
    clerkUserId: 'user_test_consultant_004',
    managerId: 'test-manager-uuid-003'
  },
  {
    id: 'test-viewer-uuid-005',
    name: 'Test Viewer',
    email: 'viewer@test.payroll.com',
    clerkUserId: 'user_test_viewer_005',
    managerId: 'test-manager-uuid-003'
  }
];

// Test clients data
const testClients = [
  {
    id: 'test-client-001',
    name: 'Acme Corporation',
    contactEmail: 'contact@acme-test.com',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-client-002',
    name: 'Beta Industries',
    contactEmail: 'hr@beta-test.com',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-client-003',
    name: 'Gamma Tech',
    contactEmail: 'payroll@gamma-test.com',
    updatedAt: new Date().toISOString()
  }
];

// Payroll cycles
const testPayrollCycles = [
  {
    id: 'cycle-weekly-001',
    name: 'weekly',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cycle-bi_weekly-002',
    name: 'bi_weekly',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cycle-monthly-003',
    name: 'monthly',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Payroll date types
const testPayrollDateTypes = [
  {
    id: 'date-type-processing-001',
    name: 'processing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'date-type-eft-002',
    name: 'eft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Test payrolls
const testPayrolls = [
  {
    id: 'test-payroll-001',
    clientId: 'test-client-001',
    cycleId: 'cycle-bi_weekly-002',
    dateTypeId: 'date-type-processing-001',
    createdByUserId: 'test-consultant-uuid-004',
    backupConsultantUserId: 'test-manager-uuid-003'
  },
  {
    id: 'test-payroll-002',
    clientId: 'test-client-002',
    cycleId: 'cycle-monthly-003',
    dateTypeId: 'date-type-eft-002',
    createdByUserId: 'test-consultant-uuid-004',
    backupConsultantUserId: 'test-manager-uuid-003'
  },
  {
    id: 'test-payroll-003',
    clientId: 'test-client-003',
    cycleId: 'cycle-weekly-001',
    dateTypeId: 'date-type-processing-001',
    createdByUserId: 'test-manager-uuid-003'
  }
];

// Payroll dates
const testPayrollDates = [
  {
    id: 'test-payroll-date-001',
    payrollId: 'test-payroll-001',
    processingDate: '2024-01-15',
    originalEftDate: '2024-01-17',
    adjustedEftDate: '2024-01-17'
  },
  {
    id: 'test-payroll-date-002',
    payrollId: 'test-payroll-002',
    processingDate: '2024-01-30',
    originalEftDate: '2024-02-01',
    adjustedEftDate: '2024-02-01'
  },
  {
    id: 'test-payroll-date-003',
    payrollId: 'test-payroll-003',
    processingDate: '2024-01-08',
    originalEftDate: '2024-01-10',
    adjustedEftDate: '2024-01-10'
  }
];

// Payroll assignments
const testPayrollAssignments = [
  {
    id: 'test-assignment-001',
    payrollDateId: 'test-payroll-date-001',
    consultantId: 'test-consultant-uuid-004',
    originalConsultantId: 'test-consultant-uuid-004',
    assignedDate: new Date().toISOString()
  },
  {
    id: 'test-assignment-002',
    payrollDateId: 'test-payroll-date-002',
    consultantId: 'test-consultant-uuid-004',
    originalConsultantId: 'test-consultant-uuid-004',
    assignedDate: new Date().toISOString()
  },
  {
    id: 'test-assignment-003',
    payrollDateId: 'test-payroll-date-003',
    consultantId: 'test-manager-uuid-003',
    originalConsultantId: 'test-manager-uuid-003',
    assignedDate: new Date().toISOString()
  }
];

async function seedData() {
  console.log('🌱 Seeding test data based on actual schema...');
  console.log(`Using endpoint: ${HASURA_ENDPOINT}`);

  if (!HASURA_ADMIN_SECRET || HASURA_ADMIN_SECRET === 'your_hasura_admin_secret_here') {
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
    async function insertData(tableName, data, displayName, keyField = 'id') {
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
                ${keyField}
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
          console.warn(`⚠️  ${displayName} ${item[keyField]}:`, result.errors[0].message);
        } else {
          console.log(`✅ Created: ${item[keyField] || item.name}`);
        }
      }
    }

    // Insert data in dependency order
    await insertData('users', testUsers, 'test users', 'name');
    await insertData('clients', testClients, 'test clients', 'name');
    await insertData('payroll_cycles', testPayrollCycles, 'payroll cycles', 'name');
    await insertData('payroll_date_types', testPayrollDateTypes, 'payroll date types', 'name');
    await insertData('payrolls', testPayrolls, 'payrolls');
    await insertData('payroll_dates', testPayrollDates, 'payroll dates');
    await insertData('payroll_assignments', testPayrollAssignments, 'payroll assignments');

    console.log('\n🎉 Test data seeding completed!');
    console.log('\n📊 Summary:');
    console.log(`   • ${testUsers.length} users`);
    console.log(`   • ${testClients.length} clients`);
    console.log(`   • ${testPayrollCycles.length} payroll cycles`);
    console.log(`   • ${testPayrollDateTypes.length} payroll date types`);
    console.log(`   • ${testPayrolls.length} payrolls`);
    console.log(`   • ${testPayrollDates.length} payroll dates`);
    console.log(`   • ${testPayrollAssignments.length} payroll assignments`);
    console.log('\n💡 You can now run E2E tests with realistic test data!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   • Check HASURA_ADMIN_SECRET in .env.test');
    console.error('   • Ensure Hasura is accessible at', HASURA_ENDPOINT);
    console.error('   • Verify all required tables exist in the database');
    process.exit(1);
  }
}

// Clean existing test data
async function cleanTestData() {
  console.log('🧹 Cleaning existing test data...');

  const tables = [
    'payroll_assignments',
    'payroll_dates', 
    'payrolls',
    'payroll_date_types',
    'payroll_cycles',
    'clients',
    'users'
  ];

  try {
    for (const table of tables) {
      const deleteQuery = {
        query: `
          mutation DeleteTest${table} {
            delete_${table}(where: {id: {_like: "test-%"}}) {
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
    await seedData();
    break;
  case 'seed':
  default:
    await seedData();
    break;
}
// scripts/quick-seed.js
// Quick and simple test data seeding without external dependencies

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || 'myadminsecretkey';

// Simple test data
const testClients = [
  {
    id: 'test-client-001',
    name: 'Acme Corporation',
    email: 'contact@acme-test.com',
    status: 'active',
    contact_person: 'John Doe',
    contact_email: 'john@acme-test.com',
    contact_phone: '+1-555-0001',
    payroll_frequency: 'bi_weekly',
  },
  {
    id: 'test-client-002', 
    name: 'Beta Industries',
    email: 'hr@beta-test.com',
    status: 'active',
    contact_person: 'Jane Smith',
    contact_email: 'jane@beta-test.com',
    contact_phone: '+1-555-0002',
    payroll_frequency: 'monthly',
  },
];

const testPayrolls = [
  {
    id: 'test-payroll-001',
    clientId: 'test-client-001',
    status: 'completed',
    amount: 25000.00,
    payPeriodStart: '2024-01-01',
    payPeriodEnd: '2024-01-15',
  },
  {
    id: 'test-payroll-002',
    clientId: 'test-client-001', 
    status: 'processing',
    amount: 27500.00,
    payPeriodStart: '2024-01-16',
    payPeriodEnd: '2024-01-31',
  },
  {
    id: 'test-payroll-003',
    clientId: 'test-client-002',
    status: 'draft',
    amount: 45000.00,
    payPeriodStart: '2024-01-01',
    payPeriodEnd: '2024-01-31',
  },
];

async function quickSeed() {
  console.log('🌱 Quick seeding test data...');
  console.log(`Using Hasura endpoint: ${HASURA_ENDPOINT}`);
  
  if (!HASURA_ADMIN_SECRET || HASURA_ADMIN_SECRET === 'your_hasura_admin_secret_here') {
    console.error('❌ Please set HASURA_ADMIN_SECRET in .env.test');
    console.error('   You can find this in your Hasura console or environment settings');
    process.exit(1);
  }

  try {
    // Test Hasura connection first
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
      throw new Error(`Hasura connection failed: ${testResponse.status} ${testResponse.statusText}`);
    }

    console.log('✅ Hasura connection successful');

    // Insert clients
    console.log('📊 Creating test clients...');
    for (const client of testClients) {
      const clientMutation = {
        query: `
          mutation CreateClient($client: clients_insert_input!) {
            insert_clients_one(
              object: $client
              on_conflict: {
                constraint: clients_pkey
                update_columns: [name, email, status, contact_person, contact_email, contact_phone, payroll_frequency]
              }
            ) {
              id
              name
            }
          }
        `,
        variables: { client },
      };

      const response = await fetch(HASURA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        },
        body: JSON.stringify(clientMutation),
      });

      const data = await response.json();
      if (data.errors) {
        console.warn(`⚠️  Client ${client.name}:`, data.errors[0].message);
      } else {
        console.log(`✅ Created/updated client: ${client.name}`);
      }
    }

    // Insert payrolls
    console.log('💰 Creating test payrolls...');
    for (const payroll of testPayrolls) {
      const payrollMutation = {
        query: `
          mutation CreatePayroll($payroll: payrolls_insert_input!) {
            insert_payrolls_one(
              object: $payroll
              on_conflict: {
                constraint: payrolls_pkey
                update_columns: [clientId, status, amount, payPeriodStart, payPeriodEnd]
              }
            ) {
              id
              status
              amount
            }
          }
        `,
        variables: { payroll },
      };

      const response = await fetch(HASURA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        },
        body: JSON.stringify(payrollMutation),
      });

      const data = await response.json();
      if (data.errors) {
        console.warn(`⚠️  Payroll ${payroll.id}:`, data.errors[0].message);
      } else {
        console.log(`✅ Created/updated payroll: ${payroll.id} ($${payroll.amount})`);
      }
    }

    console.log('\n🎉 Quick seed completed!');
    console.log('📊 Summary:');
    console.log(`   • ${testClients.length} clients`);
    console.log(`   • ${testPayrolls.length} payrolls`);
    console.log('\n💡 You can now run your E2E tests with test data!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   • Check HASURA_ADMIN_SECRET in .env.test');
    console.error('   • Ensure Hasura is running on', HASURA_ENDPOINT);
    console.error('   • Verify database tables exist (clients, payrolls)');
    process.exit(1);
  }
}

quickSeed();
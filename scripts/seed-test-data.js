// scripts/seed-test-data.js
// Script to create fake database data for testing

import { createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

const HASURA_ENDPOINT = process.env.E2E_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

// GraphQL mutations for creating test data
const CREATE_CLIENT = `
  mutation CreateTestClient($input: clients_insert_input!) {
    insert_clients_one(object: $input) {
      id
      name
      email
      status
    }
  }
`;

const CREATE_PAYROLL = `
  mutation CreateTestPayroll($input: payrolls_insert_input!) {
    insert_payrolls_one(object: $input) {
      id
      clientId
      status
      amount
      payPeriodStart
      payPeriodEnd
    }
  }
`;

const CREATE_USER_PROFILE = `
  mutation CreateUserProfile($input: users_insert_input!) {
    insert_users_one(object: $input) {
      id
      email
      role
      clerkUserId
      isActive
    }
  }
`;

// Test data generators
const generateTestClients = () => [
  {
    id: 'test-client-001',
    name: 'Acme Corporation',
    email: 'contact@acme-corp.test',
    status: 'active',
    contact_person: 'John Doe',
    contact_email: 'john@acme-corp.test',
    contact_phone: '+1-555-0001',
    payroll_frequency: 'bi_weekly',
    tax_id: 'TEST123456789',
    address: '123 Test Street, Test City, TC 12345',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-client-002',
    name: 'Beta Industries',
    email: 'hr@beta-industries.test',
    status: 'active',
    contact_person: 'Jane Smith',
    contact_email: 'jane@beta-industries.test',
    contact_phone: '+1-555-0002',
    payroll_frequency: 'monthly',
    tax_id: 'TEST987654321',
    address: '456 Beta Avenue, Beta City, BC 67890',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-client-003',
    name: 'Gamma Consulting',
    email: 'admin@gamma-consulting.test',
    status: 'pending',
    contact_person: 'Bob Johnson',
    contact_email: 'bob@gamma-consulting.test',
    contact_phone: '+1-555-0003',
    payroll_frequency: 'weekly',
    tax_id: 'TEST456789123',
    address: '789 Gamma Lane, Gamma Town, GT 13579',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const generateTestPayrolls = () => [
  {
    id: 'test-payroll-001',
    clientId: 'test-client-001',
    status: 'completed',
    amount: 25000.00,
    payPeriodStart: '2024-01-01',
    payPeriodEnd: '2024-01-15',
    processedAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-payroll-002',
    clientId: 'test-client-001',
    status: 'processing',
    amount: 27500.00,
    payPeriodStart: '2024-01-16',
    payPeriodEnd: '2024-01-31',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-payroll-003',
    clientId: 'test-client-002',
    status: 'draft',
    amount: 45000.00,
    payPeriodStart: '2024-01-01',
    payPeriodEnd: '2024-01-31',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-payroll-004',
    clientId: 'test-client-003',
    status: 'pending_approval',
    amount: 15000.00,
    payPeriodStart: '2024-01-22',
    payPeriodEnd: '2024-01-28',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const generateUserProfiles = () => [
  {
    id: 'test-developer-uuid-001',
    email: 'developer@test.payroll.com',
    role: 'developer',
    clerkUserId: 'user_test_developer_001',
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-orgadmin-uuid-002',
    email: 'orgadmin@test.payroll.com',
    role: 'org_admin',
    clerkUserId: 'user_test_orgadmin_002',
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-manager-uuid-003',
    email: 'manager@test.payroll.com',
    role: 'manager',
    clerkUserId: 'user_test_manager_003',
    isActive: true,
    managerId: 'test-orgadmin-uuid-002',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-consultant-uuid-004',
    email: 'consultant@test.payroll.com',
    role: 'consultant',
    clerkUserId: 'user_test_consultant_004',
    isActive: true,
    managerId: 'test-manager-uuid-003',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'test-viewer-uuid-005',
    email: 'viewer@test.payroll.com',
    role: 'viewer',
    clerkUserId: 'user_test_viewer_005',
    isActive: true,
    managerId: 'test-manager-uuid-003',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// GraphQL client function
async function executeGraphQL(query, variables = {}) {
  const response = await fetch(HASURA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`);
  }
  return data.data;
}

// Main seeding function
async function seedTestData() {
  console.log('🌱 Starting test data seeding...');

  if (!HASURA_ADMIN_SECRET) {
    console.error('❌ HASURA_ADMIN_SECRET is required for seeding');
    process.exit(1);
  }

  try {
    console.log('\n👥 Creating test user profiles...');
    const userProfiles = generateUserProfiles();
    for (const profile of userProfiles) {
      try {
        await executeGraphQL(CREATE_USER_PROFILE, { input: profile });
        console.log(`✅ Created user profile: ${profile.email}`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️  User profile already exists: ${profile.email}`);
        } else {
          console.error(`❌ Failed to create user profile ${profile.email}:`, error.message);
        }
      }
    }

    console.log('\n🏢 Creating test clients...');
    const clients = generateTestClients();
    for (const client of clients) {
      try {
        await executeGraphQL(CREATE_CLIENT, { input: client });
        console.log(`✅ Created client: ${client.name}`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️  Client already exists: ${client.name}`);
        } else {
          console.error(`❌ Failed to create client ${client.name}:`, error.message);
        }
      }
    }

    console.log('\n💰 Creating test payrolls...');
    const payrolls = generateTestPayrolls();
    for (const payroll of payrolls) {
      try {
        await executeGraphQL(CREATE_PAYROLL, { input: payroll });
        console.log(`✅ Created payroll: ${payroll.id} (${payroll.status})`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️  Payroll already exists: ${payroll.id}`);
        } else {
          console.error(`❌ Failed to create payroll ${payroll.id}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Test data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${userProfiles.length} user profiles`);
    console.log(`   • ${clients.length} clients`);
    console.log(`   • ${payrolls.length} payrolls`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Clean up test data
async function cleanTestData() {
  console.log('🧹 Cleaning test data...');

  const DELETE_TEST_DATA = `
    mutation CleanTestData {
      delete_payrolls(where: {id: {_like: "test-%"}}) {
        affected_rows
      }
      delete_clients(where: {id: {_like: "test-%"}}) {
        affected_rows
      }
      delete_users(where: {id: {_like: "test-%"}}) {
        affected_rows
      }
    }
  `;

  try {
    const result = await executeGraphQL(DELETE_TEST_DATA);
    console.log('✅ Test data cleaned:', result);
  } catch (error) {
    console.error('❌ Failed to clean test data:', error.message);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'seed':
    seedTestData();
    break;
  case 'clean':
    cleanTestData();
    break;
  case 'reseed':
    cleanTestData().then(() => {
      setTimeout(seedTestData, 1000);
    });
    break;
  default:
    console.log('Usage: node scripts/seed-test-data.js [seed|clean|reseed]');
    console.log('');
    console.log('Commands:');
    console.log('  seed    - Create test data');
    console.log('  clean   - Remove test data');
    console.log('  reseed  - Clean and recreate test data');
    break;
}
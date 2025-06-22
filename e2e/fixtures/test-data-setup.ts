// e2e/fixtures/test-data-setup.ts
// Playwright fixture for test data management

import { test as base, expect } from '@playwright/test';

export interface TestDataFixtures {
  testData: {
    clients: any[];
    payrolls: any[];
    employees: any[];
    cleanup: () => Promise<void>;
  };
}

export const test = base.extend<TestDataFixtures>({
  testData: async ({}, use) => {
    // Set up test data before each test
    const testClients = [
      {
        id: 'fixture-client-001',
        name: 'Test Client Alpha',
        email: 'alpha@test.payroll.com',
        status: 'active',
        contact_person: 'Alice Test',
        contact_email: 'alice@test.payroll.com',
        contact_phone: '+1-555-TEST-01',
        payroll_frequency: 'bi_weekly',
      },
      {
        id: 'fixture-client-002', 
        name: 'Test Client Beta',
        email: 'beta@test.payroll.com',
        status: 'active',
        contact_person: 'Bob Test',
        contact_email: 'bob@test.payroll.com',
        contact_phone: '+1-555-TEST-02',
        payroll_frequency: 'monthly',
      },
    ];

    const testPayrolls = [
      {
        id: 'fixture-payroll-001',
        clientId: 'fixture-client-001',
        status: 'completed',
        amount: 15000.00,
        payPeriodStart: '2024-01-01',
        payPeriodEnd: '2024-01-15',
      },
      {
        id: 'fixture-payroll-002',
        clientId: 'fixture-client-001',
        status: 'processing',
        amount: 16500.00,
        payPeriodStart: '2024-01-16',
        payPeriodEnd: '2024-01-31',
      },
      {
        id: 'fixture-payroll-003',
        clientId: 'fixture-client-002',
        status: 'draft',
        amount: 25000.00,
        payPeriodStart: '2024-01-01',
        payPeriodEnd: '2024-01-31',
      },
    ];

    const testEmployees = [
      {
        id: 'fixture-employee-001',
        clientId: 'fixture-client-001',
        firstName: 'John',
        lastName: 'Testman',
        email: 'john@test.payroll.com',
        position: 'Software Engineer',
        salary: 75000.00,
        isActive: true,
      },
      {
        id: 'fixture-employee-002',
        clientId: 'fixture-client-001',
        firstName: 'Jane',
        lastName: 'Testwoman',
        email: 'jane@test.payroll.com',
        position: 'Project Manager',
        salary: 85000.00,
        isActive: true,
      },
    ];

    // Cleanup function to remove test data
    const cleanup = async () => {
      // This would typically make API calls to clean up the test data
      console.log('🧹 Cleaning up test data...');
      
      // Example cleanup calls:
      // await deleteTestData('payrolls', testPayrolls.map(p => p.id));
      // await deleteTestData('employees', testEmployees.map(e => e.id));
      // await deleteTestData('clients', testClients.map(c => c.id));
    };

    // Provide the test data and cleanup function to tests
    await use({
      clients: testClients,
      payrolls: testPayrolls,
      employees: testEmployees,
      cleanup,
    });

    // Clean up after the test
    await cleanup();
  },
});

export { expect };
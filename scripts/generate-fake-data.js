// scripts/generate-fake-data.js
// Generate realistic fake data using faker.js

import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set seed for consistent fake data
faker.seed(12345);

export function generateFakeClients(count = 10) {
  return Array.from({ length: count }, (_, index) => ({
    id: `test-client-${String(index + 1).padStart(3, '0')}`,
    name: faker.company.name(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(['active', 'pending', 'inactive']),
    contact_person: faker.person.fullName(),
    contact_email: faker.internet.email(),
    contact_phone: faker.phone.number(),
    payroll_frequency: faker.helpers.arrayElement(['weekly', 'bi_weekly', 'monthly']),
    tax_id: `TEST${faker.number.int({ min: 100000000, max: 999999999 })}`,
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.stateAbbr()} ${faker.location.zipCode()}`,
    created_at: faker.date.recent({ days: 30 }).toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

export function generateFakePayrolls(clients, count = 20) {
  return Array.from({ length: count }, (_, index) => {
    const client = faker.helpers.arrayElement(clients);
    const startDate = faker.date.recent({ days: 60 });
    const endDate = new Date(startDate);
    
    // Calculate end date based on frequency
    switch (client.payroll_frequency) {
      case 'weekly':
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'bi_weekly':
        endDate.setDate(startDate.getDate() + 14);
        break;
      case 'monthly':
        endDate.setMonth(startDate.getMonth() + 1);
        break;
    }

    return {
      id: `test-payroll-${String(index + 1).padStart(3, '0')}`,
      clientId: client.id,
      status: faker.helpers.arrayElement(['draft', 'processing', 'completed', 'pending_approval', 'rejected']),
      amount: faker.number.float({ min: 5000, max: 100000, fractionDigits: 2 }),
      payPeriodStart: startDate.toISOString().split('T')[0],
      payPeriodEnd: endDate.toISOString().split('T')[0],
      processedAt: faker.helpers.maybe(() => faker.date.recent({ days: 10 }).toISOString()),
      created_at: faker.date.recent({ days: 45 }).toISOString(),
      updated_at: faker.date.recent({ days: 5 }).toISOString(),
    };
  });
}

export function generateFakeEmployees(clients, count = 50) {
  return Array.from({ length: count }, (_, index) => {
    const client = faker.helpers.arrayElement(clients);
    
    return {
      id: `test-employee-${String(index + 1).padStart(3, '0')}`,
      clientId: client.id,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      position: faker.person.jobTitle(),
      department: faker.commerce.department(),
      salary: faker.number.float({ min: 30000, max: 150000, fractionDigits: 2 }),
      hourlyRate: faker.number.float({ min: 15, max: 75, fractionDigits: 2 }),
      employmentType: faker.helpers.arrayElement(['full_time', 'part_time', 'contractor']),
      startDate: faker.date.past({ years: 3 }).toISOString().split('T')[0],
      isActive: faker.helpers.arrayElement([true, true, true, false]), // 75% active
      taxId: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
      created_at: faker.date.recent({ days: 90 }).toISOString(),
      updated_at: faker.date.recent({ days: 10 }).toISOString(),
    };
  });
}

export function generateFakeTimeEntries(employees, count = 200) {
  return Array.from({ length: count }, (_, index) => {
    const employee = faker.helpers.arrayElement(employees);
    const date = faker.date.recent({ days: 30 });
    const startTime = faker.date.recent({ days: 1 });
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + faker.number.int({ min: 6, max: 10 }));

    return {
      id: `test-timeentry-${String(index + 1).padStart(3, '0')}`,
      employeeId: employee.id,
      clientId: employee.clientId,
      date: date.toISOString().split('T')[0],
      startTime: startTime.toTimeString().split(' ')[0],
      endTime: endTime.toTimeString().split(' ')[0],
      hoursWorked: faker.number.float({ min: 6, max: 10, fractionDigits: 2 }),
      overtime: faker.number.float({ min: 0, max: 2, fractionDigits: 2 }),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      created_at: faker.date.recent({ days: 35 }).toISOString(),
      updated_at: faker.date.recent({ days: 7 }).toISOString(),
    };
  });
}

export function generateFakeAuditLogs(users, count = 100) {
  return Array.from({ length: count }, (_, index) => {
    const user = faker.helpers.arrayElement(users);
    
    return {
      id: `test-audit-${String(index + 1).padStart(3, '0')}`,
      userId: user.id,
      action: faker.helpers.arrayElement(['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']),
      entityType: faker.helpers.arrayElement(['client', 'payroll', 'employee', 'user', 'timeentry']),
      entityId: `test-entity-${faker.number.int({ min: 1, max: 100 })}`,
      dataClassification: faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      requestId: faker.string.uuid(),
      success: faker.helpers.arrayElement([true, true, true, false]), // 75% success rate
      created_at: faker.date.recent({ days: 30 }).toISOString(),
    };
  });
}

// Generate complete test dataset
export function generateCompleteTestDataset() {
  console.log('🎲 Generating fake test data...');
  
  const clients = generateFakeClients(10);
  const payrolls = generateFakePayrolls(clients, 25);
  const employees = generateFakeEmployees(clients, 75);
  const timeEntries = generateFakeTimeEntries(employees, 300);
  
  // Test users from our auth setup
  const users = [
    { id: 'test-developer-uuid-001', email: 'developer@test.payroll.com', role: 'developer' },
    { id: 'test-orgadmin-uuid-002', email: 'orgadmin@test.payroll.com', role: 'org_admin' },
    { id: 'test-manager-uuid-003', email: 'manager@test.payroll.com', role: 'manager' },
    { id: 'test-consultant-uuid-004', email: 'consultant@test.payroll.com', role: 'consultant' },
    { id: 'test-viewer-uuid-005', email: 'viewer@test.payroll.com', role: 'viewer' },
  ];
  
  const auditLogs = generateFakeAuditLogs(users, 150);

  return {
    clients,
    payrolls,
    employees,
    timeEntries,
    users,
    auditLogs,
  };
}

// Export data to JSON files
function exportToJson(data, filename) {
  const fs = require('fs');
  const path = require('path');
  
  const outputDir = 'test-data';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Exported ${data.length} records to ${filePath}`);
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'generate':
      const dataset = generateCompleteTestDataset();
      
      exportToJson(dataset.clients, 'clients.json');
      exportToJson(dataset.payrolls, 'payrolls.json');
      exportToJson(dataset.employees, 'employees.json');
      exportToJson(dataset.timeEntries, 'time-entries.json');
      exportToJson(dataset.auditLogs, 'audit-logs.json');
      
      console.log('\n📊 Test data generation completed!');
      console.log(`   • ${dataset.clients.length} clients`);
      console.log(`   • ${dataset.payrolls.length} payrolls`);
      console.log(`   • ${dataset.employees.length} employees`);
      console.log(`   • ${dataset.timeEntries.length} time entries`);
      console.log(`   • ${dataset.auditLogs.length} audit logs`);
      break;
      
    default:
      console.log('Usage: node scripts/generate-fake-data.js generate');
      break;
  }
}
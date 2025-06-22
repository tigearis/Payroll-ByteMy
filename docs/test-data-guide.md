# Test Data Management Guide

This guide explains how to create and manage fake database data for testing your Payroll application.

## 🎯 **Quick Start**

### 1. **Set Up Your Test Database**
```bash
# Update .env.test with your Hasura credentials
HASURA_ADMIN_SECRET=your_hasura_admin_secret_here
E2E_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
```

### 2. **Create Test Data**
```bash
# Seed basic test data
pnpm test:data:seed

# Generate lots of realistic fake data
pnpm test:data:generate

# Clean up test data
pnpm test:data:clean

# Clean and recreate
pnpm test:data:reseed
```

## 📊 **Available Commands**

| Command | Description |
|---------|-------------|
| `pnpm test:data:seed` | Create basic test data (clients, payrolls, users) |
| `pnpm test:data:clean` | Remove all test data |
| `pnpm test:data:reseed` | Clean and recreate test data |
| `pnpm test:data:generate` | Generate realistic fake data with faker.js |

## 🏗️ **Test Data Types**

### **Basic Test Data (seed)**
- **3 Test Clients** - Different payroll frequencies and statuses
- **4 Test Payrolls** - Various statuses (draft, processing, completed)
- **5 User Profiles** - Matching your Clerk test users

### **Realistic Fake Data (generate)**
- **10 Clients** - Company names, contacts, addresses
- **25 Payrolls** - Various amounts and periods
- **75 Employees** - Names, positions, salaries
- **300 Time Entries** - Clock in/out records
- **150 Audit Logs** - User activity tracking

## 🔧 **Configuration**

### **Environment Variables Required**
```bash
# In .env.test
HASURA_ADMIN_SECRET=your_hasura_admin_secret_here
E2E_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
```

### **Test Data Prefixes**
All test data uses prefixes to avoid conflicts:
- Clients: `test-client-001`, `test-client-002`, etc.
- Payrolls: `test-payroll-001`, `test-payroll-002`, etc.
- Employees: `test-employee-001`, `test-employee-002`, etc.
- Users: `test-developer-uuid-001`, etc.

## 🧪 **Using Test Data in E2E Tests**

### **Option 1: Use Pre-seeded Data**
```typescript
// In your test file
test('should display client list', async ({ page }) => {
  await page.goto('/clients');
  
  // These clients will exist from seeding
  await expect(page.locator('text=Acme Corporation')).toBeVisible();
  await expect(page.locator('text=Beta Industries')).toBeVisible();
});
```

### **Option 2: Use Test Fixtures**
```typescript
import { test, expect } from '../fixtures/test-data-setup';

test('should create new payroll', async ({ page, testData }) => {
  // testData.clients, testData.payrolls, testData.employees are available
  const client = testData.clients[0];
  
  await page.goto('/payrolls/new');
  await page.selectOption('[name="clientId"]', client.id);
  // Test continues...
});
```

### **Option 3: Create Data Per Test**
```typescript
test('should handle empty client list', async ({ page }) => {
  // Clean all data first
  await cleanTestData();
  
  await page.goto('/clients');
  await expect(page.locator('text=No clients found')).toBeVisible();
});
```

## 🎲 **Customizing Fake Data**

### **Modify Data Generators**
Edit `scripts/generate-fake-data.js` to customize:

```javascript
// Generate clients with specific criteria
export function generateFakeClients(count = 10) {
  return Array.from({ length: count }, (_, index) => ({
    id: `test-client-${String(index + 1).padStart(3, '0')}`,
    name: faker.company.name(),
    // Add your custom fields here
    industry: faker.commerce.department(),
    revenue: faker.number.float({ min: 100000, max: 10000000 }),
    // ...
  }));
}
```

### **Add New Data Types**
```javascript
export function generateFakeContracts(clients, count = 15) {
  return Array.from({ length: count }, (_, index) => ({
    id: `test-contract-${String(index + 1).padStart(3, '0')}`,
    clientId: faker.helpers.arrayElement(clients).id,
    startDate: faker.date.recent({ days: 90 }),
    endDate: faker.date.future({ years: 2 }),
    value: faker.number.float({ min: 10000, max: 500000 }),
    status: faker.helpers.arrayElement(['active', 'pending', 'expired']),
  }));
}
```

## 🔄 **Database Schema Considerations**

### **Required Fields**
Make sure your test data includes all required database fields:

```javascript
// Example client with all required fields
{
  id: 'test-client-001',           // Primary key
  name: 'Acme Corporation',        // Required
  email: 'contact@acme.test',      // Required + unique
  status: 'active',                // Required enum
  created_at: new Date().toISOString(), // Auto-generated
  updated_at: new Date().toISOString(), // Auto-generated
  // Optional fields
  contact_person: 'John Doe',
  contact_email: 'john@acme.test',
  // ...
}
```

### **Foreign Key Relationships**
Ensure proper relationships between entities:

```javascript
// Payroll must reference existing client
{
  id: 'test-payroll-001',
  clientId: 'test-client-001',  // Must exist in clients table
  // ...
}
```

## 🚨 **Data Isolation & Cleanup**

### **Automatic Cleanup**
Test data is automatically cleaned up:
- After each test (using fixtures)
- When running `pnpm test:data:clean`
- Before reseeding with `pnpm test:data:reseed`

### **Manual Cleanup**
```javascript
// Clean specific data types
const DELETE_CLIENTS = `
  mutation CleanClients {
    delete_clients(where: {id: {_like: "test-%"}}) {
      affected_rows
    }
  }
`;
```

### **Preventing Data Conflicts**
- Use unique ID prefixes (`test-`, `fixture-`)
- Use test-specific email domains (`@test.payroll.com`)
- Set faker seed for consistent data (`faker.seed(12345)`)

## 🏃‍♂️ **Performance Tips**

### **Batch Operations**
```javascript
// Insert multiple records at once
const BATCH_INSERT_CLIENTS = `
  mutation BatchInsertClients($clients: [clients_insert_input!]!) {
    insert_clients(objects: $clients) {
      affected_rows
    }
  }
`;
```

### **Minimal Data Sets**
- Use small data sets for unit tests
- Use larger data sets for integration tests
- Only create data you actually need for the test

### **Parallel-Safe Tests**
- Use unique IDs per test run
- Avoid shared global state
- Clean up data in `afterEach` hooks

## 🔍 **Debugging Test Data**

### **Verify Data Creation**
```bash
# Check what data exists
pnpm test:data:seed
# Then query your database or Hasura console
```

### **Common Issues**
1. **Foreign Key Errors**: Ensure parent records exist before children
2. **Unique Constraint Violations**: Use unique IDs and emails
3. **Permission Errors**: Verify Hasura admin secret is correct
4. **Schema Mismatches**: Update test data when schema changes

### **Logging & Inspection**
```javascript
// Add logging to your data generation
console.log('Creating client:', JSON.stringify(client, null, 2));
```

## 📝 **Best Practices**

1. **Keep Data Minimal**: Only create data you need for the test
2. **Use Realistic Data**: Use faker.js for realistic names, emails, etc.
3. **Consistent Naming**: Use clear prefixes and naming conventions
4. **Clean Up**: Always clean up test data after tests
5. **Document Relationships**: Clearly document data dependencies
6. **Version Control**: Don't commit actual test data, only generators
7. **Environment Isolation**: Use separate test databases/schemas
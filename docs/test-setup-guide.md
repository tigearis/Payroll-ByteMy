# E2E Test Environment Setup Guide

This guide will walk you through setting up your Clerk test environment and creating test users for E2E testing.

## Step 1: Create Clerk Test Environment

### 1.1 Access Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign in to your account
3. You should see your current production application

### 1.2 Create Test Application
1. Click the application dropdown (top-left)
2. Click "Create application"
3. Name it: `Payroll ByteMy - Test`
4. Select the same authentication methods as your production app
5. Click "Create application"

### 1.3 Get Test Environment Keys
1. In your new test application, go to "API Keys" in the sidebar
2. Copy the "Publishable key" (starts with `pk_test_`)
3. Copy the "Secret key" (starts with `sk_test_`)
4. Go to "Webhooks" → "Add Endpoint" to get webhook secret if needed

## Step 2: Configure Test Environment

### 2.1 Update .env.test File
Replace the placeholder values in `.env.test` with your actual test keys:

```bash
# Replace these with your actual test keys from Clerk Dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_[your_actual_test_key]
CLERK_SECRET_KEY=sk_test_[your_actual_test_key]
CLERK_WEBHOOK_SECRET=whsec_[your_actual_webhook_secret]
```

### 2.2 Configure JWT Template for Test Environment
1. In Clerk Dashboard (test app), go to "JWT Templates"
2. Click "New template"
3. Name it: `hasura-test`
4. Use this configuration:

```json
{
  "https://hasura.io/jwt/claims": {
    "metadata": "{{user.public_metadata}}",
    "x-hasura-role": "{{user.public_metadata.role}}",
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": [
      "developer",
      "org_admin", 
      "manager",
      "consultant",
      "viewer"
    ],
    "x-hasura-clerk-user-id": "{{user.id}}"
  }
}
```

## Step 3: Create Test Users

### 3.1 Manual User Creation (Recommended)
1. In Clerk Dashboard (test app), go to "Users"
2. Click "Create user"
3. Create each test user with these details:

#### Developer User
- **Email**: `developer@test.payroll.com`
- **Password**: `TestPassword123!`
- **Public Metadata**:
```json
{
  "role": "developer",
  "permissions": ["custom:payroll:read", "custom:payroll:write", "custom:payroll:delete", "custom:payroll:assign", "custom:staff:read", "custom:staff:write", "custom:staff:delete", "custom:staff:invite", "custom:client:read", "custom:client:write", "custom:client:delete", "custom:admin:manage", "custom:settings:write", "custom:billing:manage", "custom:reports:read", "custom:reports:export", "custom:audit:read", "custom:audit:write"],
  "databaseId": "test-developer-uuid"
}
```

#### Org Admin User
- **Email**: `orgadmin@test.payroll.com`
- **Password**: `TestPassword123!`
- **Public Metadata**:
```json
{
  "role": "org_admin",
  "permissions": ["custom:payroll:read", "custom:payroll:write", "custom:staff:read", "custom:staff:write", "custom:client:read", "custom:client:write", "custom:admin:manage", "custom:settings:write", "custom:reports:read"],
  "databaseId": "test-orgadmin-uuid"
}
```

#### Manager User
- **Email**: `manager@test.payroll.com`
- **Password**: `TestPassword123!`
- **Public Metadata**:
```json
{
  "role": "manager",
  "permissions": ["custom:payroll:read", "custom:staff:read", "custom:client:read", "custom:reports:read"],
  "databaseId": "test-manager-uuid"
}
```

#### Consultant User
- **Email**: `consultant@test.payroll.com`
- **Password**: `TestPassword123!`
- **Public Metadata**:
```json
{
  "role": "consultant",
  "permissions": ["custom:payroll:read", "custom:client:read"],
  "databaseId": "test-consultant-uuid"
}
```

#### Viewer User
- **Email**: `viewer@test.payroll.com`
- **Password**: `TestPassword123!`
- **Public Metadata**:
```json
{
  "role": "viewer",
  "permissions": ["custom:payroll:read"],
  "databaseId": "test-viewer-uuid"
}
```

#### General Test User
- **Email**: `test@payroll.com`
- **Password**: `TestPassword123!`
- **Public Metadata**:
```json
{
  "role": "viewer",
  "permissions": ["custom:payroll:read"],
  "databaseId": "test-general-uuid"
}
```

### 3.2 Automated User Creation Script
Alternatively, you can use this script to create users via Clerk API:

```javascript
// scripts/create-test-users.js
import { Clerk } from '@clerk/clerk-sdk-node';

const clerk = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY
});

const testUsers = [
  {
    emailAddress: 'developer@test.payroll.com',
    password: 'TestPassword123!',
    publicMetadata: {
      role: 'developer',
      permissions: [/* full permissions array */],
      databaseId: 'test-developer-uuid'
    }
  },
  // ... other users
];

async function createTestUsers() {
  for (const userData of testUsers) {
    try {
      const user = await clerk.users.createUser(userData);
      console.log(`Created user: ${user.emailAddresses[0].emailAddress}`);
    } catch (error) {
      console.error(`Error creating user ${userData.emailAddress}:`, error);
    }
  }
}

createTestUsers();
```

## Step 4: Test Database Setup

### 4.1 Create Test Database
```bash
# Using PostgreSQL
createdb payroll_test

# Or using Docker
docker run --name payroll-test-db \
  -e POSTGRES_DB=payroll_test \
  -e POSTGRES_USER=test_user \
  -e POSTGRES_PASSWORD=test_password \
  -p 5433:5432 \
  -d postgres:15
```

### 4.2 Run Database Migrations
```bash
# Apply Hasura metadata and migrations to test database
cd hasura
hasura migrate apply --database-name default --endpoint http://localhost:8080
hasura metadata apply --endpoint http://localhost:8080
```

## Step 5: Hasura Test Configuration

### 5.1 Set up Test Hasura Instance
1. Configure Hasura to use your test database
2. Update JWT secret to match your test Clerk configuration
3. Apply all metadata and permissions to test instance

### 5.2 Update Environment Variables
```bash
# Update .env.test with your test Hasura endpoint
E2E_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
HASURA_SERVICE_ACCOUNT_TOKEN=your_test_service_account_token
```

## Step 6: Verify Test Setup

### 6.1 Test Authentication
```bash
# Run a quick test to verify everything works
pnpm test:e2e auth.spec.ts
```

### 6.2 Test Permissions
```bash
# Run permission tests
pnpm test:e2e permissions.spec.ts
```

## Step 7: Security Checklist

- [ ] Test environment uses separate Clerk application
- [ ] Test users have different email domain (@test.payroll.com)
- [ ] Test database is isolated from production
- [ ] Test Hasura instance is separate from production
- [ ] `.env.test` is in `.gitignore`
- [ ] Test credentials are documented but not committed
- [ ] Production keys are never used in test files

## Troubleshooting

### Common Issues:

1. **Authentication Fails**: Check Clerk test keys are correct
2. **Permission Errors**: Verify user metadata and JWT template
3. **Database Connection**: Ensure test database is running and accessible
4. **Hasura Errors**: Check metadata and permissions are applied

### Debug Commands:
```bash
# Check test environment variables
cat .env.test

# Test Clerk connection
curl -X GET "https://api.clerk.com/v1/users" \
  -H "Authorization: Bearer sk_test_your_secret_key"

# Test Hasura connection
curl -X POST "http://localhost:8080/v1/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"query{__typename}"}'
```

## Next Steps

Once setup is complete:
1. Run full E2E test suite: `pnpm test:e2e`
2. Set up CI/CD with GitHub Secrets
3. Document any environment-specific configurations
4. Schedule regular test runs
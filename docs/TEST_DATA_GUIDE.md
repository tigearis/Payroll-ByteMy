# Test Data Setup Guide

## Overview

This guide covers setting up test data for E2E testing in the payroll application. The test data infrastructure is designed to work with the actual Hasura schema and permission system.

## Quick Start

```bash
# Complete E2E test setup (recommended)
pnpm test:setup

# OR manual setup:
# 1. Create test users in Clerk
pnpm test:users:create

# 2. Sync users to database
pnpm test:users:sync

# 3. Seed test data
pnpm test:data:seed

# 4. Run E2E tests
pnpm test:e2e
```

## Available Scripts

### Test Data Scripts

| Command | Description | Script |
|---------|-------------|--------|
| `pnpm test:data:seed` | Seed minimal working test data | `scripts/seed-minimal-data.js` |
| `pnpm test:data:clean` | Clean test data | `scripts/seed-minimal-data.js clean` |
| `pnpm test:data:reseed` | Clean then seed | `scripts/seed-minimal-data.js reseed` |
| `pnpm test:data:minimal` | Alias for seed | `scripts/seed-minimal-data.js seed` |

### Legacy Scripts (Not Working)

These scripts attempt to use tables without insert permissions:

| Command | Status | Issue |
|---------|--------|-------|
| `pnpm test:data:real` | ❌ Fails | No insert permissions for core tables |
| `pnpm test:data:quick` | ❌ Fails | Attempts to insert into clients/payrolls |

### Test Setup Scripts

| Command | Description |
|---------|-------------|
| `pnpm test:setup` | **Complete E2E setup** (users + sync + data) |

### Test User Scripts

| Command | Description |
|---------|-------------|
| `pnpm test:users:create` | Create test users in Clerk |
| `pnpm test:users:sync` | **Sync users from Clerk to database** |
| `pnpm test:users:sync:direct` | Direct database sync (bypass API) |
| `pnpm test:users:sync:check` | Check server status |
| `pnpm test:users:list` | List existing test users |
| `pnpm test:users:delete` | Delete test users |
| `pnpm test:users:recreate` | Delete and recreate users |

## Working Test Data

The minimal seeding script creates data in tables that have insert permissions:

### ✅ Successfully Seeds

- **Billing Plans** (2 plans)
  - Basic Plan: $25 CAD per payroll
  - Premium Plan: $45 CAD per payroll

- **External Systems** (1 system)
  - Test External System with URL

- **Feature Flags** (2 flags)
  - `test_feature_enabled` (developer, org_admin)
  - `e2e_testing_mode` (developer only)

### ⚠️ Partial Success (Unique Constraints)

- **Payroll Cycles** (attempts 3, may fail on duplicates)
  - weekly, fortnightly, monthly

- **Payroll Date Types** (attempts 2, may fail on duplicates)
  - fixed_date, eom (end of month)

### ✅ User Sync (Via API/Webhooks)

- **Users** - Synced from Clerk to database via `/api/sync-current-user` or webhooks
  - Test users created in Clerk with `pnpm test:users:create`
  - Users synced to database with `pnpm test:users:sync`
  - Database IDs assigned and stored in Clerk metadata

### ❌ Cannot Seed (No Insert Permissions)

- **Clients** - No `insert_clients_one` mutation available  
- **Payrolls** - No `insert_payrolls_one` mutation available
- **Payroll Dates** - No `insert_payroll_dates_one` mutation available
- **Payroll Assignments** - No `insert_payroll_assignments_one` mutation available

## Hasura Permissions Analysis

Based on schema inspection, the following tables have insert mutations:

```bash
# Tables WITH insert permissions:
insert_billing_plan_one
insert_external_systems_one
insert_feature_flags_one
insert_payroll_cycles_one
insert_payroll_date_types_one
insert_notes_one

# Tables WITHOUT insert permissions:
insert_users_one          # Missing
insert_clients_one        # Missing
insert_payrolls_one       # Missing
insert_payroll_dates_one  # Missing
```

## Test User Management

Test users are managed through a two-step process:

### Step 1: Create Users in Clerk
```bash
# Create 5 test users with proper roles
pnpm test:users:create

# Users created:
developer@test.payroll.com    (Developer role)
orgadmin@test.payroll.com     (Org Admin role)
manager@test.payroll.com      (Manager role)
consultant@test.payroll.com   (Consultant role)
viewer@test.payroll.com       (Viewer role)
```

### Step 2: Sync Users to Database
```bash
# IMPORTANT: Start the dev server first
pnpm dev

# Then in another terminal, sync users to database
pnpm test:users:sync

# OR use the complete setup command
pnpm test:setup
```

**⚠️ Critical Note:** User sync requires the Next.js server to be running because:
- Users cannot be inserted directly into the database (no `insert_users_one` permission)
- Sync must happen via API endpoints (`/api/sync-current-user` or `/api/fix-user-sync`)
- These endpoints handle the proper Clerk ↔ Database synchronization with metadata

### Test User Credentials

Stored in `.env.test`:

```env
E2E_DEVELOPER_EMAIL=developer@test.payroll.com
E2E_DEVELOPER_PASSWORD=DevSecure789!xyz

E2E_ORG_ADMIN_EMAIL=orgadmin@test.payroll.com
E2E_ORG_ADMIN_PASSWORD=OrgAdmin789!xyz

# ... etc
```

## E2E Test Integration

The E2E tests use authentication states for each role:

```typescript
// Auth setup for each role
test.use({ storageState: 'e2e/auth/developer.json' });
test.use({ storageState: 'e2e/auth/orgadmin.json' });
test.use({ storageState: 'e2e/auth/manager.json' });
test.use({ storageState: 'e2e/auth/consultant.json' });
test.use({ storageState: 'e2e/auth/viewer.json' });
```

## Troubleshooting

### Common Issues

1. **Insert mutations not found**
   ```
   field 'insert_users_one' not found in type: 'mutation_root'
   ```
   **Solution**: Use `pnpm test:data:seed` (minimal data) instead of legacy scripts

2. **Uniqueness violations**
   ```
   duplicate key value violates unique constraint "payroll_cycles_name_key"
   ```
   **Solution**: Run `pnpm test:data:clean` then `pnpm test:data:seed`

3. **JWT token errors in tests**
   ```
   Could not verify JWT: JWSError
   ```
   **Solution**: Ensure test users exist in Clerk and `.env.test` is configured

4. **Hasura connection failed**
   ```
   Connection failed: 401 Unauthorized
   ```
   **Solution**: Check `HASURA_ADMIN_SECRET` in `.env.test`

### Configuration Check

Verify your `.env.test` file has:

```env
# Hasura
E2E_HASURA_GRAPHQL_URL=https://bytemy.hasura.app/v1/graphql
HASURA_ADMIN_SECRET="your_admin_secret_here"

# Clerk Test Environment
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."

# Test User Passwords
E2E_DEVELOPER_PASSWORD=DevSecure789!xyz
E2E_ORG_ADMIN_PASSWORD=OrgAdmin789!xyz
# ... etc
```

## Recommendations

1. **Use minimal seeding**: `pnpm test:data:seed` works reliably
2. **Manage users via Clerk**: Use `pnpm test:users:create` for user setup
3. **Test with real data**: The working test data (billing plans, feature flags) is sufficient for most E2E scenarios
4. **Fix Hasura permissions**: To enable full data seeding, configure insert permissions for core tables in Hasura

## Current Status

✅ **Working**: Authentication tests, permission boundary tests, basic data seeding  
⚠️ **Limited**: Core business data requires Hasura permission configuration  
🎯 **Goal**: Full end-to-end testing with realistic payroll data

The current setup provides a solid foundation for E2E testing of authentication and permissions, with room for expansion once Hasura permissions are configured for core business tables.
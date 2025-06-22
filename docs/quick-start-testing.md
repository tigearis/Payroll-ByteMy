# Quick Start: E2E Testing Setup

## 🚀 **5-Minute Setup Guide**

### Step 1: Get Your Clerk Test Keys (2 minutes)

1. **Go to [Clerk Dashboard](https://dashboard.clerk.com)**
2. **Create new test application:**
   - Click application dropdown → "Create application"
   - Name: `Payroll ByteMy - Test`
   - Click "Create application"
3. **Copy your test keys:**
   - Go to "API Keys" 
   - Copy `Publishable key` (starts with `pk_test_`)
   - Copy `Secret key` (starts with `sk_test_`)

### Step 2: Update Test Environment (1 minute)

**Edit `.env.test` file and replace these lines:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_[paste_your_key_here]
CLERK_SECRET_KEY=sk_test_[paste_your_key_here]
```

### Step 3: Create Test Users (2 minutes)

**Run the automated script:**
```bash
pnpm test:users:create
```

This creates 6 test users with different roles:
- `developer@test.payroll.com` (Developer - full access)
- `orgadmin@test.payroll.com` (Org Admin - admin access)
- `manager@test.payroll.com` (Manager - read access)
- `consultant@test.payroll.com` (Consultant - limited access)
- `viewer@test.payroll.com` (Viewer - minimal access)
- `test@payroll.com` (General test user)

All passwords: `TestPassword123!`

### Step 4: Run Tests! 

**Start your test suite:**
```bash
# Run all E2E tests
pnpm test:e2e

# Or run in UI mode to see what's happening
pnpm test:e2e:ui
```

---

## 🔧 **Manual Setup (if automated fails)**

### Create Users Manually in Clerk Dashboard:

1. **Go to your Clerk test app → "Users" → "Create user"**

2. **For each user, set:**
   - Email address
   - Password: `TestPassword123!`
   - Public Metadata (click "Add metadata"):

**Developer User:**
```json
{
  "role": "developer",
  "permissions": ["custom:payroll:read", "custom:payroll:write", "custom:payroll:delete", "custom:payroll:assign", "custom:staff:read", "custom:staff:write", "custom:staff:delete", "custom:staff:invite", "custom:client:read", "custom:client:write", "custom:client:delete", "custom:admin:manage", "custom:settings:write", "custom:billing:manage", "custom:reports:read", "custom:reports:export", "custom:audit:read", "custom:audit:write"],
  "databaseId": "test-developer-001"
}
```

**Org Admin User:**
```json
{
  "role": "org_admin", 
  "permissions": ["custom:payroll:read", "custom:payroll:write", "custom:staff:read", "custom:staff:write", "custom:client:read", "custom:client:write", "custom:admin:manage", "custom:settings:write", "custom:reports:read"],
  "databaseId": "test-orgadmin-002"
}
```

**Manager User:**
```json
{
  "role": "manager",
  "permissions": ["custom:payroll:read", "custom:staff:read", "custom:client:read", "custom:reports:read"],
  "databaseId": "test-manager-003"
}
```

**Consultant User:**
```json
{
  "role": "consultant",
  "permissions": ["custom:payroll:read", "custom:client:read"],
  "databaseId": "test-consultant-004"
}
```

**Viewer User:**
```json
{
  "role": "viewer",
  "permissions": ["custom:payroll:read"],
  "databaseId": "test-viewer-005"
}
```

---

## 🎯 **Test Commands**

```bash
# User management
pnpm test:users:list      # List existing test users
pnpm test:users:delete    # Delete all test users  
pnpm test:users:recreate  # Delete and recreate all users

# Running tests
pnpm test:e2e            # Run all E2E tests
pnpm test:e2e:ui         # Run with visual UI
pnpm test:e2e:headed     # Run with browser visible
pnpm test:e2e:debug      # Debug mode
pnpm test:e2e:report     # View test report

# Specific test suites
pnpm test:e2e auth.spec.ts           # Just authentication tests
pnpm test:e2e permissions.spec.ts    # Just permission tests
pnpm test:e2e route-protection.spec.ts    # Just route protection
pnpm test:e2e graphql-permissions.spec.ts # Just GraphQL permissions
```

---

## ✅ **Verification Checklist**

- [ ] Clerk test app created
- [ ] Test keys updated in `.env.test`
- [ ] 6 test users created successfully  
- [ ] Users have correct roles and permissions
- [ ] Basic auth test passes: `pnpm test:e2e auth.spec.ts`
- [ ] All permission tests pass: `pnpm test:e2e permissions.spec.ts`

---

## 🆘 **Troubleshooting**

**❌ "Authentication failed"**
- Check test keys in `.env.test` are correct
- Verify you're using `pk_test_` and `sk_test_` keys (not production)

**❌ "User creation failed"** 
- Check Clerk secret key is valid
- Try manual user creation in Clerk Dashboard

**❌ "Permission denied in tests"**
- Verify user metadata includes correct `role` and `permissions`
- Check JWT template is configured in Clerk Dashboard

**❌ "Tests timeout"**
- Make sure dev server is running: `pnpm dev`
- Check if localhost:3000 is accessible

---

## 🔒 **Security Notes**

- **NEVER use production keys** in test files
- Test users should only exist in test environment  
- Use `@test.payroll.com` email domain for test users
- Test database should be separate from production
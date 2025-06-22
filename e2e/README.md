# E2E Testing Suite

This directory contains comprehensive end-to-end tests for the authentication and permission systems of the Payroll application.

## Test Coverage

### Authentication Tests (`auth.spec.ts`)
- Sign-in/sign-out flows
- Session persistence
- Session expiration handling
- Form validation
- Network error handling
- Redirect behavior for protected routes

### Permission Tests (`permissions.spec.ts`)
- Role-based access control for all 5 roles:
  - Developer (level 5) - Full access
  - Org Admin (level 4) - Admin access without developer features
  - Manager (level 3) - Read access to management features
  - Consultant (level 2) - Limited read access to assigned data
  - Viewer (level 1) - Dashboard-only access
- CRUD permission validation
- UI element visibility based on roles
- Navigation restrictions

### Route Protection Tests (`route-protection.spec.ts`)
- Unauthenticated access redirects
- API route protection
- Role-based route access
- Deep link protection
- Session validation
- Concurrent session handling

### GraphQL Permission Tests (`graphql-permissions.spec.ts`)
- Operation-level permissions
- Field-level access control
- Row-level security validation
- Privilege escalation prevention
- Cross-role permission consistency

## Setup

### 1. Install Dependencies
```bash
pnpm install
pnpx playwright install
```

### 2. Configure Test Environment
```bash
cp .env.test.example .env.test
# Edit .env.test with your test credentials
```

### 3. Set Up Test Users
Create test users in your Clerk test environment with the following roles:
- developer@test.payroll.com (Developer role)
- orgadmin@test.payroll.com (Org Admin role)
- manager@test.payroll.com (Manager role)
- consultant@test.payroll.com (Consultant role)
- viewer@test.payroll.com (Viewer role)

## Running Tests

### Run All E2E Tests
```bash
pnpm test:e2e
```

### Run Tests in UI Mode
```bash
pnpm test:e2e:ui
```

### Run Tests in Headed Mode
```bash
pnpm test:e2e:headed
```

### Debug Tests
```bash
pnpm test:e2e:debug
```

### View Test Report
```bash
pnpm test:e2e:report
```

## Test Architecture

### Authentication Setup (`auth.setup.ts`)
- Pre-authenticates users for each role
- Stores authentication state in fixtures
- Enables parallel test execution with different roles

### Test Utilities (`utils/`)
- `test-config.ts` - Configuration constants and test data
- `auth-helpers.ts` - Authentication helper functions
- `fixtures/.auth/` - Stored authentication states

### Test Data Selectors
All UI element selectors are centralized in `utils/test-config.ts` for maintainability:
- Authentication elements
- Navigation elements
- Role-specific elements
- Error state elements

## Security Considerations

### Test User Management
- Test users should only exist in test environments
- Use environment-specific email domains
- Rotate test passwords regularly
- Monitor test user activity

### Data Isolation
- Tests should not affect production data
- Use test-specific database instances
- Clean up test data after runs

### Credential Management
- Never commit actual credentials to version control
- Use environment variables for test credentials
- Use GitHub Secrets for CI/CD

## CI/CD Integration

### GitHub Actions Workflow (`.github/workflows/e2e-tests.yml`)
- Runs on push to main/develop branches
- Runs on pull requests
- Sets up test environment
- Runs security scans
- Uploads test artifacts

### Required Secrets
Configure these secrets in your GitHub repository:
- `E2E_TEST_EMAIL` / `E2E_TEST_PASSWORD`
- `E2E_DEVELOPER_EMAIL` / `E2E_DEVELOPER_PASSWORD`
- `E2E_ORG_ADMIN_EMAIL` / `E2E_ORG_ADMIN_PASSWORD`
- `E2E_MANAGER_EMAIL` / `E2E_MANAGER_PASSWORD`
- `E2E_CONSULTANT_EMAIL` / `E2E_CONSULTANT_PASSWORD`
- `E2E_VIEWER_EMAIL` / `E2E_VIEWER_PASSWORD`

## Debugging

### Common Issues

1. **Authentication Failures**
   - Verify test user credentials
   - Check Clerk test environment configuration
   - Ensure test users have correct roles assigned

2. **Permission Test Failures**
   - Verify Hasura permissions are correctly configured
   - Check role hierarchy in `lib/auth/permissions.ts`
   - Ensure GraphQL schema matches permission expectations

3. **Route Protection Failures**
   - Verify middleware configuration
   - Check Next.js App Router setup
   - Ensure protected routes are correctly configured

### Test Data Management
- Tests should be idempotent and not depend on specific data states
- Use factories or fixtures for consistent test data
- Clean up created data in test teardown

## Extending Tests

### Adding New Role Tests
1. Add role configuration to `utils/test-config.ts`
2. Create authentication setup in `auth.setup.ts`
3. Add role-specific tests to `permissions.spec.ts`
4. Update route protection tests as needed

### Adding New Permission Tests
1. Define new GraphQL operations in `utils/test-config.ts`
2. Add permission boundary tests to `graphql-permissions.spec.ts`
3. Update UI permission tests in `permissions.spec.ts`

### Adding New Routes
1. Update protected routes configuration
2. Add route tests to `route-protection.spec.ts`
3. Update navigation tests as needed

## Best Practices

1. **Test Independence**: Each test should be able to run independently
2. **Clear Assertions**: Use descriptive test names and clear assertions
3. **Page Object Model**: Consider implementing page objects for complex interactions
4. **Wait Strategies**: Use proper wait strategies for dynamic content
5. **Error Handling**: Test both happy path and error scenarios
6. **Security Focus**: Always test permission boundaries and privilege escalation attempts
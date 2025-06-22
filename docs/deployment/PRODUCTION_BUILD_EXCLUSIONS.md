# Production Build Exclusions

This document describes how the production build excludes development and testing files.

## Excluded Files and Directories

The following are excluded from production builds:

### 1. E2E and Test Files
- `/e2e/**/*` - End-to-end tests
- `/tests/**/*` - Unit and integration tests
- `/__tests__/**/*` - Jest test directories
- `/cypress/**/*` - Cypress tests
- `**/*.test.ts(x)` - Test files
- `**/*.spec.ts(x)` - Spec files
- `playwright.config.ts` - Playwright configuration
- `jest.config.*` - Jest configuration

### 2. Development API Routes
- `/app/api/dev/**/*` - Development-only API routes (e.g., actor tokens)

## Implementation

### 1. TypeScript Exclusions (`tsconfig.json`)
```json
"exclude": [
  "node_modules",
  "playwright.config.ts",
  "jest.config.*",
  "e2e/**/*",
  "cypress/**/*",
  "**/*.test.ts",
  "**/*.spec.ts"
]
```

### 2. Webpack Configuration (`next.config.js`)
- Uses `webpack.IgnorePlugin` to exclude test patterns
- Uses `null-loader` for test files and directories
- Configures `resolve.alias` to prevent resolution of test paths
- Adds custom externals to prevent bundling e2e files

### 3. Next.js Features
- `outputFileTracingExcludes` to exclude files from output tracing
- Rewrites and redirects to handle dev routes in production

### 4. Production Safeguards
- Dev API routes check `NODE_ENV` and throw errors in production
- Redirects ensure dev routes return 404 in production

## Verification

Run `pnpm verify:production` to check that all exclusions are working correctly.

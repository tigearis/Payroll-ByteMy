# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is **Payroll Matrix**, an enterprise-grade SOC2-compliant payroll management system built with Next.js 15, React 19, TypeScript, and Hasura GraphQL. The application follows domain-driven design (DDD) with 11 isolated business domains.

### Tech Stack
- **Frontend**: Next.js 15 App Router, React 19, TypeScript 5.8
- **Authentication**: Clerk with JWT integration and MFA
- **Database**: PostgreSQL (Neon) with Row Level Security
- **API**: Hasura GraphQL Engine with custom business logic
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Apollo Client with optimistic updates
- **Testing**: Playwright for E2E, Jest for unit tests

### Domain Structure
The codebase is organized into isolated business domains under `/domains/`:
- **auth** (CRITICAL) - Authentication and authorization
- **audit** (CRITICAL) - SOC2 compliance and logging  
- **permissions** (CRITICAL) - Role-based access control
- **users** (HIGH) - User management and staff lifecycle
- **clients** (HIGH) - Client relationship management
- **billing** (HIGH) - Financial operations
- **payrolls** (MEDIUM) - Core payroll processing
- **notes** (MEDIUM) - Documentation and communication
- **leave** (MEDIUM) - Employee leave management
- **work-schedule** (MEDIUM) - Staff scheduling
- **external-systems** (MEDIUM) - Third-party integrations

Each domain follows this structure:
```
domains/{domain}/
├── components/     # React components
├── graphql/        # GraphQL operations and generated types
├── hooks/          # React hooks
├── services/       # Business logic
├── types/          # TypeScript definitions
└── index.ts        # Domain exports
```

## Development Commands

### Core Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production (✅ **Currently passing - all TypeScript errors resolved**)
- `pnpm build:production` - Production build with NODE_ENV=production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm lint:strict` - Strict linting with zero warnings
- `pnpm type-check` - TypeScript type checking
- `pnpm quality:check` - Run lint, format check, and type check
- `pnpm quality:fix` - Fix lint and format issues

### GraphQL Development
- `pnpm codegen` - Generate GraphQL types from schema
- `pnpm codegen:watch` - Watch mode for GraphQL code generation
- `pnpm codegen:debug` - Verbose GraphQL codegen with debugging
- `pnpm codegen:dry-run` - Check GraphQL codegen without writing files
- `pnpm get-schema` - Fetch latest schema from Hasura

### Testing
- `pnpm test:e2e` - Run Playwright E2E tests
- `pnpm test:e2e:ui` - Run E2E tests with UI
- `pnpm test:e2e:headed` - Run E2E tests in headed mode
- `pnpm test:e2e:debug` - Debug E2E tests

### Database & Hasura
- `pnpm hasura:console` - Open Hasura console
- `pnpm hasura:migrate` - Apply database migrations
- `pnpm hasura:metadata` - Apply Hasura metadata

### Data Management
- `pnpm test:data:seed` - Seed test data
- `pnpm test:data:clean` - Clean test data
- `pnpm test:data:reseed` - Clean and reseed test data

## GraphQL Development Guidelines

### Code Generation Strategy
The project uses a domain-driven GraphQL code generation approach:
- Each domain generates self-contained TypeScript types
- Shared fragments are available across all domains
- SOC2 security classifications are enforced
- Client preset is used for modern React/Apollo patterns

### Important Files
- `config/codegen.ts` - GraphQL code generation configuration
- `shared/schema/schema.graphql` - Complete GraphQL schema
- `shared/schema/introspection.json` - Schema introspection
- `shared/types/generated/` - Shared GraphQL types

### Working with GraphQL
1. Use the introspection.json, schema.graphql and Hasura metadata when creating GraphQL operations
2. Domain-specific operations go in `domains/{domain}/graphql/`
3. Shared fragments and queries go in `shared/graphql/`
4. Always run `pnpm codegen` after modifying GraphQL files
5. Use the generated types for type safety

## Security & Compliance

This is a SOC2-compliant system with enterprise-grade security:
- **Role-based access control** with 5-tier hierarchy (Developer → Org Admin → Manager → Consultant → Viewer)
- **Data classification** system (CRITICAL, HIGH, MEDIUM, LOW)
- **Comprehensive audit logging** for all user actions
- **Component-level permission guards** protecting sensitive UI
- **API-level authentication and authorization** on all endpoints

### Permission System
- Use `PermissionGuard` components to protect UI elements
- Check permissions with `useEnhancedPermissions` hook
- All sensitive operations require proper role validation
- Database has row-level security enabled

### Enhanced Authentication & Security (2025-06-28)
✅ **Enterprise-grade security implementation** with comprehensive JWT validation and role monitoring:

#### **JWT Template Security**
- **Dynamic Role Hierarchy**: JWT template now uses `{{user.public_metadata.allowedRoles}}` instead of hardcoded roles
- **Recommended JWT Template**:
```json
{
    "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
        "x-hasura-default-role": "{{user.public_metadata.role || 'viewer'}}",
        "x-hasura-allowed-roles": "{{user.public_metadata.allowedRoles || ['viewer']}}",
        "x-hasura-clerk-user-id": "{{user.id}}"
    }
}
```

#### **Security Enhancements**
- **JWT Claims Validation**: Comprehensive validation with security monitoring (`/lib/auth/jwt-validation.ts`)
- **Role Mismatch Detection**: Real-time monitoring and alerting for JWT/database inconsistencies
- **HMAC Cron Authentication**: Replaced simple secrets with HMAC signature validation
- **Admin Access Control**: Removed authentication bypass options (`skipAuth` removed)
- **Security Event Logging**: Comprehensive audit trails for all security violations

#### **Middleware Authentication**
- **Server-Side Auth**: Removed React hooks from Edge Runtime middleware
- **Role Hierarchy Validation**: Uses centralized `hasRoleLevel()` function
- **JWT Claims Extraction**: Proper server-side role extraction from validated claims

#### **Route Protection Strategy**
```typescript
// Public routes (no auth required)
routes.public() - /, /sign-in, /sign-up, etc.

// System routes (handle own auth)
routes.system() - /api/cron, /api/signed, etc.

// Protected routes with role requirements
developer: /developer/*, /api/developer/*
org_admin: /admin/*, /security/*, /api/admin/*
manager: /staff/*, /invitations/*, /api/staff/*
consultant: /dashboard/*, /clients/*, /payrolls/* (default)
```

#### **Security Monitoring**
- **Role Escalation Detection**: Monitors attempts to use unauthorized roles
- **Authentication Pattern Analysis**: Detects suspicious login/token patterns
- **Critical Alert System**: Real-time notifications for security violations
- **Security Metrics Tracking**: Comprehensive security event tracking

#### **Key Security Files**
- `lib/auth/jwt-validation.ts` - JWT token security validation
- `lib/security/role-monitoring.ts` - Role security monitoring and alerting
- `lib/auth/secure-cron-auth.ts` - HMAC-based cron authentication
- `middleware.ts` - Secure server-side authentication middleware
- `scripts/migrate-user-allowed-roles.ts` - User metadata migration utility

## Code Conventions

### File Organization
- Use the existing TypeScript path mappings (`@/components/*`, `@/lib/*`, etc.)
- Follow domain-driven organization for business logic
- Place shared utilities in `/lib/` or `/shared/`
- Components go in `/components/` with domain-specific ones in `/domains/{domain}/components/`

### Naming Conventions
- Components: PascalCase (e.g., `UserManagementTable`)
- Files: kebab-case (e.g., `user-management-table.tsx`)
- Functions/variables: camelCase
- Types/interfaces: PascalCase
- GraphQL operations: PascalCase with descriptive suffixes (e.g., `GetUsersWithRolesQuery`)

### Import Organization
Imports should be ordered: builtin → external → internal → parent → sibling → index

## Development Workflow

1. **Before starting**: Ensure environment variables are set up (see README.md)
2. **GraphQL changes**: Always run `pnpm codegen` after modifying .graphql files
3. **Quality checks**: Run `pnpm quality:check` before committing
4. **Testing**: Use E2E tests for critical user flows
5. **Security**: All new components handling sensitive data need permission guards

## TypeScript Guidelines

### Build Status
- ✅ **Production build is currently clean** - All TypeScript errors have been resolved
- Run `pnpm build` to verify - should complete without TypeScript compilation errors
- See `TYPESCRIPT_BUILD_FIXES.md` for details on recent fixes

### Type Safety Best Practices
1. **GraphQL Integration**:
   - Always use generated types from `domains/{domain}/graphql/generated/graphql.ts`
   - Query response properties may use aliases - check the actual GraphQL query
   - Example: `GetCurrentUserQuery` returns `user` property (aliased from `userById`)

2. **User Metadata Requirements**:
   - All `UserPublicMetadata` objects must include `permissions` property
   - Use `getPermissionsForRole(role)` to calculate permissions based on role
   - Required in Clerk invitation and user creation flows

3. **Mutation Variables**:
   - Audit mutations expect `input` parameter, not `object`
   - Auth event mutations expect flattened variables, not nested `object`
   - Always check generated GraphQL types for exact structure

4. **Safe Property Access**:
   - Use optional chaining (`?.`) for potentially undefined properties
   - Provide fallback values for required properties
   - Example: `weights?.fieldWeight || 1`

### Common TypeScript Issues & Solutions

1. **"Property does not exist" on GraphQL responses**:
   - Check if query uses aliases in GraphQL definition
   - Use the alias name in TypeScript code, not the original field name

2. **"Missing permissions property" in UserMetadata**:
   - Add `permissions: getPermissionsForRole(role)` to publicMetadata objects
   - Import `getPermissionsForRole` from `@/lib/auth/permissions`

3. **"Object literal may only specify known properties" in mutations**:
   - Check generated mutation variable types
   - Ensure variable structure matches exactly (flat vs nested)

4. **Type import errors**:
   - Use `CustomPermission` instead of `Permission` from types exports
   - Check `types/permissions.ts` for available exports

### Development Workflow for TypeScript
1. **Before making changes**: Run `pnpm type-check` to ensure clean baseline
2. **After GraphQL changes**: Run `pnpm codegen` then `pnpm type-check`
3. **Before committing**: Run `pnpm build` to ensure production build passes
4. **Quality gate**: Use `pnpm quality:check` for comprehensive validation

## UI/UX Patterns and Standards

### Page Layout Consistency
All list/table pages follow the same standardized layout pattern established in the clients and payrolls pages:

1. **Header Section**: Page title, description, and primary action button
2. **Summary Cards**: 4-column grid showing key metrics with colored icons
3. **Filters Card**: Separate card containing search, filters, sorting, and view modes
4. **Content Section**: Table, card, or list view based on user selection

### Summary Statistics Implementation
- **Use dedicated dashboard stats queries** for accurate totals instead of paginated data
- **Separate query execution** from main data queries to avoid performance issues
- **Include comprehensive error handling** for both main and stats queries
- **Examples**: 
  - Clients page: `GetClientsDashboardStatsDocument` 
  - Payrolls page: `GetPayrollDashboardStatsDocument`

### Filter and Search Patterns
```typescript
// Standard filter card structure:
<Card>
  <CardContent className="p-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search..." className="pl-10 w-[300px]" />
        </div>
        
        {/* Filter button with active count */}
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && <Badge variant="secondary" className="ml-2 text-xs">{filterCount}</Badge>}
        </Button>
        
        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
        
        {/* Sort dropdown */}
        <Select value={`${sortField}-${sortDirection}`}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
        </Select>
      </div>

      {/* View mode toggle */}
      <div className="flex items-center space-x-2">
        <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm">
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button variant={viewMode === "table" ? "default" : "outline"} size="sm">
          <TableIcon className="w-4 h-4" />
        </Button>
        <Button variant={viewMode === "list" ? "default" : "outline"} size="sm">
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>

    {/* Expandable filter dropdowns */}
    {showFilters && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t mt-4">
        {/* MultiSelect components for various filters */}
      </div>
    )}
  </CardContent>
</Card>
```

### Date and Time Handling
- **EFT Dates**: Always prioritize `adjustedEftDate` over `originalEftDate` when available
- **Date Display**: Use consistent formatting with `formatDate()` and `formatDateTime()` helpers
- **Timezone Considerations**: All dates should be handled in user's local timezone

### Form Field Naming Conventions
When working with edit forms and GraphQL mutations:
- **Database fields use camelCase**: `primaryConsultantUserId`, `backupConsultantUserId`, `managerUserId`
- **User filtering**: Use `isStaff` property (not `is_staff`)
- **Role validation**: Check against `["manager", "developer", "org_admin"]` for manager-level roles
- **Dropdown initialization**: Handle "none" state properly with fallback values

### GraphQL Query Optimization
Recent optimizations implemented (2025-06-28):
- **Combined dashboard queries** reduce network requests by 50-75%
- **Domain-specific fragments** ensure type safety and performance
- **Aggregate queries separate from paginated data** for accurate statistics
- **Error boundary patterns** for graceful fallback handling

## Phase 4: Bidirectional Sync Improvements (2025-06-28)

### ✅ **Enhanced User Synchronization System**
Phase 4 introduces comprehensive bidirectional sync improvements between Clerk authentication and the database with enterprise-grade reliability and monitoring.

#### **Core Features Implemented**
1. **Enhanced Sync Service** (`/lib/services/enhanced-sync.ts`)
   - Exponential backoff retry logic with configurable attempts (max 3)
   - Distributed locking to prevent concurrent sync operations
   - Comprehensive error handling with retryable vs non-retryable classification
   - Sync state tracking and version management
   - Bidirectional validation to detect inconsistencies between Clerk and database

2. **Database Schema Enhancements** (`/database/migrations/phase4_sync_state_tracking.sql`)
   - `user_sync_states` table for comprehensive sync history tracking
   - `webhook_retry_queue` table for failed webhook retry management
   - `sync_conflicts` table for conflict detection and resolution
   - Performance indexes and monitoring views for operational insights
   - Automated cleanup functions for maintenance

3. **Enhanced Webhook Handler** (`/app/api/webhooks/clerk/enhanced-route.ts`)
   - Timeout protection (30 seconds) and concurrent operation safety
   - Retry queue integration for failed operations
   - SOC2-compliant comprehensive audit logging
   - Service authentication framework integration

4. **Sync Health Monitoring** (`/app/api/sync/health/route.ts`)
   - Real-time sync health dashboard with status indicators
   - Performance metrics and success rates
   - Pending retry tracking with ETA calculations
   - Recent failure analysis and diagnostics

5. **Manual Reconciliation Tools** (`/app/api/sync/reconcile/route.ts`)
   - Admin-only sync reconciliation operations (developer/org_admin roles)
   - Bulk validation and sync capabilities for data consistency
   - Dry-run mode for safe testing and validation
   - Individual user sync repair tools

#### **Technical Improvements**
- **Retry Logic**: Exponential backoff with jitter (25% randomization) to prevent thundering herd
- **Distributed Locking**: In-memory implementation ready for Redis upgrade in production
- **Error Classification**: Smart retry vs abort decisions based on error types and HTTP status codes
- **Performance Tracking**: Operation counts, duration monitoring, and throughput metrics
- **Conflict Detection**: Field-level inconsistency identification with resolution strategies
- **SOC2 Compliance**: Comprehensive audit logging for all sync operations

#### **Environment Configuration**
```bash
# Required for Phase 4 webhook processing
CLERK_WEBHOOK_SECRET="3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo="

# Hasura admin secret for direct database operations
HASURA_GRAPHQL_ADMIN_SECRET="your_admin_secret_here"
```

#### **API Endpoints Added**
- `GET /api/sync/health` - Sync system health monitoring
- `POST /api/sync/reconcile` - Manual sync reconciliation operations
- `POST /api/webhooks/clerk/enhanced` - Enhanced webhook processing with retry logic

#### **Database Migration Required**
Run the Phase 4 migration to enable sync state tracking:
```sql
-- Execute: /database/migrations/phase4_sync_state_tracking.sql
-- Creates: user_sync_states, webhook_retry_queue, sync_conflicts tables
-- Adds: Monitoring views and maintenance functions
```

#### **Quality Assurance Status**
- ✅ **TypeScript Compilation**: All Phase 4 files compile successfully
- ✅ **Error Handling**: Comprehensive error type safety implemented
- ✅ **Code Quality**: Following established patterns and SOC2 conventions
- ✅ **Integration**: Compatible with existing auth and database systems

## Recent Updates (2025-06-28)

### Payrolls Page Enhancements
✅ **Layout Standardization**: Updated payrolls page to match clients page layout with separate filter card
✅ **View Mode Support**: Added cards, table, and list view modes (card/list views ready for implementation)
✅ **Enhanced Filtering**: Multi-select filters for status, client, and consultant
✅ **Accurate Statistics**: Dashboard stats query provides correct totals instead of paginated data
✅ **Next EFT Date Fix**: Now shows `adjustedEftDate` when available, fallback to `originalEftDate`

### Payroll Details Page Fixes
✅ **Edit Mode Dropdowns**: Fixed consultant/manager assignment dropdowns to show current values
✅ **User List Population**: Fixed filtering to use correct field names (`isStaff`, proper role checks)
✅ **Schedule Display**: Added payroll schedule to summary card with 4-column layout
✅ **Field Initialization**: Proper mapping of GraphQL response to edit form fields

### GraphQL Schema Updates
✅ **Enhanced Dashboard Stats**: Added `totalEmployees` and `pendingPayrolls` to dashboard queries
✅ **Client Aggregates**: Updated `ClientListItem` fragment to include `payrollsAggregate`
✅ **Type Safety**: All generated types updated and build passes cleanly

## Troubleshooting

### Authentication & Security Issues

If you encounter authentication problems or security alerts:

1. **JWT Template Configuration**: Ensure Clerk JWT template is properly configured
   ```json
   {
       "https://hasura.io/jwt/claims": {
           "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
           "x-hasura-default-role": "{{user.public_metadata.role || 'viewer'}}",
           "x-hasura-allowed-roles": "{{user.public_metadata.allowedRoles || ['viewer']}}",
           "x-hasura-clerk-user-id": "{{user.id}}"
       }
   }
   ```

2. **User Metadata Requirements**: Ensure users have proper metadata in Clerk
   ```bash
   # User's publicMetadata should include:
   {
     "role": "consultant|manager|org_admin|developer",
     "permissions": [...],
     "allowedRoles": ["viewer", "consultant", ...], // Dynamic based on role
     "databaseId": "uuid"
   }
   ```

3. **Role Mismatch Errors**: If JWT role doesn't match database role
   ```bash
   # Check security monitoring logs
   # Run user sync to fix inconsistencies
   POST /api/sync/reconcile
   
   # Or migrate user metadata
   npx tsx scripts/migrate-user-allowed-roles.ts
   ```

4. **Security Monitoring Alerts**: Monitor for security violations
   - Check `lib/security/role-monitoring.ts` logs for alerts
   - Review security metrics in audit logs
   - Investigate role escalation attempts immediately

5. **Environment Variables**: Ensure all security-related env vars are set
   ```bash
   CLERK_SECRET_KEY=sk_test_...
   CLERK_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   HASURA_GRAPHQL_ADMIN_SECRET=...
   CRON_SECRET=... # For HMAC cron authentication
   ```

6. **JWT Claims Validation**: If JWT validation fails
   ```bash
   # Check JWT claims structure in browser dev tools
   # Verify Hasura template is applied correctly
   # Ensure user metadata is properly synced
   
   # Debug JWT claims
   console.log(sessionClaims?.["https://hasura.io/jwt/claims"]);
   ```

7. **Cron Job Authentication**: For HMAC cron auth issues
   ```bash
   # Generate proper HMAC signature
   timestamp=$(date +%s)
   operation="cleanup_old_dates"
   signature=$(echo -n "${timestamp}:${operation}" | openssl dgst -sha256 -hmac "$CRON_SECRET" -binary | xxd -p)
   
   curl -X POST https://your-app.com/api/cron/cleanup-old-dates \
     -H "x-cron-signature: sha256=${signature}" \
     -H "x-cron-timestamp: ${timestamp}" \
     -H "x-cron-operation: ${operation}"
   ```

### Phase 4 Sync Issues

If sync operations are failing:

1. **Check Sync Health**: Use the monitoring endpoint
   ```bash
   GET /api/sync/health?includeMetrics=true&includeFailures=true
   ```

2. **Manual Reconciliation**: For admin users, trigger manual sync
   ```bash
   POST /api/sync/reconcile
   {
     "action": "sync_user",
     "clerkUserId": "user_...",
     "forceSync": true
   }
   ```

3. **Database Migration**: Ensure Phase 4 migration was executed
   ```sql
   -- Check if sync tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'payroll_db' 
   AND table_name IN ('user_sync_states', 'webhook_retry_queue', 'sync_conflicts');
   ```

## Security Guidelines

### Authentication & Authorization
- **JWT Security**: Always validate JWT claims before processing requests
- **Role Hierarchy**: Use the centralized role hierarchy system (`hasRoleLevel()`)
- **Permission Guards**: Protect UI components with `PermissionGuard` components
- **Server-Side Validation**: Never rely solely on client-side permission checks
- **Audit Logging**: Log all security-sensitive operations

### Security Best Practices
- **Environment Secrets**: Never commit secrets or API keys to the repository
- **Role Escalation**: Monitor and alert on unauthorized role escalation attempts
- **JWT Template**: Keep JWT template minimal and secure (no unnecessary claims)
- **Admin Operations**: Always require proper authentication for admin operations
- **Cron Jobs**: Use HMAC authentication for all scheduled operations

### Security Monitoring
- **Role Mismatches**: Automatically detected and logged
- **Failed Auth Attempts**: Tracked and monitored for patterns
- **Permission Violations**: Real-time alerts for security violations
- **Security Metrics**: Comprehensive tracking of security events

### Code Security Checklist
- [ ] All API routes use proper authentication (`withAuth` or equivalent)
- [ ] Permission checks are server-side validated
- [ ] JWT claims are validated before use
- [ ] No hardcoded secrets or credentials
- [ ] Security events are properly logged
- [ ] Role hierarchy is respected in all operations

## Important Notes

- **Always use** generated GraphQL types for type safety  
- **Follow SOC2 guidelines** for any security-related changes
- **Test permission boundaries** when adding new features
- **Use the existing design system** (shadcn/ui components)
- **Maintain audit trails** for all data modifications
- **Follow established UI patterns** for consistency across pages
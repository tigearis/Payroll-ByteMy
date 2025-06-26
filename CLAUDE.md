# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm codegen` - Generate GraphQL types from schema
- `pnpm codegen:watch` - Watch mode for GraphQL code generation

### Codebase Maintenance

- `pnpm fix:codebase` - Run automated codebase fixes
- `pnpm fix:dry-run` - Preview codebase fixes without applying
- `pnpm fix:auth` - Fix authentication-related issues with backup
- `pnpm fix:errors` - Fix code errors with backup
- `pnpm fix:all` - Fix both auth and errors with backup
- `pnpm fix:duplication` - Remove code duplication

### Case Convention Validation

- `pnpm validate:naming` - Check all files for naming convention violations
- `pnpm validate:naming:fix` - Show what would be fixed (dry run)
- `pnpm validate:naming:dry-run` - Actually fix naming violations

### GraphQL Operations

- `pnpm generate` - Alias for codegen
- `pnpm get-schema` - Download latest schema from Hasura
- `pnpm codegen:debug` - Debug code generation with verbose output
- `pnpm codegen:dry-run` - Check GraphQL types without generating

### Testing

- **Unit Tests**: Located in `__tests__/` directory using Jest with React Testing Library
- **End-to-End Tests**: Located in `e2e/` directory using Playwright
- **Test User Management**: 
  - `pnpm test:users:create` - Create test users in Clerk
  - `pnpm test:users:delete` - Delete test users
  - `pnpm test:users:sync` - Sync test users with database
- **E2E Testing**:
  - `pnpm test:e2e` - Run Playwright tests
  - `pnpm test:e2e:ui` - Run tests with UI
  - `pnpm test:e2e:headed` - Run tests in headed mode
- **Test Data Management**:
  - `pnpm test:data:seed` - Seed minimal test data
  - `pnpm test:data:clean` - Clean test data
  - `pnpm test:setup` - Setup E2E test environment

### Hasura Operations

- `cd hasura && hasura metadata apply` - Apply metadata changes to Hasura
- `cd hasura && hasura metadata export` - Export current metadata
- `cd hasura && hasura migrate apply` - Apply database migrations
- `cd hasura && hasura console` - Open Hasura console for development
- `pnpm fix:permissions` - Automatically fix all permission issues across all tables
- `pnpm fix:permissions:dry-run` - Preview permission fixes without applying changes

### Developer Utilities & Scripts

The `scripts/` directory contains powerful maintenance and development utilities:

**Data Management:**
- `pnpm test:data:seed` - Seed test data for development
- `pnpm test:data:clean` - Clean test data
- `pnpm test:data:generate` - Generate fake data for testing
- `pnpm test:data:real` - Seed with real-world data patterns

**Payroll System Management:**
- `node scripts/developer/regenerate-all-dates.js` - Regenerate all payroll dates
- `node scripts/developer/clean-all-dates.js` - Clean all generated dates
- `node scripts/developer/reset-to-original.js` - Reset to original state

**User Management Scripts:**
- `node scripts/fix-user-sync.js` - Fix user synchronization issues
- `node scripts/create-test-users.js` - Manage test user lifecycle
- `node scripts/sync-test-users.js` - Sync test users with database

**Holiday & External Data:**
- `node scripts/tests/test-holiday-sync.js` - Test holiday synchronization
- `pnpm api/holidays/sync` - Sync Australian public holidays

**Code Quality Scripts:**
- `node scripts/fix-codebase.js` - Automated codebase fixes
- `node scripts/validate-case-conventions.ts` - Validate naming conventions
- `node scripts/fix-hasura-permissions.js` - Fix GraphQL permissions

### Security Audit

- Comprehensive security audit available via dedicated prompt
- Focus areas: Clerk auth integration, Hasura permissions, Next.js App Router security
- Includes SOC2 compliance verification and vulnerability assessment

## Architecture Overview

### Tech Stack

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **GraphQL:** Hasura engine + Apollo Client + GraphQL Codegen
- **Database:** PostgreSQL (Neon) with single-tenant architecture
- **Authentication:** Clerk for user management
- **Hosting:** Vercel with serverless functions

### Authentication & Permission System

**Unified Database-Driven Permission System** with role hierarchy and individual user overrides:

#### **Core Architecture**
- **Unified Auth Provider**: Single `useAuthContext` hook for all authentication needs
- **Database-Driven Permissions**: Role-based permissions with individual user overrides
- **Pure Clerk Integration**: Uses `getToken({ template: "hasura" })` and `sessionClaims` directly
- **Permission Format**: Simple `"resource:action"` syntax (e.g., `"payroll:read"`, `"staff:write"`)
- **5-Level Role Hierarchy**: `developer(5)` > `org_admin(4)` > `manager(3)` > `consultant(2)` > `viewer(1)`
- **Individual Overrides**: Grant/restrict specific permissions beyond role permissions
- **Multi-Layer Security**: Client-side guards + Database row-level security + API protection + Audit logging

#### **Permission Flow**
```
User Login → Clerk Auth → Database Validation → Role Assignment → Permission Calculation → Override Resolution → Access Control
```

#### **Permission System Features**
- **Role-Based Foundation**: Each role has predefined permissions
- **Individual Overrides**: Grant/restrict permissions per user with reasons and expiration
- **Audit Trail**: All permission changes logged with timestamps and administrators
- **Fallback Safety**: Graceful fallback to role permissions during override loading
- **Admin Interface**: `/admin/permissions` for managing user overrides
- **Real-time Updates**: Permission changes take effect immediately

#### **Permission Categories & Examples**
```typescript
PAYROLL: ["payroll:read", "payroll:write", "payroll:delete", "payroll:assign"]
STAFF: ["staff:read", "staff:write", "staff:delete", "staff:invite"]  
CLIENT: ["client:read", "client:write", "client:delete"]
ADMIN: ["admin:manage", "settings:write", "billing:manage"]
REPORTING: ["reports:read", "reports:export", "audit:read", "audit:write"]
```

#### **Usage Examples**

**Basic Permission Check:**
```typescript
import { useAuthContext } from "@/lib/auth";

function PayrollManager() {
  const { hasPermission } = useAuthContext();
  
  if (!hasPermission("payroll:write")) {
    return <div>Access Denied</div>;
  }
  
  return <PayrollForm />;
}
```

**Enhanced Permission Check with Override Support:**
```typescript
import { useAuthContext } from "@/lib/auth";

function AdvancedPermissionExample() {
  const { 
    hasPermission, 
    userRole,
    effectivePermissions,  // Shows role + override permissions
    refreshPermissions     // Refresh after permission changes
  } = useAuthContext();
  
  // Check standard permission (includes overrides automatically)
  const canEdit = hasPermission("payroll:write");
  
  // Access detailed permission information
  const permissions = effectivePermissions.filter(p => p.resource === "payroll");
  
  return (
    <div>
      <p>Role: {userRole}</p>
      <p>Can Edit: {canEdit ? "Yes" : "No"}</p>
      <p>Effective Permissions: {permissions.length}</p>
    </div>
  );
}
```

**Permission Guards (3 Types):**
```typescript
// 1. Standard Guard (90% of cases)
<PermissionGuard permission="staff:write" fallback={<AccessDenied />}>
  <StaffForm />
</PermissionGuard>

// 2. Enhanced Guard (Complex scenarios with detailed feedback)
<PermissionGuard resource="payroll" action="delete">
  <DeleteButton />
</PermissionGuard>

// 3. Role Guard (Page-level protection with redirects)
<RoleGuard requiredRole="manager" redirectTo="/dashboard">
  <ManagerOnlyPage />
</RoleGuard>
```

**Convenience Guards:**
```typescript
<AdminGuard>              // roles={["org_admin"]}
<ManagerGuard>            // roles={["org_admin", "manager"]}
<StaffManagerGuard>       // permission="staff:write"
<PayrollProcessorGuard>   // permission="payroll:write"
<DeveloperGuard>          // roles={["developer"]}
```

**Conditional Rendering:**
```typescript
// Show features based on permissions
{hasPermission("client:delete") && <DeleteButton />}
{hasRoleLevel(userRole, "manager") && <AdvancedFeatures />}

// Navigation control
const canAccessStaff = hasPermission("staff:read");
const canAccessSettings = hasPermission("settings:write");
```

#### **Real-World Scenarios**

**Scenario 1: Protecting a Button**
```typescript
function PayrollActions({ payroll }) {
  const { hasPermission } = useAuthContext();
  
  return (
    <div className="actions">
      {/* Everyone with payroll:read can see details */}
      <ViewButton />
      
      {/* Only users with payroll:write can edit */}
      {hasPermission("payroll:write") && (
        <EditButton onClick={() => editPayroll(payroll.id)} />
      )}
      
      {/* Only users with payroll:delete can delete */}
      {hasPermission("payroll:delete") && (
        <DeleteButton onClick={() => deletePayroll(payroll.id)} />
      )}
    </div>
  );
}
```

**Scenario 4: Managing User Permission Overrides**
```typescript
// Admin interface for granting temporary permissions
function GrantTemporaryPermission({ userId }) {
  const { refreshPermissions } = useAuthContext();
  
  const handleGrantPermission = async () => {
    await grantUserPermission({
      variables: {
        userId,
        resource: "payroll",
        operation: "write", 
        reason: "Temporary access for month-end processing",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
    
    // Refresh permissions across the app
    await refreshPermissions();
  };
  
  return (
    <Button onClick={handleGrantPermission}>
      Grant Temporary Payroll Access
    </Button>
  );
}
```

**Scenario 5: Permission Override Display**
```typescript
function UserPermissionStatus({ userId }) {
  const { 
    effectivePermissions, 
    permissionOverrides,
    getRolePermissions,
    getOverridePermissions 
  } = useAuthContext();
  
  const rolePerms = getRolePermissions();
  const overridePerms = getOverridePermissions();
  
  return (
    <div>
      <h3>Role Permissions: {rolePerms.length}</h3>
      <h3>Individual Overrides: {overridePerms.length}</h3>
      
      {overridePerms.map(override => (
        <div key={override.id}>
          <Badge variant={override.granted ? "default" : "destructive"}>
            {override.granted ? "GRANTED" : "RESTRICTED"}
          </Badge>
          <span>{override.resource}:{override.operation}</span>
          {override.expiresAt && (
            <span>Expires: {format(new Date(override.expiresAt), 'MMM d, yyyy')}</span>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Scenario 2: Protecting a Page**
```typescript
// app/staff/page.tsx
function StaffPage() {
  return (
    <RoleGuard requiredPermission="staff:read" redirectTo="/dashboard">
      <div>
        <h1>Staff Management</h1>
        
        {/* Only staff managers can add new staff */}
        <StaffManagerGuard>
          <AddStaffButton />
        </StaffManagerGuard>
        
        <StaffList />
      </div>
    </RoleGuard>
  );
}
```

**Scenario 3: API Route Protection**
```typescript
// app/api/payrolls/route.ts
import { hasPermission } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  const { user } = await getCurrentUser();
  
  if (!user || !hasPermission(user.role, "payroll:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Process payroll creation...
}
```

**Scenario 4: Navigation Menu**
```typescript
function NavigationMenu() {
  const { hasPermission, userRole } = useAuthContext();
  
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", show: true },
    { path: "/staff", label: "Staff", show: hasPermission("staff:read") },
    { path: "/payrolls", label: "Payrolls", show: hasPermission("payroll:read") },
    { path: "/clients", label: "Clients", show: hasPermission("client:read") },
    { path: "/settings", label: "Settings", show: hasPermission("settings:write") },
    { path: "/developer", label: "Developer", show: userRole === "developer" },
  ];
  
  return (
    <nav>
      {menuItems.filter(item => item.show).map(item => (
        <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
      ))}
    </nav>
  );
}
```

#### **Key Files**:
  - `lib/auth/enhanced-auth-context.tsx` - **Unified authentication provider** with database permission support
  - `lib/auth/index.ts` - **Barrel export** for clean imports across the app
  - `lib/auth/permissions.ts` - **Single source of truth** for all permissions and roles
  - `components/auth/permission-guard.tsx` - Standard permission guard component
  - `components/auth/enhanced-permission-guard.tsx` - Advanced guard with detailed feedback
  - `components/auth/role-guard.tsx` - Simple role guard with redirects
  - `components/admin/permission-override-manager.tsx` - Admin interface for user overrides
  - `app/(dashboard)/admin/permissions/page.tsx` - Admin permission management page
  - `domains/permissions/graphql/` - GraphQL operations for permission overrides
  - `middleware.ts` - Auth middleware and route protection using `clerkMiddleware`
  - `app/api/webhooks/clerk/` - Clerk webhook handlers for user synchronization
  - `lib/auth/client-auth-logger.ts` - Client-side authentication event logging utility
  - `app/api/auth/log-event/route.ts` - SOC2-compliant authentication event logging endpoint

#### **Quick Reference Guide**

**Import Pattern:**
```typescript
import { useAuthContext } from "@/lib/auth";
```

**Permission Naming Convention:**
- Format: `"resource:action"`
- Resources: `payroll`, `staff`, `client`, `admin`, `settings`, `billing`, `reports`, `audit`, `security`
- Actions: `read`, `write`, `delete`, `assign`, `invite`, `manage`, `export`

**Role Hierarchy (Higher numbers include lower permissions):**
```
developer(5)    → Full system access + dev tools + permission management
org_admin(4)    → Organization management + permission overrides
manager(3)      → Team and payroll management
consultant(2)   → Basic payroll processing
viewer(1)       → Read-only access
```

**Common Patterns:**
```typescript
// Basic permission check (includes overrides automatically)
hasPermission("payroll:write")

// Check role level
hasRoleLevel(userRole, "manager")

// Access effective permissions (role + overrides)
effectivePermissions.filter(p => p.resource === "payroll")

// Refresh permissions after changes
await refreshPermissions()

// Access permission overrides
permissionOverrides.filter(o => o.granted && !o.expiresAt)
```

**Permission Override Management:**
```typescript
// Grant temporary permission
await grantUserPermission({
  userId, resource: "payroll", operation: "write",
  reason: "Month-end processing", expiresAt: "2024-01-31T23:59:59Z"
});

// Restrict permission 
await restrictUserPermission({
  userId, resource: "client", operation: "delete",
  reason: "Security precaution"
});

// Remove override
await removePermissionOverride({ id: overrideId });
```

**Guard Selection Guide:**
- **PermissionGuard**: General purpose, most UI components
- **Enhanced PermissionGuard**: Complex scenarios, need detailed feedback  
- **RoleGuard**: Page-level protection, automatic redirects
- **Convenience Guards**: Common patterns (AdminGuard, ManagerGuard, etc.)

**Admin Features:**
- **Permission Management Page**: `/admin/permissions` - Manage user overrides
- **Override Manager Component**: Grant/restrict individual permissions
- **Audit Trail**: All permission changes logged automatically
- **Expiration Handling**: Automatic cleanup of expired overrides

#### JWT Template Configuration

The authentication system uses a specific JWT template configured in Clerk Dashboard for Hasura integration:

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

This template ensures proper database UUID mapping and role-based access control for Hasura operations.

#### Client-Side Audit Logging

Comprehensive authentication event logging system for SOC2 compliance and security monitoring:

- **Event Coverage**: Login attempts/success/failure, signup events, invitation acceptance, OAuth flows, MFA events, logout, session timeout
- **Authentication Methods**: Email/password, Google OAuth, Clerk Elements, invitation tickets, MFA, password reset
- **Dual Logging**: Events logged to both security audit system and database for redundancy
- **Rate Limited**: Auth logging endpoint protected with 20 requests/minute limit
- **Client Logger**: Singleton pattern with convenience methods for different auth events
- **Error Handling**: Graceful fallbacks - app continues functioning even if logging fails
- **Security Headers**: Client information (user agent, IP) captured server-side from request headers
- **SOC2 Compliance**: Proper event classification and audit trails for compliance requirements

**Implementation Locations:**
- `/app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Email/password and Google OAuth login logging
- `/app/(auth)/sign-up/[[...sign-up]]/page.tsx` - Clerk Elements signup flow logging with success/failure detection
- `/app/(auth)/accept-invitation/page.tsx` - Invitation acceptance logging with role assignment tracking
- `lib/auth/client-auth-logger.ts` - Central logging utility with typed event system
- `app/api/auth/log-event/route.ts` - Server endpoint for processing client-side auth events

**Event Types Supported:**
```typescript
login_attempt | login_success | login_failure | logout | signup_attempt | 
signup_success | signup_failure | invitation_accepted | password_reset | 
mfa_challenge | mfa_success | mfa_failure | session_timeout | oauth_login | oauth_failure
```

### GraphQL & Domain Architecture

Domain-driven GraphQL setup with modular Apollo client architecture:

- **Domain Organization**: Each business domain has its own GraphQL folder structure with isolated operations
- **Modular Apollo Client**: Refactored from monolithic to modular architecture (December 2024)
  - **Modular Structure**: Split into `links/`, `clients/`, `cache/`, and `types.ts` for better maintainability
  - Client-side client (`clientApolloClient`) with WebSocket support and automatic token forwarding
  - Server-side client (`serverApolloClient`) for API routes and server components
  - Admin client (`adminApolloClient`) with service account access for system operations
- **Pure Clerk Integration**: Automatic token injection using `window.Clerk.session.getToken({ template: "hasura" })` - no custom token management
- **Code Generation**: Per-domain TypeScript generation with shared scalars and configurations
- **Real-time Features**: WebSocket subscriptions with automatic Clerk authentication, real-time security monitoring, optimistic updates
- **Hasura Integration**: JWT-based authentication with native Clerk token templates, row-level security, role-based permissions
- **Performance Optimized**: Fragment-based queries, pagination support, unified dashboard queries (60%+ performance improvement)
- **Architectural Consistency**: All components now use GraphQL operations via domain hooks (completed December 2024)

**Core Domains with Security Classifications:**

- `domains/auth/` - Authentication and JWT handling (CRITICAL)
- `domains/audit/` - SOC2 compliance and logging (CRITICAL)  
- `domains/permissions/` - Role-based access control (CRITICAL)
- `domains/users/` - User management and staff lifecycle (HIGH)
- `domains/clients/` - Client relationship management (HIGH)
- `domains/billing/` - Financial operations (HIGH)
- `domains/payrolls/` - Payroll processing engine (MEDIUM)
- `domains/notes/` - Documentation and communication (MEDIUM)
- `domains/leave/` - Employee leave management (MEDIUM)
- `domains/work-schedule/` - Staff scheduling (MEDIUM)
- `domains/external-systems/` - Third-party integrations (MEDIUM)

**Domain Structure:**

```bash
domains/{domain}/
├── components/        # Domain-specific React components
├── graphql/          # GraphQL operations (queries, mutations, subscriptions)
│   ├── queries.graphql       # Data fetching operations
│   ├── mutations.graphql     # Data modification operations
│   ├── subscriptions.graphql # Real-time operations
│   ├── fragments.graphql     # Reusable field sets
│   └── generated/           # Auto-generated TypeScript types
├── services/         # Business logic and API calls
├── types/           # Domain-specific TypeScript types
└── index.ts         # Domain export barrel
```

**Operation Patterns:**

- **Fragment Hierarchy**: Minimal → Summary → ListItem → Complete
- **Pagination Support**: All major queries include limit/offset with aggregate counts
- **Real-time Subscriptions**: 25+ subscriptions for live data updates
- **Unified Queries**: Dashboard and bulk operations optimized into single requests
- **Search Operations**: Fuzzy search with pagination for all major entities
- **CRUD Complete**: Full create, read, update, delete coverage with soft delete patterns

### Security Layer

Defense-in-depth architecture following SOC2 compliance:

- **Multi-Level Data Classification**: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` with role-based data masking
- **Enhanced Route Monitoring**: Real-time request monitoring, suspicious pattern detection, security alerting
- **Security Middleware Stack**: Authentication, route protection, MFA enforcement, API signing
- **Hasura Security**: Row-level security policies, GraphQL query restrictions, permission-based access
- **Client-Side Audit Logging**: Comprehensive authentication event tracking with dual logging (security audit + database)
- **Key Files**:
  - `lib/security/config.ts` - Security configuration
  - `lib/security/enhanced-route-monitor.ts` - Route monitoring
  - `lib/auth/client-auth-logger.ts` - Client-side authentication event logging
  - `app/api/auth/log-event/route.ts` - Authentication event processing endpoint
  - `hasura/metadata/` - Permission and role definitions

### Database Integration

GraphQL-first approach using Hasura over PostgreSQL:

- **Hasura Configuration**: Metadata-driven with YAML configuration, custom functions, role-based row-level security
- **Database Features**: Versioned migrations, audit tables, payroll versioning system, RBAC at database level
- **Data Access**: Network-only policies for security, graceful error handling, cache invalidation strategies
- **PostgreSQL (Neon)**: SSL connections, connection limits, single-tenant data model

## Security Architecture Details

### Critical Security Files

```tree
├── middleware.ts                    # Primary auth middleware
├── app/api/webhooks/clerk/          # Clerk webhook handlers
├── app/api/auth/log-event/          # Client-side auth event logging endpoint (CRITICAL)
├── lib/apollo/                      # Modular Apollo Client
│   ├── unified-client.ts           # Main export point with backward compatibility
│   ├── types.ts                    # Centralized type definitions
│   ├── links/                      # Apollo link chain with documented order
│   │   ├── error-link.ts          # Error handling (FIRST in chain)
│   │   ├── retry-link.ts          # Retry logic (SECOND in chain)
│   │   ├── auth-link.ts           # Authentication (THIRD in chain)
│   │   ├── http-link.ts           # HTTP transport (LAST in chain)
│   │   └── websocket-link.ts      # WebSocket for subscriptions (PARALLEL)
│   ├── clients/                    # Client factory and instances
│   ├── cache/                      # Cache configuration and utilities
│   └── admin-operations.ts         # Admin service operations
├── lib/
│   ├── auth/                       # Authentication utilities
│   │   ├── permissions.ts          # Role hierarchy and permissions (CRITICAL)
│   │   └── client-auth-logger.ts   # Client-side audit logging (CRITICAL)
│   └── security/                   # Security configurations
├── domains/                        # Domain-based GraphQL operations
│   ├── auth/graphql/               # Auth queries/mutations (CRITICAL)
│   ├── audit/graphql/              # Audit logging (CRITICAL)
│   ├── users/graphql/              # User management (HIGH)
│   └── clients/graphql/            # Client operations (HIGH)
├── hasura/
│   ├── metadata/                   # Permissions & roles
│   └── migrations/                 # Database schema
└── .env.local                      # Environment variables
```

### Authentication Flow

1. **User Authentication**: Clerk handles sign-up/sign-in
2. **Client-Side Logging**: Authentication events captured via `clientAuthLogger` for real-time monitoring
3. **JWT Generation**: Clerk issues JWT with custom claims
4. **Token Forwarding**: Apollo Client forwards JWT to Hasura
5. **Permission Enforcement**: Hasura applies row-level security
6. **Dual Audit Logging**: Events logged to both security audit system and database for SOC2 compliance

### Permission System

- **Role Hierarchy**: Admin → Org Admin → Manager → Consultant → Viewer
- **Row-Level Security**: Hasura policies enforce data access boundaries
- **Column-Level Permissions**: Sensitive data masked based on user role
- **Business Logic**: Custom permission rules for complex scenarios

## Case Convention System

The project enforces strict case conventions across all code:

- **Files/Directories**: kebab-case (`user-profile-card.tsx`, `auth-utils.ts`)
- **React Components**: PascalCase (`UserProfileCard`, `PayrollScheduleView`)
- **Functions/Variables**: camelCase (`getCurrentUser`, `handleSubmit`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_ROLE`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (`UserMetadata`, `PayrollStatus`)
- **Custom Hooks**: camelCase with 'use' prefix (`useAuth`, `useUserRole`)
- **GraphQL Operations**: PascalCase (`GetUserByRole`, `UpdateUserRole`)
- **Database Fields**: snake_case (`user_id`, `created_at`)

**Key Files**:

- `config/case-conventions.config.ts` - Central configuration for all naming patterns
- `scripts/validate-case-conventions.ts` - Automated validation and fixing
- `docs/CASE_CONVENTION_SYSTEM.md` - Comprehensive documentation
- `Type-Case-Conventions.md` - Reference guide

**Validation**: Run `pnpm validate:naming` to check compliance and `pnpm validate:naming:fix` for automatic fixes.

## Development Standards & Cursor Rules

The project includes comprehensive development standards defined in `.cursorrules` for consistency across the team:

### Architecture Principles

- **Domain-Driven Design**: Business logic organized by functional domains (`/domains`)
- **Security-First Approach**: SOC2 compliance with comprehensive audit logging
- **Native Clerk Integration**: Never implement custom JWT handling or token management

### Authentication & Authorization Standards

- **Always use Clerk's native hooks**: `useAuth()`, `useUser()`, `sessionClaims`
- **Server-side authentication**: Use `auth()` from `@clerk/nextjs/server`
- **Never manually decode JWTs** or implement custom token refresh
- **Always validate permissions** using `usePermissions()` hook
- **Use role guards** for component protection

### Security Implementation Requirements

- **All protected routes/components** must check authentication
- **Role/permission validation** implemented everywhere
- **Input validation** with Zod schemas required
- **Audit logging** for all business operations
- **No sensitive information** exposed in errors
- **Type safety** enforced - no `any` types allowed

### Component Development Standards

- **Follow component hierarchy**: auth/ → ui/ → business-domain/ → error-boundary/
- **Implement proper error boundaries** for all components
- **Include loading states** and error handling
- **Use proper memoization** for expensive calculations
- **Lazy load heavy components** when appropriate

### API Development Requirements

- **Authenticate first** - all protected endpoints check authentication
- **Validate role/permissions** before proceeding
- **Validate input** with Zod schemas
- **Include audit logging** for business operations
- **Proper error sanitization** - no internal error exposure

### Common Patterns Enforced

```typescript
// Authentication check pattern
const { isSignedIn, isLoaded } = useAuth();
if (!isLoaded) return <Loading />;
if (!isSignedIn) return <SignIn />;

// Error handling pattern
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  logger.error("Operation failed", { error, context });
  return { success: false, error: "Operation failed" };
}
```

## Important Patterns

### Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`:

- `@/*` - Root directory
- `@/components/*` - Components directory
- `@/lib/*` - Library functions
- `@/utils/*` - Utility functions
- `@/hooks/*` - React hooks
- `@/types/*` - Type definitions
- `@/app/*` - Next.js app directory
- `@/apollo/*` - Apollo client configurations
- `@/domains/*` - Domain-specific code
- `@/config/*` - Configuration files

### Environment Configuration

Key environment variables (see `.env.example` for full list):

#### Authentication & Security

- `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_WEBHOOK_SECRET` - Webhook signature verification
- `API_SECRET_KEY` - API signing and security operations
- `FEATURE_MFA_ENABLED` - Feature flag for MFA functionality

#### Database & GraphQL

- `NEXT_PUBLIC_HASURA_GRAPHQL_URL` - Hasura GraphQL endpoint
- `HASURA_SERVICE_ACCOUNT_TOKEN` - Service account JWT (not admin secret)
- `DATABASE_URL` - PostgreSQL connection string (Neon)

#### Deployment

- `VERCEL_URL` - Deployment URL for webhooks and redirects

### Security Compliance

- **Route Protection**: All API routes require authentication except those in the public routes list in `middleware.ts`
- **SOC2 Compliance**: Implemented through audit logging, data classification, and security monitoring
- **Token Security**: Service account tokens with limited permissions, never admin secrets
- **Security Headers**: Configured in `next.config.js` including CSP, HSTS, and frame protection
- **Data Classification**: Multi-level security with role-based data masking
- **Webhook Security**: Signature verification for all external webhooks

### Code Generation

- **GraphQL Types**: Generated per-domain for better modularity with SOC2 compliance headers
- **Commands**: Run `pnpm codegen` after schema changes
- **Output Locations**:
  - `domains/{domain}/graphql/generated/` - Domain-specific types with security classifications
  - `shared/types/generated/` - Shared types and scalars
- **Configuration**: Shared scalars defined in `config/codegen.ts` with unified security metadata
- **Apollo Integration**: Generated hooks include authentication context and audit logging
- **Security Features**: Automatic security level classification, audit logging integration, role-based access control
- **Performance Optimizations**: Fragment masking, unified exports, duplicate elimination

## Development Notes

- **Framework**: Next.js 15 with App Router (React 19)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with custom design tokens in `lib/design-tokens/`
- **Package Manager**: pnpm (version 10.12.1)
- **Production Builds**: TypeScript and ESLint checks disabled (configured in `next.config.js`)
- **WIP Pages**: ai-assistant, calendar, tax-calculator are redirected to 404 in production
- **Security**: All authenticated routes protected by middleware, comprehensive audit logging enabled
- **Authentication**: Optimized to use pure Clerk native functions, eliminated 1,200+ lines of custom token management, enhanced with smart caching to prevent loading flicker
- **GraphQL**: Domain-driven organization with modular Apollo client architecture, real-time subscriptions for live updates, performance optimized with fragment-based queries and pagination
- **Performance**: WebSocket-based real-time updates replace aggressive polling, reducing server load by 95% on security page
- **Code Quality**: Comprehensive case convention system enforced, automated codebase maintenance utilities, production build exclusions for test files

### Production Build Configuration

The project uses `next.config.js` with specific production optimizations:

- **Security Headers**: Comprehensive CSP, HSTS, XSS protection, and frame options
- **Build Exclusions**: E2E tests, development files, and test utilities excluded from production bundles
- **Route Protection**: Dev-only routes (`/api/dev/*`) automatically redirect to 404 in production
- **Image Optimization**: Configured for Clerk domains with AVIF/WebP support
- **Webpack Configuration**: Custom module resolution and build exclusions for production

## Common Authentication Issues & Solutions

### Permission Errors in GraphQL

If you encounter "field not found" errors in GraphQL queries (like `isActive`, `managerId`, `supersededDate` fields):

**Quick Fix:**

1. Run `pnpm fix:permissions:dry-run` to see all permission issues
2. Run `pnpm fix:permissions` to automatically fix all missing permissions
3. Apply metadata changes with `cd hasura && hasura metadata apply`
4. Regenerate GraphQL types with `pnpm codegen`

**Manual Fix:**

1. Check Hasura metadata permissions in `hasura/metadata/databases/default/tables/public_*.yaml`
2. Ensure the field is included in the role's `select_permissions.columns` array
3. Apply metadata changes and regenerate types

### User Sync Issues

If users exist in Clerk but not in database:

- Use the sync button in the UI or call `/api/sync-current-user`
- Check Clerk webhook configuration for automatic user sync
- Verify `clerkUserId` and `databaseId` mapping in user metadata

### Real-time Subscription Issues

If GraphQL subscriptions are not working:

1. **Check WebSocket Connection**: Look for connection status indicator (green dot = connected, orange = fallback)
2. **Verify Hasura WebSocket URL**: Ensure `NEXT_PUBLIC_HASURA_GRAPHQL_URL` supports WebSocket upgrades
3. **Authentication Issues**: Check browser console for WebSocket authentication errors
4. **Fallback Mode**: System automatically falls back to 5-minute polling if WebSocket fails
5. **Debug Commands**:

   ```bash
   # Check WebSocket connectivity
   pnpm dev
   # Monitor browser console for connection logs
   ```

### Authentication Loading Screen Issues

If "Verifying Access" appears on every page refresh:

1. **Clear Session Storage**: Clear browser cache and session storage
2. **Check Cache Duration**: Verification cache expires after 10 minutes
3. **Inspect Console Logs**: Look for cache-related debug messages
4. **Grace Period Bypass**: Cached users should skip the 500ms grace period
5. **Background Refresh**: After 8 minutes, refresh happens silently in background

### Code Quality & Linting

The project enforces strict code quality standards:

**ESLint Configuration:**
- ES modules (`"type": "module"` in package.json)
- Use `_dirname` and `_filename` instead of `__dirname` and `__filename`
- Import statements must include file extensions for local files
- All config files use ES module syntax

**Quality Commands:**
- `pnpm lint` - Run ESLint checks
- `pnpm lint:fix` - Auto-fix ESLint issues
- `pnpm lint:strict` - Run with zero warnings allowed
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm quality:check` - Run all quality checks (lint + format + types)
- `pnpm quality:fix` - Auto-fix all quality issues

**Production Build:**
- TypeScript and ESLint checks are disabled in production builds for performance
- Quality checks should be run during development and CI/CD

## Important Instruction Reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
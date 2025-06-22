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

- Tests are located in `__tests__/` directory
- Testing framework: Jest with React Testing Library
- Dependencies: `@jest/globals`, `@testing-library/jest-dom`, `@testing-library/react`
- No test runner script configured - tests should be run manually or via IDE integration

### Hasura Operations

- `cd hasura && hasura metadata apply` - Apply metadata changes to Hasura
- `cd hasura && hasura metadata export` - Export current metadata
- `cd hasura && hasura migrate apply` - Apply database migrations
- `cd hasura && hasura console` - Open Hasura console for development
- `pnpm fix:permissions` - Automatically fix all permission issues across all tables
- `pnpm fix:permissions:dry-run` - Preview permission fixes without applying changes

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

### Authentication System

This is a streamlined authentication system leveraging Clerk's native enterprise capabilities:

- **Pure Clerk Native Integration**: No custom token management - uses `getToken({ template: "hasura" })` and `sessionClaims` directly
- **RBAC Implementation**: Hierarchical roles (`developer` > `org_admin` > `manager` > `consultant` > `viewer`) with 18 granular permissions across 5 categories
- **JWT Template Configuration**: Custom Hasura JWT template with proper claims mapping for database UUID integration
- **Security Features**: Automatic token refresh, session management, MFA support (feature-flagged), SOC2 compliance
- **Optimized Architecture**: Eliminated 1,200+ lines of custom token management code by leveraging Clerk's built-in features
- **Key Files**:
  - `middleware.ts` - Auth middleware and route protection using `clerkMiddleware`
  - `lib/auth/permissions.ts` - Role hierarchy and permission definitions (single source of truth)
  - `apollo/unified-client.ts` - Apollo client with native Clerk token integration
  - `lib/utils/auth-error-utils.ts` - Authentication error utilities
  - `app/api/webhooks/clerk/` - Clerk webhook handlers for user synchronization

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

### GraphQL & Domain Architecture

Domain-driven GraphQL setup with unified Apollo client architecture:

- **Domain Organization**: Each business domain has its own GraphQL folder structure with isolated operations
- **Unified Apollo Client**: Single `apollo/unified-client.ts` with native Clerk integration
  - Client-side client (`clientApolloClient`) with WebSocket support and automatic token forwarding
  - Server-side client (`serverApolloClient`) for API routes and server components
  - Admin client (`adminApolloClient`) with service account access for system operations
- **Pure Clerk Integration**: Automatic token injection using `window.Clerk.session.getToken({ template: "hasura" })` - no custom token management
- **Code Generation**: Per-domain TypeScript generation with shared scalars and configurations
- **Real-time Features**: WebSocket subscriptions with automatic Clerk authentication, optimistic updates
- **Hasura Integration**: JWT-based authentication with native Clerk token templates, row-level security, role-based permissions

**Core Domains:**

- `domains/auth/` - Authentication and JWT handling
- `domains/users/` - User management and staff lifecycle
- `domains/clients/` - Client relationship management
- `domains/payrolls/` - Payroll processing engine
- `domains/audit/` - SOC2 compliance and logging
- `domains/permissions/` - Role-based access control

**Domain Structure:**

```bash
domains/{domain}/
├── components/        # Domain-specific React components
├── graphql/          # GraphQL operations (queries, mutations, subscriptions)
│   └── generated/    # Auto-generated TypeScript types
├── services/         # Business logic and API calls
├── types/           # Domain-specific TypeScript types
└── index.ts         # Domain export barrel
```

### Security Layer

Defense-in-depth architecture following SOC2 compliance:

- **Multi-Level Data Classification**: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` with role-based data masking
- **Enhanced Route Monitoring**: Real-time request monitoring, suspicious pattern detection, security alerting
- **Security Middleware Stack**: Authentication, route protection, MFA enforcement, API signing
- **Hasura Security**: Row-level security policies, GraphQL query restrictions, permission-based access
- **Key Files**:
  - `lib/security/config.ts` - Security configuration
  - `lib/security/enhanced-route-monitor.ts` - Route monitoring
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
├── lib/
│   ├── apollo-client.ts            # GraphQL client with auth
│   ├── auth/                       # Authentication utilities
│   └── security/                   # Security configurations
├── hasura/
│   ├── metadata/                   # Permissions & roles
│   └── migrations/                 # Database schema
└── .env.local                      # Environment variables
```

### Authentication Flow

1. **User Authentication**: Clerk handles sign-up/sign-in
2. **JWT Generation**: Clerk issues JWT with custom claims
3. **Token Forwarding**: Apollo Client forwards JWT to Hasura
4. **Permission Enforcement**: Hasura applies row-level security
5. **Audit Logging**: All security events logged for SOC2 compliance

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

- **GraphQL Types**: Generated per-domain for better modularity
- **Commands**: Run `pnpm codegen` after schema changes
- **Output Locations**:
  - `domains/{domain}/graphql/generated/` - Domain-specific types
  - `shared/types/generated/` - Shared types and scalars
- **Configuration**: Shared scalars defined in `config/codegen.ts`
- **Apollo Integration**: Generated hooks include authentication context

## Security Audit Guidelines

When performing security audits, focus on these integration points:

### High-Priority Areas

1. **Clerk ↔ Next.js Integration**: Middleware auth, webhook handling, token management
2. **Next.js ↔ Hasura Integration**: JWT forwarding, Apollo Client configuration, error handling
3. **Hasura Permission System**: Row-level security, role definitions, business logic rules
4. **API Route Security**: Authentication, input validation, rate limiting

### Common Vulnerability Points

- Environment variable exposure
- Webhook signature verification
- Token refresh mechanisms
- Permission boundary enforcement
- GraphQL query depth/complexity limits
- Client-side token storage
- Error message information disclosure

### Compliance Verification

- SOC2 audit log completeness
- User activity tracking
- Failed authentication monitoring
- Data access logging
- Incident response procedures

## Development Notes

- **Framework**: Next.js 15 with App Router (React 19)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with custom design tokens in `lib/design-tokens/`
- **Package Manager**: pnpm (version 10.12.1)
- **Production Builds**: TypeScript and ESLint checks disabled (configured in `next.config.js`)
- **WIP Pages**: ai-assistant, calendar, tax-calculator are redirected to 404 in production
- **Security**: All authenticated routes protected by middleware, comprehensive audit logging enabled
- **Authentication**: Optimized to use pure Clerk native functions, eliminated 1,200+ lines of custom token management
- **GraphQL**: Domain-based organization with unified Apollo client, see `GRAPHQL_CLEANUP_PLAN.md` for ongoing improvements

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

### ESLint Configuration

The project uses ES modules (`"type": "module"` in package.json):

- Use `_dirname` and `_filename` instead of `__dirname` and `__filename`
- Import statements must include file extensions for local files
- All config files use ES module syntax

## Important Instruction Reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.

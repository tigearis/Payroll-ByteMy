# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm codegen` - Generate GraphQL types from schema
- `pnpm codegen:watch` - Watch mode for GraphQL code generation

### GraphQL Operations

- `pnpm generate` - Alias for codegen
- `pnpm get-schema` - Download latest schema from Hasura

### Testing

- Tests are located in `__tests__/` directory
- No specific test runner configured - check for test scripts if needed

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

This is a multi-layered authentication system with Clerk as the primary provider:

- **Centralized Token Management**: Singleton pattern managers handle JWT tokens with automatic refresh, caching, and mutex protection
- **RBAC Implementation**: Hierarchical roles (`developer` > `org_admin` > `manager` > `consultant` > `viewer`) with permission-based access control
- **Security Features**: Session expiry handling, MFA support (feature-flagged), database user validation for SOC2 compliance
- **Clerk Integration**: JWT forwarding to Hasura, webhook authentication, session management
- **Key Files**:
  - `middleware.ts` - Auth middleware and route protection
  - `lib/auth/centralized-token-manager.ts` - Token management
  - `lib/auth/server-token-manager.ts` - Server-side token handling
  - `lib/api-auth.ts` - API authentication utilities
  - `app/api/webhooks/clerk/` - Clerk webhook handlers

### GraphQL Architecture

Domain-driven GraphQL setup with sophisticated code generation:

- **Domain Organization**: Each business domain (`payrolls`, `clients`, `staff`, `users`, etc.) has its own GraphQL folder structure: `domains/{domain}/graphql/{fragments,queries,mutations,subscriptions}.graphql`
- **Dual Apollo Clients**:
  - Standard client (`lib/apollo-client.ts`) for general use with auth token forwarding
  - Secure client (`lib/apollo/secure-client.ts`) for SOC2-compliant operations with security levels and audit logging
- **Code Generation**: Per-domain TypeScript generation with shared scalars and configurations
- **Real-time Features**: WebSocket subscriptions, optimistic updates with security considerations
- **Hasura Integration**: JWT-based authentication, row-level security, role-based permissions

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

```
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
- `@/graphql/*` - GraphQL operations
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

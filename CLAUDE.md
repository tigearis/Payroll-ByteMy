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

## Architecture Overview

### Authentication System
This is a multi-layered authentication system with Clerk as the primary provider:

- **Centralized Token Management**: Singleton pattern managers handle JWT tokens with automatic refresh, caching, and mutex protection
- **RBAC Implementation**: Hierarchical roles (`admin` > `org_admin` > `manager` > `consultant` > `viewer`) with permission-based access control
- **Security Features**: Session expiry handling, MFA support (feature-flagged), database user validation for SOC2 compliance
- **Key Files**: `lib/auth/centralized-token-manager.ts`, `lib/auth/server-token-manager.ts`, `lib/api-auth.ts`, `middleware.ts`

### GraphQL Architecture
Domain-driven GraphQL setup with sophisticated code generation:

- **Domain Organization**: Each business domain (`payrolls`, `clients`, `staff`, `users`, etc.) has its own GraphQL folder structure: `domains/{domain}/graphql/{fragments,queries,mutations,subscriptions}.graphql`
- **Dual Apollo Clients**: 
  - Standard client (`lib/apollo-client.ts`) for general use
  - Secure client (`lib/apollo/secure-client.ts`) for SOC2-compliant operations with security levels and audit logging
- **Code Generation**: Per-domain TypeScript generation with shared scalars and configurations
- **Real-time Features**: WebSocket subscriptions, optimistic updates with security considerations

### Security Layer
Defense-in-depth architecture following SOC2 compliance:

- **Multi-Level Data Classification**: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` with role-based data masking
- **Enhanced Route Monitoring**: Real-time request monitoring, suspicious pattern detection, security alerting
- **Security Middleware Stack**: Authentication, route protection, MFA enforcement, API signing
- **Key Files**: `lib/security/config.ts`, `lib/security/enhanced-route-monitor.ts`

### Database Integration
GraphQL-first approach using Hasura over PostgreSQL:

- **Hasura Configuration**: Metadata-driven with YAML configuration, custom functions, role-based row-level security
- **Database Features**: Versioned migrations, audit tables, payroll versioning system, RBAC at database level
- **Data Access**: Network-only policies for security, graceful error handling, cache invalidation strategies

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
- `NEXT_PUBLIC_HASURA_GRAPHQL_URL` - Hasura GraphQL endpoint
- `HASURA_SERVICE_ACCOUNT_TOKEN` - Service account JWT (not admin secret)
- `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `FEATURE_MFA_ENABLED` - Feature flag for MFA functionality
- `API_SECRET_KEY` - API signing and security operations

### Security Compliance
- All API routes require authentication except those in the public routes list in `middleware.ts`
- SOC2 compliance implemented through audit logging, data classification, and security monitoring
- Database operations use service account tokens with limited permissions, never admin secrets
- Security headers configured in `next.config.js` including CSP, HSTS, and frame protection

### Code Generation
- GraphQL types are generated per-domain for better modularity
- Run `pnpm codegen` after schema changes
- Generated files are in `domains/{domain}/graphql/generated/` and `shared/types/generated/`
- Shared scalars defined in `config/codegen.ts`

## Development Notes

- Next.js 15 with App Router
- TypeScript with strict mode enabled
- Tailwind CSS for styling with custom design tokens in `lib/design-tokens/`
- pnpm as package manager (version 10.12.1)
- Production builds disable TypeScript and ESLint checks (configured in `next.config.js`)
- WIP pages (ai-assistant, calendar, tax-calculator) are redirected to 404 in production
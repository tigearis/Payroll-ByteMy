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

## Important Notes

- **Never commit** environment secrets or API keys
- **Always use** generated GraphQL types for type safety  
- **Follow SOC2 guidelines** for any security-related changes
- **Test permission boundaries** when adding new features
- **Use the existing design system** (shadcn/ui components)
- **Maintain audit trails** for all data modifications
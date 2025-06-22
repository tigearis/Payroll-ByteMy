# GraphQL Code Generation System Documentation

## Quick Start Guide

### TL;DR

```bash
# Generate all types and hooks
pnpm codegen

# Watch mode for development
pnpm codegen:watch

# Import and use
import { GetClientsDocument } from '@/domains/clients';
```

### Setup Steps

1. **Environment Variables**

   Ensure these are set in `.env.local`:

   ```env
   NEXT_PUBLIC_HASURA_GRAPHQL_URL=your_hasura_endpoint
   HASURA_ADMIN_SECRET=your_admin_secret
   ```

2. **Add GraphQL Operations**

   Create or edit files in domain folders:

   ```
   domains/clients/graphql/
   ├── fragments.graphql    # Reusable fragments
   ├── queries.graphql      # Client queries
   ├── mutations.graphql    # Client mutations
   └── subscriptions.graphql # Real-time subscriptions
   ```

3. **Generate Code**

   ```bash
   pnpm codegen
   ```

   This creates:

   - `domains/clients/graphql/generated/index.ts` - All client operations
   - `domains/clients/index.ts` - Auto-exports everything
   - `shared/types/generated/` - Shared types and aggregated exports

4. **Import and Use**

   ```typescript
   // Option 1: Direct domain import
   import {
     GetClientsDocument,
     CreateClientDocument,
   } from "@/domains/clients";

   // Option 2: Shared aggregator
   import { GetClientsDocument } from "@/shared/types/generated";

   // Usage
   function ClientsList() {
     const { data, loading } = GetClientsDocument();

     if (loading) return <div>Loading...</div>;

     return (
       <ul>
         {data?.clients?.map((client) => (
           <li key={client.id}>{client.name}</li>
         ))}
       </ul>
     );
   }
   ```

---

## Overview

This project uses a unified, SOC2-compliant GraphQL code generation system that automatically generates TypeScript types, React hooks, and domain-specific operations from GraphQL schema and operations.

## Key Features

- **Unified Configuration**: Single `config/codegen.ts` file manages all code generation
- **Domain Isolation**: Each business domain has its own generated types and operations
- **Security Classification**: Operations are classified by security level (CRITICAL, HIGH, MEDIUM, LOW)
- **Automatic Exports**: Generated files are automatically exported through domain index files
- **Duplicate Elimination**: Shared scalars and configurations prevent code duplication
- **SOC2 Compliance**: Built-in audit logging and security headers

## Architecture

### Directory Structure

```
project-root/
├── config/
│   └── codegen.ts                    # Unified codegen configuration
├── shared/
│   ├── graphql/                      # Shared GraphQL operations
│   │   ├── fragments.graphql
│   │   ├── queries.graphql
│   │   ├── mutations.graphql
│   │   └── subscriptions.graphql
│   ├── types/generated/              # Generated shared types
│   │   ├── graphql.ts               # Base types
│   │   └── index.ts                 # Aggregated exports
│   ├── schema/                      # Schema documentation
│   │   ├── schema.graphql           # Full schema
│   │   ├── introspection.json       # Schema introspection
│   │   └── security-report.json     # Security audit report
│   └── index.ts                     # Main shared exports
├── domains/
│   └── {domain}/
│       ├── graphql/
│       │   ├── fragments.graphql
│       │   ├── queries.graphql
│       │   ├── mutations.graphql
│       │   ├── subscriptions.graphql
│       │   └── generated/
│       │       └── index.ts         # Generated domain operations
│       ├── types/                   # Domain-specific types
│       ├── services/               # Domain services
│       └── index.ts                # Auto-generated domain exports
```

### Domain Security Levels

#### CRITICAL (Admin + MFA + Full Audit)

- `auth` - Authentication and user sessions
- `audit` - Audit logging and compliance
- `permissions` - Role and permission management

#### HIGH (Role-based + Audit Logging)

- `users` - Employee PII and role management
- `clients` - Customer PII and business data
- `billing` - Financial and payment data

#### MEDIUM (Authentication + Basic Audit)

- `payrolls` - Payroll processing data
- `notes` - Internal communications
- `leave` - Employee leave data
- `work-schedule` - Work scheduling
- `external-systems` - External integrations

#### LOW (Basic Authentication)

- `shared` - Common infrastructure and reference data

## Commands

### Core Commands

```bash
# Generate all GraphQL types and operations
pnpm codegen

# Watch mode for development
pnpm codegen:watch

# Alternative command
pnpm generate
```

### Development Workflow

1. **Add GraphQL Operations**: Place new operations in the appropriate domain's `graphql/` folder
2. **Run Codegen**: Execute `pnpm codegen` to generate types and hooks
3. **Import Operations**: Use the auto-generated exports from domain index files
4. **Build**: Generated files are automatically formatted and linted

## Configuration Details

### Shared Scalars

The system defines unified scalar mappings to prevent duplication:

```typescript
const SHARED_SCALARS = {
  // PostgreSQL types
  UUID: "string",
  uuid: "string",
  timestamptz: "string",
  jsonb: "any",
  numeric: "number",

  // Custom enums
  user_role: "UserRole",
  payroll_status: "PayrollStatus",

  // Security-enhanced scalars
  EncryptedString: "string",
  MaskedString: "string",
};
```

### Automatic Export Management

Each domain gets an auto-generated `index.ts` file that exports:

- All GraphQL operations from `./graphql/generated`
- Domain-specific types from `./types` (if exists)
- Domain services from `./services` (if exists)

### Security Features

- **Classification Headers**: All generated files include security classification
- **Audit Metadata**: Operation security levels are embedded in generated code
- **Compliance Reporting**: Security report generated with each build

## Usage Examples

### Importing Generated Operations

```typescript
// From a specific domain
import { GetClientsDocument, CreateClientMutation } from "@/domains/clients";

// From shared operations
import { GetDashboardStatsDocument } from "@/shared";

// From the central aggregator
import { GetUsersDocument } from "@/shared/types/generated";
```

### Adding New Operations

1. **Create GraphQL File**: Add to appropriate domain's `graphql/` folder

```graphql
# domains/clients/graphql/queries.graphql
query GetClientDetails($id: uuid!) {
  clients_by_pk(id: $id) {
    id
    name
    contact_email
    status
  }
}
```

2. **Run Codegen**: `pnpm codegen`

3. **Use Generated Hook**:

```typescript
import { GetClientDetailsDocument } from "@/domains/clients";

function ClientProfile({ clientId }: { clientId: string }) {
  const { data, loading, error } = GetClientDetailsDocument({
    variables: { id: clientId },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.clients_by_pk?.name}</div>;
}
```

## File Generation Rules

### When Files Are Generated

- Domain has at least one non-empty GraphQL file with actual operations
- Files contain `query`, `mutation`, `subscription`, or `fragment` definitions
- Empty files or comment-only files are ignored

### Output Structure

```
domains/{domain}/graphql/generated/index.ts - Domain operations & hooks
domains/{domain}/index.ts                   - Auto-generated domain exports
shared/types/generated/graphql.ts           - Base types only
shared/types/generated/index.ts             - Central aggregator
shared/schema/                              - Schema documentation
```

## Security Compliance

### SOC2 Features

- **Data Classification**: All operations classified by sensitivity level
- **Audit Logging**: Security metadata embedded in generated code
- **Access Controls**: Role-based operation documentation
- **Compliance Reporting**: Automated security audit reports

### Generated Security Headers

Every generated file includes:

- SOC2 compliance header
- Domain security classification
- Access control requirements
- Auto-export indicators

## Troubleshooting

### Common Issues

1. **Import Errors**: Run `pnpm codegen` to generate missing files
2. **Type Errors**: Check scalar mappings in `config/codegen.ts`
3. **Missing Operations**: Ensure GraphQL files have actual operations (not just comments)

### Debugging

```bash
# Check which domains have valid operations
node -e "
const { domainHasValidOperations, domains } = require('./config/codegen.ts');
domains.forEach(d => console.log(d.name, domainHasValidOperations(d.name)));
"

# Validate GraphQL files
pnpm codegen --dry-run

# Generate with verbose output
pnpm codegen --verbose
```

### File Validation

The system automatically validates GraphQL files by:

- Removing comments and whitespace
- Checking for actual operation definitions
- Filtering out empty or scalar-only files

## Migration from Old System

### Breaking Changes

- Removed duplicate `codegen-secure.ts` and `codegen-soc2.ts` files
- Consolidated all configuration into single `config/codegen.ts`
- Changed output paths for better domain isolation
- Automatic export management replaces manual exports

### Migration Steps

1. **Remove Old Configs**: Delete `codegen-secure.ts` and `codegen-soc2.ts`
2. **Update Imports**: Change imports to use new domain-based paths
3. **Run Codegen**: Generate new files with `pnpm codegen`
4. **Update References**: Update any hardcoded import paths

### Compatibility

- All existing GraphQL operations continue to work
- Generated hook names remain the same
- Type definitions are backward compatible
- Scalar mappings preserved from original configs

## Performance Optimizations

### Features

- **Deduplication**: Fragments and types are automatically deduplicated
- **Tree Shaking**: ES modules with proper exports for tree shaking
- **Type Safety**: Strict scalar mappings and type validation
- **Lazy Loading**: Domain isolation enables better code splitting

### Generated Code Quality

- **Prettier**: All generated files are automatically formatted
- **ESLint**: Automatic linting with fixes applied
- **TypeScript**: Strict type checking with proper import statements
- **Documentation**: Generated code includes comprehensive JSDoc comments

## Best Practices

### Organization

1. **Domain Boundaries**: Keep operations within logical domain boundaries
2. **Shared Operations**: Use `shared/graphql/` for cross-domain queries
3. **Security Classification**: Follow security levels when placing operations
4. **Naming Conventions**: Use descriptive operation names

### Performance

1. **Fragment Usage**: Use fragments to reduce duplication
2. **Query Optimization**: Include only necessary fields
3. **Pagination**: Implement proper pagination for large datasets
4. **Caching**: Leverage Apollo Client caching strategies

### Security

1. **Data Classification**: Respect security levels when accessing operations
2. **Audit Logging**: Implement proper audit logging for sensitive operations
3. **Role Validation**: Validate user roles before operation access
4. **Error Handling**: Implement secure error handling patterns

## Future Enhancements

### Planned Features

- **Custom Plugins**: Support for custom codegen plugins
- **Runtime Validation**: Automatic operation validation
- **Metrics Collection**: Performance metrics for generated operations
- **Advanced Security**: Dynamic security rule generation

### Configuration Extensions

The unified configuration supports easy extension for:

- Additional domains
- Custom scalar mappings
- Security rule customization
- Output path modifications

## Support

For issues with the codegen system:

1. Check this documentation
2. Verify GraphQL file syntax
3. Run `pnpm codegen --verbose` for detailed output
4. Check the generated security report in `shared/schema/security-report.json`

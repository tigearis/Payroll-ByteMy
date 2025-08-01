# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ALWAYS THINK DEEPLY

## 🏗️ Project Architecture Overview

**Payroll Matrix** is an enterprise-grade SOC2-compliant payroll management system for Australian businesses. Built with modern technology stack and sophisticated enterprise architecture patterns.

### Memory

- **Database URL Handling**: Never use `$DATABASE_URL` always use the literal connection string `'postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable'` always in single quotes
- **Package Management**: Only run pnpm commands, never npm

## 🔐 Hasura GraphQL Permissions System

The system uses a comprehensive role-based access control (RBAC) system implemented through Hasura GraphQL permissions:

### Role Hierarchy
- **viewer** → **consultant** → **manager** → **org_admin** → **developer**
- Uses Hasura inherited roles for permission inheritance
- Each role has specific access patterns aligned with business workflows

### Critical Guidelines for Hasura Work

#### Column Name Consistency
- **ALWAYS** use database column names (snake_case) in permissions, NOT GraphQL field names (camelCase)
- ❌ Wrong: `userId`, `createdAt`, `isImportant`  
- ✅ Correct: `user_id`, `created_at`, `is_important`

#### Permission Patterns
- **Manager Oversight**: Managers can access data from consultants they supervise
- **Consultant Assignment**: Consultants access payrolls where they are primary or backup
- **User Ownership**: Personal data accessible only to the owner

#### Schema Verification
```bash
# Before adding permissions, always verify column names:
grep -A 20 "type TableName" /shared/schema/schema.graphql
grep -A 15 "CREATE TABLE table_name" /database/schema.sql

# Apply and check consistency:
hasura metadata apply
hasura metadata ic list
```

### Documentation
- **Primary Reference**: `/docs/security/HASURA_PERMISSIONS_SYSTEM.md`
- **Status**: All core tables have comprehensive permissions (25+ tables)
- **Consistency**: 100% consistent metadata (40+ inconsistencies resolved)

### Key Tables with Enhanced Permissions
- `billing_items`: 10+ missing columns added, full CRUD for consultants/managers
- `time_entries`: Complete permissions with proper filtering
- `email_templates`: Corrected column references and approval logic
- `notes`, `files`, `leave`: Fixed all snake_case column names
- `payrolls`, `clients`: Proper relationship-based filtering

## 🔧 TypeScript Standards & Error Resolution

### Critical Type Safety Requirements

**MANDATORY**: The codebase MUST maintain zero TypeScript errors with strict type checking enabled.

### Common TypeScript Patterns & Solutions

#### 1. Optional Property Handling with exactOptionalPropertyTypes
When passing optional properties to components, use conditional spread syntax:
```typescript
// ✅ Correct - Only pass defined properties
<Component
  {...(userId && { userId })}
  {...(teamMembers && { teamMembers })}
  {...(onCallback && { onCallback })}
/>

// ❌ Wrong - Passing undefined values
<Component
  userId={userId}  // Error if userId can be undefined
  onCallback={onCallback}  // Error if onCallback can be undefined
/>
```

#### 2. GraphQL & Apollo Client Types
- **Always import proper Apollo Client types**: `DocumentNode`, `TypedDocumentNode`, `OperationVariables`
- **Handle GraphQL errors correctly**: Convert `GraphQLFormattedError[]` to `Error[]`
- **Variables handling**: Use conditional spread `{...(variables && { variables })}` to avoid undefined assignment

```typescript
// ✅ Correct Apollo Client implementation
import { gql, DocumentNode, TypedDocumentNode, OperationVariables } from "@apollo/client";

async executeQuery<T = unknown>(
  query: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  variables?: Record<string, unknown>
): Promise<{ data?: T; errors?: readonly Error[] }> {
  const result = await client.query({
    query,
    ...(variables && { variables }), // Conditional spread
    fetchPolicy: "network-only",
  });

  return { 
    data: result.data, 
    errors: result.errors ? result.errors.map(err => new Error(err.message)) : [] 
  };
}
```

#### 3. Interface Consistency
- **Local vs Imported Interfaces**: Ensure local interfaces match imported types exactly
- **Required Properties**: Add missing required properties like `isActive: boolean` to maintain compatibility

#### 4. Array Type Initialization
```typescript
// ✅ Correct - Typed array initialization
const [state, setState] = useState({
  errors: [] as any[], // Explicit typing prevents never[] inference
});

// ❌ Wrong - TypeScript infers never[]
const [state, setState] = useState({
  errors: [], // This becomes never[] and can't accept values
});
```

#### 5. JSX Children Prop Issues
```typescript
// ✅ Correct - No comments inside JSX that expects single child
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    {/* Comments outside single-child components only */}
  </BarChart>
</ResponsiveContainer>

// ❌ Wrong - Comment treated as second child
<ResponsiveContainer width="100%" height={300}> {/* This comment causes error */}
  <BarChart data={data} />
</ResponsiveContainer>
```

#### 6. Type Guards for Complex Objects
```typescript
// ✅ Correct - Type guard for property access
const definition = query.definitions[0];
const operationName = definition && 'name' in definition ? definition.name?.value : 'unknown';

// ❌ Wrong - Direct property access on union types
const operationName = query.definitions[0]?.name?.value; // Error: not all DefinitionNode types have 'name'
```

#### 7. IntrospectionResult Property Access
```typescript
// ✅ Correct - Use __schema for IntrospectionResult
const queryType = introspection.__schema.types.find((type: any) => type.name === 'query_root');

// ❌ Wrong - 'schema' property doesn't exist
const queryType = introspection.schema.types.find(type => type.name === 'query_root');
```

### Enforcement Rules

#### Pre-Commit Requirements
```bash
# MUST pass before any commit
pnpm run type-check  # Zero errors required
pnpm run lint        # Clean linting required
```

#### Development Workflow
1. **Before making changes**: Run `pnpm run type-check` to establish baseline
2. **During development**: Fix TypeScript errors immediately - never accumulate them
3. **Before PR**: Ensure `pnpm run type-check` passes with zero errors
4. **Code review**: TypeScript errors are blocking issues

#### Error Categories & Response
- **High Priority** (blocking): Apollo Client types, interface mismatches, property access errors
- **Medium Priority** (fix same day): Array type issues, conditional property handling
- **Low Priority** (fix before PR): Type annotations, unused imports

### Type Safety Best Practices
- **Explicit typing** over `any` where possible, but use `any` strategically for complex GraphQL responses
- **Conditional spreading** for all optional properties in components
- **Type guards** for union types and complex object property access
- **Proper error handling** with typed error arrays and conversion functions

## 📚 Documentation Structure

- `/docs/security/` - Security and permissions documentation
- `/docs/api/` - API documentation and guides  
- `/docs/business-logic/` - Business logic and workflow documentation
- `/docs/user-guides/` - Role-specific user guides
- `/docs/deployment/` - Deployment and infrastructure guides
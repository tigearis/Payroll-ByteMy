# TypeScript Development Guide

## Quick Reference

### Current Status ✅
- **Build Status**: Clean (all TypeScript errors resolved)
- **Type Safety**: Strict mode enabled
- **GraphQL Integration**: Fully typed with generated types
- **SOC2 Compliance**: Type-safe audit logging and permissions

## Development Workflow

### 1. Before Starting Work
```bash
# Verify clean baseline
pnpm type-check

# Start development with type checking
pnpm dev
```

### 2. After Making Changes
```bash
# Check types frequently during development
pnpm type-check

# Run quality checks before committing
pnpm quality:check
```

### 3. GraphQL Changes
```bash
# After modifying .graphql files
pnpm codegen

# Verify types are still valid
pnpm type-check

# Test build
pnpm build
```

### 4. Pre-Commit Checklist
```bash
# 1. Quality checks
pnpm quality:check

# 2. Production build test
pnpm build

# 3. Verify no TypeScript errors
pnpm type-check
```

## Common Patterns

### GraphQL Type Usage
```typescript
// ✅ Correct - Use generated types
import { GetUsersQuery, User } from '@/domains/users/graphql/generated/graphql';

// ✅ Use proper query response structure (check for aliases)
const { data } = useQuery(GetCurrentUserDocument);
const currentUser = data?.user; // Note: 'user' is an alias for 'userById'
```

### User Metadata Pattern
```typescript
// ✅ Required pattern for all user creation/invitation
import { getPermissionsForRole } from '@/lib/auth/permissions';

const publicMetadata = {
  role,
  permissions: getPermissionsForRole(role), // Required!
  // ... other metadata
};
```

### Safe Property Access
```typescript
// ✅ Use optional chaining and defaults
const weight = weights?.fieldWeight || 1;
const hasUser = !!result?.user;

// ✅ Handle potentially undefined objects
const permissions = user?.permissions ?? [];
```

### GraphQL Mutations
```typescript
// ✅ Check generated types for exact structure
const variables: LogAuditEventMutationVariables = {
  input: { // Note: 'input', not 'object'
    action: 'user_created',
    resourceType: 'user',
    // ...
  }
};

// ✅ Auth events expect flat variables
const authVariables: LogAuthEventMutationVariables = {
  eventType: 'login', // Direct properties, not nested
  userId: user.id,
  // ...
};
```

## Type Safety Rules

### 1. Always Use Generated Types
- Import from `domains/{domain}/graphql/generated/graphql.ts`
- Never manually type GraphQL responses
- Check aliases in GraphQL queries if properties seem missing

### 2. Permission System Types
- Use `CustomPermission` from type exports (not `Permission`)
- Always include `permissions` in `UserPublicMetadata`
- Cast roles to `Role` type when needed: `role as Role`

### 3. Optional Properties
- Use optional chaining (`?.`) for potentially undefined properties
- Provide fallback values for required properties
- Handle both `null` and `undefined` cases

### 4. Mutation Variables
- Check generated types for exact structure
- Some mutations expect `input` parameter, others expect flat variables
- Audit mutations use `input`, auth events use flat structure

## Troubleshooting

### "Property does not exist" on GraphQL Response
1. Check GraphQL query for aliases
2. Use alias name in TypeScript, not original field name
3. Regenerate types if schema changed: `pnpm codegen`

### "Missing permissions property"
1. Add `permissions: getPermissionsForRole(role)` to metadata
2. Import `getPermissionsForRole` from `@/lib/auth/permissions`
3. Ensure role is cast to `Role` type if needed

### "Object literal may only specify known properties"
1. Check generated mutation variable types
2. Verify variable structure (flat vs nested)
3. Remove any extra properties not in the schema

### Type Import Errors
1. Use `CustomPermission` instead of `Permission`
2. Check `types/permissions.ts` for available exports
3. Verify import paths are correct

## Configuration Files

### tsconfig.json
- Strict mode enabled
- Path mapping configured for `@/` imports
- GraphQL generated types included
- Next.js app router support

### Key Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Best Practices

### 1. Type Guards
```typescript
// ✅ Create type guards for runtime validation
function isValidRole(value: any): value is Role {
  return typeof value === 'string' && 
    ['developer', 'org_admin', 'manager', 'consultant', 'viewer'].includes(value);
}
```

### 2. Error Handling
```typescript
// ✅ Type-safe error handling
try {
  const result = await mutation({ variables });
  if (result.errors) {
    // Handle GraphQL errors
  }
} catch (error) {
  if (error instanceof ApolloError) {
    // Type-safe Apollo error handling
  }
}
```

### 3. Component Props
```typescript
// ✅ Extend existing types when possible
interface UserCardProps {
  user: User; // Use generated User type
  onEdit?: (user: User) => void;
}
```

## Resources

- [TypeScript Build Fixes](../TYPESCRIPT_BUILD_FIXES.md) - Recent fixes documentation
- [GraphQL Development](./GRAPHQL_TESTING_STRATEGY.md) - GraphQL type generation
- [CLAUDE.md](../CLAUDE.md) - Main development guidelines
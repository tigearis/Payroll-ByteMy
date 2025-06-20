# Case Convention System Documentation

This document describes the comprehensive case convention system implemented for the Payroll-ByteMy application.

## Overview

The case convention system enforces consistent naming patterns across the entire codebase through:

1. **TypeScript Configuration** - Enhanced with strict case checking
2. **ESLint Rules** - Automated linting for naming conventions
3. **Case Convention Config** - Centralized configuration for all naming patterns
4. **Validation Scripts** - Automated checking and fixing of naming violations

## File Structure

```
config/
├── case-conventions.config.ts  # Central configuration for all case conventions
└── eslint.config.js           # ESLint rules with case convention enforcement

scripts/
└── validate-case-conventions.ts # Automated validation and fixing script

docs/
└── CASE_CONVENTION_SYSTEM.md   # This documentation

Type-Case-Conventions.md         # Reference guide for conventions
```

## Case Convention Rules

### File & Directory Names
**Convention: kebab-case**

- ✅ `user-profile-card.tsx`
- ✅ `auth-utils.ts`
- ✅ `payroll-schedule.graphql`
- ❌ `UserProfileCard.tsx`
- ❌ `authUtils.ts`
- ❌ `payroll_schedule.graphql`

### React Components
**Convention: PascalCase**

- ✅ `export const UserProfileCard = () => {}`
- ✅ `export const PayrollScheduleView = () => {}`
- ❌ `export const userProfileCard = () => {}`
- ❌ `export const payroll_schedule_view = () => {}`

### Functions & Variables
**Convention: camelCase**

- ✅ `const getCurrentUser = () => {}`
- ✅ `const userRole = user?.role`
- ✅ `const handleSubmit = () => {}`
- ❌ `const GetCurrentUser = () => {}`
- ❌ `const user_role = user?.role`

### Constants
**Convention: SCREAMING_SNAKE_CASE**

- ✅ `export const DEFAULT_ROLE = "viewer"`
- ✅ `export const MAX_RETRY_ATTEMPTS = 3`
- ❌ `export const defaultRole = "viewer"`
- ❌ `export const maxRetryAttempts = 3`

### Types & Interfaces
**Convention: PascalCase**

- ✅ `interface UserMetadata {}`
- ✅ `type PayrollStatus = "active" | "inactive"`
- ✅ `enum UserRole { ADMIN = "admin" }`
- ❌ `interface userMetadata {}`
- ❌ `type payroll_status = "active" | "inactive"`

### Custom Hooks
**Convention: camelCase starting with 'use'**

- ✅ `export const useAuth = () => {}`
- ✅ `export const useUserRole = () => {}`
- ❌ `export const UseAuth = () => {}`
- ❌ `export const authHook = () => {}`

### GraphQL Operations
**Convention: PascalCase**

- ✅ `query GetUserByRole($role: String!) {}`
- ✅ `mutation UpdateUserRole($userId: String!) {}`
- ❌ `query getUserByRole($role: String!) {}`
- ❌ `mutation update_user_role($userId: String!) {}`

### Database Fields
**Convention: snake_case**

- ✅ `user_id`, `created_at`, `payroll_status`
- ❌ `userId`, `createdAt`, `payrollStatus`

## Domain-Specific Patterns

### Payroll Entities
- Types: `Payroll`, `PayrollDate`, `PayrollCycle`, `PayrollStatus`
- Functions: `generatePayrollDates`, `processPayrollBatch`, `calculatePayrollTax`
- Enums: `PayrollStatus.ACTIVE`, `PayrollCycleType.WEEKLY`

### Authentication Entities
- Types: `User`, `Role`, `Permission`, `AuthState`
- Functions: `authenticateUser`, `validateRole`, `checkPermission`
- Hooks: `useAuth`, `useUserRole`, `usePermissions`

### Client Management
- Types: `Client`, `ClientExternalSystem`
- Functions: `createClient`, `updateClientStatus`, `getClientByAuth`

## Configuration Files

### case-conventions.config.ts

Central configuration containing:
- File naming patterns
- Identifier patterns
- Domain-specific patterns
- Validation functions
- Case transformation utilities

### ESLint Integration

The ESLint configuration enforces naming conventions through:
```javascript
"@typescript-eslint/naming-convention": [
  "error",
  // Detailed rules for each identifier type
]
```

## Validation & Automation

### Manual Validation
```bash
# Check all files for naming convention violations
pnpm validate:naming

# Show what would be fixed
pnpm validate:naming:fix

# Actually fix naming violations
pnpm validate:naming:dry-run
```

### Automated Validation
The validation runs on:
- Pre-commit hooks (planned)
- CI/CD pipeline (planned)
- Development linting

### Validation Script Features
- Recursive directory scanning
- Pattern matching for all file types
- Automatic suggestion generation
- Dry-run and fix modes
- Detailed error reporting

## TypeScript Configuration

Enhanced TypeScript settings for case enforcement:
```json
{
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "strict": true
  }
}
```

## Best Practices

### When Adding New Files
1. Use kebab-case for file names
2. Ensure component names match PascalCase
3. Follow domain-specific patterns
4. Run validation before committing

### When Refactoring
1. Run validation script first
2. Check for any new violations
3. Fix violations before proceeding
4. Update related documentation

### When Adding New Domains
1. Define domain-specific patterns in config
2. Add validation rules for domain entities
3. Update documentation
4. Test validation with new patterns

## Common Violations & Fixes

### File Names
```
❌ UserProfile.tsx → ✅ user-profile.tsx
❌ auth_utils.ts → ✅ auth-utils.ts
❌ PayrollList.tsx → ✅ payroll-list.tsx
```

### Component Names
```typescript
// ❌ Wrong
export const userProfileCard = () => {}

// ✅ Correct  
export const UserProfileCard = () => {}
```

### Function Names
```typescript
// ❌ Wrong
const GetUserRole = () => {}
const handle_submit = () => {}

// ✅ Correct
const getUserRole = () => {}
const handleSubmit = () => {}
```

### Constants
```typescript
// ❌ Wrong
const defaultRole = "viewer"
const maxRetries = 3

// ✅ Correct
const DEFAULT_ROLE = "viewer"
const MAX_RETRIES = 3
```

## Integration with Development Workflow

### VS Code Settings
Recommended VS Code settings for case convention support:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "eslint.validate": ["typescript", "typescriptreact"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Git Hooks
Pre-commit hook to validate naming:
```bash
#!/bin/sh
pnpm validate:naming
```

### CI/CD Integration
```yaml
- name: Validate Case Conventions
  run: pnpm validate:naming
```

## Troubleshooting

### Common Issues

1. **ESLint conflicts with Prettier**
   - Ensure Prettier config allows case-sensitive formatting
   - Use eslint-config-prettier to disable conflicting rules

2. **Legacy files not following conventions**
   - Use `pnpm validate:naming:fix` for automatic fixes
   - Plan gradual migration for large refactors

3. **GraphQL schema naming conflicts**
   - Database uses snake_case, GraphQL uses camelCase
   - Use field mapping in resolvers

### Performance Considerations

- Validation script skips node_modules and build folders
- Uses efficient regex patterns
- Caches results for repeated runs
- Supports incremental validation

## Future Enhancements

### Planned Features
1. Integration with IDE extensions
2. Real-time validation during development
3. Automatic import statement fixing
4. Custom domain pattern validation
5. Integration with design system naming

### Maintenance
- Regular pattern updates for new domains
- Performance optimization
- Rule refinement based on usage
- Documentation updates

## Support

For questions or issues with the case convention system:
1. Check this documentation
2. Run `pnpm validate:naming` for specific violations
3. Review Type-Case-Conventions.md for reference
4. Consult the case-conventions.config.ts for patterns
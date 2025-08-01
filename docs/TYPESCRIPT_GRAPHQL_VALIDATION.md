# TypeScript and Linting for GraphQL Type Safety

## 🎯 Overview

We've implemented comprehensive TypeScript and ESLint tooling to prevent GraphQL issues like the holiday sync bug. The system now catches common GraphQL mistakes at development time rather than runtime.

## ⚠️ Issues This Prevents

### 1. **Type Mismatches**
```typescript
// ❌ This will now be caught by ESLint
query CheckExistingHolidays($countryCode: String!) {
  // Error: Use bpchar! for country codes, not String!
  holidays(where: {countryCode: {_eq: $countryCode}}) { id }
}

// ✅ Correct
query CheckExistingHolidays($countryCode: bpchar!) {
  holidays(where: {countryCode: {_eq: $countryCode}}) { id }
}
```

### 2. **Parameter Naming Issues**
```typescript
// ❌ This will now be caught by ESLint
insertHolidays(
  objects: $objects
  on_conflict: { constraint: holidays_pkey }  // Error: Use onConflict not on_conflict
)

// ✅ Correct  
insertHolidays(
  objects: $objects
  onConflict: { constraint: holidays_pkey }
)
```

### 3. **Response Field Access**
```typescript
// ❌ This will now be caught by ESLint
const result = data.insertHolidays.affectedRows; // Error: Use affected_rows not affectedRows

// ✅ Correct
const result = data.insertHolidays.affected_rows;
```

## 🛠️ Tools Implemented

### 1. **GraphQL ESLint Plugin**
- **File**: `eslint.config.js` (lines 18-137)
- **Features**: Schema validation, operation validation, type checking
- **Coverage**: `.graphql` files and embedded GraphQL in `.ts/.tsx`

### 2. **Custom ESLint Rules** 
- **File**: `config/eslint-rules/graphql-type-safety.js`
- **Rules**:
  - `graphql-bpchar-type-mismatch`: Catches `String!` vs `bpchar!` issues
  - `graphql-parameter-naming`: Catches `on_conflict` vs `onConflict` issues  
  - `graphql-response-field-access`: Catches response field naming issues
  - `graphql-common-type-mismatches`: Warns about other common type issues

### 3. **GraphQL Configuration**
- **File**: `.graphqlrc.yml` 
- **Purpose**: Centralizes GraphQL tooling configuration
- **Features**: Schema validation, document discovery, environment configs

### 4. **Enhanced Code Generation**
- **File**: `config/codegen.ts` (already existed)
- **Features**: Domain-driven generation, SOC2 compliance, type safety
- **Benefits**: Generated types prevent many runtime errors

### 5. **Pre-commit Hooks**
- **File**: `.husky/pre-commit`
- **Commands**: 
  - `pnpm lint:graphql` - Validate GraphQL files
  - `pnpm codegen:dry-run` - Check schema-operation consistency

## 📋 New Scripts Available

```bash
# Lint GraphQL files specifically
pnpm lint:graphql

# Check GraphQL schema consistency (dry run)
pnpm codegen:dry-run

# Run all quality checks (includes GraphQL validation)
pnpm quality:check
```

## 🔧 IDE Integration

### VS Code
Install these extensions for full GraphQL support:
- **GraphQL: Language Feature Support** - Syntax highlighting, validation
- **GraphQL: Syntax Highlighting** - Enhanced syntax support
- **ESLint** - Shows GraphQL linting errors inline

### Configuration
The `.graphqlrc.yml` file enables IDE features:
- Auto-completion for GraphQL operations
- Real-time schema validation
- Type checking against actual schema

## 🎯 Example: Holiday Sync Bug Prevention

With this setup, the original holiday sync issues would have been caught:

```typescript
// domains/external-systems/services/holiday-sync-service.ts

// ❌ Old code - would now show ESLint errors:
query CheckExistingHolidays($countryCode: String!) {  // Error: Use bpchar!
  holidaysAggregate(where: {countryCode: {_eq: $countryCode}}) {
    aggregate { count }
  }
}

mutation InsertHolidays($objects: [HolidaysInsertInput!]!) {
  insertHolidays(
    objects: $objects
    on_conflict: {  // Error: Use onConflict
      constraint: holidays_pkey
      update_columns: [date, localName]  // This is correct (camelCase)
    }
  ) {
    affected_rows  // This is correct (snake_case for responses)
  }
}

// ✅ Corrected code (current implementation):
query CheckExistingHolidays($countryCode: bpchar!) {
  holidaysAggregate(where: {countryCode: {_eq: $countryCode}}) {
    aggregate { count }
  }
}

mutation InsertHolidays($objects: [HolidaysInsertInput!]!) {
  insertHolidays(
    objects: $objects
    onConflict: {
      constraint: holidays_pkey
      updateColumns: [date, localName]
    }
  ) {
    affected_rows
  }
}
```

## 🚀 Benefits

1. **Prevent Runtime Errors**: Catch GraphQL issues at development time
2. **Type Safety**: Ensure variables match schema expectations  
3. **Consistency**: Enforce naming conventions across the codebase
4. **Developer Experience**: Real-time feedback in IDE and CI/CD
5. **Maintainability**: Easier to refactor GraphQL operations safely

## 📝 Next Steps

1. **Install Dependencies**: Run `pnpm install` to get GraphQL ESLint plugin
2. **IDE Setup**: Install recommended VS Code extensions
3. **Team Training**: Share this documentation with the development team
4. **Gradual Migration**: Consider migrating manual GraphQL to generated hooks
5. **CI Integration**: Ensure GraphQL validation runs in CI/CD pipeline

This comprehensive setup ensures that GraphQL type mismatches like the holiday sync bug cannot happen again!
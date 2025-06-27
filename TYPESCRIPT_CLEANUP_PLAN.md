# TypeScript Types Cleanup Plan

## 🚨 CRITICAL ISSUE IDENTIFIED

**Root Cause of Apollo GraphQL Errors**: PayrollStatus enum values in TypeScript don't match your GraphQL schema.

### Current State (Causing Errors):
```typescript
// In types/enums.ts and types/globals.d.ts
type PayrollStatus = "Active" | "Implementation" | "Inactive"
```

### GraphQL Schema Has:
```graphql
enum PayrollStatus {
  Processing
  Draft  
  PendingApproval
  Approved
  Completed
  Failed
  PendingReview
  Issue
  Pending
}
```

**This mismatch is causing the "invalid input value for enum payroll_status" errors.**

## Immediate Actions Required

### 1. **DELETE These Files** ❌
```
types/globals.d.ts          # Duplicate of global.d.ts
types/interface.ts          # Basic version of interfaces.ts
types/scalars.ts           # Content moved to global.d.ts
```

### 2. **UPDATE PayrollStatus Everywhere** 🔧
Replace all PayrollStatus definitions to match GraphQL:

**Files to update:**
- `types/enums.ts` → Delete PayrollStatus enum
- `shared/graphql/enums.graphql` → Keep as source of truth
- All TypeScript code using PayrollStatus

**Update to:**
```typescript
// Use GraphQL-generated type instead of manual enum
type PayrollStatus = "Processing" | "Draft" | "PendingApproval" | "Approved" | "Completed" | "Failed" | "PendingReview" | "Issue" | "Pending"
```

### 3. **Consolidate Type Files** 📁

#### Keep This Structure:
```
types/
├── global.d.ts          # Global types and Hasura re-exports ✅
├── interfaces.ts        # Business entity interfaces ✅  
├── components.ts        # UI component types ✅
├── api.ts              # API request/response types ✅
└── permissions.ts       # Permission type exports ✅
```

#### Delete These:
```
types/
├── globals.d.ts         # ❌ DELETE - Duplicate
├── interface.ts         # ❌ DELETE - Outdated version  
├── enums.ts            # ❌ DELETE - Use Hasura enums
└── scalars.ts          # ❌ DELETE - Moved to global.d.ts
```

## Detailed Migration Steps

### Step 1: Fix PayrollStatus Immediately
```bash
# 1. Update your GraphQL schema if needed
# 2. Run codegen to regenerate types
pnpm codegen

# 3. Search and replace PayrollStatus usage
grep -r "Active.*Implementation.*Inactive" . --include="*.ts" --include="*.tsx"
```

### Step 2: Remove Duplicate Types
- Delete `types/globals.d.ts` entirely
- Merge any unique content from `types/interface.ts` into `types/interfaces.ts`
- Remove manual enums that duplicate Hasura types

### Step 3: Update Imports
Update any imports from deleted files:
```typescript
// ❌ Old imports (will break)
import { PayrollStatus } from "../types/enums";
import { Payroll } from "../types/globals";

// ✅ New imports
import type { Payroll } from "@/types/interfaces";
// PayrollStatus is now global from Hasura
```

### Step 4: Domain Type Cleanup
Each domain should only define:
- Domain-specific interfaces not shared globally
- Component prop types specific to that domain
- Utility types for that domain only

**Keep separate:**
- `domains/payrolls/types/payroll.ts` - Domain-specific payroll types
- `domains/clients/types/client.ts` - Domain-specific client types
- etc.

## Breaking Changes to Expect

### 1. PayrollStatus Values Changed
**Old values** (will cause runtime errors):
- "Active" → **No longer valid**
- "Implementation" → **No longer valid**  
- "Inactive" → **No longer valid**

**New values** (from GraphQL schema):
- "Processing", "Draft", "PendingApproval", "Approved", "Completed", "Failed", "PendingReview", "Issue", "Pending"

### 2. Import Statements
Many import statements will need updating due to file deletions.

### 3. Type References
Global types are now consistently available without imports.

## Priority Order

### 🔥 **URGENT** (Fix Apollo Errors)
1. Update PayrollStatus enum values to match GraphQL
2. Run `pnpm codegen` to regenerate types
3. Update any hardcoded status values in your code

### 📋 **HIGH** (Reduce Maintenance)
1. Delete duplicate global type files
2. Consolidate interface definitions
3. Update import statements

### 🧹 **MEDIUM** (Clean Architecture)
1. Remove unused types
2. Organize domain-specific types properly
3. Document the new type architecture

## Validation Steps

### Test These After Changes:
1. **GraphQL Operations**: Ensure PayrollStatus mutations work
2. **Type Checking**: Run `tsc --noEmit` to check for type errors
3. **Build Process**: Ensure `pnpm build` succeeds
4. **Runtime**: Test payroll status changes in the UI

### Commands to Run:
```bash
# 1. Clean regenerate types
pnpm codegen

# 2. Check for TypeScript errors
npx tsc --noEmit

# 3. Check for lint issues
pnpm lint

# 4. Test build
pnpm build
```

## Benefits After Cleanup

1. **✅ GraphQL Errors Fixed**: PayrollStatus values will match schema
2. **✅ Single Source of Truth**: Hasura schema drives all enum types
3. **✅ Reduced Duplication**: No more conflicting type definitions
4. **✅ Better Maintainability**: Clear file organization
5. **✅ Type Safety**: Consistent types across the application

## Files That Need Manual Review

After cleanup, manually review these for any remaining issues:
- `app/(dashboard)/payrolls/` - Components using PayrollStatus
- `domains/payrolls/` - Payroll-related business logic
- Any API calls creating/updating payrolls
- Form validation using payroll status values
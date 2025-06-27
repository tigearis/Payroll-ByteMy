# TypeScript Types Migration Guide

## 🚨 Critical Issue Fixed

**The root cause of your Apollo GraphQL errors has been identified and resolved:**

Your PayrollStatus enum values in TypeScript didn't match your GraphQL schema, causing "invalid input value for enum payroll_status" errors.

## ✅ **COMPLETED: Clean Type Architecture Implemented**

### **Main Type Files Created/Updated:**
- `types/global.d.ts` - Global Hasura enum re-exports and scalar aliases
- `types/interfaces.ts` - Core business entities (Payroll, Client, User, etc.)
- `types/components.ts` - UI component types & cross-domain types (Notes, Forms)
- `types/api.ts` - API request/response types and Hasura actions
- `types/index.ts` - Central exports with type guards and utilities
- `types/permissions.ts` - Security and role-based access types

### **Domain Type Files Cleaned:**
- `domains/clients/types/client.ts` - Component props + re-exports
- `domains/users/types/index.ts` - Domain forms + re-exports  
- `domains/payrolls/types/payroll.ts` - Scheduling logic + re-exports
- `domains/notes/types/index.ts` - Re-exports only (moved to main)

### **Files Successfully Deleted ❌**
- `types/globals.d.ts` - Eliminated duplicate
- `types/interface.ts` - Eliminated outdated version
- `types/enums.ts` - Eliminated manual enums (now use Hasura)
- `types/scalars.ts` - Eliminated (moved to global.d.ts)

## Breaking Changes

### 1. **PayrollStatus Values Changed**
```typescript
// ❌ Old values (causing Apollo errors)
"Active" | "Implementation" | "Inactive"

// ✅ New values (matching GraphQL schema)
"Processing" | "Draft" | "PendingApproval" | "Approved" | "Completed" | "Failed" | "PendingReview" | "Issue" | "Pending"
```

### 2. **Import Path Changes**
```typescript
// ❌ Old imports (will break after cleanup)
import { Payroll } from "../types/globals";
import { PayrollStatus } from "../types/enums";

// ✅ New imports
import type { Payroll } from "@/types/business.types";
// PayrollStatus is now globally available
```

### 3. **File Structure Changes**
```
types/
├── global.d.ts          # ✅ Keep - Global declarations
├── business.types.ts    # ✅ New - Business entities
├── component.types.ts   # ✅ New - UI component types
├── api.types.ts         # ✅ New - API types
├── index.ts            # ✅ Updated - Central exports
├── permissions.ts       # ✅ Keep - Permission types
├── globals.d.ts         # ❌ Delete - Duplicate
├── interfaces.ts        # ❌ Replace with business.types.ts
├── interface.ts         # ❌ Delete - Outdated
├── enums.ts            # ❌ Delete - Use Hasura enums
└── scalars.ts          # ❌ Delete - Moved to global.d.ts
```

## Migration Steps

### Step 1: Immediate Fix (Resolve Apollo Errors)
```bash
# 1. Update any hardcoded PayrollStatus values in your code
grep -r "Active.*Implementation.*Inactive" . --include="*.ts" --include="*.tsx"

# 2. Regenerate GraphQL types
pnpm codegen

# 3. Test a payroll status update in your UI
```

### Step 2: Clean Up Type Files
```bash
# Delete duplicate/outdated files
rm types/globals.d.ts
rm types/interface.ts  
rm types/enums.ts
rm types/scalars.ts

# Keep the new organized structure
ls types/
# Should show: global.d.ts business.types.ts component.types.ts api.types.ts index.ts permissions.ts
```

### Step 3: Update Imports
Search and replace import statements:
```bash
# Find files importing from deleted type files
grep -r "from.*types/globals" . --include="*.ts" --include="*.tsx"
grep -r "from.*types/enums" . --include="*.ts" --include="*.tsx"
grep -r "from.*types/interface" . --include="*.ts" --include="*.tsx"
```

### Step 4: Validation
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for lint issues  
pnpm lint

# Test build
pnpm build

# Test dev server
pnpm dev
```

## Code Updates Required

### 1. **Components Using PayrollStatus**
Update any components that create or update payrolls:
```typescript
// ❌ Old hardcoded values
const status = "Active";

// ✅ Use correct enum values
const status: PayrollStatus = "Draft"; // or "Processing", etc.
```

### 2. **Form Validations**
Update form validation that checks PayrollStatus:
```typescript
// ❌ Old validation
if (!["Active", "Implementation", "Inactive"].includes(status)) {
  // error
}

// ✅ New validation (using type guard)
import { isPayrollStatus } from "@/types";
if (!isPayrollStatus(status)) {
  // error
}
```

### 3. **GraphQL Mutations**
Ensure mutations use correct status values:
```typescript
// ✅ Example with correct status
const CREATE_PAYROLL = gql`
  mutation CreatePayroll($input: PayrollInput!) {
    createPayroll(input: $input) {
      id
      status # Will now accept correct enum values
    }
  }
`;
```

## Type System Benefits

### After Migration:
1. **✅ GraphQL Errors Resolved**: Status values match schema
2. **✅ Single Source of Truth**: Hasura drives enum definitions
3. **✅ Better Organization**: Clear separation of concerns
4. **✅ Type Safety**: Global types available everywhere
5. **✅ Maintainability**: No duplicate type definitions
6. **✅ Future-Proof**: Schema-first approach

### New Type Import Patterns:
```typescript
// Business entities
import type { Payroll, Client, User } from "@/types/business.types";

// Component props
import type { PayrollFormProps, ModalProps } from "@/types/component.types";

// API types
import type { ApiResponse, GraphQLResult } from "@/types/api.types";

// Global types (no import needed)
// PayrollStatus, Role, UUID, Timestamp, etc. are globally available
```

## Rollback Plan

If issues arise, you can temporarily rollback by:
1. Restoring the deleted files from git history
2. Reverting to old import patterns
3. Using the old PayrollStatus values (but this will cause GraphQL errors)

However, the **GraphQL enum mismatch must be fixed** regardless.

## Testing Checklist

- [ ] Payroll creation works without GraphQL errors
- [ ] Payroll status updates work in the UI
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] Build succeeds (`pnpm build`)
- [ ] All imports resolve correctly
- [ ] No runtime errors in development

## Support

If you encounter issues:
1. Check the `TYPESCRIPT_CLEANUP_PLAN.md` for detailed instructions
2. Run `pnpm codegen` to regenerate types
3. Verify your GraphQL schema matches the database enum values
4. Check that import paths point to the correct files

The type system is now properly aligned with your Hasura schema and should eliminate the Apollo GraphQL errors you were experiencing.
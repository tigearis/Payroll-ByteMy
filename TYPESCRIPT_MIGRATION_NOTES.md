# TypeScript Types Architecture Documentation

## Overview
This document outlines the clean TypeScript type architecture that leverages Hasura's type system while maintaining domain separation and eliminating duplication.

## ✅ **Current Clean Architecture**

### 1. **Main Types Structure**
```
/types/
├── global.d.ts      # Global type declarations and Hasura enum re-exports
├── interfaces.ts    # Core business entities and logic
├── components.ts    # UI/Component-specific types (including cross-domain)
├── api.ts          # API request/response types
├── permissions.ts   # Permission type exports
└── index.ts        # Central type exports with type guards
```

### 2. **Domain Types Structure** 
```
/domains/*/types/
├── client.ts        # Domain-specific component props + re-exports
├── payroll.ts       # Domain-specific scheduling + re-exports  
├── index.ts         # Domain-specific forms + re-exports
└── [other domains]  # Follow same pattern
```

## **Type Distribution by Purpose**

### **Main Types** (`/types/`)

#### **`global.d.ts`** - Global Declarations
- **Contains**: Hasura enum re-exports, scalar aliases, Clerk integration
- **Globally Available**: `PayrollStatus`, `Role`, `UUID`, `Timestamp`, etc.
- **No Imports Needed**: All types available everywhere

#### **`interfaces.ts`** - Core Business Entities  
- **Contains**: `Payroll`, `Client`, `User`, `Note`, etc.
- **Security Classified**: JSDoc comments with data classification
- **Relationships**: Full entity relationships and extended types
- **Examples**: `PayrollWithRelationships`, `ClientWithStats`

#### **`components.ts`** - UI & Cross-Domain Types
- **Contains**: Form types, table props, modal interfaces
- **Cross-Domain**: Notes, calendar, dashboard types used by multiple domains
- **Component Props**: Generic UI component interfaces
- **Form Types**: `PayrollInput`, `LeaveRequestInput`, etc.

#### **`api.ts`** - API Communication
- **Contains**: Request/response wrappers, GraphQL types
- **Hasura Actions**: `GeneratePayrollDatesArgs`, audit event types
- **Error Handling**: Validation errors, rate limiting
- **Real-time**: WebSocket and notification types

#### **`permissions.ts`** - Security & Access
- **Contains**: Re-exports from auth permission system
- **Role-Based**: Hierarchical role and permission types
- **Integration**: Links to main auth system

#### **`index.ts`** - Central Exports
- **Contains**: Re-exports from all type files
- **Type Guards**: Runtime type checking functions
- **Legacy Support**: Backward compatibility exports
- **Development**: Debug helpers for development mode

### **Domain Types** (`/domains/*/types/`)

#### **Domain-Specific Only**
- **Component Props**: Table props, card props specific to domain
- **Domain Logic**: Scheduling configs, calendar props, filters
- **Form Types**: Domain-specific form interfaces
- **Re-exports**: Convenient access to main types
- **Legacy Support**: Deprecated types marked for removal

## **Import Patterns & Best Practices**

### **1. Global Types (No Import Needed)**
```typescript
// ✅ Available everywhere without imports
const status: PayrollStatus = "Processing";
const role: Role = "manager";
const id: UUID = "123e4567-e89b-12d3-a456-426614174000";
```

### **2. Core Business Entities**
```typescript
// ✅ Import from main interfaces
import type { Payroll, Client, User } from "@/types/interfaces";
import type { PayrollWithRelationships } from "@/types/interfaces";
```

### **3. Component Types**
```typescript
// ✅ Import from components
import type { PayrollInput, FormField, TableColumn } from "@/types/components";
import type { NotesListWithAddProps } from "@/types/components"; // Cross-domain
```

### **4. API Types**  
```typescript
// ✅ Import from API types
import type { ApiResponse, GeneratePayrollDatesArgs } from "@/types/api";
```

### **5. Domain-Specific Types**
```typescript
// ✅ Import from domain (component props, domain logic)
import type { PayrollsTableProps, EnhancedCalendarProps } from "@/domains/payrolls/types";
import type { ClientsTableProps } from "@/domains/clients/types";
```

### **6. Central Import (All Types)**
```typescript
// ✅ One-stop import for everything
import type { Payroll, PayrollInput, ApiResponse } from "@/types";
import { isPayrollStatus, isRole } from "@/types"; // Type guards
```

## **Domain Cleanup Summary**

### **What Was Moved:**
- **Business Entities**: `Payroll`, `Client`, `User` → `/types/interfaces.ts`
- **Cross-Domain Types**: Notes → `/types/components.ts` 
- **API Types**: `GeneratePayrollDatesArgs` → `/types/api.ts`
- **Form Types**: `PayrollCreationData` → `/types/components.ts`

### **What Stayed in Domains:**
- **Component Props**: `PayrollsTableProps`, `ClientCardProps`
- **Domain Logic**: `EnhancedCalendarProps`, `ViewMode`
- **Domain Forms**: `CreateUserData`, `UserFilters`
- **Re-exports**: Convenient domain access to main types

## **Breaking Changes Fixed**

### **1. PayrollStatus Enum Values**
```typescript
// ❌ Old values (causing Apollo errors)  
"Active" | "Implementation" | "Inactive"

// ✅ New values (matching GraphQL schema)
"Processing" | "Draft" | "PendingApproval" | "Approved" | "Completed" | "Failed"
```

### **2. Eliminated Duplicates**
- **Before**: `Payroll` defined in 4+ files
- **After**: `Payroll` defined once in `/types/interfaces.ts`
- **Domains**: Re-export from main types

## Benefits

1. **Single Source of Truth**: Hasura metadata drives enum definitions
2. **Type Safety**: Stronger type checking with proper enum types
3. **Maintainability**: Less manual type maintenance
4. **Consistency**: Uniform type usage across the codebase
5. **GraphQL Integration**: Better alignment with generated GraphQL types

## Important Notes

### Enum Duplication in Generated Files
- GraphQL Codegen creates enum types in each domain's generated files
- This is **intentional** and follows best practices for module isolation
- The `dedupeFragments: true` setting optimizes at build time
- Global re-exports in `global.d.ts` provide convenient access

### Backward Compatibility
- Existing code continues to work during migration
- TypeScript's structural typing ensures compatibility
- Gradual migration is possible

### Type Generation Flow
```
Hasura Metadata → GraphQL Schema → Codegen → TypeScript Types → Global Re-exports
```

## Common Issues and Solutions

### Issue: "Cannot find name 'PayrollStatus'"
**Solution**: Ensure your tsconfig includes the types directory:
```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"]
  }
}
```

### Issue: Type conflicts with generated files
**Solution**: Use type-only imports and prefer global types:
```typescript
import type { Payroll } from "@/types/interfaces";
```

### Issue: Enum values don't match database
**Solution**: Always use Hasura enum values as the source of truth

## Next Steps

1. **Review and merge** the new type files
2. **Update imports** in existing components (can be done gradually)
3. **Add new enums** to Hasura metadata as outlined in `HASURA_ENUM_ADDITIONS.md`
4. **Run codegen** to regenerate GraphQL types: `pnpm codegen`
5. **Update ESLint** rules to enforce new import patterns

## Maintenance Guidelines

1. **Always add new enums to Hasura** first, not TypeScript
2. **Use global types** for all Hasura enums
3. **Keep UI types** separate in `components.ts`
4. **Document security classifications** in interfaces
5. **Run codegen** after any schema changes
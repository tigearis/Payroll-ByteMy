# TypeScript Architecture Guide

## Overview

This document describes the clean, consolidated TypeScript type architecture for the Payroll ByteMy system. The architecture eliminates type duplication, provides clear domain separation, and integrates seamlessly with Hasura GraphQL.

## 🏗️ **Architecture Principles**

### **1. Single Source of Truth**
- Core business entities defined once in `/types/interfaces.ts`
- Hasura GraphQL schema drives enum definitions
- No duplicate type definitions across the codebase

### **2. Domain Separation**
- Domain types contain only domain-specific component props and logic
- Core entities are re-exported from main types for convenience
- Cross-domain types (like Notes) live in main types

### **3. Hasura Integration**
- All GraphQL enums globally available without imports
- Schema-first approach for consistent data types
- Automatic type generation from GraphQL CodeGen

## 📁 **File Structure**

### **Main Types (`/types/`)**

#### **`global.d.ts`** - Global Type Declarations
```typescript
// Globally available without imports
declare global {
  type PayrollStatus = "Processing" | "Draft" | "PendingApproval" | "Approved" | "Completed" | "Failed";
  type Role = "developer" | "org_admin" | "manager" | "consultant" | "viewer";
  type UUID = string;
  type Timestamptz = string;
  
  interface PayrollDate {
    id: UUID;
    payrollId: UUID;
    originalEftDate: DateString;
    // ... other fields
  }
}
```

#### **`interfaces.ts`** - Core Business Entities
```typescript
// Single source of truth for business entities
export interface Payroll {
  id: UUID;
  name: string;
  status: PayrollStatus; // Uses global type
  client?: Client;
  // ... full entity definition
}

export interface Client {
  id: UUID;
  name: string;
  active: boolean;
  // ... full entity definition
}
```

#### **`components.ts`** - UI & Cross-Domain Types
```typescript
// Form types, component props, cross-domain types
export interface PayrollInput {
  clientId: UUID;
  name: string;
  status: PayrollStatus;
  // ... form fields
}

// Cross-domain types (used by multiple domains)
export interface NotesListWithAddProps {
  entityType: EntityType;
  entityId: UUID;
  // ... props
}
```

#### **`api.ts`** - API Communication Types
```typescript
// API requests, responses, Hasura actions
export interface GeneratePayrollDatesArgs {
  payrollIds: UUID[];
  startDate: DateString;
  endDate: DateString;
  maxDates: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

#### **`index.ts`** - Central Exports & Type Guards
```typescript
// Re-export all types
export type { Payroll, Client, User } from "./interfaces";
export type { PayrollInput, FormField } from "./components";

// Type guard functions
export function isPayrollStatus(value: any): value is PayrollStatus {
  return ["Processing", "Draft", "PendingApproval", "Approved", "Completed", "Failed"].includes(value);
}
```

### **Domain Types (`/domains/*/types/`)**

#### **Domain-Specific Content Only**
Each domain type file contains:
- Component props specific to that domain
- Domain-specific business logic types  
- Re-exports from main types for convenience
- Legacy/deprecated types marked for removal

#### **Example: `domains/payrolls/types/payroll.ts`**
```typescript
// Re-export core types for convenience
export type { Payroll, PayrollCycle } from "@/types/interfaces";
export type { PayrollInput } from "@/types/components";

// Domain-specific component props
export interface PayrollsTableProps {
  payrolls: Payroll[];
  loading?: boolean;
  onRefresh?: () => void;
  // ... table-specific props
}

// Domain-specific business logic
export interface EnhancedCalendarProps {
  mode: "fortnightly" | "fixed";
  selectedWeek?: string;
  // ... calendar-specific props
}
```

## 🔄 **Import Patterns**

### **1. Global Types (No Import)**
```typescript
// Available everywhere without imports
const status: PayrollStatus = "Processing";
const userId: UUID = "123e4567...";
const date: Timestamptz = "2025-06-27T10:00:00Z";
```

### **2. Core Business Entities**
```typescript
import type { Payroll, Client, User } from "@/types/interfaces";
import type { PayrollWithRelationships } from "@/types/interfaces";
```

### **3. Component & Form Types**
```typescript
import type { PayrollInput, FormField, TableColumn } from "@/types/components";
import type { NotesListWithAddProps } from "@/types/components";
```

### **4. API Types**
```typescript
import type { ApiResponse, GeneratePayrollDatesArgs } from "@/types/api";
```

### **5. Domain-Specific Types**
```typescript
import type { PayrollsTableProps } from "@/domains/payrolls/types";
import type { ClientCardProps } from "@/domains/clients/types";
```

### **6. Central Import (Everything)**
```typescript
import type { Payroll, PayrollInput, ApiResponse } from "@/types";
import { isPayrollStatus, isRole } from "@/types";
```

## 🎯 **Type Usage Guidelines**

### **When to Use Main Types**
- **Core Business Entities**: Always use from `/types/interfaces.ts`
- **Cross-Domain Types**: Notes, calendar, dashboard types
- **API Communication**: Request/response types
- **Form Types**: Generic form and input types

### **When to Use Domain Types**
- **Component Props**: Table props, card props specific to domain
- **Domain Logic**: Scheduling configs, filters, domain-specific enums
- **Legacy Support**: Maintaining backward compatibility

### **Security Classifications**
Types include JSDoc security classifications:
```typescript
/**
 * User entity
 * @security CRITICAL - Contains authentication and role data
 */
export interface User {
  // ... user fields
}

/**
 * Client entity  
 * @security HIGH - Contains PII
 */
export interface Client {
  // ... client fields
}
```

## 🚀 **Benefits**

### **1. Eliminated Duplication**
- **Before**: `Payroll` defined in 4+ files
- **After**: `Payroll` defined once in `/types/interfaces.ts`
- **Impact**: Reduced type conflicts and maintenance overhead

### **2. GraphQL Integration**
- **PayrollStatus**: Fixed enum values to match GraphQL schema
- **Global Enums**: All Hasura enums available without imports
- **Type Safety**: Consistent types between frontend and backend

### **3. Domain Organization**
- **Clear Boundaries**: Each domain only contains domain-specific types
- **Convenient Access**: Re-exports provide easy access to main types
- **Maintainability**: Easy to find and update types

### **4. Developer Experience**
- **IntelliSense**: Better autocomplete with centralized types
- **Type Guards**: Runtime validation functions available
- **Import Paths**: Clear, consistent import patterns

## 🔧 **Development Workflow**

### **Adding New Types**
1. **Business Entity**: Add to `/types/interfaces.ts`
2. **Component Type**: Add to `/types/components.ts`
3. **API Type**: Add to `/types/api.ts`
4. **Domain-Specific**: Add to appropriate domain type file
5. **Update Exports**: Add to `/types/index.ts`

### **Updating Existing Types**
1. **Check Main Types**: Look in `/types/` first
2. **Domain-Specific**: Check domain types for component props
3. **Update Once**: Changes propagate through re-exports
4. **Run Codegen**: Regenerate GraphQL types if schema changed

### **Type Validation**
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Generate GraphQL types
pnpm codegen

# Run linting
pnpm lint
```

## 📝 **Migration Notes**

### **Completed Migrations**
- ✅ Eliminated duplicate `Payroll`, `Client`, `User` definitions
- ✅ Fixed PayrollStatus enum to match GraphQL schema
- ✅ Moved cross-domain types to main components
- ✅ Cleaned up domain type files
- ✅ Added type guards and central exports

### **Import Updates Needed**
Some imports may need updating to use the new structure:
```typescript
// ❌ Old (may still work but not optimal)
import { Payroll } from "../domains/payrolls/types/payroll";

// ✅ New (recommended)
import type { Payroll } from "@/types/interfaces";
```

This architecture provides a solid foundation for type safety, maintainability, and developer productivity while integrating seamlessly with the Hasura GraphQL backend.
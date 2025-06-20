# Role Hierarchy Migration Guide

## Overview

This document outlines the completed migration from role array-based access control to a hierarchical role-based access control (RBAC) system. The new system simplifies permission management and provides better security through role inheritance.

## ✅ Migration Status: COMPLETED

**Date Completed**: December 2024  
**Result**: All role extraction bugs fixed, code consolidated, validation added

## Migration Summary

### Before (Legacy Pattern)
```typescript
// API Routes - Role Arrays
export const POST = withAuth(handler, {
  allowedRoles: ["developer", "org_admin", "manager"]
});

// Components - Multiple Role Checks
const { isDeveloper, isAdministrator, isManager } = useUserRole();
if (isDeveloper || isAdministrator || isManager) {
  // Show manager tools
}

// Permission Guards - Role Arrays
<PermissionGuard roles={["org_admin", "manager"]}>
  <ManagerContent />
</PermissionGuard>
```

### After (Hierarchical Pattern)
```typescript
// API Routes - Minimum Role
export const POST = withAuth(handler, {
  minimumRole: "manager" // Includes manager, org_admin, developer
});

// Components - Hierarchy Checks
const { canManagePayrolls, hasMinimumRole } = useRoleHierarchy();
if (canManagePayrolls()) {
  // Show manager tools
}

// Permission Guards - Minimum Role
<PermissionGuard minimumRole="manager">
  <ManagerContent />
</PermissionGuard>
```

## Role Hierarchy Structure

```
developer (5)     ← Full system access
    ↑
org_admin (4)     ← Organization management
    ↑  
manager (3)       ← Team and payroll management
    ↑
consultant (2)    ← Limited operational access
    ↑
viewer (1)        ← Read-only access
```

**Inheritance Rule**: Higher roles inherit ALL permissions from lower roles.

## Migration Examples

### API Route Migration

#### Before
```typescript
// ❌ Old pattern - explicit role enumeration
export const POST = withAuth(async (request, session) => {
  // Handler logic
}, {
  allowedRoles: ["developer", "org_admin", "manager"]
});
```

#### After
```typescript
// ✅ New pattern - minimum role requirement
export const POST = withAuth(async (request, session) => {
  // Handler logic
}, {
  minimumRole: "manager" // Automatically includes org_admin and developer
});
```

### Component Migration

#### Before
```typescript
// ❌ Old pattern - multiple boolean checks
import { useUserRole } from "@/hooks/useUserRole";

function StaffManagement() {
  const { isDeveloper, isAdministrator } = useUserRole();
  const canManageStaff = isDeveloper || isAdministrator;
  
  return (
    <>
      {canManageStaff && <CreateStaffButton />}
      {isDeveloper && <DeveloperTools />}
    </>
  );
}
```

#### After
```typescript
// ✅ New pattern - hierarchy-based checks
import { useRoleHierarchy } from "@/lib/auth/soc2-auth";

function StaffManagement() {
  const { canManageStaff, canAccessDeveloperTools } = useRoleHierarchy();
  
  return (
    <>
      {canManageStaff() && <CreateStaffButton />}
      {canAccessDeveloperTools() && <DeveloperTools />}
    </>
  );
}
```

### Permission Guard Migration

#### Before
```typescript
// ❌ Old pattern - role arrays
<PermissionGuard roles={["developer", "org_admin"]}>
  <AdminPanel />
</PermissionGuard>

<PermissionGuard roles={["developer", "org_admin", "manager"]}>
  <ManagerTools />
</PermissionGuard>
```

#### After
```typescript
// ✅ New pattern - minimum role
<PermissionGuard minimumRole="org_admin">
  <AdminPanel />
</PermissionGuard>

<PermissionGuard minimumRole="manager">
  <ManagerTools />
</PermissionGuard>
```

### Navigation Migration

#### Before
```typescript
// ❌ Old pattern - role arrays in routes
const routes = [
  {
    href: "/staff",
    label: "Staff",
    roles: ["developer", "org_admin", "manager"]
  }
];

const accessibleRoutes = routes.filter(route => 
  route.roles.includes(userRole)
);
```

#### After
```typescript
// ✅ New pattern - access check functions
const routes = [
  {
    href: "/staff",
    label: "Staff", 
    checkAccess: (hierarchy) => hierarchy.canAccessStaff()
  }
];

const accessibleRoutes = routes.filter(route => 
  route.checkAccess(hierarchy)
);
```

## Available Helper Functions

### Core Hierarchy Functions
```typescript
const { hasMinimumRole, canPerformAction } = useRoleHierarchy();

// Check if user meets minimum role requirement
hasMinimumRole("manager"); // true for manager, org_admin, developer

// Check specific action capability
canPerformAction("manage_payrolls"); // Uses internal action-to-role mapping
```

### Specific Capability Functions
```typescript
const {
  // Staff management
  canManageStaff,          // org_admin and above
  canCreateStaff,          // org_admin and above
  canDeleteStaff,          // org_admin and above
  
  // Payroll operations  
  canManagePayrolls,       // manager and above
  canCreatePayrolls,       // manager and above
  canDeletePayrolls,       // org_admin and above
  
  // System access
  canAccessSecurity,       // org_admin and above
  canAccessDeveloperTools, // developer only
  
  // Navigation
  canAccessDashboard,      // viewer and above
  canAccessStaff,          // manager and above
  canAccessSettings,       // developer only
} = useRoleHierarchy();
```

### Legacy Compatibility Functions
```typescript
const {
  // Exact role checks (boolean)
  isDeveloper,            // exactly "developer"
  isAdministrator,        // exactly "org_admin"
  isManager,              // exactly "manager"
  isConsultant,          // exactly "consultant"
  isViewer,              // exactly "viewer"
  
  // Hierarchy-aware legacy checks
  hasAdminAccess,         // org_admin and above
  hasManagerAccess,       // manager and above
  hasConsultantAccess,    // consultant and above
} = useRoleHierarchy();
```

## Common Migration Patterns

### Pattern 1: Multiple Role Checks → Single Function
```typescript
// Before
if (isDeveloper || isAdministrator || isManager) {
  // Logic
}

// After  
if (canManagePayrolls()) {
  // Logic
}
```

### Pattern 2: Role Arrays → Minimum Role
```typescript
// Before
allowedRoles: ["developer", "org_admin", "manager"]

// After
minimumRole: "manager"
```

### Pattern 3: Complex Permission Logic → Named Functions
```typescript
// Before
const canEdit = (isDeveloper || isAdministrator) && !isCurrentUser;

// After
const canEdit = canManageStaff() && !isCurrentUser;
```

## Benefits of Hierarchical RBAC

### 1. **Simplified Permission Management**
- One role grants access to all lower-level functions
- No need to maintain complex role arrays
- Easier to add new roles or modify permissions

### 2. **Better Security**
- Clear minimum role requirements prevent permission gaps
- Consistent permission inheritance across the system
- Reduced chance of misconfigured access controls

### 3. **Improved Maintainability**
- Centralized role logic in `lib/auth/soc2-auth.ts`
- Named functions make code more readable
- Easier to audit and understand access patterns

### 4. **Enhanced Developer Experience**
- Intuitive role hierarchy structure
- Descriptive function names (`canManageStaff` vs `roles.includes("org_admin")`)
- Better TypeScript support with proper typing

## Migration Checklist

When migrating existing code:

- [ ] **API Routes**: Replace `allowedRoles` arrays with `minimumRole`
- [ ] **Components**: Replace multiple role checks with hierarchy functions
- [ ] **Permission Guards**: Update to use `minimumRole` prop
- [ ] **Navigation**: Convert role arrays to access check functions
- [ ] **TypeScript**: Ensure proper `UserRole` typing
- [ ] **Testing**: Verify hierarchy logic works correctly
- [ ] **Documentation**: Update inline comments and documentation

## File Locations

### Key Implementation Files
- `lib/auth/soc2-auth.ts` - Core hierarchy implementation
- `lib/api-auth.ts` - API authentication with hierarchy support
- `components/auth/PermissionGuard.tsx` - Component-level access control
- `components/sidebar.tsx` - Navigation with hierarchy-based filtering

### Documentation Files
- `CLAUDE.md` - Development guidance with hierarchy patterns
- `COMPREHENSIVE_SYSTEM_GUIDE.md` - Complete system documentation
- `docs/ROLE_HIERARCHY_MIGRATION.md` - This migration guide

## Support

For questions about the role hierarchy implementation:
1. Review the helper functions in `useRoleHierarchy()`
2. Check existing usage patterns in dashboard components
3. Refer to the comprehensive system guide for detailed examples
4. Ensure TypeScript compilation passes after changes

---

## ✅ Migration Results

### Issues Fixed
- ✅ **Role Extraction Bug**: Fixed `useRoleHierarchy()` to use correct field (`role` instead of `default_role`)
- ✅ **Code Consolidation**: Eliminated duplicate role constants and functions
- ✅ **Role Validation**: Added comprehensive validation with fallback mechanisms
- ✅ **Type Safety**: Proper TypeScript validation for all role operations
- ✅ **API Consistency**: Server and client role validation now aligned
- ✅ **Debug Tools**: Updated role debugging endpoint for better troubleshooting

### Files Updated
- `lib/auth/soc2-auth.ts` - Role extraction fix and consolidation
- `lib/user-sync.ts` - Single source of truth for role definitions
- `lib/auth/permissions.ts` - Existing validated functions utilized
- `app/api/check-role/route.ts` - Updated debug endpoint
- Documentation updated across multiple files

### Current Status
The authentication system now correctly extracts roles from the Clerk JWT template and passes them consistently throughout the application. All components use validated role checking with proper fallbacks.

**Note**: The legacy role array patterns are still supported for backward compatibility but should be migrated to the new hierarchy-based approach for consistency and better maintainability.

## Future Maintenance

When adding new roles or modifying permissions:
1. **Update `lib/user-sync.ts`** - The single source of truth
2. **Add to JWT template** if needed
3. **Update helper functions** in `useRoleHierarchy()` as needed
4. **Test with debug endpoint** `/api/check-role`
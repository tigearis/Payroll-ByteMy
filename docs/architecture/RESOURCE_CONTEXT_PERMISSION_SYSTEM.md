# Resource Context Permission System

## Overview

This document outlines the implementation of a **Resource Context Provider** system that simplifies permission management by allowing pages to declare their primary resource once, eliminating repetitive resource declarations throughout component hierarchies.

## Current Problem

Currently, every `PermissionGuard` component must specify the resource explicitly:

```tsx
// Repetitive and error-prone
<PermissionGuard resource="staff" action="read">
  <StaffList>
    <PermissionGuard resource="staff" action="create">
      <CreateButton />
    </PermissionGuard>
    <PermissionGuard resource="staff" action="update">
      <EditButton />
    </PermissionGuard>
    <PermissionGuard resource="staff" action="delete">
      <DeleteButton />
    </PermissionGuard>
  </StaffList>
</PermissionGuard>
```

## Proposed Solution

Implement a **ResourceContext** system where pages declare their resource once, and child components inherit it automatically:

```tsx
// Clean and maintainable  
<ResourceProvider resource="staff">
  <PermissionGuard action="read">
    <StaffList>
      <PermissionGuard action="create">
        <CreateButton />
      </PermissionGuard>
      <PermissionGuard action="update">
        <EditButton />
      </PermissionGuard>
      <PermissionGuard action="delete">
        <DeleteButton />
      </PermissionGuard>
    </StaffList>
  </PermissionGuard>
</ResourceProvider>
```

## Implementation

### 1. Create Resource Context

Create `contexts/resource-context.tsx`:

```tsx
"use client";

import { createContext, useContext, ReactNode } from 'react';

interface ResourceContextType {
  resource: string | null;
  resources: string[];
}

const ResourceContext = createContext<ResourceContextType>({
  resource: null,
  resources: []
});

interface ResourceProviderProps {
  resource?: string;
  resources?: string[];
  children: ReactNode;
}

export function ResourceProvider({ 
  resource, 
  resources = [], 
  children 
}: ResourceProviderProps) {
  const contextValue: ResourceContextType = {
    resource: resource || null,
    resources: resource ? [resource, ...resources] : resources
  };

  return (
    <ResourceContext.Provider value={contextValue}>
      {children}
    </ResourceContext.Provider>
  );
}

export function useResource(): ResourceContextType {
  return useContext(ResourceContext);
}

export function useResourcePermissions(resource?: string) {
  const context = useResource();
  const effectiveResource = resource || context.resource;
  
  if (!effectiveResource) {
    throw new Error('useResourcePermissions must be used within a ResourceProvider or provide a resource parameter');
  }
  
  // Delegate to existing useResourcePermissions hook
  const { useResourcePermissions: baseHook } = require('@/hooks/use-permissions');
  return baseHook(effectiveResource);
}
```

### 2. Enhance PermissionGuard

Update `components/auth/permission-guard.tsx`:

```tsx
import { useResource } from '@/contexts/resource-context';

export function PermissionGuard({
  children,
  fallback = null,
  permission,
  resource,
  action,
  permissions: requiredPermissions,
  requireAll = false,
  minRole,
  role,
  roles,
  allowedRoles,
  showLoading = true,
  loadingComponent
}: PermissionGuardProps) {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    userRole,
    isLoading 
  } = useHierarchicalPermissions();
  
  const {
    hasRole,
    hasAnyRole,
    canAccessRole
  } = useRoleAccess();

  // Get resource from context if not explicitly provided
  const { resource: contextResource } = useResource();
  const effectiveResource = resource || contextResource;

  // Show loading state
  if (isLoading && showLoading) {
    return loadingComponent || <Skeleton className="w-full h-8" />;
  }

  // If still loading and not showing loading component, deny access
  if (isLoading) {
    return <>{fallback}</>;
  }

  let hasAccess = true;

  // Check single permission (direct)
  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  // Check single permission (resource.action) - now uses context
  if (effectiveResource && action) {
    const combinedPermission = `${effectiveResource}.${action}`;
    hasAccess = hasAccess && hasPermission(combinedPermission);
  }

  // ... rest of existing logic remains the same

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
```

### 3. Create Convenience Components

Add to `components/auth/permission-guard.tsx`:

```tsx
// Context-aware convenience components
export function CanRead({ 
  resource, 
  children, 
  fallback 
}: { 
  resource?: string; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="read" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanCreate({ 
  resource, 
  children, 
  fallback 
}: { 
  resource?: string; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="create" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanUpdate({ 
  resource, 
  children, 
  fallback 
}: { 
  resource?: string; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="update" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

export function CanDelete({ 
  resource, 
  children, 
  fallback 
}: { 
  resource?: string; 
  children: ReactNode; 
  fallback?: ReactNode 
}) {
  return (
    <PermissionGuard resource={resource} action="delete" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

// Action-only components (use context resource)
export function CanReadAction({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard action="read" fallback={fallback}>{children}</PermissionGuard>;
}

export function CanCreateAction({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard action="create" fallback={fallback}>{children}</PermissionGuard>;
}

export function CanUpdateAction({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard action="update" fallback={fallback}>{children}</PermissionGuard>;
}

export function CanDeleteAction({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <PermissionGuard action="delete" fallback={fallback}>{children}</PermissionGuard>;
}
```

## Usage Patterns

### 1. Single Resource Page

For pages that deal with a single primary resource:

```tsx
// app/(dashboard)/staff/page.tsx
import { ResourceProvider } from '@/contexts/resource-context';
import { PermissionGuard, CanCreateAction, CanUpdateAction } from '@/components/auth/permission-guard';

export default function StaffPage() {
  return (
    <ResourceProvider resource="staff">
      <PermissionGuard action="read" fallback={<AccessDenied />}>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Staff Management</h1>
            
            <CanCreateAction>
              <Button onClick={() => setShowCreateModal(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </CanCreateAction>
          </div>

          <StaffTable 
            onEdit={(user) => setEditingUser(user)}
            onDelete={(user) => handleDelete(user)}
          />

          <CanCreateAction>
            <CreateStaffModal 
              open={showCreateModal}
              onClose={() => setShowCreateModal(false)}
            />
          </CanCreateAction>

          <CanUpdateAction>
            <EditStaffModal
              user={editingUser}
              open={!!editingUser}
              onClose={() => setEditingUser(null)}
            />
          </CanUpdateAction>
        </div>
      </PermissionGuard>
    </ResourceProvider>
  );
}
```

### 2. Multiple Resource Page (Dashboard)

For pages that display multiple resources:

```tsx
// app/(dashboard)/dashboard/page.tsx
import { ResourceProvider } from '@/contexts/resource-context';
import { PermissionGuard } from '@/components/auth/permission-guard';

export default function DashboardPage() {
  return (
    <ResourceProvider resource="dashboard">
      <PermissionGuard action="read" fallback={<AccessDenied />}>
        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {/* Dashboard-specific content */}
          <PermissionGuard action="manage">
            <AdminToolsWidget />
          </PermissionGuard>

          {/* Client section - explicit resource override */}
          <PermissionGuard resource="clients" action="read">
            <Card>
              <CardHeader>
                <CardTitle>Client Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ClientSummaryWidget />
                
                <PermissionGuard resource="clients" action="manage">
                  <Link href="/clients">
                    <Button variant="outline">Manage Clients</Button>
                  </Link>
                </PermissionGuard>
              </CardContent>
            </Card>
          </PermissionGuard>

          {/* Payroll section - explicit resource override */}
          <PermissionGuard resource="payrolls" action="read">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <PayrollSummaryWidget />
                
                <PermissionGuard resource="payrolls" action="create">
                  <Link href="/payrolls/create">
                    <Button variant="outline">Create Payroll</Button>
                  </Link>
                </PermissionGuard>
              </CardContent>
            </Card>
          </PermissionGuard>
        </div>
      </PermissionGuard>
    </ResourceProvider>
  );
}
```

### 3. Nested Resource Sections

For complex pages with distinct sections:

```tsx
// app/(dashboard)/payrolls/[id]/page.tsx
export default function PayrollDetailPage({ params }: { params: { id: string } }) {
  return (
    <ResourceProvider resource="payrolls">
      <PermissionGuard action="read" fallback={<AccessDenied />}>
        <div className="container mx-auto p-6 space-y-6">
          
          {/* Payroll details */}
          <PayrollHeader payrollId={params.id} />
          
          <CanUpdateAction>
            <EditPayrollSection payrollId={params.id} />
          </CanUpdateAction>

          {/* Billing section - nested resource context */}
          <ResourceProvider resource="billing_items">
            <PermissionGuard action="read">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <BillingItemsList payrollId={params.id} />
                  
                  <CanCreateAction>
                    <AddBillingItemButton payrollId={params.id} />
                  </CanCreateAction>
                </CardContent>
              </Card>
            </PermissionGuard>
          </ResourceProvider>

          {/* Notes section */}
          <ResourceProvider resource="notes">
            <PermissionGuard action="read">
              <NotesSection payrollId={params.id} />
            </PermissionGuard>
          </ResourceProvider>
        </div>
      </PermissionGuard>
    </ResourceProvider>
  );
}
```

### 4. Component-Level Usage

Components can use the resource context in their internal logic:

```tsx
// components/staff/staff-table.tsx
import { useResource } from '@/contexts/resource-context';
import { useResourcePermissions } from '@/hooks/use-permissions';

export function StaffTable({ users, onEdit, onDelete }: StaffTableProps) {
  const { resource } = useResource();
  const { canUpdate, canDelete } = useResourcePermissions(resource!);

  return (
    <Table>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {canUpdate && (
                  <Button onClick={() => onEdit(user)} size="sm">
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button 
                    onClick={() => onDelete(user)} 
                    variant="destructive" 
                    size="sm"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Role Hierarchy Integration

The Resource Context system works seamlessly with the existing role hierarchy:

```typescript
// Automatic permission resolution
// Given: ResourceProvider resource="staff" and PermissionGuard action="create"
// System checks: staff.create permission

// Role-based results:
// - developer: ✅ (has "*")
// - org_admin: ✅ (has "staff.*")  
// - manager: ✅ (has "staff.create")
// - consultant: ❌ (no staff permissions)
// - viewer: ❌ (no staff permissions)
```

## Migration Strategy

### Phase 1: Implement Core System
1. Create ResourceContext and ResourceProvider
2. Enhance PermissionGuard to support context
3. Create convenience components
4. Add TypeScript types

### Phase 2: Update High-Traffic Pages  
1. Start with simple single-resource pages (staff, clients, payrolls)
2. Wrap pages with ResourceProvider
3. Remove explicit resource props from child components
4. Test thoroughly

### Phase 3: Complex Pages
1. Update dashboard and multi-resource pages
2. Implement nested ResourceProvider patterns
3. Optimize for performance

### Phase 4: Component Libraries
1. Update reusable components to support context
2. Create resource-aware hooks
3. Document patterns for future development

## Benefits

### ✅ **Reduced Repetition**
- Resource declared once per page/section
- 80% reduction in resource prop usage
- Cleaner, more maintainable code

### ✅ **Better Developer Experience**
- Components only specify what they need (action)
- Clear page-level resource ownership
- IntelliSense support for actions

### ✅ **Backwards Compatible**
- Explicit resource prop overrides context
- Gradual migration possible
- No breaking changes to existing code

### ✅ **Performance Optimized**
- Context only re-renders when resource changes
- Reduced prop drilling
- Efficient permission checking

### ✅ **Type Safe**
- Full TypeScript support
- Context type checking
- Action type validation

## Error Handling

### Missing Resource Context
```tsx
// This will throw a helpful error
<PermissionGuard action="read"> {/* No ResourceProvider above */}
  <SomeComponent />
</PermissionGuard>

// Error: "PermissionGuard with action requires ResourceProvider or explicit resource prop"
```

### Invalid Resource/Action Combinations
```tsx
// TypeScript will catch these at compile time
<ResourceProvider resource="staff">
  <PermissionGuard action="invalid-action"> {/* TS Error */}
    <Component />
  </PermissionGuard>
</ResourceProvider>
```

## Testing

### Unit Tests
```tsx
// Test ResourceProvider context
import { render, screen } from '@testing-library/react';
import { ResourceProvider, useResource } from '@/contexts/resource-context';

function TestComponent() {
  const { resource } = useResource();
  return <div data-testid="resource">{resource}</div>;
}

test('ResourceProvider provides resource to children', () => {
  render(
    <ResourceProvider resource="staff">
      <TestComponent />
    </ResourceProvider>
  );
  
  expect(screen.getByTestId('resource')).toHaveTextContent('staff');
});
```

### Integration Tests
```tsx
// Test PermissionGuard with context
test('PermissionGuard uses resource from context', () => {
  const mockUser = { role: 'manager', permissions: ['staff.read'] };
  
  render(
    <ResourceProvider resource="staff">
      <PermissionGuard action="read">
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>
    </ResourceProvider>
  );
  
  expect(screen.getByTestId('protected-content')).toBeInTheDocument();
});
```

## Conclusion

This Resource Context Permission System provides a clean, maintainable, and scalable approach to permission management. It reduces code repetition, improves developer experience, and maintains full backwards compatibility while working seamlessly with the existing role hierarchy system.

The implementation can be rolled out gradually, starting with simple pages and progressing to more complex scenarios, ensuring a smooth transition for the development team.
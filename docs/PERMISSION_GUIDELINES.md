# Permission System Developer Guidelines

Best practices, security guidelines, and development standards for the permission system.

## Table of Contents

- [Quick Start](#quick-start)
- [Best Practices](#best-practices)
- [Security Guidelines](#security-guidelines)
- [Performance Considerations](#performance-considerations)
- [Common Patterns](#common-patterns)
- [Anti-Patterns](#anti-patterns)
- [Testing Guidelines](#testing-guidelines)
- [Code Review Checklist](#code-review-checklist)
- [Troubleshooting](#troubleshooting)

## Quick Start

### For New Components

1. **Dashboard pages**: Use action-based permissions
```tsx
<PermissionGuard action="read">
  <PageContent />
</PermissionGuard>
```

2. **Shared components**: Specify resources explicitly
```tsx
<PermissionGuard resource="billing" action="create">
  <SharedWidget />
</PermissionGuard>
```

3. **Role-based access**: Use minimum role requirements
```tsx
<PermissionGuard minRole="manager">
  <ManagerFeatures />
</PermissionGuard>
```

## Best Practices

### ✅ Do: Use Semantic Actions

Choose actions that clearly express the user's intent:

```tsx
// ✅ Clear and semantic
<PermissionGuard action="create">
  <AddBillingItemButton />
</PermissionGuard>

<PermissionGuard action="approve">
  <ApprovalWorkflow />
</PermissionGuard>

// ❌ Vague or confusing
<PermissionGuard action="manage">
  <ViewOnlyComponent />  {/* manage ≠ read */}
</PermissionGuard>
```

### ✅ Do: Leverage Layout Resource Context

Let the layout provide resource context for dashboard pages:

```tsx
// ✅ Clean and maintainable
// File: app/(dashboard)/billing/invoices/page.tsx
<PermissionGuard action="read">
  <InvoicesList />
</PermissionGuard>

// ❌ Redundant resource specification
<PermissionGuard resource="billing" action="read">
  <InvoicesList />
</PermissionGuard>
```

### ✅ Do: Use TypeScript Constants

Use provided constants for type safety:

```tsx
import { RESOURCES, ACTIONS } from "@/components/auth/resource-context";

// ✅ Type-safe and refactor-friendly
<PermissionGuard resource={RESOURCES.BILLING} action={ACTIONS.CREATE}>

// ❌ Magic strings prone to typos
<PermissionGuard resource="billing" action="create">
```

### ✅ Do: Provide Meaningful Fallbacks

Always consider the user experience when access is denied:

```tsx
// ✅ Helpful fallback
<PermissionGuard 
  action="create" 
  fallback={
    <div className="text-center p-4">
      <p>You need manager-level access to create billing items.</p>
      <Button onClick={() => requestAccess()}>Request Access</Button>
    </div>
  }
>
  <CreateBillingForm />
</PermissionGuard>

// ❌ Confusing empty state
<PermissionGuard action="create">
  <CreateBillingForm />
</PermissionGuard>
```

### ✅ Do: Group Related Permissions

Keep permission logic close to the components it protects:

```tsx
// ✅ Clear grouping and flow
function BillingItemActions({ item }) {
  return (
    <div className="flex gap-2">
      <PermissionGuard action="read">
        <ViewButton item={item} />
      </PermissionGuard>
      
      <PermissionGuard action="update">
        <EditButton item={item} />
      </PermissionGuard>
      
      <PermissionGuard action="delete">
        <DeleteButton item={item} />
      </PermissionGuard>
    </div>
  );
}
```

## Security Guidelines

### 🔒 Security First Principles

1. **Client-side permissions are UX only**: Always enforce permissions on the server
2. **Fail secure**: When in doubt, deny access
3. **Least privilege**: Grant minimum necessary permissions
4. **Defense in depth**: Layer permissions at multiple levels

### 🔒 Server-Side Enforcement

```tsx
// ✅ Client-side for UX + Server-side for security
<PermissionGuard action="delete">
  <Button onClick={handleDelete}> {/* handleDelete calls secured API */}
    Delete Item
  </Button>
</PermissionGuard>

// API route: /api/billing/items/[id]/delete
export async function DELETE(request) {
  // ✅ Always verify permissions server-side
  if (!userCan(user, 'billing.delete')) {
    return new Response('Forbidden', { status: 403 });
  }
  // ... deletion logic
}
```

### 🔒 Sensitive Data Protection

```tsx
// ✅ Progressive disclosure based on permissions
function UserProfile({ user }) {
  return (
    <Card>
      <CardHeader>
        <h3>{user.name}</h3>
      </CardHeader>
      <CardContent>
        {/* Basic info always visible */}
        <p>Department: {user.department}</p>
        
        {/* Sensitive info only for managers+ */}
        <PermissionGuard minRole="manager">
          <p>Salary: {user.salary}</p>
          <p>Performance Rating: {user.rating}</p>
        </PermissionGuard>
        
        {/* Admin-only info */}
        <PermissionGuard minRole="org_admin">
          <p>Internal Notes: {user.notes}</p>
        </PermissionGuard>
      </CardContent>
    </Card>
  );
}
```

### 🔒 Audit Trail Requirements

```tsx
// ✅ Log permission-sensitive actions
function handleSensitiveAction() {
  auditLog({
    action: 'billing.delete',
    resource: billingItem.id,
    user: currentUser.id,
    timestamp: new Date().toISOString()
  });
  
  // ... perform action
}
```

## Performance Considerations

### ⚡ Minimize Permission Checks

```tsx
// ✅ Single permission check at component boundary
<PermissionGuard action="update">
  <ExpensiveEditForm>
    <FormField name="amount" />
    <FormField name="description" />
    <FormField name="category" />
    {/* No nested permission checks needed */}
  </ExpensiveEditForm>
</PermissionGuard>

// ❌ Multiple redundant checks
<ExpensiveEditForm>
  <PermissionGuard action="update">
    <FormField name="amount" />
  </PermissionGuard>
  <PermissionGuard action="update">
    <FormField name="description" />
  </PermissionGuard>
</ExpensiveEditForm>
```

### ⚡ Avoid Deep Nesting

```tsx
// ✅ Business logic determines requirements
<PermissionGuard action="approve">
  {/* Only managers can approve, but if they can approve, they can read */}
  <ApprovalForm />
</PermissionGuard>

// ❌ Unnecessary nested guards
<PermissionGuard action="read">
  <PermissionGuard action="approve">
    <ApprovalForm />
  </PermissionGuard>
</PermissionGuard>
```

### ⚡ Smart Fallback Components

```tsx
// ✅ Conditional fallback to avoid unnecessary rendering
<PermissionGuard 
  action="create"
  fallback={userRole === 'viewer' ? <RequestAccessBanner /> : null}
>
  <CreateForm />
</PermissionGuard>
```

## Common Patterns

### Pattern: Progressive Feature Disclosure

```tsx
function FeaturePanel({ feature }) {
  return (
    <Card>
      {/* Basic info for everyone */}
      <CardHeader>
        <h3>{feature.name}</h3>
        <p>{feature.description}</p>
      </CardHeader>
      
      <CardContent>
        {/* Read access required */}
        <PermissionGuard action="read">
          <FeatureDetails feature={feature} />
        </PermissionGuard>
        
        {/* Update access required */}
        <PermissionGuard action="update">
          <FeatureEditButton feature={feature} />
        </PermissionGuard>
        
        {/* Admin access required */}
        <PermissionGuard action="admin">
          <FeatureAdvancedSettings feature={feature} />
        </PermissionGuard>
      </CardContent>
    </Card>
  );
}
```

### Pattern: Contextual Actions

```tsx
function DataTableRow({ item, context }) {
  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          {/* Always available */}
          <ViewButton item={item} />
          
          {/* Context-dependent permissions */}
          {context === 'draft' && (
            <PermissionGuard action="update">
              <EditButton item={item} />
            </PermissionGuard>
          )}
          
          {context === 'submitted' && (
            <PermissionGuard action="approve">
              <ApproveButton item={item} />
            </PermissionGuard>
          )}
          
          {/* Admin always has delete */}
          <PermissionGuard action="admin">
            <DeleteButton item={item} />
          </PermissionGuard>
        </div>
      </TableCell>
    </TableRow>
  );
}
```

### Pattern: Feature Flags + Permissions

```tsx
function ExperimentalFeature() {
  return (
    <FeatureFlagGuard flag="new-billing-system">
      <PermissionGuard action="admin">
        <NewBillingInterface />
      </PermissionGuard>
    </FeatureFlagGuard>
  );
}
```

## Anti-Patterns

### ❌ Don't: Hardcode Permission Strings

```tsx
// ❌ Magic strings are error-prone
if (permissions.includes('billing.create.invoices.advanced')) {
  // ...
}

// ✅ Use semantic components instead
<PermissionGuard action="create">
  <AdvancedInvoiceCreator />
</PermissionGuard>
```

### ❌ Don't: Mix Permission Systems

```tsx
// ❌ Inconsistent permission checking
const canEdit = user.role === 'manager' || user.role === 'admin';

return (
  <div>
    {canEdit && <EditButton />}
    <PermissionGuard action="delete">
      <DeleteButton />
    </PermissionGuard>
  </div>
);

// ✅ Consistent permission system
<div>
  <PermissionGuard action="update">
    <EditButton />
  </PermissionGuard>
  <PermissionGuard action="delete">
    <DeleteButton />
  </PermissionGuard>
</div>
```

### ❌ Don't: Over-Guard Simple Components

```tsx
// ❌ Unnecessary granularity
<div>
  <PermissionGuard action="read">
    <span>Name: </span>
  </PermissionGuard>
  <PermissionGuard action="read">
    <span>{user.name}</span>
  </PermissionGuard>
</div>

// ✅ Guard at appropriate level
<PermissionGuard action="read">
  <div>
    <span>Name: {user.name}</span>
  </div>
</PermissionGuard>
```

### ❌ Don't: Ignore Loading States

```tsx
// ❌ No loading state
<PermissionGuard action="read">
  <ExpensiveComponent />
</PermissionGuard>

// ✅ Provide loading feedback
<PermissionGuard action="read" showLoading>
  <ExpensiveComponent />
</PermissionGuard>
```

## Testing Guidelines

### Unit Testing Permissions

```tsx
// Test file: components/__tests__/billing-form.test.tsx
import { render } from '@testing-library/react';
import { MockPermissionProvider } from '@test-utils/permission-mocks';

describe('BillingForm', () => {
  it('shows create button for users with create permission', () => {
    render(
      <MockPermissionProvider permissions={['billing.create']}>
        <BillingForm />
      </MockPermissionProvider>
    );
    
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });
  
  it('hides create button for users without permission', () => {
    render(
      <MockPermissionProvider permissions={['billing.read']}>
        <BillingForm />
      </MockPermissionProvider>
    );
    
    expect(screen.queryByRole('button', { name: /create/i })).not.toBeInTheDocument();
  });
});
```

### Integration Testing

```tsx
// Test different user roles
describe('Dashboard Integration', () => {
  it('shows appropriate features for manager role', async () => {
    await loginAs({ role: 'manager' });
    await navigateTo('/billing');
    
    // Verify manager-level features are visible
    expect(screen.getByTestId('approve-button')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-settings')).not.toBeInTheDocument();
  });
});
```

### Mock Utilities

```tsx
// test-utils/permission-mocks.tsx
export function MockPermissionProvider({ 
  permissions = [], 
  role = 'viewer',
  children 
}) {
  const mockContext = {
    permissions,
    role,
    can: (resource, action) => permissions.includes(`${resource}.${action}`),
    hasRole: (checkRole) => role === checkRole
  };
  
  return (
    <PermissionContext.Provider value={mockContext}>
      {children}
    </PermissionContext.Provider>
  );
}
```

## Code Review Checklist

### Security Review

- [ ] Are permissions enforced server-side?
- [ ] Is sensitive data properly protected?
- [ ] Are fallbacks secure (fail closed)?
- [ ] Is audit logging present for sensitive actions?

### Performance Review

- [ ] Are permission checks at appropriate boundaries?
- [ ] Are there unnecessary nested guards?
- [ ] Are expensive components properly guarded?
- [ ] Are loading states handled?

### Code Quality Review

- [ ] Are action names semantic and clear?
- [ ] Is the resource context used appropriately?
- [ ] Are TypeScript types correct?
- [ ] Are constants used instead of magic strings?

### UX Review

- [ ] Are fallbacks user-friendly?
- [ ] Is the permission hierarchy logical?
- [ ] Are error states handled gracefully?
- [ ] Is progressive disclosure used effectively?

## Troubleshooting

### Common Issues

**Issue: Permission not working on dashboard page**
```tsx
// Problem: Explicit resource overrides layout context
<PermissionGuard resource="billing" action="read">

// Solution: Use action-based (lets layout provide resource)
<PermissionGuard action="read">
```

**Issue: TypeScript error with dynamic actions**
```tsx
// Problem: Dynamic string not assignable to PermissionAction
const action = getActionFromProps(); // string
<PermissionGuard action={action}> // TS Error

// Solution: Type assertion or proper typing
<PermissionGuard action={action as PermissionAction}>
```

**Issue: Permission check passing but API call failing**
```tsx
// Problem: Client permission != server permission
<PermissionGuard action="delete"> // Client thinks user can delete
  <Button onClick={deleteItem}> // Server returns 403

// Solution: Verify server-side permissions match client-side
```

### Debug Tools

```tsx
// Development only - debug permission state
import { usePermissions } from "@/hooks/use-permissions";

function DebugPermissions() {
  const { permissions, role } = usePermissions();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <details className="fixed bottom-4 right-4 bg-white border p-2">
      <summary>Debug Permissions</summary>
      <p>Role: {role}</p>
      <p>Permissions: {permissions.join(', ')}</p>
    </details>
  );
}
```

### Performance Profiling

```tsx
// Use React DevTools Profiler to identify permission bottlenecks
// Look for unnecessary re-renders of PermissionGuard components
```

## Migration Support

When migrating existing components:

1. **Start with leaf components** (no children using permissions)
2. **Update incrementally** (don't change everything at once)
3. **Test thoroughly** after each component migration
4. **Use TypeScript** to catch breaking changes early
5. **Document custom patterns** for team reference

## Getting Help

- Review [Permission System Reference](./PERMISSION_SYSTEM.md) for API details
- Check [Migration Guide](./PERMISSION_MIGRATION.md) for conversion patterns
- Look at existing migrated components for examples
- Ask team members for code review before major permission changes

## Version History

- **v2.0**: Resource context system with layout integration
- **v1.0**: Legacy permission system (deprecated)

---

*Last updated: January 2025*
# Permission System Migration Guide

This guide provides comprehensive migration patterns for updating components to use the new resource context-based permission system.

## Overview

The new permission system introduces:
- **Layout-based resource detection**: Automatic resource context from URL paths
- **Action-based permissions**: Clean `action="create"` instead of `permission="resource.create"`
- **Resource overrides**: Explicit resource specification when needed
- **Type safety**: Full TypeScript support with strict typing

## Migration Patterns

### 1. Dashboard Pages → Action-Based Permissions

**Before (Old Pattern):**
```tsx
// Explicit permission strings
<PermissionGuard permission="billing.create">
  <CreateBillingForm />
</PermissionGuard>

// Resource wrapper + permission
<ResourceProvider resource="billing">
  <PermissionGuard permission="billing.read">
    <BillingDashboard />
  </PermissionGuard>
</ResourceProvider>
```

**After (New Pattern):**
```tsx
// Layout automatically provides resource="billing" for /billing/* routes
<PermissionGuard action="create">
  <CreateBillingForm />
</PermissionGuard>

<PermissionGuard action="read">
  <BillingDashboard />
</PermissionGuard>
```

### 2. Legacy Role Components → Modern Guards

**Before (Old Pattern):**
```tsx
import { AdminOnly, ManagerOnly } from "@/components/auth/permission-guard";

<AdminOnly>
  <AdminPanel />
</AdminOnly>

<ManagerOnly fallback={<AccessDenied />}>
  <ManagerDashboard />
</ManagerOnly>
```

**After (New Pattern):**
```tsx
import { PermissionGuard } from "@/components/auth/permission-guard";

<PermissionGuard minRole="org_admin">
  <AdminPanel />
</PermissionGuard>

<PermissionGuard minRole="manager" fallback={<AccessDenied />}>
  <ManagerDashboard />
</PermissionGuard>
```

### 3. Permission Format Standardization

**Before (Inconsistent Formats):**
```tsx
// Mixed colon and dot notation
<PermissionGuard permission="payroll:read" />
<PermissionGuard permission="billing.create" />
<PermissionGuard permission="staff:write" />
```

**After (Standardized Format):**
```tsx
// All use action-based with layout resource context
<PermissionGuard action="read" />     // payrolls.read (on /payrolls/*)
<PermissionGuard action="create" />   // billing.create (on /billing/*)
<PermissionGuard action="update" />   // staff.update (on /staff/*)
```

### 4. Cross-Cutting Components → Explicit Resources

**Before (Manual Resource Wrappers):**
```tsx
// Components used across different contexts
<ResourceProvider resource="payrolls">
  <PayrollTracker />
</ResourceProvider>
```

**After (Explicit Resource Specification):**
```tsx
// Components specify their resource explicitly
<PermissionGuard resource="payrolls" action="read">
  <PayrollTracker />
</PermissionGuard>
```

### 5. Hardcoded Permission Variables → Permission Guards

**Before (Manual Permission Logic):**
```tsx
const canCreateClient = permissions?.canCreate || false;
const canViewClients = user?.role === 'manager' || user?.role === 'org_admin';

return (
  <div>
    {canCreateClient && (
      <Button onClick={handleCreate}>Create Client</Button>
    )}
    {canViewClients && <ClientsList />}
  </div>
);
```

**After (Declarative Permission Guards):**
```tsx
return (
  <div>
    <CanCreate resource="clients">
      <Button onClick={handleCreate}>Create Client</Button>
    </CanCreate>
    
    <PermissionGuard action="read">
      <ClientsList />
    </PermissionGuard>
  </div>
);
```

## Common Migration Scenarios

### Dashboard Page Migration

1. **Remove ResourceProvider wrapper** from page
2. **Convert explicit permissions** to actions
3. **Update imports** to remove unused components

```tsx
// Before
import { ResourceProvider } from "@/components/auth/resource-context";

<ResourceProvider resource="billing">
  <PermissionGuard permission="billing.read">
    <BillingPage />
  </PermissionGuard>
</ResourceProvider>

// After
<PermissionGuard action="read">
  <BillingPage />
</PermissionGuard>
```

### Domain Component Migration

1. **Identify component usage context** (dashboard vs cross-cutting)
2. **Choose appropriate pattern** (action-based vs explicit resource)
3. **Update permission logic**

```tsx
// Domain component used within billing dashboard
<PermissionGuard action="approve">
  <ApprovalButton />
</PermissionGuard>

// Domain component used across multiple contexts
<PermissionGuard resource="billing" action="approve">
  <ApprovalButton />
</PermissionGuard>
```

## Resource Mapping

The system automatically maps URL paths to resources:

| Path Pattern | Resource | Example |
|-------------|----------|---------|
| `/billing/*` | `billing` | `/billing/invoices` → `billing.read` |
| `/billing/items/*` | `billing_items` | `/billing/items/new` → `billing_items.create` |
| `/staff/*` | `staff` | `/staff/123` → `staff.read` |
| `/payrolls/*` | `payrolls` | `/payrolls/edit/456` → `payrolls.update` |
| `/clients/*` | `clients` | `/clients/new` → `clients.create` |
| `/leave/*` | `leave` | `/leave/requests` → `leave.read` |
| `/security/*` | `security` | `/security/audit` → `security.read` |

## Migration Checklist

### Pre-Migration
- [ ] Identify all files using permission components
- [ ] Document current permission patterns
- [ ] Plan migration order (start with leaf components)

### During Migration
- [ ] Convert colon notation to dot notation
- [ ] Replace legacy role components
- [ ] Update dashboard pages to use action-based permissions
- [ ] Add explicit resources for cross-cutting components
- [ ] Remove hardcoded permission variables

### Post-Migration
- [ ] Run TypeScript type checking (`pnpm run type-check`)
- [ ] Test permission flows manually
- [ ] Verify no performance regressions
- [ ] Update component documentation

## Troubleshooting

### Common Issues

**TypeScript Error: "action is not assignable to PermissionAction"**
```tsx
// Problem: Using string instead of PermissionAction type
<PermissionGuard action={dynamicAction}>

// Solution: Type assertion or proper typing
<PermissionGuard action={dynamicAction as PermissionAction}>
```

**Permission not detected automatically**
```tsx
// Problem: Component not in dashboard context
<PermissionGuard action="read"> // No resource context

// Solution: Specify resource explicitly  
<PermissionGuard resource="billing" action="read">
```

**Exact optional properties error**
```tsx
// Problem: Passing undefined to optional prop
<PermissionGuard resource={maybeUndefined}>

// Solution: Conditional spread
<PermissionGuard {...(resource && { resource })}>
```

### Testing Migrations

1. **Unit Tests**: Verify permission guards render correctly
2. **Integration Tests**: Test permission flows end-to-end
3. **Manual Testing**: Check all permission scenarios in browser

## Performance Considerations

- **Layout-based detection**: Minimal overhead, computed once per route
- **Permission evaluation**: Cached results, no repeated computation
- **Component rendering**: Guards only re-render when permissions change

## Security Notes

- Always test permission changes in a development environment
- Verify that permission restrictions are properly enforced
- Ensure no sensitive operations are exposed during migration
- Document any custom permission logic for security review

## Need Help?

If you encounter issues during migration:
1. Check this guide for common patterns
2. Review the Permission System Reference documentation
3. Examine similar components that have been migrated
4. Test changes incrementally with TypeScript checking
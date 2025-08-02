# Resource Context Permission System

**Updated**: December 2024  
**Status**: ✅ Production Ready  
**Version**: Enhanced with Resource Context Support

## 🚀 **New Resource Context Pattern**

The permission system now supports **resource context** to eliminate repetitive resource.action strings and improve maintainability.

### **Quick Start**

```tsx
// 1. Define page resource
export const RESOURCE = RESOURCES.BILLING;

// 2. Wrap page in ResourceProvider
<ResourceProvider resource={RESOURCE}>
  {/* Now all guards inherit "billing" context */}
  <PermissionGuard action="create">
    <CreateButton />
  </PermissionGuard>
  
  <PermissionGuard action="update">
    <EditButton />
  </PermissionGuard>
</ResourceProvider>
```

## 📖 **Usage Patterns**

### **Pattern 1: Context-Based Actions (Recommended)**
```tsx
import { PermissionGuard, ResourceProvider, RESOURCES, ACTIONS } from "@/components/auth/permission-guard";

export const RESOURCE = RESOURCES.BILLING;

export default function BillingPage() {
  return (
    <ResourceProvider resource={RESOURCE}>
      {/* Uses billing.read */}
      <PermissionGuard action={ACTIONS.READ}>
        <BillingDashboard />
      </PermissionGuard>
      
      {/* Uses billing.create */}
      <PermissionGuard action={ACTIONS.CREATE}>
        <CreateInvoiceButton />
      </PermissionGuard>
      
      {/* Uses billing.admin */}
      <PermissionGuard action={ACTIONS.ADMIN}>
        <AdminSettings />
      </PermissionGuard>
    </ResourceProvider>
  );
}
```

### **Pattern 2: Resource Override**
```tsx
<ResourceProvider resource={RESOURCES.BILLING}>
  {/* Uses billing.read */}
  <PermissionGuard action="read">
    <BillingData />
  </PermissionGuard>
  
  {/* Override to staff.read */}
  <PermissionGuard resource={RESOURCES.STAFF} action="read">
    <StaffWidget />
  </PermissionGuard>
  
  {/* Override to clients.create */}
  <PermissionGuard resource={RESOURCES.CLIENTS} action="create">
    <AddClientButton />
  </PermissionGuard>
</ResourceProvider>
```

### **Pattern 3: Backwards Compatible**
```tsx
{/* Direct permission strings still work */}
<PermissionGuard permission="billing.admin">
  <AdminPanel />
</PermissionGuard>

<PermissionGuard permission="staff.create">
  <CreateUserButton />
</PermissionGuard>
```

### **Pattern 4: Complex Scenarios**
```tsx
<ResourceProvider resource={RESOURCES.PAYROLLS}>
  {/* Payroll access with fallback */}
  <PermissionGuard 
    action="read"
    fallback={<AccessDeniedMessage />}
  >
    <PayrollList />
  </PermissionGuard>
  
  {/* Nested cross-resource permissions */}
  <PermissionGuard resource={RESOURCES.BILLING} action="create">
    <PermissionGuard action="approve">
      <GenerateBillingButton />
    </PermissionGuard>
  </PermissionGuard>
  
  {/* Role + action combination */}
  <PermissionGuard minRole="manager">
    <PermissionGuard action="admin">
      <PayrollAdminTools />
    </PermissionGuard>
  </PermissionGuard>
</ResourceProvider>
```

## 🎯 **Available Resources**

```typescript
export const RESOURCES = {
  BILLING: "billing",
  BILLING_ITEMS: "billing_items", 
  STAFF: "staff",
  PAYROLLS: "payrolls",
  CLIENTS: "clients",
  REPORTS: "reports",
  SETTINGS: "settings",
  SYSTEM: "system",
  DASHBOARD: "dashboard",
  LEAVE: "leave",
  SCHEDULE: "schedule",
  WORKSCHEDULE: "workschedule",
  AI: "ai",
  BULKUPLOAD: "bulkupload",
  EMAIL: "email",
  INVITATIONS: "invitations",
  SECURITY: "security",
} as const;
```

## 🔧 **Available Actions**

```typescript
export const ACTIONS = {
  READ: "read",
  CREATE: "create", 
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  MANAGE: "manage",
  APPROVE: "approve",
  EXPORT: "export",
  ADMIN: "admin",
  ASSIGN: "assign",
  INVITE: "invite",
} as const;
```

## 🏗️ **Component API**

### **ResourceProvider**
```tsx
interface ResourceProviderProps {
  resource: ResourceName;
  children: ReactNode;
}
```

### **Enhanced PermissionGuard**
```tsx
interface PermissionGuardProps {
  // Resource context pattern (NEW)
  action?: PermissionAction;
  resource?: ResourceName; // Override context resource
  
  // Backwards compatible
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  
  // Role-based (unchanged)
  minRole?: UserRole;
  role?: UserRole;
  roles?: UserRole[];
  
  // UI options
  children: ReactNode;
  fallback?: ReactNode;
  showLoading?: boolean;
}
```

## 📋 **Migration Guide**

### **Step 1: Add Resource Context to Pages**
```tsx
// BEFORE
export default function BillingPage() {
  return (
    <div>
      <PermissionGuard permission="billing.read">
        <Dashboard />
      </PermissionGuard>
    </div>
  );
}

// AFTER  
export const RESOURCE = RESOURCES.BILLING;

export default function BillingPage() {
  return (
    <ResourceProvider resource={RESOURCE}>
      <div>
        <PermissionGuard action="read">
          <Dashboard />
        </PermissionGuard>
      </div>
    </ResourceProvider>
  );
}
```

### **Step 2: Convert Permission Guards**
```tsx
// BEFORE: Repetitive resource strings
<PermissionGuard permission="billing.create">
<PermissionGuard permission="billing.update">  
<PermissionGuard permission="billing.delete">

// AFTER: Clean action-based
<PermissionGuard action="create">
<PermissionGuard action="update">
<PermissionGuard action="delete">
```

### **Step 3: Handle Cross-Resource Access**
```tsx
// When you need different resource permissions
<ResourceProvider resource={RESOURCES.BILLING}>
  <PermissionGuard action="read">          {/* billing.read */}
    <BillingData />
  </PermissionGuard>
  
  <PermissionGuard resource={RESOURCES.STAFF} action="read">  {/* staff.read */}
    <StaffWidget />
  </PermissionGuard>
</ResourceProvider>
```

## ✅ **Best Practices**

### **1. Page-Level Resource Definition**
```tsx
// ✅ Good: Clear resource definition
export const RESOURCE = RESOURCES.BILLING;

// ❌ Avoid: Inline resource strings
<ResourceProvider resource="billing">
```

### **2. Use Constants**
```tsx
// ✅ Good: Type-safe constants
<PermissionGuard action={ACTIONS.CREATE}>

// ✅ Also good: String literals (type-checked)
<PermissionGuard action="create">

// ❌ Avoid: Typos and inconsistency
<PermissionGuard action="creat">
```

### **3. Resource Override When Needed**
```tsx
// ✅ Good: Clear cross-resource access
<PermissionGuard resource={RESOURCES.STAFF} action="read">
  <StaffQuickView />
</PermissionGuard>

// ❌ Avoid: Separate ResourceProvider for one component
<ResourceProvider resource={RESOURCES.STAFF}>
  <PermissionGuard action="read">
    <StaffQuickView />
  </PermissionGuard>
</ResourceProvider>
```

### **4. Fallback Messages**
```tsx
// ✅ Good: User-friendly fallbacks
<PermissionGuard 
  action="admin"
  fallback={
    <div className="p-4 text-center text-gray-500">
      Admin access required. Contact your manager.
    </div>
  }
>
  <AdminPanel />
</PermissionGuard>
```

## 🔄 **Priority Logic**

The PermissionGuard evaluates permissions in this order:

1. **Direct permission** (`permission` prop) - Highest priority
2. **Resource override** (`resource` + `action` props) 
3. **Context resource** (ResourceProvider + `action` prop)
4. **Multiple permissions** (`permissions` array)
5. **Role-based** (`minRole`, `role`, `roles`)

```tsx
// Examples of priority:
<ResourceProvider resource={RESOURCES.BILLING}>
  {/* Priority 1: Direct permission */}
  <PermissionGuard permission="reports.admin" action="create">
    {/* Uses "reports.admin", ignores action */}
  </PermissionGuard>
  
  {/* Priority 2: Resource override */}  
  <PermissionGuard resource={RESOURCES.STAFF} action="create">
    {/* Uses "staff.create" */}
  </PermissionGuard>
  
  {/* Priority 3: Context resource */}
  <PermissionGuard action="create">
    {/* Uses "billing.create" from context */}
  </PermissionGuard>
</ResourceProvider>
```

## 🧪 **Testing**

### **Unit Testing**
```tsx
import { render } from '@testing-library/react';
import { ResourceProvider, PermissionGuard, RESOURCES } from '@/components/auth/permission-guard';

test('context-based permissions work', () => {
  render(
    <ResourceProvider resource={RESOURCES.BILLING}>
      <PermissionGuard action="read">
        <div data-testid="protected-content">Protected</div>
      </PermissionGuard>
    </ResourceProvider>
  );
  
  // Test that billing.read permission is checked
});
```

### **Integration Testing**
```tsx
// Test resource override functionality
test('resource override works correctly', () => {
  render(
    <ResourceProvider resource={RESOURCES.BILLING}>
      <PermissionGuard resource={RESOURCES.STAFF} action="read">
        <div data-testid="staff-content">Staff Data</div>
      </PermissionGuard>
    </ResourceProvider>
  );
  
  // Test that staff.read permission is checked, not billing.read
});
```

## 🚨 **Error Handling**

The system provides helpful error messages:

```tsx
// Error: No resource context available
<PermissionGuard action="create">
  <Button>Create</Button>
</PermissionGuard>
// Throws: "Permission action 'create' requires a resource context"

// Error: Invalid combinations  
<PermissionGuard>
  <Button>Create</Button>
</PermissionGuard>
// Throws: "Must provide permission, or action with resource context"
```

## 📚 **See Also**

- [Permission System Architecture](./PERMISSION_SYSTEM_ARCHITECTURE.md)
- [Role Hierarchy Guide](./ROLE_HIERARCHY_GUIDE.md)
- [Migration Examples](./PERMISSION_MIGRATION_EXAMPLES.md)
- [Troubleshooting Guide](./PERMISSION_TROUBLESHOOTING.md)
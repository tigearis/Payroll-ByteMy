# Permission Guards Quick Reference

## 🛡️ Dual Permission System Overview

The system combines **Role Hierarchy** (broad access) with **Granular Permissions** (specific actions):

- **18 granular permissions** across 5 categories
- **5-level role hierarchy** (developer > org_admin > manager > consultant > viewer)
- **Flexible guard components** supporting both approaches

## 🛡️ Component Props Cheat Sheet

### `<PermissionGuard>`

```tsx
<PermissionGuard
  permission="custom:staff:write" // Single permission
  permissions={["perm1", "perm2"]} // Multiple permissions (any)
  role="manager" // Single role
  roles={["admin", "manager"]} // Multiple roles (any)
  requireAll={false} // Require ALL vs ANY
  fallback={<div>Denied</div>} // Access denied UI
  loadingFallback={<Spinner />} // Loading UI
>
  <ProtectedContent />
</PermissionGuard>
```

### `<RoleGuard>`

```tsx
<RoleGuard
  requiredRole="manager" // Minimum role
  requiredPermission="canManageUsers" // Permission check
  fallback={<AccessDenied />} // No redirect UI
  redirectTo="/dashboard" // Redirect URL
>
  <ProtectedPage />
</RoleGuard>
```

### `<RouteGuard>`

```tsx
<RouteGuard
  requiredPermissions={["perm1"]} // Required permissions
  requiredRoles={["admin"]} // Required roles
  requireAll={false} // Require ALL vs ANY
  fallbackRoute="/dashboard" // Redirect route
  customFallback={<Custom />} // Custom denied UI
  loadingComponent={<Loading />} // Custom loading
>
  <PageContent />
</RouteGuard>
```

## 🎯 Pre-built Guards

```tsx
import {
  AdminGuard, // org_admin only
  ManagerGuard, // org_admin + manager
  StaffManagerGuard, // custom:staff:write permission
  ClientManagerGuard, // manage_clients permission
  PayrollProcessorGuard, // custom:payroll:write permission
  DeveloperGuard, // custom:admin:manage permission
} from "@/components/auth/permission-guard";

<AdminGuard>
  <AdminPanel />
</AdminGuard>;
```

## 📝 Permission Strings Reference

### Current Permissions

```typescript
// Staff
"custom:staff:read" |
  "custom:staff:write" |
  "custom:staff:delete" |
  "custom:staff:invite";

// Payroll
"custom:payroll:read" |
  "custom:payroll:write" |
  "custom:payroll:delete" |
  "custom:payroll:assign";

// Client
"custom:client:read" | "custom:client:write" | "custom:client:delete";

// Admin
"custom:admin:manage" | "custom:settings:write" | "custom:billing:manage";

// Reporting
"custom:reports:read" |
  "custom:reports:export" |
  "custom:audit:read" |
  "custom:audit:write";
```

### Permission Distribution by Role

| Permission | Developer | Org Admin | Manager | Consultant | Viewer |
|------------|:---------:|:---------:|:-------:|:----------:|:------:|
| **Staff** | ✅✅✅✅ | ✅✅✅✅ | ✅✅❌✅ | ✅❌❌❌ | ❌❌❌❌ |
| **Payroll** | ✅✅✅✅ | ✅✅✅❌ | ✅✅❌✅ | ✅❌❌✅ | ✅❌❌❌ |
| **Client** | ✅✅✅ | ✅✅✅ | ✅✅❌ | ✅❌❌ | ✅❌❌ |
| **Admin** | ✅✅✅ | ✅✅✅ | ❌❌❌ | ❌❌❌ | ❌❌❌ |
| **Reports** | ✅✅✅✅ | ✅✅✅✅ | ✅✅✅❌ | ✅❌❌❌ | ✅❌❌❌ |

## 👥 Role Hierarchy

```typescript
"developer"  // Level 5 - All 18 permissions (development access)
"org_admin"  // Level 4 - 18 permissions (administrative control)  
"manager"    // Level 3 - 11 permissions (operational management)
"consultant" // Level 2 - 5 permissions (limited operations)
"viewer"     // Level 1 - 3 permissions (read-only access)
```

### Access Patterns
- **Hierarchy**: Higher roles automatically include lower role access
- **Granular**: Specific permissions control individual features
- **Layered**: Combine both for maximum flexibility

## 🚀 Common Patterns

### Hide Buttons

```tsx
<PermissionGuard permission="custom:staff:write">
  <Button>Add Staff</Button>
</PermissionGuard>
```

### Show Fallback Message

```tsx
<PermissionGuard
  permission="manage_clients"
  fallback={<div>Contact admin for access</div>}
>
  <ClientTools />
</PermissionGuard>
```

### Multiple Requirements

```tsx
<PermissionGuard
  permissions={["custom:staff:write", "custom:payroll:write"]}
  requireAll={true}
>
  <AdvancedTools />
</PermissionGuard>
```

### Role-Based Sections

```tsx
<ManagerGuard>
  <ManagerDashboard />
</ManagerGuard>
```

### Page Protection

```tsx
<RouteGuard requiredPermissions={["custom:staff:write"]}>
  <StaffManagementPage />
</RouteGuard>
```

### Complex Conditional Logic

```tsx
const { hasPermission, userRole, hasRoleLevel } = useAuthContext();

const canAccess = hasPermission("custom:staff:write") && hasRoleLevel(userRole, "manager");

const canManageAll = 
  hasPermission("custom:staff:write") && 
  hasPermission("custom:payroll:write") &&
  hasPermission("custom:client:write");

return (
  <div>
    {/* Role hierarchy check */}
    <ManagerGuard>
      <BasicOperations />
    </ManagerGuard>
    
    {/* Granular permission */}
    <PermissionGuard permission="custom:staff:read">
      <BasicStaffList />
    </PermissionGuard>
    
    {/* Combined logic */}
    {canAccess && <AdvancedFeatures />}
    
    {/* Multiple permissions */}
    {canManageAll && <SuperAdminTools />}
  </div>
);
```

## 🔧 Troubleshooting

### Component Not Hiding?

1. Check user exists in database
2. Verify JWT contains correct role
3. Apply Hasura metadata: `hasura metadata apply`
4. Check exact permission string spelling

### Debug Permissions

```tsx
// Add during development
function DebugInfo() {
  const { userRole, hasPermission } = useAuthContext();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-black text-white text-xs">
      <div>Role: {userRole}</div>
      <div>Can Manage Staff: {hasPermission("custom:staff:write") ? "✅" : "❌"}</div>
    </div>
  );
}
```

### Common Fixes

```bash
# Apply latest permissions
hasura metadata apply

# Clear browser cache and re-authenticate
# Check Clerk Dashboard for user role in publicMetadata

# Verify role in browser console
console.log(window.Clerk.user.publicMetadata.role);
```

## 📚 See Also

- [Complete Component Documentation](./components/README.md)
- [Permission System Extension Guide](./guides/PERMISSION_SYSTEM_EXTENSION_GUIDE.md)
- [Authentication Flow Analysis](./security/AUTHENTICATION_FLOW_ANALYSIS.md)

# Unified Permission System - Quick Reference

## 🚀 Getting Started

### Import
```typescript
import { useAuthContext } from "@/lib/auth";
```

### Basic Usage
```typescript
function MyComponent() {
  const { hasPermission, userRole } = useAuthContext();
  
  if (!hasPermission("payroll:write")) {
    return <div>Access Denied</div>;
  }
  
  return <PayrollForm />;
}
```

## 📋 Available Hooks & Properties

### useAuthContext() Returns:

#### **Authentication State**
- `isAuthenticated: boolean` - User is signed in
- `isLoading: boolean` - Auth context is loading  
- `isLoaded: boolean` - Clerk has finished loading
- `isSignedIn: boolean` - User authentication status
- `userId: string | null` - Clerk user ID
- `userEmail: string | null` - User email address
- `userName: string | null` - User display name
- `userRole: Role` - User's assigned role
- `databaseId: string | null` - Database user ID

#### **Permission Checking**
- `hasPermission(permission: string): boolean` - Check single permission
- `hasAnyPermission(permissions: string[]): boolean` - Check multiple (OR logic)
- `hasRole(roles: Role[]): boolean` - Check if user has specific roles
- `hasRoleLevel(requiredRole: Role): boolean` - Check role hierarchy

#### **Enhanced Permission Features**
- `effectivePermissions: EffectivePermission[]` - Role + override permissions
- `permissionOverrides: UserPermissionOverride[]` - Individual overrides only
- `getRolePermissions(): EffectivePermission[]` - Role permissions only
- `getOverridePermissions(): EffectivePermission[]` - Override permissions only
- `refreshPermissions(): Promise<void>` - Refresh after changes

#### **Legacy Compatibility**
- `canManageUsers: boolean` - Can manage staff
- `canManageClients: boolean` - Can manage clients
- `canProcessPayrolls: boolean` - Can process payrolls
- `canViewFinancials: boolean` - Can view financial data
- `hasAdminAccess: boolean` - Has admin permissions

#### **Actions**
- `signOut(): Promise<void>` - Sign out user
- `refreshUserData(): Promise<void>` - Refresh user data

## 🎯 Permission Format

**Pattern**: `"resource:action"`

### Resources
- `payroll` - Payroll operations
- `staff` - Staff management  
- `client` - Client management
- `admin` - Administrative functions
- `settings` - System settings
- `billing` - Billing operations
- `reports` - Reporting functions
- `audit` - Audit logs
- `security` - Security dashboard

### Actions
- `read` - View/access data
- `write` - Create/edit data
- `delete` - Remove data
- `assign` - Assign resources
- `invite` - Invite users
- `manage` - Full management
- `export` - Export data

### Examples
```typescript
"payroll:read"      // View payroll data
"staff:write"       // Create/edit staff
"client:delete"     // Delete clients  
"admin:manage"      // Full admin access
"reports:export"    // Export reports
"security:read"     // View security dashboard
```

## 👥 Role Hierarchy

```
Level 5: developer    → Full access + dev tools + permission management
Level 4: org_admin    → Organization management + permission overrides
Level 3: manager      → Team and payroll management  
Level 2: consultant   → Basic payroll processing
Level 1: viewer       → Read-only access
```

**Higher levels inherit all permissions from lower levels**

## 🔀 Permission Overrides

### Override Types
- **Grant**: Add permissions beyond role
- **Restrict**: Remove permissions from role  
- **Temporary**: Set expiration dates
- **Conditional**: Add specific conditions

### Override Priority (Highest to Lowest)
1. **Individual Restrictions** - Always deny
2. **Individual Grants** - Override role permissions
3. **Role Permissions** - Default permissions

### Admin Interface
Access at: `/admin/permissions` (requires `admin:manage` permission)

## 🛡️ Permission Guards

### Standard Permission Guard
```typescript
<PermissionGuard permission="staff:write" fallback={<AccessDenied />}>
  <StaffForm />
</PermissionGuard>
```

### Role-Based Guard  
```typescript
<RoleGuard requiredRole="manager" redirectTo="/dashboard">
  <ManagerOnlyPage />
</RoleGuard>
```

### Convenience Guards
```typescript
<AdminGuard>              // org_admin role
  <AdminPanel />
</AdminGuard>

<StaffManagerGuard>       // staff:write permission
  <StaffTools />
</StaffManagerGuard>

<PayrollProcessorGuard>   // payroll:write permission
  <PayrollTools />
</PayrollProcessorGuard>
```

## ⚡ Common Patterns

### Conditional Rendering
```typescript
{hasPermission("payroll:write") && <EditButton />}
{hasPermission("client:delete") && <DeleteButton />}
{userRole === "developer" && <DevTools />}
```

### Navigation Control
```typescript
const menuItems = [
  { path: "/dashboard", show: true },
  { path: "/staff", show: hasPermission("staff:read") },
  { path: "/payrolls", show: hasPermission("payroll:read") },
  { path: "/admin", show: hasPermission("admin:manage") },
];
```

### Multi-Permission Checks
```typescript
// Requires ALL permissions
const canManagePayroll = hasPermission("payroll:read") && 
                        hasPermission("payroll:write");

// Requires ANY permission  
const hasStaffAccess = hasAnyPermission(["staff:read", "staff:write"]);
```

### Permission Status Display
```typescript
function PermissionStatus() {
  const { 
    userRole, 
    effectivePermissions, 
    permissionOverrides 
  } = useAuthContext();
  
  const activeOverrides = permissionOverrides.filter(o => 
    !o.expiresAt || new Date(o.expiresAt) > new Date()
  );
  
  return (
    <div>
      <p>Role: {userRole}</p>
      <p>Total Permissions: {effectivePermissions.length}</p>
      <p>Active Overrides: {activeOverrides.length}</p>
    </div>
  );
}
```

## 🔧 Permission Override Management

### Grant Permission
```typescript
const { refreshPermissions } = useAuthContext();

await grantUserPermission({
  variables: {
    userId: "user-id",
    resource: "payroll",
    operation: "write",
    reason: "Temporary access for month-end",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
});

await refreshPermissions(); // Apply changes
```

### Restrict Permission
```typescript
await restrictUserPermission({
  variables: {
    userId: "user-id", 
    resource: "client",
    operation: "delete",
    reason: "Security precaution"
  }
});

await refreshPermissions();
```

### Remove Override
```typescript
await removePermissionOverride({
  variables: { id: "override-id" }
});

await refreshPermissions();
```

## 🛡️ API Route Protection

```typescript
// app/api/payrolls/route.ts
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get user and check permissions
  const user = await getUserById(userId);
  if (!user || !hasPermission(user.role, "payroll:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Process request...
}
```

## 🔍 Debugging

### Debug Permissions
```typescript
function DebugPermissions() {
  const { 
    userRole,
    effectivePermissions,
    permissionOverrides,
    hasPermission
  } = useAuthContext();
  
  console.log("Permission Debug:", {
    userRole,
    totalEffective: effectivePermissions.length,
    totalOverrides: permissionOverrides.length,
    canEditPayroll: hasPermission("payroll:write"),
    canDeleteClient: hasPermission("client:delete")
  });
  
  return null;
}
```

### Force Refresh
```typescript
const { refreshPermissions } = useAuthContext();

// After permission changes
<Button onClick={refreshPermissions}>
  Refresh Permissions
</Button>
```

## ⚠️ Common Issues

### Permission Not Working
1. Check if user exists in database
2. Verify permission spelling (`payroll:write` not `payroll:edit`)
3. Check role hierarchy configuration
4. Refresh permissions after changes

### Override Not Applied  
1. Verify expiration date
2. Check override was granted (not restricted)
3. Call `refreshPermissions()` after changes
4. Check database permissions

### Import Errors
```typescript
// ✅ Correct
import { useAuthContext } from "@/lib/auth";

// ❌ Wrong (file doesn't exist)  
import { useAuthContext } from "@/lib/auth/auth-context";
```

## 📚 Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Main project documentation
- [Permission System Guide](./PERMISSION_SYSTEM_GUIDE.md) - Comprehensive guide
- [Development Patterns](./architecture/DEVELOPMENT_PATTERNS.md) - Advanced patterns
- [Security Documentation](./security/) - Security-specific guides

## 🏛️ Best Practices

### Do's ✅
- Always use `useAuthContext` from `@/lib/auth`
- Check permissions before rendering sensitive UI
- Use permission guards for component protection
- Set expiration dates for temporary permissions
- Refresh permissions after making changes
- Use descriptive reasons for overrides

### Don'ts ❌
- Don't bypass permission checks in API routes
- Don't hardcode role names in components
- Don't forget to handle loading states
- Don't create permanent overrides without reason
- Don't expose sensitive data in errors
- Don't forget to audit permission changes
# Unified Permission System Developer Guide

## Overview

This guide provides comprehensive documentation for the **unified database-driven permission system** with role hierarchy and individual user overrides implemented in the Payroll ByteMy application.

## 🏗️ System Architecture

### Permission Flow
```
User Login → Clerk Auth → Database Validation → Role Assignment → Permission Calculation → Override Resolution → Access Control
```

### Core Components
1. **Unified Auth Provider**: Single `useAuthContext` hook for all authentication needs
2. **Database-Driven Permissions**: Role-based permissions with individual user overrides
3. **Permission Overrides**: Grant/restrict specific permissions beyond role permissions
4. **Guards**: React components for UI protection
5. **Database Security**: Hasura row-level security policies
6. **API Protection**: Server-side permission validation
7. **Admin Interface**: Management UI for permission overrides
8. **Audit Trail**: Complete logging of all permission changes

## 🎯 Permission Format

**Clean Syntax**: `"resource:action"`

### Examples
```typescript
"payroll:read"     // Can view payroll data
"staff:write"      // Can modify staff records
"client:delete"    // Can delete clients
"admin:manage"     // Full administrative access
"reports:export"   // Can export reports
"security:read"    // Can view security dashboard
```

## 👥 Role Hierarchy

```
Level 5: developer    → Full system access + development tools + permission management
Level 4: org_admin    → Organization management + permission overrides  
Level 3: manager      → Team and payroll management
Level 2: consultant   → Basic payroll processing
Level 1: viewer       → Read-only access
```

**Higher levels inherit all permissions from lower levels**

## 🔀 Permission Override System

### Override Types
- **Grant**: Give additional permissions beyond role
- **Restrict**: Remove specific permissions from role
- **Temporary**: Set expiration dates for overrides
- **Conditional**: Add specific conditions/restrictions

### Override Priority
1. **Individual Restrictions** (highest priority) - Always deny access
2. **Individual Grants** - Override role permissions
3. **Role Permissions** (lowest priority) - Default permissions

### Example Scenarios
```typescript
// User is a "consultant" (level 2) but needs temporary admin access
// Grant: admin:manage (expires in 7 days)
// Result: Can access admin functions until expiration

// User is a "manager" (level 3) but shouldn't delete clients  
// Restrict: client:delete (permanent)
// Result: Can manage staff/payroll but cannot delete clients
```

## 📋 Permission Categories (23 Total Permissions)

### Payroll Operations (5 permissions)
- `payroll:read` - View payroll data
- `payroll:write` - Create/edit payrolls  
- `payroll:delete` - Delete payrolls
- `payroll:assign` - Assign payrolls to staff
- `payroll:approve` - **NEW**: Approve payroll submissions and workflows

### Staff Management (5 permissions)
- `staff:read` - View staff information
- `staff:write` - Create/edit staff records
- `staff:delete` - Remove staff members
- `staff:invite` - Invite new staff members
- `staff:bulk_update` - **NEW**: Perform bulk staff operations

### Client Management (4 permissions)
- `client:read` - View client information
- `client:write` - Create/edit clients
- `client:delete` - Remove clients
- `client:archive` - **NEW**: Archive inactive clients

### Administrative Functions (3 permissions)
- `admin:manage` - Full administrative access
- `settings:write` - Modify system settings
- `billing:manage` - Handle billing operations

### Security & Audit (3 permissions)
- `security:read` - View security dashboard
- `security:write` - Modify security settings
- `security:manage` - Full security management

### Reporting (6 permissions)
- `reports:read` - View reports
- `reports:export` - Export report data
- `reports:schedule` - **NEW**: Schedule automated reports
- `audit:read` - View audit logs
- `audit:write` - Manage audit settings
- `audit:export` - **NEW**: Export audit logs and compliance reports

## 🚀 Usage Examples

### Basic Implementation

**Import the unified auth context:**
```typescript
import { useAuthContext } from "@/lib/auth";
```

**Basic permission check:**
```typescript
function PayrollManager() {
  const { hasPermission } = useAuthContext();
  
  if (!hasPermission("payroll:write")) {
    return <div>Access Denied</div>;
  }
  
  return <PayrollForm />;
}
```

**Enhanced permission usage:**
```typescript
function AdvancedPermissionExample() {
  const { 
    hasPermission, 
    userRole,
    effectivePermissions,    // Role + override permissions
    permissionOverrides,     // Individual overrides only
    refreshPermissions,      // Refresh after changes
    getRolePermissions,      // Role permissions only
    getOverridePermissions   // Override permissions only
  } = useAuthContext();
  
  const canEdit = hasPermission("payroll:write");
  const payrollPerms = effectivePermissions.filter(p => p.resource === "payroll");
  
  return (
    <div>
      <p>Role: {userRole}</p>
      <p>Can Edit: {canEdit ? "Yes" : "No"}</p>
      <p>Effective Permissions: {payrollPerms.length}</p>
      
      {permissionOverrides.map(override => (
        <div key={override.id}>
          <Badge variant={override.granted ? "default" : "destructive"}>
            {override.granted ? "GRANTED" : "RESTRICTED"}
          </Badge>
          <span>{override.resource}:{override.operation}</span>
        </div>
      ))}
    </div>
  );
}
```

### Permission Guards

**Standard permission guard:**
```typescript
<PermissionGuard permission="staff:write" fallback={<AccessDenied />}>
  <StaffForm />
</PermissionGuard>
```

**Role-based guard:**
```typescript
<RoleGuard requiredRole="manager" redirectTo="/dashboard">
  <ManagerOnlyPage />
</RoleGuard>
```

**Convenience guards:**
```typescript
<AdminGuard>              // Requires org_admin role
  <AdminPanel />
</AdminGuard>

<StaffManagerGuard>       // Requires staff:write permission  
  <StaffManagementTools />
</StaffManagerGuard>
```

### Conditional Rendering

**Show/hide features based on permissions:**
```typescript
function ActionButtons({ item }) {
  const { hasPermission } = useAuthContext();
  
  return (
    <div>
      {hasPermission("payroll:read") && <ViewButton />}
      {hasPermission("payroll:write") && <EditButton />}
      {hasPermission("payroll:delete") && <DeleteButton />}
    </div>
  );
}
```

**Navigation control:**
```typescript
function NavigationMenu() {
  const { hasPermission, userRole } = useAuthContext();
  
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", show: true },
    { path: "/staff", label: "Staff", show: hasPermission("staff:read") },
    { path: "/payrolls", label: "Payrolls", show: hasPermission("payroll:read") },
    { path: "/admin", label: "Admin", show: hasPermission("admin:manage") },
    { path: "/security", label: "Security", show: hasPermission("security:read") },
  ];
  
  return (
    <nav>
      {menuItems.filter(item => item.show).map(item => (
        <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
      ))}
    </nav>
  );
}
```

## 🔧 Permission Override Management

### Admin Interface

Access the permission management interface at `/admin/permissions`:

```typescript
// Requires admin:manage permission
function AdminPermissionPage() {
  return (
    <PermissionGuard permission="admin:manage">
      <PermissionOverrideManager userId={selectedUserId} />
    </PermissionGuard>
  );
}
```

### Grant Temporary Permission

```typescript
function GrantTemporaryAccess({ userId }) {
  const { refreshPermissions } = useAuthContext();
  
  const handleGrantPermission = async () => {
    await grantUserPermission({
      variables: {
        userId,
        resource: "payroll",
        operation: "write", 
        reason: "Temporary access for month-end processing",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
    
    // Refresh permissions across the app
    await refreshPermissions();
    
    toast.success("Permission granted successfully");
  };
  
  return (
    <Button onClick={handleGrantPermission}>
      Grant Temporary Payroll Access
    </Button>
  );
}
```

### Restrict Permission

```typescript
function RestrictPermission({ userId }) {
  const { refreshPermissions } = useAuthContext();
  
  const handleRestrictPermission = async () => {
    await restrictUserPermission({
      variables: {
        userId,
        resource: "client",
        operation: "delete",
        reason: "Security precaution - prevent accidental deletion"
      }
    });
    
    await refreshPermissions();
    toast.success("Permission restricted successfully");
  };
  
  return (
    <Button variant="destructive" onClick={handleRestrictPermission}>
      Restrict Client Deletion
    </Button>
  );
}
```

### Display Permission Status

```typescript
function UserPermissionStatus({ userId }) {
  const { 
    effectivePermissions, 
    permissionOverrides,
    getRolePermissions,
    getOverridePermissions 
  } = useAuthContext();
  
  const rolePerms = getRolePermissions();
  const overridePerms = getOverridePermissions();
  const activeOverrides = overridePerms.filter(o => 
    !o.expiresAt || new Date(o.expiresAt) > new Date()
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permission Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Role Permissions: {rolePerms.length}</h4>
            <p className="text-sm text-muted-foreground">
              Inherited from user role
            </p>
          </div>
          
          <div>
            <h4 className="font-medium">Active Overrides: {activeOverrides.length}</h4>
            {activeOverrides.map(override => (
              <div key={override.id} className="flex items-center gap-2">
                <Badge variant={override.granted ? "default" : "destructive"}>
                  {override.granted ? "GRANTED" : "RESTRICTED"}
                </Badge>
                <span>{override.resource}:{override.operation}</span>
                {override.expiresAt && (
                  <span className="text-xs text-muted-foreground">
                    Expires: {format(new Date(override.expiresAt), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="font-medium">Total Effective: {effectivePermissions.length}</h4>
            <p className="text-sm text-muted-foreground">
              Combined role and override permissions
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🛡️ API Route Protection

**Server-side permission checking:**
```typescript
// app/api/payrolls/route.ts
import { auth } from "@clerk/nextjs/server";
import { hasPermission } from "@/lib/auth/permissions";

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get user from database to check permissions
  const user = await getUserById(userId);
  
  if (!user || !hasPermission(user.role, "payroll:write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Process payroll creation...
}
```

## 📊 Database Schema

### Permission Override Tables

**User Roles Table:**
```sql
user_roles (
  id: uuid PRIMARY KEY,
  user_id: uuid NOT NULL,
  role_id: uuid NOT NULL,
  created_at: timestamptz DEFAULT now(),
  created_by: uuid
)
```

**Permission Overrides Table:**
```sql
permission_overrides (
  id: uuid PRIMARY KEY,
  user_id: uuid NOT NULL,
  resource: text NOT NULL,
  operation: text NOT NULL,
  granted: boolean NOT NULL,
  reason: text NOT NULL,
  expires_at: timestamptz,
  conditions: jsonb,
  created_at: timestamptz DEFAULT now(),
  created_by: uuid NOT NULL
)
```

### GraphQL Operations

**Query user effective permissions:**
```graphql
query GetUserEffectivePermissions($userId: uuid!) {
  userRoles(where: { userId: { _eq: $userId } }) {
    roleId
    createdAt
  }
  permissionOverrides(where: { userId: { _eq: $userId } }) {
    id
    resource
    operation
    granted
    reason
    expiresAt
    conditions
    createdAt
    createdBy
  }
}
```

**Grant permission override:**
```graphql
mutation GrantUserPermission(
  $userId: uuid!
  $resource: String!
  $operation: String!
  $reason: String!
  $expiresAt: timestamptz
  $conditions: jsonb
) {
  insert_permission_overrides_one(object: {
    userId: $userId
    resource: $resource
    operation: $operation
    granted: true
    reason: $reason
    expiresAt: $expiresAt
    conditions: $conditions
  }) {
    id
  }
}
```

## 🔍 Debugging & Troubleshooting

### Debug Permission Issues

**Check effective permissions:**
```typescript
function DebugPermissions() {
  const { 
    userRole,
    effectivePermissions,
    permissionOverrides,
    hasPermission
  } = useAuthContext();
  
  console.log("Debug Permission Info:", {
    userRole,
    effectivePermissions: effectivePermissions.length,
    overrides: permissionOverrides.length,
    canEditPayroll: hasPermission("payroll:write"),
    canDeleteClient: hasPermission("client:delete")
  });
  
  return null;
}
```

**Common Issues:**

1. **Permission not working**: Check if user exists in database
2. **Override not applied**: Verify expiration date and refresh permissions
3. **Role inheritance**: Ensure role hierarchy is correctly configured
4. **GraphQL errors**: Check Hasura permissions and metadata

### Refresh Permissions

Force refresh when permissions aren't updating:
```typescript
const { refreshPermissions } = useAuthContext();

// After granting/restricting permissions
await refreshPermissions();

// Or trigger from admin interface
<Button onClick={refreshPermissions}>
  Refresh Permissions
</Button>
```

## 🔒 Recent Security Improvements

### Critical Security Fixes Applied (December 2024)

#### 1. OAuth Privilege Escalation Fixed
**Issue**: OAuth users were automatically assigned `org_admin` role  
**Fix**: All new users now receive `viewer` role by default (least privilege)  
**Impact**: Eliminates privilege escalation attack vector

#### 2. Component Permission Guards Added
**Critical components now protected**:
- **Tax Calculator**: Requires `payroll:read` permission
- **Staff Management**: Requires `staff:read` for viewing, `staff:write` for creation
- **Settings Tabs**: Granular protection with `admin:manage` and `security:write`

#### 3. Permission System Standardization
**Before**: Mixed role checks and permission patterns  
**After**: Consistent permission-based authorization throughout

#### 4. Enhanced Security Posture
- ✅ Zero critical vulnerabilities
- ✅ Comprehensive component protection
- ✅ Production-ready security standards
- ✅ SOC2 compliance ready

### New Permission Guards Available

```typescript
// Tax Calculator Protection
<PermissionGuard permission="payroll:read">
  <AustralianTaxCalculator />
</PermissionGuard>

// Staff Management Protection
<PermissionGuard permission="staff:read">
  <StaffManagementContent />
  <PermissionGuard permission="staff:write">
    <CreateUserModal />
  </PermissionGuard>
</PermissionGuard>

// Settings Tab Protection
<PermissionGuard permission="admin:manage">
  <UserRoleManagement />
</PermissionGuard>

<PermissionGuard permission="security:write">
  <SecuritySettings />
</PermissionGuard>
```

## 🏛️ Best Practices

### Do's ✅
- Always use `useAuthContext` from `@/lib/auth`
- Check permissions before rendering sensitive UI elements
- Use permission guards for component protection
- Implement proper fallback components for access denied
- Use descriptive reasons when creating permission overrides
- Set expiration dates for temporary permissions
- Refresh permissions after making changes

### Don'ts ❌
- Don't bypass permission checks in API routes
- Don't hardcode role names in components
- Don't forget to handle loading states
- Don't expose sensitive data in permission errors
- Don't create permanent overrides without good reason
- Don't forget to audit permission changes

### Performance Tips 🚀
- Permission checks are memoized for performance
- Use guards to prevent unnecessary component renders
- Batch permission changes when possible
- Cache effective permissions on the client

## 🔗 Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Main project documentation
- [Security Documentation](./security/) - Security-specific guides
- [Authentication Flow Analysis](./security/AUTHENTICATION_FLOW_ANALYSIS.md)
- [Permission Guards Quick Reference](./security/PERMISSION_GUARDS_QUICK_REFERENCE.md)

## 📝 Migration Notes

If migrating from the old permission system:

1. **Update imports**: Change from `@/lib/auth/auth-context` to `@/lib/auth`
2. **Use unified hook**: Replace multiple hooks with single `useAuthContext`
3. **Remove custom logic**: The new system handles role + override resolution automatically
4. **Admin interface**: Use `/admin/permissions` for permission management
5. **Database setup**: Ensure permission override tables are properly configured
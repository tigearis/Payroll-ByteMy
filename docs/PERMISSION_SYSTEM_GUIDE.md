# Permission System Developer Guide

## Overview

This guide provides comprehensive documentation for the clean, hierarchical permission system implemented in the Payroll ByteMy application.

## 🏗️ System Architecture

### Permission Flow
```
User Login → Clerk Auth → Database Validation → Role Assignment → Permission Calculation → Access Control
```

### Core Components
1. **Authentication**: Clerk integration with JWT templates
2. **Authorization**: Role-based permissions with granular controls
3. **Guards**: React components for UI protection
4. **Database Security**: Hasura row-level security policies
5. **API Protection**: Server-side permission validation

## 🎯 Permission Format

**Clean Syntax**: `"resource:action"`

### Examples
```typescript
"payroll:read"     // Can view payroll data
"staff:write"      // Can modify staff records
"client:delete"    // Can delete clients
"admin:manage"     // Full administrative access
"reports:export"   // Can export reports
```

## 👥 Role Hierarchy

```
Level 5: developer    → Full system access + development tools
Level 4: org_admin    → Organization management (everything except dev tools)
Level 3: manager      → Team and payroll management
Level 2: consultant   → Basic payroll processing
Level 1: viewer       → Read-only access
```

## 📋 Permission Categories

### Payroll Operations
- `payroll:read` - View payroll data
- `payroll:write` - Create/edit payrolls  
- `payroll:delete` - Delete payrolls
- `payroll:assign` - Assign payrolls to staff

### Staff Management
- `staff:read` - View staff information
- `staff:write` - Create/edit staff records
- `staff:delete` - Remove staff members
- `staff:invite` - Send staff invitations

### Client Management
- `client:read` - View client information
- `client:write` - Create/edit clients
- `client:delete` - Remove clients

### Administration
- `admin:manage` - Full system administration
- `settings:write` - Modify system settings
- `billing:manage` - Manage billing operations

### Reporting & Audit
- `reports:read` - View reports
- `reports:export` - Export report data
- `audit:read` - View audit logs
- `audit:write` - Create audit entries

## 🔐 Role Permission Matrix

| Permission | developer | org_admin | manager | consultant | viewer |
|------------|-----------|-----------|---------|------------|--------|
| `payroll:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `payroll:write` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `payroll:delete` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `payroll:assign` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `staff:read` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `staff:write` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `staff:delete` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `staff:invite` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `client:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `client:write` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `client:delete` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `admin:manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `settings:write` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `billing:manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `reports:read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `reports:export` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `audit:read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `audit:write` | ✅ | ✅ | ❌ | ❌ | ❌ |

## 🛡️ Permission Guards

### 1. Standard PermissionGuard (90% of use cases)

**File**: `components/auth/permission-guard.tsx`

```typescript
import { PermissionGuard } from "@/components/auth/permission-guard";

// Single permission
<PermissionGuard permission="staff:write" fallback={<AccessDenied />}>
  <StaffForm />
</PermissionGuard>

// Multiple permissions (OR logic)
<PermissionGuard 
  permissions={["staff:read", "client:read"]} 
  requireAll={false}
>
  <Dashboard />
</PermissionGuard>

// Role-based
<PermissionGuard roles={["manager", "org_admin"]}>
  <ManagerTools />
</PermissionGuard>

// Multiple permissions (AND logic)
<PermissionGuard 
  permissions={["payroll:read", "staff:read"]} 
  requireAll={true}
>
  <PayrollStaffView />
</PermissionGuard>
```

### 2. Enhanced PermissionGuard (Complex scenarios)

**File**: `components/auth/enhanced-permission-guard.tsx`

```typescript
import { PermissionGuard } from "@/components/auth/enhanced-permission-guard";

// Resource/action format with detailed feedback
<PermissionGuard 
  resource="payroll" 
  action="delete"
  fallback={DetailedErrorComponent}
>
  <DeletePayrollButton />
</PermissionGuard>

// Multiple permissions with context
<PermissionGuard
  permissions={[["users", "manage"], ["payrolls", "write"]]}
  requireAll={false}
  showError={true}
>
  <AdminPanel />
</PermissionGuard>
```

### 3. RoleGuard (Page-level protection)

**File**: `components/auth/role-guard.tsx`

```typescript
import { RoleGuard } from "@/components/auth/role-guard";

// Role-based with redirect
<RoleGuard requiredRole="manager" redirectTo="/dashboard">
  <ManagerOnlyPage />
</RoleGuard>

// Permission-based with redirect
<RoleGuard requiredPermission="admin:manage" redirectTo="/unauthorized">
  <AdminSettings />
</RoleGuard>

// Custom fallback
<RoleGuard 
  requiredRole="org_admin" 
  fallback={<CustomAccessDenied />}
>
  <OrgAdminPanel />
</RoleGuard>
```

### 4. Convenience Guards

Pre-configured guards for common patterns:

```typescript
import { 
  AdminGuard, 
  ManagerGuard, 
  StaffManagerGuard,
  ClientManagerGuard,
  PayrollProcessorGuard,
  DeveloperGuard 
} from "@/components/auth/permission-guard";

<AdminGuard>              // roles={["org_admin"]}
  <AdminPanel />
</AdminGuard>

<ManagerGuard>            // roles={["org_admin", "manager"]}
  <ManagerDashboard />
</ManagerGuard>

<StaffManagerGuard>       // permission="staff:write"
  <AddEmployeeButton />
</StaffManagerGuard>

<PayrollProcessorGuard>   // permission="payroll:write"
  <CreatePayrollForm />
</PayrollProcessorGuard>

<DeveloperGuard>          // roles={["developer"]}
  <DevTools />
</DeveloperGuard>
```

## 🎣 Permission Hooks

### 1. useAuthContext (Primary hook)

```typescript
import { useAuthContext } from "@/lib/auth/auth-context";

function MyComponent() {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasRole, 
    userRole,
    isAuthenticated,
    canManageStaff,
    canProcessPayrolls 
  } = useAuthContext();
  
  // Single permission check
  if (!hasPermission("payroll:write")) {
    return <AccessDenied />;
  }
  
  // Multiple permissions (OR logic)
  const canViewData = hasAnyPermission(["staff:read", "client:read"]);
  
  // Role check
  const isManager = hasRole(["manager", "org_admin"]);
  
  // Convenience properties
  if (canManageStaff) {
    // User can manage staff
  }
  
  return <ComponentContent />;
}
```

### 2. useEnhancedPermissions (Advanced scenarios)

```typescript
import { useEnhancedPermissions } from "@/hooks/use-enhanced-permissions";

function AdvancedComponent() {
  const { 
    checkPermission, 
    requirePermission,
    hasAnyPermission,
    hasAllPermissions 
  } = useEnhancedPermissions();
  
  // Detailed permission check
  const result = checkPermission("payroll", "delete");
  if (!result.granted) {
    console.log(result.reason);      // "Insufficient permissions for payroll:delete"
    console.log(result.suggestions); // ["Contact admin to request manager role"]
    return <DetailedError result={result} />;
  }
  
  // Strict permission check (throws on failure)
  try {
    requirePermission("admin", "manage");
    // Continue with admin operations
  } catch (error) {
    // Handle permission error
  }
  
  // Multiple permission checks
  const canManageUsers = hasAllPermissions([
    ["users", "read"], 
    ["users", "write"]
  ]);
  
  return <ComponentContent />;
}
```

### 3. useUserRole (Role management)

```typescript
import { useUserRole } from "@/hooks/use-user-role";

function UserManagement() {
  const { 
    userRole,
    updateUserRole,
    getAvailableRoles,
    getRoleColor,
    navigation 
  } = useUserRole();
  
  // Role information
  const roleOptions = getAvailableRoles();
  const roleColorClass = getRoleColor(userRole);
  
  // Navigation permissions
  if (navigation.canAccess.staff) {
    // User can access staff section
  }
  
  // Update role (requires permissions)
  const handleRoleUpdate = async (userId, newRole) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      // Role updated successfully
    }
  };
  
  return <RoleManagementUI />;
}
```

## 🔍 Conditional Rendering Patterns

### Basic Permission Checks
```typescript
function PayrollActions({ payroll }) {
  const { hasPermission } = useAuthContext();
  
  return (
    <div className="actions">
      {/* Always visible for users with payroll:read */}
      <ViewButton />
      
      {/* Conditional buttons based on permissions */}
      {hasPermission("payroll:write") && (
        <EditButton onClick={() => editPayroll(payroll.id)} />
      )}
      
      {hasPermission("payroll:delete") && (
        <DeleteButton onClick={() => deletePayroll(payroll.id)} />
      )}
      
      {hasPermission("payroll:assign") && (
        <AssignButton payroll={payroll} />
      )}
    </div>
  );
}
```

### Role-Level Checks
```typescript
function AdvancedFeatures() {
  const { userRole, hasRoleLevel } = useAuthContext();
  
  return (
    <div>
      {/* Show for managers and above */}
      {hasRoleLevel(userRole, "manager") && (
        <ManagerFeatures />
      )}
      
      {/* Show only for developers */}
      {userRole === "developer" && (
        <DeveloperTools />
      )}
      
      {/* Show for org_admin and above */}
      {hasRoleLevel(userRole, "org_admin") && (
        <AdminPanel />
      )}
    </div>
  );
}
```

### Navigation Menus
```typescript
function NavigationMenu() {
  const { hasPermission, userRole } = useAuthContext();
  
  const menuItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      show: true,
      icon: "🏠"
    },
    { 
      path: "/staff", 
      label: "Staff", 
      show: hasPermission("staff:read"),
      icon: "👥"
    },
    { 
      path: "/payrolls", 
      label: "Payrolls", 
      show: hasPermission("payroll:read"),
      icon: "💰"
    },
    { 
      path: "/clients", 
      label: "Clients", 
      show: hasPermission("client:read"),
      icon: "🏢"
    },
    { 
      path: "/settings", 
      label: "Settings", 
      show: hasPermission("settings:write"),
      icon: "⚙️"
    },
    { 
      path: "/developer", 
      label: "Developer", 
      show: userRole === "developer",
      icon: "🔧"
    },
  ];
  
  return (
    <nav className="navigation">
      {menuItems
        .filter(item => item.show)
        .map(item => (
          <NavLink 
            key={item.path} 
            to={item.path}
            className="nav-item"
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))
      }
    </nav>
  );
}
```

## 🛡️ API Route Protection

### Server-Side Permission Checks
```typescript
// app/api/payrolls/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server-auth";
import { roleHasPermission } from "@/lib/auth/permissions";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { user } = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }
    
    // Check permission
    if (!roleHasPermission(user.role, "payroll:write")) {
      return NextResponse.json(
        { error: "Insufficient permissions" }, 
        { status: 403 }
      );
    }
    
    // Process the request
    const data = await request.json();
    const payroll = await createPayroll(data);
    
    return NextResponse.json({ success: true, data: payroll });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { user } = await getCurrentUser();
  
  // Stricter permission for deletion
  if (!user || !roleHasPermission(user.role, "payroll:delete")) {
    return NextResponse.json(
      { error: "Delete permission required" }, 
      { status: 403 }
    );
  }
  
  // Process deletion...
}
```

### Middleware Protection
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { ROUTE_PERMISSIONS } from '@/lib/auth/permissions';

const isProtectedRoute = createRouteMatcher([
  '/staff(.*)',
  '/payrolls(.*)',
  '/clients(.*)',
  '/settings(.*)',
  '/developer(.*)'
]);

export default clerkMiddleware((auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    auth().protect();
    
    // Additional permission checking can be added here
    const pathname = req.nextUrl.pathname;
    const requiredPermissions = ROUTE_PERMISSIONS[pathname];
    
    if (requiredPermissions?.length > 0) {
      // Check user has required permissions
      // Implementation depends on your needs
    }
  }
});
```

## 🏗️ Database Security (Hasura)

### Row-Level Security Examples

**Manager Access Pattern:**
```yaml
# Managers can see all payrolls
- role: manager
  permission:
    filter: {} # No restrictions
    columns: ['*']
    allow_aggregations: true
```

**Consultant Access Pattern:**
```yaml
# Consultants only see assigned payrolls
- role: consultant
  permission:
    filter:
      _or:
        - primary_consultant_id: { _eq: "X-Hasura-User-Id" }
        - backup_consultant_id: { _eq: "X-Hasura-User-Id" }
    columns: 
      - id
      - name
      - client_id
      - status
      # Excluding sensitive columns
```

**User-Specific Data:**
```yaml
# Users can only see their own leave records
- role: viewer
  permission:
    filter:
      user_id: { _eq: "X-Hasura-User-Id" }
    columns:
      - id
      - start_date
      - end_date
      - leave_type
      - status
```

## 🎯 Best Practices

### 1. Permission Naming
- Use clear, descriptive resource names
- Stick to standard actions: `read`, `write`, `delete`, `manage`
- Be consistent across similar resources

### 2. Guard Selection
- **PermissionGuard**: For 90% of UI components
- **Enhanced PermissionGuard**: When you need detailed error feedback
- **RoleGuard**: For page-level protection with redirects
- **Convenience Guards**: For common patterns

### 3. Performance Optimization
- Permissions are calculated once and cached in auth context
- Use `useMemo` for expensive permission calculations
- Avoid checking permissions in render loops

### 4. Error Handling
```typescript
// Good: Graceful fallback
{hasPermission("staff:write") ? (
  <EditButton />
) : (
  <ViewOnlyIndicator />
)}

// Better: Using guards with fallbacks
<PermissionGuard permission="staff:write" fallback={<ViewOnlyIndicator />}>
  <EditButton />
</PermissionGuard>
```

### 5. Testing Permissions
```typescript
// Test with different roles
const mockAuthContext = {
  userRole: 'manager',
  hasPermission: (permission) => managerPermissions.includes(permission)
};

// Test component behavior
render(
  <AuthContext.Provider value={mockAuthContext}>
    <ComponentUnderTest />
  </AuthContext.Provider>
);
```

## 🚨 Common Pitfalls

### 1. Security Through Obscurity
```typescript
// ❌ Bad: Hiding UI but not securing API
{userRole === 'admin' && <DeleteButton />}
// API endpoint is still accessible!

// ✅ Good: Secure both UI and API
<AdminGuard>
  <DeleteButton />
</AdminGuard>
// + Protect API endpoint with permission checks
```

### 2. Client-Side Only Security
```typescript
// ❌ Bad: Only checking on client
function deletePayroll(id) {
  if (hasPermission("payroll:delete")) {
    // Direct database call - INSECURE!
    await db.payrolls.delete(id);
  }
}

// ✅ Good: Always validate on server
function deletePayroll(id) {
  // Client-side check for UX
  if (!hasPermission("payroll:delete")) {
    showError("Permission denied");
    return;
  }
  
  // Server validates permissions again
  await api.delete(`/payrolls/${id}`);
}
```

### 3. Hardcoded Role Checks
```typescript
// ❌ Bad: Hardcoded roles
if (userRole === 'manager' || userRole === 'org_admin') {
  // This breaks when roles change
}

// ✅ Good: Permission-based checks
if (hasPermission("staff:write")) {
  // Works regardless of role changes
}
```

## 📁 File Structure

```
lib/auth/
├── permissions.ts              # Single source of truth
├── auth-context.tsx           # Main auth context
├── service-auth.ts            # Server-side auth utilities
└── client-auth-logger.ts      # Audit logging

components/auth/
├── permission-guard.tsx       # Standard guard
├── enhanced-permission-guard.tsx  # Advanced guard
├── role-guard.tsx            # Simple role guard
├── permission-denied.tsx     # Error component
└── strict-database-guard.tsx # Database validation

hooks/
├── use-enhanced-permissions.ts  # Advanced permission hook
├── use-user-role.ts           # Role management hook
└── use-current-user.ts        # User data hook
```

## 🔧 Configuration Files

### Single Source of Truth: `lib/auth/permissions.ts`
All permissions, roles, and mappings are defined here:
- Permission strings
- Role hierarchy
- Role-to-permission mapping
- Utility functions
- TypeScript types

### Route Protection: `middleware.ts`
Handles authentication and basic route protection.

### Database Security: `hasura/metadata/`
Contains all Hasura permissions and row-level security policies.

## 🆘 Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check user is authenticated
   - Verify user exists in database
   - Confirm role assignment is correct
   - Check permission is included for user's role

2. **Metadata Inconsistencies**
   - Run `pnpm fix:permissions` to auto-fix
   - Check database schema matches metadata
   - Verify column names exist in database

3. **Type Errors**
   - Run `pnpm codegen` to regenerate types
   - Check permission strings match defined types
   - Verify import paths are correct

### Debug Commands
```bash
# Fix permission issues
pnpm fix:permissions

# Check metadata consistency
hasura metadata ic list

# Regenerate types
pnpm codegen

# Validate naming conventions
pnpm validate:naming
```

This comprehensive permission system provides secure, scalable, and maintainable access control for the entire application while maintaining excellent developer experience.
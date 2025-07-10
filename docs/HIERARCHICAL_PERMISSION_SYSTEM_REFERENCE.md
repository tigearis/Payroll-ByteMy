# Hierarchical Permission System Reference

## Overview

The hierarchical permission system provides enterprise-grade security with optimal JWT size through role inheritance and smart exclusions. This document provides technical details for developers working with the system.

## System Architecture

### Core Innovation: Role Inheritance + Exclusions

Instead of storing **128 permissions** in JWT tokens (~4,891 bytes), the system stores:
- **User's role** (inherits permissions from role hierarchy)
- **Small exclusion list** (permissions they can't use)
- **Result**: 71% JWT size reduction (down to ~1,435 bytes)

### Role Hierarchy

```typescript
export type UserRole = "developer" | "org_admin" | "manager" | "consultant" | "viewer";

// Hierarchy (higher roles inherit from lower roles)
const ROLE_HIERARCHY: UserRole[] = ["developer", "org_admin", "manager", "consultant", "viewer"];
```

### Permission Format

```typescript
// All permissions follow the format: "resource.action"
type Permission = 
  | "dashboard.read" | "dashboard.create" | "dashboard.update" | "dashboard.delete"
  | "clients.read" | "clients.create" | "clients.update" | "clients.delete" | "clients.manage"
  | "payrolls.read" | "payrolls.create" | "payrolls.update" | "payrolls.delete" | "payrolls.manage"
  | "staff.read" | "staff.create" | "staff.update" | "staff.delete" | "staff.manage"
  | "security.read" | "security.create" | "security.update" | "security.delete" | "security.manage"
  | "developer.read" | "developer.create" | "developer.update" | "developer.delete" | "developer.manage"
  // ... 128 total permissions across 16 resources
```

## JWT Token Structure

### Hierarchical JWT Claims

```typescript
// New optimized structure (71% smaller)
interface HierarchicalJWT {
  "x-hasura-user-id": string;           // Database user UUID
  "x-hasura-default-role": UserRole;    // User's primary role
  "x-hasura-allowed-roles": UserRole[]; // Roles they can access
  "x-hasura-clerk-id": string;          // Clerk authentication ID
  "x-hasura-is-staff": boolean;         // Staff status
  "x-hasura-manager-id": string | null; // Manager ID
  "x-hasura-excluded-permissions": string[];  // 🎯 Small exclusion list!
  "x-hasura-permission-hash": string;   // Integrity hash
  "x-hasura-permission-version": string; // Cache invalidation
  "x-hasura-org-id": string | null;     // Future multi-tenancy
}
```

### Example JWT Payloads

**Developer (No Exclusions):**
```json
{
  "x-hasura-user-id": "d9ac8a7b-f679-49a1-8c99-837eb977578b",
  "x-hasura-default-role": "developer",
  "x-hasura-allowed-roles": ["developer", "org_admin", "manager", "consultant", "viewer"],
  "x-hasura-excluded-permissions": [] // Developers have everything
}
```

**Manager (Some Exclusions):**
```json
{
  "x-hasura-user-id": "e8bd9c8c-g789-50b2-9d00-948fc088689c",
  "x-hasura-default-role": "manager", 
  "x-hasura-allowed-roles": ["manager", "consultant", "viewer"],
  "x-hasura-excluded-permissions": [
    "developer.*", "security.delete", "users.delete", 
    "clients.delete", "payrolls.delete", "settings.delete"
  ]
}
```

## Component Usage

### Basic Permission Guard

```typescript
import { PermissionGuard } from '@/components/auth/permission-guard';

// Single permission check
<PermissionGuard resource="clients" action="create">
  <CreateClientButton />
</PermissionGuard>

// Multiple permissions (requires ALL)
<PermissionGuard permissions={["clients.create", "clients.update"]} requireAll={true}>
  <EditClientForm />
</PermissionGuard>
```

### hasAny Permission Guards

```typescript
import { AnyPermissionGuard } from '@/components/auth/permission-guard';

// Shows content if user has ANY of these permissions
<AnyPermissionGuard permissions={["clients.create", "clients.update", "clients.manage"]}>
  <ClientManagementTools />
</AnyPermissionGuard>
```

### Role-Based Guards

```typescript
import { AdminGuard, ManagerPlusGuard, StaffGuard } from '@/components/auth/permission-guard';

// Admin only (developer + org_admin)
<AdminGuard>
  <SystemSettings />
</AdminGuard>

// Manager and above
<ManagerPlusGuard>
  <TeamManagement />
</ManagerPlusGuard>

// Any staff role
<StaffGuard>
  <StaffDashboard />
</StaffGuard>
```

## Hook Usage

### usePermissions Hook

```typescript
import { usePermissions } from '@/hooks/use-permissions';

function MyComponent() {
  const { can, canAny, role, isLoaded } = usePermissions();
  
  // Single permission
  if (can("clients", "create")) {
    // User can create clients
  }
  
  // Multiple permissions (hasAny logic)
  if (canAny(["clients.create", "clients.update", "clients.manage"])) {
    // User can do at least one of these actions
  }
  
  // Role checking
  if (role === "developer") {
    // Developer-specific logic
  }
}
```

### useHierarchicalPermissions Hook

```typescript
import { useHierarchicalPermissions } from '@/hooks/use-hierarchical-permissions';

function AdvancedComponent() {
  const { 
    hasPermission, 
    hasAnyPermission, 
    userRole, 
    excludedPermissions,
    effectivePermissions 
  } = useHierarchicalPermissions();
  
  // Direct hierarchical checks
  if (hasPermission("clients.create")) {
    // Permission granted through role inheritance
  }
  
  // hasAny with multiple permissions
  if (hasAnyPermission(["clients.create", "clients.update"])) {
    // At least one permission available
  }
  
  // Debug info
  console.log('User role:', userRole);
  console.log('Excluded permissions:', excludedPermissions);
  console.log('Effective permissions:', effectivePermissions);
}
```

## Database Integration

### Permission Tables

The system maintains full database-driven permissions:

```sql
-- Core permission tables
roles                -- 5 roles (developer, org_admin, etc.)
permissions          -- 128 granular permissions  
resources           -- 16 resources (clients, payrolls, etc.)
role_permissions    -- Junction table linking roles to permissions
user_roles          -- User role assignments
```

### Database Queries

```typescript
// Get user's hierarchical permissions
const permissionData = await getHierarchicalPermissionsFromDatabase(userId);

// Returns:
{
  role: "manager",
  allowedRoles: ["manager", "consultant", "viewer"], 
  excludedPermissions: ["developer.*", "security.delete"],
  permissionHash: "abc123...",
  permissionVersion: "1751978002604"
}
```

## Migration Process

### Automatic User Migration

Users are automatically migrated when they sign in:

1. **Sign-in triggers**: `syncUserWithDatabase()` 
2. **Calculation**: System calculates role inheritance vs database permissions
3. **Exclusions generated**: Creates small list of excluded permissions
4. **Clerk updated**: Populates hierarchical metadata
5. **JWT optimized**: Next JWT token is 71% smaller

### Migration Status

Check user migration status:

```typescript
// Test hierarchical readiness
const { allowedRoles, excludedPermissions } = user.publicMetadata;
const isReady = allowedRoles && Array.isArray(excludedPermissions);
```

## Performance Benefits

### JWT Size Comparison

| User Role | Old JWT Size | New JWT Size | Reduction |
|-----------|--------------|--------------|-----------|
| Developer | ~4,891 bytes | ~1,435 bytes | 71% |
| Manager   | ~4,891 bytes | ~1,532 bytes | 69% |
| Consultant| ~4,891 bytes | ~1,458 bytes | 70% |
| Viewer    | ~4,891 bytes | ~1,425 bytes | 71% |

### Permission Checking Performance

- **Old system**: Check against 128-item array
- **New system**: Role inheritance + small exclusion check
- **Result**: Faster permission validation

## Security Features

### Role Inheritance Security

```typescript
// Developer inherits ALL permissions
developer.permissions = ["*"] // Wildcard
developer.excludedPermissions = [] // No exclusions

// Manager inherits subset
manager.basePermissions = ["clients.*", "payrolls.*", "staff.manage"]
manager.excludedPermissions = ["developer.*", "security.delete", "*.delete"]
```

### Permission Hash Integrity

```typescript
// Each user gets unique permission hash
const hash = generatePermissionHash(role, excludedPermissions);
// Used for cache invalidation and integrity checking
```

## Troubleshooting

### Common Issues

1. **User not migrated**: Check if `allowedRoles` exists in user metadata
2. **Permission denied**: Verify role hierarchy and exclusions
3. **JWT too large**: Ensure hierarchical sync completed
4. **Hook errors**: Confirm imports use new hierarchical hooks

### Debug Tools

```typescript
// Check user's effective permissions
const { effectivePermissions, getPermissionSource } = useHierarchicalPermissions();

// Debug specific permission
const source = getPermissionSource("clients.create");
// Returns: "inherited" | "excluded" | "denied"
```

### Testing

```bash
# Run hierarchical system tests
node scripts/test-hierarchical-permission-system.mjs

# Verify specific user
node scripts/test-nathan-sync.mjs

# Check system verification
node scripts/verify-hierarchical-system.mjs
```

## Best Practices

### Component Design

1. **Prefer `AnyPermissionGuard`** for flexible access patterns
2. **Use role guards** for clear hierarchy-based access
3. **Combine guards** for complex permission logic
4. **Always provide fallbacks** for denied access

### Permission Naming

1. **Follow `resource.action` format** consistently
2. **Use specific actions** (create, update, delete, manage)
3. **Group related permissions** by resource
4. **Document permission purposes** in code comments

### Performance

1. **Minimize permission checks** in render loops
2. **Use `useMemo`** for expensive permission calculations  
3. **Cache permission results** when appropriate
4. **Batch permission checks** when possible

## Future Enhancements

### Multi-Tenancy Support

The system is designed for future multi-tenancy:

```typescript
// Future JWT structure
{
  "x-hasura-org-id": "org_uuid",           // Organization context
  "x-hasura-tenant-permissions": string[], // Tenant-specific exclusions
}
```

### Dynamic Permissions

Support for runtime permission updates:

```typescript
// Future: Real-time permission updates
const { refreshPermissions } = useHierarchicalPermissions();
await refreshPermissions(); // Re-sync from database
```

---

The hierarchical permission system provides enterprise-grade security with optimal performance, reducing JWT size by 71% while maintaining full database-driven permission granularity.
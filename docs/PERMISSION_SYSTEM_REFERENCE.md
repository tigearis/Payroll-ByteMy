# Permission System Technical Reference

## Overview

This document provides technical details for developers working with the permission system implemented in the staff details page and throughout the application.

## Permission System Architecture

### Core Concepts

#### 1. Permission Format
```typescript
// All permissions follow the format: "resource:action"
type Permission = 
  | "payroll:read" | "payroll:write" | "payroll:delete" | "payroll:assign" | "payroll:approve"
  | "staff:read" | "staff:write" | "staff:delete" | "staff:invite" | "staff:bulk_update"
  | "client:read" | "client:write" | "client:delete" | "client:archive"
  | "admin:manage" | "settings:write" | "billing:manage"
  | "security:read" | "security:write" | "security:manage"
  | "reports:read" | "reports:export" | "reports:schedule"
  | "audit:read" | "audit:write" | "audit:export";
```

#### 2. Role Hierarchy
```typescript
export const ROLE_HIERARCHY: Record<Role, number> = {
  developer: 5,    // All permissions (23)
  org_admin: 4,    // Most permissions (22)
  manager: 3,      // Team management (12)
  consultant: 2,   // Basic operations (4)
  viewer: 1,       // Read-only (3)
};
```

#### 3. Permission Override System
```typescript
interface PermissionOverride {
  id: string;
  userId?: string;          // User-specific override
  role?: string;           // Role-wide override
  resource: string;        // e.g., "payroll"
  operation: string;       // e.g., "read"
  granted: boolean;        // true = grant, false = restrict
  reason: string;          // Audit reason (required)
  expiresAt?: Date;        // Optional expiration
  conditions?: object;     // Future: conditional logic
  createdBy: string;       // Who made the change
  createdAt: Date;         // When it was created
}
```

## Database Schema

### Core Tables
```sql
-- Permission resources (payroll, staff, client, etc.)
CREATE TABLE resources (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Individual permissions (read, write, delete, etc.)
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  resource_id UUID REFERENCES resources(id),
  action VARCHAR(50) NOT NULL,
  description TEXT,
  legacy_permission_name VARCHAR(100), -- For migration
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(resource_id, action)
);

-- System roles (developer, org_admin, manager, etc.)
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  description TEXT,
  priority INTEGER NOT NULL,
  is_system_role BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Role-to-permission assignments
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role_id UUID REFERENCES roles(id),
  permission_id UUID REFERENCES permissions(id),
  conditions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- User-to-role assignments
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Permission overrides (grants/restrictions)
CREATE TABLE permission_overrides (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),      -- NULL for role-wide overrides
  role VARCHAR(50),                       -- NULL for user-specific overrides
  resource VARCHAR(50) NOT NULL,
  operation VARCHAR(50) NOT NULL,
  granted BOOLEAN NOT NULL,               -- true = grant, false = restrict
  reason TEXT NOT NULL,                   -- Required for audit
  conditions JSONB,                       -- Future: conditional permissions
  expires_at TIMESTAMP,                   -- NULL = permanent
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes for Performance
```sql
-- Essential indexes for permission checking
CREATE INDEX idx_permission_overrides_user_active ON permission_overrides 
  (user_id, resource, operation) 
  WHERE expires_at IS NULL OR expires_at > NOW();

CREATE INDEX idx_permission_overrides_role_active ON permission_overrides 
  (role, resource, operation) 
  WHERE expires_at IS NULL OR expires_at > NOW();

CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id);
```

## GraphQL Schema

### Key Types
```graphql
type PermissionOverride {
  id: uuid!
  userId: uuid
  role: String
  resource: String!
  operation: String!
  granted: Boolean!
  reason: String!
  conditions: jsonb
  expiresAt: timestamptz
  createdBy: uuid!
  createdAt: timestamptz!
  updatedAt: timestamptz!
  
  # Relations
  targetUser: User
  createdByUser: User!
}

type User {
  id: uuid!
  name: String!
  email: String!
  role: user_role!
  isActive: Boolean!
  isStaff: Boolean!
  
  # Permission-related fields
  assignedRoles: [UserRole!]!
  permissionOverrides: [PermissionOverride!]!
}
```

### Essential Queries
```graphql
# Get user's effective permissions
query GetUserEffectivePermissions($userId: uuid!) {
  # Get role-based permissions
  userRoles(where: { userId: { _eq: $userId } }) {
    roleId
    assignedRole {
      assignedPermissions {
        grantedPermission {
          relatedResource { name }
          action
        }
      }
    }
  }
  
  # Get user-specific overrides
  permissionOverrides(where: {
    userId: { _eq: $userId }
    _or: [
      { expiresAt: { _isNull: true } }
      { expiresAt: { _gt: "now()" } }
    ]
  }) {
    resource
    operation
    granted
    conditions
  }
}

# Get active permission overrides for a user
query GetUserPermissionOverrides($userId: uuid!) {
  permissionOverrides(where: { 
    userId: { _eq: $userId }
    _or: [
      { expiresAt: { _isNull: true } }
      { expiresAt: { _gt: "now()" } }
    ]
  }) {
    id
    resource
    operation
    granted
    reason
    expiresAt
    createdAt
    createdByUser {
      id
      name
      email
    }
  }
}
```

### Essential Mutations
```graphql
# Grant additional permission to user
mutation GrantUserPermission(
  $userId: uuid!
  $resource: String!
  $operation: String!
  $reason: String!
  $expiresAt: timestamptz
  $conditions: jsonb
) {
  insertPermissionOverride(object: {
    userId: $userId
    resource: $resource
    operation: $operation
    granted: true
    reason: $reason
    expiresAt: $expiresAt
    conditions: $conditions
  }) {
    id
    userId
    resource
    operation
    granted
    reason
    expiresAt
  }
}

# Restrict permission from user
mutation RestrictUserPermission(
  $userId: uuid!
  $resource: String!
  $operation: String!
  $reason: String!
  $expiresAt: timestamptz
) {
  insertPermissionOverride(object: {
    userId: $userId
    resource: $resource
    operation: $operation
    granted: false
    reason: $reason
    expiresAt: $expiresAt
  }) {
    id
    userId
    resource
    operation
    granted
    reason
  }
}

# Remove permission override
mutation RemovePermissionOverride($id: uuid!) {
  deletePermissionOverrideById(id: $id) {
    id
    userId
    resource
    operation
    granted
  }
}
```

## TypeScript Implementation

### Permission Constants
```typescript
// /lib/auth/permissions.ts
export const ALL_PERMISSIONS = [
  // Payroll permissions (5)
  "payroll:read", "payroll:write", "payroll:delete", 
  "payroll:assign", "payroll:approve",
  
  // Staff permissions (5)
  "staff:read", "staff:write", "staff:delete", 
  "staff:invite", "staff:bulk_update",
  
  // Client permissions (4)
  "client:read", "client:write", "client:delete", "client:archive",
  
  // Admin permissions (3)
  "admin:manage", "settings:write", "billing:manage",
  
  // Security permissions (3)
  "security:read", "security:write", "security:manage",
  
  // Reporting permissions (3)
  "reports:read", "reports:export", "reports:schedule",
  "audit:read", "audit:write", "audit:export",
] as const;

export const PERMISSION_CATEGORIES = {
  PAYROLL: ["payroll:read", "payroll:write", "payroll:delete", "payroll:assign", "payroll:approve"],
  STAFF: ["staff:read", "staff:write", "staff:delete", "staff:invite", "staff:bulk_update"],
  CLIENT: ["client:read", "client:write", "client:delete", "client:archive"],
  ADMIN: ["admin:manage", "settings:write", "billing:manage"],
  SECURITY: ["security:read", "security:write", "security:manage"],
  REPORTING: ["reports:read", "reports:export", "reports:schedule", "audit:read", "audit:write", "audit:export"],
} as const;
```

### Permission Checking Logic
```typescript
// Check if user has permission (including overrides)
const checkUserPermission = (
  userRole: string,
  permission: string,
  overrides: PermissionOverride[]
): boolean => {
  const [resource, operation] = permission.split(':');
  
  // 1. Check for explicit restrictions (highest priority)
  const restriction = overrides.find(
    override => 
      override.resource === resource &&
      override.operation === operation && 
      override.granted === false &&
      (!override.expiresAt || new Date(override.expiresAt) > new Date())
  );
  if (restriction) return false;
  
  // 2. Check for explicit grants (medium priority)
  const grant = overrides.find(
    override => 
      override.resource === resource &&
      override.operation === operation && 
      override.granted === true &&
      (!override.expiresAt || new Date(override.expiresAt) > new Date())
  );
  if (grant) return true;
  
  // 3. Check role permissions (lowest priority)
  const rolePermissions = ROLE_PERMISSIONS[userRole]?.permissions || [];
  return rolePermissions.includes(permission);
};
```

### React Hook Implementation
```typescript
// /hooks/use-enhanced-permissions.ts
export const useEnhancedPermissions = (userId: string) => {
  const { data: effectivePermissions } = useQuery(GetUserEffectivePermissionsDocument, {
    variables: { userId },
  });
  
  const { data: overridesData } = useQuery(GetUserPermissionOverridesDocument, {
    variables: { userId },
  });
  
  const hasPermission = useCallback((permission: string) => {
    const user = effectivePermissions?.userById;
    const overrides = overridesData?.permissionOverrides || [];
    
    return checkUserPermission(user?.role, permission, overrides);
  }, [effectivePermissions, overridesData]);
  
  const getPermissionSource = useCallback((permission: string) => {
    const overrides = overridesData?.permissionOverrides || [];
    const [resource, operation] = permission.split(':');
    
    const override = overrides.find(
      o => o.resource === resource && o.operation === operation
    );
    
    if (override) {
      return override.granted ? 'granted' : 'restricted';
    }
    
    return 'role';
  }, [overridesData]);
  
  return {
    hasPermission,
    getPermissionSource,
    overrides: overridesData?.permissionOverrides || [],
    refetch: () => {
      // Refetch both queries
    }
  };
};
```

## React Component Implementation

### Permission Guard Component
```typescript
// /components/auth/permission-guard.tsx
interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const { hasPermission } = useAuthContext();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

// Usage examples:
<PermissionGuard permission="staff:write">
  <EditButton />
</PermissionGuard>

<PermissionGuard 
  permission="staff:delete" 
  fallback={<div>Access denied</div>}
>
  <DeleteButton />
</PermissionGuard>
```

### Permission Management Component
```typescript
// Usage in staff details page
const PermissionManagementSection = ({ userId }: { userId: string }) => {
  const { hasPermission } = useAuthContext();
  const [grantPermission] = useMutation(GrantUserPermissionDocument);
  const [restrictPermission] = useMutation(RestrictUserPermissionDocument);
  
  const handlePermissionChange = async (
    action: 'grant' | 'restrict',
    permission: string,
    reason: string,
    expiresAt?: string
  ) => {
    const [resource, operation] = permission.split(':');
    const variables = {
      userId,
      resource,
      operation,
      reason,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    };
    
    try {
      if (action === 'grant') {
        await grantPermission({ variables });
      } else {
        await restrictPermission({ variables });
      }
      toast.success(`Permission ${action}ed successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} permission: ${error.message}`);
    }
  };
  
  if (!hasPermission('staff:write')) {
    return <div>You don't have permission to manage user permissions</div>;
  }
  
  return (
    <div>
      {/* Permission management UI */}
    </div>
  );
};
```

## Testing

### Unit Tests
```typescript
// Permission logic tests
describe('Permission System', () => {
  test('role-based permissions work correctly', () => {
    const permissions = getUserPermissions('manager', []);
    expect(permissions).toContain('staff:read');
    expect(permissions).toContain('payroll:read');
    expect(permissions).not.toContain('admin:manage');
  });
  
  test('explicit grants override role permissions', () => {
    const overrides = [{
      resource: 'admin',
      operation: 'manage',
      granted: true,
      expiresAt: null,
    }];
    
    const hasPermission = checkUserPermission('manager', 'admin:manage', overrides);
    expect(hasPermission).toBe(true);
  });
  
  test('explicit restrictions override role permissions', () => {
    const overrides = [{
      resource: 'staff',
      operation: 'read',
      granted: false,
      expiresAt: null,
    }];
    
    const hasPermission = checkUserPermission('manager', 'staff:read', overrides);
    expect(hasPermission).toBe(false);
  });
  
  test('expired overrides are ignored', () => {
    const overrides = [{
      resource: 'admin',
      operation: 'manage',
      granted: true,
      expiresAt: new Date('2023-01-01').toISOString(), // Past date
    }];
    
    const hasPermission = checkUserPermission('manager', 'admin:manage', overrides);
    expect(hasPermission).toBe(false);
  });
});
```

### Integration Tests
```typescript
// GraphQL integration tests
describe('Permission GraphQL Operations', () => {
  test('can grant user permission', async () => {
    const result = await client.mutate({
      mutation: GrantUserPermissionDocument,
      variables: {
        userId: 'test-user-id',
        resource: 'admin',
        operation: 'manage',
        reason: 'Temporary admin access for project',
        expiresAt: new Date('2024-12-31').toISOString(),
      },
    });
    
    expect(result.data?.insertPermissionOverride).toBeDefined();
    expect(result.data?.insertPermissionOverride.granted).toBe(true);
  });
  
  test('can retrieve user permissions', async () => {
    const result = await client.query({
      query: GetUserEffectivePermissionsDocument,
      variables: { userId: 'test-user-id' },
    });
    
    expect(result.data?.userRoles).toBeDefined();
    expect(result.data?.permissionOverrides).toBeDefined();
  });
});
```

## Performance Considerations

### Caching Strategy
```typescript
// Apollo Client cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        permissionOverrides: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    Query: {
      fields: {
        permissionOverrides: {
          keyArgs: ['where'],
        },
      },
    },
  },
});
```

### Database Optimization
```sql
-- Materialized view for complex permission calculations
CREATE MATERIALIZED VIEW user_effective_permissions AS
SELECT 
  u.id as user_id,
  p.resource_name,
  p.action,
  CASE 
    WHEN po_restrict.granted = false THEN false
    WHEN po_grant.granted = true THEN true
    WHEN rp.permission_id IS NOT NULL THEN true
    ELSE false
  END as has_permission
FROM users u
CROSS JOIN (
  SELECT r.name as resource_name, p.action
  FROM resources r
  JOIN permissions p ON r.id = p.resource_id
) p
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN role_permissions rp ON ur.role_id = rp.role_id
LEFT JOIN permissions perm ON rp.permission_id = perm.id AND p.resource_name = r.name AND p.action = perm.action
LEFT JOIN permission_overrides po_grant ON u.id = po_grant.user_id 
  AND p.resource_name = po_grant.resource 
  AND p.action = po_grant.operation
  AND po_grant.granted = true
  AND (po_grant.expires_at IS NULL OR po_grant.expires_at > NOW())
LEFT JOIN permission_overrides po_restrict ON u.id = po_restrict.user_id 
  AND p.resource_name = po_restrict.resource 
  AND p.action = po_restrict.operation
  AND po_restrict.granted = false
  AND (po_restrict.expires_at IS NULL OR po_restrict.expires_at > NOW());

-- Refresh materialized view on permission changes
CREATE OR REPLACE FUNCTION refresh_user_permissions()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_effective_permissions;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_permissions_on_override_change
  AFTER INSERT OR UPDATE OR DELETE ON permission_overrides
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_user_permissions();
```

## Security Best Practices

### 1. Input Validation
```typescript
// Validate permission format
const validatePermission = (permission: string): boolean => {
  const pattern = /^[a-z_]+:[a-z_]+$/;
  return pattern.test(permission) && ALL_PERMISSIONS.includes(permission);
};

// Validate user roles
const validateRole = (role: string): boolean => {
  return Object.keys(ROLE_HIERARCHY).includes(role);
};
```

### 2. Audit Logging
```typescript
// Log all permission changes
const logPermissionChange = async (
  action: 'grant' | 'restrict' | 'remove',
  targetUserId: string,
  permission: string,
  reason: string,
  performedBy: string
) => {
  await auditLog.create({
    action: `permission_${action}`,
    targetUserId,
    targetResource: permission,
    reason,
    performedBy,
    timestamp: new Date(),
    metadata: {
      permission,
      action,
    },
  });
};
```

### 3. Rate Limiting
```typescript
// Prevent abuse of permission changes
const permissionChangeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 permission changes per window
  message: 'Too many permission changes, please try again later',
  keyGenerator: (req) => req.user.id,
});
```

## Migration Guide

### From Legacy Permission System
```typescript
// Migration script for legacy permissions
const migrateLegacyPermissions = async () => {
  const legacyUsers = await db.query(`
    SELECT id, role, permissions_json 
    FROM users_legacy 
    WHERE permissions_json IS NOT NULL
  `);
  
  for (const user of legacyUsers) {
    const legacyPermissions = JSON.parse(user.permissions_json);
    
    // Convert to new permission format
    for (const [resource, actions] of Object.entries(legacyPermissions)) {
      for (const action of actions) {
        const newPermission = `${resource}:${action}`;
        
        if (ALL_PERMISSIONS.includes(newPermission)) {
          // Check if this permission is beyond user's role
          const rolePermissions = ROLE_PERMISSIONS[user.role]?.permissions || [];
          
          if (!rolePermissions.includes(newPermission)) {
            // Create override for additional permission
            await grantUserPermission({
              userId: user.id,
              resource,
              operation: action,
              reason: 'Legacy permission migration',
              expiresAt: null,
            });
          }
        }
      }
    }
  }
};
```

## Deployment Checklist

### Database Setup
- [ ] Run permission system migrations
- [ ] Create performance indexes
- [ ] Set up materialized views
- [ ] Configure audit logging tables

### Application Setup
- [ ] Update GraphQL schema
- [ ] Deploy permission components
- [ ] Configure caching policies
- [ ] Set up rate limiting

### Testing
- [ ] Run permission system tests
- [ ] Verify role hierarchy works
- [ ] Test override functionality
- [ ] Check audit logging

### Monitoring
- [ ] Set up permission change alerts
- [ ] Monitor database performance
- [ ] Track permission usage metrics
- [ ] Verify audit log integrity

This comprehensive technical reference provides all the information needed to understand, maintain, and extend the permission system implementation.
# Hierarchical Permission System Extension Guide

## Overview

This guide provides comprehensive instructions for extending and customizing the hierarchical permission system in Payroll ByteMy. The system implements advanced role-based access control with inheritance and smart exclusions, reducing JWT size by 71% while maintaining 128 granular permissions.

## 🎯 Hierarchical Permission Architecture

### Role Hierarchy with Inheritance
```typescript
// lib/permissions/hierarchical-permissions.ts
export type UserRole = "developer" | "org_admin" | "manager" | "consultant" | "viewer";

const ROLE_HIERARCHY: UserRole[] = ["developer", "org_admin", "manager", "consultant", "viewer"];

// Higher roles inherit ALL permissions from lower roles
// Exclusions are used to restrict specific permissions
```

### Smart Permission Format (128 Total)
```typescript
// All permissions follow "resource.action" format
export type Permission = 
  // Dashboard Operations (4 permissions)
  | 'dashboard.read' | 'dashboard.create' | 'dashboard.update' | 'dashboard.delete'
  
  // Client Management (5 permissions)
  | 'clients.read' | 'clients.create' | 'clients.update' | 'clients.delete' | 'clients.manage'
  
  // Payroll Operations (5 permissions)
  | 'payrolls.read' | 'payrolls.create' | 'payrolls.update' | 'payrolls.delete' | 'payrolls.manage'
  
  // Staff Management (5 permissions)
  | 'staff.read' | 'staff.create' | 'staff.update' | 'staff.delete' | 'staff.manage'
  
  // Security & Developer (10 permissions)
  | 'security.read' | 'security.create' | 'security.update' | 'security.delete' | 'security.manage'
  | 'developer.read' | 'developer.create' | 'developer.update' | 'developer.delete' | 'developer.manage'
  
  // ... 16 total resources with 128 total permissions
```

### JWT Optimization Structure
```typescript
// Instead of storing 128 permissions, store smart exclusions
interface HierarchicalJWT {
  "x-hasura-user-id": string;
  "x-hasura-default-role": UserRole;
  "x-hasura-allowed-roles": UserRole[];
  "x-hasura-excluded-permissions": string[];  // 🎯 Small exclusion list!
  "x-hasura-permission-hash": string;
  "x-hasura-permission-version": string;
}
```

## 🔧 Adding New Permissions

### Step 1: Define New Permission

```typescript
// lib/auth/permissions.ts
export type Permission = 
  // ... existing permissions
  | 'custom:new_feature:read'
  | 'custom:new_feature:write'
  | 'custom:new_feature:manage'
  | 'billing:invoice:approve'    // Example: billing permissions
  | 'reporting:advanced:access'; // Example: reporting permissions
```

### Step 2: Add to Permission Categories

```typescript
// lib/auth/permissions.ts
export const PERMISSION_CATEGORIES = {
  // ... existing categories
  BILLING: 'billing',
  REPORTING: 'reporting',
  CUSTOM: 'custom',
} as const;
```

### Step 3: Update Role Permissions

```typescript
// lib/auth/permissions.ts
export const ROLE_PERMISSIONS: RolePermissions = {
  developer: {
    level: 5,
    permissions: [
      // ... all existing permissions
      'custom:new_feature:read',
      'custom:new_feature:write', 
      'custom:new_feature:manage',
      'billing:invoice:approve',
      'reporting:advanced:access',
    ] as Permission[],
  },
  
  manager: {
    level: 3,
    permissions: [
      // ... existing manager permissions
      'custom:new_feature:read',
      'billing:invoice:approve',  // Managers can approve invoices
    ] as Permission[],
  },
  
  consultant: {
    level: 2,
    permissions: [
      // ... existing consultant permissions
      'custom:new_feature:read',  // Read-only access
    ] as Permission[],
  },
};
```

### Step 4: Implement Permission Checks

```typescript
// hooks/use-enhanced-permissions.tsx
export function useEnhancedPermissions() {
  // ... existing implementation
  
  const hasNewFeatureAccess = useCallback((action: 'read' | 'write' | 'manage') => {
    return hasPermission(`custom:new_feature:${action}` as Permission);
  }, [hasPermission]);
  
  const canApproveBilling = useCallback(() => {
    return hasPermission('billing:invoice:approve');
  }, [hasPermission]);
  
  return {
    // ... existing returns
    hasNewFeatureAccess,
    canApproveBilling,
  };
}
```

## 🏗️ Adding New Roles

### Step 1: Define New Role Type

```typescript
// lib/auth/permissions.ts
export type Role =
  | 'developer'
  | 'org_admin'
  | 'manager'
  | 'consultant'
  | 'viewer'
  | 'billing_admin'    // New role: billing specialist
  | 'report_analyst'   // New role: reporting specialist
  | 'client_manager';  // New role: client-focused manager
```

### Step 2: Add to Role Hierarchy

```typescript
// lib/auth/permissions.ts
export const ROLE_HIERARCHY: Record<Role, number> = {
  developer: 5,
  org_admin: 4,
  billing_admin: 3,    // Same level as manager
  client_manager: 3,   // Same level as manager
  manager: 3,
  report_analyst: 2,   // Between manager and consultant
  consultant: 2,
  viewer: 1,
};
```

### Step 3: Configure Role Permissions

```typescript
// lib/auth/permissions.ts
export const ROLE_PERMISSIONS: RolePermissions = {
  // ... existing roles
  
  billing_admin: {
    level: 3,
    permissions: [
      // Core access
      'payroll:read',
      'client:read',
      'user:read',
      
      // Billing-specific permissions
      'billing:invoice:read',
      'billing:invoice:write',
      'billing:invoice:approve',
      'billing:report:export',
      
      // Limited payroll access
      'payroll:export',
    ] as Permission[],
  },
  
  client_manager: {
    level: 3,
    permissions: [
      // Full client management
      'client:read',
      'client:write',
      'client:manage',
      
      // Related payroll access
      'payroll:read',
      'payroll:write',
      
      // User management for clients
      'user:read',
      'user:write',
    ] as Permission[],
  },
  
  report_analyst: {
    level: 2,
    permissions: [
      // Read access to most data
      'payroll:read',
      'client:read',
      'user:read',
      'audit:read',
      
      // Advanced reporting
      'reporting:advanced:access',
      'reporting:export:all',
      
      // Audit capabilities
      'audit:export',
    ] as Permission[],
  },
};
```

### Step 4: Update JWT Template

```json
{
  "https://hasura.io/jwt/claims": {
    "metadata": "{{user.public_metadata}}",
    "x-hasura-role": "{{user.public_metadata.role}}",
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": [
      "developer",
      "org_admin",
      "billing_admin",
      "client_manager", 
      "manager",
      "report_analyst",
      "consultant",
      "viewer"
    ],
    "x-hasura-clerk-user-id": "{{user.id}}"
  }
}
```

### Step 5: Update Hasura Permissions

```yaml
# hasura/metadata/databases/default/tables/public_billing_invoices.yaml
select_permissions:
  - role: billing_admin
    permission:
      columns: ['*']  # Full access to billing data
      filter: {}      # No restrictions
      
  - role: client_manager
    permission:
      columns: ['id', 'client_id', 'total_amount', 'status', 'created_at']
      filter:
        client:
          manager_id: { _eq: "X-Hasura-User-Id" }
```

## 🎨 Custom Permission Patterns

### Conditional Permissions

```typescript
// lib/auth/custom-permissions.ts
export function getConditionalPermissions(user: any): Permission[] {
  const basePermissions = ROLE_PERMISSIONS[user.role]?.permissions || [];
  const additionalPermissions: Permission[] = [];
  
  // Time-based permissions
  if (isBusinessHours()) {
    additionalPermissions.push('payroll:process');
  }
  
  // Department-based permissions
  if (user.department === 'finance') {
    additionalPermissions.push('billing:advanced:access');
  }
  
  // Experience-based permissions
  if (user.experience_level === 'senior') {
    additionalPermissions.push('payroll:approve');
  }
  
  return [...basePermissions, ...additionalPermissions];
}
```

### Permission Inheritance

```typescript
// lib/auth/permission-inheritance.ts
export function getInheritedPermissions(role: Role): Permission[] {
  const currentLevel = ROLE_HIERARCHY[role];
  const inheritedPermissions: Permission[] = [];
  
  // Inherit from lower-level roles
  Object.entries(ROLE_HIERARCHY).forEach(([inheritRole, level]) => {
    if (level < currentLevel) {
      const rolePermissions = ROLE_PERMISSIONS[inheritRole as Role]?.permissions || [];
      inheritedPermissions.push(...rolePermissions);
    }
  });
  
  // Add current role permissions
  const currentPermissions = ROLE_PERMISSIONS[role]?.permissions || [];
  
  // Remove duplicates and return
  return Array.from(new Set([...inheritedPermissions, ...currentPermissions]));
}
```

### Resource-Specific Permissions

```typescript
// lib/auth/resource-permissions.ts
export function hasResourcePermission(
  user: any,
  resource: 'client' | 'payroll' | 'user',
  resourceId: string,
  action: 'read' | 'write' | 'delete'
): boolean {
  // Check base permission
  if (!hasPermission(`${resource}:${action}` as Permission)) {
    return false;
  }
  
  // Resource-specific checks
  switch (resource) {
    case 'client':
      return canAccessClient(user, resourceId);
    case 'payroll':
      return canAccessPayroll(user, resourceId);
    case 'user':
      return canAccessUser(user, resourceId, action);
    default:
      return false;
  }
}

function canAccessClient(user: any, clientId: string): boolean {
  // Managers can access their assigned clients
  if (user.role === 'manager') {
    return user.managed_client_ids?.includes(clientId);
  }
  
  // Org admins and developers have full access
  return ['org_admin', 'developer'].includes(user.role);
}
```

## 🔒 Hasura Permission Extensions

### Dynamic Row-Level Security

```yaml
# hasura/metadata/databases/default/tables/public_payrolls.yaml
select_permissions:
  - role: client_manager
    permission:
      columns: ['*']
      filter:
        _or:
          # Direct client management
          - client:
              manager_id: { _eq: "X-Hasura-User-Id" }
          # Team-based access
          - client:
              team_members:
                user_id: { _eq: "X-Hasura-User-Id" }
          # Department-based access  
          - _exists:
              _table: user_department_access
              _where:
                _and:
                  - user_id: { _eq: "X-Hasura-User-Id" }
                  - department: { _eq: "X-Hasura-Department" }
                  - resource_type: { _eq: "payroll" }
```

### Computed Field Permissions

```sql
-- Add computed field for permission checking
CREATE OR REPLACE FUNCTION user_can_access_payroll(
    payroll_row payrolls,
    hasura_session json
)
RETURNS boolean AS $$
BEGIN
    -- Extract user info from session
    DECLARE
        user_id uuid := (hasura_session ->> 'x-hasura-user-id')::uuid;
        user_role text := hasura_session ->> 'x-hasura-role';
    BEGIN
        -- Custom permission logic
        IF user_role = 'developer' THEN
            RETURN true;
        END IF;
        
        IF user_role = 'manager' THEN
            -- Check if user manages this payroll's client
            RETURN EXISTS (
                SELECT 1 FROM clients 
                WHERE id = payroll_row.client_id 
                AND manager_id = user_id
            );
        END IF;
        
        RETURN false;
    END;
END;
$$ LANGUAGE plpgsql;
```

## 🧪 Testing Permission Extensions

### Unit Tests

```typescript
// tests/permissions.test.ts
import { hasPermission, ROLE_PERMISSIONS } from '../lib/auth/permissions';
import { createMockUser } from './utils/test-helpers';

describe('Permission System Extensions', () => {
  describe('New Roles', () => {
    it('billing_admin should have billing permissions', () => {
      const user = createMockUser({ role: 'billing_admin' });
      
      expect(hasPermission(user, 'billing:invoice:read')).toBe(true);
      expect(hasPermission(user, 'billing:invoice:approve')).toBe(true);
      expect(hasPermission(user, 'payroll:delete')).toBe(false);
    });
    
    it('client_manager should manage clients but not users', () => {
      const user = createMockUser({ role: 'client_manager' });
      
      expect(hasPermission(user, 'client:manage')).toBe(true);
      expect(hasPermission(user, 'user:delete')).toBe(false);
    });
  });
  
  describe('Custom Permissions', () => {
    it('should grant conditional permissions based on context', () => {
      const user = createMockUser({ 
        role: 'manager',
        department: 'finance',
        experience_level: 'senior'
      });
      
      const permissions = getConditionalPermissions(user);
      
      expect(permissions).toContain('billing:advanced:access');
      expect(permissions).toContain('payroll:approve');
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/hasura-permissions.test.ts
import { createTestClient } from '../utils/graphql-test-client';

describe('Hasura Permission Integration', () => {
  it('should enforce role-based data access', async () => {
    const managerClient = createTestClient('manager');  
    const consultantClient = createTestClient('consultant');
    
    const PAYROLL_QUERY = `
      query GetPayrolls {
        payrolls {
          id
          name
          status
          client { name }
        }
      }
    `;
    
    // Manager should see managed payrolls
    const managerResult = await managerClient.query({ query: PAYROLL_QUERY });
    expect(managerResult.data.payrolls.length).toBeGreaterThan(0);
    
    // Consultant should see limited payrolls
    const consultantResult = await consultantClient.query({ query: PAYROLL_QUERY });
    expect(consultantResult.data.payrolls.length).toBeLessThanOrEqual(
      managerResult.data.payrolls.length
    );
  });
});
```

## 🚨 Common Issues & Solutions

### Issue 1: Permission Not Working

**Problem**: New permission not being enforced

**Solution**: Check all integration points
1. Permission defined in type system
2. Added to role configuration
3. Component using permission check
4. Hasura metadata updated

```typescript
// Debug permission system
export function debugPermissions(user: any, permission: Permission) {
  console.log('User role:', user.role);
  console.log('Role permissions:', ROLE_PERMISSIONS[user.role]?.permissions);
  console.log('Has permission:', hasPermission(user, permission));
  console.log('Permission hierarchy:', ROLE_HIERARCHY[user.role]);
}
```

### Issue 2: Role Hierarchy Not Working

**Problem**: Higher-level roles not inheriting lower-level permissions

**Solution**: Implement proper inheritance

```typescript
// Ensure proper inheritance
export function getRolePermissions(role: Role): Permission[] {
  const directPermissions = ROLE_PERMISSIONS[role]?.permissions || [];
  const inheritedPermissions = getInheritedPermissions(role);
  
  return Array.from(new Set([...inheritedPermissions, ...directPermissions]));
}
```

### Issue 3: Hasura Permissions Not Syncing

**Problem**: Frontend permissions work but Hasura blocks queries

**Solution**: Ensure consistent permission definitions

```bash
# Verify Hasura metadata
cd hasura
hasura metadata export
# Check role definitions match frontend

# Apply consistent permissions
hasura metadata apply
```

## 🎯 Best Practices

### 1. Permission Naming Convention

```typescript
// Use consistent naming pattern
'domain:resource:action'

// Examples:
'payroll:schedule:read'
'client:contact:write'  
'user:profile:manage'
'billing:invoice:approve'
```

### 2. Granular vs Broad Permissions

```typescript
// Prefer granular permissions
'payroll:read'      // ✅ Specific
'payroll:manage'    // ❌ Too broad

// Use specific actions
'client:contact:create'
'client:contact:update'
'client:contact:delete'
```

### 3. Role Design Principles

- **Single Responsibility**: Each role has a clear purpose
- **Minimum Privilege**: Start with least permissions needed
- **Clear Hierarchy**: Roles have logical progression
- **Business Alignment**: Roles match organizational structure

### 4. Testing Strategy

- Unit test all permission functions
- Integration test with real GraphQL queries
- Test edge cases and error conditions
- Verify security boundaries are enforced

## 📚 Related Documentation

- [JWT Template Customization Guide](./JWT_TEMPLATE_CUSTOMIZATION_GUIDE.md)
- [Authentication System Documentation](./AUTHENTICATION_SYSTEM_DOCUMENTATION.md)
- [Hasura Permission Configuration](./hasura/README.md)
- [Security Implementation Report](./SECURITY_IMPROVEMENT_REPORT.md)

## 🎯 Next Steps

After extending the permission system:

1. **Update Documentation**: Document all new permissions and roles
2. **Test Thoroughly**: Verify all permission combinations work correctly
3. **Monitor Usage**: Track permission usage and adjust as needed
4. **Train Users**: Educate users on new roles and capabilities
5. **Audit Regularly**: Review permissions for security and compliance

---

This guide provides a comprehensive approach to extending the permission system. Always test changes thoroughly in development before applying to production.
# JWT Template Customization Guide

## Overview

This guide provides step-by-step instructions for customizing JWT templates in Clerk to work with Hasura GraphQL and extend the permission system for your specific needs.

## 🎯 Current JWT Template Configuration

The system uses a custom JWT template configured in Clerk Dashboard specifically for Hasura integration:

### Default Template Structure
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
      "manager",
      "consultant",
      "viewer"
    ],
    "x-hasura-clerk-user-id": "{{user.id}}"
  }
}
```

## 🔧 Customization Scenarios

### 1. Adding New Roles

**Step 1: Update Role Types**
```typescript
// lib/auth/permissions.ts
export type Role =
  | "developer"
  | "org_admin"
  | "manager"
  | "consultant"
  | "viewer"
  | "custom_role"    // Add your new role
  | "another_role";  // Add another role
```

**Step 2: Update Role Hierarchy**
```typescript
// lib/auth/permissions.ts
export const ROLE_HIERARCHY: Record<Role, number> = {
  developer: 5,
  org_admin: 4,
  custom_role: 3,      // Position in hierarchy
  manager: 3,
  another_role: 2,     // Position in hierarchy
  consultant: 2,
  viewer: 1,
};
```

**Step 3: Update JWT Template in Clerk**
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
      "custom_role",      // Add new role
      "manager",
      "another_role",     // Add new role
      "consultant",
      "viewer"
    ],
    "x-hasura-clerk-user-id": "{{user.id}}"
  }
}
```

**Step 4: Configure Role Permissions**
```typescript
// lib/auth/permissions.ts
export const ROLE_PERMISSIONS: RolePermissions = {
  // ... existing roles
  custom_role: {
    level: 3,
    permissions: [
      "custom:payroll:read",
      "custom:client:read",
      "custom:custom_permission:write",  // Custom permissions
    ] as CustomPermission[],
  },
  another_role: {
    level: 2,
    permissions: [
      "custom:payroll:read",
      "custom:specific:action",         // Role-specific permissions
    ] as CustomPermission[],
  },
};
```

### 2. Adding Custom Claims

**Step 1: Extend UserMetadata Interface**
```typescript
// lib/auth/permissions.ts
export interface UserMetadata {
  role: Role;
  permissions: CustomPermission[];
  databaseId?: string;
  
  // Add custom fields
  department?: string;
  location?: string;
  customAttributes?: {
    clientAccess?: string[];
    specialPermissions?: string[];
    expiryDate?: string;
  };
}
```

**Step 2: Update JWT Template with Custom Claims**
```json
{
  "https://hasura.io/jwt/claims": {
    "metadata": "{{user.public_metadata}}",
    "x-hasura-role": "{{user.public_metadata.role}}",
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": ["developer", "org_admin", "manager", "consultant", "viewer"],
    "x-hasura-clerk-user-id": "{{user.id}}",
    
    // Custom claims
    "x-hasura-department": "{{user.public_metadata.department}}",
    "x-hasura-location": "{{user.public_metadata.location}}",
    "x-hasura-client-access": "{{user.public_metadata.customAttributes.clientAccess}}",
    "x-hasura-expiry": "{{user.public_metadata.customAttributes.expiryDate}}"
  }
}
```

**Step 3: Use Custom Claims in Hasura Permissions**
```yaml
# hasura/metadata/databases/default/tables/public_clients.yaml
select_permissions:
  - role: manager
    permission:
      columns: ['id', 'name', 'status']
      filter:
        _or:
          - manager_id: { _eq: "X-Hasura-User-Id" }
          - id: { _in: "X-Hasura-Client-Access" }  # Use custom claim
```

### 3. Multi-Tenant Configuration

**Step 1: Add Tenant Information to JWT**
```json
{
  "https://hasura.io/jwt/claims": {
    "metadata": "{{user.public_metadata}}",
    "x-hasura-role": "{{user.public_metadata.role}}",
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": ["developer", "org_admin", "manager", "consultant", "viewer"],
    "x-hasura-clerk-user-id": "{{user.id}}",
    
    // Multi-tenant claims
    "x-hasura-tenant-id": "{{user.public_metadata.tenantId}}",
    "x-hasura-org-id": "{{user.public_metadata.organizationId}}"
  }
}
```

**Step 2: Update Permission Filters for Multi-Tenancy**
```yaml
# hasura/metadata/databases/default/tables/public_payrolls.yaml
select_permissions:
  - role: manager
    permission:
      columns: ['*']
      filter:
        _and:
          - tenant_id: { _eq: "X-Hasura-Tenant-Id" }
          - manager_id: { _eq: "X-Hasura-User-Id" }
```

## 🔐 Security Considerations

### 1. Claim Validation
```typescript
// lib/auth/jwt-validation.ts
export function validateCustomClaims(claims: any): boolean {
  // Validate expiry date
  if (claims['x-hasura-expiry']) {
    const expiryDate = new Date(claims['x-hasura-expiry']);
    if (expiryDate < new Date()) {
      return false; // Token expired
    }
  }
  
  // Validate tenant access
  if (claims['x-hasura-tenant-id']) {
    const allowedTenants = getAllowedTenants();
    if (!allowedTenants.includes(claims['x-hasura-tenant-id'])) {
      return false; // Invalid tenant
    }
  }
  
  return true;
}
```

### 2. Hasura Permission Validation
```yaml
# hasura/metadata/databases/default/tables/public_sensitive_data.yaml
select_permissions:
  - role: manager
    permission:
      columns: ['id', 'non_sensitive_field']
      filter:
        _and:
          - manager_id: { _eq: "X-Hasura-User-Id" }
          - tenant_id: { _eq: "X-Hasura-Tenant-Id" }
          # Additional validation for sensitive data
          - _exists:
              _table: user_permissions
              _where:
                _and:
                  - user_id: { _eq: "X-Hasura-User-Id" }
                  - permission: { _eq: "access_sensitive_data" }
                  - expires_at: { _gt: "now()" }
```

## 🛠️ Implementation Steps

### Step 1: Configure Clerk JWT Template

1. **Access Clerk Dashboard**
   - Go to your Clerk Dashboard
   - Navigate to "JWT Templates"
   - Select your Hasura template or create new one

2. **Update Template**
   ```json
   {
     "https://hasura.io/jwt/claims": {
       // Your custom template here
     }
   }
   ```

3. **Save and Test**
   - Save the template
   - Test with a user login
   - Verify claims in browser dev tools

### Step 2: Update TypeScript Types

```typescript
// types/auth.ts
export interface CustomJWTClaims {
  'https://hasura.io/jwt/claims': {
    metadata: UserMetadata;
    'x-hasura-role': Role;
    'x-hasura-user-id': string;
    'x-hasura-default-role': string;
    'x-hasura-allowed-roles': Role[];
    'x-hasura-clerk-user-id': string;
    
    // Add your custom claims
    'x-hasura-department'?: string;
    'x-hasura-tenant-id'?: string;
    'x-hasura-expiry'?: string;
  };
}
```

### Step 3: Update Permission System

```typescript
// hooks/use-enhanced-permissions.tsx
export function useEnhancedPermissions() {
  // ... existing code
  
  // Add custom claim checks
  const customClaims = useMemo(() => {
    if (!user) return {};
    
    return {
      department: user.publicMetadata?.department,
      tenantId: user.publicMetadata?.tenantId,
      hasExpiry: !!user.publicMetadata?.customAttributes?.expiryDate,
      isExpired: user.publicMetadata?.customAttributes?.expiryDate 
        ? new Date(user.publicMetadata.customAttributes.expiryDate) < new Date()
        : false,
    };
  }, [user]);
  
  return {
    // ... existing returns
    customClaims,
  };
}
```

### Step 4: Update Hasura Metadata

1. **Update Table Permissions**
   ```bash
   # Apply updated metadata
   cd hasura
   hasura metadata apply
   ```

2. **Test Permissions**
   ```bash
   # Validate permissions work correctly
   hasura console
   # Test queries in GraphQL Explorer
   ```

## 🧪 Testing JWT Templates

### 1. Local Testing
```typescript
// tests/jwt-template.test.ts
import { verifyJWTClaims } from '../lib/auth/jwt-validation';

describe('JWT Template', () => {
  it('should include custom claims', () => {
    const mockToken = {
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': 'test-user',
        'x-hasura-role': 'manager',
        'x-hasura-department': 'finance',
        'x-hasura-tenant-id': 'tenant-123',
      }
    };
    
    expect(mockToken['https://hasura.io/jwt/claims']['x-hasura-department']).toBe('finance');
    expect(mockToken['https://hasura.io/jwt/claims']['x-hasura-tenant-id']).toBe('tenant-123');
  });
});
```

### 2. Integration Testing
```typescript
// tests/integration/auth.test.ts
import { createTestUser, loginUser } from '../utils/test-helpers';

describe('JWT Integration', () => {
  it('should create JWT with custom claims', async () => {
    const user = await createTestUser({
      role: 'manager',
      department: 'finance',
      tenantId: 'tenant-123',
    });
    
    const { token } = await loginUser(user);
    const claims = decodeJWT(token);
    
    expect(claims['x-hasura-department']).toBe('finance');
    expect(claims['x-hasura-tenant-id']).toBe('tenant-123');
  });
});
```

## 🚨 Common Issues & Solutions

### Issue 1: Claims Not Appearing in Token
**Solution**: Ensure the field exists in `user.publicMetadata` and JWT template syntax is correct.

```typescript
// Correct metadata structure
const metadata = {
  role: 'manager',
  department: 'finance',
  databaseId: 'uuid-here',
  customAttributes: {
    tenantId: 'tenant-123'
  }
};

// Correct JWT template syntax
"x-hasura-tenant-id": "{{user.public_metadata.customAttributes.tenantId}}"
```

### Issue 2: Hasura Permissions Not Working
**Solution**: Verify session variable names match JWT claims exactly.

```yaml
# JWT Claim: x-hasura-tenant-id
# Hasura Permission: X-Hasura-Tenant-Id (note capitalization)
filter:
  tenant_id: { _eq: "X-Hasura-Tenant-Id" }
```

### Issue 3: Role Hierarchy Not Working
**Solution**: Ensure role levels are correctly defined and JWT template includes all roles.

```typescript
// Verify role hierarchy
export const ROLE_HIERARCHY: Record<Role, number> = {
  developer: 5,    // Highest level
  org_admin: 4,
  manager: 3,
  consultant: 2,
  viewer: 1,       // Lowest level
};
```

## 📚 Additional Resources

- [Clerk JWT Templates Documentation](https://clerk.com/docs/backend-requests/making/jwt-templates)
- [Hasura JWT Authentication](https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt/)
- [Authentication System Documentation](./AUTHENTICATION_SYSTEM_DOCUMENTATION.md)
- [Permission System Guide](./PERMISSION_SYSTEM_GUIDE.md)

## 🎯 Next Steps

1. **Review Current Template**: Understand your current JWT configuration
2. **Plan Changes**: Define what custom claims or roles you need
3. **Test Locally**: Always test changes in development first
4. **Update Documentation**: Document your custom claims for your team
5. **Monitor**: Watch for authentication issues after deployment

---

This guide provides a comprehensive approach to customizing JWT templates. For specific use cases or advanced scenarios, refer to the additional resources or reach out for support.
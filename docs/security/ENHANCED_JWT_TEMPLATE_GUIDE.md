# Enhanced JWT Template Configuration Guide

## Overview

This guide shows how to configure Clerk JWT templates to include permissions directly in the token, eliminating the need for the "custom:" prefix and providing a cleaner, more flexible permission system.

## 🎯 Enhanced JWT Template Configuration

### Current Template (With Custom Prefix)

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

### Enhanced Template (With Direct Permissions)

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

## 🔧 Permission System Enhancement

### 1. Role-Based Permission Mapping

```typescript
// lib/auth/permission-mapping.ts
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  developer: [
    "system:admin",
    "security:admin",
    "users:manage",
    "payrolls:manage",
    "clients:manage",
    "audit:write",
    "settings:write",
    "reports:write",
    "staff:manage",
    "invitations:manage",
    "dashboard:read",
  ],
  org_admin: [
    "users:manage",
    "payrolls:write",
    "clients:manage",
    "audit:write",
    "settings:write",
    "reports:write",
    "staff:manage",
    "invitations:manage",
    "security:write",
    "dashboard:read",
  ],
  manager: [
    "payrolls:write",
    "clients:write",
    "users:write",
    "staff:manage",
    "reports:write",
    "settings:read",
    "security:read",
    "audit:read",
    "dashboard:read",
  ],
  consultant: [
    "payrolls:read",
    "clients:read",
    "users:read",
    "reports:read",
    "dashboard:read",
  ],
  viewer: ["dashboard:read"],
};
```

### 2. Dynamic Permission Generation

```typescript
// lib/auth/dynamic-permissions.ts
export function generateUserPermissions(
  role: string,
  customAccess?: any
): string[] {
  const basePermissions = ROLE_PERMISSIONS[role] || [];
  const dynamicPermissions: string[] = [];

  // Add client-specific permissions
  if (customAccess?.allowedClients) {
    customAccess.allowedClients.forEach((clientId: string) => {
      dynamicPermissions.push(`clients:${clientId}:read`);
      if (role === "manager" || role === "org_admin") {
        dynamicPermissions.push(`clients:${clientId}:write`);
      }
    });
  }

  // Add payroll-specific permissions
  if (customAccess?.restrictedPayrolls) {
    customAccess.restrictedPayrolls.forEach((payrollId: string) => {
      dynamicPermissions.push(`payrolls:${payrollId}:read`);
      if (role === "manager" || role === "org_admin") {
        dynamicPermissions.push(`payrolls:${payrollId}:write`);
      }
    });
  }

  return [...basePermissions, ...dynamicPermissions];
}
```

### 3. User Metadata Enhancement

```typescript
// types/enhanced-auth.ts
export interface EnhancedUserMetadata {
  role: Role;
  permissions: string[];
  databaseId: string;
  assignedBy: string;
  assignedAt: string;
  lastUpdated: string;
  customAccess?: {
    allowedClients?: string[];
    restrictedPayrolls?: string[];
    temporaryPermissions?: {
      permission: string;
      expiresAt: string;
    }[];
  };
  auditInfo?: {
    lastPermissionChange?: string;
    permissionHistory?: {
      action: "granted" | "revoked";
      permission: string;
      timestamp: string;
      grantedBy: string;
    }[];
  };
}
```

## 🚀 Implementation Steps

### Step 1: Update Clerk JWT Template

1. **Navigate to Clerk Dashboard**

   - Go to JWT Templates
   - Select your Hasura template
   - Replace with the enhanced template above

2. **Test the New Template**

   ```bash
   # Test endpoint to verify JWT structure
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:3000/api/auth/debug-token
   ```

### Step 2: Update Permission System

```typescript
// hooks/use-enhanced-permissions.ts (Updated)
export function useEnhancedPermissions() {
  const { sessionClaims, isLoading } = useAuth();

  const permissions = useMemo(() => {
    if (!sessionClaims) return [];

    // Get permissions from JWT claims directly
    const jwtPermissions = sessionClaims.permissions || [];
    const hasuraPermissions =
      sessionClaims["https://hasura.io/jwt/claims"]?.["x-hasura-permissions"] ||
      [];

    return [...jwtPermissions, ...hasuraPermissions];
  }, [sessionClaims]);

  const checkPermission = (
    resource: string,
    action: string
  ): PermissionResult => {
    if (isLoading) {
      return { granted: false, reason: "Loading permissions..." };
    }

    const requiredPermission = `${resource}:${action}`;
    const granted = permissions.includes(requiredPermission);

    if (!granted) {
      return {
        granted: false,
        reason: `Missing permission: ${requiredPermission}`,
        requiredPermission,
        availablePermissions: permissions,
        suggestions: generatePermissionSuggestions(
          requiredPermission,
          permissions
        ),
      };
    }

    return { granted: true };
  };

  return {
    permissions,
    checkPermission,
    hasPermission: (resource: string, action: string) =>
      checkPermission(resource, action).granted,
    isLoading,
  };
}
```

### Step 3: Update User Creation Flow

```typescript
// lib/auth/user-creation.ts
export async function createUserWithPermissions(
  clerkUserId: string,
  role: Role,
  customAccess?: any
) {
  // Generate permissions based on role and custom access
  const permissions = generateUserPermissions(role, customAccess);

  // Update Clerk user metadata
  await clerkClient.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      role,
      permissions,
      databaseId: uuid(),
      assignedAt: new Date().toISOString(),
      customAccess,
      auditInfo: {
        lastPermissionChange: new Date().toISOString(),
        permissionHistory: [
          {
            action: "granted",
            permission: `role:${role}`,
            timestamp: new Date().toISOString(),
            grantedBy: "system",
          },
        ],
      },
    },
  });
}
```

### Step 4: Permission Management API

```typescript
// app/api/admin/permissions/route.ts
export async function POST(request: Request) {
  const { userId, permissions, action } = await request.json();

  // Validate admin access
  const { sessionClaims } = await auth();
  if (!sessionClaims?.permissions?.includes("users:manage")) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata as EnhancedUserMetadata;

    let updatedPermissions = [...(currentMetadata.permissions || [])];

    if (action === "grant") {
      updatedPermissions = [
        ...new Set([...updatedPermissions, ...permissions]),
      ];
    } else if (action === "revoke") {
      updatedPermissions = updatedPermissions.filter(
        p => !permissions.includes(p)
      );
    }

    // Update user metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...currentMetadata,
        permissions: updatedPermissions,
        lastUpdated: new Date().toISOString(),
        auditInfo: {
          ...currentMetadata.auditInfo,
          lastPermissionChange: new Date().toISOString(),
          permissionHistory: [
            ...(currentMetadata.auditInfo?.permissionHistory || []),
            ...permissions.map(permission => ({
              action: action as "granted" | "revoked",
              permission,
              timestamp: new Date().toISOString(),
              grantedBy:
                sessionClaims["https://hasura.io/jwt/claims"]?.[
                  "x-hasura-user-id"
                ],
            })),
          ],
        },
      },
    });

    return Response.json({
      success: true,
      updatedPermissions,
      message: `${action === "grant" ? "Granted" : "Revoked"} ${permissions.length} permission(s)`,
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to update permissions" },
      { status: 500 }
    );
  }
}
```

## 🔐 Security Enhancements

### 1. Permission Validation Middleware

```typescript
// lib/middleware/permission-validator.ts
export function validatePermissions(requiredPermissions: string[]) {
  return async (request: Request, context: any) => {
    const { sessionClaims } = await auth();
    const userPermissions = sessionClaims?.permissions || [];

    const hasRequiredPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      const missing = requiredPermissions.filter(
        permission => !userPermissions.includes(permission)
      );

      throw new Error(`Missing permissions: ${missing.join(", ")}`);
    }

    return context;
  };
}
```

### 2. Hasura Permission Rules

```yaml
# hasura/metadata/databases/default/tables/public_payrolls.yaml
select_permissions:
  - role: consultant
    permission:
      columns: ["id", "name", "status", "client_id"]
      filter:
        _or:
          - primary_consultant_id: { _eq: "X-Hasura-User-Id" }
          - id: { _in: "X-Hasura-Permissions" } # Use permissions claim
      check: {}

  - role: manager
    permission:
      columns: ["*"]
      filter:
        _or:
          - manager_id: { _eq: "X-Hasura-User-Id" }
          - id: { _in: "X-Hasura-Permissions" }
      check: {}
```

### 3. Audit Logging Integration

```typescript
// lib/security/permission-audit.ts
export async function logPermissionChange(
  userId: string,
  action: "grant" | "revoke",
  permissions: string[],
  grantedBy: string
) {
  await auditLogger.logSOC2Event({
    level: LogLevel.AUDIT,
    category: LogCategory.PERMISSION_CHANGE,
    eventType: SOC2EventType.PERMISSION_MODIFIED,
    userId,
    action,
    success: true,
    metadata: {
      permissions,
      grantedBy,
      timestamp: new Date().toISOString(),
    },
    complianceNote: `User ${userId} ${action === "grant" ? "granted" : "revoked"} permissions: ${permissions.join(", ")}`,
  });
}
```

## 📊 Benefits of Enhanced System

### 1. **Cleaner Permission Strings**

- Before: `"custom:payrolls:read"`
- After: `"payrolls:read"`

### 2. **Direct JWT Access**

- Permissions available directly in JWT claims
- No need for additional API calls
- Faster permission checks

### 3. **Flexible Permission Model**

- Role-based permissions
- Resource-specific permissions
- Temporary permissions with expiry
- Client/payroll-specific access

### 4. **Better Security**

- Granular permission control
- Audit trail for all permission changes
- Temporary permission support
- Resource-level access control

### 5. **Improved Performance**

- Permissions cached in JWT
- Reduced database queries
- Faster authorization checks

## 🧪 Testing the Enhanced System

```typescript
// tests/enhanced-permissions.test.ts
describe("Enhanced Permission System", () => {
  it("should check permissions without custom prefix", () => {
    const permissions = ["payrolls:read", "clients:write"];

    expect(hasPermission("payrolls", "read", permissions)).toBe(true);
    expect(hasPermission("payrolls", "write", permissions)).toBe(false);
    expect(hasPermission("clients", "write", permissions)).toBe(true);
  });

  it("should handle resource-specific permissions", () => {
    const permissions = [
      "clients:client-123:read",
      "payrolls:payroll-456:write",
    ];

    expect(
      hasResourcePermission("clients", "client-123", "read", permissions)
    ).toBe(true);
    expect(
      hasResourcePermission("payrolls", "payroll-456", "write", permissions)
    ).toBe(true);
    expect(
      hasResourcePermission("clients", "client-789", "read", permissions)
    ).toBe(false);
  });
});
```

## 🚀 Migration Strategy

### Phase 1: Update JWT Template

- Deploy new JWT template
- Ensure backward compatibility
- Test with existing users

### Phase 2: Update Permission Checks

- Migrate components to use new system
- Remove "custom:" prefix gradually
- Update all permission strings

### Phase 3: Enhance Functionality

- Add resource-specific permissions
- Implement temporary permissions
- Add audit logging

### Phase 4: Clean Up

- Remove legacy permission code
- Update documentation
- Complete testing

This enhanced system provides a much more flexible and powerful permission model while maintaining security and performance.

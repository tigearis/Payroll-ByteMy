# API Authentication Patterns

## Overview

This document outlines the recommended patterns for implementing authentication and permission checking in API routes. These patterns ensure reliable role-based access control and consistent security across all endpoints.

## Table of Contents

- [Core Principles](#core-principles)
- [Session Data Structure](#session-data-structure)
- [Database Lookup Pattern](#database-lookup-pattern)
- [Permission Checking Strategies](#permission-checking-strategies)
- [Common Patterns](#common-patterns)
- [Role Assignment Query Patterns](#role-assignment-query-patterns)
- [Troubleshooting](#troubleshooting)

## Core Principles

### 1. Clerk User ID as Primary Key
- **Always use `session.userId`** (Clerk user ID) for database lookups
- **Never rely on JWT claims** for role determination in API routes
- **JWT tokens may be stale** - database is the source of truth
- **Direct database queries** ensure real-time permission checking

### 2. Single Query Pattern
- **Combine user lookup and role data** in one GraphQL query
- **Include roleAssignments** with role details for complete picture
- **Minimize database round trips** for better performance
- **Use `adminApolloClient`** for reliable admin-level access

### 3. Role Priority System
- **Lower priority number = higher role** (developer=1, viewer=5)
- **Calculate highest role** from multiple assignments
- **Fallback to `user.role`** if no role assignments exist
- **Support role hierarchy** for permission inheritance

### 4. Fallback and Error Handling
- **Always provide fallback** to `user.role` if no role assignments
- **Handle missing users gracefully** with clear error messages
- **Log role resolution process** for debugging
- **Include debug information** for development environments

## Session Data Structure

The `withAuth` middleware provides this session structure:

```typescript
interface AuthSession {
  userId: string;                    // ✅ RELIABLE: Clerk user ID
  email?: string;                    // ✅ RELIABLE: From Clerk
  
  // ❌ UNRELIABLE: May be stale or missing
  databaseId?: string;               // From JWT claims
  role?: string;                     // From JWT claims
  defaultRole?: string;              // From JWT claims
  allowedRoles?: string[];           // From JWT claims
  permissions?: string[];            // From JWT claims
}
```

### What to Use vs. Avoid

✅ **Always Use:**
- `session.userId` - Clerk user ID (always current)
- `session.email` - User email (always current)

❌ **Never Use for Permission Checks:**
- `session.role` - May be stale
- `session.defaultRole` - May be stale
- `session.allowedRoles` - May be stale
- `session.databaseId` - May be stale

## Database Lookup Pattern

### Recommended Approach

```typescript
export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    // ✅ Get user and role data in single query using Clerk ID
    const { data: userData } = await adminApolloClient.query({
      query: gql`
        query GetUserWithRoles($clerkUserId: String!) {
          users(where: { clerkUserId: { _eq: $clerkUserId } }) {
            id
            role
            firstName
            lastName
            email
            roleAssignments {
              role {
                name
                priority
                displayName
              }
            }
          }
        }
      `,
      variables: { clerkUserId: session.userId },
      fetchPolicy: "network-only",
    });

    const user = userData?.users?.[0];
    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // ✅ Determine highest priority role
    const roleAssignments = user.roleAssignments || [];
    const highestRole = roleAssignments.length > 0 
      ? roleAssignments.reduce((highest, current) => 
          current.role.priority < highest.role.priority ? current : highest
        ).role.name
      : user.role; // Fallback to user.role

    // ✅ Check permissions based on actual role
    const hasAccess = highestRole && ["developer", "org_admin"].includes(highestRole);
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: `Insufficient permissions. Current role: ${highestRole}` },
        { status: 403 }
      );
    }

    // Continue with API logic...
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
});
```

### Anti-Pattern (Avoid)

```typescript
// ❌ DON'T DO THIS - unreliable
export const GET = withAuth(async (request: NextRequest, session) => {
  const userRole = session.role || session.defaultRole || 'viewer';
  const hasAccess = ["developer", "org_admin"].includes(userRole);
  // This may use stale JWT data!
});
```

## Permission Checking Strategies

### 1. Role-Based Access Control

```typescript
// Basic role checking
const hasBasicAccess = ["developer", "org_admin", "manager"].includes(highestRole);

// Hierarchical checking (developer > org_admin > manager > consultant > viewer)
const roleHierarchy = {
  developer: 5,
  org_admin: 4,
  manager: 3,
  consultant: 2,
  viewer: 1
};

const hasManagerAccess = roleHierarchy[highestRole] >= roleHierarchy["manager"];
```

### 2. Resource-Specific Permissions

```typescript
// For resources that require specific database permissions
const permissionData = await getHierarchicalPermissionsFromDatabase(user.id);
const hasSpecificPermission = hasHierarchicalPermission(
  permissionData, 
  "reports.generate"
);
```

### 3. Contextual Access Control

```typescript
// Check if user can access specific resources based on assignments
const canAccessPayroll = highestRole === "developer" || 
  user.assignedPayrolls.some(p => p.id === payrollId);

const canManageUser = highestRole === "developer" || 
  (highestRole === "manager" && user.managerId === session.userId);
```

## Common Patterns

### Pattern 1: Simple Role Check

```typescript
// For APIs that need basic role-based access
const { data: userData } = await adminApolloClient.query({
  query: gql`
    query GetUserRole($clerkUserId: String!) {
      users(where: { clerkUserId: { _eq: $clerkUserId } }) {
        id
        role
        roleAssignments {
          role { name priority }
        }
      }
    }
  `,
  variables: { clerkUserId: session.userId }
});

const user = userData?.users?.[0];
const role = user?.roleAssignments?.[0]?.role?.name || user?.role || 'viewer';
```

### Pattern 2: Hierarchical Role Calculation

```typescript
// Calculate the highest priority role from multiple assignments
const roleAssignments = user.roleAssignments || [];
const highestRole = roleAssignments.length > 0 
  ? roleAssignments.reduce((highest, current) => 
      current.role.priority < highest.role.priority ? current : highest
    ).role.name
  : user.role; // Fallback to user.role

// Role hierarchy checking
const roleHierarchy = { developer: 1, org_admin: 2, manager: 3, consultant: 4, viewer: 5 };
const hasManagerLevel = roleHierarchy[highestRole] <= roleHierarchy["manager"];
```

### Pattern 3: Complex Permission Check

```typescript
// For APIs that need detailed permission checking
const permissionData = await getHierarchicalPermissionsFromDatabase(user.id);
const canPerformAction = hasHierarchicalPermission(permissionData, "resource.action");
```

### Pattern 4: Resource-Scoped Access

```typescript
// For APIs that check access to specific resources
const { data: resourceData } = await adminApolloClient.query({
  query: gql`
    query CheckResourceAccess($clerkUserId: String!, $resourceId: uuid!) {
      users(where: { clerkUserId: { _eq: $clerkUserId } }) {
        id
        role
        roleAssignments {
          role { name priority }
        }
        assignedResources(where: { resourceId: { _eq: $resourceId } }) {
          id
          accessLevel
        }
      }
    }
  `,
  variables: { clerkUserId: session.userId, resourceId }
});
```

### Pattern 5: Role Assignment Based Access

```typescript
// For payroll management where consultants access assigned payrolls
const { data: payrollAccess } = await adminApolloClient.query({
  query: gql`
    query CheckPayrollAccess($clerkUserId: String!, $payrollId: uuid!) {
      users(where: { clerkUserId: { _eq: $clerkUserId } }) {
        id
        role
        roleAssignments { role { name priority } }
        assignedPayrolls: payrolls(where: {
          _or: [
            { primaryConsultantUserId: { _eq: $userId } }
            { backupConsultantUserId: { _eq: $userId } }
          ]
          id: { _eq: $payrollId }
        }) {
          id
          name
        }
      }
    }
  `,
  variables: { clerkUserId: session.userId, payrollId }
});

const hasPayrollAccess = user.role === "developer" || 
  user.assignedPayrolls.length > 0;
```

## Role Assignment Query Patterns

### Understanding Role Assignments

The system supports multiple role assignments per user with priority-based hierarchy:

```sql
-- Database schema for role assignments
users ─┬─ id (uuid)
       ├─ role (text) -- Fallback role
       └─ roleAssignments ─┬─ roleId (uuid)
                           └─ role ─┬─ name (text)
                                    ├─ priority (integer) -- Lower = higher role
                                    └─ displayName (text)
```

### Basic Role Assignment Query

```typescript
// Standard pattern for getting user roles
const GET_USER_WITH_ROLES = gql`
  query GetUserWithRoles($clerkUserId: String!) {
    users(where: { clerkUserId: { _eq: $clerkUserId } }) {
      id
      role                    # Fallback role
      firstName
      lastName
      email
      roleAssignments {
        role {
          name              # Role name (developer, org_admin, etc.)
          priority          # Role priority (1=highest, 5=lowest)
          displayName       # Human-readable name
        }
      }
    }
  }
`;
```

### Role Priority Calculation

```typescript
// Calculate the highest priority role from assignments
function calculateHighestRole(user: any): string {
  const roleAssignments = user.roleAssignments || [];
  
  if (roleAssignments.length === 0) {
    return user.role || 'viewer'; // Fallback to user.role
  }
  
  // Find role with lowest priority number (highest actual priority)
  const highestRole = roleAssignments.reduce((highest, current) => {
    return current.role.priority < highest.role.priority ? current : highest;
  });
  
  return highestRole.role.name;
}

// Usage in API endpoints
const highestRole = calculateHighestRole(user);
const hasAdminAccess = ['developer', 'org_admin'].includes(highestRole);
```

### Role Hierarchy Patterns

```typescript
// Define role hierarchy for permission checking
const ROLE_HIERARCHY = {
  developer: 1,
  org_admin: 2, 
  manager: 3,
  consultant: 4,
  viewer: 5
} as const;

// Check if user has minimum required role level
function hasMinimumRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 999;
  const requiredLevel = ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY] || 999;
  return userLevel <= requiredLevel;
}

// Usage examples
const hasManagerLevel = hasMinimumRole(highestRole, 'manager');
const hasDeveloperLevel = hasMinimumRole(highestRole, 'developer');
```

### Multiple Role Assignment Scenarios

```typescript
// Example: User with multiple role assignments
const userRoleData = {
  role: 'viewer',  // Fallback role
  roleAssignments: [
    { role: { name: 'consultant', priority: 4 } },
    { role: { name: 'manager', priority: 3 } },    // This wins (lower priority)
    { role: { name: 'consultant', priority: 4 } }
  ]
};

const effectiveRole = calculateHighestRole(userRoleData);
// Result: 'manager' (priority 3 is highest)
```

### Context-Specific Role Queries

```typescript
// Get user roles with specific context (e.g., payroll assignments)
const GET_USER_WITH_PAYROLL_CONTEXT = gql`
  query GetUserWithPayrollContext($clerkUserId: String!, $payrollId: uuid!) {
    users(where: { clerkUserId: { _eq: $clerkUserId } }) {
      id
      role
      roleAssignments {
        role { name priority displayName }
      }
      # Check if user is assigned to specific payroll
      assignedAsConsultant: payrolls(where: { 
        id: { _eq: $payrollId }
        _or: [
          { primaryConsultantUserId: { _eq: $userId } }
          { backupConsultantUserId: { _eq: $userId } }
        ]
      }) {
        id
        name
      }
      # Check if user manages consultants on this payroll
      managedPayrolls: payrolls(where: {
        id: { _eq: $payrollId }
        _or: [
          { primaryConsultant: { managerId: { _eq: $userId } } }
          { backupConsultant: { managerId: { _eq: $userId } } }
        ]
      }) {
        id
        name
      }
    }
  }
`;

// Permission logic with context
const hasPayrollAccess = 
  highestRole === 'developer' ||
  highestRole === 'org_admin' ||
  user.assignedAsConsultant.length > 0 ||
  user.managedPayrolls.length > 0;
```

### Dynamic Role Assignment Updates

```typescript
// Real-time role checking - always query database
const checkCurrentRole = async (clerkUserId: string): Promise<string> => {
  const { data } = await adminApolloClient.query({
    query: GET_USER_WITH_ROLES,
    variables: { clerkUserId },
    fetchPolicy: "network-only", // Always get fresh data
  });
  
  const user = data?.users?.[0];
  if (!user) {
    throw new Error('User not found');
  }
  
  return calculateHighestRole(user);
};

// Use in APIs that need real-time role validation
export const POST = withAuth(async (request: NextRequest, session) => {
  const currentRole = await checkCurrentRole(session.userId);
  
  // Role may have changed since JWT was issued
  if (!['developer', 'org_admin'].includes(currentRole)) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }
  
  // Continue with API logic...
});
```

### Testing Role Assignment Patterns

```typescript
// Test utilities for role assignment scenarios
const createTestUser = (roleAssignments: Array<{name: string, priority: number}>) => ({
  id: 'test-user-id',
  role: 'viewer',
  roleAssignments: roleAssignments.map(r => ({
    role: { name: r.name, priority: r.priority }
  }))
});

// Test cases
const testCases = [
  {
    name: 'Single role assignment',
    user: createTestUser([{ name: 'manager', priority: 3 }]),
    expected: 'manager'
  },
  {
    name: 'Multiple assignments - highest priority wins',
    user: createTestUser([
      { name: 'consultant', priority: 4 },
      { name: 'manager', priority: 3 },
      { name: 'consultant', priority: 4 }
    ]),
    expected: 'manager'
  },
  {
    name: 'No assignments - fallback to user.role',
    user: { ...createTestUser([]), role: 'consultant' },
    expected: 'consultant'
  }
];

// Run tests
testCases.forEach(test => {
  const result = calculateHighestRole(test.user);
  console.assert(result === test.expected, 
    `${test.name}: expected ${test.expected}, got ${result}`);
});
```

## Error Handling

### Standard Error Responses

```typescript
// User not found
return NextResponse.json(
  { 
    error: "User not found in database",
    code: "USER_NOT_FOUND"
  },
  { status: 404 }
);

// Insufficient permissions
return NextResponse.json(
  { 
    error: `Insufficient permissions. Required: ${requiredRoles.join(', ')}. Current: ${actualRole}`,
    code: "INSUFFICIENT_PERMISSIONS",
    debug: {
      actualRole,
      requiredRoles,
      userId: user.id
    }
  },
  { status: 403 }
);

// Authentication failure
return NextResponse.json(
  { 
    error: "Authentication failed",
    code: "AUTH_FAILED"
  },
  { status: 401 }
);
```

### Debug Information

Include debug information in development:

```typescript
if (process.env.NODE_ENV === 'development') {
  console.log("🔍 Role resolution debug:", {
    clerkUserId: session.userId,
    databaseUserId: user.id,
    userRole: user.role,
    roleAssignments: user.roleAssignments?.map(ra => `${ra.role.name}(${ra.role.priority})`),
    finalRole: highestRole,
    hasAccess
  });
}
```

## Troubleshooting

### Common Issues

1. **"User not found in database"**
   - User may not be synced from Clerk to database
   - Check `clerkUserId` field matches exactly
   - Run sync-current-user endpoint: `POST /api/sync-current-user`
   - Verify Clerk user ID format (should be `user_*`)

2. **"Current role: viewer" for admin users**
   - JWT tokens may be stale
   - API using `session.role` instead of database lookup
   - Check role assignments table for missing entries
   - Verify role priority calculation logic

3. **Inconsistent permissions**
   - Multiple role assignments with different priorities
   - Check hierarchical permissions calculation
   - Verify role inheritance in Hasura metadata
   - Ensure `adminApolloClient` is used for lookups

4. **"Database user ID not found in session"**
   - Old code pattern trying to use `session.databaseId`
   - Update to use `session.userId` (Clerk ID) instead
   - Remove dependency on JWT claims for database lookup

5. **Permission denied despite correct role**
   - Check Hasura permissions for the querying role
   - Verify column names in permissions (snake_case vs camelCase)
   - Test query in GraphiQL with proper headers

### Debugging Steps

1. **Check session data:**
   ```typescript
   console.log("🔍 Session debug:", { 
     userId: session.userId, 
     email: session.email,
     clerkId: session.userId // Clerk user ID
   });
   ```

2. **Verify database lookup:**
   ```typescript
   console.log("📋 Database user:", {
     user: user,
     roleAssignments: user?.roleAssignments?.map(ra => ({
       name: ra.role.name,
       priority: ra.role.priority
     })),
     fallbackRole: user?.role
   });
   ```

3. **Trace role calculation:**
   ```typescript
   console.log("🎯 Role resolution:", {
     userRole: user?.role,
     assignments: roleAssignments.length,
     highestRole: highestRole,
     hasAccess: hasAccess,
     requiredRoles: ["developer", "org_admin"]
   });
   ```

4. **Test GraphQL query directly:**
   ```bash
   # Test user lookup with Clerk user ID
   curl -X POST http://localhost:8081/v1/graphql \
     -H "Content-Type: application/json" \
     -H "x-hasura-admin-secret: YOUR_SECRET" \
     -d '{
       "query": "query GetUser($clerkUserId: String!) { users(where: { clerkUserId: { _eq: $clerkUserId } }) { id role roleAssignments { role { name priority } } } }",
       "variables": { "clerkUserId": "user_abc123" }
     }'
   ```

5. **Check Hasura metadata consistency:**
   ```bash
   hasura metadata ic list
   hasura metadata apply
   ```

## Best Practices

### Do's ✅

- Always use `session.userId` for database lookups
- Include role assignments in user queries
- Calculate highest priority role from assignments
- Provide clear error messages with role information
- Log role resolution process for debugging
- Handle missing users gracefully
- Use fallback to `user.role` if no assignments
- Use `adminApolloClient` for reliable admin access
- Implement proper role hierarchy calculations
- Include debug information in development environments
- Test with different role combinations

### Don'ts ❌

- Never rely on JWT claims for role determination
- Don't use `session.role` or `session.defaultRole` for permissions
- Don't make multiple database queries when one suffices
- Don't expose sensitive debug information in production
- Don't assume role assignments exist
- Don't skip error handling for user lookup failures
- Don't use `session.databaseId` - it may be stale
- Don't implement permission checks without database verification
- Don't ignore role priority when multiple assignments exist

## Migration Notes

When updating existing APIs:

1. **Replace JWT-based role checking** with database lookups
2. **Update queries** to include roleAssignments
3. **Add proper error handling** for missing users
4. **Test with different role combinations**
5. **Verify performance impact** of additional queries

### Quick Migration Checklist

Before migration:
- [ ] Identify all APIs using `session.role` or `session.databaseId`
- [ ] Review permission requirements for each endpoint
- [ ] Plan role hierarchy for multi-role users

During migration:
- [ ] Update imports to include `adminApolloClient` and `gql`
- [ ] Replace session-based role checks with database queries
- [ ] Update GraphQL queries to use `clerkUserId` filtering
- [ ] Add role priority calculation logic
- [ ] Update error responses with debug information

After migration:
- [ ] Test with different user roles
- [ ] Verify performance is acceptable
- [ ] Test role assignment changes in real-time
- [ ] Validate error handling for edge cases

### Performance Considerations

- **Single Query Pattern**: Combines user lookup and role data in one request
- **Network Optimization**: Uses `fetchPolicy: "network-only"` for fresh data
- **Admin Client**: `adminApolloClient` bypasses permission checks for reliable access
- **Caching Strategy**: Database queries are fast enough for real-time validation

This pattern ensures reliable, consistent authentication across all API endpoints while maintaining optimal performance and security.
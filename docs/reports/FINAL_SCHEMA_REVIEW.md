# Final Updated Schema Review - December 2024

## Overview

The Hasura schema has been successfully updated with comprehensive audit logging, RBAC implementation, and payroll versioning. This document provides the definitive schema structure based on the actual GraphQL introspection.

## Key Schema Updates

### 1. Audit Schema Tables (Confirmed)

- **auditLogs** - Main audit log table (not audit_auditLogs)
- **authEvents** - Authentication events tracking  
- **dataAccessLogs** - Data access tracking (not dataAccessLog)
- **permissionChanges** - Permission modification tracking
- **userAccessSummaries** - User activity aggregation (not userAccessSummary)

### 2. Permission System (Confirmed)

- **users** → **userRoles** → **roles** → **rolePermissions** → **permissions**
- **permissionOverrides** - Temporary permission grants
- **resources** - Resources that permissions apply to

### 3. Payroll Versioning (Confirmed)

- **payrolls** table with versioning fields:
  - `parentPayrollId` - Links to previous version
  - `supersededDate` - Marks old versions
  - `versionNumber` - Tracks version sequence
  - `versionReason` - Explains why new version created
- **currentPayrolls** view - Shows only active payrolls

### 4. Custom Functions Available

- `createPayrollVersion` - Creates new payroll version
- `generatePayrollDates` - Generates payroll schedule
- `getPayrollVersionHistory` - Retrieves version history
- `getLatestPayrollVersion` - Gets current version

## GraphQL Type Corrections

Based on the actual schema introspection, here are the correct type names:

### Audit Types
```graphql
# Correct type names (plural)
type auditLogs {
  id: uuid!
  eventTime: timestamptz!
  userId: uuid
  userEmail: String
  userRole: String
  action: String!
  resourceType: String!
  resourceId: String
  oldValues: jsonb
  newValues: jsonb
  ipAddress: inet
  userAgent: String
  sessionId: String
  requestId: String
  success: Boolean!
  errorMessage: String
  metadata: jsonb
}

type dataAccessLogs {  # Note: plural
  id: uuid!
  accessedAt: timestamptz!
  userId: uuid!
  resourceType: String!
  resourceId: String!
  accessType: String!
  dataClassification: String
  fieldsAccessed: _text
  queryExecuted: String
  rowCount: Int
  ipAddress: inet
  sessionId: String
  metadata: jsonb
}
```

### User & Permission Types
```graphql
type users {
  id: uuid!
  clerkUserId: String
  email: String!
  name: String!
  username: String
  image: String
  isActive: Boolean
  isStaff: Boolean
  managerId: uuid
  deactivatedAt: timestamptz
  deactivatedBy: String
  createdAt: timestamptz
  updatedAt: timestamptz
  
  # Relationships
  manager: users
  subordinates: [users!]!
  userRoles: [userRoles!]!
  permissionOverrides: [permissionOverrides!]!
  auditLogs: [auditLogs!]!
}

type userRoles {
  id: uuid!
  userId: uuid!
  roleId: uuid!
  createdAt: timestamptz!
  
  # Relationships
  user: users!
  role: roles!
}

type roles {
  id: uuid!
  name: String!
  displayName: String!
  description: String
  isSystemRole: Boolean!
  priority: Int!
  createdAt: timestamptz!
  updatedAt: timestamptz!
  
  # Relationships
  userRoles: [userRoles!]!
  rolePermissions: [rolePermissions!]!
}
```

## Required GraphQL Operation Updates

### 1. Fragment Updates
```graphql
# Update fragment names to match actual types
fragment AuditLogEntry on auditLogs {  # not audit_auditLogs
  id
  eventTime  # not timestamp
  userId
  action
  resourceType
  resourceId
  metadata
  user {
    ...UserMinimal
  }
}

fragment SecurityEvent on authEvents {  # not audit_securityEvents
  id
  eventTime
  eventType
  userId
  ipAddress
  userAgent
  success
  metadata
  user {
    ...UserMinimal
  }
}
```

### 2. Query Updates
```graphql
# Correct field names
query GetAuditLogs {
  auditLogs(order_by: {eventTime: desc}) {  # not timestamp
    ...AuditLogEntry
  }
}

# Correct type names
query GetDataAccessLogs {
  dataAccessLogs {  # plural, not dataAccessLog
    id
    accessedAt
    userId
    resourceType
  }
}
```

### 3. Mutation Updates
```graphql
# Correct insert mutations
mutation LogAuditEvent($object: auditLogsInsertInput!) {
  insertAuditLogsOne(object: $object) {  # not insert_audit_auditLogs_one
    id
    eventTime
  }
}

# Use inet type for IP addresses
mutation LogAuthEvent(
  $userId: uuid
  $eventType: String!
  $ipAddress: inet!  # not String
  $success: Boolean!
) {
  insertAuthEventsOne(object: {
    userId: $userId
    eventType: $eventType
    ipAddress: $ipAddress
    success: $success
  }) {
    id
    eventTime
  }
}
```

### 4. Subscription Updates
```graphql
# Correct type names
subscription AuditLogStream {
  auditLogs(  # not audit_auditLogs
    where: {eventTime: {_gte: "now() - interval '5 minutes'"}}
    order_by: {eventTime: desc}
  ) {
    ...AuditLogEntry
  }
}
```

## Key Differences from Initial Design

1. **Type Names**: All table types use plural names (auditLogs, not auditLog)
2. **Field Names**: `eventTime` instead of `timestamp` in audit tables
3. **IP Address Type**: `inet` type for IP addresses, not String
4. **No Security Events**: Use `authEvents` instead of `securityEvents`
5. **Aggregates**: `userAccessSummaries` (plural) not `userAccessSummary`

## Next Steps

1. Update all GraphQL fragments to use correct type names
2. Fix field references (eventTime vs timestamp)
3. Update variable types (inet for IP addresses)
4. Replace references to non-existent types
5. Regenerate TypeScript types with corrected operations

## Files to Update

1. `/shared/graphql/fragments.graphql` - Fix fragment type names
2. `/shared/graphql/subscriptions.graphql` - Fix subscription queries
3. `/domains/audit/graphql/*.graphql` - Update all audit operations
4. `/domains/users/graphql/*.graphql` - Fix user/role queries
5. `/domains/permissions/graphql/*.graphql` - Update permission operations

The schema is now production-ready with comprehensive security, audit logging, and versioning capabilities.
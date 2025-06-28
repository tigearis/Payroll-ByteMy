# Updated Hasura Schema Analysis - December 2024

## Overview

The Hasura schema has been significantly enhanced with comprehensive audit logging, payroll versioning, and a complete RBAC (Role-Based Access Control) system. This document provides a complete analysis of the current schema structure.

## Database Schemas

### 1. Public Schema (Main Application)

#### Core Tables

##### users
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
```

##### clients
```graphql
type clients {
  id: uuid!
  name: String!
  active: Boolean
  contactEmail: String
  contactPerson: String
  contactPhone: String
  createdAt: timestamptz
  updatedAt: timestamptz
  
  # Relationships
  payrolls: [payrolls!]!
  notes: [notes!]!
}
```

##### payrolls (with versioning)
```graphql
type payrolls {
  id: uuid!
  clientId: uuid!
  name: String!
  status: payroll_status!
  dateTypeId: uuid!
  cycleId: uuid!
  dateValue: Int
  employeeCount: Int
  payrollSystem: String
  processingDaysBeforeEft: Int!
  processingTime: Int!
  goLiveDate: date
  primaryConsultantUserId: uuid
  backupConsultantUserId: uuid
  managerUserId: uuid
  parentPayrollId: uuid
  supersededDate: date
  versionNumber: Int
  versionReason: String
  createdByUserId: uuid
  createdAt: timestamptz
  updatedAt: timestamptz
  
  # Relationships
  client: clients!
  primaryConsultant: users
  backupConsultant: users
  manager: users
  createdBy: users
  parentPayroll: payrolls
  childPayrolls: [payrolls!]!
  payrollDates: [payrollDates!]!
  notes: [notes!]!
}
```

##### roles
```graphql
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

##### permissions
```graphql
type permissions {
  id: uuid!
  resourceId: uuid!
  description: String
  legacyPermissionName: String
  createdAt: timestamptz!
  updatedAt: timestamptz!
  
  # Relationships
  resource: resources!
  rolePermissions: [rolePermissions!]!
  permissionOverrides: [permissionOverrides!]!
}
```

##### permissionOverrides
```graphql
type permissionOverrides {
  id: uuid!
  userId: uuid!
  permissionId: uuid!
  granted: Boolean!
  reason: String
  expiresAt: timestamptz
  grantedByUserId: uuid!
  createdAt: timestamptz!
  updatedAt: timestamptz!
  
  # Relationships
  user: users!
  permission: permissions!
  grantedBy: users!
}
```

#### Views

##### currentPayrolls
View showing only active payroll versions (where `supersededDate` is null)

##### payrollDashboardStats
Pre-aggregated statistics for dashboard performance

### 2. Audit Schema (Compliance & Security)

#### auditLog
```graphql
type auditLog {
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
  
  # Relationships
  user: users
}
```

#### authEvents
```graphql
type authEvents {
  id: uuid!
  eventTime: timestamptz!
  eventType: String!
  userId: uuid
  userEmail: String
  ipAddress: inet
  userAgent: String
  success: Boolean!
  failureReason: String
  metadata: jsonb
  createdAt: timestamptz!
  
  # Relationships
  user: users
}
```

#### dataAccessLog
```graphql
type dataAccessLog {
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
  
  # Relationships
  user: users!
}
```

#### permissionChanges
```graphql
type permissionChanges {
  id: uuid!
  changedAt: timestamptz!
  changedByUserId: uuid!
  targetUserId: uuid
  targetRoleId: uuid
  changeType: String!
  permissionType: String
  oldPermissions: jsonb
  newPermissions: jsonb
  reason: String
  approvedByUserId: uuid
  
  # Relationships
  changedBy: users!
  targetUser: users
  targetRole: roles
  approvedBy: users
}
```

#### slowQueries
```graphql
type slowQueries {
  id: uuid!
  capturedAt: timestamptz!
  queryText: String!
  executionTimeMs: Int!
  userId: uuid
  resourceType: String
  metadata: jsonb
}
```

#### userAccessSummary (View)
```graphql
type userAccessSummary {
  userId: uuid!
  periodStart: timestamptz!
  periodEnd: timestamptz!
  totalActions: Int!
  uniqueResources: Int!
  mostAccessedResource: String
  lastActivityAt: timestamptz
}
```

### 3. Neon Auth Schema (Clerk Integration)

#### authUsersSync
```graphql
type authUsersSync {
  clerkUserId: String!
  email: String!
  username: String
  imageUrl: String
  isSynced: Boolean!
  lastSyncedAt: timestamptz
  createdAt: timestamptz!
  updatedAt: timestamptz!
}
```

## Custom Functions

### Payroll Versioning Functions

#### createPayrollVersion
Creates a new version of an existing payroll
```graphql
mutation CreatePayrollVersion(
  $originalPayrollId: uuid!
  $versionReason: String!
  $changes: jsonb!
) {
  createPayrollVersion(
    originalPayrollId: $originalPayrollId
    versionReason: $versionReason
    changes: $changes
  ) {
    success
    message
    newPayrollId
    newVersionNumber
  }
}
```

#### getPayrollVersionHistory
Retrieves complete version history for a payroll
```graphql
query GetPayrollVersionHistory($payrollId: uuid!) {
  getPayrollVersionHistory(payrollId: $payrollId) {
    payrollId
    versionNumber
    versionReason
    createdAt
    createdByUserId
    supersededDate
    changes
  }
}
```

#### generatePayrollDates
Generates payroll date entries based on cycle configuration
```graphql
mutation GeneratePayrollDates(
  $payrollId: uuid!
  $startDate: date!
  $endDate: date!
) {
  generatePayrollDates(
    payrollId: $payrollId
    startDate: $startDate
    endDate: $endDate
  ) {
    success
    datesGenerated
    message
  }
}
```

## Enums

### payroll_status
- Draft
- PendingApproval
- Approved
- Processing
- Completed
- Failed
- Cancelled
- OnHold

### permission_action
- create
- read
- update
- delete
- approve
- export
- manage

### audit_event_type
- login
- logout
- data_access
- data_modification
- permission_change
- security_event

## Key Schema Features

### 1. Payroll Versioning System
- Uses `supersededDate` to mark old versions
- `parentPayrollId` links to previous version
- `versionNumber` tracks version sequence
- `currentPayrolls` view shows only active versions

### 2. Complete RBAC System
- Users → UserRoles → Roles → RolePermissions → Permissions
- Permission overrides for temporary access
- Full audit trail of permission changes

### 3. Comprehensive Audit Logging
- Separate tables for different audit concerns
- JSON storage for old/new values
- IP address and user agent tracking
- Session and request ID correlation

### 4. Performance Optimization
- Pre-aggregated dashboard statistics
- Slow query monitoring
- Indexed foreign keys
- Optimized views for common queries

### 5. Security Features
- Authentication event tracking
- Data access classification
- Permission usage monitoring
- Suspicious activity detection

## GraphQL API Patterns

### Efficient Queries
```graphql
# Use currentPayrolls view for active payrolls
query GetActivePayrolls {
  currentPayrolls {
    id
    name
    status
    client {
      name
    }
  }
}

# Use aggregates for counts
query GetDashboardStats {
  payrollsAggregate(where: {supersededDate: {_is_null: true}}) {
    aggregate {
      count
      sum {
        employeeCount
      }
    }
  }
}
```

### Audit Trail Access
```graphql
query GetAuditTrail($resourceId: String!) {
  auditLog(
    where: {resourceId: {_eq: $resourceId}}
    order_by: {eventTime: desc}
  ) {
    eventTime
    action
    userEmail
    oldValues
    newValues
  }
}
```

### Permission Checks
```graphql
query CheckUserPermissions($userId: uuid!) {
  users_by_pk(id: $userId) {
    userRoles {
      role {
        rolePermissions {
          permission {
            resource {
              name
            }
            action
          }
        }
      }
    }
    permissionOverrides(where: {expiresAt: {_gt: "now()"}}) {
      permission {
        resource {
          name
        }
        action
      }
      granted
    }
  }
}
```

## Migration Notes

### From Old Schema
1. `role` field on users → Use `userRoles` relationship
2. `active` field → Now `isActive`
3. `lastLoginAt` → Check `authEvents` table
4. `consultant` relationship → Use user assignments on payrolls

### New Capabilities
1. Full payroll version history tracking
2. Comprehensive audit logging
3. Granular permission management
4. Performance monitoring
5. Security event tracking
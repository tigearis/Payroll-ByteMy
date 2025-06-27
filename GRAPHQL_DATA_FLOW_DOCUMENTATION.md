# GraphQL Data Flow Documentation

This document provides detailed analysis of data requirements and optimal GraphQL strategies for each component in the Payroll ByteMy application.

## Core Dashboard Components

### Component: Main Dashboard
**File**: `/app/(dashboard)/dashboard/page.tsx`
**Purpose**: Provide overview of payroll operations and key metrics

#### Data Requirements Analysis:

**Display Data Needed:**
- Total active clients count
- Total active payrolls count
- Processing queue size
- Upcoming payroll deadlines (next 7 days)
- Recent activity summary
- System health metrics

**Real-time Requirements:**
- Processing status updates
- New payroll notifications
- System alerts

**Permission Requirements:**
- All roles have access with filtered data based on role

#### Optimal GraphQL Strategy:

**Primary Query**: GetDashboardMetrics
```graphql
query GetDashboardMetrics($userId: uuid!) {
  clientsAggregate(where: {active: {_eq: true}}) {
    aggregate {
      count
    }
  }
  payrollsAggregate(where: {
    supersededDate: {_isNull: true}
    status: {_nin: ["Completed", "Failed"]}
  }) {
    aggregate {
      count
    }
  }
  upcomingPayrolls: payrolls(
    where: {
      supersededDate: {_isNull: true}
      status: {_in: ["Pending", "PendingApproval"]}
      paymentDate: {_gte: now(), _lte: "7 days from now"}
    }
    orderBy: {paymentDate: asc}
    limit: 5
  ) {
    ...PayrollDashboardItem
  }
}

fragment PayrollDashboardItem on payrolls {
  id
  employeeCount
  paymentDate
  processingDate
  status
  client {
    id
    name
  }
}
```

### Component: Clients Management Page
**File**: `/app/(dashboard)/clients/page.tsx`
**Purpose**: Display and manage all clients

#### Data Requirements Analysis:

**Display Data Needed:**
- Client list with pagination
- Basic client info: name, email, consultant
- Aggregate data: total employees per client
- Active/inactive status
- Last payroll date
- Search and filtering capabilities

**Input Data Required:**
- Search term
- Status filter (active/inactive)
- Consultant filter
- Sort options

**Permission Requirements:**
- admin/developer: full access
- manager: assigned clients only
- consultant: assigned clients only

#### Optimal GraphQL Strategy:

**Primary Query**: GetClientsList
```graphql
query GetClientsList(
  $limit: Int = 20
  $offset: Int = 0
  $where: clients_bool_exp
  $orderBy: [clients_order_by!] = {name: asc}
) {
  clients(
    limit: $limit
    offset: $offset
    where: $where
    orderBy: $orderBy
  ) {
    ...ClientListItem
  }
  clientsAggregate(where: $where) {
    aggregate {
      count
    }
  }
}

fragment ClientListItem on clients {
  id
  name
  email
  phone
  active
  createdAt
  consultant {
    id
    name
  }
  # Aggregate for current employee count
  payrollsAggregate(where: {supersededDate: {_isNull: true}}) {
    aggregate {
      sum {
        employeeCount
      }
    }
  }
  # Latest payroll info
  latestPayroll: payrolls(
    where: {supersededDate: {_isNull: true}}
    orderBy: {paymentDate: desc}
    limit: 1
  ) {
    paymentDate
    status
  }
}
```

### Component: Payroll Management Page
**File**: `/app/(dashboard)/payrolls/page.tsx`
**Purpose**: Manage all payrolls across clients

#### Data Requirements Analysis:

**Display Data Needed:**
- Payroll list with status
- Client association
- Employee count
- Payment and processing dates
- Approval status and workflow state
- Version information

**Filter Requirements:**
- Status filter
- Date range filter
- Client filter
- Approval state filter

**Real-time Requirements:**
- Status changes
- Approval notifications
- Processing updates

#### Optimal GraphQL Strategy:

**Primary Query**: GetPayrollsList
```graphql
query GetPayrollsList(
  $limit: Int = 50
  $offset: Int = 0
  $where: payrolls_bool_exp
  $orderBy: [payrolls_order_by!] = {paymentDate: desc}
) {
  payrolls(
    limit: $limit
    offset: $offset
    where: $where
    orderBy: $orderBy
  ) {
    ...PayrollListItem
  }
  payrollsAggregate(where: $where) {
    aggregate {
      count
    }
  }
}

fragment PayrollListItem on payrolls {
  id
  employeeCount
  paymentDate
  processingDate
  status
  approvalStatus
  version
  createdAt
  client {
    id
    name
    consultant {
      id
      name
    }
  }
  createdBy {
    id
    name
  }
  approvedBy {
    id
    name
  }
}
```

**Subscription**: PayrollStatusUpdates
```graphql
subscription PayrollStatusUpdates($clientIds: [uuid!]) {
  payrolls(
    where: {
      clientId: {_in: $clientIds}
      supersededDate: {_isNull: true}
      status: {_nin: ["Completed", "Failed"]}
    }
  ) {
    id
    status
    approvalStatus
    updatedAt
  }
}
```

### Component: Payroll Detail Page
**File**: `/app/(dashboard)/payrolls/[id]/page.tsx`
**Purpose**: View and edit individual payroll details

#### Data Requirements Analysis:

**Display Data Needed:**
- Complete payroll information
- Associated payment dates
- Employee details
- Processing history
- Version history
- Approval workflow
- Related notes and comments
- Audit trail

**Input Data Required:**
- Status updates
- Approval actions
- Note additions
- Date modifications

#### Optimal GraphQL Strategy:

**Primary Query**: GetPayrollDetail
```graphql
query GetPayrollDetail($id: uuid!) {
  payroll: payrollsByPk(id: $id) {
    ...PayrollFullDetail
  }
}

fragment PayrollFullDetail on payrolls {
  id
  employeeCount
  paymentDate
  processingDate
  status
  approvalStatus
  version
  versionReason
  createdAt
  updatedAt
  supersededDate
  
  client {
    id
    name
    email
    phone
    consultant {
      id
      name
      email
    }
  }
  
  payrollDates {
    id
    dateType
    date
    isHoliday
    notes
  }
  
  # Version history
  versionHistory: children {
    id
    version
    versionReason
    createdAt
    createdBy {
      id
      name
    }
  }
  
  # Parent version if exists
  parent {
    id
    version
  }
  
  # Notes
  notes(orderBy: {createdAt: desc}) {
    id
    content
    createdAt
    author {
      id
      name
    }
  }
  
  # Approval workflow
  createdBy {
    id
    name
  }
  approvedBy {
    id
    name
  }
  approvedAt
}
```

### Component: Staff Management
**File**: `/app/(dashboard)/staff/[id]/page.tsx`
**Purpose**: View and manage staff member details

#### Data Requirements Analysis:

**Display Data Needed:**
- Staff member profile
- Role and permissions
- Assigned clients
- Activity history
- Access logs

**Permission Requirements:**
- Self-view always allowed
- Manager can view team members
- Admin/developer full access

#### Optimal GraphQL Strategy:

**Primary Query**: GetStaffMemberDetail
```graphql
query GetStaffMemberDetail($id: uuid!) {
  user: usersByPk(id: $id) {
    ...StaffMemberDetail
  }
}

fragment StaffMemberDetail on users {
  id
  email
  name
  role
  active
  createdAt
  lastLoginAt
  
  # Role permissions
  userRoles {
    role {
      id
      name
      description
      permissions {
        permission {
          resource
          action
          description
        }
      }
    }
  }
  
  # Permission overrides
  permissionOverrides(where: {
    expiresAt: {_gt: now()}
  }) {
    permission {
      resource
      action
    }
    grantedBy {
      name
    }
    reason
    expiresAt
  }
  
  # Assigned clients (for consultants)
  assignedClients: clients(orderBy: {name: asc}) {
    id
    name
    active
  }
  
  # Recent activity
  auditLogs(
    orderBy: {timestamp: desc}
    limit: 20
  ) {
    action
    resourceType
    resourceId
    timestamp
    metadata
  }
}
```

## Creation and Form Components

### Component: Create Client Form
**File**: `/app/(dashboard)/clients/new/page.tsx`
**Purpose**: Create new client records

#### Data Requirements Analysis:

**Display Data Needed:**
- Consultant dropdown options
- Form validation rules
- Default values

**Input Data Required:**
- Client details: name, email, phone
- Assigned consultant
- Initial configuration

#### Optimal GraphQL Strategy:

**Setup Query**: GetClientFormData
```graphql
query GetClientFormData {
  consultants: users(
    where: {
      role: {_eq: "consultant"}
      active: {_eq: true}
    }
    orderBy: {name: asc}
  ) {
    id
    name
    email
  }
}
```

**Mutation**: CreateClient
```graphql
mutation CreateClient($input: clients_insert_input!) {
  insertClientsOne(object: $input) {
    id
    name
    email
    consultant {
      id
      name
    }
  }
}
```

## Administrative Components

### Component: Security Dashboard
**File**: `/app/(dashboard)/security/page.tsx`
**Purpose**: Monitor security metrics and system health

#### Data Requirements Analysis:

**Display Data Needed:**
- Active sessions count
- Failed login attempts
- API key usage
- Recent security events
- Permission usage statistics

**Real-time Requirements:**
- Security alerts
- Suspicious activity notifications

#### Optimal GraphQL Strategy:

**Primary Query**: GetSecurityMetrics
```graphql
query GetSecurityMetrics($timeRange: timestamptz!) {
  # Active sessions
  activeSessionsCount: authSessionsAggregate(
    where: {
      expiresAt: {_gt: now()}
      active: {_eq: true}
    }
  ) {
    aggregate {
      count
    }
  }
  
  # Failed attempts
  failedAttemptsCount: authAttemptsAggregate(
    where: {
      success: {_eq: false}
      timestamp: {_gte: $timeRange}
    }
  ) {
    aggregate {
      count
    }
  }
  
  # Recent security events
  securityEvents: auditSecurityEvents(
    where: {timestamp: {_gte: $timeRange}}
    orderBy: {timestamp: desc}
    limit: 10
  ) {
    id
    eventType
    severity
    userId
    ipAddress
    userAgent
    timestamp
    metadata
  }
  
  # API key usage
  apiKeyUsage: apiKeysAggregate(
    where: {
      lastUsedAt: {_gte: $timeRange}
    }
  ) {
    aggregate {
      count
    }
  }
}
```

## Common Fragment Patterns

Based on the analysis, here are the common fragments needed:

### User Fragments
```graphql
fragment UserCore on users {
  id
  email
  name
  role
  active
}

fragment UserWithRole on users {
  ...UserCore
  userRoles {
    role {
      id
      name
    }
  }
}
```

### Client Fragments
```graphql
fragment ClientCore on clients {
  id
  name
  email
  active
}

fragment ClientWithConsultant on clients {
  ...ClientCore
  consultant {
    ...UserCore
  }
}

fragment ClientWithStats on clients {
  ...ClientWithConsultant
  payrollsAggregate(where: {supersededDate: {_isNull: true}}) {
    aggregate {
      count
      sum {
        employeeCount
      }
    }
  }
}
```

### Payroll Fragments
```graphql
fragment PayrollCore on payrolls {
  id
  employeeCount
  paymentDate
  processingDate
  status
  version
}

fragment PayrollWithClient on payrolls {
  ...PayrollCore
  client {
    ...ClientCore
  }
}

fragment PayrollWithDates on payrolls {
  ...PayrollWithClient
  payrollDates {
    id
    dateType
    date
    isHoliday
  }
}
```

## Optimization Principles Applied

1. **Aggregation at Database Level**: All counts and sums use Hasura aggregates
2. **Selective Field Loading**: Only fetch fields needed for display
3. **Relationship Depth Control**: Maximum 2-3 levels of relationships
4. **Fragment Reuse**: Common patterns extracted to fragments
5. **Pagination**: All list queries support limit/offset
6. **Real-time Selective**: Subscriptions only for truly real-time needs
7. **Permission-Aware**: Queries structured to work with row-level security

## Next Steps

With this comprehensive data flow documentation, we can now:
1. Design the fragment structure
2. Build optimized queries for each component
3. Create efficient mutations
4. Implement smart subscriptions
5. Generate TypeScript types for type safety
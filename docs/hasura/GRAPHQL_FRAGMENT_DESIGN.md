# GraphQL Fragment Design Strategy

This document outlines the fragment strategy for the Payroll ByteMy application, designed to maximize reusability while avoiding the GraphQL Codegen "unknown fragment" issues.

## Fragment Organization Strategy

To address the GraphQL Codegen challenge mentioned in CLAUDE.md, we'll use a **domain-centric approach** where:
1. Shared fragments are defined in `shared/graphql/fragments.graphql`
2. Each domain imports and extends shared fragments as needed
3. Fragments are organized by entity type and use case

## Core Entity Fragments

### User Fragments

```graphql
# Minimal user info for references
fragment UserMinimal on users {
  id
  name
  email
}

# Basic user info for lists
fragment UserBase on users {
  id
  email
  name
  role
  active
  createdAt
}

# User with role information
fragment UserWithRole on users {
  ...UserBase
  userRoles {
    role {
      id
      name
      description
    }
  }
}

# Full user profile
fragment UserProfile on users {
  ...UserWithRole
  lastLoginAt
  updatedAt
  permissionOverrides(where: {expiresAt: {_gt: now()}}) {
    id
    permission {
      resource
      action
    }
    reason
    expiresAt
    grantedBy {
      ...UserMinimal
    }
  }
}
```

### Client Fragments

```graphql
# Minimal client info
fragment ClientMinimal on clients {
  id
  name
}

# Basic client info for lists
fragment ClientBase on clients {
  id
  name
  email
  phone
  active
  createdAt
}

# Client with consultant
fragment ClientWithConsultant on clients {
  ...ClientBase
  consultant {
    ...UserMinimal
  }
}

# Client with statistics
fragment ClientWithStats on clients {
  ...ClientWithConsultant
  # Current employee count
  currentEmployeeCount: payrollsAggregate(
    where: {supersededDate: {_isNull: true}}
  ) {
    aggregate {
      sum {
        employeeCount
      }
    }
  }
  # Active payroll count
  activePayrollCount: payrollsAggregate(
    where: {
      supersededDate: {_isNull: true}
      status: {_nin: ["Completed", "Failed"]}
    }
  ) {
    aggregate {
      count
    }
  }
}

# Client list item (optimized for table display)
fragment ClientListItem on clients {
  ...ClientWithConsultant
  # Latest payroll info
  latestPayroll: payrolls(
    where: {supersededDate: {_isNull: true}}
    orderBy: {paymentDate: desc}
    limit: 1
  ) {
    paymentDate
    status
  }
  # Total employees
  totalEmployees: payrollsAggregate(
    where: {supersededDate: {_isNull: true}}
  ) {
    aggregate {
      sum {
        employeeCount
      }
    }
  }
}
```

### Payroll Fragments

```graphql
# Minimal payroll info
fragment PayrollMinimal on payrolls {
  id
  employeeCount
  paymentDate
  status
}

# Basic payroll info
fragment PayrollBase on payrolls {
  id
  employeeCount
  paymentDate
  processingDate
  status
  approvalStatus
  version
  createdAt
  updatedAt
}

# Payroll with client info
fragment PayrollWithClient on payrolls {
  ...PayrollBase
  client {
    ...ClientMinimal
  }
}

# Payroll list item (for tables)
fragment PayrollListItem on payrolls {
  ...PayrollWithClient
  createdBy {
    ...UserMinimal
  }
  approvedBy {
    ...UserMinimal
  }
  client {
    ...ClientMinimal
    consultant {
      ...UserMinimal
    }
  }
}

# Payroll with dates
fragment PayrollWithDates on payrolls {
  ...PayrollBase
  payrollDates(orderBy: {date: asc}) {
    id
    dateType
    date
    isHoliday
    notes
  }
}

# Full payroll detail
fragment PayrollFullDetail on payrolls {
  ...PayrollWithDates
  ...PayrollWithClient
  versionReason
  supersededDate
  approvedAt
  
  # Version tracking
  parent {
    id
    version
  }
  children(orderBy: {version: desc}) {
    id
    version
    versionReason
    createdAt
    createdBy {
      ...UserMinimal
    }
  }
  
  # People
  createdBy {
    ...UserMinimal
  }
  approvedBy {
    ...UserMinimal
  }
  
  # Related data
  notes(orderBy: {createdAt: desc}) {
    ...NoteWithAuthor
  }
}
```

### Note Fragments

```graphql
# Note with author
fragment NoteWithAuthor on notes {
  id
  content
  createdAt
  updatedAt
  author {
    ...UserMinimal
  }
}
```

### Permission Fragments

```graphql
# Basic permission
fragment PermissionBase on permissions {
  id
  resource
  action
  description
}

# Role with permissions
fragment RoleWithPermissions on roles {
  id
  name
  description
  rolePermissions {
    permission {
      ...PermissionBase
    }
  }
}
```

### Audit Fragments

```graphql
# Audit log entry
fragment AuditLogEntry on audit.auditLogs {
  id
  userId
  action
  resourceType
  resourceId
  timestamp
  ipAddress
  userAgent
  metadata
  user {
    ...UserMinimal
  }
}

# Security event
fragment SecurityEvent on audit.securityEvents {
  id
  eventType
  severity
  userId
  ipAddress
  userAgent
  timestamp
  metadata
  user {
    ...UserMinimal
  }
}
```

## Domain-Specific Fragment Extensions

### Payroll Domain Fragments

```graphql
# Dashboard payroll item
fragment PayrollDashboardItem on payrolls {
  ...PayrollMinimal
  processingDate
  client {
    id
    name
  }
}

# Payroll calendar item
fragment PayrollCalendarItem on payrolls {
  id
  paymentDate
  processingDate
  status
  employeeCount
  client {
    id
    name
    color # for calendar display
  }
}
```

### User Domain Fragments

```graphql
# Staff list item
fragment StaffListItem on users {
  ...UserBase
  lastLoginAt
  assignedClientsCount: clientsAggregate {
    aggregate {
      count
    }
  }
}

# User table row
fragment UserTableRow on users {
  ...UserWithRole
  lastActivityAt
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
}
```

## Fragment Usage Guidelines

### 1. Minimal Fragments for References
Use `*Minimal` fragments when you only need to display a reference to an entity (e.g., "Created by John Doe").

### 2. Base Fragments for Lists
Use `*Base` fragments for list displays where you need essential information but not deep relationships.

### 3. Specialized Fragments for Features
Create feature-specific fragments (e.g., `PayrollDashboardItem`) that extend base fragments with only the additional fields needed.

### 4. Full Detail Fragments Sparingly
Use `*FullDetail` fragments only for detail pages where comprehensive information is needed.

### 5. Aggregate Fields Strategy
- Include aggregate fields in fragments only when they're consistently needed
- For conditional aggregates, add them in the query rather than the fragment

## Implementation Strategy

### File Structure
```
shared/graphql/
├── fragments.graphql          # All shared fragments
├── enums.graphql             # Shared enums
└── scalars.graphql           # Custom scalars

domains/[domain]/graphql/
├── fragments.graphql         # Domain-specific fragments that import shared
├── queries.graphql          # Uses both shared and domain fragments
├── mutations.graphql        # Uses fragments for return types
└── subscriptions.graphql    # Uses minimal fragments
```

### Codegen Configuration
```typescript
// codegen.ts
const config: CodegenConfig = {
  generates: {
    'shared/types/generated/': {
      documents: ['shared/graphql/**/*.graphql'],
      preset: 'client',
      config: {
        dedupeFragments: true,
        fragmentMasking: false
      }
    },
    // Each domain generates with shared fragments included
    'domains/[domain]/graphql/generated/': {
      documents: [
        'shared/graphql/fragments.graphql', // Include shared fragments
        'domains/[domain]/graphql/**/*.graphql'
      ],
      preset: 'client',
      config: {
        dedupeFragments: true,
        fragmentMasking: false
      }
    }
  }
};
```

## Benefits of This Approach

1. **No Unknown Fragment Errors**: Each domain includes necessary shared fragments
2. **Maximum Reusability**: Common patterns defined once
3. **Performance Optimized**: Fragments designed for specific use cases
4. **Type Safety**: Full TypeScript generation support
5. **Maintainable**: Clear organization and naming conventions

## Next Steps

With this fragment design in place, we can now:
1. Implement the shared fragments file
2. Create domain-specific fragments
3. Build queries using these fragments
4. Generate TypeScript types
5. Update components to use the new GraphQL operations
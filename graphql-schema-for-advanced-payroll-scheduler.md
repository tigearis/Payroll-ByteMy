# GraphQL Schema for Advanced Payroll Scheduler Component

This document outlines the complete GraphQL schema required for the Advanced Payroll Scheduler component functionality.

## Core Types

### User Type

```graphql
type User {
  id: ID!
  name: String!
  email: String
  role: String
  leaves: [Leave!]
  created_at: timestamptz
  updated_at: timestamptz
}
```

### Client Type

```graphql
type Client {
  id: ID!
  name: String!
  code: String
  contact_email: String
  contact_phone: String
  address: String
  created_at: timestamptz
  updated_at: timestamptz
}
```

### Payroll Type

```graphql
type Payroll {
  id: ID!
  name: String!
  client_id: ID!
  client: Client!
  primary_consultant_user_id: ID
  backup_consultant_user_id: ID
  userByPrimaryConsultantUserId: User
  userByBackupConsultantUserId: User
  employee_count: Int
  processing_time: Float
  frequency: String
  status: String
  payroll_dates: [PayrollDate!]
  created_at: timestamptz
  updated_at: timestamptz
}
```

### PayrollDate Type

```graphql
type PayrollDate {
  id: ID!
  payroll_id: ID!
  payroll: Payroll!
  original_eft_date: date!
  adjusted_eft_date: date!
  processing_date: date!
  cutoff_date: date
  pay_period_start: date
  pay_period_end: date
  is_holiday_adjusted: Boolean
  adjustment_reason: String
  status: String
  created_at: timestamptz
  updated_at: timestamptz
}
```

### Leave Type

```graphql
type Leave {
  id: ID!
  user_id: ID!
  user: User!
  start_date: date!
  end_date: date!
  leave_type: String!
  reason: String
  status: String!
  approved_by: ID
  created_at: timestamptz
  updated_at: timestamptz
}
```

### Holiday Type

```graphql
type Holiday {
  id: ID!
  date: date!
  local_name: String!
  english_name: String
  types: [String!]!
  region: String
  country_code: String!
  is_public: Boolean
  created_at: timestamptz
  updated_at: timestamptz
}
```

## Input Types

### PayrollAssignmentInput

```graphql
input PayrollAssignmentInput {
  payrollId: ID!
  fromConsultantId: ID!
  toConsultantId: ID!
  date: date!
}
```

### PayrollFiltersInput

```graphql
input PayrollFiltersInput {
  start_date: date
  end_date: date
  consultant_id: ID
  client_id: ID
  status: String
}
```

## Query Types

### Root Query

```graphql
type Query {
  # Payroll Queries
  payrolls(
    start_date: date
    end_date: date
    consultant_id: ID
    client_id: ID
    status: String
    limit: Int
    offset: Int
  ): [Payroll!]!

  payroll(id: ID!): Payroll

  payrollsByMonth(start_date: date!, end_date: date!): [Payroll!]!

  # Holiday Queries
  holidays(
    start_date: date
    end_date: date
    country_code: String
    region: String
  ): [Holiday!]!

  # User/Consultant Queries
  consultants: [User!]!

  consultant(id: ID!): User

  # Leave Queries
  leaves(
    user_id: ID
    start_date: date
    end_date: date
    status: String
  ): [Leave!]!
}
```

## Mutation Types

### PayrollAssignmentResponse

```graphql
type PayrollAssignmentResponse {
  success: Boolean!
  message: String
  errors: [String!]
  affected_payrolls: [Payroll!]
}
```

### Root Mutation

```graphql
type Mutation {
  # Payroll Assignment Mutations
  commitPayrollAssignments(
    changes: [PayrollAssignmentInput!]!
  ): PayrollAssignmentResponse!

  # Individual Payroll Mutations
  updatePayrollConsultant(
    payroll_id: ID!
    primary_consultant_id: ID
    backup_consultant_id: ID
  ): Payroll

  updatePayrollDate(
    payroll_date_id: ID!
    adjusted_eft_date: date!
    adjustment_reason: String
  ): PayrollDate

  # Bulk Operations
  bulkUpdatePayrollDates(
    payroll_ids: [ID!]!
    date_adjustments: [DateAdjustmentInput!]!
  ): PayrollAssignmentResponse!

  # Leave Management
  createLeave(
    user_id: ID!
    start_date: date!
    end_date: date!
    leave_type: String!
    reason: String
  ): Leave

  updateLeaveStatus(leave_id: ID!, status: String!, approved_by: ID): Leave
}
```

### Supporting Input Types for Mutations

```graphql
input DateAdjustmentInput {
  payroll_date_id: ID!
  new_adjusted_eft_date: date!
  adjustment_reason: String
}
```

## Subscription Types

```graphql
type Subscription {
  # Real-time updates for payroll changes
  payrollAssignmentUpdated(
    consultant_id: ID
    date_range: DateRangeInput
  ): Payroll

  # Leave status changes
  leaveStatusChanged(user_id: ID): Leave

  # Holiday updates
  holidaysUpdated(country_code: String): Holiday
}

input DateRangeInput {
  start_date: date!
  end_date: date!
}
```

## Scalar Types

```graphql
# Custom scalar types used in the schema
scalar date
scalar timestamptz
```

## Example Queries Used by the Component

### 1. GET_PAYROLLS_BY_MONTH

```graphql
query GetPayrollsByMonth($start_date: date!, $end_date: date!) {
  payrolls(start_date: $start_date, end_date: $end_date) {
    id
    name
    employee_count
    processing_time
    client {
      id
      name
    }
    userByPrimaryConsultantUserId {
      id
      name
      leaves {
        id
        start_date
        end_date
        leave_type
        reason
        status
      }
    }
    userByBackupConsultantUserId {
      id
      name
      leaves {
        id
        start_date
        end_date
        leave_type
        reason
        status
      }
    }
    payroll_dates {
      id
      original_eft_date
      adjusted_eft_date
      processing_date
      cutoff_date
      pay_period_start
      pay_period_end
      is_holiday_adjusted
      adjustment_reason
    }
  }
}
```

### 2. GET_HOLIDAYS

```graphql
query GetHolidays($start_date: date, $end_date: date) {
  holidays(start_date: $start_date, end_date: $end_date) {
    id
    date
    local_name
    english_name
    types
    region
    country_code
    is_public
  }
}
```

### 3. COMMIT_PAYROLL_ASSIGNMENTS

```graphql
mutation CommitPayrollAssignments($changes: [PayrollAssignmentInput!]!) {
  commitPayrollAssignments(changes: $changes) {
    success
    message
    errors
    affected_payrolls {
      id
      name
      userByPrimaryConsultantUserId {
        id
        name
      }
      userByBackupConsultantUserId {
        id
        name
      }
    }
  }
}
```

## Database Considerations

### Required Tables

1. **users** - Consultant/user information
2. **clients** - Client information
3. **payrolls** - Payroll records
4. **payroll_dates** - Individual payroll processing dates
5. **leaves** - Consultant leave records
6. **holidays** - Holiday calendar data

### Key Relationships

- Payrolls → Users (primary_consultant_user_id, backup_consultant_user_id)
- Payrolls → Clients (client_id)
- PayrollDates → Payrolls (payroll_id)
- Leaves → Users (user_id)

### Indexes Recommended

```sql
-- Performance indexes for common queries
CREATE INDEX idx_payrolls_consultant_dates ON payrolls(primary_consultant_user_id);
CREATE INDEX idx_payroll_dates_adjusted_eft ON payroll_dates(adjusted_eft_date);
CREATE INDEX idx_leaves_user_dates ON leaves(user_id, start_date, end_date);
CREATE INDEX idx_holidays_date ON holidays(date);
CREATE INDEX idx_payroll_dates_payroll_id ON payroll_dates(payroll_id);
```

## Authentication & Authorization

The schema assumes JWT-based authentication with Clerk + Hasura integration:

- All operations require valid JWT token
- User roles should be checked for modification operations
- Consultants can only view/modify their assigned payrolls
- Admins have full access to all operations

## Error Handling

The mutations return structured responses with:

- `success`: Boolean indicating operation success
- `message`: Human-readable success/error message
- `errors`: Array of specific error details
- `affected_payrolls`: Updated payroll records when successful

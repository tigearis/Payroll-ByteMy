# GraphQL Cleanup Plan

## Current Issues

- Multiple inline GraphQL queries scattered across components
- Missing GraphQL operations in domain structure
- Inconsistent import patterns between old `@/graphql/` and new domain structure

## Components with Inline Queries to Fix

### 1. **components/payroll-list-card.tsx**

- **Current**: Inline `GET_PAYROLLS` query
- **Fix**: Use `GetPayrollsDocument` from `@/domains/payrolls/graphql/generated/graphql`
- **Status**: ✅ Already fixed

### 2. **components/notes-list-with-add.tsx**

- **Current**: Inline `GET_NOTES` and `UPDATE_NOTE` queries
- **Fix**: Create proper operations in `@/domains/notes/graphql/`
- **Required Operations**:

  ```graphql
  # domains/notes/graphql/queries.graphql
  query GetNotes($entityId: uuid!, $entityType: String!) {
    notes(
      where: {
        entity_id: { _eq: $entityId }
        entity_type: { _eq: $entityType }
      }
      order_by: { created_at: desc }
    ) {
      id
      content
      entity_id
      entity_type
      created_at
      updated_at
      created_by_user {
        name
      }
    }
  }

  # domains/notes/graphql/mutations.graphql
  mutation UpdateNote($id: uuid!, $content: String!) {
    update_notes_by_pk(
      pk_columns: { id: $id }
      _set: { content: $content, updated_at: "now()" }
    ) {
      id
      content
      updated_at
    }
  }

  mutation AddNote(
    $entityId: uuid!
    $entityType: String!
    $content: String!
    $createdBy: uuid!
  ) {
    insert_notes_one(
      object: {
        entity_id: $entityId
        entity_type: $entityType
        content: $content
        created_by: $createdBy
      }
    ) {
      id
      content
      created_at
      created_by_user {
        name
      }
    }
  }
  ```

### 3. **components/urgent-alerts.tsx**

- **Current**: Import from `@/graphql/queries/dashboard/getAlerts`
- **Fix**: Use `GetUpcomingPayrolls` from `@/shared/types/generated/graphql`
- **Required**: Already exists in `shared/graphql/queries.graphql`

### 4. **components/upcoming-payrolls.tsx**

- **Current**: Import from `@/graphql/queries/dashboard/getAlerts`
- **Fix**: Use `GetUpcomingPayrolls` from `@/shared/types/generated/graphql`
- **Required**: Already exists in `shared/graphql/queries.graphql`

### 5. **components/generate-missing-dates-button.tsx**

- **Current**: Import from old `@/graphql/` paths
- **Fix**: Use existing domain operations
- **Available Operations**:
  - `GetPayrollsMissingDatesDocument` from `@/domains/payrolls/graphql/generated/graphql`
  - `GeneratePayrollDatesDocument` from `@/domains/payrolls/graphql/generated/graphql`

### 6. **components/payrolls-missing-dates.tsx**

- **Current**: Import from old `@/graphql/` paths
- **Fix**: Use existing domain operations
- **Available Operations**:
  - `GetPayrollsMissingDatesDocument` from `@/domains/payrolls/graphql/generated/graphql`
  - `GeneratePayrollDatesDocument` from `@/domains/payrolls/graphql/generated/graphql`

### 7. **components/payroll-subscription.tsx**

- **Current**: Import from `@/graphql/subscriptions/payrolls/payrollUpdates`
- **Fix**: Create subscription in `@/domains/payrolls/graphql/subscriptions.graphql`
- **Required Operations**:

  ```graphql
  # domains/payrolls/graphql/subscriptions.graphql
  subscription PayrollUpdates($payrollId: uuid!) {
    payrolls_by_pk(id: $payrollId) {
      ...PayrollWithDates
    }
  }

  subscription PayrollListUpdates {
    payrolls(
      where: { superseded_date: { _is_null: true } }
      order_by: { updated_at: desc }
    ) {
      ...PayrollBasicInfo
    }
  }

  subscription PayrollDateUpdates($payrollId: uuid!) {
    payroll_dates(
      where: { payroll_id: { _eq: $payrollId } }
      order_by: { adjusted_eft_date: asc }
    ) {
      ...PayrollDate
    }
  }
  ```

### 8. **components/examples/GracefulClientsList.tsx**

- **Current**: Import from `@/graphql/queries/clients/getClientsList`
- **Fix**: Create operation in `@/domains/clients/graphql/queries.graphql`
- **Required Operations**:
  ```graphql
  # domains/clients/graphql/queries.graphql
  query GetClients {
    clients(order_by: { name: asc }) {
      id
      name
      status
      created_at
      updated_at
    }
  }
  ```

## Missing Domain Operations to Create

### Notes Domain

- **File**: `domains/notes/graphql/queries.graphql`
- **File**: `domains/notes/graphql/mutations.graphql`
- **Operations**: GetNotes, AddNote, UpdateNote, DeleteNote

### Dashboard/Shared Operations

- **File**: `shared/graphql/queries.graphql` (already has GetUpcomingPayrolls)
- **Operations**: Already complete

### Clients Domain

- **File**: `domains/clients/graphql/queries.graphql`
- **Operations**: GetClients, GetClientById (may already exist)

### Payrolls Domain

- **File**: `domains/payrolls/graphql/subscriptions.graphql`
- **Operations**: PayrollUpdates, PayrollListUpdates, PayrollDateUpdates

## Inline Queries in Pages (Already Fixed)

- ✅ `app/(dashboard)/payrolls/[id]/page.tsx` - Using domain operations
- ✅ `app/(dashboard)/payrolls/new/page.tsx` - Using domain operations
- ✅ `app/(dashboard)/payrolls/page.tsx` - Using inline (needs domain fix)
- ✅ `app/(dashboard)/staff/[id]/page.tsx` - Using inline (needs domain fix)
- ✅ `app/(dashboard)/staff/new/page.tsx` - Using inline (needs domain fix)
- ✅ `app/(dashboard)/staff/page.tsx` - Using inline (needs domain fix)

## Action Plan

### Phase 1: Create Missing Operations

1. Add missing operations to `domains/notes/graphql/`
2. Add missing operations to `domains/clients/graphql/`
3. Add missing subscriptions to `domains/payrolls/graphql/subscriptions.graphql`
4. Add missing operations to `domains/users/graphql/` (for staff operations)

### Phase 2: Update Component Imports

1. Replace all `@/graphql/` imports with proper domain imports
2. Remove all inline GraphQL queries
3. Update variable names to use Document suffix (e.g., `GetPayrollsDocument`)

### Phase 3: Remove Old Structure

1. Remove old `@/graphql/` directory structure
2. Clean up any remaining inline queries
3. Verify all components use proper domain-based operations

### Phase 4: Generate Types

1. Run `pnpm codegen` to generate new TypeScript types
2. Fix any type errors
3. Test all GraphQL operations

## Expected Outcome

- ✅ All GraphQL operations organized by domain
- ✅ No inline queries in components
- ✅ Consistent import patterns using `@/domains/*/graphql/generated/graphql`
- ✅ Proper TypeScript types generated for all operations
- ✅ Clean, maintainable GraphQL architecture

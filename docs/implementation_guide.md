# Implementation Guide for Advanced Payroll Scheduler

## Quick Start: Get Data Loading First

### Step 1: Test Your Current Data Structure

First, let's verify what data you actually have. Add this temporary debugging component:

```typescript
// DebugDataViewer.tsx
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const DEBUG_QUERY = gql`
  query DebugQuery {
    payrolls(limit: 5) {
      id
      name
      employee_count
      processing_time
      status
    }
    payroll_dates(limit: 10) {
      id
      payroll_id
      original_eft_date
      adjusted_eft_date
      processing_date
    }
    users(limit: 5) {
      id
      name
      email
    }
    holidays(limit: 5) {
      id
      date
      local_name
    }
  }
`;

export function DebugDataViewer() {
  const { data, loading, error } = useQuery(DEBUG_QUERY);

  if (loading) return <div>Loading debug data...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3>Debug Data Structure</h3>
      <pre className="text-xs overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
```

### Step 2: Database Schema Validation

Based on your JSON files, here's what your database structure should look like:

```sql
-- Verify your tables exist with correct structure
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('payrolls', 'payroll_dates', 'users', 'leaves', 'holidays')
ORDER BY table_name, ordinal_position;

-- Check for foreign key relationships
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('payrolls', 'payroll_dates', 'users', 'leaves');
```

### Step 3: Hasura Configuration

Ensure your Hasura relationships are set up correctly:

```json
// In Hasura Console -> Data -> [table] -> Relationships

// For payrolls table:
{
  "name": "userByPrimaryConsultantUserId",
  "using": {
    "foreign_key_constraint_on": "primary_consultant_user_id"
  }
}

{
  "name": "userByBackupConsultantUserId",
  "using": {
    "foreign_key_constraint_on": "backup_consultant_user_id"
  }
}

{
  "name": "client",
  "using": {
    "foreign_key_constraint_on": "client_id"
  }
}

{
  "name": "payroll_dates",
  "using": {
    "foreign_key_constraint_on": {
      "column": "payroll_id",
      "table": "payroll_dates"
    }
  }
}

// For payroll_dates table:
{
  "name": "payroll",
  "using": {
    "foreign_key_constraint_on": "payroll_id"
  }
}

// For users table:
{
  "name": "leaves",
  "using": {
    "foreign_key_constraint_on": {
      "column": "user_id",
      "table": "leaves"
    }
  }
}
```

### Step 4: Data Migration

Based on your JSON files, here's a migration script to populate your database:

```sql
-- Insert sample data based on your JSON files

-- Users (Consultants)
INSERT INTO users (id, name, email, role) VALUES
('22a368d4-5d3f-4026-840c-55af6fb16972', 'Jim Consultant', 'consultant@example.com', 'consultant'),
('7898704c-ee5c-4ade-81f3-80a4388413fb', 'Test User', 'nathan.harris@invenco.net', 'consultant')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Clients
INSERT INTO clients (id, name) VALUES
(gen_random_uuid(), 'Bluewave Consulting'),
(gen_random_uuid(), 'Zenith Solutions'),
(gen_random_uuid(), 'Acme Pty Ltd'),
(gen_random_uuid(), 'Greenfields Group'),
(gen_random_uuid(), 'Redstone Holdings')
ON CONFLICT (name) DO NOTHING;

-- Payrolls (using your JSON data structure)
INSERT INTO payrolls (
  id, name, employee_count, processing_time, status,
  client_id, primary_consultant_user_id, backup_consultant_user_id
)
SELECT
  '2b70eb57-bd0f-4b4c-9341-870fb9df1f60'::uuid,
  'Quarterly Payroll - 1st',
  89,
  1,
  'Active',
  (SELECT id FROM clients WHERE name = 'Bluewave Consulting'),
  '22a368d4-5d3f-4026-840c-55af6fb16972'::uuid,
  '7898704c-ee5c-4ade-81f3-80a4388413fb'::uuid
WHERE NOT EXISTS (SELECT 1 FROM payrolls WHERE id = '2b70eb57-bd0f-4b4c-9341-870fb9df1f60');

-- Continue for other payrolls...

-- Payroll Dates (from your console data)
INSERT INTO payroll_dates (id, payroll_id, original_eft_date, adjusted_eft_date, processing_date)
VALUES
('bcf6c6f4-46f0-47a1-b8f8-94c1630de202', '2b70eb57-bd0f-4b4c-9341-870fb9df1f60', '2025-06-01', '2025-05-30', '2025-05-23'),
('9434cc1e-8925-4857-807e-3284e8243f16', 'd619e823-c753-425c-88e4-5e797d2bff48', '2025-06-01', '2025-05-30', '2025-05-27')
-- Continue for other dates...
ON CONFLICT (id) DO NOTHING;

-- Leaves
INSERT INTO leaves (id, user_id, start_date, end_date, leave_type, status) VALUES
('leave-1', '22a368d4-5d3f-4026-840c-55af6fb16972', '2025-06-02', '2025-06-05', 'Sick', 'approved'),
('leave-2', '22a368d4-5d3f-4026-840c-55af6fb16972', '2025-06-12', '2025-06-15', 'Annual', 'approved'),
('leave-3', '7898704c-ee5c-4ade-81f3-80a4388413fb', '2025-06-01', '2025-06-14', 'Annual', 'approved')
ON CONFLICT (id) DO NOTHING;

-- Holidays (from your CSV)
INSERT INTO holidays (id, date, local_name, name, country_code, region, is_fixed, is_global)
SELECT
  gen_random_uuid(),
  '2025-06-02'::date,
  'Western Australia Day',
  'Western Australia Day',
  'AU',
  'WA',
  true,
  false
WHERE NOT EXISTS (SELECT 1 FROM holidays WHERE date = '2025-06-02' AND region = 'WA');
```

## Step 5: Updated React Component Integration

Replace your existing query with this simplified version:

```typescript
// In your component file
const GET_PAYROLL_DATA_FIXED = gql`
  query GetPayrollData($start_date: date!, $end_date: date!) {
    payrolls(where: { status: { _eq: "Active" } }) {
      id
      name
      employee_count
      processing_time
      status
      client {
        id
        name
      }
      userByPrimaryConsultantUserId {
        id
        name
        leaves(
          where: {
            status: { _eq: "approved" }
            start_date: { _lte: $end_date }
            end_date: { _gte: $start_date }
          }
        ) {
          id
          start_date
          end_date
          leave_type
          status
        }
      }
      userByBackupConsultantUserId {
        id
        name
        leaves(
          where: {
            status: { _eq: "approved" }
            start_date: { _lte: $end_date }
            end_date: { _gte: $start_date }
          }
        ) {
          id
          start_date
          end_date
          leave_type
          status
        }
      }
    }

    payroll_dates(
      where: { adjusted_eft_date: { _gte: $start_date, _lte: $end_date } }
    ) {
      id
      payroll_id
      original_eft_date
      adjusted_eft_date
      processing_date
      payroll {
        id
        name
        employee_count
        processing_time
        client {
          name
        }
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

    holidays(where: { date: { _gte: $start_date, _lte: $end_date } }) {
      id
      date
      local_name
      name
      country_code
      region
    }
  }
`;
```

## Debugging Checklist

### 1. GraphQL Endpoint Issues

```bash
# Test your GraphQL endpoint directly
curl -X POST \
  http://localhost:8080/v1/graphql \
  -H 'Content-Type: application/json' \
  -H 'x-hasura-admin-secret: your-admin-secret' \
  -d '{
    "query": "query { payrolls(limit: 1) { id name } }"
  }'
```

### 2. Date Format Issues

```typescript
// Ensure consistent date formatting
const formatDateForGraphQL = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

// Test with explicit dates first
const testVariables = {
  start_date: "2025-05-01",
  end_date: "2025-06-30",
};
```

### 3. Hasura Permissions

```sql
-- Check if your user role has proper permissions
-- In Hasura Console -> Data -> [table] -> Permissions
-- Ensure your role (user/anonymous) can select the required fields
```

### 4. Console Logging

```typescript
// Add extensive logging to understand data flow
useEffect(() => {
  console.log("🔍 Query Variables:", {
    start_date: format(dateRange.start, "yyyy-MM-dd"),
    end_date: format(dateRange.end, "yyyy-MM-dd"),
  });
}, [dateRange]);

// In the onCompleted callback:
onCompleted: data => {
  console.log("📊 Raw GraphQL Response:", data);
  console.log("📊 Payrolls:", data?.payrolls?.length || 0);
  console.log("📊 Payroll Dates:", data?.payroll_dates?.length || 0);
  console.log("📊 Holidays:", data?.holidays?.length || 0);

  // Log first few items for structure verification
  if (data?.payrolls?.length > 0) {
    console.log("📊 First Payroll:", data.payrolls[0]);
  }
  if (data?.payroll_dates?.length > 0) {
    console.log("📊 First Payroll Date:", data.payroll_dates[0]);
  }
};
```

## Testing Strategy

### 1. Start with Static Data

```typescript
// Test with hardcoded data first
const TEST_DATA = {
  payrolls: [
    /* your JSON data */
  ],
  payroll_dates: [
    /* your JSON data */
  ],
  holidays: [],
};

// Use this in your component temporarily
// const { data, loading, error } = { data: TESTdata, loading: false, error: null };
```

### 2. Progressive Enhancement

1. Get static data rendering ✅
2. Get GraphQL query working ✅
3. Add drag-and-drop functionality ✅
4. Add ghost assignments ✅
5. Add commit functionality ✅

### 3. Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h2>Something went wrong:</h2>
      <pre className="text-sm">{error.message}</pre>
    </div>
  );
}

// Wrap your component
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <AdvancedPayrollScheduler />
</ErrorBoundary>
```

## Next Steps

1. **Start with the DebugDataViewer** to verify your data structure
2. **Check Hasura relationships** using the GraphiQL explorer
3. **Test the simplified query** with known date ranges
4. **Add progressive logging** to understand where data breaks
5. **Implement the mutation** once data loading works

Once you have data loading reliably, the drag-and-drop and ghost functionality should work much better with the simplified state management in the updated component.

Let me know what specific errors you encounter and I can provide more targeted debugging assistance!

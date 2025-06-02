# Hasura Action Setup for Payroll Scheduler

## 1. Create API Route Handler

First, create the API route that will handle the action:

**File: `app/api/commit-payroll-assignments/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { commitPayrollAssignments } from "../../../backend_resolver";

export async function POST(request: NextRequest) {
  try {
    // Extract the request body
    const body = await request.json();

    // Create a mock Express request/response for the resolver
    const mockReq = {
      body,
      headers: Object.fromEntries(request.headers.entries()),
    } as any;

    let responseData: any;
    const mockRes = {
      json: (data: any) => {
        responseData = data;
      },
      status: (code: number) => ({
        json: (data: any) => {
          responseData = data;
        },
      }),
    } as any;

    // Call the resolver
    await commitPayrollAssignments(mockReq, mockRes);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Action handler error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## 2. Add Custom Types in Hasura Console

Go to **Hasura Console > Actions > Custom Types** and add:

```graphql
input PayrollAssignmentInput {
  payrollId: String!
  fromConsultantId: String!
  toConsultantId: String!
  date: String!
}

type AffectedAssignment {
  id: String!
  payroll_date_id: String!
  original_consultant_id: String!
  new_consultant_id: String!
  adjusted_eft_date: String!
}

type CommitPayrollAssignmentsOutput {
  success: Boolean!
  message: String
  errors: [String!]
  affected_assignments: [AffectedAssignment!]
}
```

## 3. Create Action in Hasura Console

Go to **Hasura Console > Actions > Create**

**Action Definition:**

```graphql
type Mutation {
  commitPayrollAssignments(
    changes: [PayrollAssignmentInput!]!
  ): CommitPayrollAssignmentsOutput
}
```

**Handler Configuration:**

- **URL:** `http://localhost:3000/api/commit-payroll-assignments` (for local dev)
- **URL:** `https://your-domain.com/api/commit-payroll-assignments` (for production)

**Headers:**

```
Content-Type: application/json
```

**Request Transform (optional):**

```json
{
  "input": {
    "changes": {{$body.input.changes}}
  },
  "user_id": "{{$session_variables['x-hasura-user-id']}}"
}
```

## 4. Set Permissions

Go to **Actions > commitPayrollAssignments > Permissions**

- **Role:** `user` (or whatever role your consultants have)
- **Custom Logic:** Leave empty (uses default session variables)

## 5. Test the Action

You can test the action in the GraphiQL explorer:

```graphql
mutation TestCommitAssignments {
  commitPayrollAssignments(
    changes: [
      {
        payrollId: "test-payroll-id"
        fromConsultantId: "old-consultant-id"
        toConsultantId: "new-consultant-id"
        date: "2024-06-15"
      }
    ]
  ) {
    success
    message
    errors
    affected_assignments {
      id
      payroll_date_id
      original_consultant_id
      new_consultant_id
      adjusted_eft_date
    }
  }
}
```

## 6. Environment Variables

Make sure these are set in your `.env.local`:

```env
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_HASURA_GRAPHQL_URL=your_hasura_endpoint
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_admin_secret
```

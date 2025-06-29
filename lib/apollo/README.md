# Apollo Query Helpers

Clean, type-safe GraphQL operations for API routes using Apollo Client.

## Usage

### Supported Operations

- ✅ **Queries** - Data fetching with `executeTypedQuery`
- ✅ **Mutations** - Data modification with `executeTypedMutation`  
- ✅ **Hasura Actions** - Custom business logic (use `executeTypedMutation`)
- ❌ **Subscriptions** - Not supported in API routes (use client-side `useSubscription`)

### Basic Query

```typescript
// app/api/example/route.ts
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { GetItemsDocument, type GetItemsQuery } from '@/domains/items/graphql/generated/graphql';
import { withAuth } from '@/lib/auth/api-auth';

export const GET = withAuth(async () => {
  const data = await executeTypedQuery<GetItemsQuery>(GetItemsDocument);
  return NextResponse.json({ items: data.items });
});
```

### Query with Variables

```typescript
export const GET = withAuth(async (req, { params }) => {
  const { id } = await params;
  
  const data = await executeTypedQuery<GetItemByIdQuery>(
    GetItemByIdDocument,
    { id }
  );
  
  return NextResponse.json({ item: data.itemById });
});
```

### Mutation

```typescript
import { executeTypedMutation } from '@/lib/apollo/query-helpers';

export const POST = withAuth(async (req) => {
  const input = await req.json();
  
  const data = await executeTypedMutation<CreateItemMutation>(
    CreateItemDocument,
    { input }
  );
  
  return NextResponse.json({ item: data.createItem });
});
```

### Hasura Action

```typescript
// Hasura actions are mutations, so use executeTypedMutation
export const POST = withAuth(async (req) => {
  const input = await req.json();
  
  const data = await executeTypedMutation<CommitPayrollAssignmentsMutation>(
    CommitPayrollAssignmentsDocument,
    { input }
  );
  
  return NextResponse.json({ result: data.commitPayrollAssignments });
});
```

### Subscriptions (Client-Side Only)

```typescript
// ❌ NOT in API routes - use in React components
import { useRealTimeSubscription } from '@/hooks/use-subscription';

function PayrollUpdates() {
  const { data } = useRealTimeSubscription({
    document: PayrollSubscriptionDocument,
    variables: { userId },
    refetchQueries: [GetPayrollsDocument]
  });
}
```

## Benefits

- ✅ **2 lines instead of 15+** - Handles auth, context, errors automatically
- ✅ **Full TypeScript safety** - Uses generated GraphQL types
- ✅ **Consistent auth** - Uses `getHasuraToken()` and server context
- ✅ **Error handling** - Proper GraphQL and auth error handling
- ✅ **Apollo features** - Maintains caching, dev tools, subscriptions

## Migration

### Before (Old Pattern)
```typescript
export const GET = withAuth(async () => {
  const { token, error } = await getHasuraToken();
  if (!token) return NextResponse.json({ error }, { status: 401 });
  
  const client = serverApolloClient;
  const { data } = await client.query({
    query: GetItemsDocument,
    context: {
      context: "server",
      headers: { authorization: `Bearer ${token}` },
    },
  });
  
  return NextResponse.json({ items: data.items });
});
```

### After (New Pattern)
```typescript
export const GET = withAuth(async () => {
  const data = await executeTypedQuery<GetItemsQuery>(GetItemsDocument);
  return NextResponse.json({ items: data.items });
});
```

## Advanced Options

```typescript
// Custom fetch policy
const data = await executeTypedQuery(
  GetItemsDocument,
  variables,
  { fetchPolicy: 'network-only' }
);

// Additional context
const data = await executeTypedMutation(
  CreateItemDocument,
  variables,
  { context: { customHeader: 'value' } }
);
```
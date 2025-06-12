# 🔧 Clerk + Hasura JWT Template Setup Guide

## Problem

Your JWT token is missing Hasura claims (`x-hasura-user-id`, `x-hasura-default-role`, `x-hasura-allowed-roles`), which means the Clerk JWT template isn't configured properly.

## ⚠️ **CRITICAL: User ID Mapping Issue**

**The main issue**: Your JWT template is passing the **Clerk User ID** as `x-hasura-user-id`, but your Hasura permissions expect the **database UUID**.

From your logs:

```bash
✅ Verified Clerk metadata sync: databaseId = 7898704c-ee5c-4ade-81f3-80a4388413fb
⚠️ Invalid or missing hasura user ID for user_2xqIdBcPJWbPsMg75NIdsElmoUT: user_2xqIdBcPJWbPsMg75NIdsElmoUT
```

The sync is working perfectly, but the JWT template is wrong.

## **🔧 Correct Solution**

### Step 1: Fix Your JWT Template in Clerk Dashboard

Go to your [Clerk Dashboard → JWT Templates](https://dashboard.clerk.com/last-active?path=jwt-templates)

**CURRENT (Wrong) Template:**

```json
{
  "https://hasura.io/jwt/claims": {
    "x-hasura-default-role": "{{user.public_metadata.role}}",
    "x-hasura-allowed-roles": ["admin", "manager", "consultant", "viewer"],
    "x-hasura-user-id": "{{user.id}}" // ❌ This is the Clerk ID!
  }
}
```

**CORRECT Template:**

```json
{
  "https://hasura.io/jwt/claims": {
    "x-hasura-default-role": "{{user.public_metadata.role}}",
    "x-hasura-allowed-roles": ["admin", "manager", "consultant", "viewer"],
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}" // ✅ Use database UUID!
  }
}
```

### Step 2: Verify Apollo Client Configuration

Your Apollo Client is correctly configured per the [Nhost documentation](https://clerk.com/docs/integrations/databases/nhost#configure-your-graph-ql-client):

```typescript
// lib/apollo-client.ts
const authLink = setContext(async (_, { headers }) => {
  const token = await getToken({ template: "hasura" });
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
```

This matches the pattern from the Nhost docs:

```typescript
const authMiddleware = setContext(async (req, { headers }) => {
  const token = await getToken({ template: "template" });
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});
```

### Step 3: Test the Fix

After updating the JWT template, test it:

1. **Clear your browser cookies/localStorage** (to force new token generation)
2. **Sign out and sign back in**
3. **Check the debug endpoint**: `/api/debug/jwt-info`
4. **Verify the token contains the database UUID**

## **🧪 How to Test**

Create this test endpoint to verify the fix:

```typescript
// app/api/debug/token-test/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, getToken } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" });
  }

  const token = await getToken({ template: "hasura" });

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const hasuraClaims = payload["https://hasura.io/jwt/claims"];

    return NextResponse.json({
      clerkUserId: userId,
      hasuraUserId: hasuraClaims?.["x-hasura-user-id"],
      role: hasuraClaims?.["x-hasura-default-role"],
      isCorrect: hasuraClaims?.["x-hasura-user-id"] !== userId,
    });
  }

  return NextResponse.json({ error: "No token found" });
}
```

## **📋 Checklist**

- [ ] Update JWT template to use `{{user.public_metadata.databaseId}}`
- [ ] Clear browser cookies
- [ ] Sign out and sign back in
- [ ] Test with debug endpoint
- [ ] Verify GraphQL queries work
- [ ] Remove debug endpoints

## **Expected Result**

After the fix, your token should contain:

```json
{
  "https://hasura.io/jwt/claims": {
    "x-hasura-user-id": "7898704c-ee5c-4ade-81f3-80a4388413fb", // ✅ Database UUID
    "x-hasura-default-role": "consultant",
    "x-hasura-allowed-roles": ["admin", "manager", "consultant", "viewer"]
  }
}
```

And your logs should show:

```bash
✅ Authenticated user with correct database UUID: 7898704c-ee5c-4ade-81f3-80a4388413fb
```

## 🔍 System Architecture

### Database Design

```sql
-- Users table with proper UUID primary key
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- ✅ Used in JWT
  clerk_user_id TEXT UNIQUE,                      -- Clerk ID mapping
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role DEFAULT 'viewer',
  -- ... other fields
);
```

### Hasura Permissions

```yaml
# Fast UUID-based permissions
filter:
  id:
    _eq: X-Hasura-User-Id  # Direct primary key lookup

# Or for manager relationships
filter:
  manager_id:
    _eq: X-Hasura-User-Id  # Direct foreign key lookup
```

### Performance Benefit

```sql
-- With Database UUID (FAST) ✅
SELECT * FROM payrolls WHERE manager_user_id = $hasura_user_id;

-- With Clerk ID (SLOW) ❌
SELECT * FROM payrolls WHERE manager_user_id IN (
  SELECT id FROM users WHERE clerk_user_id = $hasura_user_id
);
```

## 🔍 Troubleshooting

### Automatic Sync Not Working?

1. **Check middleware logs**: Look for JWT validation warnings
2. **Verify template name**: Must be exactly `hasura` (lowercase)
3. **Test sync endpoint**: Call `/api/auth/sync-user` manually
4. **Check Clerk metadata**: Ensure `databaseId` exists

### Token Still Has Wrong User ID?

1. **Clear all sessions**: Sign out and back in completely
2. **Check database**: Ensure user exists with Clerk ID
3. **Verify sync logs**: Look for sync success/failure messages
4. **Manual metadata update**: Set `databaseId` directly in Clerk

### Database Queries Failing?

1. **Check Hasura permissions**: Ensure they use `id` field (not `clerk_user_id`)
2. **Verify JWT claims**: Use developer page to inspect token
3. **Test direct query**: Use Hasura console with proper headers

## 🚨 **Why This Approach is Superior**

### **Performance**

- Direct UUID lookups vs string-based joins
- Optimized database queries
- Faster permission checks

### **Reliability**

- Auto-healing sync system
- Middleware validation on every request
- Graceful degradation on sync failures

### **Architecture**

- Clean separation of concerns
- Proper foreign key relationships
- Scalable for complex queries

### **Developer Experience**

- Automatic problem detection
- Self-healing system
- Clear error messages and debugging

## 📚 Additional Resources

- [Clerk JWT Templates Documentation](https://clerk.com/docs/integrations/jwt-templates)
- [Hasura JWT Authentication](https://hasura.io/docs/latest/auth/authentication/jwt/)
- [Clerk + Hasura Integration Guide](https://clerk.com/docs/integrations/databases/hasura)

## 🚨 **Important Notes**

1. **Never use Clerk ID as primary key** in database operations
2. **Always validate UUID format** before database queries
3. **Store mapping in metadata** for reliable JWT claims
4. **Test thoroughly** after any auth changes

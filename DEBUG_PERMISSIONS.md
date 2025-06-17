# 🔧 Debug GraphQL Permission Issues

## Error Analysis
You're getting `field 'role' not found in type: 'users'` and `field 'email' not found in type: 'users'` errors. This indicates a **permission issue** - the current user doesn't have access to these fields.

## 🔍 Debugging Steps

### Step 1: Check Current User Role
First, let's see what role the current user has:

1. **Open Browser Developer Tools** (F12)
2. **Go to Application/Storage tab**
3. **Find Clerk session data** or check JWT token
4. **Look for role in the JWT claims**

### Step 2: Verify JWT Token
Check the JWT token contains the correct role:

1. **Go to Developer Tools → Network tab**
2. **Find a GraphQL request**
3. **Check the Authorization header**
4. **Decode the JWT token** at [jwt.io](https://jwt.io)
5. **Verify these claims exist:**
   ```json
   {
     "https://hasura.io/jwt/claims": {
       "x-hasura-role": "developer",  // or other role
       "x-hasura-allowed-roles": ["developer", "org_admin", "manager", "consultant", "viewer"],
       "x-hasura-user-id": "your-user-id"
     }
   }
   ```

### Step 3: Check User Role in Clerk
In Clerk Dashboard:

1. **Go to Users section**
2. **Find your user**
3. **Check public_metadata.role**
4. **Should be set to "developer" for full access**

### Step 4: Verify Hasura Metadata Applied
Run this command to apply metadata:
```bash
hasura metadata apply
```

### Step 5: Test with Different Role
If you don't have developer role, try with roles that should work:
- `org_admin` - should have access to role and email fields
- `manager` - should have access to role and email fields  
- `consultant` - should have access to role and email fields

## 🛠️ Quick Fixes

### Fix 1: Update User Role in Clerk
If your user doesn't have the developer role:

1. **Go to Clerk Dashboard → Users**
2. **Click on your user**
3. **Edit public metadata:**
   ```json
   {
     "role": "developer"
   }
   ```
4. **Save changes**
5. **Sign out and sign back in**

### Fix 2: Apply Hasura Metadata
Make sure the latest permissions are applied:
```bash
cd /path/to/hasura
hasura metadata apply
```

### Fix 3: Force Token Refresh
In your app:
1. **Sign out completely**
2. **Clear browser cache/storage**
3. **Sign back in**
4. **Try the query again**

## 📋 Expected Permissions by Role

| Role | Can Access `role` field | Can Access `email` field |
|------|------------------------|---------------------------|
| `viewer` | ❌ No | ❌ No |
| `consultant` | ✅ Yes | ✅ Yes |
| `manager` | ✅ Yes | ✅ Yes |
| `org_admin` | ✅ Yes | ✅ Yes |
| `developer` | ✅ Yes | ✅ Yes |

## 🎯 Most Likely Solution

**The current user probably doesn't have the "developer" role assigned in Clerk.** 

To fix:
1. Update the user's `public_metadata.role` to `"developer"` in Clerk Dashboard
2. Sign out and sign back in
3. The GraphQL queries should work

## 🔧 Alternative: Test with Existing Admin User

If you have a user that previously had admin access:
1. **Update their role** from `"admin"` to `"developer"` in Clerk
2. **Sign in as that user**
3. **Test the queries**

---

**Need more help?** Share the decoded JWT token content (without sensitive data) to help diagnose the exact permission issue.
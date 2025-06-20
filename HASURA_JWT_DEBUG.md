# 🔧 Hasura JWT Template Debug Guide

## ✅ Code Verification
The code is **correctly** requesting the Hasura template:
- ✅ Apollo Client: `getToken({ template: "hasura" })`
- ✅ Server Apollo: `getToken({ template: "hasura" })`
- ✅ Token Manager: `getToken({ template: 'hasura' })`
- ✅ API Routes: `getToken({ template: "hasura" })`

## 🔍 Clerk Dashboard Debug Steps

### Step 1: Verify Template Name
1. Go to **Clerk Dashboard → JWT Templates**
2. **Check the template name** - it must be exactly `"hasura"` (lowercase)
3. If it's named differently (like "Hasura" or "hasura-template"), **rename it to "hasura"**

### Step 2: Verify Template Content
Your template should look **exactly** like this:

```json
{
  "https://hasura.io/jwt/claims": {
    "x-hasura-role": "{{user.public_metadata.role}}",
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": [
      "developer",
      "org_admin",
      "manager",
      "consultant",
      "viewer"
    ],
    "x-hasura-clerk-user-id": "{{user.id}}"
  }
}
```

### Step 3: Check User Metadata
1. Go to **Users → Your User**
2. **Public Metadata** should contain:
   ```json
   {
     "role": "developer",
     "databaseId": "your-database-uuid-here"
   }
   ```

### Step 4: Test JWT Template
In Clerk Dashboard:
1. **Go to JWT Templates → Your "hasura" template**
2. **Click "Test"**
3. **Select your user**
4. **Verify the output contains the Hasura claims**

Expected output:
```json
{
  "https://hasura.io/jwt/claims": {
    "x-hasura-role": "developer",
    "x-hasura-user-id": "your-database-uuid",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": ["developer", "org_admin", "manager", "consultant", "viewer"],
    "x-hasura-clerk-user-id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms"
  },
  // ... other standard JWT claims
}
```

## 🚨 Common Issues & Fixes

### Issue 1: Template Name Mismatch
**Problem**: Template is named "Hasura" instead of "hasura"
**Fix**: Rename template to exactly "hasura" (lowercase)

### Issue 2: Missing User Metadata
**Problem**: User doesn't have `public_metadata.role` set
**Fix**: Add this to user's public metadata:
```json
{
  "role": "developer",
  "databaseId": "get-this-from-your-database"
}
```

### Issue 3: Template Not Applied
**Problem**: Changes to template weren't saved
**Fix**: 
1. Make sure you clicked **"Save"** in Clerk Dashboard
2. **Sign out and sign back in** to get new token

### Issue 4: Wrong Template Variables
**Problem**: Template uses wrong variable names
**Fix**: Use exactly these variables:
- `{{user.public_metadata.role}}`
- `{{user.public_metadata.databaseId}}`
- `{{user.id}}`

## 🧪 Quick Test

### Test 1: Check JWT in Browser
1. **Open DevTools → Application → Storage**
2. **Find Clerk session data**
3. **Copy the JWT token**
4. **Decode at [jwt.io](https://jwt.io)**
5. **Look for "https://hasura.io/jwt/claims" section**

### Test 2: API Test
Make a request to your token endpoint:
```bash
curl -H "Cookie: your-session-cookie" http://localhost:3000/api/auth/token
```

Check the response token contains Hasura claims.

## 🎯 Most Likely Fix

**The template name is probably not exactly "hasura"**. Check that:
1. Template name is `hasura` (lowercase, no spaces)
2. Template contains the Hasura claims structure
3. User has `public_metadata.role = "developer"`
4. You've signed out and back in after making changes

---

**Next Step**: Share a screenshot of your Clerk Dashboard JWT Templates page so I can verify the setup!
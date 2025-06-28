# Get JWT Token Instructions

## 🎯 Easy Method: From Network Tab

1. **Open your app** in browser (localhost:3000)
2. **Open Dev Tools** (F12 or Cmd+Option+I)
3. **Go to Network tab**
4. **Refresh the page** or navigate around
5. **Filter by "graphql"** or "hasura"
6. **Click on any GraphQL request**
7. **Go to Headers section**
8. **Find "Authorization" header**
9. **Copy the value after "Bearer "**

## 📋 Example of what to look for:

```
Request Headers:
authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhenAiOiJodHRwczovL3BheXJvbGwuYXBwLmJ5dGVteS5jb20uYXUiLCJleHAiOjE3NTEwMjc2MTAsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMi...
```

**Copy this part:** `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhenAiOiJodHRwczovL3BheXJvbGwuYXBwLmJ5dGVteS5jb20uYXUiLCJleHAiOjE3NTEwMjc2MTAsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMi...`

## 🧪 Test Command:

```bash
# Replace TOKEN_HERE with your actual token
export TOKEN="TOKEN_HERE"

curl -X POST "https://bytemy.hasura.app/v1/graphql" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"query { auditLogs(limit: 2) { id action resourceType } }"}' \
  | jq '.'
```

## 🔍 Verify Your Token Format:

Your JWT should look like: `xxxxx.yyyyy.zzzzz` (three parts separated by dots)

Example: `eyJhbGc...eyJhen...SflKx`

## ⚠️ Common Issues:

1. **Token expired** - Get a fresh one by refreshing the app
2. **Wrong token format** - Should be three base64 parts with dots
3. **Missing "Bearer "** - Don't include "Bearer " in the token variable, it's added in the curl command

## 🎯 Quick Debug:

Test if your token is valid by decoding it:
```bash
echo "YOUR_TOKEN" | cut -d'.' -f2 | base64 -d | jq '.'
```

Should show your user info and roles.
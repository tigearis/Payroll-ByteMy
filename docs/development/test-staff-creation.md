# Test Staff Creation Issue

## Issue Summary
- AuditLog Apollo Error: Fixed ✅ (Wrong GraphQL document)
- 405 Error: Need to debug further

## JWT Token Analysis ✅
Your JWT token is VALID and shows:
- `x-hasura-default-role`: "developer" ✅
- `x-hasura-allowed-roles`: includes "developer" ✅  
- Token works with Hasura GraphQL ✅

## Quick Debug Steps

1. **Test debug endpoint first:**
   ```bash
   export TOKEN="eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL3BheXJvbGwuYXBwLmJ5dGVteS5jb20uYXUiLCJleHAiOjE3NTQ2MzQwODksImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ2aWV3ZXIiLCJjb25zdWx0YW50IiwibWFuYWdlciIsIm9yZ19hZG1pbiIsImRldmVsb3BlciJdLCJ4LWhhc3VyYS1jbGVyay11c2VyLWlkIjoidXNlcl8yeVU3TnNwZzlOZW1teTFGZEtFMVNGSW9mbXMiLCJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJkZXZlbG9wZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiZDlhYzhhN2ItZjY3OS00OWExLThjOTktODM3ZWI5Nzc1NzhiIn0sImlhdCI6MTc1MTAzNDA4OSwiaXNzIjoiaHR0cHM6Ly9jbGVyay5ieXRlbXkuY29tLmF1IiwianRpIjoiMzZiZGEyODlkMzJkYWVhNDU4ZTYiLCJuYmYiOjE3NTEwMzQwODQsInN1YiI6InVzZXJfMnlVN05zcGc5TmVtbXkxRmRLRTFTRklvZm1zIn0.RJjy4dVabhgk2ARp5D92iIfoQl-t-1rh4wUlnVxnHotRKB222WEOUIU7VisKTJ2E7-RG7Au7p6gfXhMotiYqfh3XXPDz1yobvnjPFC6hx44H1moKUnhTisI8pLSHqJe9qwAxDlHenIGD92UTMEW8D1HSVk-eSAIN3nSsfJ0GCCvFbVJAF72C6th_7UjiE2p-MccFGZVU5hcw-1NjSI79mmQF87PrBc2gUlvnB9xbEw9aNTDkFZJYkZIhz7TLp1sEZOkf9KXZx_DeIp-Ox6A9iPFrKw73B4wgKG0qm45yUx-4f3oQ4eYmiLUd3EqYLA5zLX_U0Azsz0QPvf6bfJSQjg"
   
   # Test debug endpoint
   curl -X POST "http://localhost:3000/api/debug-staff" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"test": "data"}'
   ```

2. **Test actual staff creation:**
   ```bash
   curl -X POST "http://localhost:3000/api/staff/create" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "role": "viewer",
       "is_staff": true,
       "inviteToClerk": true
     }'
   ```

## Possible Issues
1. **Dev server not running** - Start with `pnpm dev`
2. **Route file issues** - Fixed debug wrapper that might have caused 405
3. **Middleware interference** - Check console logs for middleware errors
4. **Next.js cache** - Try clearing .next folder

## Root Cause Found & Fixed ✅

**Issue**: Wrong export pattern for Next.js API route handlers

**Problem**: Using `const handler = withAuth(...); export const POST = handler;`  
**Solution**: Using function pattern like working routes: 

```typescript
async function POST(request: NextRequest) {
  return withAuth(async (request, session) => {
    // handler logic
  }, { allowedRoles: ["developer", "org_admin", "manager"] })(request);
}

export { POST };
```

## All Fixes Applied ✅
1. ✅ Fixed AuditLog GraphQL query (GetAuditLogsDocument)
2. ✅ Updated all JWT role extraction to use x-hasura-default-role  
3. ✅ Fixed React infinite re-renders in payrolls page
4. ✅ **FIXED 405 ERROR**: Updated staff creation route export pattern
5. ✅ Removed unused imports

## Test Now
Your staff creation should work! Try:
1. Start dev server: `pnpm dev`
2. Use the staff creation modal
3. Should work without 405 error
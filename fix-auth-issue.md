# 🚨 AUTH ISSUE DIAGNOSIS & FIX

## Problem Summary
- User has **correct JWT token** with `"x-hasura-role": "developer"`
- But middleware is detecting role as **"viewer"**
- Causing redirects from protected pages to `/dashboard`

## Debug Steps

### 1. Check Browser Console (IMMEDIATE)
Open browser console on any page and run:
```javascript
// Check current Clerk user data
console.log('Clerk User:', window.Clerk?.user);
console.log('Public Metadata:', window.Clerk?.user?.publicMetadata);

// Check session
window.Clerk?.session?.then(session => {
    console.log('Session:', session);
    console.log('JWT Claims:', session?.publicUserData);
});
```

### 2. Test Debug Endpoint (IMMEDIATE)  
Visit: `http://localhost:3000/api/debug-clerk-auth`

This will show exactly what the server sees vs what you expect.

### 3. Force Permission Refresh (IMMEDIATE FIX)
Open browser console and run:
```javascript
// Force refresh user session
await window.Clerk?.session?.reload();

// Or force sign out and back in
// await window.Clerk?.signOut();
```

## Likely Root Causes

### A. Session Token Mismatch
- Browser has old/cached session token
- Server sees different token than expected
- **Fix**: Clear browser cache, sign out/in

### B. Middleware Logic Bug
- Role extraction failing due to type/format issues
- **Fix**: Check middleware logs during page navigation

### C. Clerk Configuration Issue
- JWT template not being applied correctly
- **Fix**: Re-save Clerk JWT template

## Immediate Actions

1. **Clear Browser Cache** - Complete cache clear
2. **Sign Out & Sign In** - Force fresh session
3. **Check Network Tab** - Look for failed auth requests
4. **Test Debug Endpoint** - See server-side role detection

## Expected Behavior After Fix
- Sidebar navigation should work without redirects
- All pages except Advanced Scheduler should be accessible
- No more `x-user-role: viewer` in requests headers
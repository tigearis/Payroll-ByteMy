# Role Assignment Debugging Guide

This guide helps debug why users are getting redirected to `/unauthorized` with `reason=role_required&current=viewer&required=consultant`.

## 🔍 Problem Summary

Users are being assigned "viewer" role instead of their proper database roles, causing access denials. This is typically caused by:

1. **JWT Template Issues**: Clerk JWT template not properly configured
2. **Missing User Metadata**: User's role not synced between database and Clerk
3. **Role Extraction Logic**: Middleware not finding role in the expected places

## 🛠️ Debug Tools Available

### 1. Comprehensive Debug Page
**URL**: `/debug/role-assignment`
- **What it shows**: Complete role assignment analysis
- **When to use**: Primary debugging tool for role issues
- **Features**:
  - Current authentication status
  - JWT claims analysis
  - Role extraction from all sources
  - Database user verification
  - Permission calculations
  - Step-by-step diagnostics

### 2. API Debug Endpoints

#### `/api/debug/role-assignment` (GET)
- **Purpose**: Programmatic access to role diagnostics
- **Returns**: Comprehensive JSON debug data
- **Usage**: `curl -X GET https://your-domain.com/api/debug/role-assignment`

#### `/api/debug/role-assignment` (POST)
- **Purpose**: Trigger user sync and get updated diagnostics
- **Returns**: Sync results + updated debug data
- **Usage**: `curl -X POST https://your-domain.com/api/debug/role-assignment`

#### `/api/debug-user-role` (GET)
- **Purpose**: Check user role extraction from multiple sources
- **Returns**: Role extraction results and recommendations

#### `/api/check-role` (GET)
- **Purpose**: Simple role check with JWT token validation
- **Returns**: Current role and token status

#### `/api/auth/debug-token` (GET)
- **Purpose**: Decode and analyze JWT token contents
- **Returns**: JWT header, payload, and Hasura claims
- **Note**: Only available in development mode

### 3. Enhanced Middleware Debug Mode

To enable detailed middleware logging:

```bash
# Backup current middleware
mv middleware.ts middleware-backup.ts

# Enable debug middleware
mv middleware-debug.ts middleware.ts

# Check server logs for detailed authentication flow
```

**What it logs**:
- All role extraction attempts
- JWT token generation results
- Route permission checks
- Role hierarchy calculations
- Detailed error information

## 🚨 Common Issues & Solutions

### Issue 1: "No Hasura JWT claims - potential JWT template issue"

**Cause**: JWT template not properly configured in Clerk dashboard

**Solution**:
1. Go to Clerk Dashboard → JWT Templates
2. Find or create "hasura" template
3. Use this configuration:

```json
{
  "name": "hasura",
  "claims": {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["{{user.public_metadata.role}}", "viewer", "consultant", "manager", "org_admin", "developer"],
      "x-hasura-default-role": "{{user.public_metadata.role || 'viewer'}}",
      "x-hasura-user-id": "{{user.public_metadata.databaseId || user.id}}",
      "x-hasura-clerk-user-id": "{{user.id}}"
    }
  }
}
```

### Issue 2: "User defaulting to viewer role despite having higher database role"

**Cause**: Role not synced from database to Clerk metadata

**Solution**:
1. Call `/api/fix-user-sync` (POST) to sync user
2. Or use the "Trigger User Sync" button in debug page
3. Verify sync success in debug page

### Issue 3: "Role mismatch between JWT and database"

**Cause**: Database role doesn't match Clerk metadata

**Solution**:
1. Check database user role in debug page
2. Run user sync to update Clerk metadata
3. If sync fails, manually update user metadata in Clerk dashboard

### Issue 4: "User not found in database despite having database ID"

**Cause**: Database connection issues or missing user record

**Solution**:
1. Check database connection
2. Verify user exists: `SELECT * FROM users WHERE id = 'user-uuid'`
3. If missing, user needs to be properly onboarded

## 📋 Step-by-Step Debugging Process

### Step 1: Access Debug Page
1. Go to `/debug/role-assignment`
2. Review "Overview" tab for immediate issues
3. Check "Issues & Recommendations" section

### Step 2: Analyze JWT Configuration
1. Check "JWT" tab
2. Verify:
   - ✅ Session Claims present
   - ✅ Hasura Claims present  
   - ✅ JWT Token generated
3. If any are missing, fix JWT template in Clerk

### Step 3: Check Role Extraction
1. Review "Roles" tab
2. Look at "Role Extraction Sources"
3. Identify which source should have the role
4. Check "Final Role" calculation

### Step 4: Verify Database User
1. Check "Database" tab
2. Verify user exists and has correct role
3. Compare database role with JWT role

### Step 5: Trigger Sync if Needed
1. Use "Trigger User Sync" button
2. Wait for completion
3. Refresh debug data
4. Verify issues are resolved

### Step 6: Test Access
1. Navigate to a protected route (e.g., `/dashboard`)
2. Should not redirect to `/unauthorized`
3. Check middleware logs for confirmation

## 🔧 Environment Variables Required

Ensure these are properly set:

```bash
# Clerk Configuration
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Hasura Configuration  
HASURA_GRAPHQL_ENDPOINT=https://your-hasura-endpoint.com/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=your-admin-secret

# JWT Template Name (should match Clerk template)
CLERK_JWT_TEMPLATE_NAME=hasura
```

## 🚨 Emergency Access

If you're completely locked out:

1. **Enable Debug Middleware**: Follow middleware debug instructions above
2. **Check Server Logs**: Look for detailed authentication flow
3. **Direct Database Access**: Update user role directly in database
4. **Clerk Dashboard**: Manually update user metadata
5. **Reset JWT Template**: Re-configure from scratch using provided template

## 📞 Getting Help

When reporting issues, include:

1. **Debug Page Screenshot**: Full overview tab
2. **Raw Debug Data**: Copy from "Raw Data" tab
3. **Server Logs**: Middleware authentication attempts
4. **User Information**: Email, expected role, current role
5. **Environment**: Development vs Production

## 🔐 Security Notes

- Debug endpoints include sensitive user information
- Debug middleware provides detailed logs - disable in production
- JWT tokens contain sensitive claims - handle carefully
- Database queries include user personal information

## 📚 Related Documentation

- `/docs/security/JWT_TEMPLATE_CUSTOMIZATION_GUIDE.md` - JWT configuration
- `/docs/security/ENHANCED_JWT_TEMPLATE_GUIDE.md` - Advanced JWT setup
- `CLAUDE.md` - Project architecture and troubleshooting
- `middleware.ts` - Current middleware implementation
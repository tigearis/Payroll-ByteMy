# Clerk Session JWT V2 Migration Guide

## ✅ Compatibility Status

Your application is **fully compatible** with Clerk's Session JWT V2:
- **Clerk Version**: `@clerk/nextjs v6.20.2` ✅ (requires v6.15.0+)
- **JWT Parser**: Using Clerk SDK (recommended) ✅
- **Backend Integration**: Hasura with updated JWT configuration ✅

## 🆕 What's New in Session JWT V2

### Enhanced Features:
1. **Denser Format**: More authorization information in smaller JWT payload
2. **Session Tracking**: New `sid` (session ID) field for better session management
3. **Organization Context**: Enhanced `org_id` handling for multi-tenant applications
4. **Step-Up Authentication**: Automatic re-verification prompts for sensitive actions
5. **Improved Performance**: Reduced token size and faster parsing

### Key Changes:
- Claims are now in `$.metadata` instead of `$.["https://hasura.io/jwt/claims"]`
- Session ID available at `$.sid`
- Organization ID at `$.org_id`
- Roles at `$.metadata.roles`
- Default role at `$.metadata.default_role`

## 🔧 Configuration Updates Applied

### 1. Hasura JWT Secret (Updated)

**Production:**
```json
{
  "type": "RS256",
  "jwks_uri": "https://clerk.payroll.app.bytemy.com.au/.well-known/jwks.json",
  "claims_format": "json",
  "audience": "https://payroll.app.bytemy.com.au",
  "issuer": "https://clerk.payroll.app.bytemy.com.au",
  "claims_map": {
    "x-hasura-allowed-roles": {"path": "$.metadata.roles"},
    "x-hasura-default-role": {"path": "$.metadata.default_role"},
    "x-hasura-user-id": {"path": "$.sub"},
    "x-hasura-org-id": {"path": "$.org_id"},
    "x-hasura-session-id": {"path": "$.sid"}
  }
}
```

**Preview:**
```json
{
  "type": "RS256",
  "jwks_uri": "https://harmless-primate-53.clerk.accounts.dev/.well-known/jwks.json",
  "claims_format": "json",
  "audience": "https://payroll-preview.vercel.app",
  "issuer": "https://harmless-primate-53.clerk.accounts.dev",
  "claims_map": {
    "x-hasura-allowed-roles": {"path": "$.metadata.roles"},
    "x-hasura-default-role": {"path": "$.metadata.default_role"},
    "x-hasura-user-id": {"path": "$.sub"},
    "x-hasura-org-id": {"path": "$.org_id"},
    "x-hasura-session-id": {"path": "$.sid"}
  }
}
```

### 2. Enhanced Token Monitoring

Added JWT V2 monitoring to your token endpoint (`app/api/auth/token/route.ts`):
- Detects JWT version (v1 vs v2)
- Logs session ID presence
- Monitors metadata structure
- Tracks role extraction

### 3. Step-Up Authentication Components

Created components for Clerk's new step-up authentication:
- `components/auth/step-up-auth.tsx` - Main step-up auth component
- `components/auth/step-up-example.tsx` - Usage examples

## 📋 Migration Checklist

### Immediate Actions Required:

#### 1. Update Hasura JWT Secret ⚠️ **CRITICAL**
```bash
# In your Hasura console, update the environment variable:
HASURA_GRAPHQL_JWT_SECRET='[updated configuration from above]'
```

#### 2. Test in Preview Environment
- [ ] Deploy to preview with new JWT configuration
- [ ] Test authentication flows
- [ ] Verify user roles and permissions work
- [ ] Check GraphQL queries execute properly
- [ ] Monitor console for JWT version logs

#### 3. Production Deployment
- [ ] Update production Hasura JWT secret
- [ ] Deploy application to production
- [ ] Monitor authentication metrics
- [ ] Verify all user flows work correctly

### Optional Enhancements:

#### 4. Implement Step-Up Authentication
- [ ] Add step-up auth to sensitive user actions
- [ ] Update email management components
- [ ] Enhance password change flows
- [ ] Secure payment method updates

#### 5. Session Management
- [ ] Implement session tracking with new `session_id`
- [ ] Add session monitoring to admin dashboard
- [ ] Set up session analytics

## 🧪 Testing Guide

### 1. JWT Format Verification

Check your browser's developer console for token details:
```javascript
// In browser console:
fetch('/api/auth/token')
  .then(r => r.json())
  .then(data => {
    const payload = JSON.parse(atob(data.token.split('.')[1]));
    console.log('JWT Version:', payload.metadata ? 'v2' : 'v1');
    console.log('Session ID:', payload.sid);
    console.log('Metadata:', payload.metadata);
  });
```

### 2. Hasura Claims Testing

In Hasura GraphQL Explorer, check request headers:
```graphql
query TestUserContext {
  users(limit: 1) {
    id
    name
  }
}
```

Expected headers with Session JWT V2:
- `x-hasura-user-id`: Your user ID
- `x-hasura-session-id`: Session identifier
- `x-hasura-allowed-roles`: Your roles array
- `x-hasura-default-role`: Your default role

### 3. Step-Up Authentication Testing

Test sensitive actions:
1. Try adding a new email address
2. Attempt password change
3. Enable two-factor authentication
4. Verify step-up prompts appear

## 🔍 Monitoring & Troubleshooting

### Console Logs to Monitor:

**Token Generation:**
```
🔍 Token details: {
  expiresIn: 3600,
  hasSessionId: true,
  hasMetadata: true,
  hasOrgId: false,
  jwtVersion: "v2",
  roles: ["admin", "user"],
  defaultRole: "admin"
}
```

**GraphQL Headers:**
```
🔍 Request headers: {
  authorization: "present",
  cookie: "present",
  x-hasura-user-id: "user_xxx",
  x-hasura-session-id: "sess_xxx"
}
```

### Common Issues:

#### JWT V1 Still Being Used
- **Symptom**: `jwtVersion: "v1"` in logs
- **Solution**: Clear browser cache, regenerate tokens
- **Check**: Clerk dashboard for Session JWT V2 enablement

#### Claims Mapping Errors
- **Symptom**: Missing `x-hasura-*` headers in GraphQL requests
- **Solution**: Verify `claims_map` configuration in Hasura
- **Check**: JWT payload structure matches claim paths

#### Permission Errors
- **Symptom**: Access denied errors in GraphQL
- **Solution**: Verify role mapping and permissions
- **Check**: User roles in JWT match Hasura permissions

## 🚀 Benefits You'll See

### Performance Improvements:
- **Smaller JWT tokens** - Reduced bandwidth usage
- **Faster parsing** - Improved app responsiveness
- **Better caching** - Enhanced token management

### Security Enhancements:
- **Session tracking** - Better audit logs
- **Step-up authentication** - Enhanced security for sensitive actions
- **Organization context** - Improved multi-tenant security

### Developer Experience:
- **Cleaner claims structure** - Easier to work with
- **Better debugging** - Enhanced logging and monitoring
- **Future-proof** - Ready for upcoming Clerk features

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Hasura logs for JWT validation errors
3. Monitor browser console for authentication issues
4. Contact Clerk support if step-up auth doesn't work
5. Check Hasura documentation for claims mapping issues

## 🔄 Rollback Plan

If needed, you can temporarily revert to Session JWT V1:
1. Contact Clerk support to disable Session JWT V2
2. Update Hasura JWT secret to remove `claims_map`
3. Monitor for 24 hours as stated in Clerk's upgrade notice
4. Re-enable Session JWT V2 after resolving issues

---

**Status**: ✅ Ready for deployment
**Next Steps**: Update Hasura JWT secrets and deploy to preview for testing
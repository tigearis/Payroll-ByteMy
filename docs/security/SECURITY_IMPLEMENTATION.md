# Security Implementation Guide

## 🔐 Security Fixes Implemented (2025-06-28)

This document provides a quick reference for the security improvements implemented in the Payroll Matrix system.

## ✅ Critical Security Fixes

### 1. JWT Template Security
**Issue**: Hardcoded roles in JWT template allowing unauthorized access
**Solution**: Dynamic role hierarchy with proper allowed roles

**New JWT Template** (Update in Clerk Dashboard):
```json
{
    "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
        "x-hasura-default-role": "{{user.public_metadata.role || 'viewer'}}",
        "x-hasura-allowed-roles": "{{user.public_metadata.allowedRoles || ['viewer']}}",
        "x-hasura-clerk-user-id": "{{user.id}}"
    }
}
```

### 2. Role Hierarchy Implementation
**Location**: `lib/auth/permissions.ts`

```typescript
// Dynamic allowed roles based on user's role
const getAllowedRoles = (userRole: Role): Role[] => {
  // developer can assume all roles
  // org_admin can assume org_admin, manager, consultant, viewer
  // manager can assume manager, consultant, viewer
  // consultant can assume consultant, viewer
  // viewer can assume viewer only
}
```

### 3. JWT Claims Validation
**Location**: `lib/auth/jwt-validation.ts`

```typescript
// Validates JWT claims for security compliance
await validateJWTClaims(sessionClaims, {
  userId,
  ipAddress,
  userAgent,
  requestPath
});
```

### 4. Security Monitoring
**Location**: `lib/security/role-monitoring.ts`

```typescript
// Monitors role mismatches and escalation attempts
await monitorRoleMismatch({
  userId,
  clerkUserId,
  jwtRole,
  databaseRole,
  requestPath,
  ipAddress,
  userAgent,
  timestamp: new Date()
});
```

### 5. HMAC Cron Authentication
**Location**: `lib/auth/secure-cron-auth.ts`

```bash
# Generate HMAC signature for cron jobs
timestamp=$(date +%s)
operation="cleanup_old_dates"
signature=$(echo -n "${timestamp}:${operation}" | openssl dgst -sha256 -hmac "$CRON_SECRET" -binary | xxd -p)

curl -X POST https://your-app.com/api/cron/cleanup-old-dates \
  -H "x-cron-signature: sha256=${signature}" \
  -H "x-cron-timestamp: ${timestamp}" \
  -H "x-cron-operation: ${operation}"
```

## 🚀 Deployment Checklist

### Required Actions After Implementation

1. **Update Clerk JWT Template**
   - Go to Clerk Dashboard → JWT Templates
   - Update the Hasura template with the new configuration
   - Remove `x-hasura-org-id` (not needed)

2. **Run User Migration Script**
   ```bash
   npx tsx scripts/migrate-user-allowed-roles.ts
   ```

3. **Update Environment Variables**
   ```bash
   # Ensure these are set
   CLERK_SECRET_KEY=sk_test_...
   CLERK_WEBHOOK_SECRET=whsec_...
   CRON_SECRET=your_hmac_secret_here
   HASURA_GRAPHQL_ADMIN_SECRET=...
   ```

4. **Update Cron Jobs**
   - Replace simple secret auth with HMAC signatures
   - Use `SecureCronClient` for making authenticated requests

5. **Monitor Security Events**
   - Check security monitoring logs regularly
   - Set up alerts for critical security violations
   - Review role mismatch reports

## 🔍 Security Monitoring Dashboard

### Key Metrics to Monitor

1. **Role Mismatches**: JWT role ≠ Database role
2. **Escalation Attempts**: Users trying unauthorized roles
3. **Failed Authentications**: Repeated auth failures
4. **Token Anomalies**: Unusual token refresh patterns

### Alert Levels

- **CRITICAL**: Role escalation attempts, critical mismatches
- **HIGH**: Rapid role changes, suspicious patterns
- **MEDIUM**: Token refresh anomalies, minor mismatches
- **LOW**: General authentication events

## 📁 File Structure Reference

```
lib/
├── auth/
│   ├── permissions.ts          # Role hierarchy & permissions
│   ├── jwt-validation.ts       # JWT security validation
│   ├── secure-cron-auth.ts     # HMAC cron authentication
│   ├── api-auth.ts            # Enhanced API authentication
│   └── enhanced-auth-context.tsx # React auth context with monitoring
├── security/
│   └── role-monitoring.ts      # Security monitoring & alerting
└── apollo/
    └── admin-operations.ts     # Secure admin operations

scripts/
└── migrate-user-allowed-roles.ts # User metadata migration

config/
└── routes.ts                   # Route protection configuration

middleware.ts                   # Secure middleware implementation
```

## 🛡️ Security Testing

### Test Scenarios

1. **JWT Validation**
   - Test with invalid JWT claims
   - Test with missing required claims
   - Test with role mismatches

2. **Role Escalation**
   - Attempt to use unauthorized roles
   - Test role switching within allowed roles
   - Verify role hierarchy enforcement

3. **Authentication Bypass**
   - Test middleware with no auth
   - Test API routes without tokens
   - Test admin operations without permissions

4. **HMAC Authentication**
   - Test cron jobs with invalid signatures
   - Test with expired timestamps
   - Test with missing headers

### Security Commands

```bash
# Test JWT validation
curl -H "Authorization: Bearer invalid_token" /api/protected

# Test role escalation
curl -H "x-hasura-role: developer" /api/user-endpoint

# Test HMAC cron auth
curl -X POST /api/cron/test \
  -H "x-cron-signature: invalid" \
  -H "x-cron-timestamp: $(date +%s)" \
  -H "x-cron-operation: test"
```

## 🚨 Incident Response

### Security Violation Response

1. **Immediate Actions**
   - Check security monitoring logs
   - Identify affected user accounts
   - Verify system integrity

2. **Investigation Steps**
   - Review audit logs for the timeframe
   - Check for patterns in security violations
   - Validate user permissions and roles

3. **Remediation**
   - Reset affected user sessions
   - Update user roles if necessary
   - Patch any identified vulnerabilities

### Contact Information

- **Security Team**: Review security logs immediately
- **System Admin**: Check infrastructure logs
- **Development Team**: Address code-level issues

## 📝 Change Log

### 2025-06-28: Security Audit Implementation
- ✅ Fixed JWT template role hierarchy
- ✅ Implemented JWT claims validation
- ✅ Added security monitoring system
- ✅ Replaced simple auth with HMAC
- ✅ Removed authentication bypasses
- ✅ Enhanced middleware security
- ✅ Created user migration scripts

---

**Security Status**: ✅ **SECURE** - All critical vulnerabilities addressed
**Last Updated**: 2025-06-28
**Next Review**: 2025-07-28
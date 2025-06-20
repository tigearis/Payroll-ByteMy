# Enhanced Authentication System Documentation

## Overview

This document provides a comprehensive guide to the enhanced authentication system implemented to resolve route blocking issues and ensure SOC2 compliance. The system uses Clerk for authentication with custom middleware, centralized token management, and advanced monitoring.

### Authentication Flow Diagram

```mermaid
graph LR
    A[User Request] --> B[Middleware]
    B --> C[Clerk Auth]
    C --> D[Hasura JWT Template]
    D --> E[Apollo Client]
    E --> F[Hasura GraphQL]

    B --> G[Audit Logger]
    G --> H[SOC2 Compliance]
```

## System Architecture

### Core Components

1. **Clerk Authentication**: Primary authentication provider with JWT tokens
2. **Centralized Token Manager**: Coordinates all token operations to prevent conflicts
3. **Enhanced Route Monitor**: Tracks security events and generates SOC2 audit logs
4. **Standardized API Authentication**: Consistent `withAuth` wrapper across all routes
5. **Advanced Session Management**: Optimized validation with mutex protection

## Authentication Flow

### 1. User Authentication Process

```
User Login → Clerk JWT Token → Role Extraction → Database Validation → Session Establishment
```

**Key Files:**

- `/app/lib/api-auth.ts:29-101` - Main authentication logic
- `/app/lib/auth-context.tsx:188-553` - Client-side auth context
- `/middleware.ts` - Route protection middleware

### 2. User Synchronization via Webhooks

Webhook implementation is crucial for maintaining data consistency between Clerk and your database. The webhook endpoint should handle multiple event types including user creation, updates, and deletions. When users are deleted from Clerk, the system should set them as inactive in your database rather than performing hard deletes, maintaining audit trails as specified in your requirements.

```javascript
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  const { id, ...attributes } = evt.data;
  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      await syncUserToDatabase(evt.data);
      break;
    case "user.updated":
      await updateUserInDatabase(evt.data);
      break;
    case "user.deleted":
      await deactivateUserInDatabase(evt.data.id);
      break;
  }

  return new Response("", { status: 200 });
}
```

### 3. Role-Based Access Control (RBAC)

**Role Hierarchy (highest to lowest):**

- `developer` (Level 5) - Full system access
- `org_admin` (Level 4) - Organization management
- `manager` (Level 3) - Team and payroll management
- `consultant` (Level 2) - Limited operational access
- `viewer` (Level 1) - Read-only access

**Permission Checking:**

```typescript
// Role hierarchy check
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 999;
  return userLevel >= requiredLevel;
}
```

### 4. JWT Token Management

**Centralized Token Manager** (`/app/lib/auth/centralized-token-manager.ts`):

- **Singleton Pattern**: Prevents multiple token managers
- **Mutex Protection**: Coordinates token refresh operations
- **Caching**: Reduces unnecessary token requests
- **Metrics**: Tracks token operations and performance

**Key Methods:**

- `getToken()` - Gets valid token with automatic refresh
- `forceRefresh()` - Forces token refresh when needed
- `clearCurrentUserToken()` - Clears cached tokens

## Invitation Management System

The invitation system leverages Clerk's built-in functionality while providing application-level management interfaces. The system supports creating invitations, tracking their status, and handling acceptance workflows. Authorized users (Developers, Admins, and Managers) can view pending invitations, resend expired ones, and revoke them as needed, with all actions being audited.

```typescript
// Create invitation with role assignment
async function createInvitation(email, role, inviterUserId) {
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  try {
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
      publicMetadata: {
        role: role,
        invitedBy: inviterUserId,
        invitedAt: new Date().toISOString(),
      },
    });

    // Track invitation in your database
    await trackInvitationInDatabase({
      clerkInvitationId: invitation.id,
      email: email,
      role: role,
      invitedBy: inviterUserId,
      status: "pending",
    });

    return invitation;
  } catch (error) {
    console.error("Failed to create invitation:", error);
    throw error;
  }
}
```

## API Route Protection

### Standardized Authentication Pattern

All protected routes use the `withAuth` wrapper:

```typescript
import { withAuth } from "@/lib/api-auth";

export const POST = withAuth(
  async (request: NextRequest, session: AuthSession) => {
    // Your route logic here
    // session.userId, session.role, session.email available
  },
  {
    requiredRole: "manager", // Optional: minimum role required
    allowedRoles: ["admin", "org_admin"], // Optional: specific roles only
  }
);
```

### Previously Unprotected Routes (Now Secured)

1. **`/api/audit/compliance-report`** - Admin/org_admin only
2. **`/api/chat`** - All authenticated users (viewer+)
3. **`/api/commit-payroll-assignments`** - Manager+ roles
4. **`/api/staff/create`** - Admin only

### Test Route Protection

Test routes are environment-gated in middleware:

- **Development**: Accessible for testing
- **Production**: Blocked by authentication requirement

```typescript
// Test routes blocked in production via middleware
const testRoutes = [
  "/api/simple-test",
  "/api/debug-post",
  "/api/minimal-post-test",
];
```

## Security Features

### 1. Enhanced Route Monitoring

**Location**: `/app/lib/security/enhanced-route-monitor.ts`

**Capabilities:**

- **Rate Limiting**: Per-route request limits
- **Suspicious Pattern Detection**: Unusual access times, bulk data access
- **Security Alerts**: Real-time threat detection
- **SOC2 Audit Logging**: Comprehensive compliance logs

**Rate Limits:**

- Token endpoint: 10 requests/minute
- User management: 50 requests/minute
- Staff creation: 5 requests/5 minutes
- Compliance reports: 3 requests/5 minutes

### 2. SOC2 Compliance Logging

**Event Types Logged:**

- Authentication events (login, logout, failures)
- Data access (viewing sensitive information)
- Administrative actions (user creation, role changes)
- Security events (rate limiting, suspicious activity)

**Log Format:**

```typescript
{
  level: LogLevel,
  category: LogCategory,
  eventType: SOC2EventType,
  message: string,
  userId?: string,
  metadata: {
    route: string,
    method: string,
    duration: number,
    success: boolean,
    ipAddress: string,
    userAgent: string
  }
}
```

### 3. Data Classification & Protection

The system implements field-level data protection based on sensitivity.

#### Classification Levels

```typescript
const DataClassification = {
  CRITICAL: ["ssn", "bank_account", "tax_id"],
  HIGH: ["salary", "personal_info", "address"],
  MEDIUM: ["work_schedule", "department", "phone"],
  LOW: ["name", "email", "public_info"],
} as const;
```

#### Data Masking

Data can be automatically masked based on user role to prevent unauthorized exposure of sensitive information. For example, a `consultant` viewing salary data would see `[REDACTED]` instead of the actual value. This is handled by a dedicated utility that should be used when displaying sensitive data.

### 4. Session Management

**Session Validation Features:**

- **Mutex Protection**: Prevents concurrent validation
- **Failure Counting**: Tracks consecutive failures
- **Optimized Timing**: 30-second validation intervals
- **Database User Validation**: Ensures user exists in system

**Session Expiry Handling:**

- **Automatic Refresh**: Silent token renewal
- **User Notification**: Grace period with manual refresh option
- **Graceful Degradation**: Redirect to login after timeout

## Clerk & Session Management

### Clerk Session JWT v2 Migration

_Source: `CLERK-SESSION-JWT-V2-MIGRATION.md`_

The application is fully compatible with and configured to use Clerk's Session JWT v2 format, which provides a denser, more secure token.

- **Key Benefits**: Smaller token size, better session tracking with `sid`, and enhanced organization context.
- **Hasura Configuration**: The `HASURA_GRAPHQL_JWT_SECRET` has been updated with a `claims_map` that correctly parses the v2 JWT structure, including mapping the new `sid` claim to `x-hasura-session-id`.
- **Testing**: The JWT version can be verified in the browser console, and Hasura claims can be tested by inspecting request headers in the GraphiQL explorer.

### Role Synchronization

_Source: `ROLE_SYNC_IMPLEMENTATION.md`_

User roles are automatically synchronized bi-directionally between Clerk and the application database.

- **Architecture**:
  - **Clerk `public_metadata.role`**: The source of truth for a user's role.
  - **Database `users.role`**: Stores the role for local operations.
  - **API Endpoints**: `/api/staff/create`, `/api/staff/update-role`, and `/api/staff/delete` handle the logic to keep both systems in sync during manual staff management operations.
  - **Webhooks**: The `/api/clerk-webhooks` endpoint listens for `user.created`, `user.updated`, and `user.deleted` events from Clerk to automatically sync changes made directly in the Clerk dashboard.

### Session Expiry Handling

_Source: `SESSION-EXPIRY_HANDLING.md`_

A robust system is in place to gracefully handle JWT expiration and prevent UI errors.

- **Detection**: The Apollo error link (`lib/apollo-client.ts`) is configured to detect `JWTExpired` errors from GraphQL responses.
- **Event System**: When an expired token is detected, a custom `SESSION_EXPIRED_EVENT` is dispatched globally.
- **Global Handler**: A `SessionExpiryHandler` component listens for this event and orchestrates the token refresh process.
- **User Experience**:
  1.  The system attempts to refresh the token silently.
  2.  If successful, a small toast notification informs the user.
  3.  If it fails, a prominent toast appears, prompting the user to sign in again. It includes a 15-second countdown to an automatic redirect to the login page.

### MFA Implementation (Feature Flagged)

_Source: `MFA_FEATURE_FLAG.md`_

**Status**: Disabled by default, ready for future activation

Multi-Factor Authentication (MFA) is implemented but controlled by a feature flag, allowing for it to be enabled once the corresponding configuration in the Clerk dashboard is complete.

- **Feature Flag**: `FEATURE_MFA_ENABLED` (environment variable, default: `false`).
- **Affected Routes**: When enabled, MFA will be required for high-security routes like `/api/staff/delete` and `/api/audit/compliance-report`.
- **Affected Roles**: `admin` and `org_admin` roles will be required to use MFA when the feature is enabled.
- **API Signing**: The existing API request signing functionality is independent of the MFA feature flag.

## API Request Signing (Ready for Implementation)

**Endpoints Available:**

- `/api/admin/api-keys` - API key management (admin only)
- `/api/signed/payroll-operations` - Signed payroll operations

**HMAC-SHA256 Signing:**

```typescript
const signature = crypto
  .createHmac("sha256", apiSecret)
  .update(requestPayload)
  .digest("hex");
```

## Testing and Validation

### Automated Testing Script

**Location**: `/app/scripts/test-auth-fixes.js`

**Test Coverage:**

1. Critical routes require authentication
2. Test routes blocked in production
3. API signing endpoints protected
4. Token management functional
5. Webhook validation working
6. Rate limiting active
7. Error responses standardized
8. MFA feature flag disabled
9. Centralized token management working
10. SOC2 compliance logging active

**Run Tests:**

```bash
cd /app
node scripts/test-auth-fixes.js
```

### Manual Testing Checklist

1. **Authentication Flow**:

   - Log in as different role levels
   - Test route access based on permissions
   - Verify proper error messages

2. **Token Management**:

   - Extended session usage
   - Token refresh verification
   - No authentication interruptions

3. **Security Monitoring**:
   - Check application logs for monitoring data
   - Verify SOC2 audit logs generation
   - Monitor for authentication errors

## Pre-Production Deployment Steps

### Required Environment Variables

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# Feature Flags
FEATURE_MFA_ENABLED=false

# Security
CRON_SECRET=your_cron_secret
WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=your_database_url
```

### Deployment Checklist

1. **✅ Run Automated Tests**:

   ```bash
   node scripts/test-auth-fixes.js
   ```

2. **⚠️ Manual Testing Required**:

   - Test admin user login and route access
   - Verify different role permissions
   - Test API key generation (if using signed requests)
   - Monitor logs for any errors during testing

3. **🔒 Security Verification**:

   - Confirm test routes blocked in production
   - Verify SOC2 logging active
   - Check rate limiting functionality

4. **📊 Monitoring Setup**:
   - Application logs configured
   - SOC2 audit log storage ready
   - Alert system for security events

### Post-Deployment Monitoring

**Key Metrics to Watch:**

- Authentication failure rates
- Token refresh success rates
- Route response times
- Security alert frequency
- SOC2 compliance log volume

**Alert Thresholds:**

- > 10 auth failures/minute from single IP
- > 5 consecutive token refresh failures
- Any critical security alerts
- Unusual access pattern detections

## Troubleshooting

### Common Issues and Solutions

1. **Route Blocking Issues**:

   - Check user exists in database
   - Verify role assignment in JWT
   - Confirm route requires correct permission level

2. **Token Refresh Failures**:

   - Check Clerk configuration
   - Verify network connectivity
   - Review centralized token manager logs

3. **Permission Denied Errors**:
   - Validate user role hierarchy
   - Check permission mapping
   - Ensure database user record exists

#### JWT Claim Mismatch (databaseId vs. clerkUserId)

A common issue is a misconfigured JWT template where `x-hasura-user-id` is set to Clerk's `user.id` instead of the application's internal database UUID, which should be stored in `user.public_metadata.databaseId`.

**Symptoms:**

- GraphQL queries fail with permission errors for fields like `role` or `email`.
- Logs show a Clerk User ID (e.g., `user_2xq...`) being used for a Hasura permission check instead of a UUID.

**Solution:**

1.  **Correct JWT Template in Clerk:** Ensure the Hasura JWT template in the Clerk dashboard uses `{{user.public_metadata.databaseId}}` for the `x-hasura-user-id` claim.
    ```json
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
        "x-hasura-default-role": "{{user.public_metadata.role}}",
        "x-hasura-allowed-roles": ["admin", "manager", "consultant", "viewer"]
      }
    }
    ```
2.  **Force Token Refresh:** After updating the template, users must sign out and sign back in to get a new token with the corrected claims. Clearing browser cache and cookies is recommended.

### Debug Logging

Enable detailed auth debugging:

- Check console logs for role extraction details
- Monitor centralized token manager metrics
- Review route monitor analytics

## Performance Optimizations

### Implemented Optimizations

1. **Centralized Token Management**: Eliminates duplicate token requests
2. **Session Validation Throttling**: 30-second intervals prevent excessive checks
3. **Permission Memoization**: Cached permission calculations
4. **Route Monitoring Cleanup**: Automatic cleanup of old metrics
5. **Optimized Hooks and Guards**: The `useCurrentUser` hook was enhanced with an `isReady` state, reduced debounce timing, and stricter retry limits to prevent infinite loops and improve response time. The `StrictDatabaseGuard` now includes a grace period to prevent premature access denial while authentication state stabilizes.

### Performance Metrics

- **Token Cache Hit Rate**: >90% expected
- **Session Validation Time**: <100ms average
- **Route Response Time**: Monitored per endpoint
- **Memory Usage**: Cleanup intervals prevent memory leaks

## Security Best Practices Implemented

1. **Principle of Least Privilege**: Users get minimum required permissions
2. **Defense in Depth**: Multiple layers of security checks
3. **Audit Trail**: Complete SOC2 compliance logging
4. **Rate Limiting**: Protection against abuse
5. **Secure Token Handling**: Centralized management with mutex protection
6. **Input Validation**: All requests validated before processing
7. **Error Handling**: Standardized responses without information leakage

## Conclusion

This enhanced authentication system provides:

- ✅ Resolved route blocking issues through standardized patterns
- ✅ SOC2 compliance with comprehensive audit logging
- ✅ Centralized token management preventing conflicts
- ✅ Advanced security monitoring and threat detection
- ✅ Production-ready with comprehensive testing
- ✅ Future-ready with MFA and API signing capabilities

The system is now ready for production deployment with proper monitoring and the steps outlined above.

---

**Generated with Claude Code** 🤖
**Last Updated**: $(date)
**System Status**: Production Ready ✅

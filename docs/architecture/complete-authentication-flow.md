# Complete Authentication Flow Architecture

## Overview

**Payroll Matrix** implements enterprise-grade authentication with a sophisticated 5-layer security model combining **Clerk authentication**, **JWT tokens**, **role-based access control**, and **database-level security**. This document provides a complete technical analysis of the authentication architecture.

## 🏗️ Authentication Architecture Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────┤
│  🔐 Clerk Authentication (OAuth, Email/Password, MFA)      │
│     ↓ Generates JWT with Hasura Claims                     │
├─────────────────────────────────────────────────────────────┤
│  🛡️ Next.js Middleware (middleware.ts)                    │
│     ↓ Route protection & role validation                   │
├─────────────────────────────────────────────────────────────┤
│  🔗 Apollo Client Auth Link                               │
│     ↓ JWT injection into GraphQL requests                  │
├─────────────────────────────────────────────────────────────┤
│  📊 Hasura GraphQL Engine                                 │
│     ↓ JWT validation & claims extraction                   │
├─────────────────────────────────────────────────────────────┤
│  🗄️ PostgreSQL with Row Level Security (RLS)              │
│     ↓ Database-level access control                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Layer 1: Clerk Authentication

### Features

- **Multiple Sign-in Methods**: Email/password, Google OAuth, GitHub OAuth
- **Multi-Factor Authentication (MFA)**: SMS, TOTP, backup codes
- **Session Management**: Secure session handling with automatic refresh
- **User Metadata**: Custom fields for role assignment and database linking

### JWT Template Configuration

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

### Key Implementation Files

- **Provider Setup**: `app/providers.tsx`
- **Auth Context**: `lib/auth/enhanced-auth-context.tsx`
- **User Sync**: `lib/services/enhanced-sync.ts`

## 🛡️ Layer 2: Middleware Protection

### Route-Based Protection (middleware.ts)

#### Route Categories

```typescript
const routes = {
  public: ["/", "/sign-in", "/sign-up", "/accept-invitation"],
  developer: ["/developer", "/api/developer"], // Level 5
  admin: ["/admin", "/security", "/api/admin"], // Level 4
  manager: ["/staff", "/api/staff"], // Level 3
  protected: ["/dashboard", "/clients"], // Level 2+
  system: ["/api/cron", "/api/signed"], // Internal
};
```

#### OAuth Race Condition Handling

```typescript
// Enhanced JWT token retrieval with fallback methods
const token = await getToken({ template: "hasura" });
let jwtClaims = sessionClaims?.["https://hasura.io/jwt/claims"];

// Fallback: Manual JWT decoding for incomplete sessions
if (!jwtClaims && token) {
  const base64Payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(base64Payload));
  jwtClaims = decodedPayload["https://hasura.io/jwt/claims"];
}
```

#### Incomplete Session Handling

```typescript
// Allow sync paths during OAuth login process
const allowedIncompleteDataPaths = [
  "/dashboard",
  "/api/sync-current-user",
  "/api/webhooks/clerk",
  "/profile",
];

if (!hasCompleteJWTClaims && !hasCompleteMetadata) {
  if (isAllowedPath) {
    return NextResponse.next(); // Allow sync to complete
  } else {
    return NextResponse.redirect("/dashboard"); // Redirect for sync
  }
}
```

## 🔗 Layer 3: Apollo Client Authentication

### Authentication Link (lib/apollo/links/auth-link.ts)

#### Multi-Method Token Retrieval

```typescript
// Method 1: Direct Clerk session (most reliable)
if (window.Clerk?.session) {
  token = await window.Clerk.session.getToken({
    template: "hasura",
    leewayInSeconds: 60, // Refresh 60s before expiry
  });
}

// Method 2: Active session fallback
if (!token && window.Clerk?.user) {
  const activeSession = window.Clerk.user.sessions?.find(
    s => s.status === "active"
  );
  token = await activeSession?.getToken({ template: "hasura" });
}

// Method 3: Clerk load fallback (last resort)
if (!token && window.Clerk?.__unstable__environment) {
  await window.Clerk.load();
  token = await window.Clerk.session?.getToken({ template: "hasura" });
}
```

#### Admin Context Handling

```typescript
// Admin operations use Hasura admin secret
if (options.context === "admin" && typeof window === "undefined") {
  return {
    headers: {
      "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
  };
}
```

### Apollo Client Instances

- **clientApolloClient**: Browser client with WebSocket + retry
- **serverApolloClient**: Server-side client for SSR
- **adminApolloClient**: Service operations with admin access

## 📊 Layer 4: Hasura GraphQL Validation

### JWT Claims Processing

1. **JWT Validation**: Hasura validates JWT signature with JWKS
2. **Claims Extraction**: Extracts `x-hasura-*` claims from token
3. **Role Assignment**: Sets current role for RLS policies
4. **Permission Mapping**: Applies role-based query filtering

### GraphQL Security Features

- **Introspection Disabled**: In production environment
- **Query Depth Limiting**: Prevents deep nested attacks
- **Rate Limiting**: Per-role query rate limits
- **Allow Lists**: Approved queries only in production

## 🗄️ Layer 5: Database Row Level Security

### RLS Policies by Role

```sql
-- Example RLS policy for users table
CREATE POLICY "users_select_policy" ON users
FOR SELECT USING (
  CASE
    WHEN current_setting('hasura.user.x-hasura-default-role') = 'developer' THEN true
    WHEN current_setting('hasura.user.x-hasura-default-role') = 'org_admin' THEN true
    WHEN current_setting('hasura.user.x-hasura-default-role') = 'manager' THEN
      (role IN ('consultant', 'viewer') OR id = current_setting('hasura.user.x-hasura-user-id')::uuid)
    ELSE id = current_setting('hasura.user.x-hasura-user-id')::uuid
  END
);
```

## 🔄 User Synchronization System

### Enhanced Bidirectional Sync (lib/services/enhanced-sync.ts)

#### Sync Flow

```typescript
1. validateBidirectionalSync() // Check Clerk ↔ Database consistency
2. withUserSyncLock()          // Distributed locking
3. retryWithExponentialBackoff() // Retry failed operations
4. updateSyncState()           // Track sync progress
5. logSOC2Event()             // Audit logging
```

#### Sync Features

- **Distributed Locking**: Prevents concurrent sync operations
- **Exponential Backoff**: 3 retry attempts with jitter
- **Conflict Detection**: Field-level inconsistency identification
- **State Tracking**: Comprehensive sync history in database
- **Performance Monitoring**: Operation metrics and duration tracking

## 🛡️ Security Monitoring & Compliance

### JWT Claims Validation (lib/auth/jwt-validation.ts)

#### Security Checks

```typescript
export async function validateJWTClaims(sessionClaims, context) {
  // 1. Hasura claims presence validation
  // 2. Required claims completeness check
  // 3. Role format and hierarchy validation
  // 4. Role escalation attempt detection
  // 5. UUID format validation
  // 6. Security event logging
}
```

#### Role Escalation Prevention

```typescript
// Validate role hierarchy - ensure user doesn't exceed their level
const expectedAllowedRoles = getAllowedRoles(defaultRole);
const hasInvalidRoles = allowedRoles.some(
  role => !expectedAllowedRoles.includes(role)
);

if (hasInvalidRoles) {
  await logSecurityEvent("ROLE_HIERARCHY_VIOLATION");
}
```

### SOC2 Compliance Features

- **Comprehensive Audit Logging**: All authentication events logged
- **Role Mismatch Detection**: Real-time monitoring for inconsistencies
- **Security Event Tracking**: Failed login attempts, role escalations
- **Data Classification**: 4-tier security levels (CRITICAL, HIGH, MEDIUM, LOW)

## 🚀 Performance Optimizations

### Token Refresh Strategy

- **Proactive Refresh**: Tokens refreshed 60 seconds before expiry
- **Graceful Degradation**: Fallback methods when primary fails
- **Caching**: JWT claims cached in Apollo Client memory

### Error Handling

- **Different Response Types**: JSON errors for API, redirects for pages
- **Retry Logic**: Automatic retry for network failures
- **Circuit Breaker**: Stop retries for permanent failures

## 🔧 Development & Debugging

### Debug Components

- **AuthDebugPanel**: Real-time authentication state display
- **PermissionGuard**: Component-level access control
- **TokenRefreshBoundary**: Automatic token renewal handling

### Environment Variables

```bash
# Required for authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
HASURA_GRAPHQL_ADMIN_SECRET=...
```

## 📚 Related Documentation

- **[Security Implementation](../security/SECURITY_IMPLEMENTATION.md)** - Security features and compliance
- **[Permission System](../PERMISSION_SYSTEM_GUIDE.md)** - Role-based access control
- **[Apollo Client Architecture](APOLLO_CLIENT_ARCHITECTURE.md)** - GraphQL client configuration
- **[Hasura Configuration](../hasura/README.md)** - GraphQL engine setup

## 🎯 Key Takeaways

1. **5-Layer Security**: Each layer provides independent security validation
2. **OAuth Resilience**: Handles race conditions and incomplete sessions gracefully
3. **Enterprise Compliance**: SOC2-ready with comprehensive audit logging
4. **Performance Focus**: Optimized token refresh and caching strategies
5. **Developer Experience**: Rich debugging tools and clear error messages

---

_Last Updated: 2025-06-28 | Architecture Version: Enterprise v2.0_

# API Routes Audit Report
**Date:** 2025-07-07  
**Auditor:** Claude Code  
**Component Path:** /app/api/, /middleware.ts, /app/(dashboard)/

## Executive Summary
The API layer reveals **critical security vulnerabilities** requiring immediate attention. Multiple authentication patterns, debug routes in production, and missing input validation create significant security risks. Score: **6.5/10**. Strong Apollo Client implementation and middleware structure are positive aspects.

## Component Overview
- **Purpose:** Next.js App Router API endpoints, authentication middleware, GraphQL integration
- **Dependencies:** Clerk Auth, Apollo Client, Hasura GraphQL, Next.js 15
- **Interfaces:** REST API endpoints, GraphQL operations, authentication guards, webhook handlers

## Detailed Findings

### API Routes Analysis (/app/api/)

#### Current Endpoint Inventory
```
Authentication & Users:
├── /sync-current-user          ✅ Implemented
├── /check-role                 ✅ Implemented  
├── /update-user-role          ✅ Implemented
├── /debug-user-role           ⚠️  Debug route
└── /debug-staff-create        ⚠️  Debug route

Payrolls Management:
├── /payrolls                  ⚠️  Incomplete (POST is TODO)
├── /payrolls/[id]            ✅ GET only
├── /payrolls/schedule        ✅ Implemented
└── /payroll-dates/[id]       ✅ Implemented

Developer Tools:
├── /developer/*              ✅ Properly secured
├── /fallback                 ✅ Error handling
└── /holidays/sync            ✅ Implemented

Testing & Debug:
├── /test-staff               ❌ NO AUTHENTICATION
└── /fix-oauth-user           ❌ Hardcoded user IDs
```

### Critical Security Issues

#### 1. **CRITICAL: Inconsistent Authentication Patterns**
```typescript
// Pattern 1: withAuth wrapper (newer, secure)
export const POST = withAuth(async (request: Request, { userId, user }) => {
  // Proper authentication
});

// Pattern 2: Manual auth calls (legacy, inconsistent)
export async function POST(request: Request) {
  const { userId } = auth();  // May not throw on failure
  if (!userId) return new Response("Unauthorized", { status: 401 });
}

// Pattern 3: No authentication (CRITICAL)
export async function GET() {
  // Direct database access without any auth check
  const staffResult = await apolloClient.query({...});
}
```
**Files:** `/app/api/test-staff/route.ts:4-33` has NO authentication  
**Risk:** Unauthorized access to sensitive payroll data

#### 2. **CRITICAL: Debug Routes in Production**
```typescript
// app/api/debug-staff-create/route.ts
export async function POST(request: Request) {
  // Debug route with powerful database operations
  const createResult = await apolloClient.mutate({
    mutation: CreateUserDocument,
    variables: createUserInput,
  });
}
```
**Risk:** Information disclosure, unauthorized data manipulation  
**Files:** `debug-staff-create`, `debug-user-role`, `test-staff`, `fix-oauth-user`

#### 3. **CRITICAL: Hardcoded Security Exceptions**
```typescript
// app/api/fix-oauth-user/route.ts:47
const isProblematicUser = targetUserId === "user_2uCU9pKf7RP2FiORHJVM5IH0Pd1";
if (isProblematicUser) {
  // Special handling for specific user
}
```
**Risk:** Security backdoors, privilege escalation

#### 4. **HIGH: Missing Input Validation**
```typescript
// app/api/payrolls/route.ts:52
const body = await request.json(); // No validation
const result = await apolloClient.mutate({
  variables: body  // Direct use without sanitisation
});
```
**Risk:** Injection attacks, data corruption

### Missing CRUD Operations

#### Payrolls Management
```typescript
// app/api/payrolls/route.ts:54-65
export async function POST(request: Request) {
  // TODO: Implement payroll creation
  return new Response("Not implemented", { status: 501 });
}

// Missing:
// PUT /payrolls/[id]     - Update payroll
// DELETE /payrolls/[id]  - Delete payroll (with dependencies)
```

#### Client Management Gaps
- ❌ **Bulk client updates** - `/api/clients/bulk-update`
- ❌ **Client deletion** - `/api/clients/[id]` DELETE method
- ❌ **Client status management** - `/api/clients/[id]/status`

#### User Management Gaps  
- ❌ **User deactivation** - `/api/users/[id]/deactivate`
- ❌ **Bulk user operations** - `/api/users/bulk-update`
- ❌ **Password reset triggers** - `/api/users/[id]/reset-password`

### Error Handling Assessment

#### Inconsistent Error Response Formats
```typescript
// Format 1: Simple error
return new Response("Error message", { status: 400 });

// Format 2: JSON error object
return NextResponse.json({ error: "Error message" }, { status: 400 });

// Format 3: Success/error object
return NextResponse.json({ 
  success: false, 
  error: "Error message",
  data: null 
}, { status: 400 });
```
**Impact:** Frontend error handling becomes unreliable

#### Information Leakage in Errors
```typescript
// app/api/sync-current-user/route.ts:78-79
} catch (error) {
  console.error("Error in sync-current-user:", error);
  return NextResponse.json({ 
    success: false, 
    error: error.message  // Exposes internal error details
  }, { status: 500 });
}
```
**Risk:** Stack traces and database errors exposed to clients

### Middleware Analysis (/middleware.ts)

#### Strengths
- ✅ **Clean OAuth callback handling** prevents redirect loops
- ✅ **Request ID correlation** for debugging
- ✅ **Proper static asset bypassing**
- ✅ **JWT integration** with Clerk

#### Security Concerns
```typescript
// Line 32: Overly permissive static asset regex
const isStaticFile = request.nextUrl.pathname.match(
  /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/
);
```
**Risk:** Potential security bypass through crafted file extensions

#### Missing Security Features
- ❌ **Rate limiting** middleware
- ❌ **Request size limits** 
- ❌ **CORS configuration** for API routes
- ❌ **Security headers** (CSP, HSTS, etc.)

### Next.js App Router Structure

#### Route Protection Analysis
```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AuthGuard>  {/* ✅ Proper authentication guard */}
        <DatabaseUserGuard>  {/* ✅ Database user validation */}
          {children}
        </DatabaseUserGuard>
      </AuthGuard>
    </div>
  );
}
```
**Positive:** Strong authentication guard implementation

#### Missing UX Components
- ❌ **Loading states**: No `loading.tsx` files in most routes
- ❌ **Error boundaries**: Limited error handling at route level
- ❌ **Not found pages**: No custom 404 pages for branded experience

### GraphQL Integration Assessment

#### Apollo Client Configuration (Strong)
```typescript
// lib/apollo/unified-client.ts
const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    authLink,        // ✅ JWT injection
    errorLink,       // ✅ Error handling with retry
    httpLink,        // ✅ HTTP transport
  ]),
  cache: new InMemoryCache({
    typePolicies: typePolicies,  // ✅ Proper caching
  }),
});
```

#### Subscription Handling Issues
```typescript
// lib/apollo/links/websocket-link.ts
const wsLink = new GraphQLWsLink(createClient({
  url: process.env.NEXT_PUBLIC_HASURA_WS_URL!,
  connectionParams: () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }),
  // Missing: Error handling for WebSocket failures
}));
```
**Risk:** Silent failures in real-time features

## Performance Assessment

### API Response Optimization
```typescript
// Missing cache headers on API responses
export async function GET() {
  const data = await expensiveQuery();
  return NextResponse.json(data);  // Should include Cache-Control headers
}

// Recommended:
return NextResponse.json(data, {
  headers: { 'Cache-Control': 'max-age=300' }
});
```

### File Upload Performance Issues
```typescript
// app/api/bulk-upload/clients/route.ts:92
const csvData = await csvFile.text();  // Loads entire file into memory
const records = parse(csvData);        // Processes all at once
```
**Risk:** Memory exhaustion with large CSV files  
**Recommendation:** Implement streaming CSV processing

## Consistency Issues

### Authentication Pattern Standardisation
```typescript
// Recommended: Standardise on withAuth pattern
export const GET = withAuth(async (request: Request, { userId, user }) => {
  // Consistent authentication
  // Automatic error handling
  // Type-safe user object
});
```

### Error Response Standardisation
```typescript
// Recommended: Standard error format
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

## Security Recommendations

### Immediate Security Fixes
1. **Remove debug routes from production**:
   ```typescript
   if (process.env.NODE_ENV === 'production') {
     return new Response("Not found", { status: 404 });
   }
   ```

2. **Implement input validation**:
   ```typescript
   import { z } from 'zod';
   
   const PayrollSchema = z.object({
     name: z.string().min(1).max(100),
     clientId: z.string().uuid(),
     eftDate: z.string().datetime(),
   });
   
   const body = PayrollSchema.parse(await request.json());
   ```

3. **Add rate limiting**:
   ```typescript
   import { Ratelimit } from "@upstash/ratelimit";
   
   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(10, "10 s"),
   });
   ```

## Missing Functionality

### Critical Missing APIs
- **Bulk operations** for all entities (users, clients, payrolls)
- **File export APIs** for reports and data dumps  
- **Webhook handlers** for external integrations
- **Health check endpoints** for monitoring
- **Metrics APIs** for dashboard statistics

### Missing Audit Functionality
- **API access logging** for all sensitive operations
- **Permission change tracking** via API
- **Data export audit trails**
- **Failed authentication logging**

## Potential Error Sources

### Runtime Error Patterns
```typescript
// 1. Unhandled async errors
export async function GET() {
  const data = await mayFailQuery();  // No try/catch
  return NextResponse.json(data);
}

// 2. Type assertion without validation
const body = await request.json() as PayrollInput;  // Unsafe

// 3. Missing null checks
const result = await apolloClient.query({...});
return NextResponse.json(result.data.users[0].email);  // May throw
```

### Database Connection Issues
- **No connection pooling** management in API routes
- **No query timeout** handling
- **No retry logic** for transient failures

## Recommendations

### Critical Issues (Fix Immediately)
- [ ] **Remove all debug/test routes from production build**
- [ ] **Standardise authentication across all API endpoints**  
- [ ] **Remove hardcoded user ID exceptions**
- [ ] **Implement comprehensive input validation**
- [ ] **Add rate limiting middleware**

### Major Issues (Fix Soon)
- [ ] **Complete missing CRUD operations**
- [ ] **Standardise error response formats**
- [ ] **Add proper loading states and error boundaries**
- [ ] **Implement API response caching**
- [ ] **Add audit logging to sensitive operations**

### Minor Issues (Address in Next Release)
- [ ] **Add page-specific metadata and SEO**
- [ ] **Implement file upload streaming**
- [ ] **Add comprehensive API documentation**
- [ ] **Optimise GraphQL query batching**

### Enhancements (Future Consideration)
- [ ] **API versioning strategy**
- [ ] **Advanced caching with Redis**
- [ ] **Real-time API event logging**
- [ ] **Advanced security monitoring**

## Action Items
- [ ] **CRITICAL:** Audit and secure all debug routes
- [ ] **CRITICAL:** Implement consistent authentication pattern
- [ ] **CRITICAL:** Add input validation to all endpoints
- [ ] **HIGH:** Complete missing CRUD operations
- [ ] **HIGH:** Add rate limiting and security headers
- [ ] **MEDIUM:** Standardise error handling
- [ ] **MEDIUM:** Add comprehensive loading states
- [ ] **LOW:** Implement advanced caching strategies

## Overall API Security Score: 6.5/10
**Strengths:** Strong Apollo Client setup, good middleware foundation  
**Critical Issues:** Authentication inconsistencies, debug routes in production, missing input validation
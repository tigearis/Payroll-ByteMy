# App Directory Documentation

## Overview

The `/app` directory implements Next.js 15 App Router architecture with enterprise-grade security and strict authentication patterns. This directory contains all application routes, layouts, and API endpoints following a domain-driven design approach.

## Architecture Patterns

- **Route Groups**: `(auth)` and `(dashboard)` for logical organization
- **Nested Layouts**: Hierarchical layout system with authentication boundaries
- **Server Components**: Default server-side rendering with selective client components
- **API Routes**: RESTful endpoints with role-based access control
- **Security Middleware**: Comprehensive auth guard on all protected routes

## Authentication & Authorization

### Route Protection
- All routes under `(dashboard)` require authentication via `middleware.ts`
- JWT tokens automatically injected via Clerk's Hasura template
- Role-based access control enforced at route and component levels

### Security Headers
- CSP (Content Security Policy) configured in `next.config.js`
- HSTS, X-Frame-Options, and other security headers enabled
- CSRF protection on all state-changing operations

## Directory Structure

```
/app
├── (auth)/                 # Unauthenticated routes
│   ├── sign-in/           # Clerk-powered authentication
│   ├── sign-up/           # User registration flow
│   └── layout.tsx         # Auth layout wrapper
├── (dashboard)/           # Protected application routes
│   ├── calendar/          # Event and schedule management
│   ├── clients/           # Customer relationship management
│   ├── payrolls/          # Payroll processing interface
│   ├── staff/             # Employee management
│   ├── security/          # Security dashboard and audit
│   └── layout.tsx         # Dashboard layout with nav
├── api/                   # Backend API endpoints
│   ├── auth/              # Authentication utilities
│   ├── staff/             # Staff management operations
│   ├── payrolls/          # Payroll processing endpoints
│   └── webhooks/          # External integrations
├── globals.css           # Global styles and design tokens
├── layout.tsx            # Root application layout
└── providers.tsx         # Provider composition
```

## Key Files Analysis

### `/app/layout.tsx`
- **Purpose**: Root application layout with provider composition
- **Authentication**: No auth required (handles both authenticated and unauthenticated states)
- **Business Logic**: Provider setup, font loading, metadata configuration
- **Data Flow**: 
  1. Loads Inter font family
  2. Sets up ClerkProvider with appearance customization
  3. Initializes Apollo GraphQL provider
  4. Configures toast notifications (Sonner)
- **External Services**: Clerk authentication, Apollo GraphQL
- **Related Components**: `providers.tsx`, `middleware.ts`

### `/app/providers.tsx`
- **Purpose**: Provider composition with security guards and global state management
- **Authentication**: Integrates ClerkProvider with custom authentication context
- **Business Logic**: 
  - User synchronization between Clerk and database
  - Session expiry handling with automatic refresh
  - Global error boundary setup
- **Data Flow**:
  1. ClerkProvider handles authentication state
  2. ApolloProvider manages GraphQL client with auto-token injection
  3. AuthProvider bridges Clerk session with database user
  4. SessionExpiryHandler manages token refresh
- **External Services**: Clerk, Apollo GraphQL, Hasura
- **Related Components**: `lib/auth-context.tsx`, `lib/session-expiry-handler.tsx`

### `/app/middleware.ts`
- **Purpose**: Primary authentication and security middleware
- **Authentication**: Validates JWT tokens and enforces route protection
- **Business Logic**:
  - Route-based authentication enforcement
  - Security header injection
  - Audit logging for protected routes
  - Public route allowlist management
- **Data Flow**:
  1. Intercepts all requests
  2. Validates authentication for protected routes
  3. Injects security headers
  4. Logs access attempts for audit trail
- **External Services**: Clerk for JWT validation
- **Related Components**: Auth guards, security config

## API Routes Structure

All API routes follow RESTful conventions with role-based access control:

### Authentication Endpoints (`/api/auth/`)
- **Purpose**: Authentication utilities and token management
- **Security**: Public access with rate limiting
- **Operations**: Token validation, claims extraction, debug endpoints

### Staff Management (`/api/staff/`)
- **Purpose**: Employee lifecycle management
- **Security**: Role-based access (manager+ required)
- **Operations**: Create, update, delete staff members with Clerk integration

### Payroll Operations (`/api/payrolls/`)
- **Purpose**: Payroll processing and calculation
- **Security**: Manager+ required, audit logging enabled
- **Operations**: Payroll creation, calculation, approval workflows

### Webhook Handlers (`/api/webhooks/`)
- **Purpose**: External system integration
- **Security**: Signature validation, IP allowlisting
- **Operations**: Clerk user sync, external payment processing

## Security Implementation

### Route Protection Strategy
1. **Middleware Layer**: `middleware.ts` validates authentication
2. **Layout Guards**: Dashboard layout ensures database user exists
3. **Component Guards**: Individual components enforce specific permissions
4. **API Guards**: All API routes validate role requirements

### Audit Logging
- All protected route access logged
- Failed authentication attempts tracked
- Business operation audit trail maintained
- SOC2 compliance logging implemented

### Error Handling
- Global error boundaries for graceful degradation
- Security-aware error messages (no sensitive data exposure)
- Rate limiting on authentication endpoints
- CSRF protection on state-changing operations

## Data Flow Patterns

### Authentication Flow
1. User accesses protected route
2. Middleware validates Clerk session
3. JWT token extracted with Hasura claims
4. Database user verified via guards
5. Component-level permissions enforced
6. Audit log entry created

### Business Operation Flow
1. User interaction in dashboard component
2. Apollo GraphQL mutation called
3. JWT token automatically injected
4. Hasura applies row-level security
5. Database operation executed with audit
6. Real-time UI update via subscriptions

## Related Documentation
- [Components README](../components/README.md) - UI component architecture
- [API Documentation](../pages/api/README.md) - Detailed API endpoint docs
- [Authentication Guide](../lib/README.md) - Authentication implementation details
- [Security Report](../SECURITY_IMPROVEMENT_REPORT.md) - Security analysis and recommendations
# API Routes Documentation

## Overview

The `/app/api` directory implements a comprehensive RESTful API layer with enterprise security, role-based access control, and SOC2 compliance. All endpoints integrate with Clerk authentication and Hasura GraphQL for secure data operations.

## Architecture Patterns

- **RESTful Design**: Standard HTTP methods with consistent response formats
- **Role-Based Access Control**: Hierarchical permission enforcement
- **Audit Logging**: Comprehensive logging for SOC2 compliance
- **Input Validation**: Zod schema validation for all endpoints
- **Error Handling**: Consistent error responses with security awareness

## Authentication & Authorization

### Security Layers

1. **Clerk Authentication**: JWT token validation for all protected routes
2. **Role Validation**: Minimum role requirements enforced per endpoint
3. **Permission Checking**: Granular permission validation for sensitive operations
4. **Rate Limiting**: Protection against abuse and DoS attacks
5. **Audit Logging**: Complete audit trail for compliance

### Security Headers

All API responses include security headers:

- CORS policies for allowed origins
- Content-Type validation
- CSRF protection tokens
- Security policy headers

## API Route Analysis

### Authentication Endpoints (`/app/api/auth/`)

#### `/app/api/auth/hasura-claims/route.ts`

- **Purpose**: JWT claims extraction and validation for Hasura integration
- **Authentication**: Requires valid Clerk session
- **Business Logic**:
  - Extracts Hasura-specific claims from JWT
  - Validates claim structure and required fields
  - Returns formatted claims for client consumption
- **Data Flow**:
  1. Client requests current user claims
  2. Server validates Clerk session
  3. JWT decoded and Hasura claims extracted
  4. Claims validated against expected schema
  5. Formatted response returned to client
- **External Services**: Clerk JWT validation
- **Related Components**: Authentication context, GraphQL client

#### `/app/api/auth/token/route.ts`

- **Purpose**: Token management and refresh utilities
- **Authentication**: Requires valid Clerk session
- **Business Logic**:
  - Token validation and refresh
  - Claims verification and formatting
  - Session health checking
- **Data Flow**:
  1. Client requests token validation
  2. Current session retrieved from Clerk
  3. Token validity checked and refreshed if needed
  4. New token returned with updated expiry
- **External Services**: Clerk session management
- **Related Components**: Session expiry handler

### Staff Management (`/app/api/staff/`)

#### `/app/api/staff/create/route.ts`

- **Purpose**: Staff member creation with Clerk invitation integration
- **Authentication**: Manager+ role required
- **Business Logic**:
  - New employee onboarding workflow
  - Clerk user invitation with role assignment
  - Database user record creation
  - Initial permission setup
- **Data Flow**:
  1. Manager submits new staff creation request
  2. Input validation using Zod schema
  3. Role authorization check performed
  4. Database user record created
  5. Clerk invitation sent with role metadata
  6. Audit log entry created for compliance
- **External Services**: Clerk invitation API, email service
- **Related Components**: Staff management interface, user creation modal

#### `/app/api/staff/update-role/route.ts`

- **Purpose**: Employee role modification with immediate permission updates
- **Authentication**: Org Admin+ role required
- **Business Logic**:
  - Role hierarchy validation
  - Permission transition management
  - Immediate permission refresh
  - Audit trail maintenance
- **Data Flow**:
  1. Admin requests role change for employee
  2. Current and target roles validated
  3. Permission impact analysis performed
  4. Database and Clerk metadata updated atomically
  5. User session refreshed with new permissions
  6. Audit log captures role change details
- **External Services**: Clerk metadata API, permission service
- **Related Components**: User management interface, role assignment

#### `/app/api/staff/delete/route.ts`

- **Purpose**: Employee deactivation and offboarding workflow
- **Authentication**: Org Admin+ role required
- **Business Logic**:
  - Employee account deactivation
  - Data retention compliance
  - Access revocation
  - Audit trail preservation
- **Data Flow**:
  1. Admin initiates employee deactivation
  2. Active sessions and tokens invalidated
  3. Database record marked as inactive (not deleted)
  4. Clerk account disabled
  5. Data retention policies applied
  6. Complete audit trail maintained
- **External Services**: Clerk account management
- **Related Components**: Staff management, deactivation workflow

### Payroll Operations (`/app/api/payrolls/`)

#### `/app/api/payrolls/route.ts`

- **Purpose**: Payroll CRUD operations with business rule enforcement
- **Authentication**: Manager+ role required
- **Business Logic**:
  - Payroll creation and modification
  - Business rule validation
  - State transition management
  - Approval workflow integration
- **Data Flow**:
  1. Manager creates or modifies payroll
  2. Business rules validated (date ranges, employee eligibility)
  3. Calculation engine triggered for wage computations
  4. State transitions logged for audit
  5. Approval workflow initiated if required
- **External Services**: Calculation engine, approval service
- **Related Components**: Payroll management interface

#### `/app/api/payrolls/[id]/route.ts`

- **Purpose**: Individual payroll management with detailed operations
- **Authentication**: Manager+ role, must have access to specific payroll
- **Business Logic**:
  - Payroll detail retrieval and updates
  - Employee-level calculations
  - Manual adjustment capabilities
  - Version control and history
- **Data Flow**:
  1. Request for specific payroll operations
  2. Access permissions validated for payroll
  3. Business operations performed with validation
  4. Version history maintained automatically
  5. Real-time updates propagated to clients
- **External Services**: Calculation service, notification system
- **Related Components**: Payroll detail interface, calculation components

#### `/app/api/payrolls/schedule/route.ts`

- **Purpose**: Payroll scheduling and deadline management
- **Authentication**: Manager+ role required
- **Business Logic**:
  - Payroll schedule creation and management
  - Deadline calculation and enforcement
  - Holiday and business day handling
  - Automated reminder system
- **Data Flow**:
  1. Manager configures payroll schedule
  2. Business calendar integration applied
  3. Deadlines calculated with buffer times
  4. Automated reminders scheduled
  5. Schedule conflicts detected and reported
- **External Services**: Calendar service, notification system
- **Related Components**: Schedule management, calendar integration

### Webhook Handlers (`/app/api/webhooks/`)

#### `/app/api/webhooks/clerk/route.ts`

- **Purpose**: Clerk webhook processing for user synchronization
- **Authentication**: Webhook signature validation (no user auth)
- **Business Logic**:
  - User lifecycle event processing
  - Database synchronization with Clerk
  - Profile update propagation
  - Account status management
- **Data Flow**:
  1. Clerk sends webhook for user events
  2. Webhook signature validated for security
  3. Event type determined and processed
  4. Database operations performed to sync state
  5. Related systems notified of changes
- **External Services**: Clerk webhook validation
- **Related Components**: User sync service, authentication context

### Developer and Administrative (`/app/api/developer/`)

#### `/app/api/developer/route.ts`

- **Purpose**: Development and debugging utilities
- **Authentication**: Developer role required
- **Business Logic**:
  - System health monitoring
  - Database maintenance operations
  - Debug information extraction
  - Development tool access
- **Data Flow**:
  1. Developer requests system information
  2. Comprehensive system state gathered
  3. Sensitive information filtered appropriately
  4. Debug data compiled and returned
- **External Services**: System monitoring, health checks
- **Related Components**: Developer dashboard, system monitoring

### Audit and Compliance (`/app/api/audit/`)

#### `/app/api/audit/log/route.ts`

- **Purpose**: Audit log management for SOC2 compliance
- **Authentication**: Org Admin+ role required
- **Business Logic**:
  - Audit trail retrieval and analysis
  - Compliance report generation
  - Security event monitoring
  - Data retention management
- **Data Flow**:
  1. Admin requests audit information
  2. Audit logs filtered by permissions and date range
  3. Compliance analysis performed
  4. Secure delivery of audit data
- **External Services**: Audit logging service, compliance tools
- **Related Components**: Security dashboard, compliance reporting

#### `/app/api/audit/compliance-report/route.ts`

- **Purpose**: SOC2 compliance report generation
- **Authentication**: Org Admin+ role required
- **Business Logic**:
  - Comprehensive compliance data collection
  - Report formatting for regulatory requirements
  - Secure report delivery
  - Access tracking for reports
- **Data Flow**:
  1. Admin initiates compliance report generation
  2. Data collected from all audit sources
  3. Report formatted according to SOC2 requirements
  4. Secure delivery mechanism activated
  5. Report access logged for audit trail
- **External Services**: Report generation, secure delivery
- **Related Components**: Compliance dashboard, audit management

## Security Implementation

### Input Validation

All endpoints implement comprehensive input validation:

- **Zod Schemas**: Type-safe validation for all request bodies
- **Parameter Validation**: URL parameters and query strings validated
- **File Upload Security**: Content type and size validation
- **SQL Injection Prevention**: Parameterized queries only

### Authentication Flow

1. **JWT Extraction**: Bearer token extracted from Authorization header
2. **Token Validation**: Clerk validates JWT signature and expiry
3. **Claims Extraction**: Hasura claims extracted from token
4. **Role Validation**: Minimum role requirements checked
5. **Permission Validation**: Granular permissions verified if required

### Audit Logging

All API operations are logged for SOC2 compliance:

- **Request Logging**: Method, path, user, timestamp
- **Response Logging**: Status codes, error messages (sanitized)
- **Business Operation Logging**: Entity changes, state transitions
- **Security Event Logging**: Authentication failures, permission denials

### Error Handling

Consistent error response format:

```typescript
{
  error: string;           // User-friendly error message
  code: string;           // Machine-readable error code
  details?: object;       // Additional error context (dev only)
  timestamp: string;      // ISO timestamp
  requestId: string;      // Unique request identifier
}
```

## Rate Limiting

### Strategy

- **Endpoint-Specific Limits**: Different limits for different operations
- **User-Based Limiting**: Per-user rate limits with role considerations
- **IP-Based Limiting**: Additional protection against abuse
- **Sliding Window**: Sophisticated rate limiting algorithm

### Limits

- **Authentication**: 10 requests/minute per IP
- **Data Retrieval**: 60 requests/minute per user
- **Data Modification**: 30 requests/minute per user
- **Administrative**: 100 requests/minute for admin users

## Performance Considerations

### Optimization Strategies

- **Response Caching**: Appropriate cache headers for static data
- **Database Connection Pooling**: Efficient database resource usage
- **Async Operations**: Non-blocking operations where possible
- **Response Compression**: Gzip compression for large responses

### Monitoring

- **Response Time Tracking**: Performance metrics for all endpoints
- **Error Rate Monitoring**: Error frequency and pattern analysis
- **Resource Usage**: CPU, memory, and database utilization
- **User Experience Metrics**: Real-world performance measurement

## Testing Strategy

### Automated Testing

- **Unit Tests**: Individual endpoint logic testing
- **Integration Tests**: End-to-end API workflow testing
- **Security Tests**: Authentication and authorization testing
- **Performance Tests**: Load and stress testing

### Manual Testing

- **Security Audits**: Penetration testing and vulnerability assessment
- **Compliance Testing**: SOC2 requirement validation
- **User Acceptance**: Business workflow validation
- **Error Scenario Testing**: Edge case and failure mode testing

## Related Documentation

- [Authentication Guide](../../lib/README.md) - Authentication implementation
- [Components Documentation](../../components/README.md) - Frontend integration
- [Security Report](../../SECURITY_IMPROVEMENT_REPORT.md) - Security analysis

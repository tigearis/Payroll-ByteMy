# Dashboard Routes Documentation

## Overview

The `/app/(dashboard)` directory contains all authenticated application routes for the payroll management system. These routes are protected by middleware and require valid authentication plus database user verification.

## Authentication & Authorization

### Protection Layers
1. **Middleware Authentication**: `middleware.ts` validates Clerk session
2. **Layout Guards**: `StrictDatabaseGuard` ensures database user exists  
3. **Role-Based Access**: Component-level permission enforcement
4. **Hasura RLS**: Row-level security at database layer

### Role Hierarchy
- **Developer**: Full system access + administrative functions
- **Org Admin**: Organization management + user administration
- **Manager**: Team management + payroll processing
- **Consultant**: Limited access to assigned clients/projects
- **Viewer**: Read-only access to authorized data

## Route Analysis

### `/app/(dashboard)/dashboard/page.tsx`
- **Purpose**: Main dashboard overview with key metrics and alerts
- **Authentication**: Authenticated users only, role-based data filtering
- **Business Logic**:
  - Dashboard statistics aggregation
  - Urgent alert detection and display
  - Recent activity summarization
  - Payroll status monitoring
- **Data Flow**:
  1. User lands on dashboard after authentication
  2. `GetDashboardStats` GraphQL query fetches metrics
  3. Role-based filtering applied via Hasura RLS
  4. Real-time updates via subscription to critical events
  5. Alert notifications displayed based on user permissions
- **External Services**: Hasura GraphQL for data aggregation
- **Related Components**: `upcoming-payrolls.tsx`, `urgent-alerts.tsx`, `recent-activity.tsx`

### `/app/(dashboard)/payrolls/page.tsx`
- **Purpose**: Payroll management interface with processing capabilities
- **Authentication**: Manager+ role required for payroll operations
- **Business Logic**:
  - Payroll run creation and management
  - Employee assignment and calculation
  - Approval workflow management
  - Audit trail maintenance
- **Data Flow**:
  1. Manager accesses payroll management
  2. `GetPayrollList` query loads active payrolls with security filtering
  3. Payroll creation triggers business validation
  4. Calculation engine processes wages, taxes, superannuation
  5. Approval workflow enforces dual authorization
  6. Audit logs capture all state changes
- **External Services**: Hasura for data persistence, external tax calculation APIs
- **Related Components**: `payroll-list-card.tsx`, `edit-payroll-dialog.tsx`, `payroll-version-history.tsx`

### `/app/(dashboard)/payrolls/[id]/page.tsx`
- **Purpose**: Individual payroll details and processing interface
- **Authentication**: Manager+ role, must have access to specific payroll
- **Business Logic**:
  - Payroll detail view with full processing history
  - Employee-level calculation breakdown
  - Manual adjustment capabilities
  - Export functionality (PDF, CSV)
- **Data Flow**:
  1. User selects specific payroll from list
  2. `GetPayrollById` query loads detailed payroll data
  3. RLS ensures user can only access authorized payrolls
  4. Version history tracked for audit compliance
  5. Manual adjustments trigger recalculation workflow
  6. Export operations generate compliance-ready reports
- **External Services**: PDF generation service, CSV export utilities
- **Related Components**: `payroll-details-card.tsx`, `export-pdf.tsx`, `export-csv.tsx`

### `/app/(dashboard)/staff/page.tsx`
- **Purpose**: Employee management interface with invitation system
- **Authentication**: Manager+ role required for staff operations
- **Business Logic**:
  - Staff member creation with Clerk invitation
  - Role assignment and permission management
  - Employee data management (PII handling)
  - Deactivation and offboarding workflows
- **Data Flow**:
  1. Manager accesses staff management
  2. `GetStaffList` query loads employee directory
  3. Staff creation triggers Clerk invitation email
  4. Role assignment updates Hasura permissions immediately
  5. Employee data changes logged for audit compliance
  6. Deactivation preserves data while removing access
- **External Services**: Clerk for user management, email invitation system
- **Related Components**: `user-table.tsx`, `create-user-modal.tsx`, `edit-user-modal.tsx`

### `/app/(dashboard)/staff/[id]/page.tsx`
- **Purpose**: Individual employee profile and management
- **Authentication**: Manager+ role, consultant can view assigned staff
- **Business Logic**:
  - Employee profile management
  - Role and permission modification
  - Employment history tracking
  - Performance and leave management
- **Data Flow**:
  1. User accesses individual employee profile
  2. `GetStaffById` query loads complete employee data
  3. Permission checks ensure appropriate access level
  4. Profile updates sync between Clerk and database
  5. Role changes trigger immediate permission refresh
  6. All modifications logged for compliance
- **External Services**: Clerk metadata updates, audit logging
- **Related Components**: Employee profile components, role management

### `/app/(dashboard)/clients/page.tsx`
- **Purpose**: Customer relationship management interface
- **Authentication**: Consultant+ role required
- **Business Logic**:
  - Client onboarding and management
  - Contract and engagement tracking
  - Billing and payment management
  - Relationship history maintenance
- **Data Flow**:
  1. User accesses client management
  2. `GetClientsList` query loads authorized clients
  3. RLS filters clients based on user assignments
  4. Client creation captures business requirements
  5. Engagement tracking updates project status
  6. Billing integration tracks financial transactions
- **External Services**: Billing integration, document management
- **Related Components**: `clients-table.tsx`, `client-card.tsx`

### `/app/(dashboard)/clients/[id]/page.tsx`
- **Purpose**: Individual client profile and engagement management
- **Authentication**: Consultant+ role, must be assigned to client
- **Business Logic**:
  - Client profile and contact management
  - Project and engagement tracking
  - Financial history and billing
  - Document and communication history
- **Data Flow**:
  1. User selects specific client
  2. `GetClientById` query loads client details
  3. Permission validation ensures client access rights
  4. Engagement updates reflect current project status
  5. Financial data integration provides billing context
  6. Communication history maintains relationship context
- **External Services**: Document storage, billing systems
- **Related Components**: Client detail components, engagement tracking

### `/app/(dashboard)/security/page.tsx`
- **Purpose**: Security dashboard and audit interface
- **Authentication**: Org Admin+ role required
- **Business Logic**:
  - Security event monitoring
  - Access control audit
  - Compliance reporting
  - Incident response tracking
- **Data Flow**:
  1. Admin accesses security dashboard
  2. `GetSecurityEvents` query loads audit data
  3. Real-time monitoring displays current threats
  4. Compliance reports generated on demand
  5. Incident response workflows triggered by alerts
  6. Audit trail provides complete access history
- **External Services**: Security monitoring, compliance reporting
- **Related Components**: Security monitoring components, audit reports

### `/app/(dashboard)/security/reports/page.tsx`
- **Purpose**: Compliance and audit reporting interface
- **Authentication**: Org Admin+ role required
- **Business Logic**:
  - SOC2 compliance report generation
  - Access audit trail compilation
  - Security incident reporting
  - Regulatory compliance tracking
- **Data Flow**:
  1. Admin requests compliance report
  2. `GenerateComplianceReport` mutation triggers report creation
  3. Database audit tables queried for complete history
  4. Report generated with regulatory formatting
  5. Secure delivery mechanism protects sensitive data
  6. Report access logged for audit trail
- **External Services**: Report generation, secure delivery
- **Related Components**: Report generation, compliance tracking

### `/app/(dashboard)/calendar/page.tsx`
- **Purpose**: Schedule and event management interface
- **Authentication**: Authenticated users, role-based event access
- **Business Logic**:
  - Payroll schedule management
  - Holiday and leave tracking
  - Event and deadline management
  - Team calendar coordination
- **Data Flow**:
  1. User accesses calendar interface
  2. `GetCalendarEvents` query loads schedule data
  3. Role-based filtering shows relevant events
  4. Schedule conflicts detected and highlighted
  5. Event creation triggers notification workflows
  6. Integration with payroll processing deadlines
- **External Services**: Calendar integration, notification system
- **Related Components**: Calendar components, schedule management

## Business Logic Distribution

### Client-Side Logic
- Form validation and user input handling
- Optimistic updates for better UX
- Real-time data synchronization
- Permission-based UI rendering

### Server-Side Logic (API Routes)
- Authentication and authorization
- Business rule validation
- Complex calculations (payroll, tax)
- External service integration

### Database Logic (Hasura Functions)
- Data validation and constraints
- Audit trail maintenance
- Complex query optimization
- Row-level security enforcement

## Security Considerations

### Data Protection
- PII (Personally Identifiable Information) handling compliance
- Role-based data masking
- Secure data transmission (HTTPS, encrypted tokens)
- Data retention and deletion policies

### Access Control
- Multi-layer authentication (Clerk + Database + Component)
- Permission inheritance and override patterns
- Session management and timeout handling
- Audit logging for all sensitive operations

### Compliance
- SOC2 Type II compliance requirements
- GDPR data protection compliance
- Financial data security standards
- Regular security audits and penetration testing

## Performance Considerations

### Optimization Strategies
- Server-side rendering for initial page loads
- Client-side caching with Apollo GraphQL
- Lazy loading for non-critical components
- Real-time updates via WebSocket subscriptions

### Monitoring
- Performance metrics tracking
- Error rate monitoring
- User experience analytics
- Database query optimization

## Related Documentation
- [API Routes](../../pages/api/README.md) - Backend endpoint documentation
- [Components](../../components/README.md) - UI component details
- [Security Report](../../SECURITY_IMPROVEMENT_REPORT.md) - Security analysis
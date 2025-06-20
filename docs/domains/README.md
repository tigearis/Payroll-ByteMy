# Domains Documentation

## Overview

The `/domains` directory implements a domain-driven design architecture where business logic is organized by functional domains. Each domain encapsulates its own GraphQL operations, TypeScript types, services, and components, following strict security classification and audit requirements.

## Architecture Patterns

- **Domain-Driven Design**: Business logic organized by functional boundaries
- **Security Classification**: Each domain classified by data sensitivity (CRITICAL, HIGH, MEDIUM, LOW)
- **GraphQL Organization**: Domain-specific operations with auto-generated TypeScript types
- **Service Layer**: Business logic encapsulated in domain services
- **Component Isolation**: Domain-specific UI components when needed

## Security Classification System

### CRITICAL Domains
- **High-risk data**: Authentication, audit, permissions
- **Access Requirements**: Admin + MFA + Full audit trail
- **Data Handling**: Maximum encryption, restricted access
- **Retention**: Extended retention for compliance

### HIGH Domains  
- **Sensitive data**: Users (PII), clients (customer data), billing
- **Access Requirements**: Role-based + audit logging
- **Data Handling**: Encryption, controlled access
- **Retention**: Business retention policies

### MEDIUM Domains
- **Business data**: Payrolls, notes, leave management
- **Access Requirements**: Authentication + basic audit
- **Data Handling**: Standard protection
- **Retention**: Standard business retention

### LOW Domains
- **Configuration data**: Shared utilities, public configurations
- **Access Requirements**: Basic authentication
- **Data Handling**: Standard security
- **Retention**: Minimal retention requirements

## Domain Structure Pattern

Each domain follows a consistent structure:

```
/domains/{domain-name}
├── /graphql
│   ├── fragments.graphql      # Reusable GraphQL fragments
│   ├── queries.graphql        # Data retrieval operations
│   ├── mutations.graphql      # Data modification operations
│   ├── subscriptions.graphql  # Real-time data operations
│   └── /generated            # Auto-generated TypeScript types
├── /types
│   ├── index.ts              # Domain type definitions
│   └── {domain}.ts           # Specific type implementations
├── /services
│   └── {domain}.service.ts   # Business logic services
└── /components (optional)
    └── {domain}-*.tsx        # Domain-specific components
```

## Domain Analysis

### Authentication Domain (`/domains/auth/`) - CRITICAL

#### Security Classification: CRITICAL
- **Purpose**: Core authentication operations and security functions
- **Data Types**: Authentication tokens, security events, access controls
- **Access Control**: Developer role + MFA required
- **Audit Requirements**: Full audit trail with real-time monitoring

#### Key Operations:
- **JWT Token Management**: Secure token validation and refresh
- **Session Management**: User session lifecycle and expiry handling
- **Security Events**: Authentication failures and security incidents
- **Access Control**: Permission validation and role enforcement

#### GraphQL Operations:
- `ValidateToken` - JWT token validation with security checks
- `RefreshSession` - Secure session refresh with audit logging
- `LogSecurityEvent` - Security incident logging and alerting
- `ValidatePermissions` - Real-time permission checking

#### Business Logic:
- Token expiry prediction and proactive refresh
- Failed authentication attempt tracking and lockout
- Session security validation with device fingerprinting
- Security incident detection and automated response

### Users Domain (`/domains/users/`) - HIGH

#### Security Classification: HIGH
- **Purpose**: Employee management and PII handling
- **Data Types**: Personal information, employment data, contact details
- **Access Control**: Manager+ role with data masking for lower roles
- **Audit Requirements**: Complete audit trail for PII access and modifications

#### Key Operations:
- **User Lifecycle**: Employee onboarding, profile management, offboarding
- **Role Management**: Role assignment and permission updates
- **Data Protection**: PII handling with privacy compliance
- **Directory Services**: Employee directory with access controls

#### GraphQL Operations:
- `CreateUser` - New employee creation with validation
- `UpdateUserProfile` - Profile updates with audit logging
- `GetUsersByRole` - Role-based user queries with data filtering
- `DeactivateUser` - Employee offboarding with data retention

#### Business Logic:
- Employee onboarding workflow with Clerk invitation
- Role transition validation and permission updates
- PII access logging for compliance requirements
- Data retention policies for departed employees

### Clients Domain (`/domains/clients/`) - HIGH

#### Security Classification: HIGH
- **Purpose**: Customer relationship management and business data
- **Data Types**: Customer information, contracts, financial data
- **Access Control**: Consultant+ role with client assignment validation
- **Audit Requirements**: Customer data access and modification logging

#### Key Operations:
- **Client Management**: Customer onboarding and profile management
- **Relationship Tracking**: Engagement history and communication logs
- **Financial Integration**: Billing and payment tracking
- **Document Management**: Contract and document storage

#### GraphQL Operations:
- `CreateClient` - New customer onboarding with validation
- `GetClientEngagements` - Relationship history with access controls
- `UpdateClientStatus` - Status changes with business rule validation
- `GetClientFinancials` - Financial data with role-based access

#### Business Logic:
- Client onboarding workflow with compliance checks
- Engagement tracking with automated status updates
- Financial data integration with billing systems
- Document lifecycle management with retention policies

### Payrolls Domain (`/domains/payrolls/`) - MEDIUM

#### Security Classification: MEDIUM
- **Purpose**: Payroll processing and calculation management
- **Data Types**: Payroll runs, calculations, approval workflows
- **Access Control**: Manager+ role for payroll operations
- **Audit Requirements**: Financial operation audit trail

#### Key Operations:
- **Payroll Processing**: Payroll run creation and calculation
- **Approval Workflows**: Multi-stage approval with segregation of duties
- **Calculation Engine**: Wage, tax, and deduction calculations
- **Reporting**: Payroll reports and compliance documentation

#### GraphQL Operations:
- `CreatePayrollRun` - New payroll processing with validation
- `CalculatePayroll` - Financial calculations with audit logging
- `ApprovePayroll` - Approval workflow with authorization checks
- `GeneratePayrollReport` - Report generation with access controls

#### Business Logic:
- Payroll calculation engine with tax compliance
- Approval workflow with dual authorization
- Employee eligibility validation and assignment
- Regulatory compliance reporting and documentation

### Notes Domain (`/domains/notes/`) - MEDIUM

#### Security Classification: MEDIUM
- **Purpose**: Internal communication and documentation
- **Data Types**: Communication logs, internal notes, documentation
- **Access Control**: Authentication required with context-based access
- **Audit Requirements**: Communication audit trail for compliance

#### Key Operations:
- **Communication Management**: Internal messaging and documentation
- **Context Association**: Notes linked to clients, employees, or projects
- **Search and Retrieval**: Full-text search with access controls
- **Audit Trail**: Complete communication history

#### GraphQL Operations:
- `CreateNote` - New note creation with context validation
- `GetNotesByContext` - Context-based note retrieval
- `UpdateNote` - Note modifications with version control
- `SearchNotes` - Full-text search with permission filtering

#### Business Logic:
- Context-based note association and access control
- Full-text search with relevance ranking
- Version control for note modifications
- Communication audit trail for compliance

### Audit Domain (`/domains/audit/`) - CRITICAL

#### Security Classification: CRITICAL
- **Purpose**: Compliance audit logging and SOC2 requirements
- **Data Types**: Audit logs, compliance reports, security events
- **Access Control**: Org Admin+ role with MFA required
- **Audit Requirements**: Meta-audit logging (auditing the audit system)

#### Key Operations:
- **Audit Logging**: Comprehensive event logging for compliance
- **Report Generation**: SOC2 and regulatory compliance reports
- **Event Analysis**: Security incident analysis and trending
- **Data Retention**: Compliance-driven data lifecycle management

#### GraphQL Operations:
- `LogAuditEvent` - Security and business event logging
- `GenerateComplianceReport` - Regulatory compliance reporting
- `GetSecurityEvents` - Security incident retrieval and analysis
- `AnalyzeAccessPatterns` - Access pattern analysis for anomaly detection

#### Business Logic:
- Multi-level audit event classification and processing
- Automated compliance report generation
- Security incident detection and alerting
- Data retention automation with legal compliance

### Permissions Domain (`/domains/permissions/`) - CRITICAL

#### Security Classification: CRITICAL
- **Purpose**: RBAC system and permission management
- **Data Types**: Roles, permissions, access policies
- **Access Control**: Developer role + MFA required
- **Audit Requirements**: Complete permission change audit trail

#### Key Operations:
- **Role Management**: Role definition and hierarchy management
- **Permission Assignment**: Granular permission allocation
- **Access Policy**: Dynamic access policy evaluation
- **Inheritance**: Permission inheritance and override patterns

#### GraphQL Operations:
- `CreateRole` - New role definition with validation
- `AssignPermissions` - Permission allocation with audit logging
- `EvaluateAccess` - Real-time access policy evaluation
- `GetRoleHierarchy` - Role structure retrieval with security filtering

#### Business Logic:
- Hierarchical role system with inheritance patterns
- Dynamic permission evaluation with caching
- Permission change validation and conflict resolution
- Real-time access policy updates and propagation

## Cross-Domain Integration

### Data Flow Patterns
1. **Authentication Flow**: Auth domain → Users domain → Permissions domain
2. **Business Operations**: Users domain → Clients domain → Payrolls domain
3. **Audit Flow**: All domains → Audit domain for compliance logging
4. **Communication**: Notes domain integrated with Users and Clients domains

### Security Boundaries
- **Domain Isolation**: Each domain enforces its own security policies
- **Cross-Domain Validation**: Inter-domain operations require explicit validation
- **Audit Consistency**: Standardized audit logging across all domains
- **Permission Inheritance**: Permissions flow through domain boundaries appropriately

## GraphQL Code Generation

### Generation Strategy
- **Per-Domain Generation**: Each domain generates its own TypeScript types
- **Shared Scalars**: Common scalar types shared across domains
- **Security Classification**: Generated types include security metadata
- **Validation Integration**: Generated types include validation schemas

### Configuration
```typescript
// Domain-specific generation configuration
export const domainCodegenConfig = {
  [domain]: {
    schema: `domains/${domain}/graphql/schema.graphql`,
    documents: `domains/${domain}/graphql/**/*.graphql`,
    generates: {
      [`domains/${domain}/graphql/generated/`]: {
        preset: 'client',
        config: {
          securityClassification: DOMAIN_SECURITY_LEVELS[domain],
          auditRequired: AUDIT_REQUIREMENTS[domain]
        }
      }
    }
  }
};
```

## Business Logic Services

### Service Architecture
Each domain implements business logic through service classes:

```typescript
// Example service structure
export class PayrollService {
  constructor(
    private apolloClient: ApolloClient,
    private auditLogger: AuditLogger,
    private permissionService: PermissionService
  ) {}

  async createPayroll(data: CreatePayrollInput): Promise<Payroll> {
    // 1. Validate permissions
    await this.permissionService.requirePermission('payroll:create');
    
    // 2. Validate business rules
    await this.validatePayrollRules(data);
    
    // 3. Execute operation with audit
    const result = await this.apolloClient.mutate({
      mutation: CREATE_PAYROLL,
      variables: { input: data }
    });
    
    // 4. Log audit event
    await this.auditLogger.log({
      action: 'payroll_created',
      entityId: result.data.createPayroll.id,
      classification: DataClassification.MEDIUM
    });
    
    return result.data.createPayroll;
  }
}
```

## Security Implementation

### Access Control Patterns
- **Domain-Level Access**: Each domain enforces its security classification
- **Operation-Level Permissions**: Individual operations require specific permissions
- **Data-Level Filtering**: Row-level security applied through GraphQL
- **Audit Integration**: All domain operations logged for compliance

### Data Protection
- **Classification Enforcement**: Data handling based on security classification
- **Encryption Requirements**: Sensitive domains use additional encryption
- **Access Logging**: All data access logged with user context
- **Retention Policies**: Domain-specific data retention and purging

## Performance Considerations

### Query Optimization
- **Domain-Specific Caching**: Each domain implements appropriate caching strategies
- **Batching**: Related operations batched for performance
- **Lazy Loading**: Non-critical data loaded on demand
- **Real-time Updates**: WebSocket subscriptions for live data

### Scalability
- **Domain Isolation**: Independent scaling for different domains
- **Database Optimization**: Domain-specific database optimization
- **API Rate Limiting**: Domain-specific rate limiting policies
- **Monitoring**: Per-domain performance monitoring and alerting

## Testing Strategy

### Domain Testing
- **Unit Tests**: Business logic validation and edge cases
- **Integration Tests**: Cross-domain operation testing
- **Security Tests**: Access control and audit logging validation
- **Performance Tests**: Domain-specific load and stress testing

### Compliance Testing
- **Audit Trail Validation**: Complete audit logging verification
- **Access Control Testing**: Permission and role validation
- **Data Protection Testing**: PII handling and encryption validation
- **Retention Policy Testing**: Data lifecycle management validation

## Related Documentation
- [Security Report](../SECURITY_IMPROVEMENT_REPORT.md) - Security analysis per domain
- [API Documentation](../pages/api/README.md) - Backend integration details
- [Components Documentation](../components/README.md) - Domain component integration
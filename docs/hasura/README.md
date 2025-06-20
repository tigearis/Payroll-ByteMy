# Hasura Documentation

## Overview

The `/hasura` directory contains the complete Hasura GraphQL engine configuration, implementing a metadata-driven approach with comprehensive row-level security, role-based permissions, and SOC2-compliant audit logging. This setup provides a secure, scalable GraphQL API layer over PostgreSQL.

## Architecture Patterns

- **Metadata-Driven Configuration**: All Hasura settings defined in YAML metadata
- **Row-Level Security**: Comprehensive RLS policies for data protection
- **Role-Based Permissions**: 5-tier hierarchical role system with granular permissions
- **Audit Integration**: Complete audit trail for all data operations
- **Function Security**: Custom PostgreSQL functions with permission enforcement

## Directory Structure

```
/hasura
├── /metadata                    # Hasura configuration metadata
│   ├── /databases              # Database connection and table metadata
│   │   └── /default
│   │       ├── /functions      # Custom PostgreSQL function definitions
│   │       └── /tables         # Table metadata, permissions, relationships
│   ├── actions.yaml            # Custom business logic actions
│   ├── allow_list.yaml         # GraphQL query allowlisting
│   ├── api_limits.yaml         # API rate limiting configuration
│   ├── graphql_schema_introspection.yaml  # Schema introspection settings
│   ├── inherited_roles.yaml    # Role inheritance configuration
│   ├── query_collections.yaml  # Predefined query collections
│   ├── remote_schemas.yaml     # External GraphQL schema integration
│   └── version.yaml           # Hasura version tracking
├── /migrations                 # Database schema migrations
│   └── /default               # Migration files with timestamps
└── /seeds                     # Initial data and configuration seeds
    └── /default               # Seed data files
```

## Security Architecture

### Role Hierarchy System

#### Role Definitions

1. **Developer** (Highest Privilege)

   - **Purpose**: System administration and debugging
   - **Access**: Full database access, all tables, administrative functions
   - **Restrictions**: Production access requires MFA
   - **Audit Level**: Maximum audit logging

2. **Org Admin** (Organizational Administration)

   - **Purpose**: Organization management and user administration
   - **Access**: User management, organizational data, compliance reports
   - **Restrictions**: Cannot access system configuration
   - **Audit Level**: Full audit trail for administrative actions

3. **Manager** (Team Management)

   - **Purpose**: Team management and payroll processing
   - **Access**: Team data, payroll operations, client assignments
   - **Restrictions**: Limited to assigned teams and clients
   - **Audit Level**: Standard audit logging for business operations

4. **Consultant** (Limited Business Access)

   - **Purpose**: Client work and limited data access
   - **Access**: Assigned client data, personal information
   - **Restrictions**: No user management or system configuration
   - **Audit Level**: Basic audit logging for data access

5. **Viewer** (Read-Only Access)
   - **Purpose**: Read-only access to authorized data
   - **Access**: Limited read access to assigned data
   - **Restrictions**: No modification capabilities
   - **Audit Level**: Access logging only

### Row-Level Security Implementation

#### User Data Protection

```sql
-- Example RLS policy for users table
CREATE POLICY "users_select_policy" ON users
FOR SELECT TO manager, consultant, viewer
USING (
  CASE
    WHEN current_setting('request.jwt.claims', true)::json->>'x-hasura-role' = 'manager'
    THEN manager_id = (current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id')::uuid
    WHEN current_setting('request.jwt.claims', true)::json->>'x-hasura-role' = 'consultant'
    THEN id = (current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id')::uuid
    ELSE false
  END
);
```

#### Client Data Protection

```sql
-- Client access based on assignments
CREATE POLICY "clients_access_policy" ON clients
FOR ALL TO consultant, manager
USING (
  EXISTS (
    SELECT 1 FROM client_assignments ca
    WHERE ca.client_id = clients.id
    AND ca.user_id = (current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id')::uuid
    AND ca.is_active = true
  )
);
```

### Permission Matrix

#### Table-Level Permissions

| Role       | Users     | Clients  | Payrolls | Audit Logs | System Config |
| ---------- | --------- | -------- | -------- | ---------- | ------------- |
| Developer  | Full      | Full     | Full     | Full       | Full          |
| Org Admin  | Full      | Read     | Read     | Read       | None          |
| Manager    | Team Only | Assigned | Full     | None       | None          |
| Consultant | Self Only | Assigned | None     | None       | None          |
| Viewer     | Self Only | Assigned | None     | None       | None          |

#### Operation-Level Permissions

| Operation       | Developer | Org Admin | Manager   | Consultant | Viewer |
| --------------- | --------- | --------- | --------- | ---------- | ------ |
| Create User     | ✅        | ✅        | Team Only | ❌         | ❌     |
| Delete User     | ✅        | ✅        | ❌        | ❌         | ❌     |
| Modify Roles    | ✅        | ✅        | ❌        | ❌         | ❌     |
| Process Payroll | ✅        | ❌        | ✅        | ❌         | ❌     |
| View Audit Logs | ✅        | ✅        | ❌        | ❌         | ❌     |
| Export Data     | ✅        | ✅        | Limited   | ❌         | ❌     |

## Database Functions

### Custom Business Logic Functions

#### `/hasura/metadata/databases/default/functions/public_create_payroll_version.yaml`

- **Purpose**: Payroll versioning with audit trail
- **Security**: Manager+ role required, comprehensive audit logging
- **Business Logic**:
  - Creates new payroll version with complete state capture
  - Validates business rules before version creation
  - Maintains complete audit trail for compliance
  - Handles concurrent modification detection
- **Usage**:

  ```graphql
  mutation CreatePayrollVersion($payroll_id: uuid!, $changes: jsonb!) {
    create_payroll_version(payroll_id: $payroll_id, changes: $changes) {
      version_id
      created_at
      audit_trail
    }
  }
  ```

#### User Synchronization Functions

- **Purpose**: Clerk-to-database user synchronization
- **Security**: System-level access only, triggered by webhooks
- **Business Logic**:
  - Synchronizes user data between Clerk and PostgreSQL
  - Handles role assignment and permission updates
  - Maintains data consistency across systems
  - Provides audit trail for user lifecycle events

#### Audit Trail Functions

- **Purpose**: SOC2-compliant audit logging
- **Security**: Restricted to audit service account
- **Business Logic**:
  - Captures all data modifications with complete context
  - Implements tamper-evident audit logging
  - Provides compliance reporting capabilities
  - Maintains 7-year retention for regulatory requirements

### Permission Enforcement Functions

#### Role Validation

```sql
CREATE OR REPLACE FUNCTION validate_user_role(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role_hierarchy_level(current_setting('request.jwt.claims', true)::json->>'x-hasura-role')
    >= role_hierarchy_level(required_role)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Data Classification Enforcement

```sql
CREATE OR REPLACE FUNCTION enforce_data_classification(table_name text, operation text)
RETURNS boolean AS $$
BEGIN
  -- Implement data classification rules
  -- Return true if operation is permitted for current user/role
  RETURN check_classification_access(
    table_name,
    operation,
    current_setting('request.jwt.claims', true)::json->>'x-hasura-role'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## API Configuration

### Rate Limiting (`/hasura/metadata/api_limits.yaml`)

```yaml
rate_limit:
  global:
    unique_params: IP
    max_reqs_per_min: 120
  per_role:
    developer:
      unique_params: session_var
      max_reqs_per_min: 300
    org_admin:
      unique_params: session_var
      max_reqs_per_min: 200
    manager:
      unique_params: session_var
      max_reqs_per_min: 150
    consultant:
      unique_params: session_var
      max_reqs_per_min: 100
    viewer:
      unique_params: session_var
      max_reqs_per_min: 60

depth_limit:
  global: 10
  per_role:
    developer: 15
    org_admin: 12
    manager: 10
    consultant: 8
    viewer: 6

node_limit:
  global: 100
  per_role:
    developer: 200
    org_admin: 150
    manager: 100
    consultant: 75
    viewer: 50
```

### Query Allowlisting

- **Production Security**: Only pre-approved queries allowed in production
- **Development Mode**: Open query execution for development
- **Audit Integration**: All query executions logged for compliance
- **Performance**: Pre-compiled query execution for optimal performance

### Schema Introspection Control

```yaml
introspection:
  disabled_for_roles:
    - viewer
    - consultant
  metadata_queries:
    developer: enabled
    org_admin: limited
    manager: limited
    consultant: disabled
    viewer: disabled
```

## Security Headers and Policies

### CORS Configuration

```yaml
cors_config:
  allowed_origins:
    - "https://payroll.bytemy.com"
    - "https://staging.payroll.bytemy.com"
  allowed_headers:
    - "Authorization"
    - "Content-Type"
    - "X-Request-ID"
  allowed_methods:
    - "POST"
    - "OPTIONS"
  max_age: 86400
```

### Security Headers

- **Content Security Policy**: Strict CSP to prevent XSS
- **HSTS**: HTTP Strict Transport Security enabled
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME sniffing protection

## Audit and Compliance

### Audit Table Structure

```sql
CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES users(id),
  user_role text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  request_id uuid,
  ip_address inet,
  user_agent text,
  classification data_classification NOT NULL,
  retention_until timestamptz NOT NULL
);
```

### SOC2 Compliance Features

- **Access Logging**: All data access logged with user context
- **Modification Tracking**: Complete before/after state capture
- **Retention Management**: Automated data lifecycle management
- **Compliance Reporting**: Automated SOC2 report generation
- **Incident Response**: Automated security event detection and alerting

### Data Classification Enforcement

```sql
-- Automatic data classification based on table and operation
CREATE OR REPLACE FUNCTION classify_audit_event()
RETURNS trigger AS $$
BEGIN
  NEW.classification := determine_data_classification(
    NEW.entity_type,
    NEW.action,
    NEW.new_values
  );

  NEW.retention_until := calculate_retention_date(
    NEW.classification,
    NEW.timestamp
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Performance Optimization

### Query Performance

- **Index Optimization**: Strategic indexing for common query patterns
- **Connection Pooling**: Efficient database connection management
- **Query Planning**: Optimized execution plans for complex operations
- **Caching**: Application-level caching for frequently accessed data

### Monitoring and Alerting

```yaml
metrics:
  enabled: true
  export_metrics: true

performance_monitoring:
  slow_query_threshold: 1000ms
  connection_pool_monitoring: true
  cache_hit_ratio_monitoring: true

alerting:
  failed_authentication_threshold: 10
  unusual_access_pattern_detection: true
  performance_degradation_alerts: true
```

## Migration Strategy

### Schema Migrations

- **Version Control**: All schema changes tracked in migrations
- **Rollback Capability**: Safe rollback procedures for failed migrations
- **Environment Consistency**: Identical schema across all environments
- **Audit Trail**: Complete migration audit log

### Data Migrations

- **Data Integrity**: Validation of data consistency during migrations
- **Minimal Downtime**: Online migration strategies where possible
- **Backup Requirements**: Complete backup before major migrations
- **Testing**: Comprehensive testing in staging environments

## Backup and Recovery

### Backup Strategy

- **Continuous Backup**: Point-in-time recovery capability
- **Encrypted Storage**: All backups encrypted at rest
- **Geographic Distribution**: Backups stored in multiple regions
- **Compliance**: 7-year backup retention for audit compliance

### Disaster Recovery

- **RTO Target**: 4-hour recovery time objective
- **RPO Target**: 15-minute recovery point objective
- **Automated Failover**: Automatic failover to standby systems
- **Regular Testing**: Monthly disaster recovery testing

## Development Workflow

### Local Development

```bash
# Start local Hasura with development configuration
hasura console --admin-secret development_secret

# Apply migrations to local database
hasura migrate apply --database-name default

# Apply metadata changes
hasura metadata apply
```

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
deploy_hasura:
  steps:
    - name: Validate Migrations
      run: hasura migrate status

    - name: Apply Migrations
      run: hasura migrate apply --database-name default

    - name: Validate Metadata
      run: hasura metadata validate

    - name: Apply Metadata
      run: hasura metadata apply

    - name: Run Security Tests
      run: npm run test:security
```

## Security Monitoring

### Real-time Monitoring

- **Failed Authentication Tracking**: Brute force attack detection
- **Unusual Access Patterns**: Anomaly detection for data access
- **Permission Violations**: Unauthorized access attempt logging
- **Performance Monitoring**: Query performance and resource usage

### Automated Responses

- **Account Lockout**: Automatic lockout for repeated failures
- **Alert Generation**: Real-time security alerts for incidents
- **Audit Log Protection**: Tamper-evident audit log maintenance
- **Compliance Reporting**: Automated compliance report generation

## Related Documentation

- [API Documentation](../pages/api/README.md) - Backend API integration
- [Domains Documentation](../domains/README.md) - Domain-specific GraphQL operations
- [Security Report](../SECURITY_IMPROVEMENT_REPORT.md) - Security analysis and recommendations

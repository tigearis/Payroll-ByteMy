# Hasura Documentation

This document provides a comprehensive overview of the Hasura implementation for the Payroll-ByteMy system, covering architecture, security, operations, and compliance.

## 1. Core Architecture & Principles

_Source: `docs/hasura/README.md`_

- **Metadata-Driven Configuration**: All Hasura settings are defined in YAML files within the `/hasura/metadata` directory, enabling version control and CI/CD.
- **Row-Level Security (RLS)**: PostgreSQL RLS policies are the foundation of data security, ensuring users can only access data they are authorized to see.
- **Role-Based Permissions**: A 5-tier hierarchical role system provides granular control over data access and operations.
- **SOC2-Compliant Auditing**: A dedicated `audit` schema and related functions provide a complete, tamper-evident audit trail for all significant operations.

### 1.1. Directory Structure

```
/hasura
├── /metadata              # Hasura configuration metadata
│   ├── /databases         # Database connection and table metadata
│   └── ...
├── /migrations            # Database schema migrations
└── /seeds                 # Initial data and configuration seeds
```

## 2. Security & Compliance

### 2.1. Role Hierarchy System

_Source: `docs/hasura/README.md`, `SCHEMA_VALIDATION_COMPLETE.md`_

The system uses a 5-tier role hierarchy enforced at the database and GraphQL layer:

1. **Developer**: Full system access for administration and debugging.
2. **Org Admin**: Manages users, organizational data, and compliance reports.
3. **Manager**: Manages team data, payroll processing, and client assignments.
4. **Consultant**: Access limited to their own data and assigned clients.
5. **Viewer**: Read-only access to authorized data.

### 2.2. Row-Level Security (RLS) Examples

_Source: `docs/hasura/README.md`_

RLS policies are the primary mechanism for data segregation.

```sql
-- Example: Restrict client access to assigned users
CREATE POLICY "clients_access_policy" ON clients
FOR ALL TO consultant, manager
USING (
  EXISTS (
    SELECT 1 FROM client_assignments ca
    WHERE ca.client_id = clients.id
    AND ca.user_id = (current_setting('request.jwt.claims', true)::json->>'x-hasura-user-id')::uuid
  )
);
```

### 2.3. SOC2 Compliance & Auditing

_Source: `HASURA_SOC2_COMPLIANCE_CONFIG.md`, `schema-analysis.md`_

A dedicated `audit` schema provides a robust, SOC2-compliant logging framework.

- **`audit.audit_log`**: A comprehensive table with 18 columns capturing all critical events.
- **`audit.auth_events`**: Tracks all authentication successes and failures.
- **Data Integrity**: Audit tables are insert-only for regular users, with no update or delete permissions, ensuring a tamper-evident log.
- **Permissions**: Access to the audit schema is highly restricted. `Admin` and `Org Admin` roles have limited, read-only access for compliance reporting.

### 2.4. Clerk JWT Integration & Debugging

_Source: `HASURA_JWT_DEBUG.md`_

Authentication is handled by Clerk, which generates a JWT containing custom Hasura claims.

**JWT Template in Clerk:**
The JWT template named **`hasura`** (must be lowercase) is crucial for passing user context to Hasura.

```json
{
  "https://hasura.io/jwt/claims": {
    "x-hasura-role": "{{user.public_metadata.role}}",
    "x-hasura-user-id": "{{user.public_metadata.databaseId}}",
    "x-hasura-default-role": "viewer",
    "x-hasura-allowed-roles": [
      "developer",
      "org_admin",
      "manager",
      "consultant",
      "viewer"
    ],
    "x-hasura-clerk-user-id": "{{user.id}}"
  }
}
```

**Troubleshooting JWT Issues:**

1. **Verify Template Name**: Must be exactly `hasura`.
2. **Verify User Metadata**: The user's `publicMetadata` in Clerk must contain `role` and `databaseId`.
3. **Test the Template**: Use the "Test" feature in the Clerk dashboard.
4. **Sign Out & In**: Ensure you get a fresh token after any changes.

## 3. Hasura Actions

_Source: `hasura_action_setup.md`_

Hasura Actions are used to implement custom business logic that cannot be handled by standard GraphQL mutations.

**Example Action: `commitPayrollAssignments`**
This action handles the complex logic of reassigning payrolls between consultants.

**Workflow:**

1. **API Route**: A Next.js API route (e.g., `/api/commit-payroll-assignments`) is created to house the business logic.
2. **Custom Types**: GraphQL input and output types for the action are defined in the Hasura console.
3. **Action Definition**: The action is defined in Hasura, linking the GraphQL mutation to the API handler.
4. **Permissions**: Permissions are set to control which roles can execute the action.

## 4. Schema & Data Management

_Source: `graphql-schema-for-advanced-payroll-scheduler.md`, `schema-analysis.md`_

### 4.1. Core Schemas

- **`public`**: Contains the main application tables (e.g., `users`, `clients`, `payrolls`).
- **`audit`**: Contains tables for SOC2 compliance and audit logging.

### 4.2. Schema Validation & Best Practices

- **Field Exposure**: Ensure all necessary table columns are exposed to the appropriate roles in Hasura permissions. A common past issue was `versioning` fields on the `payrolls` table being hidden from `consultant` and `manager` roles (`SCHEMA_VALIDATION_COMPLETE.md`).
- **Standardization**: Use a single, standardized audit system (`audit.audit_log`) and avoid fragmented logging.
- **Views for Dashboards**: For performance-intensive dashboard queries, consider creating materialized views (e.g., `public.audit_summary`) to provide aggregated data without giving broad access to raw audit logs.

## 5. API & Performance

_Source: `docs/hasura/README.md`_

### 5.1. API Security

- **Rate Limiting**: Configured in `api_limits.yaml` on a per-role basis to prevent abuse.
- **Query Allowlisting**: In production, only pre-approved queries are allowed to run.
- **Schema Introspection**: Disabled for lower-privileged roles like `viewer` and `consultant`.

### 5.2. Performance

- **Index Optimization**: Strategic indexes are critical for query performance, especially on frequently queried columns in `payrolls`, `payroll_dates`, and `leaves`.
- **Connection Pooling**: Managed by Hasura to ensure efficient database connection use.
- **Slow Query Monitoring**: The `audit.slow_queries` table and Hasura's performance monitoring tools help identify and optimize slow operations.

---

**Document Status**: Consolidated & Live
**Last Updated**: Current Date

---

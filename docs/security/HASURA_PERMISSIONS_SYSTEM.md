# Hasura Permissions System Documentation

## Overview

This document provides comprehensive documentation for the Hasura GraphQL permissions system implemented in the Payroll Matrix application. The system provides enterprise-grade, SOC2-compliant role-based access control (RBAC) across all data operations.

## Table of Contents

- [Role Hierarchy](#role-hierarchy)
- [Permission Structure](#permission-structure)
- [Core Tables](#core-tables)
- [Business Logic Patterns](#business-logic-patterns)
- [Security Principles](#security-principles)
- [Maintenance Guidelines](#maintenance-guidelines)

## Role Hierarchy

The system implements a hierarchical role structure using Hasura's inherited roles feature:

```yaml
# /hasura/metadata/inherited_roles.yaml
- role_name: consultant
  role_set:
    - viewer
- role_name: manager
  role_set:
    - consultant
    - viewer
- role_name: org_admin
  role_set:
    - consultant
    - viewer
    - manager
```

### Role Definitions

| Role | Description | Access Level |
|------|-------------|--------------|
| **viewer** | Basic read-only access to own data | Minimal |
| **consultant** | Payroll processing staff | Standard operational |
| **manager** | Team management and oversight | Supervisory |
| **org_admin** | Organization-wide administration | Administrative |
| **developer** | Full system access | System-level |

## Permission Structure

### CRUD Operations

Each role has carefully defined permissions for:
- **SELECT**: Data reading with filtering
- **INSERT**: Data creation with validation
- **UPDATE**: Data modification with constraints
- **DELETE**: Data removal with restrictions

### Column-Level Security

Permissions specify exact columns accessible to each role:

```yaml
# Example from billing_items table
- role: consultant
  permission:
    columns:
      - id
      - payroll_id
      - payroll_date_id
      - client_id
      - service_id
      - description
      - quantity
      - unit_price
      - amount
      - created_at
    filter:
      _or:
        - payroll: { primary_consultant_user_id: { _eq: "X-Hasura-User-Id" } }
        - payroll: { backup_consultant_user_id: { _eq: "X-Hasura-User-Id" } }
```

## Core Tables

### User Management Tables

#### `users`
- **Purpose**: Central user registry
- **Key Filters**: 
  - Consultants: Own profile + staff visibility
  - Managers: Own profile + managed consultants
  - Org Admin: All users

#### `user_roles`
- **Purpose**: Role assignments
- **Security**: Only org_admin can modify roles

### Payroll Operations Tables

#### `payrolls`
- **Purpose**: Main payroll records
- **Access Patterns**:
  - **Consultant**: Primary + backup assignments
  - **Manager**: Own payrolls + managed consultants' payrolls
  - **Org Admin**: All payrolls

#### `billing_items`
- **Purpose**: Billable work items
- **Enhanced Columns**: Added 10+ missing columns including:
  - `payroll_date_id`: Links to specific EFT cycles
  - `service_id`: Service catalog integration
  - `hourly_rate`, `total_amount`: Financial calculations
  - `staff_user_id`: Work attribution
  - `notes`: Additional context

#### `time_entries`
- **Purpose**: Time tracking for billable work
- **Access Patterns**:
  - **Consultant**: Own entries + assigned payroll entries
  - **Manager**: Team oversight + own entries
- **Enhanced**: Added consultant/manager insert permissions

### Client Management Tables

#### `clients`
- **Purpose**: Client information and relationships
- **Filtering**: Based on payroll assignments and consultant relationships

#### `files`
- **Purpose**: Document management
- **Enhanced Columns**: Corrected to actual schema:
  - `filename` (not `file_name`)
  - `size` (not `file_size`)
  - `object_key` (not `file_path`)

### Communication Tables

#### `email_templates`
- **Purpose**: Email template management
- **Column Corrections**:
  - `subject_template` (not `subject`)
  - `html_content`/`text_content` (not `body_html`/`body_text`)
  - `approved_at` status logic (not `status` enum)

#### `notes`
- **Purpose**: Contextual notes and comments
- **Fixed Columns**: Converted to snake_case:
  - `user_id`, `entity_type`, `entity_id`, `is_important`

## Business Logic Patterns

### Manager Oversight Pattern

Managers can access data from consultants they supervise:

```yaml
filter:
  _or:
    - user_id: { _eq: "X-Hasura-User-Id" }  # Own data
    - author: { manager_id: { _eq: "X-Hasura-User-Id" } }  # Managed consultants
```

### Consultant Assignment Pattern

Consultants access payrolls where they are primary or backup:

```yaml
filter:
  _or:
    - payroll: { primary_consultant_user_id: { _eq: "X-Hasura-User-Id" } }
    - payroll: { backup_consultant_user_id: { _eq: "X-Hasura-User-Id" } }
```

### User Ownership Pattern

Personal data accessible only to the owner:

```yaml
filter:
  user_id: { _eq: "X-Hasura-User-Id" }
```

## Security Principles

### 1. Principle of Least Privilege
- Each role has minimum necessary permissions
- Column-level restrictions where appropriate
- Row-level security based on relationships

### 2. Defense in Depth
- Multiple filter conditions
- Relationship-based access controls
- Explicit column specifications (avoiding `*` where possible)

### 3. SOC2 Compliance
- Complete audit trails
- Proper data classification
- Access logging and monitoring

### 4. Business Logic Alignment
- Permissions match operational workflows
- Hierarchical oversight capabilities
- Separation of duties

## Database Schema Alignment

### Critical Fix: Column Name Consistency

**Issue Resolved**: Permissions referenced GraphQL field names (camelCase) instead of database column names (snake_case).

**Examples of Corrections**:
- `userId` → `user_id`
- `createdAt` → `created_at`
- `isImportant` → `is_important`
- `payrollDateId` → `payroll_date_id`

### Schema Verification Process

1. **GraphQL Schema Reference**: `/shared/schema/schema.graphql`
2. **Database Schema Reference**: `/database/schema.sql`
3. **Conversion Rule**: GraphQL camelCase → Database snake_case

## Maintenance Guidelines

### Adding New Permissions

1. **Identify Business Requirements**
   - Determine which roles need access
   - Define the scope of access (read/write/delete)
   - Identify filtering requirements

2. **Column Verification**
   ```bash
   # Check actual database columns
   grep -A 20 "type TableName" /shared/schema/schema.graphql
   
   # Verify against database schema
   grep -A 15 "CREATE TABLE table_name" /database/schema.sql
   ```

3. **Apply Consistent Patterns**
   - Use established filter patterns
   - Follow naming conventions
   - Maintain role hierarchy

4. **Testing and Validation**
   ```bash
   # Apply changes
   hasura metadata apply
   
   # Check for inconsistencies
   hasura metadata ic list
   ```

### Permission Audit Checklist

- [ ] All column names match database schema (snake_case)
- [ ] Filter logic aligns with business requirements
- [ ] All roles have appropriate permissions
- [ ] No overprivileged access
- [ ] Consistent patterns across similar tables
- [ ] Insert/update/delete permissions align with workflows

### Common Issues and Solutions

#### Issue: Column Not Found
```
Inconsistent object: column "columnName" does not exist
```
**Solution**: Verify actual column name in database schema, convert camelCase to snake_case.

#### Issue: Malformed Filter
```
filter syntax error
```
**Solution**: Ensure proper YAML structure and quote `"X-Hasura-User-Id"`.

#### Issue: Missing Relationship
```
no foreign key constraint exists
```
**Solution**: Check relationship definitions match actual database foreign keys.

## Current Status

### ✅ Completed
- All metadata inconsistencies resolved (40+ fixes)
- Core tables have comprehensive permissions
- Column names aligned with database schema
- Business logic patterns implemented
- Role hierarchy established
- Critical tables enhanced with missing columns

### 🔧 Key Improvements Made
- **billing_items**: Added 10+ missing columns, consultant/manager CRUD
- **time_entries**: Fixed YAML format, added consultant/manager insert
- **email_templates**: Corrected all column references
- **notes, files, leave**: Fixed snake_case column names
- **System tables**: Cleaned up problematic permissions

### 📊 Metrics
- **Tables with Permissions**: 25+ core tables
- **Roles Implemented**: 5 (viewer, consultant, manager, org_admin, developer)
- **Permission Types**: SELECT, INSERT, UPDATE, DELETE
- **Consistency Status**: 100% consistent metadata

## Future Considerations

1. **Performance Optimization**
   - Monitor query performance with complex filters
   - Consider materialized views for frequently accessed data

2. **Additional Security Features**
   - Row-level security policies at database level
   - Enhanced audit logging
   - Permission usage analytics

3. **Role Expansion**
   - Client portal roles
   - Read-only auditor role
   - Temporary access roles

## Support and Troubleshooting

For issues with the permissions system:

1. **Check Consistency**: `hasura metadata ic list`
2. **Review Logs**: Check Hasura server logs for permission denials
3. **Verify Schema**: Ensure column names match database
4. **Test Filters**: Use GraphiQL to test permission logic

## Related Documentation

- [Security Implementation](./SECURITY_IMPLEMENTATION.md)
- [SOC2 Compliance Overview](./SOC2_COMPLIANCE_OVERVIEW.md)
- [API Authentication Guide](./API_AUTHENTICATION_GUIDE.md)
- [Permission Guards Quick Reference](./PERMISSION_GUARDS_QUICK_REFERENCE.md)
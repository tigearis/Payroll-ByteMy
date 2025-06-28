# Hasura Database Schema Documentation

## Overview

This document provides comprehensive documentation of the Hasura metadata and database schema for the Payroll-ByteMy application. The database uses PostgreSQL with multiple schemas: `public`, `audit`, and `neon_auth`.

## Database Schemas

### 1. Public Schema
Contains all main application tables and business logic.

### 2. Audit Schema
Contains audit logging tables for security and compliance tracking.

### 3. Neon Auth Schema
Contains authentication synchronization tables.

## Enum Types

### User and Permission Enums
- **user_role**: `developer`, `org_admin`, `manager`, `consultant`, `viewer`
- **permission_action**: `create`, `read`, `update`, `delete`, `list`, `manage`, `approve`, `reject`
- **status**: `active`, `inactive`, `archived`

### Payroll Enums
- **payroll_cycle_type**: `weekly`, `fortnightly`, `bi_monthly`, `monthly`, `quarterly`
- **payroll_date_type**: `fixed_date`, `eom`, `som`, `week_a`, `week_b`, `dow`
- **payroll_status**: `Active`, `Implementation`, `Inactive`
- **payroll_status_new**: `live`, `inactive`, `onboarding`, `possible`, `implementation`
- **payroll_version_reason**: `initial_creation`, `schedule_change`, `consultant_change`, `client_change`, `correction`, `annual_review`

### Other Enums
- **leave_status_enum**: `Pending`, `Approved`, `Rejected`

## Core Tables

### Users Table (`public.users`)
Central user management table with role-based access control.

**Columns:**
- `id` (uuid, primary key)
- `name` (varchar 255)
- `email` (varchar 255, unique)
- `username` (varchar 100)
- `role` (user_role enum)
- `clerk_user_id` (text) - Integration with Clerk authentication
- `manager_id` (uuid) - Self-referencing foreign key
- `is_staff` (boolean)
- `is_active` (boolean, default: true)
- `image` (text)
- `deactivated_at` (timestamp)
- `deactivated_by` (uuid)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- **Object Relationships:**
  - `managerUser` → users (self-reference via manager_id)
  
- **Array Relationships:**
  - `assignedRoles` → user_roles
  - `authoredNotes` → notes
  - `consultantAssignments` → payroll_assignments
  - `managedPayrolls` → payrolls
  - `managedTeamMembers` → users
  - `userPermissionOverrides` → permission_overrides
  - `userWorkSchedules` → work_schedule

### Clients Table (`public.clients`)
Customer/client information management.

**Columns:**
- `id` (uuid, primary key)
- `name` (varchar 255)
- `contact_person` (varchar 255)
- `contact_email` (varchar 255)
- `contact_phone` (varchar 50)
- `active` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- **Array Relationships:**
  - `billingAssignments` → client_billing_assignment
  - `billing_invoices` → billing_invoice
  - `externalSystems` → client_external_systems
  - `payrolls` → payrolls

### Payrolls Table (`public.payrolls`)
Core payroll management with versioning support.

**Columns:**
- `id` (uuid, primary key)
- `name` (varchar 255)
- `client_id` (uuid, FK → clients)
- `cycle_id` (uuid, FK → payroll_cycles)
- `date_type_id` (uuid, FK → payroll_date_types)
- `date_value` (integer)
- `primary_consultant_user_id` (uuid, FK → users)
- `backup_consultant_user_id` (uuid, FK → users)
- `manager_user_id` (uuid, FK → users)
- `processing_days_before_eft` (integer)
- `status` (payroll_status)
- `payroll_system` (text)
- `processing_time` (time)
- `employee_count` (integer)
- `go_live_date` (date)
- `superseded_date` (timestamp) - Used for versioning
- `version_number` (integer)
- `parent_payroll_id` (uuid, self-reference)
- `version_reason` (payroll_version_reason)
- `created_by_user_id` (uuid, FK → users)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- **Object Relationships:**
  - `backupConsultant` → users
  - `client` → clients
  - `manager` → users
  - `parentPayroll` → payrolls (self-reference)
  - `payrollCycle` → payroll_cycles
  - `payrollDateType` → payroll_date_types
  - `primaryConsultant` → users
  
- **Array Relationships:**
  - `billingItems` → billing_items
  - `childPayrolls` → payrolls (versioning)
  - `payrollDates` → payroll_dates

## Permission System Tables

### Roles Table (`public.roles`)
System and custom role definitions.

**Columns:**
- `id` (uuid, primary key)
- `name` (varchar 50, unique)
- `display_name` (varchar 100)
- `description` (text)
- `priority` (integer, default: 0)
- `is_system_role` (boolean, default: false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- **Array Relationships:**
  - `assignedPermissions` → role_permissions
  - `assignedToUsers` → user_roles

### Permissions Table (`public.permissions`)
Granular permission definitions.

**Columns:**
- `id` (uuid, primary key)
- `resource_id` (uuid, FK → resources)
- `action` (permission_action)
- `description` (text)
- `legacy_permission_name` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**
- **Object Relationships:**
  - `relatedResource` → resources
  
- **Array Relationships:**
  - `assignedToRoles` → role_permissions

### Resources Table (`public.resources`)
Resource definitions for permission system.

**Columns:**
- `id` (uuid, primary key)
- `name` (varchar 50, unique)
- `display_name` (varchar 100)
- `description` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Role Permissions Table (`public.role_permissions`)
Many-to-many relationship between roles and permissions.

**Columns:**
- `id` (uuid, primary key)
- `role_id` (uuid, FK → roles)
- `permission_id` (uuid, FK → permissions)
- `conditions` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### User Roles Table (`public.user_roles`)
Many-to-many relationship between users and roles.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, FK → users)
- `role_id` (uuid, FK → roles)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Permission Overrides Table (`public.permission_overrides`)
Temporary permission overrides for specific users.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, FK → users)
- `permission` (text)
- `granted` (boolean)
- `reason` (text)
- `expires_at` (timestamp)
- `created_by` (uuid, FK → users)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Payroll Supporting Tables

### Payroll Cycles Table (`public.payroll_cycles`)
Defines payroll frequency cycles.

**Columns:**
- `id` (uuid, primary key)
- `name` (payroll_cycle_type)
- `description` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Payroll Date Types Table (`public.payroll_date_types`)
Defines how payroll dates are calculated.

**Columns:**
- `id` (uuid, primary key)
- `name` (payroll_date_type)
- `description` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Payroll Dates Table (`public.payroll_dates`)
Generated payroll processing dates.

**Columns:**
- `id` (uuid, primary key)
- `payroll_id` (uuid, FK → payrolls)
- `original_eft_date` (date)
- `adjusted_eft_date` (date)
- `processing_date` (date)
- `timesheet_submission_date` (date)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Payroll Assignments Table (`public.payroll_assignments`)
Tracks consultant assignments to payrolls.

**Columns:**
- `id` (uuid, primary key)
- `payroll_date_id` (uuid, FK → payroll_dates)
- `consultant_id` (uuid, FK → users)
- `original_consultant_id` (uuid, FK → users)
- `assigned_by` (uuid, FK → users)
- `assigned_at` (timestamp)
- `notes` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Payroll Assignment Audit Table (`public.payroll_assignment_audit`)
Audit trail for assignment changes.

**Columns:**
- `id` (uuid, primary key)
- `assignment_id` (uuid, FK → payroll_assignments)
- `payroll_date_id` (uuid, FK → payroll_dates)
- `from_consultant_id` (uuid, FK → users)
- `to_consultant_id` (uuid, FK → users)
- `changed_by` (uuid, FK → users)
- `change_reason` (text)
- `changed_at` (timestamp)

## Billing Tables

### Billing Plan Table (`public.billing_plan`)
Defines available billing plans.

**Columns:**
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `rate_per_payroll` (numeric 10,2)
- `currency` (text, default: 'AUD')
- `is_active` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Billing Invoice Table (`public.billing_invoice`)
Invoice header information.

**Columns:**
- `id` (uuid, primary key)
- `client_id` (uuid, FK → clients)
- `billing_period_start` (date)
- `billing_period_end` (date)
- `issued_date` (date)
- `due_date` (date)
- `total_amount` (numeric 10,2)
- `status` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Billing Invoice Item Table (`public.billing_invoice_item`)
Individual line items on invoices.

**Columns:**
- `id` (uuid, primary key)
- `invoice_id` (uuid, FK → billing_invoice)
- `description` (text)
- `quantity` (integer, default: 1)
- `unit_price` (numeric 10,2)
- `total_price` (numeric 10,2)
- `created_at` (timestamp)

### Client Billing Assignment Table (`public.client_billing_assignment`)
Links clients to billing plans.

**Columns:**
- `id` (uuid, primary key)
- `client_id` (uuid, FK → clients)
- `billing_plan_id` (uuid, FK → billing_plan)
- `start_date` (date)
- `end_date` (date)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Other Supporting Tables

### Leave Table (`public.leave`)
Employee leave records.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, FK → users)
- `start_date` (date)
- `end_date` (date)
- `leave_type` (text)
- `status` (leave_status_enum)
- `reason` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Work Schedule Table (`public.work_schedule`)
Employee work schedules.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, FK → users)
- `day_of_week` (integer)
- `start_time` (time)
- `end_time` (time)
- `is_active` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Notes Table (`public.notes`)
General notes system.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, FK → users)
- `entity_type` (text)
- `entity_id` (uuid)
- `content` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Holidays Table (`public.holidays`)
Public holiday definitions.

**Columns:**
- `id` (uuid, primary key)
- `name` (varchar 255)
- `date` (date)
- `country` (varchar 50)
- `is_national` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### External Systems Table (`public.external_systems`)
External system integrations.

**Columns:**
- `id` (uuid, primary key)
- `name` (varchar 255)
- `description` (text)
- `api_endpoint` (text)
- `is_active` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Client External Systems Table (`public.client_external_systems`)
Links clients to external systems.

**Columns:**
- `id` (uuid, primary key)
- `client_id` (uuid, FK → clients)
- `system_id` (uuid, FK → external_systems)
- `system_client_id` (varchar 255)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Adjustment Rules Table (`public.adjustment_rules`)
Business rules for date adjustments.

**Columns:**
- `id` (uuid, primary key)
- `cycle_id` (uuid, FK → payroll_cycles)
- `date_type_id` (uuid, FK → payroll_date_types)
- `rule_description` (text)
- `rule_code` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Feature Flags Table (`public.feature_flags`)
Feature toggle management.

**Columns:**
- `id` (uuid, primary key)
- `name` (varchar 100, unique)
- `description` (text)
- `enabled` (boolean, default: false)
- `conditions` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### App Settings Table (`public.app_settings`)
Application-wide settings.

**Columns:**
- `id` (text, primary key)
- `permissions` (jsonb)

### User Invitations Table (`public.user_invitations`)
Pending user invitations.

**Columns:**
- `id` (uuid, primary key)
- `email` (varchar 255)
- `role` (user_role)
- `manager_id` (uuid, FK → users)
- `is_staff` (boolean, default: false)
- `invited_by` (uuid, FK → users)
- `invited_at` (timestamp)
- `accepted_at` (timestamp)
- `accepted_by` (uuid, FK → users)
- `expires_at` (timestamp)
- `token` (varchar 255, unique)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Audit Schema Tables

### Audit Log Table (`audit.audit_log`)
General audit logging.

**Columns:**
- `id` (uuid, primary key)
- `event_time` (timestamp)
- `user_id` (uuid)
- `user_email` (text)
- `user_role` (text)
- `action` (text)
- `resource_type` (text)
- `resource_id` (text)
- `details` (jsonb)
- `ip_address` (inet)
- `user_agent` (text)

### Auth Events Table (`audit.auth_events`)
Authentication event logging.

**Columns:**
- `id` (uuid, primary key)
- `event_time` (timestamp)
- `event_type` (text)
- `user_id` (uuid)
- `user_email` (text)
- `success` (boolean)
- `failure_reason` (text)
- `ip_address` (inet)
- `user_agent` (text)

### Data Access Log Table (`audit.data_access_log`)
Tracks data access for compliance.

**Columns:**
- `id` (uuid, primary key)
- `accessed_at` (timestamp)
- `user_id` (uuid)
- `resource_type` (text)
- `resource_id` (text)
- `access_type` (text)
- `query` (text)
- `ip_address` (inet)

### Permission Changes Table (`audit.permission_changes`)
Tracks permission modifications.

**Columns:**
- `id` (uuid, primary key)
- `changed_at` (timestamp)
- `changed_by_user_id` (uuid)
- `target_user_id` (uuid)
- `target_role_id` (uuid)
- `change_type` (text)
- `old_value` (jsonb)
- `new_value` (jsonb)
- `reason` (text)

### Permission Usage Report Table (`audit.permission_usage_report`)
Permission usage analytics view.

**Columns:**
- `user_id` (uuid)
- `user_email` (text)
- `user_role` (text)
- `permission_used` (text)
- `usage_count` (bigint)
- `last_used` (timestamp)

### Slow Queries Table (`audit.slow_queries`)
Performance monitoring for slow queries.

**Columns:**
- `id` (uuid, primary key)
- `query_start` (timestamp)
- `query_duration` (interval)
- `query` (text)
- `user_id` (uuid)
- `user_email` (text)
- `user_role` (text)

### User Access Summary Table (`audit.user_access_summary`)
Aggregated user access statistics view.

**Columns:**
- `user_id` (uuid)
- `user_email` (text)
- `user_role` (text)
- `total_accesses` (bigint)
- `unique_resources` (bigint)
- `last_access` (timestamp)

### Permission Audit Log Table (`public.permission_audit_log`)
Detailed permission usage tracking.

**Columns:**
- `id` (uuid, primary key)
- `user_id` (uuid, FK → users)
- `target_user_id` (uuid, FK → users)
- `permission` (text)
- `action` (text)
- `success` (boolean)
- `reason` (text)
- `metadata` (jsonb)
- `created_at` (timestamp)

## Views

### Current Payrolls View (`public.current_payrolls`)
Shows only active payroll versions (where superseded_date is null).

### Payroll Dashboard Stats View (`public.payroll_dashboard_stats`)
Aggregated statistics for dashboard display.

### Latest Payroll Version Results View (`public.latest_payroll_version_results`)
Results from the latest payroll version function.

### Payroll Version History Results View (`public.payroll_version_history_results`)
Complete version history for payrolls.

### Payroll Activation Results View (`public.payroll_activation_results`)
Results from payroll activation operations.

### Payroll Version Results View (`public.payroll_version_results`)
Detailed version comparison results.

### Payroll Triggers Status View (`public.payroll_triggers_status`)
Status of payroll-related database triggers.

## Custom Functions

### create_payroll_version
Creates a new version of an existing payroll.

### create_payroll_version_simple
Simplified version creation function.

### activate_payroll_versions
Activates specific payroll versions.

### generate_payroll_dates
Generates payroll processing dates based on rules.

### get_latest_payroll_version
Retrieves the most recent version of a payroll.

### get_payroll_version_history
Returns complete version history for a payroll.

## Role-Based Access Control (RBAC)

The system implements a comprehensive RBAC system with five primary roles:

### 1. Developer Role
- Full system access
- Can perform all CRUD operations on all tables
- Access to audit logs and system configuration
- Used for system administration and development

### 2. Org Admin Role
- Organization-wide administrative access
- Can manage users, clients, and payrolls
- Cannot access developer-specific features
- Full access to billing and reporting

### 3. Manager Role
- Can manage team members and their payrolls
- Create and update payrolls they manage
- View aggregated data and reports
- Limited user creation (viewer/consultant roles only)

### 4. Consultant Role
- Access to assigned payrolls only
- Can update payroll status
- View client information for assigned payrolls
- Limited profile update capabilities

### 5. Viewer Role
- Read-only access to most data
- Cannot modify any records
- Basic reporting access
- Suitable for auditors or read-only users

## Permission Inheritance and Overrides

- Permissions are primarily role-based with granular action controls
- The system supports permission overrides for temporary access
- Inherited roles are supported for complex permission scenarios
- All permission changes are audited in the audit schema

## Security Features

### Audit Logging
- All data modifications are logged
- Authentication events tracked
- Permission usage monitored
- Slow query tracking for performance

### Row-Level Security
- Implemented through Hasura permissions
- Consultants see only assigned payrolls
- Managers see their team's data
- Org admins have organization-wide access

### Data Versioning
- Payrolls support full version history
- Superseded versions are retained
- Version reasons are tracked
- Parent-child relationships maintain history

## Integration Points

### Clerk Authentication
- Users table integrates with Clerk via clerk_user_id
- JWT claims used for authorization
- Session management handled externally

### External Systems
- Flexible external system integration
- Client-specific system mappings
- API endpoint configuration

### Neon Auth Sync
- Synchronization with Neon authentication service
- User data mirroring for consistency

## Best Practices and Patterns

### Soft Deletes
- Most entities use soft delete patterns
- superseded_date for payroll versioning
- deactivated_at for user deactivation
- Maintains data integrity and audit trail

### Timestamp Tracking
- All tables include created_at and updated_at
- Automatic timestamp management
- Consistent timezone handling (timestamp with time zone)

### UUID Primary Keys
- All tables use UUID primary keys
- Generated using gen_random_uuid()
- Prevents enumeration attacks
- Supports distributed systems

### JSONB for Flexible Data
- conditions field in role_permissions
- details in audit logs
- metadata in various tables
- Allows schema flexibility while maintaining structure

## Performance Considerations

### Indexes
- Primary key indexes on all tables
- Foreign key indexes for relationships
- Unique constraints where applicable
- Custom indexes for frequently queried fields

### Aggregation Support
- Hasura aggregation enabled for reporting
- Pre-computed views for complex queries
- Efficient count and sum operations

### Query Optimization
- Row-level security filters optimized
- Relationship queries use proper joins
- Audit queries partitioned by time

## Compliance and Governance

### Data Retention
- Audit logs retained indefinitely
- Soft deletes preserve historical data
- Version history maintains compliance trail

### Access Control
- Granular permissions at table and row level
- All access tracked in audit logs
- Permission changes require authorization

### Data Privacy
- PII access restricted by role
- Email addresses protected from unauthorized access
- Audit logs track all data access

## Monitoring and Maintenance

### Health Checks
- Slow query monitoring
- Permission usage analytics
- User access patterns tracked

### Backup Considerations
- All tables included in backup scope
- Audit schema critical for compliance
- Version history preserves business continuity

This comprehensive schema supports a enterprise-grade payroll management system with strong security, compliance, and scalability features.
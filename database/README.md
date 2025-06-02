# Database Migrations & Schema

## Current RBAC System

Your payroll system uses a **simplified 5-role RBAC system**:

| Role         | Priority | Description                     |
| ------------ | -------- | ------------------------------- |
| `admin`      | 100      | Legacy role (maps to org_admin) |
| `org_admin`  | 90       | Organization administration     |
| `manager`    | 70       | Team and client management      |
| `consultant` | 50       | Day-to-day operations           |
| `viewer`     | 10       | Read-only access                |

## Database Schema

### Core Tables

- `users` - Main user table with `role` enum field
- `clients` - Client organizations
- `payrolls` - Payroll schedules with role-based access
- Other business tables with Hasura permissions

### User Role Enum

```sql
CREATE TYPE user_role AS ENUM (
    'admin',     -- Legacy, maps to org_admin
    'org_admin', -- Organization admin
    'manager',   -- Team management
    'consultant', -- Operations
    'viewer'     -- Read-only
);
```

## Migrations

### To Simplify RBAC System

If you have complex RBAC tables from previous implementations:

```bash
psql -d your_database -f database/simplify_rbac_migration.sql
```

This migration will:

- ✅ Add `org_admin` to user_role enum
- ✅ Remove complex RBAC tables (roles, permissions, etc.)
- ✅ Update existing admin users to org_admin
- ✅ Clean up unused infrastructure

### Current Files

- `schema.sql` - Main database schema (current state)
- `simplify_rbac_migration.sql` - Migration to simplified system
- `rbac_seed_data.sql` - **DEPRECATED** complex RBAC (don't use)

## Permission System

Permissions are handled by **Hasura row-level security**, not database tables:

```yaml
# Example: Payrolls table
consultant:
  filter:
    _or:
      - primary_consultant_user_id: { _eq: X-Hasura-User-Id }
      - backup_consultant_user_id: { _eq: X-Hasura-User-Id }

manager:
  filter:
    _or:
      - manager_user_id: { _eq: X-Hasura-User-Id }
      - primary_consultant_user_id: { _eq: X-Hasura-User-Id }
      - backup_consultant_user_id: { _eq: X-Hasura-User-Id }

org_admin:
  filter: {} # Access to all records
```

## Next Steps

1. **Run the migration** to ensure your database matches your codebase
2. **Update Hasura permissions** to use `org_admin` instead of complex roles
3. **Test role assignments** in your application
4. **Remove deprecated files** once migration is confirmed working

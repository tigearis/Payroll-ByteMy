# Hasura Permissions Quick Reference

## 🚀 Quick Commands

```bash
# Apply metadata changes
cd hasura && hasura metadata apply

# Check for inconsistencies
hasura metadata ic list

# Export current metadata
hasura metadata export

# Console (if needed)
hasura console --endpoint http://localhost:8080
```

## 🔧 Column Name Verification

```bash
# Check GraphQL schema for field names
grep -A 20 "type TableName" /shared/schema/schema.graphql

# Check database schema for actual column names  
grep -A 15 "CREATE TABLE table_name" /database/schema.sql

# Convert GraphQL to Database names
# GraphQL (camelCase) → Database (snake_case)
# userId → user_id
# createdAt → created_at
# isImportant → is_important
```

## 📋 Permission Templates

### Basic User Ownership
```yaml
filter:
  user_id: { _eq: "X-Hasura-User-Id" }
```

### Manager Oversight Pattern
```yaml
filter:
  _or:
    - user_id: { _eq: "X-Hasura-User-Id" }
    - author: { manager_id: { _eq: "X-Hasura-User-Id" } }
```

### Consultant Assignment Pattern
```yaml
filter:
  _or:
    - payroll: { primary_consultant_user_id: { _eq: "X-Hasura-User-Id" } }
    - payroll: { backup_consultant_user_id: { _eq: "X-Hasura-User-Id" } }
```

### Manager + Consultant Combined
```yaml
filter:
  _or:
    - payroll: { manager_user_id: { _eq: "X-Hasura-User-Id" } }
    - payroll: { primary_consultant_user_id: { _eq: "X-Hasura-User-Id" } }
    - payroll: { primaryConsultant: { manager_id: { _eq: "X-Hasura-User-Id" } } }
```

## 🎯 Role Permissions Template

```yaml
select_permissions:
  - role: consultant
    permission:
      columns:
        - id
        - user_id
        - created_at
        # Add specific columns only
      filter:
        user_id: { _eq: "X-Hasura-User-Id" }
  
  - role: manager
    permission:
      columns: '*'  # Can use * for managers
      filter:
        _or:
          - user_id: { _eq: "X-Hasura-User-Id" }
          - author: { manager_id: { _eq: "X-Hasura-User-Id" } }
      allow_aggregations: true
      
  - role: org_admin
    permission:
      columns: '*'
      filter: {}
      allow_aggregations: true

insert_permissions:
  - role: consultant
    permission:
      check:
        user_id: { _eq: "X-Hasura-User-Id" }
      columns:
        - user_id
        - description
        - created_at
        
update_permissions:
  - role: consultant
    permission:
      columns:
        - description
        # Only editable fields
      filter:
        user_id: { _eq: "X-Hasura-User-Id" }
      check: null
```

## ⚠️ Common Pitfalls

### ❌ Wrong Column Names
```yaml
# DON'T use GraphQL field names
filter:
  userId: { _eq: "X-Hasura-User-Id" }  # WRONG
  createdAt: { _gte: "2025-01-01" }    # WRONG
```

### ✅ Correct Column Names
```yaml
# DO use database column names
filter:
  user_id: { _eq: "X-Hasura-User-Id" }   # CORRECT
  created_at: { _gte: "2025-01-01" }     # CORRECT
```

### ❌ Malformed YAML
```yaml
# DON'T format like this
filter:
  payroll:
    manager_user_id:
      _eq: X-Hasura-User-Id  # Missing quotes
```

### ✅ Proper YAML
```yaml
# DO format like this
filter:
  payroll: { manager_user_id: { _eq: "X-Hasura-User-Id" } }
```

## 🔍 Troubleshooting

### Column Does Not Exist
```
Error: column "columnName" does not exist
```
**Fix**: Check actual database schema, convert camelCase to snake_case

### Permission Denied
```
Error: field "field" not found in type
```
**Fix**: Add column to `columns` list in permission

### Relationship Error
```
Error: no foreign key constraint exists
```
**Fix**: Check relationship definitions match database foreign keys

### YAML Syntax Error
```
Error: yaml: line X: found character that cannot start any token
```
**Fix**: Check YAML indentation and quoting

## 📊 Current System Status

- **✅ Tables**: 25+ core tables with permissions
- **✅ Roles**: 5 roles (viewer → consultant → manager → org_admin → developer)  
- **✅ Consistency**: 100% consistent metadata
- **✅ Enhanced Tables**: billing_items, time_entries, email_templates, notes, files, leave

## 📖 Full Documentation

See [HASURA_PERMISSIONS_SYSTEM.md](./HASURA_PERMISSIONS_SYSTEM.md) for complete documentation.
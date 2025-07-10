# 🚀 Hasura Permission System Setup Guide

## Quick Setup (Recommended)

### Method 1: Using Hasura CLI Migration (Recommended)

The permission seeding is already set up as a Hasura migration. Simply run:

```bash
# Apply the migration
pnpm hasura:migrate

# Or manually apply if the above doesn't work
cd hasura
hasura migrate apply --database-name default
```

This will execute the migration: `1751702787_seed_permissions`

### Method 2: Using Hasura Console

1. **Open Hasura Console**:
   ```bash
   pnpm hasura:console
   # or manually: cd hasura && hasura console
   ```

2. **Go to Data → SQL**

3. **Paste and Execute** the contents of:
   `/hasura/migrations/default/1751702787_seed_permissions/up.sql`

4. **Click "Run!"**

### Method 3: Direct Database Connection

If you have direct database access:

```bash
# Connect to your Neon/PostgreSQL database
psql -d your_database_url

# Run the seeding script
\i hasura/migrations/default/1751702787_seed_permissions/up.sql
```

## ✅ Verification Steps

After running the migration, verify the setup:

### 1. Check Resources Created
```sql
SELECT name, description FROM resources ORDER BY name;
```
Expected: 16 resources (dashboard, clients, payrolls, etc.)

### 2. Check Permissions Created
```sql
SELECT COUNT(*) as permission_count FROM permissions;
```
Expected: ~240 permissions

### 3. Check Role Assignments
```sql
SELECT r.name as role, COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.name
ORDER BY permission_count DESC;
```

Expected output:
```
role        | permission_count
------------|----------------
developer   | ~240
org_admin   | ~225
manager     | ~180
consultant  | ~50
viewer      | ~30
```

### 4. Test a Specific Role's Permissions
```sql
-- Check what a manager can do with clients
SELECT res.name as resource, p.action
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
JOIN resources res ON p.resource_id = res.id
WHERE r.name = 'manager' AND res.name = 'clients'
ORDER BY p.action;
```

Expected for manager + clients: `create, export, read, update` (no delete)

## 🔧 Hasura Configuration

### Update Hasura Environment Variables

Add to your Hasura environment (if not already present):

```bash
# In your .env or Hasura config
HASURA_GRAPHQL_JWT_SECRET='{"type":"RS256","jwks_url":"https://your-clerk-domain/.well-known/jwks.json"}'
HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous
HASURA_GRAPHQL_ADMIN_SECRET=your_admin_secret
```

### Configure JWT Claims

In your Hasura console → Settings → Env vars, ensure JWT template includes:

```json
{
  "sub": "{{user.id}}",
  "iat": {{user.created_at}},
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": ["{{user.publicMetadata.role}}"],
    "x-hasura-default-role": "{{user.publicMetadata.role}}",
    "x-hasura-user-id": "{{user.id}}"
  }
}
```

## 🎯 Testing the Setup

### 1. Test Permission Queries

In Hasura GraphiQL, test these queries:

```graphql
# Get all permissions for a role
query GetRolePermissions($roleName: String!) {
  role_permissions(where: {role: {name: {_eq: $roleName}}}) {
    permission {
      action
      resource {
        name
      }
      legacy_permission_name
    }
  }
}
```

Variables:
```json
{"roleName": "manager"}
```

### 2. Test User Effective Permissions

```graphql
# Use the database function we have
query GetUserEffectivePermissions($userId: uuid!) {
  get_user_effective_permissions(args: {p_user_id: $userId}) {
    resource
    action
    granted_by
    source_type
  }
}
```

### 3. Test Permission Checking

```graphql
# Check if a user can perform an action (using database function)
query CanUserPerformAction($userId: uuid!, $resource: String!, $action: String!) {
  user_can_perform_action(args: {
    p_user_id: $userId, 
    p_resource: $resource, 
    p_action: $action
  })
}
```

## 🔒 Set Up Row Level Security (RLS)

The migration automatically enables RLS on permission tables, but you may want to add custom policies:

```sql
-- Example: Users can only see their own permission overrides
CREATE POLICY user_permission_overrides_policy ON permission_overrides
  FOR SELECT USING (user_id = current_setting('hasura.user-id')::uuid);

-- Example: Only admins can modify permissions
CREATE POLICY admin_role_permissions_policy ON role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN roles r ON ur.role_id = r.id 
      WHERE ur.user_id = current_setting('hasura.user-id')::uuid 
      AND r.name IN ('developer', 'org_admin')
    )
  );
```

## 🚨 Troubleshooting

### Migration Fails

1. **Check if tables exist**:
   ```sql
   \dt+ public.*permission*
   \dt+ public.*role*
   \dt+ public.*resource*
   ```

2. **Check for conflicts**:
   ```sql
   SELECT * FROM permissions LIMIT 5;
   SELECT * FROM resources LIMIT 5;
   ```

3. **Rollback if needed**:
   ```bash
   hasura migrate apply --down 1 --database-name default
   ```

### Permission Queries Return Empty

1. **Verify role assignments**:
   ```sql
   SELECT u.email, r.name as role 
   FROM users u 
   JOIN user_roles ur ON u.id = ur.user_id 
   JOIN roles r ON ur.role_id = r.id;
   ```

2. **Check if user has role assigned**:
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'your-user-id';
   ```

### Hasura Console Shows Errors

1. **Check Hasura logs**:
   ```bash
   hasura logs --database-name default
   ```

2. **Verify database connection**:
   ```bash
   hasura migrate status --database-name default
   ```

## 📊 Monitoring & Maintenance

### View Permission Usage (Future)

```sql
-- Example query to monitor permission usage
SELECT 
  resource,
  action,
  COUNT(*) as usage_count
FROM permission_audit_log 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY resource, action
ORDER BY usage_count DESC;
```

### Regular Permission Audits

```sql
-- Find users with unusual permission combinations
SELECT 
  u.email,
  r.name as role,
  COUNT(po.id) as override_count
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
LEFT JOIN permission_overrides po ON u.id = po.user_id
GROUP BY u.email, r.name
HAVING COUNT(po.id) > 5  -- Users with many overrides
ORDER BY override_count DESC;
```

## 🎉 Success!

After completing these steps, your permission system will be:

✅ **Fully seeded** with default role permissions  
✅ **Ready for testing** in Hasura console  
✅ **Integrated** with your existing authentication  
✅ **Scalable** for future permission requirements  

Next step: Test the frontend permission system by calling the `/api/auth/refresh-permissions` endpoint for your users!
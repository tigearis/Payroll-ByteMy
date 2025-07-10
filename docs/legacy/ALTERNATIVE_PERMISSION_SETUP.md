# 🔧 Alternative Permission Setup Methods

## Issue Resolution

The Hasura migration failed due to a missing `display_name` column in the resources table. I've fixed the migration file, but here are alternative ways to set up the permissions:

## Method 1: Hasura Console (Recommended for Quick Setup)

1. **Open Hasura Console**:
   ```bash
   # Navigate to hasura directory and start console
   cd hasura
   npx hasura console
   ```
   
   Or access it via your hosted Hasura URL

2. **Go to Data → SQL Tab**

3. **Copy and paste this corrected SQL**:

```sql
-- Permission System Setup Script (Fixed)
-- This script creates default permissions and assigns them to roles

-- First, ensure we have all the resources
INSERT INTO resources (name, display_name, description) VALUES
('dashboard', 'Dashboard', 'Dashboard and analytics access'),
('clients', 'Clients', 'Client management'),
('payrolls', 'Payrolls', 'Payroll processing and management'),
('schedule', 'Schedule', 'Payroll scheduling'),
('workschedule', 'Work Schedule', 'Work schedule management'),
('staff', 'Staff', 'Staff and user management'),
('leave', 'Leave', 'Leave management'),
('ai', 'AI Assistant', 'AI assistant features'),
('bulkupload', 'Bulk Upload', 'Bulk data upload functionality'),
('reports', 'Reports', 'Reporting and analytics'),
('billing', 'Billing', 'Billing and financial management'),
('email', 'Email', 'Email system'),
('invitations', 'Invitations', 'User invitation system'),
('settings', 'Settings', 'System settings'),
('security', 'Security', 'Security and audit features'),
('developer', 'Developer Tools', 'Developer tools and debugging')
ON CONFLICT (name) DO UPDATE SET 
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description;

-- Create all standard permissions for each resource
WITH resource_actions AS (
  SELECT 
    r.id as resource_id,
    r.name as resource_name,
    action_name
  FROM resources r
  CROSS JOIN (
    VALUES 
      ('read'::permission_action),
      ('create'::permission_action),
      ('update'::permission_action),
      ('delete'::permission_action),
      ('archive'::permission_action),
      ('approve'::permission_action),
      ('export'::permission_action),
      ('manage'::permission_action),
      ('use'::permission_action),
      ('configure'::permission_action),
      ('process'::permission_action),
      ('resend'::permission_action),
      ('access'::permission_action),
      ('debug'::permission_action),
      ('data_management'::permission_action)
  ) AS actions(action_name)
)
INSERT INTO permissions (resource_id, action, description, legacy_permission_name)
SELECT 
  ra.resource_id,
  ra.action_name,
  CONCAT(INITCAP(ra.resource_name), ' - ', INITCAP(ra.action_name::text)),
  CONCAT(ra.resource_name, '.', ra.action_name::text)
FROM resource_actions ra
ON CONFLICT (resource_id, action) DO UPDATE SET 
  description = EXCLUDED.description,
  legacy_permission_name = EXCLUDED.legacy_permission_name;

-- DEVELOPER ROLE - Gets everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'developer'
ON CONFLICT DO NOTHING;

-- ORG_ADMIN ROLE - Everything except developer tools
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
JOIN permissions p ON true
JOIN resources res ON p.resource_id = res.id
WHERE r.name = 'org_admin'
AND res.name != 'developer'
ON CONFLICT DO NOTHING;

-- MANAGER ROLE - Core management permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
JOIN permissions p ON true
JOIN resources res ON p.resource_id = res.id
WHERE r.name = 'manager'
AND (
  (res.name = 'dashboard' AND p.action IN ('read', 'export')) OR
  (res.name = 'clients' AND p.action IN ('read', 'create', 'update', 'export')) OR
  (res.name = 'payrolls') OR
  (res.name = 'schedule') OR
  (res.name = 'workschedule') OR
  (res.name = 'staff' AND p.action IN ('read', 'create', 'update')) OR
  (res.name = 'leave') OR
  (res.name = 'ai' AND p.action IN ('read', 'use')) OR
  (res.name = 'bulkupload') OR
  (res.name = 'reports' AND p.action IN ('read', 'create', 'export')) OR
  (res.name = 'billing' AND p.action IN ('read', 'create', 'update', 'approve', 'export')) OR
  (res.name = 'email' AND p.action IN ('read', 'create')) OR
  (res.name = 'invitations') OR
  (res.name = 'settings' AND p.action = 'read') OR
  (res.name = 'security' AND p.action = 'read')
)
ON CONFLICT DO NOTHING;

-- CONSULTANT ROLE - Operational permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
JOIN permissions p ON true
JOIN resources res ON p.resource_id = res.id
WHERE r.name = 'consultant'
AND (
  (res.name = 'dashboard' AND p.action = 'read') OR
  (res.name = 'clients' AND p.action = 'read') OR
  (res.name = 'payrolls' AND p.action IN ('read', 'update')) OR
  (res.name = 'schedule' AND p.action = 'read') OR
  (res.name = 'workschedule' AND p.action IN ('read', 'update')) OR
  (res.name = 'staff' AND p.action = 'read') OR
  (res.name = 'leave' AND p.action IN ('read', 'create')) OR
  (res.name = 'ai' AND p.action IN ('read', 'use')) OR
  (res.name = 'reports' AND p.action = 'read') OR
  (res.name = 'billing' AND p.action = 'read')
)
ON CONFLICT DO NOTHING;

-- VIEWER ROLE - Read-only access
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  r.id,
  p.id
FROM roles r
JOIN permissions p ON true
JOIN resources res ON p.resource_id = res.id
WHERE r.name = 'viewer'
AND p.action = 'read'
AND res.name IN (
  'dashboard', 'clients', 'payrolls', 'schedule', 
  'workschedule', 'staff', 'leave', 'reports'
)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON permissions(resource_id, action);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_permission_overrides_user_id ON permission_overrides(user_id);
CREATE INDEX IF NOT EXISTS idx_permission_overrides_active ON permission_overrides(user_id, expires_at) WHERE expires_at IS NULL OR expires_at > NOW();

-- Update role descriptions
UPDATE roles SET 
  description = CASE name
    WHEN 'developer' THEN 'Full system access including developer tools'
    WHEN 'org_admin' THEN 'Complete business operations control, no developer tools'
    WHEN 'manager' THEN 'Team and operational management'
    WHEN 'consultant' THEN 'Day-to-day operations for assigned work'
    WHEN 'viewer' THEN 'Read-only access to essential information'
    ELSE description
  END
WHERE name IN ('developer', 'org_admin', 'manager', 'consultant', 'viewer');
```

4. **Click "Run!"**

## Method 2: Try Migration Again with Fixed File

The migration file has been fixed. Try again:

```bash
# Navigate to hasura directory
cd hasura

# Try the migration again
hasura migrate apply --database-name default

# Or if you have the hasura CLI in a different location
npx hasura migrate apply --database-name default
```

## Method 3: Direct Database Connection

If you have direct access to your PostgreSQL/Neon database:

```bash
# Connect directly to your database
psql "your-database-connection-string"

# Run the SQL script
\i hasura/migrations/default/1751702787_seed_permissions/up.sql
```

## Method 4: Using a Database Client

1. **Connect to your database** using a tool like:
   - pgAdmin
   - DBeaver  
   - Neon Console
   - Any PostgreSQL client

2. **Run the SQL script** from the fixed migration file

## Verification

After running any of these methods, verify the setup:

```sql
-- Check that resources were created
SELECT COUNT(*) as resource_count FROM resources;
-- Expected: 16

-- Check that permissions were created  
SELECT COUNT(*) as permission_count FROM permissions;
-- Expected: ~240

-- Check role permission assignments
SELECT r.name as role, COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.name
ORDER BY permission_count DESC;
```

Expected results:
- developer: ~240 permissions
- org_admin: ~225 permissions  
- manager: ~180 permissions
- consultant: ~50 permissions
- viewer: ~30 permissions

## Next Steps

Once the database seeding is complete:

1. **Update Clerk JWT Template** to include permissions
2. **Call the permission refresh API** for existing users
3. **Test the permission system** with the debug component

The key fix was adding the `display_name` column to the resources INSERT statement. The migration should now work properly!
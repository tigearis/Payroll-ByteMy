-- ================================
-- RBAC SIMPLIFICATION MIGRATION
-- Simplify to 5 core roles: admin, org_admin, manager, consultant, viewer
-- ================================

BEGIN;

-- ================================
-- 1. IDENTIFY CURRENT STATE
-- ================================
\echo 'Step 1: Analyzing current RBAC state...'

-- Show current roles
SELECT 'Current Roles:' as info;
SELECT name, display_name, priority FROM roles ORDER BY priority DESC;

-- Show user role distribution
SELECT 'User Role Distribution:' as info;
SELECT 
    COALESCE(r.name, u.role::text) as role_name,
    COUNT(*) as user_count
FROM users u 
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY COALESCE(r.name, u.role::text)
ORDER BY role_name;

-- ================================
-- 2. CLEAN UP ROLES TABLE
-- ================================
\echo 'Step 2: Simplifying roles to 5 core roles...'

-- Keep only the 5 core roles and remove complex ones
DELETE FROM role_permissions WHERE role_id IN (
    SELECT id FROM roles WHERE name NOT IN ('admin', 'org_admin', 'manager', 'consultant', 'viewer')
);

DELETE FROM user_roles WHERE role_id IN (
    SELECT id FROM roles WHERE name NOT IN ('admin', 'org_admin', 'manager', 'consultant', 'viewer')
);

DELETE FROM roles WHERE name NOT IN ('admin', 'org_admin', 'manager', 'consultant', 'viewer');

-- Update role priorities to match our simple hierarchy
UPDATE roles SET priority = 100 WHERE name = 'admin';
UPDATE roles SET priority = 90 WHERE name = 'org_admin'; 
UPDATE roles SET priority = 70 WHERE name = 'manager';
UPDATE roles SET priority = 50 WHERE name = 'consultant';
UPDATE roles SET priority = 10 WHERE name = 'viewer';

-- Update display names for consistency
UPDATE roles SET display_name = 'System Administrator' WHERE name = 'admin';
UPDATE roles SET display_name = 'Organization Administrator' WHERE name = 'org_admin';
UPDATE roles SET display_name = 'Manager' WHERE name = 'manager';
UPDATE roles SET display_name = 'Consultant' WHERE name = 'consultant';
UPDATE roles SET display_name = 'Viewer' WHERE name = 'viewer';

\echo 'Cleaned up roles table'

-- ================================
-- 3. MIGRATE USER ROLE ASSIGNMENTS
-- ================================
\echo 'Step 3: Migrating user role assignments...'

-- First, ensure all users have entries in user_roles based on their legacy role
INSERT INTO user_roles (user_id, role_id)
SELECT DISTINCT u.id, r.id
FROM users u
JOIN roles r ON r.name = u.role::text
WHERE NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id
)
AND u.role IS NOT NULL;

-- Handle edge cases - map system_admin to admin
UPDATE user_roles 
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE role_id = (SELECT id FROM roles WHERE name = 'system_admin');

-- Update legacy role column for users who have system_admin in user_roles table
UPDATE users 
SET role = 'admin'
WHERE id IN (
    SELECT ur.user_id 
    FROM user_roles ur 
    JOIN roles r ON ur.role_id = r.id 
    WHERE r.name = 'admin'
);

-- Update legacy role column for users who had admin role to org_admin
UPDATE users SET role = 'org_admin' WHERE role = 'admin';

\echo 'User role assignments migrated'

-- ================================
-- 4. CLEAN UP COMPLEX PERMISSION TABLES
-- ================================
\echo 'Step 4: Removing complex permission system...'

-- Clean up the complex permission system since we're using Hasura row-level security
TRUNCATE TABLE role_permissions CASCADE;
TRUNCATE TABLE permissions CASCADE;
TRUNCATE TABLE resources CASCADE;

-- Drop permission audit and override tables if they exist
DROP TABLE IF EXISTS permission_audit_log CASCADE;
DROP TABLE IF EXISTS permission_overrides CASCADE;

\echo 'Complex permission tables cleaned up'

-- ================================
-- 5. VERIFY FINAL STATE
-- ================================
\echo 'Step 5: Verifying final state...'

-- Show final roles
SELECT 'Final Roles:' as info;
SELECT name, display_name, priority, is_system_role FROM roles ORDER BY priority DESC;

-- Show final user role distribution
SELECT 'Final User Distribution:' as info;
SELECT 
    r.name as role_name,
    r.display_name,
    COUNT(ur.user_id) as user_count
FROM roles r
LEFT JOIN user_roles ur ON r.id = ur.role_id
GROUP BY r.id, r.name, r.display_name, r.priority
ORDER BY r.priority DESC;

-- Show users with multiple roles (should be cleaned up)
SELECT 'Users with Multiple Roles:' as info;
SELECT u.name, u.email, array_agg(r.name) as roles
FROM users u
JOIN user_roles ur ON u.id = ur.user_id  
JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.name, u.email
HAVING COUNT(ur.role_id) > 1;

\echo 'Migration completed successfully!'
\echo ''
\echo '✅ Your RBAC system now has 5 clean roles:'
\echo '   - admin (100) - System administration'  
\echo '   - org_admin (90) - Organization administration'
\echo '   - manager (70) - Team and client management'
\echo '   - consultant (50) - Day-to-day operations'
\echo '   - viewer (10) - Read-only access'
\echo ''
\echo '🧹 Complex permission tables cleaned'
\echo '👥 User roles standardized'
\echo '📊 All permissions now handled by Hasura row-level security'

COMMIT; 
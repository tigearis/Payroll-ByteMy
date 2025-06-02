-- ================================
-- RBAC MIGRATION SCRIPT
-- Migrates from legacy users.role enum to proper RBAC system
-- ================================

\echo '=== RBAC MIGRATION STARTING ==='
\echo 'Migrating from legacy enum roles to hierarchical RBAC system'
\echo ''

BEGIN;

-- ================================
-- 1. BACKUP CURRENT STATE
-- ================================
\echo 'Step 1: Creating backup of current role assignments...'

-- Create backup table for rollback if needed
CREATE TABLE IF NOT EXISTS users_role_backup AS 
SELECT id, email, role, created_at 
FROM users 
WHERE role IS NOT NULL;

\echo 'Backup created for ' || (SELECT COUNT(*) FROM users_role_backup) || ' users'

-- ================================
-- 2. MAP LEGACY ROLES TO NEW ROLES
-- ================================
\echo 'Step 2: Mapping legacy enum roles to new RBAC roles...'

-- Create mapping table
CREATE TEMP TABLE role_mapping AS
SELECT 
    enum_role,
    new_role_name,
    priority
FROM (VALUES
    ('admin', 'system_admin', 100),
    ('org_admin', 'org_admin', 90),
    ('manager', 'manager', 80),
    ('consultant', 'consultant', 70),
    ('viewer', 'viewer', 10)
) AS mapping(enum_role, new_role_name, priority);

-- Show mapping
SELECT * FROM role_mapping ORDER BY priority DESC;

-- ================================
-- 3. ENSURE ALL REQUIRED ROLES EXIST
-- ================================
\echo 'Step 3: Ensuring all required roles exist in roles table...'

-- Insert any missing roles
INSERT INTO roles (name, display_name, description, priority, is_system_role)
SELECT 
    rm.new_role_name,
    INITCAP(REPLACE(rm.new_role_name, '_', ' ')),
    'Migrated from legacy enum role: ' || rm.enum_role,
    rm.priority,
    true
FROM role_mapping rm
WHERE NOT EXISTS (
    SELECT 1 FROM roles r WHERE r.name = rm.new_role_name
)
ON CONFLICT (name) DO NOTHING;

\echo 'All required roles are now present in roles table'

-- ================================
-- 4. MIGRATE USER ROLE ASSIGNMENTS
-- ================================
\echo 'Step 4: Migrating user role assignments to user_roles table...'

-- Count current assignments
\echo 'Current users by legacy role:'
SELECT role, COUNT(*) as user_count 
FROM users 
WHERE role IS NOT NULL 
GROUP BY role 
ORDER BY role;

-- Insert into user_roles table
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT DISTINCT
    u.id as user_id,
    r.id as role_id,
    NOW() as created_at,
    NOW() as updated_at
FROM users u
JOIN role_mapping rm ON u.role::text = rm.enum_role
JOIN roles r ON rm.new_role_name = r.name
WHERE u.role IS NOT NULL
AND NOT EXISTS (
    -- Avoid duplicates
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

-- Show migration results
\echo 'Migration results:'
SELECT 
    r.name as role_name,
    r.priority,
    COUNT(ur.user_id) as users_assigned
FROM roles r
LEFT JOIN user_roles ur ON r.id = ur.role_id
WHERE r.is_system_role = true
GROUP BY r.name, r.priority
ORDER BY r.priority DESC;

-- ================================
-- 5. HANDLE USERS WITHOUT ROLES
-- ================================
\echo 'Step 5: Assigning default role to users without roles...'

-- Count users without roles
SELECT COUNT(*) as users_without_roles 
FROM users 
WHERE id NOT IN (SELECT user_id FROM user_roles);

-- Assign viewer role to users without any role
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT 
    u.id,
    r.id,
    NOW(),
    NOW()
FROM users u
CROSS JOIN roles r
WHERE r.name = 'viewer'
AND u.id NOT IN (SELECT user_id FROM user_roles);

\echo 'Default viewer role assigned to users without roles'

-- ================================
-- 6. CREATE HASURA JWT CLAIMS FUNCTION
-- ================================
\echo 'Step 6: Creating Hasura JWT claims function...'

CREATE OR REPLACE FUNCTION get_hasura_claims(user_clerk_id text)
RETURNS jsonb AS $$
DECLARE
    user_record users%ROWTYPE;
    user_roles_array text[];
    highest_priority_role text;
BEGIN
    -- Get user record
    SELECT * INTO user_record 
    FROM users 
    WHERE clerk_user_id = user_clerk_id AND is_active = true;
    
    IF user_record.id IS NULL THEN
        RETURN jsonb_build_object(
            'x-hasura-user-id', '',
            'x-hasura-default-role', 'anonymous',
            'x-hasura-allowed-roles', ARRAY['anonymous']
        );
    END IF;
    
    -- Get user's roles ordered by priority (highest first)
    SELECT array_agg(r.name ORDER BY r.priority DESC) INTO user_roles_array
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_record.id;
    
    -- Default to viewer if no roles assigned
    IF user_roles_array IS NULL OR array_length(user_roles_array, 1) = 0 THEN
        user_roles_array := ARRAY['viewer'];
    END IF;
    
    -- Highest priority role becomes default
    highest_priority_role := user_roles_array[1];
    
    RETURN jsonb_build_object(
        'x-hasura-user-id', user_record.id::text,
        'x-hasura-default-role', highest_priority_role,
        'x-hasura-allowed-roles', user_roles_array,
        'x-hasura-is-staff', user_record.is_staff::text,
        'x-hasura-is-active', user_record.is_active::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

\echo 'Hasura JWT claims function created'

-- Test the function
\echo 'Testing JWT claims function with sample data:'
SELECT get_hasura_claims((SELECT clerk_user_id FROM users WHERE clerk_user_id IS NOT NULL LIMIT 1));

-- ================================
-- 7. CREATE PERMISSION CHECK FUNCTIONS
-- ================================
\echo 'Step 7: Creating permission check functions...'

-- Function to check if user can perform action (with inheritance)
CREATE OR REPLACE FUNCTION user_can_perform_action(
    p_user_id uuid,
    p_resource text,
    p_action text
) RETURNS boolean AS $$
DECLARE
    can_perform boolean := false;
    has_override boolean := false;
    override_granted boolean := false;
BEGIN
    -- First check permission overrides (user-specific)
    SELECT 
        true,
        granted 
    INTO has_override, override_granted
    FROM permission_overrides 
    WHERE user_id = p_user_id 
    AND resource = p_resource 
    AND operation = p_action
    AND (expires_at IS NULL OR expires_at > NOW())
    LIMIT 1;
    
    -- If there's a user override, use that
    IF has_override THEN
        RETURN override_granted;
    END IF;
    
    -- Check role-based permissions with inheritance
    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN roles user_role ON ur.role_id = user_role.id
        -- Cross join to check all roles with equal or lower priority (inheritance)
        CROSS JOIN roles inherited_role
        JOIN role_permissions rp ON inherited_role.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        JOIN resources res ON p.resource_id = res.id
        WHERE ur.user_id = p_user_id
        AND res.name = p_resource
        AND p.action = p_action
        AND inherited_role.priority <= user_role.priority -- Inheritance logic
    ) INTO can_perform;
    
    -- Check role-level overrides
    IF NOT can_perform THEN
        SELECT 
            granted 
        INTO override_granted
        FROM permission_overrides po
        JOIN user_roles ur ON po.role = (
            SELECT r.name FROM roles r WHERE r.id = ur.role_id
        )
        WHERE ur.user_id = p_user_id 
        AND po.resource = p_resource 
        AND po.operation = p_action
        AND (po.expires_at IS NULL OR po.expires_at > NOW())
        LIMIT 1;
        
        IF FOUND THEN
            can_perform := override_granted;
        END IF;
    END IF;
    
    RETURN can_perform;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all effective permissions for a user
CREATE OR REPLACE FUNCTION get_user_effective_permissions(p_user_id uuid)
RETURNS TABLE (
    resource text,
    action text,
    granted_by text,
    source_type text,
    conditions jsonb
) AS $$
BEGIN
    RETURN QUERY
    WITH user_role_permissions AS (
        -- Get permissions from roles (with inheritance)
        SELECT DISTINCT
            res.name as resource,
            p.action as action,
            r.name as granted_by,
            'role' as source_type,
            rp.conditions
        FROM user_roles ur
        JOIN roles user_role ON ur.role_id = user_role.id
        CROSS JOIN roles r
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        JOIN resources res ON p.resource_id = res.id
        WHERE ur.user_id = p_user_id
        AND r.priority <= user_role.priority -- Inheritance
    ),
    user_overrides AS (
        -- Get user-specific overrides
        SELECT 
            po.resource,
            po.operation as action,
            'user_override' as granted_by,
            'override' as source_type,
            po.conditions
        FROM permission_overrides po
        WHERE po.user_id = p_user_id
        AND po.granted = true
        AND (po.expires_at IS NULL OR po.expires_at > NOW())
    ),
    role_overrides AS (
        -- Get role-level overrides
        SELECT 
            po.resource,
            po.operation as action,
            po.role::text as granted_by,
            'role_override' as source_type,
            po.conditions
        FROM permission_overrides po
        JOIN user_roles ur ON po.role = (
            SELECT r.name FROM roles r WHERE r.id = ur.role_id
        )
        WHERE ur.user_id = p_user_id
        AND po.granted = true
        AND (po.expires_at IS NULL OR po.expires_at > NOW())
    )
    SELECT * FROM user_role_permissions
    UNION ALL
    SELECT * FROM user_overrides
    UNION ALL  
    SELECT * FROM role_overrides
    ORDER BY resource, action;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

\echo 'Permission check functions created'

-- ================================
-- 8. VALIDATION AND TESTING
-- ================================
\echo 'Step 8: Validating migration...'

-- Validation queries
\echo 'Validation Results:'
\echo '1. Total users in system:'
SELECT COUNT(*) as total_users FROM users;

\echo '2. Users with RBAC role assignments:'
SELECT COUNT(DISTINCT user_id) as users_with_roles FROM user_roles;

\echo '3. Users without role assignments:'
SELECT COUNT(*) as users_without_roles 
FROM users 
WHERE id NOT IN (SELECT user_id FROM user_roles);

\echo '4. Role distribution:'
SELECT 
    r.name,
    r.priority,
    COUNT(ur.user_id) as user_count
FROM roles r
LEFT JOIN user_roles ur ON r.id = ur.role_id
GROUP BY r.name, r.priority
ORDER BY r.priority DESC;

-- ================================
-- 9. OPTIONAL: DEPRECATE ENUM COLUMN
-- ================================
\echo 'Step 9: Preparing to deprecate legacy role column...'
\echo 'NOTE: The legacy users.role column is still present for safety.'
\echo 'After confirming the migration works correctly, you can:'
\echo '1. Update application code to use RBAC functions'
\echo '2. Test thoroughly'
\echo '3. Run: ALTER TABLE users DROP COLUMN role;'
\echo ''

-- Create a view that shows the migration status
CREATE OR REPLACE VIEW user_role_migration_status AS
SELECT 
    u.id,
    u.email,
    u.role as legacy_role,
    string_agg(r.name, ', ' ORDER BY r.priority DESC) as new_roles,
    CASE 
        WHEN u.role IS NOT NULL AND ur.user_id IS NOT NULL THEN 'Migrated'
        WHEN u.role IS NULL AND ur.user_id IS NOT NULL THEN 'New RBAC Only'
        WHEN u.role IS NOT NULL AND ur.user_id IS NULL THEN 'Legacy Only - ERROR'
        ELSE 'No Roles - ERROR'
    END as migration_status
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.role, ur.user_id;

\echo 'Migration status view created: user_role_migration_status'

-- ================================
-- COMMIT MIGRATION
-- ================================
\echo 'Step 10: Committing migration...'

COMMIT;

\echo ''
\echo '🎉 RBAC MIGRATION COMPLETED SUCCESSFULLY!'
\echo ''
\echo 'Next Steps:'
\echo '1. Test the new RBAC system with: SELECT * FROM user_role_migration_status;'
\echo '2. Use permission functions: SELECT user_can_perform_action(user_id, ''payrolls'', ''read'');'
\echo '3. Test Hasura claims: SELECT get_hasura_claims(''clerk_user_id'');'
\echo '4. Update application code to use new RBAC functions'
\echo '5. Once confirmed working, drop legacy role column: ALTER TABLE users DROP COLUMN role;'
\echo ''
\echo 'Your enterprise-grade RBAC system is now fully operational! 🚀' 
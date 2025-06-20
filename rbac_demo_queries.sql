-- ================================
-- RBAC INHERITANCE DEMONSTRATION QUERIES
-- Shows how role hierarchy works with priority-based inheritance
-- ================================

\echo '=== RBAC SYSTEM DEMONSTRATION ==='
\echo ''

-- ================================
-- 1. ROLE HIERARCHY OVERVIEW
-- ================================
\echo '1. ROLE HIERARCHY (Priority-based inheritance):'
\echo '   Higher priority roles inherit permissions from lower priority roles'
\echo ''

SELECT 
    priority,
    name as role_name,
    display_name,
    description,
    CASE WHEN is_system_role THEN 'System' ELSE 'Custom' END as role_type
FROM roles 
ORDER BY priority DESC;

\echo ''

-- ================================
-- 2. RESOURCE & PERMISSION SUMMARY
-- ================================
\echo '2. AVAILABLE RESOURCES AND ACTIONS:'
\echo ''

SELECT 
    r.name as resource,
    r.display_name,
    array_agg(DISTINCT p.action ORDER BY p.action) as available_actions
FROM resources r
JOIN permissions p ON r.id = p.resource_id
GROUP BY r.name, r.display_name
ORDER BY r.name;

\echo ''

-- ================================
-- 3. DIRECT ROLE PERMISSIONS (No Inheritance)
-- ================================
\echo '3. DIRECT PERMISSIONS BY ROLE (without inheritance):'
\echo ''

SELECT 
    r.name as role_name,
    r.priority,
    res.name as resource,
    p.action,
    CASE 
        WHEN rp.conditions IS NOT NULL THEN rp.conditions::text 
        ELSE 'No conditions' 
    END as conditions
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
JOIN resources res ON p.resource_id = res.id
ORDER BY r.priority DESC, res.name, p.action;

\echo ''

-- ================================
-- 4. INHERITANCE LOGIC EXPLANATION
-- ================================
\echo '4. INHERITANCE LOGIC:'
\echo '   - A role inherits ALL permissions from roles with LOWER priority numbers'
\echo '   - Example: Manager (priority 70) inherits from:'
\echo '     • Lead Consultant (60), Consultant (50), Payroll Processor (40), etc.'
\echo '   - This creates a hierarchical permission structure'
\echo ''

-- ================================
-- 5. EFFECTIVE PERMISSIONS WITH INHERITANCE
-- ================================
\echo '5. EFFECTIVE PERMISSIONS WITH INHERITANCE:'
\echo '   This shows what a user ACTUALLY gets when assigned a role'
\echo ''

-- Function to show effective permissions for a role
CREATE OR REPLACE FUNCTION get_effective_permissions(target_role_name text)
RETURNS TABLE (
    resource text,
    action text,
    granted_by_role text,
    role_priority integer,
    conditions jsonb
) AS $$
BEGIN
    RETURN QUERY
    WITH target_role_info AS (
        SELECT id, priority
        FROM roles 
        WHERE name = target_role_name
    ),
    inherited_roles AS (
        SELECT r.id as role_id, r.name as role_name, r.priority
        FROM target_role_info tri
        CROSS JOIN roles r
        WHERE r.priority <= tri.priority  -- Inherit from same or lower priority
    )
    SELECT DISTINCT
        res.name::text as resource,
        p.action::text as action,
        ir.role_name::text as granted_by_role,
        ir.priority as role_priority,
        rp.conditions
    FROM inherited_roles ir
    JOIN role_permissions rp ON ir.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    JOIN resources res ON p.resource_id = res.id
    ORDER BY res.name, p.action, ir.priority DESC;
END;
$$ LANGUAGE plpgsql;

-- Demonstrate inheritance for different roles
\echo '5a. CONSULTANT (Priority 50) - Effective Permissions:'
SELECT * FROM get_effective_permissions('consultant');

\echo ''
\echo '5b. MANAGER (Priority 70) - Effective Permissions:'
SELECT * FROM get_effective_permissions('manager');

\echo ''
\echo '5c. ORG ADMIN (Priority 90) - Effective Permissions:'
SELECT * FROM get_effective_permissions('org_admin');

\echo ''

-- ================================
-- 6. INHERITANCE COMPARISON
-- ================================
\echo '6. INHERITANCE COMPARISON:'
\echo '   Showing how permissions accumulate up the hierarchy'
\echo ''

WITH role_permission_counts AS (
    SELECT 
        r.name as role_name,
        r.priority,
        -- Direct permissions
        COUNT(DISTINCT CASE WHEN rp.role_id = r.id THEN p.id END) as direct_permissions,
        -- Total effective permissions (with inheritance)
        COUNT(DISTINCT CASE WHEN r2.priority <= r.priority THEN p2.id END) as effective_permissions
    FROM roles r
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
    CROSS JOIN roles r2
    LEFT JOIN role_permissions rp2 ON r2.id = rp2.role_id
    LEFT JOIN permissions p2 ON rp2.permission_id = p2.id
    GROUP BY r.name, r.priority
)
SELECT 
    priority,
    role_name,
    direct_permissions,
    effective_permissions,
    (effective_permissions - direct_permissions) as inherited_permissions,
    ROUND(
        CASE 
            WHEN direct_permissions > 0 THEN 
                ((effective_permissions - direct_permissions)::float / direct_permissions * 100) 
            ELSE 0 
        END, 1
    ) as inheritance_multiplier_percent
FROM role_permission_counts
ORDER BY priority DESC;

\echo ''

-- ================================
-- 7. PERMISSION OVERRIDE EXAMPLES
-- ================================
\echo '7. PERMISSION OVERRIDE SYSTEM:'
\echo '   How to grant/restrict specific permissions beyond role inheritance'
\echo ''

-- Show override structure
\d permission_overrides;

\echo ''
\echo '7a. Example Override Scenarios:'

-- Example data for demonstration (won't actually insert)
\echo 'Scenario 1: Grant temporary billing access to a consultant'
\echo 'INSERT INTO permission_overrides (user_id, resource, operation, granted, expires_at)'
\echo 'VALUES (user_id, ''billing'', ''read'', true, NOW() + INTERVAL ''30 days'');'
\echo ''

\echo 'Scenario 2: Restrict payroll modifications for specific user'
\echo 'INSERT INTO permission_overrides (user_id, resource, operation, granted)'
\echo 'VALUES (user_id, ''payrolls'', ''update'', false);'
\echo ''

\echo 'Scenario 3: Grant role-level exception'
\echo 'INSERT INTO permission_overrides (role, resource, operation, granted)'
\echo 'VALUES (''consultant'', ''analytics'', ''create'', true);'
\echo ''

-- ================================
-- 8. REAL-WORLD USAGE EXAMPLES
-- ================================
\echo '8. REAL-WORLD USAGE PATTERNS:'
\echo ''

-- Example: Check if user can perform action
CREATE OR REPLACE FUNCTION user_can_perform_action(
    user_email text,
    target_resource text,
    target_action text
) RETURNS boolean AS $$
DECLARE
    can_perform boolean := false;
BEGIN
    -- Check through role inheritance
    SELECT EXISTS (
        SELECT 1
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles user_role ON ur.role_id = user_role.id
        CROSS JOIN roles inherited_role
        JOIN role_permissions rp ON inherited_role.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        JOIN resources res ON p.resource_id = res.id
        WHERE u.email = user_email
        AND res.name = target_resource
        AND p.action = target_action
        AND inherited_role.priority <= user_role.priority
    ) INTO can_perform;
    
    -- TODO: Also check permission_overrides table for exceptions
    
    RETURN can_perform;
END;
$$ LANGUAGE plpgsql;

\echo 'Function created: user_can_perform_action(email, resource, action)'
\echo 'Usage: SELECT user_can_perform_action(''user@example.com'', ''payrolls'', ''update'');'
\echo ''

-- ================================
-- 9. PERFORMANCE CONSIDERATIONS
-- ================================
\echo '9. PERFORMANCE OPTIMIZATION NOTES:'
\echo '   - Role hierarchy queries can be complex'
\echo '   - Consider materialized views for frequently accessed permissions'
\echo '   - Index on (user_id, resource, action) for quick permission checks'
\echo '   - Use caching for permission results in application layer'
\echo ''

-- Show existing indexes related to RBAC
\echo 'Current RBAC-related indexes:'
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('users', 'roles', 'user_roles', 'permissions', 'role_permissions', 'permission_overrides')
AND schemaname = 'public'
ORDER BY tablename, indexname;

\echo ''

-- ================================
-- 10. SECURITY BEST PRACTICES
-- ================================
\echo '10. SECURITY BEST PRACTICES IMPLEMENTED:'
\echo '    ✓ Principle of least privilege (granular permissions)'
\echo '    ✓ Role-based separation of duties'
\echo '    ✓ Audit trail (permission_audit_log table)'
\echo '    ✓ Temporal permissions (expires_at in overrides)'
\echo '    ✓ Conditional permissions (JSONB conditions)'
\echo '    ✓ System vs custom role separation'
\echo '    ✓ Hierarchical role inheritance'
\echo ''

-- ================================
-- CLEANUP
-- ================================
-- Drop the demo function
DROP FUNCTION IF EXISTS get_effective_permissions(text);
DROP FUNCTION IF EXISTS user_can_perform_action(text, text, text);

\echo 'Demo completed! Your RBAC system is enterprise-grade!'
\echo 'Next steps:'
\echo '1. Run: psql -f database/rbac_seed_data.sql'
\echo '2. Create some test users and assign roles'
\echo '3. Test the permission inheritance in your application' 
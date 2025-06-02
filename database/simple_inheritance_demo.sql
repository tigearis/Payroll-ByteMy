-- Simple demonstration of role hierarchy inheritance
\echo '=== ROLE INHERITANCE DEMONSTRATION ==='
\echo ''
\echo 'Your role hierarchy (priority-based):'

SELECT 
    priority,
    name as role_name,
    display_name,
    description
FROM roles 
ORDER BY priority DESC;

\echo ''
\echo 'Permission inheritance logic:'
\echo 'Each role inherits ALL permissions from roles with LOWER or EQUAL priority'
\echo ''

-- Show what each role inherits
\echo 'Manager (priority 80) inherits from:'
SELECT 
    r.name as inherited_role,
    r.priority,
    COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
WHERE r.priority <= 80
GROUP BY r.name, r.priority
ORDER BY r.priority DESC;

\echo ''
\echo 'Consultant (priority 70) inherits from:'
SELECT 
    r.name as inherited_role,
    r.priority,
    COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
WHERE r.priority <= 70
GROUP BY r.name, r.priority
ORDER BY r.priority DESC;

\echo ''
\echo 'Viewer (priority 10) inherits from:'
SELECT 
    r.name as inherited_role,
    r.priority,
    COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
WHERE r.priority <= 10
GROUP BY r.name, r.priority
ORDER BY r.priority DESC;

\echo ''
\echo '=== PRACTICAL EXAMPLE ==='
\echo 'If you assign a user the MANAGER role, they get:'
\echo '- All Manager permissions (direct)'
\echo '- All Consultant permissions (inherited)'
\echo '- All Viewer permissions (inherited)'
\echo ''
\echo 'This creates a natural hierarchy where higher roles include all lower permissions!'

-- Show a specific permission example
\echo ''
\echo 'Example: Who can READ payrolls?'
SELECT DISTINCT
    r.name as role_name,
    r.priority,
    'Can read payrolls' as permission
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
JOIN resources res ON p.resource_id = res.id
WHERE res.name = 'payrolls' AND p.action = 'read'
ORDER BY r.priority DESC;

\echo ''
\echo 'Through inheritance, if you are a Manager (80), you can also read payrolls'
\echo 'because you inherit the Consultant role which has payroll read permissions!' 
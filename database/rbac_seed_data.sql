-- ================================
-- RBAC SEED DATA - DEPRECATED
-- ================================
-- 
-- This file contained complex RBAC seed data with 10 roles and
-- detailed permission tables. It has been superseded by a
-- simplified 5-role system:
--
-- 1. admin      - Full system access (legacy, maps to org_admin)
-- 2. org_admin  - Organization administration
-- 3. manager    - Team and client management  
-- 4. consultant - Day-to-day operations
-- 5. viewer     - Read-only access
--
-- The simplified system uses:
-- - PostgreSQL user_role ENUM for role definitions
-- - Hasura row-level security for permissions
-- - No additional RBAC tables needed
--
-- To migrate to the simplified system, run:
-- psql -f database/simplify_rbac_migration.sql
--
-- ================================

-- First, clear existing data (optional - comment out for production)
-- TRUNCATE TABLE role_permissions, user_roles, permissions, resources, roles CASCADE;

-- ================================
-- 1. ROLES WITH HIERARCHY (priority-based)
-- ================================
INSERT INTO roles (name, display_name, description, priority, is_system_role) VALUES
-- System Admin (Highest Priority)
('system_admin', 'System Administrator', 'Full system access - can manage everything', 100, true),

-- Organization Admins
('org_admin', 'Organization Admin', 'Manages organization settings, users, and high-level operations', 90, true),

-- Management Roles
('senior_manager', 'Senior Manager', 'Oversees multiple teams and has broad operational control', 80, true),
('manager', 'Manager', 'Manages team members and client relationships', 70, true),

-- Specialist Roles
('lead_consultant', 'Lead Consultant', 'Senior consultant with mentoring responsibilities', 60, true),
('consultant', 'Consultant', 'Handles client payrolls and day-to-day operations', 50, true),

-- Support Roles
('payroll_processor', 'Payroll Processor', 'Processes payroll data and handles routine tasks', 40, true),
('data_analyst', 'Data Analyst', 'Analyzes payroll data and generates reports', 35, true),

-- Basic Access
('client_viewer', 'Client Viewer', 'Read-only access to client-specific data', 20, true),
('viewer', 'Viewer', 'Basic read-only system access', 10, true);

-- ================================
-- 2. RESOURCES (What can be accessed)
-- ================================
INSERT INTO resources (name, display_name, description) VALUES
-- Core Business Objects
('payrolls', 'Payrolls', 'Client payroll schedules and processing'),
('clients', 'Clients', 'Client organizations and contact information'),
('staff', 'Staff', 'Internal staff members and team structure'),
('users', 'Users', 'System users and authentication'),

-- Financial & Billing
('billing', 'Billing', 'Invoicing and payment management'),
('financial_reports', 'Financial Reports', 'Revenue and cost analysis'),

-- Data & Analytics
('reports', 'Reports', 'Standard business reports'),
('analytics', 'Analytics', 'Data analysis and insights'),
('audit_logs', 'Audit Logs', 'System activity and change tracking'),

-- System Administration
('system_settings', 'System Settings', 'Application configuration and setup'),
('user_management', 'User Management', 'User accounts and role assignments'),
('permissions', 'Permissions', 'Access control and security settings'),

-- Workflow & Operations
('scheduling', 'Scheduling', 'Payroll dates and processing schedules'),
('notifications', 'Notifications', 'Email and system notifications'),
('holidays', 'Holidays', 'Public holidays and business calendar');

-- ================================
-- 3. PERMISSIONS (Actions on Resources)
-- ================================
INSERT INTO permissions (resource_id, action, description) VALUES
-- Payrolls permissions
((SELECT id FROM resources WHERE name = 'payrolls'), 'read', 'View payroll information'),
((SELECT id FROM resources WHERE name = 'payrolls'), 'create', 'Create new payrolls'),
((SELECT id FROM resources WHERE name = 'payrolls'), 'update', 'Modify payroll details'),
((SELECT id FROM resources WHERE name = 'payrolls'), 'delete', 'Remove payrolls'),
((SELECT id FROM resources WHERE name = 'payrolls'), 'manage', 'Full payroll management including processing'),

-- Clients permissions
((SELECT id FROM resources WHERE name = 'clients'), 'read', 'View client information'),
((SELECT id FROM resources WHERE name = 'clients'), 'create', 'Add new clients'),
((SELECT id FROM resources WHERE name = 'clients'), 'update', 'Modify client details'),
((SELECT id FROM resources WHERE name = 'clients'), 'delete', 'Remove clients'),
((SELECT id FROM resources WHERE name = 'clients'), 'manage', 'Full client relationship management'),

-- Staff permissions
((SELECT id FROM resources WHERE name = 'staff'), 'read', 'View staff information'),
((SELECT id FROM resources WHERE name = 'staff'), 'create', 'Add new staff members'),
((SELECT id FROM resources WHERE name = 'staff'), 'update', 'Modify staff details'),
((SELECT id FROM resources WHERE name = 'staff'), 'delete', 'Remove staff members'),
((SELECT id FROM resources WHERE name = 'staff'), 'manage', 'Full staff management'),

-- Users permissions
((SELECT id FROM resources WHERE name = 'users'), 'read', 'View user accounts'),
((SELECT id FROM resources WHERE name = 'users'), 'create', 'Create user accounts'),
((SELECT id FROM resources WHERE name = 'users'), 'update', 'Modify user accounts'),
((SELECT id FROM resources WHERE name = 'users'), 'delete', 'Delete user accounts'),
((SELECT id FROM resources WHERE name = 'users'), 'manage', 'Full user account management'),

-- Billing permissions
((SELECT id FROM resources WHERE name = 'billing'), 'read', 'View billing information'),
((SELECT id FROM resources WHERE name = 'billing'), 'create', 'Create invoices and billing'),
((SELECT id FROM resources WHERE name = 'billing'), 'update', 'Modify billing details'),
((SELECT id FROM resources WHERE name = 'billing'), 'manage', 'Full billing management'),

-- Reports permissions
((SELECT id FROM resources WHERE name = 'reports'), 'read', 'View standard reports'),
((SELECT id FROM resources WHERE name = 'reports'), 'create', 'Generate custom reports'),

-- Analytics permissions
((SELECT id FROM resources WHERE name = 'analytics'), 'read', 'View analytics dashboards'),
((SELECT id FROM resources WHERE name = 'analytics'), 'create', 'Create custom analytics'),

-- Financial Reports permissions
((SELECT id FROM resources WHERE name = 'financial_reports'), 'read', 'View financial reports'),
((SELECT id FROM resources WHERE name = 'financial_reports'), 'create', 'Generate financial reports'),

-- System Settings permissions
((SELECT id FROM resources WHERE name = 'system_settings'), 'read', 'View system configuration'),
((SELECT id FROM resources WHERE name = 'system_settings'), 'update', 'Modify system settings'),
((SELECT id FROM resources WHERE name = 'system_settings'), 'manage', 'Full system administration'),

-- User Management permissions
((SELECT id FROM resources WHERE name = 'user_management'), 'read', 'View user management interface'),
((SELECT id FROM resources WHERE name = 'user_management'), 'create', 'Create users and assign roles'),
((SELECT id FROM resources WHERE name = 'user_management'), 'update', 'Modify user roles and permissions'),
((SELECT id FROM resources WHERE name = 'user_management'), 'manage', 'Full user management authority'),

-- Permissions management
((SELECT id FROM resources WHERE name = 'permissions'), 'read', 'View permission settings'),
((SELECT id FROM resources WHERE name = 'permissions'), 'update', 'Modify permissions'),
((SELECT id FROM resources WHERE name = 'permissions'), 'manage', 'Full permission management'),

-- Audit Logs permissions
((SELECT id FROM resources WHERE name = 'audit_logs'), 'read', 'View audit logs'),

-- Scheduling permissions
((SELECT id FROM resources WHERE name = 'scheduling'), 'read', 'View schedules'),
((SELECT id FROM resources WHERE name = 'scheduling'), 'create', 'Create schedules'),
((SELECT id FROM resources WHERE name = 'scheduling'), 'update', 'Modify schedules'),
((SELECT id FROM resources WHERE name = 'scheduling'), 'manage', 'Full schedule management'),

-- Notifications permissions
((SELECT id FROM resources WHERE name = 'notifications'), 'read', 'View notifications'),
((SELECT id FROM resources WHERE name = 'notifications'), 'create', 'Send notifications'),
((SELECT id FROM resources WHERE name = 'notifications'), 'manage', 'Manage notification settings'),

-- Holidays permissions
((SELECT id FROM resources WHERE name = 'holidays'), 'read', 'View holiday calendar'),
((SELECT id FROM resources WHERE name = 'holidays'), 'update', 'Modify holiday settings');

-- ================================
-- 4. ROLE PERMISSIONS (What each role can do)
-- ================================

-- SYSTEM ADMIN (Priority 100) - Full Access
INSERT INTO role_permissions (role_id, permission_id, conditions) 
SELECT r.id, p.id, NULL
FROM roles r, permissions p 
WHERE r.name = 'system_admin';

-- ORG ADMIN (Priority 90) - Organization Management
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'org_admin' 
AND p.resource_id = res.id
AND res.name IN ('users', 'user_management', 'staff', 'clients', 'billing', 'financial_reports', 'reports', 'analytics', 'audit_logs', 'system_settings')
AND p.action IN ('read', 'create', 'update', 'manage');

-- Add specific payroll permissions for org_admin
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'org_admin' 
AND p.resource_id = res.id
AND res.name = 'payrolls'
AND p.action IN ('read', 'update', 'manage');

-- SENIOR MANAGER (Priority 80) - Team and Operations Management
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'senior_manager' 
AND p.resource_id = res.id
AND res.name IN ('payrolls', 'clients', 'staff', 'billing', 'reports', 'analytics', 'scheduling', 'notifications')
AND p.action IN ('read', 'create', 'update', 'manage');

-- Add user management for senior managers
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, '{"scope": "team_members"}'::jsonb
FROM roles r, permissions p, resources res
WHERE r.name = 'senior_manager' 
AND p.resource_id = res.id
AND res.name IN ('users', 'user_management')
AND p.action IN ('read', 'update');

-- MANAGER (Priority 70) - Team and Client Management
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'manager' 
AND p.resource_id = res.id
AND res.name IN ('payrolls', 'clients', 'staff', 'reports', 'scheduling', 'notifications')
AND p.action IN ('read', 'create', 'update');

-- Limited billing access for managers
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'manager' 
AND p.resource_id = res.id
AND res.name = 'billing'
AND p.action IN ('read', 'create');

-- LEAD CONSULTANT (Priority 60) - Senior Operational Role
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'lead_consultant' 
AND p.resource_id = res.id
AND res.name IN ('payrolls', 'clients', 'scheduling', 'reports', 'holidays')
AND p.action IN ('read', 'create', 'update');

-- View staff for mentoring
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'lead_consultant' 
AND p.resource_id = res.id
AND res.name = 'staff'
AND p.action = 'read';

-- CONSULTANT (Priority 50) - Operational Role
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, '{"scope": "assigned_clients"}'::jsonb
FROM roles r, permissions p, resources res
WHERE r.name = 'consultant' 
AND p.resource_id = res.id
AND res.name IN ('payrolls', 'clients')
AND p.action IN ('read', 'update');

-- Basic reporting and scheduling
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'consultant' 
AND p.resource_id = res.id
AND res.name IN ('reports', 'scheduling', 'holidays', 'notifications')
AND p.action = 'read';

-- PAYROLL PROCESSOR (Priority 40) - Processing Focus
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, '{"scope": "processing_only"}'::jsonb
FROM roles r, permissions p, resources res
WHERE r.name = 'payroll_processor' 
AND p.resource_id = res.id
AND res.name = 'payrolls'
AND p.action IN ('read', 'update');

-- Read access to supporting data
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'payroll_processor' 
AND p.resource_id = res.id
AND res.name IN ('clients', 'scheduling', 'holidays')
AND p.action = 'read';

-- DATA ANALYST (Priority 35) - Analytics Focus
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, NULL
FROM roles r, permissions p, resources res
WHERE r.name = 'data_analyst' 
AND p.resource_id = res.id
AND res.name IN ('reports', 'analytics')
AND p.action IN ('read', 'create');

-- Read access to data sources
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, '{"access": "read_only"}'::jsonb
FROM roles r, permissions p, resources res
WHERE r.name = 'data_analyst' 
AND p.resource_id = res.id
AND res.name IN ('payrolls', 'clients', 'billing')
AND p.action = 'read';

-- CLIENT VIEWER (Priority 20) - Limited Client Access
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, '{"scope": "own_organization"}'::jsonb
FROM roles r, permissions p, resources res
WHERE r.name = 'client_viewer' 
AND p.resource_id = res.id
AND res.name IN ('payrolls', 'clients', 'reports')
AND p.action = 'read';

-- VIEWER (Priority 10) - Basic Read Access
INSERT INTO role_permissions (role_id, permission_id, conditions)
SELECT r.id, p.id, '{"access": "basic"}'::jsonb
FROM roles r, permissions p, resources res
WHERE r.name = 'viewer' 
AND p.resource_id = res.id
AND res.name IN ('reports', 'holidays')
AND p.action = 'read';

-- ================================
-- 5. EXAMPLE PERMISSION OVERRIDES
-- ================================

-- Example: Give a specific consultant temporary billing access
-- INSERT INTO permission_overrides (user_id, resource, operation, granted, conditions, expires_at)
-- VALUES (
--     (SELECT id FROM users WHERE email = 'consultant@example.com'),
--     'billing',
--     'read',
--     true,
--     '{"reason": "Monthly billing review", "approved_by": "manager@example.com"}'::jsonb,
--     NOW() + INTERVAL '30 days'
-- );

-- Example: Temporarily restrict a user from payroll modifications
-- INSERT INTO permission_overrides (user_id, resource, operation, granted, conditions)
-- VALUES (
--     (SELECT id FROM users WHERE email = 'restricted@example.com'),
--     'payrolls',
--     'update',
--     false,
--     '{"reason": "Under review", "restricted_by": "admin@example.com"}'::jsonb
-- );

-- ================================
-- 6. USEFUL QUERIES TO TEST THE SYSTEM
-- ================================

-- Check role hierarchy by priority
-- SELECT name, display_name, priority, is_system_role 
-- FROM roles 
-- ORDER BY priority DESC;

-- Check permissions for a specific role
-- SELECT 
--     r.name as role_name,
--     res.name as resource,
--     p.action,
--     rp.conditions
-- FROM roles r
-- JOIN role_permissions rp ON r.id = rp.role_id
-- JOIN permissions p ON rp.permission_id = p.id
-- JOIN resources res ON p.resource_id = res.id
-- WHERE r.name = 'consultant'
-- ORDER BY res.name, p.action;

-- Check effective permissions for a user (including role inheritance)
-- WITH user_effective_roles AS (
--     SELECT DISTINCT ur.user_id, r.id as role_id, r.priority
--     FROM user_roles ur
--     JOIN roles r ON ur.role_id = r.id
--     WHERE ur.user_id = (SELECT id FROM users WHERE email = 'user@example.com')
-- ),
-- inherited_roles AS (
--     SELECT uer.user_id, r.id as role_id, r.priority
--     FROM user_effective_roles uer
--     CROSS JOIN roles r
--     WHERE r.priority <= uer.priority  -- Lower priority roles are inherited
-- )
-- SELECT DISTINCT
--     res.name as resource,
--     p.action,
--     r.name as granted_by_role,
--     r.priority,
--     rp.conditions
-- FROM inherited_roles ir
-- JOIN role_permissions rp ON ir.role_id = rp.role_id
-- JOIN permissions p ON rp.permission_id = p.id
-- JOIN resources res ON p.resource_id = res.id
-- JOIN roles r ON ir.role_id = r.id
-- ORDER BY res.name, p.action, r.priority DESC;

COMMIT;

-- ================================
-- SUCCESS MESSAGE
-- ================================
\echo 'RBAC Seed Data Successfully Loaded!'
\echo 'Role Hierarchy (by priority):'
\echo '  100: System Admin (Full Access)'
\echo '   90: Org Admin (Organization Management)'
\echo '   80: Senior Manager (Team & Operations)'
\echo '   70: Manager (Team & Client Management)'
\echo '   60: Lead Consultant (Senior Operations)'
\echo '   50: Consultant (Client Operations)'
\echo '   40: Payroll Processor (Processing Focus)'
\echo '   35: Data Analyst (Analytics Focus)'
\echo '   20: Client Viewer (Limited Client Access)'
\echo '   10: Viewer (Basic Read Access)'
\echo ''
\echo 'Use the commented queries at the end to test the system!' 
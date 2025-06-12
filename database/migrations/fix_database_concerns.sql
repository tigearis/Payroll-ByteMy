-- Database Performance and Security Fixes
-- Generated: ${new Date().toISOString()}
-- Purpose: Address all database concerns identified in system analysis

-- =====================================================
-- 1. ADD MISSING INDEXES
-- =====================================================

-- Index for payroll_assignments.assigned_by (foreign key without index)
CREATE INDEX IF NOT EXISTS idx_payroll_assignments_assigned_by 
ON public.payroll_assignments(assigned_by);

-- Index for billing_invoice.client_id (has FK but no index)
CREATE INDEX IF NOT EXISTS idx_billing_invoice_client_id 
ON public.billing_invoice(client_id);

-- Index for notes.created_at (for time-based queries)
CREATE INDEX IF NOT EXISTS idx_notes_created_at 
ON public.notes(created_at DESC);

-- Composite index for active payrolls queries
CREATE INDEX IF NOT EXISTS idx_payrolls_active_dates 
ON public.payrolls(status, go_live_date, superseded_date) 
WHERE status = 'Active';

-- Composite index for active staff queries
CREATE INDEX IF NOT EXISTS idx_users_active_staff 
ON public.users(is_active, is_staff, role) 
WHERE is_active = true;

-- Additional performance indexes for common JOIN patterns
CREATE INDEX IF NOT EXISTS idx_payroll_dates_future 
ON public.payroll_dates(adjusted_eft_date) 
WHERE adjusted_eft_date >= CURRENT_DATE;

CREATE INDEX IF NOT EXISTS idx_payrolls_current_version 
ON public.payrolls(parent_payroll_id, version_number DESC) 
WHERE superseded_date IS NULL;

-- =====================================================
-- 2. CREATE AUDIT TABLES FOR SOC2 COMPLIANCE
-- =====================================================

-- Create schema for audit tables
CREATE SCHEMA IF NOT EXISTS audit;

-- Main audit log table
CREATE TABLE IF NOT EXISTS audit.audit_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id uuid,
    user_email text,
    user_role text,
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    session_id text,
    request_id text,
    success boolean DEFAULT true,
    error_message text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for audit log
CREATE INDEX idx_audit_log_event_time ON audit.audit_log(event_time DESC);
CREATE INDEX idx_audit_log_user_id ON audit.audit_log(user_id);
CREATE INDEX idx_audit_log_resource ON audit.audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_action ON audit.audit_log(action);
CREATE INDEX idx_audit_log_session ON audit.audit_log(session_id);

-- Authentication audit table
CREATE TABLE IF NOT EXISTS audit.auth_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_type text NOT NULL, -- login, logout, failed_login, password_reset, mfa_enabled, etc.
    user_id uuid,
    user_email text,
    ip_address inet,
    user_agent text,
    success boolean DEFAULT true,
    failure_reason text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_events_time ON audit.auth_events(event_time DESC);
CREATE INDEX idx_auth_events_user ON audit.auth_events(user_id);
CREATE INDEX idx_auth_events_type ON audit.auth_events(event_type);

-- Permission changes audit
CREATE TABLE IF NOT EXISTS audit.permission_changes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    changed_by_user_id uuid NOT NULL,
    target_user_id uuid,
    target_role_id uuid,
    change_type text NOT NULL, -- grant, revoke, modify
    permission_type text,
    old_permissions jsonb,
    new_permissions jsonb,
    reason text,
    approved_by_user_id uuid,
    metadata jsonb
);

CREATE INDEX idx_permission_changes_time ON audit.permission_changes(changed_at DESC);
CREATE INDEX idx_permission_changes_target_user ON audit.permission_changes(target_user_id);
CREATE INDEX idx_permission_changes_changed_by ON audit.permission_changes(changed_by_user_id);

-- Data access audit
CREATE TABLE IF NOT EXISTS audit.data_access_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    accessed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id uuid NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    access_type text NOT NULL, -- view, export, download, print
    data_classification text, -- critical, high, medium, low
    fields_accessed text[],
    query_executed text,
    row_count integer,
    ip_address inet,
    session_id text,
    metadata jsonb
);

CREATE INDEX idx_data_access_time ON audit.data_access_log(accessed_at DESC);
CREATE INDEX idx_data_access_user ON audit.data_access_log(user_id);
CREATE INDEX idx_data_access_resource ON audit.data_access_log(resource_type, resource_id);
CREATE INDEX idx_data_access_classification ON audit.data_access_log(data_classification);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Users table RLS policies
CREATE POLICY users_select_policy ON public.users
    FOR SELECT
    USING (
        -- Users can see themselves
        id = current_setting('hasura.user_id')::uuid
        OR
        -- Staff can see other users based on role hierarchy
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = current_setting('hasura.user_id')::uuid
            AND u.is_staff = true
            AND (
                u.role = 'admin' -- Admins see all
                OR (u.role = 'org_admin' AND users.role != 'admin') -- Org admins see all except admins
                OR (u.role = 'manager' AND users.role NOT IN ('admin', 'org_admin')) -- Managers see consultants and viewers
                OR (u.role = 'consultant' AND users.role = 'viewer') -- Consultants see viewers
            )
        )
    );

-- Payrolls table RLS policies
CREATE POLICY payrolls_select_policy ON public.payrolls
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = current_setting('hasura.user_id')::uuid
            AND (
                u.role IN ('admin', 'org_admin') -- Admins see all
                OR (u.role = 'manager' AND manager_user_id = u.id) -- Managers see their payrolls
                OR (u.role = 'consultant' AND (primary_consultant_user_id = u.id OR backup_consultant_user_id = u.id)) -- Consultants see assigned payrolls
            )
        )
    );

-- =====================================================
-- 4. AUDIT TRIGGER FUNCTIONS
-- =====================================================

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit.log_changes() RETURNS TRIGGER AS $$
DECLARE
    v_old_data jsonb;
    v_new_data jsonb;
    v_user_id uuid;
    v_user_email text;
    v_user_role text;
BEGIN
    -- Get user context from Hasura
    v_user_id := current_setting('hasura.user_id', true)::uuid;
    
    -- Get user details
    SELECT email, role INTO v_user_email, v_user_role
    FROM public.users
    WHERE id = v_user_id;
    
    IF (TG_OP = 'UPDATE') THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        
        INSERT INTO audit.audit_log (
            user_id, user_email, user_role, action, 
            resource_type, resource_id, 
            old_values, new_values,
            session_id, request_id
        ) VALUES (
            v_user_id, v_user_email, v_user_role, 'UPDATE',
            TG_TABLE_NAME, NEW.id::text,
            v_old_data, v_new_data,
            current_setting('hasura.session_id', true),
            current_setting('hasura.request_id', true)
        );
        
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        v_old_data := to_jsonb(OLD);
        
        INSERT INTO audit.audit_log (
            user_id, user_email, user_role, action,
            resource_type, resource_id,
            old_values,
            session_id, request_id
        ) VALUES (
            v_user_id, v_user_email, v_user_role, 'DELETE',
            TG_TABLE_NAME, OLD.id::text,
            v_old_data,
            current_setting('hasura.session_id', true),
            current_setting('hasura.request_id', true)
        );
        
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        v_new_data := to_jsonb(NEW);
        
        INSERT INTO audit.audit_log (
            user_id, user_email, user_role, action,
            resource_type, resource_id,
            new_values,
            session_id, request_id
        ) VALUES (
            v_user_id, v_user_email, v_user_role, 'INSERT',
            TG_TABLE_NAME, NEW.id::text,
            v_new_data,
            current_setting('hasura.session_id', true),
            current_setting('hasura.request_id', true)
        );
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. APPLY AUDIT TRIGGERS TO SENSITIVE TABLES
-- =====================================================

-- Users table audit
CREATE TRIGGER audit_users_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.users
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

-- Payrolls table audit
CREATE TRIGGER audit_payrolls_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.payrolls
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

-- Clients table audit
CREATE TRIGGER audit_clients_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

-- Role and permission changes audit
CREATE TRIGGER audit_user_roles_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER audit_role_permissions_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.role_permissions
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

-- =====================================================
-- 6. DATA RETENTION POLICIES
-- =====================================================

-- Create a function to archive old audit logs
CREATE OR REPLACE FUNCTION audit.archive_old_logs() RETURNS void AS $$
DECLARE
    v_retention_days integer := 2555; -- 7 years for SOC2
    v_archive_date date;
BEGIN
    v_archive_date := CURRENT_DATE - INTERVAL '1 day' * v_retention_days;
    
    -- Archive old audit logs to cold storage (implement based on your storage solution)
    -- For now, we'll just delete very old logs beyond retention
    DELETE FROM audit.audit_log 
    WHERE event_time < v_archive_date - INTERVAL '1 year'; -- 8 years total
    
    DELETE FROM audit.auth_events 
    WHERE event_time < v_archive_date - INTERVAL '1 year';
    
    DELETE FROM audit.data_access_log 
    WHERE accessed_at < v_archive_date - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. PERFORMANCE OPTIMIZATION VIEWS
-- =====================================================

-- Materialized view for payroll dashboard
CREATE MATERIALIZED VIEW IF NOT EXISTS public.payroll_dashboard_stats AS
SELECT 
    p.id,
    p.name,
    p.status,
    c.name as client_name,
    pc.name as cycle_name,
    COUNT(DISTINCT pd.id) as total_dates,
    COUNT(DISTINCT pd.id) FILTER (WHERE pd.adjusted_eft_date >= CURRENT_DATE) as future_dates,
    COUNT(DISTINCT pd.id) FILTER (WHERE pd.adjusted_eft_date < CURRENT_DATE) as past_dates,
    MIN(pd.adjusted_eft_date) FILTER (WHERE pd.adjusted_eft_date >= CURRENT_DATE) as next_eft_date,
    p.primary_consultant_user_id,
    p.backup_consultant_user_id,
    p.manager_user_id
FROM public.payrolls p
LEFT JOIN public.clients c ON p.client_id = c.id
LEFT JOIN public.payroll_cycles pc ON p.cycle_id = pc.id
LEFT JOIN public.payroll_dates pd ON p.id = pd.payroll_id
WHERE p.superseded_date IS NULL
GROUP BY p.id, p.name, p.status, c.name, pc.name, 
         p.primary_consultant_user_id, p.backup_consultant_user_id, p.manager_user_id;

-- Index for the materialized view
CREATE INDEX idx_payroll_dashboard_stats_status ON public.payroll_dashboard_stats(status);
CREATE INDEX idx_payroll_dashboard_stats_consultants ON public.payroll_dashboard_stats(primary_consultant_user_id, backup_consultant_user_id);

-- =====================================================
-- 8. ENCRYPTION FOR SENSITIVE DATA
-- =====================================================

-- Install pgcrypto extension if not already installed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive(data text) RETURNS text AS $$
BEGIN
    -- In production, use a proper key management system
    -- This is a placeholder - implement proper key rotation
    RETURN encode(
        encrypt(
            data::bytea, 
            current_setting('app.encryption_key')::bytea, 
            'aes'
        ), 
        'base64'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive(encrypted_data text) RETURNS text AS $$
BEGIN
    RETURN convert_from(
        decrypt(
            decode(encrypted_data, 'base64'),
            current_setting('app.encryption_key')::bytea,
            'aes'
        ),
        'UTF8'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. QUERY PERFORMANCE MONITORING
-- =====================================================

-- Create table for slow query logging
CREATE TABLE IF NOT EXISTS audit.slow_queries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    query_start timestamp with time zone NOT NULL,
    query_duration interval NOT NULL,
    query text NOT NULL,
    user_id uuid,
    application_name text,
    client_addr inet,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_slow_queries_duration ON audit.slow_queries(query_duration DESC);
CREATE INDEX idx_slow_queries_start ON audit.slow_queries(query_start DESC);

-- =====================================================
-- 10. COMPLIANCE REPORTING VIEWS
-- =====================================================

-- User access summary for compliance reports
CREATE VIEW audit.user_access_summary AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email,
    u.role,
    u.is_active,
    COUNT(DISTINCT al.id) as total_actions,
    COUNT(DISTINCT al.id) FILTER (WHERE al.action = 'SELECT') as read_actions,
    COUNT(DISTINCT al.id) FILTER (WHERE al.action IN ('INSERT', 'UPDATE', 'DELETE')) as write_actions,
    COUNT(DISTINCT ae.id) FILTER (WHERE ae.event_type = 'login' AND ae.success = true) as successful_logins,
    COUNT(DISTINCT ae.id) FILTER (WHERE ae.event_type = 'login' AND ae.success = false) as failed_logins,
    MAX(al.event_time) as last_activity,
    MAX(ae.event_time) FILTER (WHERE ae.event_type = 'login' AND ae.success = true) as last_login
FROM public.users u
LEFT JOIN audit.audit_log al ON u.id = al.user_id
LEFT JOIN audit.auth_events ae ON u.id = ae.user_id
GROUP BY u.id, u.name, u.email, u.role, u.is_active;

-- Permission usage report
CREATE VIEW audit.permission_usage_report AS
SELECT 
    r.name as role_name,
    res.name as resource_name,
    p.action,
    COUNT(DISTINCT ur.user_id) as users_with_permission,
    COUNT(DISTINCT al.user_id) as users_who_used_permission,
    COUNT(al.id) as total_usage_count,
    MAX(al.event_time) as last_used
FROM public.roles r
JOIN public.role_permissions rp ON r.id = rp.role_id
JOIN public.permissions p ON rp.permission_id = p.id
JOIN public.resources res ON p.resource_id = res.id
LEFT JOIN public.user_roles ur ON r.id = ur.role_id
LEFT JOIN audit.audit_log al ON al.resource_type = res.name AND al.action = p.action::text
GROUP BY r.name, res.name, p.action;

-- =====================================================
-- 11. GRANT PERMISSIONS FOR HASURA
-- =====================================================

-- Grant necessary permissions to the Hasura user
GRANT USAGE ON SCHEMA audit TO neondb_owner;
GRANT SELECT ON ALL TABLES IN SCHEMA audit TO neondb_owner;
GRANT INSERT ON audit.audit_log, audit.auth_events, audit.data_access_log TO neondb_owner;

-- Grant permissions for materialized views
GRANT SELECT ON public.payroll_dashboard_stats TO neondb_owner;

-- =====================================================
-- 12. SCHEDULE MAINTENANCE TASKS
-- =====================================================

-- Note: These need to be scheduled via pg_cron or external scheduler
-- Example commands to run periodically:

-- Refresh materialized view (run every hour)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.payroll_dashboard_stats;

-- Archive old logs (run daily)
-- SELECT audit.archive_old_logs();

-- Analyze tables for query optimization (run weekly)
-- ANALYZE public.payrolls;
-- ANALYZE public.payroll_dates;
-- ANALYZE public.users;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if all indexes were created successfully
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname IN (
    'idx_payroll_assignments_assigned_by',
    'idx_billing_invoice_client_id',
    'idx_notes_created_at',
    'idx_payrolls_active_dates',
    'idx_users_active_staff'
)
ORDER BY tablename, indexname;

-- Check audit tables
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'audit'
ORDER BY table_name;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
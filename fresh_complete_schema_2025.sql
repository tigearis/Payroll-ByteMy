--
-- Fresh Complete Database Schema for Payroll ByteMy - Advanced Scheduler
-- Generated: 2025-06-02
-- Optimized for: Advanced Payroll Scheduler Component
--

-- Set encoding and timezone settings
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
SET timezone = 'Australia/Sydney';

-- Create custom schemas
CREATE SCHEMA IF NOT EXISTS payroll_db;
CREATE SCHEMA IF NOT EXISTS neon_auth;

-- Set search path
SET search_path = payroll_db, public;

-- ============================================================================
-- CUSTOM ENUMS AND TYPES
-- ============================================================================

-- User roles for RBAC
CREATE TYPE payroll_db.user_role AS ENUM (
    'admin',
    'org_admin', 
    'manager',
    'consultant',
    'viewer'
);

-- Payroll cycle types
CREATE TYPE payroll_db.payroll_cycle_type AS ENUM (
    'weekly',
    'fortnightly', 
    'bi_monthly',
    'monthly',
    'quarterly'
);

-- Payroll date calculation types
CREATE TYPE payroll_db.payroll_date_type AS ENUM (
    'fixed_date',    -- Specific day of month
    'eom',           -- End of month
    'som',           -- Start of month
    'week_a',        -- Week A (1st & 3rd week)
    'week_b',        -- Week B (2nd & 4th week)
    'dow'            -- Day of week
);

-- Leave status
CREATE TYPE payroll_db.leave_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);

-- Leave types
CREATE TYPE payroll_db.leave_type AS ENUM (
    'annual',
    'sick',
    'personal',
    'maternity',
    'paternity',
    'study',
    'long_service',
    'unpaid',
    'conference',
    'other'
);

-- Payroll status
CREATE TYPE payroll_db.payroll_status AS ENUM (
    'active',
    'inactive',
    'onboarding',
    'implementation',
    'archived'
);

-- Holiday types
CREATE TYPE payroll_db.holiday_type AS ENUM (
    'public',
    'regional',
    'company',
    'religious'
);

-- ============================================================================
-- AUTHENTICATION TABLES (Clerk Integration)
-- ============================================================================

-- Clerk users sync table
CREATE TABLE neon_auth.users_sync (
    raw_json jsonb NOT NULL,
    id text GENERATED ALWAYS AS ((raw_json ->> 'id'::text)) STORED NOT NULL,
    name text GENERATED ALWAYS AS ((raw_json ->> 'display_name'::text)) STORED,
    email text GENERATED ALWAYS AS ((raw_json ->> 'primary_email'::text)) STORED,
    created_at timestamptz GENERATED ALWAYS AS (to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / (1000)::double precision))) STORED,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamptz
);

-- ============================================================================
-- CORE BUSINESS TABLES
-- ============================================================================

-- Users table (extends Clerk users with payroll-specific data)
CREATE TABLE payroll_db.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id text UNIQUE NOT NULL, -- References neon_auth.users_sync.id
    name varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    role payroll_db.user_role NOT NULL DEFAULT 'viewer',
    phone varchar(50),
    position varchar(255),
    department varchar(255),
    hire_date date,
    salary_band varchar(50),
    manager_id uuid REFERENCES payroll_db.users(id),
    
    -- Status tracking
    is_active boolean NOT NULL DEFAULT true,
    deactivated_at timestamptz,
    deactivated_by uuid REFERENCES payroll_db.users(id),
    
    -- Metadata
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_deactivated_logic CHECK (
        (is_active = true AND deactivated_at IS NULL) OR 
        (is_active = false AND deactivated_at IS NOT NULL)
    )
);

-- Clients table
CREATE TABLE payroll_db.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    code varchar(50) UNIQUE,
    
    -- Contact information
    contact_person varchar(255),
    contact_email varchar(255),
    contact_phone varchar(50),
    address text,
    
    -- Business details
    abn varchar(20),
    industry varchar(100),
    employee_count_range varchar(50),
    
    -- Status
    is_active boolean DEFAULT true,
    onboarding_date date,
    go_live_date date,
    
    -- Metadata
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Payroll cycles reference table
CREATE TABLE payroll_db.payroll_cycles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name payroll_db.payroll_cycle_type UNIQUE NOT NULL,
    description text,
    frequency_days integer, -- Number of days in cycle
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Payroll date types reference table
CREATE TABLE payroll_db.payroll_date_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name payroll_db.payroll_date_type UNIQUE NOT NULL,
    description text,
    requires_date_value boolean DEFAULT false, -- Whether date_value is required
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Main payrolls table
CREATE TABLE payroll_db.payrolls (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic payroll info
    name varchar(255) NOT NULL,
    client_id uuid NOT NULL REFERENCES payroll_db.clients(id),
    
    -- Schedule configuration
    cycle_id uuid NOT NULL REFERENCES payroll_db.payroll_cycles(id),
    date_type_id uuid NOT NULL REFERENCES payroll_db.payroll_date_types(id),
    date_value integer, -- Day of month, week number, etc.
    
    -- Consultant assignments
    primary_consultant_id uuid REFERENCES payroll_db.users(id),
    backup_consultant_id uuid REFERENCES payroll_db.users(id),
    manager_id uuid REFERENCES payroll_db.users(id),
    
    -- Processing configuration
    processing_days_before_eft integer DEFAULT 2 NOT NULL,
    employee_count integer DEFAULT 0,
    processing_time decimal(4,2) DEFAULT 1.00, -- Hours
    
    -- Payroll details
    frequency varchar(50), -- e.g., "Weekly", "Fortnightly"
    pay_cycle_start_day integer, -- 1-7 (Monday-Sunday)
    
    -- Status and versioning
    status payroll_db.payroll_status DEFAULT 'onboarding',
    is_active boolean DEFAULT true,
    version_number integer DEFAULT 1,
    parent_payroll_id uuid REFERENCES payroll_db.payrolls(id),
    go_live_date date,
    superseded_date date,
    version_reason text,
    
    -- Metadata
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    created_by_user_id uuid REFERENCES payroll_db.users(id),
    
    -- Constraints
    CONSTRAINT check_consultant_different CHECK (
        primary_consultant_id != backup_consultant_id OR 
        backup_consultant_id IS NULL
    ),
    CONSTRAINT check_date_value_when_required CHECK (
        (date_value IS NOT NULL) OR 
        (date_type_id NOT IN (
            SELECT id FROM payroll_db.payroll_date_types 
            WHERE requires_date_value = true
        ))
    )
);

-- Payroll dates table (generated dates for each payroll)
CREATE TABLE payroll_db.payroll_dates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_id uuid NOT NULL REFERENCES payroll_db.payrolls(id) ON DELETE CASCADE,
    
    -- Date information
    original_eft_date date NOT NULL,
    adjusted_eft_date date NOT NULL,
    processing_date date NOT NULL,
    cutoff_date date,
    pay_period_start date,
    pay_period_end date,
    
    -- Holiday adjustments
    is_holiday_adjusted boolean DEFAULT false,
    adjustment_reason text,
    
    -- Metadata
    notes text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure we don't have duplicate dates for same payroll
    UNIQUE(payroll_id, original_eft_date)
);

-- Leave management table
CREATE TABLE payroll_db.leaves (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES payroll_db.users(id),
    
    -- Leave details
    leave_type payroll_db.leave_type NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason text,
    description text,
    
    -- Approval workflow
    status payroll_db.leave_status DEFAULT 'pending',
    requested_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    approved_at timestamptz,
    approved_by uuid REFERENCES payroll_db.users(id),
    rejection_reason text,
    
    -- Metadata
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_end_after_start CHECK (end_date >= start_date),
    CONSTRAINT check_approval_status CHECK (
        (status = 'approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL) OR
        (status != 'approved')
    )
);

-- Holidays table
CREATE TABLE payroll_db.holidays (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Holiday information
    date date NOT NULL,
    local_name varchar(255) NOT NULL,
    english_name varchar(255),
    types text[] DEFAULT ARRAY['public'], -- Array of holiday types
    
    -- Geographic scope
    country_code varchar(2) DEFAULT 'AU',
    region varchar(100),
    
    -- Classification
    is_public boolean DEFAULT true,
    is_recurring boolean DEFAULT false,
    
    -- Metadata
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint for date + region combination
    UNIQUE(date, country_code, region)
);

-- Adjustment rules for date calculations
CREATE TABLE payroll_db.adjustment_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule scope
    cycle_id uuid NOT NULL REFERENCES payroll_db.payroll_cycles(id),
    date_type_id uuid NOT NULL REFERENCES payroll_db.payroll_date_types(id),
    
    -- Rule definition
    rule_description text NOT NULL,
    rule_code text NOT NULL, -- e.g., 'previous', 'next', 'skip'
    priority integer DEFAULT 1,
    
    -- Conditions
    applies_to_holidays boolean DEFAULT true,
    applies_to_weekends boolean DEFAULT true,
    
    -- Metadata
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique rule per cycle+date_type combination
    UNIQUE(cycle_id, date_type_id)
);

-- Staff assignments (linking users to payrolls in various roles)
CREATE TABLE payroll_db.staff_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES payroll_db.users(id),
    payroll_id uuid NOT NULL REFERENCES payroll_db.payrolls(id),
    
    -- Assignment details
    role varchar(50) NOT NULL, -- 'primary_consultant', 'backup_consultant', 'manager'
    start_date date NOT NULL,
    end_date date,
    
    -- Status
    is_active boolean DEFAULT true,
    
    -- Metadata
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    assigned_by uuid REFERENCES payroll_db.users(id),
    
    -- Constraints
    CONSTRAINT check_assignment_dates CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT check_role_values CHECK (role IN ('primary_consultant', 'backup_consultant', 'manager'))
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Authentication indexes
CREATE INDEX IF NOT EXISTS idx_users_sync_deleted_at ON neon_auth.users_sync (deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_sync_email ON neon_auth.users_sync (email);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON payroll_db.users (clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON payroll_db.users (role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON payroll_db.users (is_active);
CREATE INDEX IF NOT EXISTS idx_users_deactivated_at ON payroll_db.users (deactivated_at) WHERE deactivated_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_manager ON payroll_db.users (manager_id);

-- Client indexes
CREATE INDEX IF NOT EXISTS idx_clients_active ON payroll_db.clients (is_active);
CREATE INDEX IF NOT EXISTS idx_clients_name ON payroll_db.clients (name);

-- Payroll indexes
CREATE INDEX IF NOT EXISTS idx_payrolls_client_id ON payroll_db.payrolls (client_id);
CREATE INDEX IF NOT EXISTS idx_payrolls_primary_consultant ON payroll_db.payrolls (primary_consultant_id);
CREATE INDEX IF NOT EXISTS idx_payrolls_backup_consultant ON payroll_db.payrolls (backup_consultant_id);
CREATE INDEX IF NOT EXISTS idx_payrolls_manager ON payroll_db.payrolls (manager_id);
CREATE INDEX IF NOT EXISTS idx_payrolls_status ON payroll_db.payrolls (status);
CREATE INDEX IF NOT EXISTS idx_payrolls_active ON payroll_db.payrolls (is_active);
CREATE INDEX IF NOT EXISTS idx_payrolls_go_live_date ON payroll_db.payrolls (go_live_date);

-- Payroll dates indexes (critical for scheduler performance)
CREATE INDEX IF NOT EXISTS idx_payroll_dates_payroll_id ON payroll_db.payroll_dates (payroll_id);
CREATE INDEX IF NOT EXISTS idx_payroll_dates_adjusted_eft_date ON payroll_db.payroll_dates (adjusted_eft_date);
CREATE INDEX IF NOT EXISTS idx_payroll_dates_processing_date ON payroll_db.payroll_dates (processing_date);
CREATE INDEX IF NOT EXISTS idx_payroll_dates_date_range ON payroll_db.payroll_dates (adjusted_eft_date, payroll_id);
CREATE INDEX IF NOT EXISTS idx_payroll_dates_month_year ON payroll_db.payroll_dates (
    EXTRACT(YEAR FROM adjusted_eft_date), 
    EXTRACT(MONTH FROM adjusted_eft_date)
);

-- Leave indexes
CREATE INDEX IF NOT EXISTS idx_leaves_user_id ON payroll_db.leaves (user_id);
CREATE INDEX IF NOT EXISTS idx_leaves_date_range ON payroll_db.leaves (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON payroll_db.leaves (status);
CREATE INDEX IF NOT EXISTS idx_leaves_user_dates ON payroll_db.leaves (user_id, start_date, end_date);

-- Holiday indexes
CREATE INDEX IF NOT EXISTS idx_holidays_date ON payroll_db.holidays (date);
CREATE INDEX IF NOT EXISTS idx_holidays_country_region ON payroll_db.holidays (country_code, region);
CREATE INDEX IF NOT EXISTS idx_holidays_date_range ON payroll_db.holidays (date, country_code);

-- Staff assignment indexes
CREATE INDEX IF NOT EXISTS idx_staff_assignments_user ON payroll_db.staff_assignments (user_id);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_payroll ON payroll_db.staff_assignments (payroll_id);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_role ON payroll_db.staff_assignments (role);
CREATE INDEX IF NOT EXISTS idx_staff_assignments_active ON payroll_db.staff_assignments (is_active);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION payroll_db.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all main tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON payroll_db.users
    FOR EACH ROW EXECUTE FUNCTION payroll_db.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON payroll_db.clients
    FOR EACH ROW EXECUTE FUNCTION payroll_db.update_updated_at_column();

CREATE TRIGGER update_payrolls_updated_at BEFORE UPDATE ON payroll_db.payrolls
    FOR EACH ROW EXECUTE FUNCTION payroll_db.update_updated_at_column();

CREATE TRIGGER update_payroll_dates_updated_at BEFORE UPDATE ON payroll_db.payroll_dates
    FOR EACH ROW EXECUTE FUNCTION payroll_db.update_updated_at_column();

CREATE TRIGGER update_leaves_updated_at BEFORE UPDATE ON payroll_db.leaves
    FOR EACH ROW EXECUTE FUNCTION payroll_db.update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON payroll_db.holidays
    FOR EACH ROW EXECUTE FUNCTION payroll_db.update_updated_at_column();

CREATE TRIGGER update_staff_assignments_updated_at BEFORE UPDATE ON payroll_db.staff_assignments
    FOR EACH ROW EXECUTE FUNCTION payroll_db.update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ============================================================================

-- Insert default payroll cycles
INSERT INTO payroll_db.payroll_cycles (name, description, frequency_days) VALUES
('weekly', 'Weekly payroll cycle', 7),
('fortnightly', 'Fortnightly payroll cycle', 14),
('monthly', 'Monthly payroll cycle', 30),
('bi_monthly', 'Bi-monthly payroll cycle', 15),
('quarterly', 'Quarterly payroll cycle', 90)
ON CONFLICT (name) DO NOTHING;

-- Insert default payroll date types
INSERT INTO payroll_db.payroll_date_types (name, description, requires_date_value) VALUES
('fixed_date', 'Fixed day of the month', true),
('eom', 'End of month', false),
('som', 'Start of month', false),
('week_a', 'Week A pattern (1st & 3rd week)', false),
('week_b', 'Week B pattern (2nd & 4th week)', false),
('dow', 'Specific day of week', true)
ON CONFLICT (name) DO NOTHING;

-- Insert common Australian public holidays for 2024-2025
INSERT INTO payroll_db.holidays (date, local_name, english_name, types, country_code, region, is_public) VALUES
('2024-01-01', 'New Year''s Day', 'New Year''s Day', ARRAY['public'], 'AU', 'national', true),
('2024-01-26', 'Australia Day', 'Australia Day', ARRAY['public'], 'AU', 'national', true),
('2024-03-29', 'Good Friday', 'Good Friday', ARRAY['public'], 'AU', 'national', true),
('2024-04-01', 'Easter Monday', 'Easter Monday', ARRAY['public'], 'AU', 'national', true),
('2024-04-25', 'ANZAC Day', 'ANZAC Day', ARRAY['public'], 'AU', 'national', true),
('2024-06-10', 'Queen''s Birthday', 'Queen''s Birthday', ARRAY['public'], 'AU', 'NSW', true),
('2024-12-25', 'Christmas Day', 'Christmas Day', ARRAY['public'], 'AU', 'national', true),
('2024-12-26', 'Boxing Day', 'Boxing Day', ARRAY['public'], 'AU', 'national', true),
('2025-01-01', 'New Year''s Day', 'New Year''s Day', ARRAY['public'], 'AU', 'national', true),
('2025-01-27', 'Australia Day', 'Australia Day', ARRAY['public'], 'AU', 'national', true),
('2025-04-18', 'Good Friday', 'Good Friday', ARRAY['public'], 'AU', 'national', true),
('2025-04-21', 'Easter Monday', 'Easter Monday', ARRAY['public'], 'AU', 'national', true),
('2025-04-25', 'ANZAC Day', 'ANZAC Day', ARRAY['public'], 'AU', 'national', true),
('2025-06-09', 'Queen''s Birthday', 'Queen''s Birthday', ARRAY['public'], 'AU', 'NSW', true),
('2025-12-25', 'Christmas Day', 'Christmas Day', ARRAY['public'], 'AU', 'national', true),
('2025-12-26', 'Boxing Day', 'Boxing Day', ARRAY['public'], 'AU', 'national', true)
ON CONFLICT (date, country_code, region) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON SCHEMA payroll_db IS 'Main schema for payroll management system';
COMMENT ON SCHEMA neon_auth IS 'Authentication schema for Clerk integration';

COMMENT ON TABLE payroll_db.users IS 'User management with role-based access control';
COMMENT ON TABLE payroll_db.clients IS 'Client information and contact details';
COMMENT ON TABLE payroll_db.payrolls IS 'Main payroll configurations with consultant assignments';
COMMENT ON TABLE payroll_db.payroll_dates IS 'Generated payroll processing dates with holiday adjustments';
COMMENT ON TABLE payroll_db.leaves IS 'Employee leave tracking for consultant availability';
COMMENT ON TABLE payroll_db.holidays IS 'Holiday calendar for date adjustments';

COMMENT ON COLUMN payroll_db.users.clerk_user_id IS 'Reference to Clerk authentication user ID';
COMMENT ON COLUMN payroll_db.users.is_active IS 'Soft delete flag for user deactivation';
COMMENT ON COLUMN payroll_db.payrolls.processing_time IS 'Estimated processing time in hours for workload planning';
COMMENT ON COLUMN payroll_db.payroll_dates.is_holiday_adjusted IS 'Flag indicating if date was moved due to holiday/weekend';

-- ============================================================================
-- GRANTS AND SECURITY (Hasura Integration)
-- ============================================================================

-- Grant schema usage
GRANT USAGE ON SCHEMA payroll_db TO PUBLIC;
GRANT USAGE ON SCHEMA neon_auth TO PUBLIC;

-- Grant table permissions (Hasura will handle row-level security)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA payroll_db TO PUBLIC;
GRANT SELECT ON ALL TABLES IN SCHEMA neon_auth TO PUBLIC;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA payroll_db TO PUBLIC;

-- Grant function execution permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA payroll_db TO PUBLIC;

-- ============================================================================
-- FINAL SETTINGS
-- ============================================================================

-- Reset search path
RESET search_path;

-- Schema creation complete
SELECT 'Payroll ByteMy Database Schema Created Successfully!' as status; 
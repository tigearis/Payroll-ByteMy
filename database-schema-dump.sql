-- Fresh Database Schema Dump
-- Generated on: 2025-01-15
-- Database: neondb (Payroll ByteMy System)

-- SCHEMAS OVERVIEW:
-- 1. public - Main application tables
-- 2. audit - SOC2 audit and compliance tables  
-- 3. neon_auth - Authentication system tables

-- ===================================
-- MAIN APPLICATION TABLES (public)
-- ===================================

-- Core User Management
CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    role public.user_role DEFAULT 'viewer' NOT NULL,
    clerk_user_id text UNIQUE,
    manager_id uuid REFERENCES public.users(id),
    is_staff boolean DEFAULT false,
    is_active boolean DEFAULT true NOT NULL,
    deactivated_at timestamptz,
    deactivated_by text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Client Management
CREATE TABLE public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    description text,
    status public.status DEFAULT 'active',
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Management
CREATE TABLE public.payrolls (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    client_id uuid NOT NULL REFERENCES public.clients(id),
    cycle_id uuid REFERENCES public.payroll_cycles(id),
    date_type_id uuid REFERENCES public.payroll_date_types(id),
    date_value integer,
    primary_consultant_user_id uuid REFERENCES public.users(id),
    backup_consultant_user_id uuid REFERENCES public.users(id),
    manager_user_id uuid REFERENCES public.users(id),
    processing_days_before_eft integer DEFAULT 2,
    status public.payroll_status DEFAULT 'Implementation',
    payroll_system varchar(100),
    processing_time varchar(50),
    employee_count integer,
    version_number integer DEFAULT 1,
    parent_payroll_id uuid,
    go_live_date date,
    superseded_date date,
    version_reason public.payroll_version_reason DEFAULT 'initial_creation',
    created_by_user_id uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Dates (Generated schedules)
CREATE TABLE public.payroll_dates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_id uuid NOT NULL REFERENCES public.payrolls(id),
    original_eft_date date NOT NULL,
    adjusted_eft_date date NOT NULL,
    processing_date date NOT NULL,
    notes text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Configuration Tables
CREATE TABLE public.payroll_cycles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    type public.payroll_cycle_type NOT NULL,
    interval_days integer,
    description text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.payroll_date_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    type public.payroll_date_type NOT NULL,
    description text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Leave Management
CREATE TABLE public.leave (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id),
    leave_type varchar(50) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason text,
    status public.leave_status_enum DEFAULT 'Pending',
    approved_by uuid REFERENCES public.users(id),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Notes System
CREATE TABLE public.notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type varchar(50) NOT NULL,
    entity_id uuid NOT NULL,
    user_id uuid REFERENCES public.users(id),
    content text NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Holidays
CREATE TABLE public.holidays (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    date date NOT NULL,
    country_code varchar(2) DEFAULT 'AU',
    state_code varchar(3),
    is_public_holiday boolean DEFAULT true,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- RBAC System
CREATE TABLE public.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    description text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) UNIQUE NOT NULL,
    action public.permission_action NOT NULL,
    resource_id uuid REFERENCES public.resources(id),
    description text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.role_permissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id uuid NOT NULL REFERENCES public.roles(id),
    permission_id uuid NOT NULL REFERENCES public.permissions(id),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id),
    role_id uuid NOT NULL REFERENCES public.roles(id),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- ===================================
-- AUDIT & COMPLIANCE TABLES
-- ===================================

-- Public Schema Audit Log (Simple)
CREATE TABLE public.audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    user_role public.user_role,
    action varchar(50) NOT NULL,
    entity_type varchar(50) NOT NULL,
    entity_id uuid,
    data_classification varchar(20) DEFAULT 'MEDIUM',
    fields_affected jsonb,
    previous_values text,
    new_values text,
    ip_address varchar(45),
    user_agent text,
    session_id varchar(255),
    request_id varchar(255) NOT NULL,
    success boolean DEFAULT true,
    error_message text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Audit Schema (Comprehensive SOC2)
CREATE TABLE audit.audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_time timestamptz DEFAULT CURRENT_TIMESTAMP,
    user_id uuid,
    user_email varchar(255),
    user_role varchar(50),
    action varchar(100) NOT NULL,
    resource_type varchar(100),
    resource_id text,
    ip_address varchar(45),
    user_agent text,
    session_id varchar(255),
    request_id varchar(255),
    success boolean DEFAULT true,
    error_message text,
    old_values jsonb,
    new_values jsonb,
    metadata jsonb
);

CREATE TABLE audit.auth_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_time timestamptz DEFAULT CURRENT_TIMESTAMP,
    event_type varchar(100) NOT NULL,
    user_id uuid,
    user_email varchar(255),
    ip_address varchar(45),
    user_agent text,
    success boolean DEFAULT true,
    failure_reason text,
    metadata jsonb
);

CREATE TABLE audit.data_access_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    accessed_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    user_id uuid,
    resource_type varchar(100),
    resource_id text,
    access_type varchar(50),
    data_classification varchar(20) DEFAULT 'MEDIUM',
    fields_accessed text[],
    query_executed text,
    row_count integer,
    ip_address varchar(45),
    session_id varchar(255),
    metadata jsonb
);

CREATE TABLE audit.permission_changes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_time timestamptz DEFAULT CURRENT_TIMESTAMP,
    changed_by uuid,
    target_user_id uuid,
    old_permissions jsonb,
    new_permissions jsonb,
    change_reason text
);

CREATE TABLE audit.slow_queries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    query_time timestamptz DEFAULT CURRENT_TIMESTAMP,
    duration_ms integer,
    query_text text,
    user_id uuid,
    affected_tables text[]
);

-- ===================================
-- KEY ENUMS & TYPES
-- ===================================

-- User roles hierarchy
CREATE TYPE public.user_role AS ENUM (
    'admin',      -- Developer (highest access)
    'org_admin',  -- Admin 
    'manager',    -- Manager
    'consultant', -- Consultant
    'viewer'      -- Viewer (lowest access)
);

-- Payroll statuses
CREATE TYPE public.payroll_status AS ENUM (
    'Active',
    'Implementation', 
    'Inactive'
);

-- Payroll cycles
CREATE TYPE public.payroll_cycle_type AS ENUM (
    'weekly',
    'fortnightly', 
    'bi_monthly',
    'monthly',
    'quarterly'
);

-- Date calculation types
CREATE TYPE public.payroll_date_type AS ENUM (
    'fixed_date',  -- Fixed date each period
    'eom',         -- End of month
    'som',         -- Start of month  
    'week_a',      -- Week A pattern
    'week_b',      -- Week B pattern
    'dow'          -- Day of week
);

-- Leave statuses
CREATE TYPE public.leave_status_enum AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);

-- ===================================
-- KEY CONSTRAINTS & RELATIONSHIPS
-- ===================================

-- Users table constraints
ALTER TABLE public.users ADD CONSTRAINT unique_active_clerk_id 
    EXCLUDE (clerk_user_id WITH =) WHERE (is_active = true);

-- Payrolls constraints  
ALTER TABLE public.payrolls ADD CONSTRAINT unique_current_payroll_per_client
    EXCLUDE (client_id WITH =) WHERE (superseded_date IS NULL);

-- Payroll dates constraints
ALTER TABLE public.payroll_dates ADD CONSTRAINT check_payroll_dates_order 
    CHECK (adjusted_eft_date >= processing_date);

-- ===================================
-- SECURITY & AUDIT TRIGGERS
-- ===================================

-- Auto-audit trigger for sensitive tables
CREATE TRIGGER audit_payrolls_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.payrolls
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

CREATE TRIGGER audit_users_changes  
    AFTER INSERT OR UPDATE OR DELETE ON public.users
    FOR EACH ROW EXECUTE FUNCTION audit.log_changes();

-- Staff role enforcement
CREATE TRIGGER enforce_payroll_staff_roles
    BEFORE INSERT OR UPDATE ON public.payrolls
    FOR EACH ROW EXECUTE FUNCTION public.enforce_staff_roles();

-- Auto-generate payroll dates
CREATE TRIGGER auto_generate_payroll_dates
    AFTER INSERT ON public.payrolls
    FOR EACH ROW EXECUTE FUNCTION public.auto_generate_dates_on_payroll_insert();

-- ===================================
-- INDEXES FOR PERFORMANCE
-- ===================================

-- User lookups
CREATE INDEX idx_users_clerk_id ON public.users(clerk_user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_active ON public.users(is_active) WHERE is_active = true;

-- Payroll lookups
CREATE INDEX idx_payrolls_client ON public.payrolls(client_id);
CREATE INDEX idx_payrolls_current ON public.payrolls(client_id) WHERE superseded_date IS NULL;
CREATE INDEX idx_payrolls_status ON public.payrolls(status);

-- Payroll dates performance
CREATE INDEX idx_payroll_dates_payroll ON public.payroll_dates(payroll_id);
CREATE INDEX idx_payroll_dates_eft ON public.payroll_dates(adjusted_eft_date);
CREATE INDEX idx_payroll_dates_processing ON public.payroll_dates(processing_date);

-- Audit log performance
CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_time ON public.audit_log(created_at);
CREATE INDEX idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_success ON public.audit_log(success) WHERE success = false;

-- ===================================
-- SUMMARY STATISTICS
-- ===================================

/*
TOTAL TABLES: 34 tables across 3 schemas

PUBLIC SCHEMA (29 tables):
- Core: users, clients, payrolls, payroll_dates
- Configuration: payroll_cycles, payroll_date_types, holidays
- RBAC: roles, permissions, role_permissions, user_roles  
- Features: leave, notes, billing_*, adjustment_rules
- Audit: audit_log (simple)
- Results: payroll_*_results (function outputs)

AUDIT SCHEMA (5 tables):  
- audit_log (comprehensive)
- auth_events
- data_access_log
- permission_changes  
- slow_queries

KEY RELATIONSHIPS:
- users.manager_id → users.id (hierarchy)
- payrolls.client_id → clients.id (ownership)
- payrolls.*_user_id → users.id (assignments)
- payroll_dates.payroll_id → payrolls.id (schedules)
- Comprehensive audit trail for compliance

SECURITY FEATURES:
- Row-level security on sensitive tables
- Audit triggers on all modifications  
- Role-based access control (RBAC)
- SOC2 compliant logging
- Encryption functions for sensitive data
*/
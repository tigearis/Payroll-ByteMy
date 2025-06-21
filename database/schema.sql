--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.12 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS users_select_policy ON public.users;
DROP POLICY IF EXISTS payrolls_select_policy ON public.payrolls;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_fkey;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_resource_id_fkey;
ALTER TABLE IF EXISTS ONLY public.permission_overrides DROP CONSTRAINT IF EXISTS permission_overrides_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.permission_overrides DROP CONSTRAINT IF EXISTS permission_overrides_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.permission_audit_log DROP CONSTRAINT IF EXISTS permission_audit_log_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.permission_audit_log DROP CONSTRAINT IF EXISTS permission_audit_log_target_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payrolls DROP CONSTRAINT IF EXISTS payrolls_parent_payroll_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payrolls DROP CONSTRAINT IF EXISTS payrolls_date_type_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payrolls DROP CONSTRAINT IF EXISTS payrolls_cycle_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payrolls DROP CONSTRAINT IF EXISTS payrolls_client_id_fkey;
ALTER TABLE IF EXISTS ONLY public.payroll_dates DROP CONSTRAINT IF EXISTS payroll_dates_payroll_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notes DROP CONSTRAINT IF EXISTS notes_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS manager_id;
ALTER TABLE IF EXISTS ONLY public.work_schedule DROP CONSTRAINT IF EXISTS fk_work_schedule_user;
ALTER TABLE IF EXISTS ONLY public.payrolls DROP CONSTRAINT IF EXISTS fk_primary_consultant_user;
ALTER TABLE IF EXISTS ONLY public.payroll_assignments DROP CONSTRAINT IF EXISTS fk_payroll_assignment_payroll_date;
ALTER TABLE IF EXISTS ONLY public.payroll_assignments DROP CONSTRAINT IF EXISTS fk_payroll_assignment_original_consultant;
ALTER TABLE IF EXISTS ONLY public.payroll_assignments DROP CONSTRAINT IF EXISTS fk_payroll_assignment_consultant;
ALTER TABLE IF EXISTS ONLY public.payroll_assignments DROP CONSTRAINT IF EXISTS fk_payroll_assignment_assigned_by;
ALTER TABLE IF EXISTS ONLY public.payrolls DROP CONSTRAINT IF EXISTS fk_manager_user;
ALTER TABLE IF EXISTS ONLY public.leave DROP CONSTRAINT IF EXISTS fk_leave_user;
ALTER TABLE IF EXISTS ONLY public.payrolls DROP CONSTRAINT IF EXISTS fk_backup_consultant_user;
ALTER TABLE IF EXISTS ONLY public.payroll_assignment_audit DROP CONSTRAINT IF EXISTS fk_audit_to_consultant;
ALTER TABLE IF EXISTS ONLY public.payroll_assignment_audit DROP CONSTRAINT IF EXISTS fk_audit_payroll_date;
ALTER TABLE IF EXISTS ONLY public.payroll_assignment_audit DROP CONSTRAINT IF EXISTS fk_audit_from_consultant;
ALTER TABLE IF EXISTS ONLY public.payroll_assignment_audit DROP CONSTRAINT IF EXISTS fk_audit_changed_by;
ALTER TABLE IF EXISTS ONLY public.payroll_assignment_audit DROP CONSTRAINT IF EXISTS fk_audit_assignment;
ALTER TABLE IF EXISTS ONLY public.client_external_systems DROP CONSTRAINT IF EXISTS client_external_systems_system_id_fkey;
ALTER TABLE IF EXISTS ONLY public.client_external_systems DROP CONSTRAINT IF EXISTS client_external_systems_client_id_fkey;
ALTER TABLE IF EXISTS ONLY public.client_billing_assignment DROP CONSTRAINT IF EXISTS client_billing_assignment_client_id_fkey;
ALTER TABLE IF EXISTS ONLY public.client_billing_assignment DROP CONSTRAINT IF EXISTS client_billing_assignment_billing_plan_id_fkey;
ALTER TABLE IF EXISTS ONLY public.billing_items DROP CONSTRAINT IF EXISTS billing_items_payroll_id_fkey;
ALTER TABLE IF EXISTS ONLY public.billing_items DROP CONSTRAINT IF EXISTS billing_items_invoice_id_fkey;
ALTER TABLE IF EXISTS ONLY public.billing_invoices DROP CONSTRAINT IF EXISTS billing_invoices_client_id_fkey;
ALTER TABLE IF EXISTS ONLY public.billing_invoice_item DROP CONSTRAINT IF EXISTS billing_invoice_item_invoice_id_fkey;
ALTER TABLE IF EXISTS ONLY public.billing_invoice DROP CONSTRAINT IF EXISTS billing_invoice_client_id_fkey;
ALTER TABLE IF EXISTS ONLY public.billing_event_log DROP CONSTRAINT IF EXISTS billing_event_log_invoice_id_fkey;
ALTER TABLE IF EXISTS ONLY public.billing_event_log DROP CONSTRAINT IF EXISTS billing_event_log_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.adjustment_rules DROP CONSTRAINT IF EXISTS adjustment_rules_date_type_id_fkey;
ALTER TABLE IF EXISTS ONLY public.adjustment_rules DROP CONSTRAINT IF EXISTS adjustment_rules_cycle_id_fkey;
DROP TRIGGER IF EXISTS update_user_roles_timestamp ON public.user_roles;
DROP TRIGGER IF EXISTS update_roles_timestamp ON public.roles;
DROP TRIGGER IF EXISTS update_role_permissions_timestamp ON public.role_permissions;
DROP TRIGGER IF EXISTS update_resources_timestamp ON public.resources;
DROP TRIGGER IF EXISTS update_permissions_timestamp ON public.permissions;
DROP TRIGGER IF EXISTS update_permission_overrides_updated_at ON public.permission_overrides;
DROP TRIGGER IF EXISTS update_feature_flags_modtime ON public.feature_flags;
DROP TRIGGER IF EXISTS trigger_prevent_duplicate_insert ON public.work_schedule;
DROP TRIGGER IF EXISTS trigger_auto_regenerate_dates ON public.payrolls;
DROP TRIGGER IF EXISTS trigger_auto_generate_dates ON public.payrolls;
DROP TRIGGER IF EXISTS trigger_auto_delete_future_dates ON public.payrolls;
DROP TRIGGER IF EXISTS trg_invoice_item_total ON public.billing_invoice_item;
DROP TRIGGER IF EXISTS set_timestamp ON public.payroll_assignments;
DROP TRIGGER IF EXISTS enforce_staff_on_payrolls ON public.payrolls;
DROP TRIGGER IF EXISTS check_entity_relation ON public.notes;
DROP TRIGGER IF EXISTS audit_users_changes ON public.users;
DROP TRIGGER IF EXISTS audit_user_roles_changes ON public.user_roles;
DROP TRIGGER IF EXISTS audit_role_permissions_changes ON public.role_permissions;
DROP TRIGGER IF EXISTS audit_payrolls_changes ON public.payrolls;
DROP TRIGGER IF EXISTS audit_clients_changes ON public.clients;
DROP INDEX IF EXISTS public.only_one_current_version_per_family;
DROP INDEX IF EXISTS public.idx_work_schedule_user_id;
DROP INDEX IF EXISTS public.idx_users_role;
DROP INDEX IF EXISTS public.idx_users_is_active;
DROP INDEX IF EXISTS public.idx_users_deactivated_at;
DROP INDEX IF EXISTS public.idx_users_clerk_composite;
DROP INDEX IF EXISTS public.idx_users_active_staff;
DROP INDEX IF EXISTS public.idx_unique_payroll_date;
DROP INDEX IF EXISTS public.idx_permission_overrides_user_id;
DROP INDEX IF EXISTS public.idx_permission_overrides_role;
DROP INDEX IF EXISTS public.idx_permission_overrides_resource;
DROP INDEX IF EXISTS public.idx_permission_overrides_operation;
DROP INDEX IF EXISTS public.idx_permission_overrides_expires_at;
DROP INDEX IF EXISTS public.idx_permission_overrides_created_by;
DROP INDEX IF EXISTS public.idx_permission_audit_log_user_id;
DROP INDEX IF EXISTS public.idx_permission_audit_log_timestamp;
DROP INDEX IF EXISTS public.idx_permission_audit_log_target_user_id;
DROP INDEX IF EXISTS public.idx_permission_audit_log_resource;
DROP INDEX IF EXISTS public.idx_permission_audit_log_action;
DROP INDEX IF EXISTS public.idx_payrolls_versioning;
DROP INDEX IF EXISTS public.idx_payrolls_status_client;
DROP INDEX IF EXISTS public.idx_payrolls_staff_composite;
DROP INDEX IF EXISTS public.idx_payrolls_manager;
DROP INDEX IF EXISTS public.idx_payrolls_go_live_date;
DROP INDEX IF EXISTS public.idx_payrolls_current_version;
DROP INDEX IF EXISTS public.idx_payrolls_consultant;
DROP INDEX IF EXISTS public.idx_payrolls_client_id;
DROP INDEX IF EXISTS public.idx_payrolls_active_dates;
DROP INDEX IF EXISTS public.idx_payroll_dates_processing;
DROP INDEX IF EXISTS public.idx_payroll_dates_payroll_id;
DROP INDEX IF EXISTS public.idx_payroll_dates_notes;
DROP INDEX IF EXISTS public.idx_payroll_dates_date_range;
DROP INDEX IF EXISTS public.idx_payroll_dates_composite;
DROP INDEX IF EXISTS public.idx_payroll_dashboard_stats_status;
DROP INDEX IF EXISTS public.idx_payroll_dashboard_stats_consultants;
DROP INDEX IF EXISTS public.idx_payroll_assignments_payroll_date;
DROP INDEX IF EXISTS public.idx_payroll_assignments_consultant;
DROP INDEX IF EXISTS public.idx_payroll_assignments_assigned_date;
DROP INDEX IF EXISTS public.idx_payroll_assignments_assigned_by;
DROP INDEX IF EXISTS public.idx_notes_user_id;
DROP INDEX IF EXISTS public.idx_notes_important;
DROP INDEX IF EXISTS public.idx_notes_entity;
DROP INDEX IF EXISTS public.idx_notes_created_at;
DROP INDEX IF EXISTS public.idx_leave_user_id;
DROP INDEX IF EXISTS public.idx_leave_dates;
DROP INDEX IF EXISTS public.idx_holidays_date_country_region;
DROP INDEX IF EXISTS public.idx_billing_invoice_client_id;
DROP INDEX IF EXISTS public.idx_audit_payroll_date;
DROP INDEX IF EXISTS public.idx_audit_date;
DROP INDEX IF EXISTS public.idx_audit_changed_by;
DROP INDEX IF EXISTS public.idx_audit_assignment;
DROP INDEX IF EXISTS neon_auth.users_sync_deleted_at_idx;
DROP INDEX IF EXISTS audit.idx_slow_queries_start;
DROP INDEX IF EXISTS audit.idx_slow_queries_duration;
DROP INDEX IF EXISTS audit.idx_permission_changes_time;
DROP INDEX IF EXISTS audit.idx_permission_changes_target_user;
DROP INDEX IF EXISTS audit.idx_permission_changes_changed_by;
DROP INDEX IF EXISTS audit.idx_data_access_user;
DROP INDEX IF EXISTS audit.idx_data_access_time;
DROP INDEX IF EXISTS audit.idx_data_access_resource;
DROP INDEX IF EXISTS audit.idx_data_access_classification;
DROP INDEX IF EXISTS audit.idx_auth_events_user;
DROP INDEX IF EXISTS audit.idx_auth_events_type;
DROP INDEX IF EXISTS audit.idx_auth_events_time;
DROP INDEX IF EXISTS audit.idx_audit_log_user_id;
DROP INDEX IF EXISTS audit.idx_audit_log_session;
DROP INDEX IF EXISTS audit.idx_audit_log_resource;
DROP INDEX IF EXISTS audit.idx_audit_log_event_time;
DROP INDEX IF EXISTS audit.idx_audit_log_action;
ALTER TABLE IF EXISTS ONLY public.work_schedule DROP CONSTRAINT IF EXISTS work_schedule_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_clerk_user_id_key;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_id_key;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_assignments DROP CONSTRAINT IF EXISTS uq_payroll_assignment_payroll_date;
ALTER TABLE IF EXISTS ONLY public.work_schedule DROP CONSTRAINT IF EXISTS unique_user_work_day;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_name_key;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_permission_id_key;
ALTER TABLE IF EXISTS ONLY public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.resources DROP CONSTRAINT IF EXISTS resources_pkey;
ALTER TABLE IF EXISTS ONLY public.resources DROP CONSTRAINT IF EXISTS resources_name_key;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_resource_id_action_key;
ALTER TABLE IF EXISTS ONLY public.permissions DROP CONSTRAINT IF EXISTS permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.permission_overrides DROP CONSTRAINT IF EXISTS permission_overrides_pkey;
ALTER TABLE IF EXISTS ONLY public.permission_audit_log DROP CONSTRAINT IF EXISTS permission_audit_log_pkey;
ALTER TABLE IF EXISTS ONLY public.payrolls DROP CONSTRAINT IF EXISTS payrolls_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_version_results DROP CONSTRAINT IF EXISTS payroll_version_results_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_version_history_results DROP CONSTRAINT IF EXISTS payroll_version_history_results_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_dates DROP CONSTRAINT IF EXISTS payroll_dates_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_date_types DROP CONSTRAINT IF EXISTS payroll_date_types_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_date_types DROP CONSTRAINT IF EXISTS payroll_date_types_name_key;
ALTER TABLE IF EXISTS ONLY public.payroll_cycles DROP CONSTRAINT IF EXISTS payroll_cycles_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_cycles DROP CONSTRAINT IF EXISTS payroll_cycles_name_key;
ALTER TABLE IF EXISTS ONLY public.payroll_assignments DROP CONSTRAINT IF EXISTS payroll_assignments_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_assignment_audit DROP CONSTRAINT IF EXISTS payroll_assignment_audit_pkey;
ALTER TABLE IF EXISTS ONLY public.payroll_activation_results DROP CONSTRAINT IF EXISTS payroll_activation_results_pkey;
ALTER TABLE IF EXISTS ONLY public.notes DROP CONSTRAINT IF EXISTS notes_pkey;
ALTER TABLE IF EXISTS ONLY public.leave DROP CONSTRAINT IF EXISTS leave_pkey;
ALTER TABLE IF EXISTS ONLY public.latest_payroll_version_results DROP CONSTRAINT IF EXISTS latest_payroll_version_results_pkey;
ALTER TABLE IF EXISTS ONLY public.holidays DROP CONSTRAINT IF EXISTS holidays_pkey;
ALTER TABLE IF EXISTS ONLY public.feature_flags DROP CONSTRAINT IF EXISTS feature_flags_pkey;
ALTER TABLE IF EXISTS ONLY public.feature_flags DROP CONSTRAINT IF EXISTS feature_flags_feature_name_key;
ALTER TABLE IF EXISTS ONLY public.external_systems DROP CONSTRAINT IF EXISTS external_systems_pkey;
ALTER TABLE IF EXISTS ONLY public.clients DROP CONSTRAINT IF EXISTS clients_pkey;
ALTER TABLE IF EXISTS ONLY public.client_external_systems DROP CONSTRAINT IF EXISTS client_external_systems_pkey;
ALTER TABLE IF EXISTS ONLY public.client_external_systems DROP CONSTRAINT IF EXISTS client_external_systems_client_id_system_id_key;
ALTER TABLE IF EXISTS ONLY public.client_billing_assignment DROP CONSTRAINT IF EXISTS client_billing_assignment_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_plan DROP CONSTRAINT IF EXISTS billing_plan_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_items DROP CONSTRAINT IF EXISTS billing_items_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_invoices DROP CONSTRAINT IF EXISTS billing_invoices_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_invoices DROP CONSTRAINT IF EXISTS billing_invoices_invoice_number_key;
ALTER TABLE IF EXISTS ONLY public.billing_invoice DROP CONSTRAINT IF EXISTS billing_invoice_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_invoice_item DROP CONSTRAINT IF EXISTS billing_invoice_item_pkey;
ALTER TABLE IF EXISTS ONLY public.billing_event_log DROP CONSTRAINT IF EXISTS billing_event_log_pkey;
ALTER TABLE IF EXISTS ONLY public.app_settings DROP CONSTRAINT IF EXISTS app_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.adjustment_rules DROP CONSTRAINT IF EXISTS adjustment_rules_pkey;
ALTER TABLE IF EXISTS ONLY public.adjustment_rules DROP CONSTRAINT IF EXISTS adjustment_rules_cycle_id_date_type_id_key;
ALTER TABLE IF EXISTS ONLY neon_auth.users_sync DROP CONSTRAINT IF EXISTS users_sync_pkey;
ALTER TABLE IF EXISTS ONLY audit.slow_queries DROP CONSTRAINT IF EXISTS slow_queries_pkey;
ALTER TABLE IF EXISTS ONLY audit.permission_changes DROP CONSTRAINT IF EXISTS permission_changes_pkey;
ALTER TABLE IF EXISTS ONLY audit.data_access_log DROP CONSTRAINT IF EXISTS data_access_log_pkey;
ALTER TABLE IF EXISTS ONLY audit.auth_events DROP CONSTRAINT IF EXISTS auth_events_pkey;
ALTER TABLE IF EXISTS ONLY audit.audit_log DROP CONSTRAINT IF EXISTS audit_log_pkey;
DROP TABLE IF EXISTS public.work_schedule;
DROP TABLE IF EXISTS public.users_role_backup;
DROP TABLE IF EXISTS public.permission_overrides;
DROP TABLE IF EXISTS public.permission_audit_log;
DROP VIEW IF EXISTS public.payroll_triggers_status;
DROP MATERIALIZED VIEW IF EXISTS public.payroll_dashboard_stats;
DROP TABLE IF EXISTS public.payroll_assignments;
DROP TABLE IF EXISTS public.payroll_assignment_audit;
DROP TABLE IF EXISTS public.notes;
DROP TABLE IF EXISTS public.leave;
DROP TABLE IF EXISTS public.holidays;
DROP TABLE IF EXISTS public.feature_flags;
DROP TABLE IF EXISTS public.external_systems;
DROP VIEW IF EXISTS public.current_payrolls;
DROP TABLE IF EXISTS public.payrolls;
DROP TABLE IF EXISTS public.payroll_date_types;
DROP TABLE IF EXISTS public.payroll_cycles;
DROP TABLE IF EXISTS public.clients;
DROP TABLE IF EXISTS public.client_external_systems;
DROP TABLE IF EXISTS public.client_billing_assignment;
DROP TABLE IF EXISTS public.billing_plan;
DROP TABLE IF EXISTS public.billing_items;
DROP TABLE IF EXISTS public.billing_invoices;
DROP TABLE IF EXISTS public.billing_invoice_item;
DROP TABLE IF EXISTS public.billing_invoice;
DROP TABLE IF EXISTS public.billing_event_log;
DROP TABLE IF EXISTS public.app_settings;
DROP TABLE IF EXISTS public.adjustment_rules;
DROP TABLE IF EXISTS neon_auth.users_sync;
DROP VIEW IF EXISTS audit.user_access_summary;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS audit.slow_queries;
DROP VIEW IF EXISTS audit.permission_usage_report;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.role_permissions;
DROP TABLE IF EXISTS public.resources;
DROP TABLE IF EXISTS public.permissions;
DROP TABLE IF EXISTS audit.permission_changes;
DROP TABLE IF EXISTS audit.data_access_log;
DROP TABLE IF EXISTS audit.auth_events;
DROP TABLE IF EXISTS audit.audit_log;
DROP FUNCTION IF EXISTS public.user_can_perform_action(p_user_id uuid, p_resource text, p_action text);
DROP FUNCTION IF EXISTS public.update_timestamp();
DROP FUNCTION IF EXISTS public.update_payroll_dates();
DROP FUNCTION IF EXISTS public.update_modified_column();
DROP FUNCTION IF EXISTS public.update_invoice_total();
DROP FUNCTION IF EXISTS public.trigger_set_timestamp();
DROP FUNCTION IF EXISTS public.subtract_business_days(p_date date, p_days integer);
DROP FUNCTION IF EXISTS public.regenerate_all_payroll_dates(p_start_date date, p_end_date date, p_max_dates_per_payroll integer, p_delete_existing boolean);
DROP FUNCTION IF EXISTS public.prevent_duplicate_workday_insert();
DROP FUNCTION IF EXISTS public.is_business_day(p_date date);
DROP FUNCTION IF EXISTS public.get_user_effective_permissions(p_user_id uuid);
DROP FUNCTION IF EXISTS public.get_payroll_version_history(p_payroll_id uuid);
DROP TABLE IF EXISTS public.payroll_version_history_results;
DROP FUNCTION IF EXISTS public.get_latest_payroll_version(p_payroll_id uuid);
DROP TABLE IF EXISTS public.latest_payroll_version_results;
DROP FUNCTION IF EXISTS public.get_hasura_claims(user_clerk_id text);
DROP FUNCTION IF EXISTS public.generate_payroll_dates(p_payroll_id uuid, p_start_date date, p_end_date date, p_max_dates integer);
DROP TABLE IF EXISTS public.payroll_dates;
DROP FUNCTION IF EXISTS public.enforce_staff_roles();
DROP FUNCTION IF EXISTS public.enforce_entity_relation();
DROP FUNCTION IF EXISTS public.encrypt_sensitive(data text);
DROP FUNCTION IF EXISTS public.decrypt_sensitive(encrypted_data text);
DROP FUNCTION IF EXISTS public.create_payroll_version(p_original_payroll_id uuid, p_go_live_date date, p_version_reason text, p_created_by_user_id uuid, p_new_name text, p_new_client_id uuid, p_new_cycle_id uuid, p_new_date_type_id uuid, p_new_date_value integer, p_new_primary_consultant_user_id uuid, p_new_backup_consultant_user_id uuid, p_new_manager_user_id uuid);
DROP TABLE IF EXISTS public.payroll_version_results;
DROP FUNCTION IF EXISTS public.auto_regenerate_dates_on_schedule_change();
DROP FUNCTION IF EXISTS public.auto_generate_dates_on_payroll_insert();
DROP FUNCTION IF EXISTS public.auto_delete_future_dates_on_supersede();
DROP FUNCTION IF EXISTS public.adjust_for_non_business_day(p_date date, p_regions text[], p_rule_code text);
DROP FUNCTION IF EXISTS public.adjust_for_non_business_day(p_date date, p_rule_code text);
DROP FUNCTION IF EXISTS public.adjust_date_with_reason(p_date date, p_rule_code text);
DROP FUNCTION IF EXISTS public.activate_payroll_versions();
DROP TABLE IF EXISTS public.payroll_activation_results;
DROP FUNCTION IF EXISTS audit.log_changes();
DROP FUNCTION IF EXISTS audit.archive_old_logs();
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.status;
DROP TYPE IF EXISTS public.permission_action;
DROP TYPE IF EXISTS public.payroll_version_reason;
DROP TYPE IF EXISTS public.payroll_status_new;
DROP TYPE IF EXISTS public.payroll_status;
DROP TYPE IF EXISTS public.payroll_dates_result;
DROP TYPE IF EXISTS public.payroll_date_type;
DROP TYPE IF EXISTS public.payroll_date_result;
DROP TYPE IF EXISTS public.payroll_cycle_type;
DROP TYPE IF EXISTS public.leave_status_enum;
DROP EXTENSION IF EXISTS pgcrypto;
-- *not* dropping schema, since initdb creates it
DROP SCHEMA IF EXISTS neon_auth;
DROP SCHEMA IF EXISTS audit;
--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA audit;


--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: leave_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.leave_status_enum AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);


--
-- Name: payroll_cycle_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_cycle_type AS ENUM (
    'weekly',
    'fortnightly',
    'bi_monthly',
    'monthly',
    'quarterly'
);


--
-- Name: payroll_date_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_date_result AS (
	success boolean,
	message text
);


--
-- Name: payroll_date_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_date_type AS ENUM (
    'fixed_date',
    'eom',
    'som',
    'week_a',
    'week_b',
    'dow'
);


--
-- Name: payroll_dates_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_dates_result AS (
	payroll_id uuid,
	original_eft_date date,
	adjusted_eft_date date,
	processing_date date,
	success boolean,
	message text
);


--
-- Name: payroll_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_status AS ENUM (
    'Active',
    'Implementation',
    'Inactive'
);


--
-- Name: payroll_status_new; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_status_new AS ENUM (
    'live',
    'inactive',
    'onboarding',
    'possible',
    'implementation'
);


--
-- Name: payroll_version_reason; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_version_reason AS ENUM (
    'initial_creation',
    'schedule_change',
    'consultant_change',
    'client_change',
    'correction',
    'annual_review'
);


--
-- Name: permission_action; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.permission_action AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'list',
    'manage',
    'approve',
    'reject'
);


--
-- Name: status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status AS ENUM (
    'active',
    'inactive',
    'archived'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'developer',
    'org_admin',
    'manager',
    'consultant',
    'viewer'
);


--
-- Name: archive_old_logs(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.archive_old_logs() RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- Name: log_changes(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.log_changes() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: payroll_activation_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_activation_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    action_taken text NOT NULL,
    version_number integer NOT NULL,
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: activate_payroll_versions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.activate_payroll_versions() RETURNS SETOF public.payroll_activation_results
    LANGUAGE plpgsql
    AS $$ DECLARE activated_count integer := 0; BEGIN DELETE FROM payroll_activation_results WHERE created_at < NOW() - INTERVAL '1 hour'; UPDATE payrolls SET status = 'Active' WHERE go_live_date <= CURRENT_DATE AND superseded_date IS NULL AND status != 'Active'; GET DIAGNOSTICS activated_count = ROW_COUNT; UPDATE payrolls SET status = 'Inactive' WHERE superseded_date IS NOT NULL AND superseded_date <= CURRENT_DATE AND status = 'Active'; INSERT INTO payroll_activation_results (activated_count, message) VALUES (activated_count, CASE WHEN activated_count > 0 THEN 'Activated ' || activated_count || ' payroll versions' ELSE 'No payroll versions needed activation' END); RETURN QUERY SELECT * FROM payroll_activation_results; END; $$;


--
-- Name: adjust_date_with_reason(date, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.adjust_date_with_reason(p_date date, p_rule_code text DEFAULT 'previous'::text) RETURNS TABLE(adjusted_date date, adjustment_reason text)
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_adjusted_date DATE := p_date;
  v_is_business_day BOOLEAN;
  v_holiday_name TEXT;
  v_is_weekend BOOLEAN;
  v_day_of_week INTEGER;
  v_reason TEXT := '';
BEGIN
  -- Check if date is a business day
  v_is_business_day := is_business_day(v_adjusted_date);
  
  -- If date is already a business day, return it with no reason
  IF v_is_business_day THEN
    RETURN QUERY SELECT v_adjusted_date, ''::text;
    RETURN;
  END IF;
  
  -- Determine why it's not a business day
  v_day_of_week := EXTRACT(DOW FROM p_date);
  v_is_weekend := v_day_of_week IN (0, 6); -- Sunday = 0, Saturday = 6
  
  -- Check for holiday
  SELECT h.name INTO v_holiday_name
  FROM holidays h 
  WHERE h.date = p_date 
  AND (h.country_code = 'AU' OR h.country_code IS NULL)
  LIMIT 1;
  
  -- Build reason string
  IF v_holiday_name IS NOT NULL THEN
    v_reason := 'Adjusted from ' || v_holiday_name || ' (' || TO_CHAR(p_date, 'Day DD Mon YYYY') || ')';
  ELSIF v_is_weekend THEN
    IF v_day_of_week = 0 THEN
      v_reason := 'Adjusted from Sunday (' || TO_CHAR(p_date, 'DD Mon YYYY') || ')';
    ELSE
      v_reason := 'Adjusted from Saturday (' || TO_CHAR(p_date, 'DD Mon YYYY') || ')';
    END IF;
  ELSE
    v_reason := 'Adjusted from non-business day (' || TO_CHAR(p_date, 'Day DD Mon YYYY') || ')';
  END IF;
  
  -- Apply adjustment rule
  CASE p_rule_code
    -- Previous business day
    WHEN 'previous' THEN
      WHILE NOT is_business_day(v_adjusted_date) LOOP
        v_adjusted_date := v_adjusted_date - INTERVAL '1 day';
      END LOOP;
      v_reason := v_reason || ' to previous business day (' || TO_CHAR(v_adjusted_date, 'Day DD Mon YYYY') || ')';
    
    -- Next business day
    WHEN 'next' THEN
      WHILE NOT is_business_day(v_adjusted_date) LOOP
        v_adjusted_date := v_adjusted_date + INTERVAL '1 day';
      END LOOP;
      v_reason := v_reason || ' to next business day (' || TO_CHAR(v_adjusted_date, 'Day DD Mon YYYY') || ')';
    
    -- Nearest business day
    WHEN 'nearest' THEN
      DECLARE
        v_prev_date DATE := v_adjusted_date;
        v_next_date DATE := v_adjusted_date;
        v_prev_days INTEGER := 0;
        v_next_days INTEGER := 0;
      BEGIN
        -- Find previous business day
        WHILE NOT is_business_day(v_prev_date) LOOP
          v_prev_date := v_prev_date - INTERVAL '1 day';
          v_prev_days := v_prev_days + 1;
        END LOOP;
        
        -- Find next business day
        WHILE NOT is_business_day(v_next_date) LOOP
          v_next_date := v_next_date + INTERVAL '1 day';
          v_next_days := v_next_days + 1;
        END LOOP;
        
        -- Choose nearest
        IF v_prev_days <= v_next_days THEN
          v_adjusted_date := v_prev_date;
          v_reason := v_reason || ' to nearest business day (' || TO_CHAR(v_adjusted_date, 'Day DD Mon YYYY') || ')';
        ELSE
          v_adjusted_date := v_next_date;
          v_reason := v_reason || ' to nearest business day (' || TO_CHAR(v_adjusted_date, 'Day DD Mon YYYY') || ')';
        END IF;
      END;
    
    -- Default to previous business day
    ELSE
      WHILE NOT is_business_day(v_adjusted_date) LOOP
        v_adjusted_date := v_adjusted_date - INTERVAL '1 day';
      END LOOP;
      v_reason := v_reason || ' to previous business day (' || TO_CHAR(v_adjusted_date, 'Day DD Mon YYYY') || ')';
  END CASE;
  
  RETURN QUERY SELECT v_adjusted_date, v_reason;
END;
$$;


--
-- Name: adjust_for_non_business_day(date, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.adjust_for_non_business_day(p_date date, p_rule_code text DEFAULT 'previous'::text) RETURNS date
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_adjusted_date DATE := p_date;
  v_is_business_day BOOLEAN;
BEGIN
  -- Check if date is a business day
  v_is_business_day := is_business_day(v_adjusted_date);
  
  -- If date is already a business day, return it
  IF v_is_business_day THEN
    RETURN v_adjusted_date;
  END IF;
  
  -- Apply adjustment rule
  CASE p_rule_code
    -- Previous business day
    WHEN 'previous' THEN
      WHILE NOT is_business_day(v_adjusted_date) LOOP
        v_adjusted_date := v_adjusted_date - INTERVAL '1 day';
      END LOOP;
    
    -- Next business day
    WHEN 'next' THEN
      WHILE NOT is_business_day(v_adjusted_date) LOOP
        v_adjusted_date := v_adjusted_date + INTERVAL '1 day';
      END LOOP;
    
    -- Nearest business day
    WHEN 'nearest' THEN
      DECLARE
        v_prev_date DATE := v_adjusted_date;
        v_next_date DATE := v_adjusted_date;
        v_prev_days INTEGER := 0;
        v_next_days INTEGER := 0;
      BEGIN
        -- Find previous business day
        WHILE NOT is_business_day(v_prev_date) LOOP
          v_prev_date := v_prev_date - INTERVAL '1 day';
          v_prev_days := v_prev_days + 1;
        END LOOP;
        
        -- Find next business day
        WHILE NOT is_business_day(v_next_date) LOOP
          v_next_date := v_next_date + INTERVAL '1 day';
          v_next_days := v_next_days + 1;
        END LOOP;
        
        -- Choose nearest
        IF v_prev_days <= v_next_days THEN
          v_adjusted_date := v_prev_date;
        ELSE
          v_adjusted_date := v_next_date;
        END IF;
      END;
    
    -- Default to previous business day
    ELSE
      WHILE NOT is_business_day(v_adjusted_date) LOOP
        v_adjusted_date := v_adjusted_date - INTERVAL '1 day';
      END LOOP;
  END CASE;
  
  RETURN v_adjusted_date;
END;
$$;


--
-- Name: adjust_for_non_business_day(date, text[], text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.adjust_for_non_business_day(p_date date, p_regions text[], p_rule_code text DEFAULT 'previous'::text) RETURNS date
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_adjusted_date DATE := p_date;
  v_is_business_day BOOLEAN;
BEGIN
  -- Check if date is a business day
  v_is_business_day := is_business_day_region(v_adjusted_date, p_regions);

  -- If date is already a business day, return it
  IF v_is_business_day THEN
    RETURN v_adjusted_date;
  END IF;

  -- Apply adjustment rule
  CASE p_rule_code
    WHEN 'previous' THEN
      WHILE NOT is_business_day_region(v_adjusted_date, p_regions) LOOP
        v_adjusted_date := v_adjusted_date - INTERVAL '1 day';
      END LOOP;

    WHEN 'next' THEN
      WHILE NOT is_business_day_region(v_adjusted_date, p_regions) LOOP
        v_adjusted_date := v_adjusted_date + INTERVAL '1 day';
      END LOOP;

    WHEN 'nearest' THEN
      DECLARE
        v_prev_date DATE := v_adjusted_date;
        v_next_date DATE := v_adjusted_date;
        v_prev_days INTEGER := 0;
        v_next_days INTEGER := 0;
      BEGIN
        -- Previous business day
        WHILE NOT is_business_day_region(v_prev_date, p_regions) LOOP
          v_prev_date := v_prev_date - INTERVAL '1 day';
          v_prev_days := v_prev_days + 1;
        END LOOP;

        -- Next business day
        WHILE NOT is_business_day_region(v_next_date, p_regions) LOOP
          v_next_date := v_next_date + INTERVAL '1 day';
          v_next_days := v_next_days + 1;
        END LOOP;

        -- Pick nearest
        IF v_prev_days <= v_next_days THEN
          v_adjusted_date := v_prev_date;
        ELSE
          v_adjusted_date := v_next_date;
        END IF;
      END;

    ELSE -- default: previous business day
      WHILE NOT is_business_day_region(v_adjusted_date, p_regions) LOOP
        v_adjusted_date := v_adjusted_date - INTERVAL '1 day';
      END LOOP;
  END CASE;

  RETURN v_adjusted_date;
END;
$$;


--
-- Name: auto_delete_future_dates_on_supersede(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_delete_future_dates_on_supersede() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Only run if superseded_date was just set (changed from NULL to a date)
  IF OLD.superseded_date IS NULL AND NEW.superseded_date IS NOT NULL THEN
    -- Delete all payroll dates from the superseded date forward
    DELETE FROM payroll_dates 
    WHERE payroll_id = NEW.id 
      AND adjusted_eft_date >= NEW.superseded_date;
    
    RAISE NOTICE 'Auto-deleted future payroll dates for payroll % from date %', 
      NEW.id, NEW.superseded_date;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: auto_generate_dates_on_payroll_insert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_generate_dates_on_payroll_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  start_date date;
  end_date date;
  generated_count int;
BEGIN
  -- Only generate dates for new payrolls that have:
  -- 1. A go_live_date set
  -- 2. Required schedule configuration (cycle_id, etc.)
  -- 3. No superseded_date (current version)
  IF NEW.go_live_date IS NOT NULL 
     AND NEW.cycle_id IS NOT NULL 
     AND NEW.superseded_date IS NULL THEN
    
    -- Set start date to go_live_date
    start_date := NEW.go_live_date;
    
    -- Set end date to 2 years from go_live_date
    end_date := NEW.go_live_date + INTERVAL '2 years';
    
    -- Call the existing generate_payroll_dates function
    SELECT COUNT(*) INTO generated_count
    FROM generate_payroll_dates(
      p_payroll_id := NEW.id,
      p_start_date := start_date,
      p_end_date := end_date
    );
    
    RAISE NOTICE 'Auto-generated % payroll dates for new payroll % (% to %)', 
      generated_count, NEW.id, start_date, end_date;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: auto_regenerate_dates_on_schedule_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_regenerate_dates_on_schedule_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  schedule_changed boolean := false;
  generated_count int;
BEGIN
  -- Only process current payrolls (not superseded) and not during versioning
  IF NEW.superseded_date IS NULL AND OLD.superseded_date IS NULL THEN
    -- Check if any schedule-related fields changed
    IF OLD.cycle_id IS DISTINCT FROM NEW.cycle_id 
       OR OLD.date_type_id IS DISTINCT FROM NEW.date_type_id
       OR OLD.date_value IS DISTINCT FROM NEW.date_value THEN
      
      schedule_changed := true;
      
      -- Delete existing future dates
      DELETE FROM payroll_dates 
      WHERE payroll_id = NEW.id 
        AND adjusted_eft_date >= CURRENT_DATE;
      
      -- Regenerate dates from today for 2 years
      SELECT COUNT(*) INTO generated_count
      FROM generate_payroll_dates(
        p_payroll_id := NEW.id,
        p_start_date := CURRENT_DATE,
        p_end_date := CURRENT_DATE + INTERVAL '2 years'
      );
      
      RAISE NOTICE 'Auto-regenerated % payroll dates for payroll % due to schedule change', 
        generated_count, NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: payroll_version_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_version_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    new_payroll_id uuid NOT NULL,
    new_version_number integer NOT NULL,
    old_payroll_id uuid NOT NULL,
    dates_deleted integer NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by_user_id uuid
);


--
-- Name: create_payroll_version(uuid, date, text, uuid, text, uuid, uuid, uuid, integer, uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_payroll_version(p_original_payroll_id uuid, p_go_live_date date, p_version_reason text DEFAULT 'schedule_change'::text, p_created_by_user_id uuid DEFAULT NULL::uuid, p_new_name text DEFAULT NULL::text, p_new_client_id uuid DEFAULT NULL::uuid, p_new_cycle_id uuid DEFAULT NULL::uuid, p_new_date_type_id uuid DEFAULT NULL::uuid, p_new_date_value integer DEFAULT NULL::integer, p_new_primary_consultant_user_id uuid DEFAULT NULL::uuid, p_new_backup_consultant_user_id uuid DEFAULT NULL::uuid, p_new_manager_user_id uuid DEFAULT NULL::uuid) RETURNS SETOF public.payroll_version_results
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_original_payroll RECORD;
    v_new_payroll_id uuid;
    v_new_version_number integer;
    v_parent_id uuid;
    v_dates_deleted integer;
    v_result_id uuid;
BEGIN
    -- Get the original payroll details
    SELECT * INTO v_original_payroll
    FROM public.payrolls
    WHERE id = p_original_payroll_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payroll not found: %', p_original_payroll_id;
    END IF;

    -- Determine parent ID and version number
    v_parent_id := COALESCE(v_original_payroll.parent_payroll_id, p_original_payroll_id);

    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO v_new_version_number
    FROM public.payrolls
    WHERE id = v_parent_id OR parent_payroll_id = v_parent_id;

    -- Generate new UUID for the new version
    v_new_payroll_id := gen_random_uuid();

    -- CRITICAL: Mark original payroll as superseded BEFORE creating new version
    -- This ensures the unique constraint is satisfied
    UPDATE public.payrolls
    SET superseded_date = p_go_live_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_original_payroll_id;

    -- Create the new payroll version (set status to Active)
    INSERT INTO public.payrolls (
        id,
        name,
        client_id,
        cycle_id,
        date_type_id,
        date_value,
        primary_consultant_user_id,
        backup_consultant_user_id,
        manager_user_id,
        processing_days_before_eft,
        status,
        payroll_system,
        processing_time,
        employee_count,
        version_number,
        parent_payroll_id,
        go_live_date,
        version_reason,
        created_by_user_id,
        created_at,
        updated_at,
        superseded_date -- NULL by default, making this the current version
    ) VALUES (
        v_new_payroll_id,
        COALESCE(p_new_name, v_original_payroll.name),
        COALESCE(p_new_client_id, v_original_payroll.client_id),
        COALESCE(p_new_cycle_id, v_original_payroll.cycle_id),
        COALESCE(p_new_date_type_id, v_original_payroll.date_type_id),
        COALESCE(p_new_date_value, v_original_payroll.date_value),
        COALESCE(p_new_primary_consultant_user_id, v_original_payroll.primary_consultant_user_id),
        COALESCE(p_new_backup_consultant_user_id, v_original_payroll.backup_consultant_user_id),
        COALESCE(p_new_manager_user_id, v_original_payroll.manager_user_id),
        v_original_payroll.processing_days_before_eft,
        'Active'::public.payroll_status,
        v_original_payroll.payroll_system,
        v_original_payroll.processing_time,
        v_original_payroll.employee_count,
        v_new_version_number,
        v_parent_id,
        p_go_live_date,
        p_version_reason,
        p_created_by_user_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        NULL -- Current version
    );

    -- Delete future payroll dates from the original payroll (from go-live date forward)
    DELETE FROM public.payroll_dates
    WHERE payroll_id = p_original_payroll_id
    AND original_eft_date >= p_go_live_date;

    GET DIAGNOSTICS v_dates_deleted = ROW_COUNT;

    -- Insert the result into the results table
    v_result_id := gen_random_uuid();
    INSERT INTO public.payroll_version_results (
        id,
        new_payroll_id,
        new_version_number,
        old_payroll_id,
        dates_deleted,
        message,
        created_by_user_id
    ) VALUES (
        v_result_id,
        v_new_payroll_id,
        v_new_version_number,
        p_original_payroll_id,
        v_dates_deleted,
        format('Created version %s of payroll with go-live date %s', v_new_version_number, p_go_live_date),
        p_created_by_user_id
    );

    -- Return the result
    RETURN QUERY
    SELECT * FROM public.payroll_version_results
    WHERE id = v_result_id;
END;
$$;


--
-- Name: decrypt_sensitive(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.decrypt_sensitive(encrypted_data text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;


--
-- Name: encrypt_sensitive(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.encrypt_sensitive(data text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;


--
-- Name: enforce_entity_relation(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.enforce_entity_relation() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.entity_type = 'payroll' AND NOT EXISTS (
    SELECT 1 FROM payrolls WHERE id = NEW.entity_id
  ) THEN
    RAISE EXCEPTION 'Invalid entity_id: No matching payroll found';
  ELSIF NEW.entity_type = 'client' AND NOT EXISTS (
    SELECT 1 FROM clients WHERE id = NEW.entity_id
  ) THEN
    RAISE EXCEPTION 'Invalid entity_id: No matching client found';
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: enforce_staff_roles(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.enforce_staff_roles() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure primary consultant is staff
    IF NEW.primary_consultant_user_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM users WHERE id = NEW.primary_consultant_user_id AND is_staff = TRUE
        ) THEN
            RAISE EXCEPTION 'Primary consultant must be a staff member';
        END IF;
    END IF;

    -- Ensure backup consultant is staff
    IF NEW.backup_consultant_user_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM users WHERE id = NEW.backup_consultant_user_id AND is_staff = TRUE
        ) THEN
            RAISE EXCEPTION 'Backup consultant must be a staff member';
        END IF;
    END IF;

    -- Ensure manager is staff
    IF NEW.manager_user_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM users WHERE id = NEW.manager_user_id AND is_staff = TRUE
        ) THEN
            RAISE EXCEPTION 'Manager must be a staff member';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


--
-- Name: payroll_dates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_dates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    original_eft_date date NOT NULL,
    adjusted_eft_date date NOT NULL,
    processing_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_payroll_dates_order CHECK ((adjusted_eft_date >= processing_date))
);


--
-- Name: COLUMN payroll_dates.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.id IS 'Unique identifier for the payroll date';


--
-- Name: COLUMN payroll_dates.payroll_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.payroll_id IS 'Reference to the payroll this date belongs to';


--
-- Name: COLUMN payroll_dates.original_eft_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.original_eft_date IS 'Originally calculated EFT date before adjustments';


--
-- Name: COLUMN payroll_dates.adjusted_eft_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.adjusted_eft_date IS 'Final EFT date after holiday and weekend adjustments';


--
-- Name: COLUMN payroll_dates.processing_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.processing_date IS 'Date when payroll processing must be completed';


--
-- Name: COLUMN payroll_dates.notes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.notes IS 'Additional notes about this payroll date';


--
-- Name: COLUMN payroll_dates.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.created_at IS 'Timestamp when the date record was created';


--
-- Name: COLUMN payroll_dates.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.updated_at IS 'Timestamp when the date record was last updated';


--
-- Name: generate_payroll_dates(uuid, date, date, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_payroll_dates(p_payroll_id uuid, p_start_date date DEFAULT NULL::date, p_end_date date DEFAULT NULL::date, p_max_dates integer DEFAULT 52) RETURNS SETOF public.payroll_dates
    LANGUAGE plpgsql
    AS $$
DECLARE
  -- Payroll configuration variables
  v_cycle_name text;
  v_date_type_name text;
  v_date_value integer;
  v_processing_days_before_eft integer;
  v_rule_code text;

  -- Date calculation variables
  v_current_date date := COALESCE(p_start_date, CURRENT_DATE);
  v_end_calculation_date date := COALESCE(p_end_date, v_current_date + INTERVAL '1 year');
  v_original_eft_date date;
  v_adjusted_eft_date date;
  v_processing_date date;
  v_adjustment_reason text;

  -- Tracking variables
  v_dates_generated integer := 0;
  v_month integer;
  v_year integer;
  v_week_of_year integer;
  v_is_week_a boolean;
  v_mid_month_date date;
  v_end_month_date date;
  v_target_weekday integer;
  v_current_weekday integer;

  -- Return variable for Hasura compatibility
  r public.payroll_dates%ROWTYPE;
BEGIN
  -- Retrieve payroll configuration
  SELECT
    pc.name,
    pdt.name,
    p.date_value,
    p.processing_days_before_eft,
    COALESCE(ar.rule_code, 'previous')
  INTO
    v_cycle_name,
    v_date_type_name,
    v_date_value,
    v_processing_days_before_eft,
    v_rule_code
  FROM
    payrolls p
    JOIN payroll_cycles pc ON p.cycle_id = pc.id
    JOIN payroll_date_types pdt ON p.date_type_id = pdt.id
    LEFT JOIN adjustment_rules ar ON p.cycle_id = ar.cycle_id
      AND p.date_type_id = ar.date_type_id
  WHERE
    p.id = p_payroll_id;

  -- Validate payroll configuration
  IF v_cycle_name IS NULL THEN
    RAISE EXCEPTION 'Payroll configuration not found for ID: %', p_payroll_id;
  END IF;

  -- Main date generation loop
  WHILE v_current_date <= v_end_calculation_date
    AND v_dates_generated < p_max_dates
  LOOP
    -- Reset variables for each iteration
    v_original_eft_date := NULL;
    v_adjusted_eft_date := NULL;
    v_processing_date := NULL;
    v_adjustment_reason := '';

    -- Cycle type specific date calculations
    CASE v_cycle_name
      WHEN 'weekly' THEN
        -- Always schedule next target weekday
        v_target_weekday := v_date_value; -- 0=Sunday ... 6=Saturday
        v_current_weekday := EXTRACT(DOW FROM v_current_date);

        IF v_current_weekday = v_target_weekday THEN
          v_original_eft_date := v_current_date;
        ELSE
          v_original_eft_date := v_current_date + ((7 + v_target_weekday - v_current_weekday) % 7) * INTERVAL '1 day';
        END IF;

      WHEN 'fortnightly' THEN
        -- Determine Week A or Week B
        v_week_of_year := EXTRACT(WEEK FROM v_current_date);
        v_is_week_a := (v_week_of_year % 2) = 1;

        -- Find next target weekday
        v_original_eft_date := v_current_date + ((7 + v_date_value - EXTRACT(DOW FROM v_current_date)) % 7) * INTERVAL '1 day';

        -- For Week B, shift forward by a week
        IF NOT v_is_week_a THEN
          v_original_eft_date := v_original_eft_date + INTERVAL '7 days';
        END IF;

      WHEN 'bi_monthly' THEN
        v_month := EXTRACT(MONTH FROM v_current_date);
        v_year := EXTRACT(YEAR FROM v_current_date);

        IF v_month = 2 THEN
          v_mid_month_date := MAKE_DATE(v_year, 2, 14);
          v_end_month_date := MAKE_DATE(v_year, 2, 28);
        ELSE
          v_mid_month_date := MAKE_DATE(v_year, v_month, 15);
          v_end_month_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::date;
        END IF;

        IF v_date_type_name = 'som' THEN
          v_original_eft_date := v_mid_month_date;
        ELSE
          v_original_eft_date := v_end_month_date;
        END IF;

      WHEN 'monthly' THEN
        CASE v_date_type_name
          WHEN 'som' THEN
            v_original_eft_date := DATE_TRUNC('MONTH', v_current_date)::date;
          WHEN 'eom' THEN
            v_original_eft_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::date;
          WHEN 'fixed_date' THEN
            IF v_date_value IS NULL THEN
              v_original_eft_date := MAKE_DATE(EXTRACT(YEAR FROM v_current_date)::int, EXTRACT(MONTH FROM v_current_date)::int, 15);
            ELSE
              BEGIN
                v_original_eft_date := MAKE_DATE(EXTRACT(YEAR FROM v_current_date)::int, EXTRACT(MONTH FROM v_current_date)::int, v_date_value);
              EXCEPTION WHEN OTHERS THEN
                v_original_eft_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::date;
              END;
            END IF;
        END CASE;

      WHEN 'quarterly' THEN
        v_month := EXTRACT(MONTH FROM v_current_date);

        IF v_month IN (3, 6, 9, 12) THEN
          CASE v_date_type_name
            WHEN 'som' THEN
              v_original_eft_date := DATE_TRUNC('MONTH', v_current_date)::date;
            WHEN 'eom' THEN
              v_original_eft_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::date;
            WHEN 'fixed_date' THEN
              BEGIN
                v_original_eft_date := MAKE_DATE(EXTRACT(YEAR FROM v_current_date)::int, EXTRACT(MONTH FROM v_current_date)::int, COALESCE(v_date_value, 1));
              EXCEPTION WHEN OTHERS THEN
                v_original_eft_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::date;
              END;
            ELSE
              v_original_eft_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::date;
          END CASE;
        ELSE
          -- Skip to next valid quarter month
          v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
          CONTINUE;
        END IF;

      ELSE
        RAISE EXCEPTION 'Unsupported payroll cycle type: %', v_cycle_name;
    END CASE;

    -- Get adjusted date and detailed reason using helper function
    SELECT
      ard.adjusted_date,
      ard.adjustment_reason
    INTO
      v_adjusted_eft_date,
      v_adjustment_reason
    FROM
      public.adjust_date_with_reason(
        v_original_eft_date,
        COALESCE(v_rule_code, 'previous')
      ) ard;

    -- Calculate processing date by subtracting business days
    v_processing_date := subtract_business_days(
      v_adjusted_eft_date,
      v_processing_days_before_eft
    );

    -- Insert generated payroll date with enhanced notes
    INSERT INTO payroll_dates (
      payroll_id,
      original_eft_date,
      adjusted_eft_date,
      processing_date,
      created_at,
      updated_at,
      notes
    )
    VALUES (
      p_payroll_id,
      v_original_eft_date,
      v_adjusted_eft_date,
      v_processing_date,
      NOW(),
      NOW(),
      CASE
        WHEN v_original_eft_date != v_adjusted_eft_date THEN v_adjustment_reason
        ELSE NULL
      END
    )
    RETURNING * INTO r;

    -- Return the inserted record for Hasura
    RETURN NEXT r;

    -- Increment tracking variables
    v_dates_generated := v_dates_generated + 1;

    -- Move to next calculation period
    CASE v_cycle_name
      WHEN 'weekly' THEN
        v_current_date := v_original_eft_date + INTERVAL '7 days';
      WHEN 'fortnightly' THEN
        v_current_date := v_original_eft_date + INTERVAL '14 days';
      WHEN 'bi_monthly' THEN
        v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
      WHEN 'monthly' THEN
        v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
      WHEN 'quarterly' THEN
        v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '3 months';
      ELSE
        v_current_date := v_current_date + INTERVAL '1 month';
    END CASE;
  END LOOP;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in generate_payroll_dates: %', SQLERRM;
    RAISE;
END;
$$;


--
-- Name: get_hasura_claims(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_hasura_claims(user_clerk_id text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;


--
-- Name: latest_payroll_version_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.latest_payroll_version_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    version_number integer NOT NULL,
    go_live_date date,
    active boolean NOT NULL,
    queried_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: get_latest_payroll_version(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_latest_payroll_version(p_payroll_id uuid) RETURNS SETOF public.latest_payroll_version_results
    LANGUAGE plpgsql
    AS $$ BEGIN DELETE FROM latest_payroll_version_results WHERE created_at < NOW() - INTERVAL '1 hour'; INSERT INTO latest_payroll_version_results (id, name, version_number, go_live_date, active) SELECT p.id, p.name, p.version_number, p.go_live_date, CASE WHEN p.status = 'Active' THEN true ELSE false END as active FROM payrolls p WHERE (p.id = p_payroll_id OR p.parent_payroll_id = p_payroll_id) AND p.status = 'Active' AND p.superseded_date IS NULL ORDER BY p.version_number DESC LIMIT 1; RETURN QUERY SELECT * FROM latest_payroll_version_results ORDER BY version_number DESC; END; $$;


--
-- Name: payroll_version_history_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_version_history_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    version_number integer NOT NULL,
    go_live_date date,
    superseded_date date,
    version_reason text,
    active boolean NOT NULL,
    is_current boolean NOT NULL,
    queried_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: get_payroll_version_history(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_payroll_version_history(p_payroll_id uuid) RETURNS SETOF public.payroll_version_history_results
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Clean up old results (older than 1 hour)
  DELETE FROM payroll_version_history_results WHERE queried_at < NOW() - INTERVAL '1 hour';
  
  -- Insert fresh version history data
  INSERT INTO payroll_version_history_results (
    payroll_id, name, version_number, go_live_date, superseded_date, 
    version_reason, active, is_current
  )
  SELECT 
    p.id,
    p.name,
    p.version_number,
    p.go_live_date,
    p.superseded_date,
    p.version_reason,
    CASE WHEN p.status = 'Active' THEN true ELSE false END as active,
    CASE WHEN p.superseded_date IS NULL AND p.status = 'Active' THEN true ELSE false END as is_current
  FROM payrolls p 
  WHERE p.id = p_payroll_id OR p.parent_payroll_id = p_payroll_id
  ORDER BY p.version_number ASC;
  
  -- Return the results
  RETURN QUERY 
  SELECT * FROM payroll_version_history_results 
  WHERE payroll_id IN (
    SELECT DISTINCT p.id 
    FROM payrolls p 
    WHERE p.id = p_payroll_id OR p.parent_payroll_id = p_payroll_id
  )
  ORDER BY version_number ASC;
END;
$$;


--
-- Name: get_user_effective_permissions(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_effective_permissions(p_user_id uuid) RETURNS TABLE(resource text, action text, granted_by text, source_type text, conditions jsonb)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;


--
-- Name: is_business_day(date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_business_day(p_date date) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_day_of_week INTEGER;
  v_holiday_exists BOOLEAN;
BEGIN
  -- Get day of week (0 = Sunday, 6 = Saturday)
  v_day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Check if weekend
  IF v_day_of_week IN (0, 6) THEN
    RETURN FALSE;
  END IF;
  
  -- Check if holiday
  SELECT EXISTS(
    SELECT 1 FROM holidays 
    WHERE date = p_date
    AND (country_code = 'AU' OR country_code IS NULL)
  ) INTO v_holiday_exists;
  
  RETURN NOT v_holiday_exists;
END;
$$;


--
-- Name: prevent_duplicate_workday_insert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.prevent_duplicate_workday_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM work_schedule 
        WHERE user_id = NEW.user_id 
        AND work_day = NEW.work_day
    ) THEN
        RAISE EXCEPTION 'User already has this workday assigned. Use UPDATE instead of INSERT.';
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: regenerate_all_payroll_dates(date, date, integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.regenerate_all_payroll_dates(p_start_date date DEFAULT '2024-01-01'::date, p_end_date date DEFAULT '2026-12-31'::date, p_max_dates_per_payroll integer DEFAULT 52, p_delete_existing boolean DEFAULT true) RETURNS TABLE(payroll_id uuid, payroll_name character varying, dates_generated integer, dates_with_adjustments integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
  payroll_record RECORD;
  v_dates_generated integer;
  v_dates_with_adjustments integer;
  v_total_generated integer := 0;
BEGIN
  -- Loop through all payrolls
  FOR payroll_record IN 
    SELECT p.id, p.name 
    FROM payrolls p 
    ORDER BY p.name
  LOOP
    -- Delete existing dates for this payroll if requested
    IF p_delete_existing THEN
      DELETE FROM payroll_dates WHERE payroll_dates.payroll_id = payroll_record.id;
    END IF;
    
    -- Generate new dates for this payroll
    SELECT COUNT(*) INTO v_dates_generated
    FROM public.generate_payroll_dates(
      payroll_record.id, 
      p_start_date, 
      p_end_date, 
      p_max_dates_per_payroll
    );
    
    -- Count how many have adjustment notes
    SELECT COUNT(*) INTO v_dates_with_adjustments
    FROM payroll_dates pd
    WHERE pd.payroll_id = payroll_record.id 
    AND pd.notes IS NOT NULL;
    
    v_total_generated := v_total_generated + v_dates_generated;
    
    -- Return summary for this payroll
    RETURN QUERY SELECT 
      payroll_record.id,
      payroll_record.name::varchar(255),
      v_dates_generated,
      v_dates_with_adjustments;
  END LOOP;
  
  RAISE NOTICE 'Total dates generated across all payrolls: %', v_total_generated;
END;
$$;


--
-- Name: subtract_business_days(date, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.subtract_business_days(p_date date, p_days integer) RETURNS date
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_result DATE := p_date;
  v_days_subtracted INTEGER := 0;
BEGIN
  WHILE v_days_subtracted < p_days LOOP
    v_result := v_result - INTERVAL '1 day';
    IF is_business_day(v_result) THEN
      v_days_subtracted := v_days_subtracted + 1;
    END IF;
  END LOOP;
  
  RETURN v_result;
END;
$$;


--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: update_invoice_total(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_invoice_total() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE public.billing_invoice
  SET total_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.billing_invoice_item
    WHERE invoice_id = NEW.invoice_id
  ),
  updated_at = now()
  WHERE id = NEW.invoice_id;
  RETURN NEW;
END;
$$;


--
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- Name: update_payroll_dates(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_payroll_dates() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if any relevant fields have changed
    IF (NEW.cycle_id != OLD.cycle_id OR NEW.date_type_id != OLD.date_type_id OR NEW.date_value != OLD.date_value) THEN
        -- Generate new payroll dates
        PERFORM public.generate_payroll_dates(
            p_payroll_id := NEW.id,
            p_start_date := NULL,
            p_end_date := NULL
        );
    END IF;
    
    RETURN NEW;
END;
$$;


--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


--
-- Name: user_can_perform_action(uuid, text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.user_can_perform_action(p_user_id uuid, p_resource text, p_action text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
        AND p.action = p_action::permission_action -- Cast to enum type
        AND inherited_role.priority <= user_role.priority -- Inheritance logic
    ) INTO can_perform;
    
    RETURN can_perform;
END;
$$;


--
-- Name: audit_log; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
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


--
-- Name: auth_events; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.auth_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    event_type text NOT NULL,
    user_id uuid,
    user_email text,
    ip_address inet,
    user_agent text,
    success boolean DEFAULT true,
    failure_reason text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: data_access_log; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.data_access_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    accessed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id uuid NOT NULL,
    resource_type text NOT NULL,
    resource_id text,
    access_type text NOT NULL,
    data_classification text,
    fields_accessed text[],
    query_executed text,
    row_count integer,
    ip_address inet,
    session_id text,
    metadata jsonb
);


--
-- Name: permission_changes; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.permission_changes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    changed_by_user_id uuid NOT NULL,
    target_user_id uuid,
    target_role_id uuid,
    change_type text NOT NULL,
    permission_type text,
    old_permissions jsonb,
    new_permissions jsonb,
    reason text,
    approved_by_user_id uuid,
    metadata jsonb
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resource_id uuid NOT NULL,
    action public.permission_action NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    legacy_permission_name character varying(100)
);


--
-- Name: resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    display_name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    conditions jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    display_name character varying(100) NOT NULL,
    description text,
    priority integer DEFAULT 0 NOT NULL,
    is_system_role boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: permission_usage_report; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.permission_usage_report AS
 SELECT r.name AS role_name,
    res.name AS resource_name,
    p.action,
    count(DISTINCT ur.user_id) AS users_with_permission,
    count(DISTINCT al.user_id) AS users_who_used_permission,
    count(al.id) AS total_usage_count,
    max(al.event_time) AS last_used
   FROM (((((public.roles r
     JOIN public.role_permissions rp ON ((r.id = rp.role_id)))
     JOIN public.permissions p ON ((rp.permission_id = p.id)))
     JOIN public.resources res ON ((p.resource_id = res.id)))
     LEFT JOIN public.user_roles ur ON ((r.id = ur.role_id)))
     LEFT JOIN audit.audit_log al ON (((al.resource_type = (res.name)::text) AND (al.action = (p.action)::text))))
  GROUP BY r.name, res.name, p.action;


--
-- Name: slow_queries; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.slow_queries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    query_start timestamp with time zone NOT NULL,
    query_duration interval NOT NULL,
    query text NOT NULL,
    user_id uuid,
    application_name text,
    client_addr inet,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    username character varying(255),
    image text,
    is_staff boolean DEFAULT false,
    manager_id uuid,
    clerk_user_id text,
    is_active boolean DEFAULT true,
    deactivated_at timestamp with time zone,
    deactivated_by text
);


--
-- Name: COLUMN users.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.id IS 'Unique identifier for the user';


--
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.name IS 'User''s full name';


--
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.email IS 'User''s email address (unique)';


--
-- Name: COLUMN users.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.role IS 'User''s system role (viewer, consultant, manager, org_admin)';


--
-- Name: COLUMN users.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.created_at IS 'Timestamp when the user was created';


--
-- Name: COLUMN users.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.updated_at IS 'Timestamp when the user was last updated';


--
-- Name: COLUMN users.username; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.username IS 'User''s unique username for login';


--
-- Name: COLUMN users.image; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.image IS 'URL to the user''s profile image';


--
-- Name: COLUMN users.is_staff; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.is_staff IS 'Whether the user is a staff member (vs. external user)';


--
-- Name: COLUMN users.manager_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.manager_id IS 'Reference to the user''s manager';


--
-- Name: COLUMN users.clerk_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.clerk_user_id IS 'External identifier from Clerk authentication service';


--
-- Name: user_access_summary; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.user_access_summary AS
 SELECT u.id,
    u.name,
    u.email,
    u.role,
    u.created_at,
    u.updated_at,
    u.is_staff,
    u.is_active
   FROM public.users u;


--
-- Name: users_sync; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.users_sync (
    raw_json jsonb NOT NULL,
    id text GENERATED ALWAYS AS ((raw_json ->> 'id'::text)) STORED NOT NULL,
    name text GENERATED ALWAYS AS ((raw_json ->> 'display_name'::text)) STORED,
    email text GENERATED ALWAYS AS ((raw_json ->> 'primary_email'::text)) STORED,
    created_at timestamp with time zone GENERATED ALWAYS AS (to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / (1000)::double precision))) STORED,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- Name: COLUMN users_sync.raw_json; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.raw_json IS 'Complete JSON data from the authentication provider';


--
-- Name: COLUMN users_sync.id; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.id IS 'Unique identifier from the authentication provider';


--
-- Name: COLUMN users_sync.name; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.name IS 'User''s full name from authentication provider';


--
-- Name: COLUMN users_sync.email; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.email IS 'User''s email address from authentication provider';


--
-- Name: COLUMN users_sync.created_at; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.created_at IS 'Timestamp when the user was created in the auth system';


--
-- Name: COLUMN users_sync.updated_at; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.updated_at IS 'Timestamp when the user was last updated in the auth system';


--
-- Name: COLUMN users_sync.deleted_at; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.deleted_at IS 'Timestamp when the user was deleted in the auth system';


--
-- Name: adjustment_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.adjustment_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cycle_id uuid NOT NULL,
    date_type_id uuid NOT NULL,
    rule_description text NOT NULL,
    rule_code text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN adjustment_rules.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.id IS 'Unique identifier for the adjustment rule';


--
-- Name: COLUMN adjustment_rules.cycle_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.cycle_id IS 'Reference to the payroll cycle this rule applies to';


--
-- Name: COLUMN adjustment_rules.date_type_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.date_type_id IS 'Reference to the payroll date type this rule affects';


--
-- Name: COLUMN adjustment_rules.rule_description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.rule_description IS 'Human-readable description of the adjustment rule';


--
-- Name: COLUMN adjustment_rules.rule_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.rule_code IS 'Code/formula used to calculate date adjustments';


--
-- Name: COLUMN adjustment_rules.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.created_at IS 'Timestamp when the rule was created';


--
-- Name: COLUMN adjustment_rules.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.updated_at IS 'Timestamp when the rule was last updated';


--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_settings (
    id text NOT NULL,
    permissions jsonb
);


--
-- Name: COLUMN app_settings.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.app_settings.id IS 'Unique identifier for application setting';


--
-- Name: COLUMN app_settings.permissions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.app_settings.permissions IS 'JSON structure containing application permission configurations';


--
-- Name: billing_event_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_event_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid,
    event_type text NOT NULL,
    message text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: billing_invoice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_invoice (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    billing_period_start date NOT NULL,
    billing_period_end date NOT NULL,
    issued_date date DEFAULT CURRENT_DATE,
    due_date date,
    status text DEFAULT 'draft'::text NOT NULL,
    notes text,
    total_amount numeric(10,2) DEFAULT 0 NOT NULL,
    currency text DEFAULT 'AUD'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: billing_invoice_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_invoice_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid NOT NULL,
    description text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    amount numeric(10,2) GENERATED ALWAYS AS (((quantity)::numeric * unit_price)) STORED,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: billing_invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid,
    invoice_number text NOT NULL,
    billing_period_start date NOT NULL,
    billing_period_end date NOT NULL,
    total_amount numeric(12,2),
    status text DEFAULT 'draft'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT billing_invoices_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'sent'::text, 'paid'::text, 'overdue'::text])))
);


--
-- Name: billing_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid,
    description text,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    amount numeric(12,2) GENERATED ALWAYS AS (((quantity)::numeric * unit_price)) STORED,
    payroll_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: billing_plan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_plan (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    rate_per_payroll numeric(10,2) NOT NULL,
    currency text DEFAULT 'AUD'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: client_billing_assignment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_billing_assignment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    billing_plan_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: client_external_systems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    system_id uuid NOT NULL,
    system_client_id character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN client_external_systems.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.id IS 'Unique identifier for the client-system mapping';


--
-- Name: COLUMN client_external_systems.client_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.client_id IS 'Reference to the client';


--
-- Name: COLUMN client_external_systems.system_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.system_id IS 'Reference to the external system';


--
-- Name: COLUMN client_external_systems.system_client_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.system_client_id IS 'Client identifier in the external system';


--
-- Name: COLUMN client_external_systems.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.created_at IS 'Timestamp when the mapping was created';


--
-- Name: COLUMN client_external_systems.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.updated_at IS 'Timestamp when the mapping was last updated';


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    contact_person character varying(255),
    contact_email character varying(255),
    contact_phone character varying(50),
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN clients.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.id IS 'Unique identifier for the client';


--
-- Name: COLUMN clients.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.name IS 'Client company name';


--
-- Name: COLUMN clients.contact_person; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.contact_person IS 'Primary contact person at the client';


--
-- Name: COLUMN clients.contact_email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.contact_email IS 'Email address for the client contact';


--
-- Name: COLUMN clients.contact_phone; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.contact_phone IS 'Phone number for the client contact';


--
-- Name: COLUMN clients.active; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.active IS 'Whether the client is currently active';


--
-- Name: COLUMN clients.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.created_at IS 'Timestamp when the client was created';


--
-- Name: COLUMN clients.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.updated_at IS 'Timestamp when the client was last updated';


--
-- Name: payroll_cycles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_cycles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name public.payroll_cycle_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN payroll_cycles.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.id IS 'Unique identifier for the payroll cycle';


--
-- Name: COLUMN payroll_cycles.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.name IS 'Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.)';


--
-- Name: COLUMN payroll_cycles.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.description IS 'Detailed description of the payroll cycle';


--
-- Name: COLUMN payroll_cycles.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.created_at IS 'Timestamp when the cycle was created';


--
-- Name: COLUMN payroll_cycles.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.updated_at IS 'Timestamp when the cycle was last updated';


--
-- Name: payroll_date_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_date_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name public.payroll_date_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN payroll_date_types.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.id IS 'Unique identifier for the payroll date type';


--
-- Name: COLUMN payroll_date_types.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.name IS 'Name of the date type (Fixed, Last Working Day, etc.)';


--
-- Name: COLUMN payroll_date_types.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.description IS 'Detailed description of how this date type works';


--
-- Name: COLUMN payroll_date_types.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.created_at IS 'Timestamp when the date type was created';


--
-- Name: COLUMN payroll_date_types.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.updated_at IS 'Timestamp when the date type was last updated';


--
-- Name: payrolls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payrolls (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    cycle_id uuid NOT NULL,
    date_type_id uuid NOT NULL,
    date_value integer,
    primary_consultant_user_id uuid,
    backup_consultant_user_id uuid,
    manager_user_id uuid,
    processing_days_before_eft integer DEFAULT 2 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    payroll_system character varying(255),
    status public.payroll_status DEFAULT 'Implementation'::public.payroll_status NOT NULL,
    processing_time integer DEFAULT 1 NOT NULL,
    employee_count integer,
    go_live_date date,
    version_number integer DEFAULT 1,
    parent_payroll_id uuid,
    superseded_date date,
    version_reason text,
    created_by_user_id uuid,
    CONSTRAINT check_positive_values CHECK (((processing_days_before_eft >= 0) AND (processing_time >= 0) AND ((employee_count IS NULL) OR (employee_count >= 0)))),
    CONSTRAINT check_version_reason CHECK (((version_reason IS NULL) OR (version_reason = ANY ((enum_range(NULL::public.payroll_version_reason))::text[]))))
);


--
-- Name: COLUMN payrolls.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.id IS 'Unique identifier for the payroll';


--
-- Name: COLUMN payrolls.client_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.client_id IS 'Reference to the client this payroll belongs to';


--
-- Name: COLUMN payrolls.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.name IS 'Name of the payroll';


--
-- Name: COLUMN payrolls.cycle_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.cycle_id IS 'Reference to the payroll cycle';


--
-- Name: COLUMN payrolls.date_type_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.date_type_id IS 'Reference to the payroll date type';


--
-- Name: COLUMN payrolls.date_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.date_value IS 'Specific value for date calculation (e.g., day of month)';


--
-- Name: COLUMN payrolls.primary_consultant_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.primary_consultant_user_id IS 'Primary consultant responsible for this payroll';


--
-- Name: COLUMN payrolls.backup_consultant_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.backup_consultant_user_id IS 'Backup consultant for this payroll';


--
-- Name: COLUMN payrolls.manager_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.manager_user_id IS 'Manager overseeing this payroll';


--
-- Name: COLUMN payrolls.processing_days_before_eft; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.processing_days_before_eft IS 'Number of days before EFT that processing must complete';


--
-- Name: COLUMN payrolls.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.created_at IS 'Timestamp when the payroll was created';


--
-- Name: COLUMN payrolls.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.updated_at IS 'Timestamp when the payroll was last updated';


--
-- Name: COLUMN payrolls.payroll_system; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.payroll_system IS 'External payroll system used for this client';


--
-- Name: COLUMN payrolls.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.status IS 'Current status of the payroll (Implementation, Active, Inactive)';


--
-- Name: COLUMN payrolls.processing_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.processing_time IS 'Number of hours required to process this payroll';


--
-- Name: COLUMN payrolls.employee_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.employee_count IS 'Number of employees in this payroll';


--
-- Name: COLUMN payrolls.go_live_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.go_live_date IS 'The date when the payroll went live in the system';


--
-- Name: current_payrolls; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.current_payrolls AS
 SELECT DISTINCT ON (COALESCE(p.parent_payroll_id, p.id)) p.id,
    p.name,
    p.client_id,
    p.cycle_id,
    p.date_type_id,
    p.date_value,
    p.primary_consultant_user_id,
    p.backup_consultant_user_id,
    p.manager_user_id,
    p.version_number,
    p.parent_payroll_id,
    p.go_live_date,
    p.superseded_date,
    p.version_reason,
    p.created_at,
    p.updated_at,
    c.name AS client_name,
    pc.name AS payroll_cycle_name,
    pdt.name AS payroll_date_type_name
   FROM (((public.payrolls p
     LEFT JOIN public.clients c ON ((p.client_id = c.id)))
     LEFT JOIN public.payroll_cycles pc ON ((p.cycle_id = pc.id)))
     LEFT JOIN public.payroll_date_types pdt ON ((p.date_type_id = pdt.id)))
  WHERE (((p.go_live_date IS NULL) OR (p.go_live_date <= CURRENT_DATE)) AND ((p.superseded_date IS NULL) OR (p.superseded_date > CURRENT_DATE)))
  ORDER BY COALESCE(p.parent_payroll_id, p.id), p.version_number DESC;


--
-- Name: external_systems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    url text NOT NULL,
    description text,
    icon character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN external_systems.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.id IS 'Unique identifier for the external system';


--
-- Name: COLUMN external_systems.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.name IS 'Name of the external system';


--
-- Name: COLUMN external_systems.url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.url IS 'URL endpoint for the external system';


--
-- Name: COLUMN external_systems.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.description IS 'Description of the external system and its purpose';


--
-- Name: COLUMN external_systems.icon; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.icon IS 'Path or reference to the system icon';


--
-- Name: COLUMN external_systems.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.created_at IS 'Timestamp when the system was created';


--
-- Name: COLUMN external_systems.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.updated_at IS 'Timestamp when the system was last updated';


--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feature_flags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feature_name text NOT NULL,
    is_enabled boolean DEFAULT false,
    allowed_roles jsonb DEFAULT '[]'::jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: COLUMN feature_flags.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.id IS 'Unique identifier for the feature flag';


--
-- Name: COLUMN feature_flags.feature_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.feature_name IS 'Name of the feature controlled by this flag';


--
-- Name: COLUMN feature_flags.is_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.is_enabled IS 'Whether the feature is currently enabled';


--
-- Name: COLUMN feature_flags.allowed_roles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.allowed_roles IS 'JSON array of roles that can access this feature';


--
-- Name: COLUMN feature_flags.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.updated_at IS 'Timestamp when the feature flag was last updated';


--
-- Name: holidays; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.holidays (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    date date NOT NULL,
    local_name text NOT NULL,
    name text NOT NULL,
    country_code character(2) NOT NULL,
    region text[],
    is_fixed boolean DEFAULT false,
    is_global boolean DEFAULT false,
    launch_year integer,
    types text[] NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN holidays.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.id IS 'Unique identifier for the holiday';


--
-- Name: COLUMN holidays.date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.date IS 'Date of the holiday';


--
-- Name: COLUMN holidays.local_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.local_name IS 'Name of the holiday in local language';


--
-- Name: COLUMN holidays.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.name IS 'Name of the holiday in English';


--
-- Name: COLUMN holidays.country_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.country_code IS 'ISO country code where the holiday is observed';


--
-- Name: COLUMN holidays.region; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.region IS 'Array of regions within the country where the holiday applies';


--
-- Name: COLUMN holidays.is_fixed; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.is_fixed IS 'Whether the holiday occurs on the same date each year';


--
-- Name: COLUMN holidays.is_global; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.is_global IS 'Whether the holiday is observed globally';


--
-- Name: COLUMN holidays.launch_year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.launch_year IS 'First year when the holiday was observed';


--
-- Name: COLUMN holidays.types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.types IS 'Array of holiday types (e.g., public, bank, religious)';


--
-- Name: COLUMN holidays.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.created_at IS 'Timestamp when the holiday record was created';


--
-- Name: COLUMN holidays.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.updated_at IS 'Timestamp when the holiday record was last updated';


--
-- Name: leave; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    leave_type character varying(50) NOT NULL,
    reason text,
    status public.leave_status_enum,
    CONSTRAINT check_leave_dates CHECK ((end_date >= start_date)),
    CONSTRAINT leave_leave_type_check CHECK (((leave_type)::text = ANY (ARRAY[('Annual'::character varying)::text, ('Sick'::character varying)::text, ('Unpaid'::character varying)::text, ('Other'::character varying)::text])))
);


--
-- Name: COLUMN leave.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.id IS 'Unique identifier for the leave record';


--
-- Name: COLUMN leave.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.user_id IS 'Reference to the user taking leave';


--
-- Name: COLUMN leave.start_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.start_date IS 'First day of the leave period';


--
-- Name: COLUMN leave.end_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.end_date IS 'Last day of the leave period';


--
-- Name: COLUMN leave.leave_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.leave_type IS 'Type of leave (vacation, sick, personal, etc.)';


--
-- Name: COLUMN leave.reason; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.reason IS 'Reason provided for the leave request';


--
-- Name: COLUMN leave.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.status IS 'Current status of the leave request (Pending, Approved, Denied)';


--
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    user_id uuid,
    content text NOT NULL,
    is_important boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT notes_entity_type_check CHECK ((entity_type = ANY (ARRAY['payroll'::text, 'client'::text])))
);


--
-- Name: COLUMN notes.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.id IS 'Unique identifier for the note';


--
-- Name: COLUMN notes.entity_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.entity_type IS 'Type of entity this note is attached to (client, payroll, etc.)';


--
-- Name: COLUMN notes.entity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.entity_id IS 'Identifier of the entity this note is attached to';


--
-- Name: COLUMN notes.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.user_id IS 'User who created the note';


--
-- Name: COLUMN notes.content; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.content IS 'Content of the note';


--
-- Name: COLUMN notes.is_important; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.is_important IS 'Whether the note is flagged as important';


--
-- Name: COLUMN notes.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.created_at IS 'Timestamp when the note was created';


--
-- Name: COLUMN notes.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.updated_at IS 'Timestamp when the note was last updated';


--
-- Name: payroll_assignment_audit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_assignment_audit (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    assignment_id uuid,
    payroll_date_id uuid NOT NULL,
    from_consultant_id uuid,
    to_consultant_id uuid NOT NULL,
    changed_by uuid,
    change_reason text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: payroll_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_date_id uuid NOT NULL,
    consultant_id uuid NOT NULL,
    assigned_by uuid,
    is_backup boolean DEFAULT false,
    original_consultant_id uuid,
    assigned_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: payroll_dashboard_stats; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.payroll_dashboard_stats AS
 SELECT p.id,
    p.name,
    p.status,
    c.name AS client_name,
    pc.name AS cycle_name,
    count(DISTINCT pd.id) AS total_dates,
    count(DISTINCT pd.id) FILTER (WHERE (pd.adjusted_eft_date >= CURRENT_DATE)) AS future_dates,
    count(DISTINCT pd.id) FILTER (WHERE (pd.adjusted_eft_date < CURRENT_DATE)) AS past_dates,
    min(pd.adjusted_eft_date) FILTER (WHERE (pd.adjusted_eft_date >= CURRENT_DATE)) AS next_eft_date,
    p.primary_consultant_user_id,
    p.backup_consultant_user_id,
    p.manager_user_id
   FROM (((public.payrolls p
     LEFT JOIN public.clients c ON ((p.client_id = c.id)))
     LEFT JOIN public.payroll_cycles pc ON ((p.cycle_id = pc.id)))
     LEFT JOIN public.payroll_dates pd ON ((p.id = pd.payroll_id)))
  WHERE (p.superseded_date IS NULL)
  GROUP BY p.id, p.name, p.status, c.name, pc.name, p.primary_consultant_user_id, p.backup_consultant_user_id, p.manager_user_id
  WITH NO DATA;


--
-- Name: payroll_triggers_status; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.payroll_triggers_status AS
 SELECT triggers.trigger_name,
    triggers.event_manipulation,
    triggers.event_object_table,
    triggers.action_timing,
    triggers.action_statement
   FROM information_schema.triggers
  WHERE (((triggers.trigger_name)::name ~~ '%payroll%'::text) OR ((triggers.trigger_name)::name ~~ '%auto_%'::text))
  ORDER BY triggers.trigger_name;


--
-- Name: permission_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permission_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    target_user_id uuid,
    target_role text,
    resource text NOT NULL,
    operation text NOT NULL,
    action text NOT NULL,
    previous_value jsonb,
    new_value jsonb,
    reason text,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TABLE permission_audit_log; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.permission_audit_log IS 'Audit log for permission changes and access attempts';


--
-- Name: permission_overrides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permission_overrides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    role text,
    resource text NOT NULL,
    operation text NOT NULL,
    granted boolean DEFAULT false NOT NULL,
    conditions jsonb,
    reason text,
    created_by uuid,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT check_user_or_role CHECK ((((user_id IS NOT NULL) AND (role IS NULL)) OR ((user_id IS NULL) AND (role IS NOT NULL))))
);


--
-- Name: TABLE permission_overrides; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.permission_overrides IS 'User-specific and role-specific permission overrides';


--
-- Name: COLUMN permission_overrides.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.user_id IS 'User ID for user-specific overrides (mutually exclusive with role)';


--
-- Name: COLUMN permission_overrides.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.role IS 'Role name for role-based overrides (mutually exclusive with user_id)';


--
-- Name: COLUMN permission_overrides.granted; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.granted IS 'Whether the permission is granted (true) or denied (false)';


--
-- Name: COLUMN permission_overrides.conditions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.conditions IS 'JSON conditions for conditional permissions';


--
-- Name: COLUMN permission_overrides.expires_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.expires_at IS 'When this override expires (NULL for permanent)';


--
-- Name: users_role_backup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_role_backup (
    id uuid,
    email character varying(255),
    role public.user_role,
    created_at timestamp with time zone
);


--
-- Name: work_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.work_schedule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    work_day character varying(10) NOT NULL,
    work_hours numeric(4,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT work_schedule_work_day_check CHECK (((work_day)::text = ANY (ARRAY[('Monday'::character varying)::text, ('Tuesday'::character varying)::text, ('Wednesday'::character varying)::text, ('Thursday'::character varying)::text, ('Friday'::character varying)::text, ('Saturday'::character varying)::text, ('Sunday'::character varying)::text]))),
    CONSTRAINT work_schedule_work_hours_check CHECK (((work_hours >= (0)::numeric) AND (work_hours <= (24)::numeric)))
);


--
-- Name: COLUMN work_schedule.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.id IS 'Unique identifier for the work schedule entry';


--
-- Name: COLUMN work_schedule.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.user_id IS 'Reference to the user this schedule belongs to';


--
-- Name: COLUMN work_schedule.work_day; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.work_day IS 'Day of the week (Monday, Tuesday, etc.)';


--
-- Name: COLUMN work_schedule.work_hours; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.work_hours IS 'Number of hours worked on this day';


--
-- Name: COLUMN work_schedule.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.created_at IS 'Timestamp when the schedule entry was created';


--
-- Name: COLUMN work_schedule.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.updated_at IS 'Timestamp when the schedule entry was last updated';


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: auth_events auth_events_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.auth_events
    ADD CONSTRAINT auth_events_pkey PRIMARY KEY (id);


--
-- Name: data_access_log data_access_log_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.data_access_log
    ADD CONSTRAINT data_access_log_pkey PRIMARY KEY (id);


--
-- Name: permission_changes permission_changes_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.permission_changes
    ADD CONSTRAINT permission_changes_pkey PRIMARY KEY (id);


--
-- Name: slow_queries slow_queries_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.slow_queries
    ADD CONSTRAINT slow_queries_pkey PRIMARY KEY (id);


--
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- Name: adjustment_rules adjustment_rules_cycle_id_date_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_date_type_id_key UNIQUE (cycle_id, date_type_id);


--
-- Name: adjustment_rules adjustment_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: billing_event_log billing_event_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_pkey PRIMARY KEY (id);


--
-- Name: billing_invoice_item billing_invoice_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_pkey PRIMARY KEY (id);


--
-- Name: billing_invoice billing_invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_pkey PRIMARY KEY (id);


--
-- Name: billing_invoices billing_invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: billing_invoices billing_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_pkey PRIMARY KEY (id);


--
-- Name: billing_items billing_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_pkey PRIMARY KEY (id);


--
-- Name: billing_plan billing_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_plan
    ADD CONSTRAINT billing_plan_pkey PRIMARY KEY (id);


--
-- Name: client_billing_assignment client_billing_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_pkey PRIMARY KEY (id);


--
-- Name: client_external_systems client_external_systems_client_id_system_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_system_id_key UNIQUE (client_id, system_id);


--
-- Name: client_external_systems client_external_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: external_systems external_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_systems
    ADD CONSTRAINT external_systems_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_feature_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_feature_name_key UNIQUE (feature_name);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: holidays holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);


--
-- Name: latest_payroll_version_results latest_payroll_version_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.latest_payroll_version_results
    ADD CONSTRAINT latest_payroll_version_results_pkey PRIMARY KEY (id);


--
-- Name: leave leave_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave
    ADD CONSTRAINT leave_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: payroll_activation_results payroll_activation_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_activation_results
    ADD CONSTRAINT payroll_activation_results_pkey PRIMARY KEY (id);


--
-- Name: payroll_assignment_audit payroll_assignment_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT payroll_assignment_audit_pkey PRIMARY KEY (id);


--
-- Name: payroll_assignments payroll_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT payroll_assignments_pkey PRIMARY KEY (id);


--
-- Name: payroll_cycles payroll_cycles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_cycles
    ADD CONSTRAINT payroll_cycles_name_key UNIQUE (name);


--
-- Name: payroll_cycles payroll_cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_cycles
    ADD CONSTRAINT payroll_cycles_pkey PRIMARY KEY (id);


--
-- Name: payroll_date_types payroll_date_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_date_types
    ADD CONSTRAINT payroll_date_types_name_key UNIQUE (name);


--
-- Name: payroll_date_types payroll_date_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_date_types
    ADD CONSTRAINT payroll_date_types_pkey PRIMARY KEY (id);


--
-- Name: payroll_dates payroll_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_pkey PRIMARY KEY (id);


--
-- Name: payroll_version_history_results payroll_version_history_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_version_history_results
    ADD CONSTRAINT payroll_version_history_results_pkey PRIMARY KEY (id);


--
-- Name: payroll_version_results payroll_version_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_version_results
    ADD CONSTRAINT payroll_version_results_pkey PRIMARY KEY (id);


--
-- Name: payrolls payrolls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_pkey PRIMARY KEY (id);


--
-- Name: permission_audit_log permission_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_pkey PRIMARY KEY (id);


--
-- Name: permission_overrides permission_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_resource_id_action_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_action_key UNIQUE (resource_id, action);


--
-- Name: resources resources_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_name_key UNIQUE (name);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: work_schedule unique_user_work_day; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT unique_user_work_day UNIQUE (user_id, work_day);


--
-- Name: payroll_assignments uq_payroll_assignment_payroll_date; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT uq_payroll_assignment_payroll_date UNIQUE (payroll_date_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: users users_clerk_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_clerk_user_id_key UNIQUE (clerk_user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: work_schedule work_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT work_schedule_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_log_action; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_log_action ON audit.audit_log USING btree (action);


--
-- Name: idx_audit_log_event_time; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_log_event_time ON audit.audit_log USING btree (event_time DESC);


--
-- Name: idx_audit_log_resource; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_log_resource ON audit.audit_log USING btree (resource_type, resource_id);


--
-- Name: idx_audit_log_session; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_log_session ON audit.audit_log USING btree (session_id);


--
-- Name: idx_audit_log_user_id; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_log_user_id ON audit.audit_log USING btree (user_id);


--
-- Name: idx_auth_events_time; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_auth_events_time ON audit.auth_events USING btree (event_time DESC);


--
-- Name: idx_auth_events_type; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_auth_events_type ON audit.auth_events USING btree (event_type);


--
-- Name: idx_auth_events_user; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_auth_events_user ON audit.auth_events USING btree (user_id);


--
-- Name: idx_data_access_classification; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_data_access_classification ON audit.data_access_log USING btree (data_classification);


--
-- Name: idx_data_access_resource; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_data_access_resource ON audit.data_access_log USING btree (resource_type, resource_id);


--
-- Name: idx_data_access_time; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_data_access_time ON audit.data_access_log USING btree (accessed_at DESC);


--
-- Name: idx_data_access_user; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_data_access_user ON audit.data_access_log USING btree (user_id);


--
-- Name: idx_permission_changes_changed_by; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_permission_changes_changed_by ON audit.permission_changes USING btree (changed_by_user_id);


--
-- Name: idx_permission_changes_target_user; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_permission_changes_target_user ON audit.permission_changes USING btree (target_user_id);


--
-- Name: idx_permission_changes_time; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_permission_changes_time ON audit.permission_changes USING btree (changed_at DESC);


--
-- Name: idx_slow_queries_duration; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_slow_queries_duration ON audit.slow_queries USING btree (query_duration DESC);


--
-- Name: idx_slow_queries_start; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_slow_queries_start ON audit.slow_queries USING btree (query_start DESC);


--
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


--
-- Name: idx_audit_assignment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_assignment ON public.payroll_assignment_audit USING btree (assignment_id);


--
-- Name: idx_audit_changed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_changed_by ON public.payroll_assignment_audit USING btree (changed_by);


--
-- Name: idx_audit_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_date ON public.payroll_assignment_audit USING btree (created_at);


--
-- Name: idx_audit_payroll_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_payroll_date ON public.payroll_assignment_audit USING btree (payroll_date_id);


--
-- Name: idx_billing_invoice_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_invoice_client_id ON public.billing_invoice USING btree (client_id);


--
-- Name: idx_holidays_date_country_region; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_holidays_date_country_region ON public.holidays USING btree (date, country_code, region);


--
-- Name: idx_leave_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leave_dates ON public.leave USING btree (start_date, end_date);


--
-- Name: idx_leave_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leave_user_id ON public.leave USING btree (user_id);


--
-- Name: idx_notes_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notes_created_at ON public.notes USING btree (created_at DESC);


--
-- Name: idx_notes_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notes_entity ON public.notes USING btree (entity_type, entity_id);


--
-- Name: idx_notes_important; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notes_important ON public.notes USING btree (is_important) WHERE (is_important = true);


--
-- Name: idx_notes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notes_user_id ON public.notes USING btree (user_id);


--
-- Name: idx_payroll_assignments_assigned_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_assignments_assigned_by ON public.payroll_assignments USING btree (assigned_by);


--
-- Name: idx_payroll_assignments_assigned_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_assignments_assigned_date ON public.payroll_assignments USING btree (assigned_date);


--
-- Name: idx_payroll_assignments_consultant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_assignments_consultant ON public.payroll_assignments USING btree (consultant_id);


--
-- Name: idx_payroll_assignments_payroll_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_assignments_payroll_date ON public.payroll_assignments USING btree (payroll_date_id);


--
-- Name: idx_payroll_dashboard_stats_consultants; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dashboard_stats_consultants ON public.payroll_dashboard_stats USING btree (primary_consultant_user_id, backup_consultant_user_id);


--
-- Name: idx_payroll_dashboard_stats_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dashboard_stats_status ON public.payroll_dashboard_stats USING btree (status);


--
-- Name: idx_payroll_dates_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_composite ON public.payroll_dates USING btree (payroll_id, adjusted_eft_date, processing_date);


--
-- Name: idx_payroll_dates_date_range; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_date_range ON public.payroll_dates USING btree (adjusted_eft_date);


--
-- Name: idx_payroll_dates_notes; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_notes ON public.payroll_dates USING gin (to_tsvector('english'::regconfig, notes));


--
-- Name: idx_payroll_dates_payroll_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_payroll_id ON public.payroll_dates USING btree (payroll_id);


--
-- Name: idx_payroll_dates_processing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_processing ON public.payroll_dates USING btree (processing_date);


--
-- Name: idx_payrolls_active_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_active_dates ON public.payrolls USING btree (status, go_live_date, superseded_date) WHERE (status = 'Active'::public.payroll_status);


--
-- Name: idx_payrolls_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_client_id ON public.payrolls USING btree (client_id);


--
-- Name: idx_payrolls_consultant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_consultant ON public.payrolls USING btree (primary_consultant_user_id);


--
-- Name: idx_payrolls_current_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_current_version ON public.payrolls USING btree (parent_payroll_id, version_number DESC) WHERE (superseded_date IS NULL);


--
-- Name: idx_payrolls_go_live_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_go_live_date ON public.payrolls USING btree (go_live_date);


--
-- Name: idx_payrolls_manager; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_manager ON public.payrolls USING btree (manager_user_id);


--
-- Name: idx_payrolls_staff_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_staff_composite ON public.payrolls USING btree (primary_consultant_user_id, backup_consultant_user_id, manager_user_id);


--
-- Name: idx_payrolls_status_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_status_client ON public.payrolls USING btree (status, client_id) WHERE (status <> 'Inactive'::public.payroll_status);


--
-- Name: idx_payrolls_versioning; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_versioning ON public.payrolls USING btree (parent_payroll_id, version_number, go_live_date);


--
-- Name: idx_permission_audit_log_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_log_action ON public.permission_audit_log USING btree (action);


--
-- Name: idx_permission_audit_log_resource; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_log_resource ON public.permission_audit_log USING btree (resource);


--
-- Name: idx_permission_audit_log_target_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_log_target_user_id ON public.permission_audit_log USING btree (target_user_id);


--
-- Name: idx_permission_audit_log_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_log_timestamp ON public.permission_audit_log USING btree ("timestamp" DESC);


--
-- Name: idx_permission_audit_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_log_user_id ON public.permission_audit_log USING btree (user_id);


--
-- Name: idx_permission_overrides_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_created_by ON public.permission_overrides USING btree (created_by);


--
-- Name: idx_permission_overrides_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_expires_at ON public.permission_overrides USING btree (expires_at);


--
-- Name: idx_permission_overrides_operation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_operation ON public.permission_overrides USING btree (operation);


--
-- Name: idx_permission_overrides_resource; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_resource ON public.permission_overrides USING btree (resource);


--
-- Name: idx_permission_overrides_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_role ON public.permission_overrides USING btree (role);


--
-- Name: idx_permission_overrides_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_user_id ON public.permission_overrides USING btree (user_id);


--
-- Name: idx_unique_payroll_date; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_payroll_date ON public.payroll_dates USING btree (payroll_id, original_eft_date);


--
-- Name: idx_users_active_staff; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_active_staff ON public.users USING btree (is_active, is_staff, role) WHERE (is_active = true);


--
-- Name: idx_users_clerk_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_clerk_composite ON public.users USING btree (clerk_user_id, role, is_staff);


--
-- Name: idx_users_deactivated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_deactivated_at ON public.users USING btree (deactivated_at) WHERE (deactivated_at IS NOT NULL);


--
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_work_schedule_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_schedule_user_id ON public.work_schedule USING btree (user_id);


--
-- Name: only_one_current_version_per_family; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX only_one_current_version_per_family ON public.payrolls USING btree (COALESCE(parent_payroll_id, id)) WHERE (superseded_date IS NULL);


--
-- Name: clients audit_clients_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_clients_changes AFTER INSERT OR DELETE OR UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: payrolls audit_payrolls_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_payrolls_changes AFTER INSERT OR DELETE OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: role_permissions audit_role_permissions_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_role_permissions_changes AFTER INSERT OR DELETE OR UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: user_roles audit_user_roles_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_user_roles_changes AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: users audit_users_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_users_changes AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: notes check_entity_relation; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_entity_relation BEFORE INSERT OR UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.enforce_entity_relation();


--
-- Name: payrolls enforce_staff_on_payrolls; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_staff_on_payrolls BEFORE INSERT OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.enforce_staff_roles();


--
-- Name: payroll_assignments set_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.payroll_assignments FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: billing_invoice_item trg_invoice_item_total; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_invoice_item_total AFTER INSERT OR DELETE OR UPDATE ON public.billing_invoice_item FOR EACH ROW EXECUTE FUNCTION public.update_invoice_total();


--
-- Name: payrolls trigger_auto_delete_future_dates; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_delete_future_dates AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_delete_future_dates_on_supersede();


--
-- Name: payrolls trigger_auto_generate_dates; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_generate_dates AFTER INSERT ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_generate_dates_on_payroll_insert();


--
-- Name: payrolls trigger_auto_regenerate_dates; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_regenerate_dates AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_regenerate_dates_on_schedule_change();


--
-- Name: work_schedule trigger_prevent_duplicate_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_prevent_duplicate_insert BEFORE INSERT ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_workday_insert();


--
-- Name: feature_flags update_feature_flags_modtime; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_feature_flags_modtime BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- Name: permission_overrides update_permission_overrides_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_permission_overrides_updated_at BEFORE UPDATE ON public.permission_overrides FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: permissions update_permissions_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_permissions_timestamp BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: resources update_resources_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_resources_timestamp BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: role_permissions update_role_permissions_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_role_permissions_timestamp BEFORE UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: roles update_roles_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_roles_timestamp BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: user_roles update_user_roles_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_roles_timestamp BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: adjustment_rules adjustment_rules_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.payroll_cycles(id) ON DELETE CASCADE;


--
-- Name: adjustment_rules adjustment_rules_date_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES public.payroll_date_types(id) ON DELETE CASCADE;


--
-- Name: billing_event_log billing_event_log_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: billing_event_log billing_event_log_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoice(id) ON DELETE CASCADE;


--
-- Name: billing_invoice billing_invoice_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: billing_invoice_item billing_invoice_item_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoice(id) ON DELETE CASCADE;


--
-- Name: billing_invoices billing_invoices_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: billing_items billing_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoices(id) ON DELETE CASCADE;


--
-- Name: billing_items billing_items_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON DELETE SET NULL;


--
-- Name: client_billing_assignment client_billing_assignment_billing_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_billing_plan_id_fkey FOREIGN KEY (billing_plan_id) REFERENCES public.billing_plan(id) ON DELETE RESTRICT;


--
-- Name: client_billing_assignment client_billing_assignment_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: client_external_systems client_external_systems_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: client_external_systems client_external_systems_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_system_id_fkey FOREIGN KEY (system_id) REFERENCES public.external_systems(id) ON DELETE CASCADE;


--
-- Name: payroll_assignment_audit fk_audit_assignment; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_assignment FOREIGN KEY (assignment_id) REFERENCES public.payroll_assignments(id) ON DELETE SET NULL;


--
-- Name: payroll_assignment_audit fk_audit_changed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_changed_by FOREIGN KEY (changed_by) REFERENCES public.users(id);


--
-- Name: payroll_assignment_audit fk_audit_from_consultant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_from_consultant FOREIGN KEY (from_consultant_id) REFERENCES public.users(id);


--
-- Name: payroll_assignment_audit fk_audit_payroll_date; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_payroll_date FOREIGN KEY (payroll_date_id) REFERENCES public.payroll_dates(id);


--
-- Name: payroll_assignment_audit fk_audit_to_consultant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_to_consultant FOREIGN KEY (to_consultant_id) REFERENCES public.users(id);


--
-- Name: payrolls fk_backup_consultant_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_backup_consultant_user FOREIGN KEY (backup_consultant_user_id) REFERENCES public.users(id);


--
-- Name: leave fk_leave_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave
    ADD CONSTRAINT fk_leave_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payrolls fk_manager_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_manager_user FOREIGN KEY (manager_user_id) REFERENCES public.users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_assigned_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_assigned_by FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_consultant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_consultant FOREIGN KEY (consultant_id) REFERENCES public.users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_original_consultant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_original_consultant FOREIGN KEY (original_consultant_id) REFERENCES public.users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_payroll_date; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_payroll_date FOREIGN KEY (payroll_date_id) REFERENCES public.payroll_dates(id) ON DELETE CASCADE;


--
-- Name: payrolls fk_primary_consultant_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_primary_consultant_user FOREIGN KEY (primary_consultant_user_id) REFERENCES public.users(id);


--
-- Name: work_schedule fk_work_schedule_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT fk_work_schedule_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users manager_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT manager_id FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payroll_dates payroll_dates_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payrolls payrolls_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: payrolls payrolls_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.payroll_cycles(id) ON DELETE RESTRICT;


--
-- Name: payrolls payrolls_date_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES public.payroll_date_types(id) ON DELETE RESTRICT;


--
-- Name: payrolls payrolls_parent_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_parent_payroll_id_fkey FOREIGN KEY (parent_payroll_id) REFERENCES public.payrolls(id);


--
-- Name: permission_audit_log permission_audit_log_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: permission_audit_log permission_audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: permission_overrides permission_overrides_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: permission_overrides permission_overrides_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: permissions permissions_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: clients; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

--
-- Name: notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

--
-- Name: payroll_dates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.payroll_dates ENABLE ROW LEVEL SECURITY;

--
-- Name: payrolls; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;

--
-- Name: payrolls payrolls_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY payrolls_select_policy ON public.payrolls FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = (current_setting('hasura.user_id'::text))::uuid) AND ((u.role = ANY (ARRAY['developer'::public.user_role, 'org_admin'::public.user_role])) OR ((u.role = 'manager'::public.user_role) AND (payrolls.manager_user_id = u.id)) OR ((u.role = 'consultant'::public.user_role) AND ((payrolls.primary_consultant_user_id = u.id) OR (payrolls.backup_consultant_user_id = u.id))))))));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_select_policy ON public.users FOR SELECT USING (((id = (current_setting('hasura.user_id'::text))::uuid) OR (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = (current_setting('hasura.user_id'::text))::uuid) AND (u.role = ANY (ARRAY['developer'::public.user_role, 'org_admin'::public.user_role])))))));


--
-- PostgreSQL database dump complete
--


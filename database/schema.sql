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

--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA audit;


ALTER SCHEMA audit OWNER TO neondb_owner;

--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA neon_auth;


ALTER SCHEMA neon_auth OWNER TO neondb_owner;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: leave_status_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.leave_status_enum AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);


ALTER TYPE public.leave_status_enum OWNER TO neondb_owner;

--
-- Name: payroll_cycle_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payroll_cycle_type AS ENUM (
    'weekly',
    'fortnightly',
    'bi_monthly',
    'monthly',
    'quarterly'
);


ALTER TYPE public.payroll_cycle_type OWNER TO neondb_owner;

--
-- Name: payroll_date_result; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payroll_date_result AS (
	success boolean,
	message text
);


ALTER TYPE public.payroll_date_result OWNER TO neondb_owner;

--
-- Name: payroll_date_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payroll_date_type AS ENUM (
    'fixed_date',
    'eom',
    'som',
    'week_a',
    'week_b',
    'dow'
);


ALTER TYPE public.payroll_date_type OWNER TO neondb_owner;

--
-- Name: payroll_dates_result; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payroll_dates_result AS (
	payroll_id uuid,
	original_eft_date date,
	adjusted_eft_date date,
	processing_date date,
	success boolean,
	message text
);


ALTER TYPE public.payroll_dates_result OWNER TO neondb_owner;

--
-- Name: payroll_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payroll_status AS ENUM (
    'Active',
    'Implementation',
    'Inactive'
);


ALTER TYPE public.payroll_status OWNER TO neondb_owner;

--
-- Name: payroll_status_new; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payroll_status_new AS ENUM (
    'live',
    'inactive',
    'onboarding',
    'possible',
    'implementation'
);


ALTER TYPE public.payroll_status_new OWNER TO neondb_owner;

--
-- Name: payroll_version_reason; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.payroll_version_reason AS ENUM (
    'initial_creation',
    'schedule_change',
    'consultant_change',
    'client_change',
    'correction',
    'annual_review'
);


ALTER TYPE public.payroll_version_reason OWNER TO neondb_owner;

--
-- Name: permission_action; Type: TYPE; Schema: public; Owner: neondb_owner
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


ALTER TYPE public.permission_action OWNER TO neondb_owner;

--
-- Name: status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.status AS ENUM (
    'active',
    'inactive',
    'archived'
);


ALTER TYPE public.status OWNER TO neondb_owner;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_role AS ENUM (
    'developer',
    'org_admin',
    'manager',
    'consultant',
    'viewer'
);


ALTER TYPE public.user_role OWNER TO neondb_owner;

--
-- Name: archive_old_logs(); Type: FUNCTION; Schema: audit; Owner: neondb_owner
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


ALTER FUNCTION audit.archive_old_logs() OWNER TO neondb_owner;

--
-- Name: log_changes(); Type: FUNCTION; Schema: audit; Owner: neondb_owner
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


ALTER FUNCTION audit.log_changes() OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: payroll_activation_results; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payroll_activation_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    action_taken text NOT NULL,
    version_number integer NOT NULL,
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payroll_activation_results OWNER TO neondb_owner;

--
-- Name: activate_payroll_versions(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.activate_payroll_versions() RETURNS SETOF public.payroll_activation_results
    LANGUAGE plpgsql
    AS $$ DECLARE activated_count integer := 0; BEGIN DELETE FROM payroll_activation_results WHERE created_at < NOW() - INTERVAL '1 hour'; UPDATE payrolls SET status = 'Active' WHERE go_live_date <= CURRENT_DATE AND superseded_date IS NULL AND status != 'Active'; GET DIAGNOSTICS activated_count = ROW_COUNT; UPDATE payrolls SET status = 'Inactive' WHERE superseded_date IS NOT NULL AND superseded_date <= CURRENT_DATE AND status = 'Active'; INSERT INTO payroll_activation_results (activated_count, message) VALUES (activated_count, CASE WHEN activated_count > 0 THEN 'Activated ' || activated_count || ' payroll versions' ELSE 'No payroll versions needed activation' END); RETURN QUERY SELECT * FROM payroll_activation_results; END; $$;


ALTER FUNCTION public.activate_payroll_versions() OWNER TO neondb_owner;

--
-- Name: adjust_date_with_reason(date, text); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.adjust_date_with_reason(p_date date, p_rule_code text) OWNER TO neondb_owner;

--
-- Name: adjust_for_non_business_day(date, text); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.adjust_for_non_business_day(p_date date, p_rule_code text) OWNER TO neondb_owner;

--
-- Name: adjust_for_non_business_day(date, text[], text); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.adjust_for_non_business_day(p_date date, p_regions text[], p_rule_code text) OWNER TO neondb_owner;

--
-- Name: auto_delete_future_dates_on_supersede(); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.auto_delete_future_dates_on_supersede() OWNER TO neondb_owner;

--
-- Name: auto_generate_dates_on_payroll_insert(); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.auto_generate_dates_on_payroll_insert() OWNER TO neondb_owner;

--
-- Name: auto_regenerate_dates_on_schedule_change(); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.auto_regenerate_dates_on_schedule_change() OWNER TO neondb_owner;

--
-- Name: payroll_version_results; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.payroll_version_results OWNER TO neondb_owner;

--
-- Name: create_payroll_version(uuid, date, text, uuid, text, uuid, uuid, uuid, integer, uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.create_payroll_version(p_original_payroll_id uuid, p_go_live_date date, p_version_reason text, p_created_by_user_id uuid, p_new_name text, p_new_client_id uuid, p_new_cycle_id uuid, p_new_date_type_id uuid, p_new_date_value integer, p_new_primary_consultant_user_id uuid, p_new_backup_consultant_user_id uuid, p_new_manager_user_id uuid) OWNER TO neondb_owner;

--
-- Name: decrypt_sensitive(text); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.decrypt_sensitive(encrypted_data text) OWNER TO neondb_owner;

--
-- Name: encrypt_sensitive(text); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.encrypt_sensitive(data text) OWNER TO neondb_owner;

--
-- Name: enforce_entity_relation(); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.enforce_entity_relation() OWNER TO neondb_owner;

--
-- Name: enforce_staff_roles(); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.enforce_staff_roles() OWNER TO neondb_owner;

--
-- Name: payroll_dates; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.payroll_dates OWNER TO neondb_owner;

--
-- Name: COLUMN payroll_dates.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_dates.id IS 'Unique identifier for the payroll date';


--
-- Name: COLUMN payroll_dates.payroll_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_dates.payroll_id IS 'Reference to the payroll this date belongs to';


--
-- Name: COLUMN payroll_dates.original_eft_date; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_dates.original_eft_date IS 'Originally calculated EFT date before adjustments';


--
-- Name: COLUMN payroll_dates.adjusted_eft_date; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_dates.adjusted_eft_date IS 'Final EFT date after holiday and weekend adjustments';


--
-- Name: COLUMN payroll_dates.processing_date; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_dates.processing_date IS 'Date when payroll processing must be completed';


--
-- Name: COLUMN payroll_dates.notes; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_dates.notes IS 'Additional notes about this payroll date';


--
-- Name: COLUMN payroll_dates.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_dates.created_at IS 'Timestamp when the date record was created';


--
-- Name: COLUMN payroll_dates.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_dates.updated_at IS 'Timestamp when the date record was last updated';


--
-- Name: generate_payroll_dates(uuid, date, date, integer); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.generate_payroll_dates(p_payroll_id uuid, p_start_date date, p_end_date date, p_max_dates integer) OWNER TO neondb_owner;

--
-- Name: get_hasura_claims(text); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.get_hasura_claims(user_clerk_id text) OWNER TO neondb_owner;

--
-- Name: latest_payroll_version_results; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.latest_payroll_version_results OWNER TO neondb_owner;

--
-- Name: get_latest_payroll_version(uuid); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.get_latest_payroll_version(p_payroll_id uuid) RETURNS SETOF public.latest_payroll_version_results
    LANGUAGE plpgsql
    AS $$ BEGIN DELETE FROM latest_payroll_version_results WHERE created_at < NOW() - INTERVAL '1 hour'; INSERT INTO latest_payroll_version_results (id, name, version_number, go_live_date, active) SELECT p.id, p.name, p.version_number, p.go_live_date, CASE WHEN p.status = 'Active' THEN true ELSE false END as active FROM payrolls p WHERE (p.id = p_payroll_id OR p.parent_payroll_id = p_payroll_id) AND p.status = 'Active' AND p.superseded_date IS NULL ORDER BY p.version_number DESC LIMIT 1; RETURN QUERY SELECT * FROM latest_payroll_version_results ORDER BY version_number DESC; END; $$;


ALTER FUNCTION public.get_latest_payroll_version(p_payroll_id uuid) OWNER TO neondb_owner;

--
-- Name: payroll_version_history_results; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.payroll_version_history_results OWNER TO neondb_owner;

--
-- Name: get_payroll_version_history(uuid); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.get_payroll_version_history(p_payroll_id uuid) OWNER TO neondb_owner;

--
-- Name: get_user_effective_permissions(uuid); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.get_user_effective_permissions(p_user_id uuid) OWNER TO neondb_owner;

--
-- Name: is_business_day(date); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.is_business_day(p_date date) OWNER TO neondb_owner;

--
-- Name: prevent_duplicate_workday_insert(); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.prevent_duplicate_workday_insert() OWNER TO neondb_owner;

--
-- Name: regenerate_all_payroll_dates(date, date, integer, boolean); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.regenerate_all_payroll_dates(p_start_date date, p_end_date date, p_max_dates_per_payroll integer, p_delete_existing boolean) OWNER TO neondb_owner;

--
-- Name: subtract_business_days(date, integer); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.subtract_business_days(p_date date, p_days integer) OWNER TO neondb_owner;

--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_set_timestamp() OWNER TO neondb_owner;

--
-- Name: update_invoice_total(); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.update_invoice_total() OWNER TO neondb_owner;

--
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_modified_column() OWNER TO neondb_owner;

--
-- Name: update_payroll_dates(); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.update_payroll_dates() OWNER TO neondb_owner;

--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO neondb_owner;

--
-- Name: user_can_perform_action(uuid, text, text); Type: FUNCTION; Schema: public; Owner: neondb_owner
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


ALTER FUNCTION public.user_can_perform_action(p_user_id uuid, p_resource text, p_action text) OWNER TO neondb_owner;

--
-- Name: audit_log; Type: TABLE; Schema: audit; Owner: neondb_owner
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


ALTER TABLE audit.audit_log OWNER TO neondb_owner;

--
-- Name: auth_events; Type: TABLE; Schema: audit; Owner: neondb_owner
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


ALTER TABLE audit.auth_events OWNER TO neondb_owner;

--
-- Name: data_access_log; Type: TABLE; Schema: audit; Owner: neondb_owner
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


ALTER TABLE audit.data_access_log OWNER TO neondb_owner;

--
-- Name: permission_changes; Type: TABLE; Schema: audit; Owner: neondb_owner
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


ALTER TABLE audit.permission_changes OWNER TO neondb_owner;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.permissions OWNER TO neondb_owner;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    display_name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.resources OWNER TO neondb_owner;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.role_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    conditions jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO neondb_owner;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.roles OWNER TO neondb_owner;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_roles OWNER TO neondb_owner;

--
-- Name: permission_usage_report; Type: VIEW; Schema: audit; Owner: neondb_owner
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


ALTER TABLE audit.permission_usage_report OWNER TO neondb_owner;

--
-- Name: slow_queries; Type: TABLE; Schema: audit; Owner: neondb_owner
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


ALTER TABLE audit.slow_queries OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: COLUMN users.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.id IS 'Unique identifier for the user';


--
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.name IS 'User''s full name';


--
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.email IS 'User''s email address (unique)';


--
-- Name: COLUMN users.role; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.role IS 'User''s system role (viewer, consultant, manager, org_admin)';


--
-- Name: COLUMN users.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.created_at IS 'Timestamp when the user was created';


--
-- Name: COLUMN users.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.updated_at IS 'Timestamp when the user was last updated';


--
-- Name: COLUMN users.username; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.username IS 'User''s unique username for login';


--
-- Name: COLUMN users.image; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.image IS 'URL to the user''s profile image';


--
-- Name: COLUMN users.is_staff; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.is_staff IS 'Whether the user is a staff member (vs. external user)';


--
-- Name: COLUMN users.manager_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.manager_id IS 'Reference to the user''s manager';


--
-- Name: COLUMN users.clerk_user_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.users.clerk_user_id IS 'External identifier from Clerk authentication service';


--
-- Name: user_access_summary; Type: VIEW; Schema: audit; Owner: neondb_owner
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


ALTER TABLE audit.user_access_summary OWNER TO neondb_owner;

--
-- Name: users_sync; Type: TABLE; Schema: neon_auth; Owner: neondb_owner
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


ALTER TABLE neon_auth.users_sync OWNER TO neondb_owner;

--
-- Name: COLUMN users_sync.raw_json; Type: COMMENT; Schema: neon_auth; Owner: neondb_owner
--

COMMENT ON COLUMN neon_auth.users_sync.raw_json IS 'Complete JSON data from the authentication provider';


--
-- Name: COLUMN users_sync.id; Type: COMMENT; Schema: neon_auth; Owner: neondb_owner
--

COMMENT ON COLUMN neon_auth.users_sync.id IS 'Unique identifier from the authentication provider';


--
-- Name: COLUMN users_sync.name; Type: COMMENT; Schema: neon_auth; Owner: neondb_owner
--

COMMENT ON COLUMN neon_auth.users_sync.name IS 'User''s full name from authentication provider';


--
-- Name: COLUMN users_sync.email; Type: COMMENT; Schema: neon_auth; Owner: neondb_owner
--

COMMENT ON COLUMN neon_auth.users_sync.email IS 'User''s email address from authentication provider';


--
-- Name: COLUMN users_sync.created_at; Type: COMMENT; Schema: neon_auth; Owner: neondb_owner
--

COMMENT ON COLUMN neon_auth.users_sync.created_at IS 'Timestamp when the user was created in the auth system';


--
-- Name: COLUMN users_sync.updated_at; Type: COMMENT; Schema: neon_auth; Owner: neondb_owner
--

COMMENT ON COLUMN neon_auth.users_sync.updated_at IS 'Timestamp when the user was last updated in the auth system';


--
-- Name: COLUMN users_sync.deleted_at; Type: COMMENT; Schema: neon_auth; Owner: neondb_owner
--

COMMENT ON COLUMN neon_auth.users_sync.deleted_at IS 'Timestamp when the user was deleted in the auth system';


--
-- Name: adjustment_rules; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.adjustment_rules OWNER TO neondb_owner;

--
-- Name: COLUMN adjustment_rules.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.adjustment_rules.id IS 'Unique identifier for the adjustment rule';


--
-- Name: COLUMN adjustment_rules.cycle_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.adjustment_rules.cycle_id IS 'Reference to the payroll cycle this rule applies to';


--
-- Name: COLUMN adjustment_rules.date_type_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.adjustment_rules.date_type_id IS 'Reference to the payroll date type this rule affects';


--
-- Name: COLUMN adjustment_rules.rule_description; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.adjustment_rules.rule_description IS 'Human-readable description of the adjustment rule';


--
-- Name: COLUMN adjustment_rules.rule_code; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.adjustment_rules.rule_code IS 'Code/formula used to calculate date adjustments';


--
-- Name: COLUMN adjustment_rules.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.adjustment_rules.created_at IS 'Timestamp when the rule was created';


--
-- Name: COLUMN adjustment_rules.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.adjustment_rules.updated_at IS 'Timestamp when the rule was last updated';


--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.app_settings (
    id text NOT NULL,
    permissions jsonb
);


ALTER TABLE public.app_settings OWNER TO neondb_owner;

--
-- Name: COLUMN app_settings.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.app_settings.id IS 'Unique identifier for application setting';


--
-- Name: COLUMN app_settings.permissions; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.app_settings.permissions IS 'JSON structure containing application permission configurations';


--
-- Name: billing_event_log; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.billing_event_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid,
    event_type text NOT NULL,
    message text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.billing_event_log OWNER TO neondb_owner;

--
-- Name: billing_invoice; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.billing_invoice OWNER TO neondb_owner;

--
-- Name: billing_invoice_item; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.billing_invoice_item OWNER TO neondb_owner;

--
-- Name: billing_invoices; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.billing_invoices OWNER TO neondb_owner;

--
-- Name: billing_items; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.billing_items OWNER TO neondb_owner;

--
-- Name: billing_plan; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.billing_plan OWNER TO neondb_owner;

--
-- Name: client_billing_assignment; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.client_billing_assignment OWNER TO neondb_owner;

--
-- Name: client_external_systems; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.client_external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    system_id uuid NOT NULL,
    system_client_id character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.client_external_systems OWNER TO neondb_owner;

--
-- Name: COLUMN client_external_systems.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.client_external_systems.id IS 'Unique identifier for the client-system mapping';


--
-- Name: COLUMN client_external_systems.client_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.client_external_systems.client_id IS 'Reference to the client';


--
-- Name: COLUMN client_external_systems.system_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.client_external_systems.system_id IS 'Reference to the external system';


--
-- Name: COLUMN client_external_systems.system_client_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.client_external_systems.system_client_id IS 'Client identifier in the external system';


--
-- Name: COLUMN client_external_systems.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.client_external_systems.created_at IS 'Timestamp when the mapping was created';


--
-- Name: COLUMN client_external_systems.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.client_external_systems.updated_at IS 'Timestamp when the mapping was last updated';


--
-- Name: clients; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.clients OWNER TO neondb_owner;

--
-- Name: COLUMN clients.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.clients.id IS 'Unique identifier for the client';


--
-- Name: COLUMN clients.name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.clients.name IS 'Client company name';


--
-- Name: COLUMN clients.contact_person; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.clients.contact_person IS 'Primary contact person at the client';


--
-- Name: COLUMN clients.contact_email; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.clients.contact_email IS 'Email address for the client contact';


--
-- Name: COLUMN clients.contact_phone; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.clients.contact_phone IS 'Phone number for the client contact';


--
-- Name: COLUMN clients.active; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.clients.active IS 'Whether the client is currently active';


--
-- Name: COLUMN clients.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.clients.created_at IS 'Timestamp when the client was created';


--
-- Name: COLUMN clients.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.clients.updated_at IS 'Timestamp when the client was last updated';


--
-- Name: payroll_cycles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payroll_cycles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name public.payroll_cycle_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payroll_cycles OWNER TO neondb_owner;

--
-- Name: COLUMN payroll_cycles.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_cycles.id IS 'Unique identifier for the payroll cycle';


--
-- Name: COLUMN payroll_cycles.name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_cycles.name IS 'Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.)';


--
-- Name: COLUMN payroll_cycles.description; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_cycles.description IS 'Detailed description of the payroll cycle';


--
-- Name: COLUMN payroll_cycles.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_cycles.created_at IS 'Timestamp when the cycle was created';


--
-- Name: COLUMN payroll_cycles.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_cycles.updated_at IS 'Timestamp when the cycle was last updated';


--
-- Name: payroll_date_types; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.payroll_date_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name public.payroll_date_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payroll_date_types OWNER TO neondb_owner;

--
-- Name: COLUMN payroll_date_types.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_date_types.id IS 'Unique identifier for the payroll date type';


--
-- Name: COLUMN payroll_date_types.name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_date_types.name IS 'Name of the date type (Fixed, Last Working Day, etc.)';


--
-- Name: COLUMN payroll_date_types.description; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_date_types.description IS 'Detailed description of how this date type works';


--
-- Name: COLUMN payroll_date_types.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_date_types.created_at IS 'Timestamp when the date type was created';


--
-- Name: COLUMN payroll_date_types.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payroll_date_types.updated_at IS 'Timestamp when the date type was last updated';


--
-- Name: payrolls; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.payrolls OWNER TO neondb_owner;

--
-- Name: COLUMN payrolls.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.id IS 'Unique identifier for the payroll';


--
-- Name: COLUMN payrolls.client_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.client_id IS 'Reference to the client this payroll belongs to';


--
-- Name: COLUMN payrolls.name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.name IS 'Name of the payroll';


--
-- Name: COLUMN payrolls.cycle_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.cycle_id IS 'Reference to the payroll cycle';


--
-- Name: COLUMN payrolls.date_type_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.date_type_id IS 'Reference to the payroll date type';


--
-- Name: COLUMN payrolls.date_value; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.date_value IS 'Specific value for date calculation (e.g., day of month)';


--
-- Name: COLUMN payrolls.primary_consultant_user_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.primary_consultant_user_id IS 'Primary consultant responsible for this payroll';


--
-- Name: COLUMN payrolls.backup_consultant_user_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.backup_consultant_user_id IS 'Backup consultant for this payroll';


--
-- Name: COLUMN payrolls.manager_user_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.manager_user_id IS 'Manager overseeing this payroll';


--
-- Name: COLUMN payrolls.processing_days_before_eft; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.processing_days_before_eft IS 'Number of days before EFT that processing must complete';


--
-- Name: COLUMN payrolls.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.created_at IS 'Timestamp when the payroll was created';


--
-- Name: COLUMN payrolls.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.updated_at IS 'Timestamp when the payroll was last updated';


--
-- Name: COLUMN payrolls.payroll_system; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.payroll_system IS 'External payroll system used for this client';


--
-- Name: COLUMN payrolls.status; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.status IS 'Current status of the payroll (Implementation, Active, Inactive)';


--
-- Name: COLUMN payrolls.processing_time; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.processing_time IS 'Number of hours required to process this payroll';


--
-- Name: COLUMN payrolls.employee_count; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.employee_count IS 'Number of employees in this payroll';


--
-- Name: COLUMN payrolls.go_live_date; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.payrolls.go_live_date IS 'The date when the payroll went live in the system';


--
-- Name: current_payrolls; Type: VIEW; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.current_payrolls OWNER TO neondb_owner;

--
-- Name: external_systems; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.external_systems OWNER TO neondb_owner;

--
-- Name: COLUMN external_systems.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.external_systems.id IS 'Unique identifier for the external system';


--
-- Name: COLUMN external_systems.name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.external_systems.name IS 'Name of the external system';


--
-- Name: COLUMN external_systems.url; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.external_systems.url IS 'URL endpoint for the external system';


--
-- Name: COLUMN external_systems.description; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.external_systems.description IS 'Description of the external system and its purpose';


--
-- Name: COLUMN external_systems.icon; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.external_systems.icon IS 'Path or reference to the system icon';


--
-- Name: COLUMN external_systems.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.external_systems.created_at IS 'Timestamp when the system was created';


--
-- Name: COLUMN external_systems.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.external_systems.updated_at IS 'Timestamp when the system was last updated';


--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.feature_flags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feature_name text NOT NULL,
    is_enabled boolean DEFAULT false,
    allowed_roles jsonb DEFAULT '[]'::jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.feature_flags OWNER TO neondb_owner;

--
-- Name: COLUMN feature_flags.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.feature_flags.id IS 'Unique identifier for the feature flag';


--
-- Name: COLUMN feature_flags.feature_name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.feature_flags.feature_name IS 'Name of the feature controlled by this flag';


--
-- Name: COLUMN feature_flags.is_enabled; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.feature_flags.is_enabled IS 'Whether the feature is currently enabled';


--
-- Name: COLUMN feature_flags.allowed_roles; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.feature_flags.allowed_roles IS 'JSON array of roles that can access this feature';


--
-- Name: COLUMN feature_flags.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.feature_flags.updated_at IS 'Timestamp when the feature flag was last updated';


--
-- Name: holidays; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.holidays OWNER TO neondb_owner;

--
-- Name: COLUMN holidays.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.id IS 'Unique identifier for the holiday';


--
-- Name: COLUMN holidays.date; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.date IS 'Date of the holiday';


--
-- Name: COLUMN holidays.local_name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.local_name IS 'Name of the holiday in local language';


--
-- Name: COLUMN holidays.name; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.name IS 'Name of the holiday in English';


--
-- Name: COLUMN holidays.country_code; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.country_code IS 'ISO country code where the holiday is observed';


--
-- Name: COLUMN holidays.region; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.region IS 'Array of regions within the country where the holiday applies';


--
-- Name: COLUMN holidays.is_fixed; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.is_fixed IS 'Whether the holiday occurs on the same date each year';


--
-- Name: COLUMN holidays.is_global; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.is_global IS 'Whether the holiday is observed globally';


--
-- Name: COLUMN holidays.launch_year; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.launch_year IS 'First year when the holiday was observed';


--
-- Name: COLUMN holidays.types; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.types IS 'Array of holiday types (e.g., public, bank, religious)';


--
-- Name: COLUMN holidays.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.created_at IS 'Timestamp when the holiday record was created';


--
-- Name: COLUMN holidays.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.holidays.updated_at IS 'Timestamp when the holiday record was last updated';


--
-- Name: leave; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.leave OWNER TO neondb_owner;

--
-- Name: COLUMN leave.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.leave.id IS 'Unique identifier for the leave record';


--
-- Name: COLUMN leave.user_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.leave.user_id IS 'Reference to the user taking leave';


--
-- Name: COLUMN leave.start_date; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.leave.start_date IS 'First day of the leave period';


--
-- Name: COLUMN leave.end_date; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.leave.end_date IS 'Last day of the leave period';


--
-- Name: COLUMN leave.leave_type; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.leave.leave_type IS 'Type of leave (vacation, sick, personal, etc.)';


--
-- Name: COLUMN leave.reason; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.leave.reason IS 'Reason provided for the leave request';


--
-- Name: COLUMN leave.status; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.leave.status IS 'Current status of the leave request (Pending, Approved, Denied)';


--
-- Name: notes; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.notes OWNER TO neondb_owner;

--
-- Name: COLUMN notes.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.notes.id IS 'Unique identifier for the note';


--
-- Name: COLUMN notes.entity_type; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.notes.entity_type IS 'Type of entity this note is attached to (client, payroll, etc.)';


--
-- Name: COLUMN notes.entity_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.notes.entity_id IS 'Identifier of the entity this note is attached to';


--
-- Name: COLUMN notes.user_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.notes.user_id IS 'User who created the note';


--
-- Name: COLUMN notes.content; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.notes.content IS 'Content of the note';


--
-- Name: COLUMN notes.is_important; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.notes.is_important IS 'Whether the note is flagged as important';


--
-- Name: COLUMN notes.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.notes.created_at IS 'Timestamp when the note was created';


--
-- Name: COLUMN notes.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.notes.updated_at IS 'Timestamp when the note was last updated';


--
-- Name: payroll_assignment_audit; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.payroll_assignment_audit OWNER TO neondb_owner;

--
-- Name: payroll_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.payroll_assignments OWNER TO neondb_owner;

--
-- Name: payroll_dashboard_stats; Type: MATERIALIZED VIEW; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.payroll_dashboard_stats OWNER TO neondb_owner;

--
-- Name: payroll_triggers_status; Type: VIEW; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.payroll_triggers_status OWNER TO neondb_owner;

--
-- Name: users_role_backup; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users_role_backup (
    id uuid,
    email character varying(255),
    role public.user_role,
    created_at timestamp with time zone
);


ALTER TABLE public.users_role_backup OWNER TO neondb_owner;

--
-- Name: work_schedule; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public.work_schedule OWNER TO neondb_owner;

--
-- Name: COLUMN work_schedule.id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.work_schedule.id IS 'Unique identifier for the work schedule entry';


--
-- Name: COLUMN work_schedule.user_id; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.work_schedule.user_id IS 'Reference to the user this schedule belongs to';


--
-- Name: COLUMN work_schedule.work_day; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.work_schedule.work_day IS 'Day of the week (Monday, Tuesday, etc.)';


--
-- Name: COLUMN work_schedule.work_hours; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.work_schedule.work_hours IS 'Number of hours worked on this day';


--
-- Name: COLUMN work_schedule.created_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.work_schedule.created_at IS 'Timestamp when the schedule entry was created';


--
-- Name: COLUMN work_schedule.updated_at; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.work_schedule.updated_at IS 'Timestamp when the schedule entry was last updated';


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: audit; Owner: neondb_owner
--

COPY audit.audit_log (id, event_time, user_id, user_email, user_role, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent, session_id, request_id, success, error_message, metadata, created_at) FROM stdin;
5ac90f4c-affe-4c07-8096-95b604161135	2025-06-12 08:21:38.954084+00	\N	\N	\N	UPDATE	clients	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	{"id": "69cb7e99-72a2-41b2-9fe0-08b4a2d6857c", "name": "Acme Pty Ltd", "active": false, "created_at": "2025-05-23T06:45:00.498027+00:00", "updated_at": "2025-05-31T23:05:02.669919+00:00", "contact_email": "jane.doe@test.com", "contact_phone": "0400000000", "contact_person": "Jane Doe"}	{"id": "69cb7e99-72a2-41b2-9fe0-08b4a2d6857c", "name": "Acme Pty Ltd", "active": true, "created_at": "2025-05-23T06:45:00.498027+00:00", "updated_at": "2025-06-12T08:21:38.954084+00:00", "contact_email": "jane.doe@test.com", "contact_phone": "0400000000", "contact_person": "Jane Doe"}	\N	\N	\N	\N	t	\N	\N	2025-06-12 08:21:38.954084+00
1ce5913f-2b9a-4df8-bbeb-b31a72043451	2025-06-12 10:12:28.428792+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1TmszY2FDNkc4dGxvaHJncmtwd2Z6UXdZdiIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-30T17:04:22.086804+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1TmszY2FDNkc4dGxvaHJncmtwd2Z6UXdZdiIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "Test123", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:12:28.428792+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-12 10:12:28.428792+00
8d56cd8e-2b20-4e3e-9542-369c55e79d58	2025-06-12 10:27:30.244003+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1TmszY2FDNkc4dGxvaHJncmtwd2Z6UXdZdiIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "Test123", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:12:28.428792+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "Test1234", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:27:30.244003+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-12 10:27:30.244003+00
87f97c85-8386-4ffd-9be2-59c904c6ab8c	2025-06-12 10:27:58.730883+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "Test1234", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:27:30.244003+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "Test123", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:27:58.730883+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-12 10:27:58.730883+00
943d517d-ff4c-4058-ab14-817ad1b8374f	2025-06-12 10:45:49.238412+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "Test123", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:27:58.730883+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "Test1234", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:45:49.238412+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-12 10:45:49.238412+00
d884c085-7c0d-4eec-b329-db5ed0830e79	2025-06-12 10:48:48.708996+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "Test1234", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:45:49.238412+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:48:48.708996+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-12 10:48:48.708996+00
a224443e-1553-457b-a7ee-f8c3eee30f96	2025-06-14 05:33:18.845411+00	\N	\N	\N	UPDATE	payrolls	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-02T07:57:50.328+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "primary_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "processing_days_before_eft": 5}	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-14T05:33:18.784+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "primary_consultant_user_id": "7898704c-ee5c-4ade-81f3-80a4388413fb", "processing_days_before_eft": 5}	\N	\N	\N	\N	t	\N	\N	2025-06-14 05:33:18.845411+00
cc3429db-3ae5-4b02-9592-9204a4961d28	2025-06-14 14:34:27.794888+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:48:48.708996+00:00", "clerk_user_id": "user_2uNk3caC6G8tlohrgrkpwfzQwYv", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:48:48.708996+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-14 14:34:27.794888+00
576c4e79-c2b4-463f-b319-18915752473b	2025-06-15 11:27:40.731723+00	\N	\N	\N	UPDATE	users	7898704c-ee5c-4ade-81f3-80a4388413fb	{"id": "7898704c-ee5c-4ade-81f3-80a4388413fb", "name": "Test User", "role": "consultant", "email": "nathan.harris@invenco.net", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ4cUlkQmNQSldiUHNNZzc1Tklkc0VsbW9VVCIsImluaXRpYWxzIjoiVFUifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-31T02:40:37.787341+00:00", "manager_id": null, "updated_at": "2025-05-31T03:30:23.914982+00:00", "clerk_user_id": "user_2xqIdBcPJWbPsMg75NIdsElmoUT", "deactivated_at": null, "deactivated_by": null}	{"id": "7898704c-ee5c-4ade-81f3-80a4388413fb", "name": "Test User", "role": "consultant", "email": "nathan.harris@invenco.net", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ4cUlkQmNQSldiUHNNZzc1Tklkc0VsbW9VVCIsImluaXRpYWxzIjoiVFUifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-31T02:40:37.787341+00:00", "manager_id": null, "updated_at": "2025-05-31T03:30:23.914982+00:00", "clerk_user_id": "user_2yXhEiNJEhLR25QDFnqD4dzpkkL", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-15 11:27:40.731723+00
0aff2fa6-ed0e-4338-89f6-1ce2ddf42a75	2025-06-15 11:27:40.767712+00	\N	\N	\N	UPDATE	users	e4313314-b89e-4346-9bb5-3aaf464c7152	{"id": "e4313314-b89e-4346-9bb5-3aaf464c7152", "name": "Jill Viewer", "role": "viewer", "email": "viewer@example.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1VFS1N4Y2xkczc0TnYwaWZDZW5iOWs4dyIsImluaXRpYWxzIjoiSlYifQ", "is_staff": false, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-23T06:45:00.468049+00:00", "clerk_user_id": "user_2uCUEKSxclds74Nv0ifCenb9k8w", "deactivated_at": null, "deactivated_by": null}	{"id": "e4313314-b89e-4346-9bb5-3aaf464c7152", "name": "Jill Viewer", "role": "viewer", "email": "viewer@example.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1VFS1N4Y2xkczc0TnYwaWZDZW5iOWs4dyIsImluaXRpYWxzIjoiSlYifQ", "is_staff": false, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-23T06:45:00.468049+00:00", "clerk_user_id": "user_2yXhB08hGyXX7p8C8pWg5yPceIx", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-15 11:27:40.767712+00
5003428c-1ee8-4d53-904f-1ecd71507630	2025-06-15 11:27:40.78472+00	\N	\N	\N	UPDATE	users	22a368d4-5d3f-4026-840c-55af6fb16972	{"id": "22a368d4-5d3f-4026-840c-55af6fb16972", "name": "Jim Consultant", "role": "consultant", "email": "consultant@example.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1U5cEtmN1JQMkZpT1JISlZNNUlIMFBkMSIsImluaXRpYWxzIjoiSkMifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-31T00:28:51.38901+00:00", "clerk_user_id": "user_2uCU9pKf7RP2FiORHJVM5IH0Pd1", "deactivated_at": null, "deactivated_by": null}	{"id": "22a368d4-5d3f-4026-840c-55af6fb16972", "name": "Jim Consultant", "role": "consultant", "email": "consultant@example.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1U5cEtmN1JQMkZpT1JISlZNNUlIMFBkMSIsImluaXRpYWxzIjoiSkMifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-31T00:28:51.38901+00:00", "clerk_user_id": "user_2yXh6Wu8FUd7VbPEB56M0XfXsio", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-15 11:27:40.78472+00
9fecac1c-c067-4b75-8edc-1830238eed07	2025-06-15 11:27:40.795706+00	\N	\N	\N	UPDATE	users	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	{"id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "name": "Jane Manager", "role": "manager", "email": "manager@example.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1U1TzV2Z0xwcXd0Tzh4Y3JTWHRSRWcySyIsImluaXRpYWxzIjoiSk0ifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-23T06:45:00.468049+00:00", "clerk_user_id": "user_2uCU5O5vgLpqwtO8xcrSXtREg2K", "deactivated_at": null, "deactivated_by": null}	{"id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "name": "Jane Manager", "role": "manager", "email": "manager@example.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1U1TzV2Z0xwcXd0Tzh4Y3JTWHRSRWcySyIsImluaXRpYWxzIjoiSk0ifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-23T06:45:00.468049+00:00", "clerk_user_id": "user_2yXh2JHR2xtsfp16fkTdXHF9P3c", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-15 11:27:40.795706+00
0eb83675-2c6c-40a0-81c7-275a93f09814	2025-06-15 11:27:40.812793+00	\N	\N	\N	UPDATE	users	9aed2a64-0407-4dff-a621-2b7013e1713a	{"id": "9aed2a64-0407-4dff-a621-2b7013e1713a", "name": "John Admin", "role": "org_admin", "email": "admin@example.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1R0RUJlbzcwdEFUMEdJaGliV2FRUTRpViIsImluaXRpYWxzIjoiSkEifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-23T06:45:00.468049+00:00", "clerk_user_id": "user_2uCTtEBeo70tAT0GIhibWaQQ4iV", "deactivated_at": null, "deactivated_by": null}	{"id": "9aed2a64-0407-4dff-a621-2b7013e1713a", "name": "John Admin", "role": "org_admin", "email": "admin@example.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1R0RUJlbzcwdEFUMEdJaGliV2FRUTRpViIsImluaXRpYWxzIjoiSkEifQ", "is_staff": true, "username": null, "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-05-23T06:45:00.468049+00:00", "clerk_user_id": "user_2yXgxgRHxUilIyqE04jWreCRoO4", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-15 11:27:40.812793+00
3759bae4-d6d1-4156-8647-23c0ae28629e	2025-06-15 12:08:43.356573+00	\N	\N	\N	DELETE	users	f07a0f7d-2af1-4464-a93a-4353d99ecdd7	{"id": "f07a0f7d-2af1-4464-a93a-4353d99ecdd7", "name": "Katrina Harris", "role": "org_admin", "email": "katrina.harris@findex.com.au", "image": null, "is_staff": true, "username": null, "is_active": true, "created_at": "2025-06-02T09:35:08.804314+00:00", "manager_id": null, "updated_at": "2025-06-02T09:35:08.804314+00:00", "clerk_user_id": null, "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	\N	t	\N	\N	2025-06-15 12:08:43.356573+00
0f819363-f0c1-4303-8b3f-61690d36b64d	2025-06-16 03:06:30.988734+00	\N	\N	\N	UPDATE	payrolls	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-14T05:33:18.784+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "primary_consultant_user_id": "7898704c-ee5c-4ade-81f3-80a4388413fb", "processing_days_before_eft": 5}	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-16T03:06:30.988734+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "7898704c-ee5c-4ade-81f3-80a4388413fb", "primary_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "processing_days_before_eft": 5}	\N	\N	\N	\N	t	\N	\N	2025-06-16 03:06:30.988734+00
83a21abf-0d80-47d6-985b-acf62dfe79e8	2025-06-16 06:43:57.776055+00	\N	\N	\N	UPDATE	payrolls	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-16T03:06:30.988734+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "7898704c-ee5c-4ade-81f3-80a4388413fb", "primary_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "processing_days_before_eft": 5}	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-16T06:43:57.776055+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "primary_consultant_user_id": "7898704c-ee5c-4ade-81f3-80a4388413fb", "processing_days_before_eft": 5}	\N	\N	\N	\N	t	\N	\N	2025-06-16 06:43:57.776055+00
e79dd5cf-858e-46ad-8b1f-325b705ccf23	2025-06-16 06:47:15.930885+00	\N	\N	\N	UPDATE	payrolls	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-16T06:43:57.776055+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "primary_consultant_user_id": "7898704c-ee5c-4ade-81f3-80a4388413fb", "processing_days_before_eft": 5}	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-16T06:47:15.930885+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "9aed2a64-0407-4dff-a621-2b7013e1713a", "primary_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "processing_days_before_eft": 5}	\N	\N	\N	\N	t	\N	\N	2025-06-16 06:47:15.930885+00
d187b53d-9f6a-41aa-b258-cb574e6e9a70	2025-06-16 08:14:15.88828+00	\N	\N	\N	UPDATE	payrolls	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday Moving", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-16T06:47:15.930885+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "9aed2a64-0407-4dff-a621-2b7013e1713a", "primary_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "processing_days_before_eft": 5}	{"id": "17f681eb-3c58-4aa7-b6c1-9e75e2771a1d", "name": "Weekly Payroll - Tuesday", "status": "Active", "cycle_id": "713e04b1-e876-4169-8a05-f6846b51eb68", "client_id": "65e17d2e-df6e-448b-abb3-eea9d566a239", "created_at": "2025-05-31T12:31:33.576415+00:00", "date_value": 2, "updated_at": "2025-06-16T08:14:15.88828+00:00", "date_type_id": "7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7", "go_live_date": "2024-02-01", "employee_count": 18, "payroll_system": null, "version_number": 1, "version_reason": null, "manager_user_id": "0727c441-3fa7-44c2-b8f3-4e0b77986ac1", "processing_time": 4, "superseded_date": null, "parent_payroll_id": null, "created_by_user_id": null, "backup_consultant_user_id": "9aed2a64-0407-4dff-a621-2b7013e1713a", "primary_consultant_user_id": "22a368d4-5d3f-4026-840c-55af6fb16972", "processing_days_before_eft": 5}	\N	\N	\N	\N	t	\N	\N	2025-06-16 08:14:15.88828+00
5769e35d-c536-4a6a-9471-8eaca4ecdaff	2025-06-16 11:12:16.198006+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMejE1UlFaTHFhUnA3WGpQaFdEbWIwMWVsX3FZVWhkbE9WemFxd2k2cjlISVhHUzgwaGhnPXMxMDAwLWMiLCJzIjoiSGwvSEx2aGQyakJoQWNFelNKWjVHdzZtYWlFMFJQYnNHTEZCZ0dia2VkSSJ9", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-12T10:48:48.708996+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJyaWQiOiJ1c2VyXzJ5VTdOc3BnOU5lbW15MUZkS0UxU0ZJb2ZtcyIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-16T11:12:16.198006+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-16 11:12:16.198006+00
82623575-7496-4a3d-9650-6ac0fbf2c03d	2025-06-17 04:55:12.724268+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJyaWQiOiJ1c2VyXzJ5VTdOc3BnOU5lbW15MUZkS0UxU0ZJb2ZtcyIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-16T11:12:16.198006+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "org_admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJyaWQiOiJ1c2VyXzJ5VTdOc3BnOU5lbW15MUZkS0UxU0ZJb2ZtcyIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-16T11:12:16.198006+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-17 04:55:12.724268+00
eb8c9cc0-d20b-44ee-819f-78c834801f0b	2025-06-17 04:57:00.654567+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "org_admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJyaWQiOiJ1c2VyXzJ5VTdOc3BnOU5lbW15MUZkS0UxU0ZJb2ZtcyIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-16T11:12:16.198006+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJyaWQiOiJ1c2VyXzJ5VTdOc3BnOU5lbW15MUZkS0UxU0ZJb2ZtcyIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-16T11:12:16.198006+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-17 04:57:00.654567+00
c3f21a2b-6ff5-4266-967d-fbbd78b640ad	2025-06-17 05:02:38.188229+00	\N	\N	\N	UPDATE	users	d9ac8a7b-f679-49a1-8c99-837eb977578b	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "admin", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJyaWQiOiJ1c2VyXzJ5VTdOc3BnOU5lbW15MUZkS0UxU0ZJb2ZtcyIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-16T11:12:16.198006+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	{"id": "d9ac8a7b-f679-49a1-8c99-837eb977578b", "name": "Nathan Harris", "role": "developer", "email": "nathan.harris02@gmail.com", "image": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJyaWQiOiJ1c2VyXzJ5VTdOc3BnOU5lbW15MUZkS0UxU0ZJb2ZtcyIsImluaXRpYWxzIjoiTkgifQ", "is_staff": true, "username": "", "is_active": true, "created_at": "2025-05-23T06:45:00.468049+00:00", "manager_id": null, "updated_at": "2025-06-16T11:12:16.198006+00:00", "clerk_user_id": "user_2yU7Nspg9Nemmy1FdKE1SFIofms", "deactivated_at": null, "deactivated_by": null}	\N	\N	\N	\N	t	\N	\N	2025-06-17 05:02:38.188229+00
\.


--
-- Data for Name: auth_events; Type: TABLE DATA; Schema: audit; Owner: neondb_owner
--

COPY audit.auth_events (id, event_time, event_type, user_id, user_email, ip_address, user_agent, success, failure_reason, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: data_access_log; Type: TABLE DATA; Schema: audit; Owner: neondb_owner
--

COPY audit.data_access_log (id, accessed_at, user_id, resource_type, resource_id, access_type, data_classification, fields_accessed, query_executed, row_count, ip_address, session_id, metadata) FROM stdin;
\.


--
-- Data for Name: permission_changes; Type: TABLE DATA; Schema: audit; Owner: neondb_owner
--

COPY audit.permission_changes (id, changed_at, changed_by_user_id, target_user_id, target_role_id, change_type, permission_type, old_permissions, new_permissions, reason, approved_by_user_id, metadata) FROM stdin;
\.


--
-- Data for Name: slow_queries; Type: TABLE DATA; Schema: audit; Owner: neondb_owner
--

COPY audit.slow_queries (id, query_start, query_duration, query, user_id, application_name, client_addr, created_at) FROM stdin;
\.


--
-- Data for Name: users_sync; Type: TABLE DATA; Schema: neon_auth; Owner: neondb_owner
--

COPY neon_auth.users_sync (raw_json, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: adjustment_rules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.adjustment_rules (id, cycle_id, date_type_id, rule_description, rule_code, created_at, updated_at) FROM stdin;
3a83eb56-0544-4dd7-9326-c3019400d225	713e04b1-e876-4169-8a05-f6846b51eb68	7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7	Previous Business Day for Weekly	previous	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
623f618e-1062-46a9-b8db-210690e2b20d	60490f74-a5b9-430a-ad4a-ade8f7393007	f9914e22-da9e-4743-8d5d-365ba51ef854	Next Business Day for Bi-Monthly SOM	next	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
5f98483d-64e1-4ea0-9635-d9e97a88ab0e	d96980a2-3146-4969-87bc-d50fdf4fccd3	f9914e22-da9e-4743-8d5d-365ba51ef854	Next Business Day for Monthly SOM	next	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
13c8e8e7-4834-449b-a03e-b2cba06fd947	60490f74-a5b9-430a-ad4a-ade8f7393007	68001232-8ac9-442d-bbe0-287569f2b144	Previous Business Day for Bi-Monthly EOM	previous	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
81401377-e1c8-489c-96ff-433c425954be	d96980a2-3146-4969-87bc-d50fdf4fccd3	68001232-8ac9-442d-bbe0-287569f2b144	Previous Business Day for Monthly EOM	previous	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
886e0738-3aa4-4780-9672-bf9017be2888	12570d45-fa3f-406a-80bc-1f412fe2d5f3	68001232-8ac9-442d-bbe0-287569f2b144	Previous Business Day for Quarterly	previous	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
3fdcc414-1b5b-4d00-bb93-d19f6b3215fe	d96980a2-3146-4969-87bc-d50fdf4fccd3	b29b56fc-b098-4cac-8dab-868d935986f2	Previous Business Day for Monthly Fixed	previous	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
78007671-2f67-4264-8b21-8bf42ecd1514	769d0c73-f918-4734-8cc9-45b1284c9ce8	d11a8b82-ec8f-4300-a397-37e8b0d54114	Previous Business Day for Fortnightly	previous	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
8855ca08-4cb7-4df1-90fb-d139cc7ae829	769d0c73-f918-4734-8cc9-45b1284c9ce8	2af96485-ff65-42e8-b300-3ad9308a7e2b	Previous Business Day for Fortnightly	previous	2025-05-23 06:25:06.950032+00	2025-05-23 06:25:06.950032+00
\.


--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.app_settings (id, permissions) FROM stdin;
\.


--
-- Data for Name: billing_event_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.billing_event_log (id, invoice_id, event_type, message, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: billing_invoice; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.billing_invoice (id, client_id, billing_period_start, billing_period_end, issued_date, due_date, status, notes, total_amount, currency, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: billing_invoice_item; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.billing_invoice_item (id, invoice_id, description, quantity, unit_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: billing_invoices; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.billing_invoices (id, client_id, invoice_number, billing_period_start, billing_period_end, total_amount, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: billing_items; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.billing_items (id, invoice_id, description, quantity, unit_price, payroll_id, created_at) FROM stdin;
\.


--
-- Data for Name: billing_plan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.billing_plan (id, name, description, rate_per_payroll, currency, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: client_billing_assignment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.client_billing_assignment (id, client_id, billing_plan_id, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: client_external_systems; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.client_external_systems (id, client_id, system_id, system_client_id, created_at, updated_at) FROM stdin;
f1ccd01a-0cf7-430e-bd38-c3fcacba7581	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	10bafd07-102c-4c1b-aa85-db78b2255912	CUST-69cb7e99	2025-05-23 07:53:29.422138+00	2025-05-23 07:53:29.422138+00
72c723f6-ec9d-4392-9a42-e3e1df9634db	65e17d2e-df6e-448b-abb3-eea9d566a239	10bafd07-102c-4c1b-aa85-db78b2255912	CUST-65e17d2e	2025-05-23 07:53:29.422138+00	2025-05-23 07:53:29.422138+00
b1bfb0c4-fc3c-44ea-8636-caecc0737249	ed90f235-e212-4ecd-aedf-402a2a91125f	10bafd07-102c-4c1b-aa85-db78b2255912	CUST-ed90f235	2025-05-23 07:53:29.422138+00	2025-05-23 07:53:29.422138+00
1156f020-948c-4de1-b342-2151cdd0cc42	4ecd4666-c94e-43ba-97dc-3c78c8badffb	10bafd07-102c-4c1b-aa85-db78b2255912	CUST-4ecd4666	2025-05-23 07:53:29.422138+00	2025-05-23 07:53:29.422138+00
dee13e49-5ebf-455a-9e99-2b38345fb9b1	92ff771d-d468-4c91-ae58-d66b3ce1bd22	10bafd07-102c-4c1b-aa85-db78b2255912	CUST-92ff771d	2025-05-23 07:53:29.422138+00	2025-05-23 07:53:29.422138+00
961ae759-1afa-4cf9-be3e-71587aaffc84	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	281e3769-d681-479a-9bcb-43b7d385ea44	CUST-69cb7e99	2025-05-23 07:56:17.378876+00	2025-05-23 07:56:17.378876+00
f7e97177-171e-4fc4-a0ca-77a5e719d9cc	65e17d2e-df6e-448b-abb3-eea9d566a239	281e3769-d681-479a-9bcb-43b7d385ea44	CUST-65e17d2e	2025-05-23 07:56:17.378876+00	2025-05-23 07:56:17.378876+00
3dcc9cc8-c48b-497e-9151-14f159ad6166	ed90f235-e212-4ecd-aedf-402a2a91125f	281e3769-d681-479a-9bcb-43b7d385ea44	CUST-ed90f235	2025-05-23 07:56:17.378876+00	2025-05-23 07:56:17.378876+00
89b092c3-558b-4cab-a7b5-aa357ae61dbb	4ecd4666-c94e-43ba-97dc-3c78c8badffb	281e3769-d681-479a-9bcb-43b7d385ea44	CUST-4ecd4666	2025-05-23 07:56:17.378876+00	2025-05-23 07:56:17.378876+00
fb4bf2b5-68e4-4973-afeb-ba330339adbb	92ff771d-d468-4c91-ae58-d66b3ce1bd22	281e3769-d681-479a-9bcb-43b7d385ea44	CUST-92ff771d	2025-05-23 07:56:17.378876+00	2025-05-23 07:56:17.378876+00
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.clients (id, name, contact_person, contact_email, contact_phone, active, created_at, updated_at) FROM stdin;
65e17d2e-df6e-448b-abb3-eea9d566a239	Bluewave Consulting	Contact 2	client2@demo.com	040000002	t	2025-05-23 06:45:00.498027+00	2025-05-23 06:45:00.498027+00
ed90f235-e212-4ecd-aedf-402a2a91125f	Greenfields Group	Contact 3	client3@demo.com	040000003	t	2025-05-23 06:45:00.498027+00	2025-05-23 06:45:00.498027+00
4ecd4666-c94e-43ba-97dc-3c78c8badffb	Redstone Holdings	Contact 4	client4@demo.com	040000004	t	2025-05-23 06:45:00.498027+00	2025-05-23 06:45:00.498027+00
92ff771d-d468-4c91-ae58-d66b3ce1bd22	Zenith Solutions	Contact 5	client5@demo.com	040000005	t	2025-05-23 06:45:00.498027+00	2025-05-23 06:45:00.498027+00
69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	Acme Pty Ltd	Jane Doe	jane.doe@test.com	0400000000	t	2025-05-23 06:45:00.498027+00	2025-06-12 08:21:38.954084+00
\.


--
-- Data for Name: external_systems; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.external_systems (id, name, url, description, icon, created_at, updated_at) FROM stdin;
281e3769-d681-479a-9bcb-43b7d385ea44	Pay Metrics	https://paymetrics.com	Payroll Provider	paymetrics	2025-05-23 06:45:00.417012+00	2025-05-23 06:45:00.417012+00
10bafd07-102c-4c1b-aa85-db78b2255912	Key Pay	https://keypay.com	Payroll Provider	keypay	2025-05-23 06:45:00.445104+00	2025-05-23 06:45:00.445104+00
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.feature_flags (id, feature_name, is_enabled, allowed_roles, updated_at) FROM stdin;
\.


--
-- Data for Name: holidays; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.holidays (id, date, local_name, name, country_code, region, is_fixed, is_global, launch_year, types, created_at, updated_at) FROM stdin;
d1ff969c-e67c-4e9a-9539-1d91088be3d6	2025-01-01	New Year's Day	New Year's Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
8338ce23-872c-4e38-8b8f-51fa281c04d3	2025-01-27	Australia Day	Australia Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
a6fcf465-9291-4257-ab98-6a1e2baced3d	2025-03-03	Labour Day	Labour Day	AU	{WA}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
50a46129-2f51-4653-96ad-b6fd1ae880e1	2025-03-10	March Public Holiday	March Public Holiday	AU	{SA}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
38f53919-8a12-4b07-b008-20fea795fa4a	2025-04-18	Good Friday	Good Friday	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
f3d780bf-a368-490b-aea4-a0756d6c8ab8	2025-04-19	Easter Eve	Holy Saturday	AU	{ACT,NSW,NT,QLD,SA,VIC}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
71b9e4aa-f2bf-40e3-b235-98ea95cde0a7	2025-04-20	Easter Sunday	Easter Sunday	AU	{ACT,NSW,NT,QLD,SA,VIC,WA}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
9e191e40-cab2-4aa1-8bba-06b8e685c5bb	2025-04-21	Easter Monday	Easter Monday	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
cc6b4648-d9c5-4bdc-8267-d2589616c321	2025-04-25	Anzac Day	Anzac Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
b287842a-7628-4008-8963-383616e2da88	2025-05-05	May Day	May Day	AU	{NT}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
75961d07-670c-4fa3-a7b4-78cd120fdab2	2025-06-02	Reconciliation Day	Reconciliation Day	AU	{ACT}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
1c9cc8ad-800f-4afa-bd0a-cdcacce87779	2025-06-09	King's Birthday	King's Birthday	AU	{ACT,NSW,NT,SA,TAS,VIC}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
8bbe0fb7-77ea-41ac-b744-f12999008920	2025-08-04	Picnic Day	Picnic Day	AU	{NT}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
860f59ba-844b-4c78-815e-d00cf0d375f9	2025-09-29	King's Birthday	King's Birthday	AU	{WA}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
1142d00f-c1cc-4934-8672-dff5c4d3abcb	2025-10-06	Labour Day	Labour Day	AU	{ACT,NSW,SA}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
6295b47a-774d-4d5d-ab2c-96d1c6c3456c	2025-11-04	Melbourne Cup	Melbourne Cup	AU	{VIC}	f	f	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
5d198391-d7ba-4193-a490-5ef8c4ae14e0	2025-12-25	Christmas Day	Christmas Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
4b21577f-5311-4290-87ec-971629bb209a	2025-12-26	Boxing Day	St. Stephen's Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.441546+00	2025-05-30 15:24:58.184+00
08a796d3-933b-478b-9b2c-42ccad418b99	2026-01-01	New Year's Day	New Year's Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
036bb5d6-5fc7-4e2a-beea-2fde176a8626	2026-01-26	Australia Day	Australia Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
39b705aa-e0f3-4c78-83bf-2db87796c8c6	2026-03-02	Labour Day	Labour Day	AU	{WA}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
a7b40d02-484d-4907-9d54-22bac741d0b8	2026-03-09	Canberra Day	Canberra Day	AU	{ACT}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
e43e85d2-49bb-4097-b423-edea54ac35d4	2026-04-03	Good Friday	Good Friday	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
224f9d0a-2d6b-4bae-bea3-c3061349b2b0	2026-04-04	Easter Eve	Holy Saturday	AU	{ACT,NSW,NT,QLD,SA,VIC}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
74c254fc-63e1-48ab-82e3-91e50494aa8f	2026-04-05	Easter Sunday	Easter Sunday	AU	{ACT,NSW,NT,QLD,SA,VIC,WA}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
58763442-e221-4d51-a190-c0ce2614af25	2026-04-06	Easter Monday	Easter Monday	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
116ae741-60a8-4e34-a724-10ccff96dfc8	2026-04-25	Anzac Day	Anzac Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
412c31ed-00db-47e5-bcf8-50e9c7592032	2026-05-04	May Day	May Day	AU	{NT}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
26171d13-7c81-42e8-a7d2-f3c2c3b0b0ae	2026-06-01	Reconciliation Day	Reconciliation Day	AU	{ACT}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
af49930f-22f7-44dc-afbd-90c8a94bc265	2026-06-08	King's Birthday	King's Birthday	AU	{ACT,NSW,NT,SA,TAS,VIC}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
791c05a9-4c36-4ff4-b273-a3e4403b8fc8	2026-08-03	Picnic Day	Picnic Day	AU	{NT}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
b2881347-0f04-4390-92f5-ede2540e3be4	2026-09-25	Friday before AFL Grand Final (Tentative Date)	Friday before AFL Grand Final (Tentative Date)	AU	{VIC}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
d77ba131-6d11-494b-9132-483203c826ca	2026-09-28	King's Birthday	King's Birthday	AU	{WA}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
7961c0f8-91e7-4c08-8844-dd8171583ee8	2026-10-05	Labour Day	Labour Day	AU	{ACT,NSW,SA}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
e9c0a667-91c2-471a-b181-3f48d9c7a5d3	2026-11-03	Melbourne Cup	Melbourne Cup	AU	{VIC}	f	f	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
0863140a-9650-4562-90cc-d06510a4dad6	2026-12-25	Christmas Day	Christmas Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
9d191ef9-3289-4925-bd92-4410f5594e2b	2026-12-28	Boxing Day	St. Stephen's Day	AU	{National}	f	t	\N	{Public}	2025-05-30 15:24:58.447857+00	2025-05-30 15:24:58.185+00
af36eb31-eab0-454b-997f-2e88d2217f61	2024-01-01	New Year's Day	New Year's Day	AU	{NSW}	t	f	\N	{public}	2025-05-31 12:44:57.831888+00	2025-05-31 12:44:57.831888+00
7ca751e0-843f-4138-9eb9-b3ab8c047b99	2024-01-26	Australia Day	Australia Day	AU	{NSW}	t	f	\N	{public}	2025-05-31 12:44:57.831888+00	2025-05-31 12:44:57.831888+00
629cc664-5836-4701-bd47-419ff1e71eb3	2024-03-29	Good Friday	Good Friday	AU	{NSW}	f	f	\N	{public}	2025-05-31 12:44:57.831888+00	2025-05-31 12:44:57.831888+00
b97c0d94-befd-4ec5-b77f-eea6b965145a	2024-04-01	Easter Monday	Easter Monday	AU	{NSW}	f	f	\N	{public}	2025-05-31 12:44:57.831888+00	2025-05-31 12:44:57.831888+00
d0cb9e91-0acb-497d-9c46-a00a51351fef	2024-04-25	ANZAC Day	ANZAC Day	AU	{NSW}	t	f	\N	{public}	2025-05-31 12:44:57.831888+00	2025-05-31 12:44:57.831888+00
e6db463b-38cd-4c2f-b33f-53706d873899	2024-06-10	Queen's Birthday	Queen's Birthday	AU	{NSW}	f	f	\N	{public}	2025-05-31 12:44:57.831888+00	2025-05-31 12:44:57.831888+00
2bf42404-1a1a-4746-9b52-58f104924b6c	2024-12-25	Christmas Day	Christmas Day	AU	{NSW}	t	f	\N	{public}	2025-05-31 12:44:57.831888+00	2025-05-31 12:44:57.831888+00
bf86b4a9-8d70-4ba0-9e6c-80dd23b8acd8	2024-12-26	Boxing Day	Boxing Day	AU	{NSW}	t	f	\N	{public}	2025-05-31 12:44:57.831888+00	2025-05-31 12:44:57.831888+00
\.


--
-- Data for Name: latest_payroll_version_results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.latest_payroll_version_results (id, payroll_id, name, version_number, go_live_date, active, queried_at) FROM stdin;
\.


--
-- Data for Name: leave; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.leave (id, user_id, start_date, end_date, leave_type, reason, status) FROM stdin;
1ec11d5d-dbff-4d13-bb53-5aec7233b83d	d9ac8a7b-f679-49a1-8c99-837eb977578b	2025-06-02	2025-06-05	Sick	Demo leave generated for testing.	Approved
531a838c-f1be-4253-8f6b-3f5fdc011050	e4313314-b89e-4346-9bb5-3aaf464c7152	2025-06-02	2025-06-05	Sick	Demo leave generated for testing.	Approved
294ef3bc-f2cf-4816-8770-9d945af52dd4	22a368d4-5d3f-4026-840c-55af6fb16972	2025-06-02	2025-06-05	Sick	Demo leave generated for testing.	Approved
89feb56f-33cb-4b36-8040-dff89919cda5	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	2025-06-02	2025-06-05	Sick	Demo leave generated for testing.	Approved
5207cdef-8d35-4002-9a47-60e8c772f4c8	9aed2a64-0407-4dff-a621-2b7013e1713a	2025-06-02	2025-06-05	Sick	Demo leave generated for testing.	Approved
199ddb47-6831-49f7-bf75-acdff593dae0	d9ac8a7b-f679-49a1-8c99-837eb977578b	2025-06-12	2025-06-15	Annual	Demo leave generated for testing.	Approved
c37fb91c-50e6-43c1-b3de-03a04feb5c4a	e4313314-b89e-4346-9bb5-3aaf464c7152	2025-06-12	2025-06-15	Annual	Demo leave generated for testing.	Approved
99a9d230-55d0-46be-bd9d-f66954f7d99c	22a368d4-5d3f-4026-840c-55af6fb16972	2025-06-12	2025-06-15	Annual	Demo leave generated for testing.	Approved
00317800-c652-40f8-897f-3fb116105eac	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	2025-06-12	2025-06-15	Annual	Demo leave generated for testing.	Approved
e409817b-c6a6-4fb3-bb10-4cd035b4ee71	9aed2a64-0407-4dff-a621-2b7013e1713a	2025-06-12	2025-06-15	Annual	Demo leave generated for testing.	Approved
c877a4ea-0c2a-49cb-af16-5a3f82668a5c	7898704c-ee5c-4ade-81f3-80a4388413fb	2024-05-13	2024-05-24	Annual	Planned annual leave - 2 weeks	Approved
7c35faa4-f0fb-40a5-b12a-cb7adc10878d	22a368d4-5d3f-4026-840c-55af6fb16972	2024-04-08	2024-04-19	Annual	Annual leave - 2 weeks in April	Approved
424a1358-d16c-4670-bf89-c6db9323735e	7898704c-ee5c-4ade-81f3-80a4388413fb	2025-06-01	2025-06-14	Annual	Testing	Approved
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.notes (id, entity_type, entity_id, user_id, content, is_important, created_at, updated_at) FROM stdin;
5a067524-6323-47a9-8ee3-5d9765a1df1d	client	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	d9ac8a7b-f679-49a1-8c99-837eb977578b	Important note for client Demo Client 1 (Weekly - Monday) generated for demo.	t	2025-05-23 08:15:43.852348	2025-05-23 08:15:43.852348
9008fd0e-a5b8-45cc-a1a8-912e45fdd798	client	65e17d2e-df6e-448b-abb3-eea9d566a239	d9ac8a7b-f679-49a1-8c99-837eb977578b	Important note for client Demo Client 2 (Weekly - Friday) generated for demo.	t	2025-05-23 08:15:43.852348	2025-05-23 08:15:43.852348
a651ae9c-2127-4140-804d-94e1190fb4d8	client	ed90f235-e212-4ecd-aedf-402a2a91125f	d9ac8a7b-f679-49a1-8c99-837eb977578b	Important note for client Demo Client 3 (Fortnightly - Week A Thursday) generated for demo.	t	2025-05-23 08:15:43.852348	2025-05-23 08:15:43.852348
5f2bbaaa-d4b7-46e0-ae0b-2df1ffdc38e3	client	4ecd4666-c94e-43ba-97dc-3c78c8badffb	d9ac8a7b-f679-49a1-8c99-837eb977578b	Important note for client Demo Client 4 (Fortnightly - Week B Monday) generated for demo.	t	2025-05-23 08:15:43.852348	2025-05-23 08:15:43.852348
732ad418-b1cb-4b39-beb1-b87ab4b58198	client	92ff771d-d468-4c91-ae58-d66b3ce1bd22	d9ac8a7b-f679-49a1-8c99-837eb977578b	Important note for client Demo Client 5 (Bi-Monthly - Start of Month) generated for demo.	t	2025-05-23 08:15:43.852348	2025-05-23 08:15:43.852348
bd8d9e55-5f25-4015-ae7e-60417232e22a	payroll	6caecf93-0b00-4776-8bfd-943bf05fd7d4	\N	Tesdt	f	2025-06-02 09:46:58.916619	2025-06-02 09:46:58.916619
8f7dd5be-4781-41a0-8e0b-46104a8883cd	payroll	fabe13b6-395a-489f-8003-69668a89cfe5	\N	Testing notes modal	f	2025-05-31 12:38:39.043918	2025-05-31 12:38:39.043918
\.


--
-- Data for Name: payroll_activation_results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_activation_results (id, payroll_id, action_taken, version_number, executed_at) FROM stdin;
\.


--
-- Data for Name: payroll_assignment_audit; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_assignment_audit (id, assignment_id, payroll_date_id, from_consultant_id, to_consultant_id, changed_by, change_reason, created_at) FROM stdin;
\.


--
-- Data for Name: payroll_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_assignments (id, payroll_date_id, consultant_id, assigned_by, is_backup, original_consultant_id, assigned_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payroll_cycles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_cycles (id, name, description, created_at, updated_at) FROM stdin;
713e04b1-e876-4169-8a05-f6846b51eb68	weekly	Weekly payroll	2025-05-23 06:25:06.901132+00	2025-05-23 06:25:06.901132+00
769d0c73-f918-4734-8cc9-45b1284c9ce8	fortnightly	Fortnightly payroll	2025-05-23 06:25:06.901132+00	2025-05-23 06:25:06.901132+00
60490f74-a5b9-430a-ad4a-ade8f7393007	bi_monthly	Bi-Monthly payroll	2025-05-23 06:25:06.901132+00	2025-05-23 06:25:06.901132+00
d96980a2-3146-4969-87bc-d50fdf4fccd3	monthly	Monthly payroll	2025-05-23 06:25:06.901132+00	2025-05-23 06:25:06.901132+00
12570d45-fa3f-406a-80bc-1f412fe2d5f3	quarterly	Quarterly payroll	2025-05-23 06:25:06.901132+00	2025-05-23 06:25:06.901132+00
\.


--
-- Data for Name: payroll_date_types; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_date_types (id, name, description, created_at, updated_at) FROM stdin;
7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7	dow	Day of Week	2025-05-23 06:25:06.92803+00	2025-05-23 06:25:06.92803+00
f9914e22-da9e-4743-8d5d-365ba51ef854	som	Start of Month	2025-05-23 06:25:06.92803+00	2025-05-23 06:25:06.92803+00
68001232-8ac9-442d-bbe0-287569f2b144	eom	End of Month	2025-05-23 06:25:06.92803+00	2025-05-23 06:25:06.92803+00
b29b56fc-b098-4cac-8dab-868d935986f2	fixed_date	Fixed Day of Month	2025-05-23 06:25:06.92803+00	2025-05-23 06:25:06.92803+00
d11a8b82-ec8f-4300-a397-37e8b0d54114	week_a	Fortnightly Week A	2025-05-23 06:25:06.92803+00	2025-05-23 06:25:06.92803+00
2af96485-ff65-42e8-b300-3ad9308a7e2b	week_b	Fortnightly Week B	2025-05-23 06:25:06.92803+00	2025-05-23 06:25:06.92803+00
\.


--
-- Data for Name: payroll_dates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_dates (id, payroll_id, original_eft_date, adjusted_eft_date, processing_date, notes, created_at, updated_at) FROM stdin;
4286c7b8-9019-4db1-b52d-ad0e8c4cb379	076f830b-de4b-47c9-b0ae-988556c48725	2024-12-13	2024-12-13	2024-12-04	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
e320af9c-c509-4a8a-a1bc-8425c6b105c8	076f830b-de4b-47c9-b0ae-988556c48725	2025-01-03	2025-01-03	2024-12-20	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
2c84ad46-afa6-4f3b-b06a-63a83c52bdaf	076f830b-de4b-47c9-b0ae-988556c48725	2025-01-17	2025-01-17	2025-01-08	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
76c8f93a-6040-4b2a-a2a5-07a8a508bb43	076f830b-de4b-47c9-b0ae-988556c48725	2025-01-31	2025-01-31	2025-01-21	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
6186d90b-ca8a-4130-845e-c337477ec407	076f830b-de4b-47c9-b0ae-988556c48725	2025-02-14	2025-02-14	2025-02-05	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
63215adc-825f-4e77-a35e-835cb6cadab0	076f830b-de4b-47c9-b0ae-988556c48725	2025-02-28	2025-02-28	2025-02-19	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
bfd69eae-3f72-4082-9c81-c4ca393c2d1c	076f830b-de4b-47c9-b0ae-988556c48725	2025-03-14	2025-03-14	2025-03-04	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
351783c9-6186-4fa9-8270-da361eda0a9e	076f830b-de4b-47c9-b0ae-988556c48725	2025-03-28	2025-03-28	2025-03-19	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
b83b175a-010e-41e0-8cb3-d9a8d2a6a008	076f830b-de4b-47c9-b0ae-988556c48725	2025-04-11	2025-04-11	2025-04-02	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
a360704d-e705-4843-b0b7-52bad40ac387	076f830b-de4b-47c9-b0ae-988556c48725	2025-04-25	2025-04-24	2025-04-11	Adjusted from Anzac Day (Friday    25 Apr 2025) to previous business day (Thursday  24 Apr 2025)	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
b5f4a7b4-9b5b-44f8-b90e-0890325e4edc	076f830b-de4b-47c9-b0ae-988556c48725	2025-05-09	2025-05-09	2025-04-29	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
7afd7c88-b4d0-44bb-9d51-53ecbbe5418f	076f830b-de4b-47c9-b0ae-988556c48725	2025-05-23	2025-05-23	2025-05-14	\N	2025-06-02 03:12:08.914598+00	2025-06-02 03:12:08.914598+00
6d5627bf-60a6-4a47-818f-7478013efd44	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-06-05	2025-06-05	2025-05-30	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
c3bf5a9e-d1c7-4cfe-ba7b-7c1a0afa5f3a	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-06-12	2025-06-12	2025-06-06	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
ee19e37f-d8dc-4f9c-b1fa-5ef6e19ea1c1	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-06-19	2025-06-19	2025-06-16	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
81a73cd7-48cb-4986-9fad-03854760b01f	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-06-26	2025-06-26	2025-06-23	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
0136f15b-be77-4b63-9e61-d3773b77df2f	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-07-03	2025-07-03	2025-06-30	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
8252542b-0444-4eac-a13e-5095b7870029	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-07-10	2025-07-10	2025-07-07	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
0454a6f9-3df2-47be-8e34-a6208ccb5cd1	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-07-17	2025-07-17	2025-07-14	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
7982e68b-f698-46ac-8b6a-95b7087f2b88	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-07-24	2025-07-24	2025-07-21	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
e3f80922-5246-48a2-905d-7c24d9e51241	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-07-31	2025-07-31	2025-07-28	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
fcf4755f-1f72-4981-bdb1-5cce7ff8f2c4	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-08-07	2025-08-07	2025-08-01	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
e6b0b00a-06ed-405e-91ea-5c0f28f9fcc2	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-08-14	2025-08-14	2025-08-11	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
636de5d1-81d0-4d07-86cc-1940acebbca3	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-08-21	2025-08-21	2025-08-18	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
9db54785-ce3b-4ec6-bfbc-52e9cdc6beea	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-08-28	2025-08-28	2025-08-25	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
69ef89f0-ce23-4e72-8e39-f811f6fdbe7c	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-09-04	2025-09-04	2025-09-01	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
2e950f4a-80af-4d4e-97e9-bb9cce7ae7bc	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-09-11	2025-09-11	2025-09-08	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
8226500c-9ad4-41a7-b46d-0138a07d9ef1	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-09-18	2025-09-18	2025-09-15	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
3a25689c-e6f7-4d91-916c-ebc60a173fa2	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-09-25	2025-09-25	2025-09-22	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
60f274a4-37af-483c-9395-00cb174fe262	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-10-02	2025-10-02	2025-09-26	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
8c7e08b5-e6e0-4cc8-8822-3c411c597877	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-10-09	2025-10-09	2025-10-03	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
6e78d97a-2e2e-44c8-b119-ac4ad5f3c713	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-10-16	2025-10-16	2025-10-13	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
42c29df9-8937-4e72-90f8-bb6b2e8b1ac6	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-10-23	2025-10-23	2025-10-20	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
e6ab3b7d-5839-4c50-95ee-51ecb5eb1e0e	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-10-30	2025-10-30	2025-10-27	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
ae97065f-31e9-410e-ae65-6fe9ef765c9c	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-11-06	2025-11-06	2025-10-31	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
383f9181-8020-45ae-89fd-5122100e661c	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-11-13	2025-11-13	2025-11-10	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
7c445a1d-7061-406a-b161-2410cb851804	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-11-20	2025-11-20	2025-11-17	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
66816b66-d97e-47fd-996f-3cdfac5c5ec4	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-11-27	2025-11-27	2025-11-24	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
8e738a2f-12ce-41c5-84db-2ecbf37c282e	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-12-04	2025-12-04	2025-12-01	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
096465ab-3388-42b4-abe7-37079d6f11e2	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-12-11	2025-12-11	2025-12-08	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
82068dae-5625-42e2-8ca8-ecb6396c1f7f	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-12-18	2025-12-18	2025-12-15	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
f2590eac-40f0-4273-9fd3-d1c6a7817453	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2025-12-25	2025-12-24	2025-12-19	Adjusted from Christmas Day (Thursday  25 Dec 2025) to previous business day (Wednesday 24 Dec 2025)	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
6ed4a4ab-0224-495c-8d62-c1c90955795a	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-01-01	2025-12-31	2025-12-24	Adjusted from New Year's Day (Thursday  01 Jan 2026) to previous business day (Wednesday 31 Dec 2025)	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
8debc480-69f4-45b2-944a-a5d154e58311	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-01-08	2026-01-08	2026-01-05	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
518ffb9d-f97e-4c23-839d-958bf43686a7	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-01-15	2026-01-15	2026-01-12	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
1c943063-51e2-4552-80a8-35cff4b4f93b	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-01-22	2026-01-22	2026-01-19	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
f5024e5a-9618-4b7a-a8b3-a4b514fb813f	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-01-29	2026-01-29	2026-01-23	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
147cf467-0ab1-4ef0-9fec-b2da40e71872	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-02-05	2026-02-05	2026-02-02	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
fb63fb91-1ca4-42af-a446-d21ba34b05c9	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-02-12	2026-02-12	2026-02-09	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
1ad89cee-045e-48ae-8e26-7f10ffbb0aa4	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-02-19	2026-02-19	2026-02-16	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
30b09f76-28d9-4774-8387-f2cd7016a812	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-02-26	2026-02-26	2026-02-23	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
761d1956-1619-471f-875d-550709c8282e	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2024-12-01	2024-12-02	2024-11-25	Adjusted from Sunday (01 Dec 2024) to next business day (Monday    02 Dec 2024)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
bec7dd47-6b2a-4921-a8a6-b588b2690ad3	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-01-01	2025-01-02	2024-12-23	Adjusted from New Year's Day (Wednesday 01 Jan 2025) to next business day (Thursday  02 Jan 2025)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
761f7f16-c140-4fc0-8431-da746c53a762	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-02-01	2025-02-03	2025-01-24	Adjusted from Saturday (01 Feb 2025) to next business day (Monday    03 Feb 2025)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
96892834-8a35-41f8-8fd5-b2c0c61278a3	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-03-01	2025-03-04	2025-02-24	Adjusted from Saturday (01 Mar 2025) to next business day (Tuesday   04 Mar 2025)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
04820a79-2ee1-45f7-b8a0-b02dc7c21974	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-04-01	2025-04-01	2025-03-25	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
fac2c39a-085d-40ed-b80f-a6ba4da52367	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-05-01	2025-05-01	2025-04-23	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
b740687e-ca3a-4806-b2f4-0f3ea32c7131	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-06-01	2025-06-03	2025-05-26	Adjusted from Sunday (01 Jun 2025) to next business day (Tuesday   03 Jun 2025)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
7858d8bd-4790-40d2-9758-f010e55eec58	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-07-01	2025-07-01	2025-06-24	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
6d75c1d3-2b21-479f-b490-564394fe12c0	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-08-01	2025-08-01	2025-07-25	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
bb46ed63-deeb-498a-bb59-702b096e49df	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-09-01	2025-09-01	2025-08-25	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
bba6cd1d-6277-4fcd-afb5-57e8e3dc8b6d	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-10-01	2025-10-01	2025-09-23	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
08c0288e-0265-45d8-9345-e88a96ad514f	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-11-01	2025-11-03	2025-10-27	Adjusted from Saturday (01 Nov 2025) to next business day (Monday    03 Nov 2025)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
a31a2584-464f-4021-ab8c-34e2af4cc406	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2025-12-01	2025-12-01	2025-11-24	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
42c0f762-4bf5-4c2c-b373-5aa4736c6b4d	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-01-01	2026-01-02	2025-12-23	Adjusted from New Year's Day (Thursday  01 Jan 2026) to next business day (Friday    02 Jan 2026)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
ba024f1d-f50b-417b-ac70-39c1a3743031	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-02-01	2026-02-02	2026-01-23	Adjusted from Sunday (01 Feb 2026) to next business day (Monday    02 Feb 2026)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
0bfbf05b-15ff-41cf-a160-dc7bc118bae5	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-03-01	2026-03-03	2026-02-23	Adjusted from Sunday (01 Mar 2026) to next business day (Tuesday   03 Mar 2026)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
b68c31c4-ccc2-4d2b-a619-5b94fc73f754	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-04-01	2026-04-01	2026-03-25	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
6fed6438-da58-4681-bbb1-0240530a8e20	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-05-01	2026-05-01	2026-04-24	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
ca3b2727-ccee-4bbe-8306-c5d5d5a99aeb	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-06-01	2026-06-02	2026-05-25	Adjusted from Reconciliation Day (Monday    01 Jun 2026) to next business day (Tuesday   02 Jun 2026)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
a9192df5-cadb-4c70-84e3-7433825cf5a2	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-07-01	2026-07-01	2026-06-24	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
85bde0a6-0ea4-422b-ad4e-a0651456a98c	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-08-01	2026-08-04	2026-07-27	Adjusted from Saturday (01 Aug 2026) to next business day (Tuesday   04 Aug 2026)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
b4fd2a13-911b-483b-b657-26a40dff7798	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-09-01	2026-09-01	2026-08-25	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
608fb908-2f2f-4d0f-a0a9-5ee5d94bc036	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-10-01	2026-10-01	2026-09-22	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
11dc61ed-34f0-4df9-829f-71e8f5d7b8e2	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-06-05	2025-06-05	2025-05-26	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
827bee48-c38c-4bbe-891e-41891ac09af3	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-11-01	2026-11-02	2026-10-26	Adjusted from Sunday (01 Nov 2026) to next business day (Monday    02 Nov 2026)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
1a86e8b4-d0e3-4a48-adf5-5d25df9eeebd	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2026-12-01	2026-12-01	2026-11-24	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
18fe2ff6-8c89-4cf9-a93a-b812123f029e	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2027-01-01	2027-01-01	2026-12-23	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
c1221da2-998a-4446-9016-bb9389670e26	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2027-02-01	2027-02-01	2027-01-25	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
d12c7546-3ad5-4c19-adc4-738f7614eb77	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2027-03-01	2027-03-01	2027-02-22	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
1bc7d2b2-816a-4a29-9e85-6e001d710b5c	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2027-04-01	2027-04-01	2027-03-25	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
f0dda74d-e66d-4631-8165-2dcb52e0f148	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2027-05-01	2027-05-03	2027-04-26	Adjusted from Saturday (01 May 2027) to next business day (Monday    03 May 2027)	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
4cb64982-49e6-4415-a030-fa0f9ad6a019	3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	2027-06-01	2027-06-01	2027-05-25	\N	2025-06-02 03:12:09.007685+00	2025-06-02 03:12:09.007685+00
9ff49106-2afb-4fb4-964c-1fdb0683ed40	d619e823-c753-425c-88e4-5e797d2bff48	2024-12-01	2024-11-29	2024-11-26	Adjusted from Sunday (01 Dec 2024) to previous business day (Friday    29 Nov 2024)	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
2403e21e-7f5b-40ea-a78b-f991d3c3c0ef	d619e823-c753-425c-88e4-5e797d2bff48	2025-03-01	2025-02-28	2025-02-25	Adjusted from Saturday (01 Mar 2025) to previous business day (Friday    28 Feb 2025)	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
9abf6f5f-b878-42d6-876a-5fdbdc888b7d	d619e823-c753-425c-88e4-5e797d2bff48	2025-06-01	2025-05-30	2025-05-27	Adjusted from Sunday (01 Jun 2025) to previous business day (Friday    30 May 2025)	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
a62d526f-06d8-4004-8a59-e24df24ef1a2	d619e823-c753-425c-88e4-5e797d2bff48	2025-09-01	2025-09-01	2025-08-27	\N	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
395b468d-0efb-487f-9566-9fea7fb1b9ba	d619e823-c753-425c-88e4-5e797d2bff48	2025-12-01	2025-12-01	2025-11-26	\N	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
d4bc2e28-d39c-43cf-902c-cce96ee47f21	d619e823-c753-425c-88e4-5e797d2bff48	2026-03-01	2026-02-27	2026-02-24	Adjusted from Sunday (01 Mar 2026) to previous business day (Friday    27 Feb 2026)	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
be0764a6-a467-47e7-b970-1a8c27bb2877	d619e823-c753-425c-88e4-5e797d2bff48	2026-06-01	2026-05-29	2026-05-26	Adjusted from Reconciliation Day (Monday    01 Jun 2026) to previous business day (Friday    29 May 2026)	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
54f4a6df-2df0-4fa0-bb6f-b248f47e8717	d619e823-c753-425c-88e4-5e797d2bff48	2026-09-01	2026-09-01	2026-08-27	\N	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
072aab5d-43a7-4e86-b2aa-57c968be83c8	d619e823-c753-425c-88e4-5e797d2bff48	2026-12-01	2026-12-01	2026-11-26	\N	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
0e4aaa01-ee24-4158-9418-fd300034a23b	d619e823-c753-425c-88e4-5e797d2bff48	2027-03-01	2027-03-01	2027-02-24	\N	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
11100df3-3755-4c46-9b82-609faaec4f1d	d619e823-c753-425c-88e4-5e797d2bff48	2027-06-01	2027-06-01	2027-05-27	\N	2025-06-02 03:12:09.032675+00	2025-06-02 03:12:09.032675+00
4d47da4d-7484-48c7-9c8a-02de02079b1f	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2024-12-03	2024-12-03	2024-11-26	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
c4f539ad-5195-4708-8626-90abe8b13c94	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2024-12-10	2024-12-10	2024-12-03	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
918515e0-956b-4ff3-b62d-bb957810cc5c	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2024-12-17	2024-12-17	2024-12-10	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
b51879b0-0ed5-488a-86db-ee1c2ce84875	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2024-12-24	2024-12-24	2024-12-17	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
7fc443f9-f4bf-44bc-9909-0c6949d6fa83	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2024-12-31	2024-12-31	2024-12-20	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
1573f7d6-b194-4702-ba89-aa289f3362e6	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-01-07	2025-01-07	2024-12-30	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
5e94b27c-ffe4-48ca-8492-acd4be0ca1fa	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-01-14	2025-01-14	2025-01-07	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
025d0fc6-d501-40d6-ae5d-428f54d77875	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-01-21	2025-01-21	2025-01-14	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
4056aa1f-cf90-4521-a5b3-1ea67f8f5fc5	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-01-28	2025-01-28	2025-01-20	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
5a10dfa9-3e69-4886-9440-31ca8f1d37a9	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-02-04	2025-02-04	2025-01-28	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
2a155d07-4a72-4161-ba8f-0433114be372	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-02-11	2025-02-11	2025-02-04	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
fc890c52-bfae-4672-b7d6-52d7d7c458df	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-02-18	2025-02-18	2025-02-11	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
b13b698f-4cb8-4bfe-a82c-5edb9872aa0a	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-02-25	2025-02-25	2025-02-18	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
f34cf701-962d-4ab8-b531-55f1774f042e	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-03-04	2025-03-04	2025-02-24	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
9f39b7ff-d629-4f5a-8d6f-773631296401	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-03-11	2025-03-11	2025-02-28	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
adcb2e6a-a4e1-466f-8f30-083b5d9b6754	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-03-18	2025-03-18	2025-03-11	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
63f55d54-6c12-4fbc-a727-8e20886d20d1	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-03-25	2025-03-25	2025-03-18	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
2f77402b-22ae-4b99-8f7b-7b02f3d37521	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-04-01	2025-04-01	2025-03-25	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
9358f228-757a-472e-8fea-57268fe441a1	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-04-08	2025-04-08	2025-04-01	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
c9c598b3-f211-4aea-a69f-a9468f658c83	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-04-15	2025-04-15	2025-04-08	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
74c313fe-8154-4774-9f02-45ca19917530	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-04-22	2025-04-22	2025-04-11	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
0bbd1e4c-d67f-426c-93b7-cc7fc1e3176e	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-04-29	2025-04-29	2025-04-17	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
d30482e2-865a-4e61-8f18-406d17e3cb50	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-05-06	2025-05-06	2025-04-28	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
8307f430-f5ed-4e23-bf72-4f78c961e45b	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-05-13	2025-05-13	2025-05-06	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
b63127bf-9333-4916-b555-ca4effbe40b0	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-05-20	2025-05-20	2025-05-13	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
5fa5340d-d1fa-4d7c-a6f6-dadf5af4fd16	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-05-27	2025-05-27	2025-05-20	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
05be98c9-b4cb-488a-a16f-f80444abe2f8	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-06-03	2025-06-03	2025-05-26	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
b9dab50c-06b3-4a5c-964f-96993b39c676	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-06-10	2025-06-10	2025-05-30	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
3ec3a536-bb22-47bf-b573-6902eb92d466	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-06-17	2025-06-17	2025-06-10	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
c7151530-0232-4d66-88b4-081c2fb2ec5f	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-06-24	2025-06-24	2025-06-17	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
bf982bce-6d16-4b8d-85c6-1196cd8a2a6f	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-07-01	2025-07-01	2025-06-24	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
93cec4c4-5c65-4f5a-a72b-a001e8ea6ec6	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-07-08	2025-07-08	2025-07-01	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
1e49338a-a35d-489f-b6cb-fd62f61b8014	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-07-15	2025-07-15	2025-07-08	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
c3a4fd08-5c5a-4be8-9a37-c562b5502825	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-07-22	2025-07-22	2025-07-15	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
566e54d3-6e4f-4dfe-8793-b20dbe829ad2	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-07-29	2025-07-29	2025-07-22	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
8661e5aa-5c99-419f-8e63-4d394047a4cb	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-08-05	2025-08-05	2025-07-28	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
94799702-576d-4e96-939d-27986a75cb85	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-08-12	2025-08-12	2025-08-05	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
8eb8f45a-4011-4562-914c-a67c50dd68e9	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-08-19	2025-08-19	2025-08-12	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
c96c3d21-bd9a-4786-87cf-51bf886cb1a5	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-08-26	2025-08-26	2025-08-19	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
c9a8aff6-76ec-4486-b7ea-e8bc34d53bf3	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-09-02	2025-09-02	2025-08-26	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
8dec231e-6b1a-4e9b-a283-08e7d54f96f8	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-09-09	2025-09-09	2025-09-02	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
d87bd521-cd7e-4d7c-a1eb-97630a8f7d37	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-09-16	2025-09-16	2025-09-09	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
2df78039-e1f1-4f9f-aa2f-dbda576be41d	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-09-23	2025-09-23	2025-09-16	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
149a0741-d4b6-4fef-b49a-c256b9fcb499	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-09-30	2025-09-30	2025-09-22	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
c10ff4a7-3bcd-4cc3-910b-8d1c51049218	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-10-07	2025-10-07	2025-09-26	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
a896e1f2-bee9-4fb2-8af1-a582a788844a	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-10-14	2025-10-14	2025-10-07	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
4125f810-e800-42ee-9eef-c17846100054	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-10-21	2025-10-21	2025-10-14	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
40f8c2d2-54dc-4f7d-87e3-7006ed88120f	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-10-28	2025-10-28	2025-10-21	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
b7aa8044-2cc7-470f-ae13-f95a5a8b16d7	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-11-04	2025-11-03	2025-10-27	Adjusted from Melbourne Cup (Tuesday   04 Nov 2025) to previous business day (Monday    03 Nov 2025)	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
fffd297b-b29f-4e5a-a865-3b4c4e8523d5	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-11-11	2025-11-11	2025-11-03	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
83a1dd94-da19-4884-bd44-a56ab35c44f3	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-11-18	2025-11-18	2025-11-11	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
546aa9a6-78f7-47c3-a538-af72430a75e7	17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	2025-11-25	2025-11-25	2025-11-18	\N	2025-06-02 03:12:09.050612+00	2025-06-02 03:12:09.050612+00
1ef66790-17cd-4b36-9719-33c3eee71ed9	8077082b-4473-4547-aa9c-f1da8ac4b91a	2024-12-11	2024-12-11	2024-12-05	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
e9974e0c-c285-45d4-9130-7c6ae031900d	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-01-01	2024-12-31	2024-12-23	Adjusted from New Year's Day (Wednesday 01 Jan 2025) to previous business day (Tuesday   31 Dec 2024)	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
4f919922-ee2a-4093-8d2a-40b250384a5b	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-01-15	2025-01-15	2025-01-09	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
43532d55-a3b9-4b49-89de-e11549d1da39	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-01-29	2025-01-29	2025-01-22	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
59691b37-91c0-4179-bd2c-aaeaa24c820c	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-02-12	2025-02-12	2025-02-06	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
8cce77b9-4a5e-4026-85e0-c7a3375fcd81	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-02-26	2025-02-26	2025-02-20	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
90842461-4c7f-429f-8ee2-96d387082160	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-03-12	2025-03-12	2025-03-05	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
80a4441c-0230-453f-9a91-426fe04ddde2	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-03-26	2025-03-26	2025-03-20	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
9436c304-827e-43e7-9c1e-e19895f35cec	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-04-09	2025-04-09	2025-04-03	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
687b5a71-4658-4081-a45f-7f22b87143b9	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-04-23	2025-04-23	2025-04-15	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
a17512fd-e1f2-4df4-9a93-8acbe5ca06ac	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-05-07	2025-05-07	2025-04-30	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
7a47ec50-f196-4774-9651-36ffeb8d3bdb	8077082b-4473-4547-aa9c-f1da8ac4b91a	2025-05-21	2025-05-21	2025-05-15	\N	2025-06-02 03:12:09.078611+00	2025-06-02 03:12:09.078611+00
eb3bcf0a-2816-4718-bc43-126c5c9c4911	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-03-05	2026-03-05	2026-02-27	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
5e1867e2-e365-4427-b7e2-94cb358f52a8	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-03-12	2026-03-12	2026-03-06	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
881a91e2-f127-4ef1-9cec-fd31fd0e8eb4	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-03-19	2026-03-19	2026-03-16	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
932cb96d-60ab-4196-8394-2d6ab4a1a4ed	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-03-26	2026-03-26	2026-03-23	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
7da0b737-1609-4dac-bbdb-8131c3d1761c	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-04-02	2026-04-02	2026-03-30	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
699ce3b0-a957-4aed-b1be-869abb13a2e3	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-04-09	2026-04-09	2026-04-02	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
166a3882-3fc9-49bc-801d-39cba9cd35b8	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-04-16	2026-04-16	2026-04-13	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
08f68af4-e7a0-4537-abe8-ccf9560cb5b4	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-04-23	2026-04-23	2026-04-20	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
177bb9f3-b7f7-453c-8944-e01e7b7fda91	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-04-30	2026-04-30	2026-04-27	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
4b19c8e0-6db0-43b9-bbd1-4a94a2aa3ce9	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-05-07	2026-05-07	2026-05-01	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
948bcf08-b611-4dad-8a3b-edb9eb84caf0	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-05-14	2026-05-14	2026-05-11	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
3f6ac5e4-e484-41d0-a722-d7f9b7fe0fb5	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-05-21	2026-05-21	2026-05-18	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
ae5d3646-0a25-428e-bdac-77db0d039dd0	a18b9637-c20f-428e-b6b7-a4a688e5b21a	2026-05-28	2026-05-28	2026-05-25	\N	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00
77e4e3eb-505f-4c29-917f-979760e3b3cb	f45e433b-fce5-4c95-bf24-364c66792709	2024-12-25	2024-12-24	2024-12-16	Adjusted from Christmas Day (Wednesday 25 Dec 2024) to previous business day (Tuesday   24 Dec 2024)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
38494e5b-330d-4bf6-b26c-1f07bf2b14d2	f45e433b-fce5-4c95-bf24-364c66792709	2025-01-25	2025-01-24	2025-01-16	Adjusted from Saturday (25 Jan 2025) to previous business day (Friday    24 Jan 2025)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
395cb476-3c27-45e5-9b07-96968e682313	f45e433b-fce5-4c95-bf24-364c66792709	2025-02-25	2025-02-25	2025-02-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
466d8997-8db2-4543-8c44-e5458f1ed96e	f45e433b-fce5-4c95-bf24-364c66792709	2025-03-25	2025-03-25	2025-03-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
7e55a195-086e-4176-acaf-c414a061ddb7	f45e433b-fce5-4c95-bf24-364c66792709	2025-04-25	2025-04-24	2025-04-14	Adjusted from Anzac Day (Friday    25 Apr 2025) to previous business day (Thursday  24 Apr 2025)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
68a60db8-7e7a-4d44-b6da-931d4562b488	f45e433b-fce5-4c95-bf24-364c66792709	2025-05-25	2025-05-23	2025-05-15	Adjusted from Sunday (25 May 2025) to previous business day (Friday    23 May 2025)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
41a38c82-afb9-440d-abee-e5f5bdd2ffe3	f45e433b-fce5-4c95-bf24-364c66792709	2025-06-25	2025-06-25	2025-06-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
bd2083b6-b6f8-41c4-b411-a367dba26157	f45e433b-fce5-4c95-bf24-364c66792709	2025-07-25	2025-07-25	2025-07-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
8d2c85ac-528f-49dd-bad5-75ad992e65ae	f45e433b-fce5-4c95-bf24-364c66792709	2025-08-25	2025-08-25	2025-08-15	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
d5652222-5dcd-4d5a-8c33-ed43a8b8acf5	f45e433b-fce5-4c95-bf24-364c66792709	2025-09-25	2025-09-25	2025-09-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
e9a86167-3d23-497d-8ece-5128ba035a90	f45e433b-fce5-4c95-bf24-364c66792709	2025-10-25	2025-10-24	2025-10-16	Adjusted from Saturday (25 Oct 2025) to previous business day (Friday    24 Oct 2025)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
6c521733-1c51-40af-b32c-8a8dbc84b8e0	f45e433b-fce5-4c95-bf24-364c66792709	2025-11-25	2025-11-25	2025-11-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
d91f4738-fecf-4579-8031-72ca1c71cf56	f45e433b-fce5-4c95-bf24-364c66792709	2025-12-25	2025-12-24	2025-12-16	Adjusted from Christmas Day (Thursday  25 Dec 2025) to previous business day (Wednesday 24 Dec 2025)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
96ee0660-ec5e-47f4-9400-3c055aa8a32f	f45e433b-fce5-4c95-bf24-364c66792709	2026-01-25	2026-01-23	2026-01-15	Adjusted from Sunday (25 Jan 2026) to previous business day (Friday    23 Jan 2026)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
787134cc-347f-47cd-9996-acfb4fed281b	f45e433b-fce5-4c95-bf24-364c66792709	2026-02-25	2026-02-25	2026-02-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
03324fe1-df0c-4b81-b755-cd90e5b2d3cc	f45e433b-fce5-4c95-bf24-364c66792709	2026-03-25	2026-03-25	2026-03-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
e612379b-1cdf-444c-8673-a225f77bedf1	f45e433b-fce5-4c95-bf24-364c66792709	2026-04-25	2026-04-24	2026-04-16	Adjusted from Anzac Day (Saturday  25 Apr 2026) to previous business day (Friday    24 Apr 2026)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
3d49bea8-5c82-4694-bfd5-2e09cfa935aa	f45e433b-fce5-4c95-bf24-364c66792709	2026-05-25	2026-05-25	2026-05-15	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
0f562a8f-4ee9-4399-9131-16c55df0ea48	f45e433b-fce5-4c95-bf24-364c66792709	2026-06-25	2026-06-25	2026-06-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
b1ac2fd2-2860-4471-8b53-3b3c95afb47d	f45e433b-fce5-4c95-bf24-364c66792709	2026-07-25	2026-07-24	2026-07-16	Adjusted from Saturday (25 Jul 2026) to previous business day (Friday    24 Jul 2026)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
b7ee3291-cbad-47f8-8832-dfd6bc93ca7a	f45e433b-fce5-4c95-bf24-364c66792709	2026-08-25	2026-08-25	2026-08-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
0a4006f5-41c8-44a4-9001-301b69bc48c9	f45e433b-fce5-4c95-bf24-364c66792709	2026-09-25	2026-09-24	2026-09-16	Adjusted from Friday before AFL Grand Final (Tentative Date) (Friday    25 Sep 2026) to previous business day (Thursday  24 Sep 2026)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
00e00610-73a8-4649-9f9d-aa607992ccac	f45e433b-fce5-4c95-bf24-364c66792709	2026-10-25	2026-10-23	2026-10-15	Adjusted from Sunday (25 Oct 2026) to previous business day (Friday    23 Oct 2026)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
d30b753a-a0db-4f7c-a443-938f700d2838	f45e433b-fce5-4c95-bf24-364c66792709	2026-11-25	2026-11-25	2026-11-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
f93f858a-5b60-48ee-8c9f-c214a5ebbe4a	f45e433b-fce5-4c95-bf24-364c66792709	2026-12-25	2026-12-24	2026-12-16	Adjusted from Christmas Day (Friday    25 Dec 2026) to previous business day (Thursday  24 Dec 2026)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
26defa0b-e4be-46ce-92cc-eb18000e9a16	f45e433b-fce5-4c95-bf24-364c66792709	2027-01-25	2027-01-25	2027-01-15	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
052a8e7c-41e4-4e6a-bec8-ceca344c5feb	f45e433b-fce5-4c95-bf24-364c66792709	2027-02-25	2027-02-25	2027-02-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
ed32af99-1bb8-443e-8eb1-a3b135739038	f45e433b-fce5-4c95-bf24-364c66792709	2027-03-25	2027-03-25	2027-03-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
ec4685ab-941b-491b-abbf-3273f1399895	f45e433b-fce5-4c95-bf24-364c66792709	2027-04-25	2027-04-23	2027-04-15	Adjusted from Sunday (25 Apr 2027) to previous business day (Friday    23 Apr 2027)	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
e12a82f6-e7cb-4203-9a55-aa656496a7eb	f45e433b-fce5-4c95-bf24-364c66792709	2027-05-25	2027-05-25	2027-05-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
6667729e-0ef9-4e8c-b5fc-60d3efd07400	f45e433b-fce5-4c95-bf24-364c66792709	2027-06-25	2027-06-25	2027-06-17	\N	2025-06-02 03:12:09.102621+00	2025-06-02 03:12:09.102621+00
10ab7055-e044-41bc-aed9-f8a5e5c93251	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-06-19	2025-06-19	2025-06-10	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
ebf22994-6849-4163-9035-32e8ddde109a	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2024-12-01	2024-11-29	2024-11-22	Adjusted from Sunday (01 Dec 2024) to previous business day (Friday    29 Nov 2024)	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
3ea01b32-9e8f-4b1c-b8e9-c995bb23b264	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2025-03-01	2025-02-28	2025-02-21	Adjusted from Saturday (01 Mar 2025) to previous business day (Friday    28 Feb 2025)	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
a06e4a2c-ee07-428a-a38d-a11cee5eec50	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2025-06-01	2025-05-30	2025-05-23	Adjusted from Sunday (01 Jun 2025) to previous business day (Friday    30 May 2025)	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
639cdcfe-e06f-4c40-b040-9aff668dbeb5	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2025-09-01	2025-09-01	2025-08-25	\N	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
86ce8cb8-6d13-4f21-963d-bd67d792f90f	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2025-12-01	2025-12-01	2025-11-24	\N	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
6ac37659-6948-4a51-bc59-888393139c9f	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2026-03-01	2026-02-27	2026-02-20	Adjusted from Sunday (01 Mar 2026) to previous business day (Friday    27 Feb 2026)	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
0dfc8f47-5d3d-4a69-8129-3ec3501184ac	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2026-06-01	2026-05-29	2026-05-22	Adjusted from Reconciliation Day (Monday    01 Jun 2026) to previous business day (Friday    29 May 2026)	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
3ea7f944-c4a2-4297-96b5-8802868ba364	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2026-09-01	2026-09-01	2026-08-25	\N	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
6317bbfb-94b5-4cc4-87ba-318e2ee94d20	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2026-12-01	2026-12-01	2026-11-24	\N	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
30254970-0365-498e-bd37-748599a481f9	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2027-03-01	2027-03-01	2027-02-22	\N	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
0dd66cef-7fa4-4e13-9eab-7471f377190d	2b70eb57-bd0f-4b4c-9341-870fb9df1f60	2027-06-01	2027-06-01	2027-05-25	\N	2025-06-02 03:12:09.127644+00	2025-06-02 03:12:09.127644+00
053c093e-12aa-4158-830c-05af63062781	90070d99-0c19-448f-a940-8afb852cf106	2024-12-15	2024-12-16	2024-12-06	Adjusted from Sunday (15 Dec 2024) to next business day (Monday    16 Dec 2024)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
1f3b4cf1-6ca7-4da1-8783-ea3b4adfa5f6	90070d99-0c19-448f-a940-8afb852cf106	2025-01-15	2025-01-15	2025-01-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
38ea40e0-d82d-40cf-867b-082762bda23e	90070d99-0c19-448f-a940-8afb852cf106	2025-02-14	2025-02-14	2025-02-06	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
dcae62bb-7d21-47ed-9a71-27400fca83a3	90070d99-0c19-448f-a940-8afb852cf106	2025-03-15	2025-03-17	2025-03-06	Adjusted from Saturday (15 Mar 2025) to next business day (Monday    17 Mar 2025)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
2ebcb4a2-2994-4d97-9579-364fec781c45	90070d99-0c19-448f-a940-8afb852cf106	2025-04-15	2025-04-15	2025-04-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
63d9fc43-2bf4-4b7d-aae9-124d9740f1d2	90070d99-0c19-448f-a940-8afb852cf106	2025-05-15	2025-05-15	2025-05-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
22eff701-5f2e-48d4-9df7-3f198f4a6061	90070d99-0c19-448f-a940-8afb852cf106	2025-06-15	2025-06-16	2025-06-05	Adjusted from Sunday (15 Jun 2025) to next business day (Monday    16 Jun 2025)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
7d1cae92-6fbe-4601-9f8a-0be942bd2816	90070d99-0c19-448f-a940-8afb852cf106	2025-07-15	2025-07-15	2025-07-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
23051090-d095-4a90-ad90-1fae7bb65613	90070d99-0c19-448f-a940-8afb852cf106	2025-08-15	2025-08-15	2025-08-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
ffd46a6f-ed08-432a-9dd3-e24b69bb5cc7	90070d99-0c19-448f-a940-8afb852cf106	2025-09-15	2025-09-15	2025-09-05	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
42e3dbc8-4f4e-45b1-bb1f-227bb222732d	90070d99-0c19-448f-a940-8afb852cf106	2025-10-15	2025-10-15	2025-10-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
179fbd95-7cfd-4879-b60a-c9ffd38b6994	90070d99-0c19-448f-a940-8afb852cf106	2025-11-15	2025-11-17	2025-11-07	Adjusted from Saturday (15 Nov 2025) to next business day (Monday    17 Nov 2025)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
42566a49-7f94-4705-bc85-655ae31c4feb	90070d99-0c19-448f-a940-8afb852cf106	2025-12-15	2025-12-15	2025-12-05	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
26a97ee6-fe96-435a-89e2-23537d7404c0	90070d99-0c19-448f-a940-8afb852cf106	2026-01-15	2026-01-15	2026-01-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
6a5809df-9055-46c0-b2c6-8bfb5e842ce8	90070d99-0c19-448f-a940-8afb852cf106	2026-02-14	2026-02-16	2026-02-06	Adjusted from Saturday (14 Feb 2026) to next business day (Monday    16 Feb 2026)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
27b20780-63e7-4705-910e-7509267e6013	90070d99-0c19-448f-a940-8afb852cf106	2026-03-15	2026-03-16	2026-03-05	Adjusted from Sunday (15 Mar 2026) to next business day (Monday    16 Mar 2026)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
39226f57-bd82-4757-86e1-864e0c295442	90070d99-0c19-448f-a940-8afb852cf106	2026-04-15	2026-04-15	2026-04-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
5b68991a-6aef-4e05-9630-09bb95757ecb	90070d99-0c19-448f-a940-8afb852cf106	2026-05-15	2026-05-15	2026-05-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
041de67e-3a7f-4cf7-96fc-d2a4bbe730d1	90070d99-0c19-448f-a940-8afb852cf106	2026-06-15	2026-06-15	2026-06-04	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
30d9c937-7942-4b2d-a26c-c03beaa9c8c2	90070d99-0c19-448f-a940-8afb852cf106	2026-07-15	2026-07-15	2026-07-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
e80748fe-950a-4435-b924-e746db87a416	90070d99-0c19-448f-a940-8afb852cf106	2026-08-15	2026-08-17	2026-08-07	Adjusted from Saturday (15 Aug 2026) to next business day (Monday    17 Aug 2026)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
6ac98912-a9b5-481d-bed2-dcbb5eeb5c13	90070d99-0c19-448f-a940-8afb852cf106	2026-09-15	2026-09-15	2026-09-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
31a253bf-48c1-456c-bec8-1b9bf3fe40a0	90070d99-0c19-448f-a940-8afb852cf106	2026-10-15	2026-10-15	2026-10-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
c5855278-5512-485d-9823-18d7f482e56c	90070d99-0c19-448f-a940-8afb852cf106	2026-11-15	2026-11-16	2026-11-06	Adjusted from Sunday (15 Nov 2026) to next business day (Monday    16 Nov 2026)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
0ffbdd64-8023-4c58-b430-d6b6ebdd21f4	90070d99-0c19-448f-a940-8afb852cf106	2026-12-15	2026-12-15	2026-12-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
fc9626dd-c371-4733-9408-3b76946da03b	90070d99-0c19-448f-a940-8afb852cf106	2027-01-15	2027-01-15	2027-01-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
d6a5a274-f75b-4dac-a2c4-fd379355c1ea	90070d99-0c19-448f-a940-8afb852cf106	2027-02-14	2027-02-15	2027-02-05	Adjusted from Sunday (14 Feb 2027) to next business day (Monday    15 Feb 2027)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
ddb918dc-a3fd-4bda-9102-4066e3cbc939	90070d99-0c19-448f-a940-8afb852cf106	2027-03-15	2027-03-15	2027-03-05	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
87da3f22-bff8-4762-998a-07e463e78670	90070d99-0c19-448f-a940-8afb852cf106	2027-04-15	2027-04-15	2027-04-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
2e67fca3-8576-4b7b-a04c-0c63425e2a61	90070d99-0c19-448f-a940-8afb852cf106	2027-05-15	2027-05-17	2027-05-07	Adjusted from Saturday (15 May 2027) to next business day (Monday    17 May 2027)	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
29e12464-27bf-4a0f-a284-afb3f104ef92	90070d99-0c19-448f-a940-8afb852cf106	2027-06-15	2027-06-15	2027-06-07	\N	2025-06-02 03:12:09.142586+00	2025-06-02 03:12:09.142586+00
5d88891f-9c51-42a9-92a4-191250d27d6b	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2024-12-31	2024-12-31	2024-12-27	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
89ddf1db-2912-4808-b133-dc92c3461cba	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-01-31	2025-01-31	2025-01-29	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
1df15056-09a0-4b66-8544-ac21006cb688	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-02-28	2025-02-28	2025-02-26	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
70666aa7-766e-4a61-bee9-13a96f617623	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-03-31	2025-03-31	2025-03-27	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
b81b0874-b0b5-4e86-a5ec-7e69833e6c12	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-04-30	2025-04-30	2025-04-28	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
3fc0d83e-1c56-4909-a8e1-1efbfb73be01	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-05-31	2025-05-30	2025-05-28	Adjusted from Saturday (31 May 2025) to previous business day (Friday    30 May 2025)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
95055088-6e06-4845-921a-dd18d351a215	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-06-30	2025-06-30	2025-06-26	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
44f41787-cd97-46dc-bca3-f57ea8f16875	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-07-31	2025-07-31	2025-07-29	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
5a65fad6-8d3a-4fcb-b744-fa7cb7edc7e4	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-08-31	2025-08-29	2025-08-27	Adjusted from Sunday (31 Aug 2025) to previous business day (Friday    29 Aug 2025)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
439a2589-f388-48f2-9a90-dcfccfa679ae	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-09-30	2025-09-30	2025-09-25	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
88aa2a04-74ca-4b52-9f03-214007ac0805	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-10-31	2025-10-31	2025-10-29	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
57be293e-25dd-4885-9e59-8b0e2607e8bf	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-11-30	2025-11-28	2025-11-26	Adjusted from Sunday (30 Nov 2025) to previous business day (Friday    28 Nov 2025)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
7b7f85e6-bb2c-4db5-8252-b8a80a4e6a74	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2025-12-31	2025-12-31	2025-12-29	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
1619dbe6-7883-4c61-9406-cbb021e3c981	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-01-31	2026-01-30	2026-01-28	Adjusted from Saturday (31 Jan 2026) to previous business day (Friday    30 Jan 2026)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
4a83893f-3243-4e35-aff6-01071db78e5e	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-02-28	2026-02-27	2026-02-25	Adjusted from Saturday (28 Feb 2026) to previous business day (Friday    27 Feb 2026)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
af712cd0-6381-4541-8494-5de092237739	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-03-31	2026-03-31	2026-03-27	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
bcd126af-24c7-49bf-88ed-55fbfa089354	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-04-30	2026-04-30	2026-04-28	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
466c99bb-eafb-40d0-a963-1a7d19a4a247	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-05-31	2026-05-29	2026-05-27	Adjusted from Sunday (31 May 2026) to previous business day (Friday    29 May 2026)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
92ed39d5-fa2d-4e31-88cd-b96714aeb164	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-06-30	2026-06-30	2026-06-26	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
5dbe0345-9e7f-4e2a-9e20-e4cff119d41e	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-07-31	2026-07-31	2026-07-29	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
d218c5e8-0b9f-47b7-8bbf-f62ad4fa0725	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-08-31	2026-08-31	2026-08-27	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
84e15b25-3a48-49e0-b249-854695ee7e25	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-09-30	2026-09-30	2026-09-24	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
141f012a-360f-4d35-97f2-a1b277b59cf5	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-10-31	2026-10-30	2026-10-28	Adjusted from Saturday (31 Oct 2026) to previous business day (Friday    30 Oct 2026)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
f16bc076-11b4-4d8d-aa2e-baff0d6cd101	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-11-30	2026-11-30	2026-11-26	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
f86b66c2-a2bd-42b1-9209-263700faf9f7	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2026-12-31	2026-12-31	2026-12-29	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
dfc40f3c-2864-4d93-91d4-2f35a0251ca1	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2027-01-31	2027-01-29	2027-01-27	Adjusted from Sunday (31 Jan 2027) to previous business day (Friday    29 Jan 2027)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
f62c53ad-7c17-49c7-a15b-28abd9d46d74	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2027-02-28	2027-02-26	2027-02-24	Adjusted from Sunday (28 Feb 2027) to previous business day (Friday    26 Feb 2027)	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
9d0cc8d1-5e48-4ce4-98da-380494110f93	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2027-03-31	2027-03-31	2027-03-29	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
776e49cc-0739-476a-b5e5-e8754ebf7e00	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2027-04-30	2027-04-30	2027-04-28	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
a3c627f9-0c60-42c4-bd17-f603d294ca75	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2027-05-31	2027-05-31	2027-05-27	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
348b4099-18c2-4fd9-92e1-5eb2fad45bb8	6caecf93-0b00-4776-8bfd-943bf05fd7d4	2027-06-30	2027-06-30	2027-06-28	\N	2025-06-02 03:12:09.164581+00	2025-06-02 03:12:09.164581+00
d6f24d5d-c769-4b09-baf9-25211e66bb6e	539cda98-21f9-4f37-b314-c7b791d8093c	2024-12-31	2024-12-31	2024-12-18	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
3b6880cd-2483-437d-bc6a-5cd15f1b1322	539cda98-21f9-4f37-b314-c7b791d8093c	2025-01-31	2025-01-31	2025-01-21	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
7b21aa5c-3c87-495e-871d-939a808d99f7	539cda98-21f9-4f37-b314-c7b791d8093c	2025-02-28	2025-02-28	2025-02-19	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
601c27de-4bb9-4796-a8b0-eb8dbf198a25	539cda98-21f9-4f37-b314-c7b791d8093c	2025-03-31	2025-03-31	2025-03-20	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
ad6ba7ee-8e7b-4a2f-8f6c-f598ed1cb3ae	539cda98-21f9-4f37-b314-c7b791d8093c	2025-04-30	2025-04-30	2025-04-16	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
87b731d8-ce2d-4c04-985f-9211511abbdb	539cda98-21f9-4f37-b314-c7b791d8093c	2025-05-31	2025-05-30	2025-05-21	Adjusted from Saturday (31 May 2025) to previous business day (Friday    30 May 2025)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
b79bb0e7-082b-40cd-9620-8e4b4fd0a89d	539cda98-21f9-4f37-b314-c7b791d8093c	2025-06-30	2025-06-30	2025-06-19	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
6e202a69-86fc-4f98-a1b1-65cec9285865	539cda98-21f9-4f37-b314-c7b791d8093c	2025-07-31	2025-07-31	2025-07-22	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
db6ee6a4-c039-4899-80d7-0e26caae880b	539cda98-21f9-4f37-b314-c7b791d8093c	2025-08-31	2025-08-29	2025-08-20	Adjusted from Sunday (31 Aug 2025) to previous business day (Friday    29 Aug 2025)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
373d2ed2-70bd-48d8-aa65-b802050c004c	539cda98-21f9-4f37-b314-c7b791d8093c	2025-09-30	2025-09-30	2025-09-18	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
685fdd87-d260-4788-9c23-08ee123c4676	539cda98-21f9-4f37-b314-c7b791d8093c	2025-10-31	2025-10-31	2025-10-22	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
ace62936-71e0-4083-808c-c0735777fce3	539cda98-21f9-4f37-b314-c7b791d8093c	2025-11-30	2025-11-28	2025-11-19	Adjusted from Sunday (30 Nov 2025) to previous business day (Friday    28 Nov 2025)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
107f8449-fb1a-46bc-911f-8b1daf2db1d9	539cda98-21f9-4f37-b314-c7b791d8093c	2025-12-31	2025-12-31	2025-12-18	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
ac7751bd-b9b8-4a3f-ad98-d81b77dd900c	539cda98-21f9-4f37-b314-c7b791d8093c	2026-01-31	2026-01-30	2026-01-20	Adjusted from Saturday (31 Jan 2026) to previous business day (Friday    30 Jan 2026)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
22504e56-f5a4-4583-96f6-27794024d8e8	539cda98-21f9-4f37-b314-c7b791d8093c	2026-02-28	2026-02-27	2026-02-18	Adjusted from Saturday (28 Feb 2026) to previous business day (Friday    27 Feb 2026)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
f1ae9995-d475-4102-874d-2cf92c1ddbd7	539cda98-21f9-4f37-b314-c7b791d8093c	2026-03-31	2026-03-31	2026-03-20	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
aed5a2b1-9782-4eb0-9032-bbbe4f75cd26	539cda98-21f9-4f37-b314-c7b791d8093c	2026-04-30	2026-04-30	2026-04-21	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
316891bc-f1c9-4a7f-8311-099f72158f8a	539cda98-21f9-4f37-b314-c7b791d8093c	2026-05-31	2026-05-29	2026-05-20	Adjusted from Sunday (31 May 2026) to previous business day (Friday    29 May 2026)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
6fe364cb-c65f-485e-9ef7-1375dd8b08d7	539cda98-21f9-4f37-b314-c7b791d8093c	2026-06-30	2026-06-30	2026-06-19	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
92a40070-2fbc-42e8-b52c-4c220bf2b13d	539cda98-21f9-4f37-b314-c7b791d8093c	2026-07-31	2026-07-31	2026-07-22	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
4dde1592-01e6-41ff-aff1-1761eb8f3888	539cda98-21f9-4f37-b314-c7b791d8093c	2026-08-31	2026-08-31	2026-08-20	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
99f2f12d-5ede-4567-b8cc-00dcc2cc63f3	539cda98-21f9-4f37-b314-c7b791d8093c	2026-09-30	2026-09-30	2026-09-17	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
8d79cd9d-3d15-4f8f-8118-d193952fab13	539cda98-21f9-4f37-b314-c7b791d8093c	2026-10-31	2026-10-30	2026-10-21	Adjusted from Saturday (31 Oct 2026) to previous business day (Friday    30 Oct 2026)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
2b66624d-507c-4a1d-9932-396130dccb32	539cda98-21f9-4f37-b314-c7b791d8093c	2026-11-30	2026-11-30	2026-11-19	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
62ba17fb-f7ed-4b72-83c0-30f685ba06e1	539cda98-21f9-4f37-b314-c7b791d8093c	2026-12-31	2026-12-31	2026-12-18	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
febcbde8-24f5-4ad6-9b7d-af5affc92d88	539cda98-21f9-4f37-b314-c7b791d8093c	2027-01-31	2027-01-29	2027-01-20	Adjusted from Sunday (31 Jan 2027) to previous business day (Friday    29 Jan 2027)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
be15f717-bc9d-4532-8e08-4ba9f1d70602	539cda98-21f9-4f37-b314-c7b791d8093c	2027-02-28	2027-02-26	2027-02-17	Adjusted from Sunday (28 Feb 2027) to previous business day (Friday    26 Feb 2027)	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
22b999d8-3401-4edb-be46-d2c7bf90c48b	539cda98-21f9-4f37-b314-c7b791d8093c	2027-03-31	2027-03-31	2027-03-22	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
2527f8f7-0328-4d2d-a774-b017aa74954e	539cda98-21f9-4f37-b314-c7b791d8093c	2027-04-30	2027-04-30	2027-04-21	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
8d592273-2611-4a57-8db8-73296e00d398	539cda98-21f9-4f37-b314-c7b791d8093c	2027-05-31	2027-05-31	2027-05-20	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
02a63505-cb21-44e1-b90c-0c559c31822c	539cda98-21f9-4f37-b314-c7b791d8093c	2027-06-30	2027-06-30	2027-06-21	\N	2025-06-02 03:12:09.183584+00	2025-06-02 03:12:09.183584+00
5a6d7668-d843-400c-880b-55745b078fe8	c963a50e-f21e-48b3-8357-fa116b770ab8	2024-12-31	2024-12-31	2024-12-27	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
4e6d5878-8ba9-4b2d-a794-c107db7863dc	c963a50e-f21e-48b3-8357-fa116b770ab8	2025-03-31	2025-03-31	2025-03-27	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
0fca28d5-1add-464d-a8f9-5adee21c7ce4	c963a50e-f21e-48b3-8357-fa116b770ab8	2025-06-30	2025-06-30	2025-06-26	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
e759fa76-008b-4d06-a505-b49208a936c4	c963a50e-f21e-48b3-8357-fa116b770ab8	2025-09-30	2025-09-30	2025-09-25	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
131fd1cb-96ea-4cb6-bc7d-f5e9b9cf6c1c	c963a50e-f21e-48b3-8357-fa116b770ab8	2025-12-31	2025-12-31	2025-12-29	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
7c144e28-44df-4ee2-822f-194327fed8e4	c963a50e-f21e-48b3-8357-fa116b770ab8	2026-03-31	2026-03-31	2026-03-27	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
f0cfe271-31d7-43c2-85ae-079d9ccc608b	c963a50e-f21e-48b3-8357-fa116b770ab8	2026-06-30	2026-06-30	2026-06-26	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
9e74367a-84ec-463a-9b4c-75a359db2c46	c963a50e-f21e-48b3-8357-fa116b770ab8	2026-09-30	2026-09-30	2026-09-24	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
32cf9cfd-d7ac-4f49-bbe6-e2798c87844f	c963a50e-f21e-48b3-8357-fa116b770ab8	2026-12-31	2026-12-31	2026-12-29	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
78da447d-a19e-42e5-b44e-6842cec97b7d	c963a50e-f21e-48b3-8357-fa116b770ab8	2027-03-31	2027-03-31	2027-03-29	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
f004cb09-1b5f-47e8-84e7-90b48ba5a6f5	c963a50e-f21e-48b3-8357-fa116b770ab8	2027-06-30	2027-06-30	2027-06-28	\N	2025-06-02 03:12:09.205651+00	2025-06-02 03:12:09.205651+00
1900ec2d-6738-42e7-92a8-2589f69ff08c	dfb29321-c8e8-473d-941f-64406beace52	2024-12-13	2024-12-13	2024-12-12	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
2fad336e-6307-4e68-8d71-b2c45e9caaa6	dfb29321-c8e8-473d-941f-64406beace52	2025-01-03	2025-01-03	2025-01-02	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
5f444464-e22c-42d8-ae2f-791e8a3caa05	dfb29321-c8e8-473d-941f-64406beace52	2025-01-17	2025-01-17	2025-01-16	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
36cdec6e-edf9-4a5a-9202-65fc68e7658c	dfb29321-c8e8-473d-941f-64406beace52	2025-01-31	2025-01-31	2025-01-30	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
9bcca6c8-7a59-4016-a653-0183faa36770	dfb29321-c8e8-473d-941f-64406beace52	2025-02-14	2025-02-14	2025-02-13	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
6a991697-0aee-4c52-97f3-3677ea362a51	dfb29321-c8e8-473d-941f-64406beace52	2025-02-28	2025-02-28	2025-02-27	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
c0a98d16-bc1e-4f49-89f8-1830c7853edc	dfb29321-c8e8-473d-941f-64406beace52	2025-03-14	2025-03-14	2025-03-13	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
4ebcc1a9-9685-41b4-acce-3e5c53c9d546	dfb29321-c8e8-473d-941f-64406beace52	2025-03-28	2025-03-28	2025-03-27	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
b140df07-c0c4-4b0f-9a9d-b638378a0b1b	dfb29321-c8e8-473d-941f-64406beace52	2025-04-11	2025-04-11	2025-04-10	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
74fdf718-4314-4239-9737-a885fc604749	dfb29321-c8e8-473d-941f-64406beace52	2025-04-25	2025-04-24	2025-04-23	Adjusted from Anzac Day (Friday    25 Apr 2025) to previous business day (Thursday  24 Apr 2025)	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
73a354c2-ec14-4280-b6c7-2663207bdbf9	dfb29321-c8e8-473d-941f-64406beace52	2025-05-09	2025-05-09	2025-05-08	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
78807288-e2b9-400c-a5e2-0be6ebd794e6	dfb29321-c8e8-473d-941f-64406beace52	2025-05-23	2025-05-23	2025-05-22	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
057d0883-a58f-42c5-8ba1-92e4adbac0e4	dfb29321-c8e8-473d-941f-64406beace52	2025-06-06	2025-06-06	2025-06-05	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
058988e2-8d48-4270-95e1-8b4ca6f4372e	dfb29321-c8e8-473d-941f-64406beace52	2025-06-20	2025-06-20	2025-06-19	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
c55d5998-29b6-4935-8e83-e96f29d42122	dfb29321-c8e8-473d-941f-64406beace52	2025-07-04	2025-07-04	2025-07-03	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
1ca9275d-b025-4ec7-9de5-ce4a78bcac1e	dfb29321-c8e8-473d-941f-64406beace52	2025-07-18	2025-07-18	2025-07-17	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
03e7c159-2fad-46ed-8953-3b8940ec3ead	dfb29321-c8e8-473d-941f-64406beace52	2025-08-01	2025-08-01	2025-07-31	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
56c48e36-6edf-44e6-99f3-33978ab36e40	dfb29321-c8e8-473d-941f-64406beace52	2025-08-15	2025-08-15	2025-08-14	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
54386bab-c989-4a6d-8bd9-9033ae55ec64	dfb29321-c8e8-473d-941f-64406beace52	2025-08-29	2025-08-29	2025-08-28	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
c0e3b465-53e7-4937-bb8d-132b5386f8b6	dfb29321-c8e8-473d-941f-64406beace52	2025-09-12	2025-09-12	2025-09-11	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
278fdd79-495f-4fef-ab2c-5739b94a4337	dfb29321-c8e8-473d-941f-64406beace52	2025-09-26	2025-09-26	2025-09-25	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
8f44d750-f3d3-4bb6-b5dd-7752df8c619e	dfb29321-c8e8-473d-941f-64406beace52	2025-10-10	2025-10-10	2025-10-09	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
3cc34de0-053b-4b84-8bd2-37b56979cc28	dfb29321-c8e8-473d-941f-64406beace52	2025-10-24	2025-10-24	2025-10-23	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
cc049bd4-bc66-4691-bf52-fc1a6dd16dbd	dfb29321-c8e8-473d-941f-64406beace52	2025-11-07	2025-11-07	2025-11-06	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
4bb4c2f5-9440-418b-8e9f-60d2de6f013c	dfb29321-c8e8-473d-941f-64406beace52	2025-11-21	2025-11-21	2025-11-20	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
be79ea6a-1bc0-46cb-98c4-6fe5dfcdbe4c	dfb29321-c8e8-473d-941f-64406beace52	2025-12-05	2025-12-05	2025-12-04	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
40a7c183-05cd-4800-a9fb-4832beb608be	dfb29321-c8e8-473d-941f-64406beace52	2025-12-19	2025-12-19	2025-12-18	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
fb20c97c-1c2b-420f-8360-1de8cb30ffc0	dfb29321-c8e8-473d-941f-64406beace52	2026-01-02	2026-01-02	2025-12-31	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
0485eaae-4ad5-4f01-b97b-f83c059d1075	dfb29321-c8e8-473d-941f-64406beace52	2026-01-16	2026-01-16	2026-01-15	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
dfce807a-dce1-4893-894a-6f740f8e97c4	dfb29321-c8e8-473d-941f-64406beace52	2026-01-30	2026-01-30	2026-01-29	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
0379569a-4896-4fc6-b850-544fff992f34	dfb29321-c8e8-473d-941f-64406beace52	2026-02-13	2026-02-13	2026-02-12	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
8f444a4e-71fd-481c-a129-28ad88dbdae7	dfb29321-c8e8-473d-941f-64406beace52	2026-02-27	2026-02-27	2026-02-26	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
bea09747-35ed-4b61-9a8e-b4d7c3e6ad63	dfb29321-c8e8-473d-941f-64406beace52	2026-03-13	2026-03-13	2026-03-12	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
7c4f089b-cc34-45fe-9fde-e26d52aa869e	dfb29321-c8e8-473d-941f-64406beace52	2026-03-27	2026-03-27	2026-03-26	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
663808c7-928e-4005-93ea-d3d397aed456	dfb29321-c8e8-473d-941f-64406beace52	2026-04-10	2026-04-10	2026-04-09	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
5585c625-27bf-497b-9d7e-bfb3e18c5e12	dfb29321-c8e8-473d-941f-64406beace52	2026-04-24	2026-04-24	2026-04-23	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
4a98097d-824d-4a08-8ce6-e3192c4cf810	dfb29321-c8e8-473d-941f-64406beace52	2026-05-08	2026-05-08	2026-05-07	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
bd044b14-a2aa-4aa9-91c0-6a403211b068	dfb29321-c8e8-473d-941f-64406beace52	2026-05-22	2026-05-22	2026-05-21	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
84253de4-f5f7-4a17-9507-2d65b29a5ffb	dfb29321-c8e8-473d-941f-64406beace52	2026-06-05	2026-06-05	2026-06-04	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
c1b96402-f6ea-4283-ada6-28e2545ba8d3	dfb29321-c8e8-473d-941f-64406beace52	2026-06-19	2026-06-19	2026-06-18	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
da56f243-37fc-4ba3-b535-5bdfaca63719	dfb29321-c8e8-473d-941f-64406beace52	2026-07-03	2026-07-03	2026-07-02	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
d1247f26-6080-467b-956b-ee83160e1f36	dfb29321-c8e8-473d-941f-64406beace52	2026-07-17	2026-07-17	2026-07-16	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
636f46ee-6348-4d46-911b-68829c7973f5	dfb29321-c8e8-473d-941f-64406beace52	2026-07-31	2026-07-31	2026-07-30	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
8b1107e8-523c-4c06-861e-afc4f81889b7	dfb29321-c8e8-473d-941f-64406beace52	2026-08-14	2026-08-14	2026-08-13	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
8f0efee0-7723-4483-bde0-572b1e5ee04b	dfb29321-c8e8-473d-941f-64406beace52	2026-08-28	2026-08-28	2026-08-27	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
9c26a6ef-4501-4b45-a1c5-c80c7f878e1f	dfb29321-c8e8-473d-941f-64406beace52	2026-09-11	2026-09-11	2026-09-10	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
b6dc95cc-5e35-4a43-b5e9-c6c9a7b66118	dfb29321-c8e8-473d-941f-64406beace52	2026-09-25	2026-09-24	2026-09-23	Adjusted from Friday before AFL Grand Final (Tentative Date) (Friday    25 Sep 2026) to previous business day (Thursday  24 Sep 2026)	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
80b45454-52ec-4cef-8eb1-9c8002a00c8e	dfb29321-c8e8-473d-941f-64406beace52	2026-10-09	2026-10-09	2026-10-08	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
fb618de1-4bf0-426e-8e5c-8b933876ba97	dfb29321-c8e8-473d-941f-64406beace52	2026-10-23	2026-10-23	2026-10-22	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
4fb2d711-ae56-4b4b-931e-3b4e46e89851	dfb29321-c8e8-473d-941f-64406beace52	2026-11-06	2026-11-06	2026-11-05	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
56125dc6-7a55-4a08-8ff9-8395be109813	dfb29321-c8e8-473d-941f-64406beace52	2026-11-20	2026-11-20	2026-11-19	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
03d2ddde-90dc-4124-9016-fcdae9486842	dfb29321-c8e8-473d-941f-64406beace52	2026-12-04	2026-12-04	2026-12-03	\N	2025-06-02 03:12:09.217626+00	2025-06-02 03:12:09.217626+00
420e3f60-a586-467a-9564-fae60478220b	fabe13b6-395a-489f-8003-69668a89cfe5	2024-12-05	2024-12-05	2024-12-02	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
5b6f6b90-7f90-45dc-b022-42d30d5f2530	fabe13b6-395a-489f-8003-69668a89cfe5	2024-12-12	2024-12-12	2024-12-09	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
7cf316fd-0b52-4174-871b-17afba43950f	fabe13b6-395a-489f-8003-69668a89cfe5	2024-12-19	2024-12-19	2024-12-16	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
748d089a-6bfe-4a33-b267-90f88cded3fc	fabe13b6-395a-489f-8003-69668a89cfe5	2024-12-26	2024-12-24	2024-12-19	Adjusted from Boxing Day (Thursday  26 Dec 2024) to previous business day (Tuesday   24 Dec 2024)	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
8618a6a0-2ef9-4b3f-aed1-a84f612f8ab4	fabe13b6-395a-489f-8003-69668a89cfe5	2025-01-02	2025-01-02	2024-12-27	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
0d2f6828-0787-47a5-a30a-5d7113332254	fabe13b6-395a-489f-8003-69668a89cfe5	2025-01-09	2025-01-09	2025-01-06	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
830cce68-2885-447c-b429-8bd994f72fbc	fabe13b6-395a-489f-8003-69668a89cfe5	2025-01-16	2025-01-16	2025-01-13	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
b7fa37d1-b452-4bd9-91aa-35000f630875	fabe13b6-395a-489f-8003-69668a89cfe5	2025-01-23	2025-01-23	2025-01-20	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
bff6d3ed-39e8-43c8-9075-95680f0b719d	fabe13b6-395a-489f-8003-69668a89cfe5	2025-01-30	2025-01-30	2025-01-24	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
44415f53-12de-4bcd-b695-86aee11b46dc	fabe13b6-395a-489f-8003-69668a89cfe5	2025-02-06	2025-02-06	2025-02-03	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
b634f6cf-080d-49cf-b929-74bb403c3dca	fabe13b6-395a-489f-8003-69668a89cfe5	2025-02-13	2025-02-13	2025-02-10	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
665a12e1-5664-4709-8a01-8b8254b2aa04	fabe13b6-395a-489f-8003-69668a89cfe5	2025-02-20	2025-02-20	2025-02-17	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
af79c49e-c91b-4da9-9174-10b399402a31	fabe13b6-395a-489f-8003-69668a89cfe5	2025-02-27	2025-02-27	2025-02-24	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
2ff477d8-d7b2-4a5a-a727-a7d88c78ca64	fabe13b6-395a-489f-8003-69668a89cfe5	2025-03-06	2025-03-06	2025-02-28	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
249d5f08-4b62-45ea-a5f8-2a42dc51411c	fabe13b6-395a-489f-8003-69668a89cfe5	2025-03-13	2025-03-13	2025-03-07	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
f7d050f8-34a5-4e93-a146-78b196ed506f	fabe13b6-395a-489f-8003-69668a89cfe5	2025-03-20	2025-03-20	2025-03-17	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
e8ce50a1-b752-4dfa-9366-b8706a12c71b	fabe13b6-395a-489f-8003-69668a89cfe5	2025-03-27	2025-03-27	2025-03-24	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
aa98f6f5-77a2-4c86-b7cc-acda14f602d1	fabe13b6-395a-489f-8003-69668a89cfe5	2025-04-03	2025-04-03	2025-03-31	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
2730380a-8724-4ca2-8f67-ab762415747f	fabe13b6-395a-489f-8003-69668a89cfe5	2025-04-10	2025-04-10	2025-04-07	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
d1c7bfed-ea53-4efd-be84-5f07f40de02d	fabe13b6-395a-489f-8003-69668a89cfe5	2025-04-17	2025-04-17	2025-04-14	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
7eb62f6f-57b7-4c1e-9f38-4169472be6cb	fabe13b6-395a-489f-8003-69668a89cfe5	2025-04-24	2025-04-24	2025-04-17	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
d911cc4b-4ed7-4cbc-8917-9e7b83932fdc	fabe13b6-395a-489f-8003-69668a89cfe5	2025-05-01	2025-05-01	2025-04-28	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
6398c19d-9bc1-4e36-a8a9-07c90500183e	fabe13b6-395a-489f-8003-69668a89cfe5	2025-05-08	2025-05-08	2025-05-02	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
70e33714-82dd-4d8b-a744-b4f82a814694	fabe13b6-395a-489f-8003-69668a89cfe5	2025-05-15	2025-05-15	2025-05-12	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
3abe77fd-4121-42d3-8966-289181e16fad	fabe13b6-395a-489f-8003-69668a89cfe5	2025-05-22	2025-05-22	2025-05-19	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
a2972118-aa70-4d16-b8bf-fa1b71e4dc10	fabe13b6-395a-489f-8003-69668a89cfe5	2025-05-29	2025-05-29	2025-05-26	\N	2025-06-02 03:12:09.236592+00	2025-06-02 03:12:09.236592+00
d9bda0ca-46a5-4240-9fd4-75872013f16b	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2024-12-15	2024-12-16	2024-12-11	Adjusted from Sunday (15 Dec 2024) to next business day (Monday    16 Dec 2024)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
b07fa349-4ab1-46be-aa00-f38aa99524b9	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-01-15	2025-01-15	2025-01-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
3f7c6c23-6ef8-4e63-bd75-cb19e38e6df4	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-02-14	2025-02-14	2025-02-11	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
d5072e22-aa39-4ad6-853f-27f231ad4789	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-03-15	2025-03-17	2025-03-12	Adjusted from Saturday (15 Mar 2025) to next business day (Monday    17 Mar 2025)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
265c7c72-a8e3-4cc9-b0dc-a243d7091451	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-04-15	2025-04-15	2025-04-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
d942aaa9-7e13-4cba-aab0-0f89f9ca6baa	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-05-15	2025-05-15	2025-05-12	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
9b068398-a157-4ef5-8e4d-cc5ab1e5de56	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-06-15	2025-06-16	2025-06-11	Adjusted from Sunday (15 Jun 2025) to next business day (Monday    16 Jun 2025)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
5663c28d-a3af-40fe-a1f1-066e74fc532f	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-07-15	2025-07-15	2025-07-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
c8add897-b72f-41c5-a01e-dd50ec150a41	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-08-15	2025-08-15	2025-08-12	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
10379e2e-93f2-4243-b9c5-e39d5b2082e5	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-09-15	2025-09-15	2025-09-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
ea88c2b9-ca90-4f59-83f8-80d0c52000d1	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-10-15	2025-10-15	2025-10-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
a5d63513-0790-451d-af6c-c367137cbc32	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-11-15	2025-11-17	2025-11-12	Adjusted from Saturday (15 Nov 2025) to next business day (Monday    17 Nov 2025)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
9e7deba3-b3af-4e57-bfc7-2fff2e073198	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2025-12-15	2025-12-15	2025-12-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
441798da-0d11-4385-b1e2-914e8c681a5a	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-01-15	2026-01-15	2026-01-12	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
4d35025c-e83d-4c64-bb37-c82cc46390d3	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-02-14	2026-02-16	2026-02-11	Adjusted from Saturday (14 Feb 2026) to next business day (Monday    16 Feb 2026)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
7c57fd72-c9d6-44f0-86ac-40aecf8f25d1	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-03-15	2026-03-16	2026-03-11	Adjusted from Sunday (15 Mar 2026) to next business day (Monday    16 Mar 2026)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
59e31a9e-d03f-4d66-bf68-537a2d263b8e	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-04-15	2026-04-15	2026-04-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
1d5508b9-6477-4dac-b6ed-aa8bc158a0ff	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-05-15	2026-05-15	2026-05-12	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
0cc31ec6-7f35-4c6c-bfc0-b487b75ea65d	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-06-15	2026-06-15	2026-06-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
6dae6e1b-90d7-4a18-8e8d-75250d1716eb	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-07-15	2026-07-15	2026-07-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
80eef378-c9dd-40fb-8671-6ff9cae45e1f	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-08-15	2026-08-17	2026-08-12	Adjusted from Saturday (15 Aug 2026) to next business day (Monday    17 Aug 2026)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
835a5383-043e-47a0-91e0-5718aeb9f280	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-09-15	2026-09-15	2026-09-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
93e8852c-bf37-4169-a317-b37b51a5eec3	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-10-15	2026-10-15	2026-10-12	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
23d6ffbd-1607-4d51-8654-cd8222878acb	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-11-15	2026-11-16	2026-11-11	Adjusted from Sunday (15 Nov 2026) to next business day (Monday    16 Nov 2026)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
534b7f3c-5a91-4e3d-85aa-6f7e23141fda	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2026-12-15	2026-12-15	2026-12-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
307c3932-a6f3-4c4c-b910-8e77b18c9ab9	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2027-01-15	2027-01-15	2027-01-12	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
3dee1561-fc85-45e9-a91e-34a9903e5840	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2027-02-14	2027-02-15	2027-02-10	Adjusted from Sunday (14 Feb 2027) to next business day (Monday    15 Feb 2027)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
92b3190b-ffcc-4a0b-91d0-6e5107d4319a	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2027-03-15	2027-03-15	2027-03-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
516471cd-27c1-48d6-9e6f-0a17e841c02b	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2027-04-15	2027-04-15	2027-04-12	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
d7342006-074e-4e29-a560-c27411e5dedb	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2027-05-15	2027-05-17	2027-05-12	Adjusted from Saturday (15 May 2027) to next business day (Monday    17 May 2027)	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
acfdce82-2e47-4b77-b53a-f54c9bc1a655	0fce8712-f65b-4dd5-96a9-d1c86c8b7138	2027-06-15	2027-06-15	2027-06-10	\N	2025-06-02 03:12:09.256581+00	2025-06-02 03:12:09.256581+00
0862f3eb-a097-4fa0-97d2-eedb20e7fa29	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2024-12-29	2024-12-27	2024-12-19	Adjusted from Sunday (29 Dec 2024) to previous business day (Friday    27 Dec 2024)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
2578fa86-5f68-4217-a123-f165f4c393ba	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-01-29	2025-01-29	2025-01-22	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
2918a2fd-ba9a-4d82-848f-3d9e19e6ccfa	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-02-28	2025-02-28	2025-02-24	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
aee6abfd-7a5f-49a4-8648-377245bdd154	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-03-29	2025-03-28	2025-03-24	Adjusted from Saturday (29 Mar 2025) to previous business day (Friday    28 Mar 2025)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
a295bd99-db70-4f93-b49c-f7d2568d971b	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-04-29	2025-04-29	2025-04-22	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
727b8efb-f152-47c7-a161-b76d38871006	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-05-29	2025-05-29	2025-05-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
314a4106-dd2a-4a26-9f23-b47fa6314f5b	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-06-29	2025-06-27	2025-06-23	Adjusted from Sunday (29 Jun 2025) to previous business day (Friday    27 Jun 2025)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
88717279-8383-4628-9d9b-bd73d429d1a2	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-07-29	2025-07-29	2025-07-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
8e05ce62-aa8f-4e25-91e4-0b263f859631	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-08-29	2025-08-29	2025-08-25	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
33c9fdc9-1ca3-486b-827a-6a5ef2036c10	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-09-29	2025-09-26	2025-09-22	Adjusted from King's Birthday (Monday    29 Sep 2025) to previous business day (Friday    26 Sep 2025)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
37593252-f018-47db-9aff-8155a266e7c6	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-10-29	2025-10-29	2025-10-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
9888b8b2-29f3-40fc-adea-c863a12f0252	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-11-29	2025-11-28	2025-11-24	Adjusted from Saturday (29 Nov 2025) to previous business day (Friday    28 Nov 2025)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
00c3b53d-ca38-4934-a078-a28c442e8dbb	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2025-12-29	2025-12-29	2025-12-19	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
c9b110c0-747f-44db-9d20-2cb3233faa0f	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-01-29	2026-01-29	2026-01-22	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
015f3933-a8d9-46a5-a876-2504aef5a947	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-02-28	2026-02-27	2026-02-23	Adjusted from Saturday (28 Feb 2026) to previous business day (Friday    27 Feb 2026)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
fe27a24f-1df0-4d47-9537-74ed9f8e53b4	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-03-29	2026-03-27	2026-03-23	Adjusted from Sunday (29 Mar 2026) to previous business day (Friday    27 Mar 2026)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
293296cb-fa95-48ab-a2df-79ee2df2f60f	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-04-29	2026-04-29	2026-04-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
2bae43ef-7b4d-4bd3-b27b-fe78ec84bd0d	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-05-29	2026-05-29	2026-05-25	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
6652e4cb-9c7e-4935-af43-1a98954f4efd	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-06-29	2026-06-29	2026-06-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
d8f1e636-0b35-4659-94ea-94c6c9a44882	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-07-29	2026-07-29	2026-07-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
142a4bc7-4a76-42e5-9907-347142e3e6c2	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-08-29	2026-08-28	2026-08-24	Adjusted from Saturday (29 Aug 2026) to previous business day (Friday    28 Aug 2026)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
9c3e6dc0-2469-4604-aafc-c5fe3d7e923b	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-09-29	2026-09-29	2026-09-21	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
0dd7b67b-e0df-46eb-80ed-a3c73e8594f6	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-10-29	2026-10-29	2026-10-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
5916208a-876d-4ce6-8874-7287cd048003	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-11-29	2026-11-27	2026-11-23	Adjusted from Sunday (29 Nov 2026) to previous business day (Friday    27 Nov 2026)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
46d3bf98-a56e-4e79-ae4b-c260d8f6d1ea	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2026-12-29	2026-12-29	2026-12-21	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
e787e34d-3516-4bd1-8c9c-7a8fc5397ce7	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2027-01-29	2027-01-29	2027-01-25	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
83579e6e-e916-4474-b467-ab0ab4f44e03	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2027-02-28	2027-02-26	2027-02-22	Adjusted from Sunday (28 Feb 2027) to previous business day (Friday    26 Feb 2027)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
888f38a4-6cb7-4a10-b560-63758db52194	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2027-03-29	2027-03-29	2027-03-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
41af818f-eaa3-4c60-8b72-f836a0abcf02	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2027-04-29	2027-04-29	2027-04-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
1da9b018-6053-4bd3-b4b1-fde5fa1c0dc2	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2027-05-29	2027-05-28	2027-05-24	Adjusted from Saturday (29 May 2027) to previous business day (Friday    28 May 2027)	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
34535a5d-a53b-4451-ae22-339c593adf88	5c2ef179-308f-4545-bf7b-40c83b55f0c8	2027-06-29	2027-06-29	2027-06-23	\N	2025-06-02 03:12:09.275683+00	2025-06-02 03:12:09.275683+00
6905aebb-7299-423f-995d-27e5f6bee3e1	f4024875-34a3-4f82-a49d-e35a44726cda	2024-12-26	2024-12-24	2024-12-23	Adjusted from Boxing Day (Thursday  26 Dec 2024) to previous business day (Tuesday   24 Dec 2024)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
c818f19c-1ea3-4986-ac63-451b80e26cf0	f4024875-34a3-4f82-a49d-e35a44726cda	2025-01-26	2025-01-24	2025-01-23	Adjusted from Sunday (26 Jan 2025) to previous business day (Friday    24 Jan 2025)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
ec435da3-82f8-419d-9e1a-0b9f40a1c79d	f4024875-34a3-4f82-a49d-e35a44726cda	2025-02-26	2025-02-26	2025-02-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
1bfdfa86-d5ca-4fa6-87f1-7b9ff922a325	f4024875-34a3-4f82-a49d-e35a44726cda	2025-03-26	2025-03-26	2025-03-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
34335c91-7364-4eca-a1c3-e583eb9ee192	f4024875-34a3-4f82-a49d-e35a44726cda	2025-04-26	2025-04-24	2025-04-23	Adjusted from Saturday (26 Apr 2025) to previous business day (Thursday  24 Apr 2025)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
aad67581-57c0-4d83-bfc3-b0ff4f8ed900	f4024875-34a3-4f82-a49d-e35a44726cda	2025-05-26	2025-05-26	2025-05-23	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
137d2fbf-0a93-45a5-86f9-4975533bb03d	f4024875-34a3-4f82-a49d-e35a44726cda	2025-06-26	2025-06-26	2025-06-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
775e6911-14ae-4fff-a80d-62ac7de68345	f4024875-34a3-4f82-a49d-e35a44726cda	2025-07-26	2025-07-25	2025-07-24	Adjusted from Saturday (26 Jul 2025) to previous business day (Friday    25 Jul 2025)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
5d9f0ca7-1900-4038-b83e-bc2bcf7612c6	f4024875-34a3-4f82-a49d-e35a44726cda	2025-08-26	2025-08-26	2025-08-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
3284d35c-e3be-42d0-996c-83e3ae368a36	f4024875-34a3-4f82-a49d-e35a44726cda	2025-09-26	2025-09-26	2025-09-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
9bde29b0-842c-4fdd-9c58-56ce99b3cf63	f4024875-34a3-4f82-a49d-e35a44726cda	2025-10-26	2025-10-24	2025-10-23	Adjusted from Sunday (26 Oct 2025) to previous business day (Friday    24 Oct 2025)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
54da5bfe-797c-43ed-9b6e-ec2afd34fc8d	f4024875-34a3-4f82-a49d-e35a44726cda	2025-11-26	2025-11-26	2025-11-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
141daf20-90a6-47ae-a150-c85999fcfb4a	f4024875-34a3-4f82-a49d-e35a44726cda	2025-12-26	2025-12-24	2025-12-23	Adjusted from St. Stephen's Day (Friday    26 Dec 2025) to previous business day (Wednesday 24 Dec 2025)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
be9ea688-df06-41f4-b618-de3fa270f84c	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-07-03	2025-07-03	2025-06-24	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
65a27f0a-3262-431c-a2fe-e9801f80b429	f4024875-34a3-4f82-a49d-e35a44726cda	2026-01-26	2026-01-23	2026-01-22	Adjusted from Australia Day (Monday    26 Jan 2026) to previous business day (Friday    23 Jan 2026)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
58b4aadf-86cc-4752-88eb-1b586d74c792	f4024875-34a3-4f82-a49d-e35a44726cda	2026-02-26	2026-02-26	2026-02-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
02942628-c4b4-4df4-8861-5b55b3fce47c	f4024875-34a3-4f82-a49d-e35a44726cda	2026-03-26	2026-03-26	2026-03-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
4360bfd3-d4e7-46fc-81c2-62e37d0f17f8	f4024875-34a3-4f82-a49d-e35a44726cda	2026-04-26	2026-04-24	2026-04-23	Adjusted from Sunday (26 Apr 2026) to previous business day (Friday    24 Apr 2026)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
0a6f7cfe-2643-427d-8a3c-5d1b006f769f	f4024875-34a3-4f82-a49d-e35a44726cda	2026-05-26	2026-05-26	2026-05-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
974e06cd-622b-4e43-b951-cc593ce7ad62	f4024875-34a3-4f82-a49d-e35a44726cda	2026-06-26	2026-06-26	2026-06-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
2f927824-c0bf-4ed4-aa26-d67afc0d9a9e	f4024875-34a3-4f82-a49d-e35a44726cda	2026-07-26	2026-07-24	2026-07-23	Adjusted from Sunday (26 Jul 2026) to previous business day (Friday    24 Jul 2026)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
11017a98-f325-4994-bc7e-387849b3e75e	f4024875-34a3-4f82-a49d-e35a44726cda	2026-08-26	2026-08-26	2026-08-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
5881d6b0-99b0-4ad8-9da6-c0b9bd6dd598	f4024875-34a3-4f82-a49d-e35a44726cda	2026-09-26	2026-09-24	2026-09-23	Adjusted from Saturday (26 Sep 2026) to previous business day (Thursday  24 Sep 2026)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
59aac439-78fe-4b25-bf81-11c3e7355f53	f4024875-34a3-4f82-a49d-e35a44726cda	2026-10-26	2026-10-26	2026-10-23	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
5a900d9b-1f5e-42e4-82fa-fbc6f4c073de	f4024875-34a3-4f82-a49d-e35a44726cda	2026-11-26	2026-11-26	2026-11-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
a807943f-31fa-4714-ab38-293ebec3ce81	f4024875-34a3-4f82-a49d-e35a44726cda	2026-12-26	2026-12-24	2026-12-23	Adjusted from Saturday (26 Dec 2026) to previous business day (Thursday  24 Dec 2026)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
f7f9e90d-90dd-49f3-b87c-742d331632cc	f4024875-34a3-4f82-a49d-e35a44726cda	2027-01-26	2027-01-26	2027-01-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
1131cf3f-1920-4a8f-96e9-72d4537c98b5	f4024875-34a3-4f82-a49d-e35a44726cda	2027-02-26	2027-02-26	2027-02-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
61eed8a9-b961-4b06-8d09-8ac714805f5c	f4024875-34a3-4f82-a49d-e35a44726cda	2027-03-26	2027-03-26	2027-03-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
84b5d631-6572-4b2a-acdd-7b29d2ca18c8	f4024875-34a3-4f82-a49d-e35a44726cda	2027-04-26	2027-04-26	2027-04-23	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
6e7741d7-ae4d-49ca-adb0-dea89db13a66	f4024875-34a3-4f82-a49d-e35a44726cda	2027-05-26	2027-05-26	2027-05-25	\N	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
8b3d8c93-3aad-4ccf-89bd-8116a002be5e	f4024875-34a3-4f82-a49d-e35a44726cda	2027-06-26	2027-06-25	2027-06-24	Adjusted from Saturday (26 Jun 2027) to previous business day (Friday    25 Jun 2027)	2025-06-02 03:12:09.297685+00	2025-06-02 03:12:09.297685+00
1e7f957a-a6b1-4bb5-ad1e-98844eb132c6	fa68604a-99ab-4336-93ed-1bafeee40e8d	2024-12-10	2024-12-10	2024-12-06	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
5d9eb832-b0f1-4e93-ad46-8d6a1b4218da	fa68604a-99ab-4336-93ed-1bafeee40e8d	2024-12-31	2024-12-31	2024-12-27	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
1f33f6e4-6102-4e12-ac72-8a344266b32a	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-01-14	2025-01-14	2025-01-10	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
c2d18445-171a-4971-8827-ada49c87331c	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-01-28	2025-01-28	2025-01-23	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
1ecf5433-6508-4f1c-88d0-ab40a080bd9d	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-02-11	2025-02-11	2025-02-07	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
aafc2a74-5b98-4020-b9a0-b2badf6e3145	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-02-25	2025-02-25	2025-02-21	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
f1f782e4-bd1b-4079-8e8e-10d4567a2cd3	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-03-11	2025-03-11	2025-03-06	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
5cd26195-692a-4f18-a2d4-0afd8eead4f7	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-03-25	2025-03-25	2025-03-21	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
a81dc083-b801-4c9b-8268-be7cf15e5f20	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-04-08	2025-04-08	2025-04-04	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
50b8b7a5-a701-436e-9309-5c08d4022a81	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-04-22	2025-04-22	2025-04-16	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
cfac9426-70e4-486f-8419-e44dbf1582ea	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-05-06	2025-05-06	2025-05-01	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
92a0e5e1-721b-47cd-86c2-d653f5499575	fa68604a-99ab-4336-93ed-1bafeee40e8d	2025-05-20	2025-05-20	2025-05-16	\N	2025-06-02 03:12:09.314573+00	2025-06-02 03:12:09.314573+00
760bd1fa-bc64-4c05-b421-1025b17e4dca	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2024-12-09	2024-12-09	2024-12-05	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
d4ed46bb-a5f6-4cc3-992a-ab92cc04fc8c	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2024-12-30	2024-12-30	2024-12-24	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
2d7263f4-141c-4cad-a060-1e29ac4ce26a	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-01-13	2025-01-13	2025-01-09	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
601e6f5a-44a2-4934-88df-297c8e2f78c6	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-01-27	2025-01-24	2025-01-22	Adjusted from Australia Day (Monday    27 Jan 2025) to previous business day (Friday    24 Jan 2025)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
35632137-2326-4d15-b894-36bcc5ad53e6	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-02-10	2025-02-10	2025-02-06	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
2b52306e-5f36-48d4-b468-8ce89007e703	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-02-24	2025-02-24	2025-02-20	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
8da71cb9-aca2-4cf2-b684-3cc574fd659d	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-03-10	2025-03-07	2025-03-05	Adjusted from March Public Holiday (Monday    10 Mar 2025) to previous business day (Friday    07 Mar 2025)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
59ee351e-b782-4bbb-a70a-4b41d49f6956	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-03-24	2025-03-24	2025-03-20	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
03d3e6d1-05fd-476d-ac1c-fe63c310d597	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-04-07	2025-04-07	2025-04-03	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
cdab0124-f826-41d2-81a6-5b99b6a09c20	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-04-21	2025-04-17	2025-04-15	Adjusted from Easter Monday (Monday    21 Apr 2025) to previous business day (Thursday  17 Apr 2025)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
11c724a0-f1dc-48eb-ad0f-aaff77d1fb2f	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-05-05	2025-05-02	2025-04-30	Adjusted from May Day (Monday    05 May 2025) to previous business day (Friday    02 May 2025)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
24f459bb-e3c4-41e6-bb8e-d186009b66ed	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-05-19	2025-05-19	2025-05-15	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
233b38db-917e-4d27-8f2f-a04b727c06f7	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-06-02	2025-05-30	2025-05-28	Adjusted from Reconciliation Day (Monday    02 Jun 2025) to previous business day (Friday    30 May 2025)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
056aa86b-881d-45ba-a837-a8d4009686d4	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-06-16	2025-06-16	2025-06-12	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
ddbeb106-0fe7-4c81-bb86-acea11c42f33	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-06-30	2025-06-30	2025-06-26	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
460160a6-ae99-4f20-928f-53d589e61a0a	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-07-14	2025-07-14	2025-07-10	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
85865a66-694a-4ed4-87a8-8821e1f1e99c	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-07-28	2025-07-28	2025-07-24	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
da16018c-bcdf-4daa-a106-d736abb25679	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-08-11	2025-08-11	2025-08-07	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
6214c925-6d1d-462b-a5f6-91f10c10af02	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-08-25	2025-08-25	2025-08-21	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
9b371fda-5b54-451c-a7df-da75df2da078	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-09-08	2025-09-08	2025-09-04	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
8658dd36-aae2-4dc5-83f1-2325fbd11429	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-09-22	2025-09-22	2025-09-18	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
48929e40-17f1-4371-b411-cfec1d6c0301	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-10-06	2025-10-03	2025-10-01	Adjusted from Labour Day (Monday    06 Oct 2025) to previous business day (Friday    03 Oct 2025)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
5d29cbd9-6289-4e92-a4b3-81489e44b141	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-10-20	2025-10-20	2025-10-16	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
97820998-b019-4c2d-ba4a-2bb93cfeef92	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-11-03	2025-11-03	2025-10-30	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
e86bace7-1f2e-47cd-b34f-c5df9f0ac844	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-11-17	2025-11-17	2025-11-13	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
a87c1b55-69c8-40b2-b472-bf2ead9f4f9a	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-12-01	2025-12-01	2025-11-27	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
0ef9c5a5-bc30-4460-ac60-4e5d0a0f153a	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-12-15	2025-12-15	2025-12-11	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
55df5de1-6b0a-4564-8b1b-7a5ea89a93f2	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2025-12-29	2025-12-29	2025-12-23	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
cc859fdc-a3f2-4b43-8cfc-dc8101904a89	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-01-12	2026-01-12	2026-01-08	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
cb0df553-eaf3-4138-b98e-a2887ceede92	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-01-26	2026-01-23	2026-01-21	Adjusted from Australia Day (Monday    26 Jan 2026) to previous business day (Friday    23 Jan 2026)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
bc3a69da-d9a5-4aee-a0fb-034f7c67217a	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-02-09	2026-02-09	2026-02-05	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
62dc1d46-0f57-4223-8ea4-b552e95d9a2e	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-02-23	2026-02-23	2026-02-19	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
117ed948-0295-404e-9fbd-b22712cc028f	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-03-09	2026-03-06	2026-03-04	Adjusted from Canberra Day (Monday    09 Mar 2026) to previous business day (Friday    06 Mar 2026)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
091e0f9e-8896-474a-9513-5f368ed45e6b	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-03-23	2026-03-23	2026-03-19	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
4a7c4a72-dbc4-4bef-b168-9756887fd54f	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-04-06	2026-04-02	2026-03-31	Adjusted from Easter Monday (Monday    06 Apr 2026) to previous business day (Thursday  02 Apr 2026)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
dd66c40a-bef9-41e3-abef-826034ceb9fc	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-04-20	2026-04-20	2026-04-16	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
01cf295e-32eb-4e00-9e9f-4410c15b1d23	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-05-04	2026-05-01	2026-04-29	Adjusted from May Day (Monday    04 May 2026) to previous business day (Friday    01 May 2026)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
0e94fe9f-11c0-468d-9cbf-a84c3495d617	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-05-18	2026-05-18	2026-05-14	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
9ff44f8e-009d-4d01-b81e-ade4963a5dfd	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-06-01	2026-05-29	2026-05-27	Adjusted from Reconciliation Day (Monday    01 Jun 2026) to previous business day (Friday    29 May 2026)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
b12b427e-3fa7-4a7c-892f-3d55be9bd266	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-06-15	2026-06-15	2026-06-11	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
fcac2778-399b-4849-a0e6-9a1a2e5e1c67	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-06-29	2026-06-29	2026-06-25	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
39c4f2b5-1d40-4f01-98c3-bf9e865ee2e7	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-07-13	2026-07-13	2026-07-09	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
f48f7cd1-cec7-4f11-beb6-baca9df2eefb	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-07-27	2026-07-27	2026-07-23	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
aa57097f-212f-4287-bc4e-1ad7ca70c17e	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-08-10	2026-08-10	2026-08-06	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
36f98c54-007a-4fdb-ba91-dd360bf131cc	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-08-24	2026-08-24	2026-08-20	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
abdd1118-1daf-4808-96ba-f48acb47b047	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-09-07	2026-09-07	2026-09-03	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
a383a8a8-386e-4a72-9932-408448d44080	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-09-21	2026-09-21	2026-09-17	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
00da0533-f210-4229-8fa7-aaae950817f7	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-10-05	2026-10-02	2026-09-30	Adjusted from Labour Day (Monday    05 Oct 2026) to previous business day (Friday    02 Oct 2026)	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
086ef269-c684-4764-a73c-abc43e21069c	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-10-19	2026-10-19	2026-10-15	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
867f50b6-e59a-4bf6-9e6b-7b264c90176e	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-11-02	2026-11-02	2026-10-29	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
1a9e8bf3-de99-4c27-8711-f0281720bb84	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-11-16	2026-11-16	2026-11-12	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
a0d888b5-7e37-47d4-b178-623c8fc565bc	6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	2026-11-30	2026-11-30	2026-11-26	\N	2025-06-02 03:58:43.250103+00	2025-06-02 03:58:43.250103+00
0ee7ec15-abcc-4883-af96-dcf51f90af8d	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-07-17	2025-07-17	2025-07-08	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
9fe9cd29-2114-413a-8802-db8548a5cd6c	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-07-31	2025-07-31	2025-07-22	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
76ef7864-cd9a-49c9-b207-2d4ce2bf9326	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-08-14	2025-08-14	2025-08-05	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
2a81266e-0e3b-4687-a0a8-d5da9ebe88d8	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-08-28	2025-08-28	2025-08-19	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
39fa0c20-5b09-4a98-9695-45d5d3eac1d9	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-09-11	2025-09-11	2025-09-02	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
6209f4cf-08e9-4456-8c5a-86b36e445c82	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-09-25	2025-09-25	2025-09-16	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
93a4b300-4c3d-422f-8d12-9b36513199d8	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-10-09	2025-10-09	2025-09-26	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
f3c231f0-a4a2-417a-bd59-7962d1103ed8	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-10-23	2025-10-23	2025-10-14	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
0ca292c4-a401-499d-894a-8ec8b2da15c2	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-11-06	2025-11-06	2025-10-27	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
ddb02cfa-beae-40b1-a53e-8efe856dbaf3	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-11-20	2025-11-20	2025-11-11	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
a38d62f9-2bcc-45b7-a760-cfdd2a6e189e	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-12-04	2025-12-04	2025-11-25	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
efa29f1d-4303-4295-bf79-4621b07103c6	9f8bddfa-e60e-4a7d-8227-51e66d964028	2025-12-18	2025-12-18	2025-12-09	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
fdc1a58d-68f0-4aac-9b6c-82498ba1e0ce	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-01-01	2025-12-31	2025-12-18	Adjusted from New Year's Day (Thursday  01 Jan 2026) to previous business day (Wednesday 31 Dec 2025)	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
335edc7d-fb67-4a40-b160-9206c065dbb1	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-01-15	2026-01-15	2026-01-06	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
39401138-95ee-4ce4-95c5-f6d6be7d50c1	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-01-29	2026-01-29	2026-01-19	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
ae11dd86-d2fb-47c0-b185-8705091d9106	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-02-12	2026-02-12	2026-02-03	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
9c9da0f0-e2cc-4404-bf10-b7150fa465cb	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-02-26	2026-02-26	2026-02-17	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
254838fd-a031-44ab-8a2f-8b05f3b5ce31	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-03-12	2026-03-12	2026-02-27	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
24c92cae-9340-40ad-8628-27de70864b7d	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-03-26	2026-03-26	2026-03-17	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
c52ca482-23a8-4385-b264-15487103b61a	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-04-09	2026-04-09	2026-03-27	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
1c19f098-d97e-4c35-af89-3f273c341a7a	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-04-23	2026-04-23	2026-04-14	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
1bba15d5-aaf1-459b-ae71-9acb38cf7c8f	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-05-07	2026-05-07	2026-04-27	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
763a0c56-3efe-4122-a52b-d6ef5d639a75	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-05-21	2026-05-21	2026-05-12	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
66975401-11be-4f29-aabf-0697babda880	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-06-04	2026-06-04	2026-05-25	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
c18d2bea-04d3-4474-94c7-bf9dab8d26c5	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-06-18	2026-06-18	2026-06-09	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
c6751681-e9dc-471a-a3da-d0190585227f	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-07-02	2026-07-02	2026-06-23	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
c337906d-50ed-4a8b-9717-7504e5125353	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-07-16	2026-07-16	2026-07-07	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
549bf934-74d9-43ab-a765-77ed6c3bcd9f	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-07-30	2026-07-30	2026-07-21	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
2c60deaf-531a-434b-b96a-510d4f6e3dfb	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-08-13	2026-08-13	2026-08-04	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
19155abd-1fae-4d94-83ac-63e1c706c0be	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-08-27	2026-08-27	2026-08-18	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
41ce50c8-cc4a-40e4-97c3-00a18607b571	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-09-10	2026-09-10	2026-09-01	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
e9d4e446-262b-48bc-a3fb-a373beb32028	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-09-24	2026-09-24	2026-09-15	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
0eb80d2e-32ee-41ef-822f-a788a9017440	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-10-08	2026-10-08	2026-09-24	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
965db041-528f-420f-90c2-992238ee958b	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-10-22	2026-10-22	2026-10-13	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
d68581c7-435a-45c3-adc3-c9cd5ad22a26	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-11-05	2026-11-05	2026-10-26	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
22ff5704-ac10-4d24-a9dc-dcd4a3a028e6	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-11-19	2026-11-19	2026-11-10	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
28e69610-d990-4e54-82e7-c8c9ce0786de	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-12-03	2026-12-03	2026-11-24	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
489b7b5f-8316-427b-bd17-c3066a7cd0f8	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-12-17	2026-12-17	2026-12-08	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
ab1d9a15-fd31-4376-bea1-aa6dd2a2ebfa	9f8bddfa-e60e-4a7d-8227-51e66d964028	2026-12-31	2026-12-31	2026-12-18	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
efae1fc6-c21c-4383-a80a-af1a48f80a44	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-01-21	2027-01-21	2027-01-12	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
03f99f83-1ddf-46ea-9855-bce15e865a97	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-02-04	2027-02-04	2027-01-26	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
6d22b3ad-d7b2-468f-ab42-8dd52043ced0	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-02-18	2027-02-18	2027-02-09	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
70e684a7-0285-4545-bc00-eac3bc365433	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-03-04	2027-03-04	2027-02-23	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
e98a1163-4db5-46ee-88ef-b6cfcc458353	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-03-18	2027-03-18	2027-03-09	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
9fc26873-3081-438e-b493-dbc9694e6504	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-04-01	2027-04-01	2027-03-23	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
fce5f253-5252-4fe7-ad7b-d262473839d1	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-04-15	2027-04-15	2027-04-06	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
031dbc11-b947-418a-a12b-526510bb3ca6	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-04-29	2027-04-29	2027-04-20	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
4e5978b4-3c2a-4650-8057-59dc90f53bcf	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-05-13	2027-05-13	2027-05-04	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
3fb264e4-3f86-4662-9256-6d0ca1a07d86	9f8bddfa-e60e-4a7d-8227-51e66d964028	2027-05-27	2027-05-27	2027-05-18	\N	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00
6b4c40de-f8ce-4b10-9333-d675499f633b	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-06-03	2025-06-03	2025-05-27	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
c06fe412-3bc5-4b37-95b8-5d57b24b327a	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-06-17	2025-06-17	2025-06-11	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
55ea1281-f8c4-4cd2-9b27-97d6fa1de26e	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-07-01	2025-07-01	2025-06-25	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
5eaa2d66-a6e9-4a3e-92b3-9709d19b5418	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-07-15	2025-07-15	2025-07-09	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
c90e0a73-8e33-47aa-8802-22ad4b29d5fe	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-07-29	2025-07-29	2025-07-23	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
42b6f407-6afb-4759-a520-ddac25770282	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-08-12	2025-08-12	2025-08-06	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
6131a70d-1347-428e-b19e-384737f1b9b6	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-08-26	2025-08-26	2025-08-20	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
ad24b542-288a-4b0e-8ab2-51540581da1b	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-09-09	2025-09-09	2025-09-03	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
dc0b487a-b0be-41eb-8edc-2e7a9fdf7741	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-09-23	2025-09-23	2025-09-17	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
d6a3dd2c-7766-43ac-940e-2abc3675f63e	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-10-07	2025-10-07	2025-09-30	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
0af34104-01d1-42b9-b9fe-9f8de88a4be4	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-10-21	2025-10-21	2025-10-15	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
94b2be43-bd45-4a59-acf0-0cb3ef962c5e	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-11-04	2025-11-03	2025-10-28	Adjusted from Melbourne Cup (Tuesday   04 Nov 2025) to previous business day (Monday    03 Nov 2025)	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
b001c09b-3e81-4335-9ed7-c7a5e1393869	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-11-18	2025-11-18	2025-11-12	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
c93d7547-4baf-42e0-b9a4-594b1ece12ac	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-12-02	2025-12-02	2025-11-26	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
b96d8568-b3d6-4a37-b447-708e699a359c	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-12-16	2025-12-16	2025-12-10	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
5d2c7ff6-a47e-4c5b-81fa-31e74a8235bb	06b63aa8-53d4-458d-bdb2-95227585cc0b	2025-12-30	2025-12-30	2025-12-22	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
3e8706c3-9daa-4abb-a0f2-2e03271e29d1	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-01-13	2026-01-13	2026-01-07	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
53251538-2259-4a7f-9aa7-1e643adc31f2	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-01-27	2026-01-27	2026-01-20	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
df691848-eaf4-4dbc-b2d8-ef5bddc35469	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-02-10	2026-02-10	2026-02-04	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
8a90bf21-d6fc-4e2a-b648-66874e1b0b11	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-02-24	2026-02-24	2026-02-18	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
9746e14f-15f5-4c20-b4b4-77e95e1c326f	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-03-10	2026-03-10	2026-03-03	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
86856f4c-e599-4474-86c0-e7d7b228c7dd	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-03-24	2026-03-24	2026-03-18	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
4c9df919-c18a-4569-b09d-dfc21b3f6147	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-04-07	2026-04-07	2026-03-30	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
5628f063-4819-4e39-b603-c88143aac839	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-04-21	2026-04-21	2026-04-15	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
a5a67d25-fe58-4ade-adff-ba321691a84f	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-05-05	2026-05-05	2026-04-28	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
26e7f3c9-98c0-47e1-941e-57817645da26	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-05-19	2026-05-19	2026-05-13	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
bbd76bbc-92f0-4921-8049-962e4514a157	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-06-02	2026-06-02	2026-05-26	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
0e94af5a-69c1-46e5-85cf-457b8caa7aff	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-06-16	2026-06-16	2026-06-10	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
ca6dfd54-2ea9-41d8-b48a-378f2a0939bf	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-06-30	2026-06-30	2026-06-24	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
679d0d39-d1a4-4c9d-89b0-91dca4427961	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-07-14	2026-07-14	2026-07-08	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
a6d55bc3-1188-4eaa-89a7-68d2b9b373be	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-07-28	2026-07-28	2026-07-22	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
6f87e1cd-e293-4c08-b919-85e42c581d23	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-08-11	2026-08-11	2026-08-05	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
aa246b38-6673-4566-a640-d16570024ffb	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-08-25	2026-08-25	2026-08-19	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
624d406f-7a15-407e-80af-53c184fbea09	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-09-08	2026-09-08	2026-09-02	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
388873ab-f864-4877-97d1-04ed1eeaff19	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-09-22	2026-09-22	2026-09-16	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
e0c889d0-aa0d-470a-8de4-0d847fd2f693	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-10-06	2026-10-06	2026-09-29	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
939d59b8-b3c0-4bc6-bf58-132324e2e2a2	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-10-20	2026-10-20	2026-10-14	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
f26ce88f-0e5d-4af8-9b7e-646afd85b118	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-11-03	2026-11-02	2026-10-27	Adjusted from Melbourne Cup (Tuesday   03 Nov 2026) to previous business day (Monday    02 Nov 2026)	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
f0c03edd-556e-43c6-9afa-73e057a509ad	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-11-17	2026-11-17	2026-11-11	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
06a23edd-c5cd-4dad-89f0-4e396b608f70	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-12-01	2026-12-01	2026-11-25	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
415f8fe1-a05c-4cab-b22f-f72cb8eba1fc	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-12-15	2026-12-15	2026-12-09	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
01deb4ae-4f79-4a80-aec5-a76c0aa18d51	06b63aa8-53d4-458d-bdb2-95227585cc0b	2026-12-29	2026-12-29	2026-12-21	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
c7ff21fd-d3d3-4101-9063-455e0269fef2	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-01-19	2027-01-19	2027-01-13	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
7559083d-fe71-4ef8-ab8b-af50aa4d773e	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-02-02	2027-02-02	2027-01-27	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
b1bf12af-9ed1-4b15-8222-25573ef6f047	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-02-16	2027-02-16	2027-02-10	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
8a009c5d-f8e0-4f87-b302-011bd97eb1ee	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-03-02	2027-03-02	2027-02-24	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
880e2f21-eec6-44b2-a2af-3b30b2175259	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-03-16	2027-03-16	2027-03-10	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
1fdd2baf-105f-441e-9457-7a5e85de637a	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-03-30	2027-03-30	2027-03-24	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
9a475bf8-924a-47bf-83fa-adb56b5976f1	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-04-13	2027-04-13	2027-04-07	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
7172ea52-df8f-4d2d-803c-433597c5edac	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-04-27	2027-04-27	2027-04-21	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
a32b15bf-d79e-4357-9834-9619cacdfd62	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-05-11	2027-05-11	2027-05-05	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
9ac290af-1e5c-4140-a93a-ba519b215ac7	06b63aa8-53d4-458d-bdb2-95227585cc0b	2027-05-25	2027-05-25	2027-05-19	\N	2025-06-02 04:30:49.438473+00	2025-06-02 04:30:49.438473+00
\.


--
-- Data for Name: payroll_version_history_results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_version_history_results (id, payroll_id, name, version_number, go_live_date, superseded_date, version_reason, active, is_current, queried_at) FROM stdin;
\.


--
-- Data for Name: payroll_version_results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payroll_version_results (id, new_payroll_id, new_version_number, old_payroll_id, dates_deleted, message, created_at, created_by_user_id) FROM stdin;
\.


--
-- Data for Name: payrolls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.payrolls (id, client_id, name, cycle_id, date_type_id, date_value, primary_consultant_user_id, backup_consultant_user_id, manager_user_id, processing_days_before_eft, created_at, updated_at, payroll_system, status, processing_time, employee_count, go_live_date, version_number, parent_payroll_id, superseded_date, version_reason, created_by_user_id) FROM stdin;
076f830b-de4b-47c9-b0ae-988556c48725	4ecd4666-c94e-43ba-97dc-3c78c8badffb	Fortnightly Payroll - Week A - Thursday	769d0c73-f918-4734-8cc9-45b1284c9ce8	d11a8b82-ec8f-4300-a397-37e8b0d54114	5	7898704c-ee5c-4ade-81f3-80a4388413fb	22a368d4-5d3f-4026-840c-55af6fb16972	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	7	2025-05-31 12:31:51.964581+00	2025-05-31 12:31:51.964581+00	\N	Active	10	12	2024-02-08	1	\N	2025-06-01	\N	\N
8077082b-4473-4547-aa9c-f1da8ac4b91a	92ff771d-d468-4c91-ae58-d66b3ce1bd22	Fortnightly Payroll - Week B - Tuesday	769d0c73-f918-4734-8cc9-45b1284c9ce8	2af96485-ff65-42e8-b300-3ad9308a7e2b	2	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	4	2025-05-31 12:32:03.475443+00	2025-05-31 12:32:03.475443+00	\N	Active	1	22	2024-02-15	1	\N	2025-06-01	\N	\N
3a03ada0-e7d0-4f2b-aa5a-a3adde11432e	92ff771d-d468-4c91-ae58-d66b3ce1bd22	Monthly Payroll - SOM	d96980a2-3146-4969-87bc-d50fdf4fccd3	f9914e22-da9e-4743-8d5d-365ba51ef854	\N	22a368d4-5d3f-4026-840c-55af6fb16972	22a368d4-5d3f-4026-840c-55af6fb16972	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	5	2025-05-31 12:32:46.823525+00	2025-06-02 05:24:24.374+00	\N	Active	16	45	2024-05-01	1	\N	\N	\N	\N
17f681eb-3c58-4aa7-b6c1-9e75e2771a1d	65e17d2e-df6e-448b-abb3-eea9d566a239	Weekly Payroll - Tuesday	713e04b1-e876-4169-8a05-f6846b51eb68	7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7	2	22a368d4-5d3f-4026-840c-55af6fb16972	9aed2a64-0407-4dff-a621-2b7013e1713a	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	5	2025-05-31 12:31:33.576415+00	2025-06-16 08:14:15.88828+00	\N	Active	4	18	2024-02-01	1	\N	\N	\N	\N
d619e823-c753-425c-88e4-5e797d2bff48	92ff771d-d468-4c91-ae58-d66b3ce1bd22	Quarterly Payroll - SOM	12570d45-fa3f-406a-80bc-1f412fe2d5f3	f9914e22-da9e-4743-8d5d-365ba51ef854	\N	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	3	2025-05-31 12:33:27.091685+00	2025-05-31 12:33:27.091685+00	\N	Active	8	65	2024-07-01	1	\N	\N	\N	\N
f45e433b-fce5-4c95-bf24-364c66792709	4ecd4666-c94e-43ba-97dc-3c78c8badffb	Monthly Payroll - 25th	d96980a2-3146-4969-87bc-d50fdf4fccd3	b29b56fc-b098-4cac-8dab-868d935986f2	25	7898704c-ee5c-4ade-81f3-80a4388413fb	22a368d4-5d3f-4026-840c-55af6fb16972	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	6	2025-05-31 12:33:17.777573+00	2025-05-31 12:33:17.777573+00	\N	Active	1	41	2024-06-20	1	\N	\N	\N	\N
2b70eb57-bd0f-4b4c-9341-870fb9df1f60	65e17d2e-df6e-448b-abb3-eea9d566a239	Quarterly Payroll - 1st	12570d45-fa3f-406a-80bc-1f412fe2d5f3	b29b56fc-b098-4cac-8dab-868d935986f2	1	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	5	2025-05-31 12:33:44.347623+00	2025-05-31 12:33:44.347623+00	\N	Active	1	89	2024-12-10	1	\N	\N	\N	\N
90070d99-0c19-448f-a940-8afb852cf106	65e17d2e-df6e-448b-abb3-eea9d566a239	Bi-Monthly Payroll - SOM	60490f74-a5b9-430a-ad4a-ade8f7393007	f9914e22-da9e-4743-8d5d-365ba51ef854	\N	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	6	2025-05-31 12:32:20.874498+00	2025-05-31 12:32:20.874498+00	\N	Active	1	40	2024-03-01	1	\N	\N	\N	\N
fa68604a-99ab-4336-93ed-1bafeee40e8d	ed90f235-e212-4ecd-aedf-402a2a91125f	Fortnightly Payroll - Week A - Monday	769d0c73-f918-4734-8cc9-45b1284c9ce8	d11a8b82-ec8f-4300-a397-37e8b0d54114	2	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	2	2025-05-31 12:31:43.044416+00	2025-06-01 06:57:18.51062+00	\N	Active	20	30	2024-01-22	1	\N	2025-06-01	\N	\N
6cae0f5c-d909-4e24-ab78-ccf3543ed7f5	ed90f235-e212-4ecd-aedf-402a2a91125f	Fortnightly Payroll - Week A - Monday	769d0c73-f918-4734-8cc9-45b1284c9ce8	d11a8b82-ec8f-4300-a397-37e8b0d54114	1	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	2	2025-06-02 03:56:42.423474+00	2025-06-02 03:56:42.423474+00	\N	Active	1	30	2025-06-02	1	fa68604a-99ab-4336-93ed-1bafeee40e8d	\N	schedule_change	d9ac8a7b-f679-49a1-8c99-837eb977578b
5c2ef179-308f-4545-bf7b-40c83b55f0c8	ed90f235-e212-4ecd-aedf-402a2a91125f	Monthly Payroll - 29th	d96980a2-3146-4969-87bc-d50fdf4fccd3	b29b56fc-b098-4cac-8dab-868d935986f2	29	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	4	2025-05-31 12:33:09.761684+00	2025-06-02 04:22:11.745022+00	\N	Active	5	29	2024-06-12	1	\N	\N	\N	\N
9f8bddfa-e60e-4a7d-8227-51e66d964028	4ecd4666-c94e-43ba-97dc-3c78c8badffb	Fortnightly Payroll - Week A - Thursday	769d0c73-f918-4734-8cc9-45b1284c9ce8	d11a8b82-ec8f-4300-a397-37e8b0d54114	4	7898704c-ee5c-4ade-81f3-80a4388413fb	22a368d4-5d3f-4026-840c-55af6fb16972	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	7	2025-06-02 04:30:17.461051+00	2025-06-02 04:30:17.461051+00	\N	Active	1	12	2025-06-02	2	076f830b-de4b-47c9-b0ae-988556c48725	\N	schedule_change	d9ac8a7b-f679-49a1-8c99-837eb977578b
fabe13b6-395a-489f-8003-69668a89cfe5	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	Weekly Payroll - Tuesday	713e04b1-e876-4169-8a05-f6846b51eb68	7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7	4	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	3	2025-05-31 12:31:25.334551+00	2025-06-01 05:33:59.966375+00	\N	Active	1	25	2024-01-15	1	\N	2025-06-01	\N	\N
35a5f539-8b86-4bce-ae0f-54a409979301	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	Weekly Payroll - Thursday	713e04b1-e876-4169-8a05-f6846b51eb68	7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7	2	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	3	2025-06-02 04:31:50.281111+00	2025-06-02 04:31:50.281111+00	\N	Active	1	25	2025-06-02	2	fabe13b6-395a-489f-8003-69668a89cfe5	2025-06-01	schedule_change	d9ac8a7b-f679-49a1-8c99-837eb977578b
a18b9637-c20f-428e-b6b7-a4a688e5b21a	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	Weekly Payroll - Thursday	713e04b1-e876-4169-8a05-f6846b51eb68	7e7d4966-eb52-4ea9-b5c2-9943d67b5cc7	4	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	3	2025-06-02 04:35:38.428441+00	2025-06-02 04:35:38.428441+00	\N	Active	1	25	2025-06-02	3	fabe13b6-395a-489f-8003-69668a89cfe5	\N	schedule_change	d9ac8a7b-f679-49a1-8c99-837eb977578b
06b63aa8-53d4-458d-bdb2-95227585cc0b	92ff771d-d468-4c91-ae58-d66b3ce1bd22	Fortnightly Payroll - Week B - Tuesday	769d0c73-f918-4734-8cc9-45b1284c9ce8	2af96485-ff65-42e8-b300-3ad9308a7e2b	2	7898704c-ee5c-4ade-81f3-80a4388413fb	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	4	2025-06-02 04:30:49.438473+00	2025-06-02 05:23:25.441+00	\N	Active	1	22	2025-06-02	2	8077082b-4473-4547-aa9c-f1da8ac4b91a	\N	schedule_change	d9ac8a7b-f679-49a1-8c99-837eb977578b
6caecf93-0b00-4776-8bfd-943bf05fd7d4	4ecd4666-c94e-43ba-97dc-3c78c8badffb	Bi-Monthly Payroll - EOM	60490f74-a5b9-430a-ad4a-ade8f7393007	68001232-8ac9-442d-bbe0-287569f2b144	\N	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	2	2025-05-31 12:32:37.2955+00	2025-05-31 12:32:37.2955+00	\N	Active	1	33	2024-04-30	1	\N	\N	\N	\N
539cda98-21f9-4f37-b314-c7b791d8093c	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	Monthly Payroll - EOM	d96980a2-3146-4969-87bc-d50fdf4fccd3	68001232-8ac9-442d-bbe0-287569f2b144	\N	22a368d4-5d3f-4026-840c-55af6fb16972	7898704c-ee5c-4ade-81f3-80a4388413fb	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	7	2025-05-31 12:32:54.347572+00	2025-05-31 12:32:54.347572+00	\N	Active	1	52	2024-05-31	1	\N	\N	\N	\N
c963a50e-f21e-48b3-8357-fa116b770ab8	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	Quarterly Payroll - EOM	12570d45-fa3f-406a-80bc-1f412fe2d5f3	68001232-8ac9-442d-bbe0-287569f2b144	\N	7898704c-ee5c-4ade-81f3-80a4388413fb	22a368d4-5d3f-4026-840c-55af6fb16972	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	2	2025-05-31 12:33:35.86555+00	2025-05-31 12:33:35.86555+00	\N	Active	1	78	2024-09-30	1	\N	\N	\N	\N
dfb29321-c8e8-473d-941f-64406beace52	69cb7e99-72a2-41b2-9fe0-08b4a2d6857c	Fortnightly Payroll - Week B - Friday	769d0c73-f918-4734-8cc9-45b1284c9ce8	2af96485-ff65-42e8-b300-3ad9308a7e2b	5	7898704c-ee5c-4ade-81f3-80a4388413fb	22a368d4-5d3f-4026-840c-55af6fb16972	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	1	2025-05-31 12:32:10.946486+00	2025-05-31 12:32:10.946486+00	\N	Active	1	35	2024-02-22	1	\N	\N	\N	\N
0fce8712-f65b-4dd5-96a9-d1c86c8b7138	ed90f235-e212-4ecd-aedf-402a2a91125f	Bi-Monthly Payroll - SOM	60490f74-a5b9-430a-ad4a-ade8f7393007	f9914e22-da9e-4743-8d5d-365ba51ef854	\N	7898704c-ee5c-4ade-81f3-80a4388413fb	22a368d4-5d3f-4026-840c-55af6fb16972	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	3	2025-05-31 12:32:28.493672+00	2025-05-31 12:32:28.493672+00	\N	Active	5	28	2024-03-15	1	\N	\N	\N	\N
f4024875-34a3-4f82-a49d-e35a44726cda	65e17d2e-df6e-448b-abb3-eea9d566a239	Monthly Payroll - 26th	d96980a2-3146-4969-87bc-d50fdf4fccd3	b29b56fc-b098-4cac-8dab-868d935986f2	26	7898704c-ee5c-4ade-81f3-80a4388413fb	22a368d4-5d3f-4026-840c-55af6fb16972	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	1	2025-05-31 12:33:02.67459+00	2025-06-01 10:09:02.65561+00	\N	Active	13	38	2024-06-05	1	\N	\N	\N	\N
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.permissions (id, resource_id, action, description, created_at, updated_at, legacy_permission_name) FROM stdin;
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resources (id, name, display_name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.role_permissions (id, role_id, permission_id, conditions, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id, name, display_name, description, priority, is_system_role, created_at, updated_at) FROM stdin;
7a21ecd4-3b83-447a-be0a-d0ca88290fd3	org_admin	Organization Administrator	Organization administrator	90	t	2025-05-25 02:42:42.509737+00	2025-05-31 11:39:02.983634+00
39180393-6b3f-4db9-adb1-7f00e7cd5b7f	manager	Manager	Manager with team management capabilities	70	t	2025-05-25 02:42:42.509737+00	2025-05-31 11:39:02.983634+00
64f5bc8d-aef6-4cc2-9aa2-170566d1af54	consultant	Consultant	Consultant with client management capabilities	50	t	2025-05-25 02:42:42.509737+00	2025-05-31 11:39:02.983634+00
51a9454a-6961-4edb-a5eb-7d195eb3451d	viewer	Viewer	Read-only access to authorized data	10	t	2025-05-25 02:42:42.509737+00	2025-05-31 11:39:02.983634+00
7950e369-5257-4cc4-94ea-53ceecaf91a3	developer	System Administrator	Full system access for developers	100	t	2025-05-25 02:42:42.509737+00	2025-06-17 04:54:31.445889+00
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_roles (id, user_id, role_id, created_at, updated_at) FROM stdin;
0d3643e2-5b71-49a8-b8a9-531298bbb65c	d9ac8a7b-f679-49a1-8c99-837eb977578b	7950e369-5257-4cc4-94ea-53ceecaf91a3	2025-05-25 02:42:42.644709+00	2025-05-25 02:42:42.644709+00
87cf7ebd-5b81-4527-b83c-ddca30cbbaf4	9aed2a64-0407-4dff-a621-2b7013e1713a	7a21ecd4-3b83-447a-be0a-d0ca88290fd3	2025-05-25 02:42:42.644709+00	2025-05-25 02:42:42.644709+00
b3b73715-ee1e-4271-923c-4dd717454b60	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	39180393-6b3f-4db9-adb1-7f00e7cd5b7f	2025-05-25 02:42:42.644709+00	2025-05-25 02:42:42.644709+00
212fd688-42d5-488f-9d1c-81ac279a105e	22a368d4-5d3f-4026-840c-55af6fb16972	64f5bc8d-aef6-4cc2-9aa2-170566d1af54	2025-05-25 02:42:42.644709+00	2025-05-25 02:42:42.644709+00
95a6a3f5-ed0e-4890-a1c4-04fbc92d3784	e4313314-b89e-4346-9bb5-3aaf464c7152	51a9454a-6961-4edb-a5eb-7d195eb3451d	2025-05-25 02:42:42.644709+00	2025-05-25 02:42:42.644709+00
21d286ab-9194-41b3-be25-40337bf24fa0	7898704c-ee5c-4ade-81f3-80a4388413fb	64f5bc8d-aef6-4cc2-9aa2-170566d1af54	2025-05-31 07:53:54.057876+00	2025-05-31 07:53:54.057876+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, name, email, role, created_at, updated_at, username, image, is_staff, manager_id, clerk_user_id, is_active, deactivated_at, deactivated_by) FROM stdin;
7898704c-ee5c-4ade-81f3-80a4388413fb	Test User	nathan.harris@invenco.net	consultant	2025-05-31 02:40:37.787341+00	2025-05-31 03:30:23.914982+00	\N	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ4cUlkQmNQSldiUHNNZzc1Tklkc0VsbW9VVCIsImluaXRpYWxzIjoiVFUifQ	t	\N	user_2yXhEiNJEhLR25QDFnqD4dzpkkL	t	\N	\N
e4313314-b89e-4346-9bb5-3aaf464c7152	Jill Viewer	viewer@example.com	viewer	2025-05-23 06:45:00.468049+00	2025-05-23 06:45:00.468049+00	\N	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1VFS1N4Y2xkczc0TnYwaWZDZW5iOWs4dyIsImluaXRpYWxzIjoiSlYifQ	f	\N	user_2yXhB08hGyXX7p8C8pWg5yPceIx	t	\N	\N
22a368d4-5d3f-4026-840c-55af6fb16972	Jim Consultant	consultant@example.com	consultant	2025-05-23 06:45:00.468049+00	2025-05-31 00:28:51.38901+00	\N	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1U5cEtmN1JQMkZpT1JISlZNNUlIMFBkMSIsImluaXRpYWxzIjoiSkMifQ	t	\N	user_2yXh6Wu8FUd7VbPEB56M0XfXsio	t	\N	\N
0727c441-3fa7-44c2-b8f3-4e0b77986ac1	Jane Manager	manager@example.com	manager	2025-05-23 06:45:00.468049+00	2025-05-23 06:45:00.468049+00	\N	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1U1TzV2Z0xwcXd0Tzh4Y3JTWHRSRWcySyIsImluaXRpYWxzIjoiSk0ifQ	t	\N	user_2yXh2JHR2xtsfp16fkTdXHF9P3c	t	\N	\N
9aed2a64-0407-4dff-a621-2b7013e1713a	John Admin	admin@example.com	org_admin	2025-05-23 06:45:00.468049+00	2025-05-23 06:45:00.468049+00	\N	https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNFWFhtQXhBcXNZTkhnTTBQNm1TY0U1QnQiLCJyaWQiOiJ1c2VyXzJ1Q1R0RUJlbzcwdEFUMEdJaGliV2FRUTRpViIsImluaXRpYWxzIjoiSkEifQ	t	\N	user_2yXgxgRHxUilIyqE04jWreCRoO4	t	\N	\N
d9ac8a7b-f679-49a1-8c99-837eb977578b	Nathan Harris	nathan.harris02@gmail.com	developer	2025-05-23 06:45:00.468049+00	2025-06-16 11:12:16.198006+00		https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ydUNSSGZicEpnZXJwUUJwZTUyYnZGT1V4a0IiLCJyaWQiOiJ1c2VyXzJ5VTdOc3BnOU5lbW15MUZkS0UxU0ZJb2ZtcyIsImluaXRpYWxzIjoiTkgifQ	t	\N	user_2yU7Nspg9Nemmy1FdKE1SFIofms	t	\N	\N
\.


--
-- Data for Name: users_role_backup; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users_role_backup (id, email, role, created_at) FROM stdin;
e4313314-b89e-4346-9bb5-3aaf464c7152	viewer@example.com	viewer	2025-05-23 06:45:00.468049+00
0727c441-3fa7-44c2-b8f3-4e0b77986ac1	manager@example.com	manager	2025-05-23 06:45:00.468049+00
9aed2a64-0407-4dff-a621-2b7013e1713a	admin@example.com	org_admin	2025-05-23 06:45:00.468049+00
22a368d4-5d3f-4026-840c-55af6fb16972	consultant@example.com	org_admin	2025-05-23 06:45:00.468049+00
7898704c-ee5c-4ade-81f3-80a4388413fb	nathan.harris@invenco.net	consultant	2025-05-31 02:40:37.787341+00
d9ac8a7b-f679-49a1-8c99-837eb977578b	nathan.harris02@gmail.com	developer	2025-05-23 06:45:00.468049+00
\.


--
-- Data for Name: work_schedule; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.work_schedule (id, user_id, work_day, work_hours, created_at, updated_at) FROM stdin;
106576a0-a994-4c81-a2ba-6be506e29bf1	d9ac8a7b-f679-49a1-8c99-837eb977578b	Monday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
fac3861d-dd5e-4e02-b74b-1bbec3a18125	d9ac8a7b-f679-49a1-8c99-837eb977578b	Wednesday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
e91fc31f-25b7-4b4b-8475-876b815fe08d	e4313314-b89e-4346-9bb5-3aaf464c7152	Monday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
9615f9e1-32a8-4d46-bd52-1a6209cf78a2	e4313314-b89e-4346-9bb5-3aaf464c7152	Wednesday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
85c19b37-dfe3-4dd8-9bf2-a2351530a6ef	22a368d4-5d3f-4026-840c-55af6fb16972	Monday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
707f58fc-77f3-44be-a794-0ad0f53a8f6e	22a368d4-5d3f-4026-840c-55af6fb16972	Wednesday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
12e1d684-85c0-4a1e-aa8b-17d073986509	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	Monday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
05089dfb-c487-4893-a183-a6ed40180094	0727c441-3fa7-44c2-b8f3-4e0b77986ac1	Wednesday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
162467c0-4278-46f0-b5c8-93fe3a0611d5	9aed2a64-0407-4dff-a621-2b7013e1713a	Monday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
0c96a375-e022-471b-8b14-7684530245b2	9aed2a64-0407-4dff-a621-2b7013e1713a	Wednesday	8.00	2025-05-23 08:15:43.943335	2025-05-23 08:15:43.943335
\.


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: audit; Owner: neondb_owner
--

ALTER TABLE ONLY audit.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: auth_events auth_events_pkey; Type: CONSTRAINT; Schema: audit; Owner: neondb_owner
--

ALTER TABLE ONLY audit.auth_events
    ADD CONSTRAINT auth_events_pkey PRIMARY KEY (id);


--
-- Name: data_access_log data_access_log_pkey; Type: CONSTRAINT; Schema: audit; Owner: neondb_owner
--

ALTER TABLE ONLY audit.data_access_log
    ADD CONSTRAINT data_access_log_pkey PRIMARY KEY (id);


--
-- Name: permission_changes permission_changes_pkey; Type: CONSTRAINT; Schema: audit; Owner: neondb_owner
--

ALTER TABLE ONLY audit.permission_changes
    ADD CONSTRAINT permission_changes_pkey PRIMARY KEY (id);


--
-- Name: slow_queries slow_queries_pkey; Type: CONSTRAINT; Schema: audit; Owner: neondb_owner
--

ALTER TABLE ONLY audit.slow_queries
    ADD CONSTRAINT slow_queries_pkey PRIMARY KEY (id);


--
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neondb_owner
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- Name: adjustment_rules adjustment_rules_cycle_id_date_type_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_date_type_id_key UNIQUE (cycle_id, date_type_id);


--
-- Name: adjustment_rules adjustment_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: billing_event_log billing_event_log_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_pkey PRIMARY KEY (id);


--
-- Name: billing_invoice_item billing_invoice_item_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_pkey PRIMARY KEY (id);


--
-- Name: billing_invoice billing_invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_pkey PRIMARY KEY (id);


--
-- Name: billing_invoices billing_invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: billing_invoices billing_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_pkey PRIMARY KEY (id);


--
-- Name: billing_items billing_items_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_pkey PRIMARY KEY (id);


--
-- Name: billing_plan billing_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_plan
    ADD CONSTRAINT billing_plan_pkey PRIMARY KEY (id);


--
-- Name: client_billing_assignment client_billing_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_pkey PRIMARY KEY (id);


--
-- Name: client_external_systems client_external_systems_client_id_system_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_system_id_key UNIQUE (client_id, system_id);


--
-- Name: client_external_systems client_external_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: external_systems external_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.external_systems
    ADD CONSTRAINT external_systems_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_feature_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_feature_name_key UNIQUE (feature_name);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: holidays holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);


--
-- Name: latest_payroll_version_results latest_payroll_version_results_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.latest_payroll_version_results
    ADD CONSTRAINT latest_payroll_version_results_pkey PRIMARY KEY (id);


--
-- Name: leave leave_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leave
    ADD CONSTRAINT leave_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: payroll_activation_results payroll_activation_results_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_activation_results
    ADD CONSTRAINT payroll_activation_results_pkey PRIMARY KEY (id);


--
-- Name: payroll_assignment_audit payroll_assignment_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT payroll_assignment_audit_pkey PRIMARY KEY (id);


--
-- Name: payroll_assignments payroll_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT payroll_assignments_pkey PRIMARY KEY (id);


--
-- Name: payroll_cycles payroll_cycles_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_cycles
    ADD CONSTRAINT payroll_cycles_name_key UNIQUE (name);


--
-- Name: payroll_cycles payroll_cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_cycles
    ADD CONSTRAINT payroll_cycles_pkey PRIMARY KEY (id);


--
-- Name: payroll_date_types payroll_date_types_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_date_types
    ADD CONSTRAINT payroll_date_types_name_key UNIQUE (name);


--
-- Name: payroll_date_types payroll_date_types_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_date_types
    ADD CONSTRAINT payroll_date_types_pkey PRIMARY KEY (id);


--
-- Name: payroll_dates payroll_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_pkey PRIMARY KEY (id);


--
-- Name: payroll_version_history_results payroll_version_history_results_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_version_history_results
    ADD CONSTRAINT payroll_version_history_results_pkey PRIMARY KEY (id);


--
-- Name: payroll_version_results payroll_version_results_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_version_results
    ADD CONSTRAINT payroll_version_results_pkey PRIMARY KEY (id);


--
-- Name: payrolls payrolls_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_resource_id_action_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_action_key UNIQUE (resource_id, action);


--
-- Name: resources resources_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_name_key UNIQUE (name);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: work_schedule unique_user_work_day; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT unique_user_work_day UNIQUE (user_id, work_day);


--
-- Name: payroll_assignments uq_payroll_assignment_payroll_date; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT uq_payroll_assignment_payroll_date UNIQUE (payroll_date_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: users users_clerk_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_clerk_user_id_key UNIQUE (clerk_user_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: work_schedule work_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT work_schedule_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_log_action; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_audit_log_action ON audit.audit_log USING btree (action);


--
-- Name: idx_audit_log_event_time; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_audit_log_event_time ON audit.audit_log USING btree (event_time DESC);


--
-- Name: idx_audit_log_resource; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_audit_log_resource ON audit.audit_log USING btree (resource_type, resource_id);


--
-- Name: idx_audit_log_session; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_audit_log_session ON audit.audit_log USING btree (session_id);


--
-- Name: idx_audit_log_user_id; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_audit_log_user_id ON audit.audit_log USING btree (user_id);


--
-- Name: idx_auth_events_time; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_auth_events_time ON audit.auth_events USING btree (event_time DESC);


--
-- Name: idx_auth_events_type; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_auth_events_type ON audit.auth_events USING btree (event_type);


--
-- Name: idx_auth_events_user; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_auth_events_user ON audit.auth_events USING btree (user_id);


--
-- Name: idx_data_access_classification; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_data_access_classification ON audit.data_access_log USING btree (data_classification);


--
-- Name: idx_data_access_resource; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_data_access_resource ON audit.data_access_log USING btree (resource_type, resource_id);


--
-- Name: idx_data_access_time; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_data_access_time ON audit.data_access_log USING btree (accessed_at DESC);


--
-- Name: idx_data_access_user; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_data_access_user ON audit.data_access_log USING btree (user_id);


--
-- Name: idx_permission_changes_changed_by; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_permission_changes_changed_by ON audit.permission_changes USING btree (changed_by_user_id);


--
-- Name: idx_permission_changes_target_user; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_permission_changes_target_user ON audit.permission_changes USING btree (target_user_id);


--
-- Name: idx_permission_changes_time; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_permission_changes_time ON audit.permission_changes USING btree (changed_at DESC);


--
-- Name: idx_slow_queries_duration; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_slow_queries_duration ON audit.slow_queries USING btree (query_duration DESC);


--
-- Name: idx_slow_queries_start; Type: INDEX; Schema: audit; Owner: neondb_owner
--

CREATE INDEX idx_slow_queries_start ON audit.slow_queries USING btree (query_start DESC);


--
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: neondb_owner
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


--
-- Name: idx_audit_assignment; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_assignment ON public.payroll_assignment_audit USING btree (assignment_id);


--
-- Name: idx_audit_changed_by; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_changed_by ON public.payroll_assignment_audit USING btree (changed_by);


--
-- Name: idx_audit_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_date ON public.payroll_assignment_audit USING btree (created_at);


--
-- Name: idx_audit_payroll_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_payroll_date ON public.payroll_assignment_audit USING btree (payroll_date_id);


--
-- Name: idx_billing_invoice_client_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_billing_invoice_client_id ON public.billing_invoice USING btree (client_id);


--
-- Name: idx_holidays_date_country_region; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_holidays_date_country_region ON public.holidays USING btree (date, country_code, region);


--
-- Name: idx_leave_dates; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_leave_dates ON public.leave USING btree (start_date, end_date);


--
-- Name: idx_leave_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_leave_user_id ON public.leave USING btree (user_id);


--
-- Name: idx_notes_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_notes_created_at ON public.notes USING btree (created_at DESC);


--
-- Name: idx_notes_entity; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_notes_entity ON public.notes USING btree (entity_type, entity_id);


--
-- Name: idx_notes_important; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_notes_important ON public.notes USING btree (is_important) WHERE (is_important = true);


--
-- Name: idx_notes_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_notes_user_id ON public.notes USING btree (user_id);


--
-- Name: idx_payroll_assignments_assigned_by; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_assignments_assigned_by ON public.payroll_assignments USING btree (assigned_by);


--
-- Name: idx_payroll_assignments_assigned_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_assignments_assigned_date ON public.payroll_assignments USING btree (assigned_date);


--
-- Name: idx_payroll_assignments_consultant; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_assignments_consultant ON public.payroll_assignments USING btree (consultant_id);


--
-- Name: idx_payroll_assignments_payroll_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_assignments_payroll_date ON public.payroll_assignments USING btree (payroll_date_id);


--
-- Name: idx_payroll_dashboard_stats_consultants; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_dashboard_stats_consultants ON public.payroll_dashboard_stats USING btree (primary_consultant_user_id, backup_consultant_user_id);


--
-- Name: idx_payroll_dashboard_stats_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_dashboard_stats_status ON public.payroll_dashboard_stats USING btree (status);


--
-- Name: idx_payroll_dates_composite; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_dates_composite ON public.payroll_dates USING btree (payroll_id, adjusted_eft_date, processing_date);


--
-- Name: idx_payroll_dates_date_range; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_dates_date_range ON public.payroll_dates USING btree (adjusted_eft_date);


--
-- Name: idx_payroll_dates_notes; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_dates_notes ON public.payroll_dates USING gin (to_tsvector('english'::regconfig, notes));


--
-- Name: idx_payroll_dates_payroll_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_dates_payroll_id ON public.payroll_dates USING btree (payroll_id);


--
-- Name: idx_payroll_dates_processing; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payroll_dates_processing ON public.payroll_dates USING btree (processing_date);


--
-- Name: idx_payrolls_active_dates; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_active_dates ON public.payrolls USING btree (status, go_live_date, superseded_date) WHERE (status = 'Active'::public.payroll_status);


--
-- Name: idx_payrolls_client_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_client_id ON public.payrolls USING btree (client_id);


--
-- Name: idx_payrolls_consultant; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_consultant ON public.payrolls USING btree (primary_consultant_user_id);


--
-- Name: idx_payrolls_current_version; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_current_version ON public.payrolls USING btree (parent_payroll_id, version_number DESC) WHERE (superseded_date IS NULL);


--
-- Name: idx_payrolls_go_live_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_go_live_date ON public.payrolls USING btree (go_live_date);


--
-- Name: idx_payrolls_manager; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_manager ON public.payrolls USING btree (manager_user_id);


--
-- Name: idx_payrolls_staff_composite; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_staff_composite ON public.payrolls USING btree (primary_consultant_user_id, backup_consultant_user_id, manager_user_id);


--
-- Name: idx_payrolls_status_client; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_status_client ON public.payrolls USING btree (status, client_id) WHERE (status <> 'Inactive'::public.payroll_status);


--
-- Name: idx_payrolls_versioning; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_versioning ON public.payrolls USING btree (parent_payroll_id, version_number, go_live_date);


--
-- Name: idx_unique_payroll_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_unique_payroll_date ON public.payroll_dates USING btree (payroll_id, original_eft_date);


--
-- Name: idx_users_active_staff; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_active_staff ON public.users USING btree (is_active, is_staff, role) WHERE (is_active = true);


--
-- Name: idx_users_clerk_composite; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_clerk_composite ON public.users USING btree (clerk_user_id, role, is_staff);


--
-- Name: idx_users_deactivated_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_deactivated_at ON public.users USING btree (deactivated_at) WHERE (deactivated_at IS NOT NULL);


--
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_work_schedule_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_work_schedule_user_id ON public.work_schedule USING btree (user_id);


--
-- Name: only_one_current_version_per_family; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX only_one_current_version_per_family ON public.payrolls USING btree (COALESCE(parent_payroll_id, id)) WHERE (superseded_date IS NULL);


--
-- Name: clients audit_clients_changes; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER audit_clients_changes AFTER INSERT OR DELETE OR UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: payrolls audit_payrolls_changes; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER audit_payrolls_changes AFTER INSERT OR DELETE OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: role_permissions audit_role_permissions_changes; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER audit_role_permissions_changes AFTER INSERT OR DELETE OR UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: user_roles audit_user_roles_changes; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER audit_user_roles_changes AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: users audit_users_changes; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER audit_users_changes AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: notes check_entity_relation; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER check_entity_relation BEFORE INSERT OR UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.enforce_entity_relation();


--
-- Name: payrolls enforce_staff_on_payrolls; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER enforce_staff_on_payrolls BEFORE INSERT OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.enforce_staff_roles();


--
-- Name: payroll_assignments set_timestamp; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.payroll_assignments FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: billing_invoice_item trg_invoice_item_total; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_invoice_item_total AFTER INSERT OR DELETE OR UPDATE ON public.billing_invoice_item FOR EACH ROW EXECUTE FUNCTION public.update_invoice_total();


--
-- Name: payrolls trigger_auto_delete_future_dates; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_auto_delete_future_dates AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_delete_future_dates_on_supersede();


--
-- Name: payrolls trigger_auto_generate_dates; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_auto_generate_dates AFTER INSERT ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_generate_dates_on_payroll_insert();


--
-- Name: payrolls trigger_auto_regenerate_dates; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_auto_regenerate_dates AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_regenerate_dates_on_schedule_change();


--
-- Name: work_schedule trigger_prevent_duplicate_insert; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_prevent_duplicate_insert BEFORE INSERT ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_workday_insert();


--
-- Name: feature_flags update_feature_flags_modtime; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_feature_flags_modtime BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- Name: permissions update_permissions_timestamp; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_permissions_timestamp BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: resources update_resources_timestamp; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_resources_timestamp BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: role_permissions update_role_permissions_timestamp; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_role_permissions_timestamp BEFORE UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: roles update_roles_timestamp; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_roles_timestamp BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: user_roles update_user_roles_timestamp; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_user_roles_timestamp BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: adjustment_rules adjustment_rules_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.payroll_cycles(id) ON DELETE CASCADE;


--
-- Name: adjustment_rules adjustment_rules_date_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES public.payroll_date_types(id) ON DELETE CASCADE;


--
-- Name: billing_event_log billing_event_log_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: billing_event_log billing_event_log_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoice(id) ON DELETE CASCADE;


--
-- Name: billing_invoice billing_invoice_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: billing_invoice_item billing_invoice_item_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoice(id) ON DELETE CASCADE;


--
-- Name: billing_invoices billing_invoices_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: billing_items billing_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoices(id) ON DELETE CASCADE;


--
-- Name: billing_items billing_items_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON DELETE SET NULL;


--
-- Name: client_billing_assignment client_billing_assignment_billing_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_billing_plan_id_fkey FOREIGN KEY (billing_plan_id) REFERENCES public.billing_plan(id) ON DELETE RESTRICT;


--
-- Name: client_billing_assignment client_billing_assignment_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: client_external_systems client_external_systems_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: client_external_systems client_external_systems_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_system_id_fkey FOREIGN KEY (system_id) REFERENCES public.external_systems(id) ON DELETE CASCADE;


--
-- Name: payroll_assignment_audit fk_audit_assignment; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_assignment FOREIGN KEY (assignment_id) REFERENCES public.payroll_assignments(id) ON DELETE SET NULL;


--
-- Name: payroll_assignment_audit fk_audit_changed_by; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_changed_by FOREIGN KEY (changed_by) REFERENCES public.users(id);


--
-- Name: payroll_assignment_audit fk_audit_from_consultant; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_from_consultant FOREIGN KEY (from_consultant_id) REFERENCES public.users(id);


--
-- Name: payroll_assignment_audit fk_audit_payroll_date; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_payroll_date FOREIGN KEY (payroll_date_id) REFERENCES public.payroll_dates(id);


--
-- Name: payroll_assignment_audit fk_audit_to_consultant; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_to_consultant FOREIGN KEY (to_consultant_id) REFERENCES public.users(id);


--
-- Name: payrolls fk_backup_consultant_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_backup_consultant_user FOREIGN KEY (backup_consultant_user_id) REFERENCES public.users(id);


--
-- Name: leave fk_leave_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leave
    ADD CONSTRAINT fk_leave_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payrolls fk_manager_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_manager_user FOREIGN KEY (manager_user_id) REFERENCES public.users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_assigned_by; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_assigned_by FOREIGN KEY (assigned_by) REFERENCES public.users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_consultant; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_consultant FOREIGN KEY (consultant_id) REFERENCES public.users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_original_consultant; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_original_consultant FOREIGN KEY (original_consultant_id) REFERENCES public.users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_payroll_date; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_payroll_date FOREIGN KEY (payroll_date_id) REFERENCES public.payroll_dates(id) ON DELETE CASCADE;


--
-- Name: payrolls fk_primary_consultant_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_primary_consultant_user FOREIGN KEY (primary_consultant_user_id) REFERENCES public.users(id);


--
-- Name: work_schedule fk_work_schedule_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT fk_work_schedule_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users manager_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT manager_id FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payroll_dates payroll_dates_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payrolls payrolls_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: payrolls payrolls_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.payroll_cycles(id) ON DELETE RESTRICT;


--
-- Name: payrolls payrolls_date_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES public.payroll_date_types(id) ON DELETE RESTRICT;


--
-- Name: payrolls payrolls_parent_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_parent_payroll_id_fkey FOREIGN KEY (parent_payroll_id) REFERENCES public.payrolls(id);


--
-- Name: permissions permissions_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: clients; Type: ROW SECURITY; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

--
-- Name: notes; Type: ROW SECURITY; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

--
-- Name: payroll_dates; Type: ROW SECURITY; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.payroll_dates ENABLE ROW LEVEL SECURITY;

--
-- Name: payrolls; Type: ROW SECURITY; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;

--
-- Name: payrolls payrolls_select_policy; Type: POLICY; Schema: public; Owner: neondb_owner
--

CREATE POLICY payrolls_select_policy ON public.payrolls FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = (current_setting('hasura.user_id'::text))::uuid) AND ((u.role = ANY (ARRAY['developer'::public.user_role, 'org_admin'::public.user_role])) OR ((u.role = 'manager'::public.user_role) AND (payrolls.manager_user_id = u.id)) OR ((u.role = 'consultant'::public.user_role) AND ((payrolls.primary_consultant_user_id = u.id) OR (payrolls.backup_consultant_user_id = u.id))))))));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: neondb_owner
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_select_policy; Type: POLICY; Schema: public; Owner: neondb_owner
--

CREATE POLICY users_select_policy ON public.users FOR SELECT USING (((id = (current_setting('hasura.user_id'::text))::uuid) OR (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = (current_setting('hasura.user_id'::text))::uuid) AND (u.role = ANY (ARRAY['developer'::public.user_role, 'org_admin'::public.user_role])))))));


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES  TO neon_superuser WITH GRANT OPTION;


--
-- Name: payroll_dashboard_stats; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: neondb_owner
--

REFRESH MATERIALIZED VIEW public.payroll_dashboard_stats;


--
-- PostgreSQL database dump complete
--


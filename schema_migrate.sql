--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 16.9 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA audit;


--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA hdb_catalog;


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



--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--



--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--



--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--



--
-- Name: invitation_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.invitation_status_enum AS ENUM (
    'pending',
    'accepted',
    'expired',
    'revoked',
    'cancelled'
);


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
    'Inactive',
    'processing',
    'draft',
    'pending_approval',
    'approved',
    'completed',
    'failed'
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
-- Name: transfer_candidate_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.transfer_candidate_type AS (
	outgoing_transaction_id uuid,
	incoming_transaction_id uuid,
	confidence_score numeric,
	amount_diff numeric,
	date_diff integer
);


--
-- Name: user_position; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_position AS ENUM (
    'consultant',
    'senior_consultant',
    'manager',
    'senior_manager',
    'partner',
    'senior_partner'
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
-- Name: user_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_status_enum AS ENUM (
    'pending',
    'active',
    'inactive',
    'locked'
);


--
-- Name: TYPE user_status_enum; Type: COMMENT; Schema: public; Owner: -
--



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


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: -
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


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

CREATE FUNCTION public.activate_payroll_versions() RETURNS SETOF payroll_activation_results
    LANGUAGE plpgsql
    AS $$
DECLARE
    r payroll_activation_results%ROWTYPE;
    v_activated_count integer := 0;
BEGIN
    -- Clean up old results (use correct column name: queried_at)
    DELETE FROM payroll_activation_results WHERE queried_at < NOW() - INTERVAL '1 hour';
    
    -- Activate payrolls that have reached their go-live date
    FOR r IN
        UPDATE payrolls 
        SET status = 'Active'::payroll_status
        WHERE status = 'Draft'::payroll_status 
        AND go_live_date <= CURRENT_DATE
        AND superseded_date IS NULL
        RETURNING id, name, go_live_date, 'Activated'::text as status, CURRENT_TIMESTAMP as queried_at
    LOOP
        INSERT INTO payroll_activation_results (payroll_id, name, go_live_date, status)
        VALUES (r.id, r.name, r.go_live_date, r.status);
        
        v_activated_count := v_activated_count + 1;
        RETURN NEXT r;
    END LOOP;
    
    -- If no payrolls were activated, return a summary record
    IF v_activated_count = 0 THEN
        r.payroll_id := NULL;
        r.name := 'No payrolls activated';
        r.go_live_date := CURRENT_DATE;
        r.status := 'No Action';
        r.queried_at := CURRENT_TIMESTAMP;
        
        INSERT INTO payroll_activation_results (payroll_id, name, go_live_date, status)
        VALUES (r.payroll_id, r.name, r.go_live_date, r.status);
        
        RETURN NEXT r;
    END IF;
END;
$$;


--
-- Name: FUNCTION activate_payroll_versions(); Type: COMMENT; Schema: public; Owner: -
--



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
-- Name: audit_invitation_status_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_invitation_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    audit_data jsonb;
    changed_by_user_id uuid;
BEGIN
    -- Only audit if status actually changed
    IF OLD.invitation_status IS DISTINCT FROM NEW.invitation_status THEN
        -- Get the user making the change
        BEGIN
            changed_by_user_id = COALESCE(
                NEW.revoked_by,
                NEW.accepted_by,
                (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid
            );
        EXCEPTION WHEN OTHERS THEN
            changed_by_user_id = NULL;
        END;
        
        -- Build audit data
        audit_data = jsonb_build_object(
            'invitation_id', NEW.id,
            'email', NEW.email,
            'old_status', OLD.invitation_status,
            'new_status', NEW.invitation_status,
            'changed_by', changed_by_user_id,
            'invited_by', NEW.invited_by,
            'change_reason', NEW.revoke_reason,
            'changed_at', NOW()
        );
        
        -- Insert audit log with fixed IP address
        INSERT INTO audit.audit_log (
            user_id,
            action,
            resource_type,
            resource_id,
            old_values,
            new_values,
            metadata,
            event_time,
            ip_address,
            user_agent
        ) VALUES (
            COALESCE(changed_by_user_id, NEW.invited_by),
            'invitation_status_change',
            'user_invitation',
            NEW.id::text,
            jsonb_build_object('status', OLD.invitation_status),
            jsonb_build_object('status', NEW.invitation_status),
            audit_data,
            NOW(),
            '127.0.0.1'::inet,  -- FIXED: Use valid inet type instead of 'system'
            'database_trigger'
        );
    END IF;
    
    RETURN NEW;
END;
$$;


--
-- Name: FUNCTION audit_invitation_status_change(); Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: audit_user_status_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.audit_user_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    audit_data jsonb;
    changed_by_user_id uuid;
BEGIN
    -- Only audit if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Get the user making the change
        BEGIN
            changed_by_user_id = (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid;
        EXCEPTION WHEN OTHERS THEN
            changed_by_user_id = NULL;
        END;
        
        -- Build audit data
        audit_data = jsonb_build_object(
            'user_id', NEW.id,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'changed_by', changed_by_user_id,
            'change_reason', NEW.status_change_reason,
            'changed_at', NOW()
        );
        
        -- Insert audit log with fixed IP address and proper string quoting
        INSERT INTO audit.audit_log (
            user_id,
            action,
            resource_type,
            resource_id,
            old_values,
            new_values,
            metadata,
            event_time,
            ip_address,
            user_agent
        ) VALUES (
            COALESCE(changed_by_user_id, NEW.id),
            'user_status_change',     -- FIXED: Added missing quotes
            'user',                   -- FIXED: Added missing quotes
            NEW.id::text,
            jsonb_build_object('status', OLD.status),  -- FIXED: Added missing quotes around 'status'
            jsonb_build_object('status', NEW.status),  -- FIXED: Added missing quotes around 'status'
            audit_data,
            NOW(),
            '127.0.0.1'::inet,       -- FIXED: Use valid inet type instead of unquoted system
            'database_trigger'       -- FIXED: Added missing quotes
        );
    END IF;
    
    RETURN NEW;
END;
$$;


--
-- Name: FUNCTION audit_user_status_change(); Type: COMMENT; Schema: public; Owner: -
--



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
-- Name: calculate_billing_quantity(text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_billing_quantity(service_billing_unit text, payroll_data jsonb) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
    CASE service_billing_unit
        WHEN 'Per Payslip' THEN
            RETURN COALESCE((payroll_data->>'payslip_count')::INTEGER, 0);
        WHEN 'Per Employee' THEN
            RETURN COALESCE((payroll_data->>'employee_count')::INTEGER, 0);
        WHEN 'Per New Employee' THEN
            RETURN COALESCE((payroll_data->>'new_employees')::INTEGER, 0);
        WHEN 'Per Terminated Employee' THEN
            RETURN COALESCE((payroll_data->>'terminated_employees')::INTEGER, 0);
        WHEN 'Per Payroll', 'Per Month', 'Once Off' THEN
            RETURN 1;
        ELSE
            RETURN 1;
    END CASE;
END;
$$;


--
-- Name: FUNCTION calculate_billing_quantity(service_billing_unit text, payroll_data jsonb); Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: calculate_payroll_capacity(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_payroll_capacity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Calculate admin time hours if using default
    IF NEW.uses_default_admin_time THEN
        SELECT 
            (NEW.work_hours * COALESCE(u.default_admin_time_percentage, 12.5)) / 100
        INTO NEW.admin_time_hours
        FROM users u 
        WHERE u.id = NEW.user_id;
    END IF;
    
    -- Calculate payroll capacity
    NEW.payroll_capacity_hours = GREATEST(0, NEW.work_hours - COALESCE(NEW.admin_time_hours, 0));
    
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

CREATE FUNCTION public.create_payroll_version(p_original_payroll_id uuid, p_go_live_date date, p_version_reason text DEFAULT 'schedule_change'::text, p_created_by_user_id uuid DEFAULT NULL::uuid, p_new_name text DEFAULT NULL::text, p_new_client_id uuid DEFAULT NULL::uuid, p_new_cycle_id uuid DEFAULT NULL::uuid, p_new_date_type_id uuid DEFAULT NULL::uuid, p_new_date_value integer DEFAULT NULL::integer, p_new_primary_consultant_user_id uuid DEFAULT NULL::uuid, p_new_backup_consultant_user_id uuid DEFAULT NULL::uuid, p_new_manager_user_id uuid DEFAULT NULL::uuid) RETURNS SETOF payroll_version_results
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
-- Name: create_payroll_version_simple(uuid, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_payroll_version_simple(payroll_id uuid, version_reason text DEFAULT 'System Update'::text) RETURNS SETOF payroll_version_results
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Call the existing complex function with default values
    RETURN QUERY SELECT * FROM public.create_payroll_version(
        payroll_id,           -- p_original_payroll_id
        CURRENT_DATE,         -- p_go_live_date
        version_reason,       -- p_version_reason
        NULL,                 -- p_created_by_user_id
        NULL,                 -- p_new_name
        NULL,                 -- p_new_client_id
        NULL,                 -- p_new_cycle_id
        NULL,                 -- p_new_date_type_id
        NULL,                 -- p_new_date_value
        NULL,                 -- p_new_primary_consultant_user_id
        NULL,                 -- p_new_backup_consultant_user_id
        NULL                  -- p_new_manager_user_id
    );
END;
$$;


--
-- Name: FUNCTION create_payroll_version_simple(payroll_id uuid, version_reason text); Type: COMMENT; Schema: public; Owner: -
--



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
-- Name: detect_potential_transfers(uuid, integer, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.detect_potential_transfers(p_user_id uuid, p_days_threshold integer DEFAULT 3, p_amount_threshold numeric DEFAULT 0.01) RETURNS TABLE(outgoing_transaction_id uuid, incoming_transaction_id uuid, confidence_score numeric, match_criteria jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH transfer_candidates AS (
        SELECT 
            t_out.id as outgoing_transaction_id,
            t_in.id as incoming_transaction_id,
            -- Calculate transfer confidence score
            LEAST(
                -- Date proximity (same day = 1.0, within 3 days = decreasing score)
                CASE 
                    WHEN t_out.transaction_date = t_in.transaction_date THEN 1.0
                    WHEN ABS(t_out.transaction_date - t_in.transaction_date) <= 1 THEN 0.8
                    WHEN ABS(t_out.transaction_date - t_in.transaction_date) <= 2 THEN 0.6
                    WHEN ABS(t_out.transaction_date - t_in.transaction_date) <= 3 THEN 0.4
                    ELSE 0.2
                END *
                -- Amount similarity (exact = 1.0, very close = 0.9)
                CASE 
                    WHEN t_out.amount = -t_in.amount THEN 1.0
                    WHEN ABS(t_out.amount + t_in.amount) <= (ABS(t_out.amount) * p_amount_threshold) THEN 0.9
                    ELSE 0.5
                END,
                1.0
            )::DECIMAL(3,2) as confidence_score,
            -- Store match criteria for analysis
            jsonb_build_object(
                'date_diff_days', ABS(t_out.transaction_date - t_in.transaction_date),
                'amount_diff', ABS(t_out.amount + t_in.amount),
                'same_day', t_out.transaction_date = t_in.transaction_date,
                'exact_amount_match', t_out.amount = -t_in.amount,
                'outgoing_account', ba_out.account_name,
                'incoming_account', ba_in.account_name,
                'description_similarity', CASE 
                    WHEN LOWER(t_out.description) ILIKE '%transfer%' OR LOWER(t_in.description) ILIKE '%transfer%' THEN 0.3
                    ELSE 0.0
                END
            ) as match_criteria
        FROM transactions t_out
        JOIN bank_accounts ba_out ON t_out.bank_account_id = ba_out.id
        JOIN transactions t_in ON (
            t_in.user_id = t_out.user_id
            AND t_in.bank_account_id != t_out.bank_account_id  -- Different accounts
            AND ABS(t_out.transaction_date - t_in.transaction_date) <= p_days_threshold
            AND t_out.amount < 0  -- Outgoing transaction (negative)
            AND t_in.amount > 0   -- Incoming transaction (positive)
            AND ABS(t_out.amount + t_in.amount) <= GREATEST(ABS(t_out.amount) * p_amount_threshold, 0.01)
        )
        JOIN bank_accounts ba_in ON t_in.bank_account_id = ba_in.id
        WHERE t_out.user_id = p_user_id
        AND NOT COALESCE(t_out.is_transfer, FALSE)
        AND NOT COALESCE(t_in.is_transfer, FALSE)
        AND NOT EXISTS (
            -- Don't suggest pairs that have already been confirmed (rejected pairs can be re-reviewed)
            SELECT 1 FROM transfer_detection_cache tdc 
            WHERE ((tdc.transaction_1_id = t_out.id AND tdc.transaction_2_id = t_in.id)
               OR (tdc.transaction_1_id = t_in.id AND tdc.transaction_2_id = t_out.id))
               AND tdc.status = 'confirmed'
        )
    )
    SELECT tc.outgoing_transaction_id, tc.incoming_transaction_id, tc.confidence_score, tc.match_criteria
    FROM transfer_candidates tc
    WHERE tc.confidence_score >= 0.6  -- Only return confident matches
    ORDER BY tc.confidence_score DESC;
END;
$$;


--
-- Name: FUNCTION detect_potential_transfers(p_user_id uuid, p_days_threshold integer, p_amount_threshold numeric); Type: COMMENT; Schema: public; Owner: -
--



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
-- Name: generate_invoice_number(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_invoice_number() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    next_num INTEGER;
    invoice_num TEXT;
BEGIN
    -- Get the next invoice number (simple incrementing sequence)
    SELECT COALESCE(MAX(SUBSTRING(invoice_number FROM '[0-9]+')::INTEGER), 0) + 1
    INTO next_num
    FROM public.billing_invoice
    WHERE invoice_number IS NOT NULL;
    
    -- Format as INV-YYYY-NNNN
    invoice_num := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_num::TEXT, 4, '0');
    
    RETURN invoice_num;
END;
$$;


--
-- Name: FUNCTION generate_invoice_number(); Type: COMMENT; Schema: public; Owner: -
--



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



--
-- Name: COLUMN payroll_dates.payroll_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_dates.original_eft_date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_dates.adjusted_eft_date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_dates.processing_date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_dates.notes; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_dates.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_dates.updated_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: generate_payroll_dates(uuid, date, date, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_payroll_dates(p_payroll_id uuid, p_start_date date DEFAULT NULL::date, p_end_date date DEFAULT NULL::date, p_max_dates integer DEFAULT 52) RETURNS SETOF payroll_dates
    LANGUAGE plpgsql
    AS $$
  DECLARE
    v_payroll_record payrolls%ROWTYPE;
    v_cycle_name TEXT;
    v_date_type_name TEXT;
    v_date_value INTEGER;
    v_processing_days INTEGER;
    v_current_date DATE;
    v_original_eft_date DATE;
    v_adjusted_eft_date DATE;
    v_processing_date DATE;
    v_adjustment_reason TEXT;
    v_dates_generated INTEGER := 0;
    r payroll_dates%ROWTYPE;
  BEGIN
    -- Get payroll details
    SELECT * INTO v_payroll_record FROM payrolls WHERE id = p_payroll_id;

    IF v_payroll_record.id IS NULL THEN
      RAISE EXCEPTION 'Payroll with ID % not found', p_payroll_id;
    END IF;

    -- Get cycle and date type details
    SELECT pc.name INTO v_cycle_name FROM payroll_cycles pc WHERE pc.id = v_payroll_record.cycle_id;
    SELECT pdt.name INTO v_date_type_name FROM payroll_date_types pdt WHERE pdt.id = v_payroll_record.date_type_id;

    -- Get date_value from payrolls table
    v_date_value := v_payroll_record.date_value;
    v_processing_days := COALESCE(v_payroll_record.processing_days_before_eft, 3);

    -- Set date range
    v_current_date := COALESCE(p_start_date, CURRENT_DATE);

    IF p_end_date IS NULL THEN
      p_end_date := v_current_date + INTERVAL '2 years';
    END IF;

    -- Generate dates
    WHILE v_current_date <= p_end_date AND v_dates_generated < p_max_dates LOOP
      -- Calculate original EFT date based on cycle and date type
      CASE v_cycle_name
        WHEN 'weekly' THEN
          v_original_eft_date := v_current_date + (COALESCE(v_date_value, 1) - EXTRACT(DOW FROM v_current_date))::integer;
        WHEN 'fortnightly' THEN
          v_original_eft_date := v_current_date + (COALESCE(v_date_value, 1) - EXTRACT(DOW FROM v_current_date))::integer;
        WHEN 'monthly' THEN
          v_original_eft_date := DATE_TRUNC('MONTH', v_current_date) + (COALESCE(v_date_value, 1) - 1) * INTERVAL '1 day';
        ELSE
          v_original_eft_date := v_current_date;
      END CASE;

      -- Adjust for business days and get the reason
      SELECT adjusted_date, adjustment_reason
      INTO v_adjusted_eft_date, v_adjustment_reason
      FROM adjust_date_with_reason(v_original_eft_date);

      -- Calculate processing date
      v_processing_date := subtract_business_days(v_adjusted_eft_date, v_processing_days);

      -- Insert the record with adjustment reason in notes field
      INSERT INTO payroll_dates (
        payroll_id, original_eft_date, adjusted_eft_date, processing_date, notes
      ) VALUES (
        p_payroll_id, v_original_eft_date, v_adjusted_eft_date, v_processing_date,
        CASE WHEN v_adjustment_reason = '' THEN NULL ELSE v_adjustment_reason END
      )
      ON CONFLICT (payroll_id, original_eft_date) DO UPDATE SET
        adjusted_eft_date = EXCLUDED.adjusted_eft_date,
        processing_date = EXCLUDED.processing_date,
        notes = EXCLUDED.notes,
        updated_at = CURRENT_TIMESTAMP
      RETURNING * INTO r;

      -- Return the inserted/updated record for Hasura
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
-- Name: FUNCTION generate_payroll_dates(p_payroll_id uuid, p_start_date date, p_end_date date, p_max_dates integer); Type: COMMENT; Schema: public; Owner: -
--



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

CREATE FUNCTION public.get_latest_payroll_version(payroll_id uuid) RETURNS SETOF latest_payroll_version_results
    LANGUAGE plpgsql
    AS $$ 
BEGIN 
    -- Clean up old results (use correct column name: queried_at)
    DELETE FROM latest_payroll_version_results WHERE queried_at < NOW() - INTERVAL '1 hour'; 
    
    -- Insert fresh data - include payroll_id
    INSERT INTO latest_payroll_version_results (payroll_id, name, version_number, go_live_date, active) 
    SELECT 
        p.id,
        p.name, 
        p.version_number, 
        p.go_live_date, 
        CASE WHEN p.status = 'Active' THEN true ELSE false END as active 
    FROM payrolls p 
    WHERE (p.id = payroll_id OR p.parent_payroll_id = payroll_id) 
    AND p.status = 'Active' 
    AND p.superseded_date IS NULL 
    ORDER BY p.version_number DESC 
    LIMIT 1; 
    
    -- Return the results - filter by the specific payroll_id we just inserted
    RETURN QUERY SELECT * FROM latest_payroll_version_results lvpr
    WHERE lvpr.payroll_id IN (
        SELECT DISTINCT p.id 
        FROM payrolls p 
        WHERE p.id = get_latest_payroll_version.payroll_id OR p.parent_payroll_id = get_latest_payroll_version.payroll_id
    )
    ORDER BY lvpr.queried_at DESC, lvpr.version_number DESC
    LIMIT 1; 
END; 
$$;


--
-- Name: FUNCTION get_latest_payroll_version(payroll_id uuid); Type: COMMENT; Schema: public; Owner: -
--



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

CREATE FUNCTION public.get_payroll_version_history(payroll_id uuid) RETURNS SETOF payroll_version_history_results
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
  WHERE p.id = payroll_id OR p.parent_payroll_id = payroll_id
  ORDER BY p.version_number ASC;
  
  -- Return the results - use table alias to avoid ambiguity
  RETURN QUERY 
  SELECT * FROM payroll_version_history_results pvhr
  WHERE pvhr.payroll_id IN (
    SELECT DISTINCT p.id 
    FROM payrolls p 
    WHERE p.id = get_payroll_version_history.payroll_id OR p.parent_payroll_id = get_payroll_version_history.payroll_id
  )
  ORDER BY pvhr.version_number ASC;
END;
$$;


--
-- Name: FUNCTION get_payroll_version_history(payroll_id uuid); Type: COMMENT; Schema: public; Owner: -
--



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
-- Name: mark_transfer_pair(uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.mark_transfer_pair(p_outgoing_id uuid, p_incoming_id uuid, p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    outgoing_exists BOOLEAN;
    incoming_exists BOOLEAN;
    same_user BOOLEAN;
    different_accounts BOOLEAN;
BEGIN
    -- Validate the transaction pair
    SELECT 
        EXISTS(SELECT 1 FROM transactions WHERE id = p_outgoing_id AND user_id = p_user_id),
        EXISTS(SELECT 1 FROM transactions WHERE id = p_incoming_id AND user_id = p_user_id),
        (SELECT t1.user_id = t2.user_id 
         FROM transactions t1, transactions t2 
         WHERE t1.id = p_outgoing_id AND t2.id = p_incoming_id),
        (SELECT t1.bank_account_id != t2.bank_account_id 
         FROM transactions t1, transactions t2 
         WHERE t1.id = p_outgoing_id AND t2.id = p_incoming_id)
    INTO outgoing_exists, incoming_exists, same_user, different_accounts;
    
    -- Check if valid
    IF NOT (outgoing_exists AND incoming_exists AND same_user AND different_accounts) THEN
        RETURN FALSE;
    END IF;
    
    -- Mark the transfer pair
    UPDATE transactions SET 
        is_transfer = true,
        transfer_pair_id = p_incoming_id,
        transfer_direction = 'outgoing',
        updated_at = NOW()
    WHERE id = p_outgoing_id;
    
    UPDATE transactions SET 
        is_transfer = true,
        transfer_pair_id = p_outgoing_id,
        transfer_direction = 'incoming',
        updated_at = NOW()
    WHERE id = p_incoming_id;
    
    RETURN TRUE;
END;
$$;


--
-- Name: FUNCTION mark_transfer_pair(p_outgoing_id uuid, p_incoming_id uuid, p_user_id uuid); Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: pair_transfers(uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.pair_transfers(p_outgoing_id uuid, p_incoming_id uuid, p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    outgoing_exists BOOLEAN;
    incoming_exists BOOLEAN;
    same_user BOOLEAN;
    different_accounts BOOLEAN;
    outgoing_is_transfer BOOLEAN;
    incoming_is_transfer BOOLEAN;
BEGIN
    -- Validate the transactions exist and belong to the user
    SELECT 
        EXISTS(SELECT 1 FROM transactions WHERE id = p_outgoing_id AND user_id = p_user_id),
        EXISTS(SELECT 1 FROM transactions WHERE id = p_incoming_id AND user_id = p_user_id)
    INTO outgoing_exists, incoming_exists;
    
    IF NOT (outgoing_exists AND incoming_exists) THEN
        RETURN FALSE;
    END IF;
    
    -- Check if both transactions are marked as transfers
    SELECT 
        COALESCE(transaction_type = 'transfer', false),
        COALESCE(transaction_type = 'transfer', false)
    FROM transactions t1, transactions t2
    WHERE t1.id = p_outgoing_id AND t2.id = p_incoming_id
    INTO outgoing_is_transfer, incoming_is_transfer;
    
    IF NOT (outgoing_is_transfer AND incoming_is_transfer) THEN
        RETURN FALSE;
    END IF;
    
    -- Validate they belong to same user and different accounts
    SELECT 
        (t1.user_id = t2.user_id AND t1.user_id = p_user_id),
        (t1.bank_account_id != t2.bank_account_id)
    FROM transactions t1, transactions t2 
    WHERE t1.id = p_outgoing_id AND t2.id = p_incoming_id
    INTO same_user, different_accounts;
    
    IF NOT (same_user AND different_accounts) THEN
        RETURN FALSE;
    END IF;
    
    -- Pair the transactions
    UPDATE transactions SET 
        transfer_pair_id = p_incoming_id,
        transfer_direction = 'outgoing',
        updated_at = NOW()
    WHERE id = p_outgoing_id;
    
    UPDATE transactions SET 
        transfer_pair_id = p_outgoing_id,
        transfer_direction = 'incoming',
        updated_at = NOW()
    WHERE id = p_incoming_id;
    
    RETURN TRUE;
END;
$$;


--
-- Name: FUNCTION pair_transfers(p_outgoing_id uuid, p_incoming_id uuid, p_user_id uuid); Type: COMMENT; Schema: public; Owner: -
--



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
-- Name: unmark_transfer_pair(uuid[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.unmark_transfer_pair(p_transaction_ids uuid[]) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    affected_rows INTEGER;
BEGIN
    UPDATE transactions SET 
        is_transfer = false,
        transfer_pair_id = NULL,
        transfer_direction = NULL,
        updated_at = NOW()
    WHERE id = ANY(p_transaction_ids);
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RETURN affected_rows;
END;
$$;


--
-- Name: FUNCTION unmark_transfer_pair(p_transaction_ids uuid[]); Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: unpair_transfers(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.unpair_transfers(p_transaction_id uuid, p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    paired_transaction_id UUID;
    transaction_exists BOOLEAN;
BEGIN
    -- Validate the transaction exists and belongs to the user
    SELECT 
        EXISTS(SELECT 1 FROM transactions WHERE id = p_transaction_id AND user_id = p_user_id),
        transfer_pair_id
    FROM transactions 
    WHERE id = p_transaction_id AND user_id = p_user_id
    INTO transaction_exists, paired_transaction_id;
    
    IF NOT transaction_exists THEN
        RETURN FALSE;
    END IF;
    
    -- If not paired, nothing to unpair
    IF paired_transaction_id IS NULL THEN
        RETURN TRUE; -- Consider this successful
    END IF;
    
    -- Unpair both transactions
    UPDATE transactions SET 
        transfer_pair_id = NULL,
        transfer_direction = NULL,
        updated_at = NOW()
    WHERE id = p_transaction_id OR id = paired_transaction_id;
    
    RETURN TRUE;
END;
$$;


--
-- Name: FUNCTION unpair_transfers(p_transaction_id uuid, p_user_id uuid); Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: update_admin_time_from_position(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_admin_time_from_position() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
      IF NEW.uses_default_admin_time = true THEN
          NEW.admin_time_hours = (
              SELECT
                  COALESCE(NEW.work_hours, 0) * (
                      SELECT COALESCE(pad.default_admin_percentage,
  u.default_admin_time_percentage, 15.0) / 100.0
                      FROM users u
                      LEFT JOIN position_admin_defaults pad ON pad.position =
  u.position
                      WHERE u.id = NEW.user_id
                  )
          );
      END IF;
      RETURN NEW;
  END;
  $$;


--
-- Name: update_invitation_status_metadata(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_invitation_status_metadata() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update status change tracking
    IF OLD.invitation_status IS DISTINCT FROM NEW.invitation_status THEN
        -- Set revoked fields if status changed to revoked
        IF NEW.invitation_status = 'revoked' AND OLD.invitation_status != 'revoked' THEN
            NEW.revoked_at = NOW();
            
            -- Try to get user from context if not already set
            IF NEW.revoked_by IS NULL THEN
                BEGIN
                    NEW.revoked_by = (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid;
                EXCEPTION WHEN OTHERS THEN
                    -- If no user context available, leave as NULL
                    NULL;
                END;
            END IF;
        END IF;
        
        -- Set accepted_at if status changed to accepted
        IF NEW.invitation_status = 'accepted' AND OLD.invitation_status != 'accepted' THEN
            NEW.accepted_at = NOW();
            
            -- Try to get user from context if not already set
            IF NEW.accepted_by IS NULL THEN
                BEGIN
                    NEW.accepted_by = (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid;
                EXCEPTION WHEN OTHERS THEN
                    NULL;
                END;
            END IF;
        END IF;
    END IF;
    
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
-- Name: update_leave_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_leave_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
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
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
      NEW.updated_at = now();
      RETURN NEW;
  END;
  $$;


--
-- Name: update_user_status_changed_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_status_changed_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Only update if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.status_changed_at = NOW();
        
        -- If status_changed_by is not set, try to get from Hasura context
        IF NEW.status_changed_by IS NULL THEN
            BEGIN
                NEW.status_changed_by = (current_setting(hasura.user, true)::json->>x-hasura-user-id)::uuid;
            EXCEPTION WHEN OTHERS THEN
                -- If no user context available, leave as NULL
                NULL;
            END;
        END IF;
    END IF;
    
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
-- Name: users_computed_full_name(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.users_computed_full_name(first_name text, last_name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
BEGIN
    RETURN trim(concat(first_name, ' ', last_name));
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
    action permission_action NOT NULL,
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
   FROM (((((roles r
     JOIN role_permissions rp ON ((r.id = rp.role_id)))
     JOIN permissions p ON ((rp.permission_id = p.id)))
     JOIN resources res ON ((p.resource_id = res.id)))
     LEFT JOIN user_roles ur ON ((r.id = ur.role_id)))
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
    role user_role NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    username character varying(255),
    image text,
    is_staff boolean DEFAULT false,
    manager_id uuid,
    clerk_user_id text,
    is_active boolean DEFAULT true,
    deactivated_at timestamp with time zone,
    deactivated_by text,
    status user_status_enum DEFAULT 'active'::user_status_enum NOT NULL,
    status_changed_at timestamp with time zone DEFAULT now(),
    status_changed_by uuid,
    status_change_reason text,
    "position" user_position DEFAULT 'consultant'::user_position,
    default_admin_time_percentage numeric(5,2) DEFAULT 15.0,
    phone character varying(20),
    address text,
    bio text,
    first_name character varying(255) DEFAULT ''::character varying NOT NULL,
    last_name character varying(255) DEFAULT ''::character varying NOT NULL,
    computed_name text GENERATED ALWAYS AS (users_computed_full_name((first_name)::text, (last_name)::text)) STORED,
    CONSTRAINT users_status_isactive_consistency CHECK ((((status = 'active'::user_status_enum) AND (is_active = true)) OR ((status <> 'active'::user_status_enum) AND (is_active = false))))
);


--
-- Name: COLUMN users.id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.role; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.updated_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.username; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.image; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.is_staff; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.manager_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.clerk_user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.status; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.status_changed_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.status_changed_by; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.status_change_reason; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users."position"; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.default_admin_time_percentage; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.phone; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.address; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN users.bio; Type: COMMENT; Schema: public; Owner: -
--



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
   FROM users u;


--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    ee_client_id text,
    ee_client_secret text
);


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



--
-- Name: COLUMN users_sync.id; Type: COMMENT; Schema: neon_auth; Owner: -
--



--
-- Name: COLUMN users_sync.name; Type: COMMENT; Schema: neon_auth; Owner: -
--



--
-- Name: COLUMN users_sync.email; Type: COMMENT; Schema: neon_auth; Owner: -
--



--
-- Name: COLUMN users_sync.created_at; Type: COMMENT; Schema: neon_auth; Owner: -
--



--
-- Name: COLUMN users_sync.updated_at; Type: COMMENT; Schema: neon_auth; Owner: -
--



--
-- Name: COLUMN users_sync.deleted_at; Type: COMMENT; Schema: neon_auth; Owner: -
--



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



--
-- Name: COLUMN adjustment_rules.cycle_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN adjustment_rules.date_type_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN adjustment_rules.rule_description; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN adjustment_rules.rule_code; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN adjustment_rules.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN adjustment_rules.updated_at; Type: COMMENT; Schema: public; Owner: -
--



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



--
-- Name: COLUMN app_settings.permissions; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid,
    action character varying(50) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id character varying(100) NOT NULL,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now(),
    "timestamp" timestamp with time zone DEFAULT now(),
    severity character varying(20) DEFAULT 'low'::character varying,
    category character varying(50) DEFAULT 'general'::character varying,
    session_id character varying(255),
    success boolean DEFAULT true,
    error_message text,
    details jsonb DEFAULT '{}'::jsonb
);


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
    updated_at timestamp with time zone DEFAULT now(),
    payroll_count integer,
    total_hours numeric(6,2),
    invoice_number character varying(50),
    billing_period_id uuid
);


--
-- Name: COLUMN billing_invoice.payroll_count; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_invoice.total_hours; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_invoice.invoice_number; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_invoice.billing_period_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: billing_invoice_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_invoice_item (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid NOT NULL,
    item_id uuid,
    quantity_hours numeric(8,2) DEFAULT 0 NOT NULL,
    hourly_rate numeric(8,2) DEFAULT 0 NOT NULL,
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0 NOT NULL,
    net_amount numeric(12,2) GENERATED ALWAYS AS ((total_amount - tax_amount)) STORED,
    description_override text,
    line_item_type text DEFAULT 'payroll_service'::text,
    billing_period_start date NOT NULL,
    billing_period_end date NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT billing_invoice_item_line_item_type_check CHECK ((line_item_type = ANY (ARRAY['payroll_service'::text, 'setup_fee'::text, 'adjustment'::text, 'discount'::text]))),
    CONSTRAINT positive_amounts CHECK (((total_amount >= (0)::numeric) AND (tax_amount >= (0)::numeric))),
    CONSTRAINT valid_billing_period CHECK ((billing_period_end >= billing_period_start)),
    CONSTRAINT valid_hours CHECK ((quantity_hours >= (0)::numeric)),
    CONSTRAINT valid_rate CHECK ((hourly_rate >= (0)::numeric))
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
    created_at timestamp without time zone DEFAULT now(),
    service_id uuid,
    staff_user_id uuid,
    notes text,
    status character varying(50) DEFAULT 'draft'::character varying,
    confirmed_at timestamp with time zone,
    confirmed_by uuid,
    updated_at timestamp with time zone DEFAULT now(),
    billing_plan_id uuid,
    client_id uuid,
    service_name character varying(255),
    hourly_rate numeric(10,2),
    total_amount numeric(10,2),
    is_approved boolean DEFAULT false,
    approval_date timestamp with time zone,
    approved_by uuid,
    CONSTRAINT billing_items_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'confirmed'::character varying, 'billed'::character varying])::text[])))
);


--
-- Name: COLUMN billing_items.service_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_items.staff_user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_items.notes; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_items.status; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_items.confirmed_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_items.confirmed_by; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: billing_periods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_periods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    status character varying(50) DEFAULT 'open'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT billing_periods_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'ready_to_invoice'::character varying, 'invoiced'::character varying, 'paid'::character varying])::text[])))
);


--
-- Name: TABLE billing_periods; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_periods.client_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_periods.period_start; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_periods.period_end; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_periods.status; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: billing_plan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_plan (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    standard_rate numeric(10,2) NOT NULL,
    currency text DEFAULT 'AUD'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    billing_unit character varying(50) DEFAULT 'Per Payroll'::character varying,
    category character varying(100) DEFAULT 'Processing'::character varying,
    is_active boolean DEFAULT true
);


--
-- Name: COLUMN billing_plan.standard_rate; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_plan.billing_unit; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_plan.category; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN billing_plan.is_active; Type: COMMENT; Schema: public; Owner: -
--



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
    updated_at timestamp with time zone DEFAULT now(),
    custom_rate numeric(10,2),
    billing_frequency character varying(50) DEFAULT 'Per Job'::character varying,
    effective_date date DEFAULT CURRENT_DATE,
    is_enabled boolean DEFAULT true
);


--
-- Name: COLUMN client_billing_assignment.custom_rate; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN client_billing_assignment.billing_frequency; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN client_billing_assignment.effective_date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN client_billing_assignment.is_enabled; Type: COMMENT; Schema: public; Owner: -
--



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



--
-- Name: COLUMN client_external_systems.client_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN client_external_systems.system_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN client_external_systems.system_client_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN client_external_systems.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN client_external_systems.updated_at; Type: COMMENT; Schema: public; Owner: -
--



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



--
-- Name: COLUMN clients.name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN clients.contact_person; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN clients.contact_email; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN clients.contact_phone; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN clients.active; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN clients.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN clients.updated_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: client_services_with_rates; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.client_services_with_rates AS
 SELECT cba.id AS agreement_id,
    cba.client_id,
    c.name AS client_name,
    cba.billing_plan_id AS service_id,
    bp.name AS service_name,
    bp.description AS service_description,
    bp.billing_unit,
    bp.category,
    bp.standard_rate,
    COALESCE(cba.custom_rate, bp.standard_rate) AS effective_rate,
    cba.custom_rate,
    cba.billing_frequency,
    cba.is_enabled,
    cba.is_active,
    cba.effective_date
   FROM ((client_billing_assignment cba
     JOIN clients c ON ((cba.client_id = c.id)))
     JOIN billing_plan bp ON ((cba.billing_plan_id = bp.id)))
  WHERE ((cba.is_active = true) AND (bp.is_active = true));


--
-- Name: VIEW client_services_with_rates; Type: COMMENT; Schema: public; Owner: -
--



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
    admin_time_hours numeric(4,2) DEFAULT 0,
    payroll_capacity_hours numeric(4,2),
    uses_default_admin_time boolean DEFAULT true,
    CONSTRAINT work_schedule_admin_time_hours_check CHECK ((admin_time_hours >= (0)::numeric)),
    CONSTRAINT work_schedule_work_day_check CHECK (((work_day)::text = ANY (ARRAY[('Monday'::character varying)::text, ('Tuesday'::character varying)::text, ('Wednesday'::character varying)::text, ('Thursday'::character varying)::text, ('Friday'::character varying)::text, ('Saturday'::character varying)::text, ('Sunday'::character varying)::text]))),
    CONSTRAINT work_schedule_work_hours_check CHECK (((work_hours >= (0)::numeric) AND (work_hours <= (24)::numeric)))
);


--
-- Name: COLUMN work_schedule.id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN work_schedule.user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN work_schedule.work_day; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN work_schedule.work_hours; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN work_schedule.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN work_schedule.updated_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN work_schedule.admin_time_hours; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN work_schedule.payroll_capacity_hours; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN work_schedule.uses_default_admin_time; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: consultant_capacity_overview; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.consultant_capacity_overview AS
 SELECT u.id,
    u.name,
    u.email,
    u."position",
    u.default_admin_time_percentage,
    ws.work_day,
    ws.work_hours,
    ws.admin_time_hours,
    ws.payroll_capacity_hours,
    ws.uses_default_admin_time,
        CASE
            WHEN (ws.work_hours > (0)::numeric) THEN ((ws.admin_time_hours / ws.work_hours) * (100)::numeric)
            ELSE (0)::numeric
        END AS admin_time_percentage_actual
   FROM (users u
     LEFT JOIN work_schedule ws ON ((u.id = ws.user_id)))
  WHERE (u.is_staff = true);


--
-- Name: payroll_cycles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_cycles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name payroll_cycle_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN payroll_cycles.id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_cycles.name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_cycles.description; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_cycles.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_cycles.updated_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: payroll_date_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_date_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name payroll_date_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: COLUMN payroll_date_types.id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_date_types.name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_date_types.description; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_date_types.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payroll_date_types.updated_at; Type: COMMENT; Schema: public; Owner: -
--



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
    status payroll_status DEFAULT 'Implementation'::payroll_status NOT NULL,
    processing_time integer DEFAULT 1 NOT NULL,
    employee_count integer,
    go_live_date date,
    version_number integer DEFAULT 1,
    parent_payroll_id uuid,
    superseded_date date,
    version_reason text,
    created_by_user_id uuid,
    payslip_count integer,
    new_employees integer DEFAULT 0,
    terminated_employees integer DEFAULT 0,
    billing_status character varying(50) DEFAULT 'pending'::character varying,
    estimated_revenue numeric(12,2),
    actual_revenue numeric(12,2),
    estimated_hours numeric(8,2),
    actual_hours numeric(8,2),
    profit_margin numeric(5,2),
    last_billed_date timestamp with time zone,
    CONSTRAINT check_positive_values CHECK (((processing_days_before_eft >= 0) AND (processing_time >= 0) AND ((employee_count IS NULL) OR (employee_count >= 0)))),
    CONSTRAINT check_version_reason CHECK (((version_reason IS NULL) OR (version_reason = ANY ((enum_range(NULL::payroll_version_reason))::text[])))),
    CONSTRAINT payrolls_billing_status_check CHECK (((billing_status)::text = ANY ((ARRAY['pending'::character varying, 'items_added'::character varying, 'ready_to_bill'::character varying, 'billed'::character varying])::text[])))
);


--
-- Name: COLUMN payrolls.id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.client_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.cycle_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.date_type_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.date_value; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.primary_consultant_user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.backup_consultant_user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.manager_user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.processing_days_before_eft; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.updated_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.payroll_system; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.status; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.processing_time; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.employee_count; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.go_live_date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.payslip_count; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.new_employees; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.terminated_employees; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN payrolls.billing_status; Type: COMMENT; Schema: public; Owner: -
--



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
   FROM (((payrolls p
     LEFT JOIN clients c ON ((p.client_id = c.id)))
     LEFT JOIN payroll_cycles pc ON ((p.cycle_id = pc.id)))
     LEFT JOIN payroll_date_types pdt ON ((p.date_type_id = pdt.id)))
  WHERE (((p.go_live_date IS NULL) OR (p.go_live_date <= CURRENT_DATE)) AND ((p.superseded_date IS NULL) OR (p.superseded_date > CURRENT_DATE)))
  ORDER BY COALESCE(p.parent_payroll_id, p.id), p.version_number DESC;


--
-- Name: data_backups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_backups (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid,
    backup_type character varying(20) DEFAULT 'automatic'::character varying,
    status character varying(20) DEFAULT 'pending'::character varying,
    file_size bigint,
    encryption_key_hash character varying(255),
    storage_path character varying(500),
    checksum character varying(255),
    compression_type character varying(20) DEFAULT 'gzip'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    expires_at timestamp with time zone,
    error_message text,
    metadata jsonb DEFAULT '{}'::jsonb,
    tables_included text[] DEFAULT ARRAY['transactions'::text, 'budgets'::text, 'goals'::text, 'bank_accounts'::text],
    retention_days integer DEFAULT 30,
    CONSTRAINT data_backups_backup_type_check CHECK (((backup_type)::text = ANY ((ARRAY['automatic'::character varying, 'manual'::character varying, 'scheduled'::character varying])::text[]))),
    CONSTRAINT data_backups_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'failed'::character varying])::text[])))
);


--
-- Name: email_drafts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_drafts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    template_id uuid,
    recipient_emails text[] NOT NULL,
    subject character varying(500),
    html_content text,
    text_content text,
    variable_values jsonb,
    business_context jsonb,
    scheduled_for timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE email_drafts; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: email_send_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_send_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_id uuid,
    resend_email_id character varying(255),
    recipient_emails text[] NOT NULL,
    sender_user_id uuid NOT NULL,
    subject character varying(500) NOT NULL,
    html_content text,
    text_content text,
    business_context jsonb,
    send_status character varying(50) DEFAULT 'pending'::character varying,
    resend_response jsonb,
    error_message text,
    scheduled_for timestamp with time zone,
    sent_at timestamp with time zone,
    delivered_at timestamp with time zone,
    opened_at timestamp with time zone,
    clicked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT email_send_logs_send_status_check CHECK (((send_status)::text = ANY ((ARRAY['pending'::character varying, 'sent'::character varying, 'delivered'::character varying, 'failed'::character varying, 'bounced'::character varying])::text[])))
);


--
-- Name: TABLE email_send_logs; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(100) NOT NULL,
    subject_template character varying(500) NOT NULL,
    html_content text NOT NULL,
    text_content text,
    available_variables jsonb DEFAULT '[]'::jsonb NOT NULL,
    is_active boolean DEFAULT true,
    is_system_template boolean DEFAULT false,
    requires_approval boolean DEFAULT false,
    created_by_user_id uuid NOT NULL,
    approved_by_user_id uuid,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT email_templates_category_check CHECK (((category)::text = ANY ((ARRAY['payroll'::character varying, 'billing'::character varying, 'client'::character varying, 'leave'::character varying, 'work_schedule'::character varying, 'system'::character varying])::text[])))
);


--
-- Name: TABLE email_templates; Type: COMMENT; Schema: public; Owner: -
--



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



--
-- Name: COLUMN external_systems.name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN external_systems.url; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN external_systems.description; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN external_systems.icon; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN external_systems.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN external_systems.updated_at; Type: COMMENT; Schema: public; Owner: -
--



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



--
-- Name: COLUMN feature_flags.feature_name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN feature_flags.is_enabled; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN feature_flags.allowed_roles; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN feature_flags.updated_at; Type: COMMENT; Schema: public; Owner: -
--



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



--
-- Name: COLUMN holidays.date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.local_name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.name; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.country_code; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.region; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.is_fixed; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.is_global; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.launch_year; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.types; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN holidays.updated_at; Type: COMMENT; Schema: public; Owner: -
--



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
    status leave_status_enum,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT check_leave_dates CHECK ((end_date >= start_date)),
    CONSTRAINT leave_leave_type_check CHECK (((leave_type)::text = ANY (ARRAY[('Annual'::character varying)::text, ('Sick'::character varying)::text, ('Unpaid'::character varying)::text, ('Other'::character varying)::text])))
);


--
-- Name: COLUMN leave.id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN leave.user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN leave.start_date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN leave.end_date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN leave.leave_type; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN leave.reason; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN leave.status; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN leave.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN leave.updated_at; Type: COMMENT; Schema: public; Owner: -
--



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



--
-- Name: COLUMN notes.entity_type; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN notes.entity_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN notes.user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN notes.content; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN notes.is_important; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN notes.created_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN notes.updated_at; Type: COMMENT; Schema: public; Owner: -
--



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
   FROM (((payrolls p
     LEFT JOIN clients c ON ((p.client_id = c.id)))
     LEFT JOIN payroll_cycles pc ON ((p.cycle_id = pc.id)))
     LEFT JOIN payroll_dates pd ON ((p.id = pd.payroll_id)))
  WHERE (p.superseded_date IS NULL)
  GROUP BY p.id, p.name, p.status, c.name, pc.name, p.primary_consultant_user_id, p.backup_consultant_user_id, p.manager_user_id
  WITH NO DATA;


--
-- Name: time_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    staff_user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    payroll_id uuid,
    billing_item_id uuid,
    work_date date NOT NULL,
    hours_spent numeric(4,2) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT time_entries_hours_spent_check CHECK (((hours_spent > (0)::numeric) AND (hours_spent <= (24)::numeric)))
);


--
-- Name: TABLE time_entries; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN time_entries.staff_user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN time_entries.client_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN time_entries.payroll_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN time_entries.billing_item_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN time_entries.work_date; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN time_entries.hours_spent; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN time_entries.description; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: payroll_profitability; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.payroll_profitability AS
 SELECT p.id AS payroll_id,
    p.name AS payroll_name,
    p.client_id,
    c.name AS client_name,
    p.billing_status,
    p.payslip_count,
    p.employee_count,
    COALESCE(sum(bi.amount), (0)::numeric) AS total_revenue,
    COALESCE(sum(te.hours_spent), (0)::numeric) AS total_hours,
        CASE
            WHEN (sum(te.hours_spent) > (0)::numeric) THEN (COALESCE(sum(bi.amount), (0)::numeric) / sum(te.hours_spent))
            ELSE (0)::numeric
        END AS revenue_per_hour,
    count(DISTINCT bi.id) AS billing_items_count,
    count(DISTINCT te.id) AS time_entries_count
   FROM (((payrolls p
     LEFT JOIN clients c ON ((p.client_id = c.id)))
     LEFT JOIN billing_items bi ON (((p.id = bi.payroll_id) AND ((bi.status)::text <> 'draft'::text))))
     LEFT JOIN time_entries te ON ((p.id = te.payroll_id)))
  GROUP BY p.id, p.name, p.client_id, c.name, p.billing_status, p.payslip_count, p.employee_count;


--
-- Name: VIEW payroll_profitability; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: payroll_required_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payroll_required_skills (
    payroll_id uuid,
    skill_name character varying(100),
    required_level character varying(20)
);


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



--
-- Name: COLUMN permission_overrides.user_id; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN permission_overrides.role; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN permission_overrides.granted; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN permission_overrides.conditions; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: COLUMN permission_overrides.expires_at; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: position_admin_defaults; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.position_admin_defaults (
    "position" user_position NOT NULL,
    default_admin_percentage numeric(5,2) NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    CONSTRAINT position_admin_defaults_default_admin_percentage_check CHECK (((default_admin_percentage >= (0)::numeric) AND (default_admin_percentage <= (100)::numeric)))
);


--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limits (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    service_id character varying(50) NOT NULL,
    window_start timestamp with time zone NOT NULL,
    window_duration_minutes integer DEFAULT 60 NOT NULL,
    request_count integer DEFAULT 0 NOT NULL,
    limit_exceeded_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: security_alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_alerts (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid,
    alert_type character varying(50) NOT NULL,
    severity character varying(20) DEFAULT 'medium'::character varying,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    ip_address inet,
    user_agent text,
    is_resolved boolean DEFAULT false,
    resolved_at timestamp with time zone,
    resolved_by uuid,
    resolution_notes text,
    created_at timestamp with time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT security_alerts_alert_type_check CHECK (((alert_type)::text = ANY ((ARRAY['failed_login'::character varying, 'unusual_activity'::character varying, 'data_breach'::character varying, 'suspicious_transaction'::character varying, 'account_lockout'::character varying, 'password_change'::character varying, 'email_change'::character varying, 'mfa_disabled'::character varying])::text[]))),
    CONSTRAINT security_alerts_severity_check CHECK (((severity)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[])))
);


--
-- Name: security_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_settings (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid,
    setting_key character varying(100) NOT NULL,
    setting_value jsonb NOT NULL,
    is_system_wide boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    updated_by uuid
);


--
-- Name: staff_billing_performance; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.staff_billing_performance AS
 SELECT u.id AS staff_id,
    u.name AS staff_name,
    count(DISTINCT bi.payroll_id) AS payrolls_worked,
    count(DISTINCT bi.id) AS billing_items_created,
    COALESCE(sum(bi.amount), (0)::numeric) AS total_revenue_generated,
    COALESCE(sum(te.hours_spent), (0)::numeric) AS total_hours_logged,
        CASE
            WHEN (sum(te.hours_spent) > (0)::numeric) THEN (COALESCE(sum(bi.amount), (0)::numeric) / sum(te.hours_spent))
            ELSE (0)::numeric
        END AS revenue_per_hour,
    count(DISTINCT bi.payroll_id) AS distinct_clients_served
   FROM ((users u
     LEFT JOIN billing_items bi ON (((u.id = bi.staff_user_id) AND ((bi.status)::text <> 'draft'::text))))
     LEFT JOIN time_entries te ON ((u.id = te.staff_user_id)))
  WHERE (u.id IN ( SELECT DISTINCT billing_items.staff_user_id
           FROM billing_items
          WHERE (billing_items.staff_user_id IS NOT NULL)))
  GROUP BY u.id, u.name;


--
-- Name: VIEW staff_billing_performance; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: system_configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_configuration (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    config_key character varying(100) NOT NULL,
    config_value jsonb NOT NULL,
    config_type character varying(50) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: system_health; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_health (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now(),
    status character varying(20) DEFAULT 'healthy'::character varying,
    cpu_usage numeric(5,2),
    memory_usage numeric(5,2),
    disk_usage numeric(5,2),
    database_response_time integer,
    api_response_time integer,
    active_users integer,
    error_rate numeric(5,4),
    alerts jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT system_health_status_check CHECK (((status)::text = ANY ((ARRAY['healthy'::character varying, 'warning'::character varying, 'critical'::character varying, 'maintenance'::character varying])::text[])))
);


--
-- Name: team_capacity_by_position; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.team_capacity_by_position AS
 SELECT u."position",
    count(DISTINCT u.id) AS consultant_count,
    sum(ws.work_hours) AS total_work_hours,
    sum(ws.admin_time_hours) AS total_admin_hours,
    sum(ws.payroll_capacity_hours) AS total_payroll_capacity,
        CASE
            WHEN (sum(ws.work_hours) > (0)::numeric) THEN ((sum(ws.admin_time_hours) / sum(ws.work_hours)) * (100)::numeric)
            ELSE (0)::numeric
        END AS avg_admin_percentage
   FROM (users u
     LEFT JOIN work_schedule ws ON ((u.id = ws.user_id)))
  WHERE (u.is_staff = true)
  GROUP BY u."position";


--
-- Name: user_email_template_favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_email_template_favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    template_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: TABLE user_email_template_favorites; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: user_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_invitations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    invited_role character varying(50) NOT NULL,
    manager_id uuid,
    clerk_invitation_id character varying(255),
    clerk_ticket character varying(1000),
    invitation_metadata jsonb DEFAULT '{}'::jsonb,
    invited_by uuid NOT NULL,
    invited_at timestamp with time zone DEFAULT now() NOT NULL,
    accepted_at timestamp with time zone,
    accepted_by uuid,
    expires_at timestamp with time zone NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    invitation_status invitation_status_enum DEFAULT 'pending'::invitation_status_enum NOT NULL,
    revoked_at timestamp with time zone,
    revoked_by uuid,
    revoke_reason text,
    CONSTRAINT user_invitations_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'expired'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: TABLE user_invitations; Type: COMMENT; Schema: public; Owner: -
--



--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    session_token character varying(255) NOT NULL,
    ip_address inet,
    user_agent text,
    location_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    last_activity timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true,
    logout_reason character varying(50)
);


--
-- Name: user_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_skills (
    user_id uuid,
    skill_name character varying(100),
    proficiency_level character varying(20)
);


--
-- Name: users_role_backup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_role_backup (
    id uuid,
    email character varying(255),
    role user_role,
    created_at timestamp with time zone
);


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
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


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
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: billing_event_log billing_event_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_pkey PRIMARY KEY (id);


--
-- Name: billing_invoice billing_invoice_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_invoice_number_key UNIQUE (invoice_number);


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
-- Name: billing_items billing_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_pkey PRIMARY KEY (id);


--
-- Name: billing_periods billing_periods_client_id_period_start_period_end_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_periods
    ADD CONSTRAINT billing_periods_client_id_period_start_period_end_key UNIQUE (client_id, period_start, period_end);


--
-- Name: billing_periods billing_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_periods
    ADD CONSTRAINT billing_periods_pkey PRIMARY KEY (id);


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
-- Name: data_backups data_backups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_backups
    ADD CONSTRAINT data_backups_pkey PRIMARY KEY (id);


--
-- Name: email_drafts email_drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_drafts
    ADD CONSTRAINT email_drafts_pkey PRIMARY KEY (id);


--
-- Name: email_send_logs email_send_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_send_logs
    ADD CONSTRAINT email_send_logs_pkey PRIMARY KEY (id);


--
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


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
-- Name: position_admin_defaults position_admin_defaults_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.position_admin_defaults
    ADD CONSTRAINT position_admin_defaults_pkey PRIMARY KEY ("position");


--
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_service_id_window_start_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_service_id_window_start_key UNIQUE (service_id, window_start);


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
-- Name: security_alerts security_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_alerts
    ADD CONSTRAINT security_alerts_pkey PRIMARY KEY (id);


--
-- Name: security_settings security_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_settings
    ADD CONSTRAINT security_settings_pkey PRIMARY KEY (id);


--
-- Name: security_settings security_settings_user_id_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_settings
    ADD CONSTRAINT security_settings_user_id_setting_key_key UNIQUE (user_id, setting_key);


--
-- Name: system_configuration system_configuration_config_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_configuration
    ADD CONSTRAINT system_configuration_config_key_key UNIQUE (config_key);


--
-- Name: system_configuration system_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_configuration
    ADD CONSTRAINT system_configuration_pkey PRIMARY KEY (id);


--
-- Name: system_health system_health_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_health
    ADD CONSTRAINT system_health_pkey PRIMARY KEY (id);


--
-- Name: time_entries time_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_pkey PRIMARY KEY (id);


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
-- Name: user_email_template_favorites user_email_template_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_email_template_favorites
    ADD CONSTRAINT user_email_template_favorites_pkey PRIMARY KEY (id);


--
-- Name: user_email_template_favorites user_email_template_favorites_user_id_template_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_email_template_favorites
    ADD CONSTRAINT user_email_template_favorites_user_id_template_id_key UNIQUE (user_id, template_id);


--
-- Name: user_invitations user_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_pkey PRIMARY KEY (id);


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
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_session_token_key UNIQUE (session_token);


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
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


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
-- Name: idx_audit_log_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_action ON public.audit_log USING btree (action);


--
-- Name: idx_audit_log_category_new; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_category_new ON public.audit_log USING btree (category);


--
-- Name: idx_audit_log_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_created_at ON public.audit_log USING btree (created_at);


--
-- Name: idx_audit_log_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_entity ON public.audit_log USING btree (entity_type, entity_id);


--
-- Name: idx_audit_log_severity_new; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_severity_new ON public.audit_log USING btree (severity);


--
-- Name: idx_audit_log_timestamp_new; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_timestamp_new ON public.audit_log USING btree ("timestamp" DESC);


--
-- Name: idx_audit_log_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_log_user_id ON public.audit_log USING btree (user_id);


--
-- Name: idx_audit_payroll_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_payroll_date ON public.payroll_assignment_audit USING btree (payroll_date_id);


--
-- Name: idx_billing_invoice_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_invoice_client_id ON public.billing_invoice USING btree (client_id);


--
-- Name: idx_billing_invoice_item_billing_period; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_invoice_item_billing_period ON public.billing_invoice_item USING btree (billing_period_start, billing_period_end);


--
-- Name: idx_billing_invoice_item_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_invoice_item_created_at ON public.billing_invoice_item USING btree (created_at);


--
-- Name: idx_billing_invoice_item_invoice_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_invoice_item_invoice_id ON public.billing_invoice_item USING btree (invoice_id);


--
-- Name: idx_billing_invoice_item_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_invoice_item_item_id ON public.billing_invoice_item USING btree (item_id);


--
-- Name: idx_billing_items_billing_plan_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_items_billing_plan_id ON public.billing_items USING btree (billing_plan_id);


--
-- Name: idx_billing_items_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_items_client_id ON public.billing_items USING btree (client_id);


--
-- Name: idx_billing_items_payroll_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_items_payroll_id ON public.billing_items USING btree (payroll_id);


--
-- Name: idx_billing_items_service_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_items_service_id ON public.billing_items USING btree (service_id);


--
-- Name: idx_billing_items_staff_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_items_staff_user_id ON public.billing_items USING btree (staff_user_id);


--
-- Name: idx_billing_items_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_items_status ON public.billing_items USING btree (status);


--
-- Name: idx_billing_periods_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_periods_client_id ON public.billing_periods USING btree (client_id);


--
-- Name: idx_billing_periods_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_periods_dates ON public.billing_periods USING btree (period_start, period_end);


--
-- Name: idx_billing_periods_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_periods_status ON public.billing_periods USING btree (status);


--
-- Name: idx_client_billing_assignment_client_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_billing_assignment_client_active ON public.client_billing_assignment USING btree (client_id, is_active);


--
-- Name: idx_client_billing_assignment_service; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_client_billing_assignment_service ON public.client_billing_assignment USING btree (billing_plan_id);


--
-- Name: idx_data_backups_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_data_backups_created_at ON public.data_backups USING btree (created_at DESC);


--
-- Name: idx_data_backups_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_data_backups_status ON public.data_backups USING btree (status);


--
-- Name: idx_data_backups_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_data_backups_user_id ON public.data_backups USING btree (user_id);


--
-- Name: idx_email_drafts_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_drafts_user ON public.email_drafts USING btree (user_id);


--
-- Name: idx_email_send_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_send_logs_created_at ON public.email_send_logs USING btree (created_at);


--
-- Name: idx_email_send_logs_sender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_send_logs_sender ON public.email_send_logs USING btree (sender_user_id);


--
-- Name: idx_email_send_logs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_send_logs_status ON public.email_send_logs USING btree (send_status);


--
-- Name: idx_email_send_logs_template; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_send_logs_template ON public.email_send_logs USING btree (template_id);


--
-- Name: idx_email_templates_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_templates_active ON public.email_templates USING btree (is_active);


--
-- Name: idx_email_templates_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_templates_category ON public.email_templates USING btree (category);


--
-- Name: idx_email_templates_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_templates_created_by ON public.email_templates USING btree (created_by_user_id);


--
-- Name: idx_holidays_date_country_region; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_holidays_date_country_region ON public.holidays USING btree (date, country_code, region);


--
-- Name: idx_latest_payroll_version_results_payroll_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_latest_payroll_version_results_payroll_id ON public.latest_payroll_version_results USING btree (payroll_id);


--
-- Name: idx_latest_payroll_version_results_queried_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_latest_payroll_version_results_queried_at ON public.latest_payroll_version_results USING btree (queried_at);


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
-- Name: idx_payroll_version_history_results_payroll_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_version_history_results_payroll_id ON public.payroll_version_history_results USING btree (payroll_id);


--
-- Name: idx_payroll_version_history_results_queried_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_version_history_results_queried_at ON public.payroll_version_history_results USING btree (queried_at);


--
-- Name: idx_payroll_version_results_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_version_results_created_at ON public.payroll_version_results USING btree (created_at);


--
-- Name: idx_payrolls_active_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_active_dates ON public.payrolls USING btree (status, go_live_date, superseded_date) WHERE (status = 'Active'::payroll_status);


--
-- Name: idx_payrolls_billing_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_billing_status ON public.payrolls USING btree (billing_status);


--
-- Name: idx_payrolls_client_billing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_client_billing ON public.payrolls USING btree (client_id, billing_status);


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

CREATE INDEX idx_payrolls_status_client ON public.payrolls USING btree (status, client_id) WHERE (status <> 'Inactive'::payroll_status);


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
-- Name: idx_permissions_resource_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permissions_resource_action ON public.permissions USING btree (resource_id, action);


--
-- Name: idx_position_admin_defaults_position; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_position_admin_defaults_position ON public.position_admin_defaults USING btree ("position");


--
-- Name: idx_rate_limits_service_window; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rate_limits_service_window ON public.rate_limits USING btree (service_id, window_start);


--
-- Name: idx_role_permissions_permission_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions USING btree (permission_id);


--
-- Name: idx_role_permissions_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_role_permissions_role_id ON public.role_permissions USING btree (role_id);


--
-- Name: idx_security_alerts_severity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_alerts_severity ON public.security_alerts USING btree (severity);


--
-- Name: idx_security_alerts_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_alerts_type ON public.security_alerts USING btree (alert_type);


--
-- Name: idx_security_alerts_unresolved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_alerts_unresolved ON public.security_alerts USING btree (is_resolved) WHERE (is_resolved = false);


--
-- Name: idx_security_alerts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_alerts_user_id ON public.security_alerts USING btree (user_id);


--
-- Name: idx_security_settings_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_settings_key ON public.security_settings USING btree (setting_key);


--
-- Name: idx_security_settings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_settings_user_id ON public.security_settings USING btree (user_id);


--
-- Name: idx_system_health_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_system_health_status ON public.system_health USING btree (status);


--
-- Name: idx_system_health_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_system_health_timestamp ON public.system_health USING btree ("timestamp" DESC);


--
-- Name: idx_time_entries_billing_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_billing_item_id ON public.time_entries USING btree (billing_item_id);


--
-- Name: idx_time_entries_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_client_id ON public.time_entries USING btree (client_id);


--
-- Name: idx_time_entries_payroll_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_payroll_id ON public.time_entries USING btree (payroll_id);


--
-- Name: idx_time_entries_staff_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_staff_user_id ON public.time_entries USING btree (staff_user_id);


--
-- Name: idx_time_entries_work_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_time_entries_work_date ON public.time_entries USING btree (work_date);


--
-- Name: idx_unique_payroll_date; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_payroll_date ON public.payroll_dates USING btree (payroll_id, original_eft_date);


--
-- Name: idx_user_invitations_clerk_ticket; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_invitations_clerk_ticket ON public.user_invitations USING btree (clerk_ticket);


--
-- Name: idx_user_invitations_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_invitations_email ON public.user_invitations USING btree (email);


--
-- Name: idx_user_invitations_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_invitations_expires_at ON public.user_invitations USING btree (expires_at);


--
-- Name: idx_user_invitations_invitation_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_invitations_invitation_status ON public.user_invitations USING btree (invitation_status);


--
-- Name: idx_user_invitations_invited_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_invitations_invited_by ON public.user_invitations USING btree (invited_by);


--
-- Name: idx_user_invitations_revoked_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_invitations_revoked_at ON public.user_invitations USING btree (revoked_at);


--
-- Name: idx_user_invitations_revoked_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_invitations_revoked_by ON public.user_invitations USING btree (revoked_by);


--
-- Name: idx_user_invitations_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_invitations_status ON public.user_invitations USING btree (status);


--
-- Name: idx_user_roles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);


--
-- Name: idx_user_sessions_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_active ON public.user_sessions USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_user_sessions_last_activity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_last_activity ON public.user_sessions USING btree (last_activity);


--
-- Name: idx_user_sessions_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_token ON public.user_sessions USING btree (session_token);


--
-- Name: idx_user_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_sessions_user_id ON public.user_sessions USING btree (user_id);


--
-- Name: idx_user_template_favorites_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_template_favorites_user ON public.user_email_template_favorites USING btree (user_id);


--
-- Name: idx_users_active_staff; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_active_staff ON public.users USING btree (is_active, is_staff, role) WHERE (is_active = true);


--
-- Name: idx_users_clerk_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_clerk_composite ON public.users USING btree (clerk_user_id, role, is_staff);


--
-- Name: idx_users_computed_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_computed_name ON public.users USING btree (computed_name);


--
-- Name: idx_users_deactivated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_deactivated_at ON public.users USING btree (deactivated_at) WHERE (deactivated_at IS NOT NULL);


--
-- Name: idx_users_first_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_first_name ON public.users USING btree (first_name);


--
-- Name: idx_users_full_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_full_name ON public.users USING btree (first_name, last_name);


--
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- Name: idx_users_last_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_last_name ON public.users USING btree (last_name);


--
-- Name: idx_users_position; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_position ON public.users USING btree ("position");


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: idx_users_status_changed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_status_changed_at ON public.users USING btree (status_changed_at);


--
-- Name: idx_work_schedule_admin_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_schedule_admin_time ON public.work_schedule USING btree (user_id, uses_default_admin_time);


--
-- Name: idx_work_schedule_capacity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_schedule_capacity ON public.work_schedule USING btree (payroll_capacity_hours);


--
-- Name: idx_work_schedule_user_capacity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_schedule_user_capacity ON public.work_schedule USING btree (user_id, work_day, payroll_capacity_hours);


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
-- Name: user_invitations audit_invitation_status_change_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_invitation_status_change_trigger AFTER UPDATE ON public.user_invitations FOR EACH ROW EXECUTE FUNCTION audit_invitation_status_change();


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
-- Name: users audit_user_status_change_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_user_status_change_trigger AFTER UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION audit_user_status_change();


--
-- Name: users audit_users_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_users_changes AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


--
-- Name: notes check_entity_relation; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_entity_relation BEFORE INSERT OR UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION enforce_entity_relation();


--
-- Name: payrolls enforce_staff_on_payrolls; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_staff_on_payrolls BEFORE INSERT OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION enforce_staff_roles();


--
-- Name: payroll_assignments set_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.payroll_assignments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


--
-- Name: payrolls trigger_auto_delete_future_dates; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_delete_future_dates AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION auto_delete_future_dates_on_supersede();


--
-- Name: payrolls trigger_auto_generate_dates; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_generate_dates AFTER INSERT ON public.payrolls FOR EACH ROW EXECUTE FUNCTION auto_generate_dates_on_payroll_insert();


--
-- Name: payrolls trigger_auto_regenerate_dates; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_regenerate_dates AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION auto_regenerate_dates_on_schedule_change();


--
-- Name: work_schedule trigger_calculate_payroll_capacity; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_calculate_payroll_capacity BEFORE INSERT OR UPDATE ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION calculate_payroll_capacity();


--
-- Name: work_schedule trigger_prevent_duplicate_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_prevent_duplicate_insert BEFORE INSERT ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_workday_insert();


--
-- Name: work_schedule trigger_update_admin_time_from_position; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_admin_time_from_position BEFORE INSERT OR UPDATE ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION update_admin_time_from_position();


--
-- Name: billing_invoice_item update_billing_invoice_item_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_billing_invoice_item_updated_at BEFORE UPDATE ON public.billing_invoice_item FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


--
-- Name: billing_items update_billing_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_billing_items_updated_at BEFORE UPDATE ON public.billing_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


--
-- Name: billing_periods update_billing_periods_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_billing_periods_updated_at BEFORE UPDATE ON public.billing_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


--
-- Name: feature_flags update_feature_flags_modtime; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_feature_flags_modtime BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION update_modified_column();


--
-- Name: user_invitations update_invitation_status_metadata_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_invitation_status_metadata_trigger BEFORE UPDATE ON public.user_invitations FOR EACH ROW EXECUTE FUNCTION update_invitation_status_metadata();


--
-- Name: leave update_leave_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_leave_updated_at_trigger BEFORE UPDATE ON public.leave FOR EACH ROW EXECUTE FUNCTION update_leave_updated_at();


--
-- Name: permission_overrides update_permission_overrides_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_permission_overrides_updated_at BEFORE UPDATE ON public.permission_overrides FOR EACH ROW EXECUTE FUNCTION update_timestamp();


--
-- Name: permissions update_permissions_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_permissions_timestamp BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION update_timestamp();


--
-- Name: resources update_resources_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_resources_timestamp BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION update_timestamp();


--
-- Name: role_permissions update_role_permissions_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_role_permissions_timestamp BEFORE UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION update_timestamp();


--
-- Name: roles update_roles_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_roles_timestamp BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION update_timestamp();


--
-- Name: security_settings update_security_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON public.security_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


--
-- Name: system_configuration update_system_configuration_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_system_configuration_updated_at BEFORE UPDATE ON public.system_configuration FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


--
-- Name: time_entries update_time_entries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON public.time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


--
-- Name: user_invitations update_user_invitations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_invitations_updated_at BEFORE UPDATE ON public.user_invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


--
-- Name: user_roles update_user_roles_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_roles_timestamp BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION update_timestamp();


--
-- Name: users update_user_status_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_status_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_user_status_changed_at();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: adjustment_rules adjustment_rules_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES payroll_cycles(id) ON DELETE CASCADE;


--
-- Name: adjustment_rules adjustment_rules_date_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES payroll_date_types(id) ON DELETE CASCADE;


--
-- Name: audit_log audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: billing_event_log billing_event_log_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id);


--
-- Name: billing_event_log billing_event_log_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES billing_invoice(id) ON DELETE CASCADE;


--
-- Name: billing_invoice billing_invoice_billing_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_billing_period_id_fkey FOREIGN KEY (billing_period_id) REFERENCES billing_periods(id) ON DELETE SET NULL;


--
-- Name: billing_invoice billing_invoice_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;


--
-- Name: billing_invoice_item billing_invoice_item_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES billing_invoice(id) ON DELETE CASCADE;


--
-- Name: billing_invoice_item billing_invoice_item_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_item_id_fkey FOREIGN KEY (item_id) REFERENCES billing_items(id) ON DELETE SET NULL;


--
-- Name: billing_items billing_items_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES users(id);


--
-- Name: billing_items billing_items_billing_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_billing_plan_id_fkey FOREIGN KEY (billing_plan_id) REFERENCES billing_plan(id);


--
-- Name: billing_items billing_items_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id);


--
-- Name: billing_items billing_items_confirmed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES users(id);


--
-- Name: billing_items billing_items_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES payrolls(id) ON DELETE SET NULL;


--
-- Name: billing_items billing_items_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_service_id_fkey FOREIGN KEY (service_id) REFERENCES billing_plan(id);


--
-- Name: billing_items billing_items_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES users(id);


--
-- Name: billing_periods billing_periods_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_periods
    ADD CONSTRAINT billing_periods_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;


--
-- Name: client_billing_assignment client_billing_assignment_billing_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_billing_plan_id_fkey FOREIGN KEY (billing_plan_id) REFERENCES billing_plan(id) ON DELETE RESTRICT;


--
-- Name: client_billing_assignment client_billing_assignment_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;


--
-- Name: client_external_systems client_external_systems_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;


--
-- Name: client_external_systems client_external_systems_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_system_id_fkey FOREIGN KEY (system_id) REFERENCES external_systems(id) ON DELETE CASCADE;


--
-- Name: data_backups data_backups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_backups
    ADD CONSTRAINT data_backups_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: email_drafts email_drafts_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_drafts
    ADD CONSTRAINT email_drafts_template_id_fkey FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;


--
-- Name: email_drafts email_drafts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_drafts
    ADD CONSTRAINT email_drafts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: email_send_logs email_send_logs_sender_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_send_logs
    ADD CONSTRAINT email_send_logs_sender_user_id_fkey FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE RESTRICT;


--
-- Name: email_send_logs email_send_logs_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_send_logs
    ADD CONSTRAINT email_send_logs_template_id_fkey FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;


--
-- Name: email_templates email_templates_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: email_templates email_templates_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT;


--
-- Name: payroll_assignment_audit fk_audit_assignment; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_assignment FOREIGN KEY (assignment_id) REFERENCES payroll_assignments(id) ON DELETE SET NULL;


--
-- Name: payroll_assignment_audit fk_audit_changed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_changed_by FOREIGN KEY (changed_by) REFERENCES users(id);


--
-- Name: payroll_assignment_audit fk_audit_from_consultant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_from_consultant FOREIGN KEY (from_consultant_id) REFERENCES users(id);


--
-- Name: payroll_assignment_audit fk_audit_payroll_date; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_payroll_date FOREIGN KEY (payroll_date_id) REFERENCES payroll_dates(id);


--
-- Name: payroll_assignment_audit fk_audit_to_consultant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_to_consultant FOREIGN KEY (to_consultant_id) REFERENCES users(id);


--
-- Name: payrolls fk_backup_consultant_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_backup_consultant_user FOREIGN KEY (backup_consultant_user_id) REFERENCES users(id);


--
-- Name: leave fk_leave_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave
    ADD CONSTRAINT fk_leave_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: payrolls fk_manager_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_manager_user FOREIGN KEY (manager_user_id) REFERENCES users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_assigned_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_consultant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_consultant FOREIGN KEY (consultant_id) REFERENCES users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_original_consultant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_original_consultant FOREIGN KEY (original_consultant_id) REFERENCES users(id);


--
-- Name: payroll_assignments fk_payroll_assignment_payroll_date; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_payroll_date FOREIGN KEY (payroll_date_id) REFERENCES payroll_dates(id) ON DELETE CASCADE;


--
-- Name: payrolls fk_primary_consultant_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_primary_consultant_user FOREIGN KEY (primary_consultant_user_id) REFERENCES users(id);


--
-- Name: work_schedule fk_work_schedule_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT fk_work_schedule_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: users manager_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT manager_id FOREIGN KEY (manager_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: payroll_dates payroll_dates_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES payrolls(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payroll_required_skills payroll_required_skills_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_required_skills
    ADD CONSTRAINT payroll_required_skills_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES payrolls(id);


--
-- Name: payrolls payrolls_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;


--
-- Name: payrolls payrolls_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES payroll_cycles(id) ON DELETE RESTRICT;


--
-- Name: payrolls payrolls_date_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES payroll_date_types(id) ON DELETE RESTRICT;


--
-- Name: payrolls payrolls_parent_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_parent_payroll_id_fkey FOREIGN KEY (parent_payroll_id) REFERENCES payrolls(id);


--
-- Name: permission_audit_log permission_audit_log_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: permission_audit_log permission_audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: permission_overrides permission_overrides_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: permission_overrides permission_overrides_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: permissions permissions_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;


--
-- Name: security_alerts security_alerts_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_alerts
    ADD CONSTRAINT security_alerts_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES users(id);


--
-- Name: security_alerts security_alerts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_alerts
    ADD CONSTRAINT security_alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: security_settings security_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_settings
    ADD CONSTRAINT security_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES users(id);


--
-- Name: security_settings security_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_settings
    ADD CONSTRAINT security_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: time_entries time_entries_billing_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_billing_item_id_fkey FOREIGN KEY (billing_item_id) REFERENCES billing_items(id) ON DELETE CASCADE;


--
-- Name: time_entries time_entries_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;


--
-- Name: time_entries time_entries_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES payrolls(id) ON DELETE CASCADE;


--
-- Name: time_entries time_entries_staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_entries
    ADD CONSTRAINT time_entries_staff_user_id_fkey FOREIGN KEY (staff_user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_email_template_favorites user_email_template_favorites_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_email_template_favorites
    ADD CONSTRAINT user_email_template_favorites_template_id_fkey FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE CASCADE;


--
-- Name: user_email_template_favorites user_email_template_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_email_template_favorites
    ADD CONSTRAINT user_email_template_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_invitations user_invitations_accepted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_accepted_by_fkey FOREIGN KEY (accepted_by) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: user_invitations user_invitations_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_invitations user_invitations_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: user_invitations user_invitations_revoked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_revoked_by_fkey FOREIGN KEY (revoked_by) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;


--
-- Name: user_skills user_skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: users users_status_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_status_changed_by_fkey FOREIGN KEY (status_changed_by) REFERENCES users(id) ON DELETE SET NULL;


--
-- Name: billing_periods; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.billing_periods ENABLE ROW LEVEL SECURITY;

--
-- Name: billing_periods billing_periods_delete_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY billing_periods_delete_policy ON public.billing_periods FOR DELETE USING (true);


--
-- Name: billing_periods billing_periods_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY billing_periods_insert_policy ON public.billing_periods FOR INSERT WITH CHECK (true);


--
-- Name: billing_periods billing_periods_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY billing_periods_select_policy ON public.billing_periods FOR SELECT USING (true);


--
-- Name: billing_periods billing_periods_update_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY billing_periods_update_policy ON public.billing_periods FOR UPDATE USING (true);


--
-- Name: clients; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

--
-- Name: user_invitations consultant_viewer_read_user_invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY consultant_viewer_read_user_invitations ON public.user_invitations USING ((current_setting('hasura.user_role'::text) = ANY (ARRAY['consultant'::text, 'viewer'::text]))) WITH CHECK ((current_setting('hasura.user_role'::text) = ANY (ARRAY['consultant'::text, 'viewer'::text])));


--
-- Name: user_invitations developer_full_access_user_invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY developer_full_access_user_invitations ON public.user_invitations USING (((CURRENT_USER = 'developer'::name) OR (current_setting('hasura.user_role'::text) = 'developer'::text))) WITH CHECK (((CURRENT_USER = 'developer'::name) OR (current_setting('hasura.user_role'::text) = 'developer'::text)));


--
-- Name: user_invitations manager_access_user_invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY manager_access_user_invitations ON public.user_invitations USING ((current_setting('hasura.user_role'::text) = 'manager'::text)) WITH CHECK ((current_setting('hasura.user_role'::text) = 'manager'::text));


--
-- Name: notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

--
-- Name: user_invitations org_admin_full_access_user_invitations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY org_admin_full_access_user_invitations ON public.user_invitations USING ((current_setting('hasura.user_role'::text) = 'org_admin'::text)) WITH CHECK ((current_setting('hasura.user_role'::text) = 'org_admin'::text));


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
   FROM users u
  WHERE ((u.id = (current_setting('hasura.user_id'::text))::uuid) AND ((u.role = ANY (ARRAY['developer'::user_role, 'org_admin'::user_role])) OR ((u.role = 'manager'::user_role) AND (payrolls.manager_user_id = u.id)) OR ((u.role = 'consultant'::user_role) AND ((payrolls.primary_consultant_user_id = u.id) OR (payrolls.backup_consultant_user_id = u.id))))))));


--
-- Name: time_entries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: time_entries time_entries_delete_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY time_entries_delete_policy ON public.time_entries FOR DELETE USING (true);


--
-- Name: time_entries time_entries_insert_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY time_entries_insert_policy ON public.time_entries FOR INSERT WITH CHECK (true);


--
-- Name: time_entries time_entries_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY time_entries_select_policy ON public.time_entries FOR SELECT USING (true);


--
-- Name: time_entries time_entries_update_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY time_entries_update_policy ON public.time_entries FOR UPDATE USING (true);


--
-- Name: user_invitations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_select_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_select_policy ON public.users FOR SELECT USING (((id = (current_setting('hasura.user_id'::text))::uuid) OR (EXISTS ( SELECT 1
   FROM users u
  WHERE ((u.id = (current_setting('hasura.user_id'::text))::uuid) AND (u.role = ANY (ARRAY['developer'::user_role, 'org_admin'::user_role])))))));


--
-- PostgreSQL database dump complete
--


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
    'admin',
    'org_admin',
    'manager',
    'consultant',
    'viewer'
);


ALTER TYPE public.user_role OWNER TO neondb_owner;

--
-- Name: activate_payroll_versions(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.activate_payroll_versions() RETURNS TABLE(payroll_id uuid, action_taken text, version_number integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_payroll RECORD;
BEGIN
    -- Deactivate old versions that have been superseded
    FOR v_payroll IN 
        SELECT id, name, version_number, superseded_date
        FROM payrolls 
        WHERE active = true 
        AND superseded_date IS NOT NULL 
        AND superseded_date <= CURRENT_DATE
    LOOP
        UPDATE payrolls 
        SET active = false, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_payroll.id;
        
        RETURN QUERY SELECT 
            v_payroll.id,
            'deactivated_superseded_version'::text,
            v_payroll.version_number;
    END LOOP;

    -- Activate new versions that should go live today
    FOR v_payroll IN 
        SELECT id, name, version_number, go_live_date
        FROM payrolls 
        WHERE active = true 
        AND go_live_date = CURRENT_DATE
        AND superseded_date IS NULL
    LOOP
        -- This payroll is already active and should go live today
        RETURN QUERY SELECT 
            v_payroll.id,
            'activated_new_version'::text,
            v_payroll.version_number;
    END LOOP;
END;
$$;


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
-- Name: create_payroll_version(uuid, date, text, uuid, text, uuid, uuid, uuid, integer, uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.create_payroll_version(p_original_payroll_id uuid, p_go_live_date date, p_version_reason text DEFAULT 'schedule_change'::text, p_created_by_user_id uuid DEFAULT NULL::uuid, p_new_name text DEFAULT NULL::text, p_new_client_id uuid DEFAULT NULL::uuid, p_new_cycle_id uuid DEFAULT NULL::uuid, p_new_date_type_id uuid DEFAULT NULL::uuid, p_new_date_value integer DEFAULT NULL::integer, p_new_primary_consultant_user_id uuid DEFAULT NULL::uuid, p_new_backup_consultant_user_id uuid DEFAULT NULL::uuid, p_new_manager_user_id uuid DEFAULT NULL::uuid) RETURNS TABLE(new_payroll_id uuid, new_version_number integer, old_payroll_id uuid, dates_deleted integer, message text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_original_payroll RECORD;
    v_new_payroll_id uuid;
    v_new_version_number integer;
    v_parent_id uuid;
    v_dates_deleted integer;
BEGIN
    -- Get the original payroll details
    SELECT * INTO v_original_payroll
    FROM payrolls 
    WHERE id = p_original_payroll_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payroll not found: %', p_original_payroll_id;
    END IF;

    -- Determine parent ID and version number
    v_parent_id := COALESCE(v_original_payroll.parent_payroll_id, p_original_payroll_id);
    
    SELECT COALESCE(MAX(version_number), 0) + 1 
    INTO v_new_version_number
    FROM payrolls 
    WHERE id = v_parent_id OR parent_payroll_id = v_parent_id;

    -- Generate new UUID for the new version
    v_new_payroll_id := gen_random_uuid();

    -- Create the new payroll version
    INSERT INTO payrolls (
        id,
        name,
        client_id,
        cycle_id,
        date_type_id,
        date_value,
        start_date,
        primary_consultant_user_id,
        backup_consultant_user_id,
        manager_user_id,
        active,
        version_number,
        parent_payroll_id,
        go_live_date,
        version_reason,
        created_by_user_id,
        created_at,
        updated_at
    ) VALUES (
        v_new_payroll_id,
        COALESCE(p_new_name, v_original_payroll.name),
        COALESCE(p_new_client_id, v_original_payroll.client_id),
        COALESCE(p_new_cycle_id, v_original_payroll.cycle_id),
        COALESCE(p_new_date_type_id, v_original_payroll.date_type_id),
        COALESCE(p_new_date_value, v_original_payroll.date_value),
        v_original_payroll.start_date,
        COALESCE(p_new_primary_consultant_user_id, v_original_payroll.primary_consultant_user_id),
        COALESCE(p_new_backup_consultant_user_id, v_original_payroll.backup_consultant_user_id),
        COALESCE(p_new_manager_user_id, v_original_payroll.manager_user_id),
        true, -- New version is active
        v_new_version_number,
        v_parent_id,
        p_go_live_date,
        p_version_reason,
        p_created_by_user_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- Delete future payroll dates from the original payroll (from go-live date forward)
    DELETE FROM payroll_dates 
    WHERE payroll_id = p_original_payroll_id 
    AND original_eft_date >= p_go_live_date;
    
    GET DIAGNOSTICS v_dates_deleted = ROW_COUNT;

    -- Mark original payroll as superseded but keep it active until go-live date
    UPDATE payrolls 
    SET superseded_date = p_go_live_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_original_payroll_id;

    RETURN QUERY SELECT 
        v_new_payroll_id,
        v_new_version_number,
        p_original_payroll_id,
        v_dates_deleted,
        format('Created version %s of payroll with go-live date %s', v_new_version_number, p_go_live_date);
END;
$$;


ALTER FUNCTION public.create_payroll_version(p_original_payroll_id uuid, p_go_live_date date, p_version_reason text, p_created_by_user_id uuid, p_new_name text, p_new_client_id uuid, p_new_cycle_id uuid, p_new_date_type_id uuid, p_new_date_value integer, p_new_primary_consultant_user_id uuid, p_new_backup_consultant_user_id uuid, p_new_manager_user_id uuid) OWNER TO neondb_owner;

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

SET default_tablespace = '';

SET default_table_access_method = heap;

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
  v_cycle_name public.payroll_cycle_type;
  v_date_type_name public.payroll_date_type;
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
  -- Return variable for Hasura compatibility
  r public.payroll_dates%ROWTYPE;
BEGIN
  -- Retrieve payroll configuration
  SELECT
    pc.name,
    pdt.name,
    p.date_value,
    p.processing_days_before_eft,
    COALESCE(ar.rule_code, 'previous') INTO v_cycle_name,
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
  AND v_dates_generated < p_max_dates LOOP 
    -- Reset variables for each iteration
    v_original_eft_date := NULL;
    v_adjusted_eft_date := NULL;
    v_processing_date := NULL;
    v_adjustment_reason := '';
    
    -- Cycle type specific date calculations
    CASE
      v_cycle_name
      WHEN 'weekly' THEN 
        -- Weekly payroll: Ensure date falls on specified weekday
        v_original_eft_date := v_current_date + (
          (
            7 + v_date_value - EXTRACT(
              DOW
              FROM
                v_current_date
            )
          ) % 7
        ) * INTERVAL '1 day';
        
        -- If calculated date is current date, move to next week
        IF v_original_eft_date = v_current_date THEN 
          v_original_eft_date := v_original_eft_date + INTERVAL '7 days';
        END IF;
        
      WHEN 'fortnightly' THEN 
        -- Fortnightly payroll: Determine Week A or Week B
        v_week_of_year := EXTRACT(
          WEEK
          FROM
            v_current_date
        );
        v_is_week_a := (v_week_of_year % 2) = 1; -- Odd weeks are Week A
        
        -- Calculate date based on weekday and week type
        v_original_eft_date := v_current_date + (
          (
            7 + v_date_value - EXTRACT(
              DOW
              FROM
                v_current_date
            )
          ) % 7
        ) * INTERVAL '1 day';
        
        -- For Week B, shift forward by a week
        IF NOT v_is_week_a THEN 
          v_original_eft_date := v_original_eft_date + INTERVAL '7 days';
        END IF;
        
      WHEN 'bi_monthly' THEN 
        -- Bi-monthly payroll: Handle 1st/15th (or 14th in February)
        v_month := EXTRACT(
          MONTH
          FROM
            v_current_date
        );
        v_year := EXTRACT(
          YEAR
          FROM
            v_current_date
        );
        
        -- Special handling for February
        IF v_month = 2 THEN 
          v_mid_month_date := MAKE_DATE(v_year, 2, 14);
          v_end_month_date := MAKE_DATE(v_year, 2, 28);
        ELSE 
          -- Standard months: 15th and end of month
          v_mid_month_date := MAKE_DATE(v_year, v_month, 15);
          v_end_month_date := (
            DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
          ) :: DATE;
        END IF;
        
        -- Set original date based on type, don't adjust here
        IF v_date_type_name = 'som' THEN 
          v_original_eft_date := v_mid_month_date;
        ELSE 
          v_original_eft_date := v_end_month_date;
        END IF;
        
      WHEN 'monthly' THEN 
        -- Monthly payroll: Based on date type
        CASE
          v_date_type_name
          WHEN 'som' THEN 
            -- Start of month - original date stays as 1st
            v_original_eft_date := DATE_TRUNC('MONTH', v_current_date) :: DATE;
          WHEN 'eom' THEN 
            -- End of month - original date stays as last day
            v_original_eft_date := (
              DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
            ) :: DATE;
          WHEN 'fixed_date' THEN 
            -- Fixed date: Create date with specified day - KEEP ORIGINAL DATE
            -- If date_value is not applicable, use a default or specific logic
            IF v_date_value IS NULL THEN 
              v_original_eft_date := MAKE_DATE(
                EXTRACT(
                  YEAR
                  FROM
                    v_current_date
                ) :: int,
                EXTRACT(
                  MONTH
                  FROM
                    v_current_date
                ) :: int,
                15 -- Default to 15th for fixed date if not specified
              );
            ELSE 
              -- Keep original date as the configured day, handle month end gracefully
              BEGIN
                v_original_eft_date := MAKE_DATE(
                  EXTRACT(YEAR FROM v_current_date) :: int,
                  EXTRACT(MONTH FROM v_current_date) :: int,
                  v_date_value
                );
              EXCEPTION
                WHEN OTHERS THEN
                  -- If date is invalid (e.g., Feb 30), use last day of month
                  v_original_eft_date := (
                    DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
                  ) :: DATE;
              END;
            END IF;
        END CASE;
        
      WHEN 'quarterly' THEN 
        -- Quarterly payroll: Only in March, June, September, December
        v_month := EXTRACT(
          MONTH
          FROM
            v_current_date
        );
        IF v_month IN (3, 6, 9, 12) THEN 
          -- Set original date first, then adjust separately
          CASE v_date_type_name
            WHEN 'som' THEN 
              v_original_eft_date := DATE_TRUNC('MONTH', v_current_date) :: DATE;
            WHEN 'eom' THEN 
              v_original_eft_date := (
                DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
              ) :: DATE;
            WHEN 'fixed_date' THEN
              BEGIN
                v_original_eft_date := MAKE_DATE(
                  EXTRACT(YEAR FROM v_current_date) :: int,
                  EXTRACT(MONTH FROM v_current_date) :: int,
                  COALESCE(v_date_value, 1)
                );
              EXCEPTION
                WHEN OTHERS THEN
                  v_original_eft_date := (
                    DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
                  ) :: DATE;
              END;
            ELSE
              -- Default to end of month
              v_original_eft_date := (
                DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
              ) :: DATE;
          END CASE;
        ELSE 
          -- Skip to next valid quarter
          v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
          CONTINUE;
        END IF;
        
      ELSE 
        RAISE EXCEPTION 'Unsupported payroll cycle type: %', v_cycle_name;
    END CASE;
    
    -- Get adjusted date and detailed reason using helper function
    SELECT ard.adjusted_date, ard.adjustment_reason 
    INTO v_adjusted_eft_date, v_adjustment_reason
    FROM public.adjust_date_with_reason(v_original_eft_date, COALESCE(v_rule_code, 'previous')) ard;
    
    -- Calculate processing date by subtracting business days
    v_processing_date := subtract_business_days(
      v_adjusted_eft_date,
      v_processing_days_before_eft
    );
    
    -- Insert generated payroll date with enhanced notes
    INSERT INTO
      payroll_dates (
        payroll_id,
        original_eft_date,
        adjusted_eft_date,
        processing_date,
        created_at,
        updated_at,
        notes
      )
    VALUES
      (
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
      ) RETURNING * INTO r;
      
    -- Return the inserted record for Hasura
    RETURN NEXT r;
    
    -- Increment tracking variables
    v_dates_generated := v_dates_generated + 1;
    
    -- Move to next calculation period
    CASE
      v_cycle_name
      WHEN 'weekly' THEN v_current_date := v_original_eft_date + INTERVAL '7 days';
      WHEN 'fortnightly' THEN v_current_date := v_original_eft_date + INTERVAL '14 days';
      WHEN 'bi_monthly' THEN 
        v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
      WHEN 'monthly' THEN v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
      WHEN 'quarterly' THEN v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '3 months';
      ELSE -- Fallback: increment by 1 month
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
-- Name: get_latest_payroll_version(uuid); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.get_latest_payroll_version(p_payroll_id uuid) RETURNS TABLE(id uuid, name text, version_number integer, go_live_date date, active boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH payroll_family AS (
        -- Get the original payroll and all its versions
        SELECT p.id, p.parent_payroll_id
        FROM payrolls p
        WHERE p.id = p_payroll_id
           OR p.parent_payroll_id = p_payroll_id
           OR p.id = (SELECT parent_payroll_id FROM payrolls WHERE id = p_payroll_id)
    ),
    all_versions AS (
        SELECT p.*
        FROM payrolls p
        JOIN payroll_family pf ON (p.id = pf.id OR p.parent_payroll_id = pf.id)
        WHERE p.active = true
    )
    SELECT 
        av.id,
        av.name,
        av.version_number,
        av.go_live_date,
        av.active
    FROM all_versions av
    WHERE av.go_live_date <= CURRENT_DATE
    ORDER BY av.version_number DESC
    LIMIT 1;
END;
$$;


ALTER FUNCTION public.get_latest_payroll_version(p_payroll_id uuid) OWNER TO neondb_owner;

--
-- Name: get_payroll_version_history(uuid); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.get_payroll_version_history(p_payroll_id uuid) RETURNS TABLE(id uuid, name text, version_number integer, go_live_date date, superseded_date date, version_reason text, active boolean, is_current boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    WITH payroll_family AS (
        -- Get the original payroll and all its versions
        SELECT 
            COALESCE(p.parent_payroll_id, p.id) as root_id
        FROM payrolls p
        WHERE p.id = p_payroll_id
    ),
    all_versions AS (
        SELECT p.*
        FROM payrolls p
        JOIN payroll_family pf ON (p.id = pf.root_id OR p.parent_payroll_id = pf.root_id)
    ),
    current_version AS (
        SELECT av.id as current_id
        FROM all_versions av
        WHERE av.active = true 
        AND (av.go_live_date IS NULL OR av.go_live_date <= CURRENT_DATE)
        ORDER BY av.version_number DESC
        LIMIT 1
    )
    SELECT 
        av.id,
        av.name,
        av.version_number,
        av.go_live_date,
        av.superseded_date,
        av.version_reason,
        av.active,
        (av.id = cv.current_id) as is_current
    FROM all_versions av
    CROSS JOIN current_version cv
    ORDER BY av.version_number ASC;
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
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role public.user_role DEFAULT 'viewer'::public.user_role NOT NULL,
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
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: neondb_owner
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


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
-- Name: idx_payrolls_client_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_client_id ON public.payrolls USING btree (client_id);


--
-- Name: idx_payrolls_consultant; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_consultant ON public.payrolls USING btree (primary_consultant_user_id);


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
-- Name: notes check_entity_relation; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER check_entity_relation BEFORE INSERT OR UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.enforce_entity_relation();


--
-- Name: payrolls enforce_staff_on_payrolls; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER enforce_staff_on_payrolls BEFORE INSERT OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.enforce_staff_roles();


--
-- Name: billing_invoice_item trg_invoice_item_total; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trg_invoice_item_total AFTER INSERT OR DELETE OR UPDATE ON public.billing_invoice_item FOR EACH ROW EXECUTE FUNCTION public.update_invoice_total();


--
-- Name: work_schedule trigger_prevent_duplicate_insert; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_prevent_duplicate_insert BEFORE INSERT ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_workday_insert();


--
-- Name: feature_flags update_feature_flags_modtime; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_feature_flags_modtime BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- Name: payrolls update_payroll_dates_trigger; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_payroll_dates_trigger AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.update_payroll_dates();


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
-- PostgreSQL database dump complete
--


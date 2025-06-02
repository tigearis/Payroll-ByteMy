--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.12 (Homebrew)

-- Started on 2025-05-31 17:38:18 AEST

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
-- TOC entry 5 (class 2615 OID 24797)
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


--
-- TOC entry 6 (class 2615 OID 278616)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 3770 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 997 (class 1247 OID 279062)
-- Name: leave_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.leave_status_enum AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);


--
-- TOC entry 925 (class 1247 OID 278618)
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
-- TOC entry 928 (class 1247 OID 278631)
-- Name: payroll_date_result; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_date_result AS (
	success boolean,
	message text
);


--
-- TOC entry 931 (class 1247 OID 278633)
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
-- TOC entry 934 (class 1247 OID 278647)
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
-- TOC entry 937 (class 1247 OID 278649)
-- Name: payroll_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payroll_status AS ENUM (
    'Active',
    'Implementation',
    'Inactive'
);


--
-- TOC entry 880 (class 1247 OID 294914)
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
-- TOC entry 883 (class 1247 OID 311297)
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
-- TOC entry 940 (class 1247 OID 278656)
-- Name: status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status AS ENUM (
    'active',
    'inactive',
    'archived'
);


--
-- TOC entry 943 (class 1247 OID 278664)
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'org_admin',
    'manager',
    'consultant',
    'viewer'
);


--
-- TOC entry 261 (class 1255 OID 278675)
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
-- TOC entry 262 (class 1255 OID 278676)
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
-- TOC entry 263 (class 1255 OID 278677)
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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 278678)
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
-- TOC entry 3771 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN payroll_dates.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.id IS 'Unique identifier for the payroll date';


--
-- TOC entry 3772 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN payroll_dates.payroll_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.payroll_id IS 'Reference to the payroll this date belongs to';


--
-- TOC entry 3773 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN payroll_dates.original_eft_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.original_eft_date IS 'Originally calculated EFT date before adjustments';


--
-- TOC entry 3774 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN payroll_dates.adjusted_eft_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.adjusted_eft_date IS 'Final EFT date after holiday and weekend adjustments';


--
-- TOC entry 3775 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN payroll_dates.processing_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.processing_date IS 'Date when payroll processing must be completed';


--
-- TOC entry 3776 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN payroll_dates.notes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.notes IS 'Additional notes about this payroll date';


--
-- TOC entry 3777 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN payroll_dates.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.created_at IS 'Timestamp when the date record was created';


--
-- TOC entry 3778 (class 0 OID 0)
-- Dependencies: 218
-- Name: COLUMN payroll_dates.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_dates.updated_at IS 'Timestamp when the date record was last updated';


--
-- TOC entry 260 (class 1255 OID 278686)
-- Name: generate_payroll_dates(uuid, date, date, integer); Type: FUNCTION; Schema: public; Owner: -
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
  WHILE v_current_date <= v_end_calculation_date AND v_dates_generated < p_max_dates LOOP 
    -- Reset variables for each iteration
    v_original_eft_date := NULL;
    v_adjusted_eft_date := NULL;
    v_processing_date := NULL;
    
    -- Cycle type specific date calculations
    CASE v_cycle_name
      WHEN 'weekly' THEN 
        -- Weekly payroll: Ensure date falls on specified weekday
        v_original_eft_date := v_current_date + (
          (7 + v_date_value - EXTRACT(DOW FROM v_current_date)) % 7
        ) * INTERVAL '1 day';
        
        -- If calculated date is current date, move to next week
        IF v_original_eft_date = v_current_date THEN 
          v_original_eft_date := v_original_eft_date + INTERVAL '7 days';
        END IF;
        
      WHEN 'fortnightly' THEN 
        -- Fortnightly payroll: Determine Week A or Week B
        v_week_of_year := EXTRACT(WEEK FROM v_current_date);
        v_is_week_a := (v_week_of_year % 2) = 1; -- Odd weeks are Week A
        
        -- Calculate date based on weekday and week type
        v_original_eft_date := v_current_date + (
          (7 + v_date_value - EXTRACT(DOW FROM v_current_date)) % 7
        ) * INTERVAL '1 day';
        
        -- For Week B, shift forward by a week
        IF NOT v_is_week_a THEN 
          v_original_eft_date := v_original_eft_date + INTERVAL '7 days';
        END IF;
        
      WHEN 'bi_monthly' THEN 
        -- Bi-monthly payroll: Handle 1st/15th (or 14th in February)
        v_month := EXTRACT(MONTH FROM v_current_date);
        v_year := EXTRACT(YEAR FROM v_current_date);
        
        -- Special handling for February
        IF v_month = 2 THEN 
          v_mid_month_date := MAKE_DATE(v_year, 2, 14);
          v_end_month_date := MAKE_DATE(v_year, 2, 28);
        ELSE 
          -- Standard months: 15th and end of month
          v_mid_month_date := MAKE_DATE(v_year, v_month, 15);
          v_end_month_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
        END IF;
        
        -- Separate handling for each date based on date type
        IF v_date_type_name = 'som' THEN 
          -- Next business day rule for start of month
          v_original_eft_date := adjust_for_non_business_day(v_mid_month_date, 'next');
        ELSE 
          -- Previous business day rule for end of month
          v_original_eft_date := adjust_for_non_business_day(v_end_month_date, 'previous');
        END IF;
        
      WHEN 'monthly' THEN 
        -- Monthly payroll: Based on date type
        CASE v_date_type_name
          WHEN 'som' THEN 
            -- Start of month, next business day
            v_original_eft_date := adjust_for_non_business_day(DATE_TRUNC('MONTH', v_current_date)::DATE, 'next');
            
          WHEN 'eom' THEN 
            -- End of month, previous business day
            v_original_eft_date := adjust_for_non_business_day(
              (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
              'previous'
            );
            
          WHEN 'fixed_date' THEN 
            -- Fixed date: Create date with specified day
            -- If date_value is not applicable, use a default or specific logic
            IF v_date_value IS NULL THEN 
              v_original_eft_date := MAKE_DATE(
                EXTRACT(YEAR FROM v_current_date)::int,
                EXTRACT(MONTH FROM v_current_date)::int,
                15 -- Default to 15th for fixed date if not specified
              );
            ELSE 
              v_original_eft_date := MAKE_DATE(
                EXTRACT(YEAR FROM v_current_date)::int,
                EXTRACT(MONTH FROM v_current_date)::int,
                LEAST(v_date_value, 28) -- Prevent invalid dates
              );
            END IF;
            v_original_eft_date := adjust_for_non_business_day(v_original_eft_date, 'previous');
        END CASE;
        
      WHEN 'quarterly' THEN 
        -- Quarterly payroll: Only in March, June, September, December
        v_month := EXTRACT(MONTH FROM v_current_date);
        
        IF v_month IN (3, 6, 9, 12) THEN 
          -- Use end of month with previous business day rule
          v_original_eft_date := adjust_for_non_business_day(
            (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
            'previous'
          );
        ELSE 
          -- Skip to next valid quarter
          v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
          CONTINUE;
        END IF;
        
      ELSE 
        RAISE EXCEPTION 'Unsupported payroll cycle type: %', v_cycle_name;
    END CASE;
    
    -- Adjust EFT date based on business day rules
    v_adjusted_eft_date := adjust_for_non_business_day(v_original_eft_date, COALESCE(v_rule_code, 'previous'));
    
    -- Calculate processing date by subtracting business days
    v_processing_date := subtract_business_days(v_adjusted_eft_date, v_processing_days_before_eft);
    
    -- Insert generated payroll date
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
        WHEN v_original_eft_date != v_adjusted_eft_date THEN 'Date adjusted due to non-business day'
        ELSE NULL
      END
    ) RETURNING * INTO r;
    
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
        -- For bi-monthly, we've already inserted both dates in the previous section
        v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
      WHEN 'monthly' THEN 
        v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
      WHEN 'quarterly' THEN 
        v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '3 months';
      ELSE 
        -- Fallback: increment by 1 month
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
-- TOC entry 264 (class 1255 OID 278688)
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
-- TOC entry 265 (class 1255 OID 278689)
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
-- TOC entry 266 (class 1255 OID 278690)
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
-- TOC entry 248 (class 1255 OID 327765)
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
-- TOC entry 267 (class 1255 OID 278691)
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
-- TOC entry 268 (class 1255 OID 278692)
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
-- TOC entry 247 (class 1255 OID 311398)
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
-- TOC entry 215 (class 1259 OID 24798)
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
-- TOC entry 3779 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN users_sync.raw_json; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.raw_json IS 'Complete JSON data from the authentication provider';


--
-- TOC entry 3780 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN users_sync.id; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.id IS 'Unique identifier from the authentication provider';


--
-- TOC entry 3781 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN users_sync.name; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.name IS 'User''s full name from authentication provider';


--
-- TOC entry 3782 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN users_sync.email; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.email IS 'User''s email address from authentication provider';


--
-- TOC entry 3783 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN users_sync.created_at; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.created_at IS 'Timestamp when the user was created in the auth system';


--
-- TOC entry 3784 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN users_sync.updated_at; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.updated_at IS 'Timestamp when the user was last updated in the auth system';


--
-- TOC entry 3785 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN users_sync.deleted_at; Type: COMMENT; Schema: neon_auth; Owner: -
--

COMMENT ON COLUMN neon_auth.users_sync.deleted_at IS 'Timestamp when the user was deleted in the auth system';


--
-- TOC entry 219 (class 1259 OID 278699)
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
-- TOC entry 3786 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN adjustment_rules.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.id IS 'Unique identifier for the adjustment rule';


--
-- TOC entry 3787 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN adjustment_rules.cycle_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.cycle_id IS 'Reference to the payroll cycle this rule applies to';


--
-- TOC entry 3788 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN adjustment_rules.date_type_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.date_type_id IS 'Reference to the payroll date type this rule affects';


--
-- TOC entry 3789 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN adjustment_rules.rule_description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.rule_description IS 'Human-readable description of the adjustment rule';


--
-- TOC entry 3790 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN adjustment_rules.rule_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.rule_code IS 'Code/formula used to calculate date adjustments';


--
-- TOC entry 3791 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN adjustment_rules.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.created_at IS 'Timestamp when the rule was created';


--
-- TOC entry 3792 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN adjustment_rules.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.adjustment_rules.updated_at IS 'Timestamp when the rule was last updated';


--
-- TOC entry 220 (class 1259 OID 278707)
-- Name: app_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_settings (
    id text NOT NULL,
    permissions jsonb
);


--
-- TOC entry 3793 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN app_settings.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.app_settings.id IS 'Unique identifier for application setting';


--
-- TOC entry 3794 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN app_settings.permissions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.app_settings.permissions IS 'JSON structure containing application permission configurations';


--
-- TOC entry 246 (class 1259 OID 327746)
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
-- TOC entry 244 (class 1259 OID 327710)
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
-- TOC entry 245 (class 1259 OID 327729)
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
-- TOC entry 240 (class 1259 OID 319488)
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
-- TOC entry 241 (class 1259 OID 319507)
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
-- TOC entry 242 (class 1259 OID 327680)
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
-- TOC entry 243 (class 1259 OID 327691)
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
-- TOC entry 221 (class 1259 OID 278712)
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
-- TOC entry 3795 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN client_external_systems.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.id IS 'Unique identifier for the client-system mapping';


--
-- TOC entry 3796 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN client_external_systems.client_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.client_id IS 'Reference to the client';


--
-- TOC entry 3797 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN client_external_systems.system_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.system_id IS 'Reference to the external system';


--
-- TOC entry 3798 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN client_external_systems.system_client_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.system_client_id IS 'Client identifier in the external system';


--
-- TOC entry 3799 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN client_external_systems.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.created_at IS 'Timestamp when the mapping was created';


--
-- TOC entry 3800 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN client_external_systems.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.client_external_systems.updated_at IS 'Timestamp when the mapping was last updated';


--
-- TOC entry 222 (class 1259 OID 278718)
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
-- TOC entry 3801 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN clients.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.id IS 'Unique identifier for the client';


--
-- TOC entry 3802 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN clients.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.name IS 'Client company name';


--
-- TOC entry 3803 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN clients.contact_person; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.contact_person IS 'Primary contact person at the client';


--
-- TOC entry 3804 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN clients.contact_email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.contact_email IS 'Email address for the client contact';


--
-- TOC entry 3805 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN clients.contact_phone; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.contact_phone IS 'Phone number for the client contact';


--
-- TOC entry 3806 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN clients.active; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.active IS 'Whether the client is currently active';


--
-- TOC entry 3807 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN clients.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.created_at IS 'Timestamp when the client was created';


--
-- TOC entry 3808 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN clients.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.clients.updated_at IS 'Timestamp when the client was last updated';


--
-- TOC entry 223 (class 1259 OID 278727)
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
-- TOC entry 3809 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN external_systems.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.id IS 'Unique identifier for the external system';


--
-- TOC entry 3810 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN external_systems.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.name IS 'Name of the external system';


--
-- TOC entry 3811 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN external_systems.url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.url IS 'URL endpoint for the external system';


--
-- TOC entry 3812 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN external_systems.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.description IS 'Description of the external system and its purpose';


--
-- TOC entry 3813 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN external_systems.icon; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.icon IS 'Path or reference to the system icon';


--
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN external_systems.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.created_at IS 'Timestamp when the system was created';


--
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN external_systems.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.external_systems.updated_at IS 'Timestamp when the system was last updated';


--
-- TOC entry 224 (class 1259 OID 278735)
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
-- TOC entry 3816 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN feature_flags.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.id IS 'Unique identifier for the feature flag';


--
-- TOC entry 3817 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN feature_flags.feature_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.feature_name IS 'Name of the feature controlled by this flag';


--
-- TOC entry 3818 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN feature_flags.is_enabled; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.is_enabled IS 'Whether the feature is currently enabled';


--
-- TOC entry 3819 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN feature_flags.allowed_roles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.allowed_roles IS 'JSON array of roles that can access this feature';


--
-- TOC entry 3820 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN feature_flags.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.feature_flags.updated_at IS 'Timestamp when the feature flag was last updated';


--
-- TOC entry 225 (class 1259 OID 278744)
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
-- TOC entry 3821 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.id IS 'Unique identifier for the holiday';


--
-- TOC entry 3822 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.date IS 'Date of the holiday';


--
-- TOC entry 3823 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.local_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.local_name IS 'Name of the holiday in local language';


--
-- TOC entry 3824 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.name IS 'Name of the holiday in English';


--
-- TOC entry 3825 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.country_code; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.country_code IS 'ISO country code where the holiday is observed';


--
-- TOC entry 3826 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.region; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.region IS 'Array of regions within the country where the holiday applies';


--
-- TOC entry 3827 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.is_fixed; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.is_fixed IS 'Whether the holiday occurs on the same date each year';


--
-- TOC entry 3828 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.is_global; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.is_global IS 'Whether the holiday is observed globally';


--
-- TOC entry 3829 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.launch_year; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.launch_year IS 'First year when the holiday was observed';


--
-- TOC entry 3830 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.types IS 'Array of holiday types (e.g., public, bank, religious)';


--
-- TOC entry 3831 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.created_at IS 'Timestamp when the holiday record was created';


--
-- TOC entry 3832 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN holidays.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.holidays.updated_at IS 'Timestamp when the holiday record was last updated';


--
-- TOC entry 226 (class 1259 OID 278754)
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
-- TOC entry 3833 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN leave.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.id IS 'Unique identifier for the leave record';


--
-- TOC entry 3834 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN leave.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.user_id IS 'Reference to the user taking leave';


--
-- TOC entry 3835 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN leave.start_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.start_date IS 'First day of the leave period';


--
-- TOC entry 3836 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN leave.end_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.end_date IS 'Last day of the leave period';


--
-- TOC entry 3837 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN leave.leave_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.leave_type IS 'Type of leave (vacation, sick, personal, etc.)';


--
-- TOC entry 3838 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN leave.reason; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.reason IS 'Reason provided for the leave request';


--
-- TOC entry 3839 (class 0 OID 0)
-- Dependencies: 226
-- Name: COLUMN leave.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.leave.status IS 'Current status of the leave request (Pending, Approved, Denied)';


--
-- TOC entry 227 (class 1259 OID 278763)
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
-- TOC entry 3840 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN notes.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.id IS 'Unique identifier for the note';


--
-- TOC entry 3841 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN notes.entity_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.entity_type IS 'Type of entity this note is attached to (client, payroll, etc.)';


--
-- TOC entry 3842 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN notes.entity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.entity_id IS 'Identifier of the entity this note is attached to';


--
-- TOC entry 3843 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN notes.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.user_id IS 'User who created the note';


--
-- TOC entry 3844 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN notes.content; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.content IS 'Content of the note';


--
-- TOC entry 3845 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN notes.is_important; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.is_important IS 'Whether the note is flagged as important';


--
-- TOC entry 3846 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN notes.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.created_at IS 'Timestamp when the note was created';


--
-- TOC entry 3847 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN notes.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.notes.updated_at IS 'Timestamp when the note was last updated';


--
-- TOC entry 228 (class 1259 OID 278773)
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
-- TOC entry 3848 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN payroll_cycles.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.id IS 'Unique identifier for the payroll cycle';


--
-- TOC entry 3849 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN payroll_cycles.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.name IS 'Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.)';


--
-- TOC entry 3850 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN payroll_cycles.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.description IS 'Detailed description of the payroll cycle';


--
-- TOC entry 3851 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN payroll_cycles.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.created_at IS 'Timestamp when the cycle was created';


--
-- TOC entry 3852 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN payroll_cycles.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_cycles.updated_at IS 'Timestamp when the cycle was last updated';


--
-- TOC entry 229 (class 1259 OID 278781)
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
-- TOC entry 3853 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN payroll_date_types.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.id IS 'Unique identifier for the payroll date type';


--
-- TOC entry 3854 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN payroll_date_types.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.name IS 'Name of the date type (Fixed, Last Working Day, etc.)';


--
-- TOC entry 3855 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN payroll_date_types.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.description IS 'Detailed description of how this date type works';


--
-- TOC entry 3856 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN payroll_date_types.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.created_at IS 'Timestamp when the date type was created';


--
-- TOC entry 3857 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN payroll_date_types.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payroll_date_types.updated_at IS 'Timestamp when the date type was last updated';


--
-- TOC entry 230 (class 1259 OID 278789)
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
    CONSTRAINT check_positive_values CHECK (((processing_days_before_eft >= 0) AND (processing_time >= 0) AND ((employee_count IS NULL) OR (employee_count >= 0))))
);


--
-- TOC entry 3858 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.id IS 'Unique identifier for the payroll';


--
-- TOC entry 3859 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.client_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.client_id IS 'Reference to the client this payroll belongs to';


--
-- TOC entry 3860 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.name IS 'Name of the payroll';


--
-- TOC entry 3861 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.cycle_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.cycle_id IS 'Reference to the payroll cycle';


--
-- TOC entry 3862 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.date_type_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.date_type_id IS 'Reference to the payroll date type';


--
-- TOC entry 3863 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.date_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.date_value IS 'Specific value for date calculation (e.g., day of month)';


--
-- TOC entry 3864 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.primary_consultant_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.primary_consultant_user_id IS 'Primary consultant responsible for this payroll';


--
-- TOC entry 3865 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.backup_consultant_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.backup_consultant_user_id IS 'Backup consultant for this payroll';


--
-- TOC entry 3866 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.manager_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.manager_user_id IS 'Manager overseeing this payroll';


--
-- TOC entry 3867 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.processing_days_before_eft; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.processing_days_before_eft IS 'Number of days before EFT that processing must complete';


--
-- TOC entry 3868 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.created_at IS 'Timestamp when the payroll was created';


--
-- TOC entry 3869 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.updated_at IS 'Timestamp when the payroll was last updated';


--
-- TOC entry 3870 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.payroll_system; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.payroll_system IS 'External payroll system used for this client';


--
-- TOC entry 3871 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.status IS 'Current status of the payroll (Implementation, Active, Inactive)';


--
-- TOC entry 3872 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.processing_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.processing_time IS 'Number of hours required to process this payroll';


--
-- TOC entry 3873 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.employee_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.employee_count IS 'Number of employees in this payroll';


--
-- TOC entry 3874 (class 0 OID 0)
-- Dependencies: 230
-- Name: COLUMN payrolls.go_live_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payrolls.go_live_date IS 'The date when the payroll went live in the system';


--
-- TOC entry 234 (class 1259 OID 279030)
-- Name: permission_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permission_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    target_user_id uuid,
    target_role public.user_role,
    resource text NOT NULL,
    operation text NOT NULL,
    action text NOT NULL,
    previous_value jsonb,
    new_value jsonb,
    reason text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 3875 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.id IS 'Unique identifier for the audit log entry';


--
-- TOC entry 3876 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.user_id IS 'User who performed the action';


--
-- TOC entry 3877 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.target_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.target_user_id IS 'User affected by the permission change';


--
-- TOC entry 3878 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.target_role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.target_role IS 'Role affected by the permission change';


--
-- TOC entry 3879 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.resource; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.resource IS 'Resource that was accessed or modified';


--
-- TOC entry 3880 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.operation; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.operation IS 'Type of operation performed (create, read, update, delete)';


--
-- TOC entry 3881 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.action; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.action IS 'Specific action taken on the resource';


--
-- TOC entry 3882 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.previous_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.previous_value IS 'Previous state before the change';


--
-- TOC entry 3883 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.new_value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.new_value IS 'New state after the change';


--
-- TOC entry 3884 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.reason; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.reason IS 'Reason provided for the permission change';


--
-- TOC entry 3885 (class 0 OID 0)
-- Dependencies: 234
-- Name: COLUMN permission_audit_log.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_audit_log.created_at IS 'Timestamp when the audit log entry was created';


--
-- TOC entry 233 (class 1259 OID 279001)
-- Name: permission_overrides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permission_overrides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    role public.user_role,
    resource text NOT NULL,
    operation text NOT NULL,
    granted boolean NOT NULL,
    conditions jsonb,
    created_at timestamp without time zone DEFAULT now(),
    created_by uuid,
    expires_at timestamp without time zone,
    CONSTRAINT check_user_or_role CHECK ((((user_id IS NOT NULL) AND (role IS NULL)) OR ((user_id IS NULL) AND (role IS NOT NULL)))),
    CONSTRAINT check_valid_operation CHECK ((operation = ANY (ARRAY['create'::text, 'read'::text, 'update'::text, 'delete'::text])))
);


--
-- TOC entry 3886 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.id IS 'Unique identifier for the permission override';


--
-- TOC entry 3887 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.user_id IS 'User receiving the permission override';


--
-- TOC entry 3888 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.role IS 'Role this override applies to';


--
-- TOC entry 3889 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.resource; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.resource IS 'Resource affected by this override';


--
-- TOC entry 3890 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.operation; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.operation IS 'Operation being permitted or restricted';


--
-- TOC entry 3891 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.granted; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.granted IS 'Whether the permission is granted (true) or denied (false)';


--
-- TOC entry 3892 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.conditions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.conditions IS 'JSON with additional conditions for the override';


--
-- TOC entry 3893 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.created_at IS 'Timestamp when the override was created';


--
-- TOC entry 3894 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.created_by; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.created_by IS 'User who created this override';


--
-- TOC entry 3895 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN permission_overrides.expires_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.permission_overrides.expires_at IS 'Timestamp when this override expires';


--
-- TOC entry 237 (class 1259 OID 311339)
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
-- TOC entry 236 (class 1259 OID 311327)
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
-- TOC entry 238 (class 1259 OID 311356)
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
-- TOC entry 235 (class 1259 OID 311313)
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
-- TOC entry 239 (class 1259 OID 311378)
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
-- TOC entry 231 (class 1259 OID 278813)
-- Name: users; Type: TABLE; Schema: public; Owner: -
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


--
-- TOC entry 3896 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.id IS 'Unique identifier for the user';


--
-- TOC entry 3897 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.name IS 'User''s full name';


--
-- TOC entry 3898 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.email IS 'User''s email address (unique)';


--
-- TOC entry 3899 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.role IS 'User''s system role (viewer, consultant, manager, org_admin)';


--
-- TOC entry 3900 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.created_at IS 'Timestamp when the user was created';


--
-- TOC entry 3901 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.updated_at IS 'Timestamp when the user was last updated';


--
-- TOC entry 3902 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.username; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.username IS 'User''s unique username for login';


--
-- TOC entry 3903 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.image; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.image IS 'URL to the user''s profile image';


--
-- TOC entry 3904 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.is_staff; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.is_staff IS 'Whether the user is a staff member (vs. external user)';


--
-- TOC entry 3905 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.manager_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.manager_id IS 'Reference to the user''s manager';


--
-- TOC entry 3906 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN users.clerk_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.clerk_user_id IS 'External identifier from Clerk authentication service';


--
-- TOC entry 232 (class 1259 OID 278828)
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
-- TOC entry 3907 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN work_schedule.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.id IS 'Unique identifier for the work schedule entry';


--
-- TOC entry 3908 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN work_schedule.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.user_id IS 'Reference to the user this schedule belongs to';


--
-- TOC entry 3909 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN work_schedule.work_day; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.work_day IS 'Day of the week (Monday, Tuesday, etc.)';


--
-- TOC entry 3910 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN work_schedule.work_hours; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.work_hours IS 'Number of hours worked on this day';


--
-- TOC entry 3911 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN work_schedule.created_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.created_at IS 'Timestamp when the schedule entry was created';


--
-- TOC entry 3912 (class 0 OID 0)
-- Dependencies: 232
-- Name: COLUMN work_schedule.updated_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.work_schedule.updated_at IS 'Timestamp when the schedule entry was last updated';


--
-- TOC entry 3453 (class 2606 OID 24808)
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- TOC entry 3463 (class 2606 OID 278840)
-- Name: adjustment_rules adjustment_rules_cycle_id_date_type_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_date_type_id_key UNIQUE (cycle_id, date_type_id);


--
-- TOC entry 3465 (class 2606 OID 278842)
-- Name: adjustment_rules adjustment_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 3467 (class 2606 OID 278844)
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3578 (class 2606 OID 327754)
-- Name: billing_event_log billing_event_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3576 (class 2606 OID 327740)
-- Name: billing_invoice_item billing_invoice_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_pkey PRIMARY KEY (id);


--
-- TOC entry 3574 (class 2606 OID 327723)
-- Name: billing_invoice billing_invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_pkey PRIMARY KEY (id);


--
-- TOC entry 3564 (class 2606 OID 319501)
-- Name: billing_invoices billing_invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_invoice_number_key UNIQUE (invoice_number);


--
-- TOC entry 3566 (class 2606 OID 319499)
-- Name: billing_invoices billing_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_pkey PRIMARY KEY (id);


--
-- TOC entry 3568 (class 2606 OID 319517)
-- Name: billing_items billing_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3570 (class 2606 OID 327690)
-- Name: billing_plan billing_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_plan
    ADD CONSTRAINT billing_plan_pkey PRIMARY KEY (id);


--
-- TOC entry 3572 (class 2606 OID 327699)
-- Name: client_billing_assignment client_billing_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_pkey PRIMARY KEY (id);


--
-- TOC entry 3469 (class 2606 OID 278846)
-- Name: client_external_systems client_external_systems_client_id_system_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_system_id_key UNIQUE (client_id, system_id);


--
-- TOC entry 3471 (class 2606 OID 278848)
-- Name: client_external_systems client_external_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_pkey PRIMARY KEY (id);


--
-- TOC entry 3473 (class 2606 OID 278850)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 3475 (class 2606 OID 278852)
-- Name: external_systems external_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.external_systems
    ADD CONSTRAINT external_systems_pkey PRIMARY KEY (id);


--
-- TOC entry 3477 (class 2606 OID 278854)
-- Name: feature_flags feature_flags_feature_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_feature_name_key UNIQUE (feature_name);


--
-- TOC entry 3479 (class 2606 OID 278856)
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- TOC entry 3481 (class 2606 OID 278858)
-- Name: holidays holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);


--
-- TOC entry 3486 (class 2606 OID 278860)
-- Name: leave leave_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave
    ADD CONSTRAINT leave_pkey PRIMARY KEY (id);


--
-- TOC entry 3491 (class 2606 OID 278862)
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3493 (class 2606 OID 278864)
-- Name: payroll_cycles payroll_cycles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_cycles
    ADD CONSTRAINT payroll_cycles_name_key UNIQUE (name);


--
-- TOC entry 3495 (class 2606 OID 278866)
-- Name: payroll_cycles payroll_cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_cycles
    ADD CONSTRAINT payroll_cycles_pkey PRIMARY KEY (id);


--
-- TOC entry 3497 (class 2606 OID 278868)
-- Name: payroll_date_types payroll_date_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_date_types
    ADD CONSTRAINT payroll_date_types_name_key UNIQUE (name);


--
-- TOC entry 3499 (class 2606 OID 278870)
-- Name: payroll_date_types payroll_date_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_date_types
    ADD CONSTRAINT payroll_date_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3461 (class 2606 OID 278872)
-- Name: payroll_dates payroll_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_pkey PRIMARY KEY (id);


--
-- TOC entry 3507 (class 2606 OID 278874)
-- Name: payrolls payrolls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_pkey PRIMARY KEY (id);


--
-- TOC entry 3542 (class 2606 OID 279038)
-- Name: permission_audit_log permission_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3531 (class 2606 OID 279011)
-- Name: permission_overrides permission_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_pkey PRIMARY KEY (id);


--
-- TOC entry 3552 (class 2606 OID 311348)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3554 (class 2606 OID 311350)
-- Name: permissions permissions_resource_id_action_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_action_key UNIQUE (resource_id, action);


--
-- TOC entry 3548 (class 2606 OID 311338)
-- Name: resources resources_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_name_key UNIQUE (name);


--
-- TOC entry 3550 (class 2606 OID 311336)
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- TOC entry 3556 (class 2606 OID 311365)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3558 (class 2606 OID 311367)
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- TOC entry 3544 (class 2606 OID 311326)
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 3546 (class 2606 OID 311324)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3533 (class 2606 OID 279015)
-- Name: permission_overrides unique_role_resource_operation; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT unique_role_resource_operation UNIQUE NULLS NOT DISTINCT (role, resource, operation);


--
-- TOC entry 3535 (class 2606 OID 279013)
-- Name: permission_overrides unique_user_resource_operation; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT unique_user_resource_operation UNIQUE NULLS NOT DISTINCT (user_id, resource, operation);


--
-- TOC entry 3522 (class 2606 OID 278880)
-- Name: work_schedule unique_user_work_day; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT unique_user_work_day UNIQUE (user_id, work_day);


--
-- TOC entry 3560 (class 2606 OID 311385)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3562 (class 2606 OID 311387)
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- TOC entry 3513 (class 2606 OID 278882)
-- Name: users users_clerk_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_clerk_user_id_key UNIQUE (clerk_user_id);


--
-- TOC entry 3515 (class 2606 OID 278884)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3517 (class 2606 OID 278886)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3519 (class 2606 OID 278888)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 3524 (class 2606 OID 278892)
-- Name: work_schedule work_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT work_schedule_pkey PRIMARY KEY (id);


--
-- TOC entry 3451 (class 1259 OID 24809)
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


--
-- TOC entry 3482 (class 1259 OID 278893)
-- Name: idx_holidays_date_country_region; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_holidays_date_country_region ON public.holidays USING btree (date, country_code, region);


--
-- TOC entry 3483 (class 1259 OID 278995)
-- Name: idx_leave_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leave_dates ON public.leave USING btree (start_date, end_date);


--
-- TOC entry 3484 (class 1259 OID 278994)
-- Name: idx_leave_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leave_user_id ON public.leave USING btree (user_id);


--
-- TOC entry 3487 (class 1259 OID 278997)
-- Name: idx_notes_entity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notes_entity ON public.notes USING btree (entity_type, entity_id);


--
-- TOC entry 3488 (class 1259 OID 278999)
-- Name: idx_notes_important; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notes_important ON public.notes USING btree (is_important) WHERE (is_important = true);


--
-- TOC entry 3489 (class 1259 OID 278998)
-- Name: idx_notes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notes_user_id ON public.notes USING btree (user_id);


--
-- TOC entry 3454 (class 1259 OID 278894)
-- Name: idx_payroll_dates_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_composite ON public.payroll_dates USING btree (payroll_id, adjusted_eft_date, processing_date);


--
-- TOC entry 3455 (class 1259 OID 278895)
-- Name: idx_payroll_dates_date_range; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_date_range ON public.payroll_dates USING btree (adjusted_eft_date);


--
-- TOC entry 3456 (class 1259 OID 278896)
-- Name: idx_payroll_dates_notes; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_notes ON public.payroll_dates USING gin (to_tsvector('english'::regconfig, notes));


--
-- TOC entry 3457 (class 1259 OID 278897)
-- Name: idx_payroll_dates_payroll_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_payroll_id ON public.payroll_dates USING btree (payroll_id);


--
-- TOC entry 3458 (class 1259 OID 278898)
-- Name: idx_payroll_dates_processing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payroll_dates_processing ON public.payroll_dates USING btree (processing_date);


--
-- TOC entry 3500 (class 1259 OID 278899)
-- Name: idx_payrolls_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_client_id ON public.payrolls USING btree (client_id);


--
-- TOC entry 3501 (class 1259 OID 278900)
-- Name: idx_payrolls_consultant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_consultant ON public.payrolls USING btree (primary_consultant_user_id);


--
-- TOC entry 3502 (class 1259 OID 294912)
-- Name: idx_payrolls_go_live_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_go_live_date ON public.payrolls USING btree (go_live_date);


--
-- TOC entry 3503 (class 1259 OID 278901)
-- Name: idx_payrolls_manager; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_manager ON public.payrolls USING btree (manager_user_id);


--
-- TOC entry 3504 (class 1259 OID 279056)
-- Name: idx_payrolls_staff_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_staff_composite ON public.payrolls USING btree (primary_consultant_user_id, backup_consultant_user_id, manager_user_id);


--
-- TOC entry 3505 (class 1259 OID 279057)
-- Name: idx_payrolls_status_client; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payrolls_status_client ON public.payrolls USING btree (status, client_id) WHERE (status <> 'Inactive'::public.payroll_status);


--
-- TOC entry 3536 (class 1259 OID 279051)
-- Name: idx_permission_audit_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_created ON public.permission_audit_log USING btree (created_at);


--
-- TOC entry 3537 (class 1259 OID 279053)
-- Name: idx_permission_audit_log_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_log_action ON public.permission_audit_log USING btree (action);


--
-- TOC entry 3538 (class 1259 OID 279054)
-- Name: idx_permission_audit_log_resource; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_log_resource ON public.permission_audit_log USING btree (resource);


--
-- TOC entry 3539 (class 1259 OID 279050)
-- Name: idx_permission_audit_target_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_target_user ON public.permission_audit_log USING btree (target_user_id);


--
-- TOC entry 3540 (class 1259 OID 279049)
-- Name: idx_permission_audit_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_audit_user ON public.permission_audit_log USING btree (user_id);


--
-- TOC entry 3525 (class 1259 OID 279052)
-- Name: idx_permission_overrides_created_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_created_by ON public.permission_overrides USING btree (created_by);


--
-- TOC entry 3526 (class 1259 OID 279029)
-- Name: idx_permission_overrides_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_expires ON public.permission_overrides USING btree (expires_at) WHERE (expires_at IS NOT NULL);


--
-- TOC entry 3527 (class 1259 OID 279028)
-- Name: idx_permission_overrides_resource; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_resource ON public.permission_overrides USING btree (resource);


--
-- TOC entry 3528 (class 1259 OID 279027)
-- Name: idx_permission_overrides_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_role ON public.permission_overrides USING btree (role);


--
-- TOC entry 3529 (class 1259 OID 279026)
-- Name: idx_permission_overrides_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permission_overrides_user ON public.permission_overrides USING btree (user_id);


--
-- TOC entry 3459 (class 1259 OID 278904)
-- Name: idx_unique_payroll_date; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_unique_payroll_date ON public.payroll_dates USING btree (payroll_id, original_eft_date);


--
-- TOC entry 3508 (class 1259 OID 279055)
-- Name: idx_users_clerk_composite; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_clerk_composite ON public.users USING btree (clerk_user_id, role, is_staff);


--
-- TOC entry 3509 (class 1259 OID 344066)
-- Name: idx_users_deactivated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_deactivated_at ON public.users USING btree (deactivated_at) WHERE (deactivated_at IS NOT NULL);


--
-- TOC entry 3510 (class 1259 OID 344065)
-- Name: idx_users_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);


--
-- TOC entry 3511 (class 1259 OID 278905)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 3520 (class 1259 OID 279000)
-- Name: idx_work_schedule_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_work_schedule_user_id ON public.work_schedule USING btree (user_id);


--
-- TOC entry 3613 (class 2620 OID 278906)
-- Name: notes check_entity_relation; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER check_entity_relation BEFORE INSERT OR UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.enforce_entity_relation();


--
-- TOC entry 3614 (class 2620 OID 278907)
-- Name: payrolls enforce_staff_on_payrolls; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER enforce_staff_on_payrolls BEFORE INSERT OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.enforce_staff_roles();


--
-- TOC entry 3622 (class 2620 OID 327766)
-- Name: billing_invoice_item trg_invoice_item_total; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_invoice_item_total AFTER INSERT OR DELETE OR UPDATE ON public.billing_invoice_item FOR EACH ROW EXECUTE FUNCTION public.update_invoice_total();


--
-- TOC entry 3616 (class 2620 OID 278908)
-- Name: work_schedule trigger_prevent_duplicate_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_prevent_duplicate_insert BEFORE INSERT ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_workday_insert();


--
-- TOC entry 3612 (class 2620 OID 278909)
-- Name: feature_flags update_feature_flags_modtime; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_feature_flags_modtime BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- TOC entry 3615 (class 2620 OID 278910)
-- Name: payrolls update_payroll_dates_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_payroll_dates_trigger AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.update_payroll_dates();


--
-- TOC entry 3619 (class 2620 OID 311401)
-- Name: permissions update_permissions_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_permissions_timestamp BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 3618 (class 2620 OID 311400)
-- Name: resources update_resources_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_resources_timestamp BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 3620 (class 2620 OID 311402)
-- Name: role_permissions update_role_permissions_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_role_permissions_timestamp BEFORE UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 3617 (class 2620 OID 311399)
-- Name: roles update_roles_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_roles_timestamp BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 3621 (class 2620 OID 311403)
-- Name: user_roles update_user_roles_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_roles_timestamp BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 3580 (class 2606 OID 278911)
-- Name: adjustment_rules adjustment_rules_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.payroll_cycles(id) ON DELETE CASCADE;


--
-- TOC entry 3581 (class 2606 OID 278916)
-- Name: adjustment_rules adjustment_rules_date_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES public.payroll_date_types(id) ON DELETE CASCADE;


--
-- TOC entry 3610 (class 2606 OID 327760)
-- Name: billing_event_log billing_event_log_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 3611 (class 2606 OID 327755)
-- Name: billing_event_log billing_event_log_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoice(id) ON DELETE CASCADE;


--
-- TOC entry 3608 (class 2606 OID 327724)
-- Name: billing_invoice billing_invoice_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- TOC entry 3609 (class 2606 OID 327741)
-- Name: billing_invoice_item billing_invoice_item_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoice(id) ON DELETE CASCADE;


--
-- TOC entry 3603 (class 2606 OID 319502)
-- Name: billing_invoices billing_invoices_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- TOC entry 3604 (class 2606 OID 319518)
-- Name: billing_items billing_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoices(id) ON DELETE CASCADE;


--
-- TOC entry 3605 (class 2606 OID 319523)
-- Name: billing_items billing_items_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON DELETE SET NULL;


--
-- TOC entry 3606 (class 2606 OID 327705)
-- Name: client_billing_assignment client_billing_assignment_billing_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_billing_plan_id_fkey FOREIGN KEY (billing_plan_id) REFERENCES public.billing_plan(id) ON DELETE RESTRICT;


--
-- TOC entry 3607 (class 2606 OID 327700)
-- Name: client_billing_assignment client_billing_assignment_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- TOC entry 3582 (class 2606 OID 278921)
-- Name: client_external_systems client_external_systems_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- TOC entry 3583 (class 2606 OID 278926)
-- Name: client_external_systems client_external_systems_system_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_system_id_fkey FOREIGN KEY (system_id) REFERENCES public.external_systems(id) ON DELETE CASCADE;


--
-- TOC entry 3586 (class 2606 OID 278931)
-- Name: payrolls fk_backup_consultant_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_backup_consultant_user FOREIGN KEY (backup_consultant_user_id) REFERENCES public.users(id);


--
-- TOC entry 3584 (class 2606 OID 278936)
-- Name: leave fk_leave_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave
    ADD CONSTRAINT fk_leave_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3587 (class 2606 OID 278941)
-- Name: payrolls fk_manager_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_manager_user FOREIGN KEY (manager_user_id) REFERENCES public.users(id);


--
-- TOC entry 3588 (class 2606 OID 278946)
-- Name: payrolls fk_primary_consultant_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_primary_consultant_user FOREIGN KEY (primary_consultant_user_id) REFERENCES public.users(id);


--
-- TOC entry 3593 (class 2606 OID 278951)
-- Name: work_schedule fk_work_schedule_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT fk_work_schedule_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3592 (class 2606 OID 278961)
-- Name: users manager_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT manager_id FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3585 (class 2606 OID 278966)
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3579 (class 2606 OID 278971)
-- Name: payroll_dates payroll_dates_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3589 (class 2606 OID 278976)
-- Name: payrolls payrolls_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- TOC entry 3590 (class 2606 OID 278981)
-- Name: payrolls payrolls_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.payroll_cycles(id) ON DELETE RESTRICT;


--
-- TOC entry 3591 (class 2606 OID 278986)
-- Name: payrolls payrolls_date_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES public.payroll_date_types(id) ON DELETE RESTRICT;


--
-- TOC entry 3596 (class 2606 OID 279044)
-- Name: permission_audit_log permission_audit_log_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3597 (class 2606 OID 279039)
-- Name: permission_audit_log permission_audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3594 (class 2606 OID 279021)
-- Name: permission_overrides permission_overrides_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3595 (class 2606 OID 279016)
-- Name: permission_overrides permission_overrides_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3598 (class 2606 OID 311351)
-- Name: permissions permissions_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- TOC entry 3599 (class 2606 OID 311373)
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- TOC entry 3600 (class 2606 OID 311368)
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 3601 (class 2606 OID 311393)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 3602 (class 2606 OID 311388)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-05-31 17:38:22 AEST

--
-- PostgreSQL database dump complete
--


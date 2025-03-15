--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12
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
    'manager',
    'consultant',
    'viewer'
);


ALTER TYPE public.user_role OWNER TO neondb_owner;

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
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payroll_dates OWNER TO neondb_owner;

--
-- Name: generate_payroll_dates(uuid, date, date); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.generate_payroll_dates(p_payroll_id uuid, p_start_date date, p_end_date date) RETURNS SETOF public.payroll_dates
    LANGUAGE plpgsql
    AS $$
DECLARE
  -- Payroll configuration variables
  v_cycle_name TEXT;
  v_date_type_name TEXT;
  v_date_value INTEGER;
  v_processing_days_before_eft INTEGER;
  v_rule_code TEXT;
  
  -- Date calculation variables
  v_current_date DATE := p_start_date;
  v_original_eft_date DATE;
  v_adjusted_eft_date DATE;
  v_processing_date DATE;
  v_next_date DATE;
  
  -- Tracking variables
  v_dates_generated INTEGER := 0;
  v_max_dates INTEGER;
  v_existing_date RECORD;
  v_special_rule_code TEXT;

  -- Helper variables
  v_week_of_year INTEGER;
  v_is_week_a BOOLEAN;
  v_mid_month_date DATE;
  v_end_month_date DATE;
  v_month INTEGER;
  v_year INTEGER;
BEGIN
  -- Retrieve payroll configuration
  SELECT 
    pc.name, 
    pdt.name, 
    p.date_value, 
    p.processing_days_before_eft, 
    COALESCE(ar.rule_code, 'previous')
  INTO v_cycle_name, v_date_type_name, v_date_value, v_processing_days_before_eft, v_rule_code
  FROM payrolls p
  JOIN payroll_cycles pc ON p.cycle_id = pc.id
  JOIN payroll_date_types pdt ON p.date_type_id = pdt.id
  LEFT JOIN adjustment_rules ar ON p.cycle_id = ar.cycle_id AND p.date_type_id = ar.date_type_id
  WHERE p.id = p_payroll_id;

  -- Validate payroll exists
  IF v_cycle_name IS NULL THEN 
    RAISE EXCEPTION 'Payroll not found with ID: %', p_payroll_id;
  END IF;

  -- Determine max dates based on cycle type
  v_max_dates := CASE 
    WHEN v_cycle_name = 'weekly' THEN 52
    WHEN v_cycle_name = 'fortnightly' THEN 26
    WHEN v_cycle_name = 'monthly' THEN 12
    WHEN v_cycle_name = 'quarterly' THEN 4
    WHEN v_cycle_name = 'bi_monthly' THEN 24
    ELSE 36
  END;

  -- Main date generation loop
  WHILE v_current_date <= p_end_date AND v_dates_generated < v_max_dates LOOP
    -- Reset special rule for each iteration
    v_special_rule_code := v_rule_code;

    -- Calculate next EFT date based on cycle type
    CASE v_cycle_name
      WHEN 'weekly' THEN
        -- Ensure it falls on the correct weekday
        v_next_date := v_current_date + ((7 + v_date_value - EXTRACT(DOW FROM v_current_date)) % 7) * INTERVAL '1 day';
        IF v_next_date = v_current_date THEN 
          v_next_date := v_next_date + INTERVAL '7 days'; -- Move to next week if same day
        END IF;
        v_original_eft_date := v_next_date;

      WHEN 'fortnightly' THEN
        -- Determine if this is a Week A or Week B payroll
        v_week_of_year := EXTRACT(WEEK FROM v_current_date);
        v_is_week_a := (v_week_of_year % 2) = 1; -- Odd weeks are Week A

        -- Ensure it falls on the correct weekday
        v_original_eft_date := v_current_date + ((7 + v_date_value - EXTRACT(DOW FROM v_current_date)) % 7) * INTERVAL '1 day';

        -- If it's Week B, shift forward by 1 week
        IF NOT v_is_week_a THEN 
          v_original_eft_date := v_original_eft_date + INTERVAL '7 days';
        END IF;

      WHEN 'bi_monthly' THEN
        -- Handle February special case
        v_month := EXTRACT(MONTH FROM v_current_date);
        IF v_month = 2 THEN
          v_mid_month_date := MAKE_DATE(EXTRACT(YEAR FROM v_current_date), 2, 14);
          v_end_month_date := MAKE_DATE(EXTRACT(YEAR FROM v_current_date), 2, 28);
        ELSE
          v_mid_month_date := MAKE_DATE(EXTRACT(YEAR FROM v_current_date), v_month, 15);
          v_end_month_date := MAKE_DATE(EXTRACT(YEAR FROM v_current_date), v_month, 30);
        END IF;

        -- Adjust both dates to previous business days
        v_adjusted_eft_date := adjust_for_non_business_day(v_mid_month_date, 'previous');
        INSERT INTO payroll_dates (payroll_id, original_eft_date, adjusted_eft_date, processing_date, created_at, updated_at)
        VALUES (p_payroll_id, v_mid_month_date, v_adjusted_eft_date, subtract_business_days(v_adjusted_eft_date, v_processing_days_before_eft), NOW(), NOW());

        v_adjusted_eft_date := adjust_for_non_business_day(v_end_month_date, 'previous');
        INSERT INTO payroll_dates (payroll_id, original_eft_date, adjusted_eft_date, processing_date, created_at, updated_at)
        VALUES (p_payroll_id, v_end_month_date, v_adjusted_eft_date, subtract_business_days(v_adjusted_eft_date, v_processing_days_before_eft), NOW(), NOW());

      WHEN 'monthly', 'quarterly' THEN
        -- Ensure this only runs for quarterly months
        IF v_cycle_name = 'quarterly' THEN
          v_month := EXTRACT(MONTH FROM v_current_date);
          IF v_month NOT IN (3, 6, 9, 12) THEN
            v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month'; -- Skip to next valid quarter
            CONTINUE;
          END IF;
        END IF;

        -- Monthly EOM Payrolls
        v_original_eft_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
        v_adjusted_eft_date := adjust_for_non_business_day(v_original_eft_date, 'previous');

      ELSE
        -- Default case (fallback to monthly EOM)
        v_original_eft_date := (DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
        v_adjusted_eft_date := adjust_for_non_business_day(v_original_eft_date, 'previous');
    END CASE;

    -- Adjust EFT date for weekends and holidays
    v_adjusted_eft_date := adjust_for_non_business_day(v_original_eft_date, v_special_rule_code);

    -- Calculate processing date
    v_processing_date := subtract_business_days(v_adjusted_eft_date, v_processing_days_before_eft);

    -- Insert into payroll_dates
    INSERT INTO payroll_dates (payroll_id, original_eft_date, adjusted_eft_date, processing_date, created_at, updated_at)
    VALUES (p_payroll_id, v_original_eft_date, v_adjusted_eft_date, v_processing_date, NOW(), NOW());

    v_dates_generated := v_dates_generated + 1;
    v_current_date := v_original_eft_date + INTERVAL '1 day';
  END LOOP;

  RETURN QUERY SELECT * FROM payroll_dates WHERE payroll_id = p_payroll_id AND original_eft_date BETWEEN p_start_date AND p_end_date ORDER BY original_eft_date;

END;
$$;


ALTER FUNCTION public.generate_payroll_dates(p_payroll_id uuid, p_start_date date, p_end_date date) OWNER TO neondb_owner;

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
-- Name: update_payroll_dates_trigger(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_payroll_dates_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Only recalculate if relevant fields changed
  IF TG_OP = 'UPDATE' THEN
    IF (NEW.cycle_id = OLD.cycle_id AND
        NEW.date_type_id = OLD.date_type_id AND
        NEW.date_value IS NOT DISTINCT FROM OLD.date_value AND
        NEW.processing_days_before_eft = OLD.processing_days_before_eft AND
        NEW.status = OLD.status) THEN
      RETURN NEW;
    END IF;
  END IF;
  
  -- Generate dates for both Active and Implementation payrolls
  IF NEW.status IN ('Active', 'Implementation') THEN
    PERFORM generate_payroll_dates(
      NEW.id,
      CURRENT_DATE,
      (CURRENT_DATE + INTERVAL '1 year')::date  -- Explicitly cast to date type
    );
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_payroll_dates_trigger() OWNER TO neondb_owner;

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
-- Name: accounts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "userId" uuid NOT NULL,
    type character varying(255) NOT NULL,
    provider character varying(255) NOT NULL,
    "providerAccountId" character varying(255) NOT NULL,
    refresh_token text,
    access_token text,
    expires_at bigint,
    id_token text,
    scope text,
    session_state text,
    token_type text
);


ALTER TABLE public.accounts OWNER TO neondb_owner;

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
-- Name: leave; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.leave (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    leave_type character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'Pending'::character varying NOT NULL,
    reason text,
    CONSTRAINT leave_leave_type_check CHECK (((leave_type)::text = ANY ((ARRAY['Annual'::character varying, 'Sick'::character varying, 'Unpaid'::character varying, 'Other'::character varying])::text[]))),
    CONSTRAINT leave_status_check CHECK (((status)::text = ANY ((ARRAY['Pending'::character varying, 'Approved'::character varying, 'Rejected'::character varying])::text[])))
);


ALTER TABLE public.leave OWNER TO neondb_owner;

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
    processing_time integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.payrolls OWNER TO neondb_owner;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    expires timestamp with time zone NOT NULL,
    "sessionToken" character varying(255) NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sessions_id_seq OWNER TO neondb_owner;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


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
    password text,
    is_staff boolean DEFAULT false,
    manager_id uuid
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: verification_token; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.verification_token (
    identifier text NOT NULL,
    expires timestamp with time zone NOT NULL,
    token text NOT NULL
);


ALTER TABLE public.verification_token OWNER TO neondb_owner;

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
    CONSTRAINT work_schedule_work_day_check CHECK (((work_day)::text = ANY ((ARRAY['Monday'::character varying, 'Tuesday'::character varying, 'Wednesday'::character varying, 'Thursday'::character varying, 'Friday'::character varying, 'Saturday'::character varying, 'Sunday'::character varying])::text[]))),
    CONSTRAINT work_schedule_work_hours_check CHECK (((work_hours >= (0)::numeric) AND (work_hours <= (24)::numeric)))
);


ALTER TABLE public.work_schedule OWNER TO neondb_owner;

--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: neondb_owner
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


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
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: work_schedule unique_user_work_day; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT unique_user_work_day UNIQUE (user_id, work_day);


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
-- Name: verification_token verification_token_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.verification_token
    ADD CONSTRAINT verification_token_pkey PRIMARY KEY (identifier, token);


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
-- Name: idx_payrolls_manager; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_payrolls_manager ON public.payrolls USING btree (manager_user_id);


--
-- Name: idx_unique_payroll_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX idx_unique_payroll_date ON public.payroll_dates USING btree (payroll_id, original_eft_date);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: notes check_entity_relation; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER check_entity_relation BEFORE INSERT OR UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.enforce_entity_relation();


--
-- Name: payrolls enforce_staff_on_payrolls; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER enforce_staff_on_payrolls BEFORE INSERT OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.enforce_staff_roles();


--
-- Name: payrolls payroll_dates_update_trigger; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER payroll_dates_update_trigger AFTER INSERT OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.update_payroll_dates_trigger();


--
-- Name: work_schedule trigger_prevent_duplicate_insert; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER trigger_prevent_duplicate_insert BEFORE INSERT ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_workday_insert();


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
-- Name: leave fk_leave_user; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leave
    ADD CONSTRAINT fk_leave_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT manager_id FOREIGN KEY (id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


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


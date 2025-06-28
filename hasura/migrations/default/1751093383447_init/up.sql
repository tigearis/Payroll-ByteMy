SET check_function_bodies = false;
CREATE TYPE public.invitation_status_enum AS ENUM (
    'pending',
    'accepted',
    'expired',
    'revoked',
    'cancelled'
);
CREATE TYPE public.leave_status_enum AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);
CREATE TYPE public.payroll_cycle_type AS ENUM (
    'weekly',
    'fortnightly',
    'bi_monthly',
    'monthly',
    'quarterly'
);
CREATE TYPE public.payroll_date_result AS (
	success boolean,
	message text
);
CREATE TYPE public.payroll_date_type AS ENUM (
    'fixed_date',
    'eom',
    'som',
    'week_a',
    'week_b',
    'dow'
);
CREATE TYPE public.payroll_dates_result AS (
	payroll_id uuid,
	original_eft_date date,
	adjusted_eft_date date,
	processing_date date,
	success boolean,
	message text
);
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
CREATE TYPE public.payroll_status_new AS ENUM (
    'live',
    'inactive',
    'onboarding',
    'possible',
    'implementation'
);
CREATE TYPE public.payroll_version_reason AS ENUM (
    'initial_creation',
    'schedule_change',
    'consultant_change',
    'client_change',
    'correction',
    'annual_review'
);
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
CREATE TYPE public.status AS ENUM (
    'active',
    'inactive',
    'archived'
);
CREATE TYPE public.user_role AS ENUM (
    'developer',
    'org_admin',
    'manager',
    'consultant',
    'viewer'
);
CREATE TYPE public.user_status_enum AS ENUM (
    'pending',
    'active',
    'inactive',
    'locked'
);
COMMENT ON TYPE public.user_status_enum IS 'User status states: pending (awaiting invitation acceptance), active (normal operation), inactive (soft deleted), locked (admin restricted)';
CREATE TABLE public.payroll_activation_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    action_taken text NOT NULL,
    version_number integer NOT NULL,
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE FUNCTION public.activate_payroll_versions() RETURNS SETOF public.payroll_activation_results
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
COMMENT ON FUNCTION public.activate_payroll_versions() IS 'Activates all draft payrolls that have reached their go-live date. No parameters required';
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
        -- Insert audit log
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
            'system',
            'database_trigger'
        );
    END IF;
    RETURN NEW;
END;
$$;
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
            changed_by_user_id = (current_setting(hasura.user, true)::json->>x-hasura-user-id)::uuid;
        EXCEPTION WHEN OTHERS THEN
            changed_by_user_id = NULL;
        END;
        -- Build audit data
        audit_data = jsonb_build_object(
            user_id, NEW.id,
            old_status, OLD.status,
            new_status, NEW.status,
            changed_by, changed_by_user_id,
            change_reason, NEW.status_change_reason,
            changed_at, NOW()
        );
        -- Insert audit log (using existing audit_log table structure)
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
            user_status_change,
            user,
            NEW.id::text,
            jsonb_build_object(status, OLD.status),
            jsonb_build_object(status, NEW.status),
            audit_data,
            NOW(),
            system,
            database_trigger
        );
    END IF;
    RETURN NEW;
END;
$$;
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
CREATE FUNCTION public.create_payroll_version_simple(payroll_id uuid, version_reason text DEFAULT 'System Update'::text) RETURNS SETOF public.payroll_version_results
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
COMMENT ON FUNCTION public.create_payroll_version_simple(payroll_id uuid, version_reason text) IS 'Creates a new version of an existing payroll (simplified). Uses camelCase parameters: payroll_id, version_reason';
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
COMMENT ON COLUMN public.payroll_dates.id IS 'Unique identifier for the payroll date';
COMMENT ON COLUMN public.payroll_dates.payroll_id IS 'Reference to the payroll this date belongs to';
COMMENT ON COLUMN public.payroll_dates.original_eft_date IS 'Originally calculated EFT date before adjustments';
COMMENT ON COLUMN public.payroll_dates.adjusted_eft_date IS 'Final EFT date after holiday and weekend adjustments';
COMMENT ON COLUMN public.payroll_dates.processing_date IS 'Date when payroll processing must be completed';
COMMENT ON COLUMN public.payroll_dates.notes IS 'Additional notes about this payroll date';
COMMENT ON COLUMN public.payroll_dates.created_at IS 'Timestamp when the date record was created';
COMMENT ON COLUMN public.payroll_dates.updated_at IS 'Timestamp when the date record was last updated';
CREATE FUNCTION public.generate_payroll_dates(p_payroll_id uuid, p_start_date date DEFAULT NULL::date, p_end_date date DEFAULT NULL::date, p_max_dates integer DEFAULT 52) RETURNS SETOF public.payroll_dates
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
    -- Adjust for business days
    SELECT adjusted_date, adjustment_reason 
    INTO v_adjusted_eft_date, v_adjustment_reason
    FROM adjust_date_with_reason(v_original_eft_date);
    -- Calculate processing date
    v_processing_date := subtract_business_days(v_adjusted_eft_date, v_processing_days);
    -- Insert the record - now no ambiguity with p_ prefixed parameters
    INSERT INTO payroll_dates (
      payroll_id, original_eft_date, adjusted_eft_date, processing_date
    ) VALUES (
      p_payroll_id, v_original_eft_date, v_adjusted_eft_date, v_processing_date
    )
    ON CONFLICT (payroll_id, original_eft_date) DO UPDATE SET
      adjusted_eft_date = EXCLUDED.adjusted_eft_date,
      processing_date = EXCLUDED.processing_date,
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
CREATE TABLE public.latest_payroll_version_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    version_number integer NOT NULL,
    go_live_date date,
    active boolean NOT NULL,
    queried_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE FUNCTION public.get_latest_payroll_version(payroll_id uuid) RETURNS SETOF public.latest_payroll_version_results
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
COMMENT ON FUNCTION public.get_latest_payroll_version(payroll_id uuid) IS 'Returns the latest active version of a payroll. Uses camelCase parameter: payroll_id';
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
CREATE FUNCTION public.get_payroll_version_history(payroll_id uuid) RETURNS SETOF public.payroll_version_history_results
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
COMMENT ON FUNCTION public.get_payroll_version_history(payroll_id uuid) IS 'Returns the complete version history of a payroll. Uses camelCase parameter: payroll_id';
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
CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
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
CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
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
CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;
CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
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
CREATE TABLE public.permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    resource_id uuid NOT NULL,
    action public.permission_action NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    legacy_permission_name character varying(100)
);
CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(50) NOT NULL,
    display_name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.role_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    conditions jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
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
CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
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
    deactivated_by text,
    status public.user_status_enum DEFAULT 'active'::public.user_status_enum NOT NULL,
    status_changed_at timestamp with time zone DEFAULT now(),
    status_changed_by uuid,
    status_change_reason text,
    CONSTRAINT users_status_isactive_consistency CHECK ((((status = 'active'::public.user_status_enum) AND (is_active = true)) OR ((status <> 'active'::public.user_status_enum) AND (is_active = false))))
);
COMMENT ON COLUMN public.users.id IS 'Unique identifier for the user';
COMMENT ON COLUMN public.users.name IS 'User''s full name';
COMMENT ON COLUMN public.users.email IS 'User''s email address (unique)';
COMMENT ON COLUMN public.users.role IS 'User''s system role (viewer, consultant, manager, org_admin)';
COMMENT ON COLUMN public.users.created_at IS 'Timestamp when the user was created';
COMMENT ON COLUMN public.users.updated_at IS 'Timestamp when the user was last updated';
COMMENT ON COLUMN public.users.username IS 'User''s unique username for login';
COMMENT ON COLUMN public.users.image IS 'URL to the user''s profile image';
COMMENT ON COLUMN public.users.is_staff IS 'Whether the user is a staff member (vs. external user)';
COMMENT ON COLUMN public.users.manager_id IS 'Reference to the user''s manager';
COMMENT ON COLUMN public.users.clerk_user_id IS 'External identifier from Clerk authentication service';
COMMENT ON COLUMN public.users.status IS 'Current user status - must be consistent with isActive field';
COMMENT ON COLUMN public.users.status_changed_at IS 'Timestamp when status was last changed';
COMMENT ON COLUMN public.users.status_changed_by IS 'User ID who changed the status';
COMMENT ON COLUMN public.users.status_change_reason IS 'Reason for the status change (for audit purposes)';
CREATE TABLE public.adjustment_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cycle_id uuid NOT NULL,
    date_type_id uuid NOT NULL,
    rule_description text NOT NULL,
    rule_code text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN public.adjustment_rules.id IS 'Unique identifier for the adjustment rule';
COMMENT ON COLUMN public.adjustment_rules.cycle_id IS 'Reference to the payroll cycle this rule applies to';
COMMENT ON COLUMN public.adjustment_rules.date_type_id IS 'Reference to the payroll date type this rule affects';
COMMENT ON COLUMN public.adjustment_rules.rule_description IS 'Human-readable description of the adjustment rule';
COMMENT ON COLUMN public.adjustment_rules.rule_code IS 'Code/formula used to calculate date adjustments';
COMMENT ON COLUMN public.adjustment_rules.created_at IS 'Timestamp when the rule was created';
COMMENT ON COLUMN public.adjustment_rules.updated_at IS 'Timestamp when the rule was last updated';
CREATE TABLE public.app_settings (
    id text NOT NULL,
    permissions jsonb
);
COMMENT ON COLUMN public.app_settings.id IS 'Unique identifier for application setting';
COMMENT ON COLUMN public.app_settings.permissions IS 'JSON structure containing application permission configurations';
CREATE TABLE public.billing_event_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    invoice_id uuid,
    event_type text NOT NULL,
    message text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now()
);
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
CREATE TABLE public.billing_plan (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    rate_per_payroll numeric(10,2) NOT NULL,
    currency text DEFAULT 'AUD'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
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
CREATE TABLE public.client_external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    system_id uuid NOT NULL,
    system_client_id character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN public.client_external_systems.id IS 'Unique identifier for the client-system mapping';
COMMENT ON COLUMN public.client_external_systems.client_id IS 'Reference to the client';
COMMENT ON COLUMN public.client_external_systems.system_id IS 'Reference to the external system';
COMMENT ON COLUMN public.client_external_systems.system_client_id IS 'Client identifier in the external system';
COMMENT ON COLUMN public.client_external_systems.created_at IS 'Timestamp when the mapping was created';
COMMENT ON COLUMN public.client_external_systems.updated_at IS 'Timestamp when the mapping was last updated';
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
COMMENT ON COLUMN public.clients.id IS 'Unique identifier for the client';
COMMENT ON COLUMN public.clients.name IS 'Client company name';
COMMENT ON COLUMN public.clients.contact_person IS 'Primary contact person at the client';
COMMENT ON COLUMN public.clients.contact_email IS 'Email address for the client contact';
COMMENT ON COLUMN public.clients.contact_phone IS 'Phone number for the client contact';
COMMENT ON COLUMN public.clients.active IS 'Whether the client is currently active';
COMMENT ON COLUMN public.clients.created_at IS 'Timestamp when the client was created';
COMMENT ON COLUMN public.clients.updated_at IS 'Timestamp when the client was last updated';
CREATE TABLE public.payroll_cycles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name public.payroll_cycle_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN public.payroll_cycles.id IS 'Unique identifier for the payroll cycle';
COMMENT ON COLUMN public.payroll_cycles.name IS 'Name of the payroll cycle (Weekly, Biweekly, Monthly, etc.)';
COMMENT ON COLUMN public.payroll_cycles.description IS 'Detailed description of the payroll cycle';
COMMENT ON COLUMN public.payroll_cycles.created_at IS 'Timestamp when the cycle was created';
COMMENT ON COLUMN public.payroll_cycles.updated_at IS 'Timestamp when the cycle was last updated';
CREATE TABLE public.payroll_date_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name public.payroll_date_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN public.payroll_date_types.id IS 'Unique identifier for the payroll date type';
COMMENT ON COLUMN public.payroll_date_types.name IS 'Name of the date type (Fixed, Last Working Day, etc.)';
COMMENT ON COLUMN public.payroll_date_types.description IS 'Detailed description of how this date type works';
COMMENT ON COLUMN public.payroll_date_types.created_at IS 'Timestamp when the date type was created';
COMMENT ON COLUMN public.payroll_date_types.updated_at IS 'Timestamp when the date type was last updated';
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
COMMENT ON COLUMN public.payrolls.id IS 'Unique identifier for the payroll';
COMMENT ON COLUMN public.payrolls.client_id IS 'Reference to the client this payroll belongs to';
COMMENT ON COLUMN public.payrolls.name IS 'Name of the payroll';
COMMENT ON COLUMN public.payrolls.cycle_id IS 'Reference to the payroll cycle';
COMMENT ON COLUMN public.payrolls.date_type_id IS 'Reference to the payroll date type';
COMMENT ON COLUMN public.payrolls.date_value IS 'Specific value for date calculation (e.g., day of month)';
COMMENT ON COLUMN public.payrolls.primary_consultant_user_id IS 'Primary consultant responsible for this payroll';
COMMENT ON COLUMN public.payrolls.backup_consultant_user_id IS 'Backup consultant for this payroll';
COMMENT ON COLUMN public.payrolls.manager_user_id IS 'Manager overseeing this payroll';
COMMENT ON COLUMN public.payrolls.processing_days_before_eft IS 'Number of days before EFT that processing must complete';
COMMENT ON COLUMN public.payrolls.created_at IS 'Timestamp when the payroll was created';
COMMENT ON COLUMN public.payrolls.updated_at IS 'Timestamp when the payroll was last updated';
COMMENT ON COLUMN public.payrolls.payroll_system IS 'External payroll system used for this client';
COMMENT ON COLUMN public.payrolls.status IS 'Current status of the payroll (Implementation, Active, Inactive)';
COMMENT ON COLUMN public.payrolls.processing_time IS 'Number of hours required to process this payroll';
COMMENT ON COLUMN public.payrolls.employee_count IS 'Number of employees in this payroll';
COMMENT ON COLUMN public.payrolls.go_live_date IS 'The date when the payroll went live in the system';
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
CREATE TABLE public.external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    url text NOT NULL,
    description text,
    icon character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON COLUMN public.external_systems.id IS 'Unique identifier for the external system';
COMMENT ON COLUMN public.external_systems.name IS 'Name of the external system';
COMMENT ON COLUMN public.external_systems.url IS 'URL endpoint for the external system';
COMMENT ON COLUMN public.external_systems.description IS 'Description of the external system and its purpose';
COMMENT ON COLUMN public.external_systems.icon IS 'Path or reference to the system icon';
COMMENT ON COLUMN public.external_systems.created_at IS 'Timestamp when the system was created';
COMMENT ON COLUMN public.external_systems.updated_at IS 'Timestamp when the system was last updated';
CREATE TABLE public.feature_flags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feature_name text NOT NULL,
    is_enabled boolean DEFAULT false,
    allowed_roles jsonb DEFAULT '[]'::jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);
COMMENT ON COLUMN public.feature_flags.id IS 'Unique identifier for the feature flag';
COMMENT ON COLUMN public.feature_flags.feature_name IS 'Name of the feature controlled by this flag';
COMMENT ON COLUMN public.feature_flags.is_enabled IS 'Whether the feature is currently enabled';
COMMENT ON COLUMN public.feature_flags.allowed_roles IS 'JSON array of roles that can access this feature';
COMMENT ON COLUMN public.feature_flags.updated_at IS 'Timestamp when the feature flag was last updated';
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
COMMENT ON COLUMN public.holidays.id IS 'Unique identifier for the holiday';
COMMENT ON COLUMN public.holidays.date IS 'Date of the holiday';
COMMENT ON COLUMN public.holidays.local_name IS 'Name of the holiday in local language';
COMMENT ON COLUMN public.holidays.name IS 'Name of the holiday in English';
COMMENT ON COLUMN public.holidays.country_code IS 'ISO country code where the holiday is observed';
COMMENT ON COLUMN public.holidays.region IS 'Array of regions within the country where the holiday applies';
COMMENT ON COLUMN public.holidays.is_fixed IS 'Whether the holiday occurs on the same date each year';
COMMENT ON COLUMN public.holidays.is_global IS 'Whether the holiday is observed globally';
COMMENT ON COLUMN public.holidays.launch_year IS 'First year when the holiday was observed';
COMMENT ON COLUMN public.holidays.types IS 'Array of holiday types (e.g., public, bank, religious)';
COMMENT ON COLUMN public.holidays.created_at IS 'Timestamp when the holiday record was created';
COMMENT ON COLUMN public.holidays.updated_at IS 'Timestamp when the holiday record was last updated';
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
COMMENT ON COLUMN public.leave.id IS 'Unique identifier for the leave record';
COMMENT ON COLUMN public.leave.user_id IS 'Reference to the user taking leave';
COMMENT ON COLUMN public.leave.start_date IS 'First day of the leave period';
COMMENT ON COLUMN public.leave.end_date IS 'Last day of the leave period';
COMMENT ON COLUMN public.leave.leave_type IS 'Type of leave (vacation, sick, personal, etc.)';
COMMENT ON COLUMN public.leave.reason IS 'Reason provided for the leave request';
COMMENT ON COLUMN public.leave.status IS 'Current status of the leave request (Pending, Approved, Denied)';
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
COMMENT ON COLUMN public.notes.id IS 'Unique identifier for the note';
COMMENT ON COLUMN public.notes.entity_type IS 'Type of entity this note is attached to (client, payroll, etc.)';
COMMENT ON COLUMN public.notes.entity_id IS 'Identifier of the entity this note is attached to';
COMMENT ON COLUMN public.notes.user_id IS 'User who created the note';
COMMENT ON COLUMN public.notes.content IS 'Content of the note';
COMMENT ON COLUMN public.notes.is_important IS 'Whether the note is flagged as important';
COMMENT ON COLUMN public.notes.created_at IS 'Timestamp when the note was created';
COMMENT ON COLUMN public.notes.updated_at IS 'Timestamp when the note was last updated';
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
CREATE VIEW public.payroll_triggers_status AS
 SELECT triggers.trigger_name,
    triggers.event_manipulation,
    triggers.event_object_table,
    triggers.action_timing,
    triggers.action_statement
   FROM information_schema.triggers
  WHERE (((triggers.trigger_name)::name ~~ '%payroll%'::text) OR ((triggers.trigger_name)::name ~~ '%auto_%'::text))
  ORDER BY triggers.trigger_name;
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
COMMENT ON TABLE public.permission_audit_log IS 'Audit log for permission changes and access attempts';
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
COMMENT ON TABLE public.permission_overrides IS 'User-specific and role-specific permission overrides';
COMMENT ON COLUMN public.permission_overrides.user_id IS 'User ID for user-specific overrides (mutually exclusive with role)';
COMMENT ON COLUMN public.permission_overrides.role IS 'Role name for role-based overrides (mutually exclusive with user_id)';
COMMENT ON COLUMN public.permission_overrides.granted IS 'Whether the permission is granted (true) or denied (false)';
COMMENT ON COLUMN public.permission_overrides.conditions IS 'JSON conditions for conditional permissions';
COMMENT ON COLUMN public.permission_overrides.expires_at IS 'When this override expires (NULL for permanent)';
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
    invitation_status public.invitation_status_enum DEFAULT 'pending'::public.invitation_status_enum NOT NULL,
    revoked_at timestamp with time zone,
    revoked_by uuid,
    revoke_reason text,
    CONSTRAINT user_invitations_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'expired'::character varying, 'cancelled'::character varying])::text[])))
);
COMMENT ON TABLE public.user_invitations IS 'Stores invitation metadata for two-stage user invitation flow with role-based access control';
CREATE TABLE public.users_role_backup (
    id uuid,
    email character varying(255),
    role public.user_role,
    created_at timestamp with time zone
);
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
COMMENT ON COLUMN public.work_schedule.id IS 'Unique identifier for the work schedule entry';
COMMENT ON COLUMN public.work_schedule.user_id IS 'Reference to the user this schedule belongs to';
COMMENT ON COLUMN public.work_schedule.work_day IS 'Day of the week (Monday, Tuesday, etc.)';
COMMENT ON COLUMN public.work_schedule.work_hours IS 'Number of hours worked on this day';
COMMENT ON COLUMN public.work_schedule.created_at IS 'Timestamp when the schedule entry was created';
COMMENT ON COLUMN public.work_schedule.updated_at IS 'Timestamp when the schedule entry was last updated';
ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_date_type_id_key UNIQUE (cycle_id, date_type_id);
ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.billing_plan
    ADD CONSTRAINT billing_plan_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_system_id_key UNIQUE (client_id, system_id);
ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.external_systems
    ADD CONSTRAINT external_systems_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_feature_name_key UNIQUE (feature_name);
ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.latest_payroll_version_results
    ADD CONSTRAINT latest_payroll_version_results_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.leave
    ADD CONSTRAINT leave_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payroll_activation_results
    ADD CONSTRAINT payroll_activation_results_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT payroll_assignment_audit_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT payroll_assignments_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payroll_cycles
    ADD CONSTRAINT payroll_cycles_name_key UNIQUE (name);
ALTER TABLE ONLY public.payroll_cycles
    ADD CONSTRAINT payroll_cycles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payroll_date_types
    ADD CONSTRAINT payroll_date_types_name_key UNIQUE (name);
ALTER TABLE ONLY public.payroll_date_types
    ADD CONSTRAINT payroll_date_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payroll_version_history_results
    ADD CONSTRAINT payroll_version_history_results_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payroll_version_results
    ADD CONSTRAINT payroll_version_results_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_action_key UNIQUE (resource_id, action);
ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_name_key UNIQUE (name);
ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT unique_user_work_day UNIQUE (user_id, work_day);
ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT uq_payroll_assignment_payroll_date UNIQUE (payroll_date_id);
ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_clerk_user_id_key UNIQUE (clerk_user_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT work_schedule_pkey PRIMARY KEY (id);
CREATE INDEX idx_audit_assignment ON public.payroll_assignment_audit USING btree (assignment_id);
CREATE INDEX idx_audit_changed_by ON public.payroll_assignment_audit USING btree (changed_by);
CREATE INDEX idx_audit_date ON public.payroll_assignment_audit USING btree (created_at);
CREATE INDEX idx_audit_payroll_date ON public.payroll_assignment_audit USING btree (payroll_date_id);
CREATE INDEX idx_billing_invoice_client_id ON public.billing_invoice USING btree (client_id);
CREATE INDEX idx_holidays_date_country_region ON public.holidays USING btree (date, country_code, region);
CREATE INDEX idx_latest_payroll_version_results_payroll_id ON public.latest_payroll_version_results USING btree (payroll_id);
CREATE INDEX idx_latest_payroll_version_results_queried_at ON public.latest_payroll_version_results USING btree (queried_at);
CREATE INDEX idx_leave_dates ON public.leave USING btree (start_date, end_date);
CREATE INDEX idx_leave_user_id ON public.leave USING btree (user_id);
CREATE INDEX idx_notes_created_at ON public.notes USING btree (created_at DESC);
CREATE INDEX idx_notes_entity ON public.notes USING btree (entity_type, entity_id);
CREATE INDEX idx_notes_important ON public.notes USING btree (is_important) WHERE (is_important = true);
CREATE INDEX idx_notes_user_id ON public.notes USING btree (user_id);
CREATE INDEX idx_payroll_assignments_assigned_by ON public.payroll_assignments USING btree (assigned_by);
CREATE INDEX idx_payroll_assignments_assigned_date ON public.payroll_assignments USING btree (assigned_date);
CREATE INDEX idx_payroll_assignments_consultant ON public.payroll_assignments USING btree (consultant_id);
CREATE INDEX idx_payroll_assignments_payroll_date ON public.payroll_assignments USING btree (payroll_date_id);
CREATE INDEX idx_payroll_dashboard_stats_consultants ON public.payroll_dashboard_stats USING btree (primary_consultant_user_id, backup_consultant_user_id);
CREATE INDEX idx_payroll_dashboard_stats_status ON public.payroll_dashboard_stats USING btree (status);
CREATE INDEX idx_payroll_dates_composite ON public.payroll_dates USING btree (payroll_id, adjusted_eft_date, processing_date);
CREATE INDEX idx_payroll_dates_date_range ON public.payroll_dates USING btree (adjusted_eft_date);
CREATE INDEX idx_payroll_dates_notes ON public.payroll_dates USING gin (to_tsvector('english'::regconfig, notes));
CREATE INDEX idx_payroll_dates_payroll_id ON public.payroll_dates USING btree (payroll_id);
CREATE INDEX idx_payroll_dates_processing ON public.payroll_dates USING btree (processing_date);
CREATE INDEX idx_payroll_version_history_results_payroll_id ON public.payroll_version_history_results USING btree (payroll_id);
CREATE INDEX idx_payroll_version_history_results_queried_at ON public.payroll_version_history_results USING btree (queried_at);
CREATE INDEX idx_payroll_version_results_created_at ON public.payroll_version_results USING btree (created_at);
CREATE INDEX idx_payrolls_active_dates ON public.payrolls USING btree (status, go_live_date, superseded_date) WHERE (status = 'Active'::public.payroll_status);
CREATE INDEX idx_payrolls_client_id ON public.payrolls USING btree (client_id);
CREATE INDEX idx_payrolls_consultant ON public.payrolls USING btree (primary_consultant_user_id);
CREATE INDEX idx_payrolls_current_version ON public.payrolls USING btree (parent_payroll_id, version_number DESC) WHERE (superseded_date IS NULL);
CREATE INDEX idx_payrolls_go_live_date ON public.payrolls USING btree (go_live_date);
CREATE INDEX idx_payrolls_manager ON public.payrolls USING btree (manager_user_id);
CREATE INDEX idx_payrolls_staff_composite ON public.payrolls USING btree (primary_consultant_user_id, backup_consultant_user_id, manager_user_id);
CREATE INDEX idx_payrolls_status_client ON public.payrolls USING btree (status, client_id) WHERE (status <> 'Inactive'::public.payroll_status);
CREATE INDEX idx_payrolls_versioning ON public.payrolls USING btree (parent_payroll_id, version_number, go_live_date);
CREATE INDEX idx_permission_audit_log_action ON public.permission_audit_log USING btree (action);
CREATE INDEX idx_permission_audit_log_resource ON public.permission_audit_log USING btree (resource);
CREATE INDEX idx_permission_audit_log_target_user_id ON public.permission_audit_log USING btree (target_user_id);
CREATE INDEX idx_permission_audit_log_timestamp ON public.permission_audit_log USING btree ("timestamp" DESC);
CREATE INDEX idx_permission_audit_log_user_id ON public.permission_audit_log USING btree (user_id);
CREATE INDEX idx_permission_overrides_created_by ON public.permission_overrides USING btree (created_by);
CREATE INDEX idx_permission_overrides_expires_at ON public.permission_overrides USING btree (expires_at);
CREATE INDEX idx_permission_overrides_operation ON public.permission_overrides USING btree (operation);
CREATE INDEX idx_permission_overrides_resource ON public.permission_overrides USING btree (resource);
CREATE INDEX idx_permission_overrides_role ON public.permission_overrides USING btree (role);
CREATE INDEX idx_permission_overrides_user_id ON public.permission_overrides USING btree (user_id);
CREATE UNIQUE INDEX idx_unique_payroll_date ON public.payroll_dates USING btree (payroll_id, original_eft_date);
CREATE INDEX idx_user_invitations_clerk_ticket ON public.user_invitations USING btree (clerk_ticket);
CREATE INDEX idx_user_invitations_email ON public.user_invitations USING btree (email);
CREATE INDEX idx_user_invitations_expires_at ON public.user_invitations USING btree (expires_at);
CREATE INDEX idx_user_invitations_invitation_status ON public.user_invitations USING btree (invitation_status);
CREATE INDEX idx_user_invitations_invited_by ON public.user_invitations USING btree (invited_by);
CREATE INDEX idx_user_invitations_revoked_at ON public.user_invitations USING btree (revoked_at);
CREATE INDEX idx_user_invitations_revoked_by ON public.user_invitations USING btree (revoked_by);
CREATE INDEX idx_user_invitations_status ON public.user_invitations USING btree (status);
CREATE INDEX idx_users_active_staff ON public.users USING btree (is_active, is_staff, role) WHERE (is_active = true);
CREATE INDEX idx_users_clerk_composite ON public.users USING btree (clerk_user_id, role, is_staff);
CREATE INDEX idx_users_deactivated_at ON public.users USING btree (deactivated_at) WHERE (deactivated_at IS NOT NULL);
CREATE INDEX idx_users_is_active ON public.users USING btree (is_active);
CREATE INDEX idx_users_role ON public.users USING btree (role);
CREATE INDEX idx_users_status ON public.users USING btree (status);
CREATE INDEX idx_users_status_changed_at ON public.users USING btree (status_changed_at);
CREATE INDEX idx_work_schedule_user_id ON public.work_schedule USING btree (user_id);
CREATE UNIQUE INDEX only_one_current_version_per_family ON public.payrolls USING btree (COALESCE(parent_payroll_id, id)) WHERE (superseded_date IS NULL);
CREATE TRIGGER audit_clients_changes AFTER INSERT OR DELETE OR UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION audit.log_changes();
CREATE TRIGGER audit_invitation_status_change_trigger AFTER UPDATE ON public.user_invitations FOR EACH ROW EXECUTE FUNCTION public.audit_invitation_status_change();
CREATE TRIGGER audit_payrolls_changes AFTER INSERT OR DELETE OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION audit.log_changes();
CREATE TRIGGER audit_role_permissions_changes AFTER INSERT OR DELETE OR UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION audit.log_changes();
CREATE TRIGGER audit_user_roles_changes AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION audit.log_changes();
CREATE TRIGGER audit_user_status_change_trigger AFTER UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.audit_user_status_change();
CREATE TRIGGER audit_users_changes AFTER INSERT OR DELETE OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION audit.log_changes();
CREATE TRIGGER check_entity_relation BEFORE INSERT OR UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.enforce_entity_relation();
CREATE TRIGGER enforce_staff_on_payrolls BEFORE INSERT OR UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.enforce_staff_roles();
CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.payroll_assignments FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
CREATE TRIGGER trg_invoice_item_total AFTER INSERT OR DELETE OR UPDATE ON public.billing_invoice_item FOR EACH ROW EXECUTE FUNCTION public.update_invoice_total();
CREATE TRIGGER trigger_auto_delete_future_dates AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_delete_future_dates_on_supersede();
CREATE TRIGGER trigger_auto_generate_dates AFTER INSERT ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_generate_dates_on_payroll_insert();
CREATE TRIGGER trigger_auto_regenerate_dates AFTER UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.auto_regenerate_dates_on_schedule_change();
CREATE TRIGGER trigger_prevent_duplicate_insert BEFORE INSERT ON public.work_schedule FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_workday_insert();
CREATE TRIGGER update_feature_flags_modtime BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
CREATE TRIGGER update_invitation_status_metadata_trigger BEFORE UPDATE ON public.user_invitations FOR EACH ROW EXECUTE FUNCTION public.update_invitation_status_metadata();
CREATE TRIGGER update_permission_overrides_updated_at BEFORE UPDATE ON public.permission_overrides FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_permissions_timestamp BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_resources_timestamp BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_role_permissions_timestamp BEFORE UPDATE ON public.role_permissions FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_roles_timestamp BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_user_invitations_updated_at BEFORE UPDATE ON public.user_invitations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_roles_timestamp BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_user_status_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_user_status_changed_at();
ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.payroll_cycles(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.adjustment_rules
    ADD CONSTRAINT adjustment_rules_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES public.payroll_date_types(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);
ALTER TABLE ONLY public.billing_event_log
    ADD CONSTRAINT billing_event_log_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoice(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.billing_invoice
    ADD CONSTRAINT billing_invoice_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.billing_invoice_item
    ADD CONSTRAINT billing_invoice_item_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoice(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.billing_items
    ADD CONSTRAINT billing_items_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_billing_plan_id_fkey FOREIGN KEY (billing_plan_id) REFERENCES public.billing_plan(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.client_billing_assignment
    ADD CONSTRAINT client_billing_assignment_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.client_external_systems
    ADD CONSTRAINT client_external_systems_system_id_fkey FOREIGN KEY (system_id) REFERENCES public.external_systems(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_assignment FOREIGN KEY (assignment_id) REFERENCES public.payroll_assignments(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_changed_by FOREIGN KEY (changed_by) REFERENCES public.users(id);
ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_from_consultant FOREIGN KEY (from_consultant_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_payroll_date FOREIGN KEY (payroll_date_id) REFERENCES public.payroll_dates(id);
ALTER TABLE ONLY public.payroll_assignment_audit
    ADD CONSTRAINT fk_audit_to_consultant FOREIGN KEY (to_consultant_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_backup_consultant_user FOREIGN KEY (backup_consultant_user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.leave
    ADD CONSTRAINT fk_leave_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_manager_user FOREIGN KEY (manager_user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_assigned_by FOREIGN KEY (assigned_by) REFERENCES public.users(id);
ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_consultant FOREIGN KEY (consultant_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_original_consultant FOREIGN KEY (original_consultant_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.payroll_assignments
    ADD CONSTRAINT fk_payroll_assignment_payroll_date FOREIGN KEY (payroll_date_id) REFERENCES public.payroll_dates(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT fk_primary_consultant_user FOREIGN KEY (primary_consultant_user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.work_schedule
    ADD CONSTRAINT fk_work_schedule_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT manager_id FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.payroll_dates
    ADD CONSTRAINT payroll_dates_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.payroll_cycles(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES public.payroll_date_types(id) ON DELETE RESTRICT;
ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_parent_payroll_id_fkey FOREIGN KEY (parent_payroll_id) REFERENCES public.payrolls(id);
ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.permission_audit_log
    ADD CONSTRAINT permission_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.permission_overrides
    ADD CONSTRAINT permission_overrides_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_accepted_by_fkey FOREIGN KEY (accepted_by) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.user_invitations
    ADD CONSTRAINT user_invitations_revoked_by_fkey FOREIGN KEY (revoked_by) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_status_changed_by_fkey FOREIGN KEY (status_changed_by) REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY consultant_viewer_read_user_invitations ON public.user_invitations USING ((current_setting('hasura.user_role'::text) = ANY (ARRAY['consultant'::text, 'viewer'::text]))) WITH CHECK ((current_setting('hasura.user_role'::text) = ANY (ARRAY['consultant'::text, 'viewer'::text])));
CREATE POLICY developer_full_access_user_invitations ON public.user_invitations USING (((CURRENT_USER = 'developer'::name) OR (current_setting('hasura.user_role'::text) = 'developer'::text))) WITH CHECK (((CURRENT_USER = 'developer'::name) OR (current_setting('hasura.user_role'::text) = 'developer'::text)));
CREATE POLICY manager_access_user_invitations ON public.user_invitations USING ((current_setting('hasura.user_role'::text) = 'manager'::text)) WITH CHECK ((current_setting('hasura.user_role'::text) = 'manager'::text));
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_admin_full_access_user_invitations ON public.user_invitations USING ((current_setting('hasura.user_role'::text) = 'org_admin'::text)) WITH CHECK ((current_setting('hasura.user_role'::text) = 'org_admin'::text));
ALTER TABLE public.payroll_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;
CREATE POLICY payrolls_select_policy ON public.payrolls FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = (current_setting('hasura.user_id'::text))::uuid) AND ((u.role = ANY (ARRAY['developer'::public.user_role, 'org_admin'::public.user_role])) OR ((u.role = 'manager'::public.user_role) AND (payrolls.manager_user_id = u.id)) OR ((u.role = 'consultant'::public.user_role) AND ((payrolls.primary_consultant_user_id = u.id) OR (payrolls.backup_consultant_user_id = u.id))))))));
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_select_policy ON public.users FOR SELECT USING (((id = (current_setting('hasura.user_id'::text))::uuid) OR (EXISTS ( SELECT 1
   FROM public.users u
  WHERE ((u.id = (current_setting('hasura.user_id'::text))::uuid) AND (u.role = ANY (ARRAY['developer'::public.user_role, 'org_admin'::public.user_role])))))));

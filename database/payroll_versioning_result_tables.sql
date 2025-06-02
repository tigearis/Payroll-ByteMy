-- ============================================================================
-- PAYROLL VERSIONING RESULT TABLES
-- Create actual tables for function results so Hasura can track the functions
-- ============================================================================

-- Table for create_payroll_version function results
CREATE TABLE IF NOT EXISTS public.payroll_version_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    new_payroll_id uuid NOT NULL,
    new_version_number integer NOT NULL,
    old_payroll_id uuid NOT NULL,
    dates_deleted integer NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by_user_id uuid
);

-- Table for get_latest_payroll_version function results
CREATE TABLE IF NOT EXISTS public.latest_payroll_version_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    payroll_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    version_number integer NOT NULL,
    go_live_date date,
    active boolean NOT NULL,
    queried_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Table for get_payroll_version_history function results
CREATE TABLE IF NOT EXISTS public.payroll_version_history_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Table for activate_payroll_versions function results
CREATE TABLE IF NOT EXISTS public.payroll_activation_results (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    payroll_id uuid NOT NULL,
    action_taken text NOT NULL,
    version_number integer NOT NULL,
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- UPDATED FUNCTIONS USING ACTUAL TABLES
-- ============================================================================

-- Drop existing composite types and functions
DROP TYPE IF EXISTS public.payroll_version_result CASCADE;
DROP TYPE IF EXISTS public.latest_payroll_version_result CASCADE;
DROP TYPE IF EXISTS public.payroll_version_history_result CASCADE;
DROP TYPE IF EXISTS public.payroll_activation_result CASCADE;

DROP FUNCTION IF EXISTS public.create_payroll_version(uuid,date,text,uuid,text,uuid,uuid,uuid,integer,uuid,uuid,uuid);
DROP FUNCTION IF EXISTS public.get_latest_payroll_version(uuid);
DROP FUNCTION IF EXISTS public.get_payroll_version_history(uuid);
DROP FUNCTION IF EXISTS public.activate_payroll_versions();

-- Function to create a new payroll version (returns SETOF table)
CREATE OR REPLACE FUNCTION public.create_payroll_version(
    p_original_payroll_id uuid,
    p_go_live_date date,
    p_version_reason text DEFAULT 'schedule_change',
    p_created_by_user_id uuid DEFAULT NULL,
    p_new_name text DEFAULT NULL,
    p_new_client_id uuid DEFAULT NULL,
    p_new_cycle_id uuid DEFAULT NULL,
    p_new_date_type_id uuid DEFAULT NULL,
    p_new_date_value integer DEFAULT NULL,
    p_new_primary_consultant_user_id uuid DEFAULT NULL,
    p_new_backup_consultant_user_id uuid DEFAULT NULL,
    p_new_manager_user_id uuid DEFAULT NULL
) RETURNS SETOF public.payroll_version_results
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
        updated_at
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
        'Active'::public.payroll_status, -- New version is active
        v_original_payroll.payroll_system,
        v_original_payroll.processing_time,
        v_original_payroll.employee_count,
        v_new_version_number,
        v_parent_id,
        p_go_live_date,
        p_version_reason,
        p_created_by_user_id,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- Delete future payroll dates from the original payroll (from go-live date forward)
    DELETE FROM public.payroll_dates 
    WHERE payroll_id = p_original_payroll_id 
    AND original_eft_date >= p_go_live_date;
    
    GET DIAGNOSTICS v_dates_deleted = ROW_COUNT;

    -- Mark original payroll as superseded but keep it active until go-live date
    UPDATE public.payrolls 
    SET superseded_date = p_go_live_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_original_payroll_id;

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

-- Function to get the latest active version of a payroll (returns SETOF table)
CREATE OR REPLACE FUNCTION public.get_latest_payroll_version(p_payroll_id uuid)
RETURNS SETOF public.latest_payroll_version_results
LANGUAGE plpgsql
AS $$
DECLARE
    v_result_id uuid;
BEGIN
    -- Clear old results for this query (optional - keeps table clean)
    DELETE FROM public.latest_payroll_version_results 
    WHERE queried_at < CURRENT_TIMESTAMP - INTERVAL '1 hour';

    -- Insert current result
    v_result_id := gen_random_uuid();
    
    WITH payroll_family AS (
        -- Get the original payroll and all its versions
        SELECT COALESCE(p.parent_payroll_id, p.id) as root_id
        FROM public.payrolls p
        WHERE p.id = p_payroll_id
    ),
    all_versions AS (
        SELECT p.*
        FROM public.payrolls p
        JOIN payroll_family pf ON (p.id = pf.root_id OR p.parent_payroll_id = pf.root_id)
        WHERE p.status = 'Active'
    ),
    latest_version AS (
        SELECT 
            av.id,
            av.name,
            av.version_number,
            av.go_live_date,
            (av.status = 'Active') as active
        FROM all_versions av
        WHERE (av.go_live_date IS NULL OR av.go_live_date <= CURRENT_DATE)
        AND (av.superseded_date IS NULL OR av.superseded_date > CURRENT_DATE)
        ORDER BY av.version_number DESC
        LIMIT 1
    )
    INSERT INTO public.latest_payroll_version_results (
        id,
        payroll_id,
        name,
        version_number,
        go_live_date,
        active
    )
    SELECT 
        v_result_id,
        lv.id,
        lv.name,
        lv.version_number,
        lv.go_live_date,
        lv.active
    FROM latest_version lv;

    -- Return the result
    RETURN QUERY 
    SELECT * FROM public.latest_payroll_version_results 
    WHERE id = v_result_id;
END;
$$;

-- Function to get payroll version history (returns SETOF table)
CREATE OR REPLACE FUNCTION public.get_payroll_version_history(p_payroll_id uuid)
RETURNS SETOF public.payroll_version_history_results
LANGUAGE plpgsql
AS $$
BEGIN
    -- Clear old results for this query (optional - keeps table clean)
    DELETE FROM public.payroll_version_history_results 
    WHERE queried_at < CURRENT_TIMESTAMP - INTERVAL '1 hour';

    -- Insert and return current results
    WITH payroll_family AS (
        -- Get the original payroll and all its versions
        SELECT 
            COALESCE(p.parent_payroll_id, p.id) as root_id
        FROM public.payrolls p
        WHERE p.id = p_payroll_id
    ),
    all_versions AS (
        SELECT p.*
        FROM public.payrolls p
        JOIN payroll_family pf ON (p.id = pf.root_id OR p.parent_payroll_id = pf.root_id)
    ),
    current_version AS (
        SELECT av.id as current_id
        FROM all_versions av
        WHERE av.status = 'Active'
        AND (av.go_live_date IS NULL OR av.go_live_date <= CURRENT_DATE)
        AND (av.superseded_date IS NULL OR av.superseded_date > CURRENT_DATE)
        ORDER BY av.version_number DESC
        LIMIT 1
    )
    INSERT INTO public.payroll_version_history_results (
        payroll_id,
        name,
        version_number,
        go_live_date,
        superseded_date,
        version_reason,
        active,
        is_current
    )
    SELECT 
        av.id,
        av.name,
        av.version_number,
        av.go_live_date,
        av.superseded_date,
        av.version_reason,
        (av.status = 'Active') as active,
        (av.id = cv.current_id) as is_current
    FROM all_versions av
    CROSS JOIN current_version cv
    ORDER BY av.version_number ASC;

    -- Return the results
    RETURN QUERY 
    SELECT * FROM public.payroll_version_history_results 
    WHERE queried_at >= CURRENT_TIMESTAMP - INTERVAL '5 minutes'
    ORDER BY version_number ASC;
END;
$$;

-- Function to activate payroll versions (cron job) - returns SETOF table
CREATE OR REPLACE FUNCTION public.activate_payroll_versions()
RETURNS SETOF public.payroll_activation_results
LANGUAGE plpgsql
AS $$
DECLARE
    v_payroll RECORD;
    v_result_id uuid;
BEGIN
    -- Clear old results (keep only last 24 hours)
    DELETE FROM public.payroll_activation_results 
    WHERE executed_at < CURRENT_TIMESTAMP - INTERVAL '24 hours';

    -- Deactivate old versions that have been superseded
    FOR v_payroll IN 
        SELECT id, name, version_number, superseded_date
        FROM public.payrolls 
        WHERE status = 'Active'
        AND superseded_date IS NOT NULL 
        AND superseded_date <= CURRENT_DATE
    LOOP
        UPDATE public.payrolls 
        SET status = 'Inactive',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = v_payroll.id;
        
        v_result_id := gen_random_uuid();
        INSERT INTO public.payroll_activation_results (
            id,
            payroll_id,
            action_taken,
            version_number
        ) VALUES (
            v_result_id,
            v_payroll.id,
            'deactivated_superseded_version',
            v_payroll.version_number
        );
    END LOOP;

    -- Log new versions that should go live today (they're already active)
    FOR v_payroll IN 
        SELECT id, name, version_number, go_live_date
        FROM public.payrolls 
        WHERE status = 'Active'
        AND go_live_date = CURRENT_DATE
        AND superseded_date IS NULL
    LOOP
        v_result_id := gen_random_uuid();
        INSERT INTO public.payroll_activation_results (
            id,
            payroll_id,
            action_taken,
            version_number
        ) VALUES (
            v_result_id,
            v_payroll.id,
            'activated_new_version',
            v_payroll.version_number
        );
    END LOOP;

    -- Return all results from this execution
    RETURN QUERY 
    SELECT * FROM public.payroll_activation_results 
    WHERE executed_at >= CURRENT_TIMESTAMP - INTERVAL '1 minute'
    ORDER BY executed_at DESC;
END;
$$; 
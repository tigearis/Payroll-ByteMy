-- ============================================================================
-- PAYROLL VERSIONING SYSTEM - DATABASE SCHEMA UPDATES
-- ============================================================================

-- Add versioning columns to payrolls table
ALTER TABLE payrolls 
ADD COLUMN IF NOT EXISTS version_number integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_payroll_id uuid REFERENCES payrolls(id),
ADD COLUMN IF NOT EXISTS go_live_date date,
ADD COLUMN IF NOT EXISTS superseded_date date,
ADD COLUMN IF NOT EXISTS version_reason text,
ADD COLUMN IF NOT EXISTS created_by_user_id uuid;

-- Add indexes for versioning queries
CREATE INDEX IF NOT EXISTS idx_payrolls_versioning 
ON payrolls (parent_payroll_id, version_number, active, go_live_date);

CREATE INDEX IF NOT EXISTS idx_payrolls_active_versions 
ON payrolls (active, go_live_date) 
WHERE active = true;

-- Create enum for version reasons
CREATE TYPE payroll_version_reason AS ENUM (
    'initial_creation',
    'schedule_change',
    'consultant_change', 
    'client_change',
    'correction',
    'annual_review'
);

-- Add constraint to ensure version_reason uses enum
ALTER TABLE payrolls 
ADD CONSTRAINT check_version_reason 
CHECK (version_reason IS NULL OR version_reason::text = ANY(ENUM_RANGE(NULL::payroll_version_reason)::text[]));

-- Function to get the latest active version of a payroll
CREATE OR REPLACE FUNCTION public.get_latest_payroll_version(p_payroll_id uuid)
RETURNS TABLE(
    id uuid,
    name text,
    version_number integer,
    go_live_date date,
    active boolean
)
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

-- Function to get payroll version history
CREATE OR REPLACE FUNCTION public.get_payroll_version_history(p_payroll_id uuid)
RETURNS TABLE(
    id uuid,
    name text,
    version_number integer,
    go_live_date date,
    superseded_date date,
    version_reason text,
    active boolean,
    is_current boolean
)
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

-- Function to create a new payroll version
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
) RETURNS TABLE(
    new_payroll_id uuid,
    new_version_number integer,
    old_payroll_id uuid,
    dates_deleted integer,
    message text
)
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

-- Function to activate payroll versions (cron job)
CREATE OR REPLACE FUNCTION public.activate_payroll_versions()
RETURNS TABLE(
    payroll_id uuid,
    action_taken text,
    version_number integer
)
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_latest_payroll_version TO hasura;
GRANT EXECUTE ON FUNCTION public.get_payroll_version_history TO hasura;
GRANT EXECUTE ON FUNCTION public.create_payroll_version TO hasura;
GRANT EXECUTE ON FUNCTION public.activate_payroll_versions TO hasura;

-- Create a view for easy querying of current payroll versions
CREATE OR REPLACE VIEW public.current_payrolls AS
SELECT DISTINCT ON (COALESCE(p.parent_payroll_id, p.id))
    p.id,
    p.name,
    p.client_id,
    p.cycle_id,
    p.date_type_id,
    p.date_value,
    p.start_date,
    p.primary_consultant_user_id,
    p.backup_consultant_user_id,
    p.manager_user_id,
    p.active,
    p.version_number,
    p.parent_payroll_id,
    p.go_live_date,
    p.superseded_date,
    p.version_reason,
    p.created_at,
    p.updated_at,
    c.name as client_name,
    pc.name as payroll_cycle_name,
    pdt.name as payroll_date_type_name
FROM payrolls p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN payroll_cycles pc ON p.cycle_id = pc.id
LEFT JOIN payroll_date_types pdt ON p.date_type_id = pdt.id
WHERE p.active = true
AND (p.go_live_date IS NULL OR p.go_live_date <= CURRENT_DATE)
AND (p.superseded_date IS NULL OR p.superseded_date > CURRENT_DATE)
ORDER BY COALESCE(p.parent_payroll_id, p.id), p.version_number DESC;

COMMENT ON VIEW public.current_payrolls IS 'View showing the currently active version of each payroll'; 
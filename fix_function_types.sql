-- Fix function return types to match actual database column types

CREATE OR REPLACE FUNCTION public.get_latest_payroll_version(p_payroll_id uuid)
RETURNS TABLE(
    id uuid,
    name character varying(255),
    version_number integer,
    go_live_date date,
    active boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH payroll_family AS (
        SELECT COALESCE(p.parent_payroll_id, p.id) as root_id
        FROM payrolls p
        WHERE p.id = p_payroll_id
    ),
    all_versions AS (
        SELECT p.*
        FROM payrolls p
        JOIN payroll_family pf ON (p.id = pf.root_id OR p.parent_payroll_id = pf.root_id)
        WHERE p.status = 'Active'
    )
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
    LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_payroll_version_history(p_payroll_id uuid)
RETURNS TABLE(
    id uuid,
    name character varying(255),
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
        WHERE av.status = 'Active'
        AND (av.go_live_date IS NULL OR av.go_live_date <= CURRENT_DATE)
        AND (av.superseded_date IS NULL OR av.superseded_date > CURRENT_DATE)
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
        (av.status = 'Active') as active,
        (av.id = cv.current_id) as is_current
    FROM all_versions av
    CROSS JOIN current_version cv
    ORDER BY av.version_number ASC;
END;
$$; 
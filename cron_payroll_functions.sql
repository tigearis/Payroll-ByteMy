-- ============================================================================
-- PAYROLL DATE GENERATION - CRON JOB FUNCTIONS
-- ============================================================================

-- Function to generate 2 years of dates for a single payroll
CREATE OR REPLACE FUNCTION public.generate_payroll_dates_two_years(
    p_payroll_id uuid,
    p_start_date date DEFAULT CURRENT_DATE
) RETURNS SETOF public.payroll_dates
LANGUAGE plpgsql
AS $$
DECLARE
    v_end_date date;
BEGIN
    -- Calculate end date as 2 years from start date
    v_end_date := p_start_date + INTERVAL '2 years';
    
    -- Use existing function with calculated end date
    RETURN QUERY 
    SELECT * FROM public.generate_payroll_dates(
        p_payroll_id := p_payroll_id,
        p_start_date := p_start_date,
        p_end_date := v_end_date,
        p_max_dates := 104  -- ~2 years of weekly payrolls
    );
END;
$$;

-- Function to generate dates for all active payrolls (BULK OPERATION)
CREATE OR REPLACE FUNCTION public.generate_all_payroll_dates_bulk(
    p_years_ahead integer DEFAULT 2
) RETURNS TABLE(
    payroll_id uuid,
    dates_generated integer,
    start_date date,
    end_date date,
    status text
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_payroll RECORD;
    v_start_date date;
    v_end_date date;
    v_count integer;
BEGIN
    -- Loop through all active payrolls
    FOR v_payroll IN 
        SELECT id, name, start_date 
        FROM payrolls 
        WHERE active = true 
        ORDER BY name
    LOOP
        BEGIN
            -- Calculate start date (today or payroll start date, whichever is later)
            v_start_date := GREATEST(CURRENT_DATE, COALESCE(v_payroll.start_date, CURRENT_DATE));
            
            -- Calculate end date
            v_end_date := v_start_date + (p_years_ahead || ' years')::interval;
            
            -- Generate dates for this payroll
            SELECT COUNT(*) INTO v_count
            FROM public.generate_payroll_dates(
                p_payroll_id := v_payroll.id,
                p_start_date := v_start_date,
                p_end_date := v_end_date,
                p_max_dates := (p_years_ahead * 52)  -- Approximate max dates
            );
            
            -- Return result for this payroll
            RETURN QUERY SELECT 
                v_payroll.id,
                v_count,
                v_start_date,
                v_end_date,
                'success'::text;
                
        EXCEPTION WHEN OTHERS THEN
            -- Return error for this payroll but continue processing others
            RETURN QUERY SELECT 
                v_payroll.id,
                0,
                v_start_date,
                v_end_date,
                ('error: ' || SQLERRM)::text;
        END;
    END LOOP;
END;
$$;

-- Function to check payroll date coverage and identify gaps
CREATE OR REPLACE FUNCTION public.check_payroll_date_coverage()
RETURNS TABLE(
    payroll_id uuid,
    payroll_name text,
    latest_date date,
    days_ahead integer,
    needs_generation boolean,
    recommended_action text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        COALESCE(MAX(pd.original_eft_date), p.start_date) as latest_date,
        COALESCE(MAX(pd.original_eft_date), p.start_date) - CURRENT_DATE as days_ahead,
        (COALESCE(MAX(pd.original_eft_date), p.start_date) - CURRENT_DATE < 365) as needs_generation,
        CASE 
            WHEN COALESCE(MAX(pd.original_eft_date), p.start_date) - CURRENT_DATE < 180 THEN 'URGENT: Generate dates immediately'
            WHEN COALESCE(MAX(pd.original_eft_date), p.start_date) - CURRENT_DATE < 365 THEN 'Generate dates in next monthly run'
            ELSE 'Coverage adequate'
        END as recommended_action
    FROM payrolls p
    LEFT JOIN payroll_dates pd ON p.id = pd.payroll_id
    WHERE p.active = true
    GROUP BY p.id, p.name, p.start_date
    ORDER BY days_ahead ASC;
END;
$$;

-- Function to cleanup old payroll dates (older than 1 year)
CREATE OR REPLACE FUNCTION public.cleanup_old_payroll_dates()
RETURNS TABLE(
    payroll_id uuid,
    deleted_count integer
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_payroll RECORD;
    v_deleted_count integer;
BEGIN
    FOR v_payroll IN SELECT DISTINCT payroll_id FROM payroll_dates LOOP
        -- Delete dates older than 1 year and already processed
        DELETE FROM payroll_dates 
        WHERE payroll_id = v_payroll.payroll_id 
        AND original_eft_date < CURRENT_DATE - INTERVAL '1 year'
        AND processing_date IS NOT NULL; -- Only delete processed dates
        
        GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
        
        IF v_deleted_count > 0 THEN
            RETURN QUERY SELECT v_payroll.payroll_id, v_deleted_count;
        END IF;
    END LOOP;
END;
$$;

-- Function to get payroll date generation statistics
CREATE OR REPLACE FUNCTION public.get_payroll_date_stats()
RETURNS TABLE(
    total_active_payrolls integer,
    total_future_dates integer,
    avg_days_ahead numeric,
    min_days_ahead integer,
    max_days_ahead integer,
    payrolls_needing_dates integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT p.id)::integer as total_active_payrolls,
        COUNT(pd.id)::integer as total_future_dates,
        AVG(pd.original_eft_date - CURRENT_DATE)::numeric as avg_days_ahead,
        MIN(pd.original_eft_date - CURRENT_DATE)::integer as min_days_ahead,
        MAX(pd.original_eft_date - CURRENT_DATE)::integer as max_days_ahead,
        COUNT(DISTINCT CASE WHEN MAX(pd.original_eft_date) - CURRENT_DATE < 365 THEN p.id END)::integer as payrolls_needing_dates
    FROM payrolls p
    LEFT JOIN payroll_dates pd ON p.id = pd.payroll_id AND pd.original_eft_date > CURRENT_DATE
    WHERE p.active = true;
END;
$$;

-- Grant permissions for cron job access
GRANT EXECUTE ON FUNCTION public.generate_payroll_dates_two_years TO hasura;
GRANT EXECUTE ON FUNCTION public.generate_all_payroll_dates_bulk TO hasura;
GRANT EXECUTE ON FUNCTION public.check_payroll_date_coverage TO hasura;
GRANT EXECUTE ON FUNCTION public.cleanup_old_payroll_dates TO hasura;
GRANT EXECUTE ON FUNCTION public.get_payroll_date_stats TO hasura; 
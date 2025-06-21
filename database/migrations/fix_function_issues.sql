-- Migration: Fix Function Issues
-- Date: 2024-01-01
-- Description: Fix function parameter naming, column mismatches, and improve consistency

-- ============================================================================
-- Fix 1: Fix get_latest_payroll_version function (created_at vs queried_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_latest_payroll_version(payroll_id uuid) 
RETURNS SETOF public.latest_payroll_version_results
LANGUAGE plpgsql
AS $$ 
BEGIN 
    -- Clean up old results (use correct column name: queried_at)
    DELETE FROM latest_payroll_version_results WHERE queried_at < NOW() - INTERVAL '1 hour'; 
    
    -- Insert fresh data with payroll_id for proper tracking
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
    
    -- Return the results
    RETURN QUERY SELECT * FROM latest_payroll_version_results 
    WHERE payroll_id IN (
        SELECT DISTINCT p.id 
        FROM payrolls p 
        WHERE p.id = get_latest_payroll_version.payroll_id OR p.parent_payroll_id = get_latest_payroll_version.payroll_id
    )
    ORDER BY version_number DESC; 
END; 
$$;

-- ============================================================================
-- Fix 2: Update get_payroll_version_history function with camelCase parameter
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_payroll_version_history(payroll_id uuid) 
RETURNS SETOF public.payroll_version_history_results
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
  
  -- Return the results
  RETURN QUERY 
  SELECT * FROM payroll_version_history_results 
  WHERE payroll_id IN (
    SELECT DISTINCT p.id 
    FROM payrolls p 
    WHERE p.id = get_payroll_version_history.payroll_id OR p.parent_payroll_id = get_payroll_version_history.payroll_id
  )
  ORDER BY version_number ASC;
END;
$$;

-- ============================================================================
-- Fix 3: Update generate_payroll_dates function with camelCase parameters
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_payroll_dates(
    payroll_id uuid, 
    start_date date DEFAULT NULL::date, 
    end_date date DEFAULT NULL::date, 
    max_dates integer DEFAULT 52
) 
RETURNS SETOF public.payroll_dates
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
  SELECT * INTO v_payroll_record FROM payrolls WHERE id = payroll_id;
  
  IF v_payroll_record.id IS NULL THEN
    RAISE EXCEPTION 'Payroll with ID % not found', payroll_id;
  END IF;

  -- Get cycle and date type details
  SELECT pc.name INTO v_cycle_name FROM payroll_cycles pc WHERE pc.id = v_payroll_record.cycle_id;
  SELECT pdt.name, pdt.date_value INTO v_date_type_name, v_date_value 
  FROM payroll_date_types pdt WHERE pdt.id = v_payroll_record.date_type_id;
  
  v_processing_days := COALESCE(v_payroll_record.processing_days_before_eft, 3);
  
  -- Set date range
  v_current_date := COALESCE(start_date, CURRENT_DATE);
  
  IF end_date IS NULL THEN
    end_date := v_current_date + INTERVAL '2 years';
  END IF;

  -- Generate dates
  WHILE v_current_date <= end_date AND v_dates_generated < max_dates LOOP
    -- Calculate original EFT date based on cycle and date type
    CASE v_cycle_name
      WHEN 'weekly' THEN
        v_original_eft_date := v_current_date + (v_date_value - EXTRACT(DOW FROM v_current_date))::integer;
      WHEN 'fortnightly' THEN
        v_original_eft_date := v_current_date + (v_date_value - EXTRACT(DOW FROM v_current_date))::integer;
      WHEN 'monthly' THEN
        v_original_eft_date := DATE_TRUNC('MONTH', v_current_date) + (v_date_value - 1) * INTERVAL '1 day';
      ELSE
        v_original_eft_date := v_current_date;
    END CASE;

    -- Adjust for business days
    SELECT adjusted_date, adjustment_reason 
    INTO v_adjusted_eft_date, v_adjustment_reason
    FROM adjust_date_with_reason(v_original_eft_date);
    
    -- Calculate processing date
    v_processing_date := subtract_business_days(v_adjusted_eft_date, v_processing_days);

    -- Insert the record
    INSERT INTO payroll_dates (
      payroll_id, original_eft_date, adjusted_eft_date, processing_date,
      is_adjusted, adjustment_reason, is_business_day
    ) VALUES (
      payroll_id, v_original_eft_date, v_adjusted_eft_date, v_processing_date,
      v_original_eft_date != v_adjusted_eft_date,
      v_adjustment_reason,
      is_business_day(v_adjusted_eft_date)
    )
    ON CONFLICT (payroll_id, original_eft_date) DO UPDATE SET
      adjusted_eft_date = EXCLUDED.adjusted_eft_date,
      processing_date = EXCLUDED.processing_date,
      is_adjusted = EXCLUDED.is_adjusted,
      adjustment_reason = EXCLUDED.adjustment_reason,
      is_business_day = EXCLUDED.is_business_day,
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

-- ============================================================================
-- Fix 4: Keep existing create_payroll_version function but add camelCase alias
-- ============================================================================

-- Create a simplified version with camelCase parameters for GraphQL
CREATE OR REPLACE FUNCTION public.create_payroll_version_simple(
    payroll_id uuid,
    version_reason text DEFAULT 'System Update'::text
) 
RETURNS SETOF public.payroll_version_results
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

-- ============================================================================
-- Fix 5: Update activate_payroll_versions function (no parameters needed)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.activate_payroll_versions() 
RETURNS SETOF public.payroll_activation_results
LANGUAGE plpgsql
AS $$
DECLARE
    r payroll_activation_results%ROWTYPE;
    v_activated_count integer := 0;
BEGIN
    -- Clean up old results
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

-- ============================================================================
-- Additional: Ensure result tables have proper payroll_id tracking
-- ============================================================================

-- Add missing payroll_id column to latest_payroll_version_results if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'latest_payroll_version_results' 
        AND column_name = 'payroll_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.latest_payroll_version_results 
        ADD COLUMN payroll_id uuid NOT NULL DEFAULT gen_random_uuid();
    END IF;
END $$;

-- Ensure all result tables have proper indexes
CREATE INDEX IF NOT EXISTS idx_latest_payroll_version_results_payroll_id 
ON public.latest_payroll_version_results(payroll_id);

CREATE INDEX IF NOT EXISTS idx_latest_payroll_version_results_queried_at 
ON public.latest_payroll_version_results(queried_at);

CREATE INDEX IF NOT EXISTS idx_payroll_version_history_results_payroll_id 
ON public.payroll_version_history_results(payroll_id);

CREATE INDEX IF NOT EXISTS idx_payroll_version_history_results_queried_at 
ON public.payroll_version_history_results(queried_at);

CREATE INDEX IF NOT EXISTS idx_payroll_version_results_created_at 
ON public.payroll_version_results(created_at);

CREATE INDEX IF NOT EXISTS idx_payroll_activation_results_queried_at 
ON public.payroll_activation_results(queried_at);

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON FUNCTION public.get_latest_payroll_version(uuid) IS 
'Returns the latest active version of a payroll. Uses camelCase parameter: payroll_id';

COMMENT ON FUNCTION public.get_payroll_version_history(uuid) IS 
'Returns the complete version history of a payroll. Uses camelCase parameter: payroll_id';

COMMENT ON FUNCTION public.generate_payroll_dates(uuid, date, date, integer) IS 
'Generates payroll dates for a given payroll. Uses camelCase parameters: payroll_id, start_date, end_date, max_dates';

COMMENT ON FUNCTION public.create_payroll_version_simple(uuid, text) IS 
'Creates a new version of an existing payroll (simplified). Uses camelCase parameters: payroll_id, version_reason';

COMMENT ON FUNCTION public.activate_payroll_versions() IS 
'Activates all draft payrolls that have reached their go-live date. No parameters required'; 
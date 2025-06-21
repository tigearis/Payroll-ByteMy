-- Fix generate_payroll_dates function parameter ambiguity
-- This resolves the "column reference 'payroll_id' is ambiguous" error
-- by using p_ prefixed parameter names to avoid conflicts with table column names

DROP FUNCTION IF EXISTS public.generate_payroll_dates(uuid,date,date,integer);

CREATE OR REPLACE FUNCTION public.generate_payroll_dates(
    p_payroll_id uuid, 
    p_start_date date DEFAULT NULL::date, 
    p_end_date date DEFAULT NULL::date, 
    p_max_dates integer DEFAULT 52
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

    -- Insert the record - no ambiguity with p_ prefixed parameters
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

-- Add comment explaining the function
COMMENT ON FUNCTION public.generate_payroll_dates(uuid, date, date, integer) IS 
'Generates payroll dates for a given payroll ID. Parameters use p_ prefix to avoid ambiguity with table column names.'; 
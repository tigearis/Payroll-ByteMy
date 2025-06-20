-- Function to regenerate payroll dates for all payrolls
-- Provides options to delete existing dates and gives summary report

CREATE OR REPLACE FUNCTION public.regenerate_all_payroll_dates(
  p_start_date date DEFAULT '2024-01-01'::date,
  p_end_date date DEFAULT '2026-12-31'::date,
  p_max_dates_per_payroll integer DEFAULT 52,
  p_delete_existing boolean DEFAULT true
) RETURNS TABLE(
  payroll_id uuid,
  payroll_name varchar(255),
  dates_generated integer,
  dates_with_adjustments integer
)
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
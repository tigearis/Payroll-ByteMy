-- Enhanced generate_payroll_dates function with detailed adjustment notes
-- Adds specific holiday names and weekend information to adjustment notes

-- First, create a helper function that returns adjustment details
CREATE OR REPLACE FUNCTION public.adjust_date_with_reason(p_date date, p_rule_code text DEFAULT 'previous'::text) 
RETURNS TABLE(adjusted_date date, adjustment_reason text)
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

-- Now update the main function to use detailed adjustment reasons
CREATE OR REPLACE FUNCTION public.generate_payroll_dates(p_payroll_id uuid, p_start_date date DEFAULT NULL::date, p_end_date date DEFAULT NULL::date, p_max_dates integer DEFAULT 52) RETURNS SETOF public.payroll_dates
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
  v_adjustment_reason text;
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
  WHILE v_current_date <= v_end_calculation_date
  AND v_dates_generated < p_max_dates LOOP 
    -- Reset variables for each iteration
    v_original_eft_date := NULL;
    v_adjusted_eft_date := NULL;
    v_processing_date := NULL;
    v_adjustment_reason := '';
    
    -- Cycle type specific date calculations
    CASE
      v_cycle_name
      WHEN 'weekly' THEN 
        -- Weekly payroll: Ensure date falls on specified weekday
        v_original_eft_date := v_current_date + (
          (
            7 + v_date_value - EXTRACT(
              DOW
              FROM
                v_current_date
            )
          ) % 7
        ) * INTERVAL '1 day';
        
        -- If calculated date is current date, move to next week
        IF v_original_eft_date = v_current_date THEN 
          v_original_eft_date := v_original_eft_date + INTERVAL '7 days';
        END IF;
        
      WHEN 'fortnightly' THEN 
        -- Fortnightly payroll: Determine Week A or Week B
        v_week_of_year := EXTRACT(
          WEEK
          FROM
            v_current_date
        );
        v_is_week_a := (v_week_of_year % 2) = 1; -- Odd weeks are Week A
        
        -- Calculate date based on weekday and week type
        v_original_eft_date := v_current_date + (
          (
            7 + v_date_value - EXTRACT(
              DOW
              FROM
                v_current_date
            )
          ) % 7
        ) * INTERVAL '1 day';
        
        -- For Week B, shift forward by a week
        IF NOT v_is_week_a THEN 
          v_original_eft_date := v_original_eft_date + INTERVAL '7 days';
        END IF;
        
      WHEN 'bi_monthly' THEN 
        -- Bi-monthly payroll: Handle 1st/15th (or 14th in February)
        v_month := EXTRACT(
          MONTH
          FROM
            v_current_date
        );
        v_year := EXTRACT(
          YEAR
          FROM
            v_current_date
        );
        
        -- Special handling for February
        IF v_month = 2 THEN 
          v_mid_month_date := MAKE_DATE(v_year, 2, 14);
          v_end_month_date := MAKE_DATE(v_year, 2, 28);
        ELSE 
          -- Standard months: 15th and end of month
          v_mid_month_date := MAKE_DATE(v_year, v_month, 15);
          v_end_month_date := (
            DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
          ) :: DATE;
        END IF;
        
        -- Set original date based on type, don't adjust here
        IF v_date_type_name = 'som' THEN 
          v_original_eft_date := v_mid_month_date;
        ELSE 
          v_original_eft_date := v_end_month_date;
        END IF;
        
      WHEN 'monthly' THEN 
        -- Monthly payroll: Based on date type
        CASE
          v_date_type_name
          WHEN 'som' THEN 
            -- Start of month - original date stays as 1st
            v_original_eft_date := DATE_TRUNC('MONTH', v_current_date) :: DATE;
          WHEN 'eom' THEN 
            -- End of month - original date stays as last day
            v_original_eft_date := (
              DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
            ) :: DATE;
          WHEN 'fixed_date' THEN 
            -- Fixed date: Create date with specified day - KEEP ORIGINAL DATE
            -- If date_value is not applicable, use a default or specific logic
            IF v_date_value IS NULL THEN 
              v_original_eft_date := MAKE_DATE(
                EXTRACT(
                  YEAR
                  FROM
                    v_current_date
                ) :: int,
                EXTRACT(
                  MONTH
                  FROM
                    v_current_date
                ) :: int,
                15 -- Default to 15th for fixed date if not specified
              );
            ELSE 
              -- Keep original date as the configured day, handle month end gracefully
              BEGIN
                v_original_eft_date := MAKE_DATE(
                  EXTRACT(YEAR FROM v_current_date) :: int,
                  EXTRACT(MONTH FROM v_current_date) :: int,
                  v_date_value
                );
              EXCEPTION
                WHEN OTHERS THEN
                  -- If date is invalid (e.g., Feb 30), use last day of month
                  v_original_eft_date := (
                    DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
                  ) :: DATE;
              END;
            END IF;
        END CASE;
        
      WHEN 'quarterly' THEN 
        -- Quarterly payroll: Only in March, June, September, December
        v_month := EXTRACT(
          MONTH
          FROM
            v_current_date
        );
        IF v_month IN (3, 6, 9, 12) THEN 
          -- Set original date first, then adjust separately
          CASE v_date_type_name
            WHEN 'som' THEN 
              v_original_eft_date := DATE_TRUNC('MONTH', v_current_date) :: DATE;
            WHEN 'eom' THEN 
              v_original_eft_date := (
                DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
              ) :: DATE;
            WHEN 'fixed_date' THEN
              BEGIN
                v_original_eft_date := MAKE_DATE(
                  EXTRACT(YEAR FROM v_current_date) :: int,
                  EXTRACT(MONTH FROM v_current_date) :: int,
                  COALESCE(v_date_value, 1)
                );
              EXCEPTION
                WHEN OTHERS THEN
                  v_original_eft_date := (
                    DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
                  ) :: DATE;
              END;
            ELSE
              -- Default to end of month
              v_original_eft_date := (
                DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month' - INTERVAL '1 day'
              ) :: DATE;
          END CASE;
        ELSE 
          -- Skip to next valid quarter
          v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
          CONTINUE;
        END IF;
        
      ELSE 
        RAISE EXCEPTION 'Unsupported payroll cycle type: %', v_cycle_name;
    END CASE;
    
    -- Get adjusted date and detailed reason using helper function
    SELECT ard.adjusted_date, ard.adjustment_reason 
    INTO v_adjusted_eft_date, v_adjustment_reason
    FROM public.adjust_date_with_reason(v_original_eft_date, COALESCE(v_rule_code, 'previous')) ard;
    
    -- Calculate processing date by subtracting business days
    v_processing_date := subtract_business_days(
      v_adjusted_eft_date,
      v_processing_days_before_eft
    );
    
    -- Insert generated payroll date with enhanced notes
    INSERT INTO
      payroll_dates (
        payroll_id,
        original_eft_date,
        adjusted_eft_date,
        processing_date,
        created_at,
        updated_at,
        notes
      )
    VALUES
      (
        p_payroll_id,
        v_original_eft_date,
        v_adjusted_eft_date,
        v_processing_date,
        NOW(),
        NOW(),
        CASE
          WHEN v_original_eft_date != v_adjusted_eft_date THEN v_adjustment_reason
          ELSE NULL
        END
      ) RETURNING * INTO r;
      
    -- Return the inserted record for Hasura
    RETURN NEXT r;
    
    -- Increment tracking variables
    v_dates_generated := v_dates_generated + 1;
    
    -- Move to next calculation period
    CASE
      v_cycle_name
      WHEN 'weekly' THEN v_current_date := v_original_eft_date + INTERVAL '7 days';
      WHEN 'fortnightly' THEN v_current_date := v_original_eft_date + INTERVAL '14 days';
      WHEN 'bi_monthly' THEN 
        v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
      WHEN 'monthly' THEN v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '1 month';
      WHEN 'quarterly' THEN v_current_date := DATE_TRUNC('MONTH', v_current_date) + INTERVAL '3 months';
      ELSE -- Fallback: increment by 1 month
        v_current_date := v_current_date + INTERVAL '1 month';
    END CASE;
  END LOOP;

EXCEPTION
  WHEN OTHERS THEN 
    RAISE NOTICE 'Error in generate_payroll_dates: %', SQLERRM;
    RAISE;
END;
$$; 
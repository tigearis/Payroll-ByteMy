-- Database triggers for automatic payroll date management during versioning

-- Trigger 1: Auto-delete future dates when a payroll is superseded
CREATE OR REPLACE FUNCTION auto_delete_future_dates_on_supersede()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create the trigger on payrolls table
DROP TRIGGER IF EXISTS trigger_auto_delete_future_dates ON payrolls;
CREATE TRIGGER trigger_auto_delete_future_dates
  AFTER UPDATE ON payrolls
  FOR EACH ROW
  EXECUTE FUNCTION auto_delete_future_dates_on_supersede();

-- Trigger 2: Auto-generate dates when a new payroll is created
CREATE OR REPLACE FUNCTION auto_generate_dates_on_payroll_insert()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create the trigger on payrolls table
DROP TRIGGER IF EXISTS trigger_auto_generate_dates ON payrolls;
CREATE TRIGGER trigger_auto_generate_dates
  AFTER INSERT ON payrolls
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_dates_on_payroll_insert();

-- Trigger 3: Auto-regenerate dates if schedule changes on current payroll
-- (Now activated since we removed the old update_payroll_dates_trigger)
CREATE OR REPLACE FUNCTION auto_regenerate_dates_on_schedule_change()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create the trigger on payrolls table (now activated)
DROP TRIGGER IF EXISTS trigger_auto_regenerate_dates ON payrolls;
CREATE TRIGGER trigger_auto_regenerate_dates
  AFTER UPDATE ON payrolls
  FOR EACH ROW
  EXECUTE FUNCTION auto_regenerate_dates_on_schedule_change();

-- View to check trigger status
CREATE OR REPLACE VIEW payroll_triggers_status AS
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name LIKE '%payroll%' 
  OR trigger_name LIKE '%auto_%'
ORDER BY trigger_name; 
-- Missing Payroll Versioning Functions
-- These functions are needed for the usePayrollVersioning hook to work

-- Function to get payroll version history
CREATE OR REPLACE FUNCTION get_payroll_version_history(p_payroll_id uuid)
RETURNS SETOF payroll_version_history_results AS $$
BEGIN
  -- Clear old results
  DELETE FROM payroll_version_history_results WHERE created_at < NOW() - INTERVAL '1 hour';
  
  -- Insert new results
  INSERT INTO payroll_version_history_results (
    id, name, version_number, go_live_date, superseded_date, 
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
    CASE 
      WHEN p.superseded_date IS NULL AND p.status = 'Active' THEN true 
      ELSE false 
    END as is_current
  FROM payrolls p
  WHERE p.id = p_payroll_id 
     OR p.parent_payroll_id = p_payroll_id 
     OR (p.id = p_payroll_id AND p.parent_payroll_id IS NULL)
     OR (p.parent_payroll_id IN (
       SELECT pr.id FROM payrolls pr WHERE pr.id = p_payroll_id OR pr.parent_payroll_id = p_payroll_id
     ))
  ORDER BY p.version_number ASC;
  
  -- Return results
  RETURN QUERY
  SELECT * FROM payroll_version_history_results 
  WHERE id IN (
    SELECT DISTINCT p.id 
    FROM payrolls p
    WHERE p.id = p_payroll_id 
       OR p.parent_payroll_id = p_payroll_id 
       OR (p.id = p_payroll_id AND p.parent_payroll_id IS NULL)
       OR (p.parent_payroll_id IN (
         SELECT pr.id FROM payrolls pr WHERE pr.id = p_payroll_id OR pr.parent_payroll_id = p_payroll_id
       ))
  )
  ORDER BY version_number ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get latest payroll version
CREATE OR REPLACE FUNCTION get_latest_payroll_version(p_payroll_id uuid)
RETURNS SETOF latest_payroll_version_results AS $$
BEGIN
  -- Clear old results
  DELETE FROM latest_payroll_version_results WHERE created_at < NOW() - INTERVAL '1 hour';
  
  -- Insert new results
  INSERT INTO latest_payroll_version_results (
    id, name, version_number, go_live_date, active
  )
  SELECT 
    p.id,
    p.name,
    p.version_number,
    p.go_live_date,
    CASE WHEN p.status = 'Active' THEN true ELSE false END as active
  FROM payrolls p
  WHERE (p.id = p_payroll_id OR p.parent_payroll_id = p_payroll_id)
    AND p.status = 'Active'
    AND p.superseded_date IS NULL
  ORDER BY p.version_number DESC
  LIMIT 1;
  
  -- Return results
  RETURN QUERY
  SELECT * FROM latest_payroll_version_results 
  ORDER BY version_number DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to activate payroll versions
CREATE OR REPLACE FUNCTION activate_payroll_versions()
RETURNS SETOF payroll_activation_results AS $$
DECLARE
  activated_count integer := 0;
  result_record payroll_activation_results;
BEGIN
  -- Clear old results
  DELETE FROM payroll_activation_results WHERE created_at < NOW() - INTERVAL '1 hour';
  
  -- Update payrolls that should be activated (go_live_date <= today and not superseded)
  UPDATE payrolls 
  SET status = 'Active'
  WHERE go_live_date <= CURRENT_DATE 
    AND superseded_date IS NULL
    AND status != 'Active';
    
  GET DIAGNOSTICS activated_count = ROW_COUNT;
  
  -- Update superseded payrolls to inactive
  UPDATE payrolls 
  SET status = 'Inactive'
  WHERE superseded_date IS NOT NULL
    AND superseded_date <= CURRENT_DATE
    AND status = 'Active';
  
  -- Insert result
  INSERT INTO payroll_activation_results (
    activated_count, message
  ) VALUES (
    activated_count,
    CASE 
      WHEN activated_count > 0 THEN 
        'Activated ' || activated_count || ' payroll versions'
      ELSE 
        'No payroll versions needed activation'
    END
  ) RETURNING * INTO result_record;
  
  -- Return results
  RETURN QUERY
  SELECT * FROM payroll_activation_results;
END;
$$ LANGUAGE plpgsql; 
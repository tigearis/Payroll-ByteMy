-- Migration: Fix Function Column Ambiguity
-- Date: 2024-01-01
-- Description: Fix ambiguous column references in functions

-- ============================================================================
-- Fix get_latest_payroll_version function - remove ambiguous payroll_id reference
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_latest_payroll_version(payroll_id uuid) 
RETURNS SETOF public.latest_payroll_version_results
LANGUAGE plpgsql
AS $$ 
BEGIN 
    -- Clean up old results (use correct column name: queried_at)
    DELETE FROM latest_payroll_version_results WHERE queried_at < NOW() - INTERVAL '1 hour'; 
    
    -- Insert fresh data - use table alias to avoid ambiguity
    INSERT INTO latest_payroll_version_results (id, name, version_number, go_live_date, active) 
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
    
    -- Return the results - no WHERE clause with payroll_id to avoid ambiguity
    RETURN QUERY SELECT * FROM latest_payroll_version_results 
    ORDER BY queried_at DESC, version_number DESC
    LIMIT 1; 
END; 
$$;

-- ============================================================================
-- Fix get_payroll_version_history function - remove ambiguous payroll_id reference
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
  
  -- Return the results - use table alias to avoid ambiguity
  RETURN QUERY 
  SELECT * FROM payroll_version_history_results pvhr
  WHERE pvhr.payroll_id IN (
    SELECT DISTINCT p.id 
    FROM payrolls p 
    WHERE p.id = get_payroll_version_history.payroll_id OR p.parent_payroll_id = get_payroll_version_history.payroll_id
  )
  ORDER BY pvhr.version_number ASC;
END;
$$; 
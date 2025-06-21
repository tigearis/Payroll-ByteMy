-- Migration: Fix Function payroll_id insertion
-- Date: 2024-01-01
-- Description: Fix missing payroll_id in function INSERT statements

-- ============================================================================
-- Fix get_latest_payroll_version function - include payroll_id in INSERT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_latest_payroll_version(payroll_id uuid) 
RETURNS SETOF public.latest_payroll_version_results
LANGUAGE plpgsql
AS $$ 
BEGIN 
    -- Clean up old results (use correct column name: queried_at)
    DELETE FROM latest_payroll_version_results WHERE queried_at < NOW() - INTERVAL '1 hour'; 
    
    -- Insert fresh data - include payroll_id
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
    
    -- Return the results - filter by the specific payroll_id we just inserted
    RETURN QUERY SELECT * FROM latest_payroll_version_results lvpr
    WHERE lvpr.payroll_id IN (
        SELECT DISTINCT p.id 
        FROM payrolls p 
        WHERE p.id = get_latest_payroll_version.payroll_id OR p.parent_payroll_id = get_latest_payroll_version.payroll_id
    )
    ORDER BY lvpr.queried_at DESC, lvpr.version_number DESC
    LIMIT 1; 
END; 
$$; 
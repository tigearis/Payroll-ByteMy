-- Simple cleanup script to reset payroll versioning to fresh state
-- This will remove all child versions and keep only root payrolls

-- Show current state before cleanup
SELECT 
  'BEFORE CLEANUP' as status,
  CASE 
    WHEN parent_payroll_id IS NULL THEN 'Root Payroll'
    ELSE 'Child Version'
  END as payroll_type,
  COUNT(*) as count,
  COUNT(CASE WHEN superseded_date IS NOT NULL THEN 1 END) as superseded_count
FROM payrolls 
GROUP BY 
  CASE 
    WHEN parent_payroll_id IS NULL THEN 'Root Payroll'
    ELSE 'Child Version'
  END;

-- Show child payrolls that will be deleted
SELECT 
  'Child payrolls to be deleted:' as info,
  id, 
  name, 
  version_number, 
  parent_payroll_id 
FROM payrolls 
WHERE parent_payroll_id IS NOT NULL;

-- Delete payroll dates for child payrolls
DELETE FROM payroll_dates 
WHERE payroll_id IN (
  SELECT id FROM payrolls WHERE parent_payroll_id IS NOT NULL
);

-- Delete child payroll versions
DELETE FROM payrolls 
WHERE parent_payroll_id IS NOT NULL;

-- Reset superseded_date to NULL for all remaining payrolls (make them current)
UPDATE payrolls 
SET superseded_date = NULL, version_number = 1
WHERE superseded_date IS NOT NULL OR version_number != 1;

-- Clean up any orphaned records in temporary tables
DELETE FROM payroll_version_history_results;
DELETE FROM latest_payroll_version_results;

-- Show final state
SELECT 
  'AFTER CLEANUP' as status,
  id,
  name,
  version_number,
  parent_payroll_id,
  superseded_date,
  status,
  go_live_date
FROM payrolls 
ORDER BY name;

-- Show payroll dates count
SELECT 
  'Payroll dates remaining per payroll:' as info,
  p.name,
  COUNT(pd.id) as date_count
FROM payrolls p
LEFT JOIN payroll_dates pd ON p.id = pd.payroll_id
GROUP BY p.id, p.name
ORDER BY p.name;

-- Final summary
SELECT 
  'FINAL SUMMARY' as status,
  COUNT(*) as total_payrolls,
  COUNT(CASE WHEN parent_payroll_id IS NULL THEN 1 END) as root_payrolls,
  COUNT(CASE WHEN parent_payroll_id IS NOT NULL THEN 1 END) as child_versions,
  COUNT(CASE WHEN superseded_date IS NOT NULL THEN 1 END) as superseded_payrolls,
  COUNT(CASE WHEN version_number = 1 THEN 1 END) as version_1_payrolls
FROM payrolls; 
-- Fix billing data quality issues
-- This script addresses null values that cause GraphQL errors

-- 1. Fix billing_plan table - ensure required fields have values
UPDATE billing_plan 
SET 
    billing_unit = COALESCE(billing_unit, 'Per Payroll'),
    category = COALESCE(category, 'Processing'),
    is_active = COALESCE(is_active, true),
    currency = COALESCE(currency, 'AUD'),
    name = COALESCE(name, 'Unknown Service'),
    standard_rate = COALESCE(standard_rate, 0)
WHERE 
    billing_unit IS NULL 
    OR category IS NULL 
    OR is_active IS NULL 
    OR currency IS NULL 
    OR name IS NULL 
    OR standard_rate IS NULL;

-- 2. Fix client_billing_assignment table - ensure required fields have values
UPDATE client_billing_assignment 
SET 
    billing_frequency = COALESCE(billing_frequency, 'Per Job'),
    effective_date = COALESCE(effective_date, CURRENT_DATE),
    is_enabled = COALESCE(is_enabled, true),
    is_active = COALESCE(is_active, true),
    start_date = COALESCE(start_date, CURRENT_DATE)
WHERE 
    billing_frequency IS NULL 
    OR effective_date IS NULL 
    OR is_enabled IS NULL 
    OR is_active IS NULL 
    OR start_date IS NULL;

-- 3. Check for any orphaned relationships
-- Remove client_billing_assignments that reference non-existent billing_plans
DELETE FROM client_billing_assignment 
WHERE billing_plan_id NOT IN (SELECT id FROM billing_plan);

-- Remove client_billing_assignments that reference non-existent clients
DELETE FROM client_billing_assignment 
WHERE client_id NOT IN (SELECT id FROM clients);

-- 4. Add sample billing plans if none exist
INSERT INTO billing_plan (id, name, description, standard_rate, billing_unit, category, is_active, currency)
SELECT 
    gen_random_uuid(),
    'Standard Payroll Processing',
    'Standard payroll processing service',
    150.00,
    'Per Payroll',
    'Processing',
    true,
    'AUD'
WHERE NOT EXISTS (SELECT 1 FROM billing_plan WHERE name = 'Standard Payroll Processing');

INSERT INTO billing_plan (id, name, description, standard_rate, billing_unit, category, is_active, currency)
SELECT 
    gen_random_uuid(),
    'Employee Management',
    'Employee onboarding and management',
    50.00,
    'Per Employee',
    'Employee Management',
    true,
    'AUD'
WHERE NOT EXISTS (SELECT 1 FROM billing_plan WHERE name = 'Employee Management');

-- 5. Show current data quality status
SELECT 
    'billing_plan' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN name IS NULL THEN 1 END) as null_names,
    COUNT(CASE WHEN billing_unit IS NULL THEN 1 END) as null_billing_units,
    COUNT(CASE WHEN category IS NULL THEN 1 END) as null_categories
FROM billing_plan

UNION ALL

SELECT 
    'client_billing_assignment' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN billing_frequency IS NULL THEN 1 END) as null_billing_frequency,
    COUNT(CASE WHEN effective_date IS NULL THEN 1 END) as null_effective_date,
    COUNT(CASE WHEN start_date IS NULL THEN 1 END) as null_start_date
FROM client_billing_assignment;
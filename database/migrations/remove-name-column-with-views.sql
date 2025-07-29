-- Migration: Remove old 'name' column from users table
-- This completes the migration to firstName/lastName structure
-- Date: 2025-07-28
-- Prerequisites: All application code must be using firstName/lastName/computedName

BEGIN;

-- Safety check: Ensure the new columns exist and are populated
DO $$
BEGIN
    -- Check if first_name and last_name columns exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'first_name'
    ) THEN
        RAISE EXCEPTION 'first_name column does not exist. Migration cannot proceed.';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_name'
    ) THEN
        RAISE EXCEPTION 'last_name column does not exist. Migration cannot proceed.';
    END IF;

    -- Check if computed_name column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'computed_name'
    ) THEN
        RAISE EXCEPTION 'computed_name column does not exist. Migration cannot proceed.';
    END IF;

    -- Check that new columns are populated (no null values where name was not null)
    IF EXISTS (
        SELECT 1 FROM users 
        WHERE name IS NOT NULL 
        AND (first_name IS NULL OR last_name IS NULL)
    ) THEN
        RAISE EXCEPTION 'Some users have name but missing first_name or last_name. Data migration incomplete.';
    END IF;

    RAISE NOTICE 'Safety checks passed. Proceeding with view updates and name column removal.';
END $$;

-- Create a backup of the name column data for safety
CREATE TABLE IF NOT EXISTS users_name_backup AS
SELECT id, name, first_name, last_name, computed_name, created_at
FROM users
WHERE name IS NOT NULL;

-- Step 1: Update the consultant_capacity_overview view
DROP VIEW IF EXISTS consultant_capacity_overview;
CREATE VIEW consultant_capacity_overview AS
SELECT 
    u.id,
    u.computed_name AS name,  -- Use computed_name instead of name
    u.email,
    u."position",
    u.default_admin_time_percentage,
    ws.work_day,
    ws.work_hours,
    ws.admin_time_hours,
    ws.payroll_capacity_hours,
    ws.uses_default_admin_time,
    CASE
        WHEN (ws.work_hours > (0)::numeric) THEN ((ws.admin_time_hours / ws.work_hours) * (100)::numeric)
        ELSE (0)::numeric
    END AS admin_time_percentage_actual
FROM (users u
    LEFT JOIN work_schedule ws ON ((u.id = ws.user_id)))
WHERE (u.is_staff = true);

-- Step 2: Update the audit.user_access_summary view
DROP VIEW IF EXISTS audit.user_access_summary;
CREATE VIEW audit.user_access_summary AS
SELECT 
    u.id,
    u.computed_name AS name,  -- Use computed_name instead of name
    u.email,
    u.role,
    u.created_at,
    u.updated_at,
    u.is_staff,
    u.is_active
FROM users u;

-- Step 3: Update the staff_billing_performance view
DROP VIEW IF EXISTS staff_billing_performance;
CREATE VIEW staff_billing_performance AS
SELECT 
    u.id AS staff_id,
    u.computed_name AS staff_name,  -- Use computed_name instead of name
    count(DISTINCT bi.payroll_id) AS payrolls_worked,
    count(DISTINCT bi.id) AS billing_items_created,
    COALESCE(sum(bi.amount), (0)::numeric) AS total_revenue_generated,
    COALESCE(sum(te.hours_spent), (0)::numeric) AS total_hours_logged,
    CASE
        WHEN (sum(te.hours_spent) > (0)::numeric) THEN (COALESCE(sum(bi.amount), (0)::numeric) / sum(te.hours_spent))
        ELSE (0)::numeric
    END AS revenue_per_hour,
    count(DISTINCT bi.payroll_id) AS distinct_clients_served
FROM ((users u
    LEFT JOIN billing_items bi ON (((u.id = bi.staff_user_id) AND ((bi.status)::text <> 'draft'::text))))
    LEFT JOIN time_entries te ON ((u.id = te.staff_user_id)))
WHERE (u.id IN ( SELECT DISTINCT billing_items.staff_user_id
        FROM billing_items
        WHERE (billing_items.staff_user_id IS NOT NULL)))
GROUP BY u.id, u.computed_name;  -- Use computed_name instead of name

-- Step 4: Now remove the old name column
ALTER TABLE users DROP COLUMN name;

-- Update any remaining indexes that might reference the old column
DROP INDEX IF EXISTS idx_users_name;
DROP INDEX IF EXISTS users_name_idx;

-- Verify the migration
DO $$
DECLARE
    backup_count INTEGER;
BEGIN
    -- Get backup count
    SELECT COUNT(*) INTO backup_count FROM users_name_backup;
    RAISE NOTICE 'Created backup table users_name_backup with % rows', backup_count;

    -- Confirm the name column is gone
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'name'
    ) THEN
        RAISE EXCEPTION 'name column still exists after attempted removal';
    END IF;

    -- Confirm new columns are still there
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'first_name'
    ) OR NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_name'
    ) OR NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'computed_name'
    ) THEN
        RAISE EXCEPTION 'New name columns are missing after migration';
    END IF;

    -- Verify views were updated correctly
    IF NOT EXISTS (
        SELECT 1 FROM pg_views 
        WHERE viewname = 'consultant_capacity_overview'
    ) THEN
        RAISE EXCEPTION 'consultant_capacity_overview view was not recreated';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_views 
        WHERE viewname = 'user_access_summary' AND schemaname = 'audit'
    ) THEN
        RAISE EXCEPTION 'audit.user_access_summary view was not recreated';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_views 
        WHERE viewname = 'staff_billing_performance'
    ) THEN
        RAISE EXCEPTION 'staff_billing_performance view was not recreated';
    END IF;

    RAISE NOTICE 'Successfully removed name column from users table';
    RAISE NOTICE 'Successfully updated all dependent views';
    RAISE NOTICE 'Migration verification successful';
END $$;

COMMIT;
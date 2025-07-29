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

    RAISE NOTICE 'Safety checks passed. Proceeding with name column removal.';
END $$;

-- Create a backup of the name column data for safety
CREATE TABLE IF NOT EXISTS users_name_backup AS
SELECT id, name, first_name, last_name, computed_name, created_at
FROM users
WHERE name IS NOT NULL;

-- Remove the old name column
ALTER TABLE users DROP COLUMN IF EXISTS name;

-- Update any remaining indexes that might reference the old column
-- (Most should already be updated, but this ensures cleanup)
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

    RAISE NOTICE 'Successfully removed name column from users table';
    RAISE NOTICE 'Migration verification successful';
END $$;

COMMIT;
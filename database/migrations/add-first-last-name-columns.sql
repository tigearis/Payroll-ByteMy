-- Migration: Add first_name and last_name columns to users table
-- This aligns our database schema with Clerk's firstName/lastName fields
-- Date: 2025-01-28

BEGIN;

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255);

-- Create an index for performance on name searches
CREATE INDEX idx_users_first_name ON users(first_name);
CREATE INDEX idx_users_last_name ON users(last_name);
CREATE INDEX idx_users_full_name ON users(first_name, last_name);

-- Split existing name field into first_name and last_name
-- This handles the most common patterns:
-- "First Last" -> first_name: "First", last_name: "Last"
-- "First Middle Last" -> first_name: "First", last_name: "Middle Last"
-- "First" -> first_name: "First", last_name: ""
UPDATE users 
SET 
    first_name = CASE 
        WHEN position(' ' in name) > 0 
        THEN trim(substring(name from 1 for position(' ' in name) - 1))
        ELSE trim(name)
    END,
    last_name = CASE 
        WHEN position(' ' in name) > 0 
        THEN trim(substring(name from position(' ' in name) + 1))
        ELSE ''
    END
WHERE name IS NOT NULL;

-- Handle edge cases where name is null or empty
UPDATE users 
SET 
    first_name = COALESCE(first_name, ''),
    last_name = COALESCE(last_name, '')
WHERE first_name IS NULL OR last_name IS NULL;

-- Add NOT NULL constraints after populating the data
ALTER TABLE users 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;

-- Add default values for future inserts
ALTER TABLE users 
ALTER COLUMN first_name SET DEFAULT '',
ALTER COLUMN last_name SET DEFAULT '';

-- Create a computed column for full name (for backwards compatibility during transition)
-- This will be removed in a future migration once all code is updated
CREATE OR REPLACE FUNCTION users_computed_full_name(first_name text, last_name text) 
RETURNS text AS $$
BEGIN
    RETURN trim(concat(first_name, ' ', last_name));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add a generated column for full name (PostgreSQL 12+)
-- This maintains backwards compatibility while we transition the codebase
ALTER TABLE users 
ADD COLUMN computed_name text GENERATED ALWAYS AS (
    users_computed_full_name(first_name, last_name)
) STORED;

-- Create index on computed name for searches
CREATE INDEX idx_users_computed_name ON users(computed_name);

COMMIT;

-- Verification queries (run these after migration)
-- SELECT id, name, first_name, last_name, computed_name FROM users LIMIT 10;
-- SELECT COUNT(*) FROM users WHERE first_name IS NULL OR last_name IS NULL;
-- SELECT COUNT(*) FROM users WHERE trim(first_name) = '' AND trim(last_name) = '';
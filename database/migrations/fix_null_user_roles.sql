-- Fix users with null roles by setting them to 'viewer' (the default role)
-- This addresses the GraphQL error: "unexpected null value for type 'user_role'"

-- First, check how many users have null roles
SELECT COUNT(*) as null_role_count
FROM users
WHERE role IS NULL;

-- Update all users with null roles to 'viewer'
UPDATE users
SET 
    role = 'viewer',
    updated_at = NOW()
WHERE role IS NULL;

-- Verify the update
SELECT id, name, email, role, is_active
FROM users
WHERE role = 'viewer'
ORDER BY updated_at DESC
LIMIT 10;

-- Add a check constraint to prevent future null roles (optional)
-- This ensures data integrity going forward
-- ALTER TABLE users
-- ADD CONSTRAINT users_role_not_null CHECK (role IS NOT NULL);
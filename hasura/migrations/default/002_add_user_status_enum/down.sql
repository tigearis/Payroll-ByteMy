-- Remove triggers
DROP TRIGGER IF EXISTS audit_user_status_change_trigger ON users;
DROP TRIGGER IF EXISTS update_user_status_trigger ON users;

-- Remove functions
DROP FUNCTION IF EXISTS audit_user_status_change();
DROP FUNCTION IF EXISTS update_user_status_changed_at();

-- Remove constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_isactive_consistency;

-- Remove indexes
DROP INDEX IF EXISTS idx_users_status_changed_at;
DROP INDEX IF EXISTS idx_users_status;

-- Remove columns from users table
ALTER TABLE users 
DROP COLUMN IF EXISTS status_change_reason,
DROP COLUMN IF EXISTS status_changed_by,
DROP COLUMN IF EXISTS status_changed_at,
DROP COLUMN IF EXISTS status;

-- Drop enum type
DROP TYPE IF EXISTS user_status_enum;
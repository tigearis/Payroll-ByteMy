-- Migration to add soft deletion fields to users table
-- This allows us to deactivate users while preserving audit trails

ALTER TABLE payroll_db.users 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true NOT NULL;

ALTER TABLE payroll_db.users 
ADD COLUMN IF NOT EXISTS deactivated_at timestamp with time zone;

ALTER TABLE payroll_db.users 
ADD COLUMN IF NOT EXISTS deactivated_by text;

-- Add comments for documentation
COMMENT ON COLUMN payroll_db.users.is_active IS 'Whether the user is active in the system';
COMMENT ON COLUMN payroll_db.users.deactivated_at IS 'Timestamp when user was deactivated';
COMMENT ON COLUMN payroll_db.users.deactivated_by IS 'ID of the user who performed the deactivation';

-- Create index for efficient queries on active users
CREATE INDEX IF NOT EXISTS idx_users_is_active ON payroll_db.users (is_active);

-- Create index for audit queries
CREATE INDEX IF NOT EXISTS idx_users_deactivated_at ON payroll_db.users (deactivated_at) WHERE deactivated_at IS NOT NULL; 
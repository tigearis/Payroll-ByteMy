-- Create user status enum
CREATE TYPE user_status_enum AS ENUM ('pending', 'active', 'inactive', 'locked');

-- Add status column to users table with default 'active' for existing users
ALTER TABLE users 
ADD COLUMN status user_status_enum DEFAULT 'active' NOT NULL;

-- Add status change audit fields
ALTER TABLE users 
ADD COLUMN status_changed_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN status_changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN status_change_reason TEXT;

-- Create index for performance
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_status_changed_at ON users(status_changed_at);

-- Update existing inactive users to have 'inactive' status
UPDATE users 
SET status = 'inactive', 
    status_changed_at = deactivated_at,
    status_change_reason = 'Migration: existing inactive user'
WHERE is_active = false AND deactivated_at IS NOT NULL;

-- Create trigger to update status_changed_at when status changes
CREATE OR REPLACE FUNCTION update_user_status_changed_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.status_changed_at = NOW();
        
        -- If status_changed_by is not set, try to get from Hasura context
        IF NEW.status_changed_by IS NULL THEN
            BEGIN
                NEW.status_changed_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid;
            EXCEPTION WHEN OTHERS THEN
                -- If no user context available, leave as NULL
                NULL;
            END;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_status_trigger 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_status_changed_at();

-- Add constraint to ensure isActive field matches status
-- Active users should have isActive = true, others should have isActive = false
ALTER TABLE users 
ADD CONSTRAINT users_status_isactive_consistency 
CHECK (
    (status = 'active' AND is_active = true) OR 
    (status != 'active' AND is_active = false)
);

-- Create audit function for status changes
CREATE OR REPLACE FUNCTION audit_user_status_change()
RETURNS TRIGGER AS $$
DECLARE
    audit_data jsonb;
    changed_by_user_id uuid;
BEGIN
    -- Only audit if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Get the user making the change
        BEGIN
            changed_by_user_id = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid;
        EXCEPTION WHEN OTHERS THEN
            changed_by_user_id = NULL;
        END;
        
        -- Build audit data
        audit_data = jsonb_build_object(
            'user_id', NEW.id,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'changed_by', changed_by_user_id,
            'change_reason', NEW.status_change_reason,
            'changed_at', NOW()
        );
        
        -- Insert audit log (using existing audit_log table structure)
        INSERT INTO audit.audit_log (
            user_id,
            action,
            resource_type,
            resource_id,
            old_values,
            new_values,
            metadata,
            event_time,
            ip_address,
            user_agent
        ) VALUES (
            COALESCE(changed_by_user_id, NEW.id),
            'user_status_change',
            'user',
            NEW.id::text,
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            audit_data,
            NOW(),
            'system', -- Will be updated by application layer if available
            'database_trigger'
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER audit_user_status_change_trigger 
    AFTER UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION audit_user_status_change();

-- Add comments
COMMENT ON TYPE user_status_enum IS 'User status states: pending (awaiting invitation acceptance), active (normal operation), inactive (soft deleted), locked (admin restricted)';
COMMENT ON COLUMN users.status IS 'Current user status - must be consistent with isActive field';
COMMENT ON COLUMN users.status_changed_at IS 'Timestamp when status was last changed';
COMMENT ON COLUMN users.status_changed_by IS 'User ID who changed the status';
COMMENT ON COLUMN users.status_change_reason IS 'Reason for the status change (for audit purposes)';
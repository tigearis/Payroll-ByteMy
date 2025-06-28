-- Phase 1: User Status Management and Enhanced Invitations
-- Apply directly to Neon database, then reload Hasura metadata

-- ================================
-- 1. CREATE USER STATUS ENUM
-- ================================

-- Create user status enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_enum') THEN
        CREATE TYPE user_status_enum AS ENUM ('pending', 'active', 'inactive', 'locked');
    END IF;
END $$;

-- Add status column to users table with default 'active' for existing users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status user_status_enum DEFAULT 'active' NOT NULL;
    END IF;
END $$;

-- Add status change audit fields
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status_changed_at') THEN
        ALTER TABLE users ADD COLUMN status_changed_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status_changed_by') THEN
        ALTER TABLE users ADD COLUMN status_changed_by UUID REFERENCES users(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status_change_reason') THEN
        ALTER TABLE users ADD COLUMN status_change_reason TEXT;
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_status_changed_at ON users(status_changed_at);

-- Update existing inactive users to have 'inactive' status
UPDATE users 
SET status = 'inactive', 
    status_changed_at = deactivated_at,
    status_change_reason = 'Migration: existing inactive user'
WHERE is_active = false AND deactivated_at IS NOT NULL AND status = 'active';

-- ================================
-- 2. CREATE USER STATUS TRIGGERS
-- ================================

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
                NEW.status_changed_by = (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid;
            EXCEPTION WHEN OTHERS THEN
                -- If no user context available, leave as NULL
                NULL;
            END;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_user_status_trigger ON users;
CREATE TRIGGER update_user_status_trigger 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_status_changed_at();

-- ================================
-- 3. CREATE USER STATUS AUDIT
-- ================================

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
            changed_by_user_id = (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid;
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

-- Create audit trigger
DROP TRIGGER IF EXISTS audit_user_status_change_trigger ON users;
CREATE TRIGGER audit_user_status_change_trigger 
    AFTER UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION audit_user_status_change();

-- ================================
-- 4. ENHANCE USER INVITATIONS
-- ================================

-- Create invitation status enum for better type safety
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitation_status_enum') THEN
        CREATE TYPE invitation_status_enum AS ENUM ('pending', 'accepted', 'expired', 'revoked', 'cancelled');
    END IF;
END $$;

-- Add new columns to user_invitations table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_invitations' AND column_name = 'invitation_status') THEN
        ALTER TABLE user_invitations ADD COLUMN invitation_status invitation_status_enum DEFAULT 'pending' NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_invitations' AND column_name = 'revoked_at') THEN
        ALTER TABLE user_invitations ADD COLUMN revoked_at TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_invitations' AND column_name = 'revoked_by') THEN
        ALTER TABLE user_invitations ADD COLUMN revoked_by UUID REFERENCES users(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_invitations' AND column_name = 'revoke_reason') THEN
        ALTER TABLE user_invitations ADD COLUMN revoke_reason TEXT;
    END IF;
END $$;

-- Update existing records to use enum values
UPDATE user_invitations 
SET invitation_status = status::invitation_status_enum 
WHERE status IN ('pending', 'accepted', 'expired', 'cancelled') AND invitation_status = 'pending';

-- Handle 'cancelled' -> 'revoked' mapping for consistency
UPDATE user_invitations 
SET invitation_status = 'revoked' 
WHERE status = 'cancelled' AND invitation_status = 'pending';

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_user_invitations_invitation_status ON user_invitations(invitation_status);
CREATE INDEX IF NOT EXISTS idx_user_invitations_revoked_at ON user_invitations(revoked_at);
CREATE INDEX IF NOT EXISTS idx_user_invitations_revoked_by ON user_invitations(revoked_by);

-- ================================
-- 5. INVITATION STATUS TRIGGERS
-- ================================

-- Create trigger to update invitation metadata on status change
CREATE OR REPLACE FUNCTION update_invitation_status_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status change tracking
    IF OLD.invitation_status IS DISTINCT FROM NEW.invitation_status THEN
        -- Update the invitation_metadata with status change info
        NEW.invitation_metadata = COALESCE(NEW.invitation_metadata, '{}'::jsonb) || 
            jsonb_build_object(
                'status_history', 
                COALESCE(OLD.invitation_metadata->'status_history', '[]'::jsonb) ||
                jsonb_build_object(
                    'from_status', OLD.invitation_status,
                    'to_status', NEW.invitation_status,
                    'changed_at', NOW(),
                    'changed_by', COALESCE(
                        NEW.revoked_by,
                        (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid
                    )
                )
            );
        
        -- Set revoked fields if status changed to revoked
        IF NEW.invitation_status = 'revoked' AND OLD.invitation_status != 'revoked' THEN
            NEW.revoked_at = NOW();
            
            -- Try to get user from context if not already set
            IF NEW.revoked_by IS NULL THEN
                BEGIN
                    NEW.revoked_by = (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid;
                EXCEPTION WHEN OTHERS THEN
                    -- If no user context available, leave as NULL
                    NULL;
                END;
            END IF;
        END IF;
        
        -- Set accepted_at if status changed to accepted
        IF NEW.invitation_status = 'accepted' AND OLD.invitation_status != 'accepted' THEN
            NEW.accepted_at = NOW();
            
            -- Try to get user from context if not already set
            IF NEW.accepted_by IS NULL THEN
                BEGIN
                    NEW.accepted_by = (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid;
                EXCEPTION WHEN OTHERS THEN
                    NULL;
                END;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create invitation status trigger
DROP TRIGGER IF EXISTS update_invitation_status_metadata_trigger ON user_invitations;
CREATE TRIGGER update_invitation_status_metadata_trigger 
    BEFORE UPDATE ON user_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_invitation_status_metadata();

-- ================================
-- 6. INVITATION AUDIT TRIGGERS
-- ================================

-- Create audit function for invitation status changes
CREATE OR REPLACE FUNCTION audit_invitation_status_change()
RETURNS TRIGGER AS $$
DECLARE
    audit_data jsonb;
    changed_by_user_id uuid;
BEGIN
    -- Only audit if status actually changed
    IF OLD.invitation_status IS DISTINCT FROM NEW.invitation_status THEN
        -- Get the user making the change
        BEGIN
            changed_by_user_id = COALESCE(
                NEW.revoked_by,
                NEW.accepted_by,
                (current_setting('hasura.user', true)::json->>'x-hasura-user-id')::uuid
            );
        EXCEPTION WHEN OTHERS THEN
            changed_by_user_id = NULL;
        END;
        
        -- Build audit data
        audit_data = jsonb_build_object(
            'invitation_id', NEW.id,
            'email', NEW.email,
            'old_status', OLD.invitation_status,
            'new_status', NEW.invitation_status,
            'changed_by', changed_by_user_id,
            'invited_by', NEW.invited_by,
            'change_reason', NEW.revoke_reason,
            'changed_at', NOW()
        );
        
        -- Insert audit log
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
            COALESCE(changed_by_user_id, NEW.invited_by),
            'invitation_status_change',
            'user_invitation',
            NEW.id::text,
            jsonb_build_object('status', OLD.invitation_status),
            jsonb_build_object('status', NEW.invitation_status),
            audit_data,
            NOW(),
            'system',
            'database_trigger'
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create invitation audit trigger
DROP TRIGGER IF EXISTS audit_invitation_status_change_trigger ON user_invitations;
CREATE TRIGGER audit_invitation_status_change_trigger 
    AFTER UPDATE ON user_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION audit_invitation_status_change();

-- ================================
-- 7. ADD COMMENTS
-- ================================

COMMENT ON TYPE user_status_enum IS 'User status states: pending (awaiting invitation acceptance), active (normal operation), inactive (soft deleted), locked (admin restricted)';
COMMENT ON COLUMN users.status IS 'Current user status - must be consistent with is_active field';
COMMENT ON COLUMN users.status_changed_at IS 'Timestamp when status was last changed';
COMMENT ON COLUMN users.status_changed_by IS 'User ID who changed the status';
COMMENT ON COLUMN users.status_change_reason IS 'Reason for the status change (for audit purposes)';

COMMENT ON TYPE invitation_status_enum IS 'Invitation status states: pending, accepted, expired, revoked, cancelled';
COMMENT ON COLUMN user_invitations.invitation_status IS 'Current invitation status using enum type';
COMMENT ON COLUMN user_invitations.revoked_at IS 'Timestamp when invitation was revoked';
COMMENT ON COLUMN user_invitations.revoked_by IS 'User who revoked the invitation';
COMMENT ON COLUMN user_invitations.revoke_reason IS 'Reason for revoking the invitation';

-- ================================
-- 8. COMPLETION MESSAGE
-- ================================

DO $$ 
BEGIN
    RAISE NOTICE 'Phase 1 schema changes completed successfully:';
    RAISE NOTICE '- User status enum and fields added';
    RAISE NOTICE '- User status change triggers and audit logging enabled';
    RAISE NOTICE '- User invitations enhanced with status enum and revocation tracking';
    RAISE NOTICE '- Invitation status change triggers and audit logging enabled';
    RAISE NOTICE 'Next: Reload Hasura metadata to expose new fields to GraphQL';
END $$;
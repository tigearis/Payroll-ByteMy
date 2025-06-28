-- Create invitation status enum for better type safety
CREATE TYPE invitation_status_enum AS ENUM ('pending', 'accepted', 'expired', 'revoked', 'cancelled');

-- Add new columns to user_invitations table
ALTER TABLE user_invitations 
ADD COLUMN invitation_status invitation_status_enum DEFAULT 'pending' NOT NULL,
ADD COLUMN revoked_at TIMESTAMPTZ,
ADD COLUMN revoked_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN revoke_reason TEXT;

-- Update existing records to use enum values
UPDATE user_invitations 
SET invitation_status = status::invitation_status_enum 
WHERE status IN ('pending', 'accepted', 'expired', 'cancelled');

-- Handle 'cancelled' -> 'revoked' mapping for consistency
UPDATE user_invitations 
SET invitation_status = 'revoked' 
WHERE status = 'cancelled';

-- Add indexes for new columns
CREATE INDEX idx_user_invitations_invitation_status ON user_invitations(invitation_status);
CREATE INDEX idx_user_invitations_revoked_at ON user_invitations(revoked_at);
CREATE INDEX idx_user_invitations_revoked_by ON user_invitations(revoked_by);

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
                    NEW.revoked_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid;
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
                    NEW.accepted_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid;
                EXCEPTION WHEN OTHERS THEN
                    NULL;
                END;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invitation_status_metadata_trigger 
    BEFORE UPDATE ON user_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_invitation_status_metadata();

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
                (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
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

CREATE TRIGGER audit_invitation_status_change_trigger 
    AFTER UPDATE ON user_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION audit_invitation_status_change();

-- Add constraint to ensure revoked fields are consistent
ALTER TABLE user_invitations 
ADD CONSTRAINT invitation_revoked_consistency 
CHECK (
    (invitation_status = 'revoked' AND revoked_at IS NOT NULL) OR 
    (invitation_status != 'revoked' AND revoked_at IS NULL AND revoked_by IS NULL)
);

-- Add constraint to ensure accepted fields are consistent  
ALTER TABLE user_invitations 
ADD CONSTRAINT invitation_accepted_consistency 
CHECK (
    (invitation_status = 'accepted' AND accepted_at IS NOT NULL) OR 
    (invitation_status != 'accepted')
);

-- Update RLS policies to use new enum column
-- Drop old policies
DROP POLICY IF EXISTS "developer_full_access_user_invitations" ON user_invitations;
DROP POLICY IF EXISTS "org_admin_full_access_user_invitations" ON user_invitations;
DROP POLICY IF EXISTS "manager_access_user_invitations" ON user_invitations;
DROP POLICY IF EXISTS "consultant_viewer_read_user_invitations" ON user_invitations;

-- Create new policies with enhanced security
CREATE POLICY "developer_full_access_user_invitations" ON user_invitations
    FOR ALL TO developer
    USING (true)
    WITH CHECK (true);

CREATE POLICY "org_admin_full_access_user_invitations" ON user_invitations
    FOR ALL TO org_admin
    USING (true)
    WITH CHECK (true);

-- Managers can see invitations they sent or are managing, but can only modify their own
CREATE POLICY "manager_read_user_invitations" ON user_invitations
    FOR SELECT TO manager
    USING (
        invited_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid 
        OR manager_id = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    );

CREATE POLICY "manager_modify_user_invitations" ON user_invitations
    FOR INSERT TO manager
    WITH CHECK (
        invited_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    );

CREATE POLICY "manager_update_user_invitations" ON user_invitations
    FOR UPDATE TO manager
    USING (
        invited_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    )
    WITH CHECK (
        invited_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    );

-- Consultants and viewers can only see their own invitations
CREATE POLICY "consultant_viewer_read_user_invitations" ON user_invitations
    FOR SELECT TO consultant, viewer
    USING (email = (
        SELECT email FROM users 
        WHERE id = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    ));

-- Add comments
COMMENT ON TYPE invitation_status_enum IS 'Invitation status states: pending, accepted, expired, revoked, cancelled';
COMMENT ON COLUMN user_invitations.invitation_status IS 'Current invitation status using enum type';
COMMENT ON COLUMN user_invitations.revoked_at IS 'Timestamp when invitation was revoked';
COMMENT ON COLUMN user_invitations.revoked_by IS 'User who revoked the invitation';
COMMENT ON COLUMN user_invitations.revoke_reason IS 'Reason for revoking the invitation';
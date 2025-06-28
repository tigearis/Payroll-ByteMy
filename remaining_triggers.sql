-- Create invitation status metadata trigger
DROP TRIGGER IF EXISTS update_invitation_status_metadata_trigger ON user_invitations;
CREATE TRIGGER update_invitation_status_metadata_trigger 
    BEFORE UPDATE ON user_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION payroll_db.update_invitation_status_metadata();

-- Create audit function for invitation status changes
CREATE OR REPLACE FUNCTION payroll_db.audit_invitation_status_change()
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
    EXECUTE FUNCTION payroll_db.audit_invitation_status_change();

-- Add table and column comments
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
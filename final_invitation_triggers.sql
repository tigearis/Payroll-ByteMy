-- Create trigger to update invitation metadata on status change
CREATE OR REPLACE FUNCTION update_invitation_status_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status change tracking
    IF OLD.invitation_status IS DISTINCT FROM NEW.invitation_status THEN
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

-- Create invitation status metadata trigger
DROP TRIGGER IF EXISTS update_invitation_status_metadata_trigger ON user_invitations;
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
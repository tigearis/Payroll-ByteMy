-- Create trigger to update invitation metadata on status change
CREATE OR REPLACE FUNCTION payroll_db.update_invitation_status_metadata()
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
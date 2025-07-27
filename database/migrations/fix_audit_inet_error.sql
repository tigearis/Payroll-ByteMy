-- Migration: Fix Audit Trigger inet Type Error
-- Date: 2025-07-26
-- Description: Fix PostgreSQL inet error by updating audit triggers to use valid IP addresses
-- instead of the string 'system' which is invalid for inet type columns.
--
-- Issue: AcceptInvitationEnhanced mutation was failing with:
-- "invalid input syntax for type inet: 'system'"
--
-- Root Cause: Audit triggers were inserting string 'system' into ip_address inet columns
-- Fix: Use '127.0.0.1'::inet for system operations to maintain data type integrity

-- =============================================================================
-- PHASE 1: FIX AUDIT_INVITATION_STATUS_CHANGE FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION public.audit_invitation_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
        
        -- Insert audit log with fixed IP address
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
            '127.0.0.1'::inet,  -- FIXED: Use valid inet type instead of 'system'
            'database_trigger'
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- =============================================================================
-- PHASE 2: FIX AUDIT_USER_STATUS_CHANGE FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION public.audit_user_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
        
        -- Insert audit log with fixed IP address and proper string quoting
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
            'user_status_change',     -- FIXED: Added missing quotes
            'user',                   -- FIXED: Added missing quotes
            NEW.id::text,
            jsonb_build_object('status', OLD.status),  -- FIXED: Added missing quotes around 'status'
            jsonb_build_object('status', NEW.status),  -- FIXED: Added missing quotes around 'status'
            audit_data,
            NOW(),
            '127.0.0.1'::inet,       -- FIXED: Use valid inet type instead of unquoted system
            'database_trigger'       -- FIXED: Added missing quotes
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- =============================================================================
-- PHASE 3: VERIFICATION
-- =============================================================================

-- Add a comment to document the fix
COMMENT ON FUNCTION public.audit_invitation_status_change() IS 'Audit trigger for invitation status changes. Fixed 2025-07-26: Use valid inet IP addresses for system operations.';
COMMENT ON FUNCTION public.audit_user_status_change() IS 'Audit trigger for user status changes. Fixed 2025-07-26: Use valid inet IP addresses and proper string quoting.';

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Log the migration completion (if audit_log table doesn't exist, this will be skipped)
DO $$
BEGIN
    INSERT INTO audit.audit_log (
        user_id,
        action,
        resource_type,
        resource_id,
        metadata,
        event_time,
        ip_address,
        user_agent
    ) VALUES (
        NULL,
        'MIGRATION',
        'system',
        'audit_inet_fix',
        jsonb_build_object(
            'migration', 'fix_audit_inet_error',
            'description', 'Fixed audit triggers to use valid inet IP addresses',
            'date', '2025-07-26',
            'issue', 'AcceptInvitationEnhanced mutation failing with inet error'
        ),
        NOW(),
        '127.0.0.1'::inet,
        'migration_script'
    );
EXCEPTION WHEN OTHERS THEN
    -- If audit_log doesn't exist yet, just continue
    RAISE NOTICE 'Audit log table not available, skipping migration log entry';
END $$;
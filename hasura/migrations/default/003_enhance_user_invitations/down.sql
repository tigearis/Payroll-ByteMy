-- Remove triggers
DROP TRIGGER IF EXISTS audit_invitation_status_change_trigger ON user_invitations;
DROP TRIGGER IF EXISTS update_invitation_status_metadata_trigger ON user_invitations;

-- Remove functions
DROP FUNCTION IF EXISTS audit_invitation_status_change();
DROP FUNCTION IF EXISTS update_invitation_status_metadata();

-- Remove constraints
ALTER TABLE user_invitations DROP CONSTRAINT IF EXISTS invitation_accepted_consistency;
ALTER TABLE user_invitations DROP CONSTRAINT IF EXISTS invitation_revoked_consistency;

-- Remove new policies
DROP POLICY IF EXISTS "consultant_viewer_read_user_invitations" ON user_invitations;
DROP POLICY IF EXISTS "manager_update_user_invitations" ON user_invitations;
DROP POLICY IF EXISTS "manager_modify_user_invitations" ON user_invitations;
DROP POLICY IF EXISTS "manager_read_user_invitations" ON user_invitations;
DROP POLICY IF EXISTS "org_admin_full_access_user_invitations" ON user_invitations;
DROP POLICY IF EXISTS "developer_full_access_user_invitations" ON user_invitations;

-- Restore original policies
CREATE POLICY "developer_full_access_user_invitations" ON user_invitations
    FOR ALL TO developer
    USING (true)
    WITH CHECK (true);

CREATE POLICY "org_admin_full_access_user_invitations" ON user_invitations
    FOR ALL TO org_admin
    USING (true)
    WITH CHECK (true);

CREATE POLICY "manager_access_user_invitations" ON user_invitations
    FOR ALL TO manager
    USING (
        invited_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid 
        OR manager_id = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    )
    WITH CHECK (
        invited_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    );

CREATE POLICY "consultant_viewer_read_user_invitations" ON user_invitations
    FOR SELECT TO consultant, viewer
    USING (email = (
        SELECT email FROM users 
        WHERE id = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    ));

-- Remove indexes
DROP INDEX IF EXISTS idx_user_invitations_revoked_by;
DROP INDEX IF EXISTS idx_user_invitations_revoked_at;
DROP INDEX IF EXISTS idx_user_invitations_invitation_status;

-- Remove columns
ALTER TABLE user_invitations 
DROP COLUMN IF EXISTS revoke_reason,
DROP COLUMN IF EXISTS revoked_by,
DROP COLUMN IF EXISTS revoked_at,
DROP COLUMN IF EXISTS invitation_status;

-- Drop enum type
DROP TYPE IF EXISTS invitation_status_enum;
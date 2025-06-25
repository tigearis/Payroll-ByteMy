-- Create user_invitations table for two-stage invitation flow
CREATE TABLE user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  invited_role VARCHAR(50) NOT NULL,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  clerk_invitation_id VARCHAR(255),
  clerk_ticket VARCHAR(1000),
  invitation_metadata JSONB DEFAULT '{}',
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_invitations_email ON user_invitations(email);
CREATE INDEX idx_user_invitations_status ON user_invitations(status);
CREATE INDEX idx_user_invitations_clerk_ticket ON user_invitations(clerk_ticket);
CREATE INDEX idx_user_invitations_invited_by ON user_invitations(invited_by);
CREATE INDEX idx_user_invitations_expires_at ON user_invitations(expires_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_invitations_updated_at 
    BEFORE UPDATE ON user_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- Policy for developers (full access)
CREATE POLICY "developer_full_access_user_invitations" ON user_invitations
    FOR ALL TO developer
    USING (true)
    WITH CHECK (true);

-- Policy for org_admin (full access)
CREATE POLICY "org_admin_full_access_user_invitations" ON user_invitations
    FOR ALL TO org_admin
    USING (true)
    WITH CHECK (true);

-- Policy for managers (can see invitations they sent or manage)
CREATE POLICY "manager_access_user_invitations" ON user_invitations
    FOR ALL TO manager
    USING (
        invited_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid 
        OR manager_id = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    )
    WITH CHECK (
        invited_by = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    );

-- Policy for consultants and viewers (read-only, own invitations only)
CREATE POLICY "consultant_viewer_read_user_invitations" ON user_invitations
    FOR SELECT TO consultant, viewer
    USING (email = (
        SELECT email FROM users 
        WHERE id = (current_setting('hasura.user')::json->>'x-hasura-user-id')::uuid
    ));

-- Add comment
COMMENT ON TABLE user_invitations IS 'Stores invitation metadata for two-stage user invitation flow with role-based access control';
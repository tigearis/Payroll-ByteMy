-- Add missing permission tables that exist in Hasura metadata but not in database
-- These are critical for the permission and audit system

-- Create permission_audit_log table
CREATE TABLE IF NOT EXISTS public.permission_audit_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    target_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    target_role text,
    resource text NOT NULL,
    operation text NOT NULL,
    action text NOT NULL,
    previous_value jsonb,
    new_value jsonb,
    reason text,
    timestamp timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for permission_audit_log
CREATE INDEX idx_permission_audit_log_user_id ON public.permission_audit_log(user_id);
CREATE INDEX idx_permission_audit_log_target_user_id ON public.permission_audit_log(target_user_id);
CREATE INDEX idx_permission_audit_log_timestamp ON public.permission_audit_log(timestamp DESC);
CREATE INDEX idx_permission_audit_log_resource ON public.permission_audit_log(resource);
CREATE INDEX idx_permission_audit_log_action ON public.permission_audit_log(action);

-- Create permission_overrides table
CREATE TABLE IF NOT EXISTS public.permission_overrides (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    role text, -- For role-based overrides
    resource text NOT NULL,
    operation text NOT NULL,
    granted boolean NOT NULL DEFAULT false,
    conditions jsonb,
    reason text,
    created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    expires_at timestamptz,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for permission_overrides
CREATE INDEX idx_permission_overrides_user_id ON public.permission_overrides(user_id);
CREATE INDEX idx_permission_overrides_role ON public.permission_overrides(role);
CREATE INDEX idx_permission_overrides_resource ON public.permission_overrides(resource);
CREATE INDEX idx_permission_overrides_operation ON public.permission_overrides(operation);
CREATE INDEX idx_permission_overrides_expires_at ON public.permission_overrides(expires_at);
CREATE INDEX idx_permission_overrides_created_by ON public.permission_overrides(created_by);

-- Add constraints
ALTER TABLE public.permission_overrides 
ADD CONSTRAINT check_user_or_role 
CHECK ((user_id IS NOT NULL AND role IS NULL) OR (user_id IS NULL AND role IS NOT NULL));

-- Add updated_at trigger for permission_overrides
CREATE TRIGGER update_permission_overrides_updated_at 
    BEFORE UPDATE ON public.permission_overrides 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_timestamp();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.permission_audit_log TO neondb_owner;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.permission_overrides TO neondb_owner;

-- Add comments
COMMENT ON TABLE public.permission_audit_log IS 'Audit log for permission changes and access attempts';
COMMENT ON TABLE public.permission_overrides IS 'User-specific and role-specific permission overrides';

COMMENT ON COLUMN public.permission_overrides.user_id IS 'User ID for user-specific overrides (mutually exclusive with role)';
COMMENT ON COLUMN public.permission_overrides.role IS 'Role name for role-based overrides (mutually exclusive with user_id)';
COMMENT ON COLUMN public.permission_overrides.granted IS 'Whether the permission is granted (true) or denied (false)';
COMMENT ON COLUMN public.permission_overrides.conditions IS 'JSON conditions for conditional permissions';
COMMENT ON COLUMN public.permission_overrides.expires_at IS 'When this override expires (NULL for permanent)'; 
-- Migration: Create API Keys table for persistent API key management
-- Created: 2025-06-17

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    key VARCHAR(255) UNIQUE NOT NULL,
    secret_hash TEXT NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    deactivated_at TIMESTAMPTZ,
    rate_limit_tier VARCHAR(50) DEFAULT 'standard',
    
    -- Constraints
    CONSTRAINT api_keys_rate_limit_tier_check 
        CHECK (rate_limit_tier IN ('basic', 'standard', 'premium')),
    CONSTRAINT api_keys_key_format_check 
        CHECK (key ~ '^pak_[a-f0-9]{32}$'),
    CONSTRAINT api_keys_expires_after_created_check 
        CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_by ON api_keys(created_by);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;

-- Create audit triggers for API key changes
CREATE OR REPLACE FUNCTION audit_api_keys() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (
            table_name, operation, record_id, user_id, 
            changes, timestamp, ip_address
        ) VALUES (
            'api_keys', 'INSERT', NEW.id::text, NEW.created_by::text,
            jsonb_build_object(
                'name', NEW.name,
                'permissions', NEW.permissions,
                'rate_limit_tier', NEW.rate_limit_tier,
                'expires_at', NEW.expires_at
            ),
            NOW(), 'system'
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (
            table_name, operation, record_id, user_id,
            changes, timestamp, ip_address
        ) VALUES (
            'api_keys', 'UPDATE', NEW.id::text, 
            COALESCE(current_setting('app.current_user_id', true), 'system'),
            jsonb_build_object(
                'old', jsonb_build_object(
                    'is_active', OLD.is_active,
                    'permissions', OLD.permissions,
                    'last_used', OLD.last_used
                ),
                'new', jsonb_build_object(
                    'is_active', NEW.is_active,
                    'permissions', NEW.permissions,
                    'last_used', NEW.last_used
                )
            ),
            NOW(), 'system'
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (
            table_name, operation, record_id, user_id,
            changes, timestamp, ip_address
        ) VALUES (
            'api_keys', 'DELETE', OLD.id::text,
            COALESCE(current_setting('app.current_user_id', true), 'system'),
            jsonb_build_object(
                'name', OLD.name,
                'key', OLD.key,
                'deactivated_at', OLD.deactivated_at
            ),
            NOW(), 'system'
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS api_keys_audit_trigger ON api_keys;
CREATE TRIGGER api_keys_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION audit_api_keys();

-- Create function to cleanup expired API keys
CREATE OR REPLACE FUNCTION cleanup_expired_api_keys() RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    UPDATE api_keys 
    SET is_active = false, deactivated_at = NOW()
    WHERE expires_at < NOW() AND is_active = true;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    -- Log cleanup activity
    IF affected_count > 0 THEN
        INSERT INTO audit_logs (
            table_name, operation, record_id, user_id,
            changes, timestamp, ip_address
        ) VALUES (
            'api_keys', 'BULK_UPDATE', 'expired_cleanup', 'system',
            jsonb_build_object(
                'action', 'cleanup_expired',
                'affected_count', affected_count,
                'cleanup_date', NOW()
            ),
            NOW(), 'system'
        );
    END IF;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust based on your role structure)
-- Allow developers to manage API keys
GRANT SELECT, INSERT, UPDATE ON api_keys TO developer;
GRANT USAGE, SELECT ON SEQUENCE api_keys_id_seq TO developer;

-- Allow org_admins to view and manage their organization's API keys
GRANT SELECT, INSERT, UPDATE ON api_keys TO org_admin;

-- Allow managers to view API keys they created
GRANT SELECT ON api_keys TO manager;

-- Allow service account to manage API keys for system operations
GRANT ALL ON api_keys TO service_account;

-- Create row-level security policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see API keys they created or are in their organization
CREATE POLICY api_keys_select_policy ON api_keys FOR SELECT
    USING (
        created_by = current_setting('hasura.user.id')::uuid
        OR current_setting('hasura.user.role') = 'developer'
        OR (
            current_setting('hasura.user.role') = 'org_admin' 
            AND created_by IN (
                SELECT id FROM users 
                WHERE organisation_id = current_setting('hasura.user.organisation_id')::uuid
            )
        )
    );

-- Policy: Users can only create API keys for themselves
CREATE POLICY api_keys_insert_policy ON api_keys FOR INSERT
    WITH CHECK (
        created_by = current_setting('hasura.user.id')::uuid
        OR current_setting('hasura.user.role') = 'developer'
    );

-- Policy: Users can only update API keys they created (or developers can update any)
CREATE POLICY api_keys_update_policy ON api_keys FOR UPDATE
    USING (
        created_by = current_setting('hasura.user.id')::uuid
        OR current_setting('hasura.user.role') = 'developer'
        OR (
            current_setting('hasura.user.role') = 'org_admin' 
            AND created_by IN (
                SELECT id FROM users 
                WHERE organisation_id = current_setting('hasura.user.organisation_id')::uuid
            )
        )
    );

-- Policy: No direct deletes allowed (use deactivation instead)
CREATE POLICY api_keys_delete_policy ON api_keys FOR DELETE
    USING (current_setting('hasura.user.role') = 'developer');

-- Add comment for documentation
COMMENT ON TABLE api_keys IS 'Persistent API key storage for secure API access management';
COMMENT ON COLUMN api_keys.key IS 'Public API key identifier (format: pak_<32-hex-chars>)';
COMMENT ON COLUMN api_keys.secret_hash IS 'Hashed API secret using HMAC-SHA256 with salt';
COMMENT ON COLUMN api_keys.permissions IS 'Array of permission strings for granular access control';
COMMENT ON COLUMN api_keys.rate_limit_tier IS 'Rate limiting tier: basic, standard, or premium';
COMMENT ON FUNCTION cleanup_expired_api_keys() IS 'Function to automatically deactivate expired API keys';
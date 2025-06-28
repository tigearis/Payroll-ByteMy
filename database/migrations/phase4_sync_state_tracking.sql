-- ================================
-- PHASE 4: BIDIRECTIONAL SYNC IMPROVEMENTS
-- Database Schema for Sync State Tracking
-- ================================

-- Set the correct schema
SET search_path TO payroll_db;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sync status enum
DO $$ BEGIN
    CREATE TYPE sync_status_enum AS ENUM ('success', 'failed', 'partial', 'in_progress');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user sync states table for tracking synchronization
CREATE TABLE IF NOT EXISTS payroll_db.user_sync_states (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id text NOT NULL UNIQUE,
    user_id uuid REFERENCES payroll_db.users(id) ON DELETE SET NULL,
    
    -- Sync status tracking
    last_sync_at timestamptz DEFAULT now(),
    last_sync_status sync_status_enum NOT NULL DEFAULT 'success',
    sync_version bigint NOT NULL DEFAULT extract(epoch from now() at time zone 'utc') * 1000,
    
    -- Error and retry handling
    inconsistencies jsonb DEFAULT '[]'::jsonb,
    next_retry_at timestamptz,
    retry_count integer DEFAULT 0,
    last_error text,
    
    -- Performance tracking
    last_sync_duration_ms integer,
    operations_count integer DEFAULT 0,
    
    -- Metadata and timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sync_states_clerk_user_id ON payroll_db.user_sync_states(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_sync_states_status ON payroll_db.user_sync_states(last_sync_status);
CREATE INDEX IF NOT EXISTS idx_user_sync_states_next_retry ON payroll_db.user_sync_states(next_retry_at) WHERE next_retry_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_sync_states_last_sync ON payroll_db.user_sync_states(last_sync_at DESC);

-- Create sync health monitoring view
CREATE OR REPLACE VIEW payroll_db.sync_health_summary AS
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE last_sync_status = 'success') as successful_syncs,
    COUNT(*) FILTER (WHERE last_sync_status = 'failed') as failed_syncs,
    COUNT(*) FILTER (WHERE last_sync_status = 'partial') as partial_syncs,
    COUNT(*) FILTER (WHERE last_sync_status = 'in_progress') as in_progress_syncs,
    COUNT(*) FILTER (WHERE retry_count > 0) as syncs_with_retries,
    COUNT(*) FILTER (WHERE next_retry_at IS NOT NULL AND next_retry_at <= now()) as pending_retries,
    AVG(last_sync_duration_ms) as avg_sync_duration_ms,
    MAX(last_sync_at) as last_sync_time,
    COUNT(*) FILTER (WHERE last_sync_at < now() - interval '1 hour') as stale_syncs
FROM payroll_db.user_sync_states;

-- Create function to update sync state
CREATE OR REPLACE FUNCTION payroll_db.update_sync_state_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at
DROP TRIGGER IF EXISTS trigger_update_sync_state_timestamp ON payroll_db.user_sync_states;
CREATE TRIGGER trigger_update_sync_state_timestamp
    BEFORE UPDATE ON payroll_db.user_sync_states
    FOR EACH ROW
    EXECUTE FUNCTION payroll_db.update_sync_state_timestamp();

-- Add sync tracking columns to users table
DO $$ BEGIN
    ALTER TABLE payroll_db.users ADD COLUMN IF NOT EXISTS last_sync_at timestamptz;
    ALTER TABLE payroll_db.users ADD COLUMN IF NOT EXISTS sync_version bigint DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Create index on users sync columns
CREATE INDEX IF NOT EXISTS idx_users_last_sync_at ON payroll_db.users(last_sync_at);
CREATE INDEX IF NOT EXISTS idx_users_sync_version ON payroll_db.users(sync_version);

-- Create webhook retry queue table
CREATE TABLE IF NOT EXISTS payroll_db.webhook_retry_queue (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_id text NOT NULL,
    webhook_type text NOT NULL, -- 'clerk', 'hasura', etc.
    
    -- Retry configuration
    payload jsonb NOT NULL,
    attempt_count integer DEFAULT 0,
    max_retries integer DEFAULT 5,
    next_retry_at timestamptz NOT NULL,
    
    -- Error tracking
    last_error text,
    last_attempted_at timestamptz,
    
    -- Status
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'dead_letter')),
    
    -- Metadata
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    completed_at timestamptz
);

-- Create indexes for webhook retry queue
CREATE INDEX IF NOT EXISTS idx_webhook_retry_queue_next_retry ON payroll_db.webhook_retry_queue(next_retry_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_webhook_retry_queue_status ON payroll_db.webhook_retry_queue(status);
CREATE INDEX IF NOT EXISTS idx_webhook_retry_queue_webhook_type ON payroll_db.webhook_retry_queue(webhook_type);
CREATE INDEX IF NOT EXISTS idx_webhook_retry_queue_created_at ON payroll_db.webhook_retry_queue(created_at DESC);

-- Create webhook retry trigger
CREATE OR REPLACE FUNCTION payroll_db.update_webhook_retry_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_webhook_retry_timestamp ON payroll_db.webhook_retry_queue;
CREATE TRIGGER trigger_update_webhook_retry_timestamp
    BEFORE UPDATE ON payroll_db.webhook_retry_queue
    FOR EACH ROW
    EXECUTE FUNCTION payroll_db.update_webhook_retry_timestamp();

-- Create sync conflict resolution table
CREATE TABLE IF NOT EXISTS payroll_db.sync_conflicts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id text NOT NULL,
    user_id uuid REFERENCES payroll_db.users(id) ON DELETE CASCADE,
    
    -- Conflict details
    conflict_type text NOT NULL, -- 'field_mismatch', 'missing_user', 'role_conflict', etc.
    field_name text,
    clerk_value jsonb,
    database_value jsonb,
    
    -- Resolution
    resolution_strategy text, -- 'clerk_wins', 'database_wins', 'manual', 'merge'
    resolved_at timestamptz,
    resolved_by text,
    resolution_notes text,
    
    -- Status
    status text DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'ignored')),
    
    -- Metadata
    detected_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for sync conflicts
CREATE INDEX IF NOT EXISTS idx_sync_conflicts_clerk_user_id ON payroll_db.sync_conflicts(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_sync_conflicts_status ON payroll_db.sync_conflicts(status);
CREATE INDEX IF NOT EXISTS idx_sync_conflicts_conflict_type ON payroll_db.sync_conflicts(conflict_type);
CREATE INDEX IF NOT EXISTS idx_sync_conflicts_detected_at ON payroll_db.sync_conflicts(detected_at DESC);

-- Create sync conflict trigger
CREATE OR REPLACE FUNCTION payroll_db.update_sync_conflict_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_sync_conflict_timestamp ON payroll_db.sync_conflicts;
CREATE TRIGGER trigger_update_sync_conflict_timestamp
    BEFORE UPDATE ON payroll_db.sync_conflicts
    FOR EACH ROW
    EXECUTE FUNCTION payroll_db.update_sync_conflict_timestamp();

-- Create useful functions for sync monitoring

-- Function to get pending sync retries
CREATE OR REPLACE FUNCTION payroll_db.get_pending_sync_retries()
RETURNS TABLE (
    clerk_user_id text,
    retry_count integer,
    next_retry_at timestamptz,
    last_error text,
    minutes_until_retry integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        uss.clerk_user_id,
        uss.retry_count,
        uss.next_retry_at,
        uss.last_error,
        EXTRACT(EPOCH FROM (uss.next_retry_at - now())) / 60 AS minutes_until_retry
    FROM payroll_db.user_sync_states uss
    WHERE uss.next_retry_at IS NOT NULL 
    AND uss.next_retry_at <= now() + interval '1 hour'
    ORDER BY uss.next_retry_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get sync health metrics
CREATE OR REPLACE FUNCTION payroll_db.get_sync_health_metrics()
RETURNS TABLE (
    metric_name text,
    metric_value numeric,
    metric_description text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'success_rate' as metric_name,
        ROUND(
            (COUNT(*) FILTER (WHERE last_sync_status = 'success')::numeric / NULLIF(COUNT(*)::numeric, 0)) * 100, 
            2
        ) as metric_value,
        'Percentage of successful syncs' as metric_description
    FROM payroll_db.user_sync_states
    
    UNION ALL
    
    SELECT 
        'avg_sync_duration' as metric_name,
        ROUND(AVG(last_sync_duration_ms)::numeric, 2) as metric_value,
        'Average sync duration in milliseconds' as metric_description
    FROM payroll_db.user_sync_states
    WHERE last_sync_duration_ms IS NOT NULL
    
    UNION ALL
    
    SELECT 
        'failed_syncs_last_hour' as metric_name,
        COUNT(*)::numeric as metric_value,
        'Number of failed syncs in the last hour' as metric_description
    FROM payroll_db.user_sync_states
    WHERE last_sync_status = 'failed' 
    AND last_sync_at > now() - interval '1 hour'
    
    UNION ALL
    
    SELECT 
        'pending_retries' as metric_name,
        COUNT(*)::numeric as metric_value,
        'Number of syncs pending retry' as metric_description
    FROM payroll_db.user_sync_states
    WHERE next_retry_at IS NOT NULL 
    AND next_retry_at <= now();
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old sync states (for maintenance)
CREATE OR REPLACE FUNCTION payroll_db.cleanup_old_sync_data(retention_days integer DEFAULT 30)
RETURNS integer AS $$
DECLARE
    deleted_count integer;
BEGIN
    -- Clean up old successful sync states (keep recent ones for monitoring)
    DELETE FROM payroll_db.user_sync_states 
    WHERE last_sync_status = 'success' 
    AND last_sync_at < now() - (retention_days || ' days')::interval;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Clean up old resolved conflicts
    DELETE FROM payroll_db.sync_conflicts
    WHERE status = 'resolved'
    AND resolved_at < now() - (retention_days || ' days')::interval;
    
    -- Clean up old completed webhook retries
    DELETE FROM payroll_db.webhook_retry_queue
    WHERE status IN ('succeeded', 'dead_letter')
    AND completed_at < now() - (retention_days || ' days')::interval;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Insert helpful comments
COMMENT ON TABLE payroll_db.user_sync_states IS 'Tracks synchronization state between Clerk and database for each user';
COMMENT ON TABLE payroll_db.webhook_retry_queue IS 'Queue for retrying failed webhook operations with exponential backoff';
COMMENT ON TABLE payroll_db.sync_conflicts IS 'Tracks and manages data conflicts detected during synchronization';

COMMENT ON COLUMN payroll_db.user_sync_states.sync_version IS 'Timestamp-based version for conflict detection and ordering';
COMMENT ON COLUMN payroll_db.user_sync_states.inconsistencies IS 'JSON array of detected inconsistencies between Clerk and database';
COMMENT ON COLUMN payroll_db.webhook_retry_queue.payload IS 'Original webhook payload for retry processing';
COMMENT ON COLUMN payroll_db.sync_conflicts.resolution_strategy IS 'How the conflict should be or was resolved';

-- Create initial sync state entries for existing users
INSERT INTO payroll_db.user_sync_states (clerk_user_id, user_id, last_sync_status, sync_version)
SELECT 
    u.clerk_user_id,
    u.id,
    'success' as last_sync_status,
    COALESCE(u.sync_version, extract(epoch from u.updated_at at time zone 'utc') * 1000) as sync_version
FROM payroll_db.users u
WHERE u.clerk_user_id IS NOT NULL
ON CONFLICT (clerk_user_id) DO NOTHING;

-- Grant permissions (adjust roles as needed for your setup)
GRANT SELECT, INSERT, UPDATE, DELETE ON payroll_db.user_sync_states TO hasura;
GRANT SELECT, INSERT, UPDATE, DELETE ON payroll_db.webhook_retry_queue TO hasura;
GRANT SELECT, INSERT, UPDATE, DELETE ON payroll_db.sync_conflicts TO hasura;
GRANT SELECT ON payroll_db.sync_health_summary TO hasura;
GRANT EXECUTE ON FUNCTION payroll_db.get_pending_sync_retries() TO hasura;
GRANT EXECUTE ON FUNCTION payroll_db.get_sync_health_metrics() TO hasura;
GRANT EXECUTE ON FUNCTION payroll_db.cleanup_old_sync_data(integer) TO hasura;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Phase 4 sync state tracking schema created successfully!';
    RAISE NOTICE 'Created tables: user_sync_states, webhook_retry_queue, sync_conflicts';
    RAISE NOTICE 'Created monitoring views and functions for sync health tracking';
END $$;
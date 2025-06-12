-- Create audit and compliance tables for SOC 2 compliance
-- These tables store sensitive audit data and must be protected

-- Create audit_log table for all sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id),
    user_role public.user_role NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    data_classification VARCHAR(20) NOT NULL,
    fields_affected JSONB,
    previous_values TEXT, -- Encrypted for CRITICAL/HIGH data
    new_values TEXT, -- Encrypted for CRITICAL/HIGH data
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    request_id UUID NOT NULL,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT audit_log_action_check CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'BULK_OPERATION')),
    CONSTRAINT audit_log_classification_check CHECK (data_classification IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'))
);

-- Create indexes for audit_log
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at);
CREATE INDEX idx_audit_log_action ON public.audit_log(action);
CREATE INDEX idx_audit_log_request_id ON public.audit_log(request_id);

-- Create data_access_log for compliance reporting
CREATE TABLE IF NOT EXISTS public.data_access_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id),
    data_type VARCHAR(100) NOT NULL,
    data_classification VARCHAR(20) NOT NULL,
    record_count INTEGER NOT NULL,
    access_purpose TEXT,
    export_format VARCHAR(50),
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT data_access_classification_check CHECK (data_classification IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW'))
);

-- Create indexes for data_access_log
CREATE INDEX idx_data_access_log_user_id ON public.data_access_log(user_id);
CREATE INDEX idx_data_access_log_accessed_at ON public.data_access_log(accessed_at);
CREATE INDEX idx_data_access_log_data_type ON public.data_access_log(data_type);

-- Create security_event_log for security monitoring
CREATE TABLE IF NOT EXISTS public.security_event_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES public.users(id),
    details JSONB NOT NULL,
    ip_address VARCHAR(45),
    resolved BOOLEAN NOT NULL DEFAULT false,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    CONSTRAINT security_event_severity_check CHECK (severity IN ('info', 'warning', 'error', 'critical'))
);

-- Create indexes for security_event_log
CREATE INDEX idx_security_event_log_event_type ON public.security_event_log(event_type);
CREATE INDEX idx_security_event_log_severity ON public.security_event_log(severity);
CREATE INDEX idx_security_event_log_created_at ON public.security_event_log(created_at);
CREATE INDEX idx_security_event_log_resolved ON public.security_event_log(resolved);
CREATE INDEX idx_security_event_log_user_id ON public.security_event_log(user_id);

-- Create compliance_check table for tracking compliance activities
CREATE TABLE IF NOT EXISTS public.compliance_check (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    check_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    findings JSONB NOT NULL,
    remediation_required BOOLEAN NOT NULL DEFAULT false,
    remediation_notes TEXT,
    performed_by UUID NOT NULL REFERENCES public.users(id),
    performed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    next_check_due DATE,
    CONSTRAINT compliance_check_status_check CHECK (status IN ('passed', 'failed', 'warning'))
);

-- Create indexes for compliance_check
CREATE INDEX idx_compliance_check_type ON public.compliance_check(check_type);
CREATE INDEX idx_compliance_check_status ON public.compliance_check(status);
CREATE INDEX idx_compliance_check_performed_at ON public.compliance_check(performed_at);
CREATE INDEX idx_compliance_check_next_due ON public.compliance_check(next_check_due);

-- Create retention policy function for audit logs
CREATE OR REPLACE FUNCTION public.enforce_audit_retention() RETURNS void AS $$
BEGIN
    -- Delete audit logs older than 7 years (SOC 2 requirement)
    DELETE FROM public.audit_log 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 years';
    
    -- Delete data access logs older than 5 years
    DELETE FROM public.data_access_log 
    WHERE accessed_at < CURRENT_TIMESTAMP - INTERVAL '5 years';
    
    -- Delete resolved security events older than 3 years
    DELETE FROM public.security_event_log 
    WHERE resolved = true 
    AND resolved_at < CURRENT_TIMESTAMP - INTERVAL '3 years';
    
    -- Archive unresolved security events older than 1 year
    UPDATE public.security_event_log 
    SET details = jsonb_set(details, '{archived}', 'true'::jsonb)
    WHERE resolved = false 
    AND created_at < CURRENT_TIMESTAMP - INTERVAL '1 year'
    AND details->>'archived' IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent modification of audit logs
CREATE OR REPLACE FUNCTION public.prevent_audit_modification() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'Audit logs cannot be modified';
    END IF;
    IF TG_OP = 'DELETE' AND OLD.created_at > CURRENT_TIMESTAMP - INTERVAL '7 years' THEN
        RAISE EXCEPTION 'Audit logs cannot be deleted before retention period';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_audit_log_modification
    BEFORE UPDATE OR DELETE ON public.audit_log
    FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

CREATE TRIGGER prevent_data_access_log_modification
    BEFORE UPDATE OR DELETE ON public.data_access_log
    FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-- Create function to check for suspicious activity
CREATE OR REPLACE FUNCTION public.check_suspicious_activity() RETURNS TRIGGER AS $$
DECLARE
    v_recent_failures INTEGER;
    v_bulk_exports INTEGER;
BEGIN
    -- Check for multiple failed attempts
    SELECT COUNT(*) INTO v_recent_failures
    FROM public.audit_log
    WHERE user_id = NEW.user_id
    AND success = false
    AND created_at > CURRENT_TIMESTAMP - INTERVAL '5 minutes';
    
    IF v_recent_failures >= 5 THEN
        INSERT INTO public.security_event_log (
            event_type, 
            severity, 
            user_id, 
            details,
            ip_address
        ) VALUES (
            'multiple_failed_attempts',
            'warning',
            NEW.user_id,
            jsonb_build_object(
                'failure_count', v_recent_failures,
                'entity_type', NEW.entity_type,
                'action', NEW.action
            ),
            NEW.ip_address
        );
    END IF;
    
    -- Check for bulk data exports
    IF NEW.action = 'EXPORT' THEN
        SELECT COUNT(*) INTO v_bulk_exports
        FROM public.audit_log
        WHERE user_id = NEW.user_id
        AND action = 'EXPORT'
        AND created_at > CURRENT_TIMESTAMP - INTERVAL '1 hour';
        
        IF v_bulk_exports >= 10 THEN
            INSERT INTO public.security_event_log (
                event_type, 
                severity, 
                user_id, 
                details,
                ip_address
            ) VALUES (
                'excessive_data_export',
                'error',
                NEW.user_id,
                jsonb_build_object(
                    'export_count', v_bulk_exports,
                    'entity_type', NEW.entity_type,
                    'data_classification', NEW.data_classification
                ),
                NEW.ip_address
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_suspicious_activity_trigger
    AFTER INSERT ON public.audit_log
    FOR EACH ROW EXECUTE FUNCTION public.check_suspicious_activity();

-- Add comments for documentation
COMMENT ON TABLE public.audit_log IS 'SOC 2 compliant audit log for all sensitive operations. Retention: 7 years.';
COMMENT ON TABLE public.data_access_log IS 'Tracks data access for compliance reporting. Retention: 5 years.';
COMMENT ON TABLE public.security_event_log IS 'Security events and incidents. Retention: 3 years after resolution.';
COMMENT ON TABLE public.compliance_check IS 'Compliance check results and remediation tracking.';

COMMENT ON COLUMN public.audit_log.previous_values IS 'Encrypted for CRITICAL/HIGH classified data';
COMMENT ON COLUMN public.audit_log.new_values IS 'Encrypted for CRITICAL/HIGH classified data';
-- Drop audit tables and related objects
-- WARNING: This will delete all audit history - ensure backups exist

-- Drop triggers first
DROP TRIGGER IF EXISTS check_suspicious_activity_trigger ON public.audit_log;
DROP TRIGGER IF EXISTS prevent_data_access_log_modification ON public.data_access_log;
DROP TRIGGER IF EXISTS prevent_audit_log_modification ON public.audit_log;

-- Drop functions
DROP FUNCTION IF EXISTS public.check_suspicious_activity();
DROP FUNCTION IF EXISTS public.prevent_audit_modification();
DROP FUNCTION IF EXISTS public.enforce_audit_retention();

-- Drop tables
DROP TABLE IF EXISTS public.compliance_check;
DROP TABLE IF EXISTS public.security_event_log;
DROP TABLE IF EXISTS public.data_access_log;
DROP TABLE IF EXISTS public.audit_log;
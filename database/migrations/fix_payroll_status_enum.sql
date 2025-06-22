-- Fix payroll_status enum mismatch
-- This migration adds missing enum values that are used in GraphQL but not defined in the database

-- Add missing enum values to match GraphQL schema
ALTER TYPE public.payroll_status ADD VALUE IF NOT EXISTS 'processing';
ALTER TYPE public.payroll_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE public.payroll_status ADD VALUE IF NOT EXISTS 'pending_approval';
ALTER TYPE public.payroll_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE public.payroll_status ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE public.payroll_status ADD VALUE IF NOT EXISTS 'failed';

-- Optional: Update existing records if needed
-- Uncomment these lines if you have data that needs to be updated
-- UPDATE payrolls SET status = 'Active' WHERE status = 'live';
-- UPDATE payrolls SET status = 'Implementation' WHERE status = 'onboarding';

-- Add comment for documentation
COMMENT ON TYPE public.payroll_status IS 'Payroll status enum - updated to match GraphQL schema values'; 
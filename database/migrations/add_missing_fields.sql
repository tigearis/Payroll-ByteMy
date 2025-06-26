-- Add missing fields to fix GraphQL schema mismatches
-- This migration adds fields that are referenced in GraphQL but missing from database schema

-- 1. Add 'reason' field to permission_overrides table
ALTER TABLE public.permission_overrides ADD COLUMN IF NOT EXISTS reason TEXT;

-- 2. Ensure payroll_status enum has all required values
DO $$ 
BEGIN
    -- Add missing enum values for payroll_status
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'processing' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payroll_status')) THEN
        ALTER TYPE public.payroll_status ADD VALUE 'processing';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'draft' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payroll_status')) THEN
        ALTER TYPE public.payroll_status ADD VALUE 'draft';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'pending_approval' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payroll_status')) THEN
        ALTER TYPE public.payroll_status ADD VALUE 'pending_approval';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'approved' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payroll_status')) THEN
        ALTER TYPE public.payroll_status ADD VALUE 'approved';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'completed' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payroll_status')) THEN
        ALTER TYPE public.payroll_status ADD VALUE 'completed';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'failed' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'payroll_status')) THEN
        ALTER TYPE public.payroll_status ADD VALUE 'failed';
    END IF;
EXCEPTION
    WHEN others THEN
        -- Handle case where payroll_status enum doesn't exist yet
        RAISE NOTICE 'payroll_status enum may not exist yet, skipping enum value additions';
END $$;

-- 3. Add comments for documentation
COMMENT ON COLUMN public.permission_overrides.reason IS 'Reason for permission override - used in GraphQL queries';
COMMENT ON TYPE public.payroll_status IS 'Payroll status enum - includes all values used in GraphQL schema';
-- Migration: Create payroll_assignments and audit tables
-- This adds the necessary tables for the advanced payroll scheduler

-- Create payroll_assignments table
CREATE TABLE IF NOT EXISTS payroll_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_date_id UUID NOT NULL,
  consultant_id UUID NOT NULL,
  assigned_by UUID,
  is_backup BOOLEAN DEFAULT FALSE,
  original_consultant_id UUID, -- for backup assignments
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraints
  CONSTRAINT fk_payroll_assignment_payroll_date 
    FOREIGN KEY (payroll_date_id) REFERENCES payroll_dates(id) ON DELETE CASCADE,
  CONSTRAINT fk_payroll_assignment_consultant 
    FOREIGN KEY (consultant_id) REFERENCES users(id),
  CONSTRAINT fk_payroll_assignment_assigned_by 
    FOREIGN KEY (assigned_by) REFERENCES users(id),
  CONSTRAINT fk_payroll_assignment_original_consultant 
    FOREIGN KEY (original_consultant_id) REFERENCES users(id),
    
  -- Unique constraint to prevent duplicate assignments
  CONSTRAINT uq_payroll_assignment_payroll_date 
    UNIQUE (payroll_date_id)
);

-- Create audit table for tracking changes
CREATE TABLE IF NOT EXISTS payroll_assignment_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID,
  payroll_date_id UUID NOT NULL,
  from_consultant_id UUID,
  to_consultant_id UUID NOT NULL,
  changed_by UUID,
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraints
  CONSTRAINT fk_audit_assignment 
    FOREIGN KEY (assignment_id) REFERENCES payroll_assignments(id) ON DELETE SET NULL,
  CONSTRAINT fk_audit_payroll_date 
    FOREIGN KEY (payroll_date_id) REFERENCES payroll_dates(id),
  CONSTRAINT fk_audit_from_consultant 
    FOREIGN KEY (from_consultant_id) REFERENCES users(id),
  CONSTRAINT fk_audit_to_consultant 
    FOREIGN KEY (to_consultant_id) REFERENCES users(id),
  CONSTRAINT fk_audit_changed_by 
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payroll_assignments_payroll_date 
  ON payroll_assignments(payroll_date_id);
CREATE INDEX IF NOT EXISTS idx_payroll_assignments_consultant 
  ON payroll_assignments(consultant_id);
CREATE INDEX IF NOT EXISTS idx_payroll_assignments_assigned_date 
  ON payroll_assignments(assigned_date);

CREATE INDEX IF NOT EXISTS idx_audit_assignment 
  ON payroll_assignment_audit(assignment_id);
CREATE INDEX IF NOT EXISTS idx_audit_payroll_date 
  ON payroll_assignment_audit(payroll_date_id);
CREATE INDEX IF NOT EXISTS idx_audit_date 
  ON payroll_assignment_audit(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_changed_by 
  ON payroll_assignment_audit(changed_by);

-- Create updated_at trigger for payroll_assignments
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON payroll_assignments
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

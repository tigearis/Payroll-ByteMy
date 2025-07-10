-- Migration: Enhanced Semi-Automated Billing System
-- This migration enhances the existing billing infrastructure to support
-- the semi-automated billing system outlined in the implementation plan.

-- =============================================================================
-- PHASE 1: ENHANCE EXISTING TABLES
-- =============================================================================

-- 1. Enhance billing_plan to become service_catalog
ALTER TABLE public.billing_plan 
ADD COLUMN IF NOT EXISTS billing_unit VARCHAR(50) DEFAULT 'Per Payroll',
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Processing',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update column names for clarity
ALTER TABLE public.billing_plan 
RENAME COLUMN rate_per_payroll TO standard_rate;

-- Add comments for new columns
COMMENT ON COLUMN public.billing_plan.billing_unit IS 'Unit of billing: Per Payroll, Per Payslip, Per Employee, Per Hour, Per State, Once Off, Per Month';
COMMENT ON COLUMN public.billing_plan.category IS 'Service category: Processing, Setup, Employee Management, Compliance, etc.';
COMMENT ON COLUMN public.billing_plan.is_active IS 'Whether this service is currently available';
COMMENT ON COLUMN public.billing_plan.standard_rate IS 'Standard rate for this service';

-- 2. Enhance client_billing_assignment to become client_service_agreements
ALTER TABLE public.client_billing_assignment 
ADD COLUMN IF NOT EXISTS custom_rate NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS billing_frequency VARCHAR(50) DEFAULT 'Per Job',
ADD COLUMN IF NOT EXISTS effective_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT true;

-- Add comments for new columns
COMMENT ON COLUMN public.client_billing_assignment.custom_rate IS 'Client-specific rate override (null uses standard rate)';
COMMENT ON COLUMN public.client_billing_assignment.billing_frequency IS 'How often this service is billed: Per Job, Monthly, Quarterly, etc.';
COMMENT ON COLUMN public.client_billing_assignment.effective_date IS 'When this rate agreement becomes effective';
COMMENT ON COLUMN public.client_billing_assignment.is_enabled IS 'Whether this service is enabled for this client';

-- 3. Enhance billing_items for payroll-specific billing
ALTER TABLE public.billing_items 
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES billing_plan(id),
ADD COLUMN IF NOT EXISTS staff_user_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS confirmed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add status constraint
ALTER TABLE public.billing_items 
ADD CONSTRAINT billing_items_status_check 
CHECK (status IN ('draft', 'confirmed', 'billed'));

-- Add comments for new columns
COMMENT ON COLUMN public.billing_items.service_id IS 'Reference to the service from service catalog';
COMMENT ON COLUMN public.billing_items.staff_user_id IS 'Staff member who performed the service';
COMMENT ON COLUMN public.billing_items.notes IS 'Additional notes about this billing item';
COMMENT ON COLUMN public.billing_items.status IS 'Status: draft, confirmed, billed';
COMMENT ON COLUMN public.billing_items.confirmed_at IS 'When this item was confirmed by manager';
COMMENT ON COLUMN public.billing_items.confirmed_by IS 'Manager who confirmed this item';

-- 4. Enhance payrolls table for billing tracking
ALTER TABLE public.payrolls 
ADD COLUMN IF NOT EXISTS payslip_count INTEGER,
ADD COLUMN IF NOT EXISTS new_employees INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS terminated_employees INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS billing_status VARCHAR(50) DEFAULT 'pending';

-- Add billing status constraint
ALTER TABLE public.payrolls 
ADD CONSTRAINT payrolls_billing_status_check 
CHECK (billing_status IN ('pending', 'items_added', 'ready_to_bill', 'billed'));

-- Add comments for new columns
COMMENT ON COLUMN public.payrolls.payslip_count IS 'Number of payslips processed in this payroll run';
COMMENT ON COLUMN public.payrolls.new_employees IS 'Number of new employees processed';
COMMENT ON COLUMN public.payrolls.terminated_employees IS 'Number of terminated employees processed';
COMMENT ON COLUMN public.payrolls.billing_status IS 'Billing status: pending, items_added, ready_to_bill, billed';

-- 5. Enhance billing_invoice for profitability tracking
ALTER TABLE public.billing_invoice 
ADD COLUMN IF NOT EXISTS payroll_count INTEGER,
ADD COLUMN IF NOT EXISTS total_hours DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50) UNIQUE;

-- Add comments for new columns
COMMENT ON COLUMN public.billing_invoice.payroll_count IS 'Number of payroll jobs included in this invoice';
COMMENT ON COLUMN public.billing_invoice.total_hours IS 'Total hours spent on services in this invoice';
COMMENT ON COLUMN public.billing_invoice.invoice_number IS 'Unique invoice number for client reference';

-- =============================================================================
-- PHASE 2: CREATE NEW TABLES
-- =============================================================================

-- 1. Time entries for profitability tracking
CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    payroll_id UUID REFERENCES payrolls(id) ON DELETE CASCADE,
    billing_item_id UUID REFERENCES billing_items(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    hours_spent DECIMAL(4,2) NOT NULL CHECK (hours_spent > 0 AND hours_spent <= 24),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.time_entries IS 'Time tracking for profitability analysis';
COMMENT ON COLUMN public.time_entries.staff_user_id IS 'Staff member who worked on this';
COMMENT ON COLUMN public.time_entries.client_id IS 'Client this work was for';
COMMENT ON COLUMN public.time_entries.payroll_id IS 'Specific payroll job this relates to';
COMMENT ON COLUMN public.time_entries.billing_item_id IS 'Billing item this time relates to';
COMMENT ON COLUMN public.time_entries.work_date IS 'Date the work was performed';
COMMENT ON COLUMN public.time_entries.hours_spent IS 'Hours spent on this work';
COMMENT ON COLUMN public.time_entries.description IS 'Description of work performed';

-- 2. Billing periods for invoice consolidation
CREATE TABLE IF NOT EXISTS public.billing_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'ready_to_invoice', 'invoiced', 'paid')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id, period_start, period_end)
);

-- Add comments
COMMENT ON TABLE public.billing_periods IS 'Billing periods for consolidating multiple payroll jobs into client invoices';
COMMENT ON COLUMN public.billing_periods.client_id IS 'Client this billing period is for';
COMMENT ON COLUMN public.billing_periods.period_start IS 'Start date of billing period';
COMMENT ON COLUMN public.billing_periods.period_end IS 'End date of billing period';
COMMENT ON COLUMN public.billing_periods.status IS 'Status: open, ready_to_invoice, invoiced, paid';

-- 3. Enhanced billing_invoice linking to billing_periods
ALTER TABLE public.billing_invoice 
ADD COLUMN IF NOT EXISTS billing_period_id UUID REFERENCES billing_periods(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.billing_invoice.billing_period_id IS 'Reference to billing period this invoice covers';

-- =============================================================================
-- PHASE 3: CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Indexes for billing_items
CREATE INDEX IF NOT EXISTS idx_billing_items_payroll_id ON public.billing_items(payroll_id);
CREATE INDEX IF NOT EXISTS idx_billing_items_service_id ON public.billing_items(service_id);
CREATE INDEX IF NOT EXISTS idx_billing_items_staff_user_id ON public.billing_items(staff_user_id);
CREATE INDEX IF NOT EXISTS idx_billing_items_status ON public.billing_items(status);

-- Indexes for time_entries
CREATE INDEX IF NOT EXISTS idx_time_entries_staff_user_id ON public.time_entries(staff_user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_client_id ON public.time_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_payroll_id ON public.time_entries(payroll_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_work_date ON public.time_entries(work_date);
CREATE INDEX IF NOT EXISTS idx_time_entries_billing_item_id ON public.time_entries(billing_item_id);

-- Indexes for billing_periods
CREATE INDEX IF NOT EXISTS idx_billing_periods_client_id ON public.billing_periods(client_id);
CREATE INDEX IF NOT EXISTS idx_billing_periods_status ON public.billing_periods(status);
CREATE INDEX IF NOT EXISTS idx_billing_periods_dates ON public.billing_periods(period_start, period_end);

-- Indexes for enhanced payrolls
CREATE INDEX IF NOT EXISTS idx_payrolls_billing_status ON public.payrolls(billing_status);
CREATE INDEX IF NOT EXISTS idx_payrolls_client_billing ON public.payrolls(client_id, billing_status);

-- Indexes for client service agreements
CREATE INDEX IF NOT EXISTS idx_client_billing_assignment_client_active ON public.client_billing_assignment(client_id, is_active);
CREATE INDEX IF NOT EXISTS idx_client_billing_assignment_service ON public.client_billing_assignment(billing_plan_id);

-- =============================================================================
-- PHASE 4: CREATE VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for payroll profitability analysis
CREATE OR REPLACE VIEW public.payroll_profitability AS
SELECT 
    p.id as payroll_id,
    p.name as payroll_name,
    p.client_id,
    c.name as client_name,
    p.billing_status,
    p.payslip_count,
    p.employee_count,
    COALESCE(SUM(bi.amount), 0) as total_revenue,
    COALESCE(SUM(te.hours_spent), 0) as total_hours,
    CASE 
        WHEN SUM(te.hours_spent) > 0 THEN COALESCE(SUM(bi.amount), 0) / SUM(te.hours_spent)
        ELSE 0
    END as revenue_per_hour,
    COUNT(DISTINCT bi.id) as billing_items_count,
    COUNT(DISTINCT te.id) as time_entries_count
FROM public.payrolls p
LEFT JOIN public.clients c ON p.client_id = c.id
LEFT JOIN public.billing_items bi ON p.id = bi.payroll_id AND bi.status != 'draft'
LEFT JOIN public.time_entries te ON p.id = te.payroll_id
GROUP BY p.id, p.name, p.client_id, c.name, p.billing_status, p.payslip_count, p.employee_count;

COMMENT ON VIEW public.payroll_profitability IS 'Profitability analysis for individual payroll jobs';

-- View for client service agreements with rates
CREATE OR REPLACE VIEW public.client_services_with_rates AS
SELECT 
    cba.id as agreement_id,
    cba.client_id,
    c.name as client_name,
    cba.billing_plan_id as service_id,
    bp.name as service_name,
    bp.description as service_description,
    bp.billing_unit,
    bp.category,
    bp.standard_rate,
    COALESCE(cba.custom_rate, bp.standard_rate) as effective_rate,
    cba.custom_rate,
    cba.billing_frequency,
    cba.is_enabled,
    cba.is_active,
    cba.effective_date
FROM public.client_billing_assignment cba
JOIN public.clients c ON cba.client_id = c.id
JOIN public.billing_plan bp ON cba.billing_plan_id = bp.id
WHERE cba.is_active = true AND bp.is_active = true;

COMMENT ON VIEW public.client_services_with_rates IS 'Client service agreements with effective rates';

-- View for staff billing performance
CREATE OR REPLACE VIEW public.staff_billing_performance AS
SELECT 
    u.id as staff_id,
    u.first_name || ' ' || u.last_name as staff_name,
    COUNT(DISTINCT bi.payroll_id) as payrolls_worked,
    COUNT(DISTINCT bi.id) as billing_items_created,
    COALESCE(SUM(bi.amount), 0) as total_revenue_generated,
    COALESCE(SUM(te.hours_spent), 0) as total_hours_logged,
    CASE 
        WHEN SUM(te.hours_spent) > 0 THEN COALESCE(SUM(bi.amount), 0) / SUM(te.hours_spent)
        ELSE 0
    END as revenue_per_hour,
    COUNT(DISTINCT bi.payroll_id) as distinct_clients_served
FROM public.users u
LEFT JOIN public.billing_items bi ON u.id = bi.staff_user_id AND bi.status != 'draft'
LEFT JOIN public.time_entries te ON u.id = te.staff_user_id
WHERE u.id IN (SELECT DISTINCT staff_user_id FROM public.billing_items WHERE staff_user_id IS NOT NULL)
GROUP BY u.id, u.first_name, u.last_name;

COMMENT ON VIEW public.staff_billing_performance IS 'Staff performance metrics for billing and time tracking';

-- =============================================================================
-- PHASE 5: CREATE FUNCTIONS FOR COMMON OPERATIONS
-- =============================================================================

-- Function to calculate auto-quantities for billing items
CREATE OR REPLACE FUNCTION public.calculate_billing_quantity(
    service_billing_unit TEXT,
    payroll_data JSONB
) RETURNS INTEGER AS $$
BEGIN
    CASE service_billing_unit
        WHEN 'Per Payslip' THEN
            RETURN COALESCE((payroll_data->>'payslip_count')::INTEGER, 0);
        WHEN 'Per Employee' THEN
            RETURN COALESCE((payroll_data->>'employee_count')::INTEGER, 0);
        WHEN 'Per New Employee' THEN
            RETURN COALESCE((payroll_data->>'new_employees')::INTEGER, 0);
        WHEN 'Per Terminated Employee' THEN
            RETURN COALESCE((payroll_data->>'terminated_employees')::INTEGER, 0);
        WHEN 'Per Payroll', 'Per Month', 'Once Off' THEN
            RETURN 1;
        ELSE
            RETURN 1;
    END CASE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.calculate_billing_quantity IS 'Calculates appropriate quantity for billing items based on service type and payroll data';

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number() RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
    invoice_num TEXT;
BEGIN
    -- Get the next invoice number (simple incrementing sequence)
    SELECT COALESCE(MAX(SUBSTRING(invoice_number FROM '[0-9]+')::INTEGER), 0) + 1
    INTO next_num
    FROM public.billing_invoice
    WHERE invoice_number IS NOT NULL;
    
    -- Format as INV-YYYY-NNNN
    invoice_num := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_num::TEXT, 4, '0');
    
    RETURN invoice_num;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.generate_invoice_number IS 'Generates unique invoice numbers in format INV-YYYY-NNNN';

-- =============================================================================
-- PHASE 6: POPULATE INITIAL DATA
-- =============================================================================

-- Insert common service categories if they don't exist
INSERT INTO public.billing_plan (name, description, standard_rate, billing_unit, category, is_active)
VALUES 
    -- Setup & Configuration Services
    ('ATO Registration', 'Initial ATO registration and setup', 750.00, 'Once Off', 'Setup & Configuration', true),
    ('Payroll Implementation', 'Complete payroll system implementation', 1000.00, 'Once Off', 'Setup & Configuration', true),
    ('Workers Compensation Registration', 'Workers compensation registration per state', 375.00, 'Per State', 'Setup & Configuration', true),
    
    -- Processing Services
    ('Monthly Payroll Processing', 'Monthly payroll processing per payslip', 19.00, 'Per Payslip', 'Processing', true),
    ('Fortnightly Payroll Processing', 'Fortnightly payroll processing per payslip', 15.00, 'Per Payslip', 'Processing', true),
    ('Weekly Payroll Processing', 'Weekly payroll processing', 150.00, 'Per Month', 'Processing', true),
    
    -- Employee Management Services
    ('New Employee Onboarding', 'Onboarding new employees', 45.00, 'Per Employee', 'Employee Management', true),
    ('Employee Termination Processing', 'Termination calculations and processing', 60.00, 'Per Employee', 'Employee Management', true),
    ('Employee Offboarding', 'Complete employee offboarding process', 100.00, 'Per Employee', 'Employee Management', true),
    
    -- Compliance & Reporting Services
    ('Payroll Tax Calculation', 'Payroll tax calculation per state', 100.00, 'Per State', 'Compliance & Reporting', true),
    ('IAS Lodgement', 'IAS lodgement processing', 200.00, 'Per Lodgement', 'Compliance & Reporting', true),
    ('STP Finalisation', 'Single Touch Payroll finalisation', 500.00, 'Per Employee', 'Compliance & Reporting', true),
    
    -- Additional Services
    ('Consulting Hours', 'General consulting and support', 240.00, 'Per Hour', 'Consulting', true),
    ('Off-cycle Pay Run', 'Additional pay run outside normal schedule', 200.00, 'Once Off', 'Processing', true)
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- MIGRATION COMPLETE
-- =============================================================================

-- Log the migration completion
INSERT INTO public.billing_event_log (event_type, message, created_at)
VALUES ('MIGRATION', 'Enhanced billing system migration completed successfully', NOW());
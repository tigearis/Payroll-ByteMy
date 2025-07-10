-- Create missing billing system tables
-- This script creates the tables that are referenced in the metadata but don't exist yet

-- Create billing_periods table
CREATE TABLE IF NOT EXISTS billing_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id, period_start, period_end)
);

-- Create time_entries table
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_id UUID NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    staff_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    billing_item_id UUID REFERENCES billing_items(id) ON DELETE SET NULL,
    work_date DATE NOT NULL,
    hours_spent DECIMAL(5,2) NOT NULL CHECK (hours_spent > 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing tables
-- Add new columns to billing_plan table
ALTER TABLE billing_plan 
ADD COLUMN IF NOT EXISTS billing_unit VARCHAR(50) DEFAULT 'hour',
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS standard_rate DECIMAL(10,2);

-- Add new columns to client_billing_assignment table
ALTER TABLE client_billing_assignment
ADD COLUMN IF NOT EXISTS billing_frequency VARCHAR(50) DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS effective_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add new columns to billing_items table
ALTER TABLE billing_items
ADD COLUMN IF NOT EXISTS billing_plan_id UUID REFERENCES billing_plan(id),
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id),
ADD COLUMN IF NOT EXISTS staff_user_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS service_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add new columns to payrolls table  
ALTER TABLE payrolls
ADD COLUMN IF NOT EXISTS estimated_revenue DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS actual_revenue DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS profit_margin DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS billing_status VARCHAR(50) DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS last_billed_date TIMESTAMP WITH TIME ZONE;

-- Add new column to billing_invoice table
ALTER TABLE billing_invoice
ADD COLUMN IF NOT EXISTS billing_period_id UUID REFERENCES billing_periods(id),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_billing_periods_client_id ON billing_periods(client_id);
CREATE INDEX IF NOT EXISTS idx_billing_periods_dates ON billing_periods(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_time_entries_payroll_id ON time_entries(payroll_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_client_id ON time_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_staff_user_id ON time_entries(staff_user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_work_date ON time_entries(work_date);
CREATE INDEX IF NOT EXISTS idx_billing_items_billing_plan_id ON billing_items(billing_plan_id);
CREATE INDEX IF NOT EXISTS idx_billing_items_client_id ON billing_items(client_id);
CREATE INDEX IF NOT EXISTS idx_billing_items_staff_user_id ON billing_items(staff_user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_billing_periods_updated_at ON billing_periods;
CREATE TRIGGER update_billing_periods_updated_at
    BEFORE UPDATE ON billing_periods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_time_entries_updated_at ON time_entries;
CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_items_updated_at ON billing_items;
CREATE TRIGGER update_billing_items_updated_at
    BEFORE UPDATE ON billing_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update service catalog with initial data
UPDATE billing_plan SET 
    billing_unit = 'hour',
    category = 'payroll_processing',
    is_active = true
WHERE billing_unit IS NULL;

-- Create views for profitability analysis
CREATE OR REPLACE VIEW staff_billing_performance AS
SELECT 
    u.id as staff_user_id,
    u.name as staff_name,
    COUNT(DISTINCT p.id) as total_payrolls,
    SUM(p.estimated_revenue) as total_estimated_revenue,
    SUM(p.actual_revenue) as total_actual_revenue,
    AVG(p.profit_margin) as average_profit_margin,
    SUM(te.hours_spent) as total_hours_logged
FROM users u
LEFT JOIN payrolls p ON (u.id = p.primary_consultant_user_id OR u.id = p.backup_consultant_user_id)
LEFT JOIN time_entries te ON u.id = te.staff_user_id
WHERE u.id IS NOT NULL
GROUP BY u.id, u.name;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON billing_periods TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON time_entries TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Add row level security policies
ALTER TABLE billing_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Basic policies for billing_periods
CREATE POLICY billing_periods_select_policy ON billing_periods
    FOR SELECT USING (true);

CREATE POLICY billing_periods_insert_policy ON billing_periods
    FOR INSERT WITH CHECK (true);

CREATE POLICY billing_periods_update_policy ON billing_periods
    FOR UPDATE USING (true);

CREATE POLICY billing_periods_delete_policy ON billing_periods
    FOR DELETE USING (true);

-- Basic policies for time_entries  
CREATE POLICY time_entries_select_policy ON time_entries
    FOR SELECT USING (true);

CREATE POLICY time_entries_insert_policy ON time_entries
    FOR INSERT WITH CHECK (true);

CREATE POLICY time_entries_update_policy ON time_entries
    FOR UPDATE USING (true);

CREATE POLICY time_entries_delete_policy ON time_entries
    FOR DELETE USING (true);
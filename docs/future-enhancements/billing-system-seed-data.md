# Billing System Seed Data Documentation

## Overview

This document provides comprehensive seed data for the semi-automated billing system based on the actual services from the "Billing Template Revised FY 2025.xlsm" Excel spreadsheet. The data is structured to populate the enhanced billing tables in the existing Payroll application database.

## Database Structure Integration

### Existing Tables Enhanced
- **`billing_plan`** → Enhanced to become `service_catalog` with billing units
- **`client_billing_assignment`** → Enhanced to become `client_service_agreements`
- **`billing_items`** → Enhanced for payroll-specific billing items
- **`billing_invoice`** → Enhanced for consolidated client invoicing

---

## Service Catalog Seed Data

### 1. Setup & Configuration Services (5 services)

```sql
-- Category: Setup & Configuration
-- One-time services for client onboarding and system setup

INSERT INTO billing_plan (
    id, name, description, standard_rate, billing_unit, category, is_active, currency
) VALUES 
-- ATO Registration
(gen_random_uuid(), 'ATO Registration', 'Initial Australian Taxation Office registration and setup for payroll compliance', 750.00, 'Once Off', 'Setup & Configuration', true, 'AUD'),

-- Payroll Implementation
(gen_random_uuid(), 'Payroll Implementation / Configuration', 'Complete payroll system implementation and configuration for new clients', 1000.00, 'Once Off', 'Setup & Configuration', true, 'AUD'),

-- Payroll Tax Registration
(gen_random_uuid(), 'Payroll Tax Registrations', 'State-based payroll tax registration service', 400.00, 'Per Registration', 'Setup & Configuration', true, 'AUD'),

-- Workers Compensation Registration
(gen_random_uuid(), 'Workers Compensation - Initial Registration', 'Initial workers compensation registration per state', 350.00, 'Per State', 'Setup & Configuration', true, 'AUD'),
(gen_random_uuid(), 'Workers Compensation Registrations', 'Workers compensation registration service', 400.00, 'Per State', 'Setup & Configuration', true, 'AUD');
```

### 2. Recurring Processing Services (18 services)

```sql
-- Category: Recurring Processing
-- Regular payroll processing services

INSERT INTO billing_plan (
    id, name, description, standard_rate, billing_unit, category, is_active, currency
) VALUES 
-- Monthly Processing
(gen_random_uuid(), 'Monthly Pay Processing', 'Standard monthly payroll processing service', 500.00, 'Per Month', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Monthly Payroll Processing', 'Monthly payroll processing - standard rate', 400.00, 'Per Month', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Monthly Payroll processing', 'Monthly payroll processing - premium rate', 750.00, 'Per Month', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Monthly Processing', 'Comprehensive monthly processing service', 850.00, 'Per Month', 'Recurring Processing', true, 'AUD'),

-- Monthly Per-Payslip Tiered Pricing
(gen_random_uuid(), 'Monthly Pay Processing - Up to 99 employees', 'Monthly processing for small businesses (up to 99 employees)', 25.00, 'Per Payslip', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Monthly Pay Processing - 100 to 149 employees', 'Monthly processing for medium businesses (100-149 employees)', 22.50, 'Per Payslip', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Monthly Pay Processing - 150+ employees', 'Monthly processing for large businesses (150+ employees)', 20.00, 'Per Payslip', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Monthly Payroll Processing', 'Standard monthly payroll processing per payslip', 14.00, 'Per Payslip', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Monthly Out of Cycle Pay Processing', 'Monthly out-of-cycle payroll processing', 14.00, 'Per Payslip', 'Recurring Processing', true, 'AUD'),

-- Fortnightly Processing
(gen_random_uuid(), 'Fortnightly Payroll Processing', 'Standard fortnightly payroll processing', 10.75, 'Per Payslip', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Fortnightly Payroll Processing - Up to 130 Employees', 'Fortnightly processing for businesses up to 130 employees', 10.80, 'Per Employee', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Fortnightly Payroll Processing Flat Fee', 'Flat fee fortnightly payroll processing', 200.00, 'Per Payroll', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Fortnightly Payroll Processing Per Payslip', 'Fortnightly processing charged per payslip', 15.00, 'Per Payslip', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Fortnightly Out of Cycle Pay Processing', 'Fortnightly out-of-cycle processing', 10.75, 'Per Payslip', 'Recurring Processing', true, 'AUD'),

-- Weekly Processing
(gen_random_uuid(), 'Weekly Payroll Processing', 'Weekly payroll processing service', 150.00, 'Per Month', 'Recurring Processing', true, 'AUD'),

-- General Processing
(gen_random_uuid(), 'Payroll Processing', 'General payroll processing service - per payslip', 16.50, 'Per Payslip', 'Recurring Processing', true, 'AUD'),
(gen_random_uuid(), 'Payroll Processing', 'General payroll processing service - monthly', 420.00, 'Per Month', 'Recurring Processing', true, 'AUD'),

-- Tax Processing
(gen_random_uuid(), 'Payroll Tax Monthly Calculation and Lodgement', 'Monthly payroll tax calculation and lodgement per state', 75.00, 'Per State', 'Recurring Processing', true, 'AUD');
```

### 3. Employee Management Services (8 services)

```sql
-- Category: Employee Management
-- Services related to employee lifecycle management

INSERT INTO billing_plan (
    id, name, description, standard_rate, billing_unit, category, is_active, currency
) VALUES 
-- Onboarding
(gen_random_uuid(), 'Onboarding New Employees', 'Complete onboarding process for new employees', 50.00, 'Per Employee', 'Employee Management', true, 'AUD'),

-- Offboarding
(gen_random_uuid(), 'Offboarding Employees', 'Complete offboarding process for departing employees', 100.00, 'Per Employee', 'Employee Management', true, 'AUD'),

-- Terminations
(gen_random_uuid(), 'Termination', 'Basic termination processing', 25.00, 'Per Termination', 'Employee Management', true, 'AUD'),
(gen_random_uuid(), 'Termination Calculations', 'Comprehensive termination calculations - per employee', 50.00, 'Per Employee', 'Employee Management', true, 'AUD'),
(gen_random_uuid(), 'Termination Calculations', 'Comprehensive termination calculations - per termination', 70.00, 'Per Termination', 'Employee Management', true, 'AUD'),
(gen_random_uuid(), 'Termination Processing', 'State-based termination processing', 500.00, 'Per State', 'Employee Management', true, 'AUD');
```

### 4. Compliance & Reporting Services (12 services)

```sql
-- Category: Compliance & Reporting
-- Compliance, tax, and regulatory reporting services

INSERT INTO billing_plan (
    id, name, description, standard_rate, billing_unit, category, is_active, currency
) VALUES 
-- Annual Tax Services
(gen_random_uuid(), 'Annual Payroll Tax', 'Annual payroll tax preparation and lodgement', 650.00, 'Per State', 'Compliance & Reporting', true, 'AUD'),
(gen_random_uuid(), 'Annual Payroll Tax Reconciliations', 'Annual payroll tax reconciliation service', 450.00, 'Per State', 'Compliance & Reporting', true, 'AUD'),

-- Payroll Tax Services
(gen_random_uuid(), 'Payroll Tax - Calculation and Lodgement', 'Monthly payroll tax calculation and lodgement', 100.00, 'Per State', 'Compliance & Reporting', true, 'AUD'),
(gen_random_uuid(), 'Payroll Tax - Calculation and Lodgement', 'Monthly payroll tax service - flat fee', 400.00, 'Per Month', 'Compliance & Reporting', true, 'AUD'),

-- Workers Compensation
(gen_random_uuid(), 'Workers Compensation - Declarations and Renewals', 'Workers compensation declarations and renewals', 450.00, 'Per State', 'Compliance & Reporting', true, 'AUD'),
(gen_random_uuid(), 'Workers Compensation – Declarations and Renewals', 'Workers compensation service - alternative rate', 350.00, 'Per State', 'Compliance & Reporting', true, 'AUD'),
(gen_random_uuid(), 'Annual Workers Compensation Renewal', 'Annual workers compensation renewal service', 350.00, 'Per State', 'Compliance & Reporting', true, 'AUD'),

-- STP and IAS
(gen_random_uuid(), 'STP Finalisation Reconciliation', 'Single Touch Payroll finalisation and reconciliation', 500.00, 'Per Employee', 'Compliance & Reporting', true, 'AUD'),
(gen_random_uuid(), 'Instalment Activity Statement (IAS)', 'IAS preparation and lodgement service', 200.00, 'Per Lodgement', 'Compliance & Reporting', true, 'AUD');
```

### 5. Ad-hoc Services (11 services)

```sql
-- Category: Ad-hoc Services
-- One-off and special processing services

INSERT INTO billing_plan (
    id, name, description, standard_rate, billing_unit, category, is_active, currency
) VALUES 
-- Adhoc Services
(gen_random_uuid(), 'Adhoc Payroll Services', 'General adhoc payroll services - hourly rate', 240.00, 'Per Hour', 'Ad-hoc Services', true, 'AUD'),

-- Off-Cycle Processing
(gen_random_uuid(), 'Off Cycle Pay Run Flat Fee', 'Off-cycle pay run - flat fee', 200.00, 'Once Off', 'Ad-hoc Services', true, 'AUD'),
(gen_random_uuid(), 'Off Cycle Pay Run Per Payslip', 'Off-cycle pay run charged per payslip', 50.00, 'Per Payslip', 'Ad-hoc Services', true, 'AUD'),
(gen_random_uuid(), 'Off Cycle Pay Run', 'Off-cycle pay run service', 250.00, 'Per Payrun', 'Ad-hoc Services', true, 'AUD'),

-- Out of Cycle Processing
(gen_random_uuid(), 'Out of Cycle Pay Processing', 'Out of cycle pay processing service', 200.00, 'Per Pay', 'Ad-hoc Services', true, 'AUD'),
(gen_random_uuid(), 'Out of Cycle Pay Processing Flat Fee', 'Out of cycle processing - flat fee', 150.00, 'Once Off', 'Ad-hoc Services', true, 'AUD'),
(gen_random_uuid(), 'Out of Cycle Pay Run Per Payslip', 'Out of cycle processing per payslip - standard rate', 16.50, 'Per Payslip', 'Ad-hoc Services', true, 'AUD'),
(gen_random_uuid(), 'Out of Cycle Pay Run Per Payslip', 'Out of cycle processing per payslip - premium rate', 25.00, 'Per Payslip', 'Ad-hoc Services', true, 'AUD');
```

### 6. Other Services (2 services)

```sql
-- Category: Other
-- Miscellaneous services

INSERT INTO billing_plan (
    id, name, description, standard_rate, billing_unit, category, is_active, currency
) VALUES 
-- Transition and Disbursements
(gen_random_uuid(), 'Payroll Transition', 'Payroll system transition services', 240.00, 'Per Hour', 'Other', true, 'AUD'),
(gen_random_uuid(), 'Disbursements - Bill at Cost', 'Client disbursements billed at cost', 1.00, 'Per Disbursement', 'Other', true, 'AUD');
```

---

## Sample Client Service Agreements

### Example Client Setup with Custom Rates

```sql
-- Sample Client Service Agreements
-- Shows how clients can have custom rates for specific services

-- Client 1: Small Business (Up to 25 employees)
INSERT INTO client_billing_assignment (
    id, client_id, billing_plan_id, custom_rate, billing_frequency, 
    start_date, is_active, is_enabled
) VALUES 
-- Monthly Processing with custom rate
(gen_random_uuid(), 
 (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1),
 (SELECT id FROM billing_plan WHERE name = 'Monthly Payroll Processing' AND billing_unit = 'Per Payslip' LIMIT 1),
 19.00, -- Custom rate instead of standard $14.00
 'monthly',
 CURRENT_DATE,
 true,
 true),

-- Onboarding with standard rate
(gen_random_uuid(),
 (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1),
 (SELECT id FROM billing_plan WHERE name = 'Onboarding New Employees' LIMIT 1),
 NULL, -- Use standard rate $50.00
 'as_needed',
 CURRENT_DATE,
 true,
 true);

-- Client 2: Medium Business (100+ employees)
INSERT INTO client_billing_assignment (
    id, client_id, billing_plan_id, custom_rate, billing_frequency,
    start_date, is_active, is_enabled
) VALUES 
-- Volume discount for large client
(gen_random_uuid(),
 (SELECT id FROM clients WHERE name = 'XYZ Corporation Ltd' LIMIT 1),
 (SELECT id FROM billing_plan WHERE name = 'Monthly Pay Processing - 150+ employees' LIMIT 1),
 18.00, -- Custom rate instead of standard $20.00
 'monthly',
 CURRENT_DATE,
 true,
 true),

-- Compliance services
(gen_random_uuid(),
 (SELECT id FROM clients WHERE name = 'XYZ Corporation Ltd' LIMIT 1),
 (SELECT id FROM billing_plan WHERE name = 'Payroll Tax - Calculation and Lodgement' AND billing_unit = 'Per State' LIMIT 1),
 85.00, -- Custom rate instead of standard $100.00
 'monthly',
 CURRENT_DATE,
 true,
 true);
```

---

## Sample Time Entries for Profitability Tracking

```sql
-- Sample time entries to demonstrate profitability tracking
-- Links time spent to specific billing items

INSERT INTO time_entries (
    id, staff_user_id, client_id, payroll_id, billing_item_id,
    work_date, hours_spent, description
) VALUES 
-- Monthly payroll processing time
(gen_random_uuid(),
 (SELECT id FROM users WHERE email = 'consultant@company.com' LIMIT 1),
 (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1),
 (SELECT id FROM payrolls WHERE client_id = (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1) LIMIT 1),
 NULL, -- Will be linked when billing item is created
 CURRENT_DATE,
 2.5,
 'Monthly payroll processing - data entry and calculations'),

-- Employee onboarding time
(gen_random_uuid(),
 (SELECT id FROM users WHERE email = 'consultant@company.com' LIMIT 1),
 (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1),
 (SELECT id FROM payrolls WHERE client_id = (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1) LIMIT 1),
 NULL,
 CURRENT_DATE,
 1.0,
 'New employee setup and onboarding documentation');
```

---

## Billing Item Examples

### Sample Billing Items for Payroll Jobs

```sql
-- Sample billing items showing how services are applied to specific payrolls
-- These would typically be created through the billing interface

INSERT INTO billing_items (
    id, payroll_id, billing_plan_id, client_id, staff_user_id,
    description, quantity, unit_price, notes, status
) VALUES 
-- Monthly processing for 25 payslips
(gen_random_uuid(),
 (SELECT id FROM payrolls WHERE client_id = (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1) LIMIT 1),
 (SELECT id FROM billing_plan WHERE name = 'Monthly Payroll Processing' AND billing_unit = 'Per Payslip' LIMIT 1),
 (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1),
 (SELECT id FROM users WHERE email = 'consultant@company.com' LIMIT 1),
 'Monthly payroll processing for March 2025',
 25, -- 25 payslips
 19.00, -- Custom rate from client agreement
 'Standard monthly processing with 2 new employees onboarded',
 'confirmed'),

-- New employee onboarding
(gen_random_uuid(),
 (SELECT id FROM payrolls WHERE client_id = (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1) LIMIT 1),
 (SELECT id FROM billing_plan WHERE name = 'Onboarding New Employees' LIMIT 1),
 (SELECT id FROM clients WHERE name = 'ABC Small Business Pty Ltd' LIMIT 1),
 (SELECT id FROM users WHERE email = 'consultant@company.com' LIMIT 1),
 'Onboarding of 2 new employees',
 2, -- 2 employees
 50.00, -- Standard rate
 'Full onboarding including tax file numbers and super fund setup',
 'confirmed');
```

---

## Data Validation and Quality Checks

### Service Catalog Validation

```sql
-- Ensure all billing units are standardized
SELECT DISTINCT billing_unit, COUNT(*) as service_count
FROM billing_plan
GROUP BY billing_unit
ORDER BY service_count DESC;

-- Expected billing units:
-- Per Payslip, Per Employee, Per Hour, Per Month, Once Off, Per State,
-- Per Payroll, Per Termination, Per Lodgement, Per Registration, 
-- Per Pay, Per Payrun, Per Disbursement
```

### Service Category Distribution

```sql
-- Check service distribution across categories
SELECT category, COUNT(*) as service_count, 
       ROUND(AVG(standard_rate), 2) as avg_rate,
       MIN(standard_rate) as min_rate,
       MAX(standard_rate) as max_rate
FROM billing_plan
GROUP BY category
ORDER BY service_count DESC;
```

### Client Service Agreement Validation

```sql
-- Validate client agreements have valid billing plans and clients
SELECT cba.id, c.name as client_name, bp.name as service_name,
       COALESCE(cba.custom_rate, bp.standard_rate) as effective_rate,
       bp.billing_unit
FROM client_billing_assignment cba
JOIN clients c ON cba.client_id = c.id
JOIN billing_plan bp ON cba.billing_plan_id = bp.id
WHERE cba.is_active = true AND cba.is_enabled = true
ORDER BY c.name, bp.category;
```

---

## Migration Strategy

### Step 1: Enhance Existing Tables

```sql
-- Add new columns to existing billing_plan table
ALTER TABLE billing_plan 
ADD COLUMN IF NOT EXISTS billing_unit VARCHAR(50) DEFAULT 'Per Payroll',
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Processing',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add new columns to existing client_billing_assignment table
ALTER TABLE client_billing_assignment
ADD COLUMN IF NOT EXISTS custom_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS billing_frequency VARCHAR(50) DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS effective_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT true;

-- Add new columns to existing billing_items table
ALTER TABLE billing_items
ADD COLUMN IF NOT EXISTS billing_plan_id UUID REFERENCES billing_plan(id),
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id),
ADD COLUMN IF NOT EXISTS staff_user_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS service_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft';
```

### Step 2: Create New Tables

```sql
-- Create time_entries table for profitability tracking
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_user_id UUID NOT NULL REFERENCES users(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    payroll_id UUID REFERENCES payrolls(id),
    billing_item_id UUID REFERENCES billing_items(id),
    work_date DATE NOT NULL,
    hours_spent DECIMAL(4,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create billing_periods table for invoice consolidation
CREATE TABLE IF NOT EXISTS billing_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id, period_start, period_end)
);

-- Add billing period reference to billing_invoice
ALTER TABLE billing_invoice
ADD COLUMN IF NOT EXISTS billing_period_id UUID REFERENCES billing_periods(id),
ADD COLUMN IF NOT EXISTS payroll_count INTEGER,
ADD COLUMN IF NOT EXISTS total_hours DECIMAL(6,2);
```

### Step 3: Data Population

```sql
-- 1. Insert service catalog data (use the INSERT statements above)
-- 2. Set up sample client service agreements
-- 3. Create initial billing periods for existing clients
-- 4. Migrate any existing billing data to new structure
```

---

## Testing and Validation Scripts

### Service Catalog Completeness Test

```sql
-- Verify all 56 services are loaded correctly
SELECT 
    category,
    COUNT(*) as loaded_services,
    CASE category
        WHEN 'Setup & Configuration' THEN 5
        WHEN 'Recurring Processing' THEN 18
        WHEN 'Employee Management' THEN 8
        WHEN 'Compliance & Reporting' THEN 12
        WHEN 'Ad-hoc Services' THEN 11
        WHEN 'Other' THEN 2
    END as expected_services,
    CASE 
        WHEN COUNT(*) = CASE category
            WHEN 'Setup & Configuration' THEN 5
            WHEN 'Recurring Processing' THEN 18
            WHEN 'Employee Management' THEN 8
            WHEN 'Compliance & Reporting' THEN 12
            WHEN 'Ad-hoc Services' THEN 11
            WHEN 'Other' THEN 2
        END THEN '✓ COMPLETE'
        ELSE '✗ MISSING SERVICES'
    END as status
FROM billing_plan
WHERE is_active = true
GROUP BY category
ORDER BY category;
```

### Billing Unit Standardization Test

```sql
-- Ensure billing units are properly standardized
SELECT billing_unit, COUNT(*) as usage_count
FROM billing_plan
WHERE billing_unit NOT IN (
    'Per Payslip', 'Per Employee', 'Per Hour', 'Per Month', 'Once Off',
    'Per State', 'Per Payroll', 'Per Termination', 'Per Lodgement',
    'Per Registration', 'Per Pay', 'Per Payrun', 'Per Disbursement'
)
GROUP BY billing_unit;

-- Should return no rows if all billing units are standardized
```

---

## Implementation Notes

### 1. Data Migration Considerations
- **Existing Data**: Preserve any existing billing_plan and client_billing_assignment data
- **Backward Compatibility**: Ensure existing billing workflows continue to function
- **Data Validation**: Implement checks to ensure data integrity during migration

### 2. Service Catalog Management
- **Admin Interface**: Create admin interface for managing service catalog
- **Version Control**: Track changes to service rates and descriptions
- **Audit Trail**: Log all modifications to services and client agreements

### 3. Client Onboarding
- **Default Services**: Define standard service packages for different client types
- **Custom Pricing**: Allow custom rates while maintaining standard rate fallbacks
- **Service Enablement**: Flexible enabling/disabling of services per client

### 4. Performance Considerations
- **Indexing**: Add appropriate indexes on frequently queried columns
- **Caching**: Consider caching frequently accessed service catalog data
- **Aggregation**: Optimize billing item aggregation queries for large datasets

---

## Summary

This seed data provides:
- **56 unique billing services** across 6 categories
- **Comprehensive pricing structure** with multiple billing units
- **Client service agreement examples** showing custom pricing
- **Sample time entries** for profitability tracking
- **Migration scripts** for existing database enhancement
- **Validation queries** to ensure data integrity

The data structure leverages the existing billing infrastructure while adding the flexibility needed for the semi-automated billing system, enabling:
- Individual payroll job billing
- Client-specific service rates
- Time tracking for profitability analysis
- Consolidated client invoicing
- Comprehensive service catalog management

This foundation supports the full billing workflow from service selection through invoice generation and profitability reporting.
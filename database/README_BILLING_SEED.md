# Billing System Seed Data

This directory contains comprehensive seed data scripts for populating the billing system with realistic test data.

## 📋 Overview

The seed data creates a complete billing ecosystem including:

- **500+ Time Entries** - Realistic work logs with 6-minute billing increments
- **1,000+ Billing Items** - Linked to real services, clients, and payrolls  
- **200+ Setup Services** - One-time implementation and configuration items
- **300+ Consulting Services** - Hourly consulting and adhoc work
- **100+ Invoices** - Sample invoices with proper GST calculations
- **Billing Periods** - Monthly billing cycles for active clients
- **Approval Workflows** - Realistic approval statuses and history

## 🚀 Quick Start

### Execute Seed Data
```bash
# Navigate to project root
cd /Users/nathanharris/Payroll/Payroll-ByteMy

# Run the seed script
./scripts/seed-billing-data.sh
```

### Manual Execution
```bash
# Connect directly to database
psql 'postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable' -f database/seed_billing_data.sql
```

## 📊 What Gets Created

### Time Entries (500+)
- **Realistic Hours**: 1-8 hours in 0.1 increments (6-minute billing)
- **Work Descriptions**: Monthly processing, onboarding, tax calculations, etc.
- **Billing Rates**: $180-$240/hour based on service complexity
- **Date Range**: Last 3 months of work
- **Linked to**: Active payrolls and real staff members

### Billing Items (1,000+)
- **Regular Services**: Monthly payroll processing, per-payslip billing
- **Setup Services**: Implementation, ATO registration, system migration
- **Consulting**: Adhoc hourly consulting and support
- **Status Distribution**: 70% approved, 15% pending, 10% invoiced, 5% rejected
- **Realistic Quantities**: Based on service type (payslips, employees, hours, etc.)

### Invoices (100+)
- **Invoice Numbers**: INV-YYYY-0001 format
- **GST Calculations**: 10% GST properly calculated
- **Status Mix**: Draft, sent, and paid invoices
- **Linked Items**: Billing items properly associated

### Revenue Tracking
- **Payroll Revenue**: Estimated and actual revenue calculations
- **Profit Margins**: Simple profit margin calculations
- **Billing Status**: Tracks billing progress per payroll

## 🔗 Data Relationships

```mermaid
graph LR
    C[Clients] --> P[Payrolls]
    P --> TE[Time Entries]
    P --> BI[Billing Items]
    S[Services] --> BI
    U[Users] --> TE
    U --> BI
    BI --> II[Invoice Items]
    I[Invoices] --> II
    BP[Billing Periods] --> I
```

## 📈 Sample Data Scenarios

### Small Business Client (5-15 employees)
- Monthly payroll processing: $95-285/month
- Quarterly compliance: $500-750/quarter  
- Setup services: $3,000-5,000 one-time
- Consulting: $180-240/hour as needed

### Medium Business Client (16-50 employees)
- Fortnightly payroll: $248-775/fortnight
- Multi-state compliance: $1,250-2,250/quarter
- Additional services: Workers comp, training
- Higher consulting volumes

### Enterprise Client (50+ employees)  
- Weekly payroll: $625-1,250/week
- Complex compliance: Multiple states, industries
- Premium consulting: $220-240/hour
- Custom reporting and integration

## 🧹 Cleanup Commands

To remove seed data (if needed):
```sql
-- Remove seed billing items
DELETE FROM billing_items WHERE description LIKE '%[SEED]%';

-- Remove seed time entries  
DELETE FROM time_entries WHERE description LIKE '%[SEED]%';

-- Remove test invoices
DELETE FROM billing_invoice WHERE invoice_number LIKE 'INV-%';

-- Reset payroll revenue tracking
UPDATE payrolls SET 
    estimated_revenue = NULL,
    actual_revenue = NULL, 
    estimated_hours = NULL,
    actual_hours = NULL,
    profit_margin = NULL,
    billing_status = 'not_started';
```

## 🔍 Data Verification

After running the seed script, verify data with:

```sql
-- Check billing items by status
SELECT status, COUNT(*), SUM(total_amount) as revenue
FROM billing_items 
GROUP BY status 
ORDER BY COUNT(*) DESC;

-- Check time entries by month
SELECT DATE_TRUNC('month', work_date) as month, 
       COUNT(*) as entries,
       SUM(hours_spent) as total_hours
FROM time_entries 
WHERE description LIKE '%[SEED]%'
GROUP BY month 
ORDER BY month DESC;

-- Check client billing summary
SELECT c.name, 
       COUNT(bi.id) as billing_items,
       SUM(bi.total_amount) as total_revenue,
       SUM(te.hours_spent) as total_hours
FROM clients c
LEFT JOIN billing_items bi ON bi.client_id = c.id
LEFT JOIN time_entries te ON te.client_id = c.id
WHERE c.active = true
GROUP BY c.name
ORDER BY total_revenue DESC;
```

## 🛠️ Customization

### Adjust Data Volume
Edit the `LIMIT` clauses in `seed_billing_data.sql`:
- Line ~95: Time entries limit (default: 500)
- Line ~150: Billing items limit (default: 1,000)  
- Line ~200: Setup services limit (default: 200)
- Line ~250: Consulting services limit (default: 300)

### Modify Rate Ranges
Edit the rate calculations:
- Time entry rates: Lines 80-85
- Service quantities: Lines 120-135
- Consulting hours: Lines 220-225

### Change Date Ranges
Modify the date generation:
- Time entries: Last 90 days (Line 75)
- Billing items: Last 90 days (Line 145)
- Setup services: Last 180 days (Line 195)

## 📋 Prerequisites

- Active clients in the `clients` table
- Active users in the `users` table  
- Active payrolls in the `payrolls` table
- Services populated from `populate_master_fee_types.sql`
- Proper database permissions for INSERT operations

## 🔒 Security Notes

- All seed data is marked with `[SEED]` prefix for easy identification
- No real client data is exposed
- Rates and amounts are realistic but fictional
- Can be safely run on production with proper backups

## 📞 Support

If you encounter issues:
1. Check database connectivity
2. Verify foreign key relationships exist
3. Ensure you have sufficient database permissions
4. Review the execution log for specific error messages

The seed script includes comprehensive error handling and progress reporting.
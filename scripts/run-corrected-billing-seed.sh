#!/bin/bash

# =============================================================================
# CORRECTED BILLING SEED DATA EXECUTION SCRIPT
# Runs the fully corrected billing seed data with proper constraints
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================"
echo "🌱 CORRECTED BILLING SEED DATA SCRIPT"
echo "========================================"

# Configuration
# Configuration - Use environment variables for sensitive data
if [ -z "$PGPASSWORD" ]; then
    echo -e "${RED}❌ ERROR: PGPASSWORD environment variable is required${NC}"
    echo "💡 Set your database password: export PGPASSWORD='your_password'"
    echo "   Or source your environment file: source .env.local"
    exit 1
fi

DB_URL="postgresql://admin:${PGPASSWORD}@192.168.1.229:5432/payroll_local?sslmode=disable"
SCRIPT_PATH="/Users/nathanharris/Payroll/Payroll-ByteMy/database/seed_billing_final_fixed.sql"

echo -e "${YELLOW}ℹ️  Script fixes:${NC}"
echo "  ✅ billing_items status: only 'draft', 'confirmed', 'billed'"
echo "  ✅ billing_invoice columns: uses 'issued_date' not 'invoice_date'"
echo "  ✅ payroll_status enum: 'Active', 'processing', 'completed', 'approved'"
echo "  ✅ billing_status enum: 'pending', 'items_added', 'ready_to_bill', 'billed'"
echo "  ✅ PostgreSQL CASE syntax: separate WHEN clauses"
echo "  ✅ Proper foreign key relationships"
echo "  ✅ Realistic Australian payroll data"
echo ""

echo -e "${YELLOW}📊 Expected results:${NC}"
echo "  • 500+ Time entries with realistic hours"
echo "  • 1,000+ Billing items with proper status distribution"
echo "  • 200+ Setup services for new clients"
echo "  • 300+ Consulting services (hourly)"
echo "  • 100+ Sample invoices with GST calculations"
echo "  • Revenue tracking updates for payrolls"
echo ""

read -p "Proceed with seed data creation? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled by user"
    exit 1
fi

echo -e "${YELLOW}🔄 Executing corrected seed script...${NC}"
echo ""

# Execute the script
if psql "$DB_URL" -f "$SCRIPT_PATH"; then
    echo ""
    echo -e "${GREEN}✅ Billing seed data created successfully!${NC}"
    echo ""
    echo -e "${YELLOW}🔍 Next steps:${NC}"
    echo "  1. Check the billing items dashboard for new data"
    echo "  2. Verify time tracking page shows linked entries"
    echo "  3. Test profitability analytics with real data"
    echo "  4. Review invoice generation functionality"
    echo ""
    echo -e "${YELLOW}🧹 To remove seed data later:${NC}"
    echo "  DELETE FROM billing_invoice_item WHERE description_override LIKE '%[SEED]%';"
    echo "  DELETE FROM billing_invoice WHERE invoice_number LIKE 'SEED-%';"
    echo "  DELETE FROM billing_items WHERE description LIKE '%[SEED]%';"
    echo "  DELETE FROM time_entries WHERE description LIKE '%[SEED]%';"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Seed script failed. Check the error messages above.${NC}"
    echo ""
    echo -e "${YELLOW}💡 Common issues:${NC}"
    echo "  • Database connection problems"
    echo "  • Missing prerequisite data (clients, users, services)"
    echo "  • Foreign key constraint violations"
    echo "  • Column name mismatches"
    echo ""
    echo "Run the diagnostic script to check prerequisites:"
    echo "  ./scripts/diagnose-billing-data.sh"
    exit 1
fi
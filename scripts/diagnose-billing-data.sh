#!/bin/bash

# =============================================================================
# BILLING DATA DIAGNOSTIC SCRIPT
# Checks prerequisites and database structure for seed data
# =============================================================================

set -e

# Configuration
DB_HOST="192.168.1.229"
DB_PORT="5432"
DB_NAME="payroll_local"
DB_USER="admin"
DB_PASS="PostH4rr!51604"
DB_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "========================================"
echo "   BILLING DATA DIAGNOSTIC REPORT"
echo "========================================"

# Check table existence
log_info "Checking if required tables exist..."
psql "$DB_URL" -c "
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') 
        THEN '✓ clients table exists' 
        ELSE '✗ clients table missing' END,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') 
        THEN '✓ users table exists' 
        ELSE '✗ users table missing' END,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payrolls') 
        THEN '✓ payrolls table exists' 
        ELSE '✗ payrolls table missing' END,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'services') 
        THEN '✓ services table exists' 
        ELSE '✗ services table missing' END,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'billing_items') 
        THEN '✓ billing_items table exists' 
        ELSE '✗ billing_items table missing' END,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'time_entries') 
        THEN '✓ time_entries table exists' 
        ELSE '✗ time_entries table missing' END;
" -t

echo ""
log_info "Checking data counts in prerequisite tables..."
psql "$DB_URL" -c "
SELECT 'clients (total)' as table_name, COUNT(*) as count FROM clients
UNION ALL
SELECT 'clients (active)', COUNT(*) FROM clients WHERE active = true
UNION ALL
SELECT 'users (total)', COUNT(*) FROM users  
UNION ALL
SELECT 'users (active)', COUNT(*) FROM users WHERE is_active = true
UNION ALL
SELECT 'payrolls (total)', COUNT(*) FROM payrolls
UNION ALL
SELECT 'payrolls (not superseded)', COUNT(*) FROM payrolls WHERE superseded_date IS NULL
UNION ALL
SELECT 'services (total)', COUNT(*) FROM services
UNION ALL
SELECT 'services (active)', COUNT(*) FROM services WHERE is_active = true;
" -t -A -F'|' | column -t -s'|'

echo ""
log_info "Checking column structures..."

# Check clients table structure
log_info "Clients table columns:"
psql "$DB_URL" -c "
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position;
" -t -A -F'|' | column -t -s'|'

echo ""
# Check users table structure  
log_info "Users table columns:"
psql "$DB_URL" -c "
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
" -t -A -F'|' | column -t -s'|'

echo ""
# Check payrolls table structure
log_info "Payrolls table columns:"
psql "$DB_URL" -c "
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'payrolls' 
ORDER BY ordinal_position;
" -t -A -F'|' | column -t -s'|'

echo ""
# Check services table structure
log_info "Services table columns:"
psql "$DB_URL" -c "
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'services' 
ORDER BY ordinal_position;
" -t -A -F'|' | column -t -s'|'

echo ""
log_info "Sample data from key tables (first 3 rows)..."

# Sample clients
log_info "Sample clients:"
psql "$DB_URL" -c "SELECT id, name, active FROM clients LIMIT 3;" -t -A -F'|' | column -t -s'|'

echo ""
# Sample users
log_info "Sample users:"
psql "$DB_URL" -c "SELECT id, first_name, last_name, is_active, role FROM users LIMIT 3;" -t -A -F'|' | column -t -s'|'

echo ""
# Sample payrolls
log_info "Sample payrolls:"
psql "$DB_URL" -c "SELECT id, name, client_id, status, superseded_date FROM payrolls LIMIT 3;" -t -A -F'|' | column -t -s'|'

echo ""
# Sample services
log_info "Sample services:"
psql "$DB_URL" -c "SELECT id, name, category, billing_unit, default_rate, is_active FROM services LIMIT 5;" -t -A -F'|' | column -t -s'|'

echo ""
log_info "Checking foreign key relationships..."
psql "$DB_URL" -c "
-- Check if payrolls have valid client_id references
SELECT 'payrolls->clients' as relationship,
       COUNT(*) as total_payrolls,
       COUNT(c.id) as valid_client_refs,
       COUNT(*) - COUNT(c.id) as invalid_refs
FROM payrolls p
LEFT JOIN clients c ON p.client_id = c.id
WHERE p.superseded_date IS NULL

UNION ALL

-- Check if we have consultant references
SELECT 'payrolls->consultants',
       COUNT(*) as total_payrolls,
       COUNT(u1.id) + COUNT(u2.id) as valid_consultant_refs,
       COUNT(*) - (COUNT(u1.id) + COUNT(u2.id)) as missing_consultants
FROM payrolls p
LEFT JOIN users u1 ON p.primary_consultant_user_id = u1.id  
LEFT JOIN users u2 ON p.backup_consultant_user_id = u2.id
WHERE p.superseded_date IS NULL;
" -t -A -F'|' | column -t -s'|'

echo ""
log_success "Diagnostic complete. Check the output above for any issues."
echo ""
log_info "Common issues and solutions:"
echo "  1. No active clients → Create test clients"
echo "  2. No active users → Create test users"  
echo "  3. No payrolls → Create test payrolls"
echo "  4. No services → Run populate_master_fee_types.sql migration"
echo "  5. Missing columns → Run create_billing_tables.sql migration"
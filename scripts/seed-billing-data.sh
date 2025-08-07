#!/bin/bash

# =============================================================================
# BILLING SEED DATA EXECUTION SCRIPT
# Executes the comprehensive billing seed data script safely
# =============================================================================

set -e  # Exit on any error

# Configuration - Use environment variables for sensitive data
DB_HOST="${PGHOST:-192.168.1.229}"
DB_PORT="${PGPORT:-5432}"
DB_NAME="${PGDATABASE:-payroll_local}"
DB_USER="${PGUSER:-admin}"
DB_PASS="${PGPASSWORD}"

# Validate required environment variables
if [ -z "$DB_PASS" ]; then
    echo "❌ ERROR: PGPASSWORD environment variable is required"
    echo "💡 Set your database password: export PGPASSWORD='your_password'"
    echo "   Or source your environment file: source .env.local"
    exit 1
fi

DB_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SEED_FILE="$PROJECT_ROOT/database/seed_billing_data.sql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if seed file exists
check_seed_file() {
    if [[ ! -f "$SEED_FILE" ]]; then
        log_error "Seed file not found: $SEED_FILE"
        exit 1
    fi
    log_info "Found seed file: $SEED_FILE"
}

# Test database connection
test_connection() {
    log_info "Testing database connection..."
    
    if ! command -v psql &> /dev/null; then
        log_error "psql command not found. Please install PostgreSQL client tools."
        exit 1
    fi
    
    if psql "$DB_URL" -c "SELECT 1;" &> /dev/null; then
        log_success "Database connection successful"
    else
        log_error "Failed to connect to database: $DB_URL"
        log_warning "Please check your database credentials and connectivity"
        exit 1
    fi
}

# Show current data counts
show_current_data() {
    log_info "Current billing data counts:"
    psql "$DB_URL" -c "
        SELECT 'clients (active)' as table_name, COUNT(*) as count FROM clients WHERE active = true
        UNION ALL
        SELECT 'users (active)', COUNT(*) FROM users WHERE is_active = true  
        UNION ALL
        SELECT 'payrolls (active)', COUNT(*) FROM payrolls WHERE superseded_date IS NULL
        UNION ALL
        SELECT 'services (active)', COUNT(*) FROM services WHERE is_active = true
        UNION ALL
        SELECT 'billing_items (existing)', COUNT(*) FROM billing_items
        UNION ALL
        SELECT 'time_entries (existing)', COUNT(*) FROM time_entries
        UNION ALL
        SELECT 'billing_periods (existing)', COUNT(*) FROM billing_periods;
    " -t -A -F'|' | column -t -s'|'
}

# Execute seed script
run_seed_script() {
    log_info "Executing billing seed data script..."
    log_warning "This will create sample billing data including:"
    echo "  • Billing periods for active clients"
    echo "  • Time entries with realistic hours and descriptions"  
    echo "  • Billing items linked to services and payrolls"
    echo "  • Sample invoices and invoice items"
    echo "  • Approval workflows and status updates"
    echo ""
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Seed script execution cancelled"
        exit 0
    fi
    
    log_info "Running seed script..."
    
    # Execute the seed script and capture output
    if psql "$DB_URL" -f "$SEED_FILE" > /tmp/seed_output.log 2>&1; then
        log_success "Seed script executed successfully!"
        
        # Show summary from the script output
        log_info "Seed Data Summary:"
        cat /tmp/seed_output.log | tail -20
        
    else
        log_error "Seed script failed. Check the error log:"
        cat /tmp/seed_output.log
        exit 1
    fi
}

# Show post-execution data
show_final_data() {
    log_info "Final billing data counts:"
    psql "$DB_URL" -c "
        SELECT 'billing_items (total)' as table_name, COUNT(*) as count FROM billing_items
        UNION ALL
        SELECT 'billing_items (seed)', COUNT(*) FROM billing_items WHERE description LIKE '%[SEED]%'
        UNION ALL
        SELECT 'time_entries (total)', COUNT(*) FROM time_entries  
        UNION ALL
        SELECT 'time_entries (seed)', COUNT(*) FROM time_entries WHERE description LIKE '%[SEED]%'
        UNION ALL
        SELECT 'billing_periods', COUNT(*) FROM billing_periods
        UNION ALL
        SELECT 'billing_invoices', COUNT(*) FROM billing_invoice
        UNION ALL
        SELECT 'approved_items', COUNT(*) FROM billing_items WHERE status = 'approved'
        UNION ALL
        SELECT 'pending_items', COUNT(*) FROM billing_items WHERE status = 'pending';
    " -t -A -F'|' | column -t -s'|'
}

# Cleanup function
cleanup() {
    rm -f /tmp/seed_output.log
}

# Main execution
main() {
    echo "========================================"
    echo "   BILLING SEED DATA EXECUTION SCRIPT"
    echo "========================================"
    echo ""
    
    check_seed_file
    test_connection
    show_current_data
    echo ""
    run_seed_script
    echo ""
    show_final_data
    
    log_success "Billing seed data script completed successfully!"
    log_info "You can now test the billing features with realistic data"
    
    cleanup
}

# Handle script interruption
trap cleanup EXIT

# Execute main function
main "$@"
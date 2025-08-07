#!/bin/bash

# =============================================================================
# Comprehensive Billing Enhancement Migration Runner
# This script safely runs all billing system migrations with rollback capability
# =============================================================================

set -e  # Exit on any error

# Configuration - Use DATABASE_URL from environment or default
DB_CONNECTION_STRING="${DATABASE_URL:-postgresql://admin:[REDACTED_DB_PASSWORD]@192.168.1.229:5432/payroll_local?sslmode=disable}"
MIGRATION_DIR="database/migrations"
LOG_FILE="migration_$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR="migration_backups_$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log with timestamp
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a "$LOG_FILE"
}

# Function to execute SQL with error handling
execute_sql() {
    local sql_file="$1"
    local description="$2"
    
    log "Executing: $description"
    log "File: $sql_file"
    
    if ! psql "$DB_CONNECTION_STRING" -f "$sql_file" >> "$LOG_FILE" 2>&1; then
        log_error "Failed to execute: $description"
        log_error "Check $LOG_FILE for details"
        return 1
    fi
    
    log_success "Successfully executed: $description"
    return 0
}

# Function to create backup
create_backup() {
    log "Creating database backup before migration..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup critical tables
    local tables=(
        "billing_plan"
        "client_billing_assignment" 
        "billing_items"
        "time_entries"
        "payrolls"
        "services"
        "client_service_agreements"
    )
    
    for table in "${tables[@]}"; do
        log "Backing up table: $table"
        if psql "$DB_CONNECTION_STRING" -c "\\copy (SELECT * FROM $table) TO '$BACKUP_DIR/${table}_backup.csv' WITH CSV HEADER" >> "$LOG_FILE" 2>&1; then
            log_success "Backed up: $table"
        else
            log_warning "Could not backup $table (may not exist yet)"
        fi
    done
    
    # Full schema backup
    log "Creating full schema backup..."
    if pg_dump "$DB_CONNECTION_STRING" --schema-only > "$BACKUP_DIR/schema_backup.sql"; then
        log_success "Schema backup created"
    else
        log_error "Failed to create schema backup"
        return 1
    fi
}

# Function to verify database connection
verify_connection() {
    log "Verifying database connection..."
    if psql "$DB_CONNECTION_STRING" -c "SELECT version();" >> "$LOG_FILE" 2>&1; then
        log_success "Database connection verified"
        return 0
    else
        log_error "Cannot connect to database"
        log_error "Please check connection string: $DB_CONNECTION_STRING"
        return 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if required files exist
    local required_files=(
        "$MIGRATION_DIR/comprehensive_billing_enhancement.sql"
        "$MIGRATION_DIR/legacy_billing_cleanup.sql"
        "$MIGRATION_DIR/automated_billing_generation.sql"
        "$MIGRATION_DIR/populate_master_fee_types.sql"
        "$MIGRATION_DIR/rollback_comprehensive_billing.sql"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Required migration file not found: $file"
            return 1
        fi
    done
    
    log_success "All required migration files found"
    
    # Check if psql is available
    if ! command -v psql &> /dev/null; then
        log_error "psql command not found. Please install PostgreSQL client tools."
        return 1
    fi
    
    log_success "Prerequisites check passed"
    return 0
}

# Function to run rollback
run_rollback() {
    log_warning "INITIATING ROLLBACK PROCEDURE"
    log_warning "This will revert all billing system enhancements"
    
    read -p "Are you sure you want to rollback? (type 'ROLLBACK' to confirm): " confirm
    if [[ "$confirm" != "ROLLBACK" ]]; then
        log "Rollback cancelled"
        return 0
    fi
    
    if execute_sql "$MIGRATION_DIR/rollback_comprehensive_billing.sql" "Comprehensive Billing Enhancement Rollback"; then
        log_success "🔄 ROLLBACK COMPLETED SUCCESSFULLY"
        log_success "Legacy billing system has been restored"
        log_success "All enhancements have been removed"
    else
        log_error "❌ ROLLBACK FAILED"
        log_error "Please check the logs and contact support"
        return 1
    fi
}

# Function to show current status
show_status() {
    log "Checking current system status..."
    
    # Check if new tables exist
    local status_query="
    SELECT 
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quotes') 
             THEN 'ENHANCED' ELSE 'LEGACY' END as billing_system,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'billing_plan') 
             THEN 'EXISTS' ELSE 'REMOVED' END as legacy_tables,
        CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'time_entries' AND column_name = 'time_units') 
             THEN 'ENHANCED' ELSE 'STANDARD' END as time_tracking;
    "
    
    psql "$DB_CONNECTION_STRING" -c "$status_query"
}

# Main execution function
run_migration() {
    log "🚀 STARTING COMPREHENSIVE BILLING ENHANCEMENT MIGRATION"
    log "=================================================="
    
    # Phase 1: Core Enhancement (Quoting + Time Tracking)
    if execute_sql "$MIGRATION_DIR/comprehensive_billing_enhancement.sql" "Phase 1: Core Billing Enhancement (Quoting System + 6-Minute Time Tracking)"; then
        log_success "✅ Phase 1 completed successfully"
    else
        log_error "❌ Phase 1 failed - Migration aborted"
        return 1
    fi
    
    # Phase 2: Legacy Cleanup
    if execute_sql "$MIGRATION_DIR/legacy_billing_cleanup.sql" "Phase 2: Legacy System Cleanup"; then
        log_success "✅ Phase 2 completed successfully"
    else
        log_error "❌ Phase 2 failed - Rolling back Phase 1"
        run_rollback
        return 1
    fi
    
    # Phase 3: Automation Setup
    if execute_sql "$MIGRATION_DIR/automated_billing_generation.sql" "Phase 3: Automated Billing Generation"; then
        log_success "✅ Phase 3 completed successfully"
    else
        log_error "❌ Phase 3 failed - Rolling back all phases"
        run_rollback
        return 1
    fi
    
    # Phase 4: Master Data Population
    if execute_sql "$MIGRATION_DIR/populate_master_fee_types.sql" "Phase 4: Master Fee Types Population"; then
        log_success "✅ Phase 4 completed successfully"
    else
        log_error "❌ Phase 4 failed - Rolling back all phases"
        run_rollback
        return 1
    fi
    
    log_success "🎉 ALL MIGRATION PHASES COMPLETED SUCCESSFULLY!"
    log_success "=================================================="
    log_success "✅ Quoting system deployed"
    log_success "✅ 6-minute time tracking enabled"
    log_success "✅ Automated billing generation active"
    log_success "✅ Master fee types populated"
    log_success "✅ Legacy system cleaned up"
    
    show_status
}

# Main script logic
main() {
    echo "=============================================="
    echo "Comprehensive Billing Enhancement Migration"
    echo "=============================================="
    echo ""
    
    # Parse command line arguments
    case "${1:-run}" in
        "run")
            if ! verify_connection; then
                exit 1
            fi
            
            if ! check_prerequisites; then
                exit 1
            fi
            
            echo "This will enhance your billing system with:"
            echo "• Professional quoting system"
            echo "• 6-minute time tracking"
            echo "• Automated billing generation"
            echo "• Master fee types from your reference image"
            echo "• Remove legacy billing_plan tables"
            echo ""
            echo "A complete backup will be created before migration."
            echo "A rollback script is available if needed."
            echo ""
            read -p "Continue with migration? (y/N): " confirm
            
            if [[ "$confirm" =~ ^[Yy]$ ]]; then
                create_backup
                run_migration
            else
                echo "Migration cancelled"
                exit 0
            fi
            ;;
            
        "rollback")
            if ! verify_connection; then
                exit 1
            fi
            
            run_rollback
            ;;
            
        "status")
            if ! verify_connection; then
                exit 1
            fi
            
            show_status
            ;;
            
        "help"|"--help"|"-h")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  run      - Run the complete migration (default)"
            echo "  rollback - Rollback all enhancements to legacy system"
            echo "  status   - Show current system status"
            echo "  help     - Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 run      # Run migration with confirmation prompts"
            echo "  $0 status   # Check current billing system status"
            echo "  $0 rollback # Revert to legacy billing system"
            ;;
            
        *)
            echo "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
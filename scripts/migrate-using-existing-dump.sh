#!/bin/bash

# Database Migration Script: Using Existing Dump
# This script migrates using the existing neondb.dump file
# Excludes neon_auth schema as it's unused legacy code

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./database-migration-$TIMESTAMP"

# Source dump file
DUMP_FILE="./neondb.dump"

# Target (Local) Database
LOCAL_HOST="192.168.1.229"
LOCAL_PORT="5432"
LOCAL_DB="payroll_local"
LOCAL_USER="admin"
LOCAL_PASSWORD="PostH4rr!51604"
LOCAL_URL="postgres://$LOCAL_USER:$LOCAL_PASSWORD@$LOCAL_HOST:$LOCAL_PORT/$LOCAL_DB?sslmode=disable"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists pg_restore; then
        print_error "pg_restore not found. Please install PostgreSQL client tools."
        exit 1
    fi
    
    if ! command_exists psql; then
        print_error "psql not found. Please install PostgreSQL client tools."
        exit 1
    fi
    
    if [ ! -f "$DUMP_FILE" ]; then
        print_error "Dump file not found: $DUMP_FILE"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Create backup directory
create_backup_dir() {
    print_status "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    print_success "Backup directory created"
}

# Test local PostgreSQL connection
test_local_connection() {
    print_status "Testing local PostgreSQL connection..."
    
    LOCAL_POSTGRES_URL="postgres://$LOCAL_USER:$LOCAL_PASSWORD@$LOCAL_HOST:$LOCAL_PORT/postgres?sslmode=disable"
    
    if psql "$LOCAL_POSTGRES_URL" -c "SELECT 1;" >/dev/null 2>&1; then
        print_success "Local PostgreSQL connection successful"
    else
        print_error "Failed to connect to local PostgreSQL"
        exit 1
    fi
}

# Create local database if it doesn't exist
create_local_database() {
    print_status "Creating local database: $LOCAL_DB"
    
    LOCAL_POSTGRES_URL="postgres://$LOCAL_USER:$LOCAL_PASSWORD@$LOCAL_HOST:$LOCAL_PORT/postgres?sslmode=disable"
    
    # Drop database if it exists and create new one
    psql "$LOCAL_POSTGRES_URL" -c "DROP DATABASE IF EXISTS $LOCAL_DB;" 2>/dev/null || true
    psql "$LOCAL_POSTGRES_URL" -c "CREATE DATABASE $LOCAL_DB OWNER $LOCAL_USER;"
    
    print_success "Local database created: $LOCAL_DB"
}

# Install required extensions
install_extensions() {
    print_status "Installing required PostgreSQL extensions..."
    
    psql "$LOCAL_URL" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
    psql "$LOCAL_URL" -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
    psql "$LOCAL_URL" -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
    
    print_success "Extensions installed successfully"
}

# Restore database (excluding neon_auth schema)
restore_database() {
    print_status "Restoring database from dump (excluding neon_auth schema)..."
    
    # First, restore everything except neon_auth schema
    pg_restore \
        --dbname="$LOCAL_URL" \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        --exclude-schema=neon_auth \
        --verbose \
        "$DUMP_FILE" 2>&1 | tee "$BACKUP_DIR/restore.log"
    
    print_success "Database restored successfully"
}

# Fix any permission issues
fix_permissions() {
    print_status "Fixing database permissions..."
    
    # Set ownership of all tables to the local user
    psql "$LOCAL_URL" -c "
        DO \$\$
        DECLARE
            r RECORD;
        BEGIN
            FOR r IN (SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('public', 'audit', 'hdb_catalog'))
            LOOP
                EXECUTE 'ALTER TABLE ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' OWNER TO $LOCAL_USER';
            END LOOP;
        END
        \$\$;
    "
    
    print_success "Permissions fixed"
}

# Verify migration
verify_migration() {
    print_status "Verifying migration..."
    
    # Check if key tables exist
    USERS_COUNT=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM public.users;" 2>/dev/null || echo "0")
    CLIENTS_COUNT=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM public.clients;" 2>/dev/null || echo "0")
    PAYROLLS_COUNT=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM public.payrolls;" 2>/dev/null || echo "0")
    
    # Count tables in each schema
    PUBLIC_TABLES=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    AUDIT_TABLES=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'audit';" | tr -d ' ')
    HDB_TABLES=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'hdb_catalog';" | tr -d ' ')
    
    echo ""
    echo "========================================="
    echo "MIGRATION VERIFICATION"
    echo "========================================="
    echo "Schema table counts:"
    echo "  public: $PUBLIC_TABLES tables"
    echo "  audit: $AUDIT_TABLES tables"
    echo "  hdb_catalog: $HDB_TABLES tables"
    echo ""
    echo "Sample data counts:"
    echo "  users: $USERS_COUNT records"
    echo "  clients: $CLIENTS_COUNT records"
    echo "  payrolls: $PAYROLLS_COUNT records"
    echo ""
    
    # Check if neon_auth schema was excluded
    NEON_AUTH_EXISTS=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name = 'neon_auth';" | tr -d ' ')
    
    if [[ "$NEON_AUTH_EXISTS" -eq 0 ]]; then
        print_success "neon_auth schema successfully excluded"
    else
        print_warning "neon_auth schema was not excluded - will need manual cleanup"
    fi
    
    if [[ "$PUBLIC_TABLES" -gt 0 ]] && [[ "$USERS_COUNT" -gt 0 ]]; then
        print_success "Migration appears successful - data is accessible"
    else
        print_warning "Migration may have issues - please investigate"
    fi
}

# Generate connection string for .env.local
generate_env_config() {
    print_status "Generating new DATABASE_URL for .env.local..."
    
    NEW_DATABASE_URL="postgres://$LOCAL_USER:$LOCAL_PASSWORD@$LOCAL_HOST:$LOCAL_PORT/$LOCAL_DB?sslmode=disable"
    
    echo ""
    echo "========================================="
    echo "NEW DATABASE CONFIGURATION"
    echo "========================================="
    echo "Add this to your .env.local file:"
    echo ""
    echo "# Local PostgreSQL Database"
    echo "DATABASE_URL=\"$NEW_DATABASE_URL\""
    echo "DATABASE_URL_UNPOOLED=\"$NEW_DATABASE_URL\""
    echo ""
    echo "# Update other database variables"
    echo "PGHOST=\"$LOCAL_HOST\""
    echo "PGDATABASE=\"$LOCAL_DB\""
    echo "PGUSER=\"$LOCAL_USER\""
    echo "PGPASSWORD=\"$LOCAL_PASSWORD\""
    echo ""
    echo "POSTGRES_HOST=\"$LOCAL_HOST\""
    echo "POSTGRES_DATABASE=\"$LOCAL_DB\""
    echo "POSTGRES_USER=\"$LOCAL_USER\""
    echo "POSTGRES_PASSWORD=\"$LOCAL_PASSWORD\""
    echo "POSTGRES_URL=\"$NEW_DATABASE_URL\""
    echo "POSTGRES_URL_NON_POOLING=\"$NEW_DATABASE_URL\""
    echo "POSTGRES_URL_NO_SSL=\"$NEW_DATABASE_URL\""
    echo "POSTGRES_PRISMA_URL=\"$NEW_DATABASE_URL?connect_timeout=15\""
    echo "========================================="
    echo ""
    
    # Save to file
    cat > "$BACKUP_DIR/new_env_config.txt" << EOF
# Local PostgreSQL Database Configuration
# Replace the existing database configuration in .env.local with these values:

DATABASE_URL="$NEW_DATABASE_URL"
DATABASE_URL_UNPOOLED="$NEW_DATABASE_URL"

PGHOST="$LOCAL_HOST"
PGDATABASE="$LOCAL_DB"
PGUSER="$LOCAL_USER"
PGPASSWORD="$LOCAL_PASSWORD"

POSTGRES_HOST="$LOCAL_HOST"
POSTGRES_DATABASE="$LOCAL_DB"
POSTGRES_USER="$LOCAL_USER"
POSTGRES_PASSWORD="$LOCAL_PASSWORD"
POSTGRES_URL="$NEW_DATABASE_URL"
POSTGRES_URL_NON_POOLING="$NEW_DATABASE_URL"
POSTGRES_URL_NO_SSL="$NEW_DATABASE_URL"
POSTGRES_PRISMA_URL="$NEW_DATABASE_URL?connect_timeout=15"
EOF
    
    print_success "Configuration saved to: $BACKUP_DIR/new_env_config.txt"
}

# Main migration function
main() {
    echo "========================================="
    echo "PAYROLL DATABASE MIGRATION"
    echo "Using Existing Dump → Local PostgreSQL"
    echo "========================================="
    echo ""
    
    check_prerequisites
    create_backup_dir
    test_local_connection
    create_local_database
    install_extensions
    
    print_status "Starting restore phase..."
    restore_database
    fix_permissions
    
    print_status "Starting verification phase..."
    verify_migration
    
    generate_env_config
    
    print_success "Database migration completed successfully!"
    print_status "Migration logs are located in: $BACKUP_DIR"
    print_warning "Remember to update your .env.local file with the new database configuration"
    print_warning "Test your application thoroughly before switching production traffic"
}

# Run the migration
main "$@"
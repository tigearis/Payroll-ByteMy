#!/bin/bash

# Database Migration Script: Neon to Local PostgreSQL
# This script migrates the Payroll application database from Neon to local PostgreSQL
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

# Source (Neon) Database
NEON_HOST="ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech"
NEON_DB="neondb"
NEON_USER="neondb_owner"
NEON_PASSWORD="npg_WavFRZ1lEx4U"
NEON_URL="postgres://$NEON_USER:$NEON_PASSWORD@$NEON_HOST/$NEON_DB?sslmode=require"

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
    
    if ! command_exists pg_dump; then
        print_error "pg_dump not found. Please install PostgreSQL client tools."
        exit 1
    fi
    
    if ! command_exists psql; then
        print_error "psql not found. Please install PostgreSQL client tools."
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

# Test database connections
test_connections() {
    print_status "Testing database connections..."
    
    # Test Neon connection
    print_status "Testing Neon database connection..."
    if psql "$NEON_URL" -c "SELECT 1;" >/dev/null 2>&1; then
        print_success "Neon database connection successful"
    else
        print_error "Failed to connect to Neon database"
        exit 1
    fi
    
    # Test local PostgreSQL connection
    print_status "Testing local PostgreSQL connection..."
    if psql "$LOCAL_URL" -c "SELECT 1;" >/dev/null 2>&1; then
        print_success "Local PostgreSQL connection successful"
    else
        print_error "Failed to connect to local PostgreSQL. Creating database..."
        create_local_database
    fi
}

# Create local database if it doesn't exist
create_local_database() {
    print_status "Creating local database: $LOCAL_DB"
    
    # Connect to postgres database to create our target database
    LOCAL_POSTGRES_URL="postgres://$LOCAL_USER:$LOCAL_PASSWORD@$LOCAL_HOST:$LOCAL_PORT/postgres?sslmode=disable"
    
    # Drop database if it exists and create new one
    psql "$LOCAL_POSTGRES_URL" -c "DROP DATABASE IF EXISTS $LOCAL_DB;"
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

# Backup schema (excluding neon_auth)
backup_schema() {
    print_status "Backing up database schema (excluding neon_auth)..."
    
    pg_dump "$NEON_URL" \
        --schema-only \
        --no-owner \
        --no-privileges \
        --exclude-schema=neon_auth \
        --file="$BACKUP_DIR/schema_backup.sql"
    
    print_success "Schema backup completed: $BACKUP_DIR/schema_backup.sql"
}

# Backup data (excluding neon_auth)
backup_data() {
    print_status "Backing up database data (excluding neon_auth)..."
    
    pg_dump "$NEON_URL" \
        --data-only \
        --no-owner \
        --no-privileges \
        --exclude-schema=neon_auth \
        --file="$BACKUP_DIR/data_backup.sql"
    
    print_success "Data backup completed: $BACKUP_DIR/data_backup.sql"
}

# Create full backup for safety
backup_full() {
    print_status "Creating full backup for safety (including neon_auth)..."
    
    pg_dump "$NEON_URL" \
        --no-owner \
        --no-privileges \
        --file="$BACKUP_DIR/full_backup.sql"
    
    print_success "Full backup completed: $BACKUP_DIR/full_backup.sql"
}

# Restore schema to local database
restore_schema() {
    print_status "Restoring schema to local database..."
    
    psql "$LOCAL_URL" -f "$BACKUP_DIR/schema_backup.sql"
    
    print_success "Schema restored successfully"
}

# Restore data to local database
restore_data() {
    print_status "Restoring data to local database..."
    
    psql "$LOCAL_URL" -f "$BACKUP_DIR/data_backup.sql"
    
    print_success "Data restored successfully"
}

# Verify migration
verify_migration() {
    print_status "Verifying migration..."
    
    # Count tables in each schema
    print_status "Checking table counts..."
    
    # Get table counts from source (excluding neon_auth)
    NEON_PUBLIC_COUNT=$(psql "$NEON_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    NEON_AUDIT_COUNT=$(psql "$NEON_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'audit';")
    NEON_HDB_COUNT=$(psql "$NEON_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'hdb_catalog';")
    
    # Get table counts from target
    LOCAL_PUBLIC_COUNT=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    LOCAL_AUDIT_COUNT=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'audit';")
    LOCAL_HDB_COUNT=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'hdb_catalog';")
    
    echo "Table count comparison:"
    echo "  public schema: Neon=$NEON_PUBLIC_COUNT, Local=$LOCAL_PUBLIC_COUNT"
    echo "  audit schema: Neon=$NEON_AUDIT_COUNT, Local=$LOCAL_AUDIT_COUNT"
    echo "  hdb_catalog schema: Neon=$NEON_HDB_COUNT, Local=$LOCAL_HDB_COUNT"
    
    # Check if counts match
    if [[ "$NEON_PUBLIC_COUNT" -eq "$LOCAL_PUBLIC_COUNT" ]] && \
       [[ "$NEON_AUDIT_COUNT" -eq "$LOCAL_AUDIT_COUNT" ]] && \
       [[ "$NEON_HDB_COUNT" -eq "$LOCAL_HDB_COUNT" ]]; then
        print_success "Table counts match - migration appears successful"
    else
        print_warning "Table counts don't match - please investigate"
    fi
    
    # Test a sample query
    print_status "Testing sample queries..."
    
    USER_COUNT=$(psql "$LOCAL_URL" -t -c "SELECT COUNT(*) FROM public.users;")
    print_status "Users table contains $USER_COUNT records"
    
    if [[ "$USER_COUNT" -gt 0 ]]; then
        print_success "Sample query successful - data is accessible"
    else
        print_warning "No users found - please verify data migration"
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
    echo "Neon → Local PostgreSQL"
    echo "========================================="
    echo ""
    
    check_prerequisites
    create_backup_dir
    test_connections
    install_extensions
    
    print_status "Starting backup phase..."
    backup_full
    backup_schema
    backup_data
    
    print_status "Starting restore phase..."
    restore_schema
    restore_data
    
    print_status "Starting verification phase..."
    verify_migration
    
    generate_env_config
    
    print_success "Database migration completed successfully!"
    print_status "Backup files are located in: $BACKUP_DIR"
    print_warning "Remember to update your .env.local file with the new database configuration"
    print_warning "Test your application thoroughly before switching production traffic"
}

# Run the migration
main "$@"
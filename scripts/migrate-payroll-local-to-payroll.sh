#!/bin/bash

# Migration Script: Move data from payroll_local to payroll database
# Since we created payroll_local but you're using payroll database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Database configuration
LOCAL_HOST="192.168.1.229"
LOCAL_USER="admin"
LOCAL_PASSWORD="PostH4rr!51604"

SOURCE_DB="payroll_local"
TARGET_DB="payroll"

POSTGRES_URL="postgresql://admin@$LOCAL_HOST:5432/postgres?sslmode=disable"
SOURCE_URL="postgresql://admin@$LOCAL_HOST:5432/$SOURCE_DB?sslmode=disable"
TARGET_URL="postgresql://admin@$LOCAL_HOST:5432/$TARGET_DB?sslmode=disable"

main() {
    echo "========================================="
    echo "MIGRATE PAYROLL_LOCAL → PAYROLL"
    echo "========================================="
    echo ""
    
    print_status "Checking if payroll_local database exists and has data..."
    
    # Check if source database exists
    SOURCE_EXISTS=$(PGPASSWORD="$LOCAL_PASSWORD" psql "$POSTGRES_URL" -t -c "SELECT 1 FROM pg_database WHERE datname = '$SOURCE_DB';" 2>/dev/null | tr -d ' ')
    
    if [ "$SOURCE_EXISTS" != "1" ]; then
        print_error "Source database '$SOURCE_DB' does not exist"
        print_status "This means the migration didn't create the expected database"
        exit 1
    fi
    
    print_success "Source database '$SOURCE_DB' exists"
    
    # Check if source has data
    USER_COUNT=$(PGPASSWORD="$LOCAL_PASSWORD" psql "$SOURCE_URL" -t -c "SELECT COUNT(*) FROM public.users;" 2>/dev/null | tr -d ' ')
    
    if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
        print_error "Source database '$SOURCE_DB' appears to be empty"
        exit 1
    fi
    
    print_success "Source database has $USER_COUNT users - data confirmed"
    
    # Check if target database exists
    TARGET_EXISTS=$(PGPASSWORD="$LOCAL_PASSWORD" psql "$POSTGRES_URL" -t -c "SELECT 1 FROM pg_database WHERE datname = '$TARGET_DB';" 2>/dev/null | tr -d ' ')
    
    if [ "$TARGET_EXISTS" != "1" ]; then
        print_status "Creating target database '$TARGET_DB'..."
        PGPASSWORD="$LOCAL_PASSWORD" psql "$POSTGRES_URL" -c "CREATE DATABASE $TARGET_DB OWNER $LOCAL_USER;"
        print_success "Target database '$TARGET_DB' created"
    else
        print_warning "Target database '$TARGET_DB' already exists - will overwrite"
    fi
    
    print_status "Dumping data from '$SOURCE_DB'..."
    
    # Create a comprehensive dump
    PGPASSWORD="$LOCAL_PASSWORD" pg_dump "$SOURCE_URL" \
        --no-owner \
        --no-privileges \
        --clean \
        --if-exists \
        --file="payroll_data_transfer.sql"
    
    print_success "Data dumped to payroll_data_transfer.sql"
    
    print_status "Restoring data to '$TARGET_DB'..."
    
    # Restore to target database
    PGPASSWORD="$LOCAL_PASSWORD" psql "$TARGET_URL" -f "payroll_data_transfer.sql"
    
    print_success "Data restored to '$TARGET_DB'"
    
    # Verify the migration
    print_status "Verifying migration..."
    
    TARGET_USER_COUNT=$(PGPASSWORD="$LOCAL_PASSWORD" psql "$TARGET_URL" -t -c "SELECT COUNT(*) FROM public.users;" 2>/dev/null | tr -d ' ')
    
    if [ "$TARGET_USER_COUNT" = "$USER_COUNT" ]; then
        print_success "Migration verification successful: $TARGET_USER_COUNT users in target database"
        
        # Check table counts
        print_status "Table comparison:"
        
        SOURCE_TABLES=$(PGPASSWORD="$LOCAL_PASSWORD" psql "$SOURCE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
        TARGET_TABLES=$(PGPASSWORD="$LOCAL_PASSWORD" psql "$TARGET_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
        
        echo "  Source ($SOURCE_DB): $SOURCE_TABLES tables"
        echo "  Target ($TARGET_DB): $TARGET_TABLES tables"
        
        if [ "$SOURCE_TABLES" = "$TARGET_TABLES" ]; then
            print_success "Table counts match - migration successful!"
            
            print_status "Cleaning up temporary files..."
            rm -f "payroll_data_transfer.sql"
            
            echo ""
            echo "========================================="
            echo "MIGRATION COMPLETED SUCCESSFULLY!"
            echo "========================================="
            echo ""
            echo "✅ Your application should now work with the 'payroll' database"
            echo "✅ All data has been transferred from 'payroll_local'"
            echo ""
            echo "Next steps:"
            echo "1. Test your application: pnpm dev"
            echo "2. Verify all functionality works"
            echo "3. Optionally remove 'payroll_local' database when confident"
            
        else
            print_warning "Table counts don't match - please investigate"
        fi
        
    else
        print_error "Migration verification failed: user counts don't match"
        echo "  Source: $USER_COUNT users"
        echo "  Target: $TARGET_USER_COUNT users"
    fi
}

main "$@"
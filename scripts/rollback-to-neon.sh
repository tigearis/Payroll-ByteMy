#!/bin/bash

# Rollback Script: Revert to Neon Database
# This script quickly reverts the application back to using Neon database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Original Neon configuration
restore_neon_config() {
    print_status "Restoring original Neon database configuration..."
    
    cat > "./neon_env_backup.txt" << 'EOF'
# Original Neon Database Configuration
# Replace the current database configuration in .env.local with these values:

DATABASE_URL="postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"

PGHOST="ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech"
PGHOST_UNPOOLED="ep-black-sunset-a7wbc0zq.ap-southeast-2.aws.neon.tech"
PGDATABASE="neondb"
PGUSER="neondb_owner"
PGPASSWORD="npg_WavFRZ1lEx4U"

POSTGRES_HOST="ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech"
POSTGRES_DATABASE="neondb"
POSTGRES_USER="neondb_owner"
POSTGRES_PASSWORD="npg_WavFRZ1lEx4U"
POSTGRES_URL="postgresql://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
POSTGRES_URL_NON_POOLING="postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"
POSTGRES_URL_NO_SSL="postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb"
POSTGRES_PRISMA_URL="postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb?connect_timeout=15&sslmode=require"
EOF
    
    print_success "Neon configuration saved to: neon_env_backup.txt"
}

# Test Neon connection
test_neon_connection() {
    print_status "Testing Neon database connection..."
    
    NEON_URL="postgres://neondb_owner:npg_WavFRZ1lEx4U@ep-black-sunset-a7wbc0zq-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"
    
    if psql "$NEON_URL" -c "SELECT 1;" >/dev/null 2>&1; then
        print_success "Neon database connection successful"
    else
        print_error "Failed to connect to Neon database - please check your connection"
        exit 1
    fi
}

main() {
    echo "========================================="
    echo "ROLLBACK TO NEON DATABASE"
    echo "========================================="
    echo ""
    
    print_warning "This script will help you rollback to the Neon database"
    print_warning "You will need to manually update your .env.local file"
    echo ""
    
    test_neon_connection
    restore_neon_config
    
    echo ""
    echo "========================================="
    echo "ROLLBACK INSTRUCTIONS"
    echo "========================================="
    echo "1. Copy the configuration from neon_env_backup.txt"
    echo "2. Replace the database section in your .env.local file"
    echo "3. Restart your application services"
    echo "4. Test that everything works correctly"
    echo ""
    echo "Your Neon database should still contain all the original data"
    echo "========================================="
    
    print_success "Rollback preparation completed"
}

main "$@"
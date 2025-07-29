#!/bin/bash

# Test Local PostgreSQL Connection
# This script tests the connection to the local PostgreSQL database

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Test different connection methods
echo "========================================="
echo "TESTING LOCAL POSTGRESQL CONNECTION"
echo "========================================="
echo ""

print_status "Testing connection to payroll_local database..."

# Try the configured connection
PGPASSWORD='PostH4rr!51604' PGSSLMODE=disable psql -h 192.168.1.229 -p 5432 -U admin -d payroll_local -c "SELECT COUNT(*) as user_count FROM public.users;" 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "Connection successful with admin user to payroll_local"
else
    print_error "Connection failed with admin user to payroll_local"
    echo ""
    print_status "Troubleshooting steps:"
    echo "1. Verify PostgreSQL is running on 192.168.1.229:5432"
    echo "2. Check if user 'admin' exists and has correct password"
    echo "3. Verify database 'payroll_local' was created"
    echo "4. Check PostgreSQL authentication configuration (pg_hba.conf)"
    echo ""
    
    print_status "Trying alternative connection methods..."
    
    # Try with postgres database
    print_status "Testing connection to postgres database..."
    PGPASSWORD='PostH4rr!51604' PGSSLMODE=disable psql -h 192.168.1.229 -p 5432 -U admin -d postgres -c "SELECT 1;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_success "Connection successful to postgres database"
        
        # Check if our database exists
        DB_EXISTS=$(PGPASSWORD='PostH4rr!51604' PGSSLMODE=disable psql -h 192.168.1.229 -p 5432 -U admin -d postgres -t -c "SELECT 1 FROM pg_database WHERE datname = 'payroll_local';" 2>/dev/null | tr -d ' ')
        
        if [ "$DB_EXISTS" = "1" ]; then
            print_success "Database 'payroll_local' exists"
        else
            print_error "Database 'payroll_local' does not exist"
        fi
    else
        print_error "Connection failed to postgres database with admin user"
    fi
fi

echo ""
print_status "Manual verification commands:"
echo ""
echo "1. Check if PostgreSQL is running:"
echo "   nmap -p 5432 192.168.1.229"
echo ""
echo "2. Test connection manually:"
echo "   PGPASSWORD='PostH4rr!51604' PGSSLMODE=disable psql -h 192.168.1.229 -p 5432 -U admin -d payroll_local"
echo ""
echo "3. If connection fails, check your PostgreSQL server:"
echo "   - User 'admin' exists with password 'PostH4rr!51604'"
echo "   - Database 'payroll_local' exists"
echo "   - pg_hba.conf allows connections from your IP"
echo "   - PostgreSQL is listening on 192.168.1.229:5432"
echo ""
echo "4. Alternative: Use CloudBeaver to verify the database exists"
echo "   and contains the migrated data"
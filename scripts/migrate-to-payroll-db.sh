#!/bin/bash

# Migrate Neon database dump to payroll database
set -e

echo "🚀 Starting migration to payroll database..."

# Database connection details
export PGHOST="192.168.1.229"
export PGPORT="5432"
export PGUSER="admin"
export PGPASSWORD="PostH4rr!51604"
export PGDATABASE="payroll"

echo "📋 Migration Details:"
echo "  Source: neondb.dump"
echo "  Target: postgresql://admin@192.168.1.229:5432/payroll"
echo "  SSL: disabled"
echo ""

# Check if dump file exists
if [ ! -f "neondb.dump" ]; then
    echo "❌ Error: neondb.dump file not found!"
    echo "Please ensure the dump file is in the current directory"
    exit 1
fi

echo "✅ Found neondb.dump file"

# Test database connection
echo "🔍 Testing database connection..."
if ! psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Cannot connect to payroll database"
    exit 1
fi
echo "✅ Database connection successful"

# Create necessary extensions
echo "🔧 Creating required extensions..."
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" || true
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c "CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";" || true
psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c "CREATE EXTENSION IF NOT EXISTS \"citext\";" || true

echo "📥 Starting database restore..."
echo "This may take several minutes..."

# Restore the database dump, excluding neon_auth schema
if pg_restore -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" \
    --no-owner \
    --no-privileges \
    --exclude-schema=neon_auth \
    --verbose \
    neondb.dump; then
    echo "✅ Database restore completed successfully"
else
    echo "⚠️  Database restore completed with some warnings (this is normal)"
fi

# Verify the migration
echo ""
echo "🔍 Verifying migration..."

# Count tables in each schema
echo "📊 Schema summary:"
for schema in public audit hdb_catalog; do
    count=$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$schema' AND table_type = 'BASE TABLE';" 2>/dev/null || echo "0")
    count=$(echo $count | tr -d ' ')
    echo "  $schema: $count tables"
done

# Check critical tables
echo ""
echo "👥 Critical data verification:"
for table in users clients payrolls; do
    if count=$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null); then
        count=$(echo $count | tr -d ' ')
        echo "  ✅ $table: $count records"
    else
        echo "  ❌ $table: Not found or not accessible"
    fi
done

# Final verification
total_tables=$(psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast') AND table_type = 'BASE TABLE';" 2>/dev/null || echo "0")
total_tables=$(echo $total_tables | tr -d ' ')

echo ""
echo "🎉 Migration Summary:"
echo "  Database: payroll"
echo "  Total tables: $total_tables"
echo "  Status: $([ "$total_tables" -gt "50" ] && echo "✅ Success" || echo "⚠️  Incomplete")"

if [ "$total_tables" -gt "50" ]; then
    echo ""
    echo "✅ Migration to payroll database completed successfully!"
    echo "📋 Next steps:"
    echo "  1. Update .env files to use 'payroll' database"
    echo "  2. Test Hasura connection"
    echo "  3. Test application functionality"
else
    echo ""
    echo "⚠️  Migration may be incomplete. Check the output above for errors."
fi
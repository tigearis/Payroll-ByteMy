#!/bin/bash

# Apply Hasura Schema Fixes
# This script applies database migrations and metadata updates to fix GraphQL schema mismatches

set -e

echo "🔧 Applying Hasura schema fixes..."

# 1. Apply database migration for missing fields
echo "📦 Applying database migration..."
if [ -f "../database/migrations/add_missing_fields.sql" ]; then
    if [ -n "$PG_DATABASE_URL" ]; then
        psql "$PG_DATABASE_URL" -f "../database/migrations/add_missing_fields.sql"
        echo "✅ Database migration applied successfully"
    else
        echo "⚠️  PG_DATABASE_URL not set, skipping database migration"
        echo "📋 Please run this SQL manually:"
        cat "../database/migrations/add_missing_fields.sql"
    fi
else
    echo "❌ Migration file not found"
    exit 1
fi

# 2. Apply Hasura metadata updates
echo "🏗️  Applying Hasura metadata..."
hasura metadata apply

echo "✅ Schema fixes applied successfully!"
echo ""
echo "🔄 Next steps:"
echo "1. Run 'pnpm codegen' to regenerate GraphQL types"
echo "2. Run 'pnpm build' to verify everything compiles"
echo "3. Consider implementing inherited roles for better permission management"
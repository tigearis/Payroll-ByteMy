#!/bin/bash

# Fix Audit Log Immutability for SOC2 Compliance
# Removes update and delete permissions from all audit tables

echo "🔒 Fixing audit log immutability for SOC2 compliance..."

AUDIT_TABLES=(
    "audit_permission_changes"
    "audit_data_access_log" 
    "public_permission_audit_log"
)

HASURA_DIR="/Users/nathanharris/Payroll/Payroll-ByteMy/hasura/metadata/databases/default/tables"

for table in "${AUDIT_TABLES[@]}"; do
    file="${HASURA_DIR}/${table}.yaml"
    
    if [ -f "$file" ]; then
        echo "Processing $table..."
        
        # Create backup
        cp "$file" "${file}.backup"
        
        # Remove update and delete permissions sections
        sed -i '' '/^update_permissions:/,/^[a-z]/{ /^[a-z]/!d; }' "$file"
        sed -i '' '/^delete_permissions:/,/^[a-z]/{ /^[a-z]/!d; }' "$file"
        
        # Remove trailing empty lines
        sed -i '' -e :a -e '/^\s*$/N;$!ba' -e 's/\n\s*$//' "$file"
        
        echo "✅ Fixed $table"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo ""
echo "🔧 Fixing custom root fields to remove update/delete operations..."

# Fix custom root fields for remaining tables
for table in "${AUDIT_TABLES[@]}"; do
    file="${HASURA_DIR}/${table}.yaml"
    
    if [ -f "$file" ]; then
        echo "Removing update/delete root fields from $table..."
        
        # Remove delete and update lines from custom_root_fields
        sed -i '' '/custom_root_fields:/,/^[a-z]/ {
            /delete:/d
            /delete_by_pk:/d
            /update:/d
            /update_by_pk:/d
        }' "$file"
        
        echo "✅ Updated root fields for $table"
    fi
done

echo ""
echo "🎯 Audit immutability fix complete!"
echo "📋 Summary:"
echo "  - Removed update permissions from all audit tables"
echo "  - Removed delete permissions from all audit tables"  
echo "  - Removed update/delete GraphQL operations"
echo "  - Created backup files (.backup) for rollback if needed"
echo ""
echo "⚠️  Remember to apply Hasura metadata:"
echo "   pnpm hasura:metadata"
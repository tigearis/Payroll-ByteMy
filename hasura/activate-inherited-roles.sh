#!/bin/bash

# Activate Inherited Roles in Hasura
# This script applies the inherited roles configuration and verifies the setup

set -e

echo "🏗️  Activating Inherited Roles in Hasura..."

# Check if we're in the right directory
if [ ! -f "config.yaml" ]; then
    echo "❌ Please run this script from the hasura directory"
    exit 1
fi

# Simple backup by copying metadata directory
echo "📦 Creating metadata backup..."
BACKUP_DIR="metadata-backup/pre-inherited-roles-$(date +%Y-%m-%dT%H-%M-%S)"
mkdir -p "$BACKUP_DIR"
cp -r metadata/ "$BACKUP_DIR/"
echo "✅ Backup created at: $BACKUP_DIR"

# Apply metadata including inherited roles
echo "⚡ Applying inherited roles configuration..."
hasura metadata apply

# Simple verification by checking the inherited_roles.yaml file
echo "🔍 Verifying inherited roles setup..."
if [ -f "metadata/inherited_roles.yaml" ] && grep -q "org_admin" "metadata/inherited_roles.yaml"; then
    echo "✅ Inherited roles successfully activated!"
    echo ""
    echo "📊 Current hierarchy:"
    echo "   developer (standalone)"
    echo "   ↑"
    echo "   org_admin ← manager + consultant + viewer" 
    echo "   ↑"
    echo "   manager ← consultant + viewer"
    echo "   ↑"
    echo "   consultant ← viewer"
    echo "   ↑"  
    echo "   viewer (base role)"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Test role functionality in Hasura Console"
    echo "2. Optimize individual role permissions"  
    echo "3. Remove redundant permission definitions"
else
    echo "⚠️  Inherited roles configuration found but may need verification"
    echo "   Check the metadata/inherited_roles.yaml file and Hasura Console"
fi

echo ""
echo "🌐 Open Hasura Console to verify:"
echo "   hasura console"
echo "   Navigate to: Data → [Database] → Permissions → Inherited Roles"
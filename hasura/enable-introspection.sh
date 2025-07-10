#!/bin/bash

# Enable GraphQL Schema Introspection for All Roles
# This script enables GraphQL schema introspection for all roles by clearing the disabled_for_roles list

set -e

echo "🔍 Enabling GraphQL schema introspection for all roles..."

# Create a temporary metadata file for the introspection configuration
cat > temp_introspection.yaml << 'EOF'
- name: set_graphql_schema_introspection_options
  args:
    disabled_for_roles: []
EOF

# Apply the metadata change using Hasura CLI
echo "📝 Applying introspection configuration..."
hasura metadata apply --file temp_introspection.yaml

# Clean up temporary file
rm temp_introspection.yaml

echo "✅ GraphQL schema introspection has been enabled for all roles!"
echo ""
echo "📋 Verification:"
echo "   - All roles can now access GraphQL schema introspection"
echo "   - This includes: developer, org_admin, manager, consultant, viewer"
echo "   - You can verify this in the Hasura Console under Settings > GraphQL Schema Introspection"
echo ""
echo "🔧 To verify programmatically, you can run:"
echo "   curl -X POST https://hasura.bytemy.com.au/v1/metadata \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'X-Hasura-Admin-Secret: YOUR_ADMIN_SECRET' \\"
echo "     -d '{\"type\": \"get_graphql_schema_introspection_options\"}'" 
#!/bin/bash

# Direct curl command to enable GraphQL schema introspection for all roles
# This script uses the exact curl command you requested

set -e

echo "🔍 Enabling GraphQL schema introspection for all roles..."

# The exact curl command you requested
curl -X POST https://hasura.bytemy.com.au/v1/metadata \
  -H 'Content-Type: application/json' \
  -H 'X-Hasura-Role: admin' \
  -H 'X-Hasura-Admin-Secret: 3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=' \
  -d '{
    "type": "set_graphql_schema_introspection_options",
    "args": {
      "disabled_for_roles": []
    }
  }'

echo ""
echo "✅ GraphQL schema introspection has been enabled for all roles!"
echo ""
echo "📋 To verify the change, you can run:"
echo "   curl -X POST https://hasura.bytemy.com.au/v1/metadata \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'X-Hasura-Role: admin' \\"
echo "     -H 'X-Hasura-Admin-Secret: 3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=' \\"
echo "     -d '{\"type\": \"get_graphql_schema_introspection_options\"}'" 
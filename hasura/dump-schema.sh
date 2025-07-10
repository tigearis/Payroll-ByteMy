#!/bin/bash

# Dump GraphQL Schema from Hasura
# This script fetches the GraphQL schema from Hasura and saves it locally

set -e

# Configuration
HASURA_URL=${NEXT_PUBLIC_HASURA_GRAPHQL_URL:-"https://hasura.bytemy.com.au/v1/graphql"}
HASURA_SECRET=${HASURA_GRAPHQL_ADMIN_SECRET:-"3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo="}
SCHEMA_DUMP_DIR="./hasura/schema-dump"
SCHEMA_FILE="$SCHEMA_DUMP_DIR/schema.graphql"
INTROSPECTION_FILE="$SCHEMA_DUMP_DIR/introspection.json"

echo "🔍 Dumping GraphQL schema from Hasura..."
echo "   URL: $HASURA_URL"
echo "   Output: $SCHEMA_DUMP_DIR"

# Create output directory
mkdir -p "$SCHEMA_DUMP_DIR"

# Dump GraphQL SDL schema
echo "📝 Fetching GraphQL SDL schema..."
curl -X POST "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: $HASURA_SECRET" \
  -d '{
    "query": "query IntrospectionQuery { __schema { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } }"
  }' \
  | jq -r '.data.__schema | to_entries | map(select(.key != "__schema")) | from_entries | { __schema: . } | tojson' \
  > "$INTROSPECTION_FILE"

# Convert introspection to SDL
echo "🔄 Converting introspection to GraphQL SDL..."
npx graphql-codegen --config config/codegen-schema.ts --env HASURA_SCHEMA_SOURCE=local

echo "✅ Schema dump completed!"
echo "📁 Files created:"
echo "   - $SCHEMA_FILE"
echo "   - $INTROSPECTION_FILE"
echo ""
echo "💡 To use this schema for codegen:"
echo "   HASURA_SCHEMA_SOURCE=local pnpm graphql-codegen --config config/codegen.ts" 
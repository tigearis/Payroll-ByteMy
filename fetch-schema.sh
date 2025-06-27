#!/bin/bash

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Create schema directory if it doesn't exist
mkdir -p shared/schema

echo "🔍 Fetching GraphQL schema from Hasura..."
echo "   Endpoint: $NEXT_PUBLIC_HASURA_GRAPHQL_URL"

# Run the schema-only codegen
pnpm graphql-codegen --config config/codegen-schema.ts

echo "✅ Schema fetch complete!"
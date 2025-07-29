#!/bin/bash

# Simple Hasura connection test using curl
# Load environment variables
source .env.local

echo "🔍 Testing Hasura GraphQL Engine connection..."
echo "📡 Hasura URL: $NEXT_PUBLIC_HASURA_GRAPHQL_URL"
echo "🔐 Admin secret: ${HASURA_GRAPHQL_ADMIN_SECRET:0:10}..."
echo ""

# Test 1: Health check
echo "1. Testing Hasura health endpoint..."
HEALTH_URL="${NEXT_PUBLIC_HASURA_GRAPHQL_URL%/v1/graphql}/healthz"

if curl -s -f "$HEALTH_URL" > /dev/null; then
    echo "✅ Hasura is running and accessible"
else
    echo "❌ Hasura health check failed"
    echo "💡 Check if Hasura service is running at hasura.bytemy.com.au"
    exit 1
fi

echo ""
echo "2. Testing GraphQL introspection..."

# Test 2: GraphQL introspection
INTROSPECTION_QUERY='{
  "query": "query IntrospectionQuery { __schema { queryType { name } mutationType { name } subscriptionType { name } } }"
}'

INTROSPECTION_RESULT=$(curl -s -X POST "$NEXT_PUBLIC_HASURA_GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -H "X-Hasura-Admin-Secret: $HASURA_GRAPHQL_ADMIN_SECRET" \
  -d "$INTROSPECTION_QUERY")

if echo "$INTROSPECTION_RESULT" | grep -q '"queryType"'; then
    echo "✅ GraphQL introspection successful"
    
    # Extract type names
    QUERY_TYPE=$(echo "$INTROSPECTION_RESULT" | grep -o '"queryType":{"name":"[^"]*"' | cut -d'"' -f6)
    MUTATION_TYPE=$(echo "$INTROSPECTION_RESULT" | grep -o '"mutationType":{"name":"[^"]*"' | cut -d'"' -f6)
    
    echo "  Query type: ${QUERY_TYPE:-Not available}"
    echo "  Mutation type: ${MUTATION_TYPE:-Not available}"
else
    echo "❌ GraphQL introspection failed"
    echo "Response: $INTROSPECTION_RESULT"
    exit 1
fi

echo ""
echo "3. Testing database connection via GraphQL..."

# Test 3: Database query
DATABASE_QUERY='{
  "query": "query TestDatabaseConnection { users(limit: 1) { id email firstName lastName } }"
}'

DATABASE_RESULT=$(curl -s -X POST "$NEXT_PUBLIC_HASURA_GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -H "X-Hasura-Admin-Secret: $HASURA_GRAPHQL_ADMIN_SECRET" \
  -d "$DATABASE_QUERY")

if echo "$DATABASE_RESULT" | grep -q '"users"'; then
    echo "✅ Database connection via Hasura successful"
    
    # Count users in response
    USER_COUNT=$(echo "$DATABASE_RESULT" | grep -o '"id"' | wc -l)
    echo "  Found $USER_COUNT user(s) in result"
    
    # Extract sample user data if available
    if [ "$USER_COUNT" -gt 0 ]; then
        SAMPLE_EMAIL=$(echo "$DATABASE_RESULT" | grep -o '"email":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "  Sample user email: ${SAMPLE_EMAIL:-Unknown}"
    fi
    
elif echo "$DATABASE_RESULT" | grep -q '"errors"'; then
    echo "❌ Database connection test failed"
    echo "Error details:"
    echo "$DATABASE_RESULT" | grep -o '"message":"[^"]*"' | cut -d'"' -f4
    
    # Check for specific error types
    if echo "$DATABASE_RESULT" | grep -q "neon\|connection\|database"; then
        echo ""
        echo "💡 This suggests Hasura is still connected to the old database"
        echo "   You need to update Hasura's database connection to point to your local PostgreSQL"
        echo ""
        echo "🔧 Next steps:"
        echo "   1. Access your Hasura console: https://hasura.bytemy.com.au/console"
        echo "   2. Go to Data > Manage > Edit connection"
        echo "   3. Update database URL to: postgresql://admin@192.168.1.229:5432/payroll_local?sslmode=disable"
        echo "   4. Or set environment variable PG_DATABASE_URL on your Hasura server"
    fi
    
    exit 1
else
    echo "❌ Unexpected response from database query"
    echo "Response: $DATABASE_RESULT"
    exit 1
fi

echo ""
echo "4. Testing table structure..."

# Test 4: Check if we have the expected tables
TABLES_QUERY='{
  "query": "query GetTables { users { id } clients { id } payrolls { id } }"
}'

TABLES_RESULT=$(curl -s -X POST "$NEXT_PUBLIC_HASURA_GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -H "X-Hasura-Admin-Secret: $HASURA_GRAPHQL_ADMIN_SECRET" \
  -d "$TABLES_QUERY")

if echo "$TABLES_RESULT" | grep -q '"users"\|"clients"\|"payrolls"'; then
    echo "✅ Core tables accessible via GraphQL"
    
    # Count records in each table
    USERS_COUNT=$(echo "$TABLES_RESULT" | grep -o '"users":\[[^]]*\]' | grep -o '"id"' | wc -l)
    CLIENTS_COUNT=$(echo "$TABLES_RESULT" | grep -o '"clients":\[[^]]*\]' | grep -o '"id"' | wc -l)
    PAYROLLS_COUNT=$(echo "$TABLES_RESULT" | grep -o '"payrolls":\[[^]]*\]' | grep -o '"id"' | wc -l)
    
    echo "  Users: $USERS_COUNT records"
    echo "  Clients: $CLIENTS_COUNT records"  
    echo "  Payrolls: $PAYROLLS_COUNT records"
else
    echo "⚠️  Some core tables may not be accessible"
    echo "Response: $TABLES_RESULT"
fi

echo ""
echo "🎉 Hasura connection test completed!"

# Check if we're connected to the right database
if [ "$USERS_COUNT" -eq 7 ]; then
    echo "✅ Hasura appears to be connected to the migrated local database"
    echo "   (User count matches expected: 7)"
else
    echo "⚠️  User count ($USERS_COUNT) doesn't match expected (7)"
    echo "   This might indicate Hasura is connected to a different database"
fi

echo ""
echo "📋 Summary:"
echo "  - Hasura service: ✅ Running"
echo "  - GraphQL endpoint: ✅ Accessible"
echo "  - Database connection: ✅ Working"
echo "  - Data migration: $([ "$USERS_COUNT" -eq 7 ] && echo "✅ Verified" || echo "⚠️ Needs verification")"
#!/bin/bash

# Quick Inherited Roles Test Script
# Tests basic inheritance patterns using curl

set -e

# Configuration
HASURA_URL="${NEXT_PUBLIC_HASURA_GRAPHQL_URL:-${HASURA_GRAPHQL_URL:-http://localhost:8080/v1/graphql}}"
ADMIN_SECRET="${HASURA_GRAPHQL_ADMIN_SECRET}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧪 Testing Inherited Roles..."
echo "Endpoint: $HASURA_URL"
echo ""

# Test query
TEST_QUERY='{
  "query": "query TestUsers { users(limit: 1) { id name email role isStaff managerId createdAt } }"
}'

# Roles to test (in hierarchy order)
ROLES=("viewer" "consultant" "manager" "org_admin" "developer")

echo "📊 Testing users table across role hierarchy..."
echo ""

# Function to test a role
test_role() {
  local role=$1
  echo -n "Testing role '$role'... "
  
  # Make request with admin secret and role header
  if [ -n "$ADMIN_SECRET" ]; then
    response=$(curl -s -X POST \
      -H "Content-Type: application/json" \
      -H "X-Hasura-Admin-Secret: $ADMIN_SECRET" \
      -H "X-Hasura-Role: $role" \
      -d "$TEST_QUERY" \
      "$HASURA_URL")
  else
    echo -e "${RED}❌ No admin secret provided${NC}"
    return 1
  fi
  
  # Check if query was successful
  if echo "$response" | grep -q '"errors"'; then
    echo -e "${RED}❌ FAILED${NC}"
    echo "   Error: $(echo "$response" | grep -o '"message":"[^"]*"' | head -1)"
    return 1
  else
    # Count fields returned
    field_count=$(echo "$response" | grep -o '"[a-zA-Z][a-zA-Z0-9]*":' | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ SUCCESS${NC} ($field_count fields)"
    return 0
  fi
}

# Test each role
successful_tests=0
total_tests=0

for role in "${ROLES[@]}"; do
  total_tests=$((total_tests + 1))
  if test_role "$role"; then
    successful_tests=$((successful_tests + 1))
  fi
done

echo ""
echo "📈 Results Summary:"
echo "   Successful: $successful_tests/$total_tests"

# Test a few more critical tables
echo ""
echo "🔍 Testing other critical tables..."

# Test clients table
echo "Testing clients table..."
CLIENTS_QUERY='{
  "query": "query TestClients { clients(limit: 1) { id name status createdAt managerUserId } }"
}'

for role in "viewer" "manager" "org_admin"; do
  echo -n "  $role: "
  response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-Hasura-Admin-Secret: $ADMIN_SECRET" \
    -H "X-Hasura-Role: $role" \
    -d "$CLIENTS_QUERY" \
    "$HASURA_URL")
  
  if echo "$response" | grep -q '"errors"'; then
    echo -e "${RED}❌${NC}"
  else
    echo -e "${GREEN}✅${NC}"
  fi
done

# Test audit events (should be restricted)
echo ""
echo "Testing audit events (sensitive data)..."
AUDIT_QUERY='{
  "query": "query TestAudit { authEvents(limit: 1) { id eventType userId success } }"
}'

for role in "viewer" "consultant" "manager" "org_admin"; do
  echo -n "  $role: "
  response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "X-Hasura-Admin-Secret: $ADMIN_SECRET" \
    -H "X-Hasura-Role: $role" \
    -d "$AUDIT_QUERY" \
    "$HASURA_URL")
  
  if echo "$response" | grep -q '"errors"'; then
    echo -e "${YELLOW}🔒 Restricted${NC} (expected for lower roles)"
  else
    echo -e "${GREEN}✅ Allowed${NC}"
  fi
done

echo ""
echo "🎯 Inheritance Test Summary:"

if [ $successful_tests -eq $total_tests ]; then
  echo -e "${GREEN}✅ All basic role tests passed!${NC}"
  echo "   Inherited roles appear to be working correctly."
else
  echo -e "${YELLOW}⚠️  Some roles had issues.${NC}"
  echo "   Check the detailed output above."
fi

echo ""
echo "💡 Next steps:"
echo "   1. Review any failed tests above"
echo "   2. Test specific tables in Hasura Console"
echo "   3. Verify business logic rules are maintained"
echo ""
echo "🌐 For detailed testing, open Hasura Console:"
echo "   hasura console"
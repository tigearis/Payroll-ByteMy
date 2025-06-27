#!/bin/bash

# Test Audit Logs Access with JWT Token
# This script tests if audit logs can be accessed with the current user's token

echo "🔍 Testing Audit Logs GraphQL Query with JWT Token..."
echo "=================================================="

# Set your environment variables
HASURA_URL="${NEXT_PUBLIC_HASURA_GRAPHQL_URL:-http://localhost:8080/v1/graphql}"
JWT_TOKEN="YOUR_JWT_TOKEN_HERE"

# Test 1: Simple audit logs query with userId field
echo ""
echo "📋 Test 1: Basic audit logs query with userId field"
echo "---------------------------------------------------"

curl -X POST \
  "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "query TestAuditLogs { auditLogs(limit: 5) { id userId userEmail userRole action resourceType eventTime success } }"
  }' | jq '.'

echo ""
echo "📊 Test 2: Audit logs aggregate query"
echo "------------------------------------"

# Test 2: Aggregate query (similar to SecurityOverview)
curl -X POST \
  "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "query TestAuditAggregate($timeRange: timestamptz!) { auditLogsAggregate(where: { eventTime: { _gte: $timeRange } }) { aggregate { count } } }",
    "variables": {
      "timeRange": "'$(date -u -d '24 hours ago' +'%Y-%m-%dT%H:%M:%S.000Z')'"
    }
  }' | jq '.'

echo ""
echo "🔐 Test 3: Security events subscription query (converted to query for testing)"
echo "-----------------------------------------------------------------------------"

# Test 3: Security events (what the subscription is trying to do)
curl -X POST \
  "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "query TestSecurityEvents { auditLogs(where: { resourceType: { _in: [\"security\", \"auth\", \"permission\"] } }, orderBy: { eventTime: DESC }, limit: 10) { id userId userEmail userRole action resourceType eventTime success errorMessage } }"
  }' | jq '.'

echo ""
echo "🎯 Test 4: Check user role and permissions in JWT"
echo "------------------------------------------------"

# Test 4: Check what role is being used
curl -X POST \
  "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "query TestUserContext { auditLogs(limit: 1) { id } }"
  }' | jq '.'

echo ""
echo "✅ Testing completed!"
echo ""
echo "💡 Instructions:"
echo "1. Replace YOUR_JWT_TOKEN_HERE with your actual JWT token"
echo "2. Update HASURA_URL if needed (default: http://localhost:8080/v1/graphql)"
echo "3. Run: chmod +x test-audit-logs.sh && ./test-audit-logs.sh"
echo ""
echo "📝 What to look for in results:"
echo "- Success: JSON response with data"
echo "- userId permission error: 'field \"userId\" not found'"
echo "- Auth error: 'x-hasura-role' header required"
echo "- Time error: 'invalid input syntax for type timestamp'"
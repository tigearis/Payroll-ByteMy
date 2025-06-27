#!/bin/bash

# Fixed Audit Logs Test with Correct URL and JSON
echo "🔍 Testing Audit Logs with Hasura Cloud..."

# Use the correct Hasura URL from your .env
HASURA_URL="https://bytemy.hasura.app/v1/graphql"

# Replace with your actual JWT token
JWT_TOKEN="YOUR_JWT_TOKEN_HERE"

echo "Using Hasura URL: $HASURA_URL"
echo ""

# Test 1: Simple audit logs query (fixed JSON)
echo "📋 Test 1: Basic audit logs query"
echo "---------------------------------"

curl -X POST "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"query":"query TestAuditLogs { auditLogs(limit: 3) { id userId userEmail userRole action resourceType eventTime success } }"}' \
  | jq '.'

echo ""
echo "📋 Test 2: Audit logs without userId (should work for all roles)"
echo "---------------------------------------------------------------"

curl -X POST "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"query":"query TestAuditLogsBasic { auditLogs(limit: 3) { id action resourceType eventTime success } }"}' \
  | jq '.'

echo ""
echo "📊 Test 3: Aggregate query (like SecurityOverview)"
echo "-------------------------------------------------"

# Calculate 24 hours ago timestamp
TIMESTAMP_24H_AGO=$(date -u -d '24 hours ago' +'%Y-%m-%dT%H:%M:%S.000Z' 2>/dev/null || date -u -v-24H +'%Y-%m-%dT%H:%M:%S.000Z')

curl -X POST "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d "{\"query\":\"query TestSecurityOverview(\$timeRange: timestamptz!) { auditLogsAggregate(where: { eventTime: { _gte: \$timeRange } }) { aggregate { count } } }\",\"variables\":{\"timeRange\":\"$TIMESTAMP_24H_AGO\"}}" \
  | jq '.'

echo ""
echo "✅ Testing completed!"
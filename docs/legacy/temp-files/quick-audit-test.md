# Quick Audit Logs Test Commands

## 🚀 Quick Test (Copy & Paste Ready)

Replace `YOUR_JWT_TOKEN` with your actual token and run:

```bash
# Set your JWT token (replace with your actual token)
export JWT_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."

# Set Hasura URL
export HASURA_URL="http://localhost:8080/v1/graphql"

# Test 1: Basic audit logs query with userId field
curl -X POST "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "query TestAuditLogs { auditLogs(limit: 3) { id userId userEmail userRole action resourceType eventTime success } }"
  }' | jq '.'
```

## 📋 Expected Results

### ✅ Success Response:
```json
{
  "data": {
    "auditLogs": [
      {
        "id": "uuid-here",
        "userId": "user_xyz123",
        "userEmail": "user@example.com",
        "userRole": "developer",
        "action": "read",
        "resourceType": "users",
        "eventTime": "2024-12-27T12:00:00.000Z",
        "success": true
      }
    ]
  }
}
```

### ❌ Permission Error (userId field restricted):
```json
{
  "errors": [
    {
      "message": "field 'userId' not found in type: 'auditLogs'",
      "extensions": {
        "path": "$.selectionSet.auditLogs.selectionSet.userId",
        "code": "validation-failed"
      }
    }
  ]
}
```

### ❌ Auth Error (no/invalid token):
```json
{
  "errors": [
    {
      "message": "Could not verify JWT: JWTError",
      "extensions": {
        "code": "invalid-jwt"
      }
    }
  ]
}
```

## 🔧 Alternative Tests

### Test without userId field (should work for all roles):
```bash
curl -X POST "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "query TestAuditLogsBasic { auditLogs(limit: 3) { id action resourceType eventTime success } }"
  }' | jq '.'
```

### Test aggregate query (like SecurityOverview):
```bash
# Calculate 24 hours ago timestamp
TIMESTAMP_24H_AGO=$(date -u -d '24 hours ago' +'%Y-%m-%dT%H:%M:%S.000Z')

curl -X POST "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d "{
    \"query\": \"query TestSecurityOverview(\$timeRange: timestamptz!) { auditLogsAggregate(where: { eventTime: { _gte: \$timeRange } }) { aggregate { count } } }\",
    \"variables\": {
      \"timeRange\": \"$TIMESTAMP_24H_AGO\"
    }
  }" | jq '.'
```

### Test specific user role permissions:
```bash
curl -X POST "$HASURA_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "query": "query TestRoleAccess { auditLogs(limit: 1) { id userRole action } }"
  }' | jq '.'
```

## 🎯 Debug Your JWT Token

To see what's in your JWT token:
```bash
# Decode JWT header and payload (replace YOUR_JWT_TOKEN)
echo "YOUR_JWT_TOKEN" | cut -d'.' -f2 | base64 -d | jq '.'
```

Look for:
- `x-hasura-role`: Your current role
- `x-hasura-user-id`: Your user ID
- `x-hasura-allowed-roles`: Roles you can switch to

## 📝 Troubleshooting Steps

1. **If userId field fails**: Your role doesn't have permission - try without userId
2. **If auth fails**: Check JWT token is valid and not expired
3. **If timestamp fails**: Check the date format in aggregate queries
4. **If no data**: Check if audit logs exist in your database

Run the basic test first, then add more fields based on what your role permits.
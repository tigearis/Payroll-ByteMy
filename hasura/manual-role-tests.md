# Manual Inherited Roles Testing Guide

## Quick Console Tests

Open Hasura Console (`hasura console`) and test these queries with different role headers.

### Test 1: Basic User Data
```graphql
query TestUsers {
  users(limit: 2) {
    id
    name
    email
    role
    isStaff
    managerId
    createdAt
  }
}
```

**Test with these headers:**
- `X-Hasura-Role: viewer`
- `X-Hasura-Role: consultant` 
- `X-Hasura-Role: manager`
- `X-Hasura-Role: org_admin`

**Expected:** Each higher role should return same or more fields than lower roles.

### Test 2: Client Data
```graphql
query TestClients {
  clients(limit: 2) {
    id
    name
    status
    managerUserId
    primaryConsultantUserId
    createdAt
  }
}
```

### Test 3: Payroll Data
```graphql
query TestPayrolls {
  payrolls(limit: 2) {
    id
    status
    clientId
    managerUserId
    employeeCount
    createdAt
  }
}
```

### Test 4: Audit Data (Sensitive)
```graphql
query TestAuditEvents {
  authEvents(limit: 2) {
    id
    eventType
    userId
    success
    failureReason
    eventTime
  }
}
```

### Test 5: Permission Overrides (Admin-level)
```graphql
query TestPermissionOverrides {
  permissionOverrides(limit: 2) {
    id
    userId
    role
    resource
    operation
    granted
    reason
    createdAt
  }
}
```

## Expected Inheritance Patterns

### ✅ **Correct Inheritance**
- **org_admin** gets everything **manager** gets + more
- **manager** gets everything **consultant** gets + more  
- **consultant** gets everything **viewer** gets + more

### ❌ **Inheritance Issues**
- Lower role has more access than higher role
- Role can't access data that lower role can access
- Inconsistent field access across hierarchy

## Quick Validation Checklist

For each query above:

1. **Run with `viewer` role** - Note field count and data access
2. **Run with `consultant` role** - Should have >= fields than viewer
3. **Run with `manager` role** - Should have >= fields than consultant  
4. **Run with `org_admin` role** - Should have >= fields than manager

## Common Issues to Watch For

### 🔍 **Permission Gaps**
- Consultant can't see data that viewer can see
- Manager missing access that consultant has

### 🔍 **Over-permissioned Lower Roles**  
- Viewer has access to sensitive data
- Consultant can see admin-only fields

### 🔍 **Inconsistent Filtering**
- Same query returns different row counts unexpectedly
- Access patterns don't follow business logic

## Automated Test Script

For comprehensive testing, run the automated script:

```bash
cd hasura

# Set environment variables
export HASURA_GRAPHQL_ADMIN_SECRET="your_admin_secret"
export HASURA_GRAPHQL_URL="your_hasura_endpoint"

# Run comprehensive tests
node test-inherited-roles.js
```

## Manual Console Testing Steps

1. **Open Hasura Console**:
   ```bash
   hasura console
   ```

2. **Navigate to GraphiQL**:
   - Click "GraphiQL" tab
   - Open "Request Headers" panel

3. **Test Each Role**:
   - Set header: `X-Hasura-Role: viewer`
   - Run test query
   - Note results
   - Change to next role and repeat

4. **Compare Results**:
   - Field counts should increase or stay same up hierarchy
   - Data access should follow business rules
   - No unexpected permission gaps

## Success Criteria

✅ **All inherited roles working correctly if:**
- Higher roles have >= field access than lower roles
- Business logic is maintained (viewers can't see admin data)
- No permission gaps in the hierarchy
- Consistent behavior across all tables
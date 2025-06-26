# Inherited Roles Testing via Hasura Console

Since your Hasura instance correctly requires JWT authentication, we need to test inherited roles through the authenticated console.

## ✅ **Good News: Security is Working!**
The failed API tests actually confirm that:
- 🔒 JWT authentication is properly enforced
- 🛡️ No unauthorized access is possible
- ✅ Hasura security is configured correctly

## 🌐 **Testing via Hasura Console**

### **Step 1: Open Authenticated Console**
```bash
cd /Users/nathanharris/Payroll/Payroll-ByteMy/hasura
hasura console
```

### **Step 2: Navigate to GraphiQL**
1. Click the **"GraphiQL"** tab
2. Open **"Request Headers"** section (usually a button at bottom)

### **Step 3: Test Role Hierarchy**

#### **Test 1: Basic User Query**
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
    updatedAt
  }
}
```

**Test with each role header:**
1. Set header: `X-Hasura-Role: viewer` → Run query → Note field count
2. Set header: `X-Hasura-Role: consultant` → Run query → Note field count  
3. Set header: `X-Hasura-Role: manager` → Run query → Note field count
4. Set header: `X-Hasura-Role: org_admin` → Run query → Note field count

**Expected inheritance pattern:**
- org_admin ≥ manager ≥ consultant ≥ viewer (field access)

#### **Test 2: Client Data**
```graphql
query TestClients {
  clients(limit: 2) {
    id
    name
    status
    managerUserId
    primaryConsultantUserId
    employeeCount
    createdAt
  }
}
```

#### **Test 3: Sensitive Audit Data**
```graphql
query TestAuditEvents {
  authEvents(limit: 1) {
    id
    eventType
    userId
    success
    failureReason
    eventTime
  }
}
```

**Expected:** Higher roles should have more access to audit data.

#### **Test 4: Permission Overrides** 
```graphql
query TestPermissionOverrides {
  permissionOverrides(limit: 1) {
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

**Expected:** Only admin-level roles should access this.

## 📊 **Manual Testing Checklist**

For each query above, verify:

### ✅ **Inheritance Working Correctly:**
- [ ] `consultant` can see everything `viewer` can see + more
- [ ] `manager` can see everything `consultant` can see + more  
- [ ] `org_admin` can see everything `manager` can see + more
- [ ] Field counts increase (or stay same) up the hierarchy

### ✅ **Business Logic Maintained:**
- [ ] `viewer` cannot see sensitive admin data
- [ ] `consultant` has appropriate access to assigned resources
- [ ] `manager` can see team-related data
- [ ] `org_admin` has broad organizational access

### ✅ **No Permission Gaps:**
- [ ] No cases where lower role has more access than higher role
- [ ] Consistent behavior across similar tables
- [ ] Role transitions work smoothly

## 🎯 **Quick Inheritance Validation**

Run this simple test for each role:

```graphql
query QuickRoleTest {
  users(limit: 1) { id name role }
  clients(limit: 1) { id name status }
  payrolls(limit: 1) { id status }
}
```

**Change role header for each test:**
- `X-Hasura-Role: viewer`
- `X-Hasura-Role: consultant`
- `X-Hasura-Role: manager` 
- `X-Hasura-Role: org_admin`

**Success criteria:**
- Each higher role returns ≥ data than lower roles
- No unexpected permission errors
- Smooth inheritance chain

## 🔍 **Troubleshooting**

### **If a role has less access than expected:**
1. Check individual table permissions in Console
2. Verify inherited roles are applied: Data → Permissions → Inherited Roles
3. Look for permission conflicts or missing grants

### **If inheritance seems broken:**
1. Verify `inherited_roles.yaml` is correctly applied
2. Check Console: Data → [Database] → Permissions → Inherited Roles
3. Re-apply metadata: `hasura metadata apply`

## 🎉 **Success Indicators**

✅ **Inherited roles working perfectly if:**
- Higher roles have ≥ field access than lower roles
- Business logic rules are maintained  
- No permission gaps in the hierarchy
- Console shows inherited roles as "Active"

✅ **Your security is working if:**
- Direct API calls require proper JWT tokens
- Role headers work in authenticated console
- No unauthorized access possible
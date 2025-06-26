#!/bin/bash

# Simple Inherited Roles Test
# Compatible with all shell versions

HASURA_URL="${NEXT_PUBLIC_HASURA_GRAPHQL_URL:-https://bytemy.hasura.app/v1/graphql}"
ADMIN_SECRET="${HASURA_GRAPHQL_ADMIN_SECRET}"
USER_ID="d9ac8a7b-f679-49a1-8c99-837eb977578b"  # Use Nathan's user ID

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 Simple Inherited Roles Test"
echo "Endpoint: $HASURA_URL"
echo ""

# Test function
test_role() {
  local role=$1
  local query=$2
  local name=$3
  
  echo -n "  $role: "
  
  # Base headers
  local headers="Content-Type: application/json"
  local auth_header="X-Hasura-Admin-Secret: $ADMIN_SECRET"
  local role_header="X-Hasura-Role: $role"
  
  # Add user ID for roles that need it
  if [ "$role" = "consultant" ] || [ "$role" = "viewer" ] || [ "$role" = "manager" ]; then
    local user_header="X-Hasura-User-Id: $USER_ID"
    response=$(curl -s -X POST \
      -H "$headers" \
      -H "$auth_header" \
      -H "$role_header" \
      -H "$user_header" \
      -d "$query" \
      "$HASURA_URL")
  else
    response=$(curl -s -X POST \
      -H "$headers" \
      -H "$auth_header" \
      -H "$role_header" \
      -d "$query" \
      "$HASURA_URL")
  fi
  
  if echo "$response" | grep -q '"errors"'; then
    echo -e "${RED}❌ FAILED${NC}"
    echo "     $(echo "$response" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4)"
    return 1
  else
    field_count=$(echo "$response" | grep -o '"[a-zA-Z][a-zA-Z0-9]*":' | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ SUCCESS${NC} ($field_count fields)"
    return 0
  fi
}

# Test 1: Users table
echo "📊 Test 1: Users Table"
USERS_QUERY='{"query": "query { users(limit: 1) { id name email role isStaff managerId createdAt } }"}'

viewer_success=0
consultant_success=0
manager_success=0
org_admin_success=0
developer_success=0

if test_role "viewer" "$USERS_QUERY" "users"; then viewer_success=1; fi
if test_role "consultant" "$USERS_QUERY" "users"; then consultant_success=1; fi
if test_role "manager" "$USERS_QUERY" "users"; then manager_success=1; fi
if test_role "org_admin" "$USERS_QUERY" "users"; then org_admin_success=1; fi
if test_role "developer" "$USERS_QUERY" "users"; then developer_success=1; fi

echo ""

# Test 2: Clients table
echo "📊 Test 2: Clients Table"
CLIENTS_QUERY='{"query": "query { clients(limit: 1) { id name contactEmail contactPerson active createdAt updatedAt } }"}'

viewer_clients=0
consultant_clients=0
manager_clients=0
org_admin_clients=0

if test_role "viewer" "$CLIENTS_QUERY" "clients"; then viewer_clients=1; fi
if test_role "consultant" "$CLIENTS_QUERY" "clients"; then consultant_clients=1; fi
if test_role "manager" "$CLIENTS_QUERY" "clients"; then manager_clients=1; fi
if test_role "org_admin" "$CLIENTS_QUERY" "clients"; then org_admin_clients=1; fi

echo ""

# Test 3: Auth Events (sensitive)
echo "📊 Test 3: Auth Events (Sensitive Data)"
AUDIT_QUERY='{"query": "query { authEvents(limit: 1) { id eventType success eventTime } }"}'

viewer_audit=0
consultant_audit=0
manager_audit=0
org_admin_audit=0

if test_role "viewer" "$AUDIT_QUERY" "authEvents"; then viewer_audit=1; fi
if test_role "consultant" "$AUDIT_QUERY" "authEvents"; then consultant_audit=1; fi
if test_role "manager" "$AUDIT_QUERY" "authEvents"; then manager_audit=1; fi
if test_role "org_admin" "$AUDIT_QUERY" "authEvents"; then org_admin_audit=1; fi

echo ""

# Test 4: Payrolls table
echo "📊 Test 4: Payrolls Table"
PAYROLL_QUERY='{"query": "query { payrolls(limit: 1) { id clientId managerUserId primaryConsultantUserId employeeCount createdAt } }"}'

viewer_payroll=0
consultant_payroll=0
manager_payroll=0
org_admin_payroll=0

if test_role "viewer" "$PAYROLL_QUERY" "payrolls"; then viewer_payroll=1; fi
if test_role "consultant" "$PAYROLL_QUERY" "payrolls"; then consultant_payroll=1; fi
if test_role "manager" "$PAYROLL_QUERY" "payrolls"; then manager_payroll=1; fi
if test_role "org_admin" "$PAYROLL_QUERY" "payrolls"; then org_admin_payroll=1; fi

echo ""

# Summary
echo "🎯 INHERITANCE SUMMARY"
echo "=" | head -c 40; echo ""

echo "Users Table Access:"
echo "  viewer: $([ $viewer_success -eq 1 ] && echo "✅" || echo "❌")"
echo "  consultant: $([ $consultant_success -eq 1 ] && echo "✅" || echo "❌")"
echo "  manager: $([ $manager_success -eq 1 ] && echo "✅" || echo "❌")"
echo "  org_admin: $([ $org_admin_success -eq 1 ] && echo "✅" || echo "❌")"
echo "  developer: $([ $developer_success -eq 1 ] && echo "✅" || echo "❌")"

echo ""
echo "Clients Table Access:"
echo "  viewer: $([ $viewer_clients -eq 1 ] && echo "✅" || echo "❌")"
echo "  consultant: $([ $consultant_clients -eq 1 ] && echo "✅" || echo "❌")"
echo "  manager: $([ $manager_clients -eq 1 ] && echo "✅" || echo "❌")"
echo "  org_admin: $([ $org_admin_clients -eq 1 ] && echo "✅" || echo "❌")"

echo ""
echo "Payrolls Table Access:"
echo "  viewer: $([ $viewer_payroll -eq 1 ] && echo "✅" || echo "❌")"
echo "  consultant: $([ $consultant_payroll -eq 1 ] && echo "✅" || echo "❌")"
echo "  manager: $([ $manager_payroll -eq 1 ] && echo "✅" || echo "❌")"
echo "  org_admin: $([ $org_admin_payroll -eq 1 ] && echo "✅" || echo "❌")"

echo ""
echo "Auth Events Access (sensitive):"
echo "  viewer: $([ $viewer_audit -eq 1 ] && echo "✅ Allowed" || echo "🔒 Restricted")"
echo "  consultant: $([ $consultant_audit -eq 1 ] && echo "✅ Allowed" || echo "🔒 Restricted")"
echo "  manager: $([ $manager_audit -eq 1 ] && echo "✅ Allowed" || echo "🔒 Restricted")"
echo "  org_admin: $([ $org_admin_audit -eq 1 ] && echo "✅ Allowed" || echo "🔒 Restricted")"

echo ""
echo "🔍 Inheritance Pattern Analysis:"

# Check if inheritance is working
inheritance_working=1

# org_admin should have >= access than manager
if [ $org_admin_success -ge $manager_success ] && [ $org_admin_clients -ge $manager_clients ]; then
  echo "  ✅ org_admin ← manager: Working"
else
  echo "  ❌ org_admin ← manager: Issue"
  inheritance_working=0
fi

# manager should have >= access than consultant
if [ $manager_success -ge $consultant_success ] && [ $manager_clients -ge $consultant_clients ]; then
  echo "  ✅ manager ← consultant: Working"
else
  echo "  ❌ manager ← consultant: Issue"
  inheritance_working=0
fi

# consultant should have >= access than viewer
if [ $consultant_success -ge $viewer_success ] && [ $consultant_clients -ge $viewer_clients ]; then
  echo "  ✅ consultant ← viewer: Working"
else
  echo "  ❌ consultant ← viewer: Issue"
  inheritance_working=0
fi

echo ""
if [ $inheritance_working -eq 1 ]; then
  echo -e "${GREEN}🎉 INHERITED ROLES ARE WORKING CORRECTLY!${NC}"
else
  echo -e "${YELLOW}⚠️  Some inheritance patterns need attention.${NC}"
fi

echo ""
echo "💡 Next steps:"
echo "  • Review any failed tests above"
echo "  • Test in Hasura Console with: hasura console"
echo "  • Verify business logic rules are maintained"
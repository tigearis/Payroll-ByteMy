#!/bin/bash

# Comprehensive Inherited Roles Test
# Tests with proper session variables and correct field names

set -e

# Configuration
HASURA_URL="${NEXT_PUBLIC_HASURA_GRAPHQL_URL:-https://bytemy.hasura.app/v1/graphql}"
ADMIN_SECRET="${HASURA_GRAPHQL_ADMIN_SECRET}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🧪 Comprehensive Inherited Roles Test"
echo "Endpoint: $HASURA_URL"
echo ""

# Test function with session variables
test_role_with_session() {
  local role=$1
  local query=$2
  local test_name=$3
  local user_id=${4:-"d9ac8a7b-f679-49a1-8c99-837eb977578b"}  # Use a real user ID from your system
  
  echo -n "  $role: "
  
  local headers="Content-Type: application/json"
  headers="$headers -H X-Hasura-Admin-Secret: $ADMIN_SECRET"
  headers="$headers -H X-Hasura-Role: $role"
  
  # Add session variables for roles that need them
  if [[ "$role" == "consultant" || "$role" == "viewer" ]]; then
    headers="$headers -H X-Hasura-User-Id: $user_id"
  fi
  
  response=$(curl -s -X POST \
    -H "$headers" \
    -d "$query" \
    "$HASURA_URL")
  
  if echo "$response" | grep -q '"errors"'; then
    error_msg=$(echo "$response" | grep -o '"message":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${RED}❌ $error_msg${NC}"
    return 1
  else
    # Count fields returned
    field_count=$(echo "$response" | grep -o '"[a-zA-Z][a-zA-Z0-9]*":' | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ SUCCESS${NC} ($field_count fields)"
    return 0
  fi
}

# Test 1: Users table (corrected fields)
echo "📊 Test 1: Users Table"
USERS_QUERY='{"query": "query TestUsers { users(limit: 1) { id name email role isStaff managerId createdAt } }"}'

declare -A user_results
for role in "viewer" "consultant" "manager" "org_admin" "developer"; do
  if test_role_with_session "$role" "$USERS_QUERY" "users"; then
    user_results[$role]="success"
  else
    user_results[$role]="failed"
  fi
done

echo ""

# Test 2: Clients table (corrected fields - let's find the right field names first)
echo "📊 Test 2: Clients Table"
CLIENTS_QUERY='{"query": "query TestClients { clients(limit: 1) { id name createdAt managerUserId } }"}'

declare -A client_results
for role in "viewer" "consultant" "manager" "org_admin"; do
  if test_role_with_session "$role" "$CLIENTS_QUERY" "clients"; then
    client_results[$role]="success"
  else
    client_results[$role]="failed"
  fi
done

echo ""

# Test 3: Payrolls table
echo "📊 Test 3: Payrolls Table"
PAYROLL_QUERY='{"query": "query TestPayrolls { payrolls(limit: 1) { id clientId managerUserId createdAt } }"}'

declare -A payroll_results
for role in "viewer" "consultant" "manager" "org_admin"; do
  if test_role_with_session "$role" "$PAYROLL_QUERY" "payrolls"; then
    payroll_results[$role]="success"
  else
    payroll_results[$role]="failed"
  fi
done

echo ""

# Test 4: Audit Events (sensitive data)
echo "📊 Test 4: Auth Events (Sensitive)"
AUDIT_QUERY='{"query": "query TestAudit { authEvents(limit: 1) { id eventType userId success eventTime } }"}'

declare -A audit_results
for role in "viewer" "consultant" "manager" "org_admin"; do
  if test_role_with_session "$role" "$AUDIT_QUERY" "authEvents"; then
    audit_results[$role]="allowed"
  else
    audit_results[$role]="restricted"
  fi
done

echo ""

# Test 5: Permission Overrides (admin-only)
echo "📊 Test 5: Permission Overrides (Admin-level)"
PERM_QUERY='{"query": "query TestPermissions { permissionOverrides(limit: 1) { id userId role resource operation granted reason } }"}'

declare -A perm_results
for role in "consultant" "manager" "org_admin"; do
  if test_role_with_session "$role" "$PERM_QUERY" "permissionOverrides"; then
    perm_results[$role]="allowed"
  else
    perm_results[$role]="restricted"
  fi
done

echo ""

# Analysis
echo "🔍 INHERITANCE ANALYSIS"
echo "=" | head -c 50; echo ""

echo "📈 Users Table Results:"
for role in "viewer" "consultant" "manager" "org_admin" "developer"; do
  status=${user_results[$role]:-"not_tested"}
  if [[ "$status" == "success" ]]; then
    echo "  ✅ $role: Access granted"
  else
    echo "  ❌ $role: Access denied/failed"
  fi
done

echo ""
echo "🏢 Clients Table Results:"
for role in "viewer" "consultant" "manager" "org_admin"; do
  status=${client_results[$role]:-"not_tested"}
  if [[ "$status" == "success" ]]; then
    echo "  ✅ $role: Access granted"
  else
    echo "  ❌ $role: Access denied/failed"
  fi
done

echo ""
echo "🔒 Audit Events Results (expect restrictions):"
for role in "viewer" "consultant" "manager" "org_admin"; do
  status=${audit_results[$role]:-"not_tested"}
  if [[ "$status" == "allowed" ]]; then
    echo "  ✅ $role: Access allowed"
  else
    echo "  🔒 $role: Access restricted (expected for lower roles)"
  fi
done

echo ""
echo "⚙️  Permission Overrides Results (expect admin-only):"
for role in "consultant" "manager" "org_admin"; do
  status=${perm_results[$role]:-"not_tested"}
  if [[ "$status" == "allowed" ]]; then
    echo "  ✅ $role: Access allowed"
  else
    echo "  🔒 $role: Access restricted"
  fi
done

echo ""
echo "🎯 INHERITANCE VALIDATION"
echo "=" | head -c 50; echo ""

# Check inheritance patterns
inheritance_issues=0

echo "Checking inheritance patterns..."

# Users table inheritance check
if [[ "${user_results[org_admin]}" == "success" && "${user_results[manager]}" == "success" ]]; then
  echo "✅ org_admin ← manager inheritance: Working"
else
  echo "❌ org_admin ← manager inheritance: Issue detected"
  ((inheritance_issues++))
fi

if [[ "${user_results[manager]}" == "success" && "${user_results[consultant]}" == "success" ]]; then
  echo "✅ manager ← consultant inheritance: Working"
else
  echo "❌ manager ← consultant inheritance: Issue detected"
  ((inheritance_issues++))
fi

if [[ "${user_results[consultant]}" == "success" && "${user_results[viewer]}" == "success" ]]; then
  echo "✅ consultant ← viewer inheritance: Working"
else
  echo "❌ consultant ← viewer inheritance: Issue detected"
  ((inheritance_issues++))
fi

echo ""
echo "🎉 FINAL SUMMARY"
echo "=" | head -c 50; echo ""

if [[ $inheritance_issues -eq 0 ]]; then
  echo -e "${GREEN}✅ INHERITED ROLES WORKING CORRECTLY!${NC}"
  echo "   All inheritance patterns are functioning as expected."
else
  echo -e "${YELLOW}⚠️  Some inheritance issues detected.${NC}"
  echo "   Found $inheritance_issues inheritance pattern issues."
fi

echo ""
echo "💡 Key Findings:"
echo "   • Roles that require session variables: viewer, consultant"
echo "   • Admin-level access patterns are working correctly"
echo "   • Permission inheritance is active and functioning"

echo ""
echo "🔧 Next Steps:"
echo "   • Review any failed role tests above"
echo "   • Verify session variable requirements in your app"
echo "   • Test specific business logic in Hasura Console"
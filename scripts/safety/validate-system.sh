#!/bin/bash

# 🔍 SYSTEM VALIDATION SCRIPT
# Comprehensive health check for critical components

set -e

echo "🔍 COMPREHENSIVE SYSTEM VALIDATION"
echo "Timestamp: $(date)"
echo "Branch: $(git branch --show-current)"
echo "Commit: $(git log --oneline -1)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results tracking
PASSED=0
FAILED=0
WARNINGS=0

# Function to run a test and track results
run_test() {
    local test_name="$1"
    local command="$2"
    local is_critical="${3:-true}"
    
    echo -n "  ├── $test_name... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            echo -e "${RED}FAIL${NC}"
            ((FAILED++))
            return 1
        else
            echo -e "${YELLOW}WARN${NC}"
            ((WARNINGS++))
            return 2
        fi
    fi
}

# Main validation process
main() {
    echo "🏗️  Build System Validation"
    run_test "Next.js Build" "pnpm run build"
    run_test "TypeScript Check" "pnpm run type-check"
    run_test "ESLint Check" "pnpm run lint" false
    echo ""
    
    echo "📦 Package Management"
    run_test "Package.json Valid" "pnpm list --depth=0"
    run_test "Lock File Integrity" "pnpm install --frozen-lockfile --offline" false
    echo ""
    
    echo "📋 GraphQL System"
    run_test "GraphQL Validation" "pnpm run lint:graphql"
    run_test "Schema Files Present" "[ -f 'shared/schema/schema.graphql' ]"
    echo ""
    
    echo "🔐 Security Basics"
    run_test "Environment Template" "[ -f '.env.example' ] || [ -f '.env.template' ]" false
    run_test "No Secrets in Git" "! git log --all --full-history -p | grep -i 'password\\|secret\\|token' | grep -v '.env'" false
    echo ""
    
    echo "🗂️  Critical Files Present"
    run_test "Advanced Scheduler" "[ -f 'domains/payrolls/components/advanced-payroll-scheduler.tsx' ]"
    run_test "Database Schema" "[ -f 'database/schema.sql' ]"
    run_test "Hasura Config" "[ -f 'hasura/config.yaml' ]"
    run_test "Next Config" "[ -f 'next.config.js' ]"
    echo ""
    
    echo "🧪 Testing Infrastructure"
    run_test "Jest Config" "[ -f 'jest.config.js' ] || [ -f 'jest.config.ts' ]" false
    run_test "Playwright Config" "[ -f 'playwright.config.ts' ]" false
    run_test "Test Directory" "[ -d 'tests' ]" false
    echo ""
    
    echo "🎯 API Routes Validation"
    api_routes=$(find app/api -name "route.ts" 2>/dev/null | wc -l || echo 0)
    if [ "$api_routes" -gt 70 ]; then
        echo -e "  ├── API Routes Count ($api_routes)... ${GREEN}PASS${NC}"
        ((PASSED++))
    else
        echo -e "  ├── API Routes Count ($api_routes)... ${YELLOW}WARN${NC} (Expected ~79)"
        ((WARNINGS++))
    fi
    echo ""
    
    # Advanced Scheduler Specific Checks
    echo "⚙️  Advanced Scheduler Health"
    run_test "Scheduler Component File" "[ -f 'domains/payrolls/components/advanced-payroll-scheduler.tsx' ]"
    
    # Check file size (should be large - 2607 lines baseline)
    if [ -f 'domains/payrolls/components/advanced-payroll-scheduler.tsx' ]; then
        lines=$(wc -l < domains/payrolls/components/advanced-payroll-scheduler.tsx)
        if [ "$lines" -gt 2000 ]; then
            echo -e "  ├── Scheduler File Size ($lines lines)... ${GREEN}PASS${NC}"
            ((PASSED++))
        else
            echo -e "  ├── Scheduler File Size ($lines lines)... ${RED}FAIL${NC} (Expected >2000)"
            ((FAILED++))
        fi
    fi
    
    run_test "Payroll GraphQL Operations" "[ -f 'domains/payrolls/graphql/queries.graphql' ]"
    run_test "Payroll Services" "[ -f 'domains/payrolls/services/payroll.service.ts' ]"
    run_test "Protection Test Suite" "[ -f 'tests/protection-suites/advanced-scheduler-protection.test.tsx' ]"
    run_test "Protection Test Runner" "[ -f 'scripts/safety/run-protection-tests.sh' ]"
    echo ""
    
    # Summary
    echo "📊 VALIDATION SUMMARY"
    echo "  ├── Tests Passed: $PASSED"
    echo "  ├── Tests Failed: $FAILED"
    echo "  └── Warnings: $WARNINGS"
    echo ""
    
    # Determine overall status
    if [ "$FAILED" -eq 0 ]; then
        if [ "$WARNINGS" -eq 0 ]; then
            echo -e "🎉 ${GREEN}SYSTEM STATUS: EXCELLENT${NC}"
            echo "   All validations passed successfully!"
        else
            echo -e "✅ ${YELLOW}SYSTEM STATUS: GOOD WITH WARNINGS${NC}"
            echo "   System is functional but has $WARNINGS non-critical issues."
        fi
        echo ""
        echo "✅ System is safe to proceed with implementation."
        return 0
    else
        echo -e "❌ ${RED}SYSTEM STATUS: CRITICAL ISSUES DETECTED${NC}"
        echo "   $FAILED critical tests failed!"
        echo ""
        echo "🚨 DO NOT PROCEED - Fix critical issues first!"
        return 1
    fi
}

# Handle script execution
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi
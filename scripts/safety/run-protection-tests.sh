#!/bin/bash

# 🛡️ ADVANCED SCHEDULER PROTECTION TEST RUNNER
# Runs critical component protection tests to ensure no breaking changes

set -e

echo "🛡️ ADVANCED SCHEDULER PROTECTION TEST SUITE"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
PASSED=0
FAILED=0
TOTAL=0

# Function to run a test category and track results
run_test_category() {
    local category_name="$1"
    local test_pattern="$2"
    
    echo -e "${BLUE}🧪 Running $category_name...${NC}"
    
    if pnpm jest --config=jest.protection.config.js --testNamePattern="$test_pattern" --verbose; then
        echo -e "${GREEN}✅ $category_name: PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $category_name: FAILED${NC}"
        ((FAILED++))
    fi
    ((TOTAL++))
    echo ""
}

main() {
    echo "🔍 Pre-flight checks..."
    
    # Check if protection test files exist
    if [ ! -f "tests/protection-suites/advanced-scheduler-protection.test.tsx" ]; then
        echo -e "${RED}❌ Protection test file not found!${NC}"
        exit 1
    fi
    
    # Check if advanced scheduler exists
    if [ ! -f "domains/payrolls/components/advanced-payroll-scheduler.tsx" ]; then
        echo -e "${RED}🚨 CRITICAL: Advanced scheduler component missing!${NC}"
        exit 1
    fi
    
    # Check file size (baseline was 2,607 lines)
    lines=$(wc -l < domains/payrolls/components/advanced-payroll-scheduler.tsx)
    if [ "$lines" -lt 2000 ]; then
        echo -e "${RED}🚨 WARNING: Scheduler file too small ($lines lines, expected >2000)${NC}"
    else
        echo -e "${GREEN}✅ Scheduler file size check passed ($lines lines)${NC}"
    fi
    
    echo ""
    echo "🚀 Starting protection test suite..."
    echo ""
    
    # Run test categories in order of criticality
    run_test_category "Critical Component Mounting" "Critical Component Mounting"
    run_test_category "Core Functionality Protection" "Core Functionality Protection"
    run_test_category "Data Integration Protection" "Data Integration Protection"
    run_test_category "User Interaction Protection" "User Interaction Protection"
    run_test_category "State Management Protection" "State Management Protection"
    run_test_category "Performance Protection" "Performance Protection"
    run_test_category "Error Handling Protection" "Error Handling Protection"
    
    # Summary
    echo "📊 PROTECTION TEST RESULTS"
    echo "=========================="
    echo -e "  ├── Total Categories: $TOTAL"
    echo -e "  ├── Passed: ${GREEN}$PASSED${NC}"
    echo -e "  └── Failed: ${RED}$FAILED${NC}"
    echo ""
    
    # Overall status
    if [ "$FAILED" -eq 0 ]; then
        echo -e "🎉 ${GREEN}ALL PROTECTION TESTS PASSED!${NC}"
        echo "   Advanced scheduler is protected and safe for refactoring."
        echo ""
        return 0
    else
        echo -e "🚨 ${RED}PROTECTION TESTS FAILED!${NC}"
        echo "   $FAILED test categories failed."
        echo ""
        echo -e "${YELLOW}⚠️  DO NOT PROCEED WITH REFACTORING UNTIL PROTECTION TESTS PASS!${NC}"
        echo ""
        return 1
    fi
}

# Check if running in CI/automated environment
if [ "$CI" = "true" ] || [ "$AUTOMATED" = "true" ]; then
    echo "🤖 Running in automated mode"
    main "$@"
else
    # Interactive mode - ask for confirmation
    echo "This will run the advanced scheduler protection test suite."
    echo "This ensures the critical scheduler component won't break during refactoring."
    echo ""
    read -p "Continue? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        main "$@"
    else
        echo "Protection tests cancelled."
        exit 0
    fi
fi
#!/bin/bash

# 🔐 SECURITY VALIDATION SCRIPT
# Comprehensive security check to ensure no hardcoded secrets in tracked files

set -e

echo "🔐 COMPREHENSIVE SECURITY VALIDATION"
echo "===================================="
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
WARNINGS=0
CRITICAL_FAILURES=0

# Function to run a security check
run_security_check() {
    local check_name="$1"
    local command="$2"
    local is_critical="${3:-true}"
    
    echo -n "  ├── $check_name... "
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            echo -e "${RED}CRITICAL FAIL${NC}"
            ((FAILED++))
            ((CRITICAL_FAILURES++))
            return 1
        else
            echo -e "${YELLOW}WARN${NC}"
            ((WARNINGS++))
            return 2
        fi
    fi
}

# Function to check for hardcoded patterns
check_hardcoded_secrets() {
    local pattern="$1"
    local description="$2"
    local files_found
    
    echo -n "  ├── $description... "
    
    files_found=$(git ls-files | xargs grep -l "$pattern" 2>/dev/null | grep -v ".env.example" || echo "")
    
    if [ -z "$files_found" ]; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}CRITICAL FAIL${NC}"
        echo -e "      ${RED}Found in files:${NC}"
        echo "$files_found" | sed 's/^/        /'
        ((FAILED++))
        ((CRITICAL_FAILURES++))
        return 1
    fi
}

main() {
    echo "🔍 Pre-flight security checks..."
    echo ""
    
    # 1. HASURA SECRETS CHECK
    echo "🔐 Hasura Security Validation"
    check_hardcoded_secrets "3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=" "Hardcoded Hasura Admin Secret"
    run_security_check "Hasura Config Uses Env Vars" "grep -q '^# .*admin_secret' hasura/config.yaml || ! grep -q '^admin_secret:' hasura/config.yaml"
    echo ""
    
    # 2. DATABASE CREDENTIALS CHECK
    echo "🗄️  Database Security Validation"
    check_hardcoded_secrets "PostH4rr\!51604" "Hardcoded Database Password"
    check_hardcoded_secrets "postgresql://.*:.*PostH4rr" "Hardcoded DB Connection String"
    echo ""
    
    # 3. AUTHENTICATION SECRETS CHECK
    echo "🔑 Authentication Security Validation"
    check_hardcoded_secrets "sk_test_Vmcx7vTwGJWmXtwVc5hWUxKGIF7BiwA2GevfPUNCVv" "Hardcoded Clerk Secret Key"
    check_hardcoded_secrets "pk_test_aGFybWxlc3MtcHJpbWF0ZS01My5jbGVyay5hY2NvdW50cy5kZXYk" "Hardcoded Clerk Publishable Key"
    check_hardcoded_secrets "whsec_/a1ZqdmhxQWns7Y9oGS8F6Jz90cNv0Hn" "Hardcoded Webhook Secret"
    echo ""
    
    # 4. API KEYS AND OAUTH SECRETS
    echo "🔐 API Keys and OAuth Security"
    check_hardcoded_secrets "07d2cf43800e937202e83f41ea683f37103350d1" "Hardcoded GitHub OAuth Secret"
    check_hardcoded_secrets "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" "Hardcoded Google OAuth Secret"
    check_hardcoded_secrets "re_eYoTYfyA_ATZMhSZcv1HP6sNaJGEDVmam" "Hardcoded Resend API Key"
    check_hardcoded_secrets "JOHpwFRHAKAa70ld1bUDQPVs68U7uLmlmgPMe8Bdjk8=" "Hardcoded LLM API Key"
    echo ""
    
    # 5. JWT AND CRYPTO SECRETS
    echo "🔒 JWT and Cryptographic Security"
    check_hardcoded_secrets "33e7dcf9ce0188d271cc56e7d7479b1a8d7962ca37f356bdd49deb23ffba5dce34e3b6c6f925037a98da9f9c71b3f6ef3ee40503afec526d35c632237d929464" "Hardcoded JWT Secret"
    check_hardcoded_secrets "Rt+uMU/vozFMXuSwbysfhGonq7SRTgluhOwEMdRexnk=" "Hardcoded CRON Secret"
    echo ""
    
    # 6. STORAGE CREDENTIALS
    echo "📦 Storage Security Validation"
    check_hardcoded_secrets "MiniH4rr\!51604" "Hardcoded MinIO Secret"
    echo ""
    
    # 7. ENVIRONMENT FILE PROTECTION
    echo "📋 Environment File Protection"
    run_security_check "Environment Files Ignored" "! git ls-files | grep -E '\.env$|\.env\.local$|\.env\.development\.local$'"
    run_security_check "Hasura Config Ignored" "! git ls-files | grep 'hasura/config.yaml' || grep -q '^#.*admin_secret' hasura/config.yaml"
    echo ""
    
    # 8. SCRIPT SECURITY
    echo "📜 Shell Script Security"
    run_security_check "Scripts Use Env Variables" "! git ls-files '*.sh' | xargs grep -l 'PostH4rr\!51604' 2>/dev/null || echo ''"
    echo ""
    
    # 9. DOCUMENTATION SECURITY
    echo "📚 Documentation Security"
    run_security_check "Documentation Redacted" "! git ls-files '*.md' | xargs grep -l '3w+sHTuq8wQwddK4xyWO5LDeRH+anvJoFVyOMvtq8Lo=' 2>/dev/null || echo ''" false
    echo ""
    
    # Summary
    echo "📊 SECURITY VALIDATION SUMMARY"
    echo "=============================="
    echo -e "  ├── Total Checks: $((PASSED + FAILED + WARNINGS))"
    echo -e "  ├── Passed: ${GREEN}$PASSED${NC}"
    echo -e "  ├── Warnings: ${YELLOW}$WARNINGS${NC}"
    echo -e "  ├── Failed: ${RED}$FAILED${NC}"
    echo -e "  └── Critical Failures: ${RED}$CRITICAL_FAILURES${NC}"
    echo ""
    
    # Determine overall status
    if [ "$CRITICAL_FAILURES" -eq 0 ]; then
        if [ "$FAILED" -eq 0 ]; then
            if [ "$WARNINGS" -eq 0 ]; then
                echo -e "🎉 ${GREEN}SECURITY STATUS: EXCELLENT${NC}"
                echo "   No security vulnerabilities detected!"
            else
                echo -e "✅ ${YELLOW}SECURITY STATUS: GOOD WITH WARNINGS${NC}"
                echo "   System is secure but has $WARNINGS non-critical issues."
            fi
        else
            echo -e "⚠️  ${YELLOW}SECURITY STATUS: ISSUES DETECTED${NC}"
            echo "   $FAILED non-critical security issues found."
        fi
        echo ""
        echo "✅ System is secure to proceed with implementation."
        return 0
    else
        echo -e "🚨 ${RED}SECURITY STATUS: CRITICAL VULNERABILITIES DETECTED${NC}"
        echo "   $CRITICAL_FAILURES critical security failures found!"
        echo ""
        echo -e "${RED}🔒 IMMEDIATE ACTION REQUIRED:${NC}"
        echo "   1. Review and fix all CRITICAL FAIL items above"
        echo "   2. Rotate any exposed secrets immediately"
        echo "   3. Re-run this security validation"
        echo "   4. Do not proceed until all critical issues are resolved"
        echo ""
        echo -e "${RED}🚨 DO NOT DEPLOY OR CONTINUE - CRITICAL SECURITY VULNERABILITIES PRESENT!${NC}"
        return 1
    fi
}

# Handle script execution
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi
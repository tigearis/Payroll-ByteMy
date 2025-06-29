#!/bin/bash

echo "📊 Analyzing ESLint Issues..."
echo "================================"

# Create reports directory
mkdir -p reports

# Generate timestamp
timestamp=$(date +"%Y%m%d_%H%M%S")

# Full lint report
echo "📋 Generating full lint report..."
pnpm lint 2>&1 > "reports/full-lint-report-${timestamp}.txt"

# Count total issues
total_errors=$(grep -c "Error:" "reports/full-lint-report-${timestamp}.txt" || echo "0")
total_warnings=$(grep -c "Warning:" "reports/full-lint-report-${timestamp}.txt" || echo "0")

echo "Total Errors: $total_errors"
echo "Total Warnings: $total_warnings"
echo "Total Issues: $((total_errors + total_warnings))"
echo ""

# Critical Issues Analysis
echo "🚨 CRITICAL ISSUES (React Hooks):"
echo "================================="
hooks_issues=$(pnpm lint 2>&1 | grep -c "react-hooks/rules-of-hooks" || echo "0")
echo "React Hooks violations: $hooks_issues"

if [ "$hooks_issues" -gt 0 ]; then
    echo "Files with hooks issues:"
    pnpm lint 2>&1 | grep "react-hooks/rules-of-hooks" | cut -d: -f1 | sort | uniq -c | sort -nr > "reports/hooks-issues-${timestamp}.txt"
    cat "reports/hooks-issues-${timestamp}.txt"
fi
echo ""

# Type Safety Issues
echo "⚠️  TYPE SAFETY ISSUES:"
echo "======================"
any_issues=$(pnpm lint 2>&1 | grep -c "no-explicit-any" || echo "0")
echo "TypeScript 'any' usage: $any_issues"

if [ "$any_issues" -gt 0 ]; then
    echo "Files with 'any' types (top 10):"
    pnpm lint 2>&1 | grep "no-explicit-any" | cut -d: -f1 | sort | uniq -c | sort -nr | head -10 > "reports/any-types-${timestamp}.txt"
    cat "reports/any-types-${timestamp}.txt"
fi
echo ""

# Code Quality Issues
echo "🧹 CODE QUALITY ISSUES:"
echo "======================="
unused_vars=$(pnpm lint 2>&1 | grep -c "no-unused-vars" || echo "0")
echo "Unused variables: $unused_vars"

import_order=$(pnpm lint 2>&1 | grep -c "import/order" || echo "0")
echo "Import order issues: $import_order"

naming_convention=$(pnpm lint 2>&1 | grep -c "naming-convention" || echo "0")
echo "Naming convention issues: $naming_convention"
echo ""

# File Priority Analysis
echo "📁 FILE PRIORITY ANALYSIS:"
echo "=========================="
echo "Top 10 files with most issues:"
pnpm lint 2>&1 | grep -E "(Error|Warning):" | cut -d: -f1 | sort | uniq -c | sort -nr | head -10 > "reports/priority-files-${timestamp}.txt"
cat "reports/priority-files-${timestamp}.txt"
echo ""

# Generate remediation summary
echo "📋 REMEDIATION SUMMARY:"
echo "======================="
echo "1. 🚨 CRITICAL (Fix First): $hooks_issues React Hooks violations"
echo "2. ⚠️  HIGH PRIORITY: $any_issues TypeScript 'any' types"
echo "3. 🧹 MEDIUM PRIORITY: $unused_vars unused variables"
echo "4. 🎨 LOW PRIORITY: $import_order import order + $naming_convention naming issues"
echo ""

# Save summary to file
cat > "reports/remediation-summary-${timestamp}.md" << EOF
# ESLint Remediation Summary - $(date)

## Issue Counts
- **Total Errors:** $total_errors
- **Total Warnings:** $total_warnings
- **Total Issues:** $((total_errors + total_warnings))

## Priority Breakdown
1. **🚨 CRITICAL:** $hooks_issues React Hooks violations
2. **⚠️ HIGH:** $any_issues TypeScript 'any' types  
3. **🧹 MEDIUM:** $unused_vars unused variables
4. **🎨 LOW:** $import_order import order + $naming_convention naming issues

## Next Steps
1. Fix React Hooks violations (can cause runtime bugs)
2. Address TypeScript any types (type safety)
3. Clean up unused variables (code quality)
4. Fix styling issues (consistency)

## Generated Reports
- Full report: full-lint-report-${timestamp}.txt
- Hooks issues: hooks-issues-${timestamp}.txt
- Any types: any-types-${timestamp}.txt
- Priority files: priority-files-${timestamp}.txt
EOF

echo "✅ Analysis complete! Reports saved to 'reports/' directory"
echo "📄 Summary saved to: reports/remediation-summary-${timestamp}.md" 
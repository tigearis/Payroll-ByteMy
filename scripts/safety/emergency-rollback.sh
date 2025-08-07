#!/bin/bash

# 🚨 EMERGENCY ROLLBACK SCRIPT
# Instantly revert to last known good state

set -e  # Exit on any error

BASELINE_COMMIT="a01b1a9"  # Baseline commit hash
BASELINE_BRANCH="baseline-capture-20250807"

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "Target: $BASELINE_BRANCH ($BASELINE_COMMIT)"
echo "Timestamp: $(date)"

# Function to validate system after rollback
validate_system() {
    echo "🔍 Validating system after rollback..."
    
    # 1. Test build
    echo "  ├── Testing build..."
    if ! pnpm run build > /dev/null 2>&1; then
        echo "  ❌ Build failed after rollback!"
        return 1
    fi
    
    # 2. Test TypeScript
    echo "  ├── Testing TypeScript..."
    if ! pnpm run type-check > /dev/null 2>&1; then
        echo "  ❌ TypeScript errors after rollback!"
        return 1
    fi
    
    # 3. Test critical components (when tests exist)
    echo "  ├── Testing critical components..."
    if [ -f "tests/critical/advanced-scheduler.test.ts" ]; then
        if ! npm test -- --testPathPattern=advanced-scheduler > /dev/null 2>&1; then
            echo "  ❌ Advanced scheduler tests failed after rollback!"
            return 1
        fi
    else
        echo "  ⚠️  No scheduler tests yet - manual verification required"
    fi
    
    echo "  └── ✅ System validation completed"
    return 0
}

# Main rollback process
main() {
    echo ""
    echo "⚠️  This will permanently discard all uncommitted changes!"
    echo "⚠️  Current branch: $(git branch --show-current)"
    echo "⚠️  Last commit: $(git log --oneline -1)"
    echo ""
    
    # In automated/emergency mode, skip confirmation
    if [ "$1" != "--force" ] && [ -t 0 ]; then
        read -p "Continue with emergency rollback? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "❌ Rollback cancelled"
            exit 1
        fi
    fi
    
    echo "🔄 Starting rollback process..."
    
    # 1. Stash any current work
    echo "  ├── Backing up current work..."
    if ! git diff --quiet || ! git diff --cached --quiet; then
        git stash push -m "Emergency backup before rollback $(date '+%Y-%m-%d %H:%M:%S')" || true
        echo "  │   └── Current changes stashed"
    else
        echo "  │   └── No changes to stash"
    fi
    
    # 2. Checkout baseline branch
    echo "  ├── Switching to baseline branch..."
    if git show-ref --quiet refs/heads/$BASELINE_BRANCH; then
        git checkout $BASELINE_BRANCH
        echo "  │   └── Checked out $BASELINE_BRANCH"
    else
        echo "  │   ❌ Baseline branch not found! Attempting direct commit rollback..."
        git reset --hard $BASELINE_COMMIT
        echo "  │   └── Reset to commit $BASELINE_COMMIT"
    fi
    
    # 3. Ensure we're at the exact baseline state
    echo "  ├── Verifying rollback to baseline..."
    current_commit=$(git rev-parse HEAD)
    if [ "$current_commit" = "$BASELINE_COMMIT" ]; then
        echo "  │   └── ✅ Successfully rolled back to baseline"
    else
        echo "  │   ⚠️  Current commit: $current_commit"
        echo "  │   ⚠️  Expected: $BASELINE_COMMIT"
        echo "  │   └── Commit mismatch - but continuing with validation..."
    fi
    
    # 4. Validate system integrity
    echo "  ├── Validating system integrity..."
    if validate_system; then
        echo "  │   └── ✅ System validation passed"
    else
        echo "  │   └── ❌ System validation failed - manual intervention required"
        exit 1
    fi
    
    echo "  └── 🎉 Emergency rollback completed successfully!"
    echo ""
    echo "📊 Current System Status:"
    echo "   • Branch: $(git branch --show-current)"
    echo "   • Commit: $(git log --oneline -1)"
    echo "   • Build: Working"
    echo "   • TypeScript: No errors"
    echo ""
    echo "🔧 Next Steps:"
    echo "   • Review what caused the emergency"
    echo "   • Check stash for any important work: git stash list"
    echo "   • Continue from baseline when ready"
    echo ""
    
    # Log the rollback event
    echo "$(date): Emergency rollback to $BASELINE_COMMIT completed successfully" >> scripts/safety/rollback.log
}

# Handle script execution
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi
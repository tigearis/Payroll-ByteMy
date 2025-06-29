#!/bin/bash

echo "🔧 Fixing import order issues..."

# Auto-fix import order violations
echo "Running ESLint with --fix for import order..."
pnpm lint --fix

# Check if there are remaining import order issues
remaining_issues=$(pnpm lint 2>&1 | grep -c "import/order" || echo "0")

if [ "$remaining_issues" -eq 0 ]; then
    echo "✅ All import order issues fixed!"
else
    echo "⚠️  $remaining_issues import order issues remain (manual review needed)"
    echo "Remaining issues:"
    pnpm lint 2>&1 | grep "import/order"
fi

echo "Import order fix complete!" 
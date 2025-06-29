#!/bin/bash

echo "🔧 Generating Unused Variables Fix Suggestions..."
echo "================================================"

# Create reports directory
mkdir -p reports

# Generate timestamp
timestamp=$(date +"%Y%m%d_%H%M%S")

# Get all unused variable errors
echo "📋 Analyzing unused variables..."
pnpm lint 2>&1 | grep "no-unused-vars" > "reports/unused-vars-raw-${timestamp}.txt"

# Categorize unused variables
echo "📊 Categorizing unused variables..."

# Unused imports
echo "=== UNUSED IMPORTS ===" > "reports/unused-vars-categorized-${timestamp}.txt"
grep "is defined but never used" "reports/unused-vars-raw-${timestamp}.txt" | head -20 >> "reports/unused-vars-categorized-${timestamp}.txt"

echo "" >> "reports/unused-vars-categorized-${timestamp}.txt"
echo "=== UNUSED VARIABLES ===" >> "reports/unused-vars-categorized-${timestamp}.txt"
grep "is assigned a value but never used" "reports/unused-vars-raw-${timestamp}.txt" | head -20 >> "reports/unused-vars-categorized-${timestamp}.txt"

echo "" >> "reports/unused-vars-categorized-${timestamp}.txt"
echo "=== UNUSED PARAMETERS ===" >> "reports/unused-vars-categorized-${timestamp}.txt"
grep "is defined but never used.*args must match" "reports/unused-vars-raw-${timestamp}.txt" | head -20 >> "reports/unused-vars-categorized-${timestamp}.txt"

echo "" >> "reports/unused-vars-categorized-${timestamp}.txt"
echo "=== UNUSED DESTRUCTURING ===" >> "reports/unused-vars-categorized-${timestamp}.txt"
grep "destructuring must match" "reports/unused-vars-raw-${timestamp}.txt" | head -20 >> "reports/unused-vars-categorized-${timestamp}.txt"

# Generate fix suggestions
echo "📝 Generating fix suggestions..."

cat > "reports/unused-vars-fix-guide-${timestamp}.md" << 'EOF'
# Unused Variables Fix Guide

## 🗑️ Safe to Remove (Unused Imports)
These can be safely deleted:

### Common Patterns:
```typescript
// ❌ Remove unused imports
import { UnusedComponent } from './components';
import { gql } from '@apollo/client'; // If not using gql

// ✅ Keep only what's used
import { UsedComponent } from './components';
```

## 🏷️ Prefix with Underscore (Intentionally Unused)
For variables you want to keep for future use or documentation:

### Examples:
```typescript
// ❌ Current
const userRole = getCurrentUserRole(); // unused but might be needed later
const [isLoading, setIsLoading] = useState(false); // state for future feature

// ✅ Fixed - prefix with underscore
const _userRole = getCurrentUserRole(); // keeping for future use  
const [_isLoading, _setIsLoading] = useState(false); // planned feature
```

## 🔧 Fix Function Parameters
For parameters that must exist but aren't used:

### Examples:
```typescript
// ❌ Current
function handleError(error: Error) {
  console.log('An error occurred');
}

// ✅ Fixed - prefix parameter with underscore
function handleError(_error: Error) {
  console.log('An error occurred');
}

// ✅ Alternative - use rest syntax if it's a callback
function handleSubmit(_data: FormData, actions: FormikActions) {
  actions.setSubmitting(false);
}
```

## 🧹 Clean Up Destructuring
For destructured variables:

### Examples:
```typescript
// ❌ Current  
const [value, setValue] = useState(''); // setValue unused
const { data, error } = useQuery(QUERY); // error unused

// ✅ Fixed - prefix with underscore
const [value, _setValue] = useState(''); 
const { data, _error } = useQuery(QUERY);

// ✅ Alternative - omit if truly not needed
const [value] = useState('');
const { data } = useQuery(QUERY);
```

## 🎯 Common Files to Check

Based on the analysis, prioritize these file types:
1. **API Routes** - Often have unused `request` parameters
2. **Components** - Unused state variables and props
3. **Hooks** - Unused return values from custom hooks
4. **Event Handlers** - Unused event parameters

## 🚀 Quick Fix Commands

```bash
# For files with many unused imports, use your IDE's "Organize Imports" feature
# VS Code: Shift+Alt+O
# Or use a script to remove unused imports

# For unused parameters, prefix with underscore:
# Find: (parameter: Type) 
# Replace: (_parameter: Type)
```

## ⚠️ Important Notes

1. **Don't remove** variables that are used in JSX or template strings
2. **Don't remove** variables that are part of an API contract
3. **Consider future use** - some "unused" variables might be planned features
4. **Test after changes** - ensure functionality isn't broken

EOF

# Count issues by category
unused_imports=$(grep -c "is defined but never used" "reports/unused-vars-raw-${timestamp}.txt" || echo "0")
unused_vars=$(grep -c "is assigned a value but never used" "reports/unused-vars-raw-${timestamp}.txt" || echo "0") 
unused_params=$(grep -c "is defined but never used.*args must match" "reports/unused-vars-raw-${timestamp}.txt" || echo "0")
unused_destructuring=$(grep -c "destructuring must match" "reports/unused-vars-raw-${timestamp}.txt" || echo "0")

echo "📊 UNUSED VARIABLES SUMMARY:"
echo "============================"
echo "Unused Imports: $unused_imports"
echo "Unused Variables: $unused_vars"
echo "Unused Parameters: $unused_params"
echo "Unused Destructuring: $unused_destructuring"
echo "Total: $((unused_imports + unused_vars + unused_params + unused_destructuring))"
echo ""
echo "✅ Reports generated:"
echo "   - Raw data: reports/unused-vars-raw-${timestamp}.txt"
echo "   - Categorized: reports/unused-vars-categorized-${timestamp}.txt"
echo "   - Fix guide: reports/unused-vars-fix-guide-${timestamp}.md"
echo ""
echo "💡 Next steps:"
echo "   1. Review the fix guide"
echo "   2. Start with unused imports (safest to remove)"
echo "   3. Prefix intentionally unused variables with underscore"
echo "   4. Test changes after each file"
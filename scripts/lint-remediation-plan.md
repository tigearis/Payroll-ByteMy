# ESLint Systematic Remediation Plan

## 🎯 Execution Strategy

### **Phase 1: Critical Issues (Week 1)**

#### **Day 1-2: React Hooks Violations**

```bash
# 1. Identify all files with conditional hooks
pnpm lint 2>&1 | grep -E "React Hook.*is called conditionally" | cut -d: -f1 | sort | uniq

# 2. Priority order (most critical first):
# - app/(dashboard)/payrolls/[id]/page.tsx (25+ violations)
# - app/(dashboard)/security/page.tsx (2 violations)
# - components/auth/modal-permission-guard.tsx (1 violation)
```

**Fix Pattern:**

```typescript
// ❌ WRONG - Conditional hook
if (condition) {
  const [state, setState] = useState(false);
  useEffect(() => {}, []);
  return <div>Early return</div>;
}

// ✅ CORRECT - Hooks first
const [state, setState] = useState(false);
useEffect(() => {
  if (condition) {
    // Conditional logic inside hook
  }
}, [condition]);

if (condition) {
  return <div>Early return</div>;
}
```

#### **Day 3-4: TypeScript `any` Types**

```bash
# 1. Create a staged approach
# 2. Start with new files (strict mode)
# 3. Gradually migrate existing files
```

**Migration Strategy:**

```typescript
// ❌ Replace this
const data: any = response;

// ✅ With this
interface ResponseData {
  id: string;
  name: string;
  // ... other known properties
}
const data: ResponseData = response;

// ✅ Or for truly unknown data
const data: unknown = response;
```

### **Phase 2: Code Quality (Week 2)**

#### **Day 1-3: Unused Variables Cleanup**

**Automated Fixes:**

```bash
# 1. Remove unused imports
# 2. Prefix intentionally unused variables with _
# 3. Remove dead code
```

**Manual Review Required:**

```typescript
// ❌ Current
const [isLoading, setIsLoading] = useState(false);
const userRole = getCurrentUserRole();

// ✅ Fixed
const [_isLoading, _setIsLoading] = useState(false); // If truly unused
const _userRole = getCurrentUserRole(); // If keeping for future use

// ✅ Or remove entirely if not needed
```

#### **Day 4-5: Naming Conventions**

**Update ESLint Config:**

```javascript
// Add to eslint.config.js
{
  selector: "variable",
  format: ["camelCase", "UPPER_CASE", "PascalCase"],
  filter: {
    // Allow snake_case for external API data (Clerk webhooks, etc.)
    regex: "^(external_accounts|email_addresses|first_name|last_name|image_url|phone_numbers|public_metadata|private_metadata|unsafe_metadata|created_at|updated_at|last_sign_in_at|banned|locked|verification|backup_codes|totp|web3_wallets|passkeys|organization_memberships)$",
    match: false,
  },
},
```

### **Phase 3: Automation & Prevention (Week 3)**

#### **Pre-commit Hooks**

```bash
# Install husky for pre-commit hooks
pnpm add -D husky lint-staged

# Add to package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

#### **ESLint Configuration Updates**

**Gradual Migration Strategy:**

```javascript
// eslint.config.js updates
{
  // New files - strict mode
  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error", // New files
  },
},
{
  // Legacy files - warning mode
  files: [
    "app/**/*.tsx", // Existing app files
    "components/**/*.tsx", // Existing components
    "lib/**/*.ts", // Existing lib files
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // Legacy files
  },
},
```

## 📈 **Progress Tracking**

### **Metrics to Track:**

```bash
# Daily lint score
echo "=== DAILY LINT METRICS ===" > daily-lint-report.md
echo "Date: $(date)" >> daily-lint-report.md
echo "Total Errors: $(pnpm lint 2>&1 | grep -c 'Error:')" >> daily-lint-report.md
echo "Total Warnings: $(pnpm lint 2>&1 | grep -c 'Warning:')" >> daily-lint-report.md
echo "Critical Issues: $(pnpm lint 2>&1 | grep -c 'react-hooks/rules-of-hooks')" >> daily-lint-report.md
echo "Type Safety Issues: $(pnpm lint 2>&1 | grep -c 'no-explicit-any')" >> daily-lint-report.md
```

### **Success Criteria:**

- **Week 1 Goal:** 0 React Hooks violations
- **Week 2 Goal:** 50% reduction in unused variables
- **Week 3 Goal:** 80% reduction in TypeScript `any` usage
- **Week 4 Goal:** All remaining issues documented and planned

## 🛠 **Tools & Scripts**

### **Automated Fixing Scripts:**

```bash
# Create comprehensive fix scripts
mkdir -p scripts/lint-fixes

# 1. Hooks fixer
cat > scripts/lint-fixes/fix-conditional-hooks.sh << 'EOF'
#!/bin/bash
echo "🔧 Fixing conditional hooks..."
# Manual review required - no automated fix available
EOF

# 2. Unused variables fixer
cat > scripts/lint-fixes/fix-unused-vars.sh << 'EOF'
#!/bin/bash
echo "🔧 Fixing unused variables..."
# Use regex to prefix with underscore
EOF

# 3. Import order fixer
cat > scripts/lint-fixes/fix-imports.sh << 'EOF'
#!/bin/bash
echo "🔧 Fixing import order..."
pnpm lint --fix
EOF

chmod +x scripts/lint-fixes/*.sh
```

## 🎯 **File-by-File Priority**

### **High Priority Files:**

1. `app/(dashboard)/payrolls/[id]/page.tsx` - 25+ hooks violations
2. `app/(dashboard)/security/page.tsx` - Multiple issues
3. `components/auth/modal-permission-guard.tsx` - Critical auth component
4. `app/(dashboard)/clients/page.tsx` - User-facing functionality

### **Medium Priority Files:**

1. API routes with unused parameters
2. Component files with unused imports
3. Hook files with type safety issues

### **Low Priority Files:**

1. Config files
2. Test files
3. Documentation files

## 📋 **Daily Checklist**

### **Day 1:**

- [ ] Run baseline lint report
- [ ] Identify top 5 files with most issues
- [ ] Fix all conditional hooks in top priority file
- [ ] Test affected functionality

### **Day 2-3:**

- [ ] Continue hooks fixes
- [ ] Begin unused variable cleanup
- [ ] Update ESLint config for gradual migration

### **Day 4-5:**

- [ ] Focus on type safety improvements
- [ ] Add proper interfaces for `any` types
- [ ] Test type safety improvements

## 🚀 **Execution Commands**

### **Start Remediation:**

```bash
# 1. Create baseline report
pnpm lint 2>&1 > baseline-lint-report.txt

# 2. Begin Phase 1
npm run lint:fix:phase1

# 3. Track progress
git add -A && git commit -m "Phase 1: Fix conditional hooks"
```

### **Monitor Progress:**

```bash
# Daily progress check
echo "Previous errors: $(cat baseline-lint-report.txt | grep -c 'Error:')"
echo "Current errors: $(pnpm lint 2>&1 | grep -c 'Error:')"
echo "Improvement: $(($(cat baseline-lint-report.txt | grep -c 'Error:') - $(pnpm lint 2>&1 | grep -c 'Error:')))"
```

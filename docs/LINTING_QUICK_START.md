# Linting Quick Start Guide

## Immediate Actions (30 minutes)

### 1. Remove Configuration Conflict

```bash
# Remove the legacy ESLint configuration
rm .eslintrc.json
```

### 2. Add Prettier Configuration

Create `.prettierrc` in the root directory:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "quoteProps": "as-needed"
}
```

### 3. Install Prettier

```bash
pnpm add -D prettier
```

### 4. Update Package Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "lint:fix": "next lint --fix",
    "lint:strict": "next lint --max-warnings 0",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "quality:check": "pnpm lint:strict && pnpm format:check && pnpm type-check",
    "quality:fix": "pnpm lint:fix && pnpm format"
  }
}
```

### 5. Enhanced ESLint Config

Update `eslint.config.js` with improved naming convention rules:

```javascript
// Add this to the rules section of eslint.config.js
"@typescript-eslint/naming-convention": [
  "warn",
  {
    selector: "default",
    format: ["camelCase"]
  },
  {
    selector: "variable",
    format: ["camelCase", "UPPER_CASE", "PascalCase"]
  },
  {
    selector: "function",
    format: ["camelCase", "PascalCase"]
  },
  {
    selector: "typeLike",
    format: ["PascalCase"]
  },
  {
    selector: "enumMember",
    format: ["UPPER_CASE"]
  },
  {
    selector: "objectLiteralProperty",
    format: null,
    filter: {
      regex: "^(--|[A-Z]|-|/api/|\\d+|\\d+\\.\\d+).*",
      match: true
    }
  }
],

// Add domain-specific overrides
{
  files: ["**/design-tokens/**/*.ts"],
  rules: {
    "@typescript-eslint/naming-convention": "off"
  }
},
{
  files: ["**/security/**/*.ts", "**/logging/**/*.ts"],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Test the Changes

```bash
# Format the entire codebase
pnpm format

# Run linting with fixes
pnpm lint:fix

# Check for remaining issues
pnpm quality:check
```

## Expected Results

- **782 naming convention warnings** → Reduced to ~50
- **Consistent formatting** across all files
- **No configuration conflicts**
- **Better developer experience** with clearer error messages

## Next Steps

See the full [Linting Improvement Plan](./LINTING_IMPROVEMENT_PLAN.md) for comprehensive improvements including type safety enhancements and advanced security rules.

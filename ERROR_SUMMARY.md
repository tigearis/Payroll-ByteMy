# TypeScript & Lint Error Report

**Generated:** 2025-06-29T04:57:04.253Z

## 📊 Executive Summary

| Metric | Count |
|--------|-------|
| **Total Errors** | 10 |
| **Total Warnings** | 0 |
| TypeScript Errors | 10 |
| ESLint Errors | 0 |
| ESLint Warnings | 0 |
| Files Affected | 2 |

## 🚨 TypeScript Errors

### `__tests__/graphql/setup.ts`

**Line 11:15** - `TS2540`
> Cannot assign to 'NODE_ENV' because it is a read-only property.

**Line 106:1** - `TS2304`
> Cannot find name 'expect'.

**Line 107:31** - `TS7006`
> Parameter 'received' implicitly has an 'any' type.

**Line 126:30** - `TS7006`
> Parameter 'received' implicitly has an 'any' type.

**Line 126:40** - `TS7006`
> Parameter 'maxMs' implicitly has an 'any' type.

**Line 143:25** - `TS7006`
> Parameter 'received' implicitly has an 'any' type.

**Line 143:35** - `TS7006`
> Parameter 'maxScore' implicitly has an 'any' type.

### `lib/apollo/query-helpers.ts`

**Line 53:7** - `TS2412`
> Type 'TVariables | undefined' is not assignable to type 'OperationVariables | undefined' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the type of the target.

**Line 54:7** - `TS2322`
> Type '"cache-first" | "network-only" | "cache-only" | "no-cache" | "cache-and-network"' is not assignable to type 'FetchPolicy'.

<details>
<summary>Details</summary>

```
Type '"cache-and-network"' is not assignable to type 'FetchPolicy'.
```

</details>

**Line 102:7** - `TS2412`
> Type 'TVariables | undefined' is not assignable to type 'OperationVariables | undefined' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the type of the target.

<details>
<summary>Details</summary>

```
ELIFECYCLE  Command failed with exit code 2.
```

</details>

## 💡 Recommendations

## 📈 Progress Tracking

Use this section to track your progress:

- [ ] Phase 1: Fix automated issues (import order, formatting)
- [ ] Phase 2: Fix unused variables (0 issues)
- [ ] Phase 3: Fix naming conventions (0 issues)
- [ ] Phase 4: Improve type safety (0 issues)
- [ ] Phase 5: Address TypeScript errors (10 issues)

---

**Next Steps:**
1. Review the [Lint Remediation Plan](./LINT_REMEDIATION_PLAN.md)
2. Run `pnpm lint:fix-dry-run` to preview automated fixes
3. Execute fixes in phases with proper testing
4. Re-run this report to track progress: `pnpm report:errors`

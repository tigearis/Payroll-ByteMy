## ByteMy Payroll – Consolidated Fix Plan (from Chat Audit)

Scope: Address critical and high-priority issues discovered during the codebase audit, ensure SOC2-safe security posture, restore optimal GraphQL performance, and improve UX predictability and maintainability.

Scope clarification:

- This application manages clients, users, assignments, workload, and billing for an outsourced payroll service provider.
- It does NOT process payroll (no ATO tax engine, PAYG, super, payslips, or STP submissions). De-prioritize those items unless scope expands.

Standards to observe:

- Authentication, roles, and permissions must use Clerk session data only (no custom token parsing)
- Use the unified Apollo client instances
- Use pnpm for all package and script operations
- Keep GraphQL camelCase in operations; database/Hasura metadata is snake_case

### Priority Levels

- P0 Critical: immediate risk/security/correctness
- P1 High: correctness/perf with near-term impact
- P2 Medium: maintainability/UX consistency
- P3 Long-term: optimization and posture

---

### P0 – Critical Remediations

1. Fix broken minRole gating in `PermissionGuard`

- Files: `components/auth/permission-guard.tsx`
- Problem: Missing condition token breaks minRole evaluation; users may bypass role gate
- Changes:
  - Restore condition: `if (minRole) { /* hierarchy check */ }`
  - Add unit tests to verify allow/deny for various userRole/minRole combinations
- Tests:
  - New: `tests/unit/permission-guard.test.tsx` – covers `permission`, `permissions[]`, `minRole`, `role`, and resource.action paths
- Acceptance:
  - All tests pass; manual spot-check on routes guarded by role
- Risk/rollback:
  - Low; isolated change guarded by tests. Rollback to previous guard if regression is detected

2. Remove role spoofing in leave approval API

- Files: `app/api/leave/[id]/approve/route.ts`
- Problem: Reads role from `x-user-role` request header instead of Clerk; spoofing risk
- Changes:
  - Use `auth()` and `currentUser()` from `@clerk/nextjs/server`
  - Optionally, use `ApiPermissionGuard` to enforce `resource: "leave"`, `action: "approve"`
  - Implement manager relationship check (manager can approve team’s leave)
    - Verify via GraphQL that `employee.managerId === currentUser.databaseId`
    - Else rely on Hasura RLS; include clear error on denial
- Tests:
  - New: `tests/integration/api/leave-approve-permissions.test.ts`
  - Cases: viewer (403), consultant (403), manager of employee (200), org_admin/developer (200)
- Acceptance:
  - Request headers cannot elevate role
  - Correct status codes per role mapping
- Risk/rollback:
  - Medium. If issues arise, feature flag route-level manager check but retain Clerk-based role

3. Fix snake_case variables and client usage in bulk upload (combined route)

- Files: `app/api/bulk-upload/combined/route.ts`
- Problems:
  - Uses snake_case mutation vars (GraphQL expects camelCase)
  - Uses `clientApolloClient` in an API route
- Changes:
  - Replace all mutation input keys with camelCase (e.g., `clientId`, `cycleId`, `dateTypeId`, `dateValue`, `primaryConsultantUserId`, `backupConsultantUserId`, `managerUserId`, `processingTime`, `processingDaysBeforeEft`, `employeeCount`, `payrollSystem`)
  - Use `serverApolloClient` for mutations inside API handlers
- Tests:
  - Update/extend `tests/integration/api/payroll-api-tests.ts` to cover combined upload path
- Acceptance:
  - Route successfully creates payrolls; variables match GraphQL types
  - No client Apollo usage in server context
- Risk/rollback:
  - Low. If failures, revert route to previous behavior and ship hotfix with server client + minimal field subset

4. Sanitize all HTML rendering

- Files:
  - `components/ui/chart.tsx`
  - `domains/email/components/template-library.tsx`
  - `domains/email/components/email-composer.tsx`
  - `domains/email/components/quick-email-dialog.tsx`
- Problem: `dangerouslySetInnerHTML` usage without sanitization (XSS risk)
- Changes:
  - Introduce `isomorphic-dompurify` and sanitize all HTML before rendering
  - Define an allowlist policy (constrain tags/attrs)
- Tests:
  - New unit tests: `tests/unit/html-sanitization.test.ts` with XSS vectors and allowed HTML samples
- Acceptance:
  - All dynamic HTML flows sanitized, tests pass
  - Visual regressions validated in email previews
- Risk/rollback:
  - Medium. If preview fidelity drops, relax allowlist gradually; never remove sanitization

5. Validate middleware matcher configuration

- Files: `middleware.ts`
- Problem: Matcher tail appears truncated; may miss intended routes
- Changes:
  - Ensure matcher covers all app pages and `/api` routes while excluding static assets and OAuth/system routes handled in code
  - Example baseline:
    - `export const config = { matcher: ["/(.*)"] }` with in-code filtering of static/system routes already present
- Tests:
  - Manual verification: check protected route redirects and API 401/403 under role scenarios
- Acceptance:
  - Middleware consistently executes for intended routes
- Risk/rollback:
  - Low. Keep previous matcher snippet as fallback

Additional critical (scope-aligned) items

- Production logging policy and console cleanup
  - Problem: Console logging in app code risks sensitive data exposure in production.
  - Changes: Remove `console.*` from application codepaths; add ESLint rule to disallow `console.*` in production builds; route logs through structured logger with redaction and env-gated transports only.
  - Tests/Acceptance: CI fails on console usage; prod build free of console statements; structured logs verified in staging.

- Targeted test coverage uplift (workload and billing flows)
  - Focus: Assignments lifecycle, workload metrics, time-entry → billing generation (filters/consolidation), billing approvals/status transitions, permissions paths per role.
  - Set initial coverage gates for these modules (e.g., 60–70% now; raise over time).
  - Acceptance: CI coverage thresholds met; critical E2E flows (payroll workload, billing) green.

---

### P1 – High Priority

6. Re-enable DataLoader link in Apollo client

- Files: `lib/apollo/clients/client-factory.ts`
- Problem: DataLoader link is disabled, removing batching/dedup benefits
- Changes:
  - Restore `dataLoaderLink` in chain: `errorLink → complexityLink → retryLink → dataLoaderLink → authLink → httpLink`
  - Add simple metrics log for batched requests (dev only)
- Tests:
  - Smoke tests for query batching; optional integration benchmark in `tests/integration/performance/`
- Acceptance:
  - No auth/error regressions; fewer duplicate requests under typical loads

7. Consolidate duplicate validation helper

- Files:
  - `shared/validation.ts`
  - `lib/shared/validation.ts`
  - Canonical: `lib/validation/schemas.ts` (already comprehensive)
- Problem: DRY violation; risk of divergent behavior
- Changes:
  - Remove duplicated helpers; re-export compatibility shim if needed
  - Update imports across codebase to canonical module
- Tests:
  - Type-check and run all API route tests that rely on validation
- Acceptance:
  - Single source of truth for validation; no runtime changes in behavior

8. Ensure server Apollo usage in all API routes

- Files: all under `app/api/**/route.ts`
- Problem: Some routes may import `clientApolloClient`
- Changes:
  - Replace with `serverApolloClient` where used server-side
  - Add lint rule or codemod guard in docs to prevent regressions
- Tests:
  - Build + smoke tests; targeted API route tests

9. Navigation consolidation to a single, role-aware system
10. Minimize inline GraphQL; standardize on generated operations

- Finding: ~238 `gql`` occurrences across ~55 files, including hooks and API routes (e.g.,`domains/billing/hooks/use-optimized-analytics.ts`,`app/api/billing/tier{1,2,3}/generate/route.ts`,`lib/permissions/\*`).
- Policy: Prefer `.graphql` files with codegen-generated documents/types per domain; avoid inline `gql`` except for small admin-only ops in tooling.
- Changes:
  - Migrate inline queries/mutations in API routes and hooks to domain `.graphql` files under `domains/**/graphql/*.graphql`.
  - Re-run codegen; import typed documents from `domains/**/graphql/generated`.
  - For admin-only maintenance (e.g., cleanup scripts), document and isolate exceptions.
- Tests/Acceptance:
  - Build + codegen succeed; no runtime query name collisions; type-safety preserved.
  - Grep shows significant reduction in `gql`` usage in app/runtime code.
    - Lint rule added to discourage inline `gql`` in TS/TSX (use `.graphql` + codegen).
    - Acceptance: CI lint passes with 0 violations; PRs moving remaining inline ops to `.graphql` merged.

11. Stabilize billing GraphQL documents for codegen

- Finding: Codegen fails in billing docs due to duplicate operation names and schema mismatches (e.g., wrong scalar types, non-existent fields like `billingItems_aggregate`, custom `_if/_then/_else` filters).
- Changes:
  - Ensure unique operation names across `domains/billing/graphql/*.graphql` (rename duplicates like `GetPayrollBillingStatus`, `GetEfficiencyAnalytics`).
  - Fix invalid fields to match schema (use `billingItemsAggregate` instead of `billingItems_aggregate`; remove `_if/_then/_else`; correct variable types like `timestamp` vs `timestamptz`; correct enum types for roles).
  - Validate each query against introspected schema before enabling codegen.
- Tests/Acceptance:
  - `pnpm run codegen` completes for billing domain; no validation errors; generated types compile.

9. Navigation consolidation to a single, role-aware system

- Problem: Dual navigation patterns create inconsistency and confusion.
- Changes: Choose a single navigation component/system; unify active state and permission visibility logic; keep breadcrumbs as secondary aids.
- Tests/Acceptance: All dashboard pages use the unified nav; permissions respected; breadcrumbs remain consistent.

---

### P2 – Medium Priority

9. Split advanced scheduler into submodules

- Files: `domains/payrolls/components/advanced-payroll-scheduler.tsx` (>2.5k LOC)
- Problem: Maintainability risk and cognitive load
- Changes:
  - Extract: header, calendar/timeline, staff assignments, right/left panels, network hooks, and utility selectors
  - Keep existing public API/signature and feature flags for a shadow run if needed
- Tests:
  - Keep existing protection tests green (`tests/protection-suites/advanced-scheduler-protection.test.tsx`)
- Acceptance:
  - No behavioral change; size per file reduced to <500 LOC target

10. Global breadcrumbs/back consistency

- Files: app route pages lacking breadcrumbs
- Changes:
  - Introduce shared breadcrumb/back component
  - Ensure all dashboard pages include consistent navigation aids
- Tests:
  - Visual/manual verification; smoke e2e on main flows

11. Workload KPIs and SLA metrics

- Changes: Add SLA thresholds (e.g., processing time before EFT), WIP aging, capacity utilization; expose in workload dashboards and reports.
- Tests/Acceptance: Calculations unit-tested; dashboards show correct metrics for sample datasets; thresholds configurable.

12. Billing generation idempotency and error handling

- Changes: Ensure idempotent time-entry → billing item creation (dedup keys), robust partial-failure handling, and clear audit/logging for retry paths.
- Tests/Acceptance: Re-running generation with identical inputs does not duplicate items; failures reported with actionable errors; audit entries created.

---

### P3 – Long-Term / Ongoing

11. Hasura metadata and GraphQL alignment checks

- Steps:
  - Pull/apply metadata; run schema introspection; regenerate types
  - Audit queries/mutations selection sets versus role permissions (consultant vs manager)
  - Fix any mismatches; minimize selection sets to necessary fields only

12. Audit logging sinks (file/remote) and retention

- Files: `lib/logging/enterprise-logger.ts`, `lib/audit/audit-logger.ts`
- Changes:
  - Implement file rotation and optional remote transport (env-gated)
  - Ensure audit logs are durable and queryable; respect SOC2 retention
- Tests:
  - Unit tests on log formatting and redaction; integration tests for audit mutation path

---

### Implementation Checklist (per change)

For each item above:

1. Edit code and add tests
2. Run locally
   - pnpm install
   - pnpm codegen
   - pnpm type-check (or pnpm build)
   - pnpm test
3. Verify Hasura GraphQL operations still pass (where applicable)
4. Manual QA of affected page/API
5. Update coverage gates for targeted modules as needed
6. Lint for console usage; ensure only warn/error are present in app code

---

### Concrete Task Breakdown

Task A – Fix UI permission guard (P0)

- Owner: Frontend
- Files: `components/auth/permission-guard.tsx`, tests/unit
- Commands:
  - pnpm test -w tests/unit/permission-guard.test.tsx
- Acceptance: All permutations pass; gated UI hidden for insufficient roles

Task B – Secure leave approval route (P0)

- Owner: Backend (API)
- Files: `app/api/leave/[id]/approve/route.ts`
- Steps:
  - Replace header role with Clerk session role (via existing `withAuthParams` session)
  - Add manager relationship guard using `session.databaseId` vs `leave.employee.manager.id`
- Tests: `tests/integration/api/leave-approve-permissions.test.ts`
- Acceptance: 403/200 per role; no spoofing via headers

Task C – Combined bulk upload fixes (P0)

- Owner: Backend (API)
- Files: `app/api/bulk-upload/combined/route.ts`
- Steps:
  - Switch to camelCase GraphQL vars (e.g., `clientId`, `cycleId`, `dateTypeId`, `dateValue`, `primaryConsultantUserId`, `backupConsultantUserId`, `managerUserId`, `processingTime`, `processingDaysBeforeEft`, `employeeCount`, `payrollSystem`) and `serverApolloClient`
  - Update tests
- Acceptance: Successful insertion; types and variables aligned

Task D – HTML sanitization (P0)

- Owner: Frontend
- Files: chart + email components
- Steps:
  - Add `isomorphic-dompurify` and sanitize inputs
  - Write tests for XSS payloads
- Commands:
  - pnpm add isomorphic-dompurify
  - pnpm test -w tests/unit/html-sanitization.test.ts
- Acceptance: No XSS; previews still render correctly

Task E – Middleware matcher verification (P0)

- Owner: Platform
- Files: `middleware.ts`
- Steps:
  - Ensure correct `config.matcher`; keep runtime guards for static/system
- Acceptance: Guard executes for all intended routes and APIs

Task F – Re-enable DataLoader link (P1)

- Owner: Platform
- Files: `lib/apollo/clients/client-factory.ts`
- Steps:
  - Reinstate link order with `dataLoaderLink`
  - Light logging for batching in dev
- Acceptance: No auth/error regressions; fewer duplicate requests

Task G – Validation helper consolidation (P1)

- Owner: Platform
- Files: `shared/validation.ts`, `lib/shared/validation.ts`, `lib/validation/schemas.ts`
- Steps:
  - Choose canonical; remove duplicate; update imports
- Acceptance: Single source; builds and tests pass

Task H – Server Apollo across APIs (P1)

- Owner: Platform
- Steps:
  - Search for `clientApolloClient` usage in `app/api/**`, replace with `serverApolloClient`
- Acceptance: No client Apollo on server; build/tests pass

Task I – Scheduler split (P2)

- Owner: Frontend
- Files: `domains/payrolls/components/advanced-payroll-scheduler.tsx`
- Steps:
  - Extract to subcomponents; keep external behavior identical
- Acceptance: Protection tests remain green; per-file LOC reduced

Task J – Breadcrumbs/back (P2)

- Owner: Frontend
- Steps:
  - Add shared component; apply to pages missing breadcrumbs or back behavior
- Acceptance: Consistent nav on all dashboard pages

Task K – Navigation consolidation (P1)

- Owner: Frontend
- Files: navigation components in `components/` and any layout using them
- Steps:
  - Select final nav system; migrate all pages; unify permission visibility and active-state logic
- Acceptance: Single nav everywhere; permissions respected; breadcrumbs remain consistent

Task L – Billing generation idempotency (P2)

- Owner: Backend (API) + Frontend (UI flows)
- Files: `app/api/billing/generate-from-time/route.ts`, billing generation UIs
- Steps:
  - Implement idempotency keys; add retry-safe behavior; improve error surfaces and audit logs
- Acceptance: No duplicate billing items on reruns; actionable error messages; audit trail present

Task M – Workload KPIs & reporting (P2)

- Owner: Analytics/Frontend
- Files: workload dashboards, reporting hooks/components
- Steps:
  - Add SLA, WIP aging, capacity metrics; thresholds configurable
- Acceptance: Metrics validated with sample datasets; unit tests for calculations

Task N – Production logging policy & console cleanup (P0)

- Owner: Platform
- Files: eslint config, logger modules; codebase-wide
- Steps:
  - Remove `console.*` from app code; add lint rule to block (allow only warn/error); ensure structured logger used with redaction
- Acceptance: CI fails on `console.*`; staging shows structured logs only

Task O – Targeted test coverage uplift (P0)

- Owner: QA/Platform
- Files: tests under `tests/{integration,e2e,unit}`
- Steps:
  - Add suites for assignments, workload metrics, time-entry→billing, billing approvals/status, and permission paths; set coverage thresholds for these modules
- Acceptance: Coverage gates met; E2E green for workload/billing flows

Note: Apollo DataLoader link restored in client chain to reduce duplicate requests; monitor for regressions.

---

### Rollout & Safety

- Feature flags where behavior changes risk UX
- Deploy to staging; run E2E suites (payroll, billing)
- Monitor logs for permission/auth failures and GraphQL errors
- Rollback plan: revert per-task PRs if regressions detected

---

### References (files)

- UI Guard: `components/auth/permission-guard.tsx`
- Leave API: `app/api/leave/[id]/approve/route.ts`
- Bulk Upload (combined): `app/api/bulk-upload/combined/route.ts`
- Apollo Client factory: `lib/apollo/clients/client-factory.ts`
- Validation schemas: `lib/validation/schemas.ts`
- Middleware: `middleware.ts`
- HTML render points: `components/ui/chart.tsx`, `domains/email/components/*`

---

### Success Criteria (overall)

- No role elevation via headers or UI guard logic
- All GraphQL mutations/queries use correct casing and server clients in APIs
- No un-sanitized HTML rendering paths remain
- DataLoader link restored without regressions
- Scheduler maintainability improves without behavior changes
- Breadcrumbs present and consistent
- All unit/integration/E2E tests pass in CI

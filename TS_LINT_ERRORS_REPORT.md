# TypeScript & Lint Error Report

**Generated:** 2025-06-27T01:10:34.094Z

## 📊 Executive Summary

| Metric | Count |
|--------|-------|
| **Total Errors** | 132 |
| **Total Warnings** | 0 |
| TypeScript Errors | 132 |
| ESLint Errors | 0 |
| ESLint Warnings | 0 |
| Files Affected | 84 |

## 🚨 TypeScript Errors

### `app/(dashboard)/admin/permissions/page.tsx`

**Line 12:34** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

**Line 37:35** - `TS7006`
> Parameter 'u' implicitly has an 'any' type.

**Line 140:31** - `TS7006`
> Parameter 'user' implicitly has an 'any' type.

### `app/(dashboard)/clients/[id]/page.tsx`

**Line 89:8** - `TS2307`
> Cannot find module '@/domains/clients/graphql/generated/graphql' or its corresponding type declarations.

**Line 90:46** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/clients/new/page.tsx`

**Line 32:8** - `TS2307`
> Cannot find module '@/domains/clients/graphql/generated/graphql' or its corresponding type declarations.

**Line 33:39** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 34:41** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/clients/page.tsx`

**Line 53:82** - `TS2307`
> Cannot find module '@/domains/clients/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/dashboard/page.tsx`

**Line 14:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 15:40** - `TS2307`
> Cannot find module '@/domains/clients/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/payrolls/[id]/page.tsx`

**Line 76:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 79:42** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 80:45** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 81:41** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

**Line 82:49** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 83:46** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/payrolls/new/page.tsx`

**Line 28:69** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 29:42** - `TS2307`
> Cannot find module '@/domains/clients/graphql/generated/graphql' or its corresponding type declarations.

**Line 30:45** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/payrolls/page.tsx`

**Line 63:37** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/profile/page.tsx`

**Line 22:48** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/security/audit/page.tsx`

**Line 44:8** - `TS2307`
> Cannot find module '@/domains/audit/graphql/generated/graphql' or its corresponding type declarations.

**Line 45:25** - `TS2307`
> Cannot find module '@/shared/types/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/security/page.tsx`

**Line 38:8** - `TS2307`
> Cannot find module '@/domains/audit/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/security/reports/page.tsx`

**Line 39:42** - `TS2307`
> Cannot find module '@/domains/audit/graphql/generated/graphql' or its corresponding type declarations.

### `app/(dashboard)/settings/account/page.tsx`

**Line 50:3** - `TS2305`
> Module '"@/domains/users"' has no exported member 'GetUserProfileSettingsDocument'.

**Line 51:3** - `TS2305`
> Module '"@/domains/users"' has no exported member 'UpdateUserProfileDocument'.

### `app/(dashboard)/staff/[id]/page.tsx`

**Line 74:8** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

**Line 82:8** - `TS2307`
> Cannot find module '@/domains/permissions/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/audit/compliance-report/route.ts`

**Line 8:8** - `TS2307`
> Cannot find module '@/domains/audit/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/auth/log-event/route.ts`

**Line 6:41** - `TS2307`
> Cannot find module '@/domains/audit/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/cron/generate-batch/route.ts`

**Line 8:51** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/cron/update-payroll-dates/route.ts`

**Line 6:10** - `TS2305`
> Module '"@/domains/payrolls"' has no exported member 'UpdatePayrollStatusDocument'.

**Line 7:51** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/developer/clean-all-dates/route.ts`

**Line 5:46** - `TS2307`
> Cannot find module '@/domains/audit/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/developer/regenerate-single-dates/route.ts`

**Line 6:51** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/developer/route.ts`

**Line 7:51** - `TS2307`
> Cannot find module '@/domains/clients/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/invitations/accept/route.ts`

**Line 10:8** - `TS2307`
> Cannot find module '@/domains/auth/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/invitations/create/route.ts`

**Line 6:89** - `TS2307`
> Cannot find module '@/domains/auth/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/invitations/resend/route.ts`

**Line 10:8** - `TS2307`
> Cannot find module '@/domains/auth/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/invitations/route.ts`

**Line 9:8** - `TS2307`
> Cannot find module '@/domains/auth/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/payroll-dates/[payrollId]/route.ts`

**Line 7:41** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/payrolls/[id]/route.ts`

**Line 5:10** - `TS2305`
> Module '"@/domains/payrolls"' has no exported member 'GetPayrollByIdDocument'.

### `app/api/payrolls/route.ts`

**Line 5:37** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/payrolls/schedule/route.ts`

**Line 5:51** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/signed/payroll-operations/route.ts`

**Line 9:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/staff/create/route.ts`

**Line 238:11** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/staff/delete/route.ts`

**Line 7:3** - `TS2305`
> Module '"@/domains/users"' has no exported member 'GetUserForDeletionDocument'.

**Line 8:3** - `TS2305`
> Module '"@/domains/users"' has no exported member 'GetCurrentUserRoleDocument'.

**Line 9:3** - `TS2305`
> Module '"@/domains/users"' has no exported member 'DeactivateUserDocument'.

**Line 10:3** - `TS2305`
> Module '"@/domains/users"' has no exported member 'HardDeleteUserDocument'.

### `app/api/staff/update-role/route.ts`

**Line 11:8** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/users/[id]/route.ts`

**Line 13:8** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/users/route.ts`

**Line 7:8** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `app/api/webhooks/clerk/route.ts`

**Line 7:49** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `components/admin/permission-override-manager.tsx`

**Line 21:8** - `TS2307`
> Cannot find module '@/domains/permissions/graphql/generated/graphql' or its corresponding type declarations.

**Line 52:38** - `TS2304`
> Cannot find name 'useQuery'.

**Line 52:47** - `TS2552`
> Cannot find name 'GetUserPermissionOverridesDocument'. Did you mean 'useGetUserPermissionOverridesQuery'?

**Line 57:52** - `TS2304`
> Cannot find name 'useMutation'.

**Line 57:64** - `TS2304`
> Cannot find name 'GrantUserPermissionDocument'.

**Line 58:58** - `TS2304`
> Cannot find name 'useMutation'.

**Line 58:70** - `TS2304`
> Cannot find name 'RestrictUserPermissionDocument'.

**Line 59:51** - `TS2304`
> Cannot find name 'useMutation'.

**Line 59:63** - `TS2304`
> Cannot find name 'RemovePermissionOverrideDocument'.

**Line 60:54** - `TS2304`
> Cannot find name 'useMutation'.

**Line 60:66** - `TS2304`
> Cannot find name 'ExtendPermissionExpirationDocument'.

**Line 140:44** - `TS7006`
> Parameter 'o' implicitly has an 'any' type.

**Line 143:45** - `TS7006`
> Parameter 'o' implicitly has an 'any' type.

**Line 287:37** - `TS7006`
> Parameter 'override' implicitly has an 'any' type.

**Line 363:38** - `TS7006`
> Parameter 'override' implicitly has an 'any' type.

### `components/dev/actor-token-manager.tsx`

**Line 28:47** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `components/export-csv.tsx`

**Line 11:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `components/export-pdf.tsx`

**Line 12:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `components/real-time-updates.tsx`

**Line 8:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `components/refresh-button.tsx`

**Line 13:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `components/staff-updates-listener.tsx`

**Line 8:8** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `components/urgent-alerts.tsx`

**Line 9:49** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/audit/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/auth/hooks/use-invitation-acceptance.ts`

**Line 7:8** - `TS2307`
> Cannot find module '../graphql/generated/graphql' or its corresponding type declarations.

### `domains/auth/hooks/use-invitation-management.ts`

**Line 9:8** - `TS2307`
> Cannot find module '../graphql/generated/graphql' or its corresponding type declarations.

**Line 42:7** - `TS2304`
> Cannot find name 'useQuery'.

**Line 42:16** - `TS2304`
> Cannot find name 'CachedDocument'.

**Line 53:7** - `TS2304`
> Cannot find name 'useQuery'.

**Line 53:16** - `TS2304`
> Cannot find name 'CachedDocument'.

### `domains/auth/hooks/use-invitation-resend.ts`

**Line 6:8** - `TS2307`
> Cannot find module '../graphql/generated/graphql' or its corresponding type declarations.

### `domains/auth/index.ts`

**Line 33:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/billing/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/clients/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/external-systems/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/leave/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/notes/components/notes-list.tsx`

**Line 37:8** - `TS2307`
> Cannot find module '@/domains/notes/graphql/generated/graphql' or its corresponding type declarations.

### `domains/notes/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/advanced-payroll-scheduler.tsx`

**Line 52:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 992:42** - `TS7006`
> Parameter 'total' implicitly has an 'any' type.

**Line 992:49** - `TS7006`
> Parameter 'payroll' implicitly has an 'any' type.

### `domains/payrolls/components/edit-payroll-dialog.tsx`

**Line 23:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/generate-missing-dates-button.tsx`

**Line 15:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/notes-modal.tsx`

**Line 8:48** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/payroll-dates-view.tsx`

**Line 52:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/payroll-list-card.tsx`

**Line 36:37** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/payroll-schedule.tsx`

**Line 25:44** - `TS2307`
> Cannot find module '../graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/payroll-subscription.tsx`

**Line 5:40** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/payroll-version-history.tsx`

**Line 12:40** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/payrolls-missing-dates.tsx`

**Line 32:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/regenerate-dates.tsx`

**Line 14:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/components/upcoming-payrolls.tsx`

**Line 19:49** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/payrolls/services/payroll.service.ts`

**Line 17:8** - `TS2307`
> Cannot find module '../graphql/generated/graphql' or its corresponding type declarations.

### `domains/permissions/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/users/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `domains/work-schedule/index.ts`

**Line 35:15** - `TS2307`
> Cannot find module './graphql/generated/graphql' or its corresponding type declarations.

### `hooks/use-cache-invalidation.ts`

**Line 4:37** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `hooks/use-current-user.ts`

**Line 5:40** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `hooks/use-payroll-creation.ts`

**Line 8:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `hooks/use-payroll-versioning.ts`

**Line 10:8** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

**Line 11:40** - `TS2307`
> Cannot find module '@/domains/notes/graphql/generated/graphql' or its corresponding type declarations.

### `hooks/use-user-management.ts`

**Line 14:8** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `hooks/use-user-role.ts`

**Line 8:8** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

### `lib/apollo/admin-operations.ts`

**Line 19:8** - `TS2307`
> Cannot find module '@/domains/users/graphql/generated/graphql' or its corresponding type declarations.

**Line 20:46** - `TS2307`
> Cannot find module '@/domains/payrolls/graphql/generated/graphql' or its corresponding type declarations.

### `lib/auth/enhanced-auth-context.tsx`

**Line 9:8** - `TS2307`
> Cannot find module '@/domains/permissions/graphql/generated/graphql' or its corresponding type declarations.

**Line 126:7** - `TS2552`
> Cannot find name 'useQuery'. Did you mean 'useUser'?

**Line 126:16** - `TS2552`
> Cannot find name 'GetUserEffectivePermissionsDocument'. Did you mean 'useGetUserEffectivePermissionsQuery'?

**Line 136:7** - `TS2552`
> Cannot find name 'useQuery'. Did you mean 'useUser'?

**Line 136:16** - `TS2552`
> Cannot find name 'GetUserPermissionOverridesDocument'. Did you mean 'useGetUserPermissionOverridesQuery'?

**Line 152:53** - `TS7006`
> Parameter 'override' implicitly has an 'any' type.

### `lib/dev/examples/graceful-clients-list.tsx`

**Line 43:36** - `TS2307`
> Cannot find module '@/domains/clients/graphql/generated/graphql' or its corresponding type declarations.

### `lib/security/audit/logger.ts`

**Line 18:8** - `TS2307`
> Cannot find module '@/domains/audit/graphql/generated/graphql' or its corresponding type declarations.

### `shared/index.ts`

**Line 14:15** - `TS2307`
> Cannot find module './types/generated' or its corresponding type declarations.

### `shared/types/index.ts`

**Line 28:15** - `TS2307`
> Cannot find module './generated/' or its corresponding type declarations.

**Line 36:21** - `TS2307`
> Cannot find module './generated/' or its corresponding type declarations.

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
- [ ] Phase 5: Address TypeScript errors (132 issues)

---

**Next Steps:**
1. Review the [Lint Remediation Plan](./LINT_REMEDIATION_PLAN.md)
2. Run `pnpm lint:fix-dry-run` to preview automated fixes
3. Execute fixes in phases with proper testing
4. Re-run this report to track progress: `pnpm report:errors`

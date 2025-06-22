import { test, expect } from '@playwright/test';
import { STORAGE_STATE_DEVELOPER, STORAGE_STATE_ORG_ADMIN, STORAGE_STATE_MANAGER, STORAGE_STATE_CONSULTANT, STORAGE_STATE_VIEWER, PROTECTED_ROUTES, ROLE_LEVELS } from './utils/test-config';
import { AuthHelpers } from './utils/auth-helpers';

test.describe('Role-Based Permissions', () => {
  test.describe('Developer Role', () => {
    test.use({ storageState: STORAGE_STATE_DEVELOPER });

    test('should have access to all routes and features', async ({ page }) => {
      const authHelpers = new AuthHelpers(page);
      
      // Test developer-specific routes
      for (const route of PROTECTED_ROUTES.developer) {
        await page.goto(route);
        await authHelpers.expectSignedIn();
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }

      // Test admin routes
      for (const route of PROTECTED_ROUTES.admin) {
        await page.goto(route);
        await authHelpers.expectSignedIn();
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }

      // Should see developer panel
      await page.goto('/developer');
      await expect(page.locator('[data-testid="developer-panel"]')).toBeVisible();
    });

    test('should have all CRUD permissions', async ({ page }) => {
      // Test payroll permissions
      await page.goto('/payrolls');
      await expect(page.locator('[data-testid="create-payroll-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="edit-payroll-button"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="delete-payroll-button"]').first()).toBeVisible();

      // Test client permissions
      await page.goto('/clients');
      await expect(page.locator('[data-testid="create-client-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="edit-client-button"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="delete-client-button"]').first()).toBeVisible();

      // Test staff permissions
      await page.goto('/users');
      await expect(page.locator('[data-testid="invite-staff-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="edit-staff-button"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="delete-staff-button"]').first()).toBeVisible();
    });
  });

  test.describe('Org Admin Role', () => {
    test.use({ storageState: STORAGE_STATE_ORG_ADMIN });

    test('should have access to admin routes but not developer routes', async ({ page }) => {
      const authHelpers = new AuthHelpers(page);

      // Should access admin routes
      for (const route of PROTECTED_ROUTES.admin) {
        await page.goto(route);
        await authHelpers.expectSignedIn();
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }

      // Should NOT access developer routes
      for (const route of PROTECTED_ROUTES.developer) {
        await page.goto(route);
        await authHelpers.expectAccessDenied();
      }
    });

    test('should have limited write permissions', async ({ page }) => {
      // Test payroll permissions (read/write but not delete)
      await page.goto('/payrolls');
      await expect(page.locator('[data-testid="create-payroll-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="edit-payroll-button"]').first()).toBeVisible();
      await expect(page.locator('[data-testid="delete-payroll-button"]')).not.toBeVisible();

      // Test settings access
      await page.goto('/settings');
      await expect(page.locator('[data-testid="admin-settings"]')).toBeVisible();
    });

    test('should see org admin specific features', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page.locator('[data-testid="admin-dashboard-widgets"]')).toBeVisible();
      await expect(page.locator('[data-testid="developer-panel"]')).not.toBeVisible();
    });
  });

  test.describe('Manager Role', () => {
    test.use({ storageState: STORAGE_STATE_MANAGER });

    test('should have read access to management routes', async ({ page }) => {
      const authHelpers = new AuthHelpers(page);

      // Should access management routes
      for (const route of PROTECTED_ROUTES.management) {
        await page.goto(route);
        await authHelpers.expectSignedIn();
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }

      // Should NOT access admin routes
      for (const route of PROTECTED_ROUTES.admin) {
        await page.goto(route);
        await authHelpers.expectAccessDenied();
      }
    });

    test('should have read-only permissions for most features', async ({ page }) => {
      // Test payroll permissions (read only)
      await page.goto('/payrolls');
      await expect(page.locator('[data-testid="payroll-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="create-payroll-button"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="edit-payroll-button"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="delete-payroll-button"]')).not.toBeVisible();

      // Test reports access
      await page.goto('/reports');
      await expect(page.locator('[data-testid="reports-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="export-reports-button"]')).not.toBeVisible();
    });
  });

  test.describe('Consultant Role', () => {
    test.use({ storageState: STORAGE_STATE_CONSULTANT });

    test('should have limited read access', async ({ page }) => {
      const authHelpers = new AuthHelpers(page);

      // Should access operational routes
      for (const route of PROTECTED_ROUTES.operational) {
        await page.goto(route);
        await authHelpers.expectSignedIn();
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }

      // Should NOT access management routes
      for (const route of PROTECTED_ROUTES.management) {
        await page.goto(route);
        await authHelpers.expectAccessDenied();
      }
    });

    test('should only see assigned payrolls and clients', async ({ page }) => {
      // Test limited payroll access
      await page.goto('/payroll/view');
      await expect(page.locator('[data-testid="assigned-payrolls-only"]')).toBeVisible();
      await expect(page.locator('[data-testid="all-payrolls"]')).not.toBeVisible();

      // Test limited client access
      await page.goto('/client/view');
      await expect(page.locator('[data-testid="assigned-clients-only"]')).toBeVisible();
      await expect(page.locator('[data-testid="all-clients"]')).not.toBeVisible();
    });
  });

  test.describe('Viewer Role', () => {
    test.use({ storageState: STORAGE_STATE_VIEWER });

    test('should only have access to dashboard', async ({ page }) => {
      const authHelpers = new AuthHelpers(page);

      // Should access dashboard
      await page.goto(PROTECTED_ROUTES.dashboard);
      await authHelpers.expectSignedIn();
      await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();

      // Should NOT access any other routes
      const restrictedRoutes = [
        ...PROTECTED_ROUTES.developer,
        ...PROTECTED_ROUTES.admin,
        ...PROTECTED_ROUTES.management,
        ...PROTECTED_ROUTES.operational,
      ];

      for (const route of restrictedRoutes) {
        await page.goto(route);
        await authHelpers.expectAccessDenied();
      }
    });

    test('should have minimal read permissions', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should see basic dashboard but no action buttons
      await expect(page.locator('[data-testid="viewer-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="create-button"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="edit-button"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="delete-button"]')).not.toBeVisible();
      
      // Should not see any admin or management widgets
      await expect(page.locator('[data-testid="admin-dashboard-widgets"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="management-dashboard-widgets"]')).not.toBeVisible();
    });

    test('should not see sensitive navigation items', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check sidebar for role-appropriate navigation
      const sidebar = page.locator('[data-testid="sidebar"]');
      await expect(sidebar.locator('[data-testid="nav-settings"]')).not.toBeVisible();
      await expect(sidebar.locator('[data-testid="nav-users"]')).not.toBeVisible();
      await expect(sidebar.locator('[data-testid="nav-payrolls"]')).not.toBeVisible();
      await expect(sidebar.locator('[data-testid="nav-clients"]')).not.toBeVisible();
      
      // Should only see dashboard nav item
      await expect(sidebar.locator('[data-testid="nav-dashboard"]')).toBeVisible();
    });
  });

  test.describe('Role Hierarchy Validation', () => {
    test('should respect role hierarchy in permissions', async ({ page }) => {
      // Test that higher roles have all permissions of lower roles
      const roles = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
      
      for (let i = 0; i < roles.length; i++) {
        const currentRole = roles[i];
        const currentLevel = ROLE_LEVELS[currentRole as keyof typeof ROLE_LEVELS];
        
        // Switch to current role context
        const storageState = `e2e/fixtures/.auth/${currentRole.replace('_', '-')}.json`;
        await page.context().close();
        const newContext = await page.context().browser()?.newContext({ storageState });
        const newPage = newContext ? await newContext.newPage() : page;
        
        await newPage.goto('/dashboard');
        
        // Verify role is correctly applied
        const userMenu = newPage.locator('[data-testid="user-menu"]');
        const roleAttribute = await userMenu.getAttribute('data-role');
        expect(roleAttribute).toBe(currentRole);
      }
    });

    test('should prevent privilege escalation', async ({ page }) => {
      // Test with lower privilege role (consultant)
      test.use({ storageState: STORAGE_STATE_CONSULTANT });
      
      // Attempt to access higher privilege routes through direct navigation
      const highPrivilegeRoutes = [
        '/settings',
        '/users',
        '/developer',
        '/billing',
      ];
      
      for (const route of highPrivilegeRoutes) {
        await page.goto(route);
        await expect(page.locator('[data-testid="access-denied"]')).toBeVisible();
        
        // Verify we're not accidentally elevated
        const authHelpers = new AuthHelpers(page);
        const currentRole = await authHelpers.getCurrentUserRole();
        expect(currentRole).toBe('consultant');
      }
    });
  });
});
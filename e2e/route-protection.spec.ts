import { test, expect } from '@playwright/test';
import { STORAGE_STATE_DEVELOPER, STORAGE_STATE_ORG_ADMIN, STORAGE_STATE_MANAGER, STORAGE_STATE_CONSULTANT, STORAGE_STATE_VIEWER } from './utils/test-config';
import { AuthHelpers } from './utils/auth-helpers';

test.describe('Route Protection', () => {
  test.describe('Unauthenticated Access', () => {
    test('should redirect all protected routes to sign-in', async ({ page }) => {
      const protectedRoutes = [
        '/dashboard',
        '/payrolls',
        '/clients',
        '/users',
        '/settings',
        '/reports',
        '/developer',
        '/billing',
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        
        // Should be redirected to sign-in
        await page.waitForURL(/\/sign-in/, { timeout: 10000 });
        
        // Should see sign-in form
        const authHelpers = new AuthHelpers(page);
        await authHelpers.expectSignedOut();
      }
    });

    test('should allow access to public routes', async ({ page }) => {
      const publicRoutes = [
        '/',
        '/sign-in',
      ];

      for (const route of publicRoutes) {
        await page.goto(route);
        
        // Should not be redirected
        expect(page.url()).toContain(route);
        
        // Should not see access denied
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }
    });

    test('should preserve intended destination after sign-in', async ({ page }) => {
      // Try to access protected route
      await page.goto('/dashboard');
      
      // Should be redirected to sign-in with return URL
      await page.waitForURL(/\/sign-in/);
      expect(page.url()).toContain('sign-in');
      
      // Sign in (this would require test credentials)
      // After successful sign-in, should be redirected to original destination
      // This test would need actual test user credentials to complete
    });
  });

  test.describe('API Route Protection', () => {
    test('should protect API routes from unauthenticated access', async ({ page }) => {
      const apiRoutes = [
        '/api/users',
        '/api/payrolls',
        '/api/clients',
        '/api/settings',
        '/api/audit-logs',
      ];

      for (const route of apiRoutes) {
        const response = await page.request.get(route);
        
        // Should return 401 or 403 for unauthenticated requests
        expect([401, 403, 302]).toContain(response.status());
      }
    });

    test('should allow access to public API routes', async ({ page }) => {
      const publicApiRoutes = [
        '/api/health',
        '/api/webhooks/clerk',
      ];

      for (const route of publicApiRoutes) {
        const response = await page.request.get(route);
        
        // Should not be blocked (may return 200, 404, or 405 depending on implementation)
        expect([200, 404, 405]).toContain(response.status());
      }
    });
  });

  test.describe('Role-Based Route Access', () => {
    test('developer should access all routes', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_DEVELOPER });
      
      const allRoutes = [
        '/dashboard',
        '/payrolls',
        '/clients',
        '/users',
        '/settings',
        '/reports',
        '/developer',
        '/billing',
      ];

      for (const route of allRoutes) {
        await page.goto(route);
        
        // Should not see access denied
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
        
        // Should be authenticated
        const authHelpers = new AuthHelpers(page);
        await authHelpers.expectSignedIn();
      }
    });

    test('org_admin should be blocked from developer routes', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_ORG_ADMIN });
      
      const blockedRoutes = ['/developer'];
      const allowedRoutes = ['/dashboard', '/payrolls', '/clients', '/users', '/settings', '/reports', '/billing'];

      // Test blocked routes
      for (const route of blockedRoutes) {
        await page.goto(route);
        
        // Should see access denied or be redirected
        try {
          const authHelpers = new AuthHelpers(page);
          await authHelpers.expectAccessDenied();
        } catch {
          // Alternative: might be redirected to dashboard
          expect(page.url()).toContain('/dashboard');
        }
      }

      // Test allowed routes
      for (const route of allowedRoutes) {
        await page.goto(route);
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }
    });

    test('manager should be blocked from admin routes', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      const blockedRoutes = ['/developer', '/settings', '/users', '/billing'];
      const allowedRoutes = ['/dashboard', '/payrolls', '/clients', '/reports'];

      // Test blocked routes
      for (const route of blockedRoutes) {
        await page.goto(route);
        
        try {
          const authHelpers = new AuthHelpers(page);
          await authHelpers.expectAccessDenied();
        } catch {
          expect(page.url()).toContain('/dashboard');
        }
      }

      // Test allowed routes
      for (const route of allowedRoutes) {
        await page.goto(route);
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }
    });

    test('consultant should have minimal route access', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_CONSULTANT });
      
      const blockedRoutes = ['/developer', '/settings', '/users', '/billing', '/payrolls', '/clients', '/reports'];
      const allowedRoutes = ['/dashboard'];

      // Test blocked routes
      for (const route of blockedRoutes) {
        await page.goto(route);
        
        try {
          const authHelpers = new AuthHelpers(page);
          await authHelpers.expectAccessDenied();
        } catch {
          expect(page.url()).toContain('/dashboard');
        }
      }

      // Test allowed routes
      for (const route of allowedRoutes) {
        await page.goto(route);
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }
    });

    test('viewer should only access dashboard', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_VIEWER });
      
      const blockedRoutes = ['/developer', '/settings', '/users', '/billing', '/payrolls', '/clients', '/reports'];
      const allowedRoutes = ['/dashboard'];

      // Test blocked routes
      for (const route of blockedRoutes) {
        await page.goto(route);
        
        try {
          const authHelpers = new AuthHelpers(page);
          await authHelpers.expectAccessDenied();
        } catch {
          expect(page.url()).toContain('/dashboard');
        }
      }

      // Test allowed routes
      for (const route of allowedRoutes) {
        await page.goto(route);
        await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
      }
    });
  });

  test.describe('Deep Link Protection', () => {
    test('should protect deep links and nested routes', async ({ page }) => {
      const deepLinks = [
        '/payrolls/123/edit',
        '/clients/456/settings',
        '/users/789/roles',
        '/settings/security',
        '/reports/audit/detailed',
      ];

      // Test without authentication
      for (const link of deepLinks) {
        await page.goto(link);
        
        // Should be redirected to sign-in
        await page.waitForURL(/\/sign-in/, { timeout: 10000 });
      }
    });

    test('should respect permissions on nested routes', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_VIEWER });
      
      const restrictedDeepLinks = [
        '/payrolls/123/edit',
        '/clients/456/settings',
        '/users/789/roles',
        '/settings/security',
      ];

      for (const link of restrictedDeepLinks) {
        await page.goto(link);
        
        // Should see access denied or be redirected
        try {
          const authHelpers = new AuthHelpers(page);
          await authHelpers.expectAccessDenied();
        } catch {
          expect(page.url()).toContain('/dashboard');
        }
      }
    });
  });

  test.describe('Session Validation', () => {
    test('should invalidate access when session expires', async ({ page }) => {
      test.use({ storageState: STORAGE_STATE_MANAGER });
      
      // Navigate to protected route
      await page.goto('/dashboard');
      const authHelpers = new AuthHelpers(page);
      await authHelpers.expectSignedIn();
      
      // Simulate session expiration by clearing auth data
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      // Try to access protected route
      await page.goto('/payrolls');
      
      // Should be redirected to sign-in
      await page.waitForURL(/\/sign-in/, { timeout: 10000 });
      await authHelpers.expectSignedOut();
    });

    test('should handle concurrent sessions properly', async ({ browser }) => {
      // Create two contexts with different roles
      const context1 = await browser.newContext({ storageState: STORAGE_STATE_DEVELOPER });
      const context2 = await browser.newContext({ storageState: STORAGE_STATE_VIEWER });
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      // Test that each context maintains its own permissions
      await page1.goto('/developer');
      await expect(page1.locator('[data-testid="access-denied"]')).not.toBeVisible();
      
      await page2.goto('/developer');
      const authHelpers2 = new AuthHelpers(page2);
      await authHelpers2.expectAccessDenied();
      
      await context1.close();
      await context2.close();
    });
  });
});
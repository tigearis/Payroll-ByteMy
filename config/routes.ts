// config/routes.ts - Centralized route configuration for middleware
import { createRouteMatcher } from "@clerk/nextjs/server";
import type { Role } from "@/lib/auth/permissions";

// ================================
// ROUTE MATCHERS BY ACCESS LEVEL
// ================================

export const routes = {
  // Public routes (no authentication required)
  public: createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/accept-invitation(.*)",
    "/api/clerk-webhooks(.*)",
    "/api/webhooks/clerk(.*)",
    "/_next(.*)",
    "/favicon.ico",
    "/dashboard(.*)",
  ]),

  // Developer-only routes (highest privilege level)
  developer: createRouteMatcher([
    "/developer(.*)",
    "/api/developer(.*)",
    "/api/dev(.*)",
  ]),

  // Admin routes (org_admin and above)
  admin: createRouteMatcher([
    "/admin(.*)",
    "/security(.*)",
    "/api/admin(.*)",
    "/api/audit(.*)",
  ]),

  // Manager routes (manager and above)
  manager: createRouteMatcher([
    "/staff(.*)",
    "/api/staff(.*)",
    "/invitations(.*)",
    "/api/invitations(.*)",
  ]),

  // General protected routes (all authenticated users)
  protected: createRouteMatcher([
    "/dashboard(.*)",
    "/clients(.*)",
    "/payrolls(.*)",
    "/payroll-schedule(.*)",
    "/calendar(.*)",
    "/profile(.*)",
    "/settings(.*)",
    "/ai-assistant(.*)",
    "/tax-calculator(.*)",
    "/jwt-test(.*)",
    "/onboarding(.*)",
    "/api/payrolls(.*)",
    "/api/payroll-dates(.*)",
    "/api/users(.*)",
    "/api/chat(.*)",
    "/api/sync-current-user(.*)",
    "/api/update-user-role(.*)",
    "/api/check-role(.*)",
    "/api/fix-oauth-user(.*)",
    "/api/fix-user-sync(.*)",
  ]),

  // Cron and system routes (internal/service routes)
  system: createRouteMatcher([
    "/api/cron(.*)",
    "/api/signed(.*)",
    "/api/commit-payroll-assignments(.*)",
    "/api/holidays(.*)",
  ]),
} as const;

// ================================
// ROLE REQUIREMENTS MAPPING
// ================================

export const routeRoleRequirements: Record<string, Role> = {
  // Developer-only access
  "/developer": "developer",
  "/api/developer": "developer",
  "/api/dev": "developer",

  // Admin access required
  "/admin": "org_admin",
  "/security": "org_admin",
  "/api/admin": "org_admin",
  "/api/audit": "org_admin",

  // Manager access required
  "/staff": "manager",
  "/api/staff": "manager",
  "/invitations": "manager",
  "/api/invitations": "manager",

  // All other protected routes - any authenticated user (consultant level and above)
  "/dashboard": "consultant",
  "/clients": "consultant",
  "/payrolls": "consultant",
} as const;

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Determines the minimum role required for a given route path
 * @param pathname - The request pathname
 * @returns The minimum role required, or null if route is public
 */
export function getRequiredRole(pathname: string): Role | null {
  // Check public routes first using simple pathname matching
  const isPublicRoute = [
    "/",
    "/sign-in",
    "/sign-up",
    "/accept-invitation",
    "/api/clerk-webhooks",
    "/api/webhooks/clerk",
    "/_next",
    "/favicon.ico",
  ].some(route => pathname === route || pathname.startsWith(route + "/"));

  if (isPublicRoute) {
    return null;
  }

  // Check specific role requirements
  for (const [routePrefix, requiredRole] of Object.entries(
    routeRoleRequirements
  )) {
    if (pathname.startsWith(routePrefix)) {
      return requiredRole;
    }
  }

  // Default to consultant level for any other protected route
  return "consultant";
}

/**
 * Checks if a route is protected (requires authentication)
 * @param pathname - The request pathname
 * @returns True if the route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  // Public routes don't require protection
  const isPublicRoute = [
    "/",
    "/sign-in",
    "/sign-up",
    "/accept-invitation",
    "/api/clerk-webhooks",
    "/api/webhooks/clerk",
    "/_next",
    "/favicon.ico",
  ].some(route => pathname === route || pathname.startsWith(route + "/"));

  if (isPublicRoute) {
    return false;
  }

  // System routes might have their own auth mechanisms
  const isSystemRoute = [
    "/api/cron",
    "/api/signed",
    "/api/commit-payroll-assignments",
    "/api/holidays",
  ].some(route => pathname.startsWith(route));

  if (isSystemRoute) {
    return false; // Let system routes handle their own auth
  }

  // Everything else is protected
  return true;
}

/**
 * Gets the access level category for a route
 * @param pathname - The request pathname
 * @returns The access level category
 */
export function getRouteCategory(pathname: string): keyof typeof routes {
  if (!isProtectedRoute(pathname)) return "public";

  if (
    pathname.startsWith("/developer") ||
    pathname.startsWith("/api/developer") ||
    pathname.startsWith("/api/dev")
  ) {
    return "developer";
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/audit")
  ) {
    return "admin";
  }

  if (
    pathname.startsWith("/staff") ||
    pathname.startsWith("/api/staff") ||
    pathname.startsWith("/invitations") ||
    pathname.startsWith("/api/invitations")
  ) {
    return "manager";
  }

  const isSystemRoute = [
    "/api/cron",
    "/api/signed",
    "/api/commit-payroll-assignments",
    "/api/holidays",
  ].some(route => pathname.startsWith(route));

  if (isSystemRoute) return "system";

  return "protected";
}

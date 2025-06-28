/**
 * Enterprise-grade authentication middleware for Payroll Matrix
 *
 * This middleware provides comprehensive security and audit logging for all routes
 * with SOC2 compliance, role-based access control, and intelligent response handling.
 *
 * Features:
 * - Centralized route configuration using /config/routes.ts
 * - Role-based access control with 5-tier hierarchy
 * - SOC2-compliant audit logging for all authentication events
 * - Smart response strategy (JSON for APIs, redirects for browser)
 * - Non-blocking audit performance with Promise-based logging
 * - Comprehensive error handling and recovery
 *
 * @author Claude Code (2025-06-28)
 * @see /config/routes.ts - Route configuration and matchers
 * @see /lib/auth/permissions.ts - Role hierarchy and permission utilities
 * @see /lib/services/audit.service.ts - Non-blocking audit logging service
 */

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AuditService } from "@/lib/services/audit.service";
import { routes, getRequiredRole, isProtectedRoute } from "@/config/routes";
import { getRoleLevel, hasRoleLevel, type Role } from "@/lib/auth/permissions";

/**
 * Enhanced authentication middleware with 3-phase implementation:
 * Phase 1: Audit logging integration
 * Phase 2: Centralized route configuration
 * Phase 3: Smart response strategy
 */
export default clerkMiddleware(async (auth, req) => {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Phase 2: Centralized route configuration
    // Skip public routes using centralized configuration from /config/routes.ts
    if (routes.public(req)) return NextResponse.next();

    // Skip system routes (they handle their own auth mechanisms)
    if (routes.system(req)) return NextResponse.next();

    // Authentication enforcement for protected routes
    let authObject;
    try {
      authObject = await auth.protect();
    } catch (authError) {
      // Phase 1: Audit logging for authentication failures
      AuditService.logAuthFailure(req, "authentication_failed");

      // Phase 3: Smart response strategy based on route type
      if (pathname.startsWith("/api/")) {
        // API routes receive structured JSON error responses
        return new NextResponse(
          JSON.stringify({
            error: "Unauthorized",
            message: "Authentication required",
            code: "AUTHENTICATION_REQUIRED",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Browser routes get user-friendly redirect with return URL
        return NextResponse.redirect(
          new URL(
            `/sign-in?redirect_url=${encodeURIComponent(pathname)}`,
            req.url
          )
        );
      }
    }

    const { sessionClaims } = authObject;

    // Phase 2: Role extraction using standardized JWT claims structure
    const userRole = sessionClaims?.["x-hasura-default-role"] as Role;

    // Phase 2: Determine required role using centralized route configuration
    const requiredRole = getRequiredRole(pathname);

    // Role-based access control with comprehensive audit logging
    if (requiredRole && !hasRoleLevel(userRole, requiredRole)) {
      // Phase 1: Audit logging for access denials (SOC2 compliance)
      AuditService.logAccessDenied(
        req,
        userRole,
        requiredRole,
        authObject.userId
      );

      // Phase 3: Smart response strategy for different client types
      if (pathname.startsWith("/api/")) {
        // API routes receive detailed JSON error responses
        return new NextResponse(
          JSON.stringify({
            error: "Forbidden",
            message: `Insufficient permissions. Required role: ${requiredRole}, current role: ${userRole}`,
            code: "INSUFFICIENT_PERMISSIONS",
            requiredRole,
            currentRole: userRole,
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Browser routes get user-friendly redirect with context
        return NextResponse.redirect(
          new URL(
            `/unauthorized?reason=${requiredRole}_required&current=${userRole}`,
            req.url
          )
        );
      }
    }

    // Phase 1: Successful access audit logging (non-blocking for performance)
    AuditService.logAccess(authObject, req);

    // User authenticated and authorized - proceed to route
    return NextResponse.next();
  } catch (error) {
    // Comprehensive error handling to prevent middleware crashes
    console.error("[MIDDLEWARE] Unexpected error:", error);

    // Phase 1: Audit logging for unexpected errors (critical for monitoring)
    AuditService.logAuthFailure(
      req,
      `middleware_error: ${error instanceof Error ? error.message : "unknown"}`
    );

    // Fail-safe strategy: Allow request to proceed but log the incident
    // This ensures the application remains functional even if middleware encounters issues
    // In high-security environments, consider returning an error response instead
    return NextResponse.next();
  }
});

/**
 * Middleware configuration
 *
 * Matcher pattern excludes static assets for optimal performance:
 * - _next/* - Next.js internal files
 * - Static assets (images, fonts, styles, scripts)
 * - Document files (csv, docx, xlsx, zip)
 *
 * Includes:
 * - All API routes (/api/*, /trpc/*)
 * - All application pages and dynamic routes
 */
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

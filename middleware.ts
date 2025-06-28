// middleware.ts – SOC2-compliant route protection with role-based access control
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole } from "./config/routes";
import { AuditService } from "./lib/services/audit.service";
import { ROLE_HIERARCHY, type Role } from "./lib/auth/permissions";

// ================================
// MIDDLEWARE FUNCTION
// ================================

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Skip public routes entirely
  if (routes.public(req)) {
    return NextResponse.next();
  }

  // Allow system routes to handle their own authentication
  if (routes.system(req)) {
    return NextResponse.next();
  }

  let authResult = null;

  try {
    // Determine required role for the route
    const requiredRole = getRequiredRole(pathname);

    if (!requiredRole) {
      // No specific role required, just ensure user is authenticated
      authResult = await auth.protect();
    } else {
      // Protect route but we'll do role checking separately
      // (Clerk's role-based protection doesn't align with our custom hierarchy)
      authResult = await auth.protect();

      if (authResult?.userId) {
        // Extract user role from session claims
        const userRole = (authResult.sessionClaims?.[
          "https://hasura.io/jwt/claims"
        ]?.["x-hasura-default-role"] ||
          authResult.sessionClaims?.metadata?.role ||
          "viewer") as string;

        // Check if user has sufficient role level using role hierarchy
        const userLevel = ROLE_HIERARCHY[userRole as Role] || 0;
        const requiredLevel = ROLE_HIERARCHY[requiredRole] || 999;
        const hasValidRole = userLevel >= requiredLevel;

        if (!hasValidRole) {
          console.warn(
            `🚫 Access denied: ${userRole} insufficient for ${requiredRole} (${pathname})`
          );

          // Log access denial
          AuditService.logAccessDenied(
            req,
            userRole,
            requiredRole,
            authResult.userId
          );

          // Return 403 for API routes, redirect to unauthorized for pages
          if (pathname.startsWith("/api")) {
            return NextResponse.json(
              {
                error: "Insufficient permissions",
                required: requiredRole,
                current: userRole,
              },
              { status: 403 }
            );
          } else {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
          }
        }
      }
    }

    // Non-blocking audit logging for successful access
    if (authResult?.userId) {
      AuditService.logAccess(authResult, req);
    }
  } catch (error) {
    console.error("🔒 Middleware auth error:", error);

    // Log authentication failure
    AuditService.logAuthFailure(
      req,
      error instanceof Error ? error.message : "Unknown auth error"
    );

    // Let Clerk handle the redirect for unauthenticated users
    throw error;
  }

  return NextResponse.next();
});

// ================================
// MIDDLEWARE CONFIG
// ================================

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

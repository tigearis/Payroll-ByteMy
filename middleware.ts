// middleware.ts – SOC2-compliant route protection with role-based access control
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ROLE_HIERARCHY, type Role } from "./lib/auth/permissions";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/accept-invitation(.*)",
  "/api/clerk-webhooks(.*)",
  "/api/webhooks/clerk(.*)",
  "/_next(.*)",
  "/favicon.ico",
]);

// Define system routes that handle their own auth
const isSystemRoute = createRouteMatcher([
  "/api/cron(.*)",
  "/api/signed(.*)",
  "/api/commit-payroll-assignments(.*)",
  "/api/holidays(.*)",
]);

// Route role requirements
const routeRoleRequirements: Record<string, Role> = {
  "/developer": "developer",
  "/api/developer": "developer", 
  "/api/dev": "developer",
  "/admin": "org_admin",
  "/security": "org_admin",
  "/api/admin": "org_admin",
  "/api/audit": "org_admin",
  "/staff": "manager",
  "/api/staff": "manager",
  "/invitations": "manager", 
  "/api/invitations": "manager",
  "/dashboard": "consultant",
  "/clients": "consultant",
  "/payrolls": "consultant",
};

function getRequiredRole(pathname: string): Role | null {
  for (const [routePrefix, requiredRole] of Object.entries(routeRoleRequirements)) {
    if (pathname.startsWith(routePrefix)) {
      return requiredRole;
    }
  }
  // Default to consultant level for any other protected route
  return "consultant";
}

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  // Skip public routes - no auth needed
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Skip system routes - they handle their own auth
  if (isSystemRoute(req)) {
    return NextResponse.next();
  }

  // For protected routes, we need to check authentication
  // But we don't call protect() here - let Clerk handle the redirect
  const { userId, sessionClaims } = auth();
  
  // If no userId, the user is not authenticated
  // Clerk will automatically redirect to sign-in
  if (!userId) {
    // Don't redirect to unauthorized - let Clerk handle it
    return NextResponse.next();
  }

  // User is authenticated, now check role permissions
  const requiredRole = getRequiredRole(pathname);
  
  if (requiredRole) {
    // Extract user role from session claims - try multiple sources
    let userRole = "viewer"; // Default fallback
    
    try {
      // Try Hasura JWT claims first
      const hasuraRole = sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"];
      if (hasuraRole && typeof hasuraRole === 'string') {
        userRole = hasuraRole;
      } else {
        // Try public metadata
        const metadataRole = sessionClaims?.publicMetadata?.role;
        if (metadataRole && typeof metadataRole === 'string') {
          userRole = metadataRole;
        } else {
          // Try regular metadata as fallback
          const regularMetadataRole = sessionClaims?.metadata?.role;
          if (regularMetadataRole && typeof regularMetadataRole === 'string') {
            userRole = regularMetadataRole;
          }
        }
      }
    } catch (error) {
      console.warn("Failed to extract user role, using default:", error);
      userRole = "viewer";
    }

    // Check if user has sufficient role level using role hierarchy
    const userLevel = ROLE_HIERARCHY[userRole as Role] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 999;
    const hasValidRole = userLevel >= requiredLevel;

    if (!hasValidRole) {
      console.warn(`🚫 Access denied: ${userRole} insufficient for ${requiredRole} (${pathname})`);
      
      // Return 403 for API routes, redirect to unauthorized for pages
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { 
            error: "Insufficient permissions",
            required: requiredRole,
            current: userRole
          },
          { status: 403 }
        );
      } else {
        // User is authenticated but lacks permissions
        return NextResponse.redirect(new URL(`/unauthorized?reason=insufficient_permissions&required=${requiredRole}&current=${userRole}`, req.url));
      }
    }
  }

  // User has valid authentication and permissions
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
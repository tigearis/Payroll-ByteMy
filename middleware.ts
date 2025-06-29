// Enhanced middleware with role-based protection
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole } from "./config/routes";
import { hasRoleLevel } from "./lib/auth/permissions";
import { getJWTClaimsWithFallback } from "./lib/auth/token-utils";

// Define the middleware with debug mode
export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;

    console.log("🔒 MIDDLEWARE STARTED:", {
      pathname,
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString()
    });

  // Skip public routes
  if (routes.public(req)) {
    console.log("✅ Public route, allowing access");
    return NextResponse.next();
  }

  // Skip system routes (they handle their own auth)
  if (routes.system(req)) {
    console.log("⚙️ System route, allowing access");
    return NextResponse.next();
  }

  // Get complete auth data using centralized token utilities
  try {
    const { redirectToSignIn } = await auth();
    const { userId, claims, role: userRole, hasCompleteData, error } = await getJWTClaimsWithFallback();

    // Handle unauthenticated users
    if (!userId) {
      console.log("❌ No user ID found:", error);
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return redirectToSignIn();
    }
    
    // If we don't have complete user data, allow only sync-related paths
    if (!hasCompleteData) {
      const allowedIncompleteDataPaths = [
        "/dashboard",
        "/api/sync-current-user", 
        "/api/sync/",
        "/api/webhooks/clerk",
        "/profile",
        "/settings"
      ];

      const isAllowedPath = allowedIncompleteDataPaths.some(path => 
        pathname === path || pathname.startsWith(path)
      );

      if (isAllowedPath) {
        console.log("⏳ Session not fully loaded, allowing sync path", {
          pathname,
          hasCompleteData,
          userId: userId.substring(0, 8) + "...",
          error
        });
        return NextResponse.next();
      } else {
        console.log("⏳ Session not fully loaded, redirecting to dashboard for sync");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Now we have complete user data
    const finalUserRole = userRole || "viewer";

    // Get required role for this route
    const requiredRole = getRequiredRole(pathname);

    if (requiredRole) {
      // Check if user has sufficient role using the centralized function
      if (!hasRoleLevel(finalUserRole, requiredRole)) {
        console.log("❌ Insufficient permissions:", {
          userRole: finalUserRole,
          requiredRole,
        });

        // Return JSON error for API routes, redirect for pages
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              error: "Forbidden",
              message: `Insufficient permissions. Required: ${requiredRole}, Current: ${finalUserRole}`,
              code: "INSUFFICIENT_PERMISSIONS",
              requiredRole,
              currentRole: finalUserRole,
            },
            { status: 403 }
          );
        } else {
          return NextResponse.redirect(
            new URL(
              `/unauthorized?reason=role_required&current=${finalUserRole}&required=${requiredRole}`,
              req.url
            )
          );
        }
      }
    }

    console.log("✅ Access granted");
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Auth error:", error);

    // Return JSON error for API routes, redirect for pages
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required",
          code: "AUTHENTICATION_REQUIRED",
        },
        { status: 401 }
      );
    } else {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
},
{ debug: true }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
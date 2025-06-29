// Enhanced middleware with role-based protection and OAuth flow handling
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole } from "./config/routes";
import { hasRoleLevel } from "./lib/auth/permissions";
import { getSessionClaims } from "./lib/auth/token-utils";

// Define the middleware with debug mode
export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;

    console.log("🔒 MIDDLEWARE STARTED:", {
      pathname,
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
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

    // Enhanced OAuth flow detection
    const isOAuthFlow =
      req.nextUrl.searchParams.has("oauth_callback") ||
      req.nextUrl.searchParams.has("__clerk_db_jwt") ||
      req.nextUrl.searchParams.has("__clerk_handshake") ||
      req.nextUrl.searchParams.has("__clerk_redirect_url") ||
      req.headers.get("referer")?.includes("clerk.") ||
      req.headers.get("referer")?.includes("accounts.dev") ||
      req.headers.get("referer")?.includes("clerk.accounts.dev") ||
      pathname.includes("sso-callback") ||
      pathname.includes("oauth") ||
      pathname.includes("clerk");

    // Get complete auth data using centralised token utilities
    try {
      const { redirectToSignIn } = await auth();
      const {
        userId,
        claims,
        role: userRole,
        hasCompleteData,
        error,
      } = await getSessionClaims();

      // Handle unauthenticated users
      if (!userId) {
        console.log("❌ No user ID found:", error);

        // During OAuth flow, allow some time for authentication to complete
        if (isOAuthFlow) {
          console.log(
            "🔄 OAuth flow detected, allowing unauthenticated access temporarily"
          );
          return NextResponse.next();
        }

        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return redirectToSignIn();
      }

      // If we don't have complete user data, handle carefully
      if (!hasCompleteData) {
        const allowedIncompleteDataPaths = [
          "/dashboard",
          "/api/sync-current-user",
          "/api/sync/",
          "/api/webhooks/clerk",
          "/profile",
          "/settings",
          // Add OAuth-related paths
          "/sso-callback",
          "/oauth",
          "/auth/callback",
        ];

        const isAllowedPath = allowedIncompleteDataPaths.some(
          path => pathname === path || pathname.startsWith(path)
        );

        // Allow OAuth flows to complete without interruption
        if (isOAuthFlow) {
          console.log(
            "🔄 OAuth flow in progress, allowing access for completion",
            {
              pathname,
              hasCompleteData,
              userId: userId.substring(0, 8) + "...",
              error,
            }
          );
          return NextResponse.next();
        }

        if (isAllowedPath) {
          console.log("⏳ Session not fully loaded, allowing sync path", {
            pathname,
            hasCompleteData,
            userId: userId.substring(0, 8) + "...",
            error,
          });
          return NextResponse.next();
        } else {
          // Add a delay before redirecting to allow for session loading
          // Check if this is a fresh session that might still be loading
          const sessionAge = claims?.iat
            ? Date.now() / 1000 - claims.iat
            : Infinity;
          const isRecentSession = sessionAge < 30; // Less than 30 seconds old

          if (isRecentSession) {
            console.log(
              "⏳ Recent session detected, allowing time for data sync",
              {
                sessionAge,
                pathname,
              }
            );
            return NextResponse.next();
          }

          // FIX: Only redirect if NOT already on dashboard to prevent redirect loops
          if (pathname !== "/dashboard") {
            console.log(
              "⏳ Session not fully loaded, redirecting to dashboard for sync"
            );
            return NextResponse.redirect(new URL("/dashboard", req.url));
          } else {
            // Already on dashboard, allow access for sync to complete
            console.log(
              "⏳ Already on dashboard, allowing access for sync completion",
              {
                pathname,
                hasCompleteData,
                userId: userId.substring(0, 8) + "...",
              }
            );
            return NextResponse.next();
          }
        }
      }

      // Now we have complete user data
      const finalUserRole = userRole || "viewer";

      // Get required role for this route
      const requiredRole = getRequiredRole(pathname);

      if (requiredRole) {
        // Check if user has sufficient role using the centralised function
        if (!hasRoleLevel(finalUserRole as Role, requiredRole)) {
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
                `/unauthorised?reason=role_required&current=${finalUserRole}&required=${requiredRole}`,
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

      // During OAuth flow, be more lenient with errors
      if (isOAuthFlow) {
        console.log(
          "🔄 OAuth flow detected, allowing access despite auth error"
        );
        return NextResponse.next();
      }

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
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

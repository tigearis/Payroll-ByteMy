// Enhanced middleware with role-based protection and OAuth flow handling
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole } from "./config/routes";
import { hasRoleLevel } from "./lib/auth/permissions";

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

    // Skip system routes
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

    try {
      // Use auth() directly in middleware context - THIS IS THE KEY FIX
      const { userId, sessionClaims, redirectToSignIn } = await auth();

      // Handle unauthenticated users
      if (!userId) {
        console.log("❌ No user ID found");

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

      // Extract role from session claims directly
      const publicMetadata = sessionClaims?.publicMetadata as any;
      const hasuraClaims = sessionClaims?.[
        "https://hasura.io/jwt/claims"
      ] as any;

      const userRole =
        hasuraClaims?.["x-hasura-default-role"] ||
        publicMetadata?.role ||
        "viewer";

      const hasCompleteData = !!(
        userId &&
        userRole &&
        (hasuraClaims || publicMetadata?.role)
      );

      // Handle incomplete data
      if (!hasCompleteData) {
        const allowedIncompleteDataPaths = [
          "/dashboard",
          "/api/sync-current-user",
          "/api/sync/",
          "/api/webhooks/clerk",
          "/profile",
          "/settings",
          "/sso-callback",
          "/oauth",
          "/auth/callback",
        ];

        const isAllowedPath = allowedIncompleteDataPaths.some(
          path => pathname === path || pathname.startsWith(path)
        );

        if (isOAuthFlow || isAllowedPath) {
          console.log("⏳ Allowing access for sync/OAuth completion");
          return NextResponse.next();
        }

        if (pathname !== "/dashboard") {
          console.log("⏳ Redirecting to dashboard for sync");
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {
          console.log("⏳ On dashboard, allowing sync completion");
          return NextResponse.next();
        }
      }

      // Check role-based permissions
      const requiredRole = getRequiredRole(pathname);
      if (requiredRole && !hasRoleLevel(userRole, requiredRole)) {
        console.log("❌ Insufficient permissions:", { userRole, requiredRole });

        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              error: "Forbidden",
              message: `Insufficient permissions. Required: ${requiredRole}, Current: ${userRole}`,
              code: "INSUFFICIENT_PERMISSIONS",
              requiredRole,
              currentRole: userRole,
            },
            { status: 403 }
          );
        } else {
          return NextResponse.redirect(
            new URL(
              `/unauthorised?reason=role_required&current=${userRole}&required=${requiredRole}`,
              req.url
            )
          );
        }
      }

      console.log("✅ Access granted");
      return NextResponse.next();
    } catch (error) {
      console.error("❌ Auth error:", error);

      if (isOAuthFlow) {
        console.log(
          "🔄 OAuth flow detected, allowing access despite auth error"
        );
        return NextResponse.next();
      }

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

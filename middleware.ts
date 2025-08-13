/**
 * Simplified Role-Based Authentication Middleware (Clerk Best Practices)
 *
 * - Public routes: no auth required
 * - System routes: handle their own auth
 * - OAuth callback routes: bypass to avoid redirect loops
 * - Protected routes: require authentication + basic role checking
 * - Complex JWT processing moved to API routes where it belongs
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

// ── ROUTE DEFINITIONS ─────────────────────────────────────────────────────
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/accept-invitation"];
const SYSTEM_ROUTES = [
  "/api/webhooks",
  "/api/cron",
  "/api/debug-auth",
  "/api/debug-clerk-auth",
  "/api/debug/jwt-claims",
];
const OAUTH_CALLBACK_PREFIXES = [
  "/sso-callback",
  "/sign-in/sso-callback",
  "/sign-up/sso-callback",
  "/oauth",
];
const BROWSER_SYSTEM_ROUTES = [
  "/.well-known/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

// Route matchers using Clerk's recommended approach
const isPublicRoute = createRouteMatcher(PUBLIC_ROUTES);
const isSystemRoute = (pathname: string) =>
  SYSTEM_ROUTES.some(r => pathname.startsWith(r));
const isOAuthCallback = (pathname: string) =>
  OAUTH_CALLBACK_PREFIXES.some(
    r => pathname === r || pathname.startsWith(r + "/")
  );
const isBrowserSystemRoute = (pathname: string) =>
  BROWSER_SYSTEM_ROUTES.some(r => pathname.startsWith(r));
const isStaticAsset = (pathname: string) =>
  pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|css|js)$/);

// Role-based route permissions (simplified - complex logic moved to API routes)
const PROTECTED_ROUTES = {
  "/staff": "manager",
  "/billing": "manager",
  "/reports": "manager",
  "/settings": "org_admin",
  "/security": "org_admin",
  "/invitations": "manager",
  "/developer": "developer",
  "/payrolls": "consultant",
  "/clients": "consultant",
  "/work-schedule": "consultant",
  "/email": "consultant",
  "/leave": "consultant",
  "/ai-assistant": "consultant",
  "/dashboard": "viewer",
};

export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;
    const requestId = nanoid();

    try {
      // Bypass system routes, static assets, and OAuth callbacks
      if (
        isStaticAsset(pathname) ||
        isSystemRoute(pathname) ||
        isOAuthCallback(pathname) ||
        isBrowserSystemRoute(pathname)
      ) {
        const res = NextResponse.next();
        res.headers.set("X-Request-Id", requestId);
        return res;
      }

      // Public routes - no auth required
      if (isPublicRoute(req)) {
        const res = NextResponse.next();
        res.headers.set("X-Request-Id", requestId);
        return res;
      }

      // Protected routes - require authentication
      let authResult;
      try {
        authResult = await auth();
      } catch (authError) {
        console.error("Clerk auth() call failed:", authError);
        // Return 401 for API routes, redirect for web routes
        if (pathname.startsWith("/api/")) {
          const res = NextResponse.json(
            { error: "Authentication service error" },
            { status: 401 }
          );
          res.headers.set("X-Request-Id", requestId);
          return res;
        }
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }

      const { userId, sessionClaims, getToken } = authResult;

      // Basic authentication check
      if (!userId) {
        if (pathname.startsWith("/api/")) {
          const res = NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
          res.headers.set("X-Request-Id", requestId);
          return res;
        }
        // Redirect to sign-in for web routes
        const signInUrl = new URL("/sign-in", req.url);
        return NextResponse.redirect(signInUrl);
      }

      // Robust role extraction using Hasura JWT template
      let userRole = "viewer" as
        | "developer"
        | "org_admin"
        | "manager"
        | "consultant"
        | "viewer";

      try {
        const ROLE_ORDER: Array<typeof userRole> = [
          "developer",
          "org_admin",
          "manager",
          "consultant",
          "viewer",
        ];

        // Get Hasura token with proper template
        let hasuraToken = null;
        let hasuraClaims = null;

        try {
          hasuraToken = await getToken({ template: "hasura" });
          if (hasuraToken) {
            // Decode the JWT to get claims
            const base64Payload = hasuraToken.split(".")[1];
            const decodedPayload = JSON.parse(atob(base64Payload));
            hasuraClaims = decodedPayload["https://hasura.io/jwt/claims"];
          }
        } catch (tokenError) {
          console.warn("Could not get Hasura token:", tokenError);
        }

        if (hasuraClaims) {
          // Extract role from Hasura claims
          const explicitRole = hasuraClaims["x-hasura-role"];
          const defaultRole = hasuraClaims["x-hasura-default-role"];

          const claimRole =
            typeof explicitRole === "string" &&
            ROLE_ORDER.includes(explicitRole as any)
              ? (explicitRole as typeof userRole)
              : typeof defaultRole === "string" &&
                  ROLE_ORDER.includes(defaultRole as any)
                ? (defaultRole as typeof userRole)
                : null;

          if (claimRole) {
            userRole = claimRole;
          } else {
            // Fallback to allowed roles
            const allowed = hasuraClaims["x-hasura-allowed-roles"];
            if (Array.isArray(allowed)) {
              const highest = ROLE_ORDER.find(r => allowed.includes(r));
              if (highest) {
                userRole = highest;
              }
            }
          }
        } else {
          // Fallback to sessionClaims metadata if no Hasura token
          if (sessionClaims && typeof sessionClaims === "object") {
            const metadataRole =
              (sessionClaims as any)?.metadata?.role ||
              (sessionClaims as any)?.publicMetadata?.role;
            if (
              typeof metadataRole === "string" &&
              ROLE_ORDER.includes(metadataRole as any)
            ) {
              userRole = metadataRole as typeof userRole;
            }
          }
        }
      } catch (roleError) {
        console.warn("Could not extract role:", roleError);
        userRole = "viewer";
      }

      // Dev bypass removed to mirror production behavior

      // Basic route protection (detailed authorization in API routes)
      // Prefix-based protected route match (supports nested paths)
      const matched = Object.entries(PROTECTED_ROUTES).find(
        ([prefix]) => pathname === prefix || pathname.startsWith(prefix + "/")
      );
      const requiredRole = matched?.[1];
      if (requiredRole) {
        const roleHierarchy = {
          developer: 5,
          org_admin: 4,
          manager: 3,
          consultant: 2,
          viewer: 1,
        };
        const userLevel =
          roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
        const requiredLevel =
          roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

        if (userLevel < requiredLevel) {
          console.log(`🚫 ACCESS DENIED: ${userRole} blocked from ${pathname}`);

          if (pathname.startsWith("/api/")) {
            const res = NextResponse.json(
              { error: "Insufficient permissions" },
              { status: 403 }
            );
            res.headers.set("X-Request-Id", requestId);
            res.headers.set("X-User-Role", userRole);
            return res;
          }

          // Redirect web routes to dashboard (include role for debugging)
          const dashboardUrl = new URL("/dashboard", req.url);
          const res = NextResponse.redirect(dashboardUrl);
          res.headers.set("X-Request-Id", requestId);
          res.headers.set("X-User-Role", userRole);
          return res;
        }
      }

      // Success - user has access
      const res = NextResponse.next();
      res.headers.set("X-Request-Id", requestId);
      res.headers.set("X-User-Id", userId);
      res.headers.set("X-User-Role", userRole);
      return res;
    } catch (error) {
      console.error("Middleware error:", error);

      if (pathname.startsWith("/api/")) {
        const res = NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
        res.headers.set("X-Request-Id", requestId);
        return res;
      }

      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  },
  {
    signInUrl: "/sign-in",
    debug: process.env.NODE_ENV === "development",
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)",
  ],
};

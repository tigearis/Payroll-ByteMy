/**
 * Clean Authentication Middleware (OAuth-safe + correlation IDs)
 *
 * - Public routes: no auth required
 * - System routes: handle their own auth
 * - OAuth callback routes: bypass to avoid redirect loops
 * - All other requests: must be authenticated
 * - Every response gets X-Request-Id:nanoid()
 */

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid"; // ← correlation-ID generator

// ── 1. ROUTE DEFINITIONS ──────────────────────────────────────────────
const PUBLIC_ROUTES = ["/", "/sign-in", "/accept-invitation"];
const SYSTEM_ROUTES = ["/api/webhooks", "/api/cron"];
const OAUTH_CALLBACK_PREFIXES = [
  "/sso-callback",
  "/sign-in/sso-callback",
  "/oauth",
];

// ── 2. HELPERS ────────────────────────────────────────────────────────
const startsWith = (p: string, r: string) => p === r || p.startsWith(r + "/");

const isPublicRoute = (p: string) => PUBLIC_ROUTES.some(r => startsWith(p, r));
const isSystemRoute = (p: string) => SYSTEM_ROUTES.some(r => p.startsWith(r));
const isOAuthCallback = (p: string) =>
  OAUTH_CALLBACK_PREFIXES.some(r => startsWith(p, r));
const isStaticAsset = (p: string) =>
  p.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|css|js)$/);

// ── 3. MIDDLEWARE ─────────────────────────────────────────────────────
export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;
    const requestId = nanoid(); // generate once per request

    // 3.1 Bypass paths (static, public, system, OAuth)
    if (
      isStaticAsset(pathname) ||
      isPublicRoute(pathname) ||
      isSystemRoute(pathname) ||
      isOAuthCallback(pathname)
    ) {
      const res = NextResponse.next();
      res.headers.set("X-Request-Id", requestId);
      return res;
    }

    // 3.2 Auth-protected area
    try {
      const { userId, redirectToSignIn, getToken } = await auth();

      if (!userId) {
        if (pathname.startsWith("/api/")) {
          const res = NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
          res.headers.set("X-Request-Id", requestId);
          return res;
        }
        return redirectToSignIn();
      }

      // 3.3 Optional JWT validation for API routes
      if (pathname.startsWith("/api/") && pathname !== "/api/sync-current-user") {
        try {
          const token = await getToken({ template: "hasura" });
          if (token) {
            const base64Payload = token.split(".")[1];
            const decodedPayload = JSON.parse(atob(base64Payload));
            const hasuraClaims = decodedPayload["https://hasura.io/jwt/claims"];
            
            // Validate critical claims exist
            if (!hasuraClaims?.["x-hasura-user-id"] || !hasuraClaims?.["x-hasura-default-role"]) {
              console.warn("Missing critical JWT claims, redirecting to sync");
              if (pathname.startsWith("/api/")) {
                const res = NextResponse.json(
                  { error: "Invalid session - please sign in again", needsSync: true },
                  { status: 401 }
                );
                res.headers.set("X-Request-Id", requestId);
                return res;
              }
            }
          }
        } catch (jwtError) {
          console.warn("JWT validation error:", jwtError);
          // Don't block on JWT validation errors, but log them
        }
      }

      const res = NextResponse.next();
      res.headers.set("X-Request-Id", requestId);
      res.headers.set("X-User-Id", userId); // Add user ID to headers for debugging
      return res;
    } catch (error) {
      console.error("Auth error:", error);

      if (pathname.startsWith("/api/")) {
        const res = NextResponse.json(
          { error: "Authentication failed" },
          { status: 401 }
        );
        res.headers.set("X-Request-Id", requestId);
        return res;
      }

      const res = NextResponse.redirect(new URL("/sign-in", req.url));
      res.headers.set("X-Request-Id", requestId);
      return res;
    }
  },
  {
    signInUrl: "/sign-in",
    debug: process.env.NODE_ENV === "production",
  }
);

// ── 4. MATCHER ────────────────────────────────────────────────────────
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)",
  ],
};

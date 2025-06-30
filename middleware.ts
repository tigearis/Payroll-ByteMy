/**
 * Clean Authentication Middleware
 * 
 * Simple authentication check - only verifies if user is logged in.
 */

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/accept-invitation",
];

// API routes that handle their own auth
const SYSTEM_ROUTES = [
  "/api/webhooks",
  "/api/cron",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
}

function isSystemRoute(pathname: string): boolean {
  return SYSTEM_ROUTES.some(route => 
    pathname.startsWith(route)
  );
}

export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;

    // Skip public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Skip system routes
    if (isSystemRoute(pathname)) {
      return NextResponse.next();
    }

    try {
      const { userId, redirectToSignIn } = await auth();

      // Require authentication
      if (!userId) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return redirectToSignIn();
      }

      // User is authenticated - allow access
      return NextResponse.next();
    } catch (error) {
      console.error("Auth error:", error);

      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)",
  ],
};

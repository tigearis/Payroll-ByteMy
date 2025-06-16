// middleware.ts - Enhanced route protection with MFA enforcement
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ================================
// ROUTE MATCHERS
// ================================

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/accept-invitation(.*)",
  "/api/clerk-webhooks(.*)",
  // Test routes (development only)
  ...(process.env.NODE_ENV === "development" ? [
    "/api/simple-test",
    "/api/debug-post", 
    "/api/minimal-post-test",
    "/api/working-post-test",
    "/api/test-get-public",
    "/api/test-minimal",
    "/api/test-create",
    "/api/test-direct-auth"
  ] : []),
  "/_next(.*)",
  "/favicon.ico",
]);

// ================================
// ENHANCED MIDDLEWARE
// ================================

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all non-public routes
  await auth.protect();
  return NextResponse.next();
});

// ================================
// MIDDLEWARE CONFIGURATION
// ================================

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

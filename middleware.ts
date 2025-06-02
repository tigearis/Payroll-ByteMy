// middleware.ts - Simple route protection only
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ================================
// ROUTE MATCHERS
// ================================

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/accept-invitation(.*)",
  "/api/clerk-webhooks(.*)",
  "/api/auth(.*)",
  "/api/commit-payroll-assignments(.*)",
  "/_next(.*)",
  "/favicon.ico",
]);

// ================================
// SIMPLE MIDDLEWARE
// ================================

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  try {
    // Protect all non-public routes
    await auth.protect();

    // Just pass through if authenticated
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    // On error, redirect to sign-in
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
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

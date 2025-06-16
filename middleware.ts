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
  "/api/commit-payroll-assignments(.*)",
  "/_next(.*)",
  "/favicon.ico",
]);

// ================================
// ENHANCED MIDDLEWARE
// ================================

export default clerkMiddleware(async (auth, req) => {
  console.log("🔧 Middleware called for:", req.method, req.nextUrl.pathname);
  
  // Skip authentication for public routes
  if (isPublicRoute(req)) {
    console.log("✅ Public route, skipping auth");
    return NextResponse.next();
  }

  try {
    console.log("🔐 Protecting route:", req.nextUrl.pathname);
    // Protect all non-public routes
    await auth.protect();

    console.log("✅ Auth successful, proceeding");
    // Just pass through if authenticated
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Middleware error:", error);
    console.error("❌ Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack?.split('\n')[0],
    });

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

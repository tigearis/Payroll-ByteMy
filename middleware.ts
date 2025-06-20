// middleware.ts - Simplified route protection with SOC2 audit logging
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AuditLogger } from "./lib/auth/soc2-auth";

// ================================
// ROUTE MATCHERS
// ================================

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/accept-invitation(.*)",
  "/api/clerk-webhooks(.*)",
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
  const authResult = await auth.protect();
  
  // SOC2: Log protected route access
  if (authResult?.userId) {
    const isApiRoute = req.nextUrl.pathname.startsWith('/api');
    
    // Only log significant routes, not internal ones
    if (!req.nextUrl.pathname.includes('_next') && 
        !req.nextUrl.pathname.includes('favicon')) {
      
      AuditLogger.log({
        userId: authResult.userId,
        action: isApiRoute ? 'api_access' : 'page_access',
        resource: req.nextUrl.pathname,
        timestamp: new Date(),
        details: {
          method: req.method,
          userAgent: req.headers.get('user-agent')?.substring(0, 100),
          ipAddress: req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown',
        }
      });
    }
  }
  
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

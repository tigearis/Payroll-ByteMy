// middleware-simple.ts – Minimal middleware to test authentication
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  console.log(`🔍 Simple Debug - Pathname: ${pathname}`);
  
  // Public routes - no authentication needed
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up", 
    "/accept-invitation",
    "/api/clerk-webhooks",
    "/api/webhooks/clerk",
    "/_next",
    "/favicon.ico"
  ];
  
  const isPublic = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
  
  if (isPublic) {
    console.log(`✅ Public route allowed: ${pathname}`);
    return NextResponse.next();
  }

  // System/API routes that handle their own auth
  const systemRoutes = [
    "/api/cron",
    "/api/signed",
    "/api/commit-payroll-assignments", 
    "/api/holidays"
  ];
  
  const isSystem = systemRoutes.some(route => pathname.startsWith(route));
  
  if (isSystem) {
    console.log(`⚙️ System route allowed: ${pathname}`);
    return NextResponse.next();
  }

  try {
    console.log(`🔐 Protecting route: ${pathname}`);
    const authResult = await auth.protect();
    
    if (authResult?.userId) {
      console.log(`✅ User authenticated: ${authResult.userId}`);
      return NextResponse.next();
    } else {
      console.log(`❌ No user ID in auth result`);
      throw new Error("No user ID");
    }
    
  } catch (error) {
    console.error(`🔒 Auth failed for ${pathname}:`, error);
    // Let Clerk handle the redirect
    throw error;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
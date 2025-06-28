// middleware.ts – SOC2-compliant route protection with role-based access control
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole } from "./config/routes";
import { ROLE_HIERARCHY, type Role } from "./lib/auth/permissions";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  // Skip public routes entirely
  if (routes.public(req)) {
    return NextResponse.next();
  }

  // Allow system routes to handle their own authentication
  if (routes.system(req)) {
    return NextResponse.next();
  }

  let authResult = null;

  try {
    // Determine required role for the route
    const requiredRole = getRequiredRole(pathname);
    
    if (!requiredRole) {
      // No specific role required, just ensure user is authenticated
      authResult = await auth.protect();
    } else {
      // Protect route but we'll do role checking separately
      authResult = await auth.protect();
      
      if (authResult?.userId) {
        // Extract user role from session claims - try multiple sources
        let userRole = "viewer"; // Default fallback
        
        try {
          // Try Hasura JWT claims first
          const hasuraRole = authResult.sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"];
          if (hasuraRole && typeof hasuraRole === 'string') {
            userRole = hasuraRole;
          } else {
            // Try public metadata
            const metadataRole = authResult.sessionClaims?.publicMetadata?.role;
            if (metadataRole && typeof metadataRole === 'string') {
              userRole = metadataRole;
            } else {
              // Try regular metadata as fallback
              const regularMetadataRole = authResult.sessionClaims?.metadata?.role;
              if (regularMetadataRole && typeof regularMetadataRole === 'string') {
                userRole = regularMetadataRole;
              }
            }
          }
        } catch (error) {
          console.warn("Failed to extract user role, using default:", error);
          userRole = "viewer";
        }

        // Check if user has sufficient role level using role hierarchy
        const userLevel = ROLE_HIERARCHY[userRole as Role] || 0;
        const requiredLevel = ROLE_HIERARCHY[requiredRole] || 999;
        const hasValidRole = userLevel >= requiredLevel;

        if (!hasValidRole) {
          console.warn(`🚫 Access denied: ${userRole} insufficient for ${requiredRole} (${pathname})`);
          
          // Return 403 for API routes, redirect to unauthorized for pages
          if (pathname.startsWith("/api")) {
            return NextResponse.json(
              { 
                error: "Insufficient permissions",
                required: requiredRole,
                current: userRole
              },
              { status: 403 }
            );
          } else {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
          }
        }
      }
    }

  } catch (error) {
    console.error("🔒 Middleware auth error:", error);
    
    // Check if this is an unauthenticated user error
    // If so, let Clerk handle the redirect to sign-in
    // Only redirect to unauthorized for actual permission issues
    if (error instanceof Error && error.message?.includes('Unauthenticated')) {
      // Let Clerk handle the redirect to sign-in
      throw error;
    }
    
    // For other errors, also let Clerk handle them
    throw error;
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
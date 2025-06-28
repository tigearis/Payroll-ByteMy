// Enhanced middleware with role-based protection
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole, getRouteCategory } from "./config/routes";
import { hasRoleLevel } from "./lib/auth/permissions";

// Define the middleware
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  console.log("🔒 Enhanced middleware processing:", {
    pathname,
    method: req.method,
  });

  // Skip public routes
  if (routes.public(req)) {
    console.log("✅ Public route, allowing access");
    return NextResponse.next();
  }

  // Skip system routes (they handle their own auth)
  if (routes.system(req)) {
    console.log("⚙️ System route, allowing access");
    return NextResponse.next();
  }

  // Protect all other routes
  try {
    const authResult = await auth.protect();

    if (!authResult?.userId) {
      console.log("❌ No user ID found");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Get user role from session claims (server-side)
    const sessionClaims = authResult.sessionClaims;
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = hasuraClaims?.["x-hasura-default-role"] || 
                     (sessionClaims?.publicMetadata as any)?.role ||
                     "viewer";

    console.log("🔍 Auth details:", {
      userId: authResult.userId.substring(0, 8) + "...",
      userRole,
      hasJwtClaims: !!hasuraClaims,
      pathname,
      method: req.method,
    });

    // Get required role for this route
    const requiredRole = getRequiredRole(pathname);

    if (requiredRole) {
      // Check if user has sufficient role using the centralized function
      if (!hasRoleLevel(userRole, requiredRole)) {
        console.log("❌ Insufficient permissions:", {
          userRole,
          requiredRole,
        });

        // Return JSON error for API routes, redirect for pages
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
              `/unauthorized?reason=role_required&current=${userRole}&required=${requiredRole}`,
              req.url
            )
          );
        }
      }
    }

    console.log("✅ Access granted");
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Auth error:", error);

    // Return JSON error for API routes, redirect for pages
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
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

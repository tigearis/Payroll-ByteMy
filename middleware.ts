// Enhanced middleware with role-based protection
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole } from "./config/routes";
import { hasRoleLevel } from "./lib/auth/permissions";

// Define the middleware
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  console.log("🔒 MIDDLEWARE STARTED:", {
    pathname,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
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

  // Get complete auth data using auth() instead of auth.protect()
  try {
    const { userId, sessionClaims, redirectToSignIn, getToken } = await auth();

    // Handle unauthenticated users
    if (!userId) {
      console.log("❌ No user ID found");
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return redirectToSignIn();
    }

    // Get JWT token to access claims
    const token = await getToken({ template: "hasura" });
    
    // Get complete session data
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const publicMetadata = sessionClaims?.publicMetadata as any;
    
    // If sessionClaims doesn't have JWT claims, try to get them from the token
    let jwtClaims = hasuraClaims;
    if (!jwtClaims && token) {
      // Decode the JWT token to get claims
      try {
        const base64Payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        jwtClaims = decodedPayload["https://hasura.io/jwt/claims"];
      } catch (error) {
        console.error("Failed to decode JWT token:", error);
      }
    }
    
    // Check if we have complete user data (use jwtClaims instead of hasuraClaims)
    const hasCompleteJWTClaims = jwtClaims?.["x-hasura-user-id"] && jwtClaims?.["x-hasura-default-role"];
    const hasCompleteMetadata = publicMetadata?.databaseId && publicMetadata?.role;
    const userRole = jwtClaims?.["x-hasura-default-role"] || publicMetadata?.role;
    
    // If we don't have complete user data, allow only sync-related paths
    if (!hasCompleteJWTClaims && !hasCompleteMetadata) {
      const allowedIncompleteDataPaths = [
        "/dashboard",
        "/api/sync-current-user", 
        "/api/sync/",
        "/api/webhooks/clerk",
        "/profile",
        "/settings"
      ];

      const isAllowedPath = allowedIncompleteDataPaths.some(path => 
        pathname === path || pathname.startsWith(path)
      );

      if (isAllowedPath) {
        console.log("⏳ Session not fully loaded, allowing sync path", {
          pathname,
          hasJwtClaims: hasCompleteJWTClaims,
          hasMetadata: hasCompleteMetadata,
          userId: userId.substring(0, 8) + "..."
        });
        return NextResponse.next();
      } else {
        console.log("⏳ Session not fully loaded, redirecting to dashboard for sync");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Now we have complete user data
    const finalUserRole = userRole || "viewer";

    // Get required role for this route
    const requiredRole = getRequiredRole(pathname);

    if (requiredRole) {
      // Check if user has sufficient role using the centralized function
      if (!hasRoleLevel(finalUserRole, requiredRole)) {
        console.log("❌ Insufficient permissions:", {
          userRole: finalUserRole,
          requiredRole,
        });

        // Return JSON error for API routes, redirect for pages
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            {
              error: "Forbidden",
              message: `Insufficient permissions. Required: ${requiredRole}, Current: ${finalUserRole}`,
              code: "INSUFFICIENT_PERMISSIONS",
              requiredRole,
              currentRole: finalUserRole,
            },
            { status: 403 }
          );
        } else {
          return NextResponse.redirect(
            new URL(
              `/unauthorized?reason=role_required&current=${finalUserRole}&required=${requiredRole}`,
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
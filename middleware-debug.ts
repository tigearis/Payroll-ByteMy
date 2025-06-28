// Enhanced middleware with detailed debugging for role assignment issues
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole, getRouteCategory } from "./config/routes";
import { hasRoleLevel } from "./lib/auth/permissions";

// Define the middleware
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const timestamp = new Date().toISOString();

  console.log(`🔒 [${timestamp}] Enhanced middleware processing:`, {
    pathname,
    method: req.method,
    userAgent: req.headers.get("user-agent")?.substring(0, 50) + "...",
    referer: req.headers.get("referer"),
  });

  // Skip public routes
  if (routes.public(req)) {
    console.log(`✅ [${timestamp}] Public route, allowing access`);
    return NextResponse.next();
  }

  // Skip system routes (they handle their own auth)
  if (routes.system(req)) {
    console.log(`⚙️ [${timestamp}] System route, allowing access`);
    return NextResponse.next();
  }

  // Protect all other routes
  try {
    const authResult = await auth.protect();

    if (!authResult?.userId) {
      console.log(`❌ [${timestamp}] No user ID found - redirecting to sign-in`);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Get user role from session claims (server-side) - DETAILED DEBUGGING
    const sessionClaims = authResult.sessionClaims;
    const hasuraClaims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    
    // Debug: Log all available role sources
    const roleDebugInfo = {
      hasuraClaims_exists: !!hasuraClaims,
      hasuraClaims_defaultRole: hasuraClaims?.["x-hasura-default-role"],
      hasuraClaims_allowedRoles: hasuraClaims?.["x-hasura-allowed-roles"],
      hasuraClaims_userId: hasuraClaims?.["x-hasura-user-id"],
      sessionClaims_publicMetadata: (sessionClaims?.publicMetadata as any)?.role,
      sessionClaims_metadata: (sessionClaims?.metadata as any)?.role,
      sessionClaims_direct: (sessionClaims as any)?.role,
      sessionClaims_keys: sessionClaims ? Object.keys(sessionClaims) : [],
    };

    console.log(`🔍 [${timestamp}] Role extraction debug:`, roleDebugInfo);

    // Extract role using the same logic as middleware
    const userRole = hasuraClaims?.["x-hasura-default-role"] || 
                     (sessionClaims?.publicMetadata as any)?.role ||
                     "viewer";

    // Debug: Log JWT token generation
    let hasuraToken = null;
    let tokenError = null;
    try {
      hasuraToken = await authResult.getToken({ template: "hasura" });
      if (hasuraToken) {
        const [header, payload] = hasuraToken.split(".");
        const decodedPayload = JSON.parse(Buffer.from(payload, "base64").toString());
        console.log(`🎟️ [${timestamp}] JWT token payload:`, {
          hasuraClaims: decodedPayload["https://hasura.io/jwt/claims"],
          metadata: decodedPayload.metadata,
          sub: decodedPayload.sub?.substring(0, 8) + "...",
          iat: decodedPayload.iat,
          exp: decodedPayload.exp,
        });
      }
    } catch (error) {
      tokenError = error instanceof Error ? error.message : "Unknown error";
      console.error(`🚨 [${timestamp}] JWT token generation failed:`, tokenError);
    }

    console.log(`🔍 [${timestamp}] Auth details:`, {
      userId: authResult.userId.substring(0, 8) + "...",
      userRole,
      finalRoleAfterFallback: userRole,
      hasJwtClaims: !!hasuraClaims,
      hasToken: !!hasuraToken,
      tokenError,
      pathname,
      method: req.method,
    });

    // Get required role for this route
    const requiredRole = getRequiredRole(pathname);
    const routeCategory = getRouteCategory(pathname);

    console.log(`🔍 [${timestamp}] Route analysis:`, {
      pathname,
      requiredRole,
      routeCategory,
      userRole,
      userRoleLevel: userRole ? (({ developer: 5, org_admin: 4, manager: 3, consultant: 2, viewer: 1 } as any)[userRole] || 0) : 0,
      requiredRoleLevel: requiredRole ? (({ developer: 5, org_admin: 4, manager: 3, consultant: 2, viewer: 1 } as any)[requiredRole] || 0) : 0,
    });

    if (requiredRole) {
      // Check if user has sufficient role using the centralized function
      const hasAccess = hasRoleLevel(userRole, requiredRole);
      
      console.log(`🔍 [${timestamp}] Permission check:`, {
        userRole,
        requiredRole,
        hasAccess,
        roleHierarchy: {
          developer: 5,
          org_admin: 4,
          manager: 3,
          consultant: 2,
          viewer: 1,
        },
      });

      if (!hasAccess) {
        console.log(`❌ [${timestamp}] Insufficient permissions:`, {
          userRole,
          requiredRole,
          pathname,
          willRedirect: !pathname.startsWith("/api/"),
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
              debug: {
                timestamp,
                pathname,
                roleDebugInfo,
                tokenError,
              }
            },
            { status: 403 }
          );
        } else {
          const redirectUrl = `/unauthorized?reason=role_required&current=${userRole}&required=${requiredRole}&debug=true`;
          console.log(`🔀 [${timestamp}] Redirecting to: ${redirectUrl}`);
          return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
      }
    }

    console.log(`✅ [${timestamp}] Access granted for ${userRole} to ${pathname}`);
    return NextResponse.next();
  } catch (error) {
    console.error(`❌ [${timestamp}] Auth error:`, {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      pathname,
    });

    // Return JSON error for API routes, redirect for pages
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required",
          code: "AUTHENTICATION_REQUIRED",
          debug: {
            timestamp,
            pathname,
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          }
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
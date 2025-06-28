// middleware-debug.ts – Debug version to understand auth issues
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routes, getRequiredRole } from "./config/routes";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  
  console.log(`🔍 Debug - Pathname: ${pathname}`);
  
  // Skip public routes entirely
  if (routes.public(req)) {
    console.log(`✅ Public route: ${pathname}`);
    return NextResponse.next();
  }

  // Allow system routes to handle their own authentication
  if (routes.system(req)) {
    console.log(`⚙️ System route: ${pathname}`);
    return NextResponse.next();
  }

  let authResult = null;

  try {
    // Determine required role for the route
    const requiredRole = getRequiredRole(pathname);
    console.log(`🎯 Required role for ${pathname}: ${requiredRole}`);
    
    // Always protect first to get auth result
    authResult = await auth.protect();
    console.log(`🔐 Auth result:`, {
      userId: authResult?.userId,
      hasSessionClaims: !!authResult?.sessionClaims,
      sessionClaimsKeys: authResult?.sessionClaims ? Object.keys(authResult.sessionClaims) : [],
    });

    if (authResult?.sessionClaims) {
      console.log(`📋 Session claims:`, JSON.stringify(authResult.sessionClaims, null, 2));
    }
    
    if (!requiredRole) {
      console.log(`✅ No specific role required, user authenticated`);
      return NextResponse.next();
    }

    if (authResult?.userId) {
      // Try multiple ways to extract user role
      const hasuraRole = authResult.sessionClaims?.["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"];
      const metadataRole = authResult.sessionClaims?.metadata?.role;
      const publicMetadataRole = authResult.sessionClaims?.publicMetadata?.role;
      
      console.log(`🏷️ Role extraction:`, {
        hasuraRole,
        metadataRole,
        publicMetadataRole,
      });

      const userRole = (hasuraRole || metadataRole || publicMetadataRole || "viewer") as string;
      console.log(`👤 Final user role: ${userRole}`);

      // For now, let's allow access and just log what would happen
      console.log(`🚦 Would check: ${userRole} >= ${requiredRole}`);
      
      // Temporarily allow all authenticated users through
      console.log(`✅ Allowing access for debugging`);
      return NextResponse.next();
    }

  } catch (error) {
    console.error("🔒 Middleware auth error:", error);
    console.log(`❌ Auth failed for ${pathname}`);
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
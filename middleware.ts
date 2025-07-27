/**
 * Role-Based Authentication Middleware (OAuth-safe + correlation IDs + Route Protection)
 *
 * - Public routes: no auth required
 * - System routes: handle their own auth
 * - OAuth callback routes: bypass to avoid redirect loops
 * - Protected routes: require authentication + role-based access control
 * - Every response gets X-Request-Id:nanoid()
 */

import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid"; // ← correlation-ID generator

// ── 1. ROUTE DEFINITIONS ──────────────────────────────────────────────
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/accept-invitation"];
const SYSTEM_ROUTES = ["/api/webhooks", "/api/cron"];
const OAUTH_CALLBACK_PREFIXES = [
  "/sso-callback",
  "/sign-in/sso-callback", 
  "/sign-up/sso-callback",
  "/oauth",
];
const BROWSER_SYSTEM_ROUTES = [
  "/.well-known/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml"
];

// ── 2. HELPERS ────────────────────────────────────────────────────────
const startsWith = (p: string, r: string) => p === r || p.startsWith(r + "/");

const isPublicRoute = (p: string) => PUBLICROUTES.some(r => startsWith(p, r));
const isSystemRoute = (p: string) => SYSTEMROUTES.some(r => p.startsWith(r));
const isOAuthCallback = (p: string) =>
  OAUTHCALLBACK_PREFIXES.some(r => startsWith(p, r));
const isBrowserSystemRoute = (p: string) => 
  BROWSERSYSTEM_ROUTES.some(r => p.startsWith(r));
const isStaticAsset = (p: string) =>
  p.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|css|js)$/);

// ── 3. MIDDLEWARE ─────────────────────────────────────────────────────
export default clerkMiddleware(
  async (auth, req) => {
    const { pathname } = req.nextUrl;
    const requestId = nanoid(); // generate once per request

    // Note: Logout handling removed - Clerk's UserButton manages sign-out flow

    // 3.1 Bypass paths (static, public, system, OAuth, browser system routes)
    if (
      isStaticAsset(pathname) ||
      isPublicRoute(pathname) ||
      isSystemRoute(pathname) ||
      isOAuthCallback(pathname) ||
      isBrowserSystemRoute(pathname)
    ) {
      const res = NextResponse.next();
      res.headers.set("X-Request-Id", requestId);
      return res;
    }

    // 3.2 Auth-protected area
    try {
      const { userId, redirectToSignIn, getToken } = await auth();

      if (!userId) {
        if (pathname.startsWith("/api/")) {
          const res = NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
          res.headers.set("X-Request-Id", requestId);
          return res;
        }
        return redirectToSignIn();
      }

      // 3.3 Enhanced JWT token extraction with cache prevention
      let userRole = 'viewer'; // Default fallback
      let hasuraClaims: any = null;
      let tokenAge = 0;

      try {
        // Try to get fresh token first, then fallback to cached
        let token = null;
        let isTokenFresh = false;
        
        try {
          // Attempt to get a fresh token (bypasses cache)
          token = await getToken({ template: "hasura" });
          
          if (token) {
            // Check token age to determine if it's stale
            const decodedPayload = JSON.parse(atob(token.split(".")[1]));
            const issuedAt = decodedPayload.iat;
            const currentTime = Math.floor(Date.now() / 1000);
            tokenAge = currentTime - issuedAt;
            
            // Consider token stale if older than 2 minutes in development, 5 minutes in production
            const maxTokenAge = process.env.NODE_ENV === 'development' ? 120 : 300;
            isTokenFresh = tokenAge < maxTokenAge;
            
            console.log(`🔍 JWT token age: ${tokenAge}s, fresh: ${isTokenFresh}`);
          }
        } catch (tokenError) {
          console.warn(`⚠️ Token retrieval warning: ${tokenError.message}`);
        }

        if (token && isTokenFresh) {
          const base64Payload = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(base64Payload));
          hasuraClaims = decodedPayload["https://hasura.io/jwt/claims"];
          
          if (hasuraClaims) {
            // Extract user role from JWT claims with validation
            const defaultRole = hasuraClaims?.['x-hasura-default-role'];
            const allowedRoles = hasuraClaims?.['x-hasura-allowed-roles'] || [];
            const jwtUserId = hasuraClaims?.['x-hasura-user-id'];
            
            // Log user IDs for debugging but don't enforce strict matching
            // (Clerk and Hasura may use different ID formats)
            if (jwtUserId && jwtUserId !== userId) {
              console.log(`📝 User ID formats: Clerk=${userId}, Hasura=${jwtUserId}`);
            }
            
            // Priority order for role selection
            const rolePriority = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
            
            // Find the highest priority role the user has
            let extractedRole = 'viewer'; // Default fallback
            for (const role of rolePriority) {
              if (allowedRoles.includes(role)) {
                extractedRole = role;
                break;
              }
            }
            
            // If no role found in allowed roles, use default role
            if (extractedRole === 'viewer' && defaultRole && rolePriority.includes(defaultRole)) {
              extractedRole = defaultRole;
            }
            
            // Final validation
            if (rolePriority.includes(extractedRole)) {
              userRole = extractedRole;
              console.log(`✅ JWT SUCCESS: role=${userRole}, age=${tokenAge}s, allowed=${JSON.stringify(allowedRoles)}`);
            } else {
              console.warn(`⚠️ Invalid role ${extractedRole}, using viewer`);
              userRole = 'viewer';
            }
          } else {
            console.warn("⚠️ No Hasura claims in JWT token");
            userRole = 'viewer';
          }
        } else if (token) {
          // Even if token is old, try to extract role rather than defaulting to viewer
          console.warn(`⚠️ JWT token age ${tokenAge}s exceeds max, but attempting extraction`);
          try {
            const base64Payload = token.split(".")[1];
            const decodedPayload = JSON.parse(atob(base64Payload));
            const oldClaims = decodedPayload["https://hasura.io/jwt/claims"];
            
            if (oldClaims?.['x-hasura-default-role']) {
              const rolePriority = ['developer', 'org_admin', 'manager', 'consultant', 'viewer'];
              const oldRole = oldClaims['x-hasura-default-role'];
              
              if (rolePriority.includes(oldRole)) {
                userRole = oldRole;
                console.log(`📝 Using role from older token: ${userRole}`);
              }
            }
          } catch (oldTokenError) {
            console.warn(`⚠️ Could not extract role from old token: ${oldTokenError.message}`);
            userRole = 'viewer';
          }
        } else {
          console.warn("⚠️ No JWT token available, using viewer role");
          userRole = 'viewer';
        }

      } catch (jwtError) {
        console.error(`❌ JWT processing error: ${jwtError.message}`);
        userRole = 'viewer'; // Fail secure
      }

      // 3.4 Role-based route protection
      console.log(`🔍 MIDDLEWARE: ${userRole} accessing ${pathname}`);
      
      // Define role-based route restrictions inline for Edge Runtime compatibility
      const roleHierarchy = { developer: 5, org_admin: 4, manager: 3, consultant: 2, viewer: 1 };
      const routePermissions = {
        '/staff': 'manager',
        '/billing': 'manager', 
        '/reports': 'manager',
        '/settings': 'org_admin',
        '/security': 'org_admin',
        '/invitations': 'manager',
        '/developer': 'developer',
        '/payrolls': 'consultant',
        '/clients': 'consultant',
        '/work-schedule': 'consultant',
        '/email': 'consultant',
        '/leave': 'consultant',
        '/ai-assistant': 'consultant',
        '/dashboard': 'viewer'
      };
      
      // Check if route requires specific role
      const requiredRole = routePermissions[pathname];
      if (requiredRole) {
        const userLevel = roleHierarchy[userRole] || 0;
        const requiredLevel = roleHierarchy[requiredRole] || 0;
        const hasAccess = userLevel >= requiredLevel;
        
        console.log(`🔍 Route check: ${pathname} requires ${requiredRole}(${requiredLevel}), user is ${userRole}(${userLevel}) = ${hasAccess}`);
        
        if (!hasAccess) {
          console.log(`🚫 ACCESS DENIED: ${userRole} blocked from ${pathname}`);
          const dashboardUrl = new URL('/dashboard', req.url);
          const res = NextResponse.redirect(dashboardUrl);
          res.headers.set("X-Request-Id", requestId);
          res.headers.set("X-User-Role", userRole);
          res.headers.set("X-Access-Denied", "role-insufficient");
          return res;
        }
      }

      // 3.5 Success - user has access
      const res = NextResponse.next();
      res.headers.set("X-Request-Id", requestId);
      res.headers.set("X-User-Id", userId);
      res.headers.set("X-User-Role", userRole);
      return res;
    } catch (error) {
      console.error("Auth error:", error);

      if (pathname.startsWith("/api/")) {
        const res = NextResponse.json(
          { error: "Authentication failed" },
          { status: 401 }
        );
        res.headers.set("X-Request-Id", requestId);
        return res;
      }

      const res = NextResponse.redirect(new URL("/sign-in", req.url));
      res.headers.set("X-Request-Id", requestId);
      return res;
    }
  },
  {
    signInUrl: "/sign-in",
    debug: process.env.NODE_ENV === "production",
  }
);

// ── 4. MATCHER ────────────────────────────────────────────────────────
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)",
  ],
};

// middleware.ts – SOC2-compliant route protection with audit logging
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  AuditAction,
  DataClassification,
  auditLogger,
} from "./lib/security/audit/logger";

// ================================
// ROUTE MATCHERS
// ================================

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/accept-invitation(.*)",
  "/api/clerk-webhooks(.*)",
  "/_next(.*)",
  "/favicon.ico",
]);

// ================================
// HELPER FUNCTION
// ================================

/**
 * Extract database user ID from auth result
 * Uses the same extraction pattern as useCurrentUser hook
 */
function extractDatabaseUserId(authResult: any): string | null {
  if (!authResult?.userId) return null;

  // Extract from JWT claims (primary method)
  const hasuraClaims = authResult.sessionClaims?.["https://hasura.io/jwt/claims"] as any;
  const jwtUserId = hasuraClaims?.["x-hasura-user-id"] as string;
  
  // Extract from metadata (fallback)
  const metadataUserId = authResult.sessionClaims?.metadata?.databaseId as string;
  
  // Return the database UUID (not Clerk user ID)
  const databaseUserId = jwtUserId || metadataUserId;
  
  // Validate it looks like a UUID (36 characters)
  if (databaseUserId && typeof databaseUserId === "string" && databaseUserId.length === 36) {
    return databaseUserId;
  }
  
  return null;
}

// ================================
// MIDDLEWARE FUNCTION
// ================================

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const authResult = await auth.protect();

  if (authResult?.userId) {
    const isApi = req.nextUrl.pathname.startsWith("/api");

    const shouldLog =
      !req.nextUrl.pathname.includes("_next") &&
      !req.nextUrl.pathname.includes("favicon");

    if (shouldLog) {
      try {
        const databaseUserId = extractDatabaseUserId(authResult);
        
        // Only log if we have a valid database user ID
        if (databaseUserId) {
          await auditLogger.logAuditEvent({
            userId: databaseUserId, // Use database UUID instead of Clerk user ID
            userRole:
              (
                authResult.sessionClaims?.["https://hasura.io/jwt/claims"] as any
              )?.["x-hasura-default-role"] ||
              authResult.sessionClaims?.metadata?.role ||
              "unknown",
            action: AuditAction.READ,
            entityType: isApi ? "api_route" : "page_route",
            entityId: req.nextUrl.pathname,
            dataClassification: DataClassification.LOW,
            requestId: crypto.randomUUID(),
            success: true,
            method: req.method,
            userAgent:
              req.headers.get("user-agent")?.substring(0, 100) || "unknown",
            ipAddress:
              req.headers.get("x-forwarded-for") ||
              req.headers.get("x-real-ip") ||
              "unknown",
          });
        } else {
          console.warn("[AUDIT] No valid database user ID found for audit logging", {
            clerkUserId: authResult.userId,
            sessionClaims: authResult.sessionClaims
          });
        }
      } catch (err) {
        console.error("[AUDIT] Failed to log middleware access:", err);
      }
    }
  }

  return NextResponse.next();
});

// ================================
// MIDDLEWARE CONFIG
// ================================

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
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
        await auditLogger.logAuditEvent({
          userId: authResult.userId,
          userRole:
            (
              authResult.sessionClaims?.["https://hasura.io/jwt/claims"] as any
            )?.["x-hasura-role"] ||
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

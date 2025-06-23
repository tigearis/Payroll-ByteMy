// app/api/auth/token/route.ts - Simple token endpoint for Apollo Client
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  logFailedLogin,
  logTokenRefresh,
} from "@/lib/security/auth-audit";
import { extractClientInfo } from "@/lib/utils/client-info";
import { SecureErrorHandler } from "@/lib/security/error-responses";

export async function GET(req: NextRequest) {
  console.log("🔍 Token endpoint called");
  try {
    // Get client IP and user agent for audit logging
    const { clientIP: ipAddress, userAgent } = extractClientInfo(req);

    console.log("🔍 Request headers:", {
      authorization: req.headers.get("authorization"),
      cookie: req.headers.get("cookie") ? "present" : "missing",
      host: req.headers.get("host"),
      userAgent,
      ipAddress,
      origin: req.headers.get("origin"),
      referer: req.headers.get("referer"),
    });

    // Get the authenticated user's session
    const authResult = await auth();
    const userId = authResult.userId;
    console.log("🔍 Auth result:", {
      hasUserId: !!userId,
      userId: `${userId?.substring(0, 8)}...`,
      sessionId: `${authResult.sessionId?.substring(0, 8)}...` || "none",
    });

    if (!userId) {
      console.log("🚨 No userId found in auth result");

      // Log failed authentication attempt
      await logFailedLogin(
        "unknown",
        ipAddress,
        userAgent,
        "No active session found",
        req,
        {
          endpoint: "/api/auth/token",
          method: "GET",
          hasAuthHeader: !!req.headers.get("authorization"),
          hasCookie: !!req.headers.get("cookie"),
        }
      );

      const error = SecureErrorHandler.authenticationError();
      return NextResponse.json(error, { status: 401 });
    }

    // Get user details for audit logging
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress || "unknown";

    // Get template token for Hasura
    const token = await authResult.getToken({ template: "hasura" });
    console.log("🔍 Generated hasura template token:", { hasToken: !!token });

    if (!token) {
      // Log failed token generation
      await logFailedLogin(
        userEmail,
        ipAddress,
        userAgent,
        "Token generation failed",
        req,
        {
          userId,
          endpoint: "/api/auth/token",
          method: "GET",
          failureStage: "token_generation",
        }
      );

      const error = SecureErrorHandler.sanitizeError(
        new Error("Token generation failed"),
        "auth_token"
      );
      return NextResponse.json(error, { status: 500 });
    }

    // Parse token to get expiry and check Session JWT V2 format - with error handling
    let expiresIn = 3600; // Default to 1 hour
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      expiresIn = payload.exp - Math.floor(Date.now() / 1000);

      // Log Session JWT V2 specific fields for monitoring
      console.log("🔍 Token details:", {
        expiresIn,
        hasSessionId: !!payload.sid,
        hasMetadata: !!payload.metadata,
        hasOrgId: !!payload.org_id,
        jwtVersion: payload.metadata ? "v2" : "v1",
        roles:
          payload.metadata?.roles ||
          payload["https://hasura.io/jwt/claims"]?.["x-hasura-allowed-roles"],
        defaultRole:
          payload.metadata?.defaultrole ||
          payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"],
      });
    } catch (parseError) {
      console.warn(
        "🔍 Failed to parse token expiry, using default:",
        parseError
      );
    }

    // Log successful token request
    await logTokenRefresh(userId, userEmail, ipAddress, userAgent, req, {
      endpoint: "/api/auth/token",
      method: "GET",
      tokenExpiresIn: expiresIn,
      jwtVersion: (() => {
        try {
          const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
          );
          return payload.metadata ? "v2" : "v1";
        } catch {
          return "unknown";
        }
      })(),
    });

    return NextResponse.json({
      token,
      expiresIn,
    });
  } catch (error) {
    console.error("Error getting token:", error);

    // Log error
    const { clientIP: errorIp, userAgent: errorUA } = extractClientInfo(req);
    await logFailedLogin(
      "unknown",
      errorIp,
      errorUA,
      error instanceof Error ? error.message : "Unknown error",
      req,
      {
        endpoint: "/api/auth/token",
        method: "GET",
        errorType:
          error instanceof Error ? error.constructor.name : "UnknownError",
        failureStage: "generalerror",
      }
    );

    const sanitizedError = SecureErrorHandler.sanitizeError(
      error,
      "auth_token_endpoint"
    );
    return NextResponse.json(sanitizedError, { status: 500 });
  }
}

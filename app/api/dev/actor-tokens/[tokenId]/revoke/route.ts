import { NextRequest, NextResponse } from "next/server";
import { withAuthParams, AuthSession } from "@/lib/auth/api-auth";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// SECURITY: Only allow in development
const isProduction = process.env.NODE_ENV === "production";

/**
 * POST /api/dev/actor-tokens/[tokenId]/revoke - Revoke an actor token
 *
 * This endpoint allows developers to revoke active actor tokens to prevent further use.
 * This is important for security and cleanup of testing sessions.
 *
 * Requirements:
 * - Only available in development environment
 * - Requires developer role
 * - Comprehensive audit logging
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/dev/actor-tokens/act_2EL6mQKzeUtoRwGuLZsznyfkIsH/revoke', {
 *   method: 'POST'
 * });
 * ```
 */
export const POST = withAuthParams(
  async (
    request: NextRequest,
    context: { params: Promise<{ tokenId: string }> },
    session: AuthSession
  ) => {
    // Production guard
    if (isProduction) {
      return NextResponse.json(
        { error: "This endpoint is only available in development mode" },
        { status: 404 }
      );
    }
    
    try {
      const { tokenId } = await context.params;

      if (!tokenId) {
        return NextResponse.json(
          { error: "Token ID is required" },
          { status: 400 }
        );
      }

      console.log("🎭 Revoking actor token:", {
        tokenId,
        revokedBy: session.userId,
      });

      // Revoke actor token via Clerk Backend API
      const revokeResponse = await fetch(
        `https://api.clerk.com/v1/actor_tokens/${tokenId}/revoke`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!revokeResponse.ok) {
        const errorData = await revokeResponse.json();
        console.error("🚨 Clerk actor token revocation failed:", errorData);

        // Handle specific error cases
        if (revokeResponse.status === 404) {
          return NextResponse.json(
            { error: "Actor token not found or already revoked" },
            { status: 404 }
          );
        }

        return NextResponse.json(
          { error: "Failed to revoke actor token", details: errorData },
          { status: revokeResponse.status }
        );
      }

      const revokedToken = await revokeResponse.json();

      // Log the actor token revocation for audit trail
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED, // Using closest available event type
        userId: session.userId,
        userRole: session.role,
        resourceType: "actor_token",
        action: "REVOKE",
        success: true,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        metadata: {
          tokenId,
          revokedBy: session.userId,
          environment: "development",
        },
        complianceNote: `Developer ${session.userId} revoked actor token ${tokenId}`,
      });

      return NextResponse.json({
        success: true,
        message: "Actor token revoked successfully",
        revokedToken: {
          id: revokedToken.id,
          status: revokedToken.status,
          revokedAt: new Date().toISOString(),
          revokedBy: {
            userId: session.userId,
            email: session.email,
            role: session.role,
          },
        },
      });
    } catch (error) {
      console.error("🚨 Actor token revocation error:", error);

      // Log failed attempt
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "actor_token",
        action: "REVOKE",
        success: false,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
          environment: "development",
        },
        complianceNote: `Failed actor token revocation attempt by developer ${session.userId}`,
      });

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requiredRole: "developer", // Only developers can revoke actor tokens
  }
);

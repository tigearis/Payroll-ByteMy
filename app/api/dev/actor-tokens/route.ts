import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/auth/api-auth";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// SECURITY: Only allow in development
const isProduction = process.env.NODE_ENV === "production";

// Input validation schemas
const CreateActorTokenSchema = z.object({
  targetUserId: z.string().min(1, "Target user ID is required"),
  expiresInSeconds: z.number().min(60).max(3600).default(600), // 1-60 minutes, default 10 minutes
  purpose: z.string().optional().default("development_testing"),
});

const RevokeActorTokenSchema = z.object({
  tokenId: z.string().min(1, "Token ID is required"),
});

type CreateActorTokenInput = z.infer<typeof CreateActorTokenSchema>;
type RevokeActorTokenInput = z.infer<typeof RevokeActorTokenSchema>;

/**
 * POST /api/dev/actor-tokens - Create an actor token for user impersonation
 *
 * This endpoint allows developers and AI systems to create actor tokens for testing purposes.
 * Actor tokens enable impersonation of users to test different role scenarios and user flows.
 *
 * Requirements:
 * - Only available in development environment
 * - Requires developer role
 * - Comprehensive audit logging
 * - Token expiration between 1-60 minutes
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/dev/actor-tokens', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     targetUserId: 'user_2a...',
 *     expiresInSeconds: 600,
 *     purpose: 'ai_testing_consultant_role'
 *   })
 * });
 * ```
 */
export const POST = withAuth(
  async (request: NextRequest, session) => {
    // Production guard
    if (isProduction) {
      return NextResponse.json(
        { error: "This endpoint is only available in development mode" },
        { status: 404 }
      );
    }
    
    try {
      // Parse and validate request body
      const body = await request.json();
      const input = CreateActorTokenSchema.parse(body);

      console.log("🎭 Creating actor token:", {
        actor: session.userId,
        target: input.targetUserId,
        purpose: input.purpose,
        expiresIn: input.expiresInSeconds,
      });

      // Get Clerk client
      const client = await clerkClient();

      // Verify target user exists
      const targetUser = await client.users.getUser(input.targetUserId);
      if (!targetUser) {
        return NextResponse.json(
          { error: "Target user not found" },
          { status: 404 }
        );
      }

      // Create actor token via Clerk Backend API
      const actorTokenResponse = await fetch(
        "https://api.clerk.com/v1/actor_tokens",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: input.targetUserId,
            expires_in_seconds: input.expiresInSeconds,
            actor: {
              sub: session.userId,
            },
          }),
        }
      );

      if (!actorTokenResponse.ok) {
        const errorData = await actorTokenResponse.json();
        console.error("🚨 Clerk actor token creation failed:", errorData);
        return NextResponse.json(
          { error: "Failed to create actor token", details: errorData },
          { status: actorTokenResponse.status }
        );
      }

      const actorToken = await actorTokenResponse.json();

      // Log the actor token creation for audit trail
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED, // Using closest available event type
        userId: session.userId,
        userRole: session.role,
        resourceType: "actor_token",
        action: "CREATE",
        success: true,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        metadata: {
          tokenId: actorToken.id,
          targetUserId: input.targetUserId,
          targetUserEmail: targetUser.emailAddresses?.[0]?.emailAddress,
          targetUserRole: targetUser.publicMetadata?.role,
          expiresInSeconds: input.expiresInSeconds,
          purpose: input.purpose,
          environment: "development",
        },
        complianceNote: `Developer ${session.userId} created actor token to impersonate user ${input.targetUserId} for ${input.purpose}`,
      });

      return NextResponse.json({
        success: true,
        actorToken: {
          id: actorToken.id,
          token: actorToken.token,
          url: actorToken.url,
          status: actorToken.status,
          expiresAt: new Date(
            Date.now() + input.expiresInSeconds * 1000
          ).toISOString(),
          actor: {
            userId: session.userId,
            email: session.email,
            role: session.role,
          },
          target: {
            userId: input.targetUserId,
            email: targetUser.emailAddresses?.[0]?.emailAddress,
            role: targetUser.publicMetadata?.role,
          },
          purpose: input.purpose,
        },
        usage: {
          consumeUrl: actorToken.url,
          consumeInstructions:
            "Visit the consumeUrl to automatically sign in as the target user",
          revokeEndpoint: `/api/dev/actor-tokens/${actorToken.id}/revoke`,
        },
      });
    } catch (error) {
      console.error("🚨 Actor token creation error:", error);

      // Log failed attempt
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "actor_token",
        action: "CREATE",
        success: false,
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
          environment: "development",
        },
        complianceNote: `Failed actor token creation attempt by developer ${session.userId}`,
      });

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid input", details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requiredRole: "developer", // Only developers can create actor tokens
  }
);

/**
 * GET /api/dev/actor-tokens - List active actor tokens (for debugging)
 */
export const GET = withAuth(
  async (request: NextRequest, session) => {
    // Production guard
    if (isProduction) {
      return NextResponse.json(
        { error: "This endpoint is only available in development mode" },
        { status: 404 }
      );
    }
    
    try {
      console.log("🎭 Listing actor tokens for developer:", session.userId);

      // Note: Clerk doesn't provide a direct API to list actor tokens
      // This endpoint returns instructions for manual management
      return NextResponse.json({
        message: "Actor token management",
        instructions: {
          create:
            "POST /api/dev/actor-tokens with { targetUserId, expiresInSeconds?, purpose? }",
          revoke: "POST /api/dev/actor-tokens/{tokenId}/revoke",
          consume: "Visit the URL returned from token creation",
        },
        security: {
          environment: "development_only",
          requiredRole: "developer",
          auditLogging: "enabled",
          tokenExpiry: "1-60 minutes",
        },
        usage: {
          aiTesting:
            "AI systems can use this to test different user roles and permissions",
          debugging: "Developers can impersonate users to debug issues",
          testing: "Automated tests can simulate different user scenarios",
        },
      });
    } catch (error) {
      console.error("🚨 Actor token listing error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  {
    requiredRole: "developer",
  }
);

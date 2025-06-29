// app/api/auth/log-event/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateAuthEventDocument, type CreateAuthEventMutation } from "@/domains/audit/graphql/generated/graphql";
import { GetUserByClerkIdDocument, type GetUserByClerkIdQuery } from "@/domains/users/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from "@/lib/security/audit/logger";

const AuthEventSchema = z.object({
  eventType: z.enum([
    "login_attempt",
    "login_success", 
    "login_failure",
    "logout",
    "signup_attempt",
    "signup_success",
    "signup_failure",
    "invitation_accepted",
    "password_reset",
    "mfa_challenge",
    "mfa_success",
    "mfa_failure",
    "session_timeout",
    "oauth_login",
    "oauth_failure"
  ]),
  authMethod: z.enum([
    "email_password",
    "google_oauth",
    "clerk_elements",
    "invitation_ticket",
    "password_reset",
    "mfa"
  ]).optional(),
  success: z.boolean().default(true),
  failureReason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  clientInfo: z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    timestamp: z.string().optional()
  }).optional()
});

export const POST = withAuth(async (request: NextRequest, { userId: clerkUserId }) => {
  try {
    const body = await request.json();
    const validatedData = AuthEventSchema.parse(body);
    
    const { eventType, authMethod, success, failureReason, metadata, clientInfo } = validatedData;

    // Extract client information
    const userAgent = clientInfo?.userAgent || request.headers.get("user-agent") || undefined;
    const ipAddress = clientInfo?.ipAddress || 
      request.headers.get("x-forwarded-for")?.split(",")[0] || 
      request.headers.get("x-real-ip") || 
      undefined;

    // Determine event severity based on event type
    const getEventSeverity = (eventType: string, success: boolean): LogLevel => {
      if (!success) return LogLevel.WARNING;
      
      switch (eventType) {
        case "login_success":
        case "signup_success":
        case "invitation_accepted":
          return LogLevel.INFO;
        case "login_failure":
        case "signup_failure":
        case "mfa_failure":
        case "oauth_failure":
          return LogLevel.WARNING;
        case "session_timeout":
        case "logout":
          return LogLevel.INFO;
        default:
          return LogLevel.INFO;
      }
    };

    // Determine SOC2 event type
    const getSOC2EventType = (eventType: string): SOC2EventType => {
      switch (eventType) {
        case "login_success":
        case "login_attempt":
          return SOC2EventType.LOGIN_SUCCESS;
        case "login_failure":
          return SOC2EventType.LOGIN_FAILURE;
        case "signup_success":
        case "signup_attempt":
          return SOC2EventType.USER_CREATED;
        case "invitation_accepted":
          return SOC2EventType.USER_CREATED;
        case "logout":
          return SOC2EventType.LOGOUT;
        case "mfa_success":
        case "mfa_challenge":
        case "mfa_failure":
          return SOC2EventType.MFA_SUCCESS;
        case "password_reset":
          return SOC2EventType.PASSWORD_CHANGE;
        case "session_timeout":
          return SOC2EventType.SESSION_TIMEOUT;
        default:
          return SOC2EventType.LOGIN_SUCCESS;
      }
    };

    // Log to security audit system
    await auditLogger.logSOC2Event({
      level: getEventSeverity(eventType, success),
      eventType: getSOC2EventType(eventType),
      category: LogCategory.AUTHENTICATION,
      ...(clerkUserId && { userId: clerkUserId }),
      ...(userAgent && { userAgent }),
      ...(ipAddress && { ipAddress }),
      success,
      ...(failureReason && { errorMessage: failureReason }),
      resourceType: "authentication",
      action: "client_auth_event",
      metadata: {
        authEventType: eventType,
        authMethod,
        success,
        failureReason,
        clientMetadata: metadata,
        source: "client_side"
      }
    });

    // For authenticated users, also log to the auth_events table via GraphQL
    if (clerkUserId) {
      try {
        // Get the database user ID first
        const userData = await executeTypedQuery<GetUserByClerkIdQuery>(
          GetUserByClerkIdDocument,
          { clerkUserId }
        );

        const databaseUserId = userData?.users?.[0]?.id;

        if (databaseUserId) {
          await executeTypedMutation<CreateAuthEventMutation>(
            CreateAuthEventDocument,
            {
              userId: databaseUserId,
              eventType,
              success,
              ipAddress: ipAddress || null,
              userAgent: userAgent || null,
              metadata: {
                authMethod,
                source: "client_side",
                failureReason: failureReason || null,
                ...metadata
              }
            }
          );
        }
      } catch (dbError) {
        console.warn("Failed to log auth event to database:", dbError);
        // Don't fail the request if database logging fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Auth event logged successfully",
      eventType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Auth event logging error:", error);

    // Log the logging failure itself
    await auditLogger.logSOC2Event({
      level: LogLevel.ERROR,
      eventType: SOC2EventType.SECURITY_VIOLATION,
      category: LogCategory.ERROR,
      success: false,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      resourceType: "auth_logging",
      action: "log_failure",
      metadata: { 
        error: error instanceof Error ? error.message : "Unknown error",
        source: "auth_event_logging"
      }
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid event data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to log auth event" },
      { status: 500 }
    );
  }
});
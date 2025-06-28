import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import {
  auditLogger,
  LogLevel,
  SOC2EventType,
  LogCategory,
} from "@/lib/security/audit/logger";
import {
  GetInvitationsWithStatusDocument,
  ResendInvitationEnhancedDocument,
  RevokeInvitationDocument,
} from "@/domains/users/graphql/generated/graphql";

// GraphQL operations for invitation management

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statuses = searchParams.get("statuses")?.split(",") || ["pending"];
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const { data } = await adminApolloClient.query({
      query: GetInvitationsWithStatusDocument,
      variables: {
        statuses,
        limit,
        offset,
      },
    });

    // Log audit event
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: SOC2EventType.DATA_VIEWED,
      category: LogCategory.SYSTEM_ACCESS,
      complianceNote: "User invitation list viewed",
      success: true,
      userId,
      resourceType: "user_invitation",
      action: "list_view",
      metadata: { statuses, limit, offset },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      invitations: data.userInvitations,
      total: data.userInvitationsAggregate?.aggregate?.count,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, invitationId, ...params } = body;

    let result;
    let soc2EventType;
    let complianceNote;

    switch (action) {
      case "revoke":
        const { revokeReason } = params;
        if (!revokeReason) {
          return NextResponse.json(
            { error: "Revoke reason is required" },
            { status: 400 }
          );
        }

        const { data: revokeData } = await adminApolloClient.mutate({
          mutation: RevokeInvitationDocument,
          variables: {
            invitationId,
            revokeReason,
            revokedBy: userId,
          },
        });
        result = revokeData?.updateUserInvitationById;
        soc2EventType = SOC2EventType.USER_UPDATED;
        complianceNote = "User invitation revoked";
        break;

      case "resend":
        const { newExpiresAt, newClerkTicket, newClerkInvitationId } = params;
        if (!newExpiresAt) {
          return NextResponse.json(
            { error: "New expiry date is required" },
            { status: 400 }
          );
        }

        const { data: resendData } = await adminApolloClient.mutate({
          mutation: ResendInvitationEnhancedDocument,
          variables: {
            invitationId,
            newExpiresAt,
            newClerkTicket,
            newClerkInvitationId,
          },
        });
        result = resendData?.updateUserInvitationById;
        soc2EventType = SOC2EventType.USER_UPDATED;
        complianceNote = "User invitation resent";
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Log audit event
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: soc2EventType,
      category: LogCategory.SYSTEM_ACCESS,
      complianceNote,
      success: true,
      userId,
      resourceType: "user_invitation",
      resourceId: invitationId,
      action: action,
      metadata: { action, ...params },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      invitation: result,
      success: true,
    });
  } catch (error) {
    console.error("Error managing invitation:", error);
    return NextResponse.json(
      { error: "Failed to manage invitation" },
      { status: 500 }
    );
  }
}

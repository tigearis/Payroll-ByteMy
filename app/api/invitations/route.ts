// app/api/invitations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { hasRoleLevel } from "@/lib/auth/simple-permissions";
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from "@/lib/security/audit/logger";
import { 
  GetPendingInvitationsDocument,
  GetResendableInvitationsDocument,
  GetInvitationsBySenderDocument,
  MarkExpiredInvitationsDocument,
  type GetPendingInvitationsQuery,
  type GetResendableInvitationsQuery,
  type GetInvitationsBySenderQuery,
  type MarkExpiredInvitationsMutation
} from "@/domains/auth/graphql/generated/graphql";

export const GET = withAuth(async (request, { session }) => {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view") || "pending"; // pending, resendable, sent, all
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);

    switch (view) {
      case "pending":
        // Get all pending invitations (admin/manager view)
        if (!hasRoleLevel(session.role, "manager")) {
          return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 }
          );
        }

        const pendingData = await executeTypedQuery<GetPendingInvitationsQuery>(
          GetPendingInvitationsDocument,
          { limit, offset }
        );

        return NextResponse.json({
          success: true,
          invitations: pendingData.userInvitations,
          view: "pending",
          pagination: { limit, offset, count: pendingData.userInvitations.length }
        });

      case "resendable":
        // Get invitations that can be resent by this user
        const resendableData = await executeTypedQuery<GetResendableInvitationsQuery>(
          GetResendableInvitationsDocument,
          { 
            invitedBy: session.databaseId,
            limit 
          }
        );

        return NextResponse.json({
          success: true,
          invitations: resendableData.userInvitations,
          view: "resendable",
          pagination: { limit, offset, count: resendableData.userInvitations.length }
        });

      case "sent":
        // Get invitations sent by this user
        const sentData = await executeTypedQuery<GetInvitationsBySenderQuery>(
          GetInvitationsBySenderDocument,
          { 
            invitedBy: session.databaseId,
            limit 
          }
        );

        return NextResponse.json({
          success: true,
          invitations: sentData.userInvitations,
          view: "sent",
          pagination: { limit, offset, count: sentData.userInvitations.length }
        });

      case "cleanup":
        // Mark expired invitations as expired (admin only)
        if (!hasRoleLevel(session.role, "org_admin")) {
          return NextResponse.json(
            { error: "Insufficient permissions for cleanup operations" },
            { status: 403 }
          );
        }

        const cleanupResult = await executeTypedMutation<MarkExpiredInvitationsMutation>(
          MarkExpiredInvitationsDocument
        );

        await auditLogger.logSOC2Event({
          level: LogLevel.INFO,
          eventType: SOC2EventType.USER_UPDATED,
          category: LogCategory.SYSTEM_ACCESS,
          complianceNote: "Expired invitations marked as expired",
          success: true,
          userId: session.databaseId,
          resourceType: "invitation",
          action: "cleanup_expired",
          metadata: {
            expiredCount: cleanupResult?.bulkUpdateUserInvitations?.affectedRows || 0,
            expiredInvitations: []
          }
        });

        return NextResponse.json({
          success: true,
          complianceNote: `Marked ${cleanupResult?.bulkUpdateUserInvitations?.affectedRows || 0} expired invitations`,
          expiredInvitations: []
        });

      default:
        return NextResponse.json(
          { error: "Invalid view parameter. Use: pending, resendable, sent, cleanup" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Get invitations error:", error);
    
    await auditLogger.logSOC2Event({
      level: LogLevel.ERROR,
      eventType: SOC2EventType.SECURITY_VIOLATION,
      category: LogCategory.ERROR,
      complianceNote: "Failed to retrieve invitations",
      success: false,
      userId: session.databaseId,
      resourceType: "invitation",
      action: "retrieve_failure",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      metadata: { error: error instanceof Error ? error.message : "Unknown error" }
    });

    return NextResponse.json(
      { error: "Failed to retrieve invitations" },
      { status: 500 }
    );
  }
}, { allowedRoles: ["consultant", "manager", "org_admin", "developer"] });
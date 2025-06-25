// app/api/invitations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { 
  GetPendingInvitationsDocument,
  GetResendableInvitationsDocument,
  GetInvitationsBySenderDocument,
  MarkExpiredInvitationsDocument
} from "@/domains/auth/graphql/generated/graphql";
import { withAuth } from "@/lib/auth/api-auth";
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from "@/lib/security/audit/logger";

async function GET(request: NextRequest) {
  return withAuth(async (authUser) => {
    try {
      const { searchParams } = new URL(request.url);
      const view = searchParams.get("view") || "pending"; // pending, resendable, sent, all
      const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
      const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0);

      let queryResult;

      switch (view) {
        case "pending":
          // Get all pending invitations (admin/manager view)
          if (!["developer", "org_admin", "manager"].includes(authUser.role)) {
            return NextResponse.json(
              { error: "Insufficient permissions" },
              { status: 403 }
            );
          }

          queryResult = await adminApolloClient.query({
            query: GetPendingInvitationsDocument,
            variables: { limit, offset }
          });

          return NextResponse.json({
            success: true,
            invitations: queryResult.data.userInvitations,
            view: "pending",
            pagination: { limit, offset, count: queryResult.data.userInvitations.length }
          });

        case "resendable":
          // Get invitations that can be resent by this user
          queryResult = await adminApolloClient.query({
            query: GetResendableInvitationsDocument,
            variables: { 
              invitedBy: authUser.databaseId,
              limit 
            }
          });

          return NextResponse.json({
            success: true,
            invitations: queryResult.data.userInvitations,
            view: "resendable",
            pagination: { limit, offset, count: queryResult.data.userInvitations.length }
          });

        case "sent":
          // Get all invitations sent by this user
          queryResult = await adminApolloClient.query({
            query: GetInvitationsBySenderDocument,
            variables: { 
              invitedBy: authUser.databaseId,
              limit 
            }
          });

          return NextResponse.json({
            success: true,
            invitations: queryResult.data.userInvitations,
            view: "sent",
            pagination: { limit, offset, count: queryResult.data.userInvitations.length }
          });

        case "cleanup":
          // Mark expired invitations as expired (admin only)
          if (!["developer", "org_admin"].includes(authUser.role)) {
            return NextResponse.json(
              { error: "Insufficient permissions for cleanup operations" },
              { status: 403 }
            );
          }

          const cleanupResult = await adminApolloClient.mutate({
            mutation: MarkExpiredInvitationsDocument
          });

          await auditLogger.logSOC2Event({
            level: LogLevel.INFO,
            eventType: SOC2EventType.USER_UPDATED,
            category: LogCategory.SYSTEM_ACCESS,
            message: "Expired invitations marked as expired",
            success: true,
            userId: authUser.databaseId,
            resourceType: "invitation",
            action: "cleanup_expired",
            metadata: {
              expiredCount: cleanupResult.data.bulkUpdateUserInvitations.affectedRows,
              expiredInvitations: cleanupResult.data.bulkUpdateUserInvitations.returning
            }
          });

          return NextResponse.json({
            success: true,
            message: `Marked ${cleanupResult.data.bulkUpdateUserInvitations.affectedRows} expired invitations`,
            expiredInvitations: cleanupResult.data.bulkUpdateUserInvitations.returning
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
        message: "Failed to retrieve invitations",
        success: false,
        userId: authUser.databaseId,
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
  }, { requiredRole: "consultant" })(request); // Minimum role to view own invitations
}

export { GET };
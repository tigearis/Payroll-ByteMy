// app/api/invitations/resend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { 
  GetInvitationByIdDocument,
  ResendUserInvitationDocument,
  ValidateInvitationRolePermissionsDocument
} from "@/domains/auth/graphql/generated/graphql";
import { withAuth } from "@/lib/auth/api-auth";
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from "@/lib/security/audit/logger";
import { getPermissionsForRole, Role } from "@/lib/auth/permissions";

const ResendInvitationSchema = z.object({
  invitationId: z.string().uuid("Invalid invitation ID"),
  extendDays: z.number().min(1).max(30).default(7), // Default 7 days extension
});

async function POST(request: NextRequest) {
  return withAuth(async (request, authUser) => {
    // Extract database user ID from JWT claims first
    const hasuraClaims = authUser.sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const databaseUserId = hasuraClaims?.["x-hasura-user-id"];
    
    if (!databaseUserId) {
      return NextResponse.json(
        { error: "Database user ID not found in session" },
        { status: 400 }
      );
    }

    try {
      const body = await request.json();
      const { invitationId, extendDays } = ResendInvitationSchema.parse(body);

      // 1. Get existing invitation details
      const { data: invitationData } = await adminApolloClient.query({
        query: GetInvitationByIdDocument,
        variables: { invitationId }
      });

      const invitation = invitationData.userInvitationById;
      if (!invitation) {
        return NextResponse.json(
          { error: "Invitation not found" },
          { status: 404 }
        );
      }

      // 2. Verify user has permission to resend this invitation
      const canResend = 
        invitation.invitedBy === databaseUserId || // Original inviter
        authUser.role === "developer" || // Developer can resend any
        authUser.role === "org_admin"; // Org admin can resend any

      if (!canResend) {
        await auditLogger.logSOC2Event({
          level: LogLevel.WARNING,
          eventType: SOC2EventType.SECURITY_VIOLATION,
          category: LogCategory.SECURITY_EVENT,
          complianceNote: "Unauthorized attempt to resend invitation",
          success: false,
          userId: databaseUserId,
          resourceType: "invitation",
          action: "unauthorized_resend",
          metadata: {
            invitationId,
            originalInviter: invitation.invitedBy,
            targetEmail: invitation.email
          }
        });

        return NextResponse.json(
          { error: "Insufficient permissions to resend this invitation" },
          { status: 403 }
        );
      }

      // 3. Check invitation status - only allow resending pending or expired
      if (!["pending", "expired"].includes(invitation.status)) {
        return NextResponse.json(
          { error: `Cannot resend ${invitation.status} invitation` },
          { status: 400 }
        );
      }

      // 4. Validate role permissions still apply
      const { data: permissionData } = await adminApolloClient.query({
        query: ValidateInvitationRolePermissionsDocument,
        variables: {
          invitedRole: invitation.invitedRole,
          invitedBy: databaseUserId
        }
      });

      const targetRole = permissionData.roles[0];
      if (!targetRole) {
        return NextResponse.json(
          { error: "Invalid role in invitation" },
          { status: 400 }
        );
      }

      // Role hierarchy validation for non-developers/org-admins
      if (!["developer", "org_admin"].includes(authUser.role)) {
        const userRoles = permissionData.users[0]?.assignedRoles || [];
        const userHighestPriority = Math.max(
          ...userRoles.map((ur: any) => ur.assignedRole.priority)
        );
        
        if (targetRole.priority >= userHighestPriority) {
          return NextResponse.json(
            { error: "Insufficient permissions to resend invitation with this role" },
            { status: 403 }
          );
        }
      }

      // 5. Cancel the old Clerk invitation if it exists
      const clerk = await clerkClient();
      if (invitation.clerkInvitationId) {
        try {
          await clerk.invitations.revokeInvitation(invitation.clerkInvitationId);
        } catch (clerkError) {
          console.warn("Failed to revoke old Clerk invitation:", clerkError);
          // Continue anyway - the old invitation might have already expired
        }
      }

      // 6. Create new Clerk invitation
      const newClerkInvitation = await clerk.invitations.createInvitation({
        emailAddress: invitation.email,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
        publicMetadata: {
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          role: invitation.invitedRole as Role,
          permissions: getPermissionsForRole(invitation.invitedRole as Role),
          managerId: invitation.managerId,
          invitedBy: invitation.invitedBy,
          invitationMetadata: invitation.invitationMetadata,
          originalInvitationId: invitationId // Link to original invitation
        }
      });

      // 7. Update invitation in database
      const newExpiresAt = new Date(Date.now() + extendDays * 24 * 60 * 60 * 1000);
      
      const { data: updatedInvitation } = await adminApolloClient.mutate({
        mutation: ResendUserInvitationDocument,
        variables: {
          invitationId,
          newExpiresAt: newExpiresAt.toISOString(),
          newClerkTicket: null, // Will be set when user clicks the link
          newClerkInvitationId: newClerkInvitation.id
        }
      });

      // 8. Audit logging
      await auditLogger.logSOC2Event({
        level: LogLevel.INFO,
        eventType: SOC2EventType.USER_CREATED,
        category: LogCategory.AUTHENTICATION,
        complianceNote: "User invitation resent successfully",
        success: true,
        userId: databaseUserId,
        resourceType: "invitation",
        action: "resend",
        metadata: {
          invitationId,
          targetEmail: invitation.email,
          role: invitation.invitedRole,
          newExpiresAt: newExpiresAt.toISOString(),
          newClerkInvitationId: newClerkInvitation.id,
          originalClerkInvitationId: invitation.clerkInvitationId,
          extendDays
        }
      });

      return NextResponse.json({
        success: true,
        invitation: {
          id: invitationId,
          email: invitation.email,
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          role: invitation.invitedRole,
          status: "pending",
          originalInvitedAt: invitation.createdAt,
          newExpiresAt: newExpiresAt.toISOString(),
          resentAt: new Date().toISOString(),
          resentBy: authUser.email,
          clerkInvitationId: newClerkInvitation.id
        }
      });

    } catch (error) {
      console.error("Invitation resend error:", error);
      
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        eventType: SOC2EventType.SECURITY_VIOLATION,
        category: LogCategory.ERROR,
        complianceNote: "Failed to resend user invitation",
        success: false,
        userId: databaseUserId,
        resourceType: "invitation",
        action: "resend_failure",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        metadata: { error: error instanceof Error ? error.message : "Unknown error" }
      });

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid input data", details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to resend invitation" },
        { status: 500 }
      );
    }
  }, { requiredRole: "manager" })(request);
}

export { POST };
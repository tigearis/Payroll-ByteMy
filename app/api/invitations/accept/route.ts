// app/api/invitations/accept/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import {
  GetInvitationByTicketDocument,
  CompleteInvitationAcceptanceDocument,
  AssignInvitationRoleDocument,
  GetAllRolesDocument,
  type GetInvitationByTicketQuery,
  type CompleteInvitationAcceptanceMutation,
  type AssignInvitationRoleMutation,
  type GetAllRolesQuery,
} from "@/domains/auth/graphql/generated/graphql";
import {
  auditLogger,
  LogLevel,
  SOC2EventType,
  LogCategory,
} from "@/lib/security/audit/logger";

const AcceptInvitationSchema = z.object({
  clerkTicket: z.string().min(1, "Invitation ticket is required"),
  clerkUserId: z.string().min(1, "Clerk user ID is required"),
  userEmail: z.string().email("Valid email is required"),
  userName: z.string().min(1, "User name is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clerkTicket, clerkUserId, userEmail, userName } =
      AcceptInvitationSchema.parse(body);

    // 1. Validate and get invitation details
    const invitationData = await executeTypedQuery<GetInvitationByTicketQuery>(
      GetInvitationByTicketDocument,
      { clerkTicket }
    );

    const invitation = invitationData.userInvitations[0];
    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 404 }
      );
    }

    // 2. Verify invitation hasn't expired
    const now = new Date();
    const expiresAt = new Date(invitation.expiresAt);
    if (now > expiresAt) {
      await auditLogger.logSOC2Event({
        level: LogLevel.WARNING,
        eventType: SOC2EventType.SECURITY_VIOLATION,
        category: LogCategory.SECURITY_EVENT,
        errorMessage: "Attempt to accept expired invitation",
        success: false,
        resourceType: "invitation",
        action: "accept_expired",
        metadata: {
          invitationId: invitation.id,
          email: invitation.email,
          expiresAt: invitation.expiresAt,
          attemptedAcceptanceTime: now.toISOString(),
        },
      });

      return NextResponse.json(
        { error: "This invitation has expired" },
        { status: 410 }
      );
    }

    // 3. Verify email matches invitation
    if (userEmail.toLowerCase() !== invitation.email.toLowerCase()) {
      await auditLogger.logSOC2Event({
        level: LogLevel.WARNING,
        eventType: SOC2EventType.SECURITY_VIOLATION,
        category: LogCategory.SECURITY_EVENT,
        errorMessage: "Email mismatch during invitation acceptance",
        success: false,
        resourceType: "invitation",
        action: "email_mismatch",
        metadata: {
          invitationId: invitation.id,
          expectedEmail: invitation.email,
          providedEmail: userEmail,
        },
      });

      return NextResponse.json(
        { error: "Email address does not match invitation" },
        { status: 400 }
      );
    }

    // 4. Get role ID for assignment
    const rolesData = await executeTypedQuery<GetAllRolesQuery>(
      GetAllRolesDocument
    );

    const targetRole = rolesData.roles.find(
      (role: any) => role.name === invitation.invitedRole
    );
    if (!targetRole) {
      return NextResponse.json(
        { error: "Invalid role specified in invitation" },
        { status: 400 }
      );
    }

    // 5. Complete invitation acceptance (creates user)
    const acceptanceData = await executeTypedMutation<CompleteInvitationAcceptanceMutation>(
      CompleteInvitationAcceptanceDocument,
      {
        invitationId: invitation.id,
        clerkUserId,
        userEmail,
        userName,
      }
    );

    const createdUser = acceptanceData?.insertUser;
    if (!createdUser) {
      throw new Error("Failed to create user from invitation");
    }

    // 6. Assign role to the newly created user
    await executeTypedMutation<AssignInvitationRoleMutation>(
      AssignInvitationRoleDocument,
      {
        userId: createdUser.id,
        roleId: targetRole.id,
        invitationId: invitation.id,
      }
    );

    // 7. Log successful invitation acceptance
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: SOC2EventType.USER_CREATED,
      category: LogCategory.AUTHENTICATION,
      success: true,
      userId: createdUser.id,
      resourceType: "invitation",
      action: "accept_success",
      complianceNote: "User invitation accepted successfully",
      metadata: {
        invitationId: invitation.id,
        email: userEmail,
        assignedRole: invitation.invitedRole,
        invitedByUser: invitation.invitedBy,
        clerkUserId,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: invitation.invitedRole,
        isActive: createdUser.isActive,
      },
      invitation: {
        id: invitation.id,
        acceptedAt:
          acceptanceData?.updateUserInvitationById?.acceptedAt ||
          new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Invitation acceptance error:", error);

    await auditLogger.logSOC2Event({
      level: LogLevel.ERROR,
      eventType: SOC2EventType.SECURITY_VIOLATION,
      category: LogCategory.ERROR,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      success: false,
      resourceType: "invitation",
      action: "accept_failure",
      metadata: {
        error: error instanceof Error ? error.message : "Unknown error",
        context: "Failed to accept user invitation",
      },
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
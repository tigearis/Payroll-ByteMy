// app/api/invitations/accept/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import {
  GetInvitationByTicketDocument,
  CompleteInvitationAcceptanceDocument,
  AssignInvitationRoleDocument,
  GetAllRolesDocument,
} from "@/domains/auth/graphql/generated/graphql";
import {
  auditLogger,
  LogLevel,
  SOC2EventType,
  LogCategory,
} from "@/lib/security/audit/logger";
import { z } from "zod";

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
    const { data: invitationData } = await adminApolloClient.query({
      query: GetInvitationByTicketDocument,
      variables: { clerkTicket },
    });

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
    const { data: rolesData } = await adminApolloClient.query({
      query: GetAllRolesDocument,
    });

    const targetRole = rolesData.roles.find(
      role => role.name === invitation.invitedRole
    );
    if (!targetRole) {
      return NextResponse.json(
        { error: "Invalid role specified in invitation" },
        { status: 400 }
      );
    }

    // 5. Complete invitation acceptance (creates user)
    const { data: acceptanceData } = await adminApolloClient.mutate({
      mutation: CompleteInvitationAcceptanceDocument,
      variables: {
        invitationId: invitation.id,
        clerkUserId,
        userEmail,
        userName,
      },
    });

    const createdUser = acceptanceData?.insertUser;
    if (!createdUser) {
      throw new Error("Failed to create user from invitation");
    }

    // 6. Assign role to the newly created user
    await adminApolloClient.mutate({
      mutation: AssignInvitationRoleDocument,
      variables: {
        userId: createdUser.id,
        roleId: targetRole.id,
        invitationId: invitation.id,
      },
    });

    // 7. Log successful invitation acceptance
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: SOC2EventType.USER_CREATED,
      category: LogCategory.AUTHENTICATION,
      successMessage: "User invitation accepted successfully",
      success: true,
      userId: createdUser.id,
      resourceType: "invitation",
      action: "accept_success",
      metadata: {
        invitationId: invitation.id,
        email: userEmail,
        assignedRole: invitation.invitedRole,
        invitedByUser: invitation.invitedByUser?.id,
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
      errorMessage: "Failed to accept user invitation",
      success: false,
      resourceType: "invitation",
      action: "accept_failure",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        error: error instanceof Error ? error.message : "Unknown error",
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

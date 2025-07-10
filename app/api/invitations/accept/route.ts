import { NextRequest, NextResponse } from "next/server";
import {
  GetInvitationByTicketDocument,
  type GetInvitationByTicketQuery,
  AcceptInvitationEnhancedDocument,
  type AcceptInvitationEnhancedMutation,
} from "@/domains/auth/graphql/generated/graphql";
import {
  CreateUserByEmailDocument,
  type CreateUserByEmailMutation,
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";

interface AcceptInvitationRequest {
  clerkTicket: string;
  clerkUserId: string;
  userEmail: string;
  userName: string;
}

interface AcceptInvitationResponse {
  success: boolean;
  user?: any;
  invitation?: any;
  message?: string;
  error?: string;
}

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body: AcceptInvitationRequest = await req.json();
    const { clerkTicket, clerkUserId, userEmail, userName } = body;

    // Validate required fields
    if (!clerkTicket || !clerkUserId || !userEmail || !userName) {
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Missing required fields: clerkTicket, clerkUserId, userEmail, userName",
        },
        { status: 400 }
      );
    }

    // Get invitation by Clerk ticket
    const invitationData = await executeTypedQuery<GetInvitationByTicketQuery>(
      GetInvitationByTicketDocument,
      { clerkTicket }
    );

    if (!invitationData.userInvitations || invitationData.userInvitations.length === 0) {
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Invitation not found or invalid ticket",
        },
        { status: 404 }
      );
    }

    const invitation = invitationData.userInvitations[0];

    // Check if invitation is still pending and not expired
    if (invitation.status !== "pending") {
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: `Invitation cannot be accepted. Current status: ${invitation.status}`,
        },
        { status: 400 }
      );
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Invitation has expired",
        },
        { status: 400 }
      );
    }

    // Create user record in database
    const userData = await executeTypedMutation<CreateUserByEmailMutation>(
      CreateUserByEmailDocument,
      {
        name: userName,
        email: userEmail,
        role: invitation.invitedRole,
        managerId: invitation.managerId,
        isStaff: true, // Users from invitations are staff by default
        clerkUserId: clerkUserId,
      }
    );

    const newUser = userData.insertUser;

    if (!newUser) {
      return NextResponse.json<AcceptInvitationResponse>(
        {
          success: false,
          error: "Failed to create user record",
        },
        { status: 500 }
      );
    }

    // Accept the invitation
    const acceptedInvitation = await executeTypedMutation<AcceptInvitationEnhancedMutation>(
      AcceptInvitationEnhancedDocument,
      {
        invitationId: invitation.id,
        acceptedBy: newUser.id,
      }
    );

    console.log(`✅ Invitation accepted successfully: ${invitation.id}`);
    console.log(`✅ User created: ${newUser.id} (${newUser.email})`);

    return NextResponse.json<AcceptInvitationResponse>({
      success: true,
      user: newUser,
      invitation: acceptedInvitation.updateUserInvitationById,
      message: `Welcome ${userName}! Your account has been created successfully.`,
    });
  } catch (error: any) {
    console.error("Invitation acceptance error:", error);

    return NextResponse.json<AcceptInvitationResponse>(
      {
        success: false,
        error: "Failed to accept invitation",
      },
      { status: 500 }
    );
  }
});
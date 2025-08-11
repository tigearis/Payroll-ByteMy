import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { 
  GetInvitationByIdDocument as GetInvitationByIdDetailedDocument,
  type GetInvitationByIdQuery as GetInvitationByIdDetailedQuery,
  RevokeInvitationDocument,
  type RevokeInvitationMutation
} from "@/domains/auth/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface RevokeInvitationRequest {
  reason: string;
  notifyUser?: boolean;
}

interface RevokeInvitationResponse {
  success: boolean;
  invitation?: any;
  message?: string;
  error?: string;
  warnings?: string[] | undefined;
}

export const PUT = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    const body: RevokeInvitationRequest = await req.json();
    const { reason, notifyUser = false } = body;

    // Validate required fields
    if (!reason || reason.trim().length < 5) {
      return NextResponse.json<RevokeInvitationResponse>(
        { success: false, error: "Reason is required and must be at least 5 characters long" },
        { status: 400 }
      );
    }

    const warnings: string[] = [];

    // Get invitation details
    let invitationData;
    try {
      invitationData = await executeTypedQuery<GetInvitationByIdDetailedQuery>(
        GetInvitationByIdDetailedDocument,
        { invitationId: id }
      );
    } catch (queryError: any) {
      console.error("Failed to fetch invitation:", queryError);
      return NextResponse.json<RevokeInvitationResponse>(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    const invitation = invitationData.userInvitationsByPk;
    if (!invitation) {
      return NextResponse.json<RevokeInvitationResponse>(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if invitation can be revoked
    if ((invitation as any).invitationStatus === "revoked") {
      return NextResponse.json<RevokeInvitationResponse>(
        { 
          success: false, 
          error: "Invitation is already revoked",
          invitation: {
            id: invitation.id,
            email: invitation.email,
            invitationStatus: (invitation as any).invitationStatus,
            revokedAt: (invitation as any).revokedAt,
            revokeReason: (invitation as any).revokeReason,
          }
        },
        { status: 400 }
      );
    }

    // Check if invitation is already accepted
    if ((invitation as any).invitationStatus === "accepted") {
      return NextResponse.json<RevokeInvitationResponse>(
        { 
          success: false, 
          error: "Cannot revoke an accepted invitation. User has already joined the system."
        },
        { status: 400 }
      );
    }

    console.log(`🚫 Revoking invitation: ${invitation.email} (${invitation.id})`);

    try {
      // Revoke invitation in database first
      const revokedInvitationData = await executeTypedMutation<RevokeInvitationMutation>(
        RevokeInvitationDocument,
        {
          invitationId: invitation.id,
          revokeReason: reason.trim(),
          revokedBy: session.databaseId || invitation.invitedBy, // Use database user ID who is revoking
        }
      );

      const revokedInvitation = revokedInvitationData.updateUserInvitationsByPk;

      if (!revokedInvitation) {
        throw new Error("Failed to revoke invitation in database");
      }

      console.log(`✅ Database invitation revoked: ${revokedInvitation.id}`);

      // Revoke Clerk invitation if it exists
      if (invitation.clerkInvitationId) {
        try {
          console.log(`🚫 Revoking Clerk invitation: ${invitation.clerkInvitationId}`);
          
          await clerkClient.invitations.revokeInvitation(invitation.clerkInvitationId);
          
          console.log(`✅ Clerk invitation revoked: ${invitation.clerkInvitationId}`);
        } catch (clerkError: any) {
          console.error("Failed to revoke Clerk invitation:", clerkError);
          warnings.push(`Failed to revoke Clerk invitation: ${clerkError.message}`);
          
          // Don't fail the entire operation if Clerk revocation fails
          // The database record is revoked, which is the source of truth
        }
      } else {
        warnings.push("No Clerk invitation ID found - invitation may have been created without Clerk integration");
      }

      // Log the revocation for audit purposes
      console.log(`✅ Invitation revoked successfully:`, {
        invitationId: invitation.id,
        email: invitation.email,
        role: invitation.invitedRole,
        previousStatus: (invitation as any).invitationStatus,
        reason: reason.trim(),
        revokedBy: session.userId,
        clerkInvitationId: invitation.clerkInvitationId,
        hadClerkIntegration: !!invitation.clerkInvitationId,
      });

      const fullName = `${invitation.firstName} ${invitation.lastName}`.trim();
      const successMessage = `Successfully revoked invitation for ${fullName} (${invitation.email})`;

      return NextResponse.json<RevokeInvitationResponse>({
        success: true,
        invitation: {
          id: revokedInvitation.id,
          email: revokedInvitation.email,
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          invitedRole: invitation.invitedRole,
          invitationStatus: (revokedInvitation as any).invitationStatus,
          revokedAt: (revokedInvitation as any).revokedAt,
          revokeReason: (revokedInvitation as any).revokeReason,
          originalExpiresAt: invitation.expiresAt,
          originalCreatedAt: invitation.createdAt,
        },
        message: successMessage,
        warnings: warnings.length > 0 ? warnings : undefined,
      });

    } catch (error: any) {
      console.error("Failed to revoke invitation:", error);
      
      return NextResponse.json<RevokeInvitationResponse>(
        { 
          success: false, 
          error: `Failed to revoke invitation: ${error.message}`,
          warnings
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Revoke invitation error:", error);

    return NextResponse.json<RevokeInvitationResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
});

// GET endpoint to check invitation revocation status and details
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;

    const invitationData = await executeTypedQuery<GetInvitationByIdDetailedQuery>(
      GetInvitationByIdDetailedDocument,
      { invitationId: id }
    );

    const invitation = invitationData.userInvitationsByPk;
    if (!invitation) {
      return NextResponse.json<RevokeInvitationResponse>(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    const canRevoke = !["revoked", "accepted"].includes((invitation as any).invitationStatus);
    const isExpired = (invitation as any).invitationStatus === "expired" || 
                    new Date(invitation.expiresAt) < new Date();

    return NextResponse.json<RevokeInvitationResponse>({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        firstName: invitation.firstName,
        lastName: invitation.lastName,
        invitedRole: invitation.invitedRole,
        invitationStatus: (invitation as any).invitationStatus,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        revokedAt: (invitation as any).revokedAt,
        revokeReason: (invitation as any).revokeReason,
        canRevoke,
        isExpired,
        isRevoked: (invitation as any).invitationStatus === "revoked",
        isAccepted: (invitation as any).invitationStatus === "accepted",
        clerkInvitationId: invitation.clerkInvitationId,
        daysUntilExpiry: !isExpired && (invitation as any).invitationStatus === "pending" ? 
          Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 
          null,
      },
      message: canRevoke 
        ? "Invitation can be revoked"
        : `Invitation cannot be revoked (status: ${(invitation as any).invitationStatus})`,
    });

  } catch (error: any) {
    console.error("Get invitation revoke info error:", error);

    return NextResponse.json<RevokeInvitationResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
});
import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { 
  GetInvitationByIdDocument as GetInvitationByIdDetailedDocument,
  type GetInvitationByIdQuery as GetInvitationByIdDetailedQuery,
  ResendInvitationEnhancedDocument,
  type ResendInvitationEnhancedMutation
} from "@/domains/auth/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";
import { 
  getHierarchicalPermissionsFromDatabase,
  type UserRole as HierarchicalUserRole 
} from "@/lib/permissions/hierarchical-permissions";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface ResendInvitationRequest {
  expiryDays?: number;
  message?: string;
  updateRole?: string;
  force?: boolean;
}

interface ResendInvitationResponse {
  success: boolean;
  invitation?: any;
  clerkInvitation?: any;
  message?: string;
  error?: string;
  warnings?: string[];
}

export const POST = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    const body: ResendInvitationRequest = await req.json();
    const { 
      expiryDays = 7, 
      message,
      updateRole,
      force = false 
    } = body;

    // Validate expiry days
    if (expiryDays < 1 || expiryDays > 30) {
      return NextResponse.json<ResendInvitationResponse>(
        { success: false, error: "Expiry days must be between 1 and 30" },
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
      return NextResponse.json<ResendInvitationResponse>(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    const invitation = invitationData.userInvitationById;
    if (!invitation) {
      return NextResponse.json<ResendInvitationResponse>(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Check if invitation can be resent
    const canResend = ["pending", "expired"].includes((invitation as any).invitationStatus);
    if (!canResend && !force) {
      return NextResponse.json<ResendInvitationResponse>(
        { 
          success: false, 
          error: `Cannot resend invitation with status: ${(invitation as any).invitationStatus}. Use force=true to override.`
        },
        { status: 400 }
      );
    }

    // Check if invitation is already accepted
    if ((invitation as any).invitationStatus === "accepted") {
      return NextResponse.json<ResendInvitationResponse>(
        { 
          success: false, 
          error: "Cannot resend an accepted invitation. User has already joined the system."
        },
        { status: 400 }
      );
    }

    // Check if invitation is revoked
    if ((invitation as any).invitationStatus === "revoked" && !force) {
      return NextResponse.json<ResendInvitationResponse>(
        { 
          success: false, 
          error: "Cannot resend a revoked invitation. Use force=true to override, or create a new invitation."
        },
        { status: 400 }
      );
    }

    console.log(`📧 Resending invitation: ${invitation.email} (${invitation.id})`);

    try {
      // Calculate new expiry date
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + expiryDays);

      let newClerkInvitation = null;

      // Create new Clerk invitation
      try {
        console.log(`📧 Creating new Clerk invitation for ${invitation.email}`);

        const roleToUse = updateRole || invitation.invitedRole;

        newClerkInvitation = await clerkClient.invitations.createInvitation({
          emailAddress: invitation.email,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
          publicMetadata: {
            role: roleToUse,
            firstName: invitation.firstName,
            lastName: invitation.lastName,
            permissions: getPermissionsForRole(roleToUse as any),
            allowedRoles: getAllowedRoles(roleToUse as any),
            resendOfInvitation: invitation.id,
            originalInvitationDate: invitation.createdAt,
            ...(invitation.managerId && { managerId: invitation.managerId }),
            ...(message && { invitationMessage: message })
          },
        });

        console.log(`✅ New Clerk invitation created: ${newClerkInvitation.id}`);

        // Revoke old Clerk invitation if it exists
        if (invitation.clerkInvitationId) {
          try {
            await clerkClient.invitations.revokeInvitation(invitation.clerkInvitationId);
            console.log(`🗑️ Revoked old Clerk invitation: ${invitation.clerkInvitationId}`);
          } catch (revokeError) {
            console.warn("Failed to revoke old Clerk invitation:", revokeError);
            warnings.push("Old Clerk invitation could not be revoked automatically");
          }
        }

      } catch (clerkError: any) {
        console.error("Failed to create new Clerk invitation:", clerkError);
        
        return NextResponse.json<ResendInvitationResponse>(
          { 
            success: false, 
            error: `Failed to resend invitation via Clerk: ${clerkError.message}`,
            warnings
          },
          { status: 500 }
        );
      }

      // Update invitation record in database
      try {
        console.log(`📝 Updating database invitation record for ${invitation.email}`);

        const updatedInvitationData = await executeTypedMutation<ResendInvitationEnhancedMutation>(
          ResendInvitationEnhancedDocument,
          {
            invitationId: invitation.id,
            newExpiresAt: newExpiresAt.toISOString(),
            newClerkTicket: null, // Clerk will set this
            newClerkInvitationId: newClerkInvitation.id,
          }
        );

        const updatedInvitation = updatedInvitationData.updateUserInvitationById;

        if (!updatedInvitation) {
          throw new Error("Failed to update invitation record in database");
        }

        console.log(`✅ Database invitation record updated: ${updatedInvitation.id}`);

        // Log the resend for audit purposes
        console.log(`✅ Invitation resent successfully:`, {
          invitationId: invitation.id,
          email: invitation.email,
          previousStatus: (invitation as any).invitationStatus,
          newStatus: (updatedInvitation as any).invitationStatus,
          previousExpiresAt: invitation.expiresAt,
          newExpiresAt: newExpiresAt.toISOString(),
          resentBy: session.userId,
          newClerkInvitationId: newClerkInvitation.id,
          oldClerkInvitationId: invitation.clerkInvitationId,
          roleUpdate: updateRole ? `${invitation.invitedRole} → ${updateRole}` : null,
        });

        const fullName = `${invitation.firstName} ${invitation.lastName}`.trim();
        const successMessage = `Invitation resent to ${fullName} (${invitation.email})${updateRole ? ` with updated role ${updateRole}` : ''}`;

        return NextResponse.json<ResendInvitationResponse>({
          success: true,
          invitation: {
            id: updatedInvitation.id,
            email: updatedInvitation.email,
            firstName: updatedInvitation.firstName,
            lastName: updatedInvitation.lastName,
            invitedRole: updatedInvitation.invitedRole || invitation.invitedRole,
            invitationStatus: (updatedInvitation as any).invitationStatus,
            expiresAt: updatedInvitation.expiresAt,
            resentAt: new Date().toISOString(),
          },
          clerkInvitation: {
            id: newClerkInvitation.id,
            status: newClerkInvitation.status,
            emailAddress: newClerkInvitation.emailAddress,
          },
          message: successMessage,
          ...(warnings.length > 0 && { warnings }),
        });

      } catch (dbError: any) {
        console.error("Failed to update database invitation record:", dbError);
        
        // New Clerk invitation was created but database update failed
        // Try to clean up the new Clerk invitation
        if (newClerkInvitation) {
          try {
            await clerkClient.invitations.revokeInvitation(newClerkInvitation.id);
            console.log(`🧹 Cleaned up new Clerk invitation after database error`);
          } catch (cleanupError) {
            console.error("Failed to cleanup new Clerk invitation:", cleanupError);
            warnings.push("New Clerk invitation may still exist despite database error");
          }
        }

        return NextResponse.json<ResendInvitationResponse>(
          { 
            success: false, 
            error: `Failed to update invitation record: ${dbError.message}`,
            warnings
          },
          { status: 500 }
        );
      }

    } catch (error: any) {
      console.error("Invitation resend error:", error);
      
      return NextResponse.json<ResendInvitationResponse>(
        { 
          success: false, 
          error: `Failed to resend invitation: ${error.message}`,
          warnings
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Resend invitation error:", error);

    return NextResponse.json<ResendInvitationResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});

// GET endpoint to check if invitation can be resent
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;

    const invitationData = await executeTypedQuery<GetInvitationByIdDetailedQuery>(
      GetInvitationByIdDetailedDocument,
      { invitationId: id }
    );

    const invitation = invitationData.userInvitationById;
    if (!invitation) {
      return NextResponse.json<ResendInvitationResponse>(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    const canResend = ["pending", "expired"].includes((invitation as any).invitationStatus);
    const isExpired = (invitation as any).invitationStatus === "expired" || 
                    new Date(invitation.expiresAt) < new Date();

    return NextResponse.json<ResendInvitationResponse>({
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
        canResend,
        isExpired,
        daysUntilExpiry: !isExpired ? 
          Math.ceil((new Date(invitation.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 
          null,
      },
    });

  } catch (error: any) {
    console.error("Get invitation resend info error:", error);

    return NextResponse.json<ResendInvitationResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});
import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { 
  CreateInvitationEnhancedDocument,
  type CreateInvitationEnhancedMutation,
  GetInvitationHistoryDocument,
  type GetInvitationHistoryQuery
} from "@/domains/auth/graphql/generated/graphql";
import { 
  GetUserByEmailDocument,
  type GetUserByEmailQuery
} from "@/domains/users/graphql/generated/graphql";
import { type UserRole } from "@/domains/users/services/user-sync";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { 
  getHierarchicalPermissionsFromDatabase,
  type UserRole as HierarchicalUserRole 
} from "@/lib/permissions/hierarchical-permissions";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

// Helper functions for role and permission management
function getPermissionsForRole(role: string): string[] {
  // This is a simplified implementation - ideally should use hierarchical system
  const rolePermissions = {
    developer: ["*"],
    org_admin: ["staff.manage", "security.manage"],
    manager: ["staff.update", "staff.read"],
    consultant: ["staff.read"],
    viewer: ["staff.read"]
  };
  
  return rolePermissions[role as keyof typeof rolePermissions] || [];
}

function getAllowedRoles(role: string): string[] {
  // Return allowed roles for each role level
  const allowedRolesByRole = {
    developer: ["developer", "org_admin", "manager", "consultant", "viewer"],
    org_admin: ["org_admin", "manager", "consultant", "viewer"],
    manager: ["manager", "consultant", "viewer"],
    consultant: ["consultant", "viewer"],
    viewer: ["viewer"]
  };
  
  return allowedRolesByRole[role as keyof typeof allowedRolesByRole] || ["viewer"];
}

function hashPermissions(permissions: string[]): string {
  // Simple hash of permissions for cache busting
  return permissions.join(",").replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
}

interface CreateInvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  managerId?: string;
  message?: string;
  expiryDays?: number;
  sendImmediately?: boolean;
}

interface CreateInvitationResponse {
  success: boolean;
  invitation?: any;
  clerkInvitation?: any;
  message?: string;
  error?: string;
  warnings?: string[];
}

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body: CreateInvitationRequest = await req.json();
    const { 
      email, 
      firstName, 
      lastName, 
      role, 
      managerId, 
      message,
      expiryDays = 7,
      sendImmediately = true 
    } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json<CreateInvitationResponse>(
        { success: false, error: "Missing required fields: email, firstName, lastName, role" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<CreateInvitationResponse>(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ["developer", "org_admin", "manager", "consultant", "viewer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json<CreateInvitationResponse>(
        { success: false, error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate expiry days
    if (expiryDays < 1 || expiryDays > 30) {
      return NextResponse.json<CreateInvitationResponse>(
        { success: false, error: "Expiry days must be between 1 and 30" },
        { status: 400 }
      );
    }

    // ✅ JWT Template: Validate permissions using JWT claims
    const { defaultRole, permissions, managerId: sessionManagerId, organizationId, isStaff } = session;
    
    if (!defaultRole) {
      return NextResponse.json<CreateInvitationResponse>(
        { success: false, error: "Invalid session - missing role information" },
        { status: 401 }
      );
    }

    // Check if user has permission to invite users
    const canInviteUsers = permissions?.includes('invitations.create') || 
                          permissions?.includes('staff.create') ||
                          ['developer', 'org_admin', 'manager'].includes(defaultRole);

    if (!canInviteUsers) {
      return NextResponse.json<CreateInvitationResponse>(
        { success: false, error: "Insufficient permissions to create invitations" },
        { status: 403 }
      );
    }

    // ✅ JWT Template: Validate role assignment hierarchy
    if (defaultRole === "manager" && ["developer", "org_admin"].includes(role)) {
      return NextResponse.json<CreateInvitationResponse>(
        { success: false, error: "Managers cannot invite users with admin or developer roles" },
        { status: 403 }
      );
    }

    const warnings: string[] = [];

    // Check if user already exists
    try {
      const existingUserData = await executeTypedQuery<GetUserByEmailQuery>(
        GetUserByEmailDocument,
        { email }
      );

      if (existingUserData.users && existingUserData.users.length > 0) {
        const existingUser = existingUserData.users[0];
        return NextResponse.json<CreateInvitationResponse>(
          { 
            success: false, 
            error: `User with email ${email} already exists in the system`,
            invitation: {
              existingUser: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                isActive: existingUser.isActive
              }
            }
          },
          { status: 409 }
        );
      }
    } catch (queryError) {
      console.warn("Error checking existing user:", queryError);
      warnings.push("Could not verify if user already exists");
    }

    // Check for existing invitations
    try {
      const invitationHistoryData = await executeTypedQuery<GetInvitationHistoryQuery>(
        GetInvitationHistoryDocument,
        { email, limit: 5 }
      );

      const existingInvitations = invitationHistoryData.userInvitations || [];
      const pendingInvitations = existingInvitations.filter(inv => 
        inv.status === "pending" && new Date(inv.expiresAt) > new Date()
      );

      if (pendingInvitations.length > 0) {
        const latestPending = pendingInvitations[0];
        return NextResponse.json<CreateInvitationResponse>(
          { 
            success: false, 
            error: `There is already a pending invitation for ${email}`,
            invitation: {
              existingInvitation: {
                id: latestPending.id,
                email: latestPending.email,
                role: latestPending.invitedRole,
                status: latestPending.status,
                expiresAt: latestPending.expiresAt,
                invitedAt: latestPending.invitedAt
              }
            }
          },
          { status: 409 }
        );
      }

      if (existingInvitations.length > 0) {
        warnings.push(`User has ${existingInvitations.length} previous invitation(s)`);
      }
    } catch (historyError) {
      console.warn("Error checking invitation history:", historyError);
      warnings.push("Could not verify invitation history");
    }

    console.log(`📧 Creating invitation for ${email} with role ${role}`);

    try {
      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);

      let clerkInvitation = null;
      let invitation = null;

      if (sendImmediately) {
        // Create Clerk invitation first
        try {
          console.log(`📧 Creating Clerk invitation for ${email}`);

          // Structure invitation metadata to match JWT template expectations
          const userPermissions = getPermissionsForRole(role);
          const allowedRoles = getAllowedRoles(role);
          const permissionHash = hashPermissions(userPermissions);
          
          clerkInvitation = await clerkClient.invitations.createInvitation({
            emailAddress: email,
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
            publicMetadata: {
              role,
              firstName,
              lastName,
              permissions: userPermissions,
              permissionHash: permissionHash,
              permissionVersion: "1.0", 
              allowedRoles: allowedRoles,
              ...(managerId && { managerId }),
              ...(message && { invitationMessage: message }),
            },
          });

          console.log(`✅ Clerk invitation created: ${clerkInvitation.id}`);
        } catch (clerkError: any) {
          console.error("Failed to create Clerk invitation:", clerkError);
          
          // If Clerk invitation fails, we might still want to create the database record
          // for tracking purposes, but mark it as failed
          return NextResponse.json<CreateInvitationResponse>(
            { 
              success: false, 
              error: `Failed to send invitation via Clerk: ${clerkError.message}`,
            },
            { status: 500 }
          );
        }
      }

      // Create invitation record in database
      try {
        console.log(`📝 Creating database invitation record for ${email}`);

        const invitationData = await executeTypedMutation<CreateInvitationEnhancedMutation>(
          CreateInvitationEnhancedDocument,
          {
            email,
            firstName,
            lastName,
            invitedRole: role,
            managerId: managerId || null,
            clerkInvitationId: clerkInvitation?.id || null,
            clerkTicket: null, // Clerk will set this in the callback
            invitationMetadata: {
              clerkInvitationId: clerkInvitation?.id || null,
              redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
              message: message || null,
              expiryDays,
              sentImmediately: sendImmediately,
            },
            invitedBy: session.databaseId || "00000000-0000-0000-0000-000000000000", // ✅ JWT Template: Use database ID from session
            expiresAt: expiresAt.toISOString(),
          }
        );

        invitation = invitationData.insertUserInvitation;

        if (!invitation) {
          throw new Error("Failed to create invitation record in database");
        }

        console.log(`✅ Database invitation record created: ${invitation.id}`);
      } catch (dbError: any) {
        console.error("Failed to create database invitation record:", dbError);
        
        // If we created a Clerk invitation but database record failed,
        // we should try to clean up the Clerk invitation
        if (clerkInvitation) {
          try {
            await clerkClient.invitations.revokeInvitation(clerkInvitation.id);
            console.log(`🧹 Cleaned up Clerk invitation after database error`);
          } catch (cleanupError) {
            console.error("Failed to cleanup Clerk invitation:", cleanupError);
            warnings.push("Clerk invitation may still exist despite database error");
          }
        }

        return NextResponse.json<CreateInvitationResponse>(
          { 
            success: false, 
            error: `Failed to create invitation record: ${dbError.message}`,
            warnings
          },
          { status: 500 }
        );
      }

      // Log the invitation creation for audit purposes
      console.log(`✅ Invitation created successfully:`, {
        invitationId: invitation.id,
        email,
        role,
        invitedBy: session.databaseId, // ✅ JWT Template: Use database ID from session
        clerkInvitationId: clerkInvitation?.id,
        expiresAt: expiresAt.toISOString(),
        sentImmediately: sendImmediately,
      });

      const fullName = `${firstName} ${lastName}`.trim();
      const successMessage = sendImmediately 
        ? `Invitation sent to ${fullName} (${email}) for role ${role}`
        : `Invitation created for ${fullName} (${email}) for role ${role} (not sent yet)`;

      return NextResponse.json<CreateInvitationResponse>({
        success: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          firstName: invitation.firstName,
          lastName: invitation.lastName,
          invitedRole: invitation.invitedRole,
          status: invitation.invitationStatus,
          expiresAt: invitation.expiresAt,
          invitedAt: invitation.createdAt,
        },
        clerkInvitation: clerkInvitation ? {
          id: clerkInvitation.id,
          status: clerkInvitation.status,
          emailAddress: clerkInvitation.emailAddress,
        } : null,
        message: successMessage,
        ...(warnings.length > 0 && { warnings }),
      });

    } catch (error: any) {
      console.error("Invitation creation error:", error);
      
      return NextResponse.json<CreateInvitationResponse>(
        { 
          success: false, 
          error: `Failed to create invitation: ${error.message}`,
          warnings
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Create invitation error:", error);

    return NextResponse.json<CreateInvitationResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
});
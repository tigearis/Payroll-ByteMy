import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import {
  CreateInvitationEnhancedDocument,
  type CreateInvitationEnhancedMutation,
} from "@/domains/auth/graphql/generated/graphql";
import {
  CreateUserByEmailDocument,
  type CreateUserByEmailMutation,
  GetUserByEmailDocument,
  type GetUserByEmailQuery,
} from "@/domains/users/graphql/generated/graphql";
import { type UserRole } from "@/domains/users/services/user-sync";
import {
  executeTypedMutation,
  executeTypedQuery,
} from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import {
  getEffectivePermissions,
  hasHierarchicalPermission,
  type UserRole as HierarchicalUserRole
} from "@/lib/permissions/hierarchical-permissions";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface CreateStaffRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  managerId?: string;
  isStaff?: boolean;
  sendInvitation?: boolean;
  skipExistingCheck?: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
}

interface InvitationData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  invitedRole: string;
  clerkInvitationId?: string;
  expiresAt?: string;
}

interface CreateStaffResponse {
  success: boolean;
  user?: UserData;
  invitation?: InvitationData;
  invitationSent?: boolean;
  message?: string;
  error?: string;
}

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body: CreateStaffRequest = await req.json();
    const {
      email,
      firstName,
      lastName,
      role,
      managerId,
      isStaff,
      sendInvitation = true,
      skipExistingCheck = false,
    } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json<CreateStaffResponse>(
        {
          success: false,
          error: "Missing required fields: email, firstName, lastName, role",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<CreateStaffResponse>(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Role assignment validation removed - any authenticated user can assign roles

    // Check if user already exists (unless explicitly skipping)
    if (!skipExistingCheck) {
      try {
        const existingUserData = await executeTypedQuery<GetUserByEmailQuery>(
          GetUserByEmailDocument,
          { email }
        );

        if (existingUserData.users && existingUserData.users.length > 0) {
          const existingUser = existingUserData.users[0];
          return NextResponse.json<CreateStaffResponse>(
            {
              success: false,
              error: `User with email ${email} already exists`,
              user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                isActive: existingUser.isActive,
              },
            },
            { status: 409 }
          );
        }
      } catch (queryError) {
        console.warn("Error checking existing user:", queryError);
        // Continue with creation if query fails
      }
    }

    let user = null;
    let invitation = null;

    if (sendInvitation) {
      // Check if we have the current user's database ID from JWT token
      if (!session.databaseId) {
        return NextResponse.json<CreateStaffResponse>(
          {
            success: false,
            error:
              "Unable to create invitation: Current user database ID not found in JWT token. Please try creating the user without sending an invitation.",
            invitationSent: false,
          },
          { status: 400 }
        );
      }

      // Send Clerk invitation and create invitation record
      try {
        console.log(`📧 Creating Clerk invitation for ${email}`);

        const clerkInvitationRequest = {
          emailAddress: email,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
          publicMetadata: {
            role,
            firstName,
            lastName,
            managerId,
            permissions: getEffectivePermissions(role),
            allowedRoles: [role], // Hierarchical system handles inheritance
          },
        };

        console.log("Invitation data being sent to Clerk:", JSON.stringify(clerkInvitationRequest, null, 2));

        // Create Clerk invitation
        const clerkInvitation = await clerkClient.invitations.createInvitation(clerkInvitationRequest);

        console.log(`✅ Clerk invitation created: ${clerkInvitation.id}`);

        // Create invitation record in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        const dbInvitationResponse =
          await executeTypedMutation<CreateInvitationEnhancedMutation>(
            CreateInvitationEnhancedDocument,
            {
              email,
              firstName,
              lastName,
              invitedRole: role,
              managerId: managerId || null,
              clerkInvitationId: clerkInvitation.id,
              clerkTicket: null, // Clerk will set this
              invitationMetadata: {
                clerkInvitationId: clerkInvitation.id,
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
              },
              invitedBy: session.databaseId, // Using database user ID from JWT token
              expiresAt: expiresAt.toISOString(),
            }
          );

        invitation = dbInvitationResponse.insertUserInvitation;

        console.log(`✅ Database invitation record created: ${invitation?.id}`);

        return NextResponse.json<CreateStaffResponse>({
          success: true,
          invitation,
          invitationSent: true,
          message: `Invitation sent to ${email} for role ${role}`,
        });
      } catch (invitationError: unknown) {
        const errorMessage = invitationError instanceof Error ? invitationError.message : 'Unknown error';
        console.error("Error creating invitation:", invitationError);
        console.error("Clerk error details:", invitationError.errors);
        console.error("Clerk trace ID:", invitationError.clerkTraceId);

        // If Clerk invitation creation failed, return error
        return NextResponse.json<CreateStaffResponse>(
          {
            success: false,
            error: `Failed to create invitation: ${errorMessage}`,
            invitationSent: false,
          },
          { status: 500 }
        );
      }
    } else {
      // Create user directly without invitation
      try {
        console.log(`👤 Creating user directly: ${email}`);

        const fullName = `${firstName} ${lastName}`.trim();

        // Create user record in database
        const userData = await executeTypedMutation<CreateUserByEmailMutation>(
          CreateUserByEmailDocument,
          {
            name: fullName,
            email,
            role,
            managerId: managerId || null,
            isStaff: isStaff !== undefined ? isStaff : true,
            clerkUserId: null, // Will be set when/if user signs up
          }
        );

        user = userData.insertUser;

        console.log(`✅ User created in database: ${user?.id}`);

        return NextResponse.json<CreateStaffResponse>({
          success: true,
          user,
          invitationSent: false,
          message: `User ${fullName} created with role ${role}`,
        });
      } catch (userError: unknown) {
        const errorMessage = userError instanceof Error ? userError.message : 'Unknown error';
        console.error("Error creating user:", userError);

        return NextResponse.json<CreateStaffResponse>(
          {
            success: false,
            error: `Failed to create user: ${errorMessage}`,
          },
          { status: 500 }
        );
      }
    }
  } catch (error: unknown) {
    console.error("Staff creation error:", error);

    return NextResponse.json<CreateStaffResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
});

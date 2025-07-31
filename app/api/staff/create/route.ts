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
  getEffectivePermissions
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
  firstName: string;
  lastName: string;
  computedName?: string | null;
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
    console.log("🚀 Staff creation API called");
    console.log("📋 Session data:", {
      userId: session.userId,
      databaseId: session.databaseId,
      email: session.email,
      role: session.role,
      permissions: session.permissions?.length || 0,
    });

    const body: CreateStaffRequest = await req.json();
    console.log("📝 Request body:", body);
    
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
      console.log("❌ Missing required fields");
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
        console.log("🔍 Checking for existing user:", email);
        const existingUserData = await executeTypedQuery<GetUserByEmailQuery>(
          GetUserByEmailDocument,
          { email }
        );
        console.log("✅ User check query successful");

        if (existingUserData.users && existingUserData.users.length > 0) {
          const existingUser = existingUserData.users[0];
          console.log("⚠️ User already exists:", existingUser.email);
          return NextResponse.json<CreateStaffResponse>(
            {
              success: false,
              error: `User with email ${email} already exists`,
              user: {
                id: existingUser.id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                computedName: existingUser.computedName ?? null,
                email: existingUser.email,
                role: existingUser.role,
                ...(existingUser.isActive !== null && { isActive: existingUser.isActive }),
              },
            },
            { status: 409 }
          );
        }
        console.log("✅ No existing user found, proceeding with creation");
      } catch (queryError) {
        console.warn("⚠️ Error checking existing user:", queryError);
        // Continue with creation if query fails
      }
    }

    let user = null;
    let invitation = null;

    if (sendInvitation) {
      console.log("📧 Starting invitation creation process");
      
      // Check if we have the current user's database ID from JWT token
      if (!session.databaseId) {
        console.log("❌ No database ID in session");
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

        console.log("📤 Invitation data being sent to Clerk:", JSON.stringify(clerkInvitationRequest, null, 2));

        // Create Clerk invitation
        console.log("🔄 Calling Clerk API...");
        const clerkInvitation = await clerkClient.invitations.createInvitation(clerkInvitationRequest);
        console.log(`✅ Clerk invitation created successfully: ${clerkInvitation.id}`);

        // Create invitation record in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        const mutationVariables = {
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
        };

        console.log("🔄 Creating database invitation record with variables:", JSON.stringify(mutationVariables, null, 2));

        const dbInvitationResponse =
          await executeTypedMutation<CreateInvitationEnhancedMutation>(
            CreateInvitationEnhancedDocument,
            mutationVariables
          );

        console.log("✅ GraphQL mutation executed successfully");
        invitation = dbInvitationResponse.insertUserInvitations?.returning?.[0];
        console.log(`✅ Database invitation record created: ${invitation?.id}`);

        const response: CreateStaffResponse = {
          success: true,
          invitationSent: true,
          message: `Invitation sent to ${email} for role ${role}`,
        };
        
        if (invitation) {
          // Sanitize invitation object to match InvitationData type
          const sanitizedInvitation: any = {
            id: invitation.id,
            email: invitation.email,
            firstName: invitation.firstName,
            lastName: invitation.lastName,
            invitedRole: invitation.invitedRole,
            invitationStatus: invitation.invitationStatus,
            createdAt: invitation.createdAt,
            updatedAt: invitation.updatedAt,
          };
          
          // Only include non-null optional properties
          if (invitation.managerId) sanitizedInvitation.managerId = invitation.managerId;
          if (invitation.clerkInvitationId) sanitizedInvitation.clerkInvitationId = invitation.clerkInvitationId;
          if (invitation.clerkTicket) sanitizedInvitation.clerkTicket = invitation.clerkTicket;
          if (invitation.expiresAt) sanitizedInvitation.expiresAt = invitation.expiresAt;
          if (invitation.acceptedAt) sanitizedInvitation.acceptedAt = invitation.acceptedAt;
          if (invitation.acceptedBy) sanitizedInvitation.acceptedBy = invitation.acceptedBy;
          if (invitation.invitedBy) sanitizedInvitation.invitedBy = invitation.invitedBy;
          if (invitation.revokedAt) sanitizedInvitation.revokedAt = invitation.revokedAt;
          if (invitation.revokedBy) sanitizedInvitation.revokedBy = invitation.revokedBy;
          if ((invitation as any).notes) sanitizedInvitation.notes = (invitation as any).notes;
          
          response.invitation = sanitizedInvitation;
        }
        
        return NextResponse.json(response);
      } catch (invitationError: unknown) {
        const errorMessage = invitationError instanceof Error ? invitationError.message : 'Unknown error';
        console.error("❌ INVITATION CREATION ERROR:", invitationError);
        
        let userFriendlyMessage = errorMessage;
        let statusCode = 500;
        
        // Enhanced error logging and Clerk-specific error handling
        if (invitationError && typeof invitationError === 'object') {
          const errorObj = invitationError as any;
          console.error("🔍 Error details:");
          console.error("  - Message:", errorObj.message);
          console.error("  - Stack:", errorObj.stack);
          console.error("  - Clerk errors:", errorObj.errors);
          console.error("  - Clerk trace ID:", errorObj.clerkTraceId);
          console.error("  - GraphQL errors:", errorObj.graphQLErrors);
          console.error("  - Network error:", errorObj.networkError);
          
          // Handle Clerk-specific errors
          if (errorObj.errors && Array.isArray(errorObj.errors)) {
            const clerkError = errorObj.errors[0];
            if (clerkError?.code === 'form_identifier_exists') {
              userFriendlyMessage = `The email address ${email} is already registered in the system. Please use a different email address or check if the user already exists.`;
              statusCode = 409; // Conflict
            } else if (clerkError?.code === 'form_param_format_invalid') {
              userFriendlyMessage = `Invalid email format: ${email}. Please provide a valid email address.`;
              statusCode = 400; // Bad Request
            } else if (clerkError?.code === 'form_param_missing') {
              userFriendlyMessage = 'Missing required information for invitation. Please fill in all required fields.';
              statusCode = 400; // Bad Request
            } else if (clerkError?.message) {
              userFriendlyMessage = `Invitation failed: ${clerkError.message}`;
            }
          }
          
          // Handle GraphQL errors
          if (errorObj.graphQLErrors && Array.isArray(errorObj.graphQLErrors)) {
            const graphqlError = errorObj.graphQLErrors[0];
            if (graphqlError?.extensions?.code === 'permission-error') {
              userFriendlyMessage = 'You do not have permission to create invitations. Please contact your administrator.';
              statusCode = 403; // Forbidden
            } else if (graphqlError?.message?.includes('violates check constraint')) {
              userFriendlyMessage = 'Invalid invitation data. Please check all fields and try again.';
              statusCode = 422; // Unprocessable Entity
            }
          }
        }

        return NextResponse.json<CreateStaffResponse>(
          {
            success: false,
            error: userFriendlyMessage,
            invitationSent: false,
          },
          { status: statusCode }
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
            firstName,
            lastName,
            email,
            role,
            managerId: managerId || null,
            isStaff: isStaff !== undefined ? isStaff : true,
            clerkUserId: null, // Will be set when/if user signs up
          }
        );

        user = userData.insertUsers?.returning?.[0];

        console.log(`✅ User created in database: ${user?.id}`);

        const response: CreateStaffResponse = {
          success: true,
          invitationSent: false,
          message: `User ${fullName} created with role ${role}`,
        };
        
        if (user) {
          // Sanitize user object to match UserData type
          const sanitizedUser: any = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          };
          
          // Only include non-null optional properties
          if (user.clerkUserId) sanitizedUser.clerkUserId = user.clerkUserId;
          if (user.createdAt) sanitizedUser.createdAt = user.createdAt;
          if (user.updatedAt) sanitizedUser.updatedAt = user.updatedAt;
          if (user.computedName) sanitizedUser.computedName = user.computedName;
          if (user.isActive !== null) sanitizedUser.isActive = user.isActive;
          
          response.user = sanitizedUser;
        }
        
        return NextResponse.json(response);
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

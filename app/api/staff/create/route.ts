import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { gql } from "@apollo/client";

// GraphQL mutation to create user in database
const CREATE_STAFF_USER = gql`
  mutation CreateStaffUser(
    $name: String!
    $email: String!
    $role: user_role!
    $isStaff: Boolean!
    $managerId: uuid
    $clerkUserId: String
  ) {
    insert_users_one(
      object: {
        name: $name
        email: $email
        role: $role
        is_staff: $isStaff
        manager_id: $managerId
        clerk_user_id: $clerkUserId
        is_active: true
      }
    ) {
      id
      name
      email
      role
      clerk_user_id
      is_staff
      is_active
      created_at
      manager {
        id
        name
        email
      }
    }
  }
`;

// Check if email already exists
const CHECK_EMAIL_EXISTS = gql`
  query CheckEmailExists($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      email
      clerk_user_id
      is_active
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    console.log("🔧 API called: /api/staff/create");

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      role,
      managerId,
      is_staff = true,
      inviteToClerk = true,
    } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required" },
        { status: 400 }
      );
    }

    console.log(
      `👤 Creating user: ${name} (${email}) with role: ${role}, is_staff: ${is_staff}`
    );

    // Check if email already exists
    const { data: existingData } = await adminApolloClient.query({
      query: CHECK_EMAIL_EXISTS,
      variables: { email },
      fetchPolicy: "no-cache",
    });

    if (existingData?.users?.length > 0) {
      const existingUser = existingData.users[0];
      return NextResponse.json(
        {
          error: "Email already exists",
          details: `User with email ${email} already exists${
            !existingUser.is_active ? " (inactive)" : ""
          }`,
          existingUser: {
            id: existingUser.id,
            email: existingUser.email,
            isActive: existingUser.is_active,
          },
        },
        { status: 409 }
      );
    }

    let clerkUserId = null;

    // Send Clerk invitation if requested
    if (inviteToClerk) {
      try {
        console.log("📧 Sending Clerk invitation...");
        const client = await clerkClient();

        // Use invitations instead of direct user creation
        // This handles the case where the email might already exist
        const invitation = await client.invitations.createInvitation({
          emailAddress: email,
          // Redirect to our custom invitation acceptance page with prefilled name
          redirectUrl: `http://localhost:3000/accept-invitation?firstName=${encodeURIComponent(
            name.split(" ")[0] || name
          )}&lastName=${encodeURIComponent(
            name.split(" ").slice(1).join(" ") || ""
          )}`,
          publicMetadata: {
            // Onboarding tracking
            onboardingComplete: false,
            invitationSent: true,
            invitationSentAt: new Date().toISOString(),

            // User role and permissions
            role: role,
            isStaff: is_staff,

            // User information for prefilling
            firstName: name.split(" ")[0] || name,
            lastName: name.split(" ").slice(1).join(" ") || "",
            fullName: name,

            // Audit trail
            createdBy: userId,
            createdAt: new Date().toISOString(),
            source: "staff_creation_modal",

            // Track invitation status
            invitationStatus: "pending",
            needsResend: false,
          },
        });

        console.log(`✅ Clerk invitation sent: ${invitation.id}`);
        console.log("📧 User will receive invitation email to join");
      } catch (clerkError) {
        console.error("❌ Failed to send Clerk invitation:", clerkError);

        // Log detailed error information
        if (
          clerkError instanceof Error &&
          "errors" in clerkError &&
          Array.isArray((clerkError as any).errors)
        ) {
          const errors = (clerkError as any).errors;
          console.error("📋 Clerk error details:", errors);

          errors.forEach((error: any, index: number) => {
            console.error(`   Error ${index + 1}:`, {
              code: error.code,
              message: error.message,
              longMessage: error.longMessage,
            });
          });
        }

        console.log("⚠️ Continuing with database creation only");

        // Check if it's because user already exists
        if (
          clerkError instanceof Error &&
          "errors" in clerkError &&
          Array.isArray((clerkError as any).errors)
        ) {
          const firstError = (clerkError as any).errors[0];
          if (firstError?.code === "form_identifier_exists") {
            console.log("ℹ️ User already exists in Clerk");
          } else if (firstError?.code === "form_invitation_duplicate") {
            console.log("ℹ️ Invitation already exists for this email");
          }
        }
      }
    }

    // Create user in database
    console.log("📝 Creating user in database...");
    const { data: createData } = await adminApolloClient.mutate({
      mutation: CREATE_STAFF_USER,
      variables: {
        name,
        email,
        role,
        isStaff: is_staff,
        managerId: managerId || null,
        clerkUserId,
      },
    });

    const createdUser = createData?.insert_users_one;
    if (!createdUser) {
      // If database creation failed but Clerk user was created, we should clean up
      if (clerkUserId) {
        try {
          const client = await clerkClient();
          await client.users.deleteUser(clerkUserId);
          console.log("🧹 Cleaned up Clerk user after database failure");
        } catch (cleanupError) {
          console.error("❌ Failed to cleanup Clerk user:", cleanupError);
        }
      }

      return NextResponse.json(
        { error: "Failed to create user in database" },
        { status: 500 }
      );
    }

    console.log("✅ User created successfully");

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: createdUser,
      clerkSynced: false,
      invitationSent: inviteToClerk,
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

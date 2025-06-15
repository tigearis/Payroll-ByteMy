import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import { secureHasuraService } from "@/lib/secure-hasura-service";
import {
  auditLogger,
  AuditAction,
  DataClassification,
} from "@/lib/audit/audit-logger";
import { clerkClient } from "@clerk/nextjs/server";
import { gql } from "@apollo/client";

// GraphQL mutation to create a staff member in the database
const CREATE_STAFF_MUTATION = gql`
  mutation CreateStaff(
    $name: String!
    $email: String!
    $role: user_role!
    $managerId: uuid
  ) {
    insert_users_one(
      object: {
        name: $name
        email: $email
        role: $role
        manager_id: $managerId
        is_staff: true
      }
    ) {
      id
      name
      email
      role
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

interface ClerkError {
  errors?: Array<{
    code?: string;
    message?: string;
    longMessage?: string;
  }>;
}

export const POST = withAuth(
  async (request: NextRequest, session) => {
    console.log("🚀 Staff create API called - method:", request.method);
    console.log("🚀 Session:", { userId: session.userId, role: session.role });
    console.log("🚀 Clerk secret key present:", !!process.env.CLERK_SECRET_KEY);
    console.log("🚀 Clerk secret key starts with sk_:", process.env.CLERK_SECRET_KEY?.startsWith('sk_'));
    
    const requestId = crypto.randomUUID();

    try {
      const body = await request.json();
      const {
        name,
        email,
        role,
        managerId,
        inviteToClerk = true, // Default to sending invitation
      } = body;

      // Validate input
      if (!name || !email || !role) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Check if email already exists
      const { data: existingData, errors: queryErrors } =
        await secureHasuraService.executeAdminQuery(CHECK_EMAIL_EXISTS, {
          email,
        });

      if (queryErrors) {
        await auditLogger.log(
          {
            userId: session.userId,
            userRole: session.role,
            action: AuditAction.READ,
            entityType: "users",
            dataClassification: DataClassification.HIGH,
            requestId,
            success: false,
            errorMessage: queryErrors[0].message,
          },
          request
        );

        return NextResponse.json(
          { error: "Failed to check if email exists", details: queryErrors },
          { status: 500 }
        );
      }

      if (existingData?.users?.length > 0) {
        const existingUser = existingData.users[0];

        await auditLogger.log(
          {
            userId: session.userId,
            userRole: session.role,
            action: AuditAction.CREATE,
            entityType: "users",
            dataClassification: DataClassification.HIGH,
            requestId,
            success: false,
            errorMessage: `Email ${email} already exists`,
          },
          request
        );

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

      // Send Clerk invitation if requested
      let invitationId = null;
      let invitationSent = false;

      if (inviteToClerk) {
        try {
          // Log the attempt to send invitation
          await auditLogger.log(
            {
              userId: session.userId,
              userRole: session.role,
              action: AuditAction.CREATE,
              entityType: "clerk_invitation",
              dataClassification: DataClassification.HIGH,
              fieldsAffected: ["email", "role"],
              newValues: { email, role },
              requestId,
              success: true,
              errorMessage: "Sending Clerk invitation",
            },
            request
          );

          const client = await clerkClient();

          // Get the current domain for redirect URL
          const domain =
            process.env.NEXT_PUBLIC_APP_URL ||
            "https://payroll.app.bytemy.com.au";

          // Use invitations instead of direct user creation
          const invitation = await client.invitations.createInvitation({
            emailAddress: email,
            // Redirect to our custom invitation acceptance page with prefilled name
            redirectUrl: `${domain}/accept-invitation?firstName=${encodeURIComponent(
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
              isStaff: true,

              // User information for prefilling
              firstName: name.split(" ")[0] || name,
              lastName: name.split(" ").slice(1).join(" ") || "",
              fullName: name,

              // Audit trail
              createdBy: session.userId,
              createdAt: new Date().toISOString(),
              source: "staff_creation_api",

              // Track invitation status
              invitationStatus: "pending",
              needsResend: false,
            },
          });

          invitationId = invitation.id;
          invitationSent = true;

          // Log successful invitation
          await auditLogger.log(
            {
              userId: session.userId,
              userRole: session.role,
              action: AuditAction.CREATE,
              entityType: "clerk_invitation",
              entityId: invitation.id,
              dataClassification: DataClassification.HIGH,
              fieldsAffected: ["email", "role"],
              newValues: { email, role, invitationId: invitation.id },
              requestId,
              success: true,
            },
            request
          );
        } catch (clerkError) {
          // Log failed invitation attempt
          await auditLogger.log(
            {
              userId: session.userId,
              userRole: session.role,
              action: AuditAction.CREATE,
              entityType: "clerk_invitation",
              dataClassification: DataClassification.HIGH,
              fieldsAffected: ["email", "role"],
              newValues: { email, role },
              requestId,
              success: false,
              errorMessage:
                clerkError instanceof Error
                  ? clerkError.message
                  : "Unknown error",
            },
            request
          );

          // Log detailed error information
          await auditLogger.logSecurityEvent(
            "clerk_invitation_error",
            "error",
            {
              error:
                clerkError instanceof Error
                  ? clerkError.message
                  : "Unknown error",
              stack: clerkError instanceof Error ? clerkError.stack : undefined,
              email,
              role,
            },
            session.userId,
            request.headers.get("x-forwarded-for") || undefined
          );

          // Continue with database creation even if invitation fails
        }
      }

      // Create staff member in database
      const { data, errors } = await secureHasuraService.executeAdminMutation(
        CREATE_STAFF_MUTATION,
        {
          name,
          email,
          role,
          managerId,
        }
      );

      if (errors) {
        // Log failed attempt
        await auditLogger.log(
          {
            userId: session.userId,
            userRole: session.role,
            action: AuditAction.CREATE,
            entityType: "users",
            dataClassification: DataClassification.HIGH, // Contains PII
            fieldsAffected: ["name", "email", "role"],
            newValues: { name, email, role },
            requestId,
            success: false,
            errorMessage: errors[0].message,
          },
          request
        );

        return NextResponse.json(
          { error: "Failed to create staff member", details: errors },
          { status: 500 }
        );
      }

      // Log successful creation
      await auditLogger.log(
        {
          userId: session.userId,
          userRole: session.role,
          action: AuditAction.CREATE,
          entityType: "users",
          entityId: data.insert_users_one.id,
          dataClassification: DataClassification.HIGH,
          fieldsAffected: ["name", "email", "role", "is_staff"],
          newValues: {
            name,
            email,
            role,
            is_staff: true,
            invitationSent,
            invitationId,
          },
          requestId,
          success: true,
        },
        request
      );

      // Also log data access for compliance
      await auditLogger.logDataAccess(
        session.userId,
        "users",
        DataClassification.HIGH,
        1,
        "Create new staff member"
      );

      return NextResponse.json({
        success: true,
        data: data.insert_users_one,
        invitationSent,
        invitationId,
      });
    } catch (error: any) {
      // Log system error
      await auditLogger.logSecurityEvent(
        "staff_creation_error",
        "error",
        {
          error: error.message,
          stack: error.stack,
        },
        session.userId,
        request.headers.get("x-forwarded-for") || undefined
      );

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
  { requiredRole: "manager" } // Only managers and above can create staff
);

// Handle OPTIONS for CORS
export async function OPTIONS() {
  console.log("🔧 OPTIONS request received for staff/create");
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Debug route to test if the route is accessible
export async function GET() {
  console.log("🔧 GET request received for staff/create (debug)");
  return NextResponse.json({ 
    message: "Staff create route is accessible",
    timestamp: new Date().toISOString()
  });
}

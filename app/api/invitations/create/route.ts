// app/api/invitations/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { CreateUserInvitationDocument, ValidateInvitationRolePermissionsDocument } from "@/domains/auth/graphql/generated/graphql";
import { withAuth } from "@/lib/auth/api-auth";
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from "@/lib/security/audit/logger";
import { getPermissionsForRole } from "@/lib/auth/permissions";

const CreateInvitationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["consultant", "manager", "org_admin"], {
    errorMap: () => ({ message: "Invalid role specified" })
  }),
  managerId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional()
});

async function POST(request: NextRequest) {
  return withAuth(async (request, authUser) => {
    // Extract database user ID from JWT claims first
    const hasuraClaims = authUser.sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const databaseUserId = hasuraClaims?.["x-hasura-user-id"];
    
    if (!databaseUserId) {
      return NextResponse.json(
        { error: "Database user ID not found in session" },
        { status: 400 }
      );
    }

    try {
      const body = await request.json();
      const validatedData = CreateInvitationSchema.parse(body);
      
      const { email, firstName, lastName, role, managerId, metadata } = validatedData;

      // 1. Validate role assignment permissions
      const { data: permissionData } = await adminApolloClient.query({
        query: ValidateInvitationRolePermissionsDocument,
        variables: {
          invitedRole: role,
          invitedBy: databaseUserId
        }
      });

      // Check if user has permission to assign this role
      const userRoles = permissionData.users[0]?.assignedRoles || [];
      const targetRole = permissionData.roles[0];
      
      if (!targetRole) {
        return NextResponse.json(
          { error: "Invalid role specified" },
          { status: 400 }
        );
      }

      // Role hierarchy validation - users can only assign roles lower than their highest role
      const userHighestPriority = Math.max(
        ...userRoles.map((ur: any) => ur.assignedRole.priority)
      );
      
      if (targetRole.priority >= userHighestPriority) {
        await auditLogger.logSOC2Event({
          level: LogLevel.WARNING,
          eventType: SOC2EventType.SECURITY_VIOLATION,
          category: LogCategory.SECURITY_EVENT,
          complianceNote: "User attempted to assign role with equal or higher priority",
          success: false,
          userId: databaseUserId,
          resourceType: "role_assignment",
          action: "invalid_assignment",
          metadata: {
            attemptedRole: role,
            targetRolePriority: targetRole.priority,
            userHighestPriority,
            targetEmail: email
          }
        });

        return NextResponse.json(
          { error: "Insufficient permissions to assign this role" },
          { status: 403 }
        );
      }

      // 2. Create Clerk invitation
      const clerk = await clerkClient();
      const clerkInvitation = await clerk.invitations.createInvitation({
        emailAddress: email,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
        publicMetadata: {
          firstName,
          lastName,
          role,
          permissions: getPermissionsForRole(role),
          managerId: managerId || null,
          invitedBy: databaseUserId,
          invitationMetadata: metadata || {}
        }
      });

      // 3. Store invitation in database
      const { data: invitationData } = await adminApolloClient.mutate({
        mutation: CreateUserInvitationDocument,
        variables: {
          email,
          firstName,
          lastName,
          invitedRole: role,
          managerId: managerId || null,
          clerkInvitationId: clerkInvitation.id,
          clerkTicket: null, // Will be updated when user clicks the link
          invitationMetadata: metadata || {},
          invitedBy: databaseUserId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }
      });

      if (!invitationData?.insertUserInvitation) {
        throw new Error("Failed to create invitation in database");
      }

      // 4. Audit logging
      await auditLogger.logSOC2Event({
        level: LogLevel.INFO,
        eventType: SOC2EventType.USER_CREATED,
        category: LogCategory.AUTHENTICATION,
        complianceNote: "User invitation created successfully",
        success: true,
        userId: databaseUserId,
        resourceType: "invitation",
        action: "create",
        metadata: {
          invitationId: invitationData.insertUserInvitation.id,
          targetEmail: email,
          assignedRole: role,
          clerkInvitationId: clerkInvitation.id
        }
      });

      return NextResponse.json({
        success: true,
        invitation: {
          id: invitationData.insertUserInvitation.id,
          email,
          firstName,
          lastName,
          role,
          status: "pending",
          expiresAt: invitationData.insertUserInvitation.expiresAt,
          clerkInvitationId: clerkInvitation.id
        }
      });

    } catch (error) {
      console.error("Invitation creation error:", error);
      
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        eventType: SOC2EventType.SECURITY_VIOLATION,
        category: LogCategory.ERROR,
        complianceNote: "Failed to create user invitation",
        success: false,
        userId: databaseUserId,
        resourceType: "invitation",
        action: "create_failure",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        metadata: { error: error instanceof Error ? error.message : "Unknown error" }
      });

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid input data", details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to create invitation" },
        { status: 500 }
      );
    }
  }, { requiredRole: "manager" })(request);
}

export { POST };
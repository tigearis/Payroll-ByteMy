import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  syncUserWithDatabase,
  UserRole,
} from "@/domains/users/services/user-sync";
import { withAuth } from "@/lib/auth/api-auth";
import { getPermissionsForRole } from "@/lib/auth/permissions";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";
import { 
  authenticateServiceRequest, 
  ServiceOperation 
} from "@/lib/auth/service-auth";

// Input validation schema
const CreateStaffSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  role: z
    .enum(["developer", "org_admin", "manager", "consultant", "viewer"])
    .default("viewer"),
  is_staff: z.boolean().default(true),
  managerId: z.string().uuid().optional().nullable(),
  inviteToClerk: z.boolean().default(true),
});

type CreateStaffInput = z.infer<typeof CreateStaffSchema>;

// Validate required environment variables
function validateEnvironment(): { clerkSecretKey: string; appUrl: string } {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clerkSecretKey) {
    throw new Error("CLERK_SECRET_KEY environment variable is required");
  }

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL environment variable is required");
  }

  return { clerkSecretKey, appUrl };
}

// Enhanced Clerk invitation creation with retry logic
async function createClerkInvitation(
  clerkClient: any,
  staffInput: CreateStaffInput,
  appUrl: string,
  session: any
): Promise<{ invitation: any; sent: boolean }> {
  const invitationParams = {
    emailAddress: staffInput.email,
    redirectUrl: `${appUrl}/accept-invitation`,
    publicMetadata: {
      role: staffInput.role,
      permissions: getPermissionsForRole(staffInput.role),
      isStaff: staffInput.is_staff,
      managerId: staffInput.managerId,
      invitedBy: session.userId,
      invitationType: "staff_creation",
      name: staffInput.name,
    },
    notify: true, // Send email invitation
    ignoreExisting: false, // Fail if invitation already exists initially
  };

  console.log("📧 Creating invitation with parameters:", {
    emailAddress: invitationParams.emailAddress,
    redirectUrl: invitationParams.redirectUrl,
    notify: invitationParams.notify,
    ignoreExisting: invitationParams.ignoreExisting,
    publicMetadataKeys: Object.keys(invitationParams.publicMetadata)
  });

  try {
    const invitation = await clerkClient.invitations.createInvitation(invitationParams);
    return { invitation, sent: true };
  } catch (error: any) {
    // If invitation already exists, try with ignoreExisting: true
    if (error.errors?.some((e: any) => 
      e.code === "form_identifier_exists" || 
      e.code === "duplicate_record" ||
      e.message?.includes("already exists")
    )) {
      console.log(`⚠️ Invitation exists for ${staffInput.email}, retrying with ignoreExisting: true`);
      
      try {
        const invitation = await clerkClient.invitations.createInvitation({
          ...invitationParams,
          ignoreExisting: true
        });
        return { invitation, sent: true };
      } catch (retryError: any) {
        console.error("❌ Failed even with ignoreExisting: true:", retryError.message);
        throw retryError;
      }
    }
    
    // Re-throw other errors
    throw error;
  }
}

// Secure staff creation endpoint - admin only
const handler = withAuth(
  async (request: NextRequest, session) => {
    console.log("🔧 =========================");
    console.log("🔧 STAFF CREATION STARTING");
    console.log("🔧 POST HANDLER CALLED SUCCESSFULLY");
    console.log("🔧 =========================");
    console.log("Request method:", request.method);
    console.log("Request URL:", request.url);
    console.log("User:", session.userId, "Role:", session.role);
    console.log(
      "Session claims:",
      JSON.stringify(
        session.sessionClaims?.["https://hasura.io/jwt/claims"],
        null,
        2
      )
    );
    console.log("Environment check:", {
      hasuraUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
      hasAdminSecret: !!process.env.HASURA_ADMIN_SECRET,
      hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
      nodeEnv: process.env.NODE_ENV,
    });

    try {
      // Extract client info once
      const clientInfo = auditLogger.extractClientInfo(request);

      console.log("🔧 Starting staff creation process...");
      console.log("🔧 Request validation and environment setup...");
      
      // Step 0: Early environment validation
      try {
        validateEnvironment();
        console.log("✅ Environment variables validated");
      } catch (envError: any) {
        console.error("❌ Environment validation failed:", envError.message);
        throw new Error(`Environment configuration error: ${envError.message}`);
      }

      // Log staff creation attempt
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "staff",
        action: "CREATE_INITIATE",
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        complianceNote: "Staff creation operation initiated",
      });

      // Get and validate request body
      const body = await request.json();

      // Validate input data
      const validationResult = CreateStaffSchema.safeParse(body);
      if (!validationResult.success) {
        const errors = validationResult.error.errors
          .map(e => `${e.path.join(".")}: ${e.message}`)
          .join(", ");

        await auditLogger.logSOC2Event({
          level: LogLevel.WARNING,
          category: LogCategory.SYSTEM_ACCESS,
          eventType: SOC2EventType.USER_CREATED,
          userId: session.userId,
          userRole: session.role,
          resourceType: "staff",
          action: "CREATE",
          success: false,
          errorMessage: "Validation failed",
          ipAddress: clientInfo.ipAddress || "unknown",
          userAgent: clientInfo.userAgent || "unknown",
          metadata: {
            validationErrors: errors,
            requestBody: body,
          },
          complianceNote: "Staff creation failed - validation error",
        });

        return NextResponse.json(
          {
            error: "Validation failed",
            details: errors,
          },
          { status: 400 }
        );
      }

      const staffInput = validationResult.data;
      console.log("✅ Input validation passed");

      // Step 1: Get validated environment (already validated above)
      const { clerkSecretKey, appUrl } = validateEnvironment();

      // Step 2: Send Clerk invitation (if requested)
      let invitationSent = false;
      let invitationId = null;

      if (staffInput.inviteToClerk) {
        try {
          console.log(`📧 Sending Clerk invitation to: ${staffInput.email}`);
          console.log("📧 Environment check:", {
            hasClerkSecret: !!clerkSecretKey,
            hasClerkPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
            appUrl,
          });

          // Create Clerk client with validated secret key
          const clerkClient = createClerkClient({
            secretKey: clerkSecretKey,
          });
          console.log("📧 Clerk client created successfully");

          // Use enhanced invitation creation with retry logic
          const { invitation, sent } = await createClerkInvitation(
            clerkClient,
            staffInput,
            appUrl,
            session
          );

          invitationId = invitation.id;
          invitationSent = sent;
          console.log(`✅ Sent Clerk invitation: ${invitationId}`);
        } catch (clerkError: any) {
          console.error(`❌ Failed to send Clerk invitation:`, {
            error: clerkError,
            message: clerkError.message,
            errors: clerkError.errors,
            status: clerkError.status,
            statusText: clerkError.statusText,
            stack: clerkError.stack,
          });

          // Handle specific Clerk error cases based on documentation
          if (clerkError.errors?.some((e: any) => 
            e.code === "form_identifier_exists" || 
            e.code === "duplicate_record" ||
            e.message?.includes("already exists")
          )) {
            console.log(`⚠️ Invitation already exists for ${staffInput.email}`);
            // According to Clerk docs, we can set ignoreExisting: true to bypass this
            console.log("⚠️ Consider using ignoreExisting: true for existing invitations");
            // Continue - we'll still create the database user
          } else if (clerkError.status === 422) {
            console.error("❌ Validation error from Clerk - check invitation parameters");
            throw new Error(`Clerk invitation validation failed: ${clerkError.message}`);
          } else if (clerkError.status === 401) {
            console.error("❌ Authentication error - check CLERK_SECRET_KEY");
            throw new Error("Clerk authentication failed - invalid secret key");
          } else {
            // Log the error but continue with database-only creation
            console.log(
              `⚠️ Continuing with database-only creation due to Clerk error: ${clerkError.message}`
            );
          }
        }
      }

      // Step 3: Create user in database
      let databaseUser = null;

      try {
        console.log(`💾 Creating database user for: ${staffInput.email}`);

        // Create database user (invitation will be linked when user signs up)
        console.log(
          "💾 Using server Apollo client like working payroll routes..."
        );
        const { serverApolloClient } = await import(
          "@/lib/apollo/unified-client"
        );
        const { auth } = await import("@clerk/nextjs/server");

        // Get Clerk authentication token (same as working payroll routes)
        const authInstance = await auth();
        const token = await authInstance.getToken({ template: "hasura" });

        console.log("💾 Authentication details:", {
          hasToken: !!token,
          tokenLength: token?.length,
          hasuraUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
          hasAdminSecret: !!process.env.HASURA_ADMIN_SECRET,
        });

        // Get Apollo Client with proper authentication
        let apolloClient;
        let authHeaders = {};

        if (token) {
          console.log("💾 Using user token for GraphQL authentication");
          apolloClient = serverApolloClient;
          authHeaders = { authorization: `Bearer ${token}` };
        } else if (process.env.HASURA_ADMIN_SECRET) {
          console.log("💾 Using admin client as fallback for user creation");
          const { adminApolloClient } = await import(
            "@/lib/apollo/unified-client"
          );
          apolloClient = adminApolloClient;
          // Admin client uses the secret internally, no additional headers needed
        } else {
          throw new Error(
            "No authentication token available and no admin secret configured"
          );
        }

        // Import generated GraphQL operation
        const { CreateUserByEmailDocument } = await import(
          "@/domains/users/graphql/generated/graphql"
        );

        console.log("💾 Executing GraphQL mutation with variables:", {
          name: staffInput.name,
          email: staffInput.email,
          role: staffInput.role,
          isStaff: staffInput.is_staff,
          managerId: staffInput.managerId || null,
        });

        const { data, errors } = await apolloClient.mutate({
          mutation: CreateUserByEmailDocument,
          variables: {
            name: staffInput.name,
            email: staffInput.email,
            role: staffInput.role,
            isStaff: staffInput.is_staff,
            managerId: staffInput.managerId || null,
            clerkUserId: null, // Will be set when user accepts invitation
          },
          ...(Object.keys(authHeaders).length > 0
            ? { context: { headers: authHeaders } }
            : {}),
        });

        console.log("💾 GraphQL mutation result:", {
          hasData: !!data,
          hasErrors: !!errors,
          errors,
          data,
        });

        if (errors) {
          throw new Error(
            `Database user creation failed: ${errors.map(e => e.message).join(", ")}`
          );
        }

        databaseUser = data?.insertUser;
        console.log(`✅ Created database user successfully`);
      } catch (dbError: any) {
        console.error(`❌ Failed to create database user:`, {
          error: dbError,
          message: dbError.message,
          stack: dbError.stack,
          graphQLErrors: dbError.graphQLErrors,
          networkError: dbError.networkError,
          extraInfo: dbError.extraInfo,
        });

        await auditLogger.logSOC2Event({
          level: LogLevel.ERROR,
          category: LogCategory.SYSTEM_ACCESS,
          eventType: SOC2EventType.USER_CREATED,
          userId: session.userId,
          userRole: session.role,
          resourceType: "staff",
          action: "CREATE",
          success: false,
          errorMessage: dbError.message,
          ipAddress: clientInfo.ipAddress || "unknown",
          userAgent: clientInfo.userAgent || "unknown",
          metadata: {
            graphQLErrors: dbError.graphQLErrors,
            networkError: dbError.networkError,
          },
          complianceNote: "Staff creation failed - database error",
        });

        return NextResponse.json(
          {
            error: "Failed to create user in database",
            details: dbError.message,
            graphQLErrors: dbError.graphQLErrors,
            networkError: dbError.networkError,
          },
          { status: 500 }
        );
      }

      // Prepare response data
      const staffData = {
        id: databaseUser?.id,
        invitationId,
        name: staffInput.name,
        email: staffInput.email,
        role: staffInput.role,
        is_staff: staffInput.is_staff,
        manager_id: staffInput.managerId,
        createdBy: session.userId,
        createdAt: databaseUser?.createdAt || new Date().toISOString(),
        invitationSent,
      };

      // Log successful staff creation
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED,
        userId: session.userId,
        userRole: session.role,
        resourceId: databaseUser?.id || "unknown",
        resourceType: "staff",
        action: "CREATE",
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: {
          staffEmail: staffInput.email,
          staffRole: staffInput.role,
          invitationSent: staffData.invitationSent,
          invitationId: staffData.invitationId,
          managerId: staffInput.managerId,
        },
        complianceNote: "Staff member created successfully",
      });

      return NextResponse.json({
        success: true,
        message: staffData.invitationSent
          ? "Staff member created successfully and invitation email sent"
          : "Staff member created successfully (database only)",
        staffData: {
          id: staffData.id,
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          invitationSent: staffData.invitationSent,
          createdAt: staffData.createdAt,
        },
      });
    } catch (error: any) {
      console.error("❌ Staff creation failed - DETAILED ERROR ANALYSIS:");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Log specific error details
      if (error.message?.includes("Environment configuration")) {
        console.error("🔧 Environment Error - Check your .env file:");
        console.error("- CLERK_SECRET_KEY:", !!process.env.CLERK_SECRET_KEY);
        console.error("- NEXT_PUBLIC_APP_URL:", !!process.env.NEXT_PUBLIC_APP_URL);
        console.error("- HASURA_ADMIN_SECRET:", !!process.env.HASURA_ADMIN_SECRET);
      }
      
      if (error.graphQLErrors) {
        console.error("GraphQL Errors:", error.graphQLErrors);
      }
      
      if (error.networkError) {
        console.error("Network Error:", error.networkError);
      }
      
      if (error.code || error.status) {
        console.error("Error Code/Status:", { code: error.code, status: error.status });
      }

      try {
        const errorClientInfo = auditLogger.extractClientInfo(request);
        await auditLogger.logSOC2Event({
          level: LogLevel.ERROR,
          category: LogCategory.SYSTEM_ACCESS,
          eventType: SOC2EventType.USER_CREATED,
          userId: session.userId,
          userRole: session.role,
          resourceType: "staff",
          action: "CREATE",
          success: false,
          errorMessage: error instanceof Error ? error.message : String(error),
          ipAddress: errorClientInfo.ipAddress || "unknown",
          userAgent: errorClientInfo.userAgent || "unknown",
          metadata: {
            code: error.code,
            graphQLErrors: error.graphQLErrors,
            networkError: error.networkError,
            status: error.status,
          },
          complianceNote: "Staff creation failed - unexpected error",
        });
      } catch (logError) {
        console.error("Failed to log error:", logError);
      }

      return NextResponse.json(
        {
          error: "Staff creation failed",
          details:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          debugInfo: {
            errorName: error.name,
            errorCode: error.code,
            status: error.status,
            graphQLErrors: error.graphQLErrors,
            networkError: error.networkError,
          },
        },
        { status: 500 }
      );
    }
  },
  {
    allowedRoles: ["developer", "org_admin", "manager"], // Admins and managers can create staff
  }
);

// Debug wrapper to see if route is called at all
const debugPOST = async (request: NextRequest) => {
  console.log("🚨 DEBUG: POST route called BEFORE withAuth");
  console.log("🚨 Method:", request.method);
  console.log("🚨 URL:", request.url);
  console.log("🚨 Headers:", {
    authorization: request.headers.get("authorization"),
    "content-type": request.headers.get("content-type"),
    "user-agent": request.headers.get("user-agent"),
  });

  try {
    return await handler(request);
  } catch (error) {
    console.log("🚨 ERROR in POST handler:", error);
    throw error;
  }
};

// Export the POST method
export const POST = debugPOST;

export async function GET() {
  console.log("DEBUG: GET handler called for /api/staff/create");
  return NextResponse.json({
    message: "GET working - route is accessible",
    timestamp: new Date().toISOString(),
    methods: ["GET", "POST"],
  });
}

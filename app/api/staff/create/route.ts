import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-auth";
import { soc2Logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging/soc2-logger";
import { clerkClient } from "@clerk/nextjs/server";
import { syncUserWithDatabase, UserRole } from "@/lib/user-sync";
import { z } from "zod";

// Input validation schema
const CreateStaffSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["developer", "org_admin", "manager", "consultant", "viewer"]).default("viewer"),
  is_staff: z.boolean().default(true),
  managerId: z.string().uuid().optional().nullable(),
  inviteToClerk: z.boolean().default(true)
});

type CreateStaffInput = z.infer<typeof CreateStaffSchema>;

// Secure staff creation endpoint - admin only
export const POST = withAuth(async (request: NextRequest, session) => {
  console.log("🔧 =========================");
  console.log("🔧 STAFF CREATION STARTING");
  console.log("🔧 =========================");
  console.log("Request method:", request.method);
  console.log("Request URL:", request.url);
  console.log("User:", session.userId, "Role:", session.role);
  console.log("Session claims:", JSON.stringify(session.sessionClaims?.["https://hasura.io/jwt/claims"], null, 2));
  console.log("Environment check:", {
    hasuraUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
    hasAdminSecret: !!process.env.HASURA_ADMIN_SECRET,
    hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
    nodeEnv: process.env.NODE_ENV
  });
  
  try {

    // Log staff creation attempt
    await soc2Logger.log({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "Staff creation operation initiated",
      userId: session.userId,
      userRole: session.role,
      entityType: "staff"
    }, request);

    // Get and validate request body
    const body = await request.json();
    
    // Validate input data
    const validationResult = CreateStaffSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      
      await soc2Logger.log({
        level: LogLevel.WARNING,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
        message: "Staff creation failed - validation error",
        userId: session.userId,
        userRole: session.role,
        metadata: {
          validationErrors: errors,
          requestBody: body
        }
      }, request);
      
      return NextResponse.json({
        error: "Validation failed",
        details: errors
      }, { status: 400 });
    }
    
    const staffInput = validationResult.data;
    
    // Step 1: Send Clerk invitation (if requested)
    let invitationSent = false;
    let invitationId = null;
    
    if (staffInput.inviteToClerk) {
      try {
        console.log(`📧 Sending Clerk invitation to: ${staffInput.email}`);
        console.log('📧 Environment check:', {
          hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
          hasClerkPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
          appUrl: process.env.NEXT_PUBLIC_APP_URL
        });
        
        const client = await clerkClient();
        console.log('📧 Clerk client created successfully');
        
        // Use Clerk's invitation system - this is the correct approach
        const invitation = await client.invitations.createInvitation({
          emailAddress: staffInput.email,
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation`,
          publicMetadata: {
            role: staffInput.role,
            isStaff: staffInput.is_staff,
            managerId: staffInput.managerId,
            invitedBy: session.userId,
            invitationType: 'staff_creation',
            name: staffInput.name
          },
          notify: true // Ensure email is sent
        });
        
        invitationId = invitation.id;
        invitationSent = true;
        console.log(`✅ Sent Clerk invitation: ${invitationId}`);
        
      } catch (clerkError: any) {
        console.error(`❌ Failed to send Clerk invitation:`, {
          error: clerkError,
          message: clerkError.message,
          errors: clerkError.errors,
          status: clerkError.status,
          statusText: clerkError.statusText,
          stack: clerkError.stack
        });
        
        // Check if invitation already exists
        if (clerkError.errors?.some((e: any) => e.code === 'form_identifier_exists' || e.code === 'duplicate_record')) {
          console.log(`⚠️ Invitation may already exist for ${staffInput.email}`);
          // Continue - we'll still create the database user
        } else {
          // Log the error but continue with database-only creation
          console.log(`⚠️ Continuing with database-only creation due to Clerk error: ${clerkError.message}`);
        }
      }
    }
    
    // Step 2: Create user in database
    let databaseUser = null;
    
    try {
      console.log(`💾 Creating database user for: ${staffInput.email}`);
      
      // Create database user (invitation will be linked when user signs up)
      console.log('💾 Using server Apollo client like working payroll routes...');
      const { getServerApolloClient } = await import('@/lib/server-apollo-client');
      const { gql } = await import('@apollo/client');
      const { auth } = await import('@clerk/nextjs/server');
      
      // Get Clerk authentication token (same as working payroll routes)
      const authInstance = await auth();
      const token = await authInstance.getToken({ template: "hasura" });
      
      console.log('💾 Authentication details:', {
        hasToken: !!token,
        tokenLength: token?.length,
        hasuraUrl: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL,
        hasAdminSecret: !!process.env.HASURA_ADMIN_SECRET
      });
      
      // Get Apollo Client (same as working payroll routes)
      // If token is missing or invalid, fall back to admin client for user creation
      let apolloClient;
      let useAdminFallback = false;
      
      if (!token) {
        console.log('⚠️ No JWT token available, checking if admin fallback is possible...');
        if (process.env.HASURA_ADMIN_SECRET) {
          console.log('💾 Using admin client as fallback for user creation');
          const { adminApolloClient } = await import('@/lib/server-apollo-client');
          apolloClient = adminApolloClient;
          useAdminFallback = true;
        } else {
          throw new Error('No authentication token and no admin secret available');
        }
      } else {
        apolloClient = await getServerApolloClient();
      }
      
      const CREATE_USER_DB = gql`
        mutation CreateUserDb(
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
            }
            on_conflict: {
              constraint: users_email_key
              update_columns: [name, role, is_staff, manager_id, updated_at]
            }
          ) {
            id
            name
            email
            role
            is_staff
            manager_id
            created_at
            updated_at
          }
        }
      `;
      
      console.log('💾 Executing GraphQL mutation with variables:', {
        name: staffInput.name,
        email: staffInput.email,
        role: staffInput.role,
        isStaff: staffInput.is_staff,
        managerId: staffInput.managerId || null
      });
      
      const { data, errors } = await apolloClient.mutate({
        mutation: CREATE_USER_DB,
        variables: {
          name: staffInput.name,
          email: staffInput.email,
          role: staffInput.role,
          isStaff: staffInput.is_staff,
          managerId: staffInput.managerId || null,
          clerkUserId: null // Will be set when user accepts invitation
        },
        ...(useAdminFallback ? {} : { context: { headers: { authorization: `Bearer ${token}` } } })
      });
      
      console.log('💾 GraphQL mutation result:', {
        hasData: !!data,
        hasErrors: !!errors,
        errors: errors,
        data: data
      });
      
      if (errors) {
        throw new Error(`Database user creation failed: ${errors.map(e => e.message).join(', ')}`);
      }
      
      databaseUser = data.insert_users_one;
      console.log(`✅ Created database user: ${databaseUser?.id}`);
      
    } catch (dbError: any) {
      console.error(`❌ Failed to create database user:`, {
        error: dbError,
        message: dbError.message,
        stack: dbError.stack,
        graphQLErrors: dbError.graphQLErrors,
        networkError: dbError.networkError,
        extraInfo: dbError.extraInfo
      });
      
      await soc2Logger.log({
        level: LogLevel.ERROR,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
        message: "Staff creation failed - database error",
        userId: session.userId,
        userRole: session.role,
        errorDetails: {
          message: dbError.message,
          stack: dbError.stack
        },
        metadata: {
          graphQLErrors: dbError.graphQLErrors,
          networkError: dbError.networkError
        }
      }, request);
      
      return NextResponse.json({
        error: "Failed to create user in database",
        details: dbError.message,
        graphQLErrors: dbError.graphQLErrors,
        networkError: dbError.networkError
      }, { status: 500 });
    }
    
    // Prepare response data
    const staffData = {
      id: databaseUser?.id,
      invitationId: invitationId,
      name: staffInput.name,
      email: staffInput.email,
      role: staffInput.role,
      is_staff: staffInput.is_staff,
      manager_id: staffInput.managerId,
      createdBy: session.userId,
      createdAt: databaseUser?.created_at || new Date().toISOString(),
      invitationSent: invitationSent
    };
    
    // Log successful staff creation
    await soc2Logger.log({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "Staff member created successfully",
      userId: session.userId,
      userRole: session.role,
      entityType: "staff",
      entityId: staffData.id,
      metadata: {
        staffEmail: staffInput.email,
        staffRole: staffInput.role,
        invitationSent: staffData.invitationSent,
        invitationId: staffData.invitationId,
        managerId: staffInput.managerId
      }
    }, request);
    
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
        createdAt: staffData.createdAt
      }
    });
  } catch (error: any) {
    console.error("Staff creation error - DETAILED:", {
      error: error,
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError,
      extraInfo: error.extraInfo,
      errorCode: error.code,
      status: error.status,
      statusText: error.statusText
    });
    
    try {
      await soc2Logger.log({
        level: LogLevel.ERROR,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
        message: "Staff creation failed - unexpected error",
        userId: session.userId,
        userRole: session.role,
        errorDetails: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          code: error.code
        },
        metadata: {
          graphQLErrors: error.graphQLErrors,
          networkError: error.networkError,
          status: error.status
        }
      }, request);
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }
    
    return NextResponse.json({ 
      error: "Staff creation failed",
      details: error instanceof Error ? error.message : "An unexpected error occurred",
      debugInfo: {
        errorName: error.name,
        errorCode: error.code,
        status: error.status,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      }
    }, { status: 500 });
  }
}, {
  allowedRoles: ["developer", "org_admin"] // Only admins can create staff
});

export async function GET() {
  console.log("GET handler working");
  return new NextResponse("GET working");
}
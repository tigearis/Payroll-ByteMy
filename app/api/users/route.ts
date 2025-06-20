import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/server-apollo-client";
import { getUserPermissions, canAssignRole, UserRole } from "@/lib/user-sync";
import { withAuth } from "@/lib/api-auth";
import { soc2Logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging/soc2-logger";

// GraphQL query to get users with filtering and pagination
const GET_USERS_QUERY = gql`
  query GetUsers($limit: Int = 50, $offset: Int = 0, $where: users_bool_exp) {
    users(
      limit: $limit
      offset: $offset
      where: $where
      order_by: { created_at: desc }
    ) {
      id
      name
      email
      role
      created_at
      updated_at
      is_staff
      manager_id
      clerk_user_id
      manager {
        id
        name
        email
      }
    }
    users_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

// Get all managers for assignment dropdown
const GET_MANAGERS_QUERY = gql`
  query GetManagers {
    users(where: { role: { _in: [developer, manager] } }, order_by: { name: asc }) {
      id
      name
      email
      role
    }
  }
`;

// Helper function to get current user's role from Clerk
async function getCurrentUserRole(userId: string): Promise<UserRole | "developer"> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return (user.publicMetadata?.role as UserRole | "developer") || "viewer";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "viewer";
  }
}

// GET /api/users - List users with filtering and pagination
export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    // Log user access
    await soc2Logger.log({
      level: LogLevel.INFO,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "User list accessed",
      userId: session.userId,
      userRole: session.role,
      entityType: "users"
    }, request);

    // Check user permissions using the existing helper
    const permissions = getUserPermissions(session.role as UserRole);

    console.log(
      `🔍 Current user role: ${session.role}, permissions:`,
      permissions
    );

    if (!permissions.canManageUsers) {
      console.log(
        `❌ User ${session.role} denied access - insufficient permissions`
      );
      return NextResponse.json(
        { error: "Insufficient permissions to view users" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const role = url.searchParams.get("role");
    const search = url.searchParams.get("search");
    const managerId = url.searchParams.get("managerId");

    // Build where clause for filtering
    let where: any = {};

    if (role && role !== "all") {
      where.role = { _eq: role };
    }

    if (search) {
      where._or = [
        { name: { _ilike: `%${search}%` } },
        { email: { _ilike: `%${search}%` } },
      ];
    }

    if (managerId && managerId !== "all") {
      where.manager_id = { _eq: managerId };
    }

    // Managers can only see users below their level
    if (session.role === "manager") {
      where.role = { _in: ["consultant", "viewer"] };
    }

    console.log(
      `📋 Fetching users for ${session.role} with filters:`,
      where
    );

    // Execute query
    const { data, errors } = await adminApolloClient.query({
      query: GET_USERS_QUERY,
      variables: { limit, offset, where },
      fetchPolicy: "network-only",
      errorPolicy: "all",
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      return NextResponse.json(
        { error: "Failed to fetch users", details: errors },
        { status: 500 }
      );
    }

    // Also fetch managers for frontend dropdown
    const { data: managersData } = await adminApolloClient.query({
      query: GET_MANAGERS_QUERY,
      fetchPolicy: "cache-first",
    });

    return NextResponse.json({
      success: true,
      users: data.users || [],
      totalCount: data.users_aggregate?.aggregate?.count || 0,
      managers: managersData?.users || [],
      pagination: {
        limit,
        offset,
        hasMore: (data.users?.length || 0) === limit,
      },
      currentUserRole: session.role,
      permissions,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    
    await soc2Logger.log({
      level: LogLevel.ERROR,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "Failed to fetch users",
      userId: session.userId,
      userRole: session.role,
      errorDetails: {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      }
    }, request);
    
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["developer", "org_admin", "manager"] // Only users who can manage users
});

// POST /api/users - Invite new user (admin/manager only)
export const POST = withAuth(async (request: NextRequest, session) => {
  try {
    // Check user permissions using the existing helper
    const permissions = getUserPermissions(session.role as UserRole);

    if (!permissions.canManageUsers) {
      return NextResponse.json(
        { error: "Insufficient permissions to create users" },
        { status: 403 }
      );
    }

    // Parse request body
    const {
      email,
      firstName,
      lastName,
      role = "viewer",
      managerId,
    } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "Email and first name are required" },
        { status: 400 }
      );
    }

    // Check if current user can assign the requested role
    if (!canAssignRole(session.role as UserRole, role as UserRole)) {
      return NextResponse.json(
        { error: `Insufficient permissions to assign role: ${role}` },
        { status: 403 }
      );
    }

    console.log(
      `👤 Creating user invitation: ${firstName} ${lastName} (${email}) as ${role}`
    );

    // Log user creation attempt
    await soc2Logger.log({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "User invitation initiated",
      userId: session.userId,
      userRole: session.role,
      entityType: "user",
      metadata: {
        targetEmail: email,
        targetRole: role,
        invitedBy: session.userId
      }
    }, request);

    // Create user via Clerk
    const client = await clerkClient();
    const newUser = await client.users.createUser({
      emailAddress: [email],
      firstName,
      lastName,
      publicMetadata: {
        role,
        managerId,
        invitedBy: session.userId,
        invitedAt: new Date().toISOString(),
      },
      privateMetadata: {
        hasuraRole: role,
      },
    });

    // The webhook will handle database sync automatically
    console.log(`✅ User invitation created: ${newUser.id}`);

    // Log successful user creation
    await soc2Logger.log({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "User invitation created successfully",
      userId: session.userId,
      userRole: session.role,
      entityType: "user",
      entityId: newUser.id,
      metadata: {
        targetEmail: email,
        targetRole: role,
        invitedBy: session.userId
      }
    }, request);

    return NextResponse.json({
      success: true,
      message: "User invitation sent successfully",
      user: {
        id: newUser.id,
        email,
        firstName,
        lastName,
        role,
      },
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);

    // Log failed user creation
    await soc2Logger.log({
      level: LogLevel.ERROR,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      message: "User invitation failed",
      userId: session.userId,
      userRole: session.role,
      errorDetails: {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      }
    }, request);

    // Handle specific Clerk errors
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}, {
  allowedRoles: ["developer", "org_admin", "manager"] // Only users who can manage users
});

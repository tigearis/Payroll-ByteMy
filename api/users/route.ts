import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { gql } from "@apollo/client";
import { adminApolloClient } from "@/lib/apollo/server-client";
import { withEnhancedAuth, AuthContext } from "@/lib/auth/enhanced-api-auth";
import { logger, LogLevel, LogCategory, SOC2EventType } from "@/lib/logging";
import { canAssignUserRole as canAssignRole } from "@/lib/user-sync";
import { Role } from "@/types/permissions";

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
    users(
      where: { role: { _in: ["developer", "org_admin", "manager"] } }
      order_by: { name: asc }
    ) {
      id
      name
      email
      role
    }
  }
`;

// GET /api/users - List users with filtering and pagination
export const GET = withEnhancedAuth(
  async (request: NextRequest, context: AuthContext) => {
    try {
      const userRole =
        typeof context.userRole === "string" ? context.userRole : "unknown";
      await logger.logSOC2Event(SOC2EventType.DATA_ACCESSED, {
        level: LogLevel.INFO,
        category: LogCategory.SYSTEM_ACCESS,
        message: "User list accessed",
        userId: context.userId,
        userRole: userRole,
        metadata: {
          entityType: "users",
        },
      });

      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get("limit") || "50");
      const offset = parseInt(url.searchParams.get("offset") || "0");
      const role = url.searchParams.get("role");
      const search = url.searchParams.get("search");
      const managerId = url.searchParams.get("managerId");

      const where: any = {};
      if (role && role !== "all") where.role = { _eq: role };
      if (search)
        where._or = [
          { name: { _ilike: `%${search}%` } },
          { email: { _ilike: `%${search}%` } },
        ];
      if (managerId && managerId !== "all")
        where.manager_id = { _eq: managerId };

      if (context.userRole === "manager") {
        where.role = { ...where.role, _in: ["consultant", "viewer"] };
      }

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
        currentUserRole: context.userRole,
      });
    } catch (error) {
    return handleApiError(error, "users");
  },
        { status: 500 }
      );
    }
  },
  {
    permission: "custom:staff:read",
  }
);

export const POST = withEnhancedAuth(
  async (request: NextRequest, context: AuthContext) => {
    try {
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

      if (!canAssignRole(context.userRole, role as Role)) {
        return NextResponse.json(
          { error: `Insufficient permissions to assign role: ${role}` },
          { status: 403 }
        );
      }

      const userRole =
        typeof context.userRole === "string" ? context.userRole : "unknown";
      await logger.logSOC2Event(SOC2EventType.DATA_ACCESSED, {
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        message: "User invitation initiated",
        userId: context.userId,
        userRole: userRole,
        metadata: {
          entityType: "user",
          targetEmail: email,
          targetRole: role,
          invitedBy: context.userId,
        },
      });

      const newUser = await (
        await clerkClient()
      ).users.createUser({
        emailAddress: [email],
        firstName,
        lastName,
        publicMetadata: {
          role,
          managerId,
          invitedBy: context.userId,
          invitedAt: new Date().toISOString(),
        },
      });

      return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
    return handleApiError(error, "users");
  },
        { status: 500 }
      );
    }
  },
  {
    permission: "custom:staff:invite",
  }
);

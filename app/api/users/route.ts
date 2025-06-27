import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import {
  GetUsersWithFilteringDocument,
  GetManagersDocument,
} from "@/domains/users/graphql/generated/graphql";
import {
  getUserPermissions,
  canAssignRole,
  UserRole,
} from "@/domains/users/services/user-sync";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuth } from "@/lib/auth/api-auth";
import { getPermissionsForRole } from "@/lib/auth/permissions";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// Helper function to get current user's role from Clerk
async function getCurrentUserRole(
  userId: string
): Promise<UserRole | "developer"> {
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
export const GET = withAuth(
  async (request: NextRequest, session) => {
    try {
      // Extract client info once
      const clientInfo = auditLogger.extractClientInfo(request);

      // Log user access
      await auditLogger.logSOC2Event({
        level: LogLevel.INFO,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "users",
        action: "LIST",
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        complianceNote: "User list accessed",
      });

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
      const where: any = {};

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

      console.log(`📋 Fetching users for ${session.role} with filters:`, where);

      // Execute query with error handling for usersAggregate permissions
      const { data, errors } = await adminApolloClient.query({
        query: GetUsersWithFilteringDocument,
        variables: { limit, offset, where },
        fetchPolicy: "network-only",
        errorPolicy: "all",
      });

      // Check if there are permission-related errors specifically for usersAggregate
      const hasAggregatePermissionError = errors?.some(error => 
        error.message.includes('usersAggregate') && 
        error.message.includes('not found')
      );

      if (errors && !hasAggregatePermissionError) {
        console.error("GraphQL errors:", errors);
        return NextResponse.json(
          { error: "Failed to fetch users", details: errors },
          { status: 500 }
        );
      }

      if (hasAggregatePermissionError) {
        console.log("⚠️ usersAggregate not available for current user role, using estimated count");
      }

      // Also fetch managers for frontend dropdown
      const { data: managersData } = await adminApolloClient.query({
        query: GetManagersDocument,
        fetchPolicy: "cache-first",
      });

      return NextResponse.json({
        success: true,
        users: data.users || [],
        totalCount: hasAggregatePermissionError ? (data.users?.length || 0) : (data.usersAggregate?.aggregate?.count || 0),
        managers: managersData?.users || [],
        pagination: {
          limit,
          offset,
          hasMore: (data.users?.length || 0) === limit,
        },
        currentUserRole: session.role,
        permissions,
        hasExactCount: !hasAggregatePermissionError, // Let frontend know if count is exact or estimated
      });
    } catch (error) {
      console.error("❌ Error fetching users:", error);

      const errorClientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "users",
        action: "LIST",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        ipAddress: errorClientInfo.ipAddress || "unknown",
        userAgent: errorClientInfo.userAgent || "unknown",
        complianceNote: "Failed to fetch users",
      });

      return NextResponse.json(
        {
          error: "Failed to fetch users",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  },
  {
    allowedRoles: ["developer", "org_admin", "manager"], // Only users who can manage users
  }
);

// POST /api/users - Invite new user (admin/manager only)
export const POST = withAuth(
  async (request: NextRequest, session) => {
    try {
      // Extract client info once
      const clientInfo = auditLogger.extractClientInfo(request);

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
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "user",
        action: "INVITE_INITIATE",
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: {
          targetEmail: email,
          targetRole: role,
          invitedBy: session.userId,
        },
        complianceNote: "User invitation initiated",
      });

      // Create user via Clerk
      const client = await clerkClient();
      const newUser = await client.users.createUser({
        emailAddress: [email],
        firstName,
        lastName,
        publicMetadata: {
          role,
          permissions: getPermissionsForRole(role),
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
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED,
        userId: session.userId,
        userRole: session.role,
        resourceId: newUser.id,
        resourceType: "user",
        action: "INVITE",
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: {
          targetEmail: email,
          targetRole: role,
          invitedBy: session.userId,
        },
        complianceNote: "User invitation created successfully",
      });

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
      const inviteErrorClientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.USER_CREATED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "user",
        action: "INVITE",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        ipAddress: inviteErrorClientInfo.ipAddress || "unknown",
        userAgent: inviteErrorClientInfo.userAgent || "unknown",
        complianceNote: "User invitation failed",
      });

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
  },
  {
    allowedRoles: ["developer", "org_admin", "manager"], // Only users who can manage users
  }
);

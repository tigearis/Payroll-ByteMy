// app/api/update-user-role/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { updateUserRole } from "@/domains/users/services/user-sync";
import { withAuth } from "@/lib/auth/api-auth";
import { 
  getHierarchicalPermissionsFromDatabase,
  type UserRole 
} from "@/lib/permissions/hierarchical-permissions";

// Helper function to check role level using hierarchical system
function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    viewer: 1,
    consultant: 2,
    manager: 3,
    org_admin: 4,
    developer: 5
  };
  
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

// Helper function to get permissions for a role (simplified)
function getPermissionsForRole(role: UserRole): string[] {
  // This is a simplified implementation - ideally should use hierarchical system
  const rolePermissions = {
    developer: ["*"],
    org_admin: ["staff.manage", "security.manage"],
    manager: ["staff.update", "staff.read"],
    consultant: ["staff.read"],
    viewer: ["staff.read"]
  };
  
  return rolePermissions[role] || [];
}

export const POST = withAuth(
  async (req: NextRequest, session) => {
    try {
      // ✅ JWT Template: Use session from withAuth
      const { defaultRole, permissions, managerId, organizationId, isStaff } = session;

      if (!defaultRole) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }

      // Parse request body
      const { targetUserId, role: newRole } = await req.json();

      // Validate role
      const validRoles: UserRole[] = ["developer", "org_admin", "manager", "consultant", "viewer"];
      if (!validRoles.includes(newRole)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      // ✅ JWT Template: Check permissions using JWT claims
      const canManageRoles = permissions?.includes('staff.manage') || 
                            permissions?.includes('security.manage') ||
                            hasRoleLevel(defaultRole, "org_admin");

      if (!canManageRoles) {
        return NextResponse.json(
          { error: "Insufficient permissions to manage roles" },
          { status: 403 }
        );
      }

      // ✅ JWT Template: Validate role assignment hierarchy
      if (defaultRole === "manager" && ["developer", "org_admin"].includes(newRole)) {
        return NextResponse.json(
          { error: "Managers cannot assign admin or developer roles" },
          { status: 403 }
        );
      }

      // ✅ JWT Template: Use proper user sync service
      const updatedUser = await updateUserRole(
        targetUserId,
        newRole as UserRole,
        session.userId || "",
        managerId // Pass manager context
      );

      return NextResponse.json({
        success: true,
        message: `User role updated to ${newRole}`,
        user: {
          id: updatedUser?.id,
          role: updatedUser?.role,
          permissions: getPermissionsForRole(newRole),
          updatedAt: updatedUser?.updatedAt
        }
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }
  }
);

// GET endpoint to fetch user role information
export const GET = withAuth(
  async (request: Request, session) => {
    try {
      // ✅ JWT Template: Use session from withAuth
      const { userId: currentUserId, defaultRole, permissions, managerId, organizationId } = session;

      if (!currentUserId || !defaultRole) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const url = new URL(request.url);
      const targetUserId = url.searchParams.get("userId");

      if (!targetUserId) {
        return new NextResponse("Missing userId parameter", { status: 400 });
      }

      // ✅ JWT Template: Check permissions using JWT claims
      const canViewRoles = permissions?.includes('staff.read') || 
                          permissions?.includes('security.read') ||
                          hasRoleLevel(defaultRole, "manager");
      const isSelf = currentUserId === targetUserId;

      if (!canViewRoles && !isSelf) {
        return new NextResponse("Forbidden: Cannot view user roles", {
          status: 403,
        });
      }

      // Get target user information
      const client = await clerkClient();
      const targetUser = await client.users.getUser(targetUserId);
      const targetUserRole = targetUser.publicMetadata?.role as UserRole || "viewer";
      const targetUserPerms = targetUser.publicMetadata?.permissions as string[] || [];

      // ✅ JWT Template: Enhanced permission checking for modifications
      const canModifyUser = permissions?.includes('staff.manage') ||
                           permissions?.includes('security.manage') ||
                           (defaultRole === "manager" && 
                            !["developer", "org_admin"].includes(targetUserRole));

      return NextResponse.json({
        userId: targetUserId,
        role: targetUserRole,
        permissions: targetUserPerms,
        email: targetUser.emailAddresses[0]?.emailAddress,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        canModify: canModifyUser,
        // ✅ JWT Template: Include hierarchy information
        isStaff: targetUser.publicMetadata?.isStaff || false,
        managerId: targetUser.publicMetadata?.managerId,
        organizationId: targetUser.publicMetadata?.organizationId,
        // ✅ JWT Template: Include permission metadata
        permissionHash: targetUser.publicMetadata?.permissionHash,
        permissionVersion: targetUser.publicMetadata?.permissionVersion,
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
);

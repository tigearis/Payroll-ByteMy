import { NextRequest, NextResponse } from "next/server";
import { 
  GetUserClerkIdDocument,
  type GetUserClerkIdQuery,
  UpdateStaffRoleDocument,
  type UpdateStaffRoleMutation
} from "@/domains/users/graphql/generated/graphql";
import { updateUserRole, type UserRole } from "@/domains/users/services/user-sync";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { requireStaffAccess, requireManagerAccess } from "@/lib/permissions/api-permission-guard";

interface UpdateRoleRequest {
  role: UserRole;
  managerId?: string;
  reason?: string;
}

interface UpdateRoleResponse {
  success: boolean;
  user?: any;
  message?: string;
  error?: string;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Check permissions - role updates require manager access
  const authResult = await requireManagerAccess();
  if (authResult instanceof NextResponse) {
    return authResult; // Permission denied
  }

  const { user: currentUser, userId: currentUserId, role: currentUserRole } = authResult;

  try {
    const { id } = await params;
    const body: UpdateRoleRequest = await req.json();
    const { role, managerId, reason } = body;

    // Validate required fields
    if (!role) {
      return NextResponse.json<UpdateRoleResponse>(
        { success: false, error: "Role is required" },
        { status: 400 }
      );
    }

    // Validate role value
    const validRoles: UserRole[] = ["developer", "org_admin", "manager", "consultant", "viewer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json<UpdateRoleResponse>(
        { success: false, error: `Invalid role. Must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    // Role assignment validation removed - any authenticated user can assign roles

    // Get user details first to validate existence and get Clerk ID
    let userData;
    try {
      userData = await executeTypedQuery<GetUserClerkIdQuery>(
        GetUserClerkIdDocument,
        { id }
      );
    } catch (queryError: any) {
      console.error("Failed to fetch user:", queryError);
      return NextResponse.json<UpdateRoleResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = userData.userById;
    if (!user) {
      return NextResponse.json<UpdateRoleResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Allow users to change any role (including their own) since role-based access control is disabled

    // Check if role is actually changing
    if (user.role === role && user.managerId === managerId) {
      return NextResponse.json<UpdateRoleResponse>(
        { 
          success: true, 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            managerId: user.managerId,
          },
          message: "Role and manager are already set to the requested values" 
        }
      );
    }

    console.log(`🔄 Updating user role: ${user.name} (${user.email}) from ${user.role} to ${role}`);

    try {
      // Update role in database
      const updatedUserData = await executeTypedMutation<UpdateStaffRoleMutation>(
        UpdateStaffRoleDocument,
        {
          id: user.id,
          role,
        }
      );

      const updatedUser = updatedUserData.updateUserById;

      if (!updatedUser) {
        throw new Error("Failed to update user in database");
      }

      // Update Clerk metadata if user has Clerk ID
      if (user.clerkUserId) {
        try {
          console.log(`🔄 Syncing role change with Clerk: ${user.clerkUserId}`);
          
          await updateUserRole(
            user.clerkUserId,
            role,
            currentUserId || "system",
            managerId
          );

          console.log(`✅ Successfully synced role change with Clerk`);
        } catch (clerkError: any) {
          console.error("Failed to sync with Clerk:", clerkError);
          
          // Role updated in database but Clerk sync failed
          // This is not a complete failure - return success with warning
          return NextResponse.json<UpdateRoleResponse>({
            success: true,
            user: {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              role: updatedUser.role,
              managerId: updatedUser.managerId,
              clerkUserId: user.clerkUserId,
            },
            message: `Role updated in database but Clerk sync failed: ${clerkError.message}. User may need to sign out and back in.`,
          });
        }
      }

      // Log the role change for audit purposes
      console.log(`✅ Role updated successfully:`, {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        previousRole: user.role,
        newRole: role,
        updatedBy: currentUserId,
        reason: reason || "No reason provided",
        hasClerkAccount: !!user.clerkUserId,
      });

      return NextResponse.json<UpdateRoleResponse>({
        success: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          managerId: updatedUser.managerId,
          clerkUserId: user.clerkUserId,
        },
        message: `Successfully updated ${user.name}'s role from ${user.role} to ${role}`,
      });

    } catch (updateError: any) {
      console.error("Failed to update user role:", updateError);
      
      return NextResponse.json<UpdateRoleResponse>(
        { 
          success: false, 
          error: `Failed to update role: ${updateError.message}` 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Role update error:", error);

    return NextResponse.json<UpdateRoleResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch current role information
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Check permissions - reading staff details requires staff access
  const authResult = await requireStaffAccess('read');
  if (authResult instanceof NextResponse) {
    return authResult; // Permission denied
  }

  const { user: currentUser, userId: currentUserId } = authResult;
  try {
    const { id } = await params;

    const userData = await executeTypedQuery<GetUserClerkIdQuery>(
      GetUserClerkIdDocument,
      { id }
    );

    const user = userData.userById;
    if (!user) {
      return NextResponse.json<UpdateRoleResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<UpdateRoleResponse>({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clerkUserId: user.clerkUserId,
      },
    });

  } catch (error: any) {
    console.error("Get role error:", error);

    return NextResponse.json<UpdateRoleResponse>(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
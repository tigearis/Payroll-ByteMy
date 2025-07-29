import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import {
  GetPayrollsByUserDocument,
  type GetPayrollsByUserQuery,
  BulkAssignConsultantDocument, 
  type BulkAssignConsultantMutation,
  BulkAssignManagerDocument,
  type BulkAssignManagerMutation,
  UpdatePayrollAssignmentsDocument,
  type UpdatePayrollAssignmentsMutation
} from "@/domains/payrolls/graphql/generated/graphql";
import { 
  GetUserForDeletionDocument,
  type GetUserForDeletionQuery,
  DeactivateUserWithReasonDocument,
  type DeactivateUserWithReasonMutation,
  BulkUpdateUsersDocument,
  type BulkUpdateUsersMutation
} from "@/domains/users/graphql/generated/graphql";
import { executeTypedMutation, executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuthParams } from "@/lib/auth/api-auth";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface DeleteStaffRequest {
  reason?: string;
  reassignPayrolls?: boolean;
  newPrimaryConsultantId?: string;
  newBackupConsultantId?: string;
  newManagerId?: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
  isActive?: boolean;
  clerkUserId?: string;
  createdAt?: string;
  deactivatedAt?: string;
  managerUser?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface DeleteStaffResponse {
  success: boolean;
  user?: UserInfo;
  dependencies?: {
    activePayrolls: number;
    subordinates: number;
    pendingLeaves: number;
  };
  message?: string;
  error?: string;
}

export const DELETE = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters for deletion options
    const reason = searchParams.get("reason") || "User account deleted by administrator";
    const reassignPayrolls = searchParams.get("reassignPayrolls") === "true";
    const newPrimaryConsultantId = searchParams.get("newPrimaryConsultantId") || undefined;
    const newBackupConsultantId = searchParams.get("newBackupConsultantId") || undefined;
    const newManagerId = searchParams.get("newManagerId") || undefined;

    // Get user details and dependencies
    let userData;
    try {
      userData = await executeTypedQuery<GetUserForDeletionQuery>(
        GetUserForDeletionDocument,
        { id }
      );
    } catch (queryError: unknown) {
      console.error("Failed to fetch user for deletion:", queryError);
      return NextResponse.json<DeleteStaffResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = userData.userById;
    if (!user) {
      return NextResponse.json<DeleteStaffResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Security check: Prevent users from deleting their own account
    if (user.clerkUserId === session.userId) {
      return NextResponse.json<DeleteStaffResponse>(
        { 
          success: false, 
          error: "You cannot delete your own account. Please contact an administrator if you need to deactivate your account." 
        },
        { status: 403 }
      );
    }

    // Additional security: Only allow manager+ roles to delete other users
    const currentUserRole = req.headers.get('x-user-role') || 'viewer';
    const allowedDeletionRoles = ['manager', 'org_admin', 'developer'];
    if (!allowedDeletionRoles.includes(currentUserRole)) {
      return NextResponse.json<DeleteStaffResponse>(
        { 
          success: false, 
          error: "You do not have permission to delete user accounts. Manager role or higher required." 
        },
        { status: 403 }
      );
    }

    // Check for dependencies
    const activePayrolls = userData.payrolls || [];
    const subordinates = userData.subordinates || [];
    
    const dependencies = {
      activePayrolls: activePayrolls.length,
      subordinates: subordinates.length,
      pendingLeaves: 0, // Note: leaves removed from schema
    };

    // If user has dependencies and reassignment not requested, return dependency info
    if ((dependencies.activePayrolls > 0 || dependencies.subordinates > 0) && !reassignPayrolls) {
      return NextResponse.json<DeleteStaffResponse>({
        success: false,
        error: "Cannot delete user with active dependencies. Please reassign or use force delete.",
        dependencies,
        user: {
          id: user.id,
          name: user.computedName || `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          role: user.role,
        },
      }, { status: 409 });
    }

    // Implement payroll reassignment logic
    if (reassignPayrolls && dependencies.activePayrolls > 0) {
      console.log(`🔄 Reassigning ${dependencies.activePayrolls} payrolls...`);
      
      try {
        // Get detailed payroll assignments for the user
        const userPayrollsData = await executeTypedQuery<GetPayrollsByUserQuery>(
          GetPayrollsByUserDocument,
          { userId: user.id }
        );
        
        // Reassign primary consultant payrolls
        if (userPayrollsData.primaryPayrolls.length > 0 && newPrimaryConsultantId) {
          const primaryPayrollIds = userPayrollsData.primaryPayrolls.map(p => p.id);
          await executeTypedMutation<BulkAssignConsultantMutation>(
            BulkAssignConsultantDocument,
            {
              payrollIds: primaryPayrollIds,
              primaryConsultantUserId: newPrimaryConsultantId
            }
          );
          console.log(`✅ Reassigned ${primaryPayrollIds.length} primary consultant payrolls`);
        }
        
        // Reassign backup consultant payrolls
        if (userPayrollsData.backupPayrolls.length > 0 && newBackupConsultantId) {
          for (const payroll of userPayrollsData.backupPayrolls) {
            await executeTypedMutation<UpdatePayrollAssignmentsMutation>(
              UpdatePayrollAssignmentsDocument,
              {
                id: payroll.id,
                backupConsultantUserId: newBackupConsultantId,
                primaryConsultantUserId: payroll.primaryConsultantUserId, // Keep existing
                managerUserId: payroll.managerUserId || null // Keep existing or null
              }
            );
          }
          console.log(`✅ Reassigned ${userPayrollsData.backupPayrolls.length} backup consultant payrolls`);
        }
        
        // Reassign managed payrolls
        if (userPayrollsData.managedPayrolls.length > 0 && newManagerId) {
          const managedPayrollIds = userPayrollsData.managedPayrolls.map(p => p.id);
          await executeTypedMutation<BulkAssignManagerMutation>(
            BulkAssignManagerDocument,
            {
              payrollIds: managedPayrollIds,
              managerUserId: newManagerId
            }
          );
          console.log(`✅ Reassigned ${managedPayrollIds.length} managed payrolls`);
        }
      } catch (payrollError: unknown) {
        const errorMessage = payrollError instanceof Error ? payrollError.message : 'Unknown error';
        console.error("Failed to reassign payrolls:", payrollError);
        return NextResponse.json<DeleteStaffResponse>(
          {
            success: false,
            error: `Failed to reassign payrolls: ${errorMessage}`,
            dependencies,
          },
          { status: 500 }
        );
      }
    }

    // Implement subordinate reassignment logic
    if (dependencies.subordinates > 0 && newManagerId) {
      console.log(`🔄 Reassigning ${dependencies.subordinates} subordinates...`);
      
      try {
        // Bulk update all subordinates to new manager
        await executeTypedMutation<BulkUpdateUsersMutation>(
          BulkUpdateUsersDocument,
          {
            where: { 
              managerId: { _eq: user.id },
              isActive: { _eq: true }
            },
            set: { 
              managerId: newManagerId,
              updatedAt: "now()"
            }
          }
        );
        
        console.log(`✅ Reassigned ${dependencies.subordinates} subordinates to new manager`);
      } catch (subordinateError: unknown) {
        const errorMessage = subordinateError instanceof Error ? subordinateError.message : 'Unknown error';
        console.error("Failed to reassign subordinates:", subordinateError);
        return NextResponse.json<DeleteStaffResponse>(
          {
            success: false,
            error: `Failed to reassign subordinates: ${errorMessage}`,
            dependencies,
          },
          { status: 500 }
        );
      }
    } else if (dependencies.subordinates > 0 && !newManagerId) {
      return NextResponse.json<DeleteStaffResponse>(
        {
          success: false,
          error: "Cannot delete user with subordinates without providing a new manager ID",
          dependencies,
        },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deleting user: ${user.computedName || `${user.firstName} ${user.lastName}`.trim()} (${user.email})`);

    try {
      // Soft delete user (deactivate with deletion reason)
      const deactivatedUserData = await executeTypedMutation<DeactivateUserWithReasonMutation>(
        DeactivateUserWithReasonDocument,
        {
          userId: user.id,
          reason: `DELETED: ${reason}`,
          deactivatedBy: user.id, // Use user's own ID as placeholder since we don't have current user's database ID
          deactivatedByString: `${session.email || session.userId} (deletion)`,
        }
      );

      const deactivatedUser = deactivatedUserData.updateUserById;

      if (!deactivatedUser) {
        throw new Error("Failed to deactivate user in database");
      }

      // Delete/deactivate user in Clerk if they have an account
      if (user.clerkUserId) {
        try {
          console.log(`🔄 Deleting user from Clerk: ${user.clerkUserId}`);
          
          // First ban the user to prevent login
          await clerkClient.users.banUser(user.clerkUserId);
          
          // Update metadata to mark as deleted
          const currentClerkUser = await clerkClient.users.getUser(user.clerkUserId);
          await clerkClient.users.updateUser(user.clerkUserId, {
            publicMetadata: {
              ...currentClerkUser.publicMetadata,
              status: "deleted",
              deletedAt: new Date().toISOString(),
              deletedBy: session.userId,
              deletionReason: reason,
            },
            privateMetadata: {
              ...currentClerkUser.privateMetadata,
              accountDeleted: true,
              lastDeletedAt: new Date().toISOString(),
            },
          });

          // Optionally fully delete from Clerk (uncomment if desired)
          // await clerkClient.users.deleteUser(user.clerkUserId);

          console.log(`✅ Successfully processed user deletion in Clerk`);
        } catch (clerkError: unknown) {
          const errorMessage = clerkError instanceof Error ? clerkError.message : 'Unknown error';
          console.error("Failed to delete user from Clerk:", clerkError);
          
          // User deleted from database but Clerk deletion failed
          // This is not a complete failure - return success with warning
          return NextResponse.json<DeleteStaffResponse>({
            success: true,
            user: {
              id: deactivatedUser.id,
              name: deactivatedUser.computedName || `${deactivatedUser.firstName} ${deactivatedUser.lastName}`.trim(),
              email: deactivatedUser.email,
              status: deactivatedUser.status,
              ...(deactivatedUser.isActive !== null && { isActive: deactivatedUser.isActive }),
            },
            dependencies,
            message: `User deleted from database but Clerk deletion failed: ${errorMessage}. User account may still exist in authentication system.`,
          });
        }
      }

      // Log the deletion for audit purposes
      console.log(`✅ User deleted successfully:`, {
        userId: user.id,
        userName: user.computedName || `${user.firstName} ${user.lastName}`.trim(),
        userEmail: user.email,
        userRole: user.role,
        reason,
        deletedBy: session.userId,
        hadClerkAccount: !!user.clerkUserId,
        dependencies,
      });

      return NextResponse.json<DeleteStaffResponse>({
        success: true,
        user: {
          id: deactivatedUser.id,
          name: deactivatedUser.computedName || `${deactivatedUser.firstName} ${deactivatedUser.lastName}`.trim(),
          email: deactivatedUser.email,
          status: deactivatedUser.status,
          ...(deactivatedUser.isActive !== null && { isActive: deactivatedUser.isActive }),
          ...(deactivatedUser.deactivatedAt && { deactivatedAt: deactivatedUser.deactivatedAt }),
        },
        dependencies,
        message: `Successfully deleted user account: ${user.computedName || `${user.firstName} ${user.lastName}`.trim()}`,
      });

    } catch (deleteError: unknown) {
      const errorMessage = deleteError instanceof Error ? deleteError.message : 'Unknown error';
      console.error("Failed to delete user:", deleteError);
      
      return NextResponse.json<DeleteStaffResponse>(
        { 
          success: false, 
          error: `Failed to delete user: ${errorMessage}` 
        },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error("Delete user error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json<DeleteStaffResponse>(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
});

// GET endpoint to fetch user deletion info and dependencies
export const GET = withAuthParams(async (req: NextRequest, { params }, session) => {
  try {
    const { id } = await params;

    const userData = await executeTypedQuery<GetUserForDeletionQuery>(
      GetUserForDeletionDocument,
      { id }
    );

    const user = userData.userById;
    if (!user) {
      return NextResponse.json<DeleteStaffResponse>(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const activePayrolls = userData.payrolls || [];
    const subordinates = userData.subordinates || [];
    
    const dependencies = {
      activePayrolls: activePayrolls.length,
      subordinates: subordinates.length,
      pendingLeaves: 0, // Note: leaves removed from schema
    };

    const canDelete = dependencies.activePayrolls === 0 && dependencies.subordinates === 0;

    return NextResponse.json<DeleteStaffResponse>({
      success: true,
      user: {
        id: user.id,
        name: user.computedName || `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        ...(user.isActive !== null && { isActive: user.isActive }),
        ...(user.clerkUserId && { clerkUserId: user.clerkUserId }),
        ...(user.createdAt && { createdAt: user.createdAt }),
        managerUser: user.managerUser ? {
          id: user.managerUser.id,
          name: user.managerUser?.computedName || `${user.managerUser?.firstName} ${user.managerUser?.lastName}`.trim(),
          email: user.managerUser.email,
        } : null,
      },
      dependencies,
      message: canDelete 
        ? "User can be safely deleted"
        : "User has dependencies that need to be resolved before deletion",
    });

  } catch (error: unknown) {
    console.error("Get user deletion info error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json<DeleteStaffResponse>(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
});
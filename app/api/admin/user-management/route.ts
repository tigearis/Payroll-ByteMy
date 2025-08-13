import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import {
  AnalyzeUserDependenciesDocument,
  GetUsersForReassignmentDocument,
  GetUserByEmailAdminDocument,
  GetUserByIdAdminDocument,
  GetUserForDeletionAdminDocument,
  ReassignManagedUsersDocument,
  ReassignBackupConsultantDocument,
  ReassignPrimaryConsultantDocument,
  ReassignSentInvitationsDocument,
  DeleteUserAdminDocument,
  type AnalyzeUserDependenciesQuery,
  type AnalyzeUserDependenciesQueryVariables,
  type GetUsersForReassignmentQuery,
  type GetUsersForReassignmentQueryVariables,
  type GetUserByEmailAdminQuery,
  type GetUserByEmailAdminQueryVariables,
  type GetUserByIdAdminQuery,
  type GetUserByIdAdminQueryVariables,
  type GetUserForDeletionAdminQuery,
  type GetUserForDeletionAdminQueryVariables,
  type ReassignManagedUsersMutation,
  type ReassignManagedUsersMutationVariables,
  type ReassignBackupConsultantMutation,
  type ReassignBackupConsultantMutationVariables,
  type ReassignPrimaryConsultantMutation,
  type ReassignPrimaryConsultantMutationVariables,
  type ReassignSentInvitationsMutation,
  type ReassignSentInvitationsMutationVariables,
  type DeleteUserAdminMutation,
  type DeleteUserAdminMutationVariables,
} from "@/domains/users/graphql/generated/graphql";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface UserAnalysisResult {
  user: any;
  dependencies: {
    assignedRoles: number;
    authoredNotes: number;
    backupPayrollAssignments: number;
    primaryPayrollAssignments: number;
    managedPayrolls: number;
    invitationsSent: number;
    managedUsers: number;
    leaveRecords: number;
    workSchedules: number;
  };
  canSafelyDelete: boolean;
  blockers: string[];
}

interface UserReassignmentPlan {
  fromUserId: string;
  toUserId: string;
  operations: {
    reassignPayrolls: number;
    reassignAssignments: number; 
    reassignInvitations: number;
    reassignBillingItems: number;
    reassignNotes: number;
  };
}


export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    // Require developer role for user management operations
    const userRole = session?.role || 'viewer';
    if (userRole !== 'developer') {
      return NextResponse.json(
        { error: "Unauthorized: Developer role required for user management" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action') || 'analyze';

    if (!email && !userId) {
      return NextResponse.json(
        { error: "Either email or userId parameter is required" },
        { status: 400 }
      );
    }

    // Find user by email or ID
    let targetUser;
    if (email) {
      const userByEmailData = await executeTypedQuery<
        GetUserByEmailAdminQuery,
        GetUserByEmailAdminQueryVariables
      >(GetUserByEmailAdminDocument, { email });
      targetUser = userByEmailData?.users?.[0];
    } else {
      const userByIdData = await executeTypedQuery<
        GetUserByIdAdminQuery,
        GetUserByIdAdminQueryVariables
      >(GetUserByIdAdminDocument, { userId: userId! });
      targetUser = userByIdData?.usersByPk;
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (action === 'analyze') {
      // Analyze user dependencies
      const analysisData = await executeTypedQuery<
        AnalyzeUserDependenciesQuery,
        AnalyzeUserDependenciesQueryVariables
      >(AnalyzeUserDependenciesDocument, {
        userId: targetUser.id
      });

      const user = analysisData?.user;
      if (!user) {
        return NextResponse.json(
          { error: "User not found during analysis" },
          { status: 404 }
        );
      }

      const dependencies = {
        assignedRoles: user.roleAssignmentsAggregate?.aggregate?.count || 0,
        authoredNotes: user.authoredNotesAggregate?.aggregate?.count || 0,
        backupPayrollAssignments: user.backupPayrollAssignmentsAggregate?.aggregate?.count || 0,
        primaryPayrollAssignments: user.primaryPayrollAssignmentsAggregate?.aggregate?.count || 0,
        managedPayrolls: user.managedPayrollsAggregate?.aggregate?.count || 0,
        invitationsSent: user.sentInvitationsAggregate?.aggregate?.count || 0,
        managedUsers: user.managedUsersAggregate?.aggregate?.count || 0,
        leaveRecords: user.leaveRecordsAggregate?.aggregate?.count || 0,
        workSchedules: user.workSchedulesAggregate?.aggregate?.count || 0,
      };

      // Determine blockers for deletion
      const blockers: string[] = [];
      if (dependencies.managedUsers > 0) {
        blockers.push(`Manages ${dependencies.managedUsers} users - need reassignment`);
      }
      if (dependencies.backupPayrollAssignments > 0) {
        blockers.push(`Backup consultant on ${dependencies.backupPayrollAssignments} payrolls`);
      }
      if (dependencies.primaryPayrollAssignments > 0) {
        blockers.push(`Primary consultant on ${dependencies.primaryPayrollAssignments} payrolls`);
      }
      if (dependencies.managedPayrolls > 0) {
        blockers.push(`Manages ${dependencies.managedPayrolls} payrolls`);
      }

      const canSafelyDelete = blockers.length === 0 && 
        dependencies.managedUsers === 0 && 
        dependencies.backupPayrollAssignments === 0 &&
        dependencies.primaryPayrollAssignments === 0 &&
        dependencies.managedPayrolls === 0;

      const result: UserAnalysisResult = {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          computedName: user.computedName,
          clerkUserId: user.clerkUserId,
          role: user.role,
          isActive: user.isActive,
          isStaff: user.isStaff,
          createdAt: user.createdAt,
        },
        dependencies,
        canSafelyDelete,
        blockers,
      };

      return NextResponse.json(result);
    }

    if (action === 'get_reassignment_candidates') {
      // Get potential users for reassignment
      const candidatesData = await executeTypedQuery<
        GetUsersForReassignmentQuery,
        GetUsersForReassignmentQueryVariables
      >(GetUsersForReassignmentDocument, {
        excludeUserId: targetUser.id
      });

      return NextResponse.json({
        candidates: candidatesData?.users || []
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: analyze, get_reassignment_candidates" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("❌ User management operation failed:", error);
    return NextResponse.json(
      { error: `User management failed: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    // Require developer role for user management operations
    const userRole = session?.role || 'viewer';
    if (userRole !== 'developer') {
      return NextResponse.json(
        { error: "Unauthorized: Developer role required for user management" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action, fromUserId, toUserId, confirmDeletion } = body;

    if (action === 'reassign_and_delete') {
      if (!fromUserId || !toUserId) {
        return NextResponse.json(
          { error: "Both fromUserId and toUserId are required for reassignment" },
          { status: 400 }
        );
      }

      if (!confirmDeletion) {
        return NextResponse.json(
          { error: "confirmDeletion must be true to proceed with deletion" },
          { status: 400 }
        );
      }

      console.log(`🔄 Starting user reassignment: ${fromUserId} -> ${toUserId}`);

      // 1. Reassign managed users
      await executeTypedMutation<
        ReassignManagedUsersMutation,
        ReassignManagedUsersMutationVariables
      >(ReassignManagedUsersDocument, { fromUserId, toUserId });

      // 2. Reassign payroll backup consultant roles
      await executeTypedMutation<
        ReassignBackupConsultantMutation,
        ReassignBackupConsultantMutationVariables
      >(ReassignBackupConsultantDocument, { fromUserId, toUserId });

      // 3. Reassign primary consultant roles
      await executeTypedMutation<
        ReassignPrimaryConsultantMutation,
        ReassignPrimaryConsultantMutationVariables
      >(ReassignPrimaryConsultantDocument, { fromUserId, toUserId });

      // 4. Reassign invitations sent by user
      await executeTypedMutation<
        ReassignSentInvitationsMutation,
        ReassignSentInvitationsMutationVariables
      >(ReassignSentInvitationsDocument, { fromUserId, toUserId });

      // 5. Get user data for Clerk deletion
      const userData = await executeTypedQuery<
        GetUserForDeletionAdminQuery,
        GetUserForDeletionAdminQueryVariables
      >(GetUserForDeletionAdminDocument, { userId: fromUserId });

      // 6. Delete from Clerk if Clerk user exists
      if (userData?.usersByPk?.clerkUserId) {
        try {
          await clerkClient.users.deleteUser(userData.usersByPk.clerkUserId);
          console.log(`✅ Deleted Clerk user: ${userData.usersByPk.clerkUserId}`);
        } catch (clerkError: any) {
          console.warn(`⚠️ Could not delete Clerk user: ${clerkError?.message || 'Unknown error'}`);
        }
      }

      // 7. Delete user from database
      const deletionResult = await executeTypedMutation<
        DeleteUserAdminMutation,
        DeleteUserAdminMutationVariables
      >(DeleteUserAdminDocument, { userId: fromUserId });

      console.log(`✅ User deletion completed: ${userData?.usersByPk?.email}`);

      return NextResponse.json({
        success: true,
        message: `User ${userData?.usersByPk?.email} successfully deleted and data reassigned to new user`,
        deletedUser: deletionResult?.deleteUsersByPk,
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: reassign_and_delete" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("❌ User reassignment/deletion failed:", error);
    return NextResponse.json(
      { error: `Operation failed: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
});
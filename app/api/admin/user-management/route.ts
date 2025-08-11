import { gql } from "@apollo/client";
import { createClerkClient } from "@clerk/backend";
import { NextRequest, NextResponse } from "next/server";
import { executeTypedQuery, executeTypedMutation } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

interface UserAnalysisResult {
  user: any;
  dependencies: {
    assignedRoles: number;
    authoredNotes: number;
    backupConsultantPayrolls: number;
    billingItems: number;
    consultantAssignments: number;
    createdAssignments: number;
    invitationsSent: number;
    managedUsers: number;
    payrollAssignments: number;
    leaveRequests: number;
    userWorkSchedules: number;
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

// Comprehensive user dependency analysis query
const ANALYZE_USER_DEPENDENCIES = gql`
  query AnalyzeUserDependencies($userId: uuid!) {
    user: userByPk(id: $userId) {
      id
      email
      firstName
      lastName
      computedName
      clerkUserId
      role
      isActive
      isStaff
      createdAt
      
      # Role assignments
      assignedRolesAggregate {
        aggregate { count }
      }
      
      # Content created by user
      authoredNotesAggregate {
        aggregate { count }
      }
      
      # Payroll relationships
      backupConsultantPayrollsAggregate {
        aggregate { count }
      }
      consultantAssignmentsAggregate {
        aggregate { count }
      }
      createdAssignmentsAggregate {
        aggregate { count }
      }
      payrollAssignmentsAggregate {
        aggregate { count }
      }
      
      # Billing relationships  
      billingItemsAggregate {
        aggregate { count }
      }
      billingItemsConfirmedByAggregate {
        aggregate { count }
      }
      
      # Management relationships
      managedUsersAggregate {
        aggregate { count }
      }
      
      # Invitations
      sentInvitationsAggregate {
        aggregate { count }
      }
      
      # Leave and scheduling
      leaveRequestsAggregate {
        aggregate { count }
      }
      userWorkSchedulesAggregate {
        aggregate { count }
      }
      
      # Email drafts
      emailDraftsAggregate {
        aggregate { count }
      }
    }
  }
`;

const GET_USERS_FOR_REASSIGNMENT = gql`
  query GetUsersForReassignment($excludeUserId: uuid!) {
    users(
      where: { 
        id: { _neq: $excludeUserId }
        isActive: { _eq: true }
        role: { _in: ["developer", "org_admin", "manager"] }
      }
      orderBy: { role: ASC }
      limit: 10
    ) {
      id
      email
      firstName
      lastName
      computedName
      role
    }
  }
`;

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
      const userByEmailData = await executeTypedQuery(
        gql`query GetUserByEmail($email: String!) {
          users(where: { email: { _eq: $email } }) {
            id
            email
            firstName
            lastName
            computedName
            clerkUserId
            role
            isActive
          }
        }`,
        { email }
      );
      targetUser = (userByEmailData as any).users?.[0];
    } else {
      const userByIdData = await executeTypedQuery(
        gql`query GetUserByPk($userId: uuid!) {
          userByPk(id: $userId) {
            id
            email
            firstName
            lastName
            computedName
            clerkUserId
            role
            isActive
          }
        }`,
        { userId }
      );
      targetUser = (userByIdData as any).userByPk;
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (action === 'analyze') {
      // Analyze user dependencies
      const analysisData = await executeTypedQuery(ANALYZE_USER_DEPENDENCIES, {
        userId: targetUser.id
      });

      const user = (analysisData as any).user;
      if (!user) {
        return NextResponse.json(
          { error: "User not found during analysis" },
          { status: 404 }
        );
      }

      const dependencies = {
        assignedRoles: user.assignedRolesAggregate?.aggregate?.count || 0,
        authoredNotes: user.authoredNotesAggregate?.aggregate?.count || 0,
        backupConsultantPayrolls: user.backupConsultantPayrollsAggregate?.aggregate?.count || 0,
        billingItems: user.billingItemsAggregate?.aggregate?.count || 0,
        consultantAssignments: user.consultantAssignmentsAggregate?.aggregate?.count || 0,
        createdAssignments: user.createdAssignmentsAggregate?.aggregate?.count || 0,
        invitationsSent: user.sentInvitationsAggregate?.aggregate?.count || 0,
        managedUsers: user.managedUsersAggregate?.aggregate?.count || 0,
        payrollAssignments: user.payrollAssignmentsAggregate?.aggregate?.count || 0,
        leaveRequests: user.leaveRequestsAggregate?.aggregate?.count || 0,
        userWorkSchedules: user.userWorkSchedulesAggregate?.aggregate?.count || 0,
      };

      // Determine blockers for deletion
      const blockers: string[] = [];
      if (dependencies.managedUsers > 0) {
        blockers.push(`Manages ${dependencies.managedUsers} users - need reassignment`);
      }
      if (dependencies.backupConsultantPayrolls > 0) {
        blockers.push(`Backup consultant on ${dependencies.backupConsultantPayrolls} payrolls`);
      }
      if (dependencies.consultantAssignments > 0) {
        blockers.push(`Primary consultant on ${dependencies.consultantAssignments} assignments`);
      }
      if (dependencies.billingItems > 0) {
        blockers.push(`Has ${dependencies.billingItems} billing items`);
      }

      const canSafelyDelete = blockers.length === 0 && 
        dependencies.managedUsers === 0 && 
        dependencies.backupConsultantPayrolls === 0 &&
        dependencies.consultantAssignments === 0;

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
      const candidatesData = await executeTypedQuery(GET_USERS_FOR_REASSIGNMENT, {
        excludeUserId: targetUser.id
      });

      return NextResponse.json({
        candidates: (candidatesData as any).users || []
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
      await executeTypedMutation(
        gql`mutation ReassignManagedUsers($fromUserId: uuid!, $toUserId: uuid!) {
          updateUsers(
            where: { managerId: { _eq: $fromUserId } }
            _set: { managerId: $toUserId }
          ) {
            affectedRows
          }
        }`,
        { fromUserId, toUserId }
      );

      // 2. Reassign payroll backup consultant roles
      await executeTypedMutation(
        gql`mutation ReassignBackupConsultant($fromUserId: uuid!, $toUserId: uuid!) {
          updatePayrolls(
            where: { backupConsultantId: { _eq: $fromUserId } }
            _set: { backupConsultantId: $toUserId }
          ) {
            affectedRows
          }
        }`,
        { fromUserId, toUserId }
      );

      // 3. Reassign consultant assignments
      await executeTypedMutation(
        gql`mutation ReassignConsultantAssignments($fromUserId: uuid!, $toUserId: uuid!) {
          updatePayrollAssignments(
            where: { consultantId: { _eq: $fromUserId } }
            _set: { consultantId: $toUserId }
          ) {
            affectedRows
          }
        }`,
        { fromUserId, toUserId }
      );

      // 4. Reassign invitations sent by user
      await executeTypedMutation(
        gql`mutation ReassignSentInvitations($fromUserId: uuid!, $toUserId: uuid!) {
          updateUserInvitations(
            where: { invitedBy: { _eq: $fromUserId } }
            _set: { invitedBy: $toUserId }
          ) {
            affectedRows
          }
        }`,
        { fromUserId, toUserId }
      );

      // 5. Get user data for Clerk deletion
      const userData = await executeTypedQuery(
        gql`query GetUserForDeletion($userId: uuid!) {
          userByPk(id: $userId) {
            clerkUserId
            email
          }
        }`,
        { userId: fromUserId }
      );

      // 6. Delete from Clerk if Clerk user exists
      if ((userData as any).userByPk?.clerkUserId) {
        try {
          await clerkClient.users.deleteUser((userData as any).userByPk.clerkUserId);
          console.log(`✅ Deleted Clerk user: ${(userData as any).userByPk.clerkUserId}`);
        } catch (clerkError: any) {
          console.warn(`⚠️ Could not delete Clerk user: ${clerkError?.message || 'Unknown error'}`);
        }
      }

      // 7. Delete user from database
      const deletionResult = await executeTypedMutation(
        gql`mutation DeleteUser($userId: uuid!) {
          deleteUsersByPk(id: $userId) {
            id
            email
          }
        }`,
        { userId: fromUserId }
      );

      console.log(`✅ User deletion completed: ${(userData as any).userByPk?.email}`);

      return NextResponse.json({
        success: true,
        message: `User ${(userData as any).userByPk?.email} successfully deleted and data reassigned to new user`,
        deletedUser: (deletionResult as any).deleteUsersByPk,
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
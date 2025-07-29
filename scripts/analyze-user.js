#!/usr/bin/env node

/**
 * Script to analyze user dependencies before deletion
 * Usage: node scripts/analyze-user.js <email>
 */

import { executeTypedQuery } from '../lib/apollo/query-helpers.js';

const ANALYZE_USER_DEPENDENCIES = `
  query AnalyzeUserDependencies($userId: uuid!) {
    user: userById(id: $userId) {
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

const GET_USER_BY_EMAIL = `
  query GetUserByEmail($email: String!) {
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
  }
`;

async function analyzeUser(email) {
  try {
    console.log(`🔍 Analyzing user: ${email}`);
    
    // First find the user by email
    const userByEmailData = await executeTypedQuery(GET_USER_BY_EMAIL, { email });
    const targetUser = userByEmailData.users?.[0];
    
    if (!targetUser) {
      console.log(`❌ User not found: ${email}`);
      return;
    }
    
    console.log(`✅ Found user:`, {
      id: targetUser.id,
      email: targetUser.email,
      name: `${targetUser.firstName} ${targetUser.lastName}`,
      role: targetUser.role,
      isActive: targetUser.isActive,
      clerkUserId: targetUser.clerkUserId
    });
    
    // Analyze dependencies
    const analysisData = await executeTypedQuery(ANALYZE_USER_DEPENDENCIES, { 
      userId: targetUser.id 
    });
    
    const user = analysisData.user;
    if (!user) {
      console.log(`❌ User not found during analysis: ${email}`);
      return;
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
    
    console.log(`\n📊 Dependency Analysis:`);
    Object.entries(dependencies).forEach(([key, count]) => {
      if (count > 0) {
        console.log(`  ${key}: ${count}`);
      }
    });
    
    // Determine blockers for deletion
    const blockers = [];
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
    
    console.log(`\n🚦 Deletion Assessment:`);
    console.log(`  Can safely delete: ${canSafelyDelete ? '✅ YES' : '❌ NO'}`);
    
    if (blockers.length > 0) {
      console.log(`  Blockers:`);
      blockers.forEach(blocker => console.log(`    - ${blocker}`));
    }
    
    return {
      user: targetUser,
      dependencies,
      canSafelyDelete,
      blockers
    };
    
  } catch (error) {
    console.error(`❌ Analysis failed:`, error.message);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node scripts/analyze-user.js <email>');
    process.exit(1);
  }
  
  analyzeUser(email)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { analyzeUser };
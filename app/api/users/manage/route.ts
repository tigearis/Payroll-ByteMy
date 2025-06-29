import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { executeTypedQuery, executeTypedMutation } from '@/lib/apollo/query-helpers';
import { withAuth } from '@/lib/auth/api-auth';
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';
import {
  GetUsersByStatusDocument,
  GetUserWithStatusDetailsDocument,
  GetCurrentUserRoleForManagementDocument,
  DeactivateUserWithReasonDocument,
  LockUserWithReasonDocument,
  UnlockUserWithReasonDocument,
  ReactivateUserWithReasonDocument,
  type GetUsersByStatusQuery,
  type GetUserWithStatusDetailsQuery,
  type GetCurrentUserRoleForManagementQuery,
  type DeactivateUserWithReasonMutation,
  type LockUserWithReasonMutation,
  type UnlockUserWithReasonMutation,
  type ReactivateUserWithReasonMutation,
} from '@/domains/users/graphql/generated/graphql';


// Validation schemas
const UserStatusActionSchema = z.object({
  action: z.enum(['deactivate', 'lock', 'unlock', 'reactivate']),
  userId: z.string().uuid(),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long'),
  metadata: z.record(z.any()).optional(),
});

const GetUsersSchema = z.object({
  statuses: z.array(z.enum(['active', 'inactive', 'locked', 'pending'])).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

// Role hierarchy for authorization
const ROLE_HIERARCHY = {
  viewer: 1,
  consultant: 2, 
  manager: 3,
  org_admin: 4,
  developer: 5,
};

function canManageUser(adminRole: string, targetRole: string): boolean {
  const adminLevel = ROLE_HIERARCHY[adminRole as keyof typeof ROLE_HIERARCHY] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY] || 0;
  return adminLevel > targetLevel;
}

export const GET = withAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const validatedParams = GetUsersSchema.parse({
      statuses: searchParams.get('statuses')?.split(',') || ['active'],
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    });

    const data = await executeTypedQuery<GetUsersByStatusQuery>(
      GetUsersByStatusDocument,
      validatedParams
    );

    return NextResponse.json({
      users: data.users,
      total: data.usersAggregate.aggregate?.count || 0,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching users by status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request, { session }) => {
  try {
    const body = await request.json();
    const validatedData = UserStatusActionSchema.parse(body);
    const { action, userId: targetUserId, reason, metadata } = validatedData;

    // Get current user's role and target user details for authorization
    const [currentUserData, targetUserData] = await Promise.all([
      executeTypedQuery<GetCurrentUserRoleForManagementQuery>(
        GetCurrentUserRoleForManagementDocument,
        { userId: session.databaseId }
      ),
      executeTypedQuery<GetUserWithStatusDetailsQuery>(
        GetUserWithStatusDetailsDocument,
        { userId: targetUserId }
      ),
    ]);

    const currentUser = currentUserData.userById;
    const targetUser = targetUserData.userById;

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Authorization check - can only manage users with lower role hierarchy
    if (!canManageUser(currentUser.role, targetUser.role)) {
      await auditLogger.logSOC2Event({
        level: LogLevel.WARNING,
        eventType: SOC2EventType.SECURITY_VIOLATION,
        category: LogCategory.SECURITY_EVENT,
        complianceNote: 'Unauthorized user status change attempt',
        success: false,
        userId: session.databaseId,
        resourceType: 'user_status',
        action: `unauthorized_${action}`,
        metadata: {
          targetUserId,
          currentUserRole: currentUser.role,
          targetUserRole: targetUser.role,
          action,
        },
      });

      return NextResponse.json(
        { error: 'Insufficient permissions to manage this user' },
        { status: 403 }
      );
    }

    // Prevent self-modification for certain actions
    if (session.databaseId === targetUserId && ['deactivate', 'lock'].includes(action)) {
      return NextResponse.json(
        { error: 'Cannot deactivate or lock your own account' },
        { status: 400 }
      );
    }

    let result;
    let auditAction;

    switch (action) {
      case 'deactivate':
        result = await executeTypedMutation<DeactivateUserWithReasonMutation>(
          DeactivateUserWithReasonDocument,
          {
            userId: targetUserId,
            reason,
            deactivatedBy: session.databaseId,
            deactivatedByString: session.databaseId,
          }
        );
        auditAction = 'user_deactivated';
        break;
      case 'lock':
        result = await executeTypedMutation<LockUserWithReasonMutation>(
          LockUserWithReasonDocument,
          {
            userId: targetUserId,
            reason,
            lockedBy: session.databaseId,
          }
        );
        auditAction = 'user_locked';
        break;
      case 'unlock':
        result = await executeTypedMutation<UnlockUserWithReasonMutation>(
          UnlockUserWithReasonDocument,
          {
            userId: targetUserId,
            reason,
            unlockedBy: session.databaseId,
          }
        );
        auditAction = 'user_unlocked';
        break;
      case 'reactivate':
        result = await executeTypedMutation<ReactivateUserWithReasonMutation>(
          ReactivateUserWithReasonDocument,
          {
            userId: targetUserId,
            reason,
            reactivatedBy: session.databaseId,
          }
        );
        auditAction = 'user_reactivated';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedUser = result.updateUserById;

    // Comprehensive audit logging
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      eventType: SOC2EventType.USER_MODIFIED,
      category: LogCategory.AUTHENTICATION,
      complianceNote: `User status changed: ${action}`,
      success: true,
      userId: session.databaseId,
      resourceId: targetUserId,
      resourceType: 'user',
      action: auditAction,
      metadata: {
        action,
        reason,
        targetUserEmail: targetUser.email,
        targetUserRole: targetUser.role,
        previousStatus: targetUser.status,
        newStatus: updatedUser?.status,
        isActive: updatedUser?.isActive,
        metadata,
      },
    });

    return NextResponse.json({
      user: updatedUser,
      success: true,
      message: `User ${action}d successfully`,
    });

  } catch (error) {
    console.error('Error managing user status:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to manage user status' },
      { status: 500 }
    );
  }
});
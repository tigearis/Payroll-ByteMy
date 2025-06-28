import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { adminApolloClient } from '@/lib/apollo/unified-client';
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';
import { gql } from '@apollo/client';
import { z } from 'zod';

// User status management operations
const DEACTIVATE_USER = gql`
  mutation DeactivateUser(
    $userId: uuid!
    $reason: String!
    $deactivatedBy: uuid!
    $deactivatedByString: String!
  ) {
    updateUserById(
      pkColumns: { id: $userId }
      _set: {
        status: "inactive"
        isActive: false
        deactivatedAt: "now()"
        deactivatedBy: $deactivatedByString
        statusChangeReason: $reason
        statusChangedAt: "now()"
        statusChangedBy: $deactivatedBy
        updatedAt: "now()"
      }
    ) {
      id
      email
      name
      status
      isActive
      deactivatedAt
      statusChangeReason
      statusChangedAt
    }
  }
`;

const LOCK_USER = gql`
  mutation LockUser(
    $userId: uuid!
    $reason: String!
    $lockedBy: uuid!
  ) {
    updateUserById(
      pkColumns: { id: $userId }
      _set: {
        status: "locked"
        isActive: false
        statusChangeReason: $reason
        statusChangedAt: "now()"
        statusChangedBy: $lockedBy
        updatedAt: "now()"
      }
    ) {
      id
      email
      name
      status
      isActive
      statusChangeReason
      statusChangedAt
    }
  }
`;

const UNLOCK_USER = gql`
  mutation UnlockUser(
    $userId: uuid!
    $reason: String!
    $unlockedBy: uuid!
  ) {
    updateUserById(
      pkColumns: { id: $userId }
      _set: {
        status: "active"
        isActive: true
        statusChangeReason: $reason
        statusChangedAt: "now()"
        statusChangedBy: $unlockedBy
        updatedAt: "now()"
      }
    ) {
      id
      email
      name
      status
      isActive
      statusChangeReason
      statusChangedAt
    }
  }
`;

const REACTIVATE_USER = gql`
  mutation ReactivateUser(
    $userId: uuid!
    $reason: String!
    $reactivatedBy: uuid!
  ) {
    updateUserById(
      pkColumns: { id: $userId }
      _set: {
        status: "active"
        isActive: true
        deactivatedAt: null
        deactivatedBy: null
        statusChangeReason: $reason
        statusChangedAt: "now()"
        statusChangedBy: $reactivatedBy
        updatedAt: "now()"
      }
    ) {
      id
      email
      name
      status
      isActive
      statusChangeReason
      statusChangedAt
    }
  }
`;

const GET_USERS_BY_STATUS = gql`
  query GetUsersByStatus(
    $statuses: [user_status_enum!]
    $limit: Int = 50
    $offset: Int = 0
  ) {
    users(
      where: { status: { _in: $statuses } }
      orderBy: { updatedAt: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      email
      name
      role
      status
      isActive
      isStaff
      statusChangedAt
      statusChangeReason
      deactivatedAt
      createdAt
    }
    usersAggregate(
      where: { status: { _in: $statuses } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const GET_USER_WITH_STATUS_DETAILS = gql`
  query GetUserWithStatusDetails($userId: uuid!) {
    userById(id: $userId) {
      id
      email
      name
      role
      status
      isActive
      isStaff
      clerkUserId
      statusChangedAt
      statusChangedBy
      statusChangeReason
      deactivatedAt
      deactivatedBy
      createdAt
      updatedAt
      statusChangedByUser {
        id
        name
        email
        role
      }
      deactivatedByUser {
        id
        name
        email
        role
      }
    }
  }
`;

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

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const validatedParams = GetUsersSchema.parse({
      statuses: searchParams.get('statuses')?.split(',') || ['active'],
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
    });

    const { data } = await adminApolloClient.query({
      query: GET_USERS_BY_STATUS,
      variables: validatedParams,
    });

    // Log audit event
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: SOC2EventType.DATA_ACCESS,
      category: LogCategory.AUTHENTICATION,
      complianceNote: 'User status list accessed',
      success: true,
      userId,
      resourceType: 'user_status',
      action: 'list_users_by_status',
      metadata: validatedParams,
    });

    return NextResponse.json({
      users: data.users,
      total: data.usersAggregate.aggregate.count,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching users by status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = UserStatusActionSchema.parse(body);
    const { action, userId: targetUserId, reason, metadata } = validatedData;

    // Get current user's role and target user details for authorization
    const { data: currentUserData } = await adminApolloClient.query({
      query: gql`
        query GetCurrentUserRole($userId: uuid!) {
          userById(id: $userId) {
            id
            role
          }
        }
      `,
      variables: { userId },
    });

    const { data: targetUserData } = await adminApolloClient.query({
      query: GET_USER_WITH_STATUS_DETAILS,
      variables: { userId: targetUserId },
    });

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
        userId,
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
    if (userId === targetUserId && ['deactivate', 'lock'].includes(action)) {
      return NextResponse.json(
        { error: 'Cannot deactivate or lock your own account' },
        { status: 400 }
      );
    }

    let result;
    let auditAction;
    let mutation;

    switch (action) {
      case 'deactivate':
        mutation = DEACTIVATE_USER;
        auditAction = 'user_deactivated';
        break;
      case 'lock':
        mutation = LOCK_USER;
        auditAction = 'user_locked';
        break;
      case 'unlock':
        mutation = UNLOCK_USER;
        auditAction = 'user_unlocked';
        break;
      case 'reactivate':
        mutation = REACTIVATE_USER;
        auditAction = 'user_reactivated';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const { data: mutationData } = await adminApolloClient.mutate({
      mutation,
      variables: {
        userId: targetUserId,
        reason,
        [`${action}dBy`]: userId, // deactivatedBy, lockedBy, etc.
        ...(action === 'deactivate' && { deactivatedByString: userId }), // String version for deactivatedBy field
      },
    });

    result = mutationData[Object.keys(mutationData)[0]];

    // Comprehensive audit logging
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      eventType: SOC2EventType.USER_MODIFIED,
      category: LogCategory.AUTHENTICATION,
      complianceNote: `User status changed: ${action}`,
      success: true,
      userId,
      resourceId: targetUserId,
      resourceType: 'user',
      action: auditAction,
      metadata: {
        action,
        reason,
        targetUserEmail: targetUser.email,
        targetUserRole: targetUser.role,
        previousStatus: targetUser.status,
        newStatus: result.status,
        isActive: result.isActive,
        metadata,
      },
    });

    return NextResponse.json({
      user: result,
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
}
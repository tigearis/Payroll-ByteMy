import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { adminApolloClient } from '@/lib/apollo/unified-client';
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';
import { gql } from '@apollo/client';
import { z } from 'zod';

const GET_USER_STATUS_HISTORY = gql`
  query GetUserStatusHistory(
    $userId: uuid!
    $startDate: timestamptz
    $endDate: timestamptz
    $limit: Int = 50
  ) {
    # Current user status
    user: userById(id: $userId) {
      id
      email
      name
      role
      status
      isActive
      statusChangedAt
      statusChangedBy
      statusChangeReason
      deactivatedAt
      deactivatedBy
      createdAt
      updatedAt
    }
    
    # Note: Audit logs query removed - will be implemented when audit.audit_log table is properly exposed
  }
`;

const SEARCH_USERS_ADVANCED = gql`
  query SearchUsersAdvanced(
    $searchTerm: String
    $statuses: [user_status_enum!]
    $roles: [user_role!]
    $isStaff: Boolean
    $limit: Int = 20
  ) {
    users(
      where: {
        _and: [
          {
            _or: [
              { email: { _ilike: $searchTerm } }
              { name: { _ilike: $searchTerm } }
            ]
          }
          { status: { _in: $statuses } }
          { role: { _in: $roles } }
          { isStaff: { _eq: $isStaff } }
        ]
      }
      orderBy: { updatedAt: DESC }
      limit: $limit
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
  }
`;

const GetStatusHistorySchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().min(1).max(200).optional(),
});

const SearchUsersSchema = z.object({
  searchTerm: z.string().min(1).optional(),
  statuses: z.array(z.enum(['active', 'inactive', 'locked', 'pending'])).optional(),
  roles: z.array(z.enum(['developer', 'org_admin', 'manager', 'consultant', 'viewer'])).optional(),
  isStaff: z.boolean().optional(),
  limit: z.number().min(1).max(100).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'history';

    if (action === 'search') {
      // Advanced user search
      const searchTerm = searchParams.get('searchTerm');
      const validatedParams = SearchUsersSchema.parse({
        searchTerm: searchTerm ? `%${searchTerm}%` : undefined,
        statuses: searchParams.get('statuses')?.split(',') || undefined,
        roles: searchParams.get('roles')?.split(',') || undefined,
        isStaff: searchParams.get('isStaff') ? searchParams.get('isStaff') === 'true' : undefined,
        limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      });

      const { data } = await adminApolloClient.query({
        query: SEARCH_USERS_ADVANCED,
        variables: validatedParams,
      });

      await auditLogger.logSOC2Event({
        level: LogLevel.INFO,
        eventType: SOC2EventType.DATA_ACCESS,
        category: LogCategory.AUTHENTICATION,
        complianceNote: 'Advanced user search performed',
        success: true,
        userId: currentUserId,
        resourceType: 'user_search',
        action: 'advanced_search',
        metadata: validatedParams,
      });

      return NextResponse.json({
        users: data.users,
        success: true,
      });
    }

    // User status history
    const validatedParams = GetStatusHistorySchema.parse({
      userId: searchParams.get('userId')!,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
    });

    const { data } = await adminApolloClient.query({
      query: GET_USER_STATUS_HISTORY,
      variables: {
        ...validatedParams,
        startDate: validatedParams.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        endDate: validatedParams.endDate || new Date().toISOString(),
      },
    });

    if (!data.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Note: Status changes processing removed - will be implemented with audit logs

    // Log audit event for accessing user history
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      eventType: SOC2EventType.DATA_ACCESS,
      category: LogCategory.AUDIT,
      complianceNote: 'User status history accessed for audit review',
      success: true,
      userId: currentUserId,
      resourceId: validatedParams.userId,
      resourceType: 'user_status_history',
      action: 'status_history_view',
      metadata: {
        targetUserId: validatedParams.userId,
        targetUserEmail: data.user.email,
        dateRange: {
          startDate: validatedParams.startDate,
          endDate: validatedParams.endDate,
        },
        limit: validatedParams.limit,
      },
    });

    return NextResponse.json({
      user: data.user,
      statusChanges: [], // Will be populated when audit logs are properly exposed
      summary: {
        totalChanges: 0,
        currentStatus: data.user.status,
        isActive: data.user.isActive,
        lastChanged: data.user.statusChangedAt,
        lastChangedBy: 'System',
      },
      success: true,
    });

  } catch (error) {
    console.error('Error fetching user status history:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch user status history' },
      { status: 500 }
    );
  }
}
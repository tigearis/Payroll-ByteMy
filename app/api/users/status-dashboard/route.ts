import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { adminApolloClient } from '@/lib/apollo/unified-client';
import { auditLogger, LogLevel, SOC2EventType, LogCategory } from '@/lib/security/audit/logger';
import { gql } from '@apollo/client';

const GET_USER_STATUS_DASHBOARD_STATS = gql`
  query GetUserStatusDashboardStats {
    active: usersAggregate(
      where: { status: { _eq: "active" } }
    ) {
      aggregate { count }
    }
    
    inactive: usersAggregate(
      where: { status: { _eq: "inactive" } }
    ) {
      aggregate { count }
    }
    
    locked: usersAggregate(
      where: { status: { _eq: "locked" } }
    ) {
      aggregate { count }
    }
    
    pending: usersAggregate(
      where: { status: { _eq: "pending" } }
    ) {
      aggregate { count }
    }
    
    staff: usersAggregate(
      where: { isStaff: { _eq: true } }
    ) {
      aggregate { count }
    }
    
    recentStatusChanges: users(
      where: { statusChangedAt: { _gte: "now() - interval '30 days'" } }
      orderBy: { statusChangedAt: DESC }
      limit: 10
    ) {
      id
      email
      name
      role
      status
      statusChangedAt
      statusChangeReason
    }
    
    byRole: users(
      where: { isActive: { _eq: true } }
    ) {
      role
    }
  }
`;

const GET_USERS_REQUIRING_ATTENTION = gql`
  query GetUsersRequiringAttention($limit: Int = 20) {
    locked: users(
      where: { status: { _eq: "locked" } }
      orderBy: { statusChangedAt: DESC }
      limit: $limit
    ) {
      id
      email
      name
      role
      status
      statusChangedAt
      statusChangeReason
    }
    
    inactive: users(
      where: { status: { _eq: "inactive" } }
      orderBy: { deactivatedAt: DESC }
      limit: $limit
    ) {
      id
      email
      name
      role
      status
      deactivatedAt
      statusChangeReason
    }
    
    pending: users(
      where: { status: { _eq: "pending" } }
      orderBy: { createdAt: DESC }
      limit: $limit
    ) {
      id
      email
      name
      role
      status
      createdAt
    }
  }
`;

const GET_USER_STATUS_TRENDS = gql`
  query GetUserStatusTrends($days: Int = 30) {
    statusChanges: users(
      where: { statusChangedAt: { _gte: "now() - interval '30 days'" } }
      orderBy: { statusChangedAt: DESC }
      limit: 100
    ) {
      id
      status
      statusChangedAt
      statusChangeReason
      role
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeAttention = searchParams.get('includeAttention') === 'true';
    const includeTrends = searchParams.get('includeTrends') === 'true';
    const attentionLimit = parseInt(searchParams.get('attentionLimit') || '20');
    const trendsDays = parseInt(searchParams.get('trendsDays') || '30');

    // Get dashboard statistics
    const { data: statsData } = await adminApolloClient.query({
      query: GET_USER_STATUS_DASHBOARD_STATS,
    });

    // Calculate role distribution
    const roleDistribution = statsData.byRole.reduce((acc: Record<string, number>, user: any) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    let usersRequiringAttention = null;
    if (includeAttention) {
      const { data: attentionData } = await adminApolloClient.query({
        query: GET_USERS_REQUIRING_ATTENTION,
        variables: { limit: attentionLimit },
      });
      usersRequiringAttention = attentionData;
    }

    let statusTrends = null;
    if (includeTrends) {
      const { data: trendsData } = await adminApolloClient.query({
        query: GET_USER_STATUS_TRENDS,
        variables: { days: trendsDays },
      });

      // Process trends data
      const trendsByDay = trendsData.statusChanges.reduce((acc: Record<string, any>, change: any) => {
        const date = new Date(change.statusChangedAt).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, activated: 0, deactivated: 0, locked: 0, unlocked: 0 };
        }
        
        if (change.status === 'active') acc[date].activated++;
        else if (change.status === 'inactive') acc[date].deactivated++;
        else if (change.status === 'locked') acc[date].locked++;
        
        return acc;
      }, {});

      statusTrends = {
        dailyTrends: Object.values(trendsByDay),
        totalChanges: trendsData.statusChanges.length,
        changesByRole: trendsData.statusChanges.reduce((acc: Record<string, number>, change: any) => {
          const role = change.statusChangedByUser?.role || 'system';
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        }, {}),
      };
    }

    const response = {
      stats: {
        active: statsData.active.aggregate.count,
        inactive: statsData.inactive.aggregate.count,
        locked: statsData.locked.aggregate.count,
        pending: statsData.pending.aggregate.count,
        staff: statsData.staff.aggregate.count,
        total: statsData.active.aggregate.count + statsData.inactive.aggregate.count + 
               statsData.locked.aggregate.count + statsData.pending.aggregate.count,
      },
      roleDistribution,
      recentStatusChanges: statsData.recentStatusChanges,
      usersRequiringAttention,
      statusTrends,
      success: true,
    };

    // Log audit event
    await auditLogger.logSOC2Event({
      level: LogLevel.INFO,
      eventType: SOC2EventType.DATA_ACCESS,
      category: LogCategory.AUTHENTICATION,
      complianceNote: 'User status dashboard accessed',
      success: true,
      userId,
      resourceType: 'user_status_dashboard',
      action: 'dashboard_view',
      metadata: {
        includeAttention,
        includeTrends,
        attentionLimit,
        trendsDays,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user status dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
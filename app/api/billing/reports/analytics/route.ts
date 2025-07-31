import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/api-auth';
import { executeTypedQuery } from '@/lib/apollo/query-helpers';
import { 
  GetBillingAnalyticsDocument,
  GetClientBillingStatsDocument,
  GetStaffAnalyticsPerformanceDocument
} from '@/domains/billing/graphql/generated/graphql';

interface AnalyticsRequest {
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  staffUserId?: string;
  includeClientStats?: boolean;
  includeStaffPerformance?: boolean;
}

/**
 * GET /api/billing/reports/analytics
 * 
 * Provides comprehensive billing analytics including revenue metrics,
 * client performance, staff billing performance, and trend analysis.
 */
export const GET = withAuth(async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const clientId = searchParams.get('clientId');
    const staffUserId = searchParams.get('staffUserId');
    const includeClientStats = searchParams.get('includeClientStats') === 'true';
    const includeStaffPerformance = searchParams.get('includeStaffPerformance') === 'true';

    // Check permissions - analytics require at least manager role
    const userRole = session.role || session.defaultRole || 'viewer';
    if (!['developer', 'org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to view billing analytics' },
        { status: 403 }
      );
    }

    // Set default date range if not provided (last 30 days)
    const defaultDateTo = new Date().toISOString();
    const defaultDateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const analyticsVariables = {
      dateFrom: dateFrom || defaultDateFrom,
      dateTo: dateTo || defaultDateTo,
      clientId: clientId || null,
      staffUserId: staffUserId || null
    };

    // Get main analytics data
    const analyticsData = await executeTypedQuery(
      GetBillingAnalyticsDocument,
      analyticsVariables
    );

    const analytics = {
      totalRevenue: 0,
      totalItems: 0,
      totalHours: 0,
      averageHourlyRate: 0,
      revenueByStatus: {
        draft: 0,
        confirmed: 0,
        invoiced: 0,
        paid: 0,
        rejected: 0
      },
      revenueByMonth: [],
      topClients: [],
      topServices: [],
      ...(analyticsData as any)?.billingAnalytics
    };

    const result: any = {
      analytics,
      dateRange: {
        from: analyticsVariables.dateFrom,
        to: analyticsVariables.dateTo
      },
      filters: {
        clientId: clientId || null,
        staffUserId: staffUserId || null
      }
    };

    // Include client statistics if requested
    if (includeClientStats) {
      const clientStatsData = await executeTypedQuery(
        GetClientBillingStatsDocument,
        {
          dateFrom: analyticsVariables.dateFrom,
          dateTo: analyticsVariables.dateTo,
          clientId: clientId || null
        }
      );

      result.clientStats = (clientStatsData as any)?.clientBillingStats || [];
    }

    // Include staff performance if requested
    if (includeStaffPerformance) {
      const staffPerformanceData = await executeTypedQuery(
        GetStaffAnalyticsPerformanceDocument,
        {
          dateFrom: analyticsVariables.dateFrom,
          dateTo: analyticsVariables.dateTo,
          staffUserId: staffUserId || null
        }
      );

      result.staffPerformance = (staffPerformanceData as any)?.staffBillingPerformance || [];
    }

    // Calculate some derived metrics
    if (analytics.totalHours > 0 && analytics.totalRevenue > 0) {
      analytics.averageHourlyRate = Math.round((analytics.totalRevenue / analytics.totalHours) * 100) / 100;
    }

    // Calculate approval rate
    const totalApproved = analytics.revenueByStatus.confirmed + analytics.revenueByStatus.invoiced + analytics.revenueByStatus.paid;
    const approvalRate = analytics.totalRevenue > 0 ? (totalApproved / analytics.totalRevenue) * 100 : 0;
    analytics.approvalRate = Math.round(approvalRate * 100) / 100;

    // Calculate payment rate (of invoiced items)
    const totalInvoiced = analytics.revenueByStatus.invoiced + analytics.revenueByStatus.paid;
    const paymentRate = totalInvoiced > 0 ? (analytics.revenueByStatus.paid / totalInvoiced) * 100 : 0;
    analytics.paymentRate = Math.round(paymentRate * 100) / 100;

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        generatedAt: new Date().toISOString(),
        userRole,
        permissions: {
          canViewClientStats: includeClientStats,
          canViewStaffPerformance: includeStaffPerformance
        }
      }
    });

  } catch (error) {
    console.error('Error generating billing analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate billing analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/billing/reports/analytics
 * 
 * Alternative POST endpoint for complex analytics queries with large filter objects
 */
export const POST = withAuth(async (req: NextRequest, session) => {
  try {
    const body: AnalyticsRequest = await req.json();

    // Check permissions
    const userRole = session.role || session.defaultRole || 'viewer';
    if (!['developer', 'org_admin', 'manager'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions to view billing analytics' },
        { status: 403 }
      );
    }

    // Convert POST body to query parameters and reuse GET logic
    const queryParams = new URLSearchParams();
    if (body.dateFrom) queryParams.set('dateFrom', body.dateFrom);
    if (body.dateTo) queryParams.set('dateTo', body.dateTo);
    if (body.clientId) queryParams.set('clientId', body.clientId);
    if (body.staffUserId) queryParams.set('staffUserId', body.staffUserId);
    if (body.includeClientStats) queryParams.set('includeClientStats', 'true');
    if (body.includeStaffPerformance) queryParams.set('includeStaffPerformance', 'true');

    // Create a new request with query parameters
    const newUrl = `${req.url}?${queryParams.toString()}`;
    const newReq = new NextRequest(newUrl, { method: 'GET' });

    // Reuse GET handler
    return await exports.GET(newReq, session);

  } catch (error) {
    console.error('Error in POST billing analytics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process analytics request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
import { gql } from "@apollo/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuth } from "@/lib/auth/api-auth";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// Input validation schema
const reportInputSchema = z.object({
  reportType: z.enum([
    "user_access",
    "permission_usage",
    "security_events",
    "full_compliance",
  ]),
  startDate: z.string(),
  endDate: z.string(),
  includeDetails: z.boolean().optional().default(false),
});

// GraphQL queries for reports
const USER_ACCESS_REPORT = gql`
  query UserAccessReport($startDate: timestamptz!, $endDate: timestamptz!) {
    audit_user_access_summary {
      user_id
      user_name
      email
      role
      is_active
      total_actions
      read_actions
      write_actions
      successful_logins
      failed_logins
      last_activity
      last_login
    }

    audit_audit_log_aggregate(
      where: { event_time: { _gte: $startDate, _lte: $endDate } }
    ) {
      aggregate {
        count
      }
      nodes {
        action
        resource_type
        success
      }
    }
  }
`;

const PERMISSION_USAGE_REPORT = gql`
  query PermissionUsageReport {
    audit_permission_usage_report {
      role_name
      resource_name
      action
      users_with_permission
      users_who_used_permission
      total_usage_count
      last_used
    }
  }
`;

const SECURITY_EVENTS_REPORT = gql`
  query SecurityEventsReport($startDate: timestamptz!, $endDate: timestamptz!) {
    security_event_log(
      where: { created_at: { _gte: $startDate, _lte: $endDate } }
      order_by: { severity: desc, created_at: desc }
    ) {
      id
      event_type
      severity
      user_id
      details
      resolved
      created_at
      resolved_at
    }

    security_event_log_aggregate(
      where: { created_at: { _gte: $startDate, _lte: $endDate } }
    ) {
      aggregate {
        count
      }
      nodes {
        severity
        resolved
      }
    }
  }
`;

// Secure compliance report generation with admin authentication
export const POST = withAuth(
  async (request: NextRequest, session) => {
    try {
      // Log compliance report access
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "compliance_report",
        action: "GENERATE",
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        complianceNote: "Compliance report generation requested",
      });

      // Parse and validate input
      const body = await request.json();
      const validatedInput = reportInputSchema.parse(body);

      // Convert dates
      const startDate = new Date(validatedInput.startDate).toISOString();
      const endDate = new Date(validatedInput.endDate).toISOString();

      let reportData: any = {};
      let summary: any = {
        reportType: validatedInput.reportType,
        period: {
          start: startDate,
          end: endDate,
        },
        generatedAt: new Date().toISOString(),
      };

      // Generate report based on type
      switch (validatedInput.reportType) {
        case "user_access":
          const userAccessResult = await adminApolloClient.query({
            query: USER_ACCESS_REPORT,
            variables: { startDate, endDate },
          });

          reportData.userAccess =
            userAccessResult.data.audit_user_access_summary;
          reportData.activitySummary =
            userAccessResult.data.audit_audit_log_aggregate;

          summary.totalUsers = reportData.userAccess.length;
          summary.activeUsers = reportData.userAccess.filter(
            (u: any) => u.is_active
          ).length;
          summary.totalActions = reportData.activitySummary.aggregate.count;
          break;

        case "permission_usage":
          const permissionResult = await adminApolloClient.query({
            query: PERMISSION_USAGE_REPORT,
          });

          reportData.permissionUsage =
            permissionResult.data.audit_permission_usage_report;

          summary.totalPermissions = reportData.permissionUsage.length;
          summary.unusedPermissions = reportData.permissionUsage.filter(
            (p: any) => p.total_usage_count === 0
          ).length;
          break;

        case "security_events":
          const securityResult = await adminApolloClient.query({
            query: SECURITY_EVENTS_REPORT,
            variables: { startDate, endDate },
          });

          reportData.securityEvents = securityResult.data.security_event_log;
          reportData.eventsSummary =
            securityResult.data.security_event_log_aggregate;

          summary.totalEvents = reportData.eventsSummary.aggregate.count;
          summary.criticalEvents = reportData.securityEvents.filter(
            (e: any) => e.severity === "critical"
          ).length;
          summary.unresolvedEvents = reportData.securityEvents.filter(
            (e: any) => !e.resolved
          ).length;
          break;

        case "full_compliance":
          // Run all reports
          const [userAccess, permissions, security] = await Promise.all([
            adminApolloClient.query({
              query: USER_ACCESS_REPORT,
              variables: { startDate, endDate },
            }),
            adminApolloClient.query({
              query: PERMISSION_USAGE_REPORT,
            }),
            adminApolloClient.query({
              query: SECURITY_EVENTS_REPORT,
              variables: { startDate, endDate },
            }),
          ]);

          reportData = {
            userAccess: userAccess.data.audit_user_access_summary,
            activitySummary: userAccess.data.audit_audit_log_aggregate,
            permissionUsage: permissions.data.audit_permission_usage_report,
            securityEvents: security.data.security_event_log,
            eventsSummary: security.data.security_event_log_aggregate,
          };

          summary = {
            ...summary,
            compliance: {
              score: calculateComplianceScore(reportData),
              issues: identifyComplianceIssues(reportData),
              recommendations: generateRecommendations(reportData),
            },
          };
          break;
      }

      // Generate report URL (in production, this would upload to S3 or similar)
      const reportId = crypto.randomUUID();
      const reportUrl = `/reports/compliance/${reportId}`;

      // Store report data (in production, save to storage)
      if (validatedInput.includeDetails) {
        // Include full report data
        summary.detailedData = reportData;
      }

      return NextResponse.json({
        success: true,
        reportUrl,
        summary,
        generatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Compliance Report API] Error generating report:", error);

      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "compliance_report",
        action: "GENERATE",
        success: false,
        errorMessage: error.message,
        metadata: {
          errorStack: error.stack,
        },
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        complianceNote: "Compliance report generation failed",
      });

      return NextResponse.json(
        {
          success: false,
          message: error.message || "Failed to generate compliance report",
        },
        { status: 500 }
      );
    }
  },
  {
    allowedRoles: ["developer", "org_admin"],
  }
);

// Helper functions
function calculateComplianceScore(data: any): number {
  let score = 100;

  // Deduct points for issues
  if (
    data.securityEvents.some(
      (e: any) => e.severity === "critical" && !e.resolved
    )
  ) {
    score -= 20;
  }

  const failedLoginRate =
    data.activitySummary.nodes.filter((n: any) => !n.success).length /
    data.activitySummary.aggregate.count;
  if (failedLoginRate > 0.1) {
    score -= 10;
  }

  const unusedPermissionRate =
    data.permissionUsage.filter((p: any) => p.total_usage_count === 0).length /
    data.permissionUsage.length;
  if (unusedPermissionRate > 0.3) {
    score -= 5;
  }

  return Math.max(0, score);
}

function identifyComplianceIssues(data: any): string[] {
  const issues: string[] = [];

  if (
    data.securityEvents.some(
      (e: any) => e.severity === "critical" && !e.resolved
    )
  ) {
    issues.push("Unresolved critical security events detected");
  }

  if (data.userAccess.some((u: any) => u.failed_logins > 10)) {
    issues.push("Users with excessive failed login attempts");
  }

  if (
    data.permissionUsage.some(
      (p: any) => p.users_with_permission > 0 && p.total_usage_count === 0
    )
  ) {
    issues.push("Unused permissions assigned to users");
  }

  return issues;
}

function generateRecommendations(data: any): string[] {
  const recommendations: string[] = [];

  if (data.securityEvents.length > 100) {
    recommendations.push("Implement automated security event resolution");
  }

  if (data.userAccess.some((u: any) => !u.last_login)) {
    recommendations.push("Review and deactivate unused user accounts");
  }

  if (data.permissionUsage.some((p: any) => p.total_usage_count > 1000)) {
    recommendations.push(
      "Consider implementing caching for frequently accessed resources"
    );
  }

  return recommendations;
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ComplianceAuditLogsDocument,
  type ComplianceAuditLogsQuery
} from "@/domains/audit/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
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

      const reportData: any = {};
      const summary: any = {
        reportType: validatedInput.reportType,
        period: {
          start: startDate,
          end: endDate,
        },
        generatedAt: new Date().toISOString(),
      };

      // Generate report based on type - using available audit log data
      const auditData = await executeTypedQuery<ComplianceAuditLogsQuery>(
        ComplianceAuditLogsDocument,
        { startDate, endDate }
      );

      reportData.auditLogs = auditData.auditLogs;
      reportData.auditSummary = { aggregate: { count: auditData.auditLogs.length } };

      // Generate basic summary for all report types
      summary.totalAuditLogs = reportData.auditSummary.aggregate.count;
      summary.successfulOperations = reportData.auditLogs.filter(
        (log: any) => log.success
      ).length;
      summary.failedOperations = reportData.auditLogs.filter(
        (log: any) => !log.success
      ).length;

      // Add report type specific summary
      switch (validatedInput.reportType) {
        case "user_access":
          summary.reportType = "User Access Report";
          summary.uniqueUsers = new Set(reportData.auditLogs.map((log: any) => log.userId)).size;
          break;

        case "permission_usage":
          summary.reportType = "Permission Usage Report";
          summary.resourceTypes = new Set(reportData.auditLogs.map((log: any) => log.resourceType)).size;
          break;

        case "security_events":
          summary.reportType = "Security Events Report";
          summary.failureRate = (summary.failedOperations / summary.totalAuditLogs * 100).toFixed(2) + "%";
          break;

        case "full_compliance":
          summary.reportType = "Full Compliance Report";
          summary.compliance = {
            score: calculateComplianceScore(reportData),
            issues: identifyComplianceIssues(reportData),
            recommendations: generateRecommendations(reportData),
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

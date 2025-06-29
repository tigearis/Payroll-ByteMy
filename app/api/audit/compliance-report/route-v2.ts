import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ComplianceAuditLogsDocument,
  type ComplianceAuditLogsQuery
} from "@/domains/audit/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { 
  getAuthorizationContext, 
  hasAnyRole, 
  hasPermission,
  checkPermissionWithContext 
} from "@/lib/auth/token-utils-v2";
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

/**
 * Enhanced compliance report generation with V2 token utilities
 * Demonstrates: Enhanced permission checking, dual ID support, detailed audit logging
 */
export async function POST(request: NextRequest) {
  try {
    // Enhanced authorization context - gets both database and Clerk IDs
    const authContext = await getAuthorizationContext();
    const { userId, clerkUserId, role, allowedRoles, permissions } = authContext;

    // Enhanced permission checking with context
    const adminCheck = await hasAnyRole(["developer", "org_admin"]);
    if (!adminCheck) {
      const permissionContext = await checkPermissionWithContext("audit:compliance_report");
      
      // Enhanced audit logging for failed access
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.SECURITY,
        category: LogCategory.ACCESS_DENIED,
        eventType: SOC2EventType.UNAUTHORIZED_ACCESS,
        userId,
        clerkUserId, // Enhanced: Track both IDs
        userRole: role,
        resourceType: "compliance_report",
        action: "GENERATE_ATTEMPT",
        success: false,
        errorMessage: permissionContext.reason || "Insufficient permissions",
        metadata: {
          requiredRoles: ["developer", "org_admin"],
          userAllowedRoles: allowedRoles,
          userPermissions: permissions,
          permissionCheck: permissionContext
        },
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        complianceNote: "Unauthorized compliance report access attempt"
      });

      return NextResponse.json(
        {
          success: false,
          error: "Access denied",
          reason: permissionContext.reason,
          suggestedAction: permissionContext.suggestedAction,
          requiredRoles: ["developer", "org_admin"],
          currentRole: role
        },
        { status: 403 }
      );
    }

    // Enhanced audit logging for successful access
    const clientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      category: LogCategory.SYSTEM_ACCESS,
      eventType: SOC2EventType.DATA_VIEWED,
      userId,
      clerkUserId, // Enhanced: Track both IDs
      userRole: role,
      resourceType: "compliance_report",
      action: "GENERATE",
      success: true,
      metadata: {
        userContext: authContext,
        requestPath: request.url
      },
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      complianceNote: "Compliance report generation authorized and initiated"
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
      generatedBy: {
        userId, // Database ID
        clerkUserId, // Clerk ID 
        role,
        allowedRoles
      }
    };

    // Generate report based on type - using available audit log data
    const auditData = await executeTypedQuery<ComplianceAuditLogsQuery>(
      ComplianceAuditLogsDocument,
      { startDate, endDate }
    );

    reportData.auditLogs = auditData.auditLogs;
    reportData.auditSummary = { aggregate: { count: auditData.auditLogs.length } };

    // Enhanced: Filter data based on user permissions
    if (role !== "developer") {
      // Non-developers get filtered view (remove sensitive data)
      reportData.auditLogs = reportData.auditLogs.map((log: any) => ({
        ...log,
        // Remove sensitive fields for non-developers
        ipAddress: log.ipAddress ? "***.**.***.***" : null,
        userAgent: log.userAgent ? "Browser (details hidden)" : null,
        metadata: role === "org_admin" ? log.metadata : "[redacted]"
      }));
    }

    // Generate basic summary for all report types
    summary.totalAuditLogs = reportData.auditSummary.aggregate.count;
    summary.successfulOperations = reportData.auditLogs.filter(
      (log: any) => log.success
    ).length;
    summary.failedOperations = reportData.auditLogs.filter(
      (log: any) => !log.success
    ).length;

    // Enhanced: Add security analysis
    summary.securityAnalysis = {
      suspiciousActivity: reportData.auditLogs.filter((log: any) => 
        !log.success && log.action?.includes("LOGIN")
      ).length,
      privilegeEscalation: reportData.auditLogs.filter((log: any) => 
        log.action?.includes("ROLE_CHANGE")
      ).length,
      dataAccess: reportData.auditLogs.filter((log: any) => 
        log.eventType === "DATA_VIEWED"
      ).length
    };

    // Add report type specific summary with enhanced analysis
    switch (validatedInput.reportType) {
      case "user_access":
        summary.reportType = "User Access Report";
        summary.uniqueUsers = new Set(reportData.auditLogs.map((log: any) => log.userId)).size;
        summary.uniqueClerkUsers = new Set(reportData.auditLogs.map((log: any) => log.clerkUserId)).size;
        summary.accessPatterns = analyzeAccessPatterns(reportData.auditLogs);
        break;

      case "permission_usage":
        summary.reportType = "Permission Usage Report";
        summary.resourceTypes = new Set(reportData.auditLogs.map((log: any) => log.resourceType)).size;
        summary.permissionAnalysis = analyzePermissionUsage(reportData.auditLogs);
        break;

      case "security_events":
        summary.reportType = "Security Events Report";
        summary.failureRate = (summary.failedOperations / summary.totalAuditLogs * 100).toFixed(2) + "%";
        summary.threatAnalysis = analyzeThreatPatterns(reportData.auditLogs);
        break;

      case "full_compliance":
        summary.reportType = "Full Compliance Report";
        summary.compliance = {
          score: calculateEnhancedComplianceScore(reportData),
          issues: identifyEnhancedComplianceIssues(reportData),
          recommendations: generateEnhancedRecommendations(reportData),
          riskLevel: calculateRiskLevel(reportData)
        };
        break;
    }

    // Generate report URL (in production, this would upload to S3 or similar)
    const reportId = crypto.randomUUID();
    const reportUrl = `/reports/compliance/${reportId}`;

    // Enhanced: Store report metadata with user context
    const reportMetadata = {
      id: reportId,
      type: validatedInput.reportType,
      generatedBy: authContext,
      period: { start: startDate, end: endDate },
      generatedAt: new Date().toISOString(),
      dataClassification: role === "developer" ? "FULL_ACCESS" : "FILTERED",
      complianceLevel: "SOC2_TYPE_II"
    };

    // Store report data (in production, save to storage)
    if (validatedInput.includeDetails) {
      // Include full report data with user context
      summary.detailedData = reportData;
      summary.reportMetadata = reportMetadata;
    }

    // Final audit log for successful completion
    await auditLogger.logSOC2Event({
      level: LogLevel.AUDIT,
      category: LogCategory.DATA_EXPORT,
      eventType: SOC2EventType.DATA_EXPORTED,
      userId,
      clerkUserId,
      userRole: role,
      resourceType: "compliance_report",
      action: "GENERATE_COMPLETE",
      success: true,
      metadata: {
        reportId,
        reportType: validatedInput.reportType,
        recordCount: summary.totalAuditLogs,
        includeDetails: validatedInput.includeDetails,
        dataClassification: reportMetadata.dataClassification
      },
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      complianceNote: `Compliance report ${reportId} generated successfully`
    });

    return NextResponse.json({
      success: true,
      reportUrl,
      summary,
      reportMetadata,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("[Enhanced Compliance Report API] Error generating report:", error);

    // Enhanced error handling with user context
    let authContext;
    try {
      authContext = await getAuthorizationContext();
    } catch {
      authContext = { userId: null, clerkUserId: null, role: "unknown" };
    }

    const clientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.ERROR,
      category: LogCategory.SYSTEM_ERROR,
      eventType: SOC2EventType.SYSTEM_ERROR,
      userId: authContext.userId,
      clerkUserId: authContext.clerkUserId,
      userRole: authContext.role,
      resourceType: "compliance_report",
      action: "GENERATE",
      success: false,
      errorMessage: error.message,
      metadata: {
        errorStack: error.stack,
        errorType: error.name,
        userContext: authContext
      },
      ipAddress: clientInfo.ipAddress || "unknown",
      userAgent: clientInfo.userAgent || "unknown",
      complianceNote: "Compliance report generation failed with system error"
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate compliance report",
        message: error.message,
        errorId: crypto.randomUUID() // For support tracking
      },
      { status: 500 }
    );
  }
}

// Enhanced helper functions with better analytics

function analyzeAccessPatterns(logs: any[]): any {
  const patterns = {
    peakHours: {},
    frequentActions: {},
    userDistribution: {}
  };

  logs.forEach(log => {
    // Peak hours analysis
    const hour = new Date(log.createdAt).getHours();
    patterns.peakHours[hour] = (patterns.peakHours[hour] || 0) + 1;

    // Frequent actions
    patterns.frequentActions[log.action] = (patterns.frequentActions[log.action] || 0) + 1;

    // User distribution
    patterns.userDistribution[log.userRole] = (patterns.userDistribution[log.userRole] || 0) + 1;
  });

  return patterns;
}

function analyzePermissionUsage(logs: any[]): any {
  const usage = {
    mostUsedPermissions: {},
    rolePermissionMap: {},
    unusedResources: []
  };

  logs.forEach(log => {
    if (log.resourceType) {
      usage.mostUsedPermissions[log.resourceType] = (usage.mostUsedPermissions[log.resourceType] || 0) + 1;
      
      if (!usage.rolePermissionMap[log.userRole]) {
        usage.rolePermissionMap[log.userRole] = {};
      }
      usage.rolePermissionMap[log.userRole][log.resourceType] = 
        (usage.rolePermissionMap[log.userRole][log.resourceType] || 0) + 1;
    }
  });

  return usage;
}

function analyzeThreatPatterns(logs: any[]): any {
  const threats = {
    failedLogins: logs.filter(log => !log.success && log.action?.includes("LOGIN")).length,
    suspiciousIPs: new Set(
      logs.filter(log => !log.success).map(log => log.ipAddress)
    ).size,
    roleEscalation: logs.filter(log => log.action?.includes("ROLE_CHANGE")).length,
    afterHoursActivity: logs.filter(log => {
      const hour = new Date(log.createdAt).getHours();
      return hour < 6 || hour > 22;
    }).length
  };

  return threats;
}

function calculateEnhancedComplianceScore(data: any): number {
  let score = 100;

  // Enhanced scoring with more criteria
  const failureRate = data.auditLogs.filter((log: any) => !log.success).length / data.auditLogs.length;
  if (failureRate > 0.1) score -= 15;
  if (failureRate > 0.2) score -= 25;

  const adminActions = data.auditLogs.filter((log: any) => 
    log.userRole === "developer" || log.userRole === "org_admin"
  ).length;
  if (adminActions / data.auditLogs.length > 0.5) score -= 10; // Too many admin actions

  const afterHoursActivity = data.auditLogs.filter((log: any) => {
    const hour = new Date(log.createdAt).getHours();
    return hour < 6 || hour > 22;
  }).length;
  if (afterHoursActivity > data.auditLogs.length * 0.1) score -= 5;

  return Math.max(0, score);
}

function identifyEnhancedComplianceIssues(data: any): string[] {
  const issues: string[] = [];

  const failedLogins = data.auditLogs.filter((log: any) => 
    !log.success && log.action?.includes("LOGIN")
  ).length;
  if (failedLogins > 50) {
    issues.push("High number of failed login attempts detected");
  }

  const uniqueFailedIPs = new Set(
    data.auditLogs.filter((log: any) => !log.success).map((log: any) => log.ipAddress)
  ).size;
  if (uniqueFailedIPs > 10) {
    issues.push("Failed operations from multiple IP addresses");
  }

  const adminOperations = data.auditLogs.filter((log: any) => 
    log.userRole === "developer" && log.action?.includes("DELETE")
  ).length;
  if (adminOperations > 0) {
    issues.push("Administrative deletion operations detected");
  }

  return issues;
}

function generateEnhancedRecommendations(data: any): string[] {
  const recommendations: string[] = [];

  const failureRate = data.auditLogs.filter((log: any) => !log.success).length / data.auditLogs.length;
  if (failureRate > 0.1) {
    recommendations.push("Implement stronger authentication mechanisms");
  }

  const suspiciousActivity = data.auditLogs.filter((log: any) => 
    !log.success && log.ipAddress
  ).length;
  if (suspiciousActivity > 20) {
    recommendations.push("Consider implementing IP-based blocking for repeated failures");
  }

  const adminActions = data.auditLogs.filter((log: any) => 
    log.userRole === "developer"
  ).length;
  if (adminActions > data.auditLogs.length * 0.3) {
    recommendations.push("Review admin access patterns and consider delegation");
  }

  recommendations.push("Implement automated compliance monitoring");
  recommendations.push("Schedule regular security awareness training");

  return recommendations;
}

function calculateRiskLevel(data: any): string {
  const failureRate = data.auditLogs.filter((log: any) => !log.success).length / data.auditLogs.length;
  const suspiciousActivity = data.auditLogs.filter((log: any) => 
    !log.success && log.action?.includes("LOGIN")
  ).length;

  if (failureRate > 0.2 || suspiciousActivity > 100) return "HIGH";
  if (failureRate > 0.1 || suspiciousActivity > 50) return "MEDIUM";
  return "LOW";
}
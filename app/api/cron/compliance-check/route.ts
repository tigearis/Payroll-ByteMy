import { gql } from "@apollo/client";
import { subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { adminOperationsService } from "@/lib/apollo/admin-operations";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

// NOTE: This query uses raw GraphQL for system compliance checking
// It references audit/compliance tables that may not be in the main schema
// This is intentional for SOC2 compliance operations
const COMPLIANCE_CHECKS = gql`
  query RunComplianceChecks(
    $ninetyDaysAgo: timestamptz!
    $sevenDaysAgo: timestamptz!
    $sevenYearsAgo: timestamptz!
  ) {
    # Check for users without recent activity review
    inactive_users: users_aggregate(
      where: { _not: { audit_logs: { created_at: { _gte: $ninetyDaysAgo } } } }
    ) {
      aggregate {
        count
      }
      nodes {
        id
        email
        role
      }
    }

    # Check for excessive permissions
    admin_users: users_aggregate(where: { role: { _eq: admin } }) {
      aggregate {
        count
      }
      nodes {
        id
        email
        created_at
      }
    }

    # Check for unresolved security events
    unresolved_events: security_event_log_aggregate(
      where: { resolved: { _eq: false }, created_at: { _lt: $sevenDaysAgo } }
    ) {
      aggregate {
        count
      }
    }

    # Check audit log retention
    old_audit_logs: audit_log_aggregate(
      where: { created_at: { _lt: $sevenYearsAgo } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const INSERT_COMPLIANCE_CHECK = gql`
  mutation InsertComplianceCheck(
    $checkType: String!
    $status: String!
    $findings: jsonb!
    $remediationRequired: Boolean!
    $remediationNotes: String
    $performedBy: uuid!
    $nextCheckDue: date
  ) {
    insert_compliance_check_one(
      object: {
        check_type: $checkType
        status: $status
        findings: $findings
        remediation_required: $remediationRequired
        remediation_notes: $remediationNotes
        performed_by: $performedBy
        next_check_due: $nextCheckDue
      }
    ) {
      id
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify request is from authorized source
    const authHeader = request.headers.get("authorization");
    const cronSecret = request.headers.get("x-cron-secret");

    // Check for cron secret (for Vercel cron jobs)
    if (cronSecret !== process.env.CRON_SECRET) {
      console.error("🚨 Unauthorized cron request - invalid secret");
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SECURITY_EVENT,
        eventType: SOC2EventType.UNAUTHORIZED_ACCESS_ATTEMPT,
        success: false,
        errorMessage: "Unauthorized cron request - invalid secret",
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: { source: "compliance-check" },
      });
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Calculate timestamps
    const now = new Date();
    const ninetyDaysAgo = subDays(now, 90).toISOString();
    const sevenDaysAgo = subDays(now, 7).toISOString();
    const sevenYearsAgo = subDays(now, 365 * 7).toISOString();

    // Run compliance checks
    const { data, errors } = await adminOperationsService.executeAdminQuery(
      COMPLIANCE_CHECKS,
      {
        ninetyDaysAgo,
        sevenDaysAgo,
        sevenYearsAgo,
      }
    );

    if (errors) {
      console.error("Compliance check query failed:", errors);
      const errorClientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.COMPLIANCE,
        eventType: SOC2EventType.SECURITY_VIOLATION,
        success: false,
        errorMessage: "Compliance check query failed",
        ipAddress: errorClientInfo.ipAddress || "unknown",
        userAgent: errorClientInfo.userAgent || "unknown",
        metadata: { errors },
      });
      return NextResponse.json(
        { success: false, message: "Failed to run compliance checks" },
        { status: 500 }
      );
    }

    const findings: any = {
      inactive_users: data.inactiveusers.aggregate.count,
      admin_count: data.adminusers.aggregate.count,
      unresolved_security_events: data.unresolvedevents.aggregate.count,
      old_audit_logs: data.oldaudit_logs.aggregate.count,
    };

    // Determine overall status
    let status = "passed";
    let remediationRequired = false;
    const issues = [];

    if (findings.inactive_users > 10) {
      status = "warning";
      issues.push(`${findings.inactive_users} inactive users need review`);
    }

    if (findings.admin_count > 5) {
      status = "warning";
      remediationRequired = true;
      issues.push(`High number of admin users (${findings.admin_count})`);
    }

    if (findings.unresolved_security_events > 0) {
      status = "failed";
      remediationRequired = true;
      issues.push(
        `${findings.unresolved_security_events} unresolved security events`
      );
    }

    if (findings.old_audit_logs > 0) {
      // Run retention cleanup
      await adminOperationsService.executeAdminQuery(
        gql`
          query {
            enforce_audit_retention
          }
        `,
        {}
      );
      issues.push(`Cleaned up ${findings.old_audit_logs} old audit logs`);
    }

    // Record compliance check
    const { data: checkData, errors: checkErrors } =
      await adminOperationsService.executeAdminMutation(
        INSERT_COMPLIANCE_CHECK,
        {
          checkType: "automated_compliance_check",
          status,
          findings: {
            ...findings,
            issues,
            timestamp: new Date().toISOString(),
          },
          remediationRequired,
          remediationNotes: issues.join("; "),
          performedBy: "00000000-0000-0000-0000-000000000000", // System user
          nextCheckDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }
      );

    if (checkErrors) {
      console.error("Failed to record compliance check:", checkErrors);
      const recordErrorClientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.COMPLIANCE,
        eventType: SOC2EventType.SECURITY_VIOLATION,
        success: false,
        errorMessage: "Failed to record compliance check",
        ipAddress: recordErrorClientInfo.ipAddress || "unknown",
        userAgent: recordErrorClientInfo.userAgent || "unknown",
        metadata: { errors: checkErrors },
      });
      return NextResponse.json(
        { success: false, message: "Failed to record compliance check" },
        { status: 500 }
      );
    }

    // Log compliance check
    const successClientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level:
        status === "failed"
          ? LogLevel.ERROR
          : status === "warning"
            ? LogLevel.WARNING
            : LogLevel.INFO,
      category: LogCategory.COMPLIANCE,
      eventType:
        status === "failed"
          ? SOC2EventType.SECURITY_VIOLATION
          : SOC2EventType.DATA_VIEWED,
      success: status !== "failed",
      ipAddress: successClientInfo.ipAddress || "unknown",
      userAgent: successClientInfo.userAgent || "unknown",
      metadata: {
        findings,
        issues,
        status,
        message: "compliance_check_completed",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        status,
        findings,
        remediationRequired,
        remediationNotes: issues.join("; "),
        nextCheckDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        checkId: checkData?.insert_compliance_checks_one?.id,
      },
    });
  } catch (error: any) {
    console.error("Compliance check failed:", error);
    const catchErrorClientInfo = auditLogger.extractClientInfo(request);
    await auditLogger.logSOC2Event({
      level: LogLevel.ERROR,
      category: LogCategory.COMPLIANCE,
      eventType: SOC2EventType.SECURITY_VIOLATION,
      success: false,
      errorMessage: error instanceof Error ? error.message : String(error),
      ipAddress: catchErrorClientInfo.ipAddress || "unknown",
      userAgent: catchErrorClientInfo.userAgent || "unknown",
      metadata: {
        message: "compliance_checkerror",
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

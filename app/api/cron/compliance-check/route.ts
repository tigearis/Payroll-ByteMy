import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
import { NextRequest, NextResponse } from "next/server";
import { secureHasuraService } from "@/lib/secure-hasura-service";
import { logger } from "@/lib/logging";
import { gql } from "@apollo/client";
import { subDays } from "date-fns";
import { LogCategory } from "@/lib/logging";

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
      await logger.security("Unauthorized cron request - invalid secret", {
        category: LogCategory.SECURITY_EVENT,
        metadata: {
          source: "compliance-check",
          ip: request.headers.get("x-forwarded-for"),
        },
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
    const { data, errors } = await secureHasuraService.executeAdminQuery(
      COMPLIANCE_CHECKS,
      {
        ninetyDaysAgo,
        sevenDaysAgo,
        sevenYearsAgo,
      },
      { skipAuth: true }
    );

    if (errors) {
      console.error("Compliance check query failed:", errors);
      await logger.security("Compliance check query failed", {
        category: LogCategory.SECURITY_EVENT,
        metadata: { errors },
      });
      return NextResponse.json(
        { success: false, message: "Failed to run compliance checks" },
        { status: 500 }
      );
    }

    const findings: any = {
      inactive_users: data.inactive_users.aggregate.count,
      admin_count: data.admin_users.aggregate.count,
      unresolved_security_events: data.unresolved_events.aggregate.count,
      old_audit_logs: data.old_audit_logs.aggregate.count,
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
      await secureHasuraService.executeAdminQuery(
        gql`
          query {
            enforce_audit_retention
          }
        `,
        {},
        { skipAuth: true }
      );
      issues.push(`Cleaned up ${findings.old_audit_logs} old audit logs`);
    }

    // Record compliance check
    const { data: checkData, errors: checkErrors } =
      await secureHasuraService.executeAdminMutation(
        INSERT_COMPLIANCE_CHECK,
        {
          checkType: "automated_compliance_check",
          status: status,
          findings: {
            ...findings,
            issues,
            timestamp: new Date().toISOString(),
          },
          remediationRequired: remediationRequired,
          remediationNotes: issues.join("; "),
          performedBy: "00000000-0000-0000-0000-000000000000", // System user
          nextCheckDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        { skipAuth: true }
      );

    if (checkErrors) {
      console.error("Failed to record compliance check:", checkErrors);
      await logger.security("Failed to record compliance check", {
        category: LogCategory.SECURITY_EVENT,
        metadata: { errors: checkErrors },
      });
      return NextResponse.json(
        { success: false, message: "Failed to record compliance check" },
        { status: 500 }
      );
    }

    // Log compliance check
    await logger.security("Compliance check completed", {
      category: LogCategory.SYSTEM_ACCESS,
      metadata: {
        status,
        remediationRequired,
        findings,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        status: status,
        findings,
        remediationRequired: remediationRequired,
        remediationNotes: issues.join("; "),
        nextCheckDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        checkId: checkData?.insert_compliance_checks_one?.id,
      },
    });
  } catch (error) {
    return handleApiError(error, "cron");
  }
}

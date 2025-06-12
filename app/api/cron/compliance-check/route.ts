import { NextRequest, NextResponse } from "next/server";
import { validateCronRequest } from "@/lib/api-auth";
import { secureHasuraService } from "@/lib/secure-hasura-service";
import { auditLogger } from "@/lib/audit/audit-logger";
import { gql } from "@apollo/client";

const COMPLIANCE_CHECKS = gql`
  query RunComplianceChecks {
    # Check for users without recent activity review
    inactive_users: users_aggregate(
      where: {
        _not: {
          audit_logs: {
            created_at: { _gte: "now() - interval '90 days'" }
          }
        }
      }
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
    admin_users: users_aggregate(
      where: { role: { _eq: admin } }
    ) {
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
      where: { 
        resolved: { _eq: false }
        created_at: { _lt: "now() - interval '7 days'" }
      }
    ) {
      aggregate {
        count
      }
    }
    
    # Check audit log retention
    old_audit_logs: audit_log_aggregate(
      where: { created_at: { _lt: "now() - interval '7 years'" } }
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
  // Validate CRON authentication
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Run compliance checks
    const { data } = await secureHasuraService.executeAdminQuery(
      COMPLIANCE_CHECKS,
      {},
      { skipAuth: true }
    );

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
      issues.push(`${findings.unresolved_security_events} unresolved security events`);
    }

    if (findings.old_audit_logs > 0) {
      // Run retention cleanup
      await secureHasuraService.executeAdminQuery(
        gql`query { enforce_audit_retention }`,
        {},
        { skipAuth: true }
      );
      issues.push(`Cleaned up ${findings.old_audit_logs} old audit logs`);
    }

    // Record compliance check
    await secureHasuraService.executeAdminMutation(
      INSERT_COMPLIANCE_CHECK,
      {
        checkType: "monthly_compliance_review",
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
      },
      { skipAuth: true }
    );

    // Log compliance check
    await auditLogger.logSecurityEvent(
      "compliance_check_completed",
      status === "failed" ? "error" : status === "warning" ? "warning" : "info",
      {
        findings,
        issues,
        status,
      }
    );

    return NextResponse.json({
      success: true,
      status,
      findings,
      issues,
    });
  } catch (error: any) {
    console.error("Compliance check error:", error);
    
    await auditLogger.logSecurityEvent(
      "compliance_check_failed",
      "critical",
      {
        error: error.message,
      }
    );

    return NextResponse.json(
      { error: "Compliance check failed" },
      { status: 500 }
    );
  }
}
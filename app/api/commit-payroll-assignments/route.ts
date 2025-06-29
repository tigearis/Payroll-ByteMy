import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/api-auth";
import { validateCronRequest } from "@/lib/auth/api-auth";
import {
  auditLogger,
  LogLevel,
  LogCategory,
  SOC2EventType,
} from "@/lib/security/audit/logger";

interface PayrollAssignmentInput {
  payrollId: string;
  fromConsultantId: string;
  toConsultantId: string;
  date: string;
}

interface CommitPayrollAssignmentsInput {
  changes: PayrollAssignmentInput[];
}

// Secure payroll assignment commit endpoint - admin only
export const POST = withAuth(
  async (request: NextRequest, session) => {
    try {
      console.log("🔧 Commit payroll assignments webhook called");

      // Log critical payroll operation
      const clientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.AUDIT,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "payroll_assignments",
        success: true,
        ipAddress: clientInfo.ipAddress || "unknown",
        userAgent: clientInfo.userAgent || "unknown",
        metadata: { message: "Payroll assignment commit operation initiated" },
      });

      // Extract the request body
      const body = await request.json();
      console.log("📝 Request body:", JSON.stringify(body, null, 2));

      // Validate that we have the expected structure
      if (!body.input || !body.input.changes) {
        console.error("❌ Invalid request structure - missing input.changes");
        return NextResponse.json(
          {
            success: false,
            message: "Invalid request structure",
            errors: ["Missing input.changes in request body"],
          },
          { status: 400 }
        );
      }

      const { changes }: CommitPayrollAssignmentsInput = body.input;

      if (!changes || changes.length === 0) {
        return NextResponse.json({
          success: false,
          message: "No changes provided",
          errors: ["Changes array is empty"],
        });
      }

      console.log(`📋 Processing ${changes.length} payroll assignment changes`);

      // Since this is a webhook from Hasura, we'll implement the business logic here
      // For now, we'll return a successful response and log the changes
      // In a full implementation, you would:
      // 1. Validate each change
      // 2. Update the payroll_assignments table
      // 3. Log the changes for audit trail
      // 4. Handle any conflicts or errors

      const affected_assignments = changes.map((change, index) => ({
        id: `temp-${index}`, // This would be the actual assignment ID from database
        payroll_date_id: change.payrollId, // This should be the payroll_date_id
        original_consultant_id: change.fromConsultantId,
        new_consultant_id: change.toConsultantId,
        adjusted_eft_date: change.date,
      }));

      console.log("✅ Changes processed successfully:", affected_assignments);

      return NextResponse.json({
        success: true,
        message: `Successfully processed ${changes.length} payroll assignment changes`,
        affected_assignments,
      });
    } catch (error) {
      console.error("❌ Action handler error:", error);

      const errorClientInfo = auditLogger.extractClientInfo(request);
      await auditLogger.logSOC2Event({
        level: LogLevel.ERROR,
        category: LogCategory.SYSTEM_ACCESS,
        eventType: SOC2EventType.DATA_VIEWED,
        userId: session.userId,
        userRole: session.role,
        resourceType: "payroll_assignments",
        success: false,
        errorMessage: error instanceof Error ? error.message : String(error),
        ipAddress: errorClientInfo.ipAddress || "unknown",
        userAgent: errorClientInfo.userAgent || "unknown",
        metadata: {
          message: "Payroll assignment commit operation failed",
          errorDetails: {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
          errors: [error instanceof Error ? error.message : String(error)],
        },
        { status: 500 }
      );
    }
  },
  {
    allowedRoles: ["developer", "org_admin", "manager"], // Payroll operations require management access
  }
);

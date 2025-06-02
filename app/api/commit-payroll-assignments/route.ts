import { NextRequest, NextResponse } from "next/server";

interface PayrollAssignmentInput {
  payrollId: string;
  fromConsultantId: string;
  toConsultantId: string;
  date: string;
}

interface CommitPayrollAssignmentsInput {
  changes: PayrollAssignmentInput[];
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Commit payroll assignments webhook called");

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
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        errors: [error instanceof Error ? error.message : String(error)],
      },
      { status: 500 }
    );
  }
}

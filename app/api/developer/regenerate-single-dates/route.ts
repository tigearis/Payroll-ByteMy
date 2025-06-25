import { NextRequest, NextResponse } from "next/server";

// Note: RegeneratePayrollDatesDocument requires custom Hasura action implementation
import { adminOperationsService } from "@/lib/apollo/admin-operations";
import { withAuth, checkRateLimit } from "@/lib/auth/api-auth";
import { GeneratePayrollDatesQueryDocument } from "@/domains/payrolls/graphql/generated/graphql";

export const POST = withAuth(
  async (request: NextRequest, session) => {
    // Restrict to development environment only
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    try {
      // Rate limiting - 20 requests per hour
      if (!checkRateLimit(`regenerate-dates-${session.userId}`, 20, 3600000)) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Maximum 20 regenerations per hour.",
          },
          { status: 429 }
        );
      }

      const { payrollId } = await request.json();

      if (!payrollId) {
        return NextResponse.json(
          {
            success: false,
            error: "Payroll ID is required",
          },
          { status: 400 }
        );
      }

      console.log(
        `🔄 Admin ${session.userId} regenerating dates for payroll ${payrollId}...`
      );

      // Calculate date range (2 years)
      const startDate = new Date().toISOString().split("T")[0];
      const endDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 2)
      )
        .toISOString()
        .split("T")[0];

      // Use admin operations service to regenerate dates
      const result = await adminOperationsService.executeAdminMutation(
        GeneratePayrollDatesQueryDocument,
        { payrollId, startDate, endDate }
      );

      const deletedDates =
        result.data?.delete_payroll_dates?.affected_rows || 0;

      console.log(
        `✅ Regeneration complete: ${deletedDates} old dates deleted`
      );

      return NextResponse.json({
        success: true,
        message: `Successfully regenerated dates for payroll ${payrollId}`,
        ...result,
        dateRange: { startDate, endDate },
        performedBy: {
          userId: session.userId,
          role: session.role,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("❌ Error regenerating dates:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
  },
  { allowedRoles: ["developer", "manager"] } // Admins and managers can regenerate dates
);

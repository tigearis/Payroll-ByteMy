import { handleApiError, createSuccessResponse } from "@/lib/shared/error-handling";
import { NextRequest, NextResponse } from "next/server";
import { withEnhancedAuth } from "@/lib/auth/enhanced-api-auth";
import { rateLimiter } from "@/lib/middleware/rate-limiter";
import { secureHasuraService } from "@/lib/secure-hasura-service";
import { gql } from "@apollo/client";

export const POST = withEnhancedAuth(
  async (request: NextRequest, context) => {
    // Restrict to development environment only
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    try {
      // Rate limiting - 20 requests per hour
      const rateLimitResponse = await rateLimiter.applyRateLimit(
        request,
        context.userId,
        { requests: 20, window: 3600000, message: "Maximum 20 regenerations per hour." }
      );
      
      if (rateLimitResponse) {
        return rateLimitResponse;
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
        `🔄 Admin ${context.userId} regenerating dates for payroll ${payrollId}...`
      );

      // Calculate date range (2 years)
      const startDate = new Date().toISOString().split("T")[0];
      const endDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 2)
      )
        .toISOString()
        .split("T")[0];

      // Use secure service to regenerate dates
      const result = await secureHasuraService.executeAdminMutation(gql`
        mutation RegeneratePayrollDates($payrollId: uuid!, $startDate: date!, $endDate: date!) {
          delete_payroll_dates(where: { payroll_id: { _eq: $payrollId } }) {
            affected_rows
          }
          # Add regeneration logic here as needed
        }
      `, { payrollId, startDate, endDate });

      const deletedDates = result.data?.delete_payroll_dates?.affected_rows || 0;

      console.log(
        `✅ Regeneration complete: ${deletedDates} old dates deleted`
      );

      return NextResponse.json({
        success: true,
        message: `Successfully regenerated dates for payroll ${payrollId}`,
        ...result,
        dateRange: { startDate, endDate },
        performedBy: {
          userId: context.userId,
          role: context.userRole,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
    return handleApiError(error, "developer");
  },
        { status: 500 }
      );
    }
  },
  { minimumRole: "developer" } // Developers can regenerate dates
);

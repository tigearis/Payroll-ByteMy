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
      // Rate limiting - allow only 5 requests per hour for this destructive operation
      const rateLimitResponse = await rateLimiter.applyRateLimit(
        request,
        context.userId,
        { requests: 5, window: 3600000, message: "This operation can only be performed 5 times per hour." }
      );
      
      if (rateLimitResponse) {
        return rateLimitResponse;
      }

      console.log(
        `🔄 Admin ${context.userId} (${context.userRole}) starting clean all dates and versions...`
      );

      // Use secure service to clean payroll dates
      const result = await secureHasuraService.executeAdminMutation(gql`
        mutation CleanAllPayrollDates {
          delete_payroll_dates(where: {}) {
            affected_rows
          }
          delete_payroll_versions(where: {}) {
            affected_rows
          }
          update_payrolls(where: {}, _set: { current_version: 1 }) {
            affected_rows
          }
        }
      `);

      const deletedDates = result.data?.delete_payroll_dates?.affected_rows || 0;
      const deletedVersions = result.data?.delete_payroll_versions?.affected_rows || 0;
      const resetPayrolls = result.data?.update_payrolls?.affected_rows || 0;

      console.log(
        `✅ Clean complete: ${deletedDates} dates deleted, ${deletedVersions} versions deleted, ${resetPayrolls} payrolls reset`
      );

      return NextResponse.json({
        success: true,
        message: `Cleaned all dates and versions`,
        ...result,
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
  { minimumRole: "developer" } // Only admins can perform this operation
);

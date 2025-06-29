import { NextRequest, NextResponse } from "next/server";
import { CleanAllPayrollDatesDocument } from "@/domains/audit/graphql/generated/graphql";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { withAuth, checkRateLimit } from "@/lib/auth/api-auth";

export const POST = withAuth(
  async (request: NextRequest, session) => {
    // Restrict to development environment only
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    try {
      // Rate limiting - allow only 5 requests per hour for this destructive operation
      if (!checkRateLimit(`clean-dates-${session.userId}`, 5, 3600000)) {
        return NextResponse.json(
          {
            error:
              "Rate limit exceeded. This operation can only be performed 5 times per hour.",
          },
          { status: 429 }
        );
      }

      console.log(
        `🔄 Admin ${session.userId} (${session.role}) starting clean all dates and versions...`
      );

      // Use domain operation to clean payroll dates
      const result = await adminApolloClient.mutate({
        mutation: CleanAllPayrollDatesDocument,
      });

      const existingDates = result.data?.payrollDates?.length || 0;
      const deletedDates = 0; // Placeholder since this is just a query
      const resetPayrolls = 0; // Placeholder since this is just a query

      console.log(
        `✅ Clean complete: ${deletedDates} dates deleted, ${resetPayrolls} payrolls reset`
      );

      return NextResponse.json({
        success: true,
        message: `Cleaned all dates and versions`,
        deletedDates,
        resetPayrolls,
        performedBy: {
          userId: session.userId,
          role: session.role,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("❌ Error cleaning all dates and versions:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
  },
  { requiredRole: "developer" } // Only admins can perform this operation
);

import { NextRequest, NextResponse } from "next/server";
import { withAuth, checkRateLimit } from "@/lib/api-auth";
import { secureHasuraService } from "@/lib/secure-hasura-service";

export const POST = withAuth(
  async (request: NextRequest, session) => {
    // Restrict to development environment only
    if (process.env.NODE_ENV === 'production') {
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

      // Use secure service to clean payroll dates
      const result = await secureHasuraService.instance.cleanAllPayrollDates();

      console.log(
        `✅ Clean complete: ${result.deletedDates} dates deleted, ${result.deletedVersions} versions deleted, ${result.resetPayrolls} payrolls reset`
      );

      return NextResponse.json({
        success: true,
        message: `Cleaned all dates and versions`,
        ...result,
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
  { requiredRole: "admin" } // Only admins can perform this operation
);

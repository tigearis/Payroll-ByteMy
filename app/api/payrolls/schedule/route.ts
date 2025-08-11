// app/api/payrolls/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GeneratePayrollDatesQueryDocument,
  type GeneratePayrollDatesQueryQuery,
} from "@/domains/payrolls/graphql/generated/graphql";
import { executeTypedQuery } from "@/lib/apollo/query-helpers";
import { withAuth } from "@/lib/auth/api-auth";
import { logger, DataClassification } from "@/lib/logging/enterprise-logger";

export const GET = withAuth(
  async (req: NextRequest) => {
    try {
      // Get query parameters
      const url = new URL(req.url);
      const payrollId = url.searchParams.get("payrollId");
      const startDate =
        url.searchParams.get("startDate") || new Date().toISOString();
      const endDate = url.searchParams.get("endDate");
      const maxDates = url.searchParams.get("maxDates") || "24";

      if (!payrollId) {
        return NextResponse.json(
          { error: "Payroll ID is required" },
          { status: 400 }
        );
      }

      // Calculate end date if not provided (1 year from start date)
      let calculatedEndDate = endDate;
      if (!calculatedEndDate) {
        const start = new Date(startDate);
        const end = new Date(start);
        end.setFullYear(start.getFullYear() + 1);
        calculatedEndDate = end.toISOString().split("T")[0];
      }

      try {
        // Generate payroll dates using Hasura function
        const result = await executeTypedQuery<GeneratePayrollDatesQueryQuery>(
          GeneratePayrollDatesQueryDocument,
          {
            payrollId,
            startDate: startDate.split("T")[0], // Ensure date format
            endDate: calculatedEndDate,
            maxDates: parseInt(maxDates),
          }
        );

        const generatedDates = (result as any).generatePayrollDates || [];

        return NextResponse.json({
          success: true,
          payrollId,
          startDate: startDate.split("T")[0],
          endDate: calculatedEndDate,
          maxDates: parseInt(maxDates),
          generatedCount: generatedDates.length,
          schedule: generatedDates.map((date: any) => ({
            id: date.id,
            originalEftDate: date.originalEftDate,
            adjustedEftDate: date.adjustedEftDate,
            processingDate: date.processingDate,
            notes: date.notes,
            payrollId: date.payrollId,
            createdAt: date.createdAt,
            updatedAt: date.updatedAt,
          })),
        });
      } catch (graphqlError) {
        logger.error('GraphQL error during schedule generation', {
          namespace: 'payroll_schedule_api',
          operation: 'generate_schedule',
          classification: DataClassification.CONFIDENTIAL,
          error: graphqlError instanceof Error ? graphqlError.message : 'Unknown GraphQL error',
          metadata: {
            errorName: graphqlError instanceof Error ? graphqlError.name : 'UnknownError',
            payrollId,
            timestamp: new Date().toISOString()
          }
        });
        return NextResponse.json(
          {
            error: "Failed to generate payroll schedule",
            details:
              graphqlError instanceof Error
                ? graphqlError.message
                : "Unknown GraphQL error",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      logger.error('Schedule generation error', {
        namespace: 'payroll_schedule_api',
        operation: 'generate_schedule',
        classification: DataClassification.CONFIDENTIAL,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          errorName: error instanceof Error ? error.name : 'UnknownError',
          timestamp: new Date().toISOString()
        }
      });
      return NextResponse.json(
        { error: "Failed to generate payroll schedule" },
        { status: 500 }
      );
    }
  }
);

// app/api/payrolls/schedule/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { adminApolloClient } from "@/lib/apollo/unified-client";
import { GeneratePayrollDatesQueryDocument } from "@/domains/payrolls/graphql/generated/graphql";

export async function GET(req: NextRequest) {
  try {
    // Check authentication with Clerk
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role
    const claims = sessionClaims?.["https://hasura.io/jwt/claims"] as any;
    const userRole = claims?.["x-hasura-default-role"];

    if (
      !["developer", "org_admin", "manager", "consultant"].includes(userRole)
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

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
      calculatedEndDate = end.toISOString().split('T')[0];
    }

    try {
      // Generate payroll dates using Hasura function
      const result = await adminApolloClient.query({
        query: GeneratePayrollDatesQueryDocument,
        variables: {
          payrollId,
          startDate: startDate.split('T')[0], // Ensure date format
          endDate: calculatedEndDate,
          maxDates: parseInt(maxDates),
        },
        fetchPolicy: "no-cache",
      });

      const generatedDates = result.data?.generatePayrollDates || [];

      return NextResponse.json({
        success: true,
        payrollId,
        startDate: startDate.split('T')[0],
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
      console.error("GraphQL error during schedule generation:", graphqlError);
      return NextResponse.json(
        { 
          error: "Failed to generate payroll schedule",
          details: graphqlError instanceof Error ? graphqlError.message : "Unknown GraphQL error"
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Schedule generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate payroll schedule" },
      { status: 500 }
    );
  }
}

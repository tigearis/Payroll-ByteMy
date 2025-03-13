// app/api/hasura-actions/generate-payroll-dates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/apollo-admin";
import { gql } from "@apollo/client";

// GraphQL mutation to call the generate_payroll_dates function
const CALL_FUNCTION = gql`
  mutation CallGeneratePayrollDates($payrollId: uuid!, $startDate: date!, $endDate: date!) {
    call_generate_payroll_dates(args: {
      p_payroll_id: $payrollId,
      p_start_date: $startDate,
      p_end_date: $endDate
    }) {
      success
    }
  }
`;

// This endpoint will be called by Hasura when the generatePayrollDates action is triggered
export async function POST(req: NextRequest) {
  try {
    // Parse the Hasura action payload
    const { input, session_variables } = await req.json();
    
    // Extract parameters
    const { payrollId, startDate, endDate } = input;
    
    // Call the database function via GraphQL
    const { data } = await adminClient.mutate({
      mutation: CALL_FUNCTION,
      variables: {
        payrollId,
        startDate,
        endDate
      }
    });
    
    return NextResponse.json({
      success: data.call_generate_payroll_dates.success
    });
  } catch (error) {
    console.error("Error in generate-payroll-dates action:", error);
    return NextResponse.json({
      success: false
    }, { status: 500 });
  }
}

// app/api/cron/update-payroll-dates/route.ts
import { NextResponse } from "next/server"
import { adminClient } from "@/lib/apollo-admin"
import { gql } from "@apollo/client"
import { addMonths } from "date-fns"

export async function GET() {
  try {
    // Get all active payrolls
    const { data: payrollsData } = await adminClient.query({
      query: gql`
        query GetActivePayrolls {
          payrolls(where: {status: {_eq: "Active"}}) {
            id
          }
        }
      `
    })

    const payrolls = payrollsData.payrolls
    
    if (!payrolls || payrolls.length === 0) {
      return NextResponse.json({ 
        message: "No active payrolls found to update"
      })
    }

    // Start date is today
    const startDate = new Date()
    // End date is 12 months from now
    const endDate = addMonths(startDate, 12)

    // Process each payroll
    const results = {
      total: payrolls.length,
      processed: 0,
      errors: [] as { payrollId: string, error: string }[]
    }

    for (const payroll of payrolls) {
      try {
        await adminClient.mutate({
          mutation: gql`
            mutation GeneratePayrollDates($payrollId: uuid!, $startDate: date!, $endDate: date!) {
              call_generate_payroll_dates(args: {
                p_payroll_id: $payrollId, 
                p_start_date: $startDate, 
                p_end_date: $endDate
              }) {
                success
              }
            }
          `,
          variables: {
            payrollId: payroll.id,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          }
        })
        
        results.processed++
      } catch (error) {
        results.errors.push({
          payrollId: payroll.id,
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated payroll dates for ${results.processed} of ${results.total} payrolls`,
      errors: results.errors.length > 0 ? results.errors : undefined
    })
  } catch (error) {
    console.error("Error in cron job:", error)
    return NextResponse.json({ 
      error: "Failed to update payroll dates", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
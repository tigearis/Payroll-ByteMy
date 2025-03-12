// app/api/payroll-dates/generate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { adminClient } from "@/lib/apollo-admin"
import { gql } from "@apollo/client"
import { addMonths } from "date-fns"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId, getToken } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user role for permission check
    const token = await getToken({ template: "hasura" })
    let userRole = "viewer" // Default role
    
    if (token) {
      // Decode token to get role
      const tokenParts = token.split('.')
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
      const hasuraClaims = payload['https://hasura.io/jwt/claims']
      userRole = hasuraClaims?.['x-hasura-default-role'] || "viewer"
    }

    // Ensure only allowed roles can generate dates
    if (!["org_admin", "manager"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Parse request body
    const { payrollId, startDate = new Date(), months = 12 } = await req.json()
    
    if (!payrollId) {
      return NextResponse.json({ error: "Payroll ID is required" }, { status: 400 })
    }

    const endDate = addMonths(new Date(startDate), months)

    // Call the PostgreSQL procedure via GraphQL
    const { data } = await adminClient.mutate({
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
        payrollId,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    })

    return NextResponse.json({
      success: true,
      message: `Generated payroll dates for payroll ID ${payrollId}`
    })
  } catch (error) {
    console.error("Error generating payroll dates:", error)
    return NextResponse.json({ 
      error: "Failed to generate payroll dates", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
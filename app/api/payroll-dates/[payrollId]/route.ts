// app/api/payroll-dates/[payrollId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { payroll_dates } from "@/drizzle/schema"
import { eq, and, gte, lte } from "drizzle-orm"
import { ensurePayrollDatesExist } from "@/lib/payroll-date-service"

export async function GET(
  req: NextRequest, 
  { params }: { params: { payrollId: string } }
) {
  try {
    const { payrollId } = params
    const url = new URL(req.url)
    
    // Parse date range filters
    const startDate = url.searchParams.get('startDate') ? 
      new Date(url.searchParams.get('startDate')!) : 
      new Date()
    
    const endDate = url.searchParams.get('endDate') ? 
      new Date(url.searchParams.get('endDate')!) : 
      new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 3) // Default to 3 months ahead
    
    // Ensure dates exist
    await ensurePayrollDatesExist(payrollId, startDate, endDate)
    
    // Fetch requested date range
    const dates = await db.query.payroll_dates.findMany({
      where: and(
        eq(payroll_dates.payroll_id, payrollId),
        gte(payroll_dates.adjusted_eft_date, startDate),
        lte(payroll_dates.adjusted_eft_date, endDate)
      ),
      orderBy: [payroll_dates.adjusted_eft_date]
    })
    
    return NextResponse.json(dates)
  } catch (error) {
    console.error("Error fetching payroll dates:", error)
    return NextResponse.json(
      { error: "Failed to fetch payroll dates" }, 
      { status: 500 }
    )
  }
}

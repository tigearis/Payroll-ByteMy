// app/api/cron/update-payroll-dates/route.ts
import { NextResponse } from "next/server"
import { extendAllPayrollDates } from "@/lib/payroll-date-service"

// Define cron settings in vercel.json or similar
export async function GET() {
  try {
    await extendAllPayrollDates()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating payroll dates:", error)
    return NextResponse.json({ error: "Failed to update payroll dates" }, { status: 500 })
  }
}
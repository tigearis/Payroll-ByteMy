import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { payrolls } from "@/drizzle/schema"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch payrolls
    const allPayrolls = await db.select().from(payrolls)

    return NextResponse.json(allPayrolls)
  } catch (error) {
    console.error("Payroll fetch error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check role-based access
    const userRole = session.user.role
    if (!userRole || !["manager", "admin", "dev"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden: Manager, admin, or dev access required" }, { status: 403 })
    }

    // Process payroll creation
    const {
      client_id,
      name,
      cycle_id,
      date_type_id,
      date_value,
      primary_consultant_id,
      backup_consultant_id,
      manager_id,
      processing_days_before_eft,
    } = await req.json()

    // Validate inputs (add more validation as needed)
    if (!client_id || !name || !cycle_id || !date_type_id || !processing_days_before_eft) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create payroll
    const newPayroll = await db
      .insert(payrolls)
      .values({
        client_id,
        name,
        cycle_id,
        date_type_id,
        date_value,
        primary_consultant_id,
        backup_consultant_id,
        manager_id,
        processing_days_before_eft,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning()

    return NextResponse.json({
      success: true,
      message: "Payroll created successfully",
      payroll: newPayroll[0],
    })
  } catch (error) {
    console.error("Payroll creation error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}


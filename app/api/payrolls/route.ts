// app/api/payrolls/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payrolls, clients, payrollCycles, payrollDateTypes, staff } from "@/drizzle/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eq } from "drizzle-orm";

// ✅ Enum for Payroll Status
enum PayrollStatus {
  Implementation = "Implementation",
  Active = "Active",
  Inactive = "Inactive",
}

// ✅ GET Payrolls with Human-Readable Cycle & Date Type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch Payrolls with Relationships
    const allPayrolls = await db
      .select({
        id: payrolls.id,
        name: payrolls.name,
        client: clients.name,
        cycle: payrollCycles.name, // ✅ FIX: Ensure Cycle Name is Fetched
        dateType: payrollDateTypes.name, // ✅ FIX: Ensure Date Type Name is Fetched
        dateValue: payrolls.dateValue,
        processingDaysBeforeEft: payrolls.processingDaysBeforeEft,
        primaryConsultant: staff.name, // ✅ Fetch consultant name
        backupConsultant: staff.name, // ✅ Fetch backup consultant name
        manager: staff.name, // ✅ Fetch manager name
        status: payrolls.status,
      })
      .from(payrolls)
      .innerJoin(clients, eq(payrolls.clientId, clients.id))
      .innerJoin(payrollCycles, eq(payrolls.cycleId, payrollCycles.id)) // ✅ FIXED: Ensuring Cycle Join
      .innerJoin(payrollDateTypes, eq(payrolls.dateTypeId, payrollDateTypes.id));

    return NextResponse.json(allPayrolls);
  } catch (error) {
    console.error("Payroll fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ POST: Create a New Payroll
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check role-based access
    const userRole = session.user.role;
    if (!["manager", "admin", "dev"].includes(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Manager, admin, or dev access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      clientId,
      name,
      cycleId,
      dateTypeId,
      dateValue,
      primaryConsultantId,
      backupConsultantId,
      managerId,
      payrollSystem,
      processingDaysBeforeEft,
      status,
    } = body;

    // ✅ Validate Required Fields
    if (!clientId || !name || !cycleId || !dateTypeId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Validate UUIDs
    const uuidFields = [clientId, cycleId, dateTypeId, primaryConsultantId, backupConsultantId, managerId];
    if (uuidFields.some((field) => field && typeof field !== "string")) {
      return NextResponse.json({ error: "Invalid UUID format" }, { status: 400 });
    }

    // ✅ Validate Status Enum
    const validStatuses = Object.values(PayrollStatus);
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // ✅ Create Payroll
    const newPayroll = await db
      .insert(payrolls)
      .values({
        clientId,
        name,
        cycleId,
        dateTypeId,
        dateValue: dateValue || null,
        primaryConsultantId: primaryConsultantId || null,
        backupConsultantId: backupConsultantId || null,
        managerId: managerId || null,
        payrollSystem: payrollSystem || null,
        processingDaysBeforeEft: processingDaysBeforeEft || 2, // Default value
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: payrolls.id });

    return NextResponse.json({
      success: true,
      message: "Payroll created successfully",
      payroll: newPayroll[0],
    });
  } catch (error) {
    console.error("Payroll creation error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

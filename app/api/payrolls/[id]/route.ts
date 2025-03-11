// app/api/payrolls/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payrolls } from "@/drizzle/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch payroll by ID
    const payroll = await db.select().from(payrolls).where(eq(payrolls.id, params.id));

    if (!payroll || payroll.length === 0) {
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 });
    }

    return NextResponse.json(payroll[0]);
  } catch (error) {
    console.error("Payroll fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure only allowed roles can update
    if (!["manager", "admin", "dev"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body = await req.json();
    const updatedPayroll = await db
      .update(payrolls)
      .set({ ...body, updated_at: new Date() })
      .where(eq(payrolls.id, params.id))
      .returning();

    if (updatedPayroll.length === 0) {
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Payroll updated successfully", payroll: updatedPayroll[0] });
  } catch (error) {
    console.error("Payroll update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure only allowed roles can delete
    if (!["admin", "dev"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete payroll
    const deletedPayroll = await db.delete(payrolls).where(eq(payrolls.id, params.id)).returning();

    if (deletedPayroll.length === 0) {
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Payroll deleted successfully" });
  } catch (error) {
    console.error("Payroll delete error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

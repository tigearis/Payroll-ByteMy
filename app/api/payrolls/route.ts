// app/api/payrolls/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payrolls, clients, payrollCycles, payrollDateTypes, staff } from "@/drizzle/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// ✅ Define Apollo Client (Replace with your actual GraphQL API URL)
const client = new ApolloClient({
  uri: "https://your-graphql-api.com/graphql", // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

// ✅ Define GraphQL Query
const GET_PAYROLLS = gql`
  query MyQuery {
    payrolls {
      name
      payroll_system
      processing_days_before_eft
      status
      date_value
      client {
        name
      }
      payroll_cycle {
        name
      }
      payroll_date_type {
        name
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  try {
    // ✅ Execute GraphQL Query via Apollo Client
    const { data } = await client.query({ query: GET_PAYROLLS });

    // ✅ Return Data in JSON Response
    return NextResponse.json({ payrolls: data.payrolls });
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

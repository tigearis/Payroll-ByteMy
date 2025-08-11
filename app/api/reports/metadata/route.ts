import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { EnhancedSecurityService } from "@/domains/reports/services/enhanced-security.service";

const securityService = new EnhancedSecurityService();

export async function GET() {
  try {
    console.log("Metadata API: Request received");

    // 1. Authenticate request
    const { userId, sessionClaims } = await auth();
    console.log("Metadata API: Auth check result", {
      userId: userId ? "Present" : "Missing",
      sessionClaims: sessionClaims ? "Present" : "Missing",
    });

    if (!userId) {
      console.log("Metadata API: Unauthorized - No user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check developer access
    console.log("Metadata API: Checking access permissions");
    const hasAccess = await securityService.validateReportAccess(userId, {
      type: "METADATA",
      action: "READ",
    });

    console.log("Metadata API: Access check result", hasAccess);

    if (!hasAccess.allowed) {
      console.log("Metadata API: Access denied", hasAccess.reason);
      return NextResponse.json(
        {
          error:
            hasAccess.reason || "Developer access required for reports schema",
        },
        { status: 403 }
      );
    }

    // 3. Return metadata
    console.log("Metadata API: Generating metadata response");
    const metadata = {
      availableFields: {
        users: [
          "id",
          "name",
          "email",
          "role",
          "department",
          "created_at",
          "updated_at",
        ],
        payrolls: [
          "id",
          "user_id",
          "amount",
          "period_start",
          "period_end",
          "status",
          "created_at",
        ],
        leave: [
          "id",
          "user_id",
          "type",
          "start_date",
          "end_date",
          "status",
          "created_at",
        ],
        clients: [
          "id",
          "name",
          "contact_person",
          "email",
          "status",
          "created_at",
        ],
        work_schedule: [
          "id",
          "user_id",
          "date",
          "hours",
          "project",
          "notes",
          "created_at",
        ],
      },
      relationships: {
        users: {
          payrolls: "user_id",
          leave: "user_id",
          work_schedule: "user_id",
        },
        clients: {
          work_schedule: "client_id",
        },
      },
      domains: ["users", "payrolls", "leave", "clients", "work_schedule"],
      fieldTypes: {
        id: "string",
        name: "string",
        email: "string",
        role: "string",
        department: "string",
        amount: "number",
        status: "string",
        date: "date",
        hours: "number",
        type: "string",
        created_at: "date",
        updated_at: "date",
      },
    };

    console.log("Metadata API: Sending successful response");
    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Metadata API: Error", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details:
          process.env.NODE_ENV === "development"
            ? {
                message:
                  error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined,
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}

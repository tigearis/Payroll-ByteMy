import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ReportTemplateSchema } from "@/domains/reports/types/report.types";
import { ReportSecurityService } from "@/domains/reports/services/security.service";
import { ReportAuditService } from "@/domains/reports/services/audit.service";

const securityService = new ReportSecurityService();
const auditService = new ReportAuditService();

export async function GET(request: Request) {
  try {
    // 1. Authenticate request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get("isPublic") === "true";
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);

    // 3. Fetch templates
    // TODO: Implement actual database query
    const templates: any[] = []; // Fetch from database

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate request body
    const body = await request.json();
    const validatedTemplate = ReportTemplateSchema.parse({
      ...body,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. Check field permissions
    for (const domain of validatedTemplate.domains) {
      const accessResult = await securityService.validateFieldAccess(
        userId,
        domain,
        validatedTemplate.fields[domain]
      );

      if (accessResult.denied.length > 0) {
        return NextResponse.json(
          {
            error: "Permission denied",
            fields: accessResult.denied,
          },
          { status: 403 }
        );
      }
    }

    // 4. Save template
    // TODO: Implement actual database save
    const savedTemplate = { ...validatedTemplate, id: "new-id" };

    // 5. Log audit event
    await auditService.logTemplateAction(
      userId,
      "CREATE",
      savedTemplate.id,
      savedTemplate
    );

    return NextResponse.json(savedTemplate);
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

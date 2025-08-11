import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ReportTemplateSchema } from "@/domains/reports/types/report.types";
import { ReportSecurityService } from "@/domains/reports/services/security.service";
import { ReportAuditService } from "@/domains/reports/services/audit.service";

const securityService = new ReportSecurityService();
const auditService = new ReportAuditService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch template
    // TODO: Implement actual database query
    const template: any = null; // Fetch from database

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 3. Check access
    if (!template.isPublic && template.createdBy !== userId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch existing template
    // TODO: Implement actual database query
    const existingTemplate: any = null; // Fetch from database

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 3. Check ownership
    if (existingTemplate.createdBy !== userId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // 4. Validate and update template
    const body = await request.json();
    const validatedUpdates = ReportTemplateSchema.partial().parse({
      ...body,
      updatedAt: new Date(),
    });

    // 5. Check field permissions if fields are being updated
    if (validatedUpdates.fields) {
      for (const domain of Object.keys(validatedUpdates.fields)) {
        const accessResult = await securityService.validateFieldAccess(
          userId,
          domain,
          validatedUpdates.fields[domain]
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
    }

    // 6. Update template
    // TODO: Implement actual database update
    const updatedTemplate = {
      ...(existingTemplate as any),
      ...validatedUpdates,
    };

    // 7. Log audit event
    await auditService.logTemplateAction(
      userId,
      "UPDATE",
      params.id,
      updatedTemplate
    );

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch template
    // TODO: Implement actual database query
    const template: any = null; // Fetch from database

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 3. Check ownership
    if (template.createdBy !== userId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // 4. Delete template
    // TODO: Implement actual database delete

    // 5. Log audit event
    await auditService.logTemplateAction(userId, "DELETE", params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

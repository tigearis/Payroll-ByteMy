import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ReportQueueService } from "@/domains/reports/services/queue.service";
import { EnhancedReportCacheService } from "@/domains/reports/services/enhanced-cache.service";
import { ReportSecurityService } from "@/domains/reports/services/security.service";
import { ReportAuditService } from "@/domains/reports/services/audit.service";
import { ReportConfigSchema } from "@/domains/reports/types/report.types";

const queueService = new ReportQueueService();
const cacheService = new EnhancedReportCacheService();
const securityService = new ReportSecurityService();
const auditService = new ReportAuditService();

export async function POST(request: Request) {
  try {
    // 1. Authenticate request
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate request body
    const body = await request.json();
    const validatedConfig = ReportConfigSchema.parse(body);

    // 3. Check permissions
    for (const domain of validatedConfig.domains) {
      const accessResult = await securityService.validateFieldAccess(
        userId,
        domain,
        validatedConfig.fields[domain]
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

    // 4. Check cache
    const cachedReport = await cacheService.getCachedReport(validatedConfig);
    if (cachedReport) {
      await auditService.logReportGeneration(userId, validatedConfig);
      return NextResponse.json({
        id: "cached",
        config: validatedConfig,
        status: "completed",
        result: cachedReport,
        userId,
        completedAt: new Date(),
      });
    }

    // 5. Create and queue job
    const job = await queueService.enqueueJob(validatedConfig, userId);

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

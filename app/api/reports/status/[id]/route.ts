import { NextRequest, NextResponse } from "next/server";
import { ReportQueueService } from "@/domains/reports/services/queue.service";
import { withAuthParams } from "@/lib/auth/api-auth";

const queueService = new ReportQueueService();

export const GET = withAuthParams(async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
  session
): Promise<NextResponse> => {
  try {
    const params = await context.params;
    
    // Check permissions
    const userRole = 
      session.role ||
      session.defaultRole ||
      'viewer';
      
    const hasReportAccess = 
      userRole && ["developer", "org_admin", "manager", "consultant"].includes(userRole);

    if (!hasReportAccess) {
      return NextResponse.json(
        { 
          error: `Insufficient permissions to check report status. Current role: ${userRole}`,
        },
        { status: 403 }
      );
    }

    // Get job status
    const job = await queueService.getJob(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Verify job ownership
    if (job.userId !== session.userId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error checking job status:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});

export const DELETE = withAuthParams(async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
  session
): Promise<NextResponse> => {
  try {
    const params = await context.params;
    
    // Check permissions
    const userRole = 
      session.role ||
      session.defaultRole ||
      'viewer';
      
    const hasReportAccess = 
      userRole && ["developer", "org_admin", "manager", "consultant"].includes(userRole);

    if (!hasReportAccess) {
      return NextResponse.json(
        { 
          error: `Insufficient permissions to cancel reports. Current role: ${userRole}`,
        },
        { status: 403 }
      );
    }

    // Get job
    const job = await queueService.getJob(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Verify job ownership
    if (job.userId !== session.userId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Cancel job
    const cancelled = await queueService.cancelJob(params.id);
    if (!cancelled) {
      return NextResponse.json(
        { error: "Job cannot be cancelled" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling job:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});

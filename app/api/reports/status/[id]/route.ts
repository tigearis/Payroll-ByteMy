import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ReportQueueService } from "@/domains/reports/services/queue.service";
import { ReportSecurityService } from "@/domains/reports/services/security.service";

const queueService = new ReportQueueService();
const securityService = new ReportSecurityService();

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

    // 2. Get job status
    const job = await queueService.getJob(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // 3. Verify job ownership
    if (job.userId !== userId) {
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

    // 2. Get job
    const job = await queueService.getJob(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // 3. Verify job ownership
    if (job.userId !== userId) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // 4. Cancel job
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
}

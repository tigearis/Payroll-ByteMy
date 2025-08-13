import { createHash } from "crypto";
import { Redis } from "@upstash/redis";
import { ReportJob, ReportConfig } from "../types/report.types";

export class ReportQueueService {
  private redis: Redis;
  private readonly QUEUE_KEY = "report_jobs";
  private readonly JOB_KEY_PREFIX = "report_job:";
  private readonly JOB_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  private getJobKey(jobId: string): string {
    return `${this.JOB_KEY_PREFIX}${jobId}`;
  }

  async enqueueJob(config: ReportConfig, userId: string): Promise<ReportJob> {
    const jobId = createHash("sha256")
      .update(`${userId}:${JSON.stringify(config)}:${Date.now()}`)
      .digest("hex");

    const job: ReportJob = {
      id: jobId,
      config,
      status: "queued",
      progress: 0,
      userId,
      startedAt: new Date(),
    };

    // Store job details
    await this.redis.set(this.getJobKey(jobId), JSON.stringify(job));

    // Add to processing queue
    await this.redis.lpush(this.QUEUE_KEY, jobId);

    return job;
  }

  async getJob(jobId: string): Promise<ReportJob | null> {
    const jobData = await this.redis.get<string>(this.getJobKey(jobId));
    return jobData ? JSON.parse(jobData) : null;
  }

  async updateJob(jobId: string, updates: Partial<ReportJob>): Promise<void> {
    const job = await this.getJob(jobId);
    if (!job) throw new Error("Job not found");

    const updatedJob = { ...job, ...updates };
    await this.redis.set(this.getJobKey(jobId), JSON.stringify(updatedJob));
  }

  async dequeueJob(): Promise<ReportJob | null> {
    const jobId = await this.redis.rpop<string>(this.QUEUE_KEY);
    if (!jobId) return null;

    const job = await this.getJob(jobId);
    if (!job) return null;

    // Check if job has timed out
    if (
      job.startedAt &&
      Date.now() - new Date(job.startedAt).getTime() > this.JOB_TIMEOUT
    ) {
      await this.updateJob(jobId, {
        status: "failed",
        error: "Job timed out",
        completedAt: new Date(),
      });
      return null;
    }

    return job;
  }

  async cancelJob(jobId: string): Promise<boolean> {
    const job = await this.getJob(jobId);
    if (!job) return false;

    if (job.status === "completed" || job.status === "failed") {
      return false;
    }

    await this.updateJob(jobId, {
      status: "failed",
      error: "Job cancelled by user",
      completedAt: new Date(),
    });

    return true;
  }

  async cleanupOldJobs(): Promise<void> {
    // Implement cleanup of old completed/failed jobs
    // This could be run periodically via a cron job
  }
}

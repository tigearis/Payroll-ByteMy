import { ReportAuditService } from "../services/audit.service";
import { ReportCacheService } from "../services/cache.service";
import { ReportQueueService } from "../services/queue.service";
import { ReportJob, ReportJobStatus } from "../types/report.types";

export class ReportGeneratorWorker {
  constructor(
    private queueService: ReportQueueService,
    private cacheService: ReportCacheService,
    private auditService: ReportAuditService
  ) {}

  async start() {
    console.log("Report generator worker started");
    this.processNextJob();
  }

  private async processNextJob() {
    try {
      const job = await this.queueService.dequeueJob();
      if (!job) {
        // No jobs to process, wait and try again
        setTimeout(() => this.processNextJob(), 1000);
        return;
      }

      await this.processJob(job);
    } catch (error) {
      console.error("Error processing job:", error);
    }

    // Process next job
    setImmediate(() => this.processNextJob());
  }

  private async processJob(job: ReportJob) {
    try {
      // Update job status
      await this.queueService.updateJob(job.id, {
        status: "processing" as ReportJobStatus,
        progress: 0,
      });

      // Check cache first
      const cachedResult = await this.cacheService.getCachedReport(job.config);
      if (cachedResult) {
        await this.queueService.updateJob(job.id, {
          status: "completed" as ReportJobStatus,
          result: cachedResult,
          completedAt: new Date(),
        });
        return;
      }

      // Process each domain
      const results: Record<string, any[]> = {};
      for (const domain of job.config.domains) {
        // Update progress
        const progress =
          (Object.keys(results).length / job.config.domains.length) * 100;
        await this.queueService.updateJob(job.id, { progress });

        // Process domain data
        results[domain] = await this.processDomain(
          domain,
          job.config.fields[domain],
          job.config.filters,
          job.userId
        );

        // Check if job was cancelled
        const updatedJob = await this.queueService.getJob(job.id);
        if (updatedJob?.status === "failed") {
          return;
        }
      }

      // Apply relationships if needed
      if (job.config.includeRelationships) {
        await this.processRelationships(results, job.config);
      }

      // Cache results  
      const configHash = this.cacheService.generateConfigHash(job.config);
      await this.cacheService.cacheReport(configHash, results);

      // Update job status
      await this.queueService.updateJob(job.id, {
        status: "completed" as ReportJobStatus,
        result: results,
        completedAt: new Date(),
      });

      // Log audit event
      await this.auditService.logReportGeneration(job.userId, job.config);
    } catch (error) {
      console.error("Error processing job:", job.id, error);
      await this.queueService.updateJob(job.id, {
        status: "failed" as ReportJobStatus,
        error: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      });

      // Log audit event with error
      await this.auditService.logReportGeneration(
        job.userId,
        job.config,
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }

  private async processDomain(
    domain: string,
    fields: string[],
    filters?: any[],
    userId?: string
  ): Promise<any[]> {
    // Security validation is now handled at the API level via withAuth middleware
    // This worker processes pre-authorized report configs
    
    // TODO: Implement domain-specific data fetching
    // This would typically involve GraphQL queries to Hasura
    return [];
  }

  private async processRelationships(
    results: Record<string, any[]>,
    config: any
  ): Promise<void> {
    // TODO: Implement relationship processing
    // This would join data across domains based on relationships
  }
}

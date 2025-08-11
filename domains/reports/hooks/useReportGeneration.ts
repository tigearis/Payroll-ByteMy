import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { ReportConfig, ReportJob } from "../types/report.types";

export function useReportGeneration() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentJob, setCurrentJob] = useState<ReportJob | null>(null);

  const generateReport = useCallback(
    async (config: ReportConfig) => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const response = await fetch("/api/reports/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(config),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to generate report");
        }

        const job: ReportJob = await response.json();
        setCurrentJob(job);

        // Start polling for job status if not completed
        if (job.status !== "completed") {
          pollJobStatus(job.id);
        }

        return job;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        toast.error(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const pollJobStatus = useCallback(
    async (jobId: string) => {
      const checkStatus = async () => {
        try {
          const token = await getToken();
          const response = await fetch(`/api/reports/status/${jobId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch job status");
          }

          const job: ReportJob = await response.json();
          setCurrentJob(job);

          if (job.status === "completed") {
            toast.success("Report generation completed");
          } else if (job.status === "failed") {
            toast.error(`Report generation failed: ${job.error}`);
          } else {
            // Continue polling
            setTimeout(checkStatus, 2000);
          }
        } catch (err) {
          console.error("Error polling job status:", err);
          toast.error("Failed to check report status");
        }
      };

      checkStatus();
    },
    [getToken]
  );

  const cancelReport = useCallback(
    async (jobId: string) => {
      try {
        const token = await getToken();
        const response = await fetch(`/api/reports/cancel/${jobId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to cancel report");
        }

        toast.success("Report generation cancelled");
        setCurrentJob(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        toast.error(error.message);
        throw error;
      }
    },
    [getToken]
  );

  return {
    generateReport,
    cancelReport,
    loading,
    error,
    currentJob,
  };
}

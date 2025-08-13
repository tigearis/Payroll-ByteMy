import { Download, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useReportOperations } from "../../hooks/useReportOperations";
import type { ReportConfig, ReportJob } from "../../types/report.types";

interface PreviewPaneProps {
  config: ReportConfig;
  onGenerateReport: () => Promise<ReportJob | undefined>;
  className?: string;
}

export function PreviewPane({
  config,
  onGenerateReport,
  className,
}: PreviewPaneProps) {
  const [currentJob, setCurrentJob] = useState<ReportJob | null>(null);
  const { useReportJobStatus } = useReportOperations();

  // Monitor job status if we have an active job
  const { job, loading: jobLoading } = useReportJobStatus(currentJob?.id || "");

  useEffect(() => {
    if (job) {
      setCurrentJob(job);
    }
  }, [job]);

  const handleGenerateReport = async () => {
    const job = await onGenerateReport();
    if (job) {
      setCurrentJob(job);
    }
  };

  const downloadCSV = () => {
    if (!currentJob?.result) return;

    const headers = Object.keys(currentJob.result[0] || {});
    const csvContent = [
      headers.join(","),
      ...currentJob.result.map((row: any) =>
        headers.map(header => JSON.stringify(row[header])).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isConfigValid =
    config.domains.length > 0 &&
    Object.values(config.fields).some(fields => fields.length > 0);

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-medium">Preview</h3>
          <p className="text-sm text-muted-foreground">
            {currentJob?.status === "completed"
              ? `${currentJob.result?.length || 0} results`
              : "Configure your report to see a preview"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {currentJob?.status === "completed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          )}
          <Button
            onClick={handleGenerateReport}
            disabled={!isConfigValid || jobLoading}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={cn("h-4 w-4", {
                "animate-spin": jobLoading,
              })}
            />
            Generate
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {!currentJob && (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Configure your report and click Generate to see results
          </div>
        )}

        {currentJob?.status === "processing" && (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            <p className="text-muted-foreground">
              Generating report... {Math.round(currentJob.progress || 0)}%
            </p>
          </div>
        )}

        {currentJob?.status === "failed" && (
          <div className="h-full flex items-center justify-center text-red-500">
            Error: {currentJob.error}
          </div>
        )}

        {currentJob?.status === "completed" && currentJob.result && (
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(currentJob.result[0] || {}).map(header => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentJob.result.map((row: any, i: number) => (
                <TableRow key={i}>
                  {Object.values(row).map((value, j) => (
                    <TableCell key={j}>
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReportPreview } from "../../hooks/useReportPreview";
import type { ReportConfig } from "../../types/report.types";

interface ReportPreviewProps {
  config: ReportConfig;
  limit?: number;
}

export function ReportPreview({ config, limit = 10 }: ReportPreviewProps) {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const { generatePreview, loading, error } = useReportPreview();

  useEffect(() => {
    const fetchPreview = async () => {
      if (!config.domains.length || !Object.keys(config.fields || {}).length) {
        return;
      }

      try {
        const previewConfig = {
          ...config,
          limit: limit,
        };

        const result = await generatePreview(previewConfig);

        if (result && result.data) {
          setPreviewData(result.data);

          // Extract columns from the first row
          if (result.data.length > 0) {
            setColumns(Object.keys(result.data[0]));
          }
        }
      } catch (err) {
        console.error("Error generating preview:", err);
      }
    };

    fetchPreview();
  }, [config, limit, generatePreview]);

  // Format value based on its type
  const formatValue = (value: any) => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (value instanceof Date) {
      return value.toLocaleDateString("en-AU"); // Australian date format (day/month/year)
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  // Check if we should render a chart instead of a table
  const shouldRenderChart =
    config.visualization && config.visualization.type !== "table";

  // Placeholder for chart rendering
  const renderChart = () => {
    const type = config.visualization?.type || "bar";

    return (
      <div className="flex items-center justify-center p-8 border rounded-md">
        <div className="text-center">
          <p className="text-muted-foreground">
            Chart preview will appear here ({type} chart)
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Full visualization will be available in the generated report
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading preview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading preview</p>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  if (!config.domains.length || !Object.keys(config.fields || {}).length) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          Select domains and fields to see a preview
        </p>
      </div>
    );
  }

  if (shouldRenderChart) {
    return renderChart();
  }

  if (!previewData || previewData.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No data available for preview</p>
        <p className="text-xs text-muted-foreground mt-2">
          Try adjusting your filters or selecting different fields
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {previewData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map(column => (
                <TableCell key={`${rowIndex}-${column}`}>
                  {formatValue(row[column])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {previewData.length === limit && (
        <div className="text-center text-xs text-muted-foreground p-2">
          Showing first {limit} records. Generate the full report to see all
          data.
        </div>
      )}
    </div>
  );
}

// lib/exports/excel-export-lazy.tsx
"use client";

import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

// ============================================================================
// CODE SPLITTING: LAZY LOAD HEAVY EXCEL DEPENDENCIES
// ============================================================================

/**
 * Dynamically import SheetJS library
 * This reduces initial bundle size by ~200KB
 */
const LazyExcelExporter = lazy(async () => {
  // Dynamic import of heavy SheetJS dependency
  const XLSX = await import("xlsx");

  const ExcelExporter = ({ data, filename, sheetName = "Data" }: {
    data: any[];
    filename: string;
    sheetName?: string;
  }) => {
    const generateExcel = () => {
      try {
        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Generate Excel file and download
        XLSX.writeFile(workbook, filename);
      } catch (error) {
        console.error("Excel generation failed:", error);
        throw new Error("Failed to generate Excel file");
      }
    };

    return (
      <Button onClick={generateExcel} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Export Excel
      </Button>
    );
  };

  return { default: ExcelExporter };
});

// ============================================================================
// WRAPPER COMPONENT WITH LOADING STATE
// ============================================================================

interface LazyExcelExportProps {
  data: any[];
  filename: string;
  sheetName?: string;
  disabled?: boolean;
}

export function LazyExcelExport({ 
  data, 
  filename, 
  sheetName = "Data",
  disabled = false 
}: LazyExcelExportProps) {
  if (disabled || !data.length) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Download className="w-4 h-4 mr-2" />
        Export Excel
      </Button>
    );
  }

  return (
    <Suspense 
      fallback={
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading Excel...
        </Button>
      }
    >
      <LazyExcelExporter data={data} filename={filename} sheetName={sheetName} />
    </Suspense>
  );
}

export default LazyExcelExport;
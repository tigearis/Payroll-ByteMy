// lib/exports/excel-export-lazy.tsx
"use client";

import { Download, Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { logger } from '@/lib/logging/enterprise-logger';

// ============================================================================
// CODE SPLITTING: LAZY LOAD HEAVY EXCEL DEPENDENCIES
// ============================================================================

/**
 * Dynamically import SheetJS library
 * This reduces initial bundle size by ~200KB
 */
const LazyExcelExporter = lazy(async () => {
  // Dynamic import of heavy SheetJS dependency
  let XLSX: any;
  try {
    XLSX = await import("xlsx");
  } catch (error) {
    logger.warn('Excel export not available - xlsx package not installed', {
      namespace: 'export_system',
      operation: 'excel_export_initialization',
      component: 'LazyExcelExporter'
    });
    // Return a fallback component
    return {
      default: () => (
        <div className="text-red-500 p-2 border border-red-200 rounded">
          Excel export not available - xlsx package not installed
        </div>
      )
    };
  }

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
        logger.error('Excel generation failed', {
          namespace: 'export_system',
          operation: 'excel_generation',
          component: 'ExcelExporter',
          metadata: { 
            error: error instanceof Error ? error.message : String(error),
            filename: filename,
            dataLength: data.length
          }
        });
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
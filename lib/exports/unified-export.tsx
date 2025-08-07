// lib/exports/unified-export.tsx
"use client";

import { Download, FileText, FileSpreadsheet, FileImage } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { logger } from '@/lib/logging/enterprise-logger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LazyExcelExport } from "./excel-export-lazy";
import { LazyPDFExport } from "./pdf-export-lazy";

// ============================================================================
// UNIFIED EXPORT COMPONENT WITH CODE SPLITTING
// ============================================================================

interface UnifiedExportProps {
  data: any[];
  filename: string;
  title: string;
  formats?: ("csv" | "pdf" | "excel")[];
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
}

export function UnifiedExport({
  data,
  filename,
  title,
  formats = ["csv", "pdf", "excel"],
  disabled = false,
  size = "sm",
  variant = "outline"
}: UnifiedExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  // CSV export (lightweight, no external dependencies)
  const exportCSV = () => {
    if (!data.length) return;

    try {
      setIsExporting(true);
      
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape values containing commas or quotes
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      logger.error('CSV export failed', {
        namespace: 'export_system',
        operation: 'csv_export',
        component: 'UnifiedExport',
        metadata: {
          error: error instanceof Error ? error.message : String(error),
          filename: filename,
          dataLength: data.length
        }
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (disabled || !data.length) {
    return (
      <Button variant={variant} size={size} disabled>
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    );
  }

  // Single format export
  if (formats.length === 1) {
    const format = formats[0];
    
    if (format === "csv") {
      return (
        <Button 
          onClick={exportCSV} 
          variant={variant} 
          size={size}
          disabled={isExporting}
        >
          <FileText className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      );
    }
    
    if (format === "pdf") {
      return (
        <LazyPDFExport 
          data={data} 
          filename={`${filename}.pdf`} 
          title={title}
          disabled={disabled}
        />
      );
    }
    
    if (format === "excel") {
      return (
        <LazyExcelExport 
          data={data} 
          filename={`${filename}.xlsx`}
          disabled={disabled}
        />
      );
    }
  }

  // Multi-format export dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.includes("csv") && (
          <DropdownMenuItem onClick={exportCSV} disabled={isExporting}>
            <FileText className="w-4 h-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        )}
        
        {formats.includes("excel") && (
          <DropdownMenuItem asChild>
            <div>
              <LazyExcelExport 
                data={data} 
                filename={`${filename}.xlsx`}
                disabled={disabled}
              />
            </div>
          </DropdownMenuItem>
        )}
        
        {formats.includes("pdf") && (
          <>
            {(formats.includes("csv") || formats.includes("excel")) && (
              <DropdownMenuSeparator />
            )}
            <DropdownMenuItem asChild>
              <div>
                <LazyPDFExport 
                  data={data} 
                  filename={`${filename}.pdf`} 
                  title={title}
                  disabled={disabled}
                />
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UnifiedExport;
// lib/exports/pdf-export-lazy.tsx
"use client";

import { Download, Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";

// ============================================================================
// CODE SPLITTING: LAZY LOAD HEAVY PDF DEPENDENCIES
// ============================================================================

/**
 * Dynamically import heavy PDF generation libraries
 * This reduces initial bundle size by ~150KB
 */
const LazyPDFExporter = lazy(async () => {
  // Dynamic import of heavy dependencies
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable")
  ]);

  const PDFExporter = ({ data, filename, title }: {
    data: any[];
    filename: string;
    title: string;
  }) => {
    const generatePDF = () => {
      try {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text(title, 20, 20);
        
        // Add timestamp
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
        
        // Create table
        autoTable(doc, {
          startY: 40,
          head: [Object.keys(data[0] || {})],
          body: data.map(row => Object.values(row)),
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [100, 100, 100],
            textColor: 255,
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
        });
        
        // Save the PDF
        doc.save(filename);
      } catch (error) {
        console.error("PDF generation failed:", error);
        throw new Error("Failed to generate PDF");
      }
    };

    return (
      <Button onClick={generatePDF} variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
    );
  };

  return { default: PDFExporter };
});

// ============================================================================
// WRAPPER COMPONENT WITH LOADING STATE
// ============================================================================

interface LazyPDFExportProps {
  data: any[];
  filename: string;
  title: string;
  disabled?: boolean;
}

export function LazyPDFExport({ 
  data, 
  filename, 
  title, 
  disabled = false 
}: LazyPDFExportProps) {
  if (disabled || !data.length) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
    );
  }

  return (
    <Suspense 
      fallback={
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading PDF...
        </Button>
      }
    >
      <LazyPDFExporter data={data} filename={filename} title={title} />
    </Suspense>
  );
}

export default LazyPDFExport;
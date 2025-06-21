// components/export-pdf.tsx
import { useQuery } from "@apollo/client";
import { format, parseISO } from "date-fns";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import { Button } from "@/components/ui/button";

import { GetPayrollDatesDocument, GetPayrollDatesQuery } from "@/domains/payrolls/graphql/generated/graphql";

type PayrollDate = GetPayrollDatesQuery['payrollDates'][0];

interface ExportPdfProps {
  payrollId: string;
}

export function ExportPdf({ payrollId }: ExportPdfProps) {
  const { data } = useQuery(GetPayrollDatesDocument, {
    variables: { payrollId },
    skip: !payrollId,
  });

  const dates = data?.payrollDates || [];

  const downloadPdf = () => {
    if (dates.length === 0) {return;}

    const doc = new jsPDF();
    const tableData = dates.map((date: PayrollDate, index: number) => [
      index + 1,
      format(parseISO(date.originalEftDate), "yyyy-MM-dd"),
      format(parseISO(date.adjustedEftDate), "yyyy-MM-dd"),
      format(parseISO(date.processingDate), "yyyy-MM-dd"),
      "", // notes field doesn't exist in current schema
    ]);

    autoTable(doc, {
      head: [
        [
          "Period",
          "Original EFT Date",
          "Adjusted EFT Date",
          "Processing Date",
          "Notes",
        ],
      ],
      body: tableData,
    });

    doc.save(`payroll_schedule.pdf`);
  };

  return (
    <Button onClick={downloadPdf} data-export="pdf" variant="outline" size="sm">
      Export PDF
    </Button>
  );
}

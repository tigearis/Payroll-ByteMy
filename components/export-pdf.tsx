// components/export-pdf.tsx
import { useQuery } from "@apollo/client";
import { GET_PAYROLL_DATES } from "@/graphql/queries/payrolls/getPayrollDates";
import { jsPDF } from "jspdf";
import {autoTable} from "jspdf-autotable";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";

interface PayrollDate {
  id: string;
  original_eft_date: string;
  adjusted_eft_date: string;
  processing_date: string;
  notes?: string;
}

interface ExportPdfProps {
  payrollId: string;
}

export function ExportPdf({ payrollId }: ExportPdfProps) {
  const { data } = useQuery(GET_PAYROLL_DATES, {
    variables: { id: payrollId },
    skip: !payrollId,
  });

  const dates: PayrollDate[] = data?.payroll_dates || [];

  const downloadPdf = () => {
    if (dates.length === 0) return;

    const doc = new jsPDF();
    const tableData = dates.map((date: PayrollDate, index: number) => [
      index + 1,
      format(parseISO(date.original_eft_date), 'yyyy-MM-dd'),
      format(parseISO(date.adjusted_eft_date), 'yyyy-MM-dd'),
      format(parseISO(date.processing_date), 'yyyy-MM-dd'),
      date.notes || '',
    ]);    

    autoTable(doc, {
      head: [['Period', 'Original EFT Date', 'Adjusted EFT Date', 'Processing Date', 'Notes']],
      body: tableData,
    });

    doc.save(`payroll_schedule.pdf`);
  };

  return (
    <Button onClick={downloadPdf}>
      Export PDF
    </Button>
  );
}

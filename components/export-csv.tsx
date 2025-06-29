// components/export-csv.tsx

import { PermissionGuard } from "@/components/auth/permission-guard";
import { useEnhancedPermissions } from "@/lib/auth/enhanced-auth-context";
import { useQuery } from "@apollo/client";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  GetPayrollDatesDocument,
  GetPayrollDatesQuery,
} from "@/domains/payrolls/graphql/generated/graphql";

type PayrollDate = GetPayrollDatesQuery["payrollDates"][0];

interface ExportCsvProps {
  payrollId: string;
}

export function ExportCsv({ payrollId }: ExportCsvProps) {
  const { hasPermission } = useEnhancedPermissions();
  
  if (!hasPermission('payroll:export')) {
    return null;
  }
  const { loading, error, data } = useQuery(GetPayrollDatesDocument, {
    variables: { payrollId },
    skip: !payrollId,
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const dates: PayrollDate[] = data?.payrollDates || [];

  const downloadCsv = () => {
    if (dates.length === 0) {
      return;
    }

    const headers = [
      "Period",
      "Original EFT Date",
      "Adjusted EFT Date",
      "Processing Date",
      "Notes",
    ];
    const rows = dates.map((date: PayrollDate, index: number) => [
      index + 1,
      format(parseISO(date.originalEftDate), "yyyy-MM-dd"),
      format(parseISO(date.adjustedEftDate), "yyyy-MM-dd"),
      format(parseISO(date.processingDate), "yyyy-MM-dd"),
      "", // notes field doesn't exist in current schema
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payrollschedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={downloadCsv} data-export="csv" variant="outline" size="sm">
      Export CSV
    </Button>
  );
}

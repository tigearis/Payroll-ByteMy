// components/export-csv.tsx

import { useQuery } from "@apollo/client";
import { GET_PAYROLL_DATES } from "@/graphql/queries/payrolls/getPayrollDates";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";

interface PayrollDate {
    id: string;
    original_eft_date: string;
    adjusted_eft_date: string;
    processing_date: string;
    notes?: string;
}

interface ExportCsvProps {
    payrollId: string;
}

export function ExportCsv({ payrollId }: ExportCsvProps) {
    const { loading, error, data } = useQuery(GET_PAYROLL_DATES, {
        variables: { id: payrollId },
        skip: !payrollId,
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const dates: PayrollDate[] = data?.payroll_dates || [];


    const downloadCsv = () => {
        if (dates.length === 0) return;

        const headers = ['Period', 'Original EFT Date', 'Adjusted EFT Date', 'Processing Date', 'Notes'];
        const rows = dates.map((date: PayrollDate, index: number) => [
            index + 1,
            format(parseISO(date.original_eft_date), 'yyyy-MM-dd'),
            format(parseISO(date.adjusted_eft_date), 'yyyy-MM-dd'),
            format(parseISO(date.processing_date), 'yyyy-MM-dd'),
            date.notes || '',
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `payroll_schedule.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button onClick={downloadCsv}>
            Export CSV
        </Button>
    );
}

// components/payroll-dates-view.tsx
import { useState } from "react";
import { format, parseISO, isEqual } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@apollo/client";
import { GET_PAYROLL_DATES } from "@/graphql/queries/payrolls/getPayrollDates";

interface PayrollDate {
  id: string;
  original_eft_date: string;
  adjusted_eft_date: string;
  processing_date: string;
  notes?: string;
}

interface PayrollDatesViewProps {
  payrollId: string;
}

export function PayrollDatesView({ payrollId }: PayrollDatesViewProps) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const { loading, error, data } = useQuery(GET_PAYROLL_DATES, {
    variables: { id: payrollId },
    skip: !payrollId,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const dates: PayrollDate[] = data?.payroll_dates || [];

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Original EFT Date</TableHead>
            <TableHead>Adjusted EFT Date</TableHead>
            <TableHead>Processing Date</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dates.map((date, index) => {
            const originalDate = parseISO(date.original_eft_date);
            const adjustedDate = parseISO(date.adjusted_eft_date);
            const processingDate = parseISO(date.processing_date);
            const isAdjusted = !isEqual(originalDate, adjustedDate);

            return (
              <TableRow key={date.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{format(originalDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  {format(adjustedDate, 'MMM d, yyyy')}
                  {isAdjusted && (
                    <span className="ml-2 text-sm text-blue-600">Adjusted</span>
                  )}
                </TableCell>
                <TableCell>{format(processingDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  {date.notes ? (
                    <>
                      <span
                        onClick={() => setSelectedNote(date.notes || '')} // Provide fallback
                        className="cursor-pointer bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
                      >
                        Note
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Floating Card for Notes */}
      {selectedNote && (
        <div className="fixed top-20 left-20 bg-white shadow-lg border p-4 rounded-lg z-50">
          <h3 className="text-lg font-bold mb-2">Edit Note</h3>
          <textarea
            value={selectedNote}
            onChange={(e) => setSelectedNote(e.target.value)}
            className="w-full h-32 border rounded p-2"
          />
          <button
            onClick={() => setSelectedNote(null)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}

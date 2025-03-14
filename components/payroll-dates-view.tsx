// components/payroll-dates-view.tsx
"use client";
import { GET_PAYROLLS_BY_ID } from "@/graphql/queries/payrolls/getPayrollsByID";
import { useState, useEffect } from "react";
import { format, parseISO, isEqual } from "date-fns";
import { Download, RefreshCw } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Assuming you'll create these GraphQL mutations
import { GENERATE_PAYROLL_DATES } from "@/graphql/mutations/payrolls/generatePayrollDates";

interface PayrollDate {
  id: string;
  original_eft_date: string;
  adjusted_eft_date: string;
  processing_date: string;
  notes?: string;
}

interface PayrollDatesViewProps {
  payrollId: string;
  payrollName: string;
  cycleType?: string;
}

export function PayrollDatesView({ payrollId, payrollName, cycleType }: PayrollDatesViewProps) {
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [regenerateMonths, setRegenerateMonths] = useState(12);
  
  // Use GraphQL query to fetch payroll dates
  const { loading, error, data, refetch } = useQuery(GET_PAYROLLS_BY_ID, {
    variables: { 
      id: payrollId,
      months: 12
    },
    skip: !payrollId
  });

  // Use GraphQL mutation to regenerate dates
  const [generatePayrollDates, { loading: regenerateLoading }] = useMutation(GENERATE_PAYROLL_DATES);

  // Extract dates from GraphQL response
  const dates: PayrollDate[] = data?.payroll?.dates || [];

  // Regenerate payroll dates using GraphQL mutation
  const handleRegenerate = async () => {
    try {
      await generatePayrollDates({
        variables: {
          payrollId,
          startDate: new Date().toISOString(),
          months: regenerateMonths,
        },
      });
      
      // Refresh the data after regeneration
      await refetch({ 
        id: payrollId, 
        months: regenerateMonths 
      });
      
      setRegenerateOpen(false);
    } catch (err) {
      console.error("Error regenerating payroll dates:", err);
    }
  };

  // Download dates as CSV
  const downloadCsv = () => {
    if (dates.length === 0) return;
    
    const headers = ['Period', 'Original EFT Date', 'Adjusted EFT Date', 'Processing Date', 'Notes'];
    const rows = dates.map((date, index) => [
      index + 1,
      format(parseISO(date.original_eft_date), 'yyyy-MM-dd'),
      format(parseISO(date.adjusted_eft_date), 'yyyy-MM-dd'),
      format(parseISO(date.processing_date), 'yyyy-MM-dd'),
      date.notes || '',
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${payrollName}_schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payroll Schedule</CardTitle>
          <CardDescription>Loading payroll dates...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payroll Schedule</CardTitle>
          <CardDescription>Error loading payroll dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payroll Schedule</CardTitle>
          <CardDescription>
            Upcoming payroll dates for {payrollName} ({cycleType || 'N/A'})
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Dialog open={regenerateOpen} onOpenChange={setRegenerateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Regenerate Payroll Dates</DialogTitle>
                <DialogDescription>
                  This will regenerate the payroll schedule for the next several months.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-2">
                  <Label htmlFor="months">Months to Generate</Label>
                  <Input
                    id="months"
                    type="number"
                    min="1"
                    max="36"
                    value={regenerateMonths}
                    onChange={(e) => setRegenerateMonths(parseInt(e.target.value) || 12)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRegenerateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRegenerate} disabled={regenerateLoading}>
                  {regenerateLoading ? "Regenerating..." : "Regenerate"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={downloadCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {dates.length > 0 ? (
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
                        <Badge className="ml-2" variant="outline">Adjusted</Badge>
                      )}
                    </TableCell>
                    <TableCell>{format(processingDate, 'MMM d, yyyy')}</TableCell>
                    <TableCell>{date.notes || '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p>No payroll dates found.</p>
            <Button
              variant="outline"
              onClick={() => setRegenerateOpen(true)}
              className="mt-4"
            >
              Generate Payroll Dates
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Schedule is generated automatically based on payroll cycle and business day rules.
      </CardFooter>
    </Card>
  );
}
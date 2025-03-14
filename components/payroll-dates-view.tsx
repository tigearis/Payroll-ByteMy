// components/payroll-dates-view.tsx
"use client";
import { GET_PAYROLLS } from "@/graphql/queries/payrolls/getPayrolls";
import { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { format, parseISO, isEqual, addMonths } from "date-fns";
import { Download, RefreshCw } from "lucide-react";
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
  const [dates, setDates] = useState<PayrollDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [regenerateMonths, setRegenerateMonths] = useState(12);
  const [regenerateLoading, setRegenerateLoading] = useState(false);

  // Fetch payroll dates
  useEffect(() => {
    async function fetchPayrollDates() {
      try {
        setLoading(true);
        const response = await fetch(`/api/payroll-dates/${payrollId}?months=12`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch payroll dates: ${response.statusText}`);
        }
        
        const data = await response.json();
        setDates(data.dates || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    if (payrollId) {
      fetchPayrollDates();
    }
  }, [payrollId]);

  // Regenerate payroll dates
  const handleRegenerate = async () => {
    try {
      setRegenerateLoading(true);
      
      const response = await fetch('/api/payroll-dates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payrollId,
          startDate: new Date().toISOString(),
          months: regenerateMonths,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to regenerate dates');
      }
      
      // Refresh the dates after regeneration
      const datesResponse = await fetch(`/api/payroll-dates/${payrollId}?months=${regenerateMonths}`);
      const datesData = await datesResponse.json();
      setDates(datesData.dates || []);
      
      setRegenerateOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRegenerateLoading(false);
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
          <div className="text-red-500">{error}</div>
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
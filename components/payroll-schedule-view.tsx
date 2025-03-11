// components/payroll-schedule-view.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableCell, 
  TableBody 
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface PayrollScheduleProps {
  payrollId: number;
}

export function PayrollScheduleView({ payrollId }: PayrollScheduleProps) {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        setLoading(true);
        const startDate = new Date().toISOString();
        const response = await fetch(
          `/api/payrolls/schedule?payrollId=${payrollId}&startDate=${startDate}&periods=12`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }
        
        const data = await response.json();
        setScheduleData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    fetchSchedule();
  }, [payrollId]);

  if (loading) {
    return <div>Loading schedule...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Base Date</TableHead>
              <TableHead>Processing Date</TableHead>
              <TableHead>EFT Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleData.map((period) => (
              <TableRow key={period.periodNumber}>
                <TableCell>{period.periodNumber}</TableCell>
                <TableCell>{format(new Date(period.baseDate), "dd MMM yyyy")}</TableCell>
                <TableCell>
                  {format(new Date(period.processingDate), "dd MMM yyyy")}
                  {!isSameDay(period.baseDate, period.processingDate) && (
                    <Badge className="ml-2" variant="outline">Adjusted</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(period.eftDate), "dd MMM yyyy")}
                  {!isSameDay(period.baseDate, period.eftDate) && (
                    <Badge className="ml-2" variant="outline">Adjusted</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}
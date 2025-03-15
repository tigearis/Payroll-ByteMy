'use client'

import { useState } from "react";
import { format, addMonths } from "date-fns";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GET_PAYROLLS_BY_MONTH } from "@/graphql/queries/payrolls/getPayrollsByMonth";
import { Payroll } from "@/types/globals";

interface PayrollListCardProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PayrollListCard({ currentMonth, onMonthChange, searchQuery, onSearchChange }: PayrollListCardProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const start_date = format(currentMonth, "yyyy-MM-dd");
  const end_date = format(addMonths(currentMonth, 1), "yyyy-MM-dd");

  const { loading, error, data } = useQuery(GET_PAYROLLS_BY_MONTH, {
    variables: { start_date, end_date },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const payrolls: Payroll[] = data?.payrolls || [];
  const filteredPayrolls = payrolls.filter(
    (payroll) =>
      payroll.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      (payroll.client?.name && payroll.client.name.toLowerCase().includes(localSearchQuery.toLowerCase()))
  );

  const goToPreviousMonth = () => onMonthChange(addMonths(currentMonth, -1));
  const goToNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payroll List</CardTitle>
          <CardDescription>
            Payrolls for this month
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payrolls..."
            className="max-w-sm"
            value={localSearchQuery}
            onChange={(e) => {
              setLocalSearchQuery(e.target.value);
              onSearchChange(e.target.value); // Update parent state if needed
            }}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Payroll Name</TableHead>
              <TableHead>Processing Date</TableHead>
              <TableHead>EFT Date</TableHead>
              <TableHead>Payroll System</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayrolls.length > 0 ? (
              filteredPayrolls.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell>{payroll.client?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Link href={`/payrolls/${payroll.id}`} className="text-primary hover:underline">
                      {payroll.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {payroll.payroll_dates?.[0]?.processing_date
                      ? format(new Date(payroll.payroll_dates[0].processing_date), 'MMM d, yyyy')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {payroll.payroll_dates?.[0]?.adjusted_eft_date
                      ? format(new Date(payroll.payroll_dates[0].adjusted_eft_date), 'MMM d, yyyy')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{payroll.payroll_system || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={payroll.status === "Active" ? "default" : "secondary"}>
                      {payroll.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No payrolls found for this month.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

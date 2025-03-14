// app/(dashboard)/payrolls/page.tsx
"use client"; 
import { useState } from "react";
import { format, addMonths } from "date-fns";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { PlusCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GET_PAYROLLS_BY_MONTH } from "@/graphql/queries/payrolls/getPayrollsByMonth";
import { useUserRole } from "@/hooks/useUserRole";
import { Payroll } from "@/types/globals";

export default function PayrollsPage() {
  // State for current month and search query
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");


  const startDate = format(currentMonth, "yyyy-MM-01");
  const endDate = format(addMonths(currentMonth, 1), "yyyy-MM-01");
  
  const { loading, error, data } = useQuery(GET_PAYROLLS_BY_MONTH, {
    variables: { startDate, endDate },
  });
  
  
  // Use our custom hook
  const { isAdmin, isManager, isLoading: roleLoading } = useUserRole();
  
  // Role-based permissions
  const canManagePayrolls = isAdmin || isManager;

  // Month navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, -1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  if (loading || roleLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading payrolls: {error.message}</p>;

  const payrolls: Payroll[] = data?.payrolls || [];
  
  const filteredPayrolls = payrolls.filter(
    (payroll) =>
      payroll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payroll.client?.name && payroll.client.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payrolls</h2>
          <p className="text-muted-foreground">Manage payrolls for your clients</p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Missing Dates
            </Button>
          )}
          {canManagePayrolls && (
            <Button asChild>
              <Link href="/payrolls/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Payroll
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payroll List</CardTitle>
            <CardDescription>
              Payrolls for {format(currentMonth, 'MMMM yyyy')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextMonth}
            >
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
    </div>
  );
}
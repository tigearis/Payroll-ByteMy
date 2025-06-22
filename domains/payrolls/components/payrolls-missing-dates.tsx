// components/payrolls-missing-dates.tsx - UPDATED VERSION
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useSmartPolling } from "@/hooks/use-polling";
import { useUserRole } from "@/hooks/use-user-role";

import {
  GetPayrollsMissingDatesDocument,
  GeneratePayrollDatesDocument,
} from "@/domains/payrolls/graphql/generated/graphql";

interface PayrollWithDateCount {
  id: string;
  name: string;
  client: { name: string };
  status: string;
  payroll_dates_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export function PayrollsMissingDates() {
  const { userRole } = useUserRole();
  const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(
    GetPayrollsMissingDatesDocument,
    {
      fetchPolicy: "cache-and-network",
      pollInterval: 60000, // Poll every minute
    }
  );

  // Use our smart polling hook to manage polling
  useSmartPolling(
    { startPolling, stopPolling, refetch },
    {
      defaultInterval: 60000, // Poll every minute
      pauseOnHidden: true, // Save resources when tab not visible
      refetchOnVisible: true, // Get fresh data when returning to tab
    }
  );

  const [generatePayrollDates, { loading: generating }] = useMutation(
    GeneratePayrollDatesDocument
  );

  useEffect(() => {
    console.log("Fetching payrolls missing dates...");
  }, []);

  if (loading) {
    console.log("Loading payrolls...");
    return <p>Loading...</p>;
  }
  if (error) {
    console.error("Error loading payrolls:", error.message);
    return <p>Error loading payrolls: {error.message}</p>;
  }

  console.log("Payrolls data:", data);
  const payrolls = data?.payrolls || [];

  const payrollsMissingDates = payrolls.filter(
    payroll => payroll.payrollDates_aggregate?.aggregate?.count === 0
  );

  const missingDatesPayrollIds = payrollsMissingDates.map(
    payroll => payroll.id
  );

  console.log("Missing payroll IDs:", missingDatesPayrollIds);

  if (
    !userRole ||
    !["org_admin", "developer"].includes(userRole) ||
    missingDatesPayrollIds.length === 0
  ) {
    console.log(
      "User does not have permission or no payrolls are missing dates."
    );
    return null;
  }

  const handleGenerateMissingDates = async () => {
    try {
      for (const id of missingDatesPayrollIds) {
        await generatePayrollDates({
          variables: {
            payrollId: id,
            startDate: null,
            endDate: null,
            maxDates: null,
          },
        });
      }
      toast.success("Successfully generated missing dates for all payrolls.");
      refetch(); // Refresh data after mutation
    } catch (err) {
      console.error("Error generating missing dates:", err);
      toast.error("Failed to generate missing dates.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payrolls Missing Dates</CardTitle>
        <CardDescription>
          The following payrolls don&apos;t have any dates scheduled. Generate
          dates to create a schedule.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Payroll Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollsMissingDates.map(payroll => (
              <TableRow key={payroll.id}>
                <TableCell>{payroll.client?.name || "N/A"}</TableCell>
                <TableCell>{payroll.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payroll.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {payroll.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateMissingDates} disabled={generating}>
          {generating ? "Generating..." : "Generate All Missing Dates"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// components/payrolls-missing-dates.tsx
"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GET_PAYROLLS_MISSING_DATES } from "@/graphql/queries/payrolls/getPayrollsMissingDates";
import { GENERATE_PAYROLL_DATES } from "@/graphql/mutations/payrolls/generatePayrollDates";

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
  const { loading, error, data, refetch } = useQuery(GET_PAYROLLS_MISSING_DATES);
  const [generatePayrollDates, { loading: generating }] = useMutation(GENERATE_PAYROLL_DATES);

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
  const payrolls: PayrollWithDateCount[] = data?.payrolls || [];

  const payrollsMissingDates = payrolls.filter(
    (payroll) => payroll.payroll_dates_aggregate.aggregate.count === 0
  );

  const missingDatesPayrollIds = payrollsMissingDates.map((payroll) => payroll.id);

  console.log("Missing payroll IDs:", missingDatesPayrollIds);

  if (!userRole || !["org_admin", "admin"].includes(userRole) || missingDatesPayrollIds.length === 0) {
    console.log("User does not have permission or no payrolls are missing dates.");
    return null;
  }

  const handleGenerateMissingDates = async () => {
    try {
      for (const id of missingDatesPayrollIds) {
        await generatePayrollDates({
          variables: {
            args: {
              p_payroll_id: id,
              p_start_date: null,
              p_end_date: null,
            },
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
          The following payrolls don&apos;t have any dates scheduled. Generate dates to create a schedule.
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
            {payrollsMissingDates.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell>{payroll.client?.name || "N/A"}</TableCell>
                <TableCell>{payroll.name}</TableCell>
                <TableCell>
                  <Badge variant={payroll.status === "Active" ? "default" : "secondary"}>
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
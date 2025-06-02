"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payroll } from "@/types/interface";

interface ClientPayrollsTableProps {
  payrolls: Payroll[];
  isLoading?: boolean;
}

export function ClientPayrollsTable({
  payrolls,
  isLoading = false,
}: ClientPayrollsTableProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to format name (removes underscores, capitalizes, and keeps DOW/EOM/SOM uppercase)
  const formatName = (name?: string) => {
    if (!name) return "N/A";
    return name
      .replace(/_/g, " ") // Remove underscores
      .split(" ")
      .map((word) => {
        const specialCases = ["DOW", "EOM", "SOM"];
        return specialCases.includes(word.toUpperCase())
          ? word.toUpperCase() // Keep these fully capitalized
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter
      })
      .join(" ");
  };

  // Function to format the day of week
  const formatDayOfWeek = (dayValue?: number) => {
    if (dayValue === undefined || dayValue === null) return "N/A";

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[dayValue % 7]; // Ensure it's within 0-6 range
  };

  // Function to format fixed date with ordinal suffix
  const formatFixedDate = (dateValue?: number) => {
    if (dateValue === undefined || dateValue === null) return "N/A";

    const suffix = (num: number) => {
      if (num >= 11 && num <= 13) return "th";

      switch (num % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${dateValue}${suffix(dateValue)}`;
  };

  // Function to display the appropriate date value based on date type
  const displayDateValue = (payroll: Payroll) => {
    if (!payroll.payrollDateType || !payroll.payrollDateType.name) return "N/A";

    const dateTypeName = payroll.payrollDateType.name.toUpperCase();

    if (
      dateTypeName.includes("DOW") ||
      dateTypeName.includes("WEEK A") ||
      dateTypeName.includes("WEEK B")
    ) {
      return formatDayOfWeek(payroll.dateValue);
    } else {
      return formatFixedDate(payroll.dateValue);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Cycle</TableHead>
          <TableHead>Date Type</TableHead>
          <TableHead>Day/Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : payrolls.length > 0 ? (
          payrolls.map((payroll) => (
            <TableRow key={payroll.id}>
              <TableCell>
                <Link
                  href={`/payrolls/${payroll.id}`}
                  className="text-primary hover:underline"
                >
                  {payroll.name}
                </Link>
              </TableCell>
              <TableCell>
                {formatName(payroll.payrollCycle?.name) || "N/A"}
              </TableCell>
              <TableCell>{formatName(payroll.payrollDateType?.name)}</TableCell>
              <TableCell>{displayDateValue(payroll)}</TableCell>
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
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No payrolls associated with this client yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

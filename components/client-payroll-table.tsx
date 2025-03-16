// components/client-payrolls-table.tsx
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Payroll {
  id: string;
  name: string;
  status: string;
  payroll_cycle?: {
    name: string;
  };
  payroll_date_type?: {
    name: string;
  };
  payroll_dates?: Array<{
    adjusted_eft_date: string;
  }>;
}

interface ClientPayrollsTableProps {
  payrolls: Payroll[];
  isLoading?: boolean;
}

export function ClientPayrollsTable({ payrolls, isLoading = false }: ClientPayrollsTableProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Format cycle and date type names
  const formatName = (name?: string) => {
    if (!name) return "N/A";
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Cycle</TableHead>
          <TableHead>Date Type</TableHead>
          <TableHead>Next EFT</TableHead>
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
                <Link href={`/payrolls/${payroll.id}`} className="text-primary hover:underline">
                  {payroll.name}
                </Link>
              </TableCell>
              <TableCell>{formatName(payroll.payroll_cycle?.name)}</TableCell>
              <TableCell>{formatName(payroll.payroll_date_type?.name)}</TableCell>
              <TableCell>
                {payroll.payroll_dates && payroll.payroll_dates.length > 0
                  ? formatDate(payroll.payroll_dates[0].adjusted_eft_date)
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Badge variant={payroll.status === "Active" ? "default" : "secondary"}>
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
"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import { PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

enum PayrollStatus {
  Active = "Active",
  Inactive = "Inactive",
  Implementation = "Implementation",
}

interface Payroll {
  id: string;
  name: string;
  client: { name: string };
  payroll_cycle?: { name: string };
  payroll_date_type?: { name: string };
  processing_days_before_eft: number;
  payroll_system: string;
  date_value?: number;
  status: PayrollStatus;
}

// ✅ GraphQL Query to Fetch Payroll Data
const GET_PAYROLLS = gql`
  query MyQuery {
    payrolls {
      id
      name
      payroll_system
      processing_days_before_eft
      status
      date_value
      client {
        name
      }
      payroll_cycle {
        name
      }
      payroll_date_type {
        name
      }
    }
  }
`;

export default function PayrollsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, data } = useQuery(GET_PAYROLLS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const payrolls: Payroll[] = data.payrolls;

  const filteredPayrolls = payrolls.filter((payroll) =>
    payroll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payroll.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Day of the Week Mapping (1 = Sunday, 7 = Saturday)
  const dayOfWeekMap: { [key: number]: string } = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payrolls</h2>
          <p className="text-muted-foreground">Manage all payrolls for your clients.</p>
        </div>
        <Button asChild>
          <Link href="/payrolls/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Payroll
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll List</CardTitle>
          <CardDescription>View and manage all payrolls in one place.</CardDescription>
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
                <TableHead>Cycle</TableHead>
                <TableHead>Date Type</TableHead>
                <TableHead>EFT Date</TableHead>
                <TableHead>Processing Days</TableHead>
                <TableHead>Payroll System</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayrolls.map((payroll) => {
                // ✅ Ensure payroll_cycle & payroll_date_type exist
                let cycleName = payroll.payroll_cycle?.name || "N/A";
                let dateTypeName = payroll.payroll_date_type?.name || "N/A";

                // ✅ Fix casing issues ("week_a" → "Week A", "eom" → "EOM", etc.)
                dateTypeName = dateTypeName
                  .replace("_", " ") // Convert underscores to spaces
                  .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

                // Special handling for "eom" and "som"
                if (dateTypeName === "Eom") dateTypeName = "EOM";
                if (dateTypeName === "Som") dateTypeName = "SOM";
                cycleName = cycleName
                  .toLowerCase() 
                  .replace("_", " ")// Convert to lowercase first
                  .split(" ") // Split into words
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                  .join(" ");

                // ✅ Format `date_value` based on cycle type
                let displayDate: string = "N/A";

                if (["Weekly", "Fortnightly"].includes(cycleName)) {
                  // Convert date_value (1-7) into day names (Monday, Tuesday, etc.)
                  const dayName = dayOfWeekMap[payroll.date_value ?? 0] || "Invalid Day";
                  displayDate = dateTypeName.includes("Week")
                    ? `${dayName}` // Example: "Monday - Week A"
                    : dayName; // Example: "Tuesday"
                }
                else if (cycleName === "Monthly" && payroll.payroll_date_type?.name === "fixed_date") {
                  // Show date_value as "26th"
                  displayDate = payroll.date_value ? `${payroll.date_value}th` : "N/A";
                }
                else if (["Bi-Monthly", "Quarterly"].includes(cycleName)) {
                  // Show "EOM", "SOM"
                  displayDate = dateTypeName;
                }

                return (
                  <TableRow key={payroll.id}>
                    <TableCell>{payroll.client.name}</TableCell>
                    <TableCell>
                      <Link href={`/payrolls/${payroll.id}`} className="text-primary hover:underline">
                        {payroll.name}
                      </Link>
                    </TableCell>
                    <TableCell>{cycleName}</TableCell>
                    <TableCell>{dateTypeName} - {displayDate}</TableCell>
                    <TableCell>{displayDate}</TableCell>
                    <TableCell>{payroll.processing_days_before_eft}</TableCell>
                    <TableCell>{payroll.payroll_system}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payroll.status === PayrollStatus.Active
                            ? "default"
                            : payroll.status === PayrollStatus.Implementation
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {payroll.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

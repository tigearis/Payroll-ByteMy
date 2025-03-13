"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { format } from "date-fns"; // Import for date formatting
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs"; // Import for Clerk authentication

// Enum for type safety when working with payroll statuses
enum PayrollStatus {
  Active = "Active",
  Inactive = "Inactive",
  Implementation = "Implementation",
}

// Interface defining the shape of the payroll data
// Note: Update this interface whenever the API response structure changes
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
  // Include the payroll dates from the updated API response
  payroll_dates?: { adjusted_eft_date: string; processing_date: string }[];
}

export default function PayrollsPage() {
  // State to hold the search query
  const [searchQuery, setSearchQuery] = useState("");
  // State to hold the fetched payrolls
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  // Loading state for displaying loading indicators
  const [loading, setLoading] = useState(true);
  // Error state for handling API errors
  const [error, setError] = useState<string | null>(null);
  // Authentication context from Clerk
  const { isLoaded, userId, getToken } = useAuth();
  // State to track user's role for permission-based UI elements
  const [userRole, setUserRole] = useState<string | null>(null);

  // Function to refresh the page - used after actions that modify data
  const refreshData = () => {
    window.location.reload();
  };

  // Effect to fetch user role from Clerk JWT
  useEffect(() => {
    async function getUserRole() {
      if (isLoaded && userId) {
        try {
          // Get the JWT token with Hasura claims
          const token = await getToken({ template: "hasura" });
          if (token) {
            // Decode the JWT to extract the role
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload['https://hasura.io/jwt/claims']?.['x-hasura-default-role'];
            setUserRole(role);
          }
        } catch (error) {
          console.error('Error getting user role:', error);
        }
      }
    }
    
    getUserRole();
  }, [isLoaded, userId, getToken]);

  // Effect to fetch payrolls data on component mount
  useEffect(() => {
    async function fetchPayrolls() {
      try {
        setLoading(true);
        const response = await fetch('/api/payrolls');

        if (!response.ok) {
          throw new Error(`Error fetching payrolls: ${response.statusText}`);
        }

        const data = await response.json();
        setPayrolls(data.payrolls || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchPayrolls();
  }, []);

  const handleGenerateMissingDates = async () => {
    // Get payrolls without dates
    const payrollsWithoutDates = payrolls
      .filter(p => !p.payroll_dates || p.payroll_dates.length === 0)
      .map(p => p.id);
      
    if (payrollsWithoutDates.length === 0) return;
  
    try {
      // Use existing cron endpoint instead of creating a new one
      const response = await fetch('/api/cron/update-payroll-dates', {
        method: 'POST',  // Change to POST if your endpoint supports it, otherwise keep GET
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payrollIds: payrollsWithoutDates }), // Only include if your endpoint accepts a body
      });
      
      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = 'Failed to generate dates';
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (_e) {
          console.error('Error parsing response:', responseText);
        }
        
        throw new Error(errorMessage);
      }
      
      // Refresh the page to show new dates
      refreshData();
    } catch (error) {
      console.error('Error generating dates:', error);
      // You could add a toast notification here
    }
  };

  // Simple loading state
  if (loading) return <p>Loading...</p>;
  // Error handling
  if (error) return <p>Error: {error}</p>;

  // Filter payrolls based on search query
  const filteredPayrolls = payrolls.filter((payroll) =>
    payroll.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payroll.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if there are payrolls missing dates
  const payrollsWithoutDates = payrolls
    .filter(p => !p.payroll_dates || p.payroll_dates.length === 0)
    .map(p => p.id);

  // Mapping for day of week (1 = Sunday, 7 = Saturday)
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
      {/* Header section with title and action buttons */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payrolls</h2>
          <p className="text-muted-foreground">Manage all payrolls for your clients.</p>
        </div>
        <div className="flex gap-2">
          {/* Only show generate dates button to admin users and if there are payrolls missing dates */}
          {userRole === 'org_admin' && payrollsWithoutDates.length > 0 && (
            <Button variant="outline" onClick={handleGenerateMissingDates}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Missing Dates
            </Button>
          )}
          <Button asChild>
            <Link href="/payrolls/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Payroll
            </Link>
          </Button>
        </div>
      </div>

      {/* Main card with payrolls data */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll List</CardTitle>
          <CardDescription>View and manage all payrolls in one place.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search input */}
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payrolls..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Payrolls table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Payroll Name</TableHead>
                <TableHead>Cycle</TableHead>
                <TableHead>Date Type</TableHead>
                <TableHead>EFT Date</TableHead>
                <TableHead>Next EFT Date</TableHead>
                <TableHead>Processing Date</TableHead>
                <TableHead>Payroll System</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayrolls.length > 0 ? (
                filteredPayrolls.map((payroll) => {
                  // Format payroll cycle & date type names for display
                  let cycleName = payroll.payroll_cycle?.name || "N/A";
                  let dateTypeName = payroll.payroll_date_type?.name || "N/A";

                  // Fix casing issues ("week_a" → "Week A", "eom" → "EOM", etc.)
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

                  // Format `date_value` based on cycle type
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
                      <TableCell>
                        {/* Display upcoming EFT date if available */}
                        {payroll.payroll_dates && payroll.payroll_dates.length > 0
                          ? format(new Date(payroll.payroll_dates[0].adjusted_eft_date), 'MMM d, yyyy')
                          : "Not scheduled"}
                      </TableCell>
                      <TableCell>
                        {/* Display upcoming processing date if available */}
                        {payroll.payroll_dates && payroll.payroll_dates.length > 0
                          ? format(new Date(payroll.payroll_dates[0].processing_date), 'MMM d, yyyy')
                          : "Not scheduled"}
                      </TableCell>
                      <TableCell>{payroll.payroll_system}</TableCell>
                      <TableCell>
                        {/* Color badge based on status */}
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
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No payrolls found.
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
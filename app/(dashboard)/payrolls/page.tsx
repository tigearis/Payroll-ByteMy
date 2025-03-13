"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payroll, PayrollStatus } from "@/types/globals";

// ✅ Fetch Function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PayrollsPage() {
  const { isLoaded, userId, getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Use SWR to fetch payrolls
  const { data, error, isLoading } = useSWR("/api/payrolls", fetcher);

  // ✅ Ensure `payrolls` is always an array
  const payrolls: Payroll[] = data?.payrolls || [];

  // ✅ Extract user role securely
  const [userRole, setUserRole] = useState<string | null>(null);
  useState(() => {
    async function fetchUserRole() {
      if (isLoaded && userId) {
        try {
          const token = await getToken({ template: "hasura" });
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserRole(payload["https://hasura.io/jwt/claims"]?.["x-hasura-default-role"]);
          }
        } catch (err) {
          console.error("Error getting user role:", err);
        }
      }
    }
    fetchUserRole();
  }, [isLoaded, userId, getToken]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const filteredPayrolls = payrolls.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payrolls</h2>
          <p className="text-muted-foreground">Manage all payrolls for your clients.</p>
        </div>
        <div className="flex gap-2">
          {(userRole === "org_admin" || userRole === "admin") && (
            <Button variant="outline">
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
                <TableHead>Payroll System</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayrolls.length > 0 ? (
                filteredPayrolls.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>{payroll.client.name}</TableCell>
                    <TableCell>
                      <Link href={`/payrolls/${payroll.id}`} className="text-primary hover:underline">
                        {payroll.name}
                      </Link>
                    </TableCell>
                    <TableCell>{payroll.payroll_cycle?.name || "N/A"}</TableCell>
                    <TableCell>{payroll.payroll_date_type?.name || "N/A"}</TableCell>
                    <TableCell>{payroll.payroll_system}</TableCell>
                    <TableCell>
                      <Badge variant={payroll.status === PayrollStatus.Active ? "default" : "secondary"}>
                        {payroll.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
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

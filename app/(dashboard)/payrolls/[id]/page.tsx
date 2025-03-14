"use client";

import { useQuery } from "@apollo/client";
import { useParams, notFound } from "next/navigation";
import { GET_PAYROLL_BY_ID } from "@/graphql/queries/payrolls/getPayrollById";
import { PayrollDatesView } from "@/components/payroll-dates-view"; // ✅ Import the component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PayrollPage() {
  const params = useParams();
  const id = params?.id as string;

  const { loading, error, data } = useQuery(GET_PAYROLL_BY_ID, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.payrolls || data.payrolls.length === 0) return notFound();

  const payroll = data.payrolls[0];

  const capitalize = (str: string | undefined) => {
    if (!str) return "N/A";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payroll Details</h2>
      </div>

      {/* Top Cards - Split into Client & Payroll Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Details */}
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
            <CardDescription>Information about the associated client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span>Client Name:</span>
                <Link href={`/clients/${payroll.client?.id}`} className="text-primary hover:underline">
                  {payroll.client?.name || "N/A"}
                </Link>
              </div>
              <div className="flex justify-between">
                <span>Contact Person:</span>
                <span>{payroll.client?.contact || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span>{payroll.client?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>{payroll.client?.phone || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Details</CardTitle>
            <CardDescription>Specific details for this payroll</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={payroll.status === "active" ? "default" : "secondary"}>
                  {payroll.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Payroll System:</span>
                <span>{payroll.payroll_system || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Payroll Cycle:</span>
                <span>{capitalize(payroll.payroll_cycle?.name)}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Days Before EFT:</span>
                <span>{payroll.processing_days_before_eft}</span>
              </div>
              <div className="flex justify-between">
                <span>Created At:</span>
                <span>{new Date(payroll.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{new Date(payroll.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Use PayrollDatesView Component */}
      <PayrollDatesView
        payrollId={id}
        payrollName={payroll.name}
        cycleType={payroll.payroll_cycle?.name}
      />
    </div>
  );
}

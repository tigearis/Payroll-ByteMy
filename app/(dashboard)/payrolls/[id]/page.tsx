// app/(dashboard)/payrolls/[id]/page.tsx

"use client";

import { useQuery } from "@apollo/client";
import { GET_PAYROLL_BY_ID } from "@/graphql/queries/payrolls/getPayrollById";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PayrollPage({ params }: { params: { id: string } }) {
  const { loading, error, data } = useQuery(GET_PAYROLL_BY_ID, {
    variables: { id: params.id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading payroll.</p>;

  // Ensure data exists
  if (!data || !data.payrolls || data.payrolls.length === 0) return notFound();

  const payroll = data.payrolls[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payroll Details</h2>
        <p className="text-muted-foreground">Viewing details for payroll ID: {payroll.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{payroll.name}</CardTitle>
          <CardDescription>Client: {payroll.client?.name || "N/A"}</CardDescription>
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
              <span>Primary Consultant:</span>
              <span>{payroll.staffByPrimaryConsultantId?.name || "Not assigned"}</span>
            </div>
            <div className="flex justify-between">
              <span>Backup Consultant:</span>
              <span>{payroll.staff?.name || "Not assigned"}</span>
            </div>
            <div className="flex justify-between">
              <span>Manager:</span>
              <span>{payroll.staffByManagerId?.name || "Not assigned"}</span>
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

      {/* Payroll Dates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Dates</CardTitle>
          <CardDescription>Important payroll schedule details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {payroll.payroll_dates?.length > 0 ? (
              payroll.payroll_dates.map(
                (
                  date: {
                    original_eft_date: string;
                    adjusted_eft_date: string;
                    processing_date: string;
                    notes?: string;
                  },
                  index: number
                ) => (
                  <div key={index} className="border p-3 rounded-md">
                    <div className="flex justify-between">
                      <span>Original EFT Date:</span>
                      <span>{new Date(date.original_eft_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adjusted EFT Date:</span>
                      <span>{new Date(date.adjusted_eft_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Date:</span>
                      <span>{new Date(date.processing_date).toLocaleDateString()}</span>
                    </div>
                    {date.notes && (
                      <div className="mt-2">
                        <span className="font-medium">Notes:</span> {date.notes}
                      </div>
                    )}
                  </div>
                )
              )
            ) : (
              <p>No payroll dates available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

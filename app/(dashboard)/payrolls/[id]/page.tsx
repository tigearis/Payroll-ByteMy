// app/(dashboard)/payrolls/[id]/page.tsx
"use client";

import { useQuery } from "@apollo/client";
import { useParams, notFound } from "next/navigation";
import { GET_PAYROLL_BY_ID } from "@/graphql/queries/payrolls/getPayrollById";
import { PayrollDate } from "@/types/globals"; // Ensure you have a type defined for payroll dates
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


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
    if (!str) return "N/A"; // Handle undefined case
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payroll Details</h2>
      </div>

      {/* Payroll Information */}
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
              <span>Payroll Cycle:</span>
              <span>{capitalize(payroll.payroll_cycle?.name)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payroll Date Type:</span>
              <span>{capitalize(payroll.payroll_date_type?.name)}</span>
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
          {payroll.payroll_dates?.length > 0 ? (
            <>
              {/* Table Headers */}
              <div className="grid grid-cols-3 font-medium text-gray-500 border-b pb-2 px-4">
                <div className="text-left">Original EFT Date</div>
                <div className="text-left">Adjusted EFT Date</div>
                <div className="text-left">Processing Date</div>
              </div>

              {/* Table Body (Cards) */}
              <div className="space-y-2">
                {payroll.payroll_dates.map((date: PayrollDate, index: number) => (
                  <Card key={index} className="shadow-sm border rounded-lg w-full">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-lg font-semibold">
                          {new Date(date.original_eft_date).toLocaleDateString()}
                        </div>
                        <div className="text-lg font-semibold">
                          {new Date(date.adjusted_eft_date).toLocaleDateString()}
                        </div>
                        <div className="text-lg font-semibold">
                          {new Date(date.processing_date).toLocaleDateString()}
                        </div>
                      </div>
                      
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">No payroll dates available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
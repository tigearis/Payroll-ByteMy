// pages/payroll-page.tsx
'use client'

import { useParams, notFound } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_PAYROLL_BY_ID } from "@/graphql/queries/payrolls/getPayrollById";
import { PayrollDatesView } from "@/components/payroll-dates-view";
import { ClientCard } from "@/components/client-card";
import { PayrollDetailsCard } from "@/components/payroll-details-card";
import { ExportCsv } from "@/components/export-csv";
import { ExportPdf } from "@/components/export-pdf";
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, PlusCircle, RefreshCw } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";
import { NotesListWithAdd } from "@/components/notes-list-with-add";
import { useEffect, useState } from "react";


export default function PayrollPage() {
  const params = useParams();
  const id = params?.id as string;
  const [loadingToastShown, setLoadingToastShown] = useState(false);
  if (!id) {
    toast.error('Error: Payroll ID is required.');
    return <div>Error: Payroll ID is required.</div>;
  }

  const { loading, error, data, refetch } = useQuery(GET_PAYROLL_BY_ID, {
    variables: { id },
    skip: !id,
  });
  useEffect(() => {
    // Only show toast once and only if still loading after 2 seconds
    if (loading && !loadingToastShown) {
      const timer = setTimeout(() => {
        if (loading) {
          toast.info('Loading payroll data...');
          setLoadingToastShown(true);
        }
      }, 2000); // Reduced from 5000ms to 2000ms

      return () => clearTimeout(timer); // Clean up timer
    }
  }, [loading, loadingToastShown]);

  // Then your existing code can be simplified to:
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    toast.error(`Error: ${error.message}`);
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.payrolls || data.payrolls.length === 0) {
    toast.error('No payroll data found.');
    return notFound();
  }

  const payroll = data.payrolls[0];
  const client = payroll.client;

  const payrollDates = payroll.payroll_dates.map((date: any) => ({
    ...date,
  }));

  return (

    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{payroll.name}</h1>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <RefreshButton
            type="query" // Specify what type of refresh action to perform
            data={["GET_CLIENT_DETAILS"]} // Pass relevant queries to refresh
            text="Refresh" // Button text
            showIcon={true} // Show the refresh icon
            variant="outline" // Button style variant
            className="px-4 py-2" // Additional styling for spacing
          />

          <Button className="flex items-center gap-1">
            <Link href={`/payrolls/${id}/edit`} className="flex items-center">
              <Pencil className="h-4 w-4 mr-1" /> Edit Payroll
            </Link>
          </Button>
        </div>
      </div>
      <div>
        {/* Export Buttons */}
        <div className="flex space-x-2 mb-4">
          <ExportCsv payrollId={id} />
          <ExportPdf payrollId={id} />
        </div>
      </div>
      {/* Main Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="col-span-2">
          <PayrollDatesView payrollId={id} />
        </div>

        {/* Cards and Notes Column */}
        <div className="col-span-1 space-y-4">
          <ClientCard client={client} />
          <PayrollDetailsCard payroll={payroll} />
          <NotesListWithAdd
            entityType="payroll"
            entityId={payroll.id}
            title="Payroll Notes"
          />
        </div>
      </div>
    </div>
  );
}

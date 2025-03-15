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
import NotesList from "@/components/notes-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, PlusCircle } from "lucide-react";
import { RefreshButton } from "@/components/refresh-button";
import { NotesListWithAdd } from "@/components/notes-list-with-add";


export default function PayrollPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    toast.error('Error: Payroll ID is required.');
    return <div>Error: Payroll ID is required.</div>;
  }

  const { loading, error, data } = useQuery(GET_PAYROLL_BY_ID, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    setTimeout(() => {
      if (loading) {
        toast.info('Loading payroll data...');
      }
    }, 2000);
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
      <div> <h1 className="text-2xl font-bold">{payroll.name}</h1>
        {/* Edit Button */}
        <div className="flex justify-end gap-2">
          <RefreshButton
            type="entity"
            data={{ typename: "payrolls", id: payroll.id }}
            text="Refresh"
            showToast={true}
          />
          <Button >
            <Link href="/payrolls/new" className="flex items-center">
              <Pencil className="mr-2 h-4 w-4" /> Edit Payroll
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

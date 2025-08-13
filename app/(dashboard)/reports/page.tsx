import { Metadata } from "next";
import {
  PermissionGuard,
  ResourceProvider,
  RESOURCES,
} from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { ReportBuilder } from "@/components/reports/report-builder";

export const metadata: Metadata = {
  title: "Reports | Payroll ByteMy",
  description: "Generate and customize reports for your payroll data",
};

export default function ReportsPage() {
  return (
    <ResourceProvider resource={RESOURCES.REPORTS}>
      <div className="space-y-6">
        <PageHeader
          title="Reports"
          description="Generate and analyze payroll reports"
        />

        <PermissionGuard permission="reports:view">
          <ReportBuilder />
        </PermissionGuard>
      </div>
    </ResourceProvider>
  );
}

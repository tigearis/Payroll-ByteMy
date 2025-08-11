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
  description: "Generate custom reports across multiple domains",
};

export default function ReportsPage() {
  return (
    <ResourceProvider resource={RESOURCES.REPORTS}>
      <PermissionGuard
        action="read"
        fallback={
          <div className="container mx-auto py-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2 text-red-800">
                Access Denied
              </h3>
              <p className="text-red-600">
                You don't have permission to view reports. Contact your
                administrator for access.
              </p>
            </div>
          </div>
        }
      >
        <div className="container mx-auto py-6 space-y-6">
          <PageHeader
            title="Reports"
            description="Generate custom reports across multiple domains"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Reports" },
            ]}
          />
          <ReportBuilder />
        </div>
      </PermissionGuard>
    </ResourceProvider>
  );
}

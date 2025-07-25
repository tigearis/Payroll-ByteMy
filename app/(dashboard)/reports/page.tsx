import { Metadata } from "next";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { ReportBuilder } from "@/components/reports/report-builder";

export const metadata: Metadata = {
  title: "Reports | Payroll ByteMy",
  description: "Generate custom reports across multiple domains",
};

export default function ReportsPage() {
  return (
    <PermissionGuard role="developer" fallback={
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2 text-red-800">
            Access Denied
          </h3>
          <p className="text-red-600">
            Reports are only accessible to developers. Contact your administrator for access.
          </p>
        </div>
      </div>
    }>
      <div className="container mx-auto py-6">
        <ReportBuilder />
      </div>
    </PermissionGuard>
  );
}

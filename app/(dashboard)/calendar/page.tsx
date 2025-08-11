// app/(dashboard)/calendar/page.tsx
"use client";

import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { PayrollSchedule } from "@/domains/payrolls/components";

export default function CalendarPage() {
  return (
    <PermissionGuard action="read">
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Payroll Calendar"
          description="View and manage payroll schedules"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Calendar" },
          ]}
        />
        <PayrollSchedule />
      </div>
    </PermissionGuard>
  );
}

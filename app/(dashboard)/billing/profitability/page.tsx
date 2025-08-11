"use client";

import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { ProfitabilityDashboard } from "@/domains/billing/components/profitability/profitability-dashboard";

export default function ProfitabilityPage() {
  return (
    <PermissionGuard action="read">
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Profitability Analysis"
          description="Analyze client profitability, staff performance, and business metrics"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Billing", href: "/billing" },
            { label: "Profitability" },
          ]}
        />

        <ProfitabilityDashboard />
      </div>
    </PermissionGuard>
  );
}

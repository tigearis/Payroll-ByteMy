"use client";

import { Plus, RefreshCw } from "lucide-react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { QuoteManagementDashboard } from "@/domains/billing/components/quoting/quote-management-dashboard";

export default function QuotesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Quote Management"
        description="Create, manage, and track quotes for prospective clients"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing", href: "/billing" },
          { label: "Quotes" },
        ]}
        actions={[
          {
            label: "Refresh",
            icon: RefreshCw,
            onClick: () => window.location.reload(),
          },
          {
            label: "New Quote",
            icon: Plus,
            primary: true,
            href: "/billing/quotes/new",
          },
        ]}
        overflowActions={[
          {
            label: "Export",
            onClick: () =>
              window.dispatchEvent(new CustomEvent("quotes:export")),
          },
        ]}
      />

      <PermissionGuard action="read">
        <QuoteManagementDashboard />
      </PermissionGuard>
    </div>
  );
}

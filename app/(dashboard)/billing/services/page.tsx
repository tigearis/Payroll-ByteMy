"use client";

import { RefreshCw } from "lucide-react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { ServiceCatalogManager } from "@/domains/billing/components/service-catalog/service-catalog-manager";

export default function ServiceCatalogPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Service Catalog"
        description="Manage billing services, rates, and client agreements"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing", href: "/billing" },
          { label: "Services" },
        ]}
        actions={[
          {
            label: "Refresh",
            icon: RefreshCw,
            onClick: () => window.location.reload(),
          },
        ]}
        overflowActions={[
          {
            label: "Export",
            onClick: () =>
              window.dispatchEvent(new CustomEvent("services:export")),
          },
        ]}
      />

      <PermissionGuard action="read">
        <ServiceCatalogManager />
      </PermissionGuard>
    </div>
  );
}

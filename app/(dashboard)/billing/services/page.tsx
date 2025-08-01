"use client";

import { ServiceCatalogManager } from "@/domains/billing/components/service-catalog/service-catalog-manager";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function ServiceCatalogPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Service Catalog</h1>
        <p className="text-muted-foreground">
          Manage billing services, rates, and client agreements
        </p>
      </div>
      
      <PermissionGuard permission="billing.admin">
        <ServiceCatalogManager />
      </PermissionGuard>
    </div>
  );
}
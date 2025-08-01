"use client";

import { QuoteManagementDashboard } from "@/domains/billing/components/quoting/quote-management-dashboard";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function QuotesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Quote Management</h1>
        <p className="text-muted-foreground">
          Create, manage, and track quotes for prospective clients
        </p>
      </div>
      
      <PermissionGuard permission="billing.read">
        <QuoteManagementDashboard />
      </PermissionGuard>
    </div>
  );
}
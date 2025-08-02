"use client";

import { ProfitabilityDashboard } from "@/domains/billing/components/profitability/profitability-dashboard";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function ProfitabilityPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profitability Analysis</h1>
        <p className="text-muted-foreground">
          Analyze client profitability, staff performance, and business metrics
        </p>
      </div>
      
      <PermissionGuard action="read">
        <ProfitabilityDashboard />
      </PermissionGuard>
    </div>
  );
}
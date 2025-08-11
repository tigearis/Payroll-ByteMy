"use client";

import { ArrowLeft, DollarSign } from "lucide-react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { BillingItemForm } from "@/domains/billing/components/items/billing-item-form";

export default function NewBillingItemPage() {
  return (
    <PermissionGuard
      resource="billing_items"
      action="create"
      fallback={
        <div className="container mx-auto py-6">
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2 text-red-800">
              Access Denied
            </h3>
            <p className="text-red-600">
              You don't have permission to create billing items. Contact your
              administrator for access.
            </p>
          </div>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Create Billing Item"
          description="Add a new billing item for client invoicing"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Billing", href: "/billing" },
            { label: "Items", href: "/billing/items" },
            { label: "New" },
          ]}
          actions={[
            { label: "Back to Items", icon: ArrowLeft, href: "/billing/items" },
          ]}
        />

        {/* Form */}
        <BillingItemForm />
      </div>
    </PermissionGuard>
  );
}

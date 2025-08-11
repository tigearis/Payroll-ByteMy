"use client";

import { ArrowLeft, DollarSign, Edit } from "lucide-react";
import { useParams } from "next/navigation";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { BillingItemDetails } from "@/domains/billing/components/items/billing-item-details";

export default function BillingItemDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PermissionGuard
      resource="billing_items"
      action="read"
      fallback={
        <div className="container mx-auto py-6">
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2 text-red-800">
              Access Denied
            </h3>
            <p className="text-red-600">
              You don't have permission to view billing items. Contact your
              administrator for access.
            </p>
          </div>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Billing Item Details"
          description="View and manage billing item information"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Billing", href: "/billing" },
            { label: "Items", href: "/billing/items" },
            { label: id },
          ]}
          actions={[
            { label: "Back to Items", icon: ArrowLeft, href: "/billing/items" },
            { label: "Edit", icon: Edit, href: `/billing/items/${id}/edit` },
          ]}
        />

        {/* Content */}
        <BillingItemDetails itemId={id} />
      </div>
    </PermissionGuard>
  );
}

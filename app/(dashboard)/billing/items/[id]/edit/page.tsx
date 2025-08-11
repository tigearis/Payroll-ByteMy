"use client";

import { ArrowLeft, DollarSign } from "lucide-react";
import { useParams } from "next/navigation";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { BillingItemForm } from "@/domains/billing/components/items/billing-item-form";

export default function EditBillingItemPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <PermissionGuard
      resource="billing_items"
      action="update"
      fallback={
        <div className="container mx-auto py-6">
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2 text-red-800">
              Access Denied
            </h3>
            <p className="text-red-600">
              You don't have permission to edit billing items. Contact your
              administrator for access.
            </p>
          </div>
        </div>
      }
    >
      <div className="container mx-auto py-6 space-y-6">
        <PageHeader
          title="Edit Billing Item"
          description="Update billing item information"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Billing", href: "/billing" },
            { label: "Items", href: "/billing/items" },
            { label: id },
            { label: "Edit" },
          ]}
          actions={[
            {
              label: "Back to Details",
              icon: ArrowLeft,
              href: `/billing/items/${id}`,
            },
          ]}
        />

        {/* Form */}
        <BillingItemForm itemId={id} />
      </div>
    </PermissionGuard>
  );
}

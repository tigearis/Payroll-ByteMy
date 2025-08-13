import { Metadata } from "next";
import { BillingUnitTypesManager } from "@/domains/billing/components/admin/billing-unit-types-manager";

export const metadata: Metadata = {
  title: "Billing Unit Types - Admin",
  description: "Manage configurable billing unit types for service pricing",
};

export default function BillingUnitTypesPage() {
  return (
    <div className="container mx-auto py-6">
      <BillingUnitTypesManager />
    </div>
  );
}
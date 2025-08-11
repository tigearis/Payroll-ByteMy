"use client";

import { ArrowLeft } from "lucide-react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { QuoteBuilder } from "@/domains/billing/components/quoting/quote-builder";

export default function NewQuotePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Create New Quote"
        description="Build a comprehensive quote for a prospective client"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing", href: "/billing" },
          { label: "Quotes", href: "/billing/quotes" },
          { label: "New" },
        ]}
        actions={[
          { label: "Back to Quotes", icon: ArrowLeft, href: "/billing/quotes" },
        ]}
      />

      <PermissionGuard action="create">
        <QuoteBuilder />
      </PermissionGuard>
    </div>
  );
}

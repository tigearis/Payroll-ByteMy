"use client";

import { Suspense } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { BillingApprovalQueue } from "@/domains/billing/components/management/billing-approval-queue";

export default function BillingApprovalQueuePage() {
  return (
    <PermissionGuard action="read">
      <Suspense fallback={<div>Loading approval queue...</div>}>
        <BillingApprovalQueue />
      </Suspense>
    </PermissionGuard>
  );
}

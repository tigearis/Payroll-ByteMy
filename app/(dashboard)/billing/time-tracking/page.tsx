"use client";

import { useUser } from "@clerk/nextjs";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { EnhancedTimeEntry } from "@/domains/billing/components/time-tracking/enhanced-time-entry";

export default function TimeTrackingPage() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Authentication Required
          </h1>
          <p className="text-muted-foreground">
            Please sign in to access time tracking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Time Tracking"
        description="Track time in 6-minute increments with automated billing generation"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing", href: "/billing" },
          { label: "Time Tracking" },
        ]}
      />

      <PermissionGuard action="create">
        <EnhancedTimeEntry staffUserId={user.id} />
      </PermissionGuard>
    </div>
  );
}

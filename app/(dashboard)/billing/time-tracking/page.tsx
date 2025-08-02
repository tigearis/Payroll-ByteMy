"use client";

import { EnhancedTimeEntry } from "@/domains/billing/components/time-tracking/enhanced-time-entry";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function TimeTrackingPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
        <p className="text-muted-foreground">
          Track time in 6-minute increments with automated billing generation
        </p>
      </div>
      
      <PermissionGuard action="create">
        <EnhancedTimeEntry staffUserId="current-user-id" />
      </PermissionGuard>
    </div>
  );
}
"use client";

import { useUser } from "@clerk/nextjs";
import { PermissionGuard } from "@/components/auth/permission-guard";
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
          <h1 className="text-2xl font-bold text-red-600">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to access time tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
        <p className="text-muted-foreground">
          Track time in 6-minute increments with automated billing generation
        </p>
      </div>
      
      <PermissionGuard action="create">
        <EnhancedTimeEntry staffUserId={user.id} />
      </PermissionGuard>
    </div>
  );
}
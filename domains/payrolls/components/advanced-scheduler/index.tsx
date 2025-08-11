"use client";

import React, { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { ResponsiveLayout } from "@/components/layout/responsive-layout";
import { cn } from "@/lib/utils";
import { SchedulerErrorBoundary } from "./SchedulerErrorBoundary";
import { SchedulerGrid } from "./SchedulerGrid";
import { SchedulerHeader } from "./SchedulerHeader";
import { SchedulerLegend } from "./SchedulerLegend";
import { SchedulerProvider, useScheduler } from "./SchedulerProvider";
import { SchedulerSidebar } from "./SchedulerSidebar";

interface AdvancedSchedulerContentProps {
  onRefresh?: () => void;
}

function AdvancedSchedulerContent({ onRefresh }: AdvancedSchedulerContentProps) {
  const { state } = useScheduler();

  const handleToggleExpanded = () => {
    // Toggle expanded state through the provider
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    // TODO: Trigger data refetch through provider
  };

  // In expanded mode, show full screen layout
  if (state.viewConfig.isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-background p-6 overflow-auto">
        <div className="space-y-6">
          {/* Header */}
          <SchedulerHeader 
            onToggleExpanded={handleToggleExpanded}
            onRefresh={handleRefresh}
          />

          {/* Legend - compact version */}
          <SchedulerLegend compact />

          {/* Full screen grid */}
          <SchedulerGrid />
        </div>
      </div>
    );
  }

  // Normal layout - full width calendar
  return (
    <div className="space-y-6">
      {/* Header */}
      <SchedulerHeader 
        onToggleExpanded={handleToggleExpanded}
        onRefresh={handleRefresh}
      />

      {/* Legend - compact version */}
      <SchedulerLegend compact />

      {/* Full width grid */}
      <SchedulerGrid />
    </div>
  );
}

interface AdvancedPayrollSchedulerProps {
  onRefresh?: () => void;
  className?: string;
}

export default function AdvancedPayrollScheduler({ 
  onRefresh, 
  className 
}: AdvancedPayrollSchedulerProps) {
  return (
    <PermissionGuard action="read" fallback={
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          You don't have permission to view the payroll scheduler.
        </p>
      </div>
    }>
      <SchedulerErrorBoundary>
        <SchedulerProvider>
          <div className={cn("container mx-auto", className)}>
            <AdvancedSchedulerContent onRefresh={onRefresh} />
          </div>
        </SchedulerProvider>
      </SchedulerErrorBoundary>
    </PermissionGuard>
  );
}

// Export individual components for testing and reuse
export {
  SchedulerProvider,
  SchedulerErrorBoundary,
  SchedulerHeader,
  SchedulerGrid,
  SchedulerSidebar,
  SchedulerLegend,
};
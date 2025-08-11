// app/(dashboard)/payroll-schedule/page.tsx
"use client";

import { RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Card, CardContent } from "@/components/ui/card";
import AdvancedPayrollScheduler from "@/domains/payrolls/components/advanced-payroll-scheduler";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";

export default function PayrollSchedulePage() {
  const { sidebarCollapsed, setSidebarCollapsed } = useLayoutPreferences();
  const previousSidebarState = useRef<boolean>(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Store the current sidebar state when entering the page
    previousSidebarState.current = sidebarCollapsed;

    // Auto-collapse the sidebar to maximize space for the scheduler
    if (!sidebarCollapsed) {
      setSidebarCollapsed(true);
    }

    // Restore the previous sidebar state when leaving the page
    return () => {
      if (previousSidebarState.current !== undefined) {
        setSidebarCollapsed(previousSidebarState.current);
      }
    };
  }, []); // Empty dependency array ensures this only runs on mount/unmount

  const handleRefresh = () => {
    setIsLoading(true);
    // TODO: Trigger refresh in the scheduler
    setTimeout(() => setIsLoading(false), 1000); // Temporary loading state
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const headerActions = [
    {
      label: "Refresh",
      onClick: handleRefresh,
      icon: RefreshCw,
    },
    {
      label: isExpanded ? "Exit Fullscreen" : "Expand", 
      onClick: handleToggleExpanded,
      icon: isExpanded ? Minimize2 : Maximize2,
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Advanced Payroll Scheduler"
        description="Drag-and-drop scheduling with consultant workload management"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payroll Scheduler" },
        ]}
        actions={headerActions}
      />
      <PermissionGuard
        resource="payrolls"
        action="manage"
        fallback={
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                You don't have permission to access the payroll scheduler.
                <br />
                This feature requires payroll write permissions.
              </div>
            </CardContent>
          </Card>
        }
      >
        <AdvancedPayrollScheduler />
      </PermissionGuard>
    </div>
  );
}

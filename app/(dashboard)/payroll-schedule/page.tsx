// app/(dashboard)/payroll-schedule/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Card, CardContent } from "@/components/ui/card";
import AdvancedPayrollScheduler from "@/domains/payrolls/components/advanced-payroll-scheduler";
import { useLayoutPreferences } from "@/lib/preferences/layout-preferences";

export default function PayrollSchedulePage() {
  const { sidebarCollapsed, setSidebarCollapsed } = useLayoutPreferences();
  const previousSidebarState = useRef<boolean>(false);

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PermissionGuard
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

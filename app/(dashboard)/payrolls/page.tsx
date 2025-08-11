"use client";

/*
 * Modern Payrolls Management Page
 *
 * Features progressive disclosure pattern with:
 * - 4 essential columns: Client, Payroll Name, Status, Next EFT Date
 * - Expandable rows for detailed payroll information and processing workflows
 * - Smart search and contextual payroll management actions
 * - Mobile-first responsive design for mission-critical payroll processing
 */

import { useQuery } from "@apollo/client";
import {
  Plus,
  RefreshCw,
  Upload,
  Calendar,
  BarChart3,
  Settings,
  FileText,
  AlertTriangle,
  X,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
// PageHeader intentionally deferred on this page due to type conflicts; keeping existing header block
import {
  PermissionGuard,
  ResourceProvider,
  RESOURCES,
} from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { PayrollUpdatesListener } from "@/components/real-time-updates";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ModernPayrollsManager } from "@/domains/payrolls/components/ModernPayrollsManager";
import { GetPayrollsPaginatedDocument } from "@/domains/payrolls/graphql/generated/graphql";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";

// Create loading component for payrolls
function PayrollsLoading() {
  const { Loading } = useDynamicLoading({
    title: "Loading Payroll Data...",
    description: "Fetching payroll information and processing status",
  });
  return <Loading variant="minimal" />;
}

interface Payroll {
  id: string;
  name: string;
  status?: string;
  employeeCount?: number;
  client?: {
    id: string;
    name: string;
    active?: boolean;
  };
  payrollCycle?: {
    id: string;
    name: string;
    description?: string;
  };
  payrollDateType?: {
    id: string;
    name: string;
    description?: string;
  };
  dateValue?: number;
  primaryConsultant?: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email?: string;
  };
  backupConsultant?: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email?: string;
  };
  assignedManager?: {
    id: string;
    firstName?: string;
    lastName?: string;
    computedName?: string;
    email?: string;
  };
  nextPayrollDate?: Array<{
    originalEftDate?: string;
    adjustedEftDate?: string;
    processingDate?: string;
  }>;
  nextEftDate?: Array<{
    originalEftDate?: string;
    adjustedEftDate?: string;
    processingDate?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  processingDaysBeforeEft?: number;
}

interface PayrollStats {
  overview: {
    totalPayrolls: number;
    activePayrolls: number;
    inactivePayrolls: number;
    processingPayrolls: number;
    upcomingPayrolls: number;
    completedThisMonth: number;
  };
  byStatus: {
    implementation: number;
    active: number;
    inactive: number;
    draft: number;
    processing: number;
    completed: number;
  };
}

function PayrollsPage() {
  const { currentUser, loading: userLoading } = useCurrentUser();

  // Data state
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [stats, setStats] = useState<PayrollStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GraphQL queries (use paginated query with PayrollTableRow fragment for EFT dates)
  const {
    data: payrollsData,
    loading: payrollsLoading,
    error: payrollsError,
    refetch,
  } = useQuery(GetPayrollsPaginatedDocument, {
    variables: { 
      limit: 100, 
      offset: 0,
      where: { supersededDate: { _isNull: true } }
    },
    errorPolicy: "all",
    pollInterval: 30000, // Poll every 30 seconds for real-time updates
  });

  // Stats query temporarily disabled due to missing generated artifact
  const statsData = undefined as unknown as any;

  // Process GraphQL data
  useEffect(() => {
    if (payrollsData?.payrolls) {
      console.log("Raw payrolls data:", payrollsData.payrolls); // Debug log
      setPayrolls(
        (payrollsData.payrolls as unknown as Partial<Payroll>[]).map(p => {
          const payroll = p as any;
          return {
            id: String(payroll.id),
            name: payroll.name,
            status: payroll.status ?? "Implementation",
            employeeCount: payroll.employeeCount ?? 0,
            client: payroll.client ? {
              id: payroll.client.id,
              name: payroll.client.name,
              active: payroll.client.active
            } : undefined,
            payrollCycle: payroll.payrollCycle ? {
              id: payroll.payrollCycle.id,
              name: payroll.payrollCycle.name,
              description: payroll.payrollCycle.description
            } : undefined,
            payrollDateType: payroll.payrollDateType ? {
              id: payroll.payrollDateType.id,
              name: payroll.payrollDateType.name,
              description: payroll.payrollDateType.description
            } : undefined,
            dateValue: payroll.dateValue,
            primaryConsultant: payroll.primaryConsultant,
            backupConsultant: payroll.backupConsultant,
            assignedManager: payroll.assignedManager,
            nextPayrollDate: payroll.nextPayrollDate ?? undefined,
            nextEftDate: payroll.nextEftDate ?? payroll.nextPayrollDate ?? undefined,
            createdAt: payroll.createdAt,
            updatedAt: payroll.updatedAt,
            processingDaysBeforeEft: payroll.processingDaysBeforeEft ?? 0,
          };
        }) as Payroll[]
      );
    }
    if (statsData) {
      // Transform stats data to expected format
      setStats({
        overview: {
          totalPayrolls: statsData.payrollStats?.totalPayrolls || 0,
          activePayrolls: statsData.payrollStats?.activePayrolls || 0,
          inactivePayrolls: statsData.payrollStats?.inactivePayrolls || 0,
          processingPayrolls: statsData.payrollStats?.processingPayrolls || 0,
          upcomingPayrolls: statsData.payrollStats?.upcomingPayrolls || 0,
          completedThisMonth: statsData.payrollStats?.completedThisMonth || 0,
        },
        byStatus: {
          implementation: statsData.payrollStats?.byStatus?.implementation || 0,
          active: statsData.payrollStats?.byStatus?.active || 0,
          inactive: statsData.payrollStats?.byStatus?.inactive || 0,
          draft: statsData.payrollStats?.byStatus?.draft || 0,
          processing: statsData.payrollStats?.byStatus?.processing || 0,
          completed: statsData.payrollStats?.byStatus?.completed || 0,
        },
      });
    }
    setLoading(payrollsLoading);
    if (payrollsError) {
      setError(payrollsError.message);
    }
  }, [payrollsData, statsData, payrollsLoading, payrollsError]);

  // Business logic handlers (preserved from original complexity)
  const handleCreatePayroll = () => {
    window.location.href = "/payrolls/new";
  };

  const handleEditPayroll = (payrollId: string) => {
    // TODO: Navigate to payroll edit page
    console.log("Edit payroll:", payrollId);
  };

  const handleViewPayroll = (payrollId: string) => {
    // TODO: Navigate to payroll details page
    console.log("View payroll:", payrollId);
  };

  const handleDeletePayroll = async (payrollId: string) => {
    try {
      // TODO: Implement payroll deletion API call
      console.log("Delete payroll:", payrollId);
      refetch();
    } catch (err) {
      setError("Failed to delete payroll");
      console.error("Error deleting payroll:", err);
    }
  };

  const handleStatusChange = async (payrollId: string, status: string) => {
    try {
      // TODO: Implement payroll status change API call
      console.log("Change payroll status:", { payrollId, status });
      refetch();
    } catch (err) {
      setError("Failed to update payroll status");
      console.error("Error updating payroll status:", err);
    }
  };

  const handleAssignConsultant = async (
    payrollId: string,
    consultantId: string,
    isPrimary: boolean
  ) => {
    try {
      // TODO: Implement consultant assignment API call
      console.log("Assign consultant:", { payrollId, consultantId, isPrimary });
      refetch();
    } catch (err) {
      setError("Failed to assign consultant");
      console.error("Error assigning consultant:", err);
    }
  };

  const handleBulkAction = async (payrollIds: string[], action: string) => {
    try {
      // TODO: Implement bulk action API call
      console.log("Bulk action:", { payrollIds, action });
      refetch();
    } catch (err) {
      setError("Failed to perform bulk action");
      console.error("Error performing bulk action:", err);
    }
  };

  const handleProcessPayroll = (payrollId: string) => {
    // TODO: Navigate to payroll processing workflow
    console.log("Process payroll:", payrollId);
  };

  const handleGenerateReports = (payrollId: string) => {
    // TODO: Navigate to payroll reports
    console.log("Generate reports for payroll:", payrollId);
  };

  const handleBulkUpload = () => {
    window.location.href = "/bulk-upload?type=payrolls";
  };

  const handleAdvancedScheduler = () => {
    window.location.href = "/payroll-schedule";
  };

  if (userLoading) {
    return (
      <ResourceProvider resource={RESOURCES.PAYROLLS}>
        <div className="container mx-auto py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </ResourceProvider>
    );
  }

  return (
    <ResourceProvider resource={RESOURCES.PAYROLLS}>
      <PermissionGuard action="read">
        <PayrollUpdatesListener />

        <div className="container mx-auto py-6 space-y-6">
          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="text-red-700 hover:bg-red-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <PageHeader
            title="Payroll Management"
            description="Mission-critical payroll processing with progressive disclosure"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Payrolls" },
            ]}
            actions={[
              { label: "Refresh", icon: RefreshCw, onClick: () => refetch() },
              { label: "Bulk Upload", icon: Upload, onClick: handleBulkUpload },
              {
                label: "Scheduler",
                icon: Calendar,
                onClick: handleAdvancedScheduler,
              },
              {
                label: "New Payroll",
                icon: Plus,
                primary: true,
                onClick: handleCreatePayroll,
              },
            ]}
            overflowActions={[
              {
                label: "Export",
                onClick: () =>
                  window.dispatchEvent(new CustomEvent("payrolls:export")),
              },
            ]}
          />

          {/* Local action removed to avoid duplication with header */}
          
          {/* Additional Actions Bar - unique actions not in header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => console.log("Process payrolls")}
              >
                <Clock className="h-4 w-4 mr-2" />
                Process Ready
              </Button>
              <Button
                variant="outline"
                onClick={() => console.log("Generate reports")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => console.log("Payroll analytics")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Modern Payrolls Manager */}
          <ModernPayrollsManager
            payrolls={payrolls as any}
            loading={loading}
            onRefetch={() => refetch()}
            showHeader={false}
            showLocalActions={false}
          />
        </div>
      </PermissionGuard>
    </ResourceProvider>
  );
}

export default PayrollsPage;

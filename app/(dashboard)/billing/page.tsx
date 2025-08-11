"use client";

/*
 * Modern Billing Management Page
 *
 * Features progressive disclosure pattern with:
 * - 4 essential columns: Description, Client, Status, Amount
 * - Expandable rows for detailed billing information and actions
 * - Smart search and contextual financial operations
 * - Mobile-first responsive design for revenue management
 */

import {
  AlertTriangle,
  Plus,
  RefreshCw,
  BarChart3,
  Settings,
  Calendar,
  CreditCard,
  TrendingUp,
  X,
} from "lucide-react";
import { Suspense, useState } from "react";
import {
  PermissionGuard,
  ResourceProvider,
  RESOURCES,
} from "@/components/auth/permission-guard";
import { PageHeader } from "@/components/patterns/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BillingAnalytics } from "@/domains/billing/components/BillingAnalytics";
import { BillingErrorBoundary } from "@/domains/billing/components/BillingErrorBoundary";
import { BillingItemsManager } from "@/domains/billing/components/BillingItemsManager";
import { PayrollIntegrationHub } from "@/domains/billing/components/PayrollIntegrationHub";
import { RecurringServicesPanel } from "@/domains/billing/components/RecurringServicesPanel";
import { useBillingData } from "@/domains/billing/hooks/useBillingData";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDynamicLoading } from "@/lib/hooks/use-dynamic-loading";

// Create loading component for billing
function BillingLoading() {
  const { Loading } = useDynamicLoading({
    title: "Loading Billing Data...",
    description: "Fetching financial information and billing items",
  });
  return <Loading variant="minimal" />;
}

// Main billing dashboard component
function BillingDashboardContent() {
  const { currentUser, loading: userLoading } = useCurrentUser();

  // Data state
  const {
    billingItems,
    recentBillingItems,
    activeClients,
    recurringServices,
    staffUsers,
    recentTimeEntries,
    payrollDatesReadyForBilling,
    metrics,
    loading,
    error,
    refetch,
  } = useBillingData({
    limit: 50,
    pollInterval: 300000, // Poll every 5 minutes for real-time updates
  });

  // UI state for dialogs
  const [showRecurringServices, setShowRecurringServices] = useState(false);
  const [showPayrollIntegration, setShowPayrollIntegration] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [error_state, setError] = useState<string | null>(null);

  // Business logic handlers (preserved from original)
  const handleGeneratePayrollBilling = async (payrollDateId: string) => {
    try {
      const response = await fetch("/api/billing/payroll/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payrollDateId }),
      });

      if (response.ok) {
        refetch();
      } else {
        throw new Error("Failed to generate billing");
      }
    } catch (error) {
      console.error("Error generating payroll billing:", error);
      setError("Failed to generate payroll billing");
    }
  };

  const handleStatusChange = (_itemId: string, _status: string) => {
    // Optimistic update will be handled by refetch
    setTimeout(refetch, 1000);
  };

  const handleBulkAction = (itemIds: string[], action: string) => {
    console.log("Bulk action:", action, "on items:", itemIds);
    // Handle bulk actions here
    setTimeout(refetch, 1000);
  };

  const handleServiceAdd = (
    clientId: string,
    serviceId: string,
    customRate?: number
  ) => {
    console.log("Service added:", { clientId, serviceId, customRate });
    setTimeout(refetch, 1000);
  };

  const handleServiceToggle = (assignmentId: string, isActive: boolean) => {
    console.log("Service toggled:", { assignmentId, isActive });
    setTimeout(refetch, 1000);
  };

  const handleCreateBillingItem = () => {
    // TODO: Navigate to billing item creation
    console.log("Create new billing item");
  };

  // Show error state if there's a critical error
  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex items-center justify-between">
            <span>Failed to load billing data: {error.message}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (userLoading) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Error Display */}
      {error_state && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>{error_state}</span>
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
        title="Billing Management"
        description="Modern billing management with progressive disclosure"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Billing" },
        ]}
        actions={[
          { label: "Refresh", icon: RefreshCw, onClick: () => refetch() },
          {
            label: "Payroll Billing",
            icon: Calendar,
            onClick: () => setShowPayrollIntegration(true),
          },
          {
            label: "Recurring Services",
            icon: CreditCard,
            onClick: () => setShowRecurringServices(true),
          },
          {
            label: "New Billing Item",
            icon: Plus,
            primary: true,
            onClick: handleCreateBillingItem,
          },
        ]}
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAnalytics(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button variant="outline" onClick={() => setShowAnalytics(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Financial Reports
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Modern Billing Items Manager */}
      <BillingItemsManager
        billingItems={billingItems}
        loading={loading}
        onRefetch={refetch}
        onStatusChange={handleStatusChange}
        onBulkAction={handleBulkAction}
      />

      {/* Recurring Services Dialog */}
      <Dialog
        open={showRecurringServices}
        onOpenChange={setShowRecurringServices}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recurring Services Management
            </DialogTitle>
            <DialogDescription>
              Manage ongoing billing services and subscription-based revenue
              streams
            </DialogDescription>
          </DialogHeader>

          <RecurringServicesPanel
            services={recurringServices}
            clients={activeClients}
            loading={loading}
            onServiceAdd={handleServiceAdd}
            onServiceToggle={handleServiceToggle}
          />
        </DialogContent>
      </Dialog>

      {/* Payroll Integration Dialog */}
      <Dialog
        open={showPayrollIntegration}
        onOpenChange={setShowPayrollIntegration}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payroll Billing Integration
            </DialogTitle>
            <DialogDescription>
              Generate billing items from completed payroll processing cycles
            </DialogDescription>
          </DialogHeader>

          <PayrollIntegrationHub
            payrollDatesReadyForBilling={payrollDatesReadyForBilling}
            completionRate={metrics.payrollCompletionRate}
            loading={loading}
            onGenerateBilling={handleGeneratePayrollBilling}
          />
        </DialogContent>
      </Dialog>

      {/* Billing Analytics Dialog */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Billing Analytics & Financial Reports
            </DialogTitle>
            <DialogDescription>
              Comprehensive financial analytics, revenue trends, and billing
              performance metrics
            </DialogDescription>
          </DialogHeader>

          <BillingAnalytics
            timeEntries={recentTimeEntries}
            billingItems={billingItems}
            staffUsers={staffUsers}
            metrics={metrics}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BillingPage() {
  return (
    <ResourceProvider resource={RESOURCES.BILLING}>
      <PermissionGuard action="read">
        <BillingErrorBoundary>
          <Suspense fallback={<BillingLoading />}>
            <BillingDashboardContent />
          </Suspense>
        </BillingErrorBoundary>
      </PermissionGuard>
    </ResourceProvider>
  );
}

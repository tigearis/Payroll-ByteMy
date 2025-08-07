"use client";

import React, { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BillingErrorBoundary, BillingSectionErrorBoundary } from "@/domains/billing/components/BillingErrorBoundary";
import { BillingHeader } from "@/domains/billing/components/BillingHeader";
import { BillingOverview } from "@/domains/billing/components/BillingOverview";
import { BillingItemsManager } from "@/domains/billing/components/BillingItemsManager";
import { RecurringServicesPanel } from "@/domains/billing/components/RecurringServicesPanel";
import { PayrollIntegrationHub } from "@/domains/billing/components/PayrollIntegrationHub";
import { BillingAnalytics } from "@/domains/billing/components/BillingAnalytics";
import { useBillingData } from "@/domains/billing/hooks/useBillingData";

// Loading fallback component
function BillingLoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Main billing dashboard component
function BillingDashboardContent() {
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
    refetch
  } = useBillingData({
    limit: 50,
    pollInterval: 300000 // Poll every 5 minutes for real-time updates
  });

  const handleGeneratePayrollBilling = async (payrollDateId: string) => {
    try {
      const response = await fetch('/api/billing/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payrollDateId }),
      });
      
      if (response.ok) {
        refetch();
      } else {
        throw new Error('Failed to generate billing');
      }
    } catch (error) {
      console.error('Error generating payroll billing:', error);
    }
  };

  const handleStatusChange = (_itemId: string, _status: string) => {
    // Optimistic update will be handled by refetch
    setTimeout(refetch, 1000);
  };

  // Show error state if there's a critical error
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load billing data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Metrics */}
      <BillingSectionErrorBoundary sectionName="Billing Header">
        <BillingHeader 
          metrics={metrics} 
          loading={loading} 
          onRefresh={refetch}
        />
      </BillingSectionErrorBoundary>

      {/* Overview Section */}
      <BillingSectionErrorBoundary sectionName="Billing Overview">
        <BillingOverview
          billingItems={billingItems}
          recentBillingItems={recentBillingItems}
          metrics={metrics}
          loading={loading}
        />
      </BillingSectionErrorBoundary>

      {/* Billing Items Management */}
      <BillingSectionErrorBoundary sectionName="Billing Items">
        <BillingItemsManager
          billingItems={billingItems}
          loading={loading}
          onRefetch={refetch}
          onStatusChange={handleStatusChange}
          onBulkAction={(itemIds, action) => {
            console.log('Bulk action:', action, 'on items:', itemIds);
            // Handle bulk actions here
            setTimeout(refetch, 1000);
          }}
        />
      </BillingSectionErrorBoundary>

      {/* Recurring Services */}
      <BillingSectionErrorBoundary sectionName="Recurring Services">
        <RecurringServicesPanel
          services={recurringServices}
          clients={activeClients}
          loading={loading}
          onServiceAdd={(clientId, serviceId, customRate) => {
            console.log('Service added:', { clientId, serviceId, customRate });
            setTimeout(refetch, 1000);
          }}
          onServiceToggle={(assignmentId, isActive) => {
            console.log('Service toggled:', { assignmentId, isActive });
            setTimeout(refetch, 1000);
          }}
        />
      </BillingSectionErrorBoundary>

      {/* Payroll Integration */}
      <BillingSectionErrorBoundary sectionName="Payroll Integration">
        <PayrollIntegrationHub
          payrollDatesReadyForBilling={payrollDatesReadyForBilling}
          completionRate={metrics.payrollCompletionRate}
          loading={loading}
          onGenerateBilling={handleGeneratePayrollBilling}
        />
      </BillingSectionErrorBoundary>

      {/* Analytics */}
      <BillingSectionErrorBoundary sectionName="Analytics">
        <BillingAnalytics
          timeEntries={recentTimeEntries}
          billingItems={billingItems}
          staffUsers={staffUsers}
          metrics={metrics}
          loading={loading}
        />
      </BillingSectionErrorBoundary>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PermissionGuard action="read">
          <BillingErrorBoundary>
            <Suspense fallback={<BillingLoadingFallback />}>
              <BillingDashboardContent />
            </Suspense>
          </BillingErrorBoundary>
        </PermissionGuard>
      </div>
    </div>
  );
}
"use client";

import { Suspense, lazy } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { PayrollUpdatesListener } from "@/components/real-time-updates";
import { Skeleton } from "@/components/ui/skeleton";

// Import error boundary
import { PayrollErrorBoundary, PayrollSectionErrorBoundary } from "@/domains/payrolls/components/PayrollErrorBoundary";

// Import the new data hook
import { usePayrollData } from "@/domains/payrolls/hooks/usePayrollData";

// Lazy load components for better performance
const PayrollHeader = lazy(() => import("@/domains/payrolls/components/PayrollHeader"));
const PayrollOverview = lazy(() => import("@/domains/payrolls/components/PayrollOverview"));
const PayrollAssignments = lazy(() => import("@/domains/payrolls/components/PayrollAssignments"));
const PayrollScheduleInfo = lazy(() => import("@/domains/payrolls/components/PayrollScheduleInfo"));

// Main loading component
function PayrollDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Skeleton className="h-4 w-32" />
          </div>
          
          <div className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className={i >= 4 ? "md:col-span-2" : ""}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Other sections skeleton */}
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Not found component
function PayrollNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-gray-400" />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payroll Not Found
          </h1>
          <p className="text-gray-600">
            The payroll you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
        
        <Button asChild>
          <Link href="/payrolls">
            ← Back to Payrolls
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Main payroll detail component
function PayrollDetailContent({ id }: { id: string }) {
  const {
    data,
    loading,
    error,
    refetch,
    needsRedirect,
  } = usePayrollData(id, {
    redirectToLatest: true,
    showErrorToast: true,
  });

  // Handle loading state
  if (loading && !data) {
    return <PayrollDetailLoading />;
  }

  // Handle error state
  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <AlertTriangle className="w-12 h-12 mx-auto text-destructive" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Payroll
            </h1>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle not found
  if (!data) {
    return <PayrollNotFound />;
  }

  // Don't render if we're redirecting
  if (needsRedirect) {
    return <PayrollDetailLoading />;
  }

  // Action handlers - these would be implemented based on your business logic
  const handleEditPayroll = () => {
    // Navigate to edit page or open edit modal
    console.log("Edit payroll:", data.payroll.id);
  };

  const handleUpdateAssignments = async (assignments: any) => {
    // Call mutation to update assignments
    console.log("Update assignments:", assignments);
  };

  const handleEditSchedule = () => {
    // Navigate to schedule edit or open modal
    console.log("Edit schedule:", data.payroll.id);
  };

  const handleRegenerateDates = async () => {
    // Call mutation to regenerate dates
    console.log("Regenerate dates:", data.payroll.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Real-time updates listener */}
      <PayrollUpdatesListener showToasts={false} />
      
      {/* Header */}
      <PayrollSectionErrorBoundary sectionName="Header">
        <Suspense fallback={<div className="h-32 bg-white border-b animate-pulse" />}>
          <PayrollHeader
            data={data}
            loading={loading}
            onEdit={handleEditPayroll}
            onDuplicate={() => console.log("Duplicate payroll")}
            onArchive={() => console.log("Archive payroll")}
            onDelete={() => console.log("Delete payroll")}
            onExport={() => console.log("Export payroll")}
          />
        </Suspense>
      </PayrollSectionErrorBoundary>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview section */}
          <PayrollSectionErrorBoundary sectionName="Overview" onRetry={() => refetch()}>
            <Suspense fallback={<div className="h-48 bg-gray-100 rounded-lg animate-pulse" />}>
              <PayrollOverview data={data} loading={loading} />
            </Suspense>
          </PayrollSectionErrorBoundary>

          {/* Team assignments section */}
          <PayrollSectionErrorBoundary sectionName="Team Assignments" onRetry={() => refetch()}>
            <Suspense fallback={<Card className="h-64"><CardContent className="p-6 animate-pulse"><div className="h-6 bg-gray-200 rounded w-48 mb-4" /><div className="h-4 bg-gray-200 rounded w-64" /></CardContent></Card>}>
              <PayrollAssignments
                data={data}
                loading={loading}
                onUpdateAssignments={handleUpdateAssignments}
              />
            </Suspense>
          </PayrollSectionErrorBoundary>

          {/* Schedule information section */}
          <PayrollSectionErrorBoundary sectionName="Schedule Information" onRetry={() => refetch()}>
            <Suspense fallback={<Card className="h-64"><CardContent className="p-6 animate-pulse"><div className="h-6 bg-gray-200 rounded w-48 mb-4" /><div className="h-4 bg-gray-200 rounded w-64" /></CardContent></Card>}>
              <PayrollScheduleInfo
                data={data}
                loading={loading}
                onEditSchedule={handleEditSchedule}
                onRegenerateDates={handleRegenerateDates}
              />
            </Suspense>
          </PayrollSectionErrorBoundary>

          {/* Future sections can be added here - documents, billing, etc. */}
          {/* These would be lazy-loaded as needed */}
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function PayrollDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return <PayrollNotFound />;
  }

  return (
    <PermissionGuard
      resource="payrolls"
      action="read"
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <AlertTriangle className="w-12 h-12 mx-auto text-amber-500" />
            <div>
              <h1 className="text-2xl font-bold text-amber-800 mb-2">
                Access Restricted
              </h1>
              <p className="text-amber-600">
                You don't have permission to view payroll details.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/payrolls">
                ← Back to Payrolls
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <PayrollErrorBoundary
        onError={(error, errorInfo) => {
          console.error("Payroll detail page error:", error);
          console.error("Error info:", errorInfo);
          
          // In production, you might want to send this to an error tracking service
          // like Sentry, LogRocket, or similar
        }}
      >
        <PayrollDetailContent id={id} />
      </PayrollErrorBoundary>
    </PermissionGuard>
  );
}